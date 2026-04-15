import { render } from '@testing-library/react';

import OrgUiWeb from './web';

describe('OrgUiWeb', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgUiWeb />);
    expect(baseElement).toBeTruthy();
  });
});
