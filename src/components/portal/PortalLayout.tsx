import { Link, Outlet, useParams } from "react-router-dom";

const PortalLayout = () => {
  const { groupId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-12 px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-foreground flex items-center justify-center">
                <span className="text-background font-mono text-[10px] font-bold">T</span>
              </div>
              <span className="text-sm font-medium">Tribe</span>
            </Link>
            {groupId && (
              <>
                <span className="text-border">/</span>
                <span className="text-sm text-muted-foreground font-mono">Family Plan</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono">alice@example.com</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10 max-w-2xl">
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;
