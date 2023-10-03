import React from "react";
import { EyeIcon } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";

interface SeePhotoProfileProps {
  imageProfile: string;
}

const SeePhotoProfile = ({ imageProfile }: SeePhotoProfileProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex flex-row items-center hover:bg-bgchat rounded-lg py-2 gap-x-1 cursor-pointer bg-transparent justify-start">
          <EyeIcon className="mr-3 text-gray-500" />
          <span className="text-black dark:text-white">See Photo</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Frofile</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[500px]">
          <Image
            src={imageProfile}
            alt={"upload"}
            fill
            className="object-cover"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeePhotoProfile;
