import { useRef, useMemo, useState } from "react";
import { CATEGORIES, exportJSON } from "../utils/storage";

/* ── Icons ───────────────────────────────────────────────── */
function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function QuantityIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function XIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
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

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest first" },
  { value: "name-asc",   label: "Name A–Z" },
  { value: "name-desc",  label: "Name Z–A" },
  { value: "value-desc", label: "Highest value" },
  { value: "value-asc",  label: "Lowest value" },
];

/**
 * CSV export — always exports the currently visible (filtered + sorted) items.
 * The user sees exactly what will be exported via the context-aware button label.
 */
function exportCSV(items) {
  const headers = [
    "Name", "Category", "Location", "Quantity",
    "Unit Value", "Total Value", "Notes", "Date Added",
  ];

  const escape = (val) => {
    const str = String(val ?? "");
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const rows = items.map((item) => {
    const qty  = Number(item.quantity)       || 0;
    const unit = Number(item.estimatedValue) || 0;
    return [
      item.name,
      item.category,
      item.location,
      qty,
      unit.toFixed(2),
      (qty * unit).toFixed(2),
      item.notes,
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "",
    ].map(escape).join(",");
  });

  const csv  = [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `itemworth-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Item Card ───────────────────────────────────────────── */
function ItemCard({ item, onEdit, onDelete }) {
  const unitValue  = Number(item.estimatedValue) || 0;
  const qty        = Number(item.quantity) || 1;
  const totalValue = unitValue * qty;
  const showCalc   = qty > 1 && unitValue > 0;

  return (
    <article
      className="item-card"
      aria-label={`${item.name}, ${item.category}`}
    >
      <div className="item-card__body">
        <div className="item-card__top">
          <h3 className="item-card__name">{item.name}</h3>
          <span className={getBadgeClass(item.category)}>
            {item.category}
          </span>
        </div>

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

        <div className="item-card__value-row">
          <span
            className="item-card__value"
            aria-label={`Total value $${formatCurrency(totalValue)}`}
          >
            ${formatCurrency(totalValue)}
          </span>
          {showCalc && (
            <span className="item-card__value-calc">
              ({qty} × ${formatCurrency(unitValue)})
            </span>
          )}
        </div>

        {item.notes && (
          <p className="item-card__notes">{item.notes}</p>
        )}
      </div>

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

/* ── Empty States ────────────────────────────────────────── */
function EmptyInventory({ onAdd }) {
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
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add your first item
      </button>
    </div>
  );
}

function NoResults({ onClear }) {
  return (
    <div className="empty-state empty-state--no-results">
      <div className="empty-state__icon">
        <SearchIcon />
      </div>
      <p className="empty-state__title">No items match</p>
      <p className="empty-state__body">
        Try adjusting your search or filters.
      </p>
      <button type="button" className="btn btn-secondary" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}

/* ── Inventory Toolbar ───────────────────────────────────── */
function InventoryToolbar({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categoryCounts,
  totalItems,
  visibleCount,
  visibleItems,
  allItems,
  onImportFile,
}) {
  const fileInputRef = useRef(null);
  const hasFilters   = query.trim() !== "" || activeCategory !== "All";
  const isFiltered   = visibleCount < totalItems;

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) onImportFile(file);
    // Reset so the same file can be re-selected after an error dismissal
    e.target.value = "";
  }

  function clearAll() {
    onQueryChange("");
    onCategoryChange("All");
  }

  return (
    <div className="inv-toolbar">
      {/* ── Row 1: search + sort + action buttons ── */}
      <div className="inv-toolbar__top">
        <div className="inv-search">
          <span className="inv-search__icon">
            <SearchIcon />
          </span>
          <input
            type="search"
            className="inv-search__input"
            placeholder="Search items…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Search inventory"
          />
          {query && (
            <button
              type="button"
              className="inv-search__clear"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
            >
              <XIcon size={13} />
            </button>
          )}
        </div>

        <div className="inv-toolbar__right">
          <label className="sr-only" htmlFor="inv-sort">Sort by</label>
          <select
            id="inv-sort"
            className="inv-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/*
            CSV export — exports the currently visible (filtered + sorted) items.
            The label always states exactly how many items will be exported,
            so there is no ambiguity about what the user gets.
          */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => exportCSV(visibleItems)}
            aria-label={
              isFiltered
                ? `Export ${visibleCount} visible items as CSV`
                : `Export all ${totalItems} items as CSV`
            }
            title={
              isFiltered
                ? `Export ${visibleCount} of ${totalItems} items (filtered view)`
                : "Export all items as CSV"
            }
          >
            <DownloadIcon />
            <span className="inv-btn-label">
              {isFiltered
                ? `Export (${visibleCount})`
                : "Export"}
            </span>
          </button>

          {/*
            JSON backup — always exports the full unfiltered inventory,
            regardless of active search or category filter.
            Hidden on very small screens where space is critical;
            users can clear filters and use CSV, or access on desktop.
          */}
          <button
            type="button"
            className="btn btn-secondary inv-backup-btn"
            onClick={() => exportJSON(allItems)}
            aria-label={`Download full backup of all ${totalItems} items as JSON`}
            title="Download full JSON backup (all items)"
          >
            <DownloadIcon />
            <span className="inv-btn-label">Backup</span>
          </button>

          {/* Hidden file input — triggered by the Import button below */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="sr-only"
            aria-label="Select JSON backup file to import"
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Import inventory from a JSON backup file"
            title="Import from JSON backup"
          >
            <UploadIcon />
            <span className="inv-btn-label">Import</span>
          </button>
        </div>
      </div>

      {/* ── Row 2: category filter chips ── */}
      <div className="inv-chips" role="group" aria-label="Filter by category">
        {["All", ...CATEGORIES.filter((c) => categoryCounts[c] > 0)].map(
          (cat) => {
            const isActive = activeCategory === cat;
            const count    = cat === "All" ? totalItems : categoryCounts[cat];
            return (
              <button
                key={cat}
                type="button"
                className={`inv-chip${isActive ? " inv-chip--active" : ""}`}
                onClick={() => onCategoryChange(cat)}
                aria-pressed={isActive}
              >
                {cat}
                <span className="inv-chip__count">{count}</span>
              </button>
            );
          }
        )}
      </div>

      {/* ── Result count — shown only when filters are active ── */}
      {hasFilters && (
        <p className="inv-result-count" aria-live="polite" aria-atomic="true">
          Showing {visibleCount} of {totalItems} item
          {totalItems !== 1 ? "s" : ""}
          <button
            type="button"
            className="inv-clear-link"
            onClick={clearAll}
          >
            Clear
          </button>
        </p>
      )}
    </div>
  );
}

/* ── InventoryList ───────────────────────────────────────── */
function InventoryList({ items, onEdit, onDelete, onAdd, onImportFile }) {
  const [query, setQuery]             = useState("");
  const [activeCategory, setCategory] = useState("All");
  const [sortBy, setSortBy]           = useState("newest");

  // Count per category across the full unfiltered inventory
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [items]);

  // Filtered + sorted view — derived from items, query, category, sort
  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "value-desc": {
          const av = (Number(a.estimatedValue) || 0) * (Number(a.quantity) || 1);
          const bv = (Number(b.estimatedValue) || 0) * (Number(b.quantity) || 1);
          return bv - av;
        }
        case "value-asc": {
          const av = (Number(a.estimatedValue) || 0) * (Number(a.quantity) || 1);
          const bv = (Number(b.estimatedValue) || 0) * (Number(b.quantity) || 1);
          return av - bv;
        }
        case "newest":
        default:
          return (b.createdAt || 0) - (a.createdAt || 0);
      }
    });
  }, [items, query, activeCategory, sortBy]);

  function clearFilters() {
    setQuery("");
    setCategory("All");
  }

  // No inventory at all — show the empty state, no toolbar yet
  if (items.length === 0) {
    return (
      <section className="inventory-section" aria-label="Inventory">
        <EmptyInventory onAdd={onAdd} />
      </section>
    );
  }

  return (
    <section
      className="inventory-section"
      aria-label={`Inventory — ${items.length} item${items.length !== 1 ? "s" : ""}`}
    >
      <InventoryToolbar
        query={query}
        onQueryChange={setQuery}
        activeCategory={activeCategory}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categoryCounts={categoryCounts}
        totalItems={items.length}
        visibleCount={visibleItems.length}
        visibleItems={visibleItems}
        allItems={items}
        onImportFile={onImportFile}
      />

      {visibleItems.length === 0 ? (
        <NoResults onClear={clearFilters} />
      ) : (
        <div className="item-list">
          {visibleItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default InventoryList;
