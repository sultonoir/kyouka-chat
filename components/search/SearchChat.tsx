import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";
import useSearch from "@/hooks/useSearch";
import { useDebounce } from "use-debounce";
import { api } from "@/lib/client";
import DetailsMember from "../shared/DetailsMember";
import useGroupChat from "@/hooks/useGroupChat";
import useFriend from "@/hooks/useFriend";

const SearchChat = () => {
  const [query, setQuery] = React.useState("");
  const search = useSearch();
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    search.onSearch(e.target.value);
  };

  const [debouncedQuery] = useDebounce<string>(query, 1000);

  const { data } = api.user.findMany.useQuery({
    query: debouncedQuery,
  });

  const ctx = api.useContext();
  const groupChat = useGroupChat();
  const personalChat = useFriend();

  const { mutate: joingroup } = api.grup.joinGroup.useMutation({
    onSuccess: (e) => {
      groupChat.onOpen({ groupId: e.groupId || "", memberId: e.userId || "" });
      void ctx.invalidate();
    },
  });
  const { mutate: createchat } = api.chat.createConversation.useMutation({
    onSuccess: (e) => {
      personalChat.onOpen({
        userId: e?.userId as string,
        chatId: e?.chatId as string,
        memberId: e?.memberId as string,
      });
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex w-full gap-x-2 p-2 bg-bgsearch">
        <Input
          placeholder="Search Chat"
          className="bg-bs"
          value={query}
          onChange={handleSearch}
        />
        <Button
          size="icon"
          className="bg-transparent hover:bg-transparent"
        >
          <SearchIcon className="text-iconnav" />
        </Button>
      </div>
      <div className="flex flex-col gap-y-1 w-full mb-1">
        {!data ? null : (
          <>
            {data.user.length > 0 && (
              <h2 className="px-5 mt-2 pb-2 border-b border-border">User</h2>
            )}
            {data.user.map((user) => (
              <DetailsMember
                key={user.id}
                imageUrl={user.image || ""}
                name={user.name || ""}
                etc={user.profileStatus || ""}
                onClick={() => {
                  createchat({
                    receiptId: user.id,
                  });
                }}
              />
            ))}
            {data.group.length > 0 && (
              <h2 className="px-5 mt-2 pb-2 border-b border-border">Group</h2>
            )}
            {data.group.map((group) => (
              <DetailsMember
                key={group.id}
                imageUrl={group.image || ""}
                name={group.name || ""}
                etc={group.description || ""}
                onClick={() => {
                  joingroup({
                    groupId: group.id,
                  });
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchChat;
