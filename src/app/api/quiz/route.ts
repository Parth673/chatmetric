import { db } from "@/lib/db";
import { quizzes, questions } from "@/lib/db/schema";
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from "next/server";
import { string, z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { eq } from "drizzle-orm";

export const quizCreationSchema = z.object({
  topic: z.string().min(4, {
      message: "Topic must be at least 4 characters long",
    })
    .max(50, {
      message: "Topic must be at most 50 characters long",
    }),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
});

export async function POST(req: Request, res: Response) {
  try{
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);
    const quiz = await db.insert(quizzes).values({
      userId: userId,
      timeStarted: new Date(),
      topic: topic,
      type: type,
    }).returning({ id: quizzes.id });
    const quizId = quiz[0].id;
    const {data} = await axios.post('http://localhost:3000/api/question', {
        amount, 
        topic,
        type,
    })
    console.log(`Flag1:  ${data}`)
    if (type == "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      }
      let manyData = data.questions.map((question: mcqQuestion) => {
        let options = [question.answer, question.option1, question.option2, question.option3]
        return{
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          quizId: quizId,
          questionType: 'mcq',
        }
      })
      try{
        await db.insert(questions).values(manyData);
      }catch(error){
        console.log(`Insert DB error:  ${error}`)
      }
      
    }else if(type == 'open_ended'){
      type openQuestion = {
        question: string;
        answer: string;
      }
      let manyData = data.questions.map((question: openQuestion) => {
        return{
          question: question.question,
          answer: question.answer,
          quizId: quizId,
          questionType: 'open_ended',
        }
      })
      await db.insert(questions).values(manyData);
    }
    return NextResponse.json({quizId: quizId})  
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues },{status: 400,})
    } else {
      return NextResponse.json({ error: "An unexpected error occurred." },{status: 500,})
    }
  }   
}

export async function GET(req: Request, res: Response) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const url = new URL(req.url);
    const quizId = url.searchParams.get("gameId");
    if (!quizId) {
        return NextResponse.json(
            { error: "You must provide a game id." },
            {status: 400,}
        );
      }
    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, quizId),
      with: {questions: true,},
    });
    if (!quiz) {
        return NextResponse.json(
            { error: "Game not found." },
            {status: 404,}
        );
      }
    
    return NextResponse.json(
        { quiz },
        {status: 400,}
    );
  }catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {status: 500,})
  } 
}