import React from "react";

import { type User } from "@prisma/client";
import { api } from "@/lib/client";
import { toast } from "../ui/use-toast";
import { Card, CardHeader } from "../ui/card";
import { MyAvatar } from "../shared/MyAvatar";
import { Button } from "../ui/button";

interface AddFriendProps {
  user: User | null;
}

export const AddFriend = ({ user }: AddFriendProps) => {
  const [isFollowed, setIsFollowed] = React.useState(false);

  const { mutate } = api.user.userAddFriend.useMutation({
    onSuccess: () => {
      setIsFollowed(!isFollowed);
    },
    onError: (e) => {
      toast({ variant: "destructive", description: e.message });
    },
  });
  const handleClick = () => {
    mutate({
      username: user?.username as string,
    });
  };
  return (
    <>
      {user && (
        <Card className=" border-none bg-transparent z-0">
          <CardHeader className="justify-between">
            <div className="flex gap-3">
              <MyAvatar src={user.image as string} />
              <div className="flex flex-col items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  {user.name}
                </h4>
                <h5 className="text-small tracking-tight text-default-500">
                  @{user.username}
                </h5>
              </div>
            </div>
            <Button
              className={
                isFollowed
                  ? "bg-transparent text-foreground border-default-200"
                  : ""
              }
              color="primary"
              size="sm"
              onClick={handleClick}
            >
              {isFollowed ? "Chat" : "Add"}
            </Button>
          </CardHeader>
        </Card>
      )}
    </>
  );
};
