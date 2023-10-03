import { ArrowLeft } from "lucide-react";
import React from "react";

type Props = {
  title: string;
  onClick: () => void;
};

const DetailsHeaders = ({ title, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center px-5 py-2 h-[56px] w-full bg-bs cursor-pointer"
    >
      <div className="flex flex-row gap-x-3 items-center">
        <ArrowLeft />
        <p>{title}</p>
      </div>
    </div>
  );
};

export default DetailsHeaders;
