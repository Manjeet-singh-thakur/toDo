import React, { useState, useEffect } from "react";
import "./todo.css";

const Todo = () => {
  const [value, setValue] = useState("");
  const [list, setList] = useState(() => {
    const storedList = JSON.parse(localStorage.getItem("todoList"));
    return storedList ? storedList : [];
  });
  const [comp, setComp] = useState(() => {
    const storedComp = JSON.parse(localStorage.getItem("completedList"));
    return storedComp ? storedComp : [];
  });
  const [error, setError] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem("completedList", JSON.stringify(comp));
  }, [comp]);

  const storeValue = (e) => {
    e.preventDefault();
    if (value.trim() === "") {
      setError(true);
    } else {
      setList([...list, { task: value, subtasks: [] }]);
      setValue("");
      setError(false);
      localStorage.setItem(
        "todoList",
        JSON.stringify([...list, { task: value, subtasks: [] }])
      );
    }
  };
  const searchTask = (task) => {
    const regex = new RegExp(task, "i");
    const allTasks = [...list, ...comp];
    const results = allTasks.filter((t) => regex.test(t.task));
    setSearchResults(results);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchTask(value);
  };

  const deleteValue = (index, isCompleted) => {
    if (isCompleted) {
      const data = [...comp];
      data.splice(index, 1);
      setComp(data);
      localStorage.setItem("completedList", JSON.stringify(data));
    } else {
      const data = [...list];
      data.splice(index, 1);
      setList(data);
      localStorage.setItem("todoList", JSON.stringify(data));
    }
  };

  const completed = (index) => {
    const data = [...list];
    const [splicedValue] = data.splice(index, 1);
    setComp([...comp, splicedValue]);
    setList(data);
    localStorage.setItem("todoList", JSON.stringify(data));
    localStorage.setItem("completedList", JSON.stringify(comp));
  };

  const editValue = (index, isCompleted) => {
    const data = isCompleted ? [...comp] : [...list];
    const newValue = prompt("Please enter a new value", data[index].task);
    if (newValue !== null && newValue.trim() !== "") {
      data[index].task = newValue;
      isCompleted ? setComp(data) : setList(data);
      localStorage.setItem(
        isCompleted ? "completedList" : "todoList",
        JSON.stringify(data)
      );
    }
  };

  const addSubtask = (index, isCompleted) => {
    const data = isCompleted ? [...comp] : [...list];
    const newValue = prompt("Please enter a subtask");
    if (newValue !== null && newValue.trim() !== "") {
      data[index].subtasks.push(newValue);
      isCompleted ? setComp(data) : setList(data);
      localStorage.setItem(
        isCompleted ? "completedList" : "todoList",
        JSON.stringify(data)
      );
    }
  };

  const displayTasks = (tasks, isCompleted) =>
    tasks.map((item, index) => (
      <div key={index}>
        <div>
          <p>Main Task : {item.task}</p>
          <ol className="ol">
            {item.subtasks.map((subtask, subIndex) => (
              <li key={subIndex}>Subtask : {subtask}</li>
            ))}
          </ol>
        </div>
        <button onClick={() => deleteValue(index, isCompleted)}>Delete</button>
        <button onClick={() => editValue(index, isCompleted)}>Edit</button>
        {isCompleted ? (
          ""
        ) : (
          <button onClick={() => addSubtask(index, isCompleted)}>
            Add Subtask
          </button>
        )}
        {!isCompleted && (
          <button onClick={() => completed(index)}>Mark Complete</button>
        )}
      </div>
    ));

  return (
    <>
      <div>
        <h5 style={{ fontSize: "20px" }}>Write Your Own Task To Memorize</h5>
      </div>
      <div>
        <p>Search Task</p>
        <input
          className="text"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search Your Task"
        />
        <br />
        <br />
        <form onSubmit={storeValue}>
          <input
            className="text1"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write Your Task"
          />
          <button
            style={{
              background: "black",
              color: "white",
              marginLeft: "-3px",
              padding: "9px",
            }}
            type="submit"
          >
            Add
          </button>
        </form>
      </div>
      <div className="show">
        <h3 onClick={() => setShowCompleted(true)}>Completed</h3>
        <h3 onClick={() => setShowCompleted(false)}>Incompleted</h3>
      </div>
      <div>
        {search ? (
          <div>
            <h4>Search Results</h4>
            {searchResults.length > 0 ? (
              displayTasks(searchResults, false)
            ) : (
              <p>No results found</p>
            )}
          </div>
        ) : showCompleted ? (
          <div className="incom">
            <h4>Completed Tasks</h4>
            {displayTasks(comp, true)}
          </div>
        ) : (
          <div className="incom">
            <h4>Incompleted Tasks</h4>
            {displayTasks(list, false)}
          </div>
        )}
      </div>
      <div>
        {error && (
          <h5 style={{ color: "grey", fontSize: "18px", fontWeight: "500" }}>
            Please Enter A Task
          </h5>
        )}
      </div>
    </>
  );
};

export default Todo;
