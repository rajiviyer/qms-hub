export interface SignInType {
    user_email: string;
    user_passwd: string;
  }
  
  export interface SignUpType {
    user_email: string;
    user_passwd: string;
    user_name: string;
    organization: string;
  }

  export interface User {
    user_email: string;
    user_name: string;
    organization: string;
  }

  export type CARProblemDesc = {
    car_number?: number;
    initiation_date?: Date;
    initiator?: string;
    recipient?: string;
    coordinator?: string;
    source?: string;
    description?: string;
  };

  export type CARPlanningPhase = {
    car_number?: number;
    lacc_phase?: string;
    lacc_responsibility?: string;
    lacc_target_date?: Date;
    ca_phase?: string;
    ca_responsibility?: string;
    ca_target_date?: Date;
  }