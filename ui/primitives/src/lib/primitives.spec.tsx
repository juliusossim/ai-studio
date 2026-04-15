import { render } from '@testing-library/react';

import OrgUiPrimitives from './primitives';

describe('OrgUiPrimitives', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgUiPrimitives />);
    expect(baseElement).toBeTruthy();
  });
});
