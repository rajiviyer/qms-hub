"use client";
import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import ProblemDescription from './_components/ProblemDescription';
import LookAcross from './_components/LookAcross';
import RedefineProblem from './_components/RedefineProblem';
import ValidateCANeed from './_components/ValidateCANeed';
import RootCauseAnalysis from './_components/RootCauseAnalysis';
import CorrectiveActionPlan from './_components/CorrectiveActionPlan';


export default function CreateCAR() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Register submission handlers for each page
    const [submitHandlers, setSubmitHandlers] = useState<(() => Promise<boolean>)[]>([]);    
    
    console.log(`Active Index value: ${activeIndex}`);


    // Register a handler for the current form
    const registerSubmitHandler = (handler: () => Promise<boolean>, index: number) => {
        setSubmitHandlers((prev) => {
            const updated = [...prev];
            updated[index] = handler;
            return updated;
        });
    };

   // Handle the Next button click
   const handleNext = async () => {
        const handler = submitHandlers[activeIndex];
        if (handler) {
            const success = await handler();
            if (success) {
                setActiveIndex(activeIndex + 1);
            }
        }
        // setActiveIndex(activeIndex + 1);
    } 
    // useEffect(() => {
    //     // console.log(userCourseInput);
    //   }, []);
    
    const StepperOptions = [
        {
            id: 1,
            name: "Problem Description"
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
                Corrective Action Request (CAR)
            </h2>
            <h3 className="text-2xl text-teal-900 font-medium">
                {StepperOptions[activeIndex].name}
            </h3>
        </div>
        <div className="px-10 md:px-20 lg:px-44 mt-7">
            {
                activeIndex === 0 ? (
                    <ProblemDescription  registerSubmitHandler={registerSubmitHandler} currentPageIndex={activeIndex}/>
                    // <ProblemDescription />
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
                    // onClick={() => setActiveIndex(activeIndex + 1)}
                    onClick={handleNext}
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
