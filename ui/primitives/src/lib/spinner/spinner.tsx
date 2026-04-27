import { Loader2Icon } from 'lucide-react';

import { cn } from '../utils';
import type { SpinnerProps } from './spinner.types';

function Spinner({ className, ...props }: SpinnerProps): React.ReactElement {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
