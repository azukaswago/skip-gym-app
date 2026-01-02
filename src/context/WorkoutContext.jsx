import React, { createContext, useContext, useState, useEffect } from "react";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem("skip-gym-routines");
    return saved ? JSON.parse(saved) : {};
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("skip-gym-history");
    return saved ? JSON.parse(saved) : {};
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem("skip-gym-routines", JSON.stringify(routines));
    localStorage.setItem("skip-gym-history", JSON.stringify(history));
  }, [routines, history]);

  const saveRoutine = (day, routine) => {
    setRoutines((prev) => ({ ...prev, [day.toUpperCase()]: routine }));
  };

  const recordSet = (id, weight, reps, name) => {
    const entryId = `${id}-${Date.now()}`;
    setHistory((prev) => ({
      ...prev,
      [entryId]: {
        id,
        name,
        weight: parseFloat(weight),
        reps: parseInt(reps),
        date: new Date().toISOString(),
      },
    }));
  };

  const getIsPR = (exerciseName, weight) => {
    const weightNum = parseFloat(weight);
    const prev = Object.values(history).filter((h) => h.name === exerciseName);
    if (prev.length === 0) return false;
    return weightNum > Math.max(...prev.map((h) => h.weight || 0));
  };

  const clearAllData = () => {
    if (window.confirm("Wipe all data?")) {
      setRoutines({});
      setHistory({});
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        routines,
        history,
        currentIndex,
        setCurrentIndex,
        saveRoutine,
        recordSet,
        clearAllData,
        getIsPR,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
