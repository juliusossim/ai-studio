import { Badge, cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { Typography } from '../../typography';
import { handleBrandBadgeKeyDown } from './brand-badge.utils';
import {
  BrandBadgeDescription,
  BrandBadgeIcon,
  BrandBadgeLogo,
  BrandBadgeTitle,
} from './components';
import type { BrandBadgeProps } from './brand-badge.types';

export function BrandBadge({
  brand,
  variant = 'secondary',
  clickable = false,
  onClick,
  onKeyDown,
}: Readonly<BrandBadgeProps>): ReactElement {
  const title = <BrandBadgeTitle brand={brand} />;
  const displayTitle = <BrandBadgeDescription brand={brand} title={title} />;
  const isInteractive = clickable || Boolean(brand.href);

  return (
    <Badge
      className={cn(
        'py-1.5 text-sm transition-transform',
        isInteractive ? 'cursor-pointer hover:scale-105' : '',
      )}
      onClick={clickable ? () => onClick?.(brand) : undefined}
      onKeyDown={(event) =>
        handleBrandBadgeKeyDown(event, { brand, clickable, onClick, onKeyDown })
      }
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      variant={variant}
    >
      <BrandBadgeLogo brand={brand} />
      <Typography className="flex items-center gap-1">
        <BrandBadgeIcon brand={brand} position="start" />
        {displayTitle}
        <BrandBadgeIcon brand={brand} position="end" />
      </Typography>
    </Badge>
  );
}
