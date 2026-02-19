import { motion } from "framer-motion";

const SystemDiagram = () => {
  const nodes = [
    { label: "User", sub: "client app" },
    { label: "Tribe API", sub: "orchestration" },
    { label: "Providers", sub: "payment rails" },
    { label: "Settlement", sub: "auto-split" },
  ];

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {nodes.map((node, i) => (
        <div key={node.label} className="flex items-center gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="border border-border rounded-md px-3 py-2 md:px-4 md:py-3 bg-card text-center min-w-[72px]">
              <span className="text-xs font-mono font-medium text-foreground">{node.label}</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">{node.sub}</span>
          </motion.div>
          {i < nodes.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 + i * 0.15, duration: 0.4 }}
              className="flex items-center gap-0.5 -mt-4"
            >
              <div className="w-4 md:w-6 h-px bg-border" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" style={{ animationDelay: `${i * 0.4}s` }} />
              <div className="w-4 md:w-6 h-px bg-border" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="container mx-auto px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-mono text-muted-foreground mb-4"
              >
                API infrastructure for shared payments
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-foreground text-balance"
              >
                Shared payments without shared headaches.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md"
              >
                Infrastructure for group subscriptions, seat splitting, and automated settlements.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-8 flex items-center gap-4"
              >
                <a
                  href="#docs"
                  className="bg-foreground text-background px-5 py-2.5 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  Read the docs
                </a>
                <a
                  href="#architecture"
                  className="border border-border px-5 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  View architecture
                </a>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden md:flex justify-center"
            >
              <SystemDiagram />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
