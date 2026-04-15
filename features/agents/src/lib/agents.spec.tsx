import { render } from '@testing-library/react';

import OrgFeatureAgents from './agents';

describe('OrgFeatureAgents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgFeatureAgents />);
    expect(baseElement).toBeTruthy();
  });
});
