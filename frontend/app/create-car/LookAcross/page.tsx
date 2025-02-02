"use client";
import React, { useEffect, useState, useContext } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { CARProblemRedef, CARProblemDesc } from '@/configs/schema';
import { CARProblemDescContext } from '@/app/_context/CARProblemDescContext';
// import { CARProblemRedefContext } from '@/app/_context/CARProblemRedefContext';

export default function LookAcross() {

    const carProblemDescContext = useContext(CARProblemDescContext);
    if (!carProblemDescContext) {
    throw new Error('carProblemDescContext is not available');
    }

    // const carProblemRedefContext = useContext(CARProblemRedefContext);
    // if (!carProblemRedefContext) {
    // throw new Error('carProblemRedefContext is not available');
    // }

    // const { carProblemRedef, setCarProblemRedef } = carProblemRedefContext;

    const { carProblemDesc, setCarProblemDesc,  } = carProblemDescContext;
    const car_number = carProblemDesc?.car_number;

    console.log(`car number: ${car_number}`);
    
    // const [ carProblemRedef, setCarProblemRedef ] = useState<CARProblemRedef>(
    //     {"car_number": car_number || "", "redefined_problem": "", "correction": "", "containment": "", "corr_cont_date": new Date()}
    // )
    const [carProblemRedef, setCarProblemRedef] = useState<CARProblemRedef | null>(null);
    const { register, handleSubmit, reset } = useForm<CARProblemRedef>();

    const url = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');    

    useEffect(() => {
        const car_number = carProblemDesc?.car_number;
        console.log(`called useffect look across, car number: ${car_number}`);
        
        if (car_number) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get_car_problem_redef`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"car_number": car_number})
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(`data retrieved in LookAcross: ${JSON.stringify(data)}`);
                if (data) {
                    console.log("Setting the retrieved data in LookAcross");
                    setCarProblemRedef(data);
                }
            });
        }
    }, [car_number]);

    console.log(`carProblemRedef After useEffect: ${JSON.stringify(carProblemRedef)}`);

    // Reset form when carProblemRedef is updated
    useEffect(() => {
        if (carProblemRedef) {
            reset({
                ...carProblemRedef,
                corr_cont_date: carProblemRedef.corr_cont_date instanceof Date
                    ? carProblemRedef.corr_cont_date.toISOString().split('T')[0]
                    : new Date(carProblemRedef.corr_cont_date).toISOString().split('T')[0]
            });
        }
    }, [carProblemRedef, reset]);
    
    // const { register, handleSubmit, } = useForm<CARProblemRedef>({defaultValues: carProblemRedef});

    
    const submitCARProblemRedef = async (data: CARProblemRedef) => {
        if (car_number) {
            try {
                data.car_number = car_number;
                console.log(`CARProblemRedef: ${JSON.stringify(data)}`);

                const response = await fetch(`${url}/api/add_car_problem_redef`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
    
                if (response.ok) {
                    const responseMessage = await response.json();
                    
                    if (/success/i.test(responseMessage)) {
                        // setCarProblemRedef(data);
                        router?.push('/create-car/ValidateCANeed');
                    }
                    else {
                        setMessageType('error');
                        setMessage(responseMessage);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setMessageType('error');
                setMessage('An error occurred. Please try again.');
            }
        }
    }
    
    const handlePrevious = () => {
        router.push("/create-car");
    };       
  return (
    <div>
        <h3 className="text-2xl text-teal-900 font-medium text-center">
            Look Across, Correct & Contain
        </h3>
        {message && (
                    <p className="text-center" style={{ color: messageType === 'error' ? 'red' : 'green' }}>
                    {message}
                    </p>
        )}        
        <form className="mt-3" onSubmit={handleSubmit(submitCARProblemRedef)}>
            <div className="px-10 md:px-20 lg:px-44">   
                <div className="col-span-2">
                    <label className="text-sm font-bold">🔍Redefine Problem</label>
                    <Textarea
                        className="text-xl"
                        placeholder={"Enter Problem Redefinition"}
                        {...register("redefined_problem", { required: true})}
                    />
                </div>
                <div className="col-span-2">
                    <label className="text-sm font-bold">🔍Correction (Must correct Original & Redefined Problem Statements)</label>
                    <Textarea
                        className="text-xl"
                        placeholder={"Enter Correction Details"}
                        {...register("correction", { required: true})}
                    />
                </div>
                <div className="col-span-2">
                    <label className="text-sm font-bold">🔍Containment (If non confirmity has product impact. Must contain Original & Redefined Problem Statements)</label>
                    <Textarea
                        className="text-xl"
                        placeholder={"Enter Containment Details"}
                        {...register("containment", { required: true})}
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">🕘Correction/Containment Date</label>
                    <Input
                        type="date"
                        {...register("corr_cont_date", { required: true})}
                    />
                </div>
            </div>
            <div className="flex justify-between mt-10">
                    <Button
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
        </form>        
    </div>
  )
}
