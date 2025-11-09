import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardEntry {
  user_name: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

const Leaderboard = () => {
  const [hiraganaLeaders, setHiraganaLeaders] = useState<LeaderboardEntry[]>([]);
  const [katakanaLeaders, setKatakanaLeaders] = useState<LeaderboardEntry[]>([]);
  const [vocabularyLeaders, setVocabularyLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      const categories = ["hiragana", "katakana", "vocabulary"];
      
      for (const category of categories) {
        const { data, error } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("category", category)
          .order("score", { ascending: false })
          .order("completed_at", { ascending: true })
          .limit(10);

        if (error) throw error;

        if (category === "hiragana") setHiraganaLeaders(data || []);
        if (category === "katakana") setKatakanaLeaders(data || []);
        if (category === "vocabulary") setVocabularyLeaders(data || []);
      }
    } catch (error) {
      console.error("Error fetching leaderboards:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{index + 1}</span>;
  };

  const LeaderboardTable = ({ entries }: { entries: LeaderboardEntry[] }) => (
    <div className="space-y-2">
      {entries.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No results yet</p>
      ) : (
        entries.map((entry, index) => (
          <Card
            key={index}
            className={`p-4 flex items-center justify-between hover:shadow-md transition-all ${
              index < 3 ? "border-2 border-primary/30" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              {getRankIcon(index)}
              <div>
                <p className="font-semibold">{entry.user_name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(entry.completed_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {entry.score}/{entry.total_questions}
              </p>
              <p className="text-sm text-muted-foreground">
                {((entry.score / entry.total_questions) * 100).toFixed(0)}%
              </p>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">Top performers across all quiz categories</p>
        </div>

        <Tabs defaultValue="hiragana" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
            <TabsTrigger value="katakana">Katakana</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          </TabsList>

          <TabsContent value="hiragana">
            <LeaderboardTable entries={hiraganaLeaders} />
          </TabsContent>

          <TabsContent value="katakana">
            <LeaderboardTable entries={katakanaLeaders} />
          </TabsContent>

          <TabsContent value="vocabulary">
            <LeaderboardTable entries={vocabularyLeaders} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
