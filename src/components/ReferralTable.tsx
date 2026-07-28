import { Link } from "react-router-dom";
import clsx from "clsx";
import type { Referral } from "../types/domain";
import { bandLabel, humaniseType, relativeTime } from "../utils/format";
interface Props {
  referrals: Referral[];
}
export function ReferralTable({ referrals }: Props) {
  if (!referrals.length)
    return (
      <div className="empty-state">
        <div className="empty-icon">⌕</div>
        <h3>No referrals match</h3>
        <p>Try clearing a filter or using a broader search.</p>
      </div>
    );
  return (
    <div className="table-wrap">
      <table className="referral-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Referral</th>
            <th>Service</th>
            <th>Received</th>
            <th>Priority</th>
            <th>Status</th>
            <th>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((referral) => (
            <tr key={referral.id}>
              <td>
                <Link className="patient-link" to={`/referrals/${referral.id}`}>
                  {referral.patient.name}
                </Link>
                <span className="subtext">
                  NHS {referral.patient.nhsNumber}
                </span>
              </td>
              <td>
                <span className={clsx("type-dot", `type-${referral.type}`)} />
                {humaniseType(referral.type)}
                <span className="subtext">{referral.id}</span>
              </td>
              <td>
                <strong className="cell-primary">{referral.service}</strong>
                <span className="subtext truncate">{referral.reason}</span>
              </td>
              <td>{relativeTime(referral.receivedAt)}</td>
              <td>
                <span
                  className={clsx(
                    "priority-pill",
                    referral.priority && `priority-${referral.priority}`,
                  )}
                >
                  <i />
                  {bandLabel(referral.priority)}
                </span>
              </td>
              <td>
                <span
                  className={clsx("status-pill", `status-${referral.status}`)}
                >
                  {referral.status}
                </span>
              </td>
              <td>
                <Link
                  className="row-action"
                  to={`/referrals/${referral.id}`}
                  aria-label={`Open ${referral.id}`}
                >
                  ›
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
