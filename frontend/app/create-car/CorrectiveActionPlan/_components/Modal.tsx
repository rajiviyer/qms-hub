import React from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export default function Modal({ isOpen, onClose, content }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
        <p className="mb-4">{content}</p>
        <Button onClick={onClose} className="w-full">Close</Button>
      </div>
    </div>
  );
}
