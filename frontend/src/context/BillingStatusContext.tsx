import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type BillingStatus = "ACTIVE" | "PAYMENT_DUE" | "PAYMENT_FAILED" | "BLOCKED";

interface BillingStatusContextValue {
    status: BillingStatus;
    setStatus: (s: BillingStatus) => void;
    groupName: string;
    shareAmount: string;
    nextBillingDate: string;
    failureReason: string | null;
}

const BillingStatusContext = createContext<BillingStatusContextValue | null>(null);

/**
 * In production, swap the hardcoded defaults below with an API call
 * (e.g. GET /api/groups/:id) and call setStatus from the response.
 */
export const BillingStatusProvider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState<BillingStatus>("PAYMENT_FAILED");

    // Simulated initial fetch — replace with real API call
    useEffect(() => {
        // Example: fetch("/api/group/grp_demo").then(r => r.json()).then(d => setStatus(d.status));
    }, []);

    return (
        <BillingStatusContext.Provider
            value={{
                status,
                setStatus,
                groupName: "Family Netflix Plan",
                shareAmount: "$5.75",
                nextBillingDate: "March 1, 2026",
                failureReason: "Card ending in 4242 was declined — insufficient_funds",
            }}
        >
            {children}
        </BillingStatusContext.Provider>
    );
};

export const useBillingStatus = (): BillingStatusContextValue => {
    const ctx = useContext(BillingStatusContext);
    if (!ctx) throw new Error("useBillingStatus must be used inside BillingStatusProvider");
    return ctx;
};
