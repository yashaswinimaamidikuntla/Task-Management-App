import React, { useState } from "react";
import { updateTask, deleteTask } from "../utils/taskOperations.ts";

interface BulkStatusUpdateProps {
  selectedTaskIds: string[];
  onUpdateStatus: (status: string) => void;
  onUnselectAll: () => void;
  onDeleteTasks: () => void;
}

const BulkStatusUpdate: React.FC<BulkStatusUpdateProps> = ({ selectedTaskIds, onUpdateStatus, onUnselectAll, onDeleteTasks }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleStatusChange = async () => {
    for (const taskId of selectedTaskIds) {
      await updateTask(taskId, { status: selectedStatus });
    }
    onUpdateStatus(selectedStatus);
  };

  const handleDeleteTasks = async () => {
    for (const taskId of selectedTaskIds) {
      await deleteTask(taskId);
    }
    onDeleteTasks();
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white shadow-lg rounded-3xl p-2 flex space-x-4 items-center h-12">
      <input
        type="checkbox"
        checked={selectedTaskIds.length > 0}
        onChange={onUnselectAll}
      />
      <span>{selectedTaskIds.length} tasks selected</span>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="bg-gray-700 text-white rounded px-2 py-1"
      >
        <option value="" disabled>Select status</option>
        <option value="Todo">To-Do</option>
        <option value="In-Progress">In-Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button
        className="bg-black text-white border border-white px-4 py-1 rounded-full"
        onClick={handleStatusChange}
      >
        Done
      </button>
      <button
        className="text-red-500 border border-red-500 px-4 py-1 rounded-full"
        onClick={handleDeleteTasks}
      >
        Delete
      </button>
    </div>
  );
};

export default BulkStatusUpdate;
