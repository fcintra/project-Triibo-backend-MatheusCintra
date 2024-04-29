
import { User } from "@prisma/client";
import bcrypt from 'bcrypt';
import { AddressData } from "../interfaces/ICreateAddress";
import { seachZipCode } from "../utils/searchZipCode";
const addressModel = require("../models/AddressModel");
const userModel = require('../models/UserModel');


class UserService {
  public async createUser(userData: User, zipcode?: string){
    let responseAddressUser: Partial<AddressData> | null = {};
    let addressWasCreated;
    let user;

  
    if(zipcode){
      responseAddressUser = await seachZipCode(zipcode);
    }

        
    if(zipcode && !responseAddressUser.cep){
      addressWasCreated = `Address not found by zip code: ${zipcode}`;
    }

    try {
      const userAlredyExists = await userModel.getUserByEmail(userData.email);

      if(userAlredyExists){
        throw new Error('User already exists'); 
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
  
      user = await userModel.createUser(userData);
      if (responseAddressUser.cep) {
        await addressModel.createAddress(user.id, responseAddressUser);
      }
      const userCreated = await userModel.getUserById(user.id);

      return {
        userCreated,
        addressWasCreated
      }
    } catch (error) {
      throw error;
    }
  }

  public async getUserById(id: string) {
    try {
      const user = await userModel.getUserById(id)
      return user;
    } catch (error) {
        throw error; 
    }
  }

  public async getUserByEmail(email: string) {
    try {
      const user = await userModel.getUserByEmail(email)
      return user;
    } catch (error) {
        throw error; 
    }
  }

  public async updateUser(id: string, userData: User, zipcode?: string){
    let responseAddressUser: Partial<AddressData> | null = {};
    let updatedUser;
    let addressWasUpdated;

    try {
        const existingUser = await userModel.getUserById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
      
        if (zipcode) {
            responseAddressUser = await seachZipCode(zipcode);
            if(!responseAddressUser.cep){
              addressWasUpdated = `Address not found by zip code: ${zipcode}. Address has not been updated`;
            }
        }

        const existingAddress = await addressModel.getAddressUserById(id);

        if (responseAddressUser.cep) {
          if (existingAddress && existingAddress.zipcode !== zipcode) {
              // Se o usuário já tiver um endereço e o cep enviado for diferente do cep que está cadastrado, atualizar os dados do endereço existente
              await addressModel.updateAddress(id, responseAddressUser);
          } else {
              // Se o usuário não tiver um endereço, criar um novo endereço
              await addressModel.createAddress(id, responseAddressUser);
          }
        }
        
        
        if(userData){
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          userData.password = hashedPassword;
          updatedUser = await userModel.updateUser(id, userData);
        }

        return {updatedUser, addressWasUpdated};
    } catch (error) {
        throw error;
    }
  }

  public async getUsers(){
    try {
      return await userModel.getAllUsers();
    } catch (error) {
      throw error;
    }
    
  }

  public async deleteUser(id: string){
    try {
      const existingUser = await userModel.getUserById(id);

      if (!existingUser) {
          throw new Error('User not found');
      }

      if(existingUser.UserAddress){
        await addressModel.deleteAllAddressByUser(id)
      }
      

      return userModel.deleteUser(id);

    } catch (error) {
        throw error;
    }
  }
}

module.exports = new UserService();