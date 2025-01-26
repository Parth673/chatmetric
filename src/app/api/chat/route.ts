import Groq from 'groq-sdk';
import { Message, StreamingTextResponse, LangChainAdapter, OpenAIStream} from "ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const groq = new Groq({apiKey: process.env['GROQ_API_KEY'], });

export async function POST(req: Request) {
  try {
    // const { messages }: { messages: Message[] } = await req.json();
    const { messages } = await req.json();
    // const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    // if (_chats.length != 1) {
    //   return NextResponse.json({ error: "chat not found" }, { status: 404 });
    // }
    // const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content);
    // const context = "Quantum machine learning"
    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    };

    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages,
      stream: true,
      temperature: 0.5,
      max_tokens: 1024,
    });

    // const stream = new TransformStream();
    // const writer = stream.writable.getWriter();

    // // Function to handle each chunk
    // const handleChunk = async (chunk: any) => {
    //   process.stdout.write(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ''));
    // };

    // // Function to handle completion
    // const handleCompletion = async () => {
    //   await writer.close();
    // };

    // // Start processing the stream
    // (async () => {
    //   try {
    //     for await (const chunk of response) {
    //       await handleChunk(chunk);
    //     }
    //   } catch (error) {
    //     console.error('Error processing stream:', error);
    //   } finally {
    //     await handleCompletion();
    //   }
    // })();

    // // Save user message to db
    // await db.insert(_messages).values({
    //   chatId,
    //   content: lastMessage.content,
    //   role: "user",
    // });
    

    // Create a ReadableStream from the Groq response
    // const stream = new ReadableStream({
    //   async start(controller) {
    //     for await (const chunk of response) {
    //       const content = (chunk.choices[0]?.delta?.content || '');
    //       // process.stdout.write(content);
    //       // controller.enqueue(content);
          
    //     }
    //     controller.close();
    //   },
    // });

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream);
  } catch (error) {
      console.error('Error in POST function:', error);
      return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
