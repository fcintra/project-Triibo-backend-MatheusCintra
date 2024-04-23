

interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    zipcode?: string;
  }

class UserService {
  async createUser(userData: User){
    return userData 
  }

  async getUserById(id: string){
    return
  }


  async deleteUser(id: string){
    return
  }
}

export default UserService;
