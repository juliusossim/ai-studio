import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { applyInitialWebTheme } from '@org/ui-web';

applyInitialWebTheme();

ReactDOM.hydrateRoot(
  document,
  <StrictMode>
    <HydratedRouter />
  </StrictMode>,
);
