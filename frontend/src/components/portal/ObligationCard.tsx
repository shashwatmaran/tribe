import { Calendar, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useBillingStatus } from "@/context/BillingStatusContext";

const statusConfig = {
    ACTIVE: { label: "PAID", className: "bg-green-500/10 text-green-600 border-green-500/20" },
    PAYMENT_DUE: { label: "DUE", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    PAYMENT_FAILED: { label: "FAILED", className: "bg-red-500/10 text-red-600 border-red-500/20" },
    BLOCKED: { label: "BLOCKED", className: "bg-red-700/10 text-red-700 border-red-700/20" },
};

const ObligationCard = () => {
    const { status, shareAmount, nextBillingDate } = useBillingStatus();
    const { label, className } = statusConfig[status];

    const isFailed = status === "PAYMENT_FAILED" || status === "BLOCKED";

    return (
        <div className="border border-border rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
                        Your obligation
                    </p>
                    <p className="text-4xl font-bold font-mono text-foreground tracking-tight">
                        {shareAmount}
                        <span className="text-base font-normal text-muted-foreground ml-1">/ mo</span>
                    </p>
                </div>
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-mono font-semibold tracking-widest ${className}`}
                >
                    {label}
                </span>
            </div>

            {/* Billing date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>
                    Next charge on{" "}
                    <span className="text-foreground font-medium">{nextBillingDate}</span>
                </span>
            </div>

            {/* Recovery action */}
            {isFailed && (
                <Link
                    to="/setup-payment"
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                    <CreditCard className="w-4 h-4" />
                    Update payment method
                </Link>
            )}
        </div>
    );
};

export default ObligationCard;
