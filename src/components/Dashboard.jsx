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
      <div className="card">
        <h2>Total Items</h2>

        <p>{itemCount}</p>

        <small>
          Items currently tracked
        </small>
      </div>

      <div className="card">
        <h2>Inventory Value</h2>

        <p>${formattedValue}</p>

        <small>
          Estimated replacement value
        </small>
      </div>
    </section>
  );
}

export default Dashboard;
