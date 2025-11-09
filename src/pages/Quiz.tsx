import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Progress } from "@/components/ui/progress";
import { Loader2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

const Quiz = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { speak, speaking } = useSpeechSynthesis();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [category]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Shuffle and take 10 questions
      const shuffled = (data || []).sort(() => Math.random() - 0.5).slice(0, 10);
      setQuestions(shuffled);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const currentQuestion = questions[currentIndex];
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
      toast.success("Correct! 🎉");
    } else {
      toast.error(`Wrong! Correct answer was ${currentQuestion.correct_answer}`);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Quiz finished
        saveResults();
      }
    }, 1500);
  };

  const saveResults = async () => {
    const shareId = Math.random().toString(36).substring(2, 10);
    
    try {
      const { error } = await supabase.from("quiz_results").insert({
        user_name: userName,
        score: score + (selectedAnswer === questions[currentIndex].correct_answer ? 1 : 0),
        total_questions: questions.length,
        category: category || "",
        share_id: shareId,
      });

      if (error) throw error;

      navigate(`/results/${shareId}`);
    } catch (error) {
      console.error("Error saving results:", error);
      toast.error("Failed to save results");
    }
  };

  const startQuiz = () => {
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setShowNameInput(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-3xl font-bold mb-4">No Questions Available</h1>
          <p className="text-muted-foreground mb-6">
            There are no questions for this category yet.
          </p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <Card className="max-w-md mx-auto p-8 animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 text-center">Enter Your Name</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Your name will appear on the leaderboard
            </p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background mb-6"
              onKeyPress={(e) => e.key === "Enter" && startQuiz()}
            />
            <Button onClick={startQuiz} className="w-full">
              Start Quiz
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium">
                Score: {score}/{questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="p-8 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center">
                {currentQuestion.question}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speak(currentQuestion.question)}
                disabled={speaking}
                className="shrink-0"
              >
                <Volume2 className={`w-6 h-6 ${speaking ? 'animate-pulse' : ''}`} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["A", "B", "C", "D"].map((option) => {
                const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof Question];
                const isSelected = selectedAnswer === option;
                const isCorrect = currentQuestion.correct_answer === option;
                
                let buttonClass = "h-auto py-4 text-lg";
                if (showFeedback) {
                  if (isCorrect) {
                    buttonClass += " bg-green-500 hover:bg-green-500 text-white";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += " bg-red-500 hover:bg-red-500 text-white";
                  }
                }

                return (
                  <Button
                    key={option}
                    variant={isSelected && !showFeedback ? "default" : "outline"}
                    className={buttonClass}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                  >
                    <span className="font-bold mr-2">{option}.</span> {optionText}
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
