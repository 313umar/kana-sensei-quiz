import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface QuizCardProps {
  title: string;
  description: string;
  icon: string;
  category: string;
  delay?: number;
}

export const QuizCard = ({ title, description, icon, category, delay = 0 }: QuizCardProps) => {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 animate-fade-in group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-6xl mb-4 animate-float" style={{ animationDelay: `${delay + 200}ms` }}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Link to={`/quiz/${category}`}>
        <Button className="w-full gap-2 group-hover:gap-3 transition-all">
          Start Quiz
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </Card>
  );
};
