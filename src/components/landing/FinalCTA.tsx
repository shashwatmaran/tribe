import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Stop building billing logic.
            <br />
            Start building product.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <Link
              to="/join/demo"
              className="bg-foreground text-background px-6 py-2.5 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Get started
            </Link>
            <a
              href="#docs"
              className="border border-border px-6 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Read the docs
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
