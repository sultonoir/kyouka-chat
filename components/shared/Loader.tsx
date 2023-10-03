"use client";

import { Loader2Icon } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-full absolute inset-0 flex justify-center items-center">
      <Loader2Icon
        className="animate-spin"
        size={40}
      />
    </div>
  );
};

export default Loader;
