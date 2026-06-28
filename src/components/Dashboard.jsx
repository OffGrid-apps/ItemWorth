/* ── Icons ───────────────────────────────────────────────── */
function BoxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function ValueIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}

/* ── Dashboard ───────────────────────────────────────────── */
function Dashboard({ itemCount, totalValue }) {
  const formattedValue = Number(totalValue).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section
      className="dashboard"
      aria-label="Inventory summary"
    >
      <div className="stat-card">
        <div className="stat-card__icon" aria-hidden="true">
          <BoxIcon />
        </div>
        <p className="stat-card__label">Total Items</p>
        <p className="stat-card__value" aria-label={`${itemCount} items`}>
          {itemCount}
        </p>
        <p className="stat-card__sub">Items currently tracked</p>
      </div>

      <div className="stat-card">
        <div className="stat-card__icon" aria-hidden="true">
          <ValueIcon />
        </div>
        <p className="stat-card__label">Inventory Value</p>
        <p
          className="stat-card__value"
          aria-label={`$${formattedValue} estimated value`}
        >
          ${formattedValue}
        </p>
        <p className="stat-card__sub">Estimated replacement value</p>
      </div>
    </section>
  );
}

export default Dashboard;
