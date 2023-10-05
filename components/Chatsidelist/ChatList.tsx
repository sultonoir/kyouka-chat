import React from "react";
import ChatlistPersonal from "./ChatlistPersonal";
import ChatListGroup from "./ChatListGroup";
import { type User, type Chat, type Group, type Member } from "@prisma/client";

interface Props {
  member:
    | Array<
        Member & {
          chat: Chat | null;
          group: Group | null;
        }
      >
    | undefined;
  user: User | null | undefined;
}

const ChatList = ({ member, user }: Props) => {
  return (
    <div className="w-full flex flex-col">
      <>
        {member?.map((chat) => {
          return (
            <div key={chat.id}>
              {chat.chatId && (
                <ChatlistPersonal
                  chat={chat.chat}
                  userId={user?.id}
                />
              )}
              {chat.groupId && (
                <ChatListGroup
                  group={chat.group}
                  memberId={user?.id}
                />
              )}
            </div>
          );
        })}
      </>
    </div>
  );
};

export default ChatList;
