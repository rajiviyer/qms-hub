import React from 'react';
import { Textarea } from "@/components/ui/textarea";

export default function RedefineProblem() {
    const handleInputChange = (fieldName: string, value: string) => {
        console.log(`${fieldName} has value ${value}`);
    }
        
  return (
    <div>
        <div className="px-10 md:px-20 lg:px-44">        
            <div className="grid grid-cols-2 gap-10">
                <div className="col-span-2">
                    <label className="text-sm font-bold">📝Description</label>
                    <Textarea
                        className="text-xl"
                        placeholder={"Enter Description"}
                        onChange={(event) =>
                        handleInputChange("description", event.target.value)
                        }
                    />
                </div>
                <div className="col-span-2">
                    <label className="text-sm font-bold">🖍️Correction</label>
                    <Textarea
                        className="text-xl"
                        placeholder={"Enter Correction"}
                        onChange={(event) =>
                        handleInputChange("correction", event.target.value)
                        }
                    />
                </div>                
                <div className="col-span-2">
                    <label className="text-sm font-bold">🛑Containment</label>
                    <Textarea
                        className="text-xl"
                        placeholder={"Enter Containment"}
                        onChange={(event) =>
                        handleInputChange("containment", event.target.value)
                        }
                    />
                </div>                                   
            </div>
        </div>            
    </div>
  )
}
