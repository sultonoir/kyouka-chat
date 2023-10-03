/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Loader2, MessageSquarePlusIcon } from "lucide-react";
import React from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { api } from "@/lib/client";
import { useDebounce } from "use-debounce";
import { type User } from "@prisma/client";
import { Avatar, AvatarImage } from "../ui/avatar";
import useFriend from "@/hooks/useFriend";

const AddChat: React.FC = () => {
  const chat = useFriend();
  const [query, setQuery] = React.useState("");
  const [user, setUser] = React.useState<User | null>(null);
  const { mutate } = api.user.getSearch.useMutation({
    onSuccess: (e) => {
      setUser(e);
    },
  });

  const { mutate: createcon, isLoading: loading } =
    api.chat.createConversation.useMutation({
      onSuccess: (e) => {
        chat.onOpen({
          userId: e?.userId as string,
          chatId: e?.chatId as string,
          memberId: e?.memberId as string,
        });
      },
    });

  const handleChatOpen = () => {
    createcon({
      receiptId: user?.id as string,
    });
  };

  //? debounce

  const [debouncedQuery] = useDebounce<string>(query, 1000);

  React.useEffect(() => {
    if (debouncedQuery !== "") {
      mutate({
        query: debouncedQuery,
      });
    }
  }, [debouncedQuery, mutate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="z-0 hover:bg-default-100 rounded-full"
        >
          <MessageSquarePlusIcon className="text-iconnav" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-y-3 bg-bgsearch">
        <div className="flex flex-row gap-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-bs"
          />
        </div>
        {user && (
          <div className="flex justify-between items-center">
            <div className="flex flex-row gap-x-3 items-center">
              <Avatar>
                <AvatarImage
                  src={user.image as string}
                  alt={user.username as string}
                />
              </Avatar>
              <div className="flex flex-col">
                <h5>@{user.username}</h5>
                <p className="font-light text-iconnav text-xs">
                  {user.profileStatus}
                </p>
              </div>
            </div>
            <Button
              disabled={loading}
              onClick={handleChatOpen}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>Chat</>
              )}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AddChat;
