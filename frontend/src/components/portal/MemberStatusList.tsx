type MemberPaymentStatus = "paid" | "due" | "failed";

interface Member {
    name: string;
    email: string;
    status: MemberPaymentStatus;
    isYou?: boolean;
}

const statusBadge: Record<MemberPaymentStatus, string> = {
    paid: "bg-green-500/10 text-green-600 border-green-500/20",
    due: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    failed: "bg-red-500/10 text-red-600 border-red-500/20",
};

interface MemberStatusListProps {
    members: Member[];
}

const MemberStatusList = ({ members }: MemberStatusListProps) => {
    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-surface">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    Member payment status
                </p>
            </div>
            <div className="divide-y divide-border">
                {members.map((m) => (
                    <div key={m.email} className="flex items-center justify-between px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {m.name}
                                {m.isYou && (
                                    <span className="ml-2 text-xs font-mono text-muted-foreground">you</span>
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">{m.email}</p>
                        </div>
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-semibold tracking-widest ${statusBadge[m.status]}`}
                        >
                            {m.status.toUpperCase()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemberStatusList;
