// FiltersAndAddTask.tsx
import React from 'react';
import { Search, X } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type FiltersAndAddTaskProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  dueDateFilter: string;
  setDueDateFilter: (date: string) => void;
  onAddTaskClick: () => void;
};

const FiltersAndAddTask: React.FC<FiltersAndAddTaskProps> = ({ searchText, setSearchText, categoryFilter, setCategoryFilter, dueDateFilter, setDueDateFilter, onAddTaskClick }) => {

  const clearSearch = () => {
    setSearchText('');
  };

  const clearDueDateFilter = () => {
    setDueDateFilter("");
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <span className="mr-4 text-gray-700">Filter by</span>
        <select
          className="border p-2 rounded-full mr-4 font-mulish text-[0.75rem] font-semibold"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
        <div className="relative">
          <DatePicker
            selected={dueDateFilter ? new Date(dueDateFilter) : null}
            onChange={(date: Date | null) =>
              setDueDateFilter(date ? date.toISOString().split("T")[0] : "")
            }
            placeholderText="Due Date"
            className="border p-2 rounded-full font-mulish text-[0.75rem] font-semibold"
          />
          {dueDateFilter && (
            <X
              className="absolute right-2 top-2 text-gray-500 cursor-pointer"
              size={20}
              onClick={clearDueDateFilter}
            />
          )}
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center border p-2 rounded-full font-mulish text-[0.75rem] font-semibold w-[204px] h-[36px] mr-4">
          <Search className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-grow outline-none bg-transparent"
          />
          {searchText && (
            <X
              className="text-gray-500 cursor-pointer ml-2"
              onClick={clearSearch}
            />
          )}
        </div>
        <button
          className="bg-[#7B1984] text-white py-3 px-10 rounded-full font-mulish"
          onClick={onAddTaskClick}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default FiltersAndAddTask;