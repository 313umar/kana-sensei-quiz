import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Share2, Home, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QuizResult {
  user_name: string;
  score: number;
  total_questions: number;
  category: string;
  completed_at: string;
}

const Results = () => {
  const { shareId } = useParams();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [shareId]);

  const fetchResult = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("share_id", shareId)
        .single();

      if (error) throw error;
      setResult(data);
    } catch (error) {
      console.error("Error fetching result:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const shareResult = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Results Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const percentage = (result.score / result.total_questions) * 100;
  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <Card className="max-w-2xl mx-auto p-8 md:p-12 text-center animate-scale-in">
          <div className="mb-8">
            {isPerfect ? (
              <div className="text-6xl mb-4 animate-float">🎉</div>
            ) : isGood ? (
              <div className="text-6xl mb-4 animate-float">😊</div>
            ) : (
              <div className="text-6xl mb-4 animate-float">📚</div>
            )}
            <h1 className="text-4xl font-bold mb-2">
              {isPerfect ? "Perfect Score!" : isGood ? "Great Job!" : "Keep Learning!"}
            </h1>
            <p className="text-muted-foreground">
              {result.user_name}'s {result.category} quiz results
            </p>
          </div>

          <div className="mb-8 py-8 px-6 bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-lg border-2 border-primary/20">
            <div className="text-6xl font-bold text-primary mb-2">
              {result.score}/{result.total_questions}
            </div>
            <div className="text-2xl font-semibold text-muted-foreground">
              {percentage.toFixed(0)}% Correct
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={shareResult} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Results
            </Button>
            <Link to="/leaderboard">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Trophy className="w-4 h-4" />
                View Leaderboard
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Results;
