"use client";
import {useForm} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { SignInType, SignUpType } from '@/configs/schema';
import React, { useState } from "react";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Register() {
    const {register, handleSubmit} = useForm<SignUpType>() ;
    // const [formData, setFormData] = useState<SignUpType>();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const url = process.env.NEXT_PUBLIC_API_URL;
    const signUpFn = async (data: SignUpType) => {
        try {
            const response = await fetch(`${url}/api/signup`,
                {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );
            if (response.ok){
                const {access_token, refresh_token} = await response.json();
                const access_expiration_time = new Date();
                const refresh_expiration_time = new Date();
                access_expiration_time.setSeconds(access_expiration_time.getSeconds() + access_token.expiry_time);
                refresh_expiration_time.setSeconds(refresh_expiration_time.getSeconds() + refresh_token.expiry_time); 
                // console.log(access_expiration_time);
                setMessageType('success');
                setMessage('Login successful!');
                setCookie("access_token", access_token.token, {
                    expires: access_expiration_time
                });
                // setCookie("refresh_token", refresh_token.token, {
                //     expires: refresh_expiration_time,
                //     secure: true
                // });
                router.push("/sign-in");   // Redirect to Sign In page
            }
            else {
                const errorData = await response.json();
                // console.log(errorData);
                
                setMessageType('error');
                setMessage(errorData);
            }
        } catch (error) {
            setMessageType('error');
            setMessage('An error occurred. Please try again.');
        }
    }
  return (
    <main className="h-screen flex justify-center items-center">
        <div className="w-1/4 p-6 rounded-md border border-slate-600 flex flex-col gap-2 justify-center items-center shadow-md transform -translate-y-10">
            <Image alt="" src={"/ignition_logo.png"} width={150} height={150} />
            <h1 className="md:text-2xl text-xl font-bold m-2 text-primary">
                QMS Hub <span className="text-black">Sign Up</span>
            </h1>
            {message && (
                <p style={{ color: messageType === 'error' ? 'red' : 'green' }}>
                {message}
                </p>
            )}
            <form
                onSubmit={handleSubmit(signUpFn)}
                className="flex flex-col gap-4 justify-center items-center"
            >
                <input
                    {...register("user_email", {required: true})}
                    type="email"
                    placeholder="User Email.."
                    className="rounded-md border p-1.5"
                />
                <input
                    {...register("user_passwd", {required: true})}
                    type="password"
                    placeholder="Password.."
                    className="rounded-md border p-1.5"
                />
                <input
                    {...register("user_name", {required: true})}
                    placeholder="Username.."
                    className="rounded-md border p-1.5"
                />
                <div className="flex justify-center items-center gap-4">
                    {/* <Link href="/sign-in">
                        <Button className="bg-primary text-black">
                            Sign In
                        </Button> */}
                    {/* </Link> */}
                    <Button className="bg-primary text-black" type="submit">
                        Sign Up
                    </Button>
                </div>              
            </form>
        </div>
    </main>
  )
}