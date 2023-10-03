/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { ArrowLeft, UsersIcon } from "lucide-react";
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
import useCreateGroup from "@/hooks/useCreateGroup";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  image_url: z.string(),
  name: z.string().min(1),
  desc: z.string().min(1).optional(),
});

const CreateGroup = () => {
  const [files, setFiles] = useState<File[]>([]);
  const group = useCreateGroup();
  const { startUpload } = useUploadThing("media");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_url: "",
      name: "",
      desc: "",
    },
  });

  const ctx = api.useContext();
  const { mutate, isLoading } = api.grup.createGroup.useMutation({
    onSuccess: () => {
      toast({ description: "success create group" });
      void ctx.invalidate();
      form.reset();
      group.onClose();
    },
    onError: (e) => {
      toast({ variant: "destructive", description: e.message });
      void ctx.invalidate();
      form.reset();
      group.onClose();
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
      description: values.desc,
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
    <>
      {group.isOpen && (
        <div className="absolute w-full h-screen bg-bgsearch z-[1]  flex-col gap-y-5 overflow-hidden">
          <div className="h-28 bg-bgchat p-5">
            <div className="flex flex-row items-end w-full h-full">
              <div className="flex flex-row gap-x-3 justify-center items-center">
                <ArrowLeft
                  onClick={group.onClose}
                  className="cursor-pointer"
                />
                <p className="text-2xl">Create group</p>
              </div>
            </div>
          </div>
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
                      <Textarea
                        className="w-full m-0 resize-none border-0 pr-10 focus:ring-transparent focus-visible:ring-transparent md:pr-12 pl-3 md:pl-4 focus-visible:ring-offset-0
                        focus-visible:outline-none min-h-0"
                        disabled={isLoading}
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
        </div>
      )}
    </>
  );
};

export default CreateGroup;
