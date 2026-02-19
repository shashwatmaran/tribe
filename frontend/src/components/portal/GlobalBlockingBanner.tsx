import { AlertTriangle, Clock, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useBillingStatus } from "@/context/BillingStatusContext";

const GlobalBlockingBanner = () => {
    const { status } = useBillingStatus();

    if (status !== "PAYMENT_DUE" && status !== "PAYMENT_FAILED") return null;

    const isDue = status === "PAYMENT_DUE";

    return (
        <div
            role="alert"
            className={`w-full mb-6 rounded-lg border px-4 py-3 flex items-start gap-3 ${isDue
                    ? "bg-amber-500/5 border-amber-500/25 text-amber-700"
                    : "bg-red-500/5 border-red-500/25 text-red-700"
                }`}
        >
            {isDue ? (
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
            ) : (
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                    {isDue ? "Payment due" : "Payment failed"}
                </p>
                <p className="text-xs mt-0.5 opacity-80">
                    {isDue
                        ? "Your next charge is coming up. Make sure your payment method is valid."
                        : "Your last payment could not be processed. Update your payment method to stay active."}
                </p>
            </div>
            <Link
                to="/setup-payment"
                className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors ${isDue
                        ? "border-amber-500/30 hover:bg-amber-500/10"
                        : "border-red-500/30 hover:bg-red-500/10"
                    }`}
            >
                <CreditCard className="w-3 h-3" />
                Update method
            </Link>
        </div>
    );
};

export default GlobalBlockingBanner;
