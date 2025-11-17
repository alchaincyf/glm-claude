/**
 * 配置管理器测试
 * 运行: npm test
 */

const ConfigManager = require('../src/config/manager');
const { validateApiKeyFormat } = require('../src/config/validator');

describe('ConfigManager', () => {
  let config;

  beforeEach(() => {
    config = new ConfigManager();
  });

  afterEach(() => {
    // 清理测试配置
    config.reset();
  });

  test('should create config instance', () => {
    expect(config).toBeInstanceOf(ConfigManager);
  });

  test('should check if API key exists', () => {
    expect(config.hasApiKey()).toBe(false);
  });

  test('should save and retrieve config', () => {
    const testData = {
      apiKey: 'test-api-key-1234567890',
      defaultModel: 'glm-4.6'
    };

    config.save(testData);

    expect(config.hasApiKey()).toBe(true);
    expect(config.getApiKey()).toBe(testData.apiKey);
    expect(config.getDefaultModel()).toBe(testData.defaultModel);
  });

  test('should reset config', () => {
    config.save({
      apiKey: 'test-key',
      defaultModel: 'glm-4.6'
    });

    expect(config.hasApiKey()).toBe(true);

    config.reset();

    expect(config.hasApiKey()).toBe(false);
  });

  test('should get safe config with masked API key', () => {
    config.save({
      apiKey: 'test-api-key-1234567890abcdef',
      defaultModel: 'glm-4.6'
    });

    const safeConfig = config.getSafeConfig();

    expect(safeConfig.apiKey).toMatch(/^test-api\.\.\.cdef$/);
  });
});

describe('API Key Validator', () => {
  test('should validate correct API key format', () => {
    expect(validateApiKeyFormat('valid-api-key-1234567890')).toBe(true);
  });

  test('should reject empty API key', () => {
    expect(validateApiKeyFormat('')).toBe(false);
    expect(validateApiKeyFormat(null)).toBe(false);
    expect(validateApiKeyFormat(undefined)).toBe(false);
  });

  test('should reject too short API key', () => {
    expect(validateApiKeyFormat('short')).toBe(false);
  });

  test('should reject too long API key', () => {
    const longKey = 'a'.repeat(201);
    expect(validateApiKeyFormat(longKey)).toBe(false);
  });
});
