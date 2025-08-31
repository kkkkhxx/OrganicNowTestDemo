import React, { useState } from "react";
import SideBar from "../component/sidebar";

function Land() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  const removeTask = (idx) => setTasks(tasks.filter((_, i) => i !== idx));

  return (
    <div className="container">
        <SideBar />
      <h1 class="text-3xl underline">
        Hello world!
      </h1>
      <div className="inputContainer">
        <input
          className="input"
          value={task}
          placeholder="Enter a task..."
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="button" onClick={addTask}>Add</button>
      </div>

      <ul className="list">
        {tasks.map((t, i) => (
          <li key={i} className="listItem">
            {t}
            <button className="deleteBtn" onClick={() => removeTask(i)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}



export default Land;
