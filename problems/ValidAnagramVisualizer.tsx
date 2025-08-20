import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  GitCommit, Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, ArrowLeftToLine, AlignVerticalSpaceAround,
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft, XSquare, ArrowRightLeft, TrendingUp, SearchCode, Languages
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  frequencyArray: {
    id: 'frequencyArray',
    title: '1. Frequency Array (Optimal)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) {
        return false;
    }
    
    int[] count = new int[26];
    
    // 1. Increment for 's', decrement for 't'
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    
    // 2. Check if all counts return to zero
    for (int i = 0; i < 26; i++) {
        if (count[i] != 0) {
            return false;
        }
    }
    
    return true;
}`,
    desc: "The optimal O(N) approach. Since the problem constrains inputs to lowercase English letters, we can use a fixed-size array of 26 integers. We iterate through both strings simultaneously, incrementing the count for characters in 's' and decrementing for characters in 't'. If they are perfect anagrams, every bucket in the array will perfectly balance back to 0."
  },
  sortingApproach: {
    id: 'sortingApproach',
    title: '2. Sorting (Alternative)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N log N) | Space: O(1) or O(N)',
    code: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) {
        return false;
    }
    
    char[] sChars = s.toCharArray();
    char[] tChars = t.toCharArray();
    
    Arrays.sort(sChars);
    Arrays.sort(tChars);
    
    return Arrays.equals(sChars, tChars);
}`,
    desc: "A highly intuitive alternative. By converting both strings to character arrays and sorting them, any two valid anagrams will become perfectly identical strings. While the code is extremely short, it fails the strict O(N) time constraint because sorting requires O(N log N) time."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|char|String|Arrays|sort|equals)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-fuchsia-500/20`, border: `border-fuchsia-400`, text: `text-fuchsia-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-fuchsia-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new', 'char'].includes(part);
            const isObject = ['String', 'Arrays'].includes(part);
            const isVar = ['s', 't', 'count', 'i', 'sChars', 'tChars'].includes(part);
            const isMapCall = ['length', 'charAt', 'toCharArray', 'sort', 'equals'].includes(part);

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-sky-400 font-bold';
            else if (isVar) className = 'text-fuchsia-200';
            else if (isMapCall) className = 'text-amber-400';
            else if (part.startsWith("'") || part.startsWith('"') || !isNaN(parseInt(part))) className = 'text-emerald-400';

            return (
              <span key={i} className={className}>
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`}>
            <span className={`text-[11px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface CharNodeBlockProps {
  char: string;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
}

const CharNodeBlock: React.FC<CharNodeBlockProps> = ({ char, idx, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center w-14 h-16 border-2 rounded-xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl bg-white/60 ${activeTheme.text}`}>
                    {char}
                </div>
                {idx !== undefined && (
                    <div className={`flex w-full h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[9px] font-black tracking-widest uppercase">{idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface FreqBucketBlockProps {
  char: string;
  count: number;
  themeColor?: string;
  isTarget?: boolean;
}

const FreqBucketBlock: React.FC<FreqBucketBlockProps> = ({ char, count, themeColor = 'slate', isTarget }) => {
    const themes = {
        fuchsia: { bg: 'bg-fuchsia-100', border: 'border-fuchsia-400', text: 'text-fuchsia-800', top: 'bg-fuchsia-500 text-white' },
        sky: { bg: 'bg-sky-100', border: 'border-sky-400', text: 'text-sky-800', top: 'bg-sky-500 text-white' },
        emerald: { bg: 'bg-emerald-100', border: 'border-emerald-500', text: 'text-emerald-900', top: 'bg-emerald-600 text-white' },
        rose: { bg: 'bg-rose-100', border: 'border-rose-500', text: 'text-rose-900', top: 'bg-rose-600 text-white' },
        amber: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-900', top: 'bg-amber-500 text-white' },
        slate: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-700', top: 'bg-slate-200 text-slate-500' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-500','-300').replace('-400','-200')}] shadow-xl z-20 scale-125` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-300`}>
            <div className={`flex flex-col items-center w-10 h-12 border-2 rounded-lg transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex w-full h-4 items-center justify-center font-black font-mono text-[9px] ${activeTheme.top}`}>
                    '{char}'
                </div>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-sm ${activeTheme.text}`}>
                    {count}
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function ValidAnagramVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('frequencyArray');
  
  const [inputS, setInputS] = useState('anagram');
  const [inputT, setInputT] = useState('nagaram');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(1); 
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputS, inputT, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps = [];
    let s = inputS.trim().toLowerCase();
    let t = inputT.trim().toLowerCase();

    if (s.length === 0 || t.length === 0) return [{ phase: 'Init', description: 'Enter strings s and t.', line: 0, state: { sArr: [], tArr: [] } }];

    const sArr = s.split('');
    const tArr = t.split('');

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            sArr: [...sArr],
            tArr: [...tArr],
            ...st 
        } 
    });

    if (selectedOpId === 'frequencyArray') {
        
        add("Check Lengths", `if (s.length() != t.length()) -> Is ${s.length} != ${t.length}?`, 2, { count: Array(26).fill(0) });
        
        if (s.length !== t.length) {
            add("Lengths Differ", `Strings have different lengths. They cannot be anagrams. Return false.`, 3, { isFail: true, count: Array(26).fill(0) });
            return steps;
        }

        add("Lengths Match", `Lengths match. Proceed to check characters.`, 6, { count: Array(26).fill(0) });

        let count = new Array(26).fill(0);
        add("Init Frequency Array", `int[] count = new int[26]; Initialized array of size 26 with all 0s.`, 6, { count: [...count] });

        for (let i = 0; i < s.length; i++) {
            add("Loop Condition (Update Counts)", `for(int i = ${i}; ${i} < ${s.length}; i++)`, 9, { i, count: [...count] });
            
            let charS = s.charCodeAt(i) - 97;
            let charT = t.charCodeAt(i) - 97;

            // Prevent indexing errors if users type non-letters for this visualizer
            if (charS < 0 || charS > 25 || charT < 0 || charT > 25) {
                add("Error", "Invalid character detected. Visualizer only supports a-z.", 9, { i, isFail: true, count: [...count] });
                return steps;
            }
            
            add("Read Characters", `Read s[${i}] = '${s[i]}' and t[${i}] = '${t[i]}'.`, 10, { i, hlS: charS, hlT: charT, count: [...count] });

            count[charS]++;
            add("Increment S", `count['${s[i]}']++. Adding to bucket for string s.`, 10, { i, hlS: charS, isInc: true, count: [...count] });

            count[charT]--;
            add("Decrement T", `count['${t[i]}']--. Subtracting from bucket for string t.`, 11, { i, hlT: charT, isDec: true, count: [...count] });
        }

        add("Updates Complete", "Finished updating counts. Now verifying if all buckets are 0.", 14, { count: [...count] });

        let isValid = true;
        for (let i = 0; i < 26; i++) {
            add("Loop Condition (Verify Counts)", `for(int i = ${i}; ${i} < 26; i++)`, 15, { checkIdx: i, count: [...count] });
            
            add("Check Bucket", `if (count[${i}] != 0) -> Bucket '${String.fromCharCode(i + 97)}' has count ${count[i]}.`, 16, { checkIdx: i, count: [...count] });

            if (count[i] !== 0) {
                add("Imbalance Found!", `Bucket '${String.fromCharCode(i + 97)}' is not 0! There is a mismatch in characters. Return false.`, 17, { checkIdx: i, isFail: true, count: [...count] });
                isValid = false;
                break;
            }
        }

        if (isValid) {
            add("Verification Complete", `All buckets are exactly 0. The strings are perfect anagrams! Return true.`, 21, { isSuccess: true, count: [...count] });
        }

    } else if (selectedOpId === 'sortingApproach') {
        add("Check Lengths", `if (s.length() != t.length()) -> Is ${s.length} != ${t.length}?`, 2, {});
        
        if (s.length !== t.length) {
            add("Lengths Differ", `Strings have different lengths. They cannot be anagrams. Return false.`, 3, { isFail: true });
            return steps;
        }

        add("Convert to Arrays", `Convert strings to char arrays.`, 6, { sArrSorted: [...sArr], tArrSorted: [...tArr] });

        let sSorted = [...sArr].sort();
        let tSorted = [...tArr].sort();

        add("Sort S", `Arrays.sort(sChars); Sort string S alphabetically.`, 9, { sArrSorted: [...sSorted], tArrSorted: [...tArr], isSSorted: true });
        add("Sort T", `Arrays.sort(tChars); Sort string T alphabetically.`, 10, { sArrSorted: [...sSorted], tArrSorted: [...tSorted], isSSorted: true, isTSorted: true });

        add("Equals Check", `Arrays.equals(sChars, tChars); Compare the two sorted arrays.`, 12, { sArrSorted: [...sSorted], tArrSorted: [...tSorted], isSSorted: true, isTSorted: true, checkingEq: true });

        let isEq = true;
        let failIdx = -1;
        for(let i=0; i<sSorted.length; i++) {
             if (sSorted[i] !== tSorted[i]) {
                 isEq = false;
                 failIdx = i;
                 break;
             }
        }

        if (isEq) {
            add("Strings Match", `The sorted arrays are completely identical. Return true.`, 12, { sArrSorted: [...sSorted], tArrSorted: [...tSorted], isSSorted: true, isTSorted: true, isSuccess: true });
        } else {
            add("Mismatch Found", `Mismatch found at sorted index ${failIdx}. '${sSorted[failIdx]}' != '${tSorted[failIdx]}'. Return false.`, 12, { sArrSorted: [...sSorted], tArrSorted: [...tSorted], isSSorted: true, isTSorted: true, isFail: true, failEqIdx: failIdx });
        }
    }

    return steps;
  }, [inputS, inputT, selectedOpId]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { sArr: [], tArr: [] } };
  const st = curStepData.state || { sArr: [], tArr: [] };
  const isLastStep = currentStep === trace.length - 1;

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-fuchsia-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Languages className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Valid Anagram</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded">
                      LC 242 • Strings & Hashing
                  </span>
                  <span>•</span>
                  <span>O(N) Time Constraint</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className="flex items-center gap-3 text-fuchsia-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.<br/><br/>
                  An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s = "anagram", t = "nagaram"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> true</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Both strings contain exactly three 'a's, one 'g', one 'm', one 'n', and one 'r'.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> s = "rat", t = "car"</div>
                        <div><span className="text-rose-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: 'rat' contains an 'r' and 't', while 'car' contains a 'c' and 'r'. Letter frequencies do not match.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Follow-ups</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= s.length, t.length &lt;= 5 * 10<sup>4</sup></li>
                        <li><code>s</code> and <code>t</code> consist of lowercase English letters.</li>
                        <li className="font-bold text-fuchsia-600 mt-2">Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-fuchsia-600 text-white border-fuchsia-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-fuchsia-200' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1 flex justify-between">
                                <span>String S</span>
                            </label>
                            <input 
                                type="text"
                                value={inputS} 
                                onChange={(e) => setInputS(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1 flex justify-between">
                                <span>String T</span>
                            </label>
                            <input 
                                type="text"
                                value={inputT} 
                                onChange={(e) => setInputT(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center w-full xl:w-auto mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.isFail} className={`px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-fuchsia-200 hover:bg-fuchsia-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : st.isFail ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Valid Anagram</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : st.isFail ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><XCircle size={20}/> Invalid Anagram</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-fuchsia-500"/> Variable State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-16 pb-16 gap-10 items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Strict Flexbox Layout (No Overlaps) --- */}

                           {/* Row 1 & 2: Strings S and T */}
                           <div className="flex flex-col items-center gap-6 w-full">
                               {/* String S */}
                               <div className="flex flex-col items-center max-w-full">
                                   <div className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest font-mono mb-2">String S</div>
                                   <div className="flex gap-2 p-3 border border-fuchsia-200 bg-fuchsia-50/80 rounded-2xl shadow-sm backdrop-blur-sm flex-wrap justify-center">
                                       {(st.sArrSorted || st.sArr || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                       {(st.sArrSorted || st.sArr || []).map((char, idx) => {
                                           const isHl = selectedOpId === 'sortingApproach' ? (st.checkingEq && st.failEqIdx === idx ? 'rose' : (st.checkingEq ? 'emerald' : 'slate')) : (st.i === idx ? 'fuchsia' : 'slate');
                                           return (
                                               <div key={`s-${idx}`} className="relative">
                                                   {st.i === idx && <PointerLabel label="i" color="fuchsia" position="top" />}
                                                   <CharNodeBlock char={char} idx={idx} themeColor={isHl !== 'slate' ? isHl : 'slate'} isTarget={st.i === idx || (st.checkingEq && st.failEqIdx === idx)} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

                               {/* String T */}
                               <div className="flex flex-col items-center max-w-full">
                                   <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest font-mono mb-2">String T</div>
                                   <div className="flex gap-2 p-3 border border-sky-200 bg-sky-50/80 rounded-2xl shadow-sm backdrop-blur-sm flex-wrap justify-center">
                                       {(st.tArrSorted || st.tArr || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                       {(st.tArrSorted || st.tArr || []).map((char, idx) => {
                                           const isHl = selectedOpId === 'sortingApproach' ? (st.checkingEq && st.failEqIdx === idx ? 'rose' : (st.checkingEq ? 'emerald' : 'slate')) : (st.i === idx ? 'sky' : 'slate');
                                           return (
                                               <div key={`t-${idx}`} className="relative">
                                                   {st.i === idx && <PointerLabel label="i" color="sky" position="bottom" />}
                                                   <CharNodeBlock char={char} idx={idx} themeColor={isHl !== 'slate' ? isHl : 'slate'} isTarget={st.i === idx || (st.checkingEq && st.failEqIdx === idx)} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           </div>

                           {/* Row 3: Frequency Array (Optimal Only) */}
                           {selectedOpId === 'frequencyArray' && st.count && (
                               <div className="flex flex-col items-center mt-4 w-full">
                                   <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono mb-3 flex items-center gap-1"><Database size={12}/> int[26] Count Array</div>
                                   <div className="flex flex-wrap gap-2 p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl shadow-xl justify-center items-center max-w-2xl">
                                        {st.count.map((val, idx) => {
                                            const charLabel = String.fromCharCode(idx + 97);
                                            
                                            // Determine highlighting
                                            const isInc = st.hlS === idx && st.isInc;
                                            const isDec = st.hlT === idx && st.isDec;
                                            const isChecking = st.checkIdx === idx;
                                            const isFail = isChecking && st.isFail;
                                            
                                            let color = 'slate';
                                            if (isFail) color = 'rose';
                                            else if (isChecking) color = 'amber';
                                            else if (isInc) color = 'fuchsia';
                                            else if (isDec) color = 'sky';
                                            else if (val === 0 && st.checkIdx !== undefined && st.checkIdx > idx) color = 'emerald'; // passed check

                                            return (
                                                <div key={`count-${idx}`}>
                                                     <FreqBucketBlock char={charLabel} count={val} themeColor={color} isTarget={isInc || isDec || isChecking || isFail} />
                                                </div>
                                            )
                                        })}
                                   </div>
                               </div>
                           )}

                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Database size={120}/></div>
                        <h3 className="font-black text-fuchsia-400 text-lg uppercase tracking-widest mb-6">The Frequency Array Optimization</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>A naive approach might use a <code>HashMap&lt;Character, Integer&gt;</code> to count characters. But Map lookups, hashing, and Integer object allocations carry overhead.</p>
                            <p>The problem states inputs are <strong>lowercase English letters</strong>. This means there are exactly 26 possible characters.</p>
                            <p>We can bypass the HashMap entirely and use a raw <code>int[26]</code> array. We map 'a' to index 0, 'b' to index 1, etc., using simple math: <code>char - 'a'</code>.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-fuchsia-50 border border-fuchsia-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-fuchsia-700 text-lg uppercase tracking-widest mb-6">The Single Array Balance</h3>
                        <div className="space-y-4 text-sm text-fuchsia-900/80 leading-relaxed font-medium">
                            <p>We could create two separate arrays (one for <code>s</code> and one for <code>t</code>) and compare them. But we can optimize space even further.</p>
                            <p>We use ONE array. When we see a character in <code>s</code>, we <strong>increment (+1)</strong> its bucket. When we see a character in <code>t</code>, we <strong>decrement (-1)</strong> its bucket.</p>
                            <p>If the strings are exact anagrams, the additions and subtractions will perfectly cancel each other out, leaving every bucket strictly at <code>0</code>.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-amber-50 border border-amber-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-amber-900/80 leading-relaxed font-medium">
                            <h3 className="font-black text-amber-800 text-lg uppercase tracking-widest mb-4">Sorting Alternative (O(N log N))</h3>
                            <p>If you blank out on the frequency array, Sorting is always the fallback for anagram questions.</p>
                            <p>By definition, an anagram is just a string whose characters are scrambled. If you sort both strings alphabetically, the scrambling is undone. "nagaram" and "anagram" both sort to "aaagmnr".</p>
                            <p>Then you simply check if <code>sorted_s.equals(sorted_t)</code>. It's clean, robust, and handles Unicode naturally, but takes $O(N \log N)$ time.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-fuchsia-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-fuchsia-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering The First Question</h3>
                    <p className="text-sm text-fuchsia-50 leading-relaxed italic max-w-2xl font-mono">"Valid Anagram is incredibly common as an initial 'warm-up' question. The goal isn't just to solve it, but to show deep understanding of constraints, space complexity nuances, and edge cases."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-fuchsia-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><CheckCircle2 size={16}/></div>
                               1. State the Trivial Case
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "The very first check I'll make is on the lengths. If s and t have different lengths, they mathematically cannot be anagrams. Checking this first saves processing time and establishes good defensive programming habits."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><ListOrdered size={16}/></div>
                               2. Mention Sorting Briefly
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "A brute force approach would be to sort both strings and check if they are identical. That guarantees correctness but runs in O(N log N) time. I can optimize this to O(N) by mapping frequencies."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><Database size={16}/></div>
                               3. Defend O(1) Space
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "Because the problem specifies lowercase English letters, I don't need a heavy HashMap. I can allocate a fixed integer array of size 26. Since the size is strictly 26 regardless of how massive the strings get, the auxiliary space complexity is technically O(1)."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><Languages size={16}/></div>
                               4. Answer the Unicode Follow-Up
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "If the input contained Unicode characters, the array approach fails because we can't allocate an array for over 140,000 Unicode characters. In that case, I would swap back to using a standard HashMap to dynamically track character frequencies, trading O(1) space for O(N) space."
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[650px] 2xl:w-[800px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="bg-fuchsia-500 p-2 rounded-lg text-white shadow-lg shadow-fuchsia-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : st.isFail ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1">String S</label>
                              <input type="text" value={inputS} onChange={(e) => setInputS(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" />
                          </div>
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">String T</label>
                              <input type="text" value={inputT} onChange={(e) => setInputT(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-fuchsia-600 rounded-xl hover:bg-fuchsia-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {(!st.isSuccess && !st.isFail) && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <Keyboard size={16} />
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.isFail} className="px-12 py-6 bg-fuchsia-500 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(217,70,239,0.3)] hover:bg-fuchsia-600 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-fuchsia-400 shadow-fuchsia-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500 flex flex-col p-16 pt-32 gap-12 items-center min-w-max h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Row 1 & 2: Strings S and T */}
                           <div className="flex flex-col items-center gap-10 w-full">
                               {/* String S */}
                               <div className="flex flex-col items-center max-w-full scale-125 origin-center">
                                   <div className="text-xs font-black text-fuchsia-500 uppercase tracking-widest font-mono mb-4 bg-fuchsia-100 px-4 py-1 rounded-full shadow-sm">String S</div>
                                   <div className="flex gap-4 p-5 border-[3px] border-fuchsia-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-md flex-wrap justify-center">
                                       {(st.sArrSorted || st.sArr || []).length === 0 && <span className="text-slate-400 italic text-2xl px-10">empty</span>}
                                       {(st.sArrSorted || st.sArr || []).map((char, idx) => {
                                           const isHl = selectedOpId === 'sortingApproach' ? (st.checkingEq && st.failEqIdx === idx ? 'rose' : (st.checkingEq ? 'emerald' : 'slate')) : (st.i === idx ? 'fuchsia' : 'slate');
                                           return (
                                               <div key={`s-fs-${idx}`} className="relative scale-110 mx-2 mb-2 mt-2">
                                                   {st.i === idx && <PointerLabel label="i" color="fuchsia" position="top" />}
                                                   <CharNodeBlock char={char} idx={idx} themeColor={isHl !== 'slate' ? isHl : 'slate'} isTarget={st.i === idx || (st.checkingEq && st.failEqIdx === idx)} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

                               {/* String T */}
                               <div className="flex flex-col items-center max-w-full scale-125 origin-center mt-6">
                                   <div className="text-xs font-black text-sky-500 uppercase tracking-widest font-mono mb-4 bg-sky-100 px-4 py-1 rounded-full shadow-sm">String T</div>
                                   <div className="flex gap-4 p-5 border-[3px] border-sky-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-md flex-wrap justify-center">
                                       {(st.tArrSorted || st.tArr || []).length === 0 && <span className="text-slate-400 italic text-2xl px-10">empty</span>}
                                       {(st.tArrSorted || st.tArr || []).map((char, idx) => {
                                           const isHl = selectedOpId === 'sortingApproach' ? (st.checkingEq && st.failEqIdx === idx ? 'rose' : (st.checkingEq ? 'emerald' : 'slate')) : (st.i === idx ? 'sky' : 'slate');
                                           return (
                                               <div key={`t-fs-${idx}`} className="relative scale-110 mx-2 mb-2 mt-2">
                                                   {st.i === idx && <PointerLabel label="i" color="sky" position="bottom" />}
                                                   <CharNodeBlock char={char} idx={idx} themeColor={isHl !== 'slate' ? isHl : 'slate'} isTarget={st.i === idx || (st.checkingEq && st.failEqIdx === idx)} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           </div>

                           {/* Row 3: Frequency Array (Optimal Only) */}
                           {selectedOpId === 'frequencyArray' && st.count && (
                               <div className="flex flex-col items-center mt-16 w-full scale-125 origin-center">
                                   <div className="text-xs font-black text-emerald-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-emerald-100 px-4 py-1.5 rounded-full shadow-sm"><Database size={16}/> int[26] Count Array</div>
                                   <div className="flex flex-wrap gap-4 p-8 bg-slate-800 border-4 border-slate-700 rounded-[3rem] shadow-2xl justify-center items-center max-w-5xl">
                                        {st.count.map((val, idx) => {
                                            const charLabel = String.fromCharCode(idx + 97);
                                            
                                            // Determine highlighting
                                            const isInc = st.hlS === idx && st.isInc;
                                            const isDec = st.hlT === idx && st.isDec;
                                            const isChecking = st.checkIdx === idx;
                                            const isFail = isChecking && st.isFail;
                                            
                                            let color = 'slate';
                                            if (isFail) color = 'rose';
                                            else if (isChecking) color = 'amber';
                                            else if (isInc) color = 'fuchsia';
                                            else if (isDec) color = 'sky';
                                            else if (val === 0 && st.checkIdx !== undefined && st.checkIdx > idx) color = 'emerald'; 

                                            return (
                                                <div key={`count-fs-${idx}`} className="scale-125 mx-2 my-2">
                                                     <FreqBucketBlock char={charLabel} count={val} themeColor={color} isTarget={isInc || isDec || isChecking || isFail} />
                                                </div>
                                            )
                                        })}
                                   </div>
                               </div>
                           )}

                      </div>
                  </div>
                  {(st.isSuccess || st.isFail) && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSuccess ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isSuccess ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.isSuccess ? <PartyPopper size={48}/> : <XCircle size={48} />}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    {st.isSuccess ? 'VALID ANAGRAM' : 'INVALID ANAGRAM'}
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest ${st.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.isSuccess ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700 shadow-xl shadow-black/20">
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                   )}
              </div>
          </div>
      )}
    </div>
  );
}