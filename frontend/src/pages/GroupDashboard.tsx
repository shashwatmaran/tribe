import { Link, useParams } from "react-router-dom";
import { LogOut, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useGroupWithMembers, useCharges } from "@/hooks/api";
import ObligationCard from "@/components/portal/ObligationCard";
import MemberStatusList from "@/components/portal/MemberStatusList";
import PaymentRecoveryModal from "@/components/portal/PaymentRecoveryModal";
import { useBillingStatus } from "@/context/BillingStatusContext";

const GroupDashboard = () => {
  const { groupId } = useParams();
  if (!groupId) return <div>Invalid group ID</div>;

  const { status, groupName } = useBillingStatus();
  const { group, members, isLoading, error } = useGroupWithMembers(groupId);
  const { data: charges } = useCharges(groupId);
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const isFailed = status === "PAYMENT_FAILED" || status === "BLOCKED";

  // Transform members and charges into the format MemberStatusList expects
  const transformedMembers = members?.map((member) => {
    // Find charges for this member to determine payment status
    const memberCharges = charges?.filter((c) => c.memberId === member.id) || [];
    const latestCharge = memberCharges[memberCharges.length - 1];

    let paymentStatus: "paid" | "due" | "failed" = "due";
    if (latestCharge) {
      if (latestCharge.status === "PAID") {
        paymentStatus = "paid";
      } else if (latestCharge.status === "FAILED") {
        paymentStatus = "failed";
      } else {
        paymentStatus = "due";
      }
    }

    // Extract name from email or use email as name
    const name = member.email.split("@")[0];

    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: member.email,
      status: paymentStatus,
      isYou: false, // You could determine this based on current user context
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Group · {groupId}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{groupName}</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Group · {groupId}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{groupName}</h1>
        </div>
        <div className="flex items-center gap-3 p-4 border border-destructive/50 bg-destructive/10 rounded-md">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-medium text-destructive">Failed to load group data</p>
            <p className="text-xs text-destructive/80">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
      {transformedMembers.length > 0 ? (
        <MemberStatusList members={transformedMembers} />
      ) : (
        <div className="border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No members in this group yet</p>
        </div>
      )}

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
