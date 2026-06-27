const STORAGE_KEY = "itemworth.inventory.v1";

export const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Appliances",
  "Tools",
  "Clothing",
  "Jewelry",
  "Sports",
  "Collectibles",
  "Vehicles",
  "Office",
  "Kitchen",
  "Other",
];

export function loadItems() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const items = JSON.parse(data);

    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createItem() {
  return {
    id: crypto.randomUUID(),
    name: "",
    category: "Other",
    location: "",
    quantity: 1,
    estimatedValue: "",
    notes: "",
    createdAt: Date.now(),
  };
}

export function calculateTotalValue(items) {
  return items.reduce((total, item) => {
    const value = Number(item.estimatedValue) || 0;
    const quantity = Number(item.quantity) || 0;

    return total + value * quantity;
  }, 0);
}
