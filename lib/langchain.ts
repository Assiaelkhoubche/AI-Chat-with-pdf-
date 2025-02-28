
import { Ollama } from "@langchain/ollama";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/ollama";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {createRetrievalChain} from "langchain/chains/retrieval";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import {Index, RecordMetadata} from "@pinecone-database/pinecone";
import connectDB from "./db";
import { Document } from "./models/Document";
import { authenticatedUser, getUser } from "@/action/user";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import pdfParse from "pdf-parse";

import { Document as LangchainDocument } from "langchain/document";

import axios from "axios";
import { Message } from "./models/Message";



export const llm = new Ollama({
  model: "llama3",
  baseUrl: "http://127.0.0.1:11434"
  
});

export const indexName="chat-ai-pdf";


const fetchMessagesFromDB=async(docId:string)=>{
      const user=await getUser();
      if(!user){
        throw new Error("user not authenticated");
      }
        await connectDB();
        const messages= await Message.find({fileId:docId, userId:user.id}).sort({createdAt:1});

        const humanMessage=messages.map((msg)=>msg.role==="user"?new HumanMessage(msg.message):new AIMessage(msg.message));
        console.log("humanMessage:=> ",humanMessage.map(msg=>msg.content.toString()));
        return humanMessage;
}

export const generateDocs = async(docId:string)=>{
      console.log("generateDocs------");
      const user =await authenticatedUser();

      if(!user.id){
        throw new Error("User not found");
      }
      await connectDB();

       const doc = await Document.findOne({ fileId: docId,userId:user.id});
  
      if(!doc){
        console.log("No document found with this id ",docId);
      }

      try{
        console.log("Loading document............................");
        const url=`https://drive.google.com/uc?export=download&id=${doc.fileId}`;
        console.log("url:=> ",url);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        if (!response.data) {
          console.log("Failed to download document");
        }
        const pdfData = await pdfParse(response.data);

        if (!pdfData.text) {
          console.log("Document content is empty or invalid");
          return [];
        }

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

        const chunks = await splitter.splitText(pdfData.text);

        console.log("chunks:=> ",chunks.length);
       
        const documents = chunks.map((chunk, index) => new LangchainDocument({
          pageContent: chunk,
          metadata: { docId, chunkIndex: index }
        }));

        return documents;
      }catch(err){
        console.log("Error loading document",err);

      }
  
}

export const gerenerateEmbeddingsInPineConeVectorStore = async(docId:string)=>{
     const user =await authenticatedUser();
     if(!user.id){
       throw new Error("User not found");
     }
     try{

       let pineconeVectoreStore;
       console.log("_______Creating embeddings_______");
       const embeddings= new OllamaEmbeddings({ model: "llama3" });
       const index = await pineconeClient.index(indexName);
        
       console.log(`---Checking if namespace ${docId} exists in Pinecone---`);
       const existingNamespaces = await index.describeIndexStats();
       const namespaceExists = existingNamespaces.namespaces && existingNamespaces.namespaces[docId];
       
       if (namespaceExists){
         console.log(`Namespace ${docId} already exists in Pinecone`);
         return await PineconeStore.fromExistingIndex(embeddings, {
          pineconeIndex: index,
          namespace: docId,
        });
       }
    
      const splitDocs =await generateDocs(docId);
      console.log(`---Storing the embeddings in nameSpace ${indexName} Pinecone vectore store----`);
      try {
        pineconeVectoreStore = await PineconeStore.fromDocuments(
          splitDocs,
          embeddings,
          {
            pineconeIndex: index,
            namespace: docId,
          }
        );
        console.log("Storing in Pinecone completed successfully");
      } catch (storeErr) {

          console.log("Error storing pinecone vectore store",storeErr);
      }
      return pineconeVectoreStore;
       
     }catch(err){
        console.log("Error creating PiineconeStore",err);
     }

}

export const generateLangchainCompletion = async(docId:string,question:string)=>{
      await authenticatedUser();

      let pineconeVectoreStore;
      pineconeVectoreStore= await gerenerateEmbeddingsInPineConeVectorStore(docId);

      if(!pineconeVectoreStore){
        throw new Error("PineconeVectoreStore not found");
      }
       
      console.log("----Creating a retriever from the Pinecone vectore store----");
      const retriever = pineconeVectoreStore.asRetriever();
      const chatHistory=await fetchMessagesFromDB(docId);

     console.log("---Defining the prompt template----");
      const historyAwarePrompt = ChatPromptTemplate.fromPromptMessages([
        ...chatHistory,
        ["user", "{input}"],
        [
          "user",
          "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
        ],
      ]);

      console.log("---Creating the chat model----");
      try{

        const historyAwareRetrievalAChain = await createHistoryAwareRetriever({
          llm:llm,
          retriever,
          rephrasePrompt: historyAwarePrompt,
        });
        console.log("---Defining a prompt template for ansewring questions...----");
        
        const historyAwarePromptRetriever = ChatPromptTemplate.fromMessages([
            [
                "system",
                "Answer the user's question based on below context:\n\n{context}",
            ],
            ...chatHistory,
            ["user", "{input}"],
        ]);
  
        console.log("---Creating a document combining chain----");
        const historyAwareCombineDocumentsChain = await createStuffDocumentsChain({
          llm: llm,
          prompt: historyAwarePromptRetriever,
        });
  
        console.log("---create the main retrival chain---");
        const conversationChainRetrievalChain = await createRetrievalChain({
          retriever:historyAwareRetrievalAChain,
          combineDocsChain:historyAwareCombineDocumentsChain,
        });
  
        console.log("---running the chain with a sample conversation---");

        const reply = await conversationChainRetrievalChain.invoke({
          chat_history: chatHistory,
          input: question,
        });
        console.log("reply:=> ",reply.answer);
        return reply.answer;
      }catch(e){
        console.log("error in history aware prompt:=> ",e);
     }
      


} 



