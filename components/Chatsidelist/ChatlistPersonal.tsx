import { api } from "@/lib/client";
import { type Chat } from "@prisma/client";
import React from "react";
import useFriend from "@/hooks/useFriend";
import DetailsMember from "../shared/DetailsMember";
import useGroupChat from "@/hooks/useGroupChat";

interface Props {
  chat: Chat | null;
  userId?: string;
}
const ChatlistPersonal: React.FC<Props> = ({ chat, userId }) => {
  const id = chat?.sender !== userId ? chat?.sender : chat?.receiver;

  const { data: user } = api.user.getFriends.useQuery({
    friendName: id as string,
  });

  const { data: conver } = api.chat.getConversation.useQuery({
    id: chat?.id || "",
  });
  const content = conver?.content;
  // get lastchatLenght
  const lastChat = content && content[content?.length - 1];

  //hoock chat personal open
  const personalChat = useFriend();
  const groupChat = useGroupChat();

  return (
    <DetailsMember
      imageUrl={user?.image || ""}
      name={user?.username || ""}
      sender={lastChat?.user.username}
      message={lastChat?.body}
      fileUrl={lastChat?.file}
      sendAt={lastChat?.updatedAt || new Date()}
      onClick={() => {
        personalChat.onOpen({
          userId: user?.id || "",
          chatId: chat?.id || "",
          memberId: userId || "",
        });
        groupChat.onClose();
      }}
    />
  );
};

export default ChatlistPersonal;
