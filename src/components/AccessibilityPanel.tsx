import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Accessibility, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  Keyboard,
  Mic,
  MicOff 
} from 'lucide-react';
import { accessibility, textToSpeech, voiceInput } from '@/utils/accessibility';

interface AccessibilityPanelProps {
  onClose: () => void;
}

export function AccessibilityPanel({ onClose }: AccessibilityPanelProps) {
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [speechRate, setSpeechRate] = useState([1]);
  const [speechVolume, setSpeechVolume] = useState([1]);

  const handleTextToSpeechToggle = (enabled: boolean) => {
    setTextToSpeechEnabled(enabled);
    if (enabled) {
      textToSpeech.speak("Text to speech is now enabled");
    } else {
      textToSpeech.stop();
    }
  };

  const handleVoiceInputToggle = (enabled: boolean) => {
    setVoiceInputEnabled(enabled);
    if (enabled && voiceInput.isSupported()) {
      // Voice input would be enabled globally
    } else {
      voiceInput.stopListening();
    }
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    setHighContrastEnabled(enabled);
    accessibility.toggleHighContrast();
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
    document.documentElement.style.fontSize = `${value[0]}px`;
  };

  const testSpeech = () => {
    textToSpeech.speak("This is a test of the text to speech feature", {
      rate: speechRate[0],
      volume: speechVolume[0]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Accessibility className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Accessibility Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Customize your experience for better accessibility
                </p>
              </div>
            </div>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Voice Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                <h3 className="font-medium">Voice Features</h3>
              </div>
              
              <div className="space-y-3 pl-7">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Text to Speech</label>
                    <p className="text-xs text-muted-foreground">
                      Have bot messages read aloud
                    </p>
                  </div>
                  <Switch
                    checked={textToSpeechEnabled}
                    onCheckedChange={handleTextToSpeechToggle}
                  />
                </div>

                {textToSpeechEnabled && (
                  <div className="space-y-3 pl-4 border-l-2 border-muted">
                    <div>
                      <label className="text-sm">Speech Rate: {speechRate[0]}x</label>
                      <Slider
                        value={speechRate}
                        onValueChange={setSpeechRate}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Volume: {Math.round(speechVolume[0] * 100)}%</label>
                      <Slider
                        value={speechVolume}
                        onValueChange={setSpeechVolume}
                        max={1}
                        min={0.1}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={testSpeech} size="sm" variant="outline">
                      Test Speech
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Voice Input</label>
                    <p className="text-xs text-muted-foreground">
                      Speak instead of typing {!voiceInput.isSupported() && "(Not supported)"}
                    </p>
                  </div>
                  <Switch
                    checked={voiceInputEnabled}
                    onCheckedChange={handleVoiceInputToggle}
                    disabled={!voiceInput.isSupported()}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Visual Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                <h3 className="font-medium">Visual Settings</h3>
              </div>
              
              <div className="space-y-3 pl-7">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">High Contrast Mode</label>
                    <p className="text-xs text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={highContrastEnabled}
                    onCheckedChange={handleHighContrastToggle}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Font Size: {fontSize[0]}px</label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Adjust text size for better readability
                  </p>
                  <Slider
                    value={fontSize}
                    onValueChange={handleFontSizeChange}
                    max={24}
                    min={12}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleFontSizeChange([16])}
                    size="sm" 
                    variant="outline"
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Keyboard Navigation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                <h3 className="font-medium">Keyboard Navigation</h3>
              </div>
              
              <div className="pl-7 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Tab</Badge>
                  <span>Navigate between elements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Enter</Badge>
                  <span>Activate buttons and links</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Escape</Badge>
                  <span>Close dialogs and modals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Space</Badge>
                  <span>Scroll and activate controls</span>
                </div>
              </div>
            </div>

            {/* Feature Support Status */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">Feature Support</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Text to Speech</span>
                  <Badge variant={textToSpeech.isSupported() ? "default" : "secondary"}>
                    {textToSpeech.isSupported() ? "Supported" : "Not Available"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Voice Input</span>
                  <Badge variant={voiceInput.isSupported() ? "default" : "secondary"}>
                    {voiceInput.isSupported() ? "Supported" : "Not Available"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Keyboard Navigation</span>
                  <Badge variant="default">Always Available</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}