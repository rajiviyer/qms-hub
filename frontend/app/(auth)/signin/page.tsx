"use client";
import React from 'react';
import {useForm} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import Image from "next/image";

export default function SignIn() {
  return (
    <main className="h-screen flex justify-center items-center">
        <div className="w-1/4 p-6 rounded-md border border-slate-200 flex flex-col gap-2 justify-center items-center shadow-md transform -translate-y-10">
            <Image alt="" src={"/ignition_logo.png"} width={150} height={150} />
            <h1 className="md:text-2xl text-xl font-bold m-2 text-primary">
                QMS Hub
            </h1>
            <form
                // onSubmit={handleSubmit(signInFn)}
                className="flex flex-col gap-4 justify-center items-center "
            >
                <input
                    // {...register("user_email", {required: true})}
                    type="email"
                    placeholder="User Email.."
                    className="rounded-md border p-1.5"
                />
                <input
                    // {...register("user_passwd", {required: true})}
                    type="password"
                    placeholder="Password.."
                    className="rounded-md border p-1.5"
                />
                <Button className="bg-primary text-black" asChild>
                    <Link href="/landing">Sign In</Link>
                </Button>
            </form>
            <h1 className="md:text-xl font m-2">
                Don't have an account?
            </h1>
            <Link href="/signup">
                <Button>
                    Sign Up
                </Button>
            </Link>
        </div>
    </main>
  )
}
