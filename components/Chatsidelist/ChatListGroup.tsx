import { type Group } from "@prisma/client";
import React from "react";
import useFriend from "@/hooks/useFriend";
import DetailsMember from "../shared/DetailsMember";
import useGroupChat from "@/hooks/useGroupChat";
import { api } from "@/lib/client";

interface Props {
  group: Group | null;
  memberId: string | null | undefined;
}

const ChatListGroup = ({ group, memberId }: Props) => {
  const { data } = api.grup.getGroup.useQuery({
    groupId: group?.id || "",
  });
  const content = data?.conten;
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
        groupChat.onOpen({
          groupId: group?.id || "",
          memberId: memberId as string,
        });
        personalChat.onClose();
      }}
    />
  );
};

export default ChatListGroup;
