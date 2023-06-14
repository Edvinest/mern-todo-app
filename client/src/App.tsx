import './App.css'
import { useState, useEffect } from 'react'

const API_BASE = "http://localhost:5174";

function App() {

  interface Todo {
    _id: number;
    text: string;
    complete: boolean;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [popupActive, setPopUpActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const GetTodos = () => {
    fetch(API_BASE + '/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error: ", err));
  };

  const completeTodo = async (id: number) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id)
      .then(res => res.json());

    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete;
      }
      return todo
    }));
  }

  // The object is necessary to handle data related to the server
  // Headers provide additional info about request/response
  const addTodo = async () => {
    const data = await fetch(API_BASE + '/todo/new',
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({
          text: newTodo
        })
      }).then(res => res.json())

    setTodos([...todos, data]);
    setPopUpActive(false);
    setNewTodo("");
  };

  const updateTodo = async (id: number, newText: string) => {
    const data = await fetch(API_BASE + '/todo/update/' + id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: newText })
      }).then(res => res.json())

    setTodos((prevTodos) =>
      prevTodos.map((todo) => todo._id === id ? { ...todo, text: newText } : todo));
  };

  const deleteTodo = async (id: number) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, { method: "DELETE" })
      .then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id))
  }

  useEffect(() => {
    GetTodos();
  }, []);

  return (
    <div className='App'>
      <h3>Your Tasks</h3>
      <div className="todos">
        {todos.map(todo => (
          <div className={"todo " + (todo.complete ? "is-complete" : "")} key={todo._id} onClick={() => completeTodo(todo._id)}>
            <div className="checkbox"></div>
            <input type='text' className="text" value={todo.text} onChange={e => updateTodo(todo._id, e.target.value)} />
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>X</div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopUpActive(true)}>+</div>
      {popupActive ? (
        <div className='popup'>
          <div className="closePopup" onClick={() => setPopUpActive(false)}>X</div>
          <div className="content">
            <h3>Add task!</h3>
            <input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
            <button className="button" onClick={() => addTodo()}>Add</button>
          </div>
        </div>
      ) : ''}
    </div>
  )
}

export default App
