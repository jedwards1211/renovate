const globalWorker = require('../../lib/workers/global');
const repositoryWorker = require('../../lib/workers/repository');
const configParser = require('../../lib/config');
const logger = require('../_fixtures/logger');

describe('lib/workers/global', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    configParser.parseConfigs = jest.fn();
    configParser.getRepoConfig = jest.fn();
    repositoryWorker.processRepo = jest.fn();
  });
  it('handles zero repos', async () => {
    configParser.parseConfigs.mockReturnValueOnce({
      repositories: [],
    });
    await globalWorker.start();
  });
  it('processes repositories', async () => {
    configParser.parseConfigs.mockReturnValueOnce({
      foo: 1,
      repositories: ['a', 'b'],
    });
    configParser.getRepoConfig.mockReturnValue({
      repository: 'foo',
      logger,
    });
    await globalWorker.start();
    expect(configParser.parseConfigs.mock.calls.length).toBe(1);
    expect(configParser.getRepoConfig.mock.calls).toMatchSnapshot();
    expect(repositoryWorker.processRepo.mock.calls.length).toBe(2);
  });
  it('catches errors', async () => {
    configParser.parseConfigs.mockImplementationOnce(() => {
      throw new Error('a');
    });
    await globalWorker.start();
  });
});