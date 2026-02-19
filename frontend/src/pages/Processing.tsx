import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const TIMEOUT_MS = 12000; // 12 seconds before "Still waiting" appears

const Processing = () => {
    const navigate = useNavigate();
    const [timedOut, setTimedOut] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const checkStatus = () => {
        /**
         * In production: poll GET /api/group/status
         * On success  → navigate("/group/" + groupId, { replace: true })
         * On failure  → navigate("/action-required", { replace: true })
         * Here we simulate with a timeout placeholder.
         */
    };

    useEffect(() => {
        checkStatus();

        // Show "Still waiting" message after TIMEOUT_MS
        timeoutRef.current = setTimeout(() => {
            setTimedOut(true);
        }, TIMEOUT_MS);

        return () => clearTimeout(timeoutRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // If the user hits back, re-check status and route appropriately
    useEffect(() => {
        const handlePopState = () => {
            checkStatus();
            // Prevent going to a page that could trigger double submission
            navigate("/processing", { replace: true });
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
            {/* Spinner */}
            <div className="relative w-14 h-14 mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-border" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground animate-spin" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-foreground">
                Confirming your payment setup
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Please wait — do not close this tab.
            </p>

            {/* Timeout state */}
            {timedOut && (
                <div className="mt-8 border border-border rounded-lg p-5 max-w-xs w-full text-left">
                    <p className="text-sm font-medium text-foreground">Still waiting for confirmation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        This is taking longer than usual. You can refresh to re-check, or wait.
                    </p>
                    <button
                        onClick={() => {
                            setTimedOut(false);
                            checkStatus();
                            timeoutRef.current = setTimeout(() => setTimedOut(true), TIMEOUT_MS);
                        }}
                        className="mt-4 w-full flex items-center justify-center border border-border rounded-md px-4 py-2 text-sm font-medium text-foreground hover:border-foreground/30 transition-colors"
                    >
                        Refresh status
                    </button>
                </div>
            )}

            <p className="mt-10 text-xs font-mono text-muted-foreground">
                Waiting for webhook confirmation…
            </p>
        </div>
    );
};

export default Processing;
