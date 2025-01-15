// Homepage.tsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import FiltersAndAddTask from "../components/FiltersAndAddTask";
import ListView from "../components/ListView";
import BoardView from "../components/BoardView";
import TaskPopup from "../components/TaskPopup";
import useAuthStore from "../store/authStore.ts";
import { addTask } from "../utils/taskOperations.ts";

type ViewType = "list" | "board";

const Homepage: React.FC<{ handleLogout: () => void }> = ({ handleLogout }) => {
  const [view, setView] = useState<ViewType>("list");
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false);
  const [dueDateFilter, setDueDateFilter] = useState(""); // New state for due date filter
  const user = useAuthStore((state) => state.user);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    dueDate: string;
    category: string;
    status: string;
  }) => {
    if (!user) return;
    await addTask({ ...taskData, userId: user.uid });
    setRefreshKey((prev) => prev + 1);
  };

  const handleFetchTasks = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-mulish">
      <Navbar handleLogout={handleLogout} view={view} setView={setView} />
      <div className="p-6">
        <FiltersAndAddTask
          searchText={searchText}
          setSearchText={setSearchText}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          dueDateFilter={dueDateFilter} // Pass dueDateFilter
          setDueDateFilter={setDueDateFilter} // Pass setDueDateFilter
          onAddTaskClick={() => setIsTaskPopupOpen(true)}
        />
        {/* Main Content */}
        <div>
          <div>
            {view === "list" ? (
              <ListView searchText={searchText} categoryFilter={categoryFilter} dueDateFilter={dueDateFilter} refreshKey={refreshKey} />
            ) : (
              <BoardView searchText={searchText} categoryFilter={categoryFilter} dueDateFilter={dueDateFilter} refreshKey={refreshKey} />
            )}
          </div>
        </div>
      </div>
      <TaskPopup
        isOpen={isTaskPopupOpen}
        onClose={() => setIsTaskPopupOpen(false)}
        onCreate={handleCreateTask}
        onFetchTasks={handleFetchTasks}
      />
    </div>
  );
};

export default Homepage;
