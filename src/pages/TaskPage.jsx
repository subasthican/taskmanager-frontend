import { useState, useEffect } from 'react';
import axios from 'axios';
import { PEROEITY } from '../config/constant.js';

const API_URL = 'http://localhost:5001/api/tasks';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [category, setCategory] = useState('General');
    const [priority, setPriority] = useState(PEROEITY.MEDIUM);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [showAddModel, setShowAddModel] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [timeout, setTimeout] = useState();

    useEffect(() => {
        const timer = window.setTimeout(()=>{
            fetchTasks();
        },500);
        return ()=> window.clearTimeout(timer)
    }, [search,filterCategory,filterPriority,page,limit]);

    const fetchTasks = async () => {
        try {
        // const response = await axios.get(`${API_URL}?search=${search}`);
        const response = await axios.post(
            `${API_URL}/list`,
            {
                search,
                category: filterCategory,
                priority: filterPriority,
                page,
                limit

            }
        );


        setTasks(response.data.data.tasks);
        setTotalPage(response.data.data.pagination.totalPage);
        } catch (error) {
        console.error("Error fetching tasks:", error);
        }
    };



    const addTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle) return;
        try {
        
        // Sending category along with the title
        const response = await axios.post(API_URL, { title: newTaskTitle, category, priority });
        fetchTasks();
        setNewTaskTitle('');
        setCategory('General');
        setPriority(PEROEITY.MEDIUM);
        setShowAddModel(false)
        } catch (error) {
        console.error("Error adding task:", error);
        }
    };

    const toggleComplete = async (id, currentStatus) => {
        try {
        const response = await axios.put(`${API_URL}/${id}`, { completed: !currentStatus });
        setTasks(tasks.map(task => task._id === id ? response.data : task));
        } catch (error) {
        console.error("Error updating task status:", error);
        }
    };

    const startEditing = (task) => {
        setEditingTaskId(task._id);
        setEditTaskTitle(task.title);
    };

    const saveEditedTask = async (id) => {
        if (editTaskTitle.length < 3) {
        alert("Task title must be at least 3 characters long.");
        return;
        }
        try {
        const response = await axios.put(`${API_URL}/${id}`, { title: editTaskTitle });
        setTasks(tasks.map(task => task._id === id ? response.data : task));
        setEditingTaskId(null);
        } catch (error) {
        console.error("Error saving edited task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
        await axios.delete(`${API_URL}/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
        console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="max-w-xl mx-auto my-10 p-8 font-sans bg-gray-50 text-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Task Manager</h1>

        <div className='flex mb-5'>
            <input 
            type="text"
            placeholder='search task'
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="flex-grow p-3 mr-3 border border-gray-300 rounded"
            />
        </div>
        
        

        <select
            value={filterCategory}
            onChange={(e)=>setFilterCategory(e.target.value)}
            className="p-3 border rounded mb-4"
        >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>

        </select>

        <select
            value={filterPriority}
            onChange={(e)=>setFilterPriority(e.target.value)}
            className="p-3 border rounded mx-3"
        >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>

        </select>
        
        <button
            type="button"
            onClick={() => setShowAddModel(true)}
            className="px-5 py-3 bg-blue-600 text-white rounded"
        >
            Add Task
        </button>

        <ul className="list-none p-0">
            {tasks.map(task => (
            <li key={task._id} className="flex items-center mb-3 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                {editingTaskId === task._id ? (
                <input 
                    type="text" 
                    value={editTaskTitle} 
                    onChange={(e) => setEditTaskTitle(e.target.value)} 
                    className="flex-grow p-2 mr-3 border border-blue-300 rounded"
                    autoFocus
                />
                ) : (
                <div className="flex-grow flex items-center">
                    {/* Category Badge */}
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full mr-2 uppercase">
                    {task.category || 'General'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full mr-2 uppercase">
                    {task.priority}
                    </span>
                    <span 
                    onClick={() => toggleComplete(task._id, task.completed)} 
                    className={`cursor-pointer ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                    >
                    {task.title}
                    </span>
                    <span className="px-2 text-xs text-gray-500">
                        {new Date(task.createdAt).toLocaleString()}
                    </span>
                </div>
                )}

                {editingTaskId === task._id ? (
                <>
                    <button onClick={() => saveEditedTask(task._id)} className="px-3 py-2 bg-green-600 text-white rounded font-bold">Save</button>
                    <button onClick={() => setEditingTaskId(null)} className="ml-2 px-3 py-2 bg-gray-500 text-white rounded font-bold">Cancel</button>
                </>
                ) : (
                <>
                    <button onClick={() => startEditing(task)} className="px-3 py-2 bg-yellow-400 text-gray-900 rounded font-bold">Edit</button>
                    <button onClick={() => deleteTask(task._id)} className="ml-2 px-3 py-2 bg-red-600 text-white rounded font-bold">Delete</button>
                </>
                )}
            </li>
            ))}
        </ul>
        <div className='flex justify-center gap-3 mt-5'>
            <button
            disabled = {page === 1}
            onClick={()=>setPage(page-1)}
            className='px-4 py-2 bg-gray-500 text-white rounded'
            >
                previous
            </button>

            <span>{page} / {totalPage}</span>

            <button
            disabled={page===totalPage}
            onClick={()=>setPage(page+1)}
            className='px-4 py-2 bg-blue-600 text-white rounded'
            >
                next
            </button>
        </div>
        {showAddModel && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
                <div className="bg-white p-6 rounded-lg w-[450px] shadow-lg">
                    <h2 className='text-2xl font-bold mb-5'>Add new task</h2>

                    <form onSubmit={addTask}>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='w-full p-3 border rounded mb-3'
                        >
                            <option value="General">General</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                        <select 
                            value={priority}
                            onChange={(e)=>setPriority(e.target.value)}
                            className='w-full p-3 border rounded mb-3'
                        >
                            {Object.values(PEROEITY).map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                        <input
                        type='text'
                        placeholder='Task title'
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className='w-full p-3 border rounded mb-5'
                        />
                            <div className='flex justify-end gap-3'>
                                <button
                                type='button'
                                onClick={()=>setShowAddModel(false)}
                                className='px-5 py-2 bg-gray-500 text-white rounded'
                                >
                                    cancel
                                </button>
                                <button
                                type='submit'
                                className="px-5 py-2 bg-blue-600 text-white rounded"
                                >
                                        Add Task
                                </button>
                            </div>
                        
                    </form>
                </div>

            </div>
        )}
        </div>
    );
    };

export default TaskPage;