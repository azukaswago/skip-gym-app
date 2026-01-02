import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Smartphone, ChevronRight } from "lucide-react";

const LandingScreen = ({ onGetStarted }) => {
  return (
    <div className="fixed inset-0 z-[1000] bg-black text-white p-8 flex flex-col justify-between overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-orange-500/10 blur-[120px] rounded-full" />

      <header className="mt-12">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black italic tracking-tighter"
        >
          SKIP<span className="text-orange-500">GYM</span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2"
        >
          Built for the 1%. Zero BS.
        </motion.p>
      </header>

      <div className="space-y-8">
        {[
          {
            icon: <Shield size={20} />,
            title: "100% Private",
            desc: "Data stays on your device. No cloud. No tracking.",
          },
          {
            icon: <Zap size={20} />,
            title: "Progressive Overload",
            desc: "Auto-detects plateaus and tracks PR trophies.",
          },
          {
            icon: <Smartphone size={20} />,
            title: "Offline First",
            desc: "Works deep in the basement gym with zero bars.",
          },
        ].map((feat, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex gap-4 items-start"
          >
            <div className="mt-1 text-orange-500">{feat.icon}</div>
            <div>
              <h3 className="font-black italic uppercase text-sm tracking-tight">
                {feat.title}
              </h3>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                {feat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-10 space-y-4"
      >
        <button
          onClick={onGetStarted}
          className="w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Start Training <ChevronRight size={16} />
        </button>
        <p className="text-center text-[8px] text-zinc-700 font-black uppercase tracking-widest">
          Version 1.0 — Free Forever
        </p>
      </motion.div>
    </div>
  );
};

export default LandingScreen;
