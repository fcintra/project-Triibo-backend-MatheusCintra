
import { seachZipCode } from "../utils/searchZipCode";


import { User } from "@prisma/client";
import { AddressData } from "../interfaces/ICreateAddress";
import AddressModel from "../models/AddressModel";
import UserModel from '../models/UserModel';


const addressModel = new AddressModel()

const userModel = new UserModel()

class UserService {
  public async createUser(userData: User, zipcode?: string){
    let responseAddressUser: Partial<AddressData> | null = {};
    let addressWasCreated;
    let user;

    const userAlredyExists = await userModel.getUserByEmail(userData.email);

    if(userAlredyExists){
      throw new Error('User already exists'); 
    }

    if(zipcode){
      responseAddressUser = await seachZipCode(zipcode);
    }

        
    if(zipcode && !responseAddressUser.cep){
      addressWasCreated = `Address not found by zip code: ${zipcode}`;
    }

    try {
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
      throw new Error('Error creating user')
    }
  }

  public async getUserById(id: string) {
    try {
      const user = await userModel.getUserById(id)
      return user;
    } catch (error) {
        console.error('Erro ao buscar usuário pelo ID:', error);
        throw error; 
    }
  }

  public async updateUser(id: string, userData: User, zipcode?: string){
    let responseAddressUser: Partial<AddressData> | null = {};
    let updatedUser;

    try {
        const existingUser = await userModel.getUserById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
      
        if (zipcode) {
            responseAddressUser = await seachZipCode(zipcode);
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
          updatedUser = await userModel.updateUser(id, userData);
        }

        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
  }

  public async getUsers(){
    try {
      return await userModel.getAllUsers();
    } catch (error) {
      console.error('Error updating user:', error);
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
        console.error('Error updating user:', error);
        throw error;
    }
  }
}

export default UserService;
