import React from "react";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/QuizCreation";

export const metadata = {
  title: "Quiz | Quizzzy",
  description: "Quiz yourself on anything!",
};

interface Props {
  searchParams: {
    topic?: string;
  };
}

const Quiz = async ({ searchParams }: Props) => {
    // const { sessionId } = useAuth();
    // if (!sessionId) {
    //   redirect("/");
    // }
  return <QuizCreation topic={searchParams.topic ?? ""} />;
};

export default Quiz;