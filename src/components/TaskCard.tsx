import React from "react";

type TaskCardProps = {
  title: string;
  category: string;
  date: string;
};

const TaskCard: React.FC<TaskCardProps> = ({ title, category, date }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{category}</p>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-sm text-gray-500">{date}</p>
        <button className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 12h12M6 6h12M6 18h12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
