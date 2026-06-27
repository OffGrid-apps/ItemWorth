function InventoryList({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <section className="inventory-section">
        <h2>Inventory</h2>
        <p>
          No items yet. Add your first item to start tracking your belongings.
        </p>
      </section>
    );
  }

  return (
    <section className="inventory-section">
      <h2>Inventory</h2>

      <div className="item-list">
        {items.map((item) => (
          <article
            key={item.id}
            className="item-card"
          >
            <h3>{item.name}</h3>

            <p>
              Category: {item.category}
            </p>

            {item.location && (
              <p>
                Location: {item.location}
              </p>
            )}

            <p>
              Quantity: {item.quantity}
            </p>

            <p>
              Value: $
              {(
                Number(item.estimatedValue) || 0
              ).toFixed(2)}
            </p>

            {item.notes && (
              <p>
                Notes: {item.notes}
              </p>
            )}

            <div className="button-row">
              <button
                type="button"
                onClick={() => onEdit(item)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default InventoryList;
