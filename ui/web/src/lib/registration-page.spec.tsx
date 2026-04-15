import { render } from '@testing-library/react';

import RegistrationPage from './registration-page';

describe('RegistrationPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RegistrationPage />);
    expect(baseElement).toBeTruthy();
  });

  it('should include google and manual registration options', () => {
    const { getByText, getByLabelText } = render(<RegistrationPage />);

    expect(getByText('Continue with Google')).toBeTruthy();
    expect(getByLabelText('Full name')).toBeTruthy();
    expect(getByLabelText('Email')).toBeTruthy();
    expect(getByLabelText('Password')).toBeTruthy();
  });
});
