import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Atom, 
  ScrollText, 
  Smile, 
  Palette, 
  Cpu, 
  Database, 
  Telescope, 
  Lightbulb, 
  Brush,
  ChevronRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants ---

const SUBJECTS = [
  { id: 'ai', name: 'Artificial Intelligence', icon: Cpu, color: 'bg-blue-400' },
  { id: 'quantum', name: 'Quantum Physics', icon: Atom, color: 'bg-purple-400' },
  { id: 'existentialism', name: 'Existentialism', icon: ScrollText, color: 'bg-stone-400' },
  { id: 'cbt', name: 'Cognitive Behavioral Therapy', icon: Smile, color: 'bg-pink-400' },
  { id: 'ux', name: 'UX Design', icon: Brain, color: 'bg-emerald-400' },
  { id: 'impressionism', name: 'Impressionism', icon: Palette, color: 'bg-orange-400' },
  { id: 'blockchain', name: 'Blockchain', icon: Database, color: 'bg-indigo-400' },
  { id: 'blackholes', name: 'Black Holes', icon: Telescope, color: 'bg-slate-700 text-white' },
  { id: 'stoicism', name: 'Stoicism', icon: Lightbulb, color: 'bg-amber-400' },
  { id: 'surrealism', name: 'Surrealism', icon: Brush, color: 'bg-rose-400' },
];

const LEVELS = [
  { 
    id: 0, 
    title: 'Kevin',
    label: 'Child', 
    description: 'Explain like I am 5', 
    character: 'https://lh3.googleusercontent.com/d/18P4pYXUQnHZpQNhRb4H0dd9qfzMzbcdY',
    prompt: 'Explain this to a 5-year-old using very simple words, analogies with toys or animals, and a friendly tone.'
  },
  { 
    id: 1, 
    title: 'Kelly',
    label: 'Teen', 
    description: 'Explain like I am 13', 
    character: 'https://lh3.googleusercontent.com/d/1ep7JfxvJ0B_hJdQz6mCvnjgYugcwiAgK',
    prompt: 'Explain this to a 13-year-old using relatable modern analogies, some slang, and keeping it engaging but informative.'
  },
  { 
    id: 2, 
    title: 'Dwight',
    label: 'College Student', 
    description: 'Explain like I am 20', 
    character: 'https://lh3.googleusercontent.com/d/16AWQjolSOrsm3QkK5gsXUtplnG7ksaRn?timestamp=1',
    prompt: 'Explain this to a college student. Use academic but accessible language, mention key concepts, and provide a structured overview.'
  },
  { 
    id: 3, 
    title: 'Pam',
    label: 'Grad Student', 
    description: 'Explain like I am 25', 
    character: 'https://lh3.googleusercontent.com/d/16cGIwLExHi8ylvlpV2SkUXq_vODoQpOV',
    prompt: 'Explain this to a graduate student. Use technical terminology, discuss nuances, theories, and current research directions.'
  },
  { 
    id: 4, 
    title: 'Ryan',
    label: 'Expert', 
    description: 'Explain like I am a PhD', 
    character: 'https://lh3.googleusercontent.com/d/1nDXBbQ-nFAxjMRT83otYACmCixvZdMq1',
    prompt: 'Explain this at an expert/PhD level. Dive deep into the mathematical or theoretical foundations, edge cases, and high-level implications.'
  },
];

// --- Components ---

const Header = () => (
  <header className="w-full py-8 px-4 flex flex-col items-center justify-center gap-4 bg-white border-b-4 border-black mb-8">
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 comic-border rounded-full overflow-hidden bg-gray-200">
        <img 
          src="https://lh3.googleusercontent.com/d/1_OL99nRjP170ajKA17CSMnrSz67X5ekd" 
          alt="Michael Scott Two Heads" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full border-2 border-black">
          <Sparkles size={16} />
        </div>
      </div>
      <h1 className="font-comic text-5xl md:text-7xl tracking-tighter uppercase">
        Explain like I am...
      </h1>
    </div>
    <p className="font-mono text-sm uppercase tracking-widest opacity-60">
      Inspired by Michael Scott & the quest for knowledge
    </p>
    <div className="comic-border bg-black text-white p-4 max-w-xl text-center mt-2">
      <p className="font-mono text-xs italic">
        "I'm an early bird and I'm a night owl. So I'm wise and I have worms."
        <br />— Michael Scott
      </p>
    </div>
  </header>
);

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState<typeof SUBJECTS[0] | null>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentLevel = LEVELS[levelIndex];

  const generateExplanation = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    setError('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      
      const prompt = `Subject: ${selectedSubject.name}\nTarget Audience: ${currentLevel.label}\nInstruction: ${currentLevel.prompt}\n\nPlease provide a clear, engaging explanation in Markdown format.`;
      
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setExplanation(response.text || 'No explanation generated.');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      generateExplanation();
    }
  }, [selectedSubject, levelIndex]);

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Subject Selection */}
        <section className="lg:col-span-4 space-y-6">
          <div className="comic-border bg-white p-6">
            <h2 className="font-comic text-3xl mb-4 flex items-center gap-2">
              1 - Pick a Subject
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-black transition-all",
                    selectedSubject?.id === subject.id 
                      ? "bg-black text-white scale-95" 
                      : "bg-white hover:bg-gray-100"
                  )}
                >
                  <subject.icon size={24} className={cn(selectedSubject?.id === subject.id ? "text-white" : "text-black")} />
                  <span className="text-xs font-bold mt-2 text-center leading-tight">{subject.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Level & Explanation */}
        <section className="lg:col-span-8 space-y-8">
          
          {/* Level Slider & Character */}
          <div className="comic-border bg-white p-8 relative overflow-hidden">
            <h2 className="font-comic text-3xl mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
              2 - Select a Difficulty Level
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 comic-border bg-gray-100 flex-shrink-0 relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={levelIndex}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.2, rotate: 5 }}
                    src={currentLevel.character}
                    alt={currentLevel.label}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                <div className="absolute -bottom-4 -right-4 bg-black text-white font-comic px-4 py-1 text-xl border-2 border-white">
                  {currentLevel.title}
                </div>
              </div>

              <div className="flex-1 w-full space-y-6">
                <div>
                  <h3 className="font-comic text-4xl mb-1">{currentLevel.label} Mode</h3>
                  <p className="text-gray-600 font-medium italic">{currentLevel.description}</p>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="1"
                      value={levelIndex}
                      onChange={(e) => setLevelIndex(parseInt(e.target.value))}
                      className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black border-2 border-black"
                    />
                    <div className="flex justify-between mt-3 px-[2px]">
                      {LEVELS.map((l) => (
                        <div key={l.id} className="flex flex-col items-center w-0 overflow-visible">
                          <span 
                            className={cn(
                              "text-[8px] sm:text-[10px] font-black uppercase tracking-tighter text-center w-10 sm:w-auto leading-[1.1] sm:whitespace-nowrap transition-all duration-200",
                              levelIndex === l.id ? "text-black scale-110" : "text-gray-400"
                            )}
                          >
                            {l.label}
                          </span>
                          
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Output */}
          <div className="comic-border bg-white min-h-[400px] relative">
            <div className="bg-black text-white px-6 py-2 font-comic text-xl flex items-center justify-between">
              <span>Explanation: {selectedSubject ? selectedSubject.name : 'Waiting for selection...'}</span>
              {loading && <Loader2 className="animate-spin" size={20} />}
            </div>
            
            <div className="p-8">
              {!selectedSubject ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                    <Sparkles size={48} className="text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-comic text-3xl mb-2">Ready to learn?</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Pick a subject to start your journey into the unknown!</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-red-500 font-bold p-4 border-2 border-red-500 bg-red-50">
                  {error}
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-black" size={48} />
                  <p className="font-comic text-2xl animate-pulse">Consulting to Oscar Martinez...</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="markdown-body"
                >
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                </motion.div>
              )}
            </div>

            <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
              {selectedSubject && <selectedSubject.icon size={120} />}
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={generateExplanation}
              disabled={loading || !selectedSubject}
              className="comic-button disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles size={24} />
              Regenerate Explanation
            </button>
          </div>

        </section>
      </main>

      <footer className="mt-20 text-center py-8 border-t-4 border-black bg-white">
        <p className="font-comic text-xl">"Sometimes I'll start a sentence and I don't even know where it's going. I just hope I find it along the way."</p>
        <p className="font-mono text-xs mt-2 opacity-50">© 2026 Dunder Mifflin Knowledge Base</p>
      </footer>
      <p className="text-center font-mono text-[10px] mt-4 opacity-40 mx-auto px-2">
        Disclaimer: This app is using Gemini API. Gemini is AI and can make mistakes.
      </p>
    </div>
  );
}
