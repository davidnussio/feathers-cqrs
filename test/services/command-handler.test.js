const app = require('../../src/app');

describe('\'commandHandler\' service', () => {
  it('registered the service', () => {
    const service = app.service('command-handler');
    expect(service).toBeTruthy();
  });
});
