const FFNode = require('@/node/node');

jest.mock('events');
jest.mock('@/conf/conf', () => ({
  getFakeConf: jest.fn(() => ({})),
}));
jest.mock('@/utils/utils', () => ({
  generateID: jest.fn(() => 1),
}));

describe('node/node', () => {
  let node = null;

  test('instantiation component needs to succeed', () => {
    node = new FFNode();
    expect(node).toBeInstanceOf(FFNode);
  });

  test('generateID: set id success', () => {
    node.generateID();
    expect(node.id).toBe(1);
  });

  test('root: should return self', () => {
    expect(node.root()).toBe(node);
  });

  test('rootConf: should return conf', () => {
    const conf = node.rootConf();
    expect(conf).toMatchObject({});
  });

  test('destroy: destroy function invoke success', () => {
    node.destroy();
    expect(node.parent).toBeFalsy();
  });
});
