export interface SignInType {
    user_email: string;
    user_passwd: string;
  }
  
  export interface SignUpType {
    user_email: string;
    user_passwd: string;
    user_name: string;
  }

  export interface User {
    user_email: string;
    user_name: string;
  }