// "use client";

import { DocumentCard } from "./document-card";
import { getChats } from "@/lib/db/query";
import CreateDocumentButton from "./upload-document-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { auth } from '@clerk/nextjs/server';
import { useOrganization } from "@clerk/nextjs";


const { userId } = auth();

export default async function Home() {

  const chats = await getChats(userId);

  return (
    <main className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Documents</h1>
        <CreateDocumentButton />
      </div>

      {!chats && (
        <div className="grid grid-cols-3 gap-8">
          {new Array(8).fill("").map((_, i) => (
            <Card className="h-[200px] p-6 flex flex-col justify-between">
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="w-[80px] h-[40px] rounded" />
            </Card>
          ))}
        </div>
      )}

      {chats && chats.length === 0 && (
        <div className="py-12 flex flex-col justify-center items-center gap-8">
          <Image
            src="/images/documents.svg"
            width="200"
            height="200"
            alt="a picture of a girl holding documents"
          />
          <h2 className="text-2xl">You have no documents</h2>
          <CreateDocumentButton />
        </div>
      )}

      {chats && chats.length > 0 && (
        <div className="grid grid-cols-3 gap-8">
          {chats?.map((cht) => <DocumentCard key={cht.id} chat={cht} />)}
        </div>
      )}
    </main>
  );
}

