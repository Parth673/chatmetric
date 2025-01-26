"use client";

import { LoadingButton } from "@/components/loading-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { btnIconStyles, btnStyles } from "../../../../../styles/styles";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import { toast } from "@/components/ui/use-toast";


export function DeleteDocumentButton(props: { fileKey: string }) {
  const { fileKey } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, } = useMutation({
    mutationFn: async ({
      fileKey
    }: {
      fileKey: string;
    }) => {
      const response = await axios.delete(`/api/delete-chat/${fileKey}`);
      return response.data;
    },
  });
  const [isOpen, setIsOpen] = useState(false); 
  const router = useRouter();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <AlertDialogTrigger>
        <Button variant="destructive" className={btnStyles}>
          <TrashIcon className={btnIconStyles} /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this document?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your document can not be recovered after it's been deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            onClick={() => {
                setIsLoading(true);
                mutate({fileKey}, {
                  onSuccess: ({ fileKey }) => {
                    toast({description: "Chat Delted",})
                    router.push(`/api/delete-chat/${fileKey}`);
                  },
                  onError: (err) => {
                    toast({description: "Error deleting chat",})
                    console.error(err);
                  },
                });
            }}   
            isLoading={isLoading}
            loadingText="Deleting..."
            >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}