import React, { useEffect } from "react";
import TaskSection from "./TaskSection";
import BulkStatusUpdate from "./BulkStatusUpdate";
import { GripVertical, Ellipsis, CirclePlus, Calendar, CornerDownLeft, Loader } from "lucide-react";
import checkboxDisabled from "../assets/checkmark-disabled.svg";
import checkboxSuccess from "../assets/checkmark-completed.svg";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchTasks, addTask, updateTask, deleteTask } from "../utils/taskOperations.ts";
import useAuthStore from "../store/authStore.ts";

type Task = {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  category: string;
};

interface ListViewProps {
  searchText: string;
  categoryFilter: string;
  dueDateFilter: string; // Add dueDateFilter prop
  refreshKey: number;
}

const ListView: React.FC<ListViewProps> = ({
  searchText,
  categoryFilter,
  dueDateFilter, // Destructure dueDateFilter
  refreshKey,
}) => {
  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTask, setNewTask] = React.useState({
    title: "",
    dueDate: "",
    status: "Todo",
    category: "",
  });
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSavingTask, setIsSavingTask] = React.useState(false);
  const [showEllipsisDropdown, setShowEllipsisDropdown] = React.useState<string | null>(null); // New state for ellipsis dropdown
  const [selectedTaskIds, setSelectedTaskIds] = React.useState<string[]>([]);

  const user = useAuthStore((state) => state.user);

  type GroupedTasks = {
    [key: string]: Task[];
  };
  
  const memoizedFilteredTasks = React.useMemo(() => {
    return tasks
      .filter((task) =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((task) =>
        categoryFilter ? task.category.toLowerCase() === categoryFilter : true
      )
      .filter((task) =>
        dueDateFilter ? new Date(task.dueDate).toISOString().split("T")[0] === dueDateFilter : true
      );
  }, [tasks, searchText, categoryFilter, dueDateFilter]);

  const memoizedGroupedTasks = React.useMemo(() => {
    return memoizedFilteredTasks.reduce((acc: GroupedTasks, task: Task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, { Todo: [], "In-Progress": [], Completed: [] });
  }, [memoizedFilteredTasks]);

  const [tasksState, setTasksState] = React.useState(memoizedGroupedTasks);

  const statuses = ["Todo", "In-Progress", "Completed"];

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchTasks(user.uid).then((tasks) => {
        console.log(tasks)
        setTasks(tasks);
        setIsLoading(false);
      });
    }
  }, [user, refreshKey]);

  useEffect(() => {
    setTasksState(memoizedGroupedTasks);
  }, [memoizedGroupedTasks]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    if (sourceStatus === destStatus) {
      return;
    }

    const sourceTasks = Array.from(tasksState[sourceStatus]);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destStatus;

    const destTasks = Array.from(tasksState[destStatus]);
    destTasks.splice(destination.index, 0, movedTask);

    setTasksState({
      ...tasksState,
      [sourceStatus]: sourceTasks,
      [destStatus]: destTasks,
    });

    await updateTask(movedTask.id, { status: destStatus });
  };

  const handleAddTask = () => {
    setIsAddingTask(true);
  };

  const handleSaveTask = async () => {
    if (!user) return;
    setIsSavingTask(true);
    const { ...taskWithoutId } = { ...newTask, userId: user.uid };
    const docRef = await addTask(taskWithoutId);
    const newTaskWithId = { ...newTask, id: docRef.id, userId: user.uid };
    const updatedTasks = [
      ...tasksState[newTask.status],
      newTaskWithId,
    ];
    setTasksState({ ...tasksState, [newTask.status]: updatedTasks });
    setTasks([...tasks, newTaskWithId]);
    setIsAddingTask(false);
    setNewTask({ title: "", dueDate: "", status: "Todo", category: "" });
    setIsSavingTask(false);
  };

  const handleCancelTask = () => {
    setIsAddingTask(false);
    setNewTask({ title: "", dueDate: "", status: "", category: "" });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId); // Assuming you have a deleteTask function in taskOperations.ts
    setTasks(tasks.filter(task => task.id !== taskId));
    setTasksState({
      ...tasksState,
      [newTask.status]: tasksState[newTask.status].filter(task => task.id !== taskId),
    });
  };

  const handleCheckboxChange = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleUpdateStatus = (status: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTaskIds.includes(task.id) ? { ...task, status } : task
      )
    );
    setSelectedTaskIds([]);
  };

  const handleUnselectAll = () => {
    setSelectedTaskIds([]);
  };

  const handleDeleteSelectedTasks = () => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => !selectedTaskIds.includes(task.id))
    );
    setSelectedTaskIds([]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
          <Loader className="animate-spin w-10 h-10 text-gray-700" />
        </div>
        ) : (
          <>
            <hr className="border-t border-gray-300" />
            <div className="grid grid-cols-4 gap-4 p-2 pb-0 pt-0 rounded-lg">
              <p className="font-semibold col-span-1 text-[14px] text-[rgba(0,0,0,0.6)]">
                Task Name
              </p>
              <p className="font-semibold col-span-1 text-[14px] text-[rgba(0,0,0,0.6)]">
                Due On
              </p>
              <p className="font-semibold col-span-1 text-[14px] text-[rgba(0,0,0,0.6)]">
                Status
              </p>
              <p className="font-semibold col-span-1 text-[14px] text-[rgba(0,0,0,0.6)]">
                Category
              </p>
            </div>
            {statuses.map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <TaskSection
                      title={status}
                      color={
                        status === "Todo"
                          ? "bg-purple-200"
                          : status === "In-Progress"
                          ? "bg-blue-200"
                          : "bg-green-200"
                      }
                      count={tasksState[status]?.length || 0}
                    >
                      {status === "Todo" && (
                        <>
                          <div className="grid grid-cols-4 gap-4 items-center bg-[#F1F1F1] p-2 w-full border-b border-gray-300">
                            <div className="col-span-4 flex justify-start ml-[4.8125rem]">
                              <button
                                className="text-sm text-[14px] text-[rgba(0,0,0,1)]"
                                onClick={handleAddTask}
                              >
                                + Add task
                              </button>
                            </div>
                          </div>
                          {isAddingTask && (
                            <div className="grid grid-cols-4 gap-4 items-center bg-[#F1F1F1] p-6 w-full border-b border-gray-300">
                              <div className="col-span-1">
                                <input
                                  type="text"
                                  className="bg-transparent border-none ml-[4.8125rem]"
                                  placeholder="Task title"
                                  value={newTask.title}
                                  onChange={(e) =>
                                    setNewTask({
                                      ...newTask,
                                      title: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="col-span-1 relative flex items-center w-[98px]">
                                <DatePicker
                                  selected={newTask.dueDate ? new Date(newTask.dueDate) : null}
                                  onChange={(date: Date | null) =>
                                    setNewTask({
                                      ...newTask,
                                      dueDate: date ? date.toISOString().split("T")[0] : "",
                                    })
                                  }
                                  placeholderText="   Add Date"
                                  className="w-[98px] h-[30px] bg-transparent border border-gray-300 rounded-full pr-8 text-[12px] text-[rgba(0,0,0,0.6)]"
                                />
                                <Calendar className="absolute right-2 text-gray-500" size={20} />
                              </div>
                              <div className="col-span-1 flex justify-start relative">
                                <CirclePlus
                                  className="text-gray-500 cursor-pointer"
                                  size={30}
                                  onClick={() =>
                                    setShowStatusDropdown(!showStatusDropdown)
                                  }
                                />
                                {showStatusDropdown && (
                                  <div className="absolute top-8 left-0 bg-white border border-gray-300 shadow-md rounded-md z-10 w-[120px]">
                                    <div
                                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        setNewTask({
                                          ...newTask,
                                          status: "Todo",
                                        });
                                        setShowStatusDropdown(false);
                                      }}
                                    >
                                      TO-DO
                                    </div>
                                    <div
                                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        setNewTask({
                                          ...newTask,
                                          status: "In-Progress",
                                        });
                                        setShowStatusDropdown(false);
                                      }}
                                    >
                                      IN-PROGRESS
                                    </div>
                                    <div
                                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        setNewTask({
                                          ...newTask,
                                          status: "Completed",
                                        });
                                        setShowStatusDropdown(false);
                                      }}
                                    >
                                      COMPLETED
                                    </div>
                                  </div>
                                )}
                                <p className="ml-2 text-sm text-[14px] text-[rgba(0,0,0,1)]">
                                  {newTask.status}
                                </p>
                              </div>
                              <div className="col-span-1 flex justify-start relative">
                                <CirclePlus
                                  className="text-gray-500 cursor-pointer"
                                  size={30}
                                  onClick={() =>
                                    setShowCategoryDropdown(!showCategoryDropdown)
                                  }
                                />
                                {showCategoryDropdown && (
                                  <div className="absolute top-8 left-0 bg-white border border-gray-300 shadow-md rounded-md z-10 w-[120px]">
                                    <div
                                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        setNewTask({
                                          ...newTask,
                                          category: "Work",
                                        });
                                        setShowCategoryDropdown(false);
                                      }}
                                    >
                                      WORK
                                    </div>
                                    <div
                                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                      onClick={() => {
                                        setNewTask({
                                          ...newTask,
                                          category: "Personal",
                                        });
                                        setShowCategoryDropdown(false);
                                      }}
                                    >
                                      PERSONAL
                                    </div>
                                  </div>
                                )}
                                <p className="ml-2 text-sm text-[14px] text-[rgba(0,0,0,1)]">
                                  {newTask.category}
                                </p>
                              </div>
                              <div className="col-span-4 flex justify-start space-x-2 mt-2 ml-[4.8125rem]">
                                <button
                                  className="w-[84px] h-[30px] rounded-full bg-[rgba(123,25,132,1)] text-white flex items-center justify-center text-[14px]"
                                  onClick={handleSaveTask}
                                >
                                  {isSavingTask ? "Saving..." : "ADD"} <CornerDownLeft className="ml-1" size={20} />
                                </button>
                                <button
                                  className="text-sm text-[14px] text-[rgba(0,0,0,1)]"
                                  onClick={handleCancelTask}
                                >
                                  CANCEL
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {tasksState[status]?.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="w-full"
                            >
                              <div
                                className={`grid grid-cols-4 gap-4 items-center bg-[#F1F1F1] p-2 w-full ${
                                  index !== tasksState[status].length - 1
                                    ? "border-b border-gray-300"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center space-x-2 col-span-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedTaskIds.includes(task.id)}
                                    onChange={() => handleCheckboxChange(task.id)}
                                  />
                                  <div className="w-4 flex-shrink-0">
                                    <GripVertical
                                      className="text-gray-500"
                                      size={15}
                                    />
                                  </div>
                                  {task.status === "Completed" ? (
                                    <img src={checkboxSuccess} alt="Completed" />
                                  ) : (
                                    <img
                                      src={checkboxDisabled}
                                      alt="Not Completed"
                                    />
                                  )}
                                  <p
                                    className={`font-semibold truncate text-[14px] ${
                                      task.status === "Completed"
                                        ? "line-through"
                                        : ""
                                    } text-[rgba(0,0,0,1)]`}
                                  >
                                    {task.title}
                                  </p>
                                </div>
                                <div className="col-span-1">
                                  <p className="text-sm text-[14px] text-[rgba(0,0,0,1)]">
                                    {task.dueDate}
                                  </p>
                                </div>
                                <div className="col-span-1">
                                  <p className="text-sm text-[14px] text-[rgba(0,0,0,1)]">
                                    {task.status}
                                  </p>
                                </div>
                                <div className="col-span-1 flex justify-between items-center">
                                  <p className="text-sm text-[14px] text-[rgba(0,0,0,1)]">
                                    {task.category}
                                  </p>
                                  <div className="relative">
                                    <Ellipsis
                                      className="text-gray-500 cursor-pointer"
                                      size={15}
                                      onClick={() =>
                                        setShowEllipsisDropdown(showEllipsisDropdown === task.id ? null : task.id)
                                      }
                                    />
                                    {showEllipsisDropdown === task.id && (
                                      <div className="absolute top-8 right-0 bg-white border border-gray-300 shadow-md rounded-md z-10 w-[120px]">
                                        <div
                                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                          onClick={() => handleDeleteTask(task.id)}
                                        >
                                          Delete
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TaskSection>
                  </div>
                )}
              </Droppable>
            ))}
            {selectedTaskIds.length > 0 && (
              <BulkStatusUpdate
                selectedTaskIds={selectedTaskIds}
                onUpdateStatus={handleUpdateStatus}
                onUnselectAll={handleUnselectAll}
                onDeleteTasks={handleDeleteSelectedTasks}
              />
            )}
          </>
        )}
      </div>
    </DragDropContext>
  );
};

export default ListView;
