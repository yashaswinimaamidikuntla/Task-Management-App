import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import TaskColumn from "./TaskColumn";
import { fetchTasks, updateTask, deleteTask } from "../utils/taskOperations.ts";
import useAuthStore from "../store/authStore.ts";
import { Loader } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  category: string;
}

interface BoardViewProps {
  searchText: string;
  categoryFilter: string;
  dueDateFilter: string; // Add dueDateFilter prop
  refreshKey: number;
}

const BoardView: React.FC<BoardViewProps> = ({
  searchText,
  categoryFilter,
  dueDateFilter, // Destructure dueDateFilter
  refreshKey,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEllipsisDropdown, setShowEllipsisDropdown] = useState<string | null>(null); // New state for ellipsis dropdown
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchTasks(user.uid).then((tasks) => {
        console.log(tasks);
        setTasks(tasks);
        setIsLoading(false);
      });
    }
  }, [user, refreshKey]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const destinationDroppableId = result.destination.droppableId;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(sourceIndex, 1);
    movedTask.status = destinationDroppableId;
    updatedTasks.splice(destinationIndex, 0, movedTask);

    setTasks(updatedTasks);

    await updateTask(movedTask.id, { status: destinationDroppableId });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId); // Assuming you have a deleteTask function in taskOperations.ts
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((task) =>
      categoryFilter ? task.category.toLowerCase() === categoryFilter : true
    )
    .filter((task) =>
      dueDateFilter ? new Date(task.dueDate).toISOString().split("T")[0] === dueDateFilter : true
    );

  const getTasksByStatus = (status: string) =>
    filteredTasks.filter((task) => task.status === status);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
          <Loader className="animate-spin w-10 h-10 text-gray-700" />
        </div>
        ) : (
          <>
            {/* Remove FiltersAndAddTask component */}
            {["Todo", "In-Progress", "Completed"].map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1"
                  >
                    <TaskColumn
                      title={status}
                      tasks={getTasksByStatus(status)}
                      color={
                        status === "Todo"
                          ? "#f0ad4e"
                          : status === "In-Progress"
                          ? "#5bc0de"
                          : "#5cb85c"
                      }
                      showEllipsisDropdown={showEllipsisDropdown}
                      setShowEllipsisDropdown={setShowEllipsisDropdown}
                      handleDeleteTask={handleDeleteTask}
                      showCheckboxes={false}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </>
        )}
      </div>
    </DragDropContext>
  );
};

export default BoardView;
