// import OpenEnded from "@/components/OpenEnded";
import { db } from "@/lib/db";
import { quizzes, questions, } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenEnded from "@/components/OpenEnded";
import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import React from "react";

// http://localhost:3000/dashboard/quiz/test/open-ended/01J4G8MYJXZ5AMY4AXFXF5E58P

type Props = {
  params: {
    quizId: string;
  };
};

const OpenEndedPage = async ({ params: { quizId } }: Props) => {
  const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }
    
    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, quizId),
      with: {
        questions: {
          columns: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
    });
    
  if (!quiz || quiz.type === "mcq") {
    return redirect("/quizPage");
  }
  return <OpenEnded quiz={quiz} />;
}

export default OpenEndedPage;