import axios from 'axios';
import { seachZipCode } from '../searchZipCode';

jest.mock('axios');

describe('SearchZipCode Function (External API)', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpa todos os mocks após cada teste
  });



  it('should return address data when the request is successful', async () => {
    const mockResponse = {
      data: {
        bairro: 'Neighborhood',
        complemento: 'Complement',
        localidade: 'City',
        uf: 'State',
        logradouro: 'Street',
        cep: '12345678',
      },
    };
    const mockZipcode = '12345678';

    /** tipo de casting que estou fazendo para informar ao TypeScript que 
    estou substituindo a implementação da função axios.get por uma função mockada **/
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(mockResponse);

    const result = await seachZipCode(mockZipcode);

    expect(result).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith(`https://viacep.com.br/ws/${mockZipcode}/json/`);
  });

  it('should throw an error when the request fails', async () => {
    const mockError = new Error('Failed to make GET request');
    const mockZipcode = '12345678';

    
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(mockError);

    await expect(seachZipCode(mockZipcode)).rejects.toThrow(
      `Failed to make GET request to https://viacep.com.br/ws/${mockZipcode}/json/: ${mockError.message}. But user created!`
    );
    expect(axios.get).toHaveBeenCalledWith(`https://viacep.com.br/ws/${mockZipcode}/json/`);
  });


  it('should throw an error for an invalid ZIP code', async () => {
    const invalidZipcode = '00000-000';
    await expect(seachZipCode(invalidZipcode)).rejects.toThrow('Failed to make GET request');
  });
});
