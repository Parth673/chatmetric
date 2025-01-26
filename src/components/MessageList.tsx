import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  messages: Message[];
};

const MessageList = ({ messages}: Props) => {
  // if (isLoading) {
  //   return (
  //     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  //       <Loader2 className="w-6 h-6 animate-spin" />
  //     </div>
  //   );
  // }
  if (!messages) return <></>;
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message, index) => {
        console.log(`Yes Messages ${messages}`)
        return ( 
          <div
            key={index}
            className={cn("flex", {
              "justify-end pl-10 pb-3": message.role === "user",
              // "justify-start pr-10": message.role !== "user"
              "justify-start pr-10 pb-3": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "dark:bg-slate-800 bg-slate-200": message.role === "user",
                  "dark:bg-slate-950 bg-slate-300": message.role === "assistant",
                }
              )}
            >
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;