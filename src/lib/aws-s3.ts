import { messages } from '@/lib/db/schema';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { supabase } from './utils/supabase'

// Create
export async function uploadToS3(file: File): Promise<{ file_key: string; file_name: string }>{

    const client = new S3Client({
        forcePathStyle: true,
        region: 'ap-south-1',
        endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT_URL!,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
    })

    const file_key = "public/" + Date.now().toString() + file.name.replace(" ", "-");
    let file_name = file.name
    const uploadCommand = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key, 
        Body: file,
        // ContentType: 'image/jpeg',
    })

    await client.send(uploadCommand)
    return { file_key, file_name };
}

// Delete
export async function deleteS3Doc(file_key: string): Promise<{ message: string}>{
    const client = new S3Client({
        forcePathStyle: true,
        region: 'ap-south-1',
        endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT_URL!,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
    })

    const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
    })
    let message = `Deleted successfuly: ${file_key}`
    await client.send(deleteCommand)
    return {message}
}

// Get URL
export function getS3Url(file_key: string) {
    const url = `https://dfhqqoeyhnzjjlzzfwed.supabase.co/storage/v1/object/public/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${file_key}`
    return url;
  }

