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
    serialNumber: "",
    purchaseDate: "",
    condition: "",
    photo: "",
    tags: [],
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
        // 3B fields — default to "" so pre-3B backups import cleanly
        serialNumber: typeof item.serialNumber === "string" ? item.serialNumber : "",
        purchaseDate: typeof item.purchaseDate === "string" ? item.purchaseDate : "",
        condition:    typeof item.condition === "string" ? item.condition : "",
        photo:        typeof item.photo === "string" ? item.photo : "",
        // 3C fields — default to [] so pre-3C backups import cleanly
        tags: Array.isArray(item.tags)
          ? item.tags.filter((t) => typeof t === "string" && t.trim() !== "")
          : [],
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

/* ── Photo compression ───────────────────────────────────── */

// Target: ≤ 200 KB as a base64 data URL (~150 000 chars).
// Strategy: draw onto a Canvas at max 800 × 800 px, export as JPEG.
// If Canvas is unavailable, reject files over the size limit.
const PHOTO_MAX_CHARS = 150_000;
const PHOTO_MAX_DIM   = 800;
const PHOTO_QUALITY   = 0.75;

/**
 * Compresses an image File to a base64 JPEG data URL small enough for
 * localStorage. Resolves with the data URL string, or rejects with an
 * Error describing why the file could not be used.
 */
export function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file (JPEG, PNG, WebP, etc.)."));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error("The image could not be read."));

    reader.onload = (e) => {
      const dataUrl = e.target.result;

      // Canvas path — preferred
      if (typeof document !== "undefined") {
        const img = new Image();

        img.onerror = () => reject(new Error("The image could not be decoded."));

        img.onload = () => {
          // Scale down to fit within PHOTO_MAX_DIM × PHOTO_MAX_DIM
          let { width, height } = img;
          if (width > PHOTO_MAX_DIM || height > PHOTO_MAX_DIM) {
            const scale = Math.min(PHOTO_MAX_DIM / width, PHOTO_MAX_DIM / height);
            width  = Math.round(width  * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement("canvas");
          canvas.width  = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Try at target quality; lower if still too large
          let result = canvas.toDataURL("image/jpeg", PHOTO_QUALITY);
          if (result.length > PHOTO_MAX_CHARS) {
            result = canvas.toDataURL("image/jpeg", 0.5);
          }
          if (result.length > PHOTO_MAX_CHARS) {
            result = canvas.toDataURL("image/jpeg", 0.3);
          }

          if (result.length > PHOTO_MAX_CHARS) {
            reject(new Error(
              "The image is too large to store even after compression. " +
              "Please use a smaller image (under 1 MB recommended)."
            ));
            return;
          }

          resolve(result);
        };

        img.src = dataUrl;
      } else {
        // Canvas unavailable — accept only if already within limit
        if (dataUrl.length > PHOTO_MAX_CHARS) {
          reject(new Error("The image is too large. Please use a smaller image."));
          return;
        }
        resolve(dataUrl);
      }
    };

    reader.readAsDataURL(file);
  });
}
