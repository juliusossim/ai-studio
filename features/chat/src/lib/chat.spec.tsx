import { render } from '@testing-library/react';

import OrgFeatureChat from './chat';

describe('OrgFeatureChat', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgFeatureChat />);
    expect(baseElement).toBeTruthy();
  });
});
