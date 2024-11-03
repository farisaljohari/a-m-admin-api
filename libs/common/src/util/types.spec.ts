import {
  Constructor,
  Plain,
  Optional,
  Nullable,
  Path,
  PathValue,
  KeyOfType,
} from './types';

interface TestInterface {
  user: {
    profile: {
      name: string;
      age: number;
    };
    settings: {
      theme: string;
    };
  };
}

interface SampleEntity {
  id: number;
  name: string;
  tags: string[];
}

class TestClass {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

describe('TypeScript Utility Types', () => {
  it('should validate Constructor type', () => {
    type ValidConstructorTest = Constructor<TestClass, [string, number]>;
    const instance: ValidConstructorTest = TestClass;
    expect(instance).toBeDefined();
  });

  it('should validate Plain type', () => {
    type PlainNumberTest = Plain<number>;
    type PlainStringTest = Plain<string>;
    type PlainObjectTest = Plain<{ name: string; age: number }>;
    const num: PlainNumberTest = 42;
    const str: PlainStringTest = 'hello';
    const obj: PlainObjectTest = { name: 'John', age: 30 };

    expect(num).toBe(42);
    expect(str).toBe('hello');
    expect(obj).toEqual({ name: 'John', age: 30 });
  });

  it('should validate Optional type', () => {
    type OptionalNumberTest = Optional<number>;
    type OptionalObjectTest = Optional<{ name: string }>;

    const num: OptionalNumberTest = undefined;
    const obj: OptionalObjectTest = { name: 'Jane' };
    const objUndefined: OptionalObjectTest = undefined;

    expect(num).toBeUndefined();
    expect(obj).toEqual({ name: 'Jane' });
    expect(objUndefined).toBeUndefined();
  });

  it('should validate Nullable type', () => {
    type NullableNumberTest = Nullable<number>;
    type NullableObjectTest = Nullable<{ name: string }>;

    const num: NullableNumberTest = null;
    const obj: NullableObjectTest = { name: 'Jack' };
    const objNull: NullableObjectTest = null;

    expect(num).toBeNull();
    expect(obj).toEqual({ name: 'Jack' });
    expect(objNull).toBeNull();
  });

  it('should validate Path type', () => {
    type PathTest = Path<TestInterface>;
    const path1: PathTest = 'user.profile.name';
    const path2: PathTest = 'user.settings.theme';

    expect(path1).toBe('user.profile.name');
    expect(path2).toBe('user.settings.theme');
  });

  it('should validate PathValue type', () => {
    type NameTypeTest = PathValue<TestInterface, 'user.profile.name'>;
    type AgeTypeTest = PathValue<TestInterface, 'user.profile.age'>;
    type ThemeTypeTest = PathValue<TestInterface, 'user.settings.theme'>;

    const name: NameTypeTest = 'Alice';
    const age: AgeTypeTest = 25;
    const theme: ThemeTypeTest = 'dark';

    expect(name).toBe('Alice');
    expect(age).toBe(25);
    expect(theme).toBe('dark');
  });

  it('should validate KeyOfType type', () => {
    type StringKeysTest = KeyOfType<SampleEntity, string>;
    type NumberKeysTest = KeyOfType<SampleEntity, number>;
    type ArrayKeysTest = KeyOfType<SampleEntity, string[]>;

    const stringKey: StringKeysTest = 'name';
    const numberKey: NumberKeysTest = 'id';
    const arrayKey: ArrayKeysTest = 'tags';

    expect(stringKey).toBe('name');
    expect(numberKey).toBe('id');
    expect(arrayKey).toBe('tags');
  });
});
