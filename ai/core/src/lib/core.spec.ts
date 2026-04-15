import { ChatEngine } from './core.js';
import { MemoryStore } from './data/service.js';
const memomoryStoreMock = {
  addMessage: jest.fn(),
  getMessages: jest.fn().mockResolvedValue([]),
  clearMessages: jest.fn()
};

jest.mock('@org/config', () => ({
  requireEnv: jest.fn().mockReturnValue('test-key'),
  getEnv: jest.fn(),
}));

jest.mock('./data/service.js', () => {
  return {
    MemoryStore: jest.fn().mockImplementation(() => memomoryStoreMock)
  };
});

jest.mock('./operations/functionTools.js', () => {
  return jest.fn();
});

describe('core', () => {
  it('should work', () => {
    const chatEngine = new ChatEngine(memomoryStoreMock as unknown as MemoryStore);
    expect(chatEngine).toBeInstanceOf(ChatEngine);
  });
});

