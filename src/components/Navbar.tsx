import { Link } from "react-router-dom";
import { Trophy, User } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all shrink-0">
            <span className="text-xl font-bold text-primary-foreground">日</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent whitespace-nowrap">
            Nihonify
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/leaderboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
