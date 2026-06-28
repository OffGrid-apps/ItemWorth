/* ── Icons ───────────────────────────────────────────────── */
function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function QuantityIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */
function getBadgeClass(category) {
  return `badge badge-${category.toLowerCase().replace(/\s+/g, "-")}`;
}

function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ── Item Card ───────────────────────────────────────────── */
function ItemCard({ item, onEdit, onDelete }) {
  const unitValue = Number(item.estimatedValue) || 0;
  const qty = Number(item.quantity) || 1;
  const totalValue = unitValue * qty;
  const showCalc = qty > 1 && unitValue > 0;

  return (
    <article
      className="item-card"
      aria-label={`${item.name}, ${item.category}`}
    >
      <div className="item-card__body">
        {/* Name + Category */}
        <div className="item-card__top">
          <h3 className="item-card__name">{item.name}</h3>
          <span className={getBadgeClass(item.category)}>
            {item.category}
          </span>
        </div>

        {/* Meta: location + quantity */}
        <div className="item-card__meta">
          {item.location && (
            <span className="item-card__meta-item">
              <LocationIcon />
              {item.location}
            </span>
          )}
          <span className="item-card__meta-item">
            <QuantityIcon />
            {qty === 1 ? "1 unit" : `${qty} units`}
          </span>
        </div>

        {/* Value */}
        <div className="item-card__value-row">
          <span className="item-card__value" aria-label={`Total value $${formatCurrency(totalValue)}`}>
            ${formatCurrency(totalValue)}
          </span>
          {showCalc && (
            <span className="item-card__value-calc">
              ({qty} × ${formatCurrency(unitValue)})
            </span>
          )}
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="item-card__notes">{item.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="item-card__actions">
        <button
          type="button"
          className="btn btn-secondary btn-icon"
          onClick={() => onEdit(item)}
          aria-label={`Edit ${item.name}`}
          title="Edit"
        >
          <EditIcon />
        </button>

        <button
          type="button"
          className="btn btn-danger btn-icon"
          onClick={() => onDelete(item)}
          aria-label={`Remove ${item.name}`}
          title="Remove"
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}

/* ── Empty State ─────────────────────────────────────────── */
function EmptyState({ onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <BoxIcon />
      </div>
      <p className="empty-state__title">Your inventory is empty</p>
      <p className="empty-state__body">
        Start tracking your belongings by adding your first item.
      </p>
      <button type="button" className="btn btn-primary" onClick={onAdd}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add your first item
      </button>
    </div>
  );
}

/* ── InventoryList ───────────────────────────────────────── */
function InventoryList({ items, onEdit, onDelete, onAdd }) {
  if (items.length === 0) {
    return (
      <section className="inventory-section" aria-label="Inventory">
        <EmptyState onAdd={onAdd} />
      </section>
    );
  }

  return (
    <section className="inventory-section" aria-label={`Inventory — ${items.length} item${items.length !== 1 ? "s" : ""}`}>
      <div className="item-list">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default InventoryList;
