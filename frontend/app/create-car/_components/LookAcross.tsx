import React from 'react';
import { Textarea } from "@/components/ui/textarea";

export default function LookAcross() {
    const handleInputChange = (fieldName: string, value: string) => {
        console.log(`${fieldName} has value ${value}`);
    }    
  return (
    <div>
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
    </div>
  )
}
