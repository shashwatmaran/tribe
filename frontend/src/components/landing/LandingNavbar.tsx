import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center">
            <span className="text-background font-mono text-xs font-bold">T</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">Tribe</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
          <a href="#use-cases" className="hover:text-foreground transition-colors">Use Cases</a>
          <a href="#docs" className="hover:text-foreground transition-colors">Docs</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/join/demo"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            to="/join/demo"
            className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-md hover:bg-foreground/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
