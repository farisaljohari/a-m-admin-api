import { HelperHashService } from './helper.hash.service';
import { enc, SHA256 } from 'crypto-js';
describe('HelperHashService', () => {
  let service: HelperHashService;
  const secretKey = '12345678901234567890123456789012';
  const iv = '1234567890123456';
  const password = 'password123';
  let salt: string;
  let hashedPassword: string;

  beforeEach(() => {
    service = new HelperHashService();
    salt = service.randomSalt(10);
    hashedPassword = service.bcrypt(password, salt);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('randomSalt', () => {
    it('should generate a salt of the specified length', () => {
      expect(service.randomSalt(10)).toHaveLength(29);
    });
  });

  describe('bcrypt', () => {
    it('should hash the password with the given salt', () => {
      expect(service.bcrypt(password, salt)).toBe(hashedPassword);
    });
  });

  describe('bcryptCompare', () => {
    it('should return true for correct password comparison', () => {
      expect(service.bcryptCompare(password, hashedPassword)).toBe(true);
    });

    it('should return false for incorrect password comparison', () => {
      expect(service.bcryptCompare('wrongpassword', hashedPassword)).toBe(
        false,
      );
    });
  });

  describe('sha256', () => {
    it('should hash a string using SHA256', () => {
      const hash = SHA256(password).toString(enc.Hex);
      expect(service.sha256(password)).toBe(hash);
    });
  });

  describe('sha256Compare', () => {
    it('should return true for identical SHA256 hashes', () => {
      const hash = SHA256(password).toString(enc.Hex);
      expect(service.sha256Compare(hash, hash)).toBe(true);
    });

    it('should return false for different SHA256 hashes', () => {
      const hash1 = SHA256(password).toString(enc.Hex);
      const hash2 = SHA256('anotherpassword').toString(enc.Hex);
      expect(service.sha256Compare(hash1, hash2)).toBe(false);
    });
  });

  describe('encryptPassword', () => {
    it('should encrypt a password with the given secret key', () => {
      const encrypted = service.encryptPassword(password, secretKey);
      const decrypted = service.decryptPassword(encrypted, secretKey);
      expect(decrypted).toBe('trx8g6gi');
    });
  });

  describe('decryptPassword', () => {
    it('should decrypt an encrypted password with the given secret key', () => {
      const encrypted = service.encryptPassword(password, secretKey);
      const decrypted = service.decryptPassword(encrypted, secretKey);
      expect(decrypted).toBe('trx8g6gi');
    });
  });

  describe('aes256Encrypt', () => {
    it('should encrypt data with AES-256 and return the ciphertext', () => {
      const data = { key: 'value' };
      const encrypted = service.aes256Encrypt(data, secretKey, iv);
      expect(encrypted).toBeDefined();
    });
  });

  describe('aes256Decrypt', () => {
    it('should decrypt data with AES-256 and return the plaintext', async () => {
      const data = { key: 'value' };
      const encrypted = service.aes256Encrypt(data, secretKey, iv);
      const decrypted = service.aes256Decrypt(encrypted, secretKey, iv);
      expect(decrypted).toBeDefined();
      expect(() => JSON.parse(decrypted)).not.toThrow();
      expect(JSON.parse(decrypted)).toEqual(data);
    });
  });
});
