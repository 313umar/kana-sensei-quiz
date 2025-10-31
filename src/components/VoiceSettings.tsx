import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useState } from "react";

export const VoiceSettings = () => {
  const { voices, selectedVoice, speak, selectVoice } = useSpeechSynthesis();
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);

  const testVoice = () => {
    speak("こんにちは。日本語の発音練習です。", rate, pitch);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Voice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Japanese Voice</label>
          <Select
            value={selectedVoice?.name}
            onValueChange={(name) => {
              const voice = voices.find(v => v.name === name);
              if (voice) selectVoice(voice);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Speed: {rate.toFixed(1)}x</label>
          <Slider
            value={[rate]}
            onValueChange={([value]) => setRate(value)}
            min={0.5}
            max={2}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Pitch: {pitch.toFixed(1)}</label>
          <Slider
            value={[pitch]}
            onValueChange={([value]) => setPitch(value)}
            min={0.5}
            max={2}
            step={0.1}
          />
        </div>

        <Button onClick={testVoice} className="w-full">
          Test Voice
        </Button>
      </CardContent>
    </Card>
  );
};
