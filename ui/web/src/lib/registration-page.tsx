import type { ReactElement } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@org/ui-primitives';

function GoogleIcon(): ReactElement {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function RegistrationPage(): ReactElement {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <div className="max-w-2xl space-y-6">
          <Badge className="w-fit" variant="secondary">
            AI Studio
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
              Create your agent workspace.
            </h1>
            <p className="text-lg text-muted-foreground">
              Register with Google or create an account manually to start building, testing, and
              launching AI agents.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">Prompt orchestration</div>
            <div className="rounded-lg border bg-card p-4">Tool calling</div>
            <div className="rounded-lg border bg-card p-4">Shared UI systems</div>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Choose Google signup or enter your details manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button className="w-full" variant="outline">
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or register manually</span>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full name</Label>
                <Input id="full-name" autoComplete="name" placeholder="Ada Lovelace" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="ada@example.com"
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  type="password"
                />
              </div>
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <input
                  className="mt-1 size-4 rounded border border-input accent-primary"
                  type="checkbox"
                />
                <span>I agree to the terms and privacy policy.</span>
              </label>
              <Button className="w-full" type="submit">
                Create account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Already have an account?
            <Button className="px-2" variant="link">
              Sign in
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

export default RegistrationPage;
