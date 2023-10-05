"use client";

import SearchChat from "../search/SearchChat";
import NavbarUI from "../navbar/NavbarUI";
import ProfileUI from "../navbar/ProfileUI";
import CreateGroup from "../navbar/CreateGroup";
import ChatBox from "../chat/ChatBox";
import ChatList from "../Chatsidelist/ChatList";
import useFriend from "@/hooks/useFriend";
import useGroup from "@/hooks/useGroupChat";
import GetProfile from "./GetProfile";
import useProfileFriend from "@/hooks/useProfileFriend";
import ChatGroupBox from "../chat/ChatGroupBox";
import useProfileGroup from "@/hooks/useProfileGroup";
import GetProfileGroup from "./GetProfileGroup";
import { api } from "@/lib/client";

const HomeClient = () => {
  const { data } = api.user.getUser.useQuery();
  const chat = useFriend();
  const group = useGroup();
  const profileFriend = useProfileFriend();
  const profileGroup = useProfileGroup();
  const member = data?.member;
  return (
    <div className="flex flex-row w-full h-screen">
      <div className="basis-[30%] relative flex flex-col overflow-visible border-r border-default-200">
        <ProfileUI />
        <CreateGroup />
        <NavbarUI />
        <div className="flex flex-col max-h-max">
          <SearchChat />
        </div>
        <div
          id="chat"
          className="flex flex-col grow overflow-y-auto relative"
        >
          <div className="h-[1650px] relative">
            <ChatList
              member={member}
              user={data}
            />
            <div className="absolute inset-0 -z-10 bg-bgsearch"></div>
          </div>
        </div>
      </div>
      <div className="grow relative h-full overflow-hidden">
        {chat.isOpen && <ChatBox />}
        {group.isOpen && <ChatGroupBox />}
      </div>
      {profileFriend.isOpen && (
        <div className="basis-[30%] relative flex flex-col overflow-hidden border-l border-default-200">
          <GetProfile />
        </div>
      )}
      {profileGroup.isOpen && (
        <div className="basis-[30%] relative flex flex-col overflow-hidden border-l border-default-200">
          <GetProfileGroup />
        </div>
      )}
    </div>
  );
};

export default HomeClient;
