import { useParams } from "react-router-dom";
import { Download, RotateCcw } from "lucide-react";

const invoices = [
  { id: "INV-2026-003", date: "Feb 1, 2026", amount: "$5.75", status: "paid" },
  { id: "INV-2026-002", date: "Jan 1, 2026", amount: "$5.75", status: "paid" },
  { id: "INV-2025-012", date: "Dec 1, 2025", amount: "$5.75", status: "paid" },
  { id: "INV-2025-011", date: "Nov 1, 2025", amount: "$5.75", status: "failed" },
  { id: "INV-2025-010", date: "Oct 1, 2025", amount: "$4.60", status: "paid" },
];

const BillingHistory = () => {
  const { groupId } = useParams();

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
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-surface/50 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-foreground">{inv.id}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{inv.date}</td>
                <td className="px-4 py-3 text-sm font-mono text-foreground">{inv.amount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded ${
                      inv.status === "paid"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {inv.status === "failed" && (
                      <button className="text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" />
                        Retry
                      </button>
                    )}
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
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
