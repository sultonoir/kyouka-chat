/* eslint-disable @typescript-eslint/require-await */
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { api } from "@/lib/client";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { toast } from "../ui/use-toast";
import { CameraIcon } from "lucide-react";
import useFriend from "@/hooks/useFriend";
import useGroupChat from "@/hooks/useGroupChat";

interface Props {
  ischat?: boolean;
}

const ModalUploadImage = ({ ischat }: Props) => {
  const friendschat = useFriend();
  const groupchat = useGroupChat();
  const [chat, setChat] = React.useState<string>("");
  const ctx = api.useContext();
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const { startUpload } = useUploadThing("media");

  const { mutate } = api.grup.cretaeMessage.useMutation({
    onSuccess: () => {
      setChat("");
      setImage("");
      setOpen(false);
      void ctx.invalidate();
    },
  });

  const { mutate: createchat } = api.chat.postContent.useMutation({
    onSuccess: () => {
      toast({ description: "file uploaded" });
      setChat("");
      setImage("");
      setOpen(false);
      void ctx.invalidate();
    },
    onError: (e) => {
      setChat("");
      setImage("");
      setOpen(false);
      void ctx.invalidate();
      toast({ variant: "destructive", description: e.message });
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const blob = await fetch(image).then((res) => res.blob());

      // Mendapatkan tipe MIME dari blob
      const mimeType = blob.type;

      // Membuat nama file berdasarkan tipe MIME
      const fileExtension = mimeType.split("/")[1];
      const fileName = `file_${Date.now()}.${fileExtension}`;

      // Membuat objek File dari blob dengan nama dan tipe otomatis
      const file = new File([blob], fileName, { type: mimeType });

      let imgUpload;
      const imgRes = await startUpload([file]);
      if (imgRes && imgRes[0].url) {
        imgUpload = imgRes[0].url;
      }

      createchat({
        id: friendschat.chatId,
        body: chat,
        file: imgUpload,
      });
    } catch (error) {
      toast({ variant: "destructive", description: String(error) });
    }
  };
  const handleClick = async () => {
    setIsLoading(true);
    try {
      const blob = await fetch(image).then((res) => res.blob());

      // Mendapatkan tipe MIME dari blob
      const mimeType = blob.type;

      // Membuat nama file berdasarkan tipe MIME
      const fileExtension = mimeType.split("/")[1];
      const fileName = `file_${Date.now()}.${fileExtension}`;

      // Membuat objek File dari blob dengan nama dan tipe otomatis
      const file = new File([blob], fileName, { type: mimeType });

      let imgUpload;
      const imgRes = await startUpload([file]);
      if (imgRes && imgRes[0].url) {
        imgUpload = imgRes[0].url;
      }

      mutate({
        groupId: groupchat.groupId,
        content: chat,
        memberId: groupchat.memberId,
        file: imgUpload,
      });
    } catch (error) {
      toast({ variant: "destructive", description: String(error) });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="rounded-full mr-2"
          variant={"ghost"}
          size={"icon"}
        >
          <CameraIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>upload Image</DialogTitle>
        </DialogHeader>
        {image && (
          <div className="relativ max-h-max h-full mx-auto">
            <Image
              src={image}
              alt={"upload"}
              width={200}
              height={200}
              className="object-cover"
            />
          </div>
        )}

        <DialogFooter>
          <Input
            type="file"
            className="account-form_image-input"
            onChange={handleImageUpload}
          />
          {ischat ? (
            <Button
              disabled={isLoading}
              onClick={handleSubmit}
            >
              upload
            </Button>
          ) : (
            <Button
              disabled={isLoading}
              onClick={handleClick}
            >
              upload
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUploadImage;
