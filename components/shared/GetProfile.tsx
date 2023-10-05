import useProfileGroup from "@/hooks/useProfileGroup";
import { api } from "@/lib/client";

import React from "react";
import DetailsImage from "./DetailsImage";
import DetailsHeaders from "./DetailsHeaders";

import { motion } from "framer-motion";

import useProfileFriend from "@/hooks/useProfileFriend";
import Loader from "./Loader";
import NoData from "./NoData";

import { ChevronRightIcon } from "lucide-react";

const GetProfile = () => {
  const profileFriend = useProfileFriend();
  const profileGroup = useProfileGroup();
  const { data: user, isLoading } = api.user.getFriends.useQuery({
    friendName: profileFriend.username,
  });

  const variants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 200 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 1 }}
      className="flex flex-col w-full h-full"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {!user ? (
            <NoData />
          ) : (
            <>
              <DetailsHeaders
                title="info group"
                onClick={() => {
                  profileGroup.onClose();
                  profileFriend.onClose();
                }}
              />
              <div
                id="chat"
                className="flex1 flex flex-col grow overflow-y-auto relative w-full gap-y-5"
              >
                <DetailsImage
                  imageUrl={user?.image || ""}
                  altImage={user?.name || ""}
                  groupName={user?.name || ""}
                  username={user.username || ""}
                  member
                />
                <div className="bg-bgsearch w-full pl-7 py-2 pr-2">
                  <div className="mt-2 dark:text-[#667781] justify-between flex">
                    <h3 className="text-xs">Media, link,and dock</h3>
                    <h3 className="max-w-max w-full inline-flex mt-2 text-xs">
                      <ChevronRightIcon size={15} />
                    </h3>
                  </div>
                  <div className="flex flex-row gap-x-2 relative"></div>
                </div>
                <div className="max-h-max h-full bg-bgsearch py-5">
                  <p className="px-3">The same groups</p>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default GetProfile;
