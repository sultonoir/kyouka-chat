import { api } from "@/lib/client";
import { type User, type Chat, type Content } from "@prisma/client";
import React from "react";
import useFriend from "@/hooks/useFriend";
import DetailsMember from "../shared/DetailsMember";
import useGroupChat from "@/hooks/useGroupChat";

interface Props {
  chat: Chat | null;
  content:
    | Array<
        Content & {
          user: User;
        }
      >
    | null
    | undefined;
  userId?: string;
  memberId?: string;
}
const ChatlistPersonal: React.FC<Props> = ({
  chat,
  content,
  userId,
  memberId,
}) => {
  const id = chat?.sender !== userId ? chat?.sender : chat?.receiver;

  const { data: user } = api.user.getFriends.useQuery({
    friendName: id as string,
  });

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
          memberId: memberId || "",
        });
        groupChat.onClose();
      }}
    />
  );
};

export default ChatlistPersonal;
