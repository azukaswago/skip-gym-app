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
  Zap,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";

// --- SUB-COMPONENT: IMPROVED ONBOARDING ---
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const slides = [
    {
      title: "THE LAB",
      desc: "Tap the Calendar to enter The Lab. Track progress across 20 years (2026-2046).",
      icon: <Calendar size={40} className="text-orange-500" />,
    },
    {
      title: "SWIPE TO LOG",
      desc: "Finished a set? Swipe the workout card LEFT to log it and start the rest timer.",
      icon: <SkipForward size={40} className="text-white" />,
    },
    {
      title: "OFFLINE & PRIVATE",
      desc: "Add to Home Screen. Everything stays on your phone. Hit the Red Trash to wipe it all [cite: 2026-01-01].",
      icon: <Trash2 size={40} className="text-red-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] bg-black p-8 flex flex-col justify-between"
    >
      <div className="mt-12">
        <div className="flex gap-2 mb-12">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= step ? "bg-white" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>
        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
            {slides[step].icon}
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
            {slides[step].title}
          </h2>
          <p className="text-zinc-400 text-xl leading-relaxed font-medium">
            {slides[step].desc}
          </p>
        </motion.div>
      </div>
      <button
        onClick={() =>
          step < slides.length - 1 ? setStep(step + 1) : onComplete()
        }
        className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
      >
        {step === slides.length - 1 ? "Enter the Lab" : "Next"}{" "}
        <ChevronRight size={18} />
      </button>
    </motion.div>
  );
};

// --- SUB-COMPONENT: DAY DETAIL MODAL ---
const DayDetailModal = ({ date, logs, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[700] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
  >
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="bg-zinc-900 w-full max-w-sm rounded-[2.5rem] border border-zinc-800 p-8 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </h3>
        <button
          onClick={onClose}
          className="p-2 bg-zinc-800 rounded-full text-zinc-400"
        >
          <X size={20} />
        </button>
      </div>
      <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar">
        {logs.length > 0 ? (
          logs.map((it, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b border-zinc-800/50 pb-3"
            >
              <span className="text-sm font-black uppercase italic text-zinc-300">
                {it.name}
              </span>
              <span className="text-orange-500 font-black tabular-nums">
                {it.weight}kg x {it.reps}
              </span>
            </div>
          ))
        ) : (
          <p className="text-zinc-600 italic text-center py-4 text-xs font-bold uppercase">
            No records found
          </p>
        )}
      </div>
    </motion.div>
  </motion.div>
);

// --- INFINITE CALENDAR COMPONENT ---
const InfiniteCalendar = ({ history, onDateSelect, selectedDate }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const years = Array.from({ length: 21 }, (_, i) => 2026 + i);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay();

  const isWorkDay = (day) => {
    const dStr = `${viewDate.getFullYear()}-${String(
      viewDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return Object.values(history).some((h) => h.date?.startsWith(dStr));
  };

  return (
    <div className="w-full bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2.5rem] mt-4 shadow-inner">
      <div className="flex justify-between items-center mb-6">
        <select
          value={viewDate.getFullYear()}
          onChange={(e) =>
            setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth()))
          }
          className="bg-transparent text-orange-500 font-black italic outline-none text-lg"
        >
          {years.map((y) => (
            <option key={y} value={y} className="bg-black">
              {y}
            </option>
          ))}
        </select>
        <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-[160px]">
          {months.map((m, i) => (
            <button
              key={m}
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), i))}
              className={`text-[9px] font-black px-2 py-1 rounded-md transition-all ${
                viewDate.getMonth() === i
                  ? "bg-white text-black"
                  : "text-zinc-600"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <span
            key={d}
            className="text-[8px] font-black text-zinc-800 uppercase"
          >
            {d}
          </span>
        ))}
        {Array(firstDay)
          .fill(0)
          .map((_, i) => (
            <div key={i} />
          ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const active = isWorkDay(day);
          return (
            <button
              key={day}
              onClick={() =>
                onDateSelect(
                  new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
                )
              }
              className={`aspect-square rounded-full flex flex-col items-center justify-center text-[11px] font-black transition-all relative ${
                active ? "text-white" : "text-zinc-700 hover:text-zinc-400"
              }`}
            >
              {day}
              {active && (
                <div className="w-1 h-1 bg-orange-500 rounded-full mt-0.5 shadow-[0_0_8px_#f97316]" />
              )}
            </button>
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
  } = useWorkout();

  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [view, setView] = useState("train");
  const [selectedCalDate, setSelectedCalDate] = useState(null);
  const [rest, setRest] = useState(60);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
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

  // FIXED: Logic to group the entire last session (all exercises logged on the latest date)
  const lastSessionData = useMemo(() => {
    const logs = Object.values(history);
    if (!logs.length) return null;
    const latestDateStr = logs
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      .date.split("T")[0];
    return logs.filter((l) => l.date.startsWith(latestDateStr));
  }, [history]);

  const selectedDayLogs = useMemo(() => {
    if (!selectedCalDate) return [];
    const dStr = selectedCalDate.toISOString().split("T")[0];
    return Object.values(history).filter((h) => h.date?.startsWith(dStr));
  }, [selectedCalDate, history]);

  const exHistory = useMemo(() => {
    if (!exercise?.name) return [];
    return Object.values(history)
      .filter((h) => h.name === exercise.name)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [exercise, history]);

  useEffect(() => {
    if (exercise) {
      setWeight(exercise.weight || "");
      setReps(exercise.reps || "");
      setActiveSet(1);
    }
  }, [currentIndex, exercise, selectedDay]);

  useEffect(() => {
    let t;
    if (isResting && timeLeft > 0)
      t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    else if (timeLeft <= 0 && isResting) setIsResting(false);
    return () => clearInterval(t);
  }, [isResting, timeLeft]);

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

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center overflow-x-hidden pb-32 select-none">
      <AnimatePresence>
        {showLanding && (
          <LandingScreen
            onGetStarted={() => {
              setShowLanding(false);
              if (!localStorage.getItem("skip-gym-onboarding-done"))
                setShowOnboarding(true);
            }}
          />
        )}
        {showOnboarding && (
          <Onboarding
            onComplete={() => {
              localStorage.setItem("skip-gym-onboarding-done", "true");
              setShowOnboarding(false);
            }}
          />
        )}
        {selectedCalDate && (
          <DayDetailModal
            date={selectedCalDate}
            logs={selectedDayLogs}
            onClose={() => setSelectedCalDate(null)}
          />
        )}
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
            onClick={() => {
              if (
                window.confirm(
                  "Master Reset: Clear all data? [cite: 2026-01-01]"
                )
              )
                clearAllData();
            }}
            className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-red-900 border border-zinc-800 active:bg-red-500/10"
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
          {routine ? (
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, i) => {
                if (i.offset.x < -100) handleNext();
              }}
              className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[3.5rem] aspect-[4/5] flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Dumbbell size={120} />
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-4xl font-black uppercase italic leading-tight truncate pr-4">
                    {exercise?.name}
                  </h2>
                  <div className="bg-orange-500 text-black px-3 py-1 rounded-full font-black text-[10px] shrink-0">
                    SET {activeSet}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 bg-black/40 p-2.5 px-4 rounded-full border border-zinc-800/50 w-fit">
                  <History size={12} className="text-orange-500/50" />
                  <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">
                    {exHistory[0]
                      ? `Prev: ${exHistory[0].weight}kg x ${exHistory[0].reps}`
                      : "New Move"}
                  </span>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-3xl border border-zinc-800">
                  <button
                    onClick={() =>
                      setWeight((w) =>
                        Math.max(0, (parseFloat(w) || 0) - 2.5).toString()
                      )
                    }
                    className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-orange-500"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="text-center">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={weight}
                      onChange={(e) =>
                        setWeight(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      className="bg-transparent text-white text-3xl font-black w-24 text-center outline-none tabular-nums"
                    />
                    <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                      KG
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setWeight((w) => ((parseFloat(w) || 0) + 2.5).toString())
                    }
                    className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-orange-500"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-3xl border border-zinc-800">
                  <button
                    onClick={() =>
                      setReps((r) =>
                        Math.max(0, (parseInt(r) || 0) - 1).toString()
                      )
                    }
                    className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-orange-500"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="text-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={reps}
                      onChange={(e) =>
                        setReps(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="bg-transparent text-white text-3xl font-black w-24 text-center outline-none tabular-nums"
                    />
                    <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                      Reps
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setReps((r) => ((parseInt(r) || 0) + 1).toString())
                    }
                    className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center active:bg-orange-500"
                  >
                    <Plus size={20} />
                  </button>
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
        </motion.div>
      )}

      {view === "stats" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
            The Lab
          </h2>
          <InfiniteCalendar
            history={history}
            onDateSelect={setSelectedCalDate}
          />

          <div className="mt-8 bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem]">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">
              Last Session Overview
            </h3>
            {lastSessionData ? (
              <div className="space-y-3">
                {lastSessionData.map((l, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-zinc-800/50"
                  >
                    <span className="text-[10px] font-black uppercase italic">
                      {l.name}
                    </span>
                    <span className="text-[10px] text-orange-500 font-bold">
                      {l.weight}kg x {l.reps}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-700 italic text-center py-4">
                No data recorded yet.
              </p>
            )}
          </div>

          <div className="mt-16 pb-8 text-center opacity-20">
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">
              Property of SKIPGYM
            </p>
            <p className="text-[7px] font-bold uppercase tracking-widest mt-1">
              Built for the 1% by AZUKA— 2026 [cite: 2026-01-01]
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
