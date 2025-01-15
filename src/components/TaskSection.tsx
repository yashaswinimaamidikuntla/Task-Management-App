import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

type TaskSectionProps = {
  title: string;
  color: string;
  count: number;
  children?: React.ReactNode;
};

const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  color,
  count,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      {/* Section Header */}
      <div
        className={`p-4 cursor-pointer flex justify-between items-center rounded-t-lg ${color} h-[2.46rem]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">
          {title} ({count})
        </h2>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>

      {/* Section Content */}
      {isOpen && (
        <div className="bg-[#F1F1F1] border rounded-b-lg">
          {children}
        </div>
      )}
    </div>
  );
};

export default TaskSection;