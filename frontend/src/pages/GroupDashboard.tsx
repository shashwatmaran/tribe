import { Link, useParams } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useState } from "react";
import ObligationCard from "@/components/portal/ObligationCard";
import MemberStatusList from "@/components/portal/MemberStatusList";
import PaymentRecoveryModal from "@/components/portal/PaymentRecoveryModal";
import { useBillingStatus } from "@/context/BillingStatusContext";

const members = [
  { name: "Alice", email: "alice@example.com", status: "failed" as const, isYou: true },
  { name: "Bob", email: "bob@example.com", status: "paid" as const },
  { name: "Carol", email: "carol@example.com", status: "due" as const },
  { name: "Dave", email: "dave@example.com", status: "paid" as const },
];

const GroupDashboard = () => {
  const { groupId } = useParams();
  const { status, groupName } = useBillingStatus();
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const isFailed = status === "PAYMENT_FAILED" || status === "BLOCKED";

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Group · {groupId}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{groupName}</h1>
      </div>

      {/* Core financial summary */}
      <ObligationCard />

      {/* Member payment statuses */}
      <MemberStatusList members={members} />

      {/* Action row */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Link
          to={`/group/${groupId}/billing`}
          className="flex-1 flex items-center justify-center gap-2 border border-border rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          View billing history
        </Link>

        {isFailed && (
          <button
            onClick={() => setRecoveryOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 border border-border rounded-md px-4 py-2.5 text-sm font-medium text-foreground hover:border-foreground/30 transition-colors"
          >
            Resolve payment
          </button>
        )}

        <button className="flex items-center justify-center gap-2 border border-border rounded-md px-4 py-2.5 text-sm font-medium text-destructive hover:border-destructive/30 transition-colors">
          <LogOut className="w-4 h-4" />
          Leave group
        </button>
      </div>

      <PaymentRecoveryModal open={recoveryOpen} onOpenChange={setRecoveryOpen} />
    </div>
  );
};

export default GroupDashboard;
