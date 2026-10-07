const products = [
  {
    id: 1,
    name: "Snowglow Wreath",
    category: "Christmas",
    price: 68,
    originalPrice: 89,
    discount: "24% OFF",
    image:
      "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=900&q=80",
    rating: 5,
  },
  {
    id: 2,
    name: "Midnight Lantern Set",
    category: "Halloween",
    price: 54,
    originalPrice: 72,
    discount: "25% OFF",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80",
    rating: 4,
  },
  {
    id: 3,
    name: "Velvet Gift Bundle",
    category: "Gifts",
    price: 42,
    originalPrice: 58,
    discount: "28% OFF",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    rating: 5,
  },
  {
    id: 4,
    name: "Golden Star Tree Topper",
    category: "Christmas",
    price: 29,
    originalPrice: 36,
    discount: "19% OFF",
    image:
      "https://images.unsplash.com/photo-1512389142869-6d6e1cae4e59?auto=format&fit=crop&w=900&q=80",
    rating: 4,
  },
  {
    id: 5,
    name: "Candlelit Harvest Decor",
    category: "Halloween",
    price: 47,
    originalPrice: 62,
    discount: "24% OFF",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",
    rating: 5,
  },
  {
    id: 6,
    name: "Festive Table Runner",
    category: "Seasonal",
    price: 39,
    originalPrice: 49,
    discount: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
    rating: 4,
  },
  {
    id: 7,
    name: "Moonlit Porch Display",
    category: "Halloween",
    price: 63,
    originalPrice: 82,
    discount: "23% OFF",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80",
    rating: 5,
  },
  {
    id: 8,
    name: "Holiday Glow Bauble Set",
    category: "Christmas",
    price: 36,
    originalPrice: 45,
    discount: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    rating: 4,
  },
];

const cart = [];

const productGrid = document.querySelector("#product-grid");
const cartItems = document.querySelector("#cart-items");
const cartDrawer = document.querySelector(".cart-drawer");
const overlay = document.querySelector(".overlay");
const cartCount = document.querySelector(".cart-count");
const subtotalLabel = document.querySelector("#subtotal");
const shippingLabel = document.querySelector("#shipping");
const totalLabel = document.querySelector("#total");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
            <span class="badge">${product.discount}</span>
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>New</span>
            </div>
            <h3>${product.name}</h3>
            <div class="product-rating" aria-label="${product.rating} out of 5 stars">
              ${"★".repeat(product.rating)}${"☆".repeat(5 - product.rating)}
            </div>
            <div class="product-pricing">
              <span class="price">${formatPrice(product.price)}</span>
              <span class="original-price">${formatPrice(product.originalPrice)}</span>
            </div>
            <button class="card-action" data-id="${product.id}">Add to Cart</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".card-action").forEach((button) => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
  });
}

function addToCart(productId) {
  const found = cart.find((item) => item.id === productId);

  if (found) {
    found.quantity += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);

  if (index >= 0) {
    cart.splice(index, 1);
  }

  renderCart();
}

function updateQuantity(productId, change) {
  const item = cart.find((entry) => entry.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartCount.textContent = "0";
    subtotalLabel.textContent = formatPrice(0);
    shippingLabel.textContent = formatPrice(0);
    totalLabel.textContent = formatPrice(0);
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="item-details">
            <h4>${item.name}</h4>
            <div class="price-wrap">
              <span>${formatPrice(item.price)}</span>
              <span>${formatPrice(item.price * item.quantity)}</span>
            </div>
            <div class="quantity-controls" aria-label="Item quantity controls">
              <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      const action = button.dataset.action;
      updateQuantity(productId, action === "increase" ? 1 : -1);
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.id)));
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 14 : 0;
  const total = subtotal + shipping;

  cartCount.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0));
  subtotalLabel.textContent = formatPrice(subtotal);
  shippingLabel.textContent = formatPrice(shipping);
  totalLabel.textContent = formatPrice(total);
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("visible");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("visible");
}

function attachEvents() {
  document.querySelector(".cart-btn").addEventListener("click", openCart);
  document.querySelector(".close-cart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  document.querySelector("#checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target.customerName.value.trim();
    const email = event.target.customerEmail.value.trim();

    if (!name || !email) return;

    alert(`Thank you, ${name}! Your secure checkout is ready. Replace this placeholder with your payment gateway integration or payment link.`);
  });

  document.querySelector("#support-form").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thanks for reaching out! Our support team will get back to you shortly.");
    event.target.reset();
  });
}

renderProducts();
renderCart();
attachEvents();
