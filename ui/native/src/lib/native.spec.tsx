import { render } from '@testing-library/react-native';
import Native from './native';

describe('Native', () => {
  it('should render successfully', () => {
    const { root } = render(<Native />);
    expect(root).toBeTruthy();
  });
});
