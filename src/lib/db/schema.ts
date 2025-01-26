import {
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    uuid,
    timestamp,
    varchar,
    jsonb,
    boolean,
  } from "drizzle-orm/pg-core";
import { relations, sql } from 'drizzle-orm';
import { ulid } from 'ulidx';
import { datetime } from "drizzle-orm/mysql-core";
  
  // Chat schema
  export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);
  
  export const chats = pgTable("chats", {
    id: text(`id`).primaryKey().$defaultFn(() => ulid()).unique(),
    pdfName: text("pdf_name").notNull(),
    pdfUrl: text("pdf_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    fileKey: text("file_key").notNull(),
  });
  
  export type InsertChat = typeof chats.$inferInsert;
  export type SelectChat = typeof chats.$inferSelect;
  
  export const messages = pgTable("messages", {
    id: text(`id`).primaryKey().$defaultFn(() => ulid()).unique(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    chatId: text('chat_id').notNull().references(() => chats.id),
    role: userSystemEnum("role").notNull(),
  });
    
  // Quiz schema
  export const quizSystemEnum = pgEnum("quiz_system_enum", ["mcq", "open_ended"]);

  export const quizzes = pgTable('quizzes', {
    id: text(`id`).primaryKey().$defaultFn(() => ulid()).unique(),
    userId: varchar('user_id', { length: 256 }).notNull(),
    timeStarted: timestamp('time_started').notNull(),
    topic: varchar('topic').notNull(),
    timeEnded: timestamp('time_ended'),
    type: quizSystemEnum('type').notNull(),
  });

  export const quizRelations = relations(quizzes, ({ many }) => ({
    questions: many(questions),
  }));
  
  export const questions = pgTable('questions', {
    id: text(`id`).primaryKey().$defaultFn(() => ulid()).unique(),
    question: varchar('question').notNull(),
    answer: varchar('answer').notNull(),
    quizId: text('quiz_id').notNull().references(() => quizzes.id),
    options: jsonb('options'),
    percentageCorrect: integer('percentage_correct'),
    isCorrect: boolean('is_correct'),
    questionType: quizSystemEnum('type').notNull(),
    userAnswer: varchar('user_answer'),
  });

  export const questionRelations = relations(questions, ({ one }) => ({
    quiz: one(quizzes, {
      fields: [questions.quizId],
      references: [quizzes.id],
    }),
  }));

  export const topicCount = pgTable('topicCount', {
    id: text(`id`).primaryKey().$defaultFn(() => ulid()).unique(),
    topic: varchar('topic').unique().notNull(),
    count: integer('count').notNull(),
  });

  export type InsertQuestions = typeof questions.$inferInsert;
  export type SelectQuestions = typeof questions.$inferSelect;
  
  // drizzle-orm
  // drizzle-kit