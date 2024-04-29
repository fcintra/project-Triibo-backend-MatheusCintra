
import { AddressData } from "../interfaces/ICreateAddress";
import { prisma } from "../lib/prisma";


class AddressModel {
  public async createAddress(userId: string, { cep, bairro, localidade, logradouro, uf, complemento }: Partial<AddressData>) {
    return prisma.userAddress.create({ 
        data: {
            zipcode: cep!,
            city: localidade!,
            state: uf!,
            street: logradouro!,
            neighborhood: bairro!,
            complement: complemento,
            userId
        } 
    });
  }

  public async getAddressUserById(userId: string) {
    const addressByUserId = await prisma.userAddress.findFirst({
      where: {
        userId
      }
    });
    return addressByUserId;
  }

  public async updateAddress(userId: string, { cep, bairro, localidade, logradouro, uf, complemento }: Partial<AddressData>) {
    const address = await prisma.userAddress.findFirst({ where: { userId } })

    if (!address) {
      throw new Error('Endereço não encontrado para o usuário fornecido');
    }

    return prisma.userAddress.update({
      where: { id: address.id },
      data: {
        zipcode: cep!,
        city: localidade!,
        state: uf!,
        street: logradouro!,
        neighborhood: bairro!,
        complement: complemento
      }
    });
  }

  public async deleteAllAddressByUser(userId: string){
    return prisma.userAddress.deleteMany({where: { userId }})
  }

  
}

module.exports = new AddressModel();