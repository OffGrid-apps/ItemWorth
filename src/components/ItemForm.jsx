import { useEffect, useRef, useState } from "react";
import { CATEGORIES, compressImage } from "../utils/storage";

function ItemForm({ item, onSave, onCancel, locationSuggestions = [] }) {
  const [form, setForm] = useState(item);
  const [nameError, setNameError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  // tagInput holds the raw comma-separated string while the user types
  const [tagInput, setTagInput] = useState(
    () => (item.tags ?? []).join(", ")
  );

  // Auto-focus the name field when the form mounts
  const nameInputRef = useRef(null);
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const isEditing = Boolean(item.name);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "name" && nameError) setNameError("");
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    setPhotoLoading(true);
    compressImage(file)
      .then((dataUrl) => {
        setForm((current) => ({ ...current, photo: dataUrl }));
        setPhotoLoading(false);
      })
      .catch((err) => {
        setPhotoError(err.message);
        setPhotoLoading(false);
      });
    // Reset input so the same file can be reselected after an error
    e.target.value = "";
  }

  function removePhoto() {
    setForm((current) => ({ ...current, photo: "" }));
    setPhotoError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      setNameError("Item name is required.");
      return;
    }

    // Parse the raw tag input into a clean deduplicated array
    const tags = [...new Set(
      tagInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t !== "")
    )];

    onSave({ ...form, tags });
  }

  return (
    <section className="form-section" aria-label={isEditing ? "Edit item" : "Add new item"}>
      <div className="form-section__header">
        <h2 className="form-section__title">
          {isEditing ? "Edit Item" : "Add New Item"}
        </h2>
        <p className="form-section__subtitle">
          {isEditing
            ? "Update the details for this item."
            : "Fill in what you know — you can always edit later."}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-body">
          {/* Name */}
          <div className={`field${nameError ? " field--error" : ""}`}>
            <label className="field-label" htmlFor="field-name">
              Item name
              <span className="required-mark" aria-hidden="true"> *</span>
            </label>
            <input
              id="field-name"
              type="text"
              ref={nameInputRef}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. MacBook Pro 14"
              autoComplete="off"
              aria-required="true"
              aria-describedby={nameError ? "name-error" : undefined}
            />
            {nameError && (
              <p className="field-error" id="name-error" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1z"/>
                </svg>
                {nameError}
              </p>
            )}
          </div>

          {/* Category + Location */}
          <div className="form-row">
            <div className="field">
              <label className="field-label" htmlFor="field-category">
                Category
              </label>
              <select
                id="field-category"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="field-location">
                Location
              </label>
              <input
                id="field-location"
                type="text"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. Home office"
                autoComplete="off"
                list="location-suggestions"
              />
              {locationSuggestions.length > 0 && (
                <datalist id="location-suggestions">
                  {locationSuggestions.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              )}
            </div>
          </div>

          {/* Quantity + Value */}
          <div className="form-row">
            <div className="field">
              <label className="field-label" htmlFor="field-quantity">
                Quantity
              </label>
              <input
                id="field-quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) =>
                  updateField("quantity", Math.max(1, Number(e.target.value)))
                }
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="field-value">
                Estimated value
              </label>
              <div className="field-input-wrap">
                <span className="field-input-prefix" aria-hidden="true">$</span>
                <input
                  id="field-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.estimatedValue}
                  onChange={(e) => updateField("estimatedValue", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <p className="field-hint">Per unit</p>
            </div>
          </div>

          {/* Notes */}
          <div className="field">
            <label className="field-label" htmlFor="field-notes">
              Notes
            </label>
            <textarea
              id="field-notes"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Condition, serial number, purchase date, etc."
            />
          </div>

          {/* Serial Number + Purchase Date */}
          <div className="form-row">
            <div className="field">
              <label className="field-label" htmlFor="field-serial">
                Serial number
              </label>
              <input
                id="field-serial"
                type="text"
                value={form.serialNumber ?? ""}
                onChange={(e) => updateField("serialNumber", e.target.value)}
                placeholder="e.g. SN-123456"
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="field-purchase-date">
                Purchase date
              </label>
              <input
                id="field-purchase-date"
                type="date"
                value={form.purchaseDate ?? ""}
                onChange={(e) => updateField("purchaseDate", e.target.value)}
              />
            </div>
          </div>

          {/* Condition */}
          <div className="field">
            <label className="field-label" htmlFor="field-condition">
              Condition
            </label>
            <select
              id="field-condition"
              value={form.condition ?? ""}
              onChange={(e) => updateField("condition", e.target.value)}
            >
              <option value="">Not specified</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          {/* Photo */}
          <div className="field">
            <span className="field-label" id="photo-field-label">Photo</span>
            {form.photo ? (
              <div className="photo-preview">
                <img
                  src={form.photo}
                  alt={`Photo of ${form.name || "item"}`}
                  className="photo-preview__img"
                />
                <div className="photo-preview__actions">
                  <label className="btn btn-secondary photo-preview__change">
                    Change photo
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      aria-labelledby="photo-field-label"
                      onChange={handlePhotoChange}
                      disabled={photoLoading}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={removePhoto}
                    disabled={photoLoading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className={`photo-upload${photoLoading ? " photo-upload--loading" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>{photoLoading ? "Processing…" : "Add photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  aria-labelledby="photo-field-label"
                  onChange={handlePhotoChange}
                  disabled={photoLoading}
                />
              </label>
            )}
            {photoError && (
              <p className="field-error" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1z"/>
                </svg>
                {photoError}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="field">
            <label className="field-label" htmlFor="field-tags">
              Tags
            </label>
            <input
              id="field-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. insured, fragile, apple"
              autoComplete="off"
            />
            <p className="field-hint">Separate tags with commas</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {isEditing ? "Save changes" : "Add to inventory"}
          </button>

          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default ItemForm;
