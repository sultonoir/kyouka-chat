import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { UserPlus2 } from "lucide-react";
import { api } from "@/lib/client";
import { type Friend } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import useGroup from "@/hooks/useGroupChat";
import { toast } from "../ui/use-toast";
import FriendUI from "./FriendUI";

const AddMemberDropdown = () => {
  const group = useGroup();
  const { data } = api.user.getUser.useQuery();
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  const { mutate, isLoading } = api.grup.addMember.useMutation({
    onSuccess: () => {
      setSelectedFriends([]);
    },
    onError: (e) => {
      setSelectedFriends([]);
      toast({ variant: "destructive", description: e.message });
    },
  });

  const handleFriendClick = (friend: Friend) => {
    const isFriendSelected = selectedFriends.some(
      (selected) => selected.id === friend.id
    );

    if (isFriendSelected) {
      setSelectedFriends(
        selectedFriends.filter((selected) => selected.id !== friend.id)
      );
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleSubmit = () => {
    // Mengonversi array selectedFriends menjadi format yang diinginkan
    const formattedData = selectedFriends.map((friend) => ({
      groupId: group.groupId,
      memberId: friend.friendName,
    }));

    // Kemudian, Anda dapat mengirim data dengan array formattedData
    mutate(formattedData);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <UserPlus2 className="text-iconnav" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-bgsearch max-w-max w-full">
        {!data ? null : (
          <div className="flex flex-col gap-y-3 mb-2">
            {data.friend.map((friend) => {
              return (
                <div
                  className="flex flex-row gap-x-3 items-center"
                  key={friend.id}
                >
                  <Checkbox
                    id={friend.id}
                    checked={selectedFriends.some(
                      (select) => select.id === friend.id
                    )}
                    onClick={() => handleFriendClick(friend)}
                  />
                  <Label
                    htmlFor={friend.id} // Gunakan 'htmlFor' untuk mengaitkan label dengan input
                    className="flex-1 flex flex-row gap-x-1 items-center"
                  >
                    <FriendUI friend={friend} />
                  </Label>
                </div>
              );
            })}
          </div>
        )}

        <Button
          disabled={isLoading}
          onClick={handleSubmit}
        >
          Lihat Data yang Dipilih
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default AddMemberDropdown;
