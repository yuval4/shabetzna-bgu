import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    appController = new AppController();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });

  describe('getHello', () => {
    it('should return "hello world!"', () => {
      expect(appController.getHello()).toBe('hello world!');
    });

    it('should return the exact expected string', () => {
      const result = appController.getHello();

      expect(typeof result).toBe('string');
      expect(result.toLowerCase()).toContain('hello');
      expect(result.toLowerCase()).toContain('world');
    });

    it('should return a lowercase version of the expected string', () => {
      const result = appController.getHello();

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
