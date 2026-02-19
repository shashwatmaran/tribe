import { Link, useParams } from "react-router-dom";
import { Calendar, Copy, LogOut } from "lucide-react";

const members = [
  { name: "Alice (you)", email: "alice@example.com", status: "paid", owner: true },
  { name: "Bob", email: "bob@example.com", status: "paid", owner: false },
  { name: "Carol", email: "carol@example.com", status: "pending", owner: false },
  { name: "Dave", email: "dave@example.com", status: "paid", owner: false },
];

const GroupDashboard = () => {
  const { groupId } = useParams();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-mono text-muted-foreground mb-1">Group</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Family Netflix Plan</h1>
        </div>
        <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Next: Mar 1</span>
        </div>
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {members.map((m) => (
          <div key={m.email} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                <span className="text-xs font-medium text-surface-foreground">{m.name[0]}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {m.name}
                  {m.owner && <span className="ml-2 text-xs font-mono text-muted-foreground">owner</span>}
                </p>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </div>
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                m.status === "paid"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}
            >
              {m.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button className="flex items-center justify-center gap-2 border border-border rounded-md px-4 py-2.5 text-sm font-medium text-foreground hover:border-foreground/30 transition-colors flex-1">
          <Copy className="w-4 h-4" />
          Invite member
        </button>
        <Link
          to={`/group/${groupId}/billing`}
          className="flex items-center justify-center gap-2 border border-border rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex-1"
        >
          View billing
        </Link>
        <button className="flex items-center justify-center gap-2 border border-border rounded-md px-4 py-2.5 text-sm font-medium text-destructive hover:border-destructive/30 transition-colors">
          <LogOut className="w-4 h-4" />
          Leave
        </button>
      </div>

      <div className="mt-8 border border-border rounded-md p-4 bg-surface">
        <p className="text-sm font-medium text-foreground">Your status</p>
        <p className="text-sm text-muted-foreground mt-1">All payments current · Next charge $5.75 on March 1</p>
      </div>
    </div>
  );
};

export default GroupDashboard;
