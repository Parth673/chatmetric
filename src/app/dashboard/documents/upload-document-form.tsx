"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/loading-button";
import { useOrganization } from "@clerk/nextjs";
import { uploadToS3 } from "@/lib/aws-s3";
import { Files } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import { useRouter } from "next/navigation";
import React from "react";

const formSchema = z.object({
  title: z.string().min(1).max(250),
  file: z.instanceof(File),
});

export default function UploadDocumentForm({ onUpload,}: {onUpload: () => void;}) {
  const organization = useOrganization();
  const { toast } = useToast()
//   const createDocument = useMutation(api.documents.createDocument);
//   const generateUploadUrl = useMutation(api.documents.generateUploadUrl);

  const router = useRouter();
  const { mutate, } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let file = values.file

    try {
      const data = await uploadToS3(file);
      data.file_name = values.title;
      console.log("meow", data);
      if (!data?.file_key || !data.file_name) {
          toast({description: "Something went wrong",})
        return;
      }    
      mutate(data, {
        onSuccess: ({ chat_id }) => {
          toast({description: "Chat Created",})
          router.push(`/chat/${chat_id}`);
        },
        onError: (err) => {
          toast({description: "Error creating chat",})
          console.error(err);
        },
      });

    } catch (error) {
        console.log(error);
      }
    onUpload();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Expense Report" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps} }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept=".pdf, .txt"
                  onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton isLoading={form.formState.isSubmitting} loadingText="Uploading...">
          Upload
        </LoadingButton>
      </form>
    </Form>
  );
}