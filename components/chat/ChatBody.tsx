import { type Content, type User } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import Image from "next/image";
import useProfileFriend from "@/hooks/useProfileFriend";
import useProfileGroup from "@/hooks/useProfileGroup";

dayjs.extend(calendar);

interface Props {
  directMesg: Array<
    Content & {
      user: User;
    }
  >;
  id?: string;
  isGroup?: boolean;
}

const ChatBody: React.FC<Props> = ({ directMesg, id, isGroup }) => {
  const profileFriend = useProfileFriend();
  const profilGroup = useProfileGroup();
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [directMesg]);

  return (
    <div
      id="chat"
      ref={chatBoxRef}
      className="flex-1 overflow-y-auto z-[0] overflow-x-hidden p-5"
    >
      {directMesg?.map((chat) => {
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
                  width={200}
                  height={200}
                  style={{ height: "inherit" }}
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
                <iframe
                  src={`https://docs.google.com/viewer?url=${namaFile}&embedded=true`}
                  title="Dokumen PDF"
                  className="max-h-max h-full"
                ></iframe>
              );
            default:
              return "Tipe tidak dikenal";
          }
        }
        return (
          <div
            key={chat.id}
            className="flex flex-col"
          >
            <div
              onClick={() => {
                if (chat.authorId !== id) {
                  profileFriend.onOpen(chat.user.id);
                  profilGroup.onClose();
                }
              }}
              key={chat.id}
              className={`
          ${chat.body?.length && chat.body?.length >= 100 && "max-w-xs w-full"}
          ${
            chat.authorId === id
              ? "text-end ml-auto before:absolute before:top-0 before:-right-3 before:border-x-[20px] before:border-y-[10px] before:border-transparent before:border-t-bgmess  before:-z-10 bg-bgmess"
              : "before:absolute before:top-0 before:-left-3 before:border-x-[20px] before:border-y-[10px] before:border-transparent before:border-t-bs  before:-z-10 bg-bs"
          }
          p-2 max-w-max w-full rounded-lg flex flex-col mt-1 relative cursor-pointer`}
            >
              {isGroup && (
                <>
                  {chat.authorId !== id && (
                    <h4 className="text-pink-700">@{chat.user.name}</h4>
                  )}
                </>
              )}

              {chat.file && (
                <div className="relative h-[200px]">
                  {deteksiJenisFile(chat.file)}
                </div>
              )}

              <h5
                className={`${
                  chat?.body?.length && chat?.body?.length >= 100
                    ? "w-full"
                    : ""
                } text-start`}
              >
                {chat.body}
              </h5>
              <p
                className={`${chat.file && "mt-1"} text-foreground/50 text-xs`}
              >
                {`${dayjs(chat.updatedAt).calendar()}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBody;
