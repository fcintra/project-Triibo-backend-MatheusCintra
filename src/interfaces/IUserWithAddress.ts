interface UserAddress {
    id: string;
    userId: string;
    zipcode: string;
    street: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
export interface IUserWithAddres {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    UserAddress: UserAddress[];
  }