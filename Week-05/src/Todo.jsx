import { useState } from 'react';
import { TodoHeader } from './Header';

function ToDo() {
    const [todos, setToDos] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState(''); 

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');

    const addToDo = () => {
        if (title.trim() !== '') {

            const newTodo = { 
                id: Date.now(), 
                title: title,
                desc: desc,
                isCompleted: false
            };
            setToDos([...todos, newTodo]);
            setTitle('');
            setDesc('');
        }
    };
    const toggleComplete = (id) => {
        setToDos(todos.map(todo =>
            todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        ))
    }

    const deleteTodo = (id) => {
        setToDos(todos.filter(todo => todo.id !== id));
    };

    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
        setEditDesc(todo.desc);
    };

    const saveEdit = (id) => {
        setToDos(todos.map(todo =>
            todo.id === id ? { ...todo, title: editTitle, desc: editDesc } : todo
        ));
        setEditingId(null);
    };
    
    return (
        <div className="todo-container">
            <TodoHeader />
            
            <div className="input-container">

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                /> 
                
                <input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Task Description"
                />
                <button onClick={addToDo}>Add Task</button>
            </div>
            
            <div className="container">
                {todos.length > 0 ? (
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo.id}>
                                {editingId === todo.id ? (
                                    <>
                                        <input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                        />
                                        <input 
                                            value={editDesc}
                                            onChange={(e) => setEditDesc(e.target.value)}
                                        />
                                        <button onClick={() => saveEdit(todo.id)}>Save Changes</button>
                                    </>    
                                ) : (
                                    <>
                                        <div style={{
                                            textDecoration: todo.isCompleted ? 'line-through' : 'none'
                                        }}>
                                            <strong>{todo.title}</strong>
                                            <p>{todo.desc}</p>
                                        </div>
                                        <button onClick={() => toggleComplete(todo.id)}>
                                            {todo.isCompleted ? 'Undo' : 'Complete'}
                                        </button>
                                        <button onClick={() => startEdit(todo)}>Edit</button>
                                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Your list is empty.</p>
                )}
            </div>
        </div>
    );
};

export default ToDo;