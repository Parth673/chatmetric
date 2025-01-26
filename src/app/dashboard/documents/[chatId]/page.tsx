// "use client";

import {auth} from "@clerk/nextjs/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getChatById } from "@/lib/db/query";
import { getS3Url } from "@/lib/aws-s3";
import { redirect } from "next/navigation";
import React from "react";
import { DeleteDocumentButton } from "./delete-chat-button";
import { toast } from "@/components/ui/use-toast";
import ChatPanel from "./chat-panel";


type Props = {
    params: {
      chatId: string;
    };
};


export default async function DocumentPage({ params: { chatId } }: Props) {

    const chat = await getChatById(chatId);
  
    return (
      <main className="space-y-8 w-full">
        {!chat && (
          <div className="space-y-8">
            <div>
              <Skeleton className="h-[40px] w-[500px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-[40px] w-[80px]" />
              <Skeleton className="h-[40px] w-[80px]" />
            </div>
            <Skeleton className="h-[500px]" />
          </div>
        )}
      

        {chat && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">{chat.pdfName}</h1>

              <DeleteDocumentButton fileKey={chat.fileKey}/>
            </div>

            <div className="flex gap-12">
              <Tabs defaultValue="document" className="w-full">
                <TabsList className="mb-2">
                 <TabsTrigger value="document">Document</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>

                <TabsContent value="document">
                  <div className="bg-gray-900 p-4 rounded-xl flex-1 h-[500px]">
                    {getS3Url(chat.fileKey) && (
                      <iframe
                        className="w-full h-full"
                        src={`https://docs.google.com/gview?url=${getS3Url(chat.fileKey)}&embedded=true`}
                      />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="chat">
                  <ChatPanel chatId={chatId} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </main>
    );
}