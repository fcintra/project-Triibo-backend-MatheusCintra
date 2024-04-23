import axios from 'axios';

interface AddressData {
  bairro: string;
  complemento: string;
  localidade: string;
  uf: string;
  logradouro: string;
}


export async function seachZipCode(zipcode: string): Promise<AddressData>{
  const apiUrl = `https://viacep.com.br/ws/${zipcode}/json/`;

  try {
    const response = await axios.get(apiUrl);
    const { bairro, complemento, localidade, uf, logradouro } = response.data;
    
    return { bairro, complemento, localidade, uf, logradouro };

  } catch (error: any) {
    // Handle errors appropriately
    throw new Error(`Failed to make GET request to ${apiUrl}: ${error.message}`);
  }
}
