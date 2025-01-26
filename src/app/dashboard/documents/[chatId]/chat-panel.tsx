"use client";

import { cn } from "@/lib/utils";
// import { QuestionForm } from "./question-form";
import { messages } from "@/lib/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import MessageList from "@/components/MessageList";
import { Button } from "@/components/ui/button";



export default function ChatPanel(props: { chatId: string }) {

  const { input, handleInputChange, handleSubmit, messages} = useChat({
    api: "/api/chat",
    // body: {
    //   chatId,
    // },
    // initialMessages: data || [],
  });

  return (
    <div className="dark:bg-gray-900 bg-slate-100 shadow-xl flex flex-col gap-2 p-6 rounded-xl">
      <div className="h-[350px] overflow-y-auto space-y-3">
        <MessageList messages={messages}/>
      </div>

      <div className="flex gap-1">
        <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
          <div className="flex-1">
            <Input
            className="shadow-inner"
            placeholder="Ask any question over this document"
            value={input}
            onChange={handleInputChange} />
          </div>
          
          <Button className="dark:bg-indigo-200  bg-indigo-700 ">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}