import { useEffect,useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5001/api/tasks";


const CompletedTask = () => {
const [task,setTask]= useState([]);

const fetchCompleteTasks = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/completed`
        );
        setTask(response.data);
    } catch (error) {
            console.log(error);
    }
};

useEffect(()=>{
    fetchCompleteTasks();
},[]);

const undoComplete = async (id)=> {
    try {
        await axios.put(
            `${API_URL}/${id}/undo`
        );
        setTask(task.filter(task => task._id !== id));
    } catch (error) {
        console.log(error);
    }
};

return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-gray-50 rounded shadow">
        <div className="flex justify-between mb-5">
            <ul className="space-y-3">
            {task.map((item) => (
                <li key={item._id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                    <div>
                        <h2>{item.title}</h2>
                        <h2>{item.category}</h2>
                    </div>
                        <input type="checkbox" checked onChange={() => undoComplete(item._id)}/>
                    
                </li>
            ))
            }
            </ul>
            <h1 className=""> Completed task </h1>
                <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">Get all task</Link>
        </div>
    </div>
);
};

export default CompletedTask;