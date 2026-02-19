import { motion } from "framer-motion";

const metrics = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<200ms", label: "API latency" },
  { value: "SOC 2", label: "Compliance" },
  { value: "PCI L1", label: "Certified" },
];

const Trust = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-mono text-muted-foreground mb-3"
          >
            Reliability
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Built for developers
          </motion.h2>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="text-center"
              >
                <span className="text-2xl md:text-3xl font-bold text-foreground font-mono">{m.value}</span>
                <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex items-center justify-center gap-8 md:gap-12"
          >
            {["Acme Corp", "Globex", "Initech", "Umbrella", "Cyberdyne"].map((name) => (
              <span key={name} className="text-sm font-medium text-muted-foreground/50">{name}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
