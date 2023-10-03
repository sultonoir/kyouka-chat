import { type Friend } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { api } from "@/lib/client";

type Props = {
  friend: Friend | null | undefined;
};

const FriendUI = ({ friend }: Props) => {
  const { data: user } = api.user.getFriends.useQuery({
    friendName: friend?.friendName ?? "",
  });
  return (
    <>
      <Avatar>
        <AvatarImage
          src={user?.image as string}
          alt={user?.name as string}
        />
        <AvatarFallback>K</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h4>{user?.name}</h4>
        <p>{user?.profileStatus}</p>
      </div>
    </>
  );
};

export default FriendUI;
