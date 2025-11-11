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
  car_number?: number;
  initiation_date?: Date;
  initiator?: string;
  recipient?: string;
  coordinator?: string;
  source?: string;
  description?: string;
  user_org?: string;
  lacc_phase?: string;
  lacc_responsibility?: string;
  lacc_target_date?: Date;
  ca_phase?: string;
  ca_responsibility?: string;
  ca_target_date?: Date;  
};

export interface CARProblemRedef {
  car_number: number;
  redefined_problem: string;
  correction: string;
  containment: string;
  corr_cont_date: string | Date;
};

export interface CARCANeed {
  car_number: number;
  ca_required: string;
  required_by: string;
  comment: string;
  severity?: number | null;
  occurrence?: number | null;
  rpn?: number | null;
  ca_needed: string;
};

export interface CARQPTReq {
  car_number: number;
  qms_required: string;
  qms_required_comments: string;
  qms_documentation_required: string;
  qms_documentation_required_comments: string;
  training_required: string;
  training_required_comments: string;
}

export interface CarRCAType {
  car_number: number;
  rca_type: string;
}

export interface CarImmediateRCA {
  car_number: number;
  root_cause: string;
}

export interface CARRootCause {
  car_number: number;
  root_cause: string;
}

export interface UserEmail {
  user_email: string;
};

export interface CarNumber {
  car_number: number;
};

export interface CarLog {
  car_number: number;
  initiation_date: string;
  source: string;
  target_date: string;
}