import React from "react";

import { CameraIcon } from "lucide-react";
import NextImage from "next/image";

import UploadImage from "./UploadImage";
import SeePhotoProfile from "./SeePhotoProfile";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface PhotoDropdownProps {
  profileImage?: string | null;
}

const PhotoDropdown = ({ profileImage }: PhotoDropdownProps) => {
  return (
    <Popover>
      <PopoverTrigger className="mx-auto flex mt-2">
        <div className="flex justify-center items-center relative group w-52 h-52 mx-auto">
          <NextImage
            src={profileImage || "/Logo.png"}
            alt="profile"
            width={200}
            height={200}
            className="rounded-full aspect-square"
          />

          <div className="group-hover:bg-gray-500/50 flex justify-center items-center flex-col cursor-pointer absolute w-52 h-52 rounded-full z-[99]">
            <CameraIcon
              className="hidden group-hover:inline-flex"
              size={30}
            />
            <p className="align-middle hidden group-hover:inline-flex">
              Change photo profile
            </p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-1 bg-default-50 max-w-max">
        <UploadImage />
        <SeePhotoProfile imageProfile={profileImage as string} />
      </PopoverContent>
    </Popover>
  );
};

export default PhotoDropdown;
