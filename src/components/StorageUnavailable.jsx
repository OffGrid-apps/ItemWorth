import { useRef, useState } from "react";

const QUOTA_STATUS =
  "On-device storage is unavailable or full. ItemWorth cannot safely start until the browser can complete the storage check.";

function initialStatus(result) {
  if (result?.quota) return QUOTA_STATUS;
  return "On-device storage is unavailable. Follow the steps below, then reload ItemWorth.";
}

function StorageUnavailable({ initialResult }) {
  const [reloading, setReloading] = useState(false);
  const [status, setStatus] = useState(() => initialStatus(initialResult));
  const reloadingRef = useRef(false);

  function handleReload() {
    if (reloadingRef.current) return;

    reloadingRef.current = true;
    setReloading(true);
    setStatus("Reloading ItemWorth…");

    // Yield once so the reloading state can render and be announced before
    // the browser creates a new document and reruns the startup storage check.
    window.setTimeout(() => {
      window.location.reload();
    }, 0);
  }

  return (
    <main className="storage-recovery" id="main-content">
      <section
        className="storage-recovery__card"
        aria-labelledby="storage-recovery-title"
        aria-busy={reloading}
      >
        <p className="storage-recovery__eyebrow">ItemWorth</p>
        <h1 id="storage-recovery-title" className="storage-recovery__title">
          On-device storage is unavailable
        </h1>

        <div className="storage-recovery__explanation">
          <p>
            ItemWorth stores your inventory privately in this browser on your
            device. The browser is preventing ItemWorth from safely reading and
            saving on-device data.
          </p>
          <p>
            ItemWorth cannot safely start until storage is available. The
            diagnostic check does not intentionally delete or modify your
            inventory, and ItemWorth cannot restore information already deleted
            by the browser.
          </p>
          <p>
            ItemWorth cannot change this browser setting automatically or open
            a native permission prompt for it.
          </p>
        </div>

        <div className="storage-recovery__instructions">
          <h2 className="storage-recovery__subtitle">Chrome on Android</h2>
          <ol className="storage-recovery__steps">
            <li>Open Chrome.</li>
            <li>Open Chrome Settings.</li>
            <li>Open Site settings.</li>
            <li>Open Additional content settings.</li>
            <li>Open On-device site data.</li>
            <li>Select “Allow sites to save data on your device.”</li>
            <li>Return to ItemWorth.</li>
            <li>Tap “Reload ItemWorth.”</li>
          </ol>
        </div>

        <p className="storage-recovery__fallback">
          Browser menu wording can vary by version or manufacturer. In another
          browser, look for site data, cookies, or on-device storage settings
          and allow this site to save data.
        </p>

        <div className="storage-recovery__action">
          <p
            className="storage-recovery__status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {status}
          </p>
          <button
            type="button"
            className="btn btn-primary storage-recovery__button"
            onClick={handleReload}
            disabled={reloading}
          >
            {reloading ? "Reloading…" : "Reload ItemWorth"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default StorageUnavailable;
