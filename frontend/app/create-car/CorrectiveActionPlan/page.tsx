"use client";
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { CARProblemDesc, CARRootCause } from '@/configs/schema';
import Modal from './_components/Modal';
import { CARProblemDescContext } from '@/app/_context/CARProblemDescContext';


const buttonData = [
    { id: 1, text: "Open Modal 1", content: "This is content for Modal 1" },
    { id: 2, text: "Open Modal 2", content: "This is content for Modal 2" },
    { id: 3, text: "Open Modal 3", content: "This is content for Modal 3" },
  ];

export default function CorrectiveActionPlan() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<CARRootCause | null>(null);
    const [ carRootCauses, setCARRootCauses ] = useState<CARRootCause[]>([]);    

    const carProblemDescContext = useContext(CARProblemDescContext);
    if (!carProblemDescContext) {
    throw new Error('carProblemDescContext is not available');
    }

    const { carProblemDesc, setCarProblemDesc,  } = carProblemDescContext;
    const car_number = carProblemDesc?.car_number;
    const url = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();    

    useEffect(() => {
        if (car_number) {
            console.log(`car number: ${car_number}`);
            const response = fetch(`${url}/api/get_car_rootcauses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"car_number": car_number}),
            }).then(response => response.json())
            .then(data => {
                if (data) {
                    console.log(`data retrieved in Root Cause Page: ${JSON.stringify(data)}`);
                    setCARRootCauses(data);
                    // setRCAType(data[0].rca_type);
                    // if (data?.rca_type) {
                    //     setRCAType(data?.rca_type);
                    // }
                }
            }).catch(error => {
                console.error('Error in fetching rca type data', error);
            });
        }
    }, [car_number]);

    const openModal = (content: CARRootCause) => {
        setModalContent(content);
        setIsModalOpen(true);
      };
      
    const handlePrevious = () => {
        router?.push('FishBoneAnalysis');
    }
    
    const handleNext = () => {
        // router?.push('/create-car/DefineRCAType');
    }


    return (
        <div>
            <h3 className="text-2xl text-teal-900 font-medium text-center">
                Corrective Action Plan
            </h3>
            <div className="px-10 md:px-20 lg:px-44 mt-3 text-center">   
                <div className="px-20 md:px-40 lg:px-64">
                    <h3 className="text-xl font-bold text-center">Root Cause(s)</h3>
                    {carRootCauses.map((option: CARRootCause, index: number) => (
                        <div className="mt-5 text-primary">
                            <Button key={index} onClick={() => openModal(option)}>
                            {option.root_cause}
                            </Button>
                        </div>
                    ))}
                    {/* Modal Component */}
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={modalContent} />                    
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
                    onClick={handleNext}
                >
                    Next
                </Button>
            </div>                 
        </div>
    )
}