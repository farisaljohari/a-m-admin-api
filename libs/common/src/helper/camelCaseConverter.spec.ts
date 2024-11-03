import { convertKeysToCamelCase } from './camelCaseConverter';

describe('convertKeysToCamelCase', () => {
  it('should return the same value if not an object or array', () => {
    expect(convertKeysToCamelCase(null)).toBeNull();
    expect(convertKeysToCamelCase(undefined)).toBeUndefined();
    expect(convertKeysToCamelCase(123)).toBe(123);
    expect(convertKeysToCamelCase('string')).toBe('string');
    expect(convertKeysToCamelCase(true)).toBe(true);
    expect(convertKeysToCamelCase(false)).toBe(false);
  });

  it('should convert object keys from snake_case to camelCase', () => {
    const obj = {
      first_name: 'John',
      last_name: 'Doe',
      address_details: {
        street_name: 'Main St',
        postal_code: '12345',
      },
    };

    const expected = {
      firstName: 'John',
      lastName: 'Doe',
      addressDetails: {
        streetName: 'Main St',
        postalCode: '12345',
      },
    };

    expect(convertKeysToCamelCase(obj)).toEqual(expected);
  });

  it('should convert array of objects with snake_case keys to camelCase', () => {
    const arr = [
      { first_name: 'Jane', last_name: 'Doe' },
      { first_name: 'John', last_name: 'Smith' },
    ];

    const expected = [
      { firstName: 'Jane', lastName: 'Doe' },
      { firstName: 'John', lastName: 'Smith' },
    ];

    expect(convertKeysToCamelCase(arr)).toEqual(expected);
  });

  it('should handle nested arrays and objects', () => {
    const nestedObj = {
      user_info: {
        user_name: 'Alice',
        contact_details: [
          { email_address: 'alice@example.com' },
          { phone_number: '123-456-7890' },
        ],
      },
    };

    const expected = {
      userInfo: {
        userName: 'Alice',
        contactDetails: [
          { emailAddress: 'alice@example.com' },
          { phoneNumber: '123-456-7890' },
        ],
      },
    };

    expect(convertKeysToCamelCase(nestedObj)).toEqual(expected);
  });

  it('should handle objects with no snake_case keys', () => {
    const obj = {
      firstName: 'Alice',
      lastName: 'Johnson',
    };

    const expected = {
      firstName: 'Alice',
      lastName: 'Johnson',
    };

    expect(convertKeysToCamelCase(obj)).toEqual(expected);
  });
});
