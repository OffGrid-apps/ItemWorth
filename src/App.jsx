import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  loadItems,
  saveItems,
  createItem,
  calculateTotalValue,
} from "./utils/storage";
import Dashboard from "./components/Dashboard";
import ItemForm from "./components/ItemForm";
import InventoryList from "./components/InventoryList";

/* ── Toast ───────────────────────────────────────────────── */
let toastId = 0;

function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  return { toasts, show };
}

/* ── Icons ───────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

/* ── Delete Confirmation Dialog ──────────────────────────── */
function DeleteDialog({ itemName, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKey = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className="dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="dialog">
        <div className="dialog__icon" aria-hidden="true">
          <TrashIcon />
        </div>

        <h2 className="dialog__title" id="dialog-title">
          Remove this item?
        </h2>

        <p className="dialog__body">
          <strong>{itemName}</strong> will be permanently removed from your
          inventory. This cannot be undone.
        </p>

        <div className="dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Keep it
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            <TrashIcon />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast Region ────────────────────────────────────────── */
function ToastRegion({ toasts }) {
  return (
    <div className="toast-region" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast__icon">
            {t.type === "success" ? <CheckIcon /> : <TrashIcon />}
          </span>
          <span className="toast__message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────── */
function App() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const { toasts, show: showToast } = useToast();

  useEffect(() => {
    setItems(loadItems());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveItems(items);
  }, [items, loaded]);

  const totalValue = useMemo(() => calculateTotalValue(items), [items]);

  function addItem() {
    setEditingItem(createItem());
  }

  function saveItem(item) {
    const cleaned = {
      ...item,
      name: item.name.trim(),
      location: item.location.trim(),
      notes: item.notes.trim(),
    };

    if (!cleaned.name) return;

    const isNew = !items.some((x) => x.id === cleaned.id);

    setItems((current) => {
      if (isNew) return [cleaned, ...current];
      return current.map((x) => (x.id === cleaned.id ? cleaned : x));
    });

    setEditingItem(null);
    showToast(isNew ? "Item added to inventory." : "Item updated.", "success");
  }

  function requestDelete(item) {
    setPendingDelete(item);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const name = pendingDelete.name;
    setItems((current) => current.filter((x) => x.id !== pendingDelete.id));
    setPendingDelete(null);
    showToast(`"${name}" removed.`, "danger");
  }

  function cancelDelete() {
    setPendingDelete(null);
  }

  function editItem(item) {
    setEditingItem(item);
  }

  function cancelEdit() {
    setEditingItem(null);
  }

  return (
    <>
      <main className="app">
        {/* ── Header ── */}
        <header className="app-header">
          <div className="app-header__eyebrow" aria-label="Personal Inventory">
            <span className="app-header__eyebrow-dot" aria-hidden="true" />
            Personal Inventory
          </div>

          <div className="app-header__row">
            <div>
              <h1 className="app-header__title">ItemWorth</h1>
              <p className="app-header__subtitle">
                Organize, value, and manage everything you own — secure and
                offline.
              </p>
            </div>

            <nav className="app-header__nav" aria-label="Site navigation">
              <a href="/about.html" className="nav-link">
                About
              </a>
            </nav>
          </div>
        </header>

        {/* ── Dashboard ── */}
        <Dashboard itemCount={items.length} totalValue={totalValue} />

        {/* ── Toolbar ── */}
        <div className="section-toolbar">
          <h2 className="section-toolbar__title">Inventory</h2>
          <div className="section-toolbar__right">
            <button className="btn btn-primary" onClick={addItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        {/* ── Form ── */}
        {editingItem && (
          <ItemForm
            item={editingItem}
            onSave={saveItem}
            onCancel={cancelEdit}
          />
        )}

        {/* ── List ── */}
        <InventoryList
          items={items}
          onEdit={editItem}
          onDelete={requestDelete}
          onAdd={addItem}
        />
      </main>

      {/* ── Delete Dialog ── */}
      {pendingDelete && (
        <DeleteDialog
          itemName={pendingDelete.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* ── Toasts ── */}
      <ToastRegion toasts={toasts} />
    </>
  );
}

export default App;
