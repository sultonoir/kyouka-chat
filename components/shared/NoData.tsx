"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const NoData = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full absolute inset-0 flex justify-center items-center">
      <div className="max-w-xs w-full h-56 flex flex-col gap-y-2 border items-center justify-center rounded-lg">
        <p>No data</p>
        <Button onClick={() => router.refresh()}>Reload</Button>
      </div>
    </div>
  );
};

export default NoData;
