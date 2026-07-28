import { useMemo, useState } from "react";
import clsx from "clsx";
import { getEventAudit } from "../audit/logger";
import { runNightlyReverification } from "../jobs/nightlyReverification";
import { useClinicStore } from "../store/useClinicStore";
import { formatDateTime } from "../utils/format";
export function AuditLogPage() {
  const audit = useClinicStore((state) => state.audit);
  const referrals = useClinicStore((state) => state.referrals);
  const [query, setQuery] = useState("");
  const [report, setReport] = useState("");
  const [running, setRunning] = useState(false);
  const entries = useMemo(
    () =>
      [...getEventAudit(), ...audit]
        .filter((entry) =>
          [
            entry.actor,
            entry.action,
            entry.detail,
            entry.referralId ?? "",
          ].some((value) => value.toLowerCase().includes(query.toLowerCase())),
        )
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
    [audit, query],
  );
  const verify = async () => {
    setRunning(true);
    const result = await runNightlyReverification(referrals);
    setReport(
      `${result.checked} records checked; ${result.failures.length} require attention.`,
    );
    setRunning(false);
  };
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Governance</span>
          <h1>Audit log</h1>
          <p>
            A chronological record of triage decisions, appointments and
            automated checks.
          </p>
        </div>
        <button
          onClick={verify}
          disabled={running}
          className="button secondary"
        >
          {running ? "Checking…" : "Run eligibility check"}
        </button>
      </header>
      {report && <div className="notice success">{report}</div>}
      <section className="card audit-card">
        <div className="audit-toolbar">
          <label className="search-field">
            <b>⌕</b>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the audit log"
            />
          </label>
          <span>{entries.length} recorded events</span>
        </div>
        <div className="audit-list">
          {entries.map((entry) => (
            <article key={entry.id} className="audit-entry">
              <div className={clsx("audit-marker", entry.severity)}>
                {entry.severity === "critical"
                  ? "!"
                  : entry.severity === "warning"
                    ? "△"
                    : "✓"}
              </div>
              <div className="audit-body">
                <header>
                  <strong>{entry.action}</strong>
                  <time>{formatDateTime(entry.occurredAt)}</time>
                </header>
                <p>{entry.detail}</p>
                <footer>
                  <span>{entry.actor}</span>
                  {entry.referralId && (
                    <span className="ref-chip">{entry.referralId}</span>
                  )}
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
