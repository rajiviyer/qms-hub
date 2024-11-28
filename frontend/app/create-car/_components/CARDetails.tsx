import React from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

export default function CARDetails() {
    const handleInputChange = (fieldName: string, value: string) => {
        console.log(`${fieldName} has value ${value}`);
    }

  return (
    <div>
        <div className="px-10 md:px-20 lg:px-44">        
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-sm font-bold">🎚️CAR #</label>
                    <Input
                        type="text"
                        className="text-xl"
                        placeholder={"Enter CAR Number"}
                        onChange={(event) =>
                        handleInputChange("car_number", event.target.value)
                        }
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">🕘Date</label>
                    <Input
                        type="date"
                        onChange={(event) =>
                        handleInputChange("car_date", event.target.value)
                        }
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">🙋‍♂️Initiator</label>
                    <Input
                        type="text"
                        className="text-xl"
                        placeholder={"Enter Initiator Name"}
                        onChange={(event) =>
                        handleInputChange("initiator", event.target.value)
                        }
                    />
                </div>
                <div>
                    <label className="text-sm font-bold">🙋‍♂️Recipient</label>
                    <Input
                        type="text"
                        className="text-xl"
                        placeholder={"Enter Recipient Name"}
                        onChange={(event) =>
                        handleInputChange("recipient", event.target.value)
                        }
                    />
                </div>    
                <div>
                    <label className="text-sm font-bold">🙋‍♂️Coordinator</label>
                    <Input
                        type="text"
                        className="text-xl"
                        placeholder={"Enter Coordinator Name"}
                        onChange={(event) =>
                        handleInputChange("recipient", event.target.value)
                        }
                    />
                </div> 
                <div>
                    <label className="text-sm font-bold">🧩Type</label>
                    <Select
                        onValueChange={(value) => handleInputChange("type", value)}
                    >
                        <SelectTrigger className="">
                        <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="CCN">CCN</SelectItem>
                        <SelectItem value="IA">IA</SelectItem>
                        <SelectItem value="Supplier Audit">Supplier Audit</SelectItem>
                        <SelectItem value="Customer Audit">Customer Audit</SelectItem>
                        <SelectItem value="TPA">TPA</SelectItem>                        
                        </SelectContent>
                    </Select>
                </div>
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
