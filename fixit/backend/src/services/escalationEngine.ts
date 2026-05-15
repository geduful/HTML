interface Report {
  id: string;
  status: string;
  isEscalated: boolean;
  escalatedAt: string | null;
  createdAt: string;
  [key: string]: unknown;
}

const ESCALATION_SLA_DAYS = 7;

/**
 * Checks and applies escalation rules to a report.
 *
 * Escalation triggers:
 * 1. Report status is REJECTED → immediately escalated
 * 2. Report has been in REPORTED state past the SLA threshold → escalated
 *
 * Once escalated, `isEscalated` is set to `true` and the report
 * becomes visible on the higher-authority dashboard.
 */
export async function checkEscalation(report: Report): Promise<void> {
  if (report.isEscalated) return;

  let shouldEscalate = false;

  if (report.status === "REJECTED") {
    shouldEscalate = true;
  }

  if (report.status === "REPORTED") {
    const createdAt = new Date(report.createdAt).getTime();
    const now = Date.now();
    const elapsedDays = (now - createdAt) / (1000 * 60 * 60 * 24);

    if (elapsedDays >= ESCALATION_SLA_DAYS) {
      shouldEscalate = true;
    }
  }

  if (shouldEscalate) {
    report.isEscalated = true;
    report.escalatedAt = new Date().toISOString();
    console.log(
      `[ESCALATION] Report ${report.id} escalated (status: ${report.status})`
    );
  }
}

/**
 * Returns summary metrics about escalated reports.
 */
export function getEscalationMetrics(reports: Report[]) {
  return {
    totalEscalated: reports.filter((r) => r.isEscalated).length,
    escalatedRejected: reports.filter(
      (r) => r.isEscalated && r.status === "REJECTED"
    ).length,
    escalatedStalled: reports.filter(
      (r) => r.isEscalated && r.status === "REPORTED"
    ).length,
    pendingEscalation: reports.filter(
      (r) => !r.isEscalated && r.status === "REPORTED"
    ).length,
  };
}
