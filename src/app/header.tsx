import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { SignInButton, SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import { boolean } from "drizzle-orm/mysql-core";

export function Header(){
    return(
        <div className="z-10 relative dark:bg-zinc-900 bg-neutral-800 py-3">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex gap-10  items-center overflow-x-hidden">
                    <Link href="/" className="flex items-center gap-1 text-2xl">
                        <Image
                            src="/images/logo.png"
                            width={100}
                            height={100}
                            alt="an image of a brain"
                        />
                    </Link>
                    <nav className="flex items-center gap-8">
                        <OrganizationSwitcher />
                        <SignedIn>
                            <Link href="/dashboard" className="dark:hover:text-slate-300 text-neutral-100  hover:text-indigo-300">Dashboard</Link>
                        </SignedIn>
                        
                    </nav>
                </div>

                <div className="flex gap-4 items-center">
                    <ModeToggle />
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </div>
    );
}