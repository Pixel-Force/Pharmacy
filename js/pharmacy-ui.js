/**
 * CuraRx Pharmacy Pakistan - Master UI Components & Interactive Behaviors
 * Localized for Pakistani Customers: PKR currency, Cash on Delivery, WhatsApp Ordering,
 * and zero prescription upload gating.
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
      window.PharmacyStore.on("cart_changed", () => {
        this.updateHeaderBadges();
        this.renderCartDrawerItems();
      });
      window.PharmacyStore.on("wishlist_changed", () => {
        this.updateHeaderBadges();
        this.updateWishlistIcons();
      });
    },

    updateHeaderBadges() {
      const store = window.PharmacyStore;
      if (!store) return;

      const cartSummary = store.getCartSummary();
      const wishlist = store.getWishlist();

      document.querySelectorAll(".cart-count-badge").forEach(el => {
        el.textContent = cartSummary.itemsCount;
        el.style.display = cartSummary.itemsCount > 0 ? "flex" : "none";
      });

      document.querySelectorAll(".wishlist-count-badge").forEach(el => {
        el.textContent = wishlist.length;
        el.style.display = wishlist.length > 0 ? "flex" : "none";
      });
    },

    bindCartDrawer() {
      const openBtns = document.querySelectorAll(".btn-open-cart-drawer");
      const closeBtn = document.querySelector(".btn-close-drawer");
      const overlay = document.querySelector(".cart-drawer-overlay");

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
      const drawer = document.querySelector(".cart-drawer");
      const overlay = document.querySelector(".cart-drawer-overlay");
      if (drawer && overlay) {
        this.renderCartDrawerItems();
        drawer.classList.add("open");
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    },

    closeCartDrawer() {
      const drawer = document.querySelector(".cart-drawer");
      const overlay = document.querySelector(".cart-drawer-overlay");
      if (drawer && overlay) {
        drawer.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    },

    renderCartDrawerItems() {
      const store = window.PharmacyStore;
      if (!store) return;

      const cart = store.getCart();
      const container = document.querySelector(".drawer-items");
      const footer = document.querySelector(".drawer-footer");
      const shippingBar = document.querySelector(".shipping-progress-box");
      if (!container) return;

      const summary = store.getCartSummary();

      // Render shipping progress
      if (shippingBar) {
        if (summary.itemsCount === 0) {
          shippingBar.innerHTML = `
            <div style="font-size:0.8125rem;color:var(--slate-600);margin-bottom:6px;">
              <i class="fa-solid fa-truck-fast text-primary"></i> 
              Add ${store.formatMoney(summary.freeShippingThreshold)} to qualify for <strong>Free Delivery in Pakistan</strong>
            </div>
            <div class="shipping-progress-bar">
              <div class="shipping-progress-fill" style="width: 0%;"></div>
            </div>
          `;
        } else if (summary.isFreeShipping) {
          shippingBar.innerHTML = `
            <div style="font-size:0.8125rem;color:#065f46;font-weight:700;margin-bottom:6px;">
              <i class="fa-solid fa-circle-check" style="color:#10b981;"></i> 
              Mubarak! Your order qualifies for <strong>FREE Delivery</strong> across Pakistan!
            </div>
            <div class="shipping-progress-bar">
              <div class="shipping-progress-fill" style="width: 100%; background:#10b981;"></div>
            </div>
          `;
        } else {
          shippingBar.innerHTML = `
            <div style="font-size:0.8125rem;color:var(--navy);margin-bottom:6px;">
              <i class="fa-solid fa-truck-fast text-primary"></i> 
              Add <strong>${store.formatMoney(summary.amountNeededForFreeShipping)}</strong> more for <strong>Free Express Delivery</strong>
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
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
            <h4 style="font-size:1.1rem;color:var(--navy);margin-bottom:6px;">Your basket is empty</h4>
            <p style="font-size:0.875rem;margin-bottom:20px;">Browse Pakistan's genuine DRAP-approved medicines or order via WhatsApp.</p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <a href="shop.html" class="btn-primary" style="font-size:0.875rem;padding:10px 20px;">
                <i class="fa-solid fa-pills"></i> Shop Medicines
              </a>
              <a href="https://wa.me/923001234567?text=Hi%20CuraRx,%20I%20want%20to%20order%20medicines" target="_blank" class="btn-whatsapp-drawer" style="background:#25d366;color:#ffffff;padding:10px 18px;border-radius:9999px;font-weight:700;font-size:0.875rem;display:inline-flex;align-items:center;gap:6px;">
                <i class="fa-brands fa-whatsapp"></i> Order on WhatsApp
              </a>
            </div>
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
              <div style="font-size:0.75rem;color:var(--slate-500);margin-bottom:4px;">${item.strength || item.brand}</div>
              <div class="cart-item-price">${store.formatMoney(item.price * item.quantity)}</div>
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
      const totalEl = document.querySelector(".drawer-total-val");

      if (subtotalEl) subtotalEl.textContent = store.formatMoney(summary.subtotal);
      if (totalEl) totalEl.textContent = store.formatMoney(summary.total);
    },

    updateItemQty(productId, newQty) {
      const store = window.PharmacyStore;
      if (store) store.updateCartQuantity(productId, newQty);
    },

    removeItem(productId) {
      const store = window.PharmacyStore;
      if (store) store.removeFromCart(productId);
    },

    bindLiveSearch() {
      const searchInputs = document.querySelectorAll(".global-search-input");
      searchInputs.forEach(input => {
        const wrapper = input.closest(".search-wrapper");
        if (!wrapper) return;

        let dropdown = wrapper.querySelector(".search-autocomplete-dropdown");
        if (!dropdown) {
          dropdown = document.createElement("div");
          dropdown.className = "search-autocomplete-dropdown";
          dropdown.style.cssText = `
            position: absolute;
            top: calc(100% + 6px);
            left: 0;
            right: 0;
            background: #ffffff;
            border: 1px solid var(--slate-200);
            border-radius: var(--radius-xl);
            box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.16);
            max-height: 420px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
          `;
          wrapper.style.position = "relative";
          wrapper.appendChild(dropdown);
        }

        input.addEventListener("input", (e) => {
          const query = e.target.value.trim().toLowerCase();
          if (query.length < 2) {
            dropdown.style.display = "none";
            return;
          }
          this.renderSearchResults(query, dropdown);
        });

        document.addEventListener("click", (e) => {
          if (!wrapper.contains(e.target)) {
            dropdown.style.display = "none";
          }
        });

        input.addEventListener("focus", () => {
          if (input.value.trim().length >= 2) {
            this.renderSearchResults(input.value.trim().toLowerCase(), dropdown);
          }
        });
      });
    },

    renderSearchResults(query, dropdown) {
      const store = window.PharmacyStore;
      if (!store) return;

      const products = store.getProducts();
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.genericName && p.genericName.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query))
      ).slice(0, 6);

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 20px; text-align: center; color: var(--slate-500); font-size: 0.875rem;">
            No medicines found matching "<strong>${query}</strong>".<br>
            <a href="https://wa.me/923001234567?text=Hi%20CuraRx,%20I%20am%20looking%20for%20${encodeURIComponent(query)}" target="_blank" style="color:#059669;font-weight:700;display:inline-block;margin-top:8px;">
              <i class="fa-brands fa-whatsapp"></i> Ask Pharmacist on WhatsApp
            </a>
          </div>
        `;
        dropdown.style.display = "block";
        return;
      }

      let html = `<div style="padding: 10px 14px; font-size: 0.75rem; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--slate-100);">Matching Genuine Medicines in Pakistan</div>`;
      matches.forEach(m => {
        html += `
          <a href="product-detail.html?id=${m.id}" style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-bottom: 1px solid var(--slate-100); text-decoration: none; color: inherit; transition: background 0.15s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
            <img src="${m.image}" alt="${m.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 8px; border: 1px solid var(--slate-200); flex-shrink: 0;">
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.875rem; font-weight: 700; color: var(--navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.name}</div>
              <div style="font-size: 0.75rem; color: var(--slate-500);">${m.brand} &bull; ${m.dosageForm || 'Pack'}</div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
              <div style="font-size: 0.875rem; font-weight: 800; color: #0d9488;">${store.formatMoney(m.price)}</div>
              <span style="font-size: 0.68rem; color: #059669; font-weight: 700;">In Stock</span>
            </div>
          </a>
        `;
      });

      html += `
        <div style="padding: 10px 14px; text-align: center; background: var(--slate-50); border-bottom-left-radius: var(--radius-xl); border-bottom-right-radius: var(--radius-xl);">
          <a href="shop.html?search=${encodeURIComponent(query)}" style="font-size: 0.8125rem; font-weight: 700; color: var(--primary); text-decoration: none;">
            View all results for "${query}" &rarr;
          </a>
        </div>
      `;

      dropdown.innerHTML = html;
      dropdown.style.display = "block";
    },

    createProductCard(product) {
      const store = window.PharmacyStore;
      const isWishlisted = store ? store.isInWishlist(product.id) : false;
      const priceFormatted = store ? store.formatMoney(product.price) : `Rs. ${product.price}`;
      const originalPriceFormatted = product.originalPrice && store ? store.formatMoney(product.originalPrice) : '';

      return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
          <div class="product-media">
            <div class="product-badge-group">
              <span class="badge-otc" style="background:#ccfbf1;color:#0f766e;border:1px solid #99f6e4;">
                <i class="fa-solid fa-shield-halved"></i> 100% Genuine
              </span>
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
                  <span class="original-price">${originalPriceFormatted}</span>
                ` : ''}
                <span class="current-price" style="color:#0f766e;font-size:1.15rem;font-weight:800;">${priceFormatted}</span>
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
        btnElement.classList.toggle("active", added);
        const icon = btnElement.querySelector("i");
        if (icon) {
          icon.className = added ? "fa-solid fa-heart" : "fa-regular fa-heart";
        }
      }
    },

    updateWishlistIcons() {
      const store = window.PharmacyStore;
      if (!store) return;
      document.querySelectorAll(".btn-wishlist").forEach(btn => {
        const card = btn.closest(".product-card");
        if (card) {
          const id = card.getAttribute("data-id");
          const isWish = store.isInWishlist(id);
          btn.classList.toggle("active", isWish);
          const icon = btn.querySelector("i");
          if (icon) icon.className = isWish ? "fa-solid fa-heart" : "fa-regular fa-heart";
        }
      });
    }
  };

  window.PharmacyUI = UI;
  document.addEventListener("DOMContentLoaded", () => UI.init());
})();
