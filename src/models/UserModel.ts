
import { User } from "@prisma/client";
import { AddressData } from "../interfaces/ICreateAddress";
import { IUserWithAddres } from "../interfaces/IUserWithAddress";
import { prisma } from "../lib/prisma";


export interface UserWithAddress extends User {
  UserAddress?: Partial<AddressData>;
}


class UserModel {
  public async createUser(userData: User): Promise<User> {
    return prisma.user.create({ data: userData });
  }

  public async getUserById(id: string): Promise<IUserWithAddres | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { UserAddress: true } 
    });
    return user
  }

  public async getUserByEmail(email: string): Promise<User | null> {
     const user = await prisma.user.findUnique({ where: { email } });
     return user
  }

  public async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const userUpdated = await prisma.user.update({ where: { id }, data: userData });

    return await prisma.user.findUnique({ where: { id: userUpdated.id}, include: { UserAddress: true }})
  }

  public async deleteUser(id: string): Promise<User | null> {
    const deletedUser = await prisma.user.delete({ where: { id } });
    return deletedUser;
  }

  public async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany({ include: { UserAddress: true }} );
  }
}

export default UserModel;
