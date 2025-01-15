import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Ellipsis } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  category: string;
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  color: string;
  showEllipsisDropdown: string | null;
  setShowEllipsisDropdown: (id: string | null) => void;
  handleDeleteTask: (taskId: string) => void;
  handleCheckboxChange?: (taskId: string) => void;
  selectedTaskIds?: string[];
  showCheckboxes?: boolean;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  color,
  showEllipsisDropdown,
  setShowEllipsisDropdown,
  handleDeleteTask,
  handleCheckboxChange,
  selectedTaskIds,
  showCheckboxes = true,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-md w-auto">
      <div
        className="text-black text-xs font-sans py-1 px-3 rounded-md mb-4"
        style={{ backgroundColor: color, width: 'fit-content' }}
      >
        {title}
      </div>
      {tasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200 relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  {showCheckboxes && (
                    <input
                      type="checkbox"
                      checked={selectedTaskIds?.includes(task.id)}
                      onChange={() => handleCheckboxChange?.(task.id)}
                    />
                  )}
                  <h3 className={`font-thin text-lg text-black ${
                    task.status === "completed" || task.status === "Completed" ? "line-through" : ""
                  }`}>{task.title}</h3>
                </div>
                <Ellipsis
                  className="text-black cursor-pointer"
                  size={15}
                  onClick={() =>
                    setShowEllipsisDropdown(showEllipsisDropdown === task.id ? null : task.id)
                  }
                />
                {showEllipsisDropdown === task.id && (
                  <div className="absolute top-12 right-2 bg-white border border-gray-300 shadow-md rounded-md z-10 w-[120px]">
                    <div
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm text-black">{task.dueDate}</p>
                <p className="text-sm text-black">{task.category}</p>
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default TaskColumn;
