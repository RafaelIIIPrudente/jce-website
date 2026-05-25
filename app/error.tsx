"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center gap-3">
          <TriangleAlert
            className="text-destructive size-6"
            aria-hidden="true"
          />
          <div className="grid gap-1">
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              An unexpected error occurred. The team has been notified.
            </CardDescription>
          </div>
        </CardHeader>
        {error.digest ? (
          <CardContent>
            <p className="text-muted-foreground font-mono text-xs">
              Reference: {error.digest}
            </p>
          </CardContent>
        ) : null}
        <CardFooter>
          <Button onClick={() => reset()}>Try again</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
