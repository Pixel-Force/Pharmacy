/**
 * CuraRx Pharmacy - Reactive Local Storage State & Business Logic Engine
 * Manages Cart, Wishlist, Prescriptions, Orders, Regulatory Settings, and Admin CMS state.
 */

(function () {
  const STORAGE_KEYS = {
    PRODUCTS: "curarx_products_v1",
    CART: "curarx_cart_v1",
    WISHLIST: "curarx_wishlist_v1",
    PRESCRIPTIONS: "curarx_prescriptions_v1",
    ORDERS: "curarx_orders_v1",
    SETTINGS: "curarx_settings_v1",
    USER: "curarx_user_v1",
    ADMIN_SESSION: "curarx_admin_session_v1"
  };

  const DEFAULT_SETTINGS = {
    jurisdiction: "US",
    pharmacyName: "CuraRx Licensed Online Pharmacy & Wellness",
    phone: "1-800-CURA-RX (287-279)",
    urgentPharmacistHotline: "1-888-PHARM-24",
    email: "dispensary@curarx-pharmacy.com",
    address: "742 Healthcare Parkway, Suite 100, Medical District",
    hours: "Mon - Sat: 8:00 AM - 9:00 PM | Sun: 9:00 AM - 6:00 PM (Pharmacist on call 24/7)",
    freeShippingThreshold: 45.00,
    standardShippingFee: 4.95,
    expressColdChainFee: 9.50,
    taxRate: 0.07, // 7%
    rxVerificationMandatory: true,
    controlledSubstancesPermitted: false,
    requirePharmacistSignature: true,
    promoActive: true,
    announcementText: "⭐ Free Expedited Cold-Chain Delivery on all orders over $45. Licensed Pharmacist on duty 24/7 for free consultations."
  };

  const DEFAULT_USER = {
    name: "Alexander Reed",
    email: "alexander.reed@healthmail.com",
    phone: "+1 (555) 382-9014",
    dob: "1988-06-14",
    gender: "Male",
    address: {
      street: "458 Magnolia Crest Ave, Apt 3B",
      city: "Metro City",
      state: "CA",
      zip: "90210",
      country: "United States"
    },
    allergies: ["Penicillin (Mild urticaria)", "Sulfa drugs"],
    chronicConditions: ["Hypertension (Controlled)", "Seasonal Allergic Rhinitis"],
    insuranceProvider: "BlueCross Health Plus",
    insurancePolicyNumber: "BC-98310-RX4"
  };

  // Seed sample prescriptions so the user immediately sees a realistic portal & verification flow
  const SEED_PRESCRIPTIONS = [
    {
      id: "RX-2026-9812",
      patientName: "Alexander Reed",
      patientDob: "1988-06-14",
      patientPhone: "+1 (555) 382-9014",
      doctorName: "Dr. Jonathan Hayes, MD",
      doctorClinic: "St. Jude Cardiovascular & Internal Medicine",
      doctorLicense: "MD-CA-449102",
      prescriptionDate: "2026-11-15",
      prescribedItems: [
        { name: "Atorvastatin Calcium 20mg", dosage: "Take 1 tablet daily at night", qty: "30 Tablets", refillsLeft: 3 },
        { name: "Lisinopril 10mg Tablets", dosage: "Take 1 tablet daily in the morning", qty: "28 Tablets", refillsLeft: 2 }
      ],
      notes: "Routine hyperlipidemia and blood pressure maintenance. Patient advised to avoid grapefruit.",
      fileName: "prescription_scan_nov2026.pdf",
      fileUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
      status: "Verified", // "Pending Review", "Verified", "Requires Clarification", "Dispensed", "Rejected"
      uploadedAt: "2026-11-15T10:30:00.000Z",
      verifiedAt: "2026-11-15T10:48:00.000Z",
      verifiedBy: "Dr. Eleanor Vance, PharmD (Lic #RPH-942817-A)",
      pharmacistNotes: "Prescription verified with Dr. Hayes' clinic. Patient's allergy profile checked (no interactions detected). Safe to dispense.",
      deliveryPreference: "Home Delivery"
    },
    {
      id: "RX-2026-9825",
      patientName: "Sophia Chen",
      patientDob: "1994-03-22",
      patientPhone: "+1 (555) 720-4491",
      doctorName: "Dr. Kimberly Foster, MD",
      doctorClinic: "Metro Allergy & Respiratory Care",
      doctorLicense: "MD-CA-388219",
      prescriptionDate: "2026-11-19",
      prescribedItems: [
        { name: "Salbutamol Inhaler (Ventolin) 100mcg", dosage: "1-2 puffs as needed for acute shortness of breath", qty: "1 Inhaler", refillsLeft: 5 }
      ],
      notes: "Mild exercise-induced bronchospasm.",
      fileName: "foster_clinic_rx_scanned.jpg",
      fileUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80",
      status: "Pending Review",
      uploadedAt: "2026-11-20T08:15:00.000Z",
      verifiedAt: null,
      verifiedBy: null,
      pharmacistNotes: null,
      deliveryPreference: "Store Pickup"
    }
  ];

  // Seed sample orders
  const SEED_ORDERS = [
    {
      id: "CRX-84920",
      createdAt: "2026-11-17T14:22:00.000Z",
      customer: {
        name: "Alexander Reed",
        email: "alexander.reed@healthmail.com",
        phone: "+1 (555) 382-9014",
        address: "458 Magnolia Crest Ave, Apt 3B, Metro City, CA 90210"
      },
      fulfillmentType: "delivery", // "delivery" or "pickup"
      prescriptionId: "RX-2026-9812",
      items: [
        {
          id: "med-rx-002",
          name: "Atorvastatin Calcium 20mg",
          price: 22.00,
          quantity: 1,
          prescriptionRequired: true,
          strength: "20 mg",
          image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80"
        },
        {
          id: "med-vit-001",
          name: "Liposomal Vitamin C 1000mg with Zinc",
          price: 24.95,
          quantity: 1,
          prescriptionRequired: false,
          strength: "1000mg Vit C / 15mg Zinc",
          image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80"
        }
      ],
      subtotal: 46.95,
      shipping: 0.00,
      tax: 3.29,
      total: 50.24,
      paymentMethod: "Credit Card (ending in 4242)",
      paymentStatus: "Paid",
      orderStatus: "Out for Delivery", 
      // Steps: "Placed" -> "Pharmacist Reviewing" -> "Prescription Approved" -> "Dispensing & Packing" -> "Out for Delivery" -> "Delivered"
      statusTimeline: [
        { status: "Placed", time: "Nov 17, 2:22 PM", note: "Order placed online with linked prescription #RX-2026-9812" },
        { status: "Pharmacist Reviewing", time: "Nov 17, 2:35 PM", note: "Prescription inspected by Dr. Eleanor Vance, PharmD" },
        { status: "Prescription Approved", time: "Nov 17, 2:48 PM", note: "Drug interaction screen completed and approved" },
        { status: "Dispensing & Packing", time: "Nov 17, 3:30 PM", note: "Dispensed in safety-sealed container with clinical patient monograph" },
        { status: "Out for Delivery", time: "Nov 18, 9:15 AM", note: "Courier en route in cold-chain monitored vehicle (Tracking #CC-90184)" }
      ],
      carrier: "MediExpress Temperature-Controlled Courier",
      trackingNumber: "CRX-84920-TRK",
      estimatedDelivery: "Today by 2:00 PM"
    }
  ];

  class PharmacyStore {
    constructor() {
      this.listeners = [];
      this.init();
    }

    init() {
      // Products initialization
      if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        const initialProducts = typeof window.PHARMACY_PRODUCTS !== "undefined" ? window.PHARMACY_PRODUCTS : [];
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      }

      // Settings initialization
      if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      }

      // User profile initialization
      if (!localStorage.getItem(STORAGE_KEYS.USER)) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      }

      // Prescriptions initialization
      if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) {
        localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(SEED_PRESCRIPTIONS));
      }

      // Orders initialization
      if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
      }

      // Cart initialization
      if (!localStorage.getItem(STORAGE_KEYS.CART)) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
      }

      // Wishlist initialization
      if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
      }
    }

    subscribe(callback) {
      this.listeners.push(callback);
      return () => {
        this.listeners = this.listeners.filter(cb => cb !== callback);
      };
    }

    notify(event, payload) {
      this.listeners.forEach(cb => {
        try {
          cb(event, payload);
        } catch (e) {
          console.error("Store listener error:", e);
        }
      });
    }

    // --- PRODUCTS ---
    getProducts() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
      } catch (e) {
        return [];
      }
    }

    getProductById(id) {
      const products = this.getProducts();
      return products.find(p => p.id === id) || null;
    }

    saveProduct(productData) {
      const products = this.getProducts();
      let updated;
      if (productData.id) {
        const index = products.findIndex(p => p.id === productData.id);
        if (index !== -1) {
          products[index] = { ...products[index], ...productData };
          updated = products[index];
        } else {
          products.unshift(productData);
          updated = productData;
        }
      } else {
        productData.id = "med-custom-" + Date.now().toString(36);
        products.unshift(productData);
        updated = productData;
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notify("products_changed", updated);
      return updated;
    }

    deleteProduct(id) {
      let products = this.getProducts();
      products = products.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notify("products_changed", { deletedId: id });
    }

    resetProductsToSeed() {
      if (typeof window.PHARMACY_PRODUCTS !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(window.PHARMACY_PRODUCTS));
        this.notify("products_changed", null);
      }
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
          category: product.category || "",
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.image,
          strength: product.strength || "",
          dosageForm: product.dosageForm || "",
          prescriptionRequired: !!product.prescriptionRequired,
          quantity: quantity
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
      let cart = this.getCart();
      cart = cart.filter(item => item.id !== productId);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      this.notify("cart_changed", cart);
      this.showToast("Item removed from cart", "info");
      return cart;
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
      const hasPrescriptionItems = cart.some(item => item.prescriptionRequired);
      const prescriptionItemsCount = cart.filter(item => item.prescriptionRequired).length;

      const freeShippingThreshold = settings.freeShippingThreshold || 45.00;
      const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
      const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
      const shippingFee = (subtotal === 0 || isFreeShipping) ? 0.00 : (settings.standardShippingFee || 4.95);
      const tax = subtotal * (settings.taxRate || 0.07);
      const total = subtotal + shippingFee + tax;

      return {
        itemsCount,
        subtotal: parseFloat(subtotal.toFixed(2)),
        shippingFee: parseFloat(shippingFee.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        hasPrescriptionItems,
        prescriptionItemsCount,
        isFreeShipping,
        freeShippingThreshold,
        amountNeededForFreeShipping: parseFloat(amountNeededForFreeShipping.toFixed(2)),
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

    // --- PRESCRIPTIONS ---
    getPrescriptions() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) || [];
      } catch (e) {
        return [];
      }
    }

    getPrescriptionById(id) {
      return this.getPrescriptions().find(rx => rx.id === id) || null;
    }

    savePrescription(prescriptionData) {
      const prescriptions = this.getPrescriptions();
      const newId = "RX-2026-" + Math.floor(1000 + Math.random() * 9000);
      const record = {
        id: newId,
        patientName: prescriptionData.patientName || "Alexander Reed",
        patientDob: prescriptionData.patientDob || "1988-06-14",
        patientPhone: prescriptionData.patientPhone || "+1 (555) 382-9014",
        doctorName: prescriptionData.doctorName || "Licensed Prescriber",
        doctorClinic: prescriptionData.doctorClinic || "Community Medical Center",
        doctorLicense: prescriptionData.doctorLicense || "MD-PENDING",
        prescriptionDate: prescriptionData.prescriptionDate || new Date().toISOString().split("T")[0],
        prescribedItems: prescriptionData.prescribedItems || [],
        notes: prescriptionData.notes || "",
        fileName: prescriptionData.fileName || "prescription_upload.pdf",
        fileUrl: prescriptionData.fileUrl || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
        status: "Pending Review",
        uploadedAt: new Date().toISOString(),
        verifiedAt: null,
        verifiedBy: null,
        pharmacistNotes: null,
        deliveryPreference: prescriptionData.deliveryPreference || "Home Delivery",
        allergies: prescriptionData.allergies || "",
        requiresCallback: !!prescriptionData.requiresCallback
      };

      prescriptions.unshift(record);
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
      this.notify("prescriptions_changed", record);
      return record;
    }

    verifyPrescription(id, decision, pharmacistName, pharmacistNotes, licenseNumber) {
      const prescriptions = this.getPrescriptions();
      const index = prescriptions.findIndex(p => p.id === id);
      if (index === -1) return null;

      const rx = prescriptions[index];
      rx.status = decision; // "Verified", "Requires Clarification", "Rejected"
      rx.verifiedAt = new Date().toISOString();
      rx.verifiedBy = `${pharmacistName} (Lic #${licenseNumber || "RPH-942817-A"})`;
      rx.pharmacistNotes = pharmacistNotes || "Prescription verified against state pharmaceutical registry. Clinical safety checks passed.";

      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
      this.notify("prescriptions_changed", rx);
      return rx;
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
      return this.getOrders().find(o => o.id === id) || null;
    }

    createOrder(orderData) {
      const orders = this.getOrders();
      const orderId = "CRX-" + Math.floor(10000 + Math.random() * 90000);
      const now = new Date();

      const newOrder = {
        id: orderId,
        createdAt: now.toISOString(),
        customer: orderData.customer,
        fulfillmentType: orderData.fulfillmentType || "delivery", // "delivery" or "pickup"
        pickupLocation: orderData.pickupLocation || "Downtown Health Center Pharmacy",
        pickupTimeSlot: orderData.pickupTimeSlot || "Today (3:00 PM - 6:00 PM)",
        prescriptionId: orderData.prescriptionId || null,
        items: orderData.items || this.getCart(),
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod || "Credit Card",
        paymentStatus: orderData.paymentMethod === "Cash on Delivery / Pickup" ? "Pending at Fulfillment" : "Paid",
        orderStatus: orderData.hasPrescriptionItems ? "Pharmacist Reviewing" : "Processing",
        statusTimeline: [
          {
            status: "Placed",
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + now.toLocaleDateString(),
            note: orderData.hasPrescriptionItems ? "Order placed online with prescription attachment." : "Order placed online."
          }
        ],
        carrier: orderData.fulfillmentType === "delivery" ? "MediExpress Cold-Chain Courier" : "Store Counter Pickup",
        trackingNumber: orderId + "-TRK",
        estimatedDelivery: orderData.fulfillmentType === "delivery" ? "Tomorrow by 1:00 PM" : "Ready in 2 Hours"
      };

      if (orderData.hasPrescriptionItems) {
        newOrder.statusTimeline.push({
          status: "Pharmacist Reviewing",
          time: "Immediate Queue",
          note: "Assigned to licensed pharmacist queue for safety interaction verification."
        });
      }

      orders.unshift(newOrder);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

      // Clear cart upon order creation
      this.clearCart();
      this.notify("orders_changed", newOrder);
      return newOrder;
    }

    updateOrderStatus(orderId, newStatus, pharmacistNote = "") {
      const orders = this.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order) return null;

      const now = new Date();
      order.orderStatus = newStatus;
      order.statusTimeline.push({
        status: newStatus,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + now.toLocaleDateString(),
        note: pharmacistNote || `Status updated to ${newStatus}.`
      });

      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notify("orders_changed", order);
      return order;
    }

    // --- SETTINGS & REGULATORY ---
    getSettings() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }

    saveSettings(newSettings) {
      const current = this.getSettings();
      const merged = { ...current, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      this.notify("settings_changed", merged);
      this.showToast("Pharmacy settings successfully saved", "success");
      return merged;
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
      const current = this.getUser();
      const merged = { ...current, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
      this.notify("user_changed", merged);
      this.showToast("Profile details updated successfully", "success");
      return merged;
    }

    // --- TOAST NOTIFICATION SYSTEM ---
    showToast(message, type = "info") {
      let container = document.getElementById("curarx-toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "curarx-toast-container";
        container.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:380px;width:calc(100% - 48px);";
        document.body.appendChild(container);
      }

      const toast = document.createElement("div");
      toast.style.cssText = `
        pointer-events:auto;
        padding:12px 18px;
        border-radius:10px;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        font-size:14px;
        font-weight:500;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        display:flex;
        align-items:center;
        gap:12px;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        transform: translateY(20px);
        opacity:0;
      `;

      let iconClass = "fa-circle-info";
      let bg = "#0f172a";
      let text = "#ffffff";
      let border = "1px solid rgba(255,255,255,0.1)";

      if (type === "success") {
        bg = "#065f46"; // deep emerald
        iconClass = "fa-circle-check";
        border = "1px solid #10b981";
      } else if (type === "warning") {
        bg = "#854d0e"; // amber
        iconClass = "fa-triangle-exclamation";
        border = "1px solid #f59e0b";
      } else if (type === "danger" || type === "error") {
        bg = "#991b1b"; // red
        iconClass = "fa-circle-xmark";
        border = "1px solid #ef4444";
      } else if (type === "rx") {
        bg = "#115e59"; // deep teal
        iconClass = "fa-prescription";
        border = "1px solid #14b8a6";
      }

      toast.style.backgroundColor = bg;
      toast.style.color = text;
      toast.style.border = border;

      toast.innerHTML = `
        <i class="fa-solid ${iconClass}" style="font-size:16px;flex-shrink:0;"></i>
        <span style="flex:1;line-height:1.4;">${message}</span>
        <button style="background:transparent;border:none;color:rgba(255,255,255,0.7);cursor:pointer;padding:2px;font-size:14px;" onclick="this.parentElement.remove()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;

      container.appendChild(toast);

      // Trigger animation
      requestAnimationFrame(() => {
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
      });

      // Auto dismiss after 3.8s
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(() => toast.remove(), 300);
      }, 3800);
    }
  }

  // Export singleton to global window
  window.PharmacyStore = new PharmacyStore();
})();
