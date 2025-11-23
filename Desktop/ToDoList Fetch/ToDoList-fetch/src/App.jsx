import { useState, useEffect } from "react";
import "./App.css";
/*Voy a dejar algunos comentarios a modo de repaso para saber el funcionamiento del proceso de fetch y 
modificación de datos a través de la consola */

function App() {

  /*
    useState crea un "estado" que guarda datos que pueden cambiar durante la ejecución
    'task' guarda el valor del input actual
    'tasks' guarda la lista de tareas que mostramos en la UI
   */
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  /* 
    useEffect con [] como dependencia significa "ejecutar solo una vez al cargar la app"
    Creamos el usuario si no existe y cargamos las tareas existentes
   */
  useEffect(() => {

    /*
      POST /users/{user_name} 
      Intentamos crear el usuario. Si ya existe, la API responde con un mensaje
     */
    fetch("https://playground.4geeks.com/todo/users/KilianCGS", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([]),
    })
      .then((res) => res.json())
      .then((data) => console.log("Usuario creado o ya existente:", data))
      .catch((err) => console.log(err));

    /* 
      GET /users/{user_name} 
      Obtenemos las tareas existentes del usuario
     */
    fetch("https://playground.4geeks.com/todo/users/KilianCGS")
      .then((res) => res.json())
      .then((data) => {
        /* 
          La API devuelve un objeto con "todos", que es un array de tareas
          Lo guardamos en 'tasks' para renderizar en la UI
         */
        setTasks(data.todos);
      })
      .catch((err) => console.log(err));

  }, []);

  /* 
   Añadir una nueva tarea
   POST /todos/{user_name} 
   Enviamos la tarea al servidor y actualizamos el estado local
   */
  const addTask = () => {
    if (!task) return;

    const newTask = { label: task, done: false };

    fetch("https://playground.4geeks.com/todo/todos/KilianCGS", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then(() => {
        /* 
         Actualizamos la UI instantáneamente agregando la nueva tarea
         */
        setTasks([...tasks, newTask]);
        setTask("");
      })
      .catch((err) => console.log(err));
  };

  /* 
   Borrar 1 tarea
   La API de 4Geeks requiere enviar TODA la lista actualizada
   PUT /users/{user_name}
   */
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);

    fetch("https://playground.4geeks.com/todo/users/KilianCGS", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTasks),
    })
      .then((res) => res.json())
      .then(() => {
        /* Actualizamos la UI eliminando la tarea */
        setTasks(updatedTasks);
      })
      .catch((err) => console.log(err));
  };

  /* 
   Eliminar todas las tareas
   Enviamos un array vacío con PUT
   */
  const deleteAllTasks = () => {
    fetch("https://playground.4geeks.com/todo/users/KilianCGS", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([]),
    })
      .then((res) => res.json())
      .then(() => {
        /*Actualizamos la UI vaciando el estado de tareas */
        setTasks([]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <h1>Mi Todo List</h1>

      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Escribe una tarea"
      />

      <button onClick={addTask}>Añadir</button>

      <button className="delete-all" onClick={deleteAllTasks}>
        Eliminar todas
      </button>

      <ul>
        {tasks.map((t, i) => (
          <li key={i}>
            {t.label}
            <button onClick={() => deleteTask(i)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

