import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { quizzes, questions } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { z } from "zod";

export const endQuizSchema = z.object({
    quizId: z.string(),
  });

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { quizId } = endQuizSchema.parse(body);
    const quiz = await db.query.quizzes.findFirst({
        where: eq(quizzes.id, quizId),
    });

    if (!quiz) {
      return NextResponse.json(
        {message: "Game not found",},
        {status: 404,}
      );
    }

    await db.update(quizzes).set({timeEnded:new Date()}).where(eq(quizzes.id, quizId))

    return NextResponse.json({
      message: "Game ended",
    });
  } catch (error) {
    return NextResponse.json(
      {message: "Something went wrong",},
      { status: 500 }
    );
  }
}