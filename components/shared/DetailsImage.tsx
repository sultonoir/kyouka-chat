import { MessageSquarePlusIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { api } from "@/lib/client";

import useFriend from "@/hooks/useFriend";
import useProfileFriend from "@/hooks/useProfileFriend";
import useGroupChat from "@/hooks/useGroupChat";
import ModalEditGroup from "./ModalEditGroup";

type Props = {
  imageUrl: string;
  altImage: string;
  groupName?: string;
  groupLength?: number;
  group?: boolean;
  username?: string;
  member?: boolean;
};

const ImageDetails = ({
  imageUrl,
  altImage,
  groupName,
  groupLength,
  group,
  username,
  member,
}: Props) => {
  const friendChat = useFriend();
  const profileFriend = useProfileFriend();
  const groupChat = useGroupChat();

  const { mutate, isLoading } = api.chat.createConversation.useMutation({
    onSuccess: (e) => {
      friendChat.onOpen({
        userId: e?.userId as string,
        chatId: e?.chatId as string,
        memberId: e?.memberId as string,
      });
      groupChat.onClose();
      profileFriend.onClose();
    },
  });

  const handleSubmit = () => {
    mutate({
      receiptId: profileFriend.username,
    });
  };
  return (
    <div className="flex flex-col gap-y-2 bg-bgsearch items-center justify-center py-5">
      <div className="relative h-[200px] w-[200px] ">
        <Image
          src={imageUrl || "/Logo.png"}
          alt={altImage || "Group"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded-full"
        />
        {group && (
          <div
            className="absolute bottom-9 right-0 
            rounded-full"
          >
            <ModalEditGroup />
          </div>
        )}
      </div>
      <h2 className="text-2xl">{groupName}</h2>
      {username && <p>@{username}</p>}
      {group && (
        <p className="text-sm dark:text-[#667781]">
          Groups - <span>{groupLength}</span> Members
        </p>
      )}
      {member && (
        <Button
          disabled={isLoading}
          onClick={handleSubmit}
          className="rounded-full"
          variant="ghost"
          size="icon"
        >
          <MessageSquarePlusIcon />
        </Button>
      )}
    </div>
  );
};

export default ImageDetails;
