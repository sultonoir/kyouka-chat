import useProfileGroup from "@/hooks/useProfileGroup";
import { api } from "@/lib/client";

import React from "react";
import DetailsImage from "./DetailsImage";
import DetailsHeaders from "./DetailsHeaders";

import { motion } from "framer-motion";

import useProfileFriend from "@/hooks/useProfileFriend";
import Loader from "./Loader";
import NoData from "./NoData";
import DetailsMember from "./DetailsMember";
import { ChevronRightIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  const { data } = api.user.getUser.useQuery();

  const mediasame = user?.member.find(
    (e) => e.chat?.receiver === data?.id || e.chat?.sender === data?.id
  );

  const array1 = data?.member; // Array pertama
  const array2 = user?.member; // Array kedua

  const hasilSaringan = array1?.filter((a1) => {
    return array2?.some((a2) => a2.groupId === a1.groupId);
  });

  const media = mediasame?.chat?.content.filter((e) => e.file);

  function deteksiJenisFile(namaFile: string) {
    const ekstensi = namaFile.split(".").pop()?.toLowerCase();
    switch (ekstensi) {
      case "jpg":
      case "jpeg":
      case "png":
        return (
          <Image
            src={namaFile}
            alt="Gambar"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
          />
        );
      case "mp3":
        return (
          <audio
            controls
            className="max-h-max h-full"
          >
            <source
              src={namaFile}
              type="audio/mpeg"
            />
            Browser Anda tidak mendukung tag audio.
          </audio>
        );
      case "pdf":
        return (
          <Link
            href={`https://docs.google.com/viewer?url=${namaFile}&embedded=true`}
            className="w-full h-full flex justify-center items-center"
          >
            <FileIcon size={200} />
          </Link>
        );
      default:
        return "Tipe tidak dikenal";
    }
  }

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
                      {media?.length} <ChevronRightIcon size={15} />
                    </h3>
                  </div>
                  <div className="flex flex-row gap-x-2 relative">
                    {media
                      ?.sort(
                        (a, b) =>
                          new Date(b.createdAt || new Date()).getTime() -
                          new Date(a.createdAt || new Date()).getTime()
                      ) // Urutkan berdasarkan waktu pembuatan
                      .slice(0, 4) // Ambil 4 elemen pertama
                      .map((item) => (
                        <div
                          key={item.id}
                          className="relative h-20 w-20 inline-flex justify-center items-center"
                        >
                          {deteksiJenisFile(item.file || "")}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="max-h-max h-full bg-bgsearch py-5">
                  <p className="px-3">The same groups</p>
                  {hasilSaringan
                    ?.filter((e) => e.groupId)
                    .map((item) => (
                      <DetailsMember
                        key={item.id}
                        imageUrl={item.group?.image || ""}
                        name={item.group?.name || ""}
                        etc={item.group?.description || ""}
                      />
                    ))}
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
