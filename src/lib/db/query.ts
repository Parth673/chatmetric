// 'use server'

import { db } from "@/lib/db";
import { chats, messages} from "@/lib/db/schema";
import { eq, and, sql } from 'drizzle-orm';

export async function getChats(uId: any) {
  return db.select().from(chats).where(eq(chats.userId, uId));
}

export async function getChatById(chatId: string) {
  const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
  // const current_chat = _chats.find((chat) => chat.id === chatId); 
  return  _chats[0]
}
