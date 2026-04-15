import { render } from '@testing-library/react';

import OrgFeatureDashboard from './dashboard';

describe('OrgFeatureDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgFeatureDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
