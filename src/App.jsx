import { useEffect, useMemo, useState } from "react";
import {
  loadItems,
  saveItems,
  createItem,
  calculateTotalValue,
} from "./utils/storage";
import Dashboard from "./components/Dashboard";
import ItemForm from "./components/ItemForm";
import InventoryList from "./components/InventoryList";

function App() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveItems(items);
    }
  }, [items, loaded]);

  const totalValue = useMemo(() => {
    return calculateTotalValue(items);
  }, [items]);

  function addItem() {
    setEditingItem(createItem());
  }

  function saveItem(item) {
    const cleanedItem = {
      ...item,
      name: item.name.trim(),
      location: item.location.trim(),
      notes: item.notes.trim(),
    };

    if (!cleanedItem.name) {
      return;
    }

    setItems((current) => {
      const exists = current.some(
        (existing) => existing.id === cleanedItem.id
      );

      if (exists) {
        return current.map((existing) =>
          existing.id === cleanedItem.id
            ? cleanedItem
            : existing
        );
      }

      return [cleanedItem, ...current];
    });

    setEditingItem(null);
  }

  function deleteItem(id) {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function editItem(item) {
    setEditingItem(item);
  }

  function cancelEdit() {
    setEditingItem(null);
  }

  return (
    <main className="app">
      <header className="app-header">
        <p
          style={{
            marginBottom: "0.5rem",
            fontWeight: 700,
            color: "var(--color-secondary)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "0.8rem",
          }}
        >
          Personal Inventory
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1>ItemWorth</h1>

            <p
              style={{
                marginTop: "0.75rem",
                maxWidth: "42rem",
              }}
            >
              Organize, value, and manage everything you own in one
              secure, offline-first inventory.
            </p>
          </div>

          <a
            href="/about.html"
            className="primary-button"
            style={{
              textDecoration: "none",
              minWidth: "120px",
            }}
          >
            About
          </a>
        </div>
      </header>

      <Dashboard
        itemCount={items.length}
        totalValue={totalValue}
      />

      <button
        className="primary-button"
        onClick={addItem}
      >
        + Add Item
      </button>

      {editingItem && (
        <ItemForm
          item={editingItem}
          onSave={saveItem}
          onCancel={cancelEdit}
        />
      )}

      <InventoryList
        items={items}
        onEdit={editItem}
        onDelete={deleteItem}
      />
    </main>
  );
}

export default App;
