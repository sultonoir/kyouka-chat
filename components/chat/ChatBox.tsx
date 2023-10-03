import useFriend from "@/hooks/useFriend";
import { api } from "@/lib/client";
import React from "react";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import { MyAvatar } from "../shared/MyAvatar";
import dayjs from "dayjs";
import second from "dayjs/plugin/relativeTime";
import useProfileFriend from "@/hooks/useProfileFriend";
import useProfileGroup from "@/hooks/useProfileGroup";
import Loader from "../shared/Loader";
import NoData from "../shared/NoData";
dayjs.extend(second);

const ChatBox = () => {
  const personalChat = useFriend();
  const profileFriend = useProfileFriend();
  const profileGroup = useProfileGroup();
  const { data: chat, isLoading } = api.chat.getConversation.useQuery({
    id: personalChat.chatId,
  });

  const { data: user } = api.user.getFriends.useQuery({
    friendName: personalChat.userId,
  });

  return (
    <div className="w-full flex flex-col h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {!chat ? (
            <NoData />
          ) : (
            <>
              <div
                className={`absolute bg-[url('../public/image/bgc.png')] inset-0 h-full w-full opacity-5 -z-[1]`}
              ></div>
              <div className="flex justify-between items-center px-5 py-2 w-full bg-bs">
                <div
                  onClick={() => {
                    profileFriend.onOpen(user?.id || "");
                    profileGroup.onClose();
                  }}
                  className="flex flex-row gap-x-3 items-center cursor-pointer"
                >
                  <MyAvatar
                    src={user?.image || ""}
                    alt="Avatar friend"
                  />
                  <div className="flex flex-col -gap-1">
                    <h5 className="font-semibold text-base">{user?.name}</h5>
                    {user?.lastSeen === new Date() ? (
                      <p className="text-slate-500 text-xs">Online</p>
                    ) : (
                      <p className="text-slate-500 text-xs">
                        {`${dayjs(user?.lastSeen).fromNow()}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <ChatBody
                directMesg={chat.content}
                id={personalChat.memberId}
              />
              <ChatForm personal />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBox;
