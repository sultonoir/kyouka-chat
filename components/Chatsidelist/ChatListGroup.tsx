import { type Content, type Group, type User } from "@prisma/client";
import React from "react";
import useFriend from "@/hooks/useFriend";
import DetailsMember from "../shared/DetailsMember";
import useGroupChat from "@/hooks/useGroupChat";

interface Props {
  group: Group | null;
  content:
    | Array<
        Content & {
          user: User;
        }
      >
    | null
    | undefined;
  memberId: string;
}

const ChatListGroup = ({ group, content, memberId }: Props) => {
  const lastChat = content && content[content?.length - 1];
  const groupChat = useGroupChat();
  const personalChat = useFriend();
  return (
    <DetailsMember
      imageUrl={group?.image || ""}
      name={group?.name || ""}
      message={lastChat?.body || ""}
      sender={lastChat?.user.username}
      fileUrl={lastChat?.file}
      sendAt={lastChat?.updatedAt || new Date()}
      active={groupChat.isOpen}
      onClick={() => {
        groupChat.onOpen({ groupId: group?.id || "", memberId: memberId });
        personalChat.onClose();
      }}
    />
  );
};

export default ChatListGroup;
