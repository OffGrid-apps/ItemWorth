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
    if (!data) return [];
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

/* ── Data portability ────────────────────────────────────── */

/**
 * Triggers a download of the full inventory as a dated JSON backup file.
 * The envelope format is self-describing and forward-compatible.
 */
export function exportJSON(items) {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    itemCount: items.length,
    items,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `itemworth-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Parses and validates a raw value from a JSON backup file.
 * Accepts the envelope format ({ version, items: [...] }) or a bare array.
 * Returns { valid: true, items: [...] } or { valid: false, error: string }.
 * Invalid individual items are silently skipped; the import succeeds as long
 * as at least one valid item is present.
 */
export function validateImport(parsed) {
  let candidates;

  if (Array.isArray(parsed)) {
    candidates = parsed;
  } else if (
    parsed !== null &&
    typeof parsed === "object" &&
    Array.isArray(parsed.items)
  ) {
    candidates = parsed.items;
  } else {
    return {
      valid: false,
      error: "File does not appear to be an ItemWorth backup.",
    };
  }

  if (candidates.length === 0) {
    return { valid: false, error: "The backup file contains no items." };
  }

  const validItems = [];
  for (const item of candidates) {
    if (
      item !== null &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      item.id.trim() !== "" &&
      typeof item.name === "string" &&
      item.name.trim() !== ""
    ) {
      // Normalise each item to the current shape so old backups remain
      // compatible if new fields are added in later milestones.
      validItems.push({
        id: item.id,
        name: item.name.trim(),
        category: CATEGORIES.includes(item.category) ? item.category : "Other",
        location: typeof item.location === "string" ? item.location : "",
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        estimatedValue: item.estimatedValue ?? "",
        notes: typeof item.notes === "string" ? item.notes : "",
        createdAt:
          typeof item.createdAt === "number" ? item.createdAt : Date.now(),
      });
    }
  }

  if (validItems.length === 0) {
    return { valid: false, error: "No valid items were found in the file." };
  }

  return { valid: true, items: validItems };
}

/**
 * Merges incoming items into the existing inventory.
 * Items whose ID already exists are skipped — importing the same backup
 * twice is always safe and never creates duplicates.
 * New items are prepended so they appear at the top of the list.
 */
export function mergeImport(existingItems, incomingItems) {
  const existingIds = new Set(existingItems.map((x) => x.id));
  const newItems = incomingItems.filter((x) => !existingIds.has(x.id));
  return {
    merged: [...newItems, ...existingItems],
    addedCount: newItems.length,
    skippedCount: incomingItems.length - newItems.length,
  };
}
