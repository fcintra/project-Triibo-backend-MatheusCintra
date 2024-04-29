
import { User } from "@prisma/client";
import { AddressData } from "../interfaces/ICreateAddress";
import { IUserWithAddres } from "../interfaces/IUserWithAddress";
import { prisma } from "../lib/prisma";


export interface UserWithAddress extends User {
  UserAddress?: Partial<AddressData>;
}


class UserModel {
  public async createUser(userData: User): Promise<User> {
    try {
      return prisma.user.create({ data: userData });
    } catch (error) {
      throw error
    }
  }

  public async getUserById(id: string): Promise<IUserWithAddres | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { UserAddress: true } 
      });
      return user
    } catch (error) {
      throw error
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      return user
    } catch (error) {
      throw error
    }
  }

  public async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const userUpdated = await prisma.user.update({ where: { id }, data: userData });
      return await prisma.user.findUnique({ where: { id: userUpdated.id}, include: { UserAddress: true }})
    } catch (error) {
      throw error
    }
  }

  public async deleteUser(id: string): Promise<User | null> {
    try {
      const deletedUser = await prisma.user.delete({ where: { id } });
      return deletedUser;
    } catch (error) {
      throw error
    }
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      return prisma.user.findMany({ include: { UserAddress: true }} );
    } catch (error) {
      throw error
    }
  }
}

module.exports = new UserModel();