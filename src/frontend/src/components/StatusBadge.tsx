import type { SpotStatus } from "@/lib/types";
import { STATUS } from "@/lib/status";

export default function StatusBadge({ status }: { status: SpotStatus }) {
  const s = STATUS[status];
  return (
    <span className="badge">
      <span className="dot" style={{ background: s.color }} aria-hidden />
      {s.label}
    </span>
  );
}
