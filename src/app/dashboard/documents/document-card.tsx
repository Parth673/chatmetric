import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Description } from "@radix-ui/react-dialog";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { Chat, ChatInfo, MessageInfo } from 'dataModel';

type CardProps = {
  chat: ChatInfo;
};

export function DocumentCard({ chat }: CardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{chat.pdfName}</CardTitle>
        <CardDescription>{chat.createdAt.toDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {!true ? (
            <div className="flex justify-center">d
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            // document.description
            `The following ${chat.fileKey} is about a boy name coco. He was to dumb`
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary" className="flex items-center gap-2">
          <Link href={`/dashboard/documents/${chat.id}`}>
            <Eye className="w-4 h-4" /> View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}