import { useState } from 'react';
// Imports to do header
import { TodoHeader } from './Header';

function ToDo() {
    // Stores the to do list objects
    const [todos, setToDos] = useState([]);
    
    // Title and description of tasks
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState(''); 

    // Stores the ID of the task being edited
    const [editingId, setEditingId] = useState(null);
    
    // Title and description of tasks being editied
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');

    // Adds new task object to array
    const addToDo = () => {
        if (title.trim() !== '') {

            const newTodo = { 
                
                // Needed because new object needs unique ID
                id: Date.now(), 
                title: title,
                desc: desc,
                
                // Needed in order to show tasks as complete or not
                isCompleted: false
            };

            // Adds new tasks to the array
            setToDos([...todos, newTodo]);
            
            // Emptys the inputs for title and desc
            setTitle('');
            setDesc('');
        }
    };

    // Makes the isCompleted boolean either false or true
    const toggleComplete = (id) => {
        setToDos(todos.map(todo =>
            todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        ))
    }

    // Delets tasks by filtering out the ID
    const deleteTodo = (id) => {
        setToDos(todos.filter(todo => todo.id !== id));
    };

    // Allows user to start editing task
    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
        setEditDesc(todo.desc);
    };

    // Allows the user to save the edited tasks
    const saveEdit = (id) => {
        setToDos(todos.map(todo =>

            // If ID matches, edit the title and desc
            todo.id === id ? { ...todo, title: editTitle, desc: editDesc } : todo
        ));

        // Exits the editing
        setEditingId(null);
    };
    
    return (
        <div className="todo-container">

            {/*Shows the header*/}
            <TodoHeader />
            
            {/*The input container for tasks*/}
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
            
            {/*Shows the list*/}
            <div className="container">
                {/*Shows the to do list if there are any. If not, shows the empty message*/}
                {todos.length > 0 ? (
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo.id}>
                                {/* Shows edit inputs or task*/}
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
                                        {/*Line through completed tasks*/}
                                        <div style={{
                                            textDecoration: todo.isCompleted ? 'line-through' : 'none'
                                        }}>
                                            <strong>{todo.title}</strong>
                                            <p>{todo.desc}</p>
                                        </div>
                                        {/*Can toggle between complete and not*/}
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
                    // The empty message
                    <p>Your list is empty.</p>
                )}
            </div>
        </div>
    );
};

export default ToDo;