import { validateUserData } from '../validateUserData';

describe('validateUserData', () => {
  it('should return success when user data is valid', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      zipcode: '12345678'
    };

    const validationResult = validateUserData(validUserData);

    expect(validationResult.success).toBe(true);
    expect(validationResult.data).toEqual(validUserData);
  });

  it('should return failure when email is missing', () => {
    const invalidUserData = {
      email: '',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      zipcode: '12345678'
    };

    const validationResult = validateUserData(invalidUserData);


    expect(validationResult.success).toBe(false);
    expect(validationResult.error?.message).toContain('Invalid email');
  });

});
