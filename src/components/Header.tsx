import { Link } from "@tanstack/react-router";
import { Zap, Shield } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">TurfZone</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground [&.active]:text-foreground">
            Home
          </Link>
          <Link to="/book" className="text-sm font-medium text-muted-foreground hover:text-foreground [&.active]:text-foreground">
            Book
          </Link>
          <Link to="/tournaments" className="text-sm font-medium text-muted-foreground hover:text-foreground [&.active]:text-foreground">
            Tournaments
          </Link>
          {/* <Link to="/tickets" className="text-sm font-medium text-muted-foreground hover:text-foreground [&.active]:text-foreground">
            Tickets
          </Link> */}
          <Link to="/getourbook" className="text-sm font-medium text-muted-foreground hover:text-foreground [&.active]:text-foreground">
            Track Booking
          </Link>
        </nav>
        <Link
          to="/admin"
          className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Shield className="h-3.5 w-3.5" />
          Admin
        </Link>
      </div>
    </header>
  );
}