/**
 * CuraRx Pharmacy Pakistan - Reactive Local Storage State & Business Logic Engine
 * Manages Cart, Wishlist, Orders, Pakistani Delivery Cities, and Store Settings.
 * No prescription upload gating - seamless ordering across Pakistan with COD, JazzCash & Easypaisa.
 */

(function () {
  const STORAGE_KEYS = {
    PRODUCTS: "curarx_products_pk_v3",
    CART: "curarx_cart_pk_v3",
    WISHLIST: "curarx_wishlist_pk_v3",
    ORDERS: "curarx_orders_pk_v3",
    SETTINGS: "curarx_settings_pk_v3",
    USER: "curarx_user_pk_v3",
    ADMIN_SESSION: "curarx_admin_session_pk_v3"
  };

  const DEFAULT_SETTINGS = {
    jurisdiction: "PK",
    currencySymbol: "Rs.",
    pharmacyName: "CuraRx Pharmacy Pakistan",
    phone: "021-111-287-279",
    whatsapp: "+92 300 1234567",
    urgentPharmacistHotline: "0300-1234567",
    email: "care@curarx.pk",
    address: "Main Shahrah-e-Faisal, Block 6, PECHS, Karachi (Serving Nationwide)",
    hours: "Open 24/7 &bull; Same-Day Express Delivery in Karachi, Lahore & Islamabad",
    freeShippingThreshold: 1500, // Rs. 1,500
    standardShippingFee: 150,     // Rs. 150
    expressColdChainFee: 250,     // Rs. 250
    taxRate: 0.00,
    rxVerificationMandatory: false, // Upload script NOT required
    promoActive: true,
    announcementText: "🚚 Free Express Cold-Chain Delivery across Pakistan on orders over Rs. 1,500 | 💬 WhatsApp: +92 300 1234567"
  };

  const DEFAULT_USER = {
    name: "Muhammad Ali Khan",
    email: "ali.khan@gmail.com",
    phone: "0300-8241920",
    city: "Karachi",
    province: "Sindh",
    address: {
      street: "House 42, Street 14, Khayaban-e-Bukhari, Phase 6, DHA",
      city: "Karachi",
      province: "Sindh",
      postalCode: "75500",
      country: "Pakistan"
    },
    allergies: ["None recorded"],
    chronicConditions: ["Hypertension (Controlled)", "Seasonal Allergies"]
  };

  const PAKISTANI_CITIES = [
    { name: "Karachi", province: "Sindh", deliveryTime: "Same Day (2-4 Hours)", expressAvailable: true },
    { name: "Lahore", province: "Punjab", deliveryTime: "Same Day / Next Morning", expressAvailable: true },
    { name: "Islamabad", province: "Federal", deliveryTime: "Same Day / Next Morning", expressAvailable: true },
    { name: "Rawalpindi", province: "Punjab", deliveryTime: "Same Day / Next Morning", expressAvailable: true },
    { name: "Faisalabad", province: "Punjab", deliveryTime: "24-48 Hours", expressAvailable: false },
    { name: "Multan", province: "Punjab", deliveryTime: "24-48 Hours", expressAvailable: false },
    { name: "Peshawar", province: "KPK", deliveryTime: "24-48 Hours", expressAvailable: false },
    { name: "Quetta", province: "Balochistan", deliveryTime: "48-72 Hours", expressAvailable: false },
    { name: "Sialkot", province: "Punjab", deliveryTime: "24-48 Hours", expressAvailable: false },
    { name: "Gujranwala", province: "Punjab", deliveryTime: "24-48 Hours", expressAvailable: false },
    { name: "Hyderabad", province: "Sindh", deliveryTime: "24-48 Hours", expressAvailable: false },
    { name: "Abbottabad", province: "KPK", deliveryTime: "24-48 Hours", expressAvailable: false },
    { name: "Bahawalpur", province: "Punjab", deliveryTime: "24-48 Hours", expressAvailable: false },
    { name: "Sargodha", province: "Punjab", deliveryTime: "24-48 Hours", expressAvailable: false },
    { name: "Sukkur", province: "Sindh", deliveryTime: "24-48 Hours", expressAvailable: false }
  ];

  // Seed sample Pakistani orders
  const SEED_ORDERS = [
    {
      id: "PK-CRX-9104",
      createdAt: "2026-11-20T14:15:00.000Z",
      customer: {
        name: "Muhammad Ali Khan",
        email: "ali.khan@gmail.com",
        phone: "0300-8241920",
        address: "House 42, Street 14, Khayaban-e-Bukhari, Phase 6, DHA, Karachi",
        city: "Karachi"
      },
      fulfillmentType: "delivery",
      items: [
        {
          id: "med-pk-001",
          name: "Panadol Extra 500mg/65mg",
          price: 380,
          quantity: 2,
          strength: "500 mg / 65 mg",
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80"
        },
        {
          id: "med-pk-018",
          name: "Surbex Z Tablets",
          price: 495,
          quantity: 1,
          strength: "Therapeutic Zinc & Multivitamin",
          image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80"
        },
        {
          id: "med-pk-019",
          name: "CaC-1000 Plus Effervescent Tablets",
          price: 480,
          quantity: 1,
          strength: "Calcium + Vit C",
          image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&auto=format&fit=crop&q=80"
        }
      ],
      subtotal: 1735,
      shipping: 0, // Free delivery because > 1500
      tax: 0,
      total: 1735,
      paymentMethod: "Cash on Delivery (COD)",
      paymentStatus: "Pending COD Collection",
      orderStatus: "Out for Delivery",
      statusTimeline: [
        { status: "Order Placed", time: "Today 2:15 PM", note: "Order placed online with Cash on Delivery" },
        { status: "Confirmed by Pharmacy", time: "Today 2:20 PM", note: "Verified genuine batch numbers by Dr. Tariq, PharmD" },
        { status: "Cold-Chain Packed", time: "Today 2:40 PM", note: "Packed in sealed tamper-evident bag at Karachi central hub" },
        { status: "Rider Dispatched", time: "Today 3:05 PM", note: "Express rider Kamran Khan en route to DHA Phase 6" }
      ],
      carrier: "CuraRx Express City Rider",
      trackingNumber: "KHI-EXP-8819",
      estimatedDelivery: "Today within 45 minutes"
    }
  ];

  class PharmacyStore {
    constructor() {
      this.listeners = {};
      this._initStore();
    }

    _initStore() {
      // Initialize or reset products to our new Pakistani catalog
      const existing = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!existing || !existing.includes("med-pk-")) {
        if (typeof window.PHARMACY_PRODUCTS !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(window.PHARMACY_PRODUCTS));
        }
      }

      if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      }

      if (!localStorage.getItem(STORAGE_KEYS.USER)) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      }

      if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
      }

      if (!localStorage.getItem(STORAGE_KEYS.CART)) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
      }

      if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
      }
    }

    formatMoney(amount) {
      const num = Math.round(Number(amount) || 0);
      return `Rs. ${num.toLocaleString()}`;
    }

    getCities() {
      return PAKISTANI_CITIES;
    }

    // --- PRODUCTS ---
    getProducts() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (data) return JSON.parse(data);
      } catch (e) {
        console.error("Error reading products:", e);
      }
      return typeof window.PHARMACY_PRODUCTS !== "undefined" ? window.PHARMACY_PRODUCTS : [];
    }

    getProductById(id) {
      const products = this.getProducts();
      return products.find(p => p.id === id) || null;
    }

    // --- CART ---
    getCart() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
      } catch (e) {
        return [];
      }
    }

    addToCart(product, quantity = 1) {
      let cart = this.getCart();
      const existingIndex = cart.findIndex(item => item.id === product.id);

      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          genericName: product.genericName || "",
          brand: product.brand || "",
          dosageForm: product.dosageForm || "",
          strength: product.strength || "",
          price: product.price,
          quantity: quantity,
          prescriptionRequired: false,
          image: product.image
        });
      }

      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      this.notify("cart_changed", cart);
      this.showToast(`Added "${product.name}" to your basket`, "success");
      return cart;
    }

    updateCartQuantity(productId, quantity) {
      let cart = this.getCart();
      if (quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
      } else {
        const item = cart.find(i => i.id === productId);
        if (item) item.quantity = quantity;
      }
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      this.notify("cart_changed", cart);
      return cart;
    }

    removeFromCart(productId) {
      return this.updateCartQuantity(productId, 0);
    }

    clearCart() {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
      this.notify("cart_changed", []);
    }

    getCartSummary() {
      const cart = this.getCart();
      const settings = this.getSettings();

      const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
      const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      const freeShippingThreshold = settings.freeShippingThreshold || 1500;
      const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
      const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
      const shippingFee = (subtotal === 0 || isFreeShipping) ? 0 : (settings.standardShippingFee || 150);
      const total = subtotal + shippingFee;

      return {
        itemsCount,
        subtotal,
        shippingFee,
        tax: 0,
        total,
        hasPrescriptionItems: false,
        prescriptionItemsCount: 0,
        isFreeShipping,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        freeShippingPercent: Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
      };
    }

    // --- WISHLIST ---
    getWishlist() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
      } catch (e) {
        return [];
      }
    }

    isInWishlist(productId) {
      return this.getWishlist().includes(productId);
    }

    toggleWishlist(productId) {
      let wishlist = this.getWishlist();
      let added = false;
      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        this.showToast("Removed from wishlist", "info");
      } else {
        wishlist.push(productId);
        added = true;
        this.showToast("Added to your wishlist", "success");
      }
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
      this.notify("wishlist_changed", { wishlist, productId, added });
      return added;
    }

    // --- ORDERS ---
    getOrders() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
      } catch (e) {
        return [];
      }
    }

    getOrderById(id) {
      const orders = this.getOrders();
      return orders.find(o => o.id === id) || null;
    }

    createOrder(orderData) {
      const orders = this.getOrders();
      const newId = "PK-CRX-" + Math.floor(10000 + Math.random() * 90000);
      const newOrder = {
        id: newId,
        createdAt: new Date().toISOString(),
        customer: orderData.customer,
        fulfillmentType: orderData.fulfillmentType || "delivery",
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping || 0,
        tax: 0,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod || "Cash on Delivery (COD)",
        paymentStatus: orderData.paymentMethod.includes("COD") ? "Pending COD Collection" : "Paid",
        orderStatus: "Order Placed",
        statusTimeline: [
          { status: "Order Placed", time: "Just now", note: `Order placed via ${orderData.paymentMethod}` },
          { status: "Pharmacy Processing", time: "In progress", note: "Dispensing genuine medicines at city central hub" }
        ],
        carrier: "CuraRx Express City Delivery",
        trackingNumber: `${orderData.customer.city ? orderData.customer.city.substring(0,3).toUpperCase() : 'PK'}-EXP-${Math.floor(1000 + Math.random() * 9000)}`,
        estimatedDelivery: orderData.customer.city === "Karachi" || orderData.customer.city === "Lahore" || orderData.customer.city === "Islamabad" 
          ? "Today within 2-4 hours" 
          : "Tomorrow via Express Courier"
      };

      orders.unshift(newOrder);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.clearCart();
      this.notify("orders_changed", newOrder);
      return newOrder;
    }

    // --- SETTINGS ---
    getSettings() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }

    // --- USER PROFILE ---
    getUser() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || DEFAULT_USER;
      } catch (e) {
        return DEFAULT_USER;
      }
    }

    saveUser(userData) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      this.notify("user_changed", userData);
    }

    // --- EVENT BUS ---
    on(event, callback) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(callback);
    }

    notify(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb(data));
      }
    }

    // --- TOAST NOTIFICATIONS ---
    showToast(message, type = "info") {
      let toastContainer = document.getElementById("pharmacy-toast-container");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "pharmacy-toast-container";
        toastContainer.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement("div");
      toast.className = `pharmacy-toast toast-${type}`;
      toast.style.cssText = `
        background: #0f172a;
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        font-size: 0.875rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 280px;
        max-width: 380px;
        border-left: 4px solid ${type === "success" ? "#10b981" : type === "danger" ? "#ef4444" : "#0d9488"};
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
      `;

      const iconClass = type === "success" ? "fa-circle-check text-success" : type === "danger" ? "fa-circle-exclamation text-danger" : "fa-circle-info text-primary";
      toast.innerHTML = `
        <i class="fa-solid ${iconClass}" style="font-size:16px;flex-shrink:0;"></i>
        <span style="flex:1;line-height:1.4;">${message}</span>
      `;

      toastContainer.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
      });

      setTimeout(() => {
        toast.style.transform = "translateY(10px)";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  }

  // Export globally
  window.PharmacyStore = new PharmacyStore();
})();
