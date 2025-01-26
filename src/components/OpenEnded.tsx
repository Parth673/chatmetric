"use client";
import { cn , formatTimeDelta} from "@/lib/utils";
import { QuizInfo} from "dataModel";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer, Percent, Target } from "lucide-react";
import React from "react";
import {Card,CardDescription,CardHeader,CardTitle} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import BlankAnswerInput from "./BlankAnswerInput";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import Link from "next/link";

export const checkAnswerSchema = z.object({
    userInput: z.string(),
    questionId: z.string(),
  });
  
export const endQuizSchema = z.object({
    quizId: z.string(),
  });

type Props = {
    quiz: QuizInfo
};

const OpenEnded = ({ quiz }: Props) => {
  const [hasEnded, setHasEnded] = React.useState(false);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [blankAnswer, setBlankAnswer] = React.useState("");
  const [averagePercentage, setAveragePercentage] = React.useState(0);
  const currentQuestion = React.useMemo(() => {
    return quiz.questions[questionIndex];
  }, [questionIndex, quiz.questions]);
  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endQuizSchema> = {
        quizId: quiz.id,
      };
      const response = await axios.post(`/api/endQuiz`, payload);
      return response.data;
    },
  });
  const { toast } = useToast();
  const [now, setNow] = React.useState(new Date());
  const { mutate: checkAnswer } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      document.querySelectorAll("#user-blank-input").forEach((input) => {
        filledAnswer = filledAnswer.replace("_____", (input as HTMLInputElement).value);
        (input as HTMLInputElement).value = "";
      });
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: filledAnswer,
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });
  React.useEffect(() => {
    if (!hasEnded) {
      const interval = setInterval(() => {setNow(new Date())}, 1000);
      return () => clearInterval(interval);
    }
  }, [hasEnded]);

  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer`,
        });
        setAveragePercentage((prev) => {
          return (prev + percentageSimilar) / (questionIndex + 1);
        });
        if (questionIndex === quiz.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      },
    });
  }, [checkAnswer, questionIndex, toast, endGame, quiz.questions.length]);
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, quiz.timeStarted))}
        </div>
        <Link
          href={`/statistics/${quiz.id}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-2")}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* topic */}
          <p>
            <span className="text-slate-400">Topic</span> &nbsp;
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {quiz.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, quiz.timeStarted))}
          </div>
        </div>
        <Card className="flex flex-row items-center p-2">
          <Target size={30} />
          <span className="ml-3 text-2xl opacity-75">{averagePercentage}</span>
          <Percent className="" size={25} />
        </Card>
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {quiz.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <BlankAnswerInput
          setBlankAnswer={setBlankAnswer}
          answer={currentQuestion.answer}
        />
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {handleNext();}}
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;