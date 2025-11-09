import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Volume2, Mic, MicOff, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PronunciationPractice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { speak, speaking } = useSpeechSynthesis();
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();
  
  const [phrases, setPhrases] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    fetchPhrases();
  }, []);

  const fetchPhrases = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("question")
      .limit(10);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load phrases",
        variant: "destructive",
      });
    } else {
      setPhrases(data || []);
    }
  };

  const currentPhrase = phrases[currentIndex];

  const handleListen = () => {
    if (currentPhrase) {
      speak(currentPhrase.question);
    }
  };

  const handleRecord = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (transcript && currentPhrase) {
      const similarity = calculateSimilarity(transcript, currentPhrase.question);
      
      if (similarity > 0.6) {
        setFeedback('correct');
        setScore(score + 1);
      } else {
        setFeedback('incorrect');
      }

      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < phrases.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          toast({
            title: "Practice Complete!",
            description: `Your score: ${score + (similarity > 0.6 ? 1 : 0)}/${phrases.length}`,
          });
          setTimeout(() => navigate("/"), 2000);
        }
      }, 2000);
    }
  }, [transcript]);

  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().replace(/\s/g, '');
    const s2 = str2.toLowerCase().replace(/\s/g, '');
    
    if (s1 === s2) return 1;
    
    let matches = 0;
    const maxLen = Math.max(s1.length, s2.length);
    
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
      if (s1[i] === s2[i]) matches++;
    }
    
    return matches / maxLen;
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Speech recognition is not supported in your browser. Please use Chrome or Edge.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (phrases.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / phrases.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Pronunciation Practice</CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentIndex + 1} of {phrases.length}</span>
                <span>Score: {score}</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-foreground p-8 bg-secondary/30 rounded-lg">
                {currentPhrase?.question}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleListen}
                  disabled={speaking}
                  size="lg"
                  className="gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Listen
                </Button>

                <Button
                  onClick={handleRecord}
                  disabled={speaking}
                  size="lg"
                  variant={isListening ? "destructive" : "default"}
                  className="gap-2"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Record
                    </>
                  )}
                </Button>
              </div>

              {isListening && (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Listening... Speak now!
                </p>
              )}

              {transcript && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">You said:</p>
                  <p className="text-lg font-medium">{transcript}</p>
                </div>
              )}

              {feedback && (
                <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
                  feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {feedback === 'correct' ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-green-500 font-medium">Great pronunciation!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      <span className="text-red-500 font-medium">Try again!</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PronunciationPractice;
