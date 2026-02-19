import { Link } from "react-router-dom";
import { CreditCard, Building, Shield } from "lucide-react";
import { useState } from "react";

const SetupPayment = () => {
  const [method, setMethod] = useState<"card" | "bank">("card");

  return (
    <div>
      <p className="text-sm font-mono text-muted-foreground mb-2">Payment</p>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Set up payment</h1>
      <p className="text-muted-foreground mt-2">Add a payment method to join the group.</p>

      <div className="mt-8">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMethod("card")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm font-medium transition-colors ${
              method === "card"
                ? "border-foreground text-foreground"
                : "border-border text-muted-foreground hover:border-foreground/30"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Card
          </button>
          <button
            onClick={() => setMethod("bank")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm font-medium transition-colors ${
              method === "bank"
                ? "border-foreground text-foreground"
                : "border-border text-muted-foreground hover:border-foreground/30"
            }`}
          >
            <Building className="w-4 h-4" />
            Bank account
          </button>
        </div>

        <div className="space-y-4">
          {method === "card" ? (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Card number</label>
                <div className="border border-border rounded-md px-3 py-2.5 bg-card text-sm text-muted-foreground font-mono">
                  4242 •••• •••• ••••
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Expiry</label>
                  <div className="border border-border rounded-md px-3 py-2.5 bg-card text-sm text-muted-foreground font-mono">
                    MM / YY
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">CVC</label>
                  <div className="border border-border rounded-md px-3 py-2.5 bg-card text-sm text-muted-foreground font-mono">
                    •••
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Account holder</label>
                <div className="border border-border rounded-md px-3 py-2.5 bg-card text-sm text-muted-foreground">
                  Full name
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Routing number</label>
                <div className="border border-border rounded-md px-3 py-2.5 bg-card text-sm text-muted-foreground font-mono">
                  •••••••••
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex items-start gap-3 border border-border rounded-md p-4">
          <Shield className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            By continuing, you authorize Tribe to debit your {method === "card" ? "card" : "bank account"} for your share of the subscription on each billing cycle. You can cancel anytime.
          </p>
        </div>
      </div>

      <Link
        to="/group/grp_demo"
        className="mt-8 w-full flex items-center justify-center bg-foreground text-background px-6 py-3 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
      >
        Join group
      </Link>
    </div>
  );
};

export default SetupPayment;
