import { motion } from "framer-motion";

export default function AnimatedHeading({ text }) {
  const words = text.split(" ");
  return (
    <h1 className="text-5xl md:text-6xl font-extrabold flex flex-wrap gap-3">
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={"bg-gradient-to-r from-green-100 via-green-500 to-green-100 bg-clip-text text-transparent"}
          style={{ backgroundSize: "200% 200%" }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            backgroundPosition: ["20% 50%", "100% 50%", "20% 50%"],
          }}
          transition={{
            delay: index * 0.1, // 👈 stagger effect
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
            backgroundPosition: {
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}