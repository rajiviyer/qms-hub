"use client";
import React, { useState, useContext } from 'react';
import {useForm} from 'react-hook-form';
import { SignInType, SignUpType } from '@/configs/schema';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import Image from "next/image";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const {register, handleSubmit} = useForm<SignInType>();

    const router = useRouter();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const url = process.env.NEXT_PUBLIC_API_URL;

    const signInFn = async (data: SignInType) => {
        try {
            const response = await fetch(`${url}/api/signin`,
                {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );
            console.log(response);
            
            if (response.ok){
                const {access_token, refresh_token} = await response.json();
                const access_expiration_time = new Date();
                const refresh_expiration_time = new Date();
                access_expiration_time.setSeconds(access_expiration_time.getSeconds() + access_token.expiry_time);
                refresh_expiration_time.setSeconds(refresh_expiration_time.getSeconds() + refresh_token.expiry_time); 
                
                // Set access token cookie
                setCookie("access_token", access_token.token, {
                    expires: access_expiration_time
                });

                // Decode token to get user_email and user_name (same as middleware does)
                try {
                    const tokenPayload = JSON.parse(atob(access_token.token.split('.')[1]));
                    const user_email = tokenPayload.user_email;
                    const user_name = tokenPayload.user_name;
                    
                    // Set user_email and user_name cookies immediately (before redirect)
                    setCookie("user_email", user_email, {
                        expires: access_expiration_time
                    });
                    setCookie("user_name", user_name, {
                        expires: access_expiration_time
                    });

                    // Fetch user details including organization before redirecting
                    const userEmail = { user_email: user_email };
                    const userResponse = await fetch(`${url}/api/getuser`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(userEmail)
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        console.log("User details fetched:", userData);
                        
                        // Verify we have all required data before redirecting
                        if (userData.organization && user_email && user_name) {
                            setMessageType('success');
                            setMessage('Login successful!');
                            router.push("/landing");   // Redirect only after all data is loaded
                        } else {
                            setMessageType('error');
                            setMessage('Failed to retrieve user organization. Please try again.');
                        }
                    } else {
                        setMessageType('error');
                        setMessage('Failed to retrieve user details. Please try again.');
                    }
                } catch (decodeError) {
                    console.error("Error decoding token:", decodeError);
                    setMessageType('error');
                    setMessage('Invalid token received. Please try again.');
                }
            }
            else {
                const errorData = await response.json();
                console.log(errorData);
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
        <div className="w-1/4 p-6 rounded-md border border-slate-200 flex flex-col gap-2 justify-center items-center shadow-md transform -translate-y-10">
            <Image alt="" src={"/ignition_logo.png"} width={150} height={150} />
            <h1 className="md:text-2xl text-xl font-bold m-2 text-primary">
                QMS Hub
            </h1>
            <form
                onSubmit={handleSubmit(signInFn)}
                className="flex flex-col gap-4 justify-center items-center "
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
                <Button type="submit" className="bg-primary text-black hover:text-white">
                    Sign In
                </Button>
                {message && (
                <p style={{ color: messageType === 'error' ? 'red' : 'green' }}>
                {message}
                </p>
                )}                
            </form>
            <h1 className="md:text-xl font m-2">
                Don't have an account?
            </h1>
            <Link href="/sign-up">
                <Button>
                    Sign Up
                </Button>
            </Link>
        </div>
    </main>
  )
}
