const LandingFooter = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-foreground flex items-center justify-center">
              <span className="text-background font-mono text-[10px] font-bold">T</span>
            </div>
            <span className="text-sm font-medium text-foreground">Tribe</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#docs" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
            <a href="#" className="hover:text-foreground transition-colors">Status</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Tribe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
