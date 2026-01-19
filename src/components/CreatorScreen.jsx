import React, { useState, useEffect } from "react";
import { X, Trash2, Save, Plus } from "lucide-react";
import { motion } from "framer-motion";

const CreatorScreen = ({ onSave, onCancel, routines }) => {
  const [day, setDay] = useState("MONDAY");
  const [exercises, setExercises] = useState([]);

  // Load existing data when switching days
  useEffect(() => {
    if (routines[day]) {
      setExercises(routines[day].exercises || []);
    } else {
      setExercises([]);
    }
  }, [day, routines]);

  const addEx = () => {
    setExercises([
      ...exercises,
      { id: Date.now(), name: "", sets: 3, weight: "", reps: "" },
    ]);
  };

  const updateEx = (id, field, val) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: val } : ex)),
    );
  };

  const removeEx = (id) => setExercises(exercises.filter((ex) => ex.id !== id));

  const weekProgress = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ].map((d) => ({
    name: d,
    exists: !!routines[d],
    count: routines[d]?.exercises?.length || 0,
  }));

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="fixed inset-0 z-[1000] bg-black overflow-y-auto pb-40 p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
            Architect
          </h2>
          <p className="text-[8px] text-zinc-600 font-bold tracking-widest uppercase">
            Routine Builder
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400"
        >
          <X size={18} />
        </button>
      </div>

      {/* WEEK STATUS GRID */}
      <div className="mb-8 grid grid-cols-4 gap-2">
        {weekProgress.map((d) => (
          <div
            key={d.name}
            className={`p-2 rounded-xl border flex flex-col items-center justify-center ${d.exists ? "border-orange-500/40 bg-orange-500/5" : "border-zinc-800 bg-zinc-900/20"}`}
          >
            <span
              className={`text-[7px] font-black ${d.exists ? "text-orange-500" : "text-zinc-600"}`}
            >
              {d.name.slice(0, 3)}
            </span>
            <span className="text-[9px] font-bold mt-0.5 text-zinc-400">
              {d.count}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* DAY SELECTOR */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {weekProgress.map((d) => (
            <button
              key={d.name}
              onClick={() => setDay(d.name)}
              className={`px-4 py-2.5 rounded-xl text-[9px] font-black border shrink-0 transition-all ${day === d.name ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-500 border-zinc-800"}`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* EXERCISE LIST */}
        <div className="space-y-4">
          {exercises.map((ex, idx) => (
            <div
              key={ex.id}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-[1.5rem] space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-black text-zinc-700 uppercase">
                  #0{idx + 1}
                </span>
                <button
                  onClick={() => removeEx(ex.id)}
                  className="text-red-900 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                placeholder="EXERCISE NAME"
                value={ex.name}
                onChange={(e) =>
                  updateEx(ex.id, "name", e.target.value.toUpperCase())
                }
                className="bg-transparent text-white text-lg font-black italic w-full outline-none border-b border-zinc-800 pb-1 placeholder:text-zinc-800"
              />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sets", field: "sets", ph: "3" },
                  { label: "Weight", field: "weight", ph: "40" },
                  { label: "Reps", field: "reps", ph: "10" },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="text-[7px] font-black text-zinc-600 uppercase mb-1 block">
                      {f.label}
                    </label>
                    <input
                      type="number"
                      placeholder={f.ph}
                      value={ex[f.field]}
                      onChange={(e) => updateEx(ex.id, f.field, e.target.value)}
                      className="bg-zinc-800 text-white w-full p-2.5 rounded-lg text-[10px] font-bold outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={addEx}
            className="w-full py-4 border-2 border-dashed border-zinc-900 rounded-2xl text-[8px] font-black uppercase text-zinc-700 hover:text-orange-500 hover:border-orange-500 transition-all"
          >
            + Add Exercise to {day}
          </button>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={() => onSave({ day, exercises })}
          className="w-full bg-orange-500 text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save size={14} /> Save {day} Routine
        </button>
      </div>
    </motion.div>
  );
};

export default CreatorScreen;
