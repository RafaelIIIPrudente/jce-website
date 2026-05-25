import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center gap-3">
          <FileQuestion
            className="text-muted-foreground size-6"
            aria-hidden="true"
          />
          <div className="grid gap-1">
            <CardTitle>Page not found</CardTitle>
            <CardDescription>
              We couldn&apos;t find the page you were looking for.
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
