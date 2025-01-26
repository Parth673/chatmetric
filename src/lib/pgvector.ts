import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { NomicEmbeddings } from "@langchain/nomic";
import { createClient } from "@supabase/supabase-js";
import { downloadFromS3 } from "./s3-server";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf"
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const privateKey = process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

type PDFPage = {
    pageContent: string;
    metadata: {
      loc: { pageNumber: number };
    };
  };

export async function loadS3IntoPgvector(fileKey: string) {
    // 1. obtain the pdf -> downlaod and read from pdf
    console.log("downloading s3 into file system");
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
      throw new Error("could not download from s3");
    }
    console.log("loading pdf into memory" + file_name);
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
  
    // 2. split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));
  
    // 4. embedding
    const NomicEmbeder = new NomicEmbeddings({apiKey: process.env.NOMIC_API_KEY!});

    // 5. upload to pgVector
    const client = createClient(url, privateKey);
    const vectorStore = await SupabaseVectorStore.fromDocuments(documents.flat(), NomicEmbeder, {
        client: client,
        tableName: "documents",
        queryName: "match_documents",
      })
  
    return documents[0];
    // const resultOne = await vectorStore.similaritySearch("Hello world", 1);
    // console.log(resultOne);
}
  
  export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
  };
  
  async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, "");
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter({chunkSize: 1024, chunkOverlap: 200,});
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByBytes(pageContent, 36000),
        },
      }),
    ]);
    return docs;
  }
