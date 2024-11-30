import React, { useEffect, useState, useMemo, useRef } from "react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import useObserver from "@/hooks/useObserver";
import useAuthStore from "@/stores/Auth.store";
import useCurrentPrivateChatRoomStore from "@/stores/CurrentPvtChat.store";
import useLiveMessageStore from "@/stores/LiveMassageStore";
import useSocketStore from "@/stores/Socket.store";
import { LiveMsg, ReplyMsgType } from "@/types";
import useOnlineUsersStore from "@/stores/onlineUsers.store";
import { useRouter } from "next/router";
import useReplyMessageStore from "@/stores/ReplyMessage.store";
import { IoIosArrowDown } from "react-icons/io";
import { format } from "date-fns";
import { formatTimeOfFirstMessage } from "@/utils/functions";
import MessageAction from "../MessageInput/MessageAction";

const getMsgContCls = (userId: string, senderId: string) => {
  return userId !== senderId
    ? "w-fit self-start max-w-[32vw] break-words rounded-lg rounded-tl-none"
    : "w-fit self-end max-w-[32vw] break-words rounded-lg rounded-tr-none";
};

const Message_Cont = () => {
  const { messages, setLiveMessages } = useLiveMessageStore();
  const { user } = useAuthStore();
  const { currentRoom, setCurrentRoom } = useCurrentPrivateChatRoomStore();
  const { socket } = useSocketStore();
  const { onlineUsers, setOnlineUsers } = useOnlineUsersStore();
  const [pageNumber, setPageNumber] = useState(1);
  const [reset, setReset] = useState(false);
  const router = useRouter();

  const { loading, resData, hasMore, isError } = useInfiniteScroll<
    Partial<LiveMsg>
  >({
    pageNumber,
    url: `chat/get-all-chats/${currentRoom?.roomId}`,
    reset,
  });

  useEffect(() => {
    setReset(true);
    setPageNumber(1);
  }, [currentRoom, setCurrentRoom]);

  useEffect(() => {
    if (reset) setReset(false);
  }, [resData]);

  // Merged socket event handlers into a single useEffect
  useEffect(() => {
    if (!socket) return;
    // Join room when socket and currentRoom exist
    socket.emit("JOIN_ROOM", {
      groupId: currentRoom?.roomId,
      groupName: currentRoom?.name,
      isPrivateGroup: currentRoom?.isGroupChat,
      members: currentRoom?.members,
    });

    const leaveRoom = () => {
      socket.emit("LEAVE_ROOM", {
        groupId: currentRoom?.roomId,
        groupName: currentRoom?.name,
        isPrivateGroup: currentRoom?.isGroupChat,
      });
    };
    const handleRouteChange = () => {
      leaveRoom();
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      socket.emit("LEAVE_ROOM", {
        groupId: currentRoom?.roomId,
        groupName: currentRoom?.name,
        isPrivateGroup: currentRoom?.isGroupChat,
      });

      socket.on("ONLINE_USERS", (users) => {
        setOnlineUsers(users);
      });

      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [socket, currentRoom]);

  let allMessages = useMemo(
    () => (resData?.length ? [...messages, ...resData] : [...messages]),
    [messages, resData]
  );

  const { lastBookElementRef } = useObserver({
    loading,
    hasMore,
    setPageNumber,
  });

  //message reply logic
  const { setReplyMessage } = useReplyMessageStore();

  const handleReplyMessage = ({
    groupId,
    parentMsgContent,
    parentMsgId,
  }: ReplyMsgType) => {
    setReplyMessage({
      groupId,
      parentMsgContent,
      parentMsgId,
    });
  };

  //hover logic added
  const [hoverIdx, setHoverIdx] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex flex-col-reverse overflow-y-auto h-full px-16 py-7 overflow-x-hidden gap-3"
      ref={containerRef}
    >
      {allMessages.map((msg: Partial<LiveMsg>, index: number) => {
        const isLastMessage = allMessages.length === index + 1;
        const msgContent =
          msg?.type === "TEXT" ? (
            <p className="text-[0.9rem]">{msg?.content}</p>
          ) : (
            <img
              src={msg?.attachments[0]?.mediaUrl}
              alt="media"
              width={200}
              height={100}
              className="object-contain"
            />
          );

        return (
          <div
            key={msg._id}
            className={`${getMsgContCls(
              user?._id,
              msg?.sender?._id
            )} shadow-md bg-gray-200 flex flex-col relative cursor-pointer gap-[0.12rem] ${
              msg?.type === "IMAGE" ? "px-2 py-1" : "py-1 px-3"
            }`}
            ref={isLastMessage ? lastBookElementRef : null}
            onMouseEnter={() => setHoverIdx(index)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            {hoverIdx === index && (
              <MessageAction
                handleReplyMsg={() =>
                  handleReplyMessage({
                    groupId: currentRoom?.roomId,
                    parentMsgContent:
                      msg.type === "IMAGE"
                        ? msg?.attachments[0]?.mediaUrl
                        : msg?.content,
                    parentMsgId: msg?._id,
                  })
                }
              />
            )}
            <div className="place-items-start">
              <p className="text-[0.7rem] font-medium">{msg?.sender?.name}</p>
            </div>

            <div className="flex flex-col">
              {msg?.isReplyMsg && (
                <div className="w-full px-3 py-1 bg-white rounded-sm">
                  <p className="text-[0.8rem]">{msg?.parentMsgContent}</p>
                </div>
              )}
              <div className={msg?.isReplyMsg && `mt-2 pl-1`}>{msgContent}</div>
            </div>

            <div className="place-items-end">
              <p className="text-[0.7rem]">
                {msg?.createdAt
                  ? format(new Date(msg.createdAt), "hh:mm a")
                  : ""}
              </p>
            </div>
          </div>
        );
      })}
      {loading && (
        <div className="h-[3rem]">
          <p>Loading..</p>
        </div>
      )}
      {isError && (
        <div className="h-[3rem]">
          <p>Error</p>
        </div>
      )}
    </div>
  );
};

export default Message_Cont;
