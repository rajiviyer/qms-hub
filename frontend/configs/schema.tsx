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

export interface CARProblemDesc {
  car_number?: string;
  initiation_date?: Date;
  initiator?: string;
  recipient?: string;
  coordinator?: string;
  source?: string;
  description?: string;
  lacc_phase?: string;
  lacc_responsibility?: string;
  lacc_target_date?: Date;
  ca_phase?: string;
  ca_responsibility?: string;
  ca_target_date?: Date;    
};

export interface CARProblemRedef {
  car_number: string;
  redefined_problem: string;
  correction: string;
  containment: string;
  corr_cont_date: Date;
};

export interface CARCANeed {
  car_number: string;
  ca_required: string;
  required_by: string;
  comment: string;
  severity: number;
  occurrence: number;
  rpn: number;
  ca_needed: string;
};

export interface UserEmail {
  user_email: string;
};

export interface CarNumber {
  car_number: string;
};