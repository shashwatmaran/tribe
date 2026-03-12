import { Link, useParams, useNavigate } from "react-router-dom";
import { Users, Calendar, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { useAddMember, useGroup } from "@/hooks/api";
import { useState } from "react";

const Join = () => {
  const { inviteCode } = useParams();
  const groupId = inviteCode || "";
  const navigate = useNavigate();
  const { data: group, isLoading, error } = useGroup(groupId);
  const [email, setEmail] = useState("");
  const addMember = useAddMember(groupId);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    const value = (amount / 100).toFixed(2);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(parseFloat(value));
  };

  const handleContinue = async () => {
    if (!group || !email || !groupId) return;

    addMember.mutate(
      { email },
      {
        onSuccess: () => {
          // Redirect to setup payment after successful member addition
          navigate("/setup-payment");
        },
        onError: (error) => {
          console.error("Failed to join group:", error);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div>
        <p className="text-sm font-mono text-muted-foreground mb-2">Invite</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Loading invite...</h1>

        <div className="mt-8 flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-sm font-mono text-muted-foreground mb-2">Invite</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Invalid Invite</h1>

        <div className="mt-8 flex items-center gap-3 p-4 border border-destructive/50 bg-destructive/10 rounded-md">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-medium text-destructive">Failed to load invite</p>
            <p className="text-xs text-destructive/80">
              {error instanceof Error ? error.message : "The invite link may be invalid or expired"}
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center bg-foreground text-background px-6 py-3 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (!group) {
    return (
      <div>
        <p className="text-sm font-mono text-muted-foreground mb-2">Invite</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Group not found</h1>
      </div>
    );
  }

  // Calculate share amount (total amount / member count)
  const shareAmount = group.totalAmount / group.memberCount;

  return (
    <div>
      <p className="text-sm font-mono text-muted-foreground mb-2">Invite</p>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{group.platformGroupId}</h1>
      <p className="text-muted-foreground mt-2">You've been invited to join a shared subscription.</p>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-4 border border-border rounded-lg p-4">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Your split</p>
            <p className="text-2xl font-bold font-mono text-foreground">
              {formatCurrency(shareAmount)}
              <span className="text-sm text-muted-foreground font-normal"> / month</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-border rounded-lg p-4">
          <Users className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Members</p>
            <p className="text-sm text-muted-foreground">{group.memberCount} seats available</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-border rounded-lg p-4">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Currency</p>
            <p className="text-sm text-muted-foreground">{group.currency}</p>
          </div>
        </div>
      </div>

      {/* Email input for joining */}
      <div className="mt-6 space-y-3">
        <label className="block text-sm font-medium text-foreground">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full px-4 py-2.5 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>

      <button
        onClick={handleContinue}
        disabled={!email || addMember.isPending}
        className="mt-8 w-full flex items-center justify-center bg-foreground text-background px-6 py-3 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {addMember.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Joining...
          </>
        ) : (
          "Join group"
        )}
      </button>

      {addMember.error && (
        <div className="mt-4 flex items-center gap-3 p-4 border border-destructive/50 bg-destructive/10 rounded-md">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive">
            {addMember.error instanceof Error
              ? addMember.error.message
              : "Failed to join group"}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground text-center">
        Invite code: <span className="font-mono">{inviteCode}</span>
      </p>
    </div>
  );
};

export default Join;
