import { HardHat } from "lucide-react";
import { motion } from "framer-motion";

export default function EmConstrucao() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-zinc-800 rounded-lg p-6 text-white w-full max-w-3xl mx-auto mt-10 flex flex-col items-center justify-center text-center"
    >
      <HardHat className="w-16 h-16 text-yellow-400 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Página em construção</h1>
      <p className="text-gray-400">
        Estamos trabalhando para trazer essa funcionalidade o quanto antes.<br />
        Volte em breve!
      </p>
    </motion.div>
  );
}
