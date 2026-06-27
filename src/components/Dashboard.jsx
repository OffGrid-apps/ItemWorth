function Dashboard({ itemCount, totalValue }) {
  return (
    <section
      className="dashboard"
      aria-label="Inventory summary"
    >
      <div className="card">
        <h2>Items</h2>
        <p>{itemCount}</p>
      </div>

      <div className="card">
        <h2>Total Value</h2>
        <p>
          ${Number(totalValue).toFixed(2)}
        </p>
      </div>
    </section>
  );
}

export default Dashboard;
