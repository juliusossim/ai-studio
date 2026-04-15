import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the registration page', () => {
    const { getByText } = render(<App />);
    expect(getByText('Create your account')).toBeTruthy();
  });
});
