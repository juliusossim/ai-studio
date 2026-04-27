import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  cn,
} from '@org/ui-primitives';
import type { ReactElement, ReactNode } from 'react';
import type { NavMenuProps, NavRenderLinkProps } from './nav-menu.types';

function renderNavLabel(item: Readonly<NavMenuProps['items'][number]>): ReactNode {
  if (typeof item.name !== 'string') {
    return item.name;
  }

  return (
    <div className="flex items-center gap-2">
      {item.icon}
      {item.name}
    </div>
  );
}

function renderLinkContent(
  href: string,
  renderLink: NavMenuProps['renderLink'],
  className: string | undefined,
  children: ReactNode,
): ReactNode {
  if (renderLink) {
    return renderLink({ href, children, className } satisfies NavRenderLinkProps);
  }

  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}

export function NavMenu({
  items,
  renderLink,
  className,
  listClassName,
  triggerClassName,
}: Readonly<NavMenuProps>): ReactElement {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className={listClassName}>
        {items.map((item) => (
          <NavigationMenuItem key={item.id}>
            {item.href ? (
              <NavigationMenuLink active={item.active} asChild>
                {renderLinkContent(
                  item.href,
                  renderLink,
                  'flex items-center gap-2',
                  renderNavLabel(item),
                )}
              </NavigationMenuLink>
            ) : (
              <NavigationMenuTrigger className={cn('bg-transparent', triggerClassName)}>
                {renderNavLabel(item)}
              </NavigationMenuTrigger>
            )}
            {item.children ? <NavigationMenuContent>{item.children}</NavigationMenuContent> : null}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
