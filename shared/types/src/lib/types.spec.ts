import { SessionProfile } from './types.js';

describe('types', () => {
  it('should define SessionProfile interface', () => {
    const profile: SessionProfile = {
      userName: 'test',
      preferredLanguage: 'en',
    };
    expect(profile.userName).toEqual('test');
  });
});
