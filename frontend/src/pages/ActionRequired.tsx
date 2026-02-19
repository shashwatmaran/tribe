import { AlertTriangle, CreditCard, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Pure recovery screen — no global state mutations or redirects.
 * PortalLayout handles routing the user here when status === "BLOCKED".
 */
const ActionRequired = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Action required</h1>
          <p className="text-sm text-muted-foreground">Your account has been blocked due to a payment failure.</p>
        </div>
      </div>

      <div className="border border-destructive/20 rounded-lg p-6 bg-destructive/[0.03]">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
          Failure reason
        </p>
        <p className="text-sm text-foreground">
          Your card ending in <span className="font-mono">4242</span> was declined — the issuing bank returned:{" "}
          <span className="font-mono text-destructive">insufficient_funds</span>
        </p>

        <div className="mt-6 space-y-3">
          <Link
            to="/setup-payment"
            className="w-full flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Update payment method
          </Link>
          <button className="w-full flex items-center justify-center gap-2 border border-border px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Retry payment now
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        If this issue is not resolved within 7 days, your membership will be permanently removed.
      </p>
    </div>
  );
};

export default ActionRequired;
