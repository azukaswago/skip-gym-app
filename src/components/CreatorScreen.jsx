import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Check, Trash2 } from "lucide-react";

const POPULAR_EXERCISES = [
  "Bench Press",
  "Incline Bench",
  "Dumbbell Flyes",
  "Pushups",
  "Squat",
  "Leg Press",
  "Leg Extension",
  "Leg Curl",
  "Deadlift",
  "Pull Ups",
  "Lat Pulldown",
  "Bent Over Row",
  "Overhead Press",
  "Lateral Raise",
  "Front Raise",
  "Shrugs",
  "Bicep Curl",
  "Hammer Curl",
  "Tricep Pushdown",
  "Skullcrushers",
  "Plank",
  "Leg Raises",
  "Dips",
  "Face Pulls",
];

const CreatorScreen = ({ onSave, onCancel }) => {
  const [selectedDay, setSelectedDay] = useState("MONDAY");
  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState([
    { id: Date.now().toString(), name: "", weight: "", reps: "8", sets: "3" },
  ]);

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        weight: "",
        reps: "8",
        sets: "3",
      },
    ]);
  };

  const updateExercise = (id, field, value) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const removeExercise = (id) => {
    if (exercises.length > 1)
      setExercises(exercises.filter((ex) => ex.id !== id));
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="fixed inset-0 bg-black z-[300] p-6 overflow-y-auto pb-32"
    >
      <header className="flex justify-between items-center mb-8 sticky top-0 bg-black/95 py-4 z-50">
        <button onClick={onCancel} className="text-zinc-500">
          <X size={28} />
        </button>
        <h2 className="text-xl font-black italic uppercase text-orange-500">
          Creator
        </h2>
        <button
          onClick={() =>
            onSave({ day: selectedDay, name: routineName, exercises })
          }
          className="bg-orange-500 text-black p-2 rounded-full shadow-lg shadow-orange-500/20"
        >
          <Check size={24} />
        </button>
      </header>

      <div className="max-w-sm mx-auto space-y-8">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black shrink-0 transition-all ${
                selectedDay === day
                  ? "bg-orange-500 text-black"
                  : "bg-zinc-900 text-zinc-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="ROUTINE NAME (e.g. PUSH DAY)"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          className="bg-transparent text-3xl font-black uppercase italic w-full outline-none border-b-2 border-zinc-900 focus:border-orange-500 pb-2 placeholder:text-zinc-800"
        />

        <div className="space-y-4">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-zinc-800 relative group"
            >
              <button
                onClick={() => removeExercise(ex.id)}
                className="absolute top-6 right-6 text-zinc-700 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>

              <div className="relative mb-6">
                <input
                  placeholder="EXERCISE NAME"
                  value={ex.name}
                  onChange={(e) =>
                    updateExercise(ex.id, "name", e.target.value)
                  }
                  className="bg-transparent text-xl font-bold uppercase w-full outline-none border-b border-zinc-800/50 pb-2 focus:border-orange-500/50 transition-colors"
                />

                {/* AUTO-SUGGEST CHIPS */}
                {ex.name.length > 0 && !POPULAR_EXERCISES.includes(ex.name) && (
                  <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in slide-in-from-top-1">
                    {POPULAR_EXERCISES.filter((item) =>
                      item.toLowerCase().includes(ex.name.toLowerCase())
                    )
                      .slice(0, 3)
                      .map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() =>
                            updateExercise(ex.id, "name", suggestion)
                          }
                          className="text-[9px] font-black bg-zinc-800 text-orange-500 px-3 py-1 rounded-full border border-orange-500/30 active:scale-90"
                        >
                          + {suggestion}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-black/40 p-3 rounded-xl border border-zinc-800 text-center">
                  <span className="text-[8px] text-zinc-600 font-black uppercase block mb-1">
                    Target Kg
                  </span>
                  <input
                    type="number"
                    value={ex.weight}
                    onChange={(e) =>
                      updateExercise(ex.id, "weight", e.target.value)
                    }
                    className="bg-transparent w-full font-black text-sm outline-none text-center"
                  />
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-zinc-800 text-center">
                  <span className="text-[8px] text-zinc-600 font-black uppercase block mb-1">
                    Reps
                  </span>
                  <input
                    type="number"
                    value={ex.reps}
                    onChange={(e) =>
                      updateExercise(ex.id, "reps", e.target.value)
                    }
                    className="bg-transparent w-full font-black text-sm outline-none text-center"
                  />
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-zinc-800 text-center">
                  <span className="text-[8px] text-zinc-600 font-black uppercase block mb-1">
                    Sets
                  </span>
                  <input
                    type="number"
                    value={ex.sets}
                    onChange={(e) =>
                      updateExercise(ex.id, "sets", e.target.value)
                    }
                    className="bg-transparent w-full font-black text-sm outline-none text-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addExercise}
          className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-zinc-800 text-zinc-700 font-black flex items-center justify-center gap-2 hover:border-orange-500/50 hover:text-orange-500 transition-all"
        >
          <Plus size={20} /> ADD MOVEMENT
        </button>
      </div>
    </motion.div>
  );
};

export default CreatorScreen;
