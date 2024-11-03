import { SnakeNamingStrategy } from './snack-naming.strategy';
import { snakeCase } from 'typeorm/util/StringUtils';

describe('SnakeNamingStrategy', () => {
  let strategy: SnakeNamingStrategy;

  beforeEach(() => {
    strategy = new SnakeNamingStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('tableName', () => {
    it('should use customName if provided', () => {
      const className = 'User';
      const customName = 'users_table';
      expect(strategy.tableName(className, customName)).toBe(customName);
    });

    it('should convert className to snake_case if customName is not provided', () => {
      const className = 'User';
      expect(strategy.tableName(className, '')).toBe(snakeCase(className));
    });
  });

  describe('columnName', () => {
    it('should use customName if provided', () => {
      const propertyName = 'firstName';
      const customName = 'first_name';
      const embeddedPrefixes = ['user'];
      expect(
        strategy.columnName(propertyName, customName, embeddedPrefixes),
      ).toBe(snakeCase(embeddedPrefixes.join('_')) + customName);
    });

    it('should convert propertyName to snake_case with embeddedPrefixes if customName is not provided', () => {
      const propertyName = 'firstName';
      const embeddedPrefixes = ['user'];
      expect(strategy.columnName(propertyName, '', embeddedPrefixes)).toBe(
        snakeCase(embeddedPrefixes.join('_')) + snakeCase(propertyName),
      );
    });
  });

  describe('relationName', () => {
    it('should convert propertyName to snake_case', () => {
      const propertyName = 'profilePicture';
      expect(strategy.relationName(propertyName)).toBe(snakeCase(propertyName));
    });
  });

  describe('joinColumnName', () => {
    it('should convert relationName and referencedColumnName to snake_case', () => {
      const relationName = 'user';
      const referencedColumnName = 'id';
      expect(strategy.joinColumnName(relationName, referencedColumnName)).toBe(
        snakeCase(`${relationName}_${referencedColumnName}`),
      );
    });
  });

  describe('joinTableName', () => {
    it('should convert table names and property name to snake_case', () => {
      const firstTableName = 'users';
      const secondTableName = 'roles';
      const firstPropertyName = 'userRoles';
      expect(
        strategy.joinTableName(
          firstTableName,
          secondTableName,
          firstPropertyName,
        ),
      ).toBe(
        snakeCase(
          `${firstTableName}_${firstPropertyName.replaceAll(/\./gi, '_')}_${secondTableName}`,
        ),
      );
    });
  });

  describe('joinTableColumnName', () => {
    it('should use columnName if provided', () => {
      const tableName = 'user_roles';
      const propertyName = 'user';
      const columnName = 'role';
      expect(
        strategy.joinTableColumnName(tableName, propertyName, columnName),
      ).toBe(snakeCase(`${tableName}_${columnName}`));
    });

    it('should convert propertyName to snake_case if columnName is not provided', () => {
      const tableName = 'user_roles';
      const propertyName = 'role';
      expect(strategy.joinTableColumnName(tableName, propertyName)).toBe(
        snakeCase(`${tableName}_${propertyName}`),
      );
    });
  });

  describe('classTableInheritanceParentColumnName', () => {
    it('should convert parentTableName and parentTableIdPropertyName to snake_case', () => {
      const parentTableName = 'users';
      const parentTableIdPropertyName = 'id';
      expect(
        strategy.classTableInheritanceParentColumnName(
          parentTableName,
          parentTableIdPropertyName,
        ),
      ).toBe(snakeCase(`${parentTableName}_${parentTableIdPropertyName}`));
    });
  });
});
