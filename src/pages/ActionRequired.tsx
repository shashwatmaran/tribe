import { AlertTriangle, CreditCard, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const ActionRequired = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Action required</h1>
          <p className="text-sm text-muted-foreground">Your last payment failed</p>
        </div>
      </div>

      <div className="border border-destructive/20 rounded-lg p-6 bg-destructive/[0.03]">
        <p className="text-sm font-medium text-foreground">Failure reason</p>
        <p className="text-sm text-muted-foreground mt-1">
          Your card ending in 4242 was declined. The issuing bank returned: <span className="font-mono text-foreground">insufficient_funds</span>
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
        If this issue is not resolved within 7 days, your membership in the group will be paused.
      </p>
    </div>
  );
};

export default ActionRequired;
