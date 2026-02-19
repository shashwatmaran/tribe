import { motion } from "framer-motion";

const layers = [
  {
    label: "Clients",
    desc: "Web, mobile, or server-side applications",
    items: ["React SDK", "REST API", "Webhooks"],
  },
  {
    label: "Tribe Orchestration",
    desc: "Group management, split calculation, scheduling",
    items: ["Group Engine", "Split Logic", "Scheduler"],
  },
  {
    label: "Payment Providers",
    desc: "Stripe, PayPal, bank transfers",
    items: ["Stripe Connect", "PayPal", "ACH / SEPA"],
  },
  {
    label: "Subscription Platforms",
    desc: "Managed billing for upstream services",
    items: ["Netflix", "Figma", "Notion"],
  },
];

const Architecture = () => {
  return (
    <section id="architecture" className="py-24 md:py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-mono text-muted-foreground mb-3"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Layered architecture
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground max-w-lg"
          >
            Tribe sits between your application and payment infrastructure, handling the complexity of group billing.
          </motion.p>

          <div className="mt-16 space-y-4">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border border-border rounded-lg p-6 bg-card hover:border-foreground/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-6">{String(i).padStart(2, "0")}</span>
                      <h3 className="font-semibold text-foreground">{layer.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 ml-9">{layer.desc}</p>
                  </div>
                  <div className="flex gap-2 ml-9 sm:ml-0">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-surface text-surface-foreground border border-border"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
