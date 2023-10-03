import useProfileGroup from "@/hooks/useProfileGroup";
import { api } from "@/lib/client";
import { ChevronRightIcon, FileIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DetailsImage from "./DetailsImage";
import DetailsHeaders from "./DetailsHeaders";
import DetailsMember from "./DetailsMember";
import { motion } from "framer-motion";
import useFrofileFriend from "@/hooks/useProfileFriend";

const GetProfileGroup = () => {
  const profileGroup = useProfileGroup();
  const friends = useFrofileFriend();
  const { data: groups, isLoading } = api.grup.getGroup.useQuery({
    groupId: profileGroup.groupId,
  });

  const variants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 200 },
  };

  const media = groups?.conten.filter((e) => e.file);

  const me = groups?.member.find((e) => e.userId === profileGroup.memberId);
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
        <>loading...</>
      ) : (
        <>
          {!groups ? (
            <>nodata</>
          ) : (
            <>
              <DetailsHeaders
                title="info group"
                onClick={() => profileGroup.onClose()}
              />
              <div
                id="chat"
                className="flex1 flex flex-col grow overflow-y-auto relative w-full gap-y-5"
              >
                <DetailsImage
                  imageUrl={groups?.image || ""}
                  altImage={groups?.name || ""}
                  groupName={groups?.name}
                  groupLength={groups?.member.length}
                  group
                />
                <div className="bg-bgsearch w-full pl-7 py-2 pr-2">
                  <div className="align-baseline">{groups?.description}</div>
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
                <div className="bg-bgsearch w-full py-4 flex flex-col gap-y-1">
                  <div className="flex justify-between items-center px-7">
                    <div className="flex flex-row gap-x-2 items-center text-sm">
                      <p>{groups?.member.length}</p>
                      <p>Members</p>
                    </div>
                    <div>
                      <SearchIcon size={15} />
                    </div>
                  </div>
                  <DetailsMember
                    imageUrl={me?.user.image || ""}
                    name="Me"
                    etc={me?.user.profileStatus || ""}
                    admin={me?.role}
                  />
                  {groups?.member
                    .filter((e) => e.userId !== profileGroup.memberId)
                    .map((item) => (
                      <DetailsMember
                        imageUrl={item.user.image || ""}
                        name={item.user.username || ""}
                        key={item.id}
                        admin={item.role}
                        etc={item.user.profileStatus || "a"}
                        onClick={() => {
                          profileGroup.onClose();
                          friends.onOpen(item.user.id);
                        }}
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

export default GetProfileGroup;
