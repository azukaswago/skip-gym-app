import React, { createContext, useContext, useState, useEffect } from "react";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [routines, setRoutines] = useState({});
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Access the Telegram WebApp Object
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand(); // Opens the app to full height

      // Pull data from Telegram Cloud
      tg.CloudStorage.getItems(["routines", "history"], (err, values) => {
        if (!err) {
          if (values.routines) setRoutines(JSON.parse(values.routines));
          if (values.history) setHistory(JSON.parse(values.history));
        }
      });
    }
  }, []);

  const saveRoutine = (day, routineData) => {
    const newRoutines = { ...routines, [day]: routineData };
    setRoutines(newRoutines);
    tg?.CloudStorage.setItem("routines", JSON.stringify(newRoutines));
    tg?.HapticFeedback.notificationOccurred("success");
  };

  const recordSet = (id, weight, reps, name) => {
    const entry = {
      id: crypto.randomUUID(), // Unique ID for every log
      exerciseId: id,
      name: name.toUpperCase(),
      weight,
      reps,
      date: new Date().toISOString(),
    };
    const newHistory = [...history, entry];
    setHistory(newHistory);
    tg?.CloudStorage.setItem("history", JSON.stringify(newHistory));
  };

  const clearAllData = () => {
    setRoutines({});
    setHistory([]);
    tg?.CloudStorage.removeItems(["routines", "history"]);
    tg?.HapticFeedback.notificationOccurred("warning");
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
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
