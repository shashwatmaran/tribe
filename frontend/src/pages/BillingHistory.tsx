import { useParams } from "react-router-dom";
import { Download, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
import { useInvoices, useRetryCharge } from "@/hooks/api";
import { Invoice } from "@/types/api";

const BillingHistory = () => {
  const { groupId } = useParams();
  if (!groupId) return <div>Invalid group ID</div>;

  const { data: invoices, isLoading, error } = useInvoices(groupId);
  const retryCharge = useRetryCharge(groupId);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    // Convert from paise to currency (assuming 100 paise = 1 unit)
    const value = (amount / 100).toFixed(2);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(parseFloat(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRetry = (invoiceId: string) => {
    retryCharge.mutate(invoiceId, {
      onSuccess: () => {
        // Success notification could be shown here via toast
      },
    });
  };

  const handleDownloadPDF = (invoiceId: string) => {
    // This would typically call the PDF endpoint
    // invoiceAPI.downloadPDF(groupId, invoiceId)
    console.log(`Downloading invoice ${invoiceId}`);
  };

  if (isLoading) {
    return (
      <div>
        <p className="text-sm font-mono text-muted-foreground mb-1">Billing</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Payment history</h1>

        <div className="mt-8 flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-sm font-mono text-muted-foreground mb-1">Billing</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Payment history</h1>

        <div className="mt-8 flex items-center gap-3 p-4 border border-destructive/50 bg-destructive/10 rounded-md">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-medium text-destructive">Failed to load billing history</p>
            <p className="text-xs text-destructive/80">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div>
        <p className="text-sm font-mono text-muted-foreground mb-1">Billing</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Payment history</h1>

        <div className="mt-8 text-center p-6 border border-border rounded-lg">
          <p className="text-muted-foreground">No invoices found for this group</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-mono text-muted-foreground mb-1">Billing</p>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Payment history</h1>

      <div className="mt-8 border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Invoice</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Amount</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((invoice: Invoice) => (
              <tr key={invoice.id} className="hover:bg-surface/50 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-foreground">{invoice.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDate(invoice.billingDate)}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-foreground">
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded ${
                      invoice.status === "PAID"
                        ? "bg-success/10 text-success"
                        : invoice.status === "FAILED"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {invoice.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {invoice.status === "FAILED" && (
                      <button
                        onClick={() => handleRetry(invoice.id)}
                        disabled={retryCharge.isPending}
                        className="text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {retryCharge.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3 h-3" />
                        )}
                        Retry
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadPDF(invoice.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingHistory;
