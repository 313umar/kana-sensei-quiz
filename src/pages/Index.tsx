import { QuizCard } from "@/components/QuizCard";
import { Navbar } from "@/components/Navbar";
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
