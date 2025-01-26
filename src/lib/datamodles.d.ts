// import { messages, chats } from './db/schema';
// import type {
//   DataModelFromSchemaDefinition,
//   DocumentByName,
//   TableNamesInDataModel,
//   SystemTableNames,
// } from "convex/server";
// import type { GenericId } from "convex/values";
// import schema from "./db/schema.ts";

// export type TableNames = TableNamesInDataModel<DataModel>;

// export type Cht<TableName extends TableNames> = DocumentByName<
//   DataModel,
//   TableName
// >;

// export type Id<TableName extends TableNames | SystemTableNames> = GenericId<TableName>;

// export type DataModel = DataModelFromSchemaDefinition<typeof schema>;


declare module 'dataModel' {
  export type Model = {
    chats: {
      userId: string;
      id: number;
      pdfName: string;
      pdfUrl: string;
      createdAt: Date;
      fileKey: string;
    };

    messages: {
      id: number;
      createdAt: Date;
      chatId: number;
      content: string;
      role: "user" | "system";
    };

    quizzes: {
      id: string;
      userId: string;
      timeStarted: Date;
      topic: string;
      timeEnded: Date | null;
      type: "mcq" | "open_ended";
      questions: {
        id: string;
        question: string;
        answer: string;
      }[];
    };

    questions: {
      id: string;
      question: string;
      answer: string;
      quizId: string;
      options: JSON;
      percentageCorrect: number;
      isCorrect: boolean;
      questionType: "mcq" | "open_ended";
      userAnswer: string;
    };
  }
  export type ChatInfo = Model['chats'];
  export type MessageInfo = Model['messages'];
  export type QuizInfo = Model['quizzes'];
  export type QuestionInfo = Model['questions'];
}
