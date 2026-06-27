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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}
        >
          <h1>ItemWorth</h1>
        
          <a
            href="/about.html"
            style={{
              textDecoration: 'none',
              padding: '0.5rem 0.75rem',
              border: '1px solid #888',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}
          >
            About
          </a>
        </div>
        <p>
          Track what you own and estimate its value.
        </p>
      </header>

      <Dashboard
        itemCount={items.length}
        totalValue={totalValue}
      />

      <button
        className="primary-button"
        onClick={addItem}
      >
        Add Item
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
