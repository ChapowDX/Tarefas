import { useEffect, useState } from 'react';
import styles from './ToDoApp.module.css';
import TodoItem from './ToDoItem.jsx';
import ToDoApi from './Api.jsx';

function ToDoApp() {
  const [newTask, setNewTask] = useState('');
  const [tasksList, setTasksList] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    ToDoApi.getTasks()
      .then((response) => {
        const filteredTasks = response.data.slice(0, 0);
        setTasksList(filteredTasks);
      })
      .catch((error) => console.log(error));
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      ToDoApi.createTask({
        title: newTask,
        completed: false,
      })
        .then((response) => {
          setTasksList([...tasksList, response.data]);
        })
        .catch((error) => console.log(error));
      setNewTask('');
    }
  };

  const removeTask = (taskId) => {
    ToDoApi.deleteTask(taskId)
      .then(() => {
        const newTasks = tasksList.filter((task) => task.id !== taskId);
        setTasksList(newTasks);
      })
      .catch((error) => console.log(error));
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasksList.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasksList(updatedTasks);
  };

  const startEditing = (taskId) => {
    const taskToEdit = tasksList.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId);
      setEditTitle(taskToEdit.title);
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
  };

  const saveTask = (taskId) => {
    ToDoApi.updateTask(taskId, { title: editTitle})
      .then(() => {
        const updatedTasks = tasksList.map((task) =>
          task.id === taskId ? { ...task, title: editTitle } : task
        );
        setTasksList(updatedTasks);
        setEditingTaskId(null);
        setEditTitle('');
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className={styles.container}>
      <h1>Lista de Tarefas</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Adicione uma nova tarefa"
        />
        <button onClick={addTask}>Adicionar</button>
      </div>
      <ul className={styles.taskList}>
        {tasksList.map((task) => (
          <li key={task.id} className={styles.taskItem}>
            {editingTaskId === task.id ? (
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => saveTask(task.id)}>Salvar</button>
                <button onClick={cancelEditing} className={styles.cancelBtn}>Cancelar</button>
              </div>
            ) : (
              <div>
                <span
                  onClick={() => toggleTask(task.id)}
                  className={task.completed ? styles.completed : ''}
                >
                  {task.title}
                </span>
                <button onClick={() => startEditing(task.id)} className={styles.editBtn}>Editar</button>
                <button onClick={() => removeTask(task.id)} className={styles.removeBtn}>Remover</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoApp;