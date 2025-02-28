
export interface UserFetched {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface UserContextType{
     user: UserFetched| null; 
     fetchUserInfo: () => Promise<void>;   
}

export type Messages={
  id?:string;
  role:"user"|"ai"|"palceholder";
  message:string;
  createdAt:Date;
  fileId?:string;
  userId?:string;
}