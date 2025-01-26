// import MCQ from "@/components/MCQ";
// import { db } from "@/lib/db";
// import { quizzes, questions } from "@/lib/db/schema";
// import { auth } from '@clerk/nextjs/server';
// import { redirect } from "next/navigation";
// import React from "react";

// type Props = {
//   params: {
//     quizId: string;
//   };
// };

// const MCQPage = async ({ params: { quizId } }: Props) => {
//   const { userId } = auth();
//     if (!userId) {
//         return redirect("/");
//     }

// //   const quiz = await prisma.quizzes.findUnique({
// //     where: {
// //       id: quizId,
// //     },
// //     include: {
// //       questions: {
// //         select: {
// //           id: true,
// //           question: true,
// //           options: true,
// //         },
// //       },
// //     },
// //   });
//     const result = await db
//     .select({
//       id: quizId,
//       type: quizzes.type,
//       questions: {
//         id: questions.id,
//         question: questions.question,
//         options: questions.options,
//       },
//     })
//     .from(quizzes)
//     .leftJoin(questions, eq(questions.quizId, quizzes.id))
//     .where(eq(quizzes.id, quizId))
//     .execute();




//   if (!quiz || quiz.type === "open_ended") {
//     return redirect("/quiz");
//   }
//   return <MCQ game={quiz} />;
// }

// export default MCQPage;