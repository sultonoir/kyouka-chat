/* eslint-disable @typescript-eslint/require-await */
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import "cropperjs/dist/cropper.css";

import { useUploadThing } from "@/lib/uploadthing";

import { Loader2, UploadCloudIcon } from "lucide-react";
import { api } from "@/lib/client";
import { toast } from "../ui/use-toast";
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
import getCroppedImg from "@/lib/utils";

export const UploadImage: React.FC = () => {
  const ctx = api.useContext();
  const [image, setImage] = useState("");
  const [rotation, setRotation] = useState<number>(0);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = useCallback(
    (
      croppedArea: unknown,
      croppedAreaPixels: React.SetStateAction<{
        x: number;
        y: number;
        width: number;
        height: number;
      } | null>
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  //* handle upload

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const { mutate } = api.user.userUploadImage.useMutation({
    onSuccess: () => {
      toast({ description: "Image has change" });
      setImage("");
      void ctx.user.invalidate();
    },
    onError: (e) => {
      toast({ variant: "destructive", description: e.message });
      setImage("");
    },
  });
  //*upload media
  const { startUpload } = useUploadThing("media");

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Menjalankan showCroppedImage untuk mendapatkan croppedImage
      let imgCrop;
      if (image && croppedAreaPixels) {
        const croppedImg = await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation
        );
        imgCrop = croppedImg;
      }
      // Mendapatkan blob dari croppedImage
      const blob = await fetch(imgCrop as string).then((res) => res.blob());

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
        image: imgUpload as string,
      });
    } catch (error) {
      throw new Error(`${String(error)}`);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="flex flex-row items-center hover:bg-bgchat rounded-lg py-2 gap-x-1 cursor-pointer bg-transparent">
          <UploadCloudIcon className="mr-3 text-gray-500" />
          Upload image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-max w-full">
        <DialogHeader>
          <DialogTitle>Change profile image</DialogTitle>
        </DialogHeader>
        <div className={`${!image ? "hidden" : "block"} relative`}>
          <div className="crop-container">
            <Cropper
              image={image || ""}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              zoomSpeed={0.1}
              maxZoom={3}
              zoomWithScroll={true}
              showGrid={true}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
            />
          </div>
        </div>

        <DialogFooter>
          <Input
            type="file"
            className="account-form_image-input"
            onChange={handleImageUpload}
          />
          <Button
            disabled={isLoading}
            onClick={handleSubmit}
            type="submit"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImage;
