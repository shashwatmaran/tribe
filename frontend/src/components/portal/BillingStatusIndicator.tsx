import { useBillingStatus, BillingStatus } from "@/context/BillingStatusContext";

const config: Record<BillingStatus, { label: string; dot: string; badge: string }> = {
    ACTIVE: {
        label: "Active",
        dot: "bg-green-500",
        badge: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    PAYMENT_DUE: {
        label: "Payment Due",
        dot: "bg-amber-500",
        badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    PAYMENT_FAILED: {
        label: "Failed",
        dot: "bg-red-500 animate-pulse",
        badge: "bg-red-500/10 text-red-600 border-red-500/20",
    },
    BLOCKED: {
        label: "Blocked",
        dot: "bg-red-700 animate-pulse",
        badge: "bg-red-700/10 text-red-700 border-red-700/20",
    },
};

const BillingStatusIndicator = () => {
    const { status } = useBillingStatus();
    const { label, dot, badge } = config[status];

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-mono font-medium ${badge}`}
            aria-label={`Billing status: ${label}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
};

export default BillingStatusIndicator;
