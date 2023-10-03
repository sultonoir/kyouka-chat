import useProfile from "@/hooks/useProfile";
import { api } from "@/lib/client";
import { ArrowLeft, CheckIcon } from "lucide-react";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";
import PhotoDropdown from "./PhotoDropdown";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import TestUpload from "../shared/TestUpload";

const ProfileUI = () => {
  const { data } = api.user.getUser.useQuery();
  const [Name, setName] = useState(data?.name as string);
  const [username, setUsername] = useState(data?.username as string);
  const [info, setInfo] = useState(data?.profileStatus as string);
  const ctx = api.useContext();
  const { mutate } = api.user.updateUser.useMutation({
    onSuccess: () => {
      toast({ description: "data has change" });
      void ctx.invalidate();
    },
    onError: (e) => {
      toast({ variant: "destructive", description: e.message });
      void ctx.invalidate();
    },
  });

  const handleUpdate = () => {
    mutate({
      name: Name,
      username: username,
      profileStatus: info,
    });
  };
  const profile = useProfile();
  const variants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -200 },
  };
  return (
    <>
      {profile.isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 1 }}
          className={` absolute w-full h-screen bg-bgsearch z-[1]  flex-col gap-y-5 overflow-hidden`}
        >
          <div className="h-28 bg-bgchat p-5">
            <div className="flex flex-row items-end w-full h-full">
              <div className="flex flex-row gap-x-3 justify-center items-center">
                <ArrowLeft
                  onClick={profile.onClose}
                  className="cursor-pointer"
                />
                <p className="text-2xl">Profile</p>
              </div>
            </div>
          </div>
          <PhotoDropdown profileImage={data?.image} />
          <div className="flex flex-col px-5 mb-2">
            {/* test */}
            <TestUpload />

            <Label>Name</Label>
            <div className="flex flex-row gap-x-5 items-center">
              <Input
                value={Name}
                className="input-underline basis-[90%] rounded-none"
                onChange={(e) => setName(e.target.value)}
                placeholder={data?.name as string}
              />
              <Button
                onClick={handleUpdate}
                size="icon"
                aria-label="Like"
              >
                <CheckIcon />
              </Button>
            </div>
          </div>
          <div className="flex flex-col px-5 mb-2">
            <Label>Username</Label>
            <div className="flex flex-row gap-x-5 items-center">
              <Input
                value={username}
                placeholder={data?.username || "@"}
                onChange={(e) => setUsername(e.target.value)}
                className="input-underline basis-[90%] rounded-none"
              />
              <Button
                onClick={handleUpdate}
                aria-label="Like"
                size={"icon"}
              >
                <CheckIcon />
              </Button>
            </div>
          </div>
          <div className="flex flex-col px-5">
            <Label>Info</Label>
            <div className="flex flex-row gap-x-5 items-center">
              <Input
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                defaultValue={data?.profileStatus || "New user"}
                className="input-underline basis-[90%] rounded-none"
              />
              <Button
                onClick={handleUpdate}
                aria-label="Like"
                size="icon"
              >
                <CheckIcon />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ProfileUI;
