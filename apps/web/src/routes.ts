import { index, layout, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  layout('./routes/public-layout.tsx', [
    index('./routes/home.tsx'),
    route('listings/:listingId', './routes/listing-detail.tsx'),
    route('listings/:listingId/inquire', './routes/listing-inquire.tsx'),
    route('listings/:listingId/request-viewing', './routes/listing-request-viewing.tsx'),
    route('creators/:creatorHandle', './routes/creator-profile.tsx'),
    route('live/:liveId', './routes/live-detail.tsx'),
  ]),
  layout('./routes/auth-layout.tsx', [
    route('sign-in', './routes/sign-in.tsx'),
    route('register', './routes/register.tsx'),
  ]),
  layout('./routes/app-layout.tsx', [
    route('feed', './routes/feed.tsx'),
    route('saved', './routes/saved.tsx'),
    route('inbox', './routes/inbox.tsx'),
    route('inbox/:threadId', './routes/inbox-thread.tsx'),
    route('notifications', './routes/notifications.tsx'),
    route('dashboard', './routes/dashboard.tsx'),
    route('dashboard/listings', './routes/dashboard-listings.tsx'),
    route('dashboard/listings/new', './routes/dashboard-listings-new.tsx'),
    route('dashboard/listings/import', './routes/dashboard-listings-import.tsx'),
    route('dashboard/content', './routes/dashboard-content.tsx'),
    route('dashboard/catalog', './routes/dashboard-catalog.tsx'),
    route('dashboard/catalog/new', './routes/dashboard-catalog-new.tsx'),
    route('dashboard/catalog/import', './routes/dashboard-catalog-import.tsx'),
    route('dashboard/engagement', './routes/dashboard-engagement.tsx'),
    route('dashboard/followers', './routes/dashboard-followers.tsx'),
    route('settings', './routes/settings.tsx'),
  ]),
  route('*', './routes/not-found.tsx'),
] satisfies RouteConfig;
