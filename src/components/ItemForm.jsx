import { useState } from "react";
import { CATEGORIES } from "../utils/storage";

function ItemForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <section className="form-section">
      <h2>
        {item.name ? "Edit Item" : "Add Item"}
      </h2>

      <form onSubmit={handleSubmit}>
        <label>
          Item name
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
            placeholder="Example: Laptop"
            required
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value)
            }
          >
            {CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Location
          <input
            type="text"
            value={form.location}
            onChange={(e) =>
              updateField("location", e.target.value)
            }
            placeholder="Example: Garage"
          />
        </label>

        <label>
          Quantity
          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) =>
              updateField(
                "quantity",
                Number(e.target.value)
              )
            }
          />
        </label>

        <label>
          Estimated value
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.estimatedValue}
            onChange={(e) =>
              updateField(
                "estimatedValue",
                e.target.value
              )
            }
            placeholder="Example: 250"
          />
        </label>

        <label>
          Notes
          <textarea
            value={form.notes}
            onChange={(e) =>
              updateField("notes", e.target.value)
            }
            placeholder="Condition, details, etc."
          />
        </label>

        <div className="button-row">
          <button
            type="submit"
            className="primary-button"
          >
            Save Item
          </button>

          <button
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default ItemForm;
