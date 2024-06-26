import { useChatState } from "../../Context/Provider";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

interface Props {
  sender: User;
  text: string;
  isFirstMessage: boolean;
  isGroup: boolean | undefined;
  isImage: boolean;
}

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted: boolean;
}

function Message(props: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const chatState = useChatState();
  const isSender: boolean = chatState.authUser?._id === props.sender._id;
  const sender: User = props.sender;

  function handleImage() {
    chatState.setImageView(props.text);
    chatState.setVisibleImage(true);
  }

  return (
    <div
      className={`flex w-full gap-2 items-start relative ${
        props.isFirstMessage && "mt-2"
      }`}
    >
      <div className="w-10 h-10 absolute">
        {!isSender && props.isFirstMessage && props.isGroup && (
          <Avatar className="w-10 h-10 rounded-full ">
            {sender.image && sender?.image ? (
              <AvatarImage
                src={sender?.image}
                className="w-full h-full rounded-full overflow-hidden"
              />
            ) : (
              <AvatarFallback className=" bg-[#272f37]">
                {sender.username[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        )}
      </div>
      <div
        className={`flex ${
          isSender ? "justify-end" : "justify-start"
        } relative w-full ${props.isGroup && "ml-11"}`}
      >
        {props.isFirstMessage && (
          <span
            className={`${
              isSender ? "-right-[6px]" : "-left-[6px]"
            } absolute top-0`}
          >
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="4 6 7 4.5"
              width="16"
              height="10.29"
            >
              <path
                d="M4 6H11L7.5 10.5L4 6Z"
                fill={`${
                  isSender ? "hsl(223, 96%, 54%)" : "hsl( 210, 15%, 26%)"
                }`}
              ></path>
            </svg>
          </span>
        )}
        {props.isImage ? (
          <>
            {!imageLoaded && (
              <Skeleton className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] h-[50vh] rounded-xl bg-primary" />
            )}
            <img
              src={props.text}
              alt={props.text}
              className={`max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] max-h-[50vh] rounded-xl border-4 cursor-pointer ${
                isSender ? "border-softBlue" : " border-primary "
              }`}
              onLoad={() => setImageLoaded(true)}
              onClick={handleImage}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
          </>
        ) : (
          <div
            className={`${
              isSender ? "bg-softBlue " : " bg-primary "
            } py-1 px-3 relative break-words max-w-[90%] xl:max-w-[70%] rounded-xl text-pretty`}
          >
            {props.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
