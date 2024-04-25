import axios from 'axios';
import { AddressData } from '../interfaces/ICreateAddress';


export async function seachZipCode(zipcode: string): Promise<Partial<AddressData>>{
  const apiUrl = `https://viacep.com.br/ws/${zipcode}/json/`;

  try {
    const response = await axios.get(apiUrl);
    const { bairro, complemento, localidade, uf, logradouro, cep } = response.data;
    
    return { bairro, complemento, localidade, uf, logradouro, cep };
  } catch (error: any) {
    throw new Error(`Failed to make GET request to ${apiUrl}: ${error.message}. But user created!`);
  }
}
