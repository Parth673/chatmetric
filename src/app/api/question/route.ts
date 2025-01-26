import { strict_output } from "@/lib/llm-to-json";
// import { getAuthSession } from "@/lib/nextauth";
import { questions } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { z } from "zod";
export const runtime = "nodejs";
export const maxDuration = 500;



export const QuestionsSchema = z.object({
  topic: z.string(),
  amount: z.number().int().positive().min(1).max(5),
  type: z.enum(["mcq", "open_ended"]),
});

export async function POST(req: Request, res: Response) {
  try {
    // const session = await getAuthSession();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "You must be logged in to create a game." },
    //     {
    //       status: 401,
    //     }
    //   );
    // }
    const body = await req.json();
    const { amount, topic, type } = QuestionsSchema.parse(body);
    let questions: any;
    if (type === "open_ended") {
      questions = await strict_output(
        "Generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array only",
        `You are to generate ${amount} random medium open-ended questions about ${topic}`,
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
    } else if (type === "mcq") {
      questions = await strict_output(
        "Generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array only",
        `You are to generate ${amount} random medium mcq question about ${topic}`,
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        }
      );
    }
    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.error("elle gpt error", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}


// request body
// {
//   "amount": 1,
//   "topic": "history",
//   "type": "open_ended"
// }


// Generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array only
// You are to output the following in json format: {"question":"question","answer":"answer with max length of 15 words"}.
// Do not put quotation marks or escape character \ in the output fields.
// Generate a list of json, one json for each input element.