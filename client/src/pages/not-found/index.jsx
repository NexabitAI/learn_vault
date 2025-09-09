// src/pages/not-found/index.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft, Home } from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen grid place-items-center px-6
        bg-[hsl(var(--background))] text-[hsl(var(--foreground))]
      "
    >
      <div className="max-w-lg text-center">
        <div
          className="
            mx-auto mb-6 flex h-16 w-16 items-center justify-center
            rounded-full border border-[hsl(var(--border))]
            bg-[hsl(var(--card))] shadow-[var(--shadow)]
        "
        >
          <Compass className="h-7 w-7" aria-hidden="true" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          404 — Page not found
        </h1>
        <p className="mt-3 text-sm md:text-base text-[hsl(var(--muted-foreground))]">
          The page you’re looking for doesn’t exist or has moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>

          <Button asChild className="inline-flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>

          <Button asChild variant="outline" className="inline-flex items-center gap-2">
            <Link to="/out/courses">Explore courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
