import { api } from "@/lib/client";
import { Loader2, SendHorizonal } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ModalUploadImage from "../shared/ModalUploadImage";
import useFriend from "@/hooks/useFriend";
import useGroupChat from "@/hooks/useGroupChat";

interface Props {
  personal?: boolean;
}

const ChatForm = ({ personal }: Props) => {
  const friendschat = useFriend();
  const groupchat = useGroupChat();
  const [chat, setChat] = React.useState<string>("");
  const ctx = api.useContext();

  const { mutate, isLoading } = api.chat.postContent.useMutation({
    onSuccess: () => {
      setChat("");
      void ctx.chat.getConversation.invalidate();
    },
  });

  const { mutate: creatmessage, isLoading: loading } =
    api.grup.cretaeMessage.useMutation({
      onSuccess: () => {
        setChat("");
        void ctx.grup.getGroup.invalidate();
      },
    });

  const handleSubmit = () => {
    if (chat === "") {
      return null;
    }
    if (personal) {
      mutate({
        id: friendschat.chatId,
        body: chat,
      });
    } else {
      creatmessage({
        groupId: groupchat.groupId,
        content: chat,
        memberId: groupchat.memberId,
      });
    }
  };

  return (
    <div className="flex flex-row justify-between p-5 items-center bg-bs">
      {personal ? <ModalUploadImage ischat /> : <ModalUploadImage />}

      <Textarea
        id="form"
        placeholder="chat"
        className={`w-full dark:bg-[#2a3942] m-0 resize-none border-0 pr-10 focus:ring-transparent focus-visible:ring-transparent md:pr-12 pl-3 md:pl-4 focus-visible:ring-offset-0
        focus-visible:outline-none min-h-0`}
        value={chat}
        onChange={(e) => setChat(e.target.value)}
      />

      {personal ? (
        <Button
          className="hover:bg-default-200 ml-2 bg-transparent group"
          disabled={isLoading}
          onClick={handleSubmit}
          size={"icon"}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className=" group-hover:-rotate-45 duration-300 ease-in" />
          )}
        </Button>
      ) : (
        <Button
          className="hover:bg-default-200 ml-2 bg-transparent group"
          disabled={loading}
          onClick={handleSubmit}
          size={"icon"}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className=" group-hover:-rotate-45 duration-300 ease-in" />
          )}
        </Button>
      )}
    </div>
  );
};

export default ChatForm;
