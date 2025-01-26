"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, History } from "lucide-react";
import router from "next/router";
import { useRouter } from "next/navigation";
import React from "react";
// import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import WordCloud from "react-d3-cloud";
import { useAuth } from "@clerk/nextjs";

type Props = {};


// const Dasboard = async (props: Props) => {
//   const session = await getAuthSession();
//   if (!session?.user) {
//     redirect("/");
//   }

const Dashboard = async (props: Props)=>{
  const { sessionId } = useAuth();
    if (!sessionId) {
      redirect("/");
    }
}

export default function Home() {
    const router = useRouter();
    const data = [
        {text: "Commerece", value: 120},
        {text: "Quantum", value: 30},
        {text: "React js", value: 200},
        {text: "OOP", value: 50},
        {text: "Deep learning", value: 800},
        {text: "IoT", value: 100},
        {text: "Bernoly's Law", value: 30}
    ];
    return (
      <main className="p-8 mx-auto max-w-7xl">
          <div className="flex items-center">
              <h2 className="mr-2 text-3xl font-bold tracking-tight">Quiz Dashboard</h2>
          </div>

          <div className="grid gap-4 mt-4 md:grid-cols-2">
            {/* Quiz Card */}
            <Card className="hover:cursor-pointer hover:opacity-75" onClick={() => {router.push("./quiz/quizPage");}}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-2xl font-bold">Quiz me!</CardTitle>
                    <BrainCircuit size={28} strokeWidth={2.5} />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Challenge yourself to a quiz with a topic of your choice.</p>
                </CardContent>
            </Card>
            {/* History Card */}
            <Card
              className="hover:cursor-pointer hover:opacity-75" onClick={() => {router.push("/history");}}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-2xl font-bold">History</CardTitle>
                <History size={28} strokeWidth={2.5} />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View past quiz attempts.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
                    <CardDescription>Click on a topic to start a quiz on it.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <WordCloud data={data} />
                </CardContent>
            </Card>
            {/* Recent Activity */}
            <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Recent Activity
                        {/* <Link href="/history">Recent Activity</Link> */}
                    </CardTitle>
                    <CardDescription>You have played a total of "game_count" quizzes.</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[580px]">
                    {/* <HistoryComponent limit={10} userId={session.user.id} /> */}
                </CardContent>
            </Card>
          </div>
      </main>
    );
}
