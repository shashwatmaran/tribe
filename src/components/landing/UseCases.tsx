import { motion } from "framer-motion";

const cases = [
  {
    title: "Streaming plans",
    desc: "Friends splitting Netflix, Spotify, or YouTube Premium automatically each month.",
  },
  {
    title: "SaaS seats",
    desc: "Teams sharing Figma, Notion, or Linear seats with automated per-user billing.",
  },
  {
    title: "Community tools",
    desc: "Communities pooling subscriptions for shared infrastructure and services.",
  },
  {
    title: "Startup resources",
    desc: "Early-stage teams managing shared cloud, API, and tooling costs.",
  },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="py-24 md:py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-mono text-muted-foreground mb-3"
          >
            Use cases
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Built for any shared cost
          </motion.h2>

          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {cases.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors"
              >
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
