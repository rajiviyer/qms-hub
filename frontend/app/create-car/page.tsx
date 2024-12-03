"use client";
import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import CARDetails from './_components/CARDetails';
import LookAcross from './_components/LookAcross';
import RedefineProblem from './_components/RedefineProblem';
import ValidateCANeed from './_components/ValidateCANeed';
import RootCauseAnalysis from './_components/RootCauseAnalysis';
import CorrectiveActionPlan from './_components/CorrectiveActionPlan';


export default function CreateCAR() {
    const [activeIndex, setActiveIndex] = useState(0);
    console.log(`Active Index value: ${activeIndex}`);
    

    useEffect(() => {
        // console.log(userCourseInput);
      }, []);
    
    const StepperOptions = [
        {
            id: 1,
            name: "Corrective Action Request (CAR) Details"
        },
        {
            id: 2,
            name: "Look Across"
        },
        {
            id: 3,
            name: "Redefine Problem"
        },
        {
            id: 4,
            name: "Validate Corrective Action (CA) Need"
        },
        {
            id: 5,
            name: "Root Cause Analysis"
        },     
        {
            id: 6,
            name: "Corrective Action (CA) Plan"
        },
        {
            id: 7,
            name: "Update QMS Process Risks & Opportunities"
        },                             
        {
            id: 8,
            name: "Update QMS Documentation"
        },                             
        {
            id: 9,
            name: "Personnel Training Needs"
        },
        {
            id: 10,
            name: "Corrective Action (CA) Effectiveness Plan"
        },                                    
      ];

      const checkStatus = () => {
    
        if (activeIndex == 0) {
          return false;
        }
        
        if (activeIndex == 1) { 
            return false;
        }

        if (activeIndex == 2) { 
            return false;
        }

        if (activeIndex == 3) { 
            return false;
        }        

        if (activeIndex == 4) { 
            return false;
        } 
        
        if (activeIndex == 5) { 
            return false;
        } 

        if (activeIndex == 6) { 
            return false;
        } 
        
        if (activeIndex == 7) { 
            return false;
        } 
        
        if (activeIndex == 8) { 
            return false;
        } 
        
        if (activeIndex == 9) { 
            return false;
        }         
        
        return true;
      };

      console.log(`Status: ${checkStatus()}`);

  return (
    <div>
        <div className="flex flex-col justify-center items-center mt-10">
            <h2 className="text-4xl text-primary font-medium">
                {StepperOptions[activeIndex].name}
            </h2>
        </div>
        <div className="px-10 md:px-20 lg:px-44 mt-10">
            {
                activeIndex === 0 ? (
                    <CARDetails />
                ) : activeIndex === 1 ? (
                    <LookAcross />
                ) : activeIndex === 2 ? (
                    <RedefineProblem />
                ) : activeIndex === 3 ? (
                    <ValidateCANeed />
                ) : activeIndex === 4 ? (
                    <RootCauseAnalysis />
                ) : activeIndex === 5 ? (
                    <CorrectiveActionPlan />
                ) :
                (
                    StepperOptions[activeIndex].name
                )
            }
            <div className="flex justify-between mt-10">
                <Button
                    disabled={activeIndex == 0}
                    variant="outline"
                    onClick={() => setActiveIndex(activeIndex - 1)}
                >
                    Previous
                </Button>
                {activeIndex < 9 && (
                    <Button
                    className="text-primary"
                    disabled={checkStatus()}
                    onClick={() => setActiveIndex(activeIndex + 1)}
                    >
                    Next
                    </Button>
                )}
                {activeIndex === 9 && (
                    <Button
                    className="text-primary"
                    disabled={checkStatus()}
                    onClick={() => console.log("Completing CAR")}
                    >
                    Submit
                    </Button>
                )}
            </div>
        </div>              
    </div>
  )
}
