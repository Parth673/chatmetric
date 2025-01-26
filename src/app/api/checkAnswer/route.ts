import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { quizzes, questions } from "@/lib/db/schema";
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from "next/server";
import { string, z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { ZodError } from "zod";
import stringSimilarity from "string-similarity";

export const checkAnswerSchema = z.object({
    userInput: z.string(),
    questionId: z.string(),
  });

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { questionId, userInput } = checkAnswerSchema.parse(body);
    const question = await db.query.questions.findFirst({
        where: eq(questions.id, questionId),
    });
    if (!question) {
      return NextResponse.json(
        {message: "Question not found",},
        {status: 404,}
      );
    }
    // Update the userAnswer
    await db.update(questions).set({ userAnswer: userInput}).where(eq(questions.id, questionId))

    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();
        await db.update(questions).set({ isCorrect: isCorrect }).where(eq(questions.id, questionId))
      return NextResponse.json({
        isCorrect,
      });
    } else if (question.questionType === "open_ended") {
      let percentageSimilar = stringSimilarity.compareTwoStrings(
        question.answer.toLowerCase().trim(),
        userInput.toLowerCase().trim()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);
      await db.update(questions).set({ percentageCorrect: percentageSimilar}).where(eq(questions.id, questionId))
      return NextResponse.json({
        percentageSimilar,
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {message: error.issues,},
        {status: 400,}
      );
    }
  }
}