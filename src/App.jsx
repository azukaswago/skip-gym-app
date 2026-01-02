import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutProvider, useWorkout } from "./context/WorkoutContext";
import CreatorScreen from "./components/CreatorScreen";
import LandingScreen from "./components/LandingScreen";
import {
  SkipForward,
  Plus,
  Minus,
  ChevronRight,
  Trash2,
  History,
  Calendar,
  Dumbbell,
  Flame,
  Clock,
  Trophy,
  Timer,
  AlertTriangle,
  Download,
  Upload,
  Zap,
} from "lucide-react";

const ActivityCalendar = ({ history = {} }) => {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d;
  });

  return (
    <div className="w-full bg-zinc-900/50 p-6 rounded-[2.5rem] border border-zinc-800 mt-6">
      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">
        Activity Heatmap
      </h3>
      <div className="flex justify-between items-end h-16 gap-1.5">
        {days.map((date, i) => {
          const ds = date.toISOString().split("T")[0];
          const active = Object.values(history).some((h) =>
            h?.date?.startsWith(ds)
          );
          return (
            <div key={i} className="flex flex-col items-center gap-3 flex-1">
              <div
                className={`w-full rounded-full transition-all duration-700 ${
                  active
                    ? "bg-orange-500 h-10 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    : "bg-zinc-800 h-3"
                }`}
              />
              <span className="text-[8px] font-black text-zinc-700 uppercase">
                {date.toLocaleDateString("en-US", { weekday: "narrow" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function WorkoutApp() {
  const {
    routines,
    history,
    currentIndex,
    setCurrentIndex,
    saveRoutine,
    recordSet,
    clearAllData,
    getIsPR,
    exportData,
    importData,
  } = useWorkout();

  const [hasLaunched, setHasLaunched] = useState(
    () => localStorage.getItem("skip-gym-launched") === "true"
  );
  const [view, setView] = useState("train");
  const [rest, setRest] = useState(60);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const [activeSet, setActiveSet] = useState(1);

  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const [selectedDay, setSelectedDay] = useState(days[new Date().getDay()]);

  const routine = routines[selectedDay.toUpperCase()];
  const exercise = routine?.exercises?.[currentIndex];

  const exHistory = useMemo(() => {
    if (!exercise?.name) return [];
    return Object.values(history)
      .filter((h) => h.name === exercise.name)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [exercise, history]);

  const plateau = useMemo(() => {
    const dailyBests = [];
    const seenDates = new Set();
    for (let entry of exHistory) {
      const d = entry.date.split("T")[0];
      if (!seenDates.has(d)) {
        dailyBests.push(entry.weight);
        seenDates.add(d);
      }
      if (dailyBests.length === 3) break;
    }
    if (dailyBests.length < 3) return false;
    return dailyBests.every((w) => w <= dailyBests[dailyBests.length - 1]);
  }, [exHistory]);

  const prList = useMemo(() => {
    const records = {};
    Object.values(history).forEach((entry) => {
      if (!records[entry.name] || entry.weight > records[entry.name].weight) {
        records[entry.name] = entry;
      }
    });
    return Object.values(records).sort((a, b) => a.name.localeCompare(b.name));
  }, [history]);

  useEffect(() => {
    if (exercise) {
      setWeight(exercise.weight || 0);
      setReps(exercise.reps || 0);
      setActiveSet(1);
    }
  }, [currentIndex, exercise, selectedDay]);

  useEffect(() => {
    let t;
    if (isResting && timeLeft > 0) {
      t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft <= 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(t);
  }, [isResting, timeLeft]);

  const handleStart = () => {
    localStorage.setItem("skip-gym-launched", "true");
    setHasLaunched(true);
  };

  const handleNext = () => {
    if (exercise) recordSet(exercise.id, weight, reps, exercise.name);
    const total = parseInt(exercise?.sets) || 3;
    if (activeSet < total) {
      setActiveSet((p) => p + 1);
      if (rest > 0) {
        setTimeLeft(rest);
        setIsResting(true);
      }
    } else if (currentIndex < (routine?.exercises?.length || 0) - 1) {
      setCurrentIndex((p) => p + 1);
      if (rest > 0) {
        setTimeLeft(rest);
        setIsResting(true);
      }
    } else {
      alert("Session Complete");
      setCurrentIndex(0);
      setActiveSet(1);
    }
  };

  const groups = useMemo(() => {
    return Object.values(history).reduce((acc, curr) => {
      const k = curr.date?.split("T")[0];
      if (!k) return acc;
      if (!acc[k]) acc[k] = [];
      acc[k].push(curr);
      return acc;
    }, {});
  }, [history]);

  const dates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center overflow-x-hidden pb-32">
      <AnimatePresence>
        {!hasLaunched && <LandingScreen onGetStarted={handleStart} />}
        {isResting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            <div className="text-[120px] font-black italic tabular-nums text-orange-500">
              {timeLeft}
            </div>
            <button
              onClick={() => setIsResting(false)}
              className="bg-zinc-800 p-8 rounded-full border border-zinc-700 mt-10"
            >
              <SkipForward size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === "create" && (
          <CreatorScreen
            onCancel={() => setView("train")}
            onSave={(d) => {
              saveRoutine(d.day, d);
              setView("train");
            }}
          />
        )}
      </AnimatePresence>

      <header className="mb-6 w-full max-w-sm flex justify-between items-center">
        <h1 className="text-3xl font-black italic tracking-tighter">
          SKIP<span className="text-orange-500">GYM</span>
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setRest(
                (r) => [60, 90, 120, 0][([60, 90, 120, 0].indexOf(r) + 1) % 4]
              )
            }
            className="w-16 h-10 bg-zinc-900 rounded-full flex items-center justify-center gap-1 border border-zinc-800 text-[10px] font-black"
          >
            <Timer
              size={14}
              className={rest > 0 ? "text-orange-500" : "text-zinc-600"}
            />{" "}
            {rest > 0 ? `${rest}s` : "OFF"}
          </button>
          <button
            onClick={clearAllData}
            className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-red-900 border border-zinc-800"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setView("create")}
            className="w-10 h-10 bg-orange-500 text-black rounded-full flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      {view === "train" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-sm"
        >
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 py-1">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelectedDay(d);
                  setCurrentIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black border shrink-0 transition-all ${
                  selectedDay === d
                    ? "bg-white text-black border-white"
                    : "bg-zinc-900 text-zinc-600 border-zinc-800"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <main>
            {routine ? (
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, i) => {
                  if (i.offset.x < -100) handleNext();
                }}
                className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[3.5rem] aspect-[4/5] flex flex-col justify-between shadow-2xl relative"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-4xl font-black uppercase italic leading-tight truncate pr-4">
                      {exercise?.name}
                    </h2>
                    <div className="bg-orange-500 text-black px-3 py-1 rounded-full font-black text-[10px] shrink-0">
                      SET {activeSet}
                    </div>
                  </div>
                  {plateau && (
                    <div className="flex items-center gap-1 text-red-500 mt-2 font-black text-[9px] uppercase">
                      <AlertTriangle size={10} /> Plateau Warning
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-2 bg-black/40 p-2.5 px-4 rounded-full border border-zinc-800/50 w-fit">
                    <History size={12} className="text-orange-500/50" />
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
                      {exHistory[0]
                        ? `Prev: ${exHistory[0].weight}kg x ${exHistory[0].reps}`
                        : "New Move"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-black/40 p-4 rounded-3xl border border-zinc-800">
                    <button
                      onClick={() =>
                        setWeight((w) => Math.max(0, parseFloat(w) - 2.5))
                      }
                      className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-orange-500"
                    >
                      <Minus size={20} />
                    </button>
                    <div className="text-center">
                      <span className="text-3xl font-black tabular-nums">
                        {weight}
                      </span>
                      <span className="block text-[8px] font-black text-zinc-600 uppercase">
                        KG
                      </span>
                    </div>
                    <button
                      onClick={() => setWeight((w) => parseFloat(w) + 2.5)}
                      className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-orange-500"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center bg-black/40 p-4 rounded-3xl border border-zinc-800">
                    <button
                      onClick={() =>
                        setReps((r) => Math.max(0, parseInt(r) - 1))
                      }
                      className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-orange-500"
                    >
                      <Minus size={20} />
                    </button>
                    <div className="text-center">
                      <span className="text-3xl font-black tabular-nums">
                        {reps}
                      </span>
                      <span className="block text-[8px] font-black text-zinc-600 uppercase">
                        Reps
                      </span>
                    </div>
                    <button
                      onClick={() => setReps((r) => parseInt(r) + 1)}
                      className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-orange-500"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-1 pt-2 opacity-20">
                    <ChevronRight size={14} />
                    <span className="text-[7px] font-black uppercase tracking-[0.4em]">
                      Swipe Log
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20 opacity-20 flex flex-col items-center">
                <Flame size={48} />
                <span className="text-xs font-black mt-4 italic uppercase">
                  Rest Day
                </span>
              </div>
            )}
          </main>
        </motion.div>
      )}

      {view === "stats" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2 italic">
            The Lab
          </h2>
          <ActivityCalendar history={history} />

          <div className="mt-10 space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">
              Records
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {prList.length > 0 ? (
                prList.map((pr, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Zap size={12} className="text-orange-500" />
                      <Trophy size={10} className="text-zinc-700" />
                    </div>
                    <p className="text-[10px] font-black text-zinc-300 uppercase truncate mb-1">
                      {pr.name}
                    </p>
                    <p className="text-xl font-black">{pr.weight}kg</p>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-zinc-800 font-bold col-span-2 text-center py-4 italic uppercase">
                  No records
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 space-y-6">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">
              History
            </h3>
            {dates.map((d) => (
              <div
                key={d}
                className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2.5rem] mb-4"
              >
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4 text-orange-500 font-black italic text-xs uppercase">
                  {new Date(d).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  <Clock size={14} className="text-zinc-700" />
                </div>
                <div className="space-y-3">
                  {groups[d].map((it, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-xs font-black uppercase italic"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-300">{it.name}</span>
                        {getIsPR(it.name, it.weight) && (
                          <Trophy
                            size={12}
                            className="text-orange-500"
                            fill="currentColor"
                          />
                        )}
                      </div>
                      <div className="text-white">
                        {it.weight}kg <span className="text-zinc-600">x</span>{" "}
                        {it.reps}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-3 mt-12">
              <button
                onClick={exportData}
                className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[9px] uppercase border border-zinc-800 flex items-center justify-center gap-2 active:scale-95"
              >
                <Download size={12} /> Backup
              </button>
              <label className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[9px] uppercase border border-zinc-800 text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                <Upload size={12} /> Restore{" "}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => importData(e.target.files[0])}
                />
              </label>
            </div>
          </div>
          {/* Digital Signature / Watermark */}
          <div className="mt-16 pb-8 text-center opacity-20">
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">
              Property of SKIPGYM
            </p>
            <p className="text-[7px] font-bold uppercase tracking-widest mt-1">
              Built for the 1% by AZUKA— 2026
            </p>
          </div>
        </motion.div>
      )}

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-12 z-[100] bg-zinc-900/90 backdrop-blur-xl px-12 py-5 rounded-[2.5rem] border border-zinc-800">
        <button
          onClick={() => setView("train")}
          className={view === "train" ? "text-orange-500" : "text-zinc-600"}
        >
          <Dumbbell size={24} />
        </button>
        <button
          onClick={() => setView("stats")}
          className={view === "stats" ? "text-orange-500" : "text-zinc-600"}
        >
          <Calendar size={24} />
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <WorkoutProvider>
      <WorkoutApp />
    </WorkoutProvider>
  );
}
