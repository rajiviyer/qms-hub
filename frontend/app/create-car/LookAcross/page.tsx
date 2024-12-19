"use client";
import React, { useEffect, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

export default function LookAcross() {

    // const [router, setRouter] = useState<ReturnType<typeof useRouter> | null>(null);

    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         import("next/router").then((nextRouter) => {
    //             setRouter(nextRouter.useRouter());
    //         });
    //     }
    // }, []);    
    const router = useRouter();
    const handleInputChange = (fieldName: string, value: string) => {
        console.log(`${fieldName} has value ${value}`);
    } 
    
    const handlePrevious = () => {
        router.push("/create-car");
    };       
  return (
    <div>
        <h3 className="text-2xl text-teal-900 font-medium">
            Look Across
        </h3>        
        <div className="px-10 md:px-20 lg:px-44">   
            <div className="col-span-2">
                <label className="text-sm font-bold">🔍Look Across (similar processes, products, systems etc.)</label>
                <Textarea
                    className="text-xl"
                    placeholder={"Enter Look Across"}
                    onChange={(event) =>
                    handleInputChange("containment", event.target.value)
                    }
                />
            </div>                  
        </div>
        <div className="flex justify-between mt-10">
                <Button
                    // variant="text-primary"
                    className="text-primary"
                    onClick={handlePrevious}
                >
                    Previous
                </Button>
                <Button
                    className="text-primary"
                    type="submit"
                >
                    Next
                </Button>
        </div>                   
    </div>
  )
}
