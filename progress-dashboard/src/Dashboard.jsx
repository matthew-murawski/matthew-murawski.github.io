import { useState, useEffect } from "react";

export default function Dashboard() {
  const [journalEntry, setJournalEntry] = useState("");
  const [savedEntries, setSavedEntries] = useState(() => {
    const stored = localStorage.getItem("journalEntries");
    return stored ? JSON.parse(stored) : [];
  });

  const [tasks, setTasks] = useState([
    { id: 1, text: "Submit Herman paper", done: false },
    { id: 2, text: "Finish MCAT diagnostic", done: false },
    { id: 3, text: "Shadow Dr. X for 4 hours", done: false },
  ]);

  const handleTaskToggle = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(savedEntries));
  }, [savedEntries]);

  const saveJournalEntry = () => {
    if (journalEntry.trim()) {
      const newEntries = [
        { text: journalEntry, date: new Date().toLocaleString() },
        ...savedEntries,
      ];
      setSavedEntries(newEntries);
      setJournalEntry("");
    }
  };

  const completedTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 min-h-screen bg-gray-100">
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">🧠 Daily Journal</h2>
        <textarea
          placeholder="What's on your mind?"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="w-full border rounded p-2 mb-2"
        />
        <button
          onClick={saveJournalEntry}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Entry
        </button>
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {savedEntries.map((entry, idx) => (
            <div key={idx} className="border rounded p-2">
              <div className="text-sm text-gray-500 mb-1">{entry.date}</div>
              <div>{entry.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">📋 Goals & Tasks</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-2"
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleTaskToggle(task.id)}
              />
              <span className={task.done ? "line-through text-gray-500" : ""}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {completedTasks}/{totalTasks} tasks completed
          </div>
        </div>
      </div>
    </div>
  );
}