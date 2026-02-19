import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { CreditCard, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useBillingStatus } from "@/context/BillingStatusContext";

interface PaymentRecoveryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PaymentRecoveryModal = ({ open, onOpenChange }: PaymentRecoveryModalProps) => {
    const { failureReason } = useBillingStatus();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Resolve payment failure</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Your payment could not be processed. Update your payment method or retry.
                    </DialogDescription>
                </DialogHeader>

                {failureReason && (
                    <div className="border border-destructive/20 rounded-md p-4 bg-destructive/[0.03] mt-2">
                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
                            Failure reason
                        </p>
                        <p className="text-sm text-foreground">{failureReason}</p>
                    </div>
                )}

                <div className="mt-4 space-y-2">
                    <Link
                        to="/setup-payment"
                        onClick={() => onOpenChange(false)}
                        className="w-full flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
                    >
                        <CreditCard className="w-4 h-4" />
                        Update payment method
                    </Link>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="w-full flex items-center justify-center gap-2 border border-border px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Retry payment now
                    </button>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    If unresolved within 7 days, your membership will be paused.
                </p>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentRecoveryModal;
