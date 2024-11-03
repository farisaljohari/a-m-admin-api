import { convertKeysToSnakeCase } from './snakeCaseConverter';

describe('convertKeysToSnakeCase', () => {
  it('should convert single level object keys to snake case', () => {
    const input = { camelCase: 'value', anotherKey: 'anotherValue' };
    const expected = { camel_case: 'value', another_key: 'anotherValue' };
    expect(convertKeysToSnakeCase(input)).toEqual(expected);
  });

  it('should convert nested object keys to snake case', () => {
    const input = {
      camelCaseKey: 'value',
      nestedObject: {
        nestedCamelCase: 'nestedValue',
        arrayOfObjects: [
          { arrayCamelCase: 'arrayValue' },
          { anotherCamelCase: 'anotherValue' },
        ],
      },
    };
    const expected = {
      camel_case_key: 'value',
      nested_object: {
        nested_camel_case: 'nestedValue',
        array_of_objects: [
          { array_camel_case: 'arrayValue' },
          { another_camel_case: 'anotherValue' },
        ],
      },
    };
    expect(convertKeysToSnakeCase(input)).toEqual(expected);
  });

  it('should handle arrays of objects', () => {
    const input = [{ camelCaseItem: 'value' }, { anotherItem: 'anotherValue' }];
    const expected = [
      { camel_case_item: 'value' },
      { another_item: 'anotherValue' },
    ];
    expect(convertKeysToSnakeCase(input)).toEqual(expected);
  });

  it('should handle empty objects and arrays', () => {
    expect(convertKeysToSnakeCase({})).toEqual({});
    expect(convertKeysToSnakeCase([])).toEqual([]);
  });

  it('should handle primitive values without modification', () => {
    expect(convertKeysToSnakeCase('string')).toEqual('string');
    expect(convertKeysToSnakeCase(123)).toEqual(123);
    expect(convertKeysToSnakeCase(null)).toEqual(null);
    expect(convertKeysToSnakeCase(undefined)).toEqual(undefined);
  });
});
