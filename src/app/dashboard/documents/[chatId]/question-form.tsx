// "use client";

// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import MessageList from "@/components/MessageList";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { LoadingButton } from "@/components/loading-button";
// import { useChat } from "ai/react";
// import { Send } from "lucide-react";

// export function QuestionForm(props: { chatId: number }) {

//   const {chatId} = props;

//   const { input, handleInputChange, handleSubmit, messages} = useChat({
//     api: "/api/chat",
//     body: {
//       chatId,
//     },
//     // initialMessages: data || [],
//   });

  
  
//   return (
//     <>
//       <MessageList messages={messages} isLoading={false} />
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-1 gap-2">
//         <FormField
//           name="text"
//           render={({ field }) => (
//             <FormItem className="flex-1">
//               <FormControl>
//                 <Input
//                   placeholder="Ask any question over this document"
//                   value={input}
//                   onChange={handleInputChange} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />

//         <LoadingButton
//           isLoading={false}
//           loadingText="Submitting..."
//         >
//           <Send className="h-4 w-4" />
//         </LoadingButton>
//       </form>
//     </>
//   );
// }
