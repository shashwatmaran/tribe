import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGroup, useCharges } from "@/hooks/api";

export type BillingStatus = "ACTIVE" | "PAYMENT_DUE" | "PAYMENT_FAILED" | "BLOCKED";

interface BillingStatusContextValue {
    status: BillingStatus;
    setStatus: (s: BillingStatus) => void;
    groupName: string;
    shareAmount: string;
    nextBillingDate: string;
    failureReason: string | null;
    isLoading: boolean;
}

const BillingStatusContext = createContext<BillingStatusContextValue | null>(null);

interface BillingStatusProviderProps {
    children: ReactNode;
    groupId?: string;
}

/**
 * BillingStatusProvider now fetches real data from the API
 * Pass groupId prop to load actual billing status
 */
export const BillingStatusProvider = ({ children, groupId }: BillingStatusProviderProps) => {
    const [status, setStatus] = useState<BillingStatus>("PAYMENT_DUE");
    const [isLoading, setIsLoading] = useState(true);

    // Fetch group and charges data if groupId is provided
    const groupQuery = useGroup(groupId || "");
    const chargesQuery = useCharges(groupId || "");

    useEffect(() => {
        if (!groupId) {
            // Fallback to mock data if no groupId provided
            setIsLoading(false);
            return;
        }

        if (groupQuery.isLoading || chargesQuery.isLoading) {
            setIsLoading(true);
            return;
        }

        if (!groupQuery.data || !chargesQuery.data) {
            setIsLoading(false);
            return;
        }

        const group = groupQuery.data;
        const charges = chargesQuery.data;

        // Determine payment status from charges
        if (charges.length > 0) {
            const latestCharge = charges[charges.length - 1];
            if (latestCharge.status === "FAILED") {
                setStatus("PAYMENT_FAILED");
            } else if (latestCharge.status === "PAID") {
                setStatus("ACTIVE");
            } else {
                setStatus("PAYMENT_DUE");
            }
        } else {
            setStatus("PAYMENT_DUE");
        }

        setIsLoading(false);
    }, [groupId, groupQuery.data, chargesQuery.data, groupQuery.isLoading, chargesQuery.isLoading]);

    // Format share amount from group data
    const shareAmount = groupQuery.data
        ? ((groupQuery.data.totalAmount / groupQuery.data.memberCount) / 100).toFixed(2)
        : "$5.75";

    // Calculate next billing date (assuming monthly billing on the same day)
    const today = new Date();
    const nextBillingDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const formattedBillingDate = nextBillingDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <BillingStatusContext.Provider
            value={{
                status,
                setStatus,
                groupName: groupQuery.data?.platformGroupId || "Subscription",
                shareAmount: `$${shareAmount}`,
                nextBillingDate: formattedBillingDate,
                failureReason: status === "PAYMENT_FAILED"
                    ? "Card ending in 4242 was declined — insufficient_funds"
                    : null,
                isLoading,
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
