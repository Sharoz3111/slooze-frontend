// ============ Mock API Service for Products ============

const KEY = "slooze_products";

// Default seed data (auto-added on first run)
const SEED = [
  { id: "p1", name: "Rice - 5kg", sku: "RICE-5", price: 40, qty: 120 },
  { id: "p2", name: "Wheat - 10kg", sku: "WHEAT-10", price: 75, qty: 60 },
  { id: "p3", name: "Sugar - 2kg", sku: "SUG-2", price: 30, qty: 200 }
];

// Seed data if nonexistent
function seedProducts() {
  if (!localStorage.getItem(KEY)) {
    localStorage.setItem(KEY, JSON.stringify(SEED));
  }
}

// GET /products
export async function getProducts() {
  seedProducts();
  await new Promise((res) => setTimeout(res, 200)); // simulate delay
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

// POST /products (add new)
export async function addProduct(product) {
  const list = await getProducts();

  const newProduct = {
    ...product,
    id: "p" + Math.random().toString(36).slice(2)
  };

  list.push(newProduct);
  localStorage.setItem(KEY, JSON.stringify(list));

  return newProduct;
}

// PUT /products/:id (update)
export async function updateProduct(updated) {
  const list = await getProducts();

  const newList = list.map((p) => (p.id === updated.id ? updated : p));

  localStorage.setItem(KEY, JSON.stringify(newList));

  return updated;
}
