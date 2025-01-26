// 'use client';

import {Button} from "@/components/ui/button"
import { supabase } from "@/lib/utils/supabase"
import {ChangeEvent} from 'react'
import { v4 as uuidv4 } from 'uuid';


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};


export default async function Home() {
  const { data, error } = await supabase.storage.from('documents').list("public/", {
    limit: 10,
    offset: 0,
    sortBy: { column: 'name', order: 'asc'}
  })

  return(
    <>
      <div className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <h1 className="mr-3 text-5xl font-semibold">Metric Chat</h1>
            </div>
    
            <div className="flex mt-2">
              <Button>Go To Chats</Button>
            </div>
    
            <div className="w-full mt-4">
              <h1>File Upload</h1>
            </div>
            
            
          </div>
        </div>
      </div>
      
    </>
  )
}