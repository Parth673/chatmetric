import { createClient } from "@supabase/supabase-js";
import { NomicEmbeddings } from "@langchain/nomic";
import {Llama3Tokenizer} from 'llama3-tokenizer-js'

const privateKey = process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;


async function getMatchesFromEmbeddings(embeddings: number[]) {
  const client = createClient(url, privateKey);
  try {
    const { data: data, error: error } = await client.rpc('match_documents',{
      query_embedding: embeddings,
      match_threshold: 0.78,
      match_count: 5,
      filter: {}
    })
    if(error) throw error
    return data

  } catch (error) {
    console.log("error querying embeddings", error);
  }
}

export async function getContext(query: string){
  const NomicEmbeder = new NomicEmbeddings({apiKey: process.env.NOMIC_API_KEY!});
  const embedding = await NomicEmbeder.embedQuery(query)
  const docSections = await getMatchesFromEmbeddings(embedding)
  const tokenizer = new Llama3Tokenizer();
  let tokenCount = 0
  let contextText = ''
  for (let i=0; i<docSections.length; i++){
    const docSection = docSections[i]
    const content = docSection.content
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.length

    if (tokenCount >= 1500){
      break
    }
    contextText += `${content.trim()}\n---\n`
  }
  console.log(`Context: ${contextText}`)
  return contextText
}



