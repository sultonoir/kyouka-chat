import { api } from "@/lib/client";
import React from "react";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";
import dayjs from "dayjs";
import second from "dayjs/plugin/relativeTime";
import useGroupChat from "@/hooks/useGroupChat";
import AddMemberDropdown from "../shared/AddMemberDropdown";
import useProfileGroup from "@/hooks/useProfileGroup";
import useProfileFriend from "@/hooks/useProfileFriend";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Loader from "../shared/Loader";
import NoData from "../shared/NoData";
dayjs.extend(second);

const ChatGroupBox = () => {
  const groupChat = useGroupChat();
  const groupProfile = useProfileGroup();
  const { data: chat, isLoading } = api.grup.getGroup.useQuery({
    groupId: groupChat.groupId,
  });

  const admin = chat?.member.find((e) => e.role === "admin");
  const profileFriend = useProfileFriend();
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
                    groupProfile.onOpen({
                      groupId: chat.id,
                      memberId: groupChat.memberId,
                    });
                    profileFriend.onClose();
                  }}
                  className="flex flex-row gap-x-3 items-center cursor-pointer"
                >
                  <div className="flex items-center">
                    <Avatar className="w-[39px] h-[39px]">
                      <AvatarImage
                        src={chat.image || ""}
                        alt={chat.name}
                        className="object-cover"
                      />
                      <AvatarFallback>K</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col -gap-1">
                    <h5 className="font-semibold text-base">{chat.name}</h5>
                    <div className="flex space-x-0.5">
                      {chat.member.map((member) => (
                        <React.Fragment key={member.id}>
                          <p className="text-slate-500 text-xs">
                            {member.user.username},
                          </p>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                {admin?.userId === groupChat.memberId && <AddMemberDropdown />}
              </div>
              <ChatBody
                directMesg={chat.conten}
                id={groupChat.memberId}
                isGroup
              />
              <ChatForm />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChatGroupBox;
