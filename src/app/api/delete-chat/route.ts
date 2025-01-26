import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { deleteS3Doc } from "@/lib/aws-s3";
import { auth } from '@clerk/nextjs/server';
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    try {
      // Extract chatId from the URL
      const url = new URL(req.url)
      // const fileKey = url.searchParams.get('fileKey')
      const fileKey = url.pathname.split('/').pop();
      console.log(url.pathname.split('/').pop())
      if (!fileKey) {
        return NextResponse.json({ error: 'File key is required' }, { status: 400 });
      }
      // Validate chatId
       
      if(fileKey){
        //Delete from S3
        const deleteDoc = await deleteS3Doc(fileKey)
        console.log(deleteDoc.message)
        // Delete from DB
        await db.delete(chats).where(eq(chats.fileKey, fileKey))
      }
      // Return success response
      return NextResponse.json({ message: 'Chat deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting chat:', error);
      return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
    }
}