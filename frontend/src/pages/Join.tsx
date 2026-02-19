import { Link, useParams } from "react-router-dom";
import { Users, Calendar, CreditCard } from "lucide-react";

const Join = () => {
  const { inviteCode } = useParams();

  return (
    <div>
      <p className="text-sm font-mono text-muted-foreground mb-2">Invite</p>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Join Family Netflix Plan</h1>
      <p className="text-muted-foreground mt-2">You've been invited to share a subscription.</p>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-4 border border-border rounded-lg p-4">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Your split</p>
            <p className="text-2xl font-bold font-mono text-foreground">$5.75<span className="text-sm text-muted-foreground font-normal"> / month</span></p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-border rounded-lg p-4">
          <Users className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Members</p>
            <p className="text-sm text-muted-foreground">4 of 5 seats filled</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-border rounded-lg p-4">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Next billing</p>
            <p className="text-sm text-muted-foreground">March 1, 2026</p>
          </div>
        </div>
      </div>

      <Link
        to="/setup-payment"
        className="mt-8 w-full flex items-center justify-center bg-foreground text-background px-6 py-3 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
      >
        Continue
      </Link>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        Invite code: <span className="font-mono">{inviteCode}</span>
      </p>
    </div>
  );
};

export default Join;
