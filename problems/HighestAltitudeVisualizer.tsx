import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, TrendingUp, BarChart3, ArrowUp, FileText } from 'lucide-react';

const APPROACHES = {
  brute: {
    id: 'brute',
    title: '1. Array Construction',
    subtitle: 'Full Prefix Storage',
    icon: <BarChart3 size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int largestAltitude(int[] gain) {
        int n = gain.length;
        int[] altitudes = new int[n + 1];
        altitudes[0] = 0;
        int max = 0;
        
        for (int i = 0; i < n; i++) {
            altitudes[i + 1] = altitudes[i] + gain[i];
            max = Math.max(max, altitudes[i + 1]);
        }
        return max;
    }
}`,
    explanation: "This approach explicitly builds the entire altitude profile into a new array. It's great for visualization or if you need to return the whole trip history, but uses extra memory unnecessarily if you only need the peak."
  },
  optimal: {
    id: 'optimal',
    title: '2. Running Sum',
    subtitle: 'Space Optimized',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int largestAltitude(int[] gain) {
        int currentAltitude = 0;
        int maxAltitude = 0;
        
        for (int i : gain) {
            currentAltitude += i;
            maxAltitude = Math.max(maxAltitude, currentAltitude);
        }
        
        return maxAltitude;
    }
}`,
    explanation: "The professional standard for 'running total' problems. We only care about the current position and the record peak. By using two variables instead of an array, we achieve constant auxiliary space."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">1732. Find the Highest Altitude</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">There is a biker going on a road trip. The trip consists of <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">n + 1</code> points. The biker starts at altitude <code className="font-bold text-slate-800">0</code>.</p>
        <p className="text-lg leading-relaxed">You are given an integer array <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">gain</code> where <code className="bg-slate-100 px-1.5 rounded font-mono font-bold">gain[i]</code> is the net gain between points <code className="italic">i</code> and <code className="italic">i + 1</code> for all (<code className="bg-slate-100 px-1.5 rounded">0 {'<='} i {'<'} n</code>).</p>
        <p className="text-lg font-bold text-slate-800 underline italic">Return the highest altitude of a point.</p>
      </div>
    </div>
  </div>
);

const HighestAltitudeVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-3 rounded-xl shadow-lg shadow-emerald-200">
                <TrendingUp className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Highest Altitude</h1>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>
        {activeTab === 'problem' && <ProblemStatement />}
        {activeTab === 'visualizer' && <VisualizerMode />}
      </div>
    </div>
  );
};

const VisualizerMode = () => {
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('optimal');
  const [gainInput, setGainInput] = useState("-5,1,5,0,-7");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const gain = useMemo(() => gainInput.split(',').map(n => parseInt(n.trim()) || 0), [gainInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = gain.length;
    let currentAlt = 0;
    let maxAlt = 0;
    const altitudes = [0];

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ phase, description: desc, line, state: { ...state, gain: [...gain] } });
    };

    if (selectedApproach === 'brute') {
      addStep("Init", "Start at Point 0 with Altitude 0.", 5, { currentAlt, maxAlt, altitudes: [...altitudes], idx: -1 });
      for (let i = 0; i < n; i++) {
        currentAlt += gain[i];
        altitudes.push(currentAlt);
        const isNewMax = currentAlt > maxAlt;
        maxAlt = Math.max(maxAlt, currentAlt);
        addStep("Update", `Point ${i + 1}: ${currentAlt}. Peak: ${maxAlt}.`, 9, { currentAlt, maxAlt, altitudes: [...altitudes], idx: i, isNewMax });
      }
      addStep("Finish", `The highest altitude recorded was ${maxAlt}.`, 12, { finished: true, currentAlt, maxAlt });
    } else {
      addStep("Init", "Starting altitude 0, Peak 0.", 3, { currentAlt: 0, maxAlt: 0, idx: -1 });
      for (let i = 0; i < n; i++) {
        currentAlt += gain[i];
        const isNewMax = currentAlt > maxAlt;
        maxAlt = Math.max(maxAlt, currentAlt);
        addStep("Step", `Altitude: ${currentAlt}. Peak: ${maxAlt}.`, 7, { currentAlt, maxAlt, idx: i, isNewMax });
      }
      addStep("Finish", `Search complete. Peak recorded: ${maxAlt}.`, 11, { finished: true, currentAlt, maxAlt });
    }
    return steps;
  }, [gain, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const currentState = trace[currentStep] || trace[0];
  const { currentAlt, maxAlt, finished } = currentState.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
      <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2">
             {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 py-4 px-3 rounded-xl transition-all ${selectedApproach === key ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                </button>
             ))}
          </div>
          <div className="bg-[#0f172a] rounded-2xl h-[400px] overflow-hidden flex flex-col relative">
            <div className="p-6 font-mono text-[13px] overflow-auto">
                <div className="absolute left-0 right-0 bg-emerald-500/15 border-l-4 border-emerald-500 pointer-events-none z-0 transition-all duration-300" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                ))}
            </div>
          </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col gap-6 shadow-sm">
           <div className="flex justify-around">
             <div className="text-center"><span className="text-[10px] font-black uppercase text-slate-400">Alt</span><div className="text-3xl font-black">{currentAlt}</div></div>
             <div className="text-center"><span className="text-[10px] font-black uppercase text-slate-400">Peak</span><div className="text-3xl font-black text-emerald-600">{maxAlt}</div></div>
           </div>
           <div className="flex gap-2">
             <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold disabled:opacity-30">Prev</button>
             <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-bold disabled:opacity-30 shadow-lg">Next Action</button>
           </div>
        </div>
        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-2">{currentState.phase}</span>
            <p className="text-sm leading-relaxed">{currentState.description}</p>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{icon} {label}</button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Math|max|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] ${active ? 'font-bold' : ''}`}>
      <span className="w-8 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-xs">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity ${active ? 'opacity-100' : 'opacity-70'}`}>{parts.map((part, i) => <span key={i}>{part}</span>)}</pre>
    </div>
  );
};

export default HighestAltitudeVisualizer;