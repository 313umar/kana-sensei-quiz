import { QuizCard } from "@/components/QuizCard";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MessageCircle, Volume2, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-cherry-blossom.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Learn Japanese
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up">
              Master Hiragana, Katakana, and vocabulary through interactive quizzes
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-glow" />
                <span>Interactive Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-glow" style={{ animationDelay: "300ms" }} />
                <span>Track Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-glow" style={{ animationDelay: "600ms" }} />
                <span>Share Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Practice Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Voice Practice Features
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Practice speaking Japanese with AI-powered voice features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl mb-4">
                <Mic className="w-16 h-16 mx-auto text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-center">Pronunciation Practice</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Listen to Japanese phrases and practice your pronunciation with speech recognition
              </p>
              <Link to="/pronunciation">
                <Button className="w-full">Start Practicing</Button>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl mb-4">
                <MessageCircle className="w-16 h-16 mx-auto text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-center">AI Conversation</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Chat with AI teacher in Japanese using voice or text for real conversation practice
              </p>
              <Link to="/conversation">
                <Button className="w-full">Start Conversation</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Quiz Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Choose Your Quiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <QuizCard
              title="Hiragana"
              description="Learn the basic Japanese phonetic alphabet used for native words"
              icon="あ"
              category="hiragana"
              delay={0}
            />
            <QuizCard
              title="Katakana"
              description="Master the phonetic alphabet used for foreign words and names"
              icon="ア"
              category="katakana"
              delay={100}
            />
            <QuizCard
              title="Vocabulary"
              description="Expand your Japanese vocabulary with common words and phrases"
              icon="語"
              category="vocabulary"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Japanese Quiz App. Built with ❤️ for Japanese learners</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
