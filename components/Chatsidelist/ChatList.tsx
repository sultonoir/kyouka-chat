import { api } from "@/lib/client";
import React from "react";
import ChatlistPersonal from "./ChatlistPersonal";
import ChatListGroup from "./ChatListGroup";
import { Skeleton } from "../ui/skeleton";

const ChatList = () => {
  const { data } = api.user.getUser.useQuery();

  return (
    <div className="w-full flex flex-col">
      {!data ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-[#2a3942]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-[#2a3942]" />
            <Skeleton className="h-4 w-[200px] bg-[#2a3942]" />
          </div>
        </div>
      ) : (
        <>
          {data?.member.map((chat) => {
            return (
              <div key={chat.id}>
                {chat.chatId && (
                  <ChatlistPersonal
                    chat={chat.chat}
                    content={chat.chat?.content}
                    userId={data.id}
                    memberId={data.id}
                  />
                )}
                {chat.groupId && (
                  <ChatListGroup
                    group={chat.group}
                    content={chat.group?.conten}
                    memberId={data.id}
                  />
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default ChatList;
