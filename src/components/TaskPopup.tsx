import React, { useState } from "react";
import { X } from "lucide-react";

interface TaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: { title: string; description: string; dueDate: string; category: string; status: string }) => void;
  onFetchTasks: () => void; // New prop
}

const TaskPopup: React.FC<TaskPopupProps> = ({ isOpen, onClose, onCreate, onFetchTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Work");
  const [status, setStatus] = useState("Todo");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ title, description, dueDate, category, status });
    onClose();
    onFetchTasks(); // Fetch tasks after creation
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg z-50 w-full max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Create Task</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {/* Form */}
        <form className="p-6 space-y-8" onSubmit={handleSubmit}>
          {/* Task Title */}
          <div>
            <input
              id="task-title"
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              id="description"
              rows={4}
              maxLength={300}
              placeholder="Write task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
            ></textarea>
            <p className="text-sm text-gray-400 mt-1">{description.length}/300 characters</p>
          </div>

          {/* Three fields in one row */}
          <div className="grid grid-cols-3 gap-12 py-4 px-2">
            {/* Task Category */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Task Category*
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className={`px-3 py-2 text-sm font-medium border rounded-full ${category === 'Work' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  onClick={() => setCategory('Work')}
                >
                  Work
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 text-sm font-medium border rounded-full ${category === 'Personal' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  onClick={() => setCategory('Personal')}
                >
                  Personal
                </button>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-3">
              <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">
                Due on*
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 py-2"
              />
            </div>

            {/* Task Status */}
            <div className="space-y-3">
              <label htmlFor="task-status" className="block text-sm font-medium text-gray-700">
                Task Status*
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 py-2"
              >
                <option value="Todo">To-Do</option>
                <option value="In-Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Attachment */}
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center items-center text-sm text-gray-500">
              Drop your files here or{" "}
              <span className="text-purple-500 font-medium ml-1 cursor-pointer hover:underline">
                Update
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TaskPopup;
