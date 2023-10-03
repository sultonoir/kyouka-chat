import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailsMemberProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  name: string;
  etc?: string;
  admin?: string;
  sendAt?: Date;
  sender?: string | null;
  active?: boolean;
  fileUrl?: string | null;
  message?: string | null;
}

const DetailsMember: React.FC<DetailsMemberProps> = ({
  imageUrl,
  name,
  admin,
  etc,
  sendAt,
  active,
  sender,
  fileUrl,
  message,
  className,
  ...Props
}) => {
  const isAdmin = admin === "admin";

  const formatDateString = (dateString: Date | undefined | null) => {
    if (!dateString) {
      return null;
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
    };

    return new Intl.DateTimeFormat("id-ID", options).format(dateString);
  };

  const deteksiJenisFile = (namaFile: string) => {
    const ekstensi = namaFile.split(".").pop()?.toLowerCase();
    switch (ekstensi) {
      case "jpg":
      case "jpeg":
      case "png":
        return <>{sender} : mengirim gambar</>;
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
        return <>{sender} : mengirim dokumen</>;
      default:
        return "Tipe tidak dikenal";
    }
  };

  return (
    <div
      {...Props}
      className={cn(
        "flex flex-row h-[72px] w-full hover:bg-bs group cursor-pointer",
        className,
        `${active && "bg-[#233138]"}`
      )}
    >
      <div className="flex px-4 items-center">
        <Avatar className="w-[49px] h-[49px]">
          <AvatarImage
            src={imageUrl || ""}
            alt={name}
            className="object-cover"
          />
          <AvatarFallback>K</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col basis-auto grow justify-center min-w-0 pr-3">
        <div className="flex items-center leading-normal">
          <div className="flex grow font-normal wrap leading-normal text-left break-words items-center text-default-800">
            {name}
          </div>
          {isAdmin && (
            <div className="mt-[3px] ml-[6px] leading-[14px] text-ellipsis whitespace-nowrap text-xs max-w-[100%] ">
              <div className="px-[5px] py-[1.5px] flex items-center bg-[#2a3942] rounded-sm">
                Admin Group
              </div>
            </div>
          )}
          {sendAt && (
            <div className="mt-[3px] ml-[6px] leading-[14px] text-ellipsis whitespace-nowrap text-xs max-w-[100%] ">
              <div className="px-[5px] py-[1.5px] flex items-center rounded-sm dark:text-[#8696a0]">
                {formatDateString(sendAt)}
              </div>
            </div>
          )}
        </div>
        <div className="flex min-h-[20px] text-xs mt-[2px] overflow-x-hidden">
          {etc && (
            <div className="font-normal grow leading-5 whitespace-nowrap text-ellipsis overflow-hidden max-w-xs dark:text-[#8696a0]">
              {etc}
            </div>
          )}
          {sender && fileUrl && (
            <div className="font-normal grow leading-5 whitespace-nowrap text-ellipsis overflow-hidden max-w-xs dark:text-[#8696a0]">
              {deteksiJenisFile(fileUrl)}
            </div>
          )}
          {sender && message && (
            <div className="font-normal grow leading-5 whitespace-nowrap text-ellipsis overflow-hidden max-w-[280px] w-full dark:text-[#8696a0]">
              {sender}: {message}
            </div>
          )}
          <div className="group-hover:translate-x-0 translate-x-24 transition-all duration-300">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsMember;
