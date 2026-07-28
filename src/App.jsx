import { BrowserRouter, Routes,Route } from 'react-router-dom';
import TaskPage from './pages/TaskPage';
import CompletedTask from './pages/CompletedTask';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={ <TaskPage />} />
          <Route path="/completed" element={<CompletedTask/>}/>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;