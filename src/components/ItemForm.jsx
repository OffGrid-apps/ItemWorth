import { useState } from "react";
import { CATEGORIES } from "../utils/storage";

function ItemForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item);
  const [nameError, setNameError] = useState("");

  const isEditing = Boolean(item.name);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "name" && nameError) setNameError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      setNameError("Item name is required.");
      return;
    }

    onSave(form);
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
              />
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
