import { motion } from "framer-motion";

const codeLines = [
  { text: "// Initialize a shared subscription group", type: "comment" },
  { text: "" },
  { text: "const", type: "keyword", rest: " group = " },
  { text: "await", type: "keyword", rest: " tribe." },
  { text: "createGroup", type: "accent", rest: "({" },
  { text: '  name: ', rest: '"Family Netflix Plan"', restType: "string", suffix: "," },
  { text: '  billingCycle: ', rest: '"monthly"', restType: "string", suffix: "," },
  { text: "});" },
  { text: "" },
  { text: "await", type: "keyword", rest: " tribe." },
  { text: "addMembers", type: "accent", rest: "(group.id, [" },
  { text: '  ', rest: '"user_alice"', restType: "string", suffix: "," },
  { text: '  ', rest: '"user_bob"', restType: "string", suffix: "," },
  { text: '  ', rest: '"user_carol"', restType: "string" },
  { text: "]);" },
  { text: "" },
  { text: "await", type: "keyword", rest: " tribe." },
  { text: "attachSubscription", type: "accent", rest: "(group.id, {" },
  { text: '  provider: ', rest: '"netflix"', restType: "string", suffix: "," },
  { text: "  planId: ", rest: '"premium_4k"', restType: "string", suffix: "," },
  { text: "  totalAmount: 2299," },
  { text: "});" },
  { text: "" },
  { text: "// Tribe auto-calculates splits and settles", type: "comment" },
  { text: "await", type: "keyword", rest: " tribe." },
  { text: "autoSettle", type: "accent", rest: "(group.id);" },
];

const CodeExample = () => {
  return (
    <section id="docs" className="py-24 md:py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-mono text-muted-foreground mb-3"
          >
            Developer experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Four API calls to split anything
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-10 rounded-lg overflow-hidden border border-border"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-foreground/[0.03] border-b border-border">
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="text-xs font-mono text-muted-foreground ml-2">quickstart.ts</span>
            </div>
            <div className="code-block p-6 overflow-x-auto">
              <pre className="text-sm leading-7">
                {codeLines.map((line, i) => (
                  <div key={i}>
                    {line.type === "comment" && (
                      <span className="code-comment">{line.text}</span>
                    )}
                    {line.type === "keyword" && (
                      <>
                        <span className="code-keyword">{line.text}</span>
                        <span>{line.rest}</span>
                      </>
                    )}
                    {line.type === "accent" && (
                      <>
                        <span className="code-accent">{line.text}</span>
                        <span>{line.rest}</span>
                      </>
                    )}
                    {!line.type && line.rest && (
                      <>
                        <span>{line.text}</span>
                        <span className={line.restType === "string" ? "code-string" : ""}>{line.rest}</span>
                        {line.suffix && <span>{line.suffix}</span>}
                      </>
                    )}
                    {!line.type && !line.rest && (
                      <span>{line.text}</span>
                    )}
                  </div>
                ))}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CodeExample;
