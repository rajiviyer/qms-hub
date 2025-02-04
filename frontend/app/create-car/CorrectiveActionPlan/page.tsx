"use client";
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import Modal from './_components/Modal';


const buttonData = [
    { id: 1, text: "Open Modal 1", content: "This is content for Modal 1" },
    { id: 2, text: "Open Modal 2", content: "This is content for Modal 2" },
    { id: 3, text: "Open Modal 3", content: "This is content for Modal 3" },
  ];

export default function CorrectiveActionPlan() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const openModal = (content: string) => {
        setModalContent(content);
        setIsModalOpen(true);
      };    

    return (
        <div>
            <h3 className="text-2xl text-teal-900 font-medium text-center">
                Corrective Action Plan
            </h3>
            <div className="px-10 md:px-20 lg:px-44 mt-3">   
                <div className="px-20 md:px-40 lg:px-64">
                    <h4 className="text-sm font-bold">📑Root Cause(s)</h4>
                    {buttonData.map((item) => (
                        <Button key={item.id} onClick={() => openModal(item.content)}>
                        {item.text}
                        </Button>
                    ))}
                    {/* Modal Component */}
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={modalContent} />                    
                </div>
            </div>        
        </div>
    )
}