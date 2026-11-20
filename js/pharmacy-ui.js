/**
 * CuraRx Pharmacy - Master UI Components & Interactive Behaviors
 * Manages Header, Cart Drawer, Search Autocomplete, Quick View Modal, and Product Card rendering.
 */

(function () {
  const UI = {
    init() {
      this.bindCartDrawer();
      this.bindLiveSearch();
      this.updateHeaderBadges();
      this.listenToStoreChanges();
    },

    listenToStoreChanges() {
      if (!window.PharmacyStore) return;
      window.PharmacyStore.subscribe((event, data) => {
        if (event === "cart_changed") {
          this.updateHeaderBadges();
          this.renderCartDrawerItems();
        } else if (event === "wishlist_changed") {
          this.updateHeaderBadges();
          this.updateWishlistIcons();
        }
      });
    },

    updateHeaderBadges() {
      const store = window.PharmacyStore;
      if (!store) return;

      const cartSummary = store.getCartSummary();
      const wishlist = store.getWishlist();

      // Update cart count badges
      document.querySelectorAll(".cart-count-badge").forEach(el => {
        el.textContent = cartSummary.itemsCount;
        el.style.display = cartSummary.itemsCount > 0 ? "flex" : "none";
      });

      // Update wishlist badges
      document.querySelectorAll(".wishlist-count-badge").forEach(el => {
        el.textContent = wishlist.length;
        el.style.display = wishlist.length > 0 ? "flex" : "none";
      });
    },

    bindCartDrawer() {
      const openBtns = document.querySelectorAll(".btn-open-cart-drawer");
      const closeBtn = document.querySelector(".btn-close-drawer");
      const overlay = document.querySelector(".cart-drawer-overlay");
      const drawer = document.querySelector(".cart-drawer");

      openBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.openCartDrawer();
        });
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.closeCartDrawer());
      }

      if (overlay) {
        overlay.addEventListener("click", () => this.closeCartDrawer());
      }
    },

    openCartDrawer() {
      const overlay = document.querySelector(".cart-drawer-overlay");
      const drawer = document.querySelector(".cart-drawer");
      if (overlay && drawer) {
        this.renderCartDrawerItems();
        overlay.classList.add("active");
        drawer.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    },

    closeCartDrawer() {
      const overlay = document.querySelector(".cart-drawer-overlay");
      const drawer = document.querySelector(".cart-drawer");
      if (overlay && drawer) {
        overlay.classList.remove("active");
        drawer.classList.remove("active");
        document.body.style.overflow = "";
      }
    },

    renderCartDrawerItems() {
      const store = window.PharmacyStore;
      if (!store) return;

      const container = document.querySelector(".drawer-items");
      const footer = document.querySelector(".drawer-footer");
      const shippingBar = document.querySelector(".shipping-progress-box");
      if (!container) return;

      const cart = store.getCart();
      const summary = store.getCartSummary();

      // Render shipping progress
      if (shippingBar) {
        if (summary.itemsCount === 0) {
          shippingBar.innerHTML = `
            <div style="font-size:0.8125rem;color:var(--slate-600);">
              <i class="fa-solid fa-truck-fast text-primary"></i> 
              Add $${summary.freeShippingThreshold.toFixed(2)} to qualify for <strong>Free Express Delivery</strong>
            </div>
            <div class="shipping-progress-bar">
              <div class="shipping-progress-fill" style="width: 0%;"></div>
            </div>
          `;
        } else if (summary.isFreeShipping) {
          shippingBar.innerHTML = `
            <div style="font-size:0.8125rem;color:#065f46;font-weight:700;">
              <i class="fa-solid fa-circle-check" style="color:#10b981;"></i> 
              Congratulations! Your order qualifies for <strong>FREE Cold-Chain Delivery</strong>!
            </div>
            <div class="shipping-progress-bar">
              <div class="shipping-progress-fill" style="width: 100%; background:#10b981;"></div>
            </div>
          `;
        } else {
          shippingBar.innerHTML = `
            <div style="font-size:0.8125rem;color:var(--navy);">
              <i class="fa-solid fa-truck-medical text-primary"></i> 
              Add <strong>$${summary.amountNeededForFreeShipping.toFixed(2)}</strong> more to get <strong>Free Delivery</strong>
            </div>
            <div class="shipping-progress-bar">
              <div class="shipping-progress-fill" style="width: ${summary.freeShippingPercent}%;"></div>
            </div>
          `;
        }
      }

      if (cart.length === 0) {
        container.innerHTML = `
          <div style="text-align:center;padding:48px 16px;color:var(--slate-400);">
            <div style="width:72px;height:72px;background:var(--slate-100);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;color:var(--slate-400);">
              <i class="fa-solid fa-prescription-bottle-medical"></i>
            </div>
            <h4 style="font-size:1.1rem;color:var(--navy);margin-bottom:6px;">Your basket is empty</h4>
            <p style="font-size:0.875rem;margin-bottom:20px;">Browse our catalog or upload a prescription to get started.</p>
            <a href="shop.html" class="btn-primary" style="font-size:0.875rem;padding:10px 20px;">
              <i class="fa-solid fa-magnifying-glass"></i> Explore Medicines
            </a>
          </div>
        `;
        if (footer) footer.style.display = "none";
        return;
      }

      if (footer) footer.style.display = "block";

      let html = "";
      cart.forEach(item => {
        html += `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
            <div class="cart-item-details">
              <a href="product-detail.html?id=${item.id}" class="cart-item-name">${item.name}</a>
              ${item.prescriptionRequired ? `
                <div class="cart-item-rx-alert">
                  <i class="fa-solid fa-prescription"></i> Rx Prescription Required
                </div>
              ` : `
                <div style="font-size:0.75rem;color:var(--slate-500);margin-bottom:4px;">${item.strength || item.brand}</div>
              `}
              <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
              <div class="cart-item-actions">
                <div class="qty-control">
                  <button class="qty-btn btn-cart-dec" onclick="window.PharmacyUI.updateItemQty('${item.id}', ${item.quantity - 1})">-</button>
                  <span class="qty-number">${item.quantity}</span>
                  <button class="qty-btn btn-cart-inc" onclick="window.PharmacyUI.updateItemQty('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="btn-remove-item" onclick="window.PharmacyUI.removeItem('${item.id}')">
                  <i class="fa-regular fa-trash-can"></i> Remove
                </button>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;

      // Update summary numbers
      const subtotalEl = document.querySelector(".drawer-subtotal-val");
      const shippingEl = document.querySelector(".drawer-shipping-val");
      const totalEl = document.querySelector(".drawer-total-val");
      const rxBanner = document.querySelector(".drawer-rx-warning");

      if (subtotalEl) subtotalEl.textContent = `$${summary.subtotal.toFixed(2)}`;
      if (shippingEl) shippingEl.textContent = summary.shippingFee === 0 ? "FREE" : `$${summary.shippingFee.toFixed(2)}`;
      if (totalEl) totalEl.textContent = `$${summary.total.toFixed(2)}`;

      if (rxBanner) {
        if (summary.hasPrescriptionItems) {
          rxBanner.style.display = "block";
          rxBanner.innerHTML = `
            <div style="background:var(--rx-bg);border:1px solid var(--rx-border);padding:10px 14px;border-radius:var(--radius-md);margin-bottom:12px;font-size:0.78rem;color:var(--rx-teal);display:flex;gap:8px;align-items:flex-start;">
              <i class="fa-solid fa-shield-halved" style="font-size:16px;margin-top:2px;"></i>
              <div>
                <strong>Prescription verification required:</strong> You have ${summary.prescriptionItemsCount} Rx item(s) in your cart. You will be prompted to attach your script at checkout.
              </div>
            </div>
          `;
        } else {
          rxBanner.style.display = "none";
        }
      }
    },

    updateItemQty(productId, newQty) {
      if (window.PharmacyStore) {
        window.PharmacyStore.updateCartQuantity(productId, newQty);
        this.renderCartDrawerItems();
      }
    },

    removeItem(productId) {
      if (window.PharmacyStore) {
        window.PharmacyStore.removeFromCart(productId);
        this.renderCartDrawerItems();
      }
    },

    // --- LIVE AUTOCOMPLETE SEARCH ENGINE ---
    bindLiveSearch() {
      const searchInputs = document.querySelectorAll(".global-search-input");
      const categorySelects = document.querySelectorAll(".search-category-select");

      searchInputs.forEach(input => {
        const wrapper = input.closest(".search-wrapper");
        if (!wrapper) return;

        let dropdown = wrapper.querySelector(".search-results-dropdown");
        if (!dropdown) {
          dropdown = document.createElement("div");
          dropdown.className = "search-results-dropdown";
          wrapper.appendChild(dropdown);
        }

        const handleSearch = () => {
          const query = input.value.trim().toLowerCase();
          const categorySelect = wrapper.querySelector(".search-category-select");
          const selectedCat = categorySelect ? categorySelect.value : "all";

          if (query.length < 2) {
            dropdown.classList.remove("active");
            dropdown.innerHTML = "";
            return;
          }

          const store = window.PharmacyStore;
          if (!store) return;

          const products = store.getProducts();
          const matches = products.filter(p => {
            const matchName = p.name.toLowerCase().includes(query);
            const matchGeneric = p.genericName && p.genericName.toLowerCase().includes(query);
            const matchBrand = p.brand && p.brand.toLowerCase().includes(query);
            const matchCategory = selectedCat === "all" || p.category === selectedCat;
            return (matchName || matchGeneric || matchBrand) && matchCategory;
          }).slice(0, 6);

          if (matches.length === 0) {
            dropdown.innerHTML = `
              <div style="padding:16px;text-align:center;color:var(--slate-500);font-size:0.875rem;">
                No medicines found for "${query}". Try searching by generic ingredient or brand.
              </div>
            `;
            dropdown.classList.add("active");
            return;
          }

          let itemsHtml = `
            <div style="padding:8px 16px;background:var(--slate-50);font-size:0.75rem;font-weight:700;color:var(--slate-500);text-transform:uppercase;border-bottom:1px solid var(--slate-200);">
              Suggested Products & Medications (${matches.length})
            </div>
          `;

          matches.forEach(p => {
            itemsHtml += `
              <a href="product-detail.html?id=${p.id}" class="search-result-item">
                <img src="${p.image}" alt="${p.name}" class="search-result-thumb">
                <div class="search-result-details">
                  <div class="search-result-title">${p.name}</div>
                  <div class="search-result-meta">
                    <span>${p.genericName || p.brand}</span>
                    <span>•</span>
                    ${p.prescriptionRequired 
                      ? `<span style="color:var(--rx-teal);font-weight:700;"><i class="fa-solid fa-prescription"></i> Rx</span>`
                      : `<span style="color:#0284c7;">OTC</span>`}
                  </div>
                </div>
                <div class="search-result-price">$${p.price.toFixed(2)}</div>
              </a>
            `;
          });

          itemsHtml += `
            <div style="padding:10px 16px;background:#ffffff;text-align:center;border-top:1px solid var(--slate-100);">
              <a href="shop.html?search=${encodeURIComponent(query)}" style="font-size:0.8125rem;color:var(--primary);font-weight:700;">
                View all search results <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          `;

          dropdown.innerHTML = itemsHtml;
          dropdown.classList.add("active");
        };

        input.addEventListener("input", handleSearch);
        input.addEventListener("focus", () => {
          if (input.value.trim().length >= 2) handleSearch();
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
          if (!wrapper.contains(e.target)) {
            dropdown.classList.remove("active");
          }
        });
      });
    },

    // --- PRODUCT CARD HTML GENERATOR ---
    createProductCard(product) {
      const store = window.PharmacyStore;
      const isWishlisted = store ? store.isInWishlist(product.id) : false;

      return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
          <div class="product-media">
            <div class="product-badge-group">
              ${product.prescriptionRequired ? `
                <span class="badge-rx"><i class="fa-solid fa-prescription"></i> Rx Required</span>
              ` : `
                <span class="badge-otc">OTC Medicine</span>
              `}
              ${product.originalPrice && product.originalPrice > product.price ? `
                <span class="badge-discount">Save ${(100 - (product.price / product.originalPrice * 100)).toFixed(0)}%</span>
              ` : ''}
            </div>

            <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" 
                    title="Add to Wishlist" 
                    onclick="window.PharmacyUI.toggleWishlist('${product.id}', this)">
              <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>

            <a href="product-detail.html?id=${product.id}">
              <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            </a>
          </div>

          <div class="product-body">
            <div class="product-category-text">${product.category.replace("-", " ")}</div>
            <h3 class="product-title">
              <a href="product-detail.html?id=${product.id}">${product.name}</a>
            </h3>

            <div class="product-specs">
              <span class="spec-pill">${product.dosageForm || 'Pack'}</span>
              <span>${product.strength || product.brand}</span>
            </div>

            <div class="product-rating">
              <span class="stars">
                ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(product.rating || 5))}
              </span>
              <span class="rating-count">(${product.reviewsCount || 42})</span>
            </div>

            <div class="product-footer">
              <div class="product-price-box">
                ${product.originalPrice && product.originalPrice > product.price ? `
                  <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                ` : ''}
                <span class="current-price">$${product.price.toFixed(2)}</span>
              </div>

              <div style="display:flex;gap:6px;">
                <button class="btn-add-cart" 
                        title="Add to Basket" 
                        onclick="window.PharmacyUI.addToBasket('${product.id}')">
                  <i class="fa-solid fa-cart-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    addToBasket(productId) {
      const store = window.PharmacyStore;
      if (!store) return;
      const product = store.getProductById(productId);
      if (product) {
        store.addToCart(product, 1);
        this.openCartDrawer();
      }
    },

    toggleWishlist(productId, btnElement) {
      const store = window.PharmacyStore;
      if (!store) return;
      const added = store.toggleWishlist(productId);

      if (btnElement) {
        if (added) {
          btnElement.classList.add("active");
          btnElement.innerHTML = '<i class="fa-solid fa-heart"></i>';
        } else {
          btnElement.classList.remove("active");
          btnElement.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
      }
    },

    updateWishlistIcons() {
      const store = window.PharmacyStore;
      if (!store) return;
      const wishlist = store.getWishlist();

      document.querySelectorAll(".btn-wishlist").forEach(btn => {
        const card = btn.closest(".product-card");
        if (card) {
          const id = card.getAttribute("data-id");
          if (wishlist.includes(id)) {
            btn.classList.add("active");
            btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
          } else {
            btn.classList.remove("active");
            btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
          }
        }
      });
    }
  };

  // Attach to window
  window.PharmacyUI = UI;

  // Auto initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => UI.init());
  } else {
    UI.init();
  }
})();
