/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { CameraIcon, UsersIcon } from "lucide-react";
import React, { type ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { api } from "@/lib/client";
import { toast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useGroupChat from "@/hooks/useGroupChat";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

const formSchema = z.object({
  image_url: z.string(),
  name: z.string().min(1),
  desc: z.string().min(1).optional(),
  id: z.string(),
});

const CreateGroup = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const group = useGroupChat();
  const { startUpload } = useUploadThing("media");

  const ctx = api.useContext();
  const { data } = api.grup.getGroup.useQuery({
    groupId: group.groupId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_url: data?.image ? data.image : "",
      name: data?.name ? data.name : "",
      desc: data?.description ? data.description : "",
      id: group.groupId,
    },
  });

  const { mutate, isLoading } = api.grup.editGroup.useMutation({
    onSuccess: () => {
      toast({ description: "success edit group" });
      form.reset();
      void ctx.invalidate();
      setOpen(false);
    },
    onError: (e) => {
      toast({ variant: "destructive", description: e.message });
      void ctx.invalidate();
      setOpen(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const blob = values.image_url;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.image_url = imgRes[0].url;
      }
    }
    mutate({
      name: values.name,
      image: values.image_url,
      desc: values.desc,
      id: values.id,
    });
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="rounded-full"
          size={"icon"}
          variant={"ghost"}
        >
          <CameraIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-3 px-5 mt-5"
          >
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-52 h-52 mx-auto flex justify-center items-center cursor-pointer bg-default rounded-full">
                    {field.value ? (
                      <Avatar className="h-52 w-52">
                        <AvatarImage
                          src={field.value}
                          alt="Group"
                          height={440}
                          width={440}
                          className="object-cover"
                        />
                        <AvatarFallback>K</AvatarFallback>
                      </Avatar>
                    ) : (
                      <UsersIcon className="h-36 w-36" />
                    )}
                  </FormLabel>
                  <FormControl className="flex-1 text-base-semibold text-gray-200 mx-auto">
                    <Input
                      type="file"
                      accept="image/*"
                      placeholder="Add profile photo"
                      className="cursor-pointer border-none bg-bs w-max outline-none file:text-bgmess !important"
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="text"
                      placeholder="Name group"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="text"
                      placeholder="description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
