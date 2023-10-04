"use client";

import { LogOutIcon, Users2 } from "lucide-react";

import React from "react";
import { api } from "@/lib/client";
import useProfile from "@/hooks/useProfile";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "next-auth/react";
import useCreateGroup from "@/hooks/useCreateGroup";

const NavbarUI = () => {
  const { data } = api.user.getUser.useQuery();

  const profile = useProfile();
  const group = useCreateGroup();
  return (
    <div className="w-full flex justify-between items-center px-5 py-2 bg-bs">
      <div
        className="relative cursor-pointer z-0"
        onClick={profile.onOpen}
      >
        <Avatar>
          <AvatarImage
            src={data?.image || ""}
            alt={"Profile"}
          />
          <AvatarFallback>{"K"}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-row gap-x-10">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="rounded-full hover:bg-default-100"
          title="create group"
          onClick={group.onOpen}
        >
          <Users2 className="dark:text-iconnav" />
        </Button>
        <Button
          variant={"ghost"}
          className="rounded-full hover:bg-default-100"
          size="icon"
          onClick={() => signOut()}
        >
          <LogOutIcon className="text-iconnav" />
        </Button>
      </div>
    </div>
  );
};

export default NavbarUI;
