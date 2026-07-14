import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import {
  loadItems,
  saveItems,
  createItem,
  calculateTotalValue,
  validateImport,
  mergeImport,
  getStorageWarning,
  readPreference,
  writePreference,
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

/* ── Focus trap for modal dialogs ────────────────────────── */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function useFocusTrap(containerRef, isActive) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const container = containerRef.current;

    function handleKeyDown(e) {
      if (e.key !== "Tab") return;
      const focusable = [...container.querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef, isActive]);
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function DownloadAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function WifiOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

/* ── Install Prompt Banner ───────────────────────────────── */
const INSTALL_DISMISSED_KEY = "itemworth.install.dismissed";

/* ── Welcome / Onboarding ────────────────────────────────── */
const WELCOME_DISMISSED_KEY = "itemworth.welcome.dismissed";

function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div className="pwa-banner" role="complementary" aria-label="Install app">
      <div className="pwa-banner__icon" aria-hidden="true">
        <DownloadAppIcon />
      </div>
      <div className="pwa-banner__body">
        <p className="pwa-banner__title">Add to Home Screen</p>
        <p className="pwa-banner__desc">
          Install ItemWorth for fast, offline access.
        </p>
      </div>
      <div className="pwa-banner__actions">
        <button
          type="button"
          className="btn btn-primary pwa-banner__install"
          onClick={onInstall}
        >
          Install
        </button>
        <button
          type="button"
          className="btn btn-secondary pwa-banner__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss install prompt"
        >
          ×
        </button>
      </div>
    </div>
  );
}

/* ── Offline Indicator ───────────────────────────────────── */
function OfflineIndicator() {
  return (
    <div className="offline-indicator" role="status" aria-live="polite">
      <WifiOffIcon />
      Offline — your data is safe
    </div>
  );
}

/* ── Update Banner ───────────────────────────────────────── */
function UpdateBanner({ onUpdate, onDismiss }) {
  return (
    <div className="pwa-update-banner" role="status" aria-live="polite">
      <RefreshIcon />
      <span className="pwa-update-banner__msg">
        An update is available.
      </span>
      <button
        type="button"
        className="btn btn-primary pwa-update-banner__btn"
        onClick={onUpdate}
      >
        Update now
      </button>
      <button
        type="button"
        className="btn btn-secondary pwa-update-banner__dismiss"
        onClick={onDismiss}
        aria-label="Dismiss update notification"
      >
        ×
      </button>
    </div>
  );
}

const SAMPLE_ITEMS = [
  {
    id: "sample-1",
    name: "MacBook Pro 14\"",
    category: "Electronics",
    location: "Home office",
    quantity: 1,
    estimatedValue: "1999",
    serialNumber: "",
    purchaseDate: "",
    condition: "",
    photo: "",
    tags: [],
    notes: "M3 Pro, Space Black, purchased 2024",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "sample-2",
    name: "Standing Desk",
    category: "Furniture",
    location: "Home office",
    quantity: 1,
    estimatedValue: "650",
    serialNumber: "",
    purchaseDate: "",
    condition: "",
    photo: "",
    tags: [],
    notes: "Height-adjustable, walnut top",
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: "sample-3",
    name: "Cordless Drill",
    category: "Tools",
    location: "Garage",
    quantity: 1,
    estimatedValue: "129",
    serialNumber: "",
    purchaseDate: "",
    condition: "",
    photo: "",
    tags: [],
    notes: "18V, includes two batteries",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "sample-4",
    name: "Winter Jacket",
    category: "Clothing",
    location: "Bedroom closet",
    quantity: 1,
    estimatedValue: "280",
    serialNumber: "",
    purchaseDate: "",
    condition: "",
    photo: "",
    tags: [],
    notes: "Down-filled, size M",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "sample-5",
    name: "Road Bicycle",
    category: "Sports",
    location: "Garage",
    quantity: 1,
    estimatedValue: "900",
    serialNumber: "",
    purchaseDate: "",
    condition: "",
    photo: "",
    tags: [],
    notes: "Aluminium frame, 21-speed",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

function WelcomePanel({ onStart, onLoadSamples, onDismiss }) {
  return (
    <div className="welcome-panel" role="region" aria-label="Welcome to ItemWorth">
      <div className="welcome-panel__header">
        <div className="welcome-panel__eyebrow">Getting started</div>
        <h2 className="welcome-panel__title">Track what you own</h2>
        <p className="welcome-panel__body">
          ItemWorth helps you record, value, and organise your belongings.
          Everything stays on your device — no account, no cloud, no tracking.
        </p>
      </div>

      <div className="welcome-panel__features">
        <div className="welcome-panel__feature">
          <span className="welcome-panel__feature-icon" aria-hidden="true">📦</span>
          <span>Add items with category, location, and estimated value</span>
        </div>
        <div className="welcome-panel__feature">
          <span className="welcome-panel__feature-icon" aria-hidden="true">🔍</span>
          <span>Search, filter, and sort your entire inventory instantly</span>
        </div>
        <div className="welcome-panel__feature">
          <span className="welcome-panel__feature-icon" aria-hidden="true">💾</span>
          <span>Export to CSV or back up and restore with JSON</span>
        </div>
      </div>

      <div className="welcome-panel__actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onStart}
        >
          Add your first item
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onLoadSamples}
        >
          Explore with sample data
        </button>
      </div>

      <button
        type="button"
        className="welcome-panel__dismiss"
        onClick={onDismiss}
        aria-label="Dismiss welcome"
      >
        ×
      </button>
    </div>
  );
}

/* ── Delete Confirmation Dialog ──────────────────────────── */
function DeleteDialog({ itemName, onConfirm, onCancel }) {
  const cancelRef    = useRef(null);
  const containerRef = useRef(null);

  useFocusTrap(containerRef, true);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className="dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="dialog" ref={containerRef}>
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

/* ── Import Preview Dialog ───────────────────────────────── */
function ImportDialog({ preview, onConfirm, onCancel }) {
  const confirmRef   = useRef(null);
  const containerRef = useRef(null);

  useFocusTrap(containerRef, true);

  useEffect(() => {
    // Focus the confirm button when there are items to add,
    // otherwise focus Cancel so the user doesn't accidentally confirm a no-op.
    confirmRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  const { totalCount, addedCount, skippedCount } = preview;

  return (
    <div
      className="dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="dialog" ref={containerRef}>
        <div className="dialog__icon dialog__icon--info" aria-hidden="true">
          <InfoIcon />
        </div>
        <h2 className="dialog__title" id="import-dialog-title">
          Import backup
        </h2>

        <div className="dialog__body">
          <div className="import-preview">
            <div className="import-preview__row">
              <span>Items found in file</span>
              <strong>{totalCount}</strong>
            </div>
            <div className="import-preview__row">
              <span>Will be added</span>
              <strong className="import-preview__add">{addedCount}</strong>
            </div>
            {skippedCount > 0 && (
              <div className="import-preview__row">
                <span>Already in inventory (skipped)</span>
                <strong className="import-preview__skip">{skippedCount}</strong>
              </div>
            )}
          </div>

          <p className="import-preview__note">
            {addedCount === 0
              ? "All items in this backup already exist in your inventory. Nothing will change."
              : "New items will be added to your existing inventory. Nothing will be overwritten or deleted."}
          </p>
        </div>

        <div className="dialog__actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={addedCount === 0}
            aria-disabled={addedCount === 0}
          >
            <CheckIcon />
            {addedCount === 0
              ? "Nothing to add"
              : `Add ${addedCount} item${addedCount !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast Region ────────────────────────────────────────── */
function ToastRegion({ toasts }) {
  return (
    <div
      className="toast-region"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
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
  const [items, setItems]                 = useState([]);
  const [editingItem, setEditingItem]     = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importError, setImportError]     = useState("");
  const [loaded, setLoaded]               = useState(false);
  const { toasts, show: showToast }       = useToast();

  // Ref to restore focus when a dialog closes
  const dialogTriggerRef = useRef(null);

  // ── Onboarding ───────────────────────────────────────────
  // Welcome panel is shown once to new users when the inventory is empty.
  // The `loaded` guard prevents a flash for existing users while localStorage
  // is being read on startup.
  const [welcomeDismissed, setWelcomeDismissed] = useState(
    () => readPreference(WELCOME_DISMISSED_KEY).value === "true"
  );

  function dismissWelcome() {
    setWelcomeDismissed(true);
    const result = writePreference(WELCOME_DISMISSED_KEY, "true");
    if (!result.ok) {
      showToast(
        "Welcome preference could not be saved because on-device storage is unavailable.",
        "danger"
      );
    }
  }

  function handleWelcomeStart() {
    dismissWelcome();
    addItem();
  }

  function handleLoadSamples() {
    dismissWelcome();
    setItems(SAMPLE_ITEMS);
  }

  const showWelcome = loaded && items.length === 0 && !welcomeDismissed;

  // ── PWA: install prompt ──────────────────────────────────
  // deferredPrompt holds the BeforeInstallPromptEvent when available.
  // null means the browser doesn't support it or the app is already installed.
  const [deferredPrompt, setDeferredPrompt]     = useState(null);
  const [installDismissed, setInstallDismissed] = useState(
    () => readPreference(INSTALL_DISMISSED_KEY).value === "true"
  );

  useEffect(() => {
    const handler = (e) => {
      // Prevent the browser's default mini-infobar
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Clear the prompt once the app has been installed
  useEffect(() => {
    const handler = () => setDeferredPrompt(null);
    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
    });
  }

  function handleInstallDismiss() {
    setInstallDismissed(true);
    const result = writePreference(INSTALL_DISMISSED_KEY, "true");
    if (!result.ok) {
      showToast(
        "Install preference could not be saved because on-device storage is unavailable.",
        "danger"
      );
    }
  }

  const showInstallBanner =
    deferredPrompt !== null && !installDismissed;

  // ── PWA: offline indicator ───────────────────────────────
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const goOnline  = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // ── PWA: update notification ─────────────────────────────
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const updateCheckIntervalRef = useRef(null);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Periodically check for updates when the SW is registered
      if (r) {
        if (updateCheckIntervalRef.current) {
          clearInterval(updateCheckIntervalRef.current);
        }
        updateCheckIntervalRef.current = setInterval(() => r.update(), 60 * 60 * 1000); // hourly
      }
    },
  });

  useEffect(() => {
    return () => {
      if (updateCheckIntervalRef.current) {
        clearInterval(updateCheckIntervalRef.current);
      }
    };
  }, []);

  const showUpdateBanner = needRefresh && !updateDismissed;

  function handleUpdate() {
    updateServiceWorker(true);
  }

  function handleUpdateDismiss() {
    setNeedRefresh(false);
    setUpdateDismissed(true);
  }

  useEffect(() => {
    setItems(loadItems());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const result = saveItems(items);
    if (!result.ok) {
      if (result.quota) {
        showToast(
          "Storage is full. Delete photos or items, or export a backup to free space.",
          "danger"
        );
      } else {
        showToast(
          "Your changes could not be saved. Please try again.",
          "danger"
        );
      }
    }
  }, [items, loaded]);

  // Proactive storage check — warn once per session when usage exceeds 80 %
  const storageWarnedRef = useRef(false);
  useEffect(() => {
    if (!loaded || storageWarnedRef.current) return;
    getStorageWarning().then((info) => {
      if (!info) return;
      if (info.ratio >= 0.8) {
        storageWarnedRef.current = true;
        showToast(
          "Storage is almost full. Export a backup or delete photos to avoid losing changes.",
          "danger"
        );
      }
    });
  }, [items, loaded]);

  const totalValue = useMemo(() => calculateTotalValue(items), [items]);

  // Unique sorted location strings for the datalist in ItemForm
  const locationSuggestions = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const item of items) {
      const loc = item.location?.trim();
      if (loc && !seen.has(loc)) {
        seen.add(loc);
        result.push(loc);
      }
    }
    return result.sort();
  }, [items]);

  /* ── CRUD ── */
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
    setItems((current) =>
      isNew
        ? [cleaned, ...current]
        : current.map((x) => (x.id === cleaned.id ? cleaned : x))
    );
    setEditingItem(null);
    showToast(isNew ? "Item added to inventory." : "Item updated.", "success");
  }

  function requestDelete(item) {
    dialogTriggerRef.current = document.activeElement;
    setPendingDelete(item);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const name = pendingDelete.name;
    setItems((current) => current.filter((x) => x.id !== pendingDelete.id));
    setPendingDelete(null);
    showToast(`"${name}" removed.`, "danger");
    // Focus returns to the inventory section since the deleted item's
    // button no longer exists in the DOM
    try { dialogTriggerRef.current?.focus(); } catch {}
    dialogTriggerRef.current = null;
  }

  function cancelDelete() {
    setPendingDelete(null);
    try { dialogTriggerRef.current?.focus(); } catch {}
    dialogTriggerRef.current = null;
  }

  function editItem(item) {
    setEditingItem(item);
  }

  function cancelEdit() {
    setEditingItem(null);
  }

  /* ── Import ── */
  function handleImportFile(file) {
    setImportError("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      setImportError("Please select a JSON backup file (.json).");
      return;
    }

    dialogTriggerRef.current = document.activeElement;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const result = validateImport(parsed);

        if (!result.valid) {
          setImportError(result.error);
          return;
        }

        const { merged, addedCount, skippedCount } = mergeImport(
          items,
          result.items
        );

        setImportPreview({
          mergedItems: merged,
          addedCount,
          skippedCount,
          totalCount: result.items.length,
        });
      } catch {
        setImportError(
          "The file could not be read. Make sure it is a valid JSON backup."
        );
      }
    };

    reader.onerror = () => {
      setImportError("The file could not be opened. Please try again.");
    };

    reader.readAsText(file);
  }

  function confirmImport() {
    if (!importPreview) return;
    const { mergedItems, addedCount } = importPreview;
    setItems(mergedItems);
    setImportPreview(null);
    showToast(
      `${addedCount} item${addedCount !== 1 ? "s" : ""} imported successfully.`,
      "success"
    );
    try { dialogTriggerRef.current?.focus(); } catch {}
    dialogTriggerRef.current = null;
  }

  function cancelImport() {
    setImportPreview(null);
    setImportError("");
    try { dialogTriggerRef.current?.focus(); } catch {}
    dialogTriggerRef.current = null;
  }

  return (
    <>
      {/* ── Install banner (outside .app so it spans full width) ── */}
      {showInstallBanner && (
        <InstallBanner
          onInstall={handleInstall}
          onDismiss={handleInstallDismiss}
        />
      )}

      <main className="app" id="main-content">
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
              <a href={`${import.meta.env.BASE_URL}about.html`} className="nav-link">
                About
              </a>
            </nav>
          </div>

          {/* Offline indicator — visible only when offline */}
          {isOffline && <OfflineIndicator />}
        </header>

        {/* ── Update banner ── */}
        {showUpdateBanner && (
          <UpdateBanner
            onUpdate={handleUpdate}
            onDismiss={handleUpdateDismiss}
          />
        )}

        {/* ── Dashboard ── */}
        <Dashboard itemCount={items.length} totalValue={totalValue} />

        {/* ── Welcome panel (first-run only) ── */}
        {showWelcome && (
          <WelcomePanel
            onStart={handleWelcomeStart}
            onLoadSamples={handleLoadSamples}
            onDismiss={dismissWelcome}
          />
        )}

        {/* ── Section toolbar ── */}
        <div className="section-toolbar">
          <h2 className="section-toolbar__title">Inventory</h2>
          <div className="section-toolbar__right">
            <button className="btn btn-primary" onClick={addItem}>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        {/* ── Item form ── */}
        {editingItem && (
          <ItemForm
            item={editingItem}
            onSave={saveItem}
            onCancel={cancelEdit}
            locationSuggestions={locationSuggestions}
          />
        )}

        {/* ── Import error banner ── */}
        {importError && (
          <div className="import-error" role="alert">
            <InfoIcon />
            <span>{importError}</span>
            <button
              type="button"
              className="import-error__dismiss"
              onClick={() => setImportError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Inventory list ── */}
        <InventoryList
          items={items}
          onEdit={editItem}
          onDelete={requestDelete}
          onAdd={addItem}
          onImportFile={handleImportFile}
        />
      </main>

      {/* ── Delete confirmation dialog ── */}
      {pendingDelete && (
        <DeleteDialog
          itemName={pendingDelete.name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* ── Import preview dialog ── */}
      {importPreview && (
        <ImportDialog
          preview={importPreview}
          onConfirm={confirmImport}
          onCancel={cancelImport}
        />
      )}

      {/* ── Toast notifications ── */}
      <ToastRegion toasts={toasts} />
    </>
  );
}

export default App;
