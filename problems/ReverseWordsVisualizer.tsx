import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, CaseSensitive, XCircle, ArrowDown, ArrowUp, Layout, SplitSquareHorizontal, Type
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Two Pointers (Manual)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public String reverseWords(String s) {
    StringBuilder res = new StringBuilder();
    int i = s.length() - 1;
    
    while (i >= 0) {
        // Skip trailing spaces
        while (i >= 0 && s.charAt(i) == ' ') i--;
        
        if (i < 0) break;
        
        int j = i; // Mark the end of the word
        
        // Find the start of the word
        while (i >= 0 && s.charAt(i) != ' ') i--;
        
        if (res.length() > 0) res.append(" ");
        
        // Append the extracted word
        res.append(s.substring(i + 1, j + 1));
    }
    
    return res.toString();
}`,
    desc: "The algorithmic approach. We scan the string from right to left using two pointers. Pointer 'i' skips spaces to find the end of a word ('j'). Then 'i' continues left to find the start of the word. Once bounded, we append the substring to our StringBuilder. This avoids creating massive intermediate string arrays."
  },
  builtIn: {
    id: 'builtIn',
    title: '2. Built-in Split & Reverse',
    icon: <SplitSquareHorizontal size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public String reverseWords(String s) {
    // Trim leading/trailing, then split by 1 or more spaces
    String[] words = s.trim().split("\\\\s+");
    StringBuilder res = new StringBuilder();
    
    for (int i = words.length - 1; i >= 0; i--) {
        res.append(words[i]);
        if (i > 0) {
            res.append(" ");
        }
    }
    
    return res.toString();
}`,
    desc: "The pragmatic, real-world approach. We use String.trim() to clean the edges, and split(\"\\\\s+\") with a regex to perfectly chunk the string by any number of spaces. Then we simply iterate the resulting array backward and join them."
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
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'cyan' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|break|new|length|char|String|StringBuilder|charAt|append|substring|toString|trim|split)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!])/g).filter(Boolean);
  
  const activeStyles = theme === 'cyan' 
    ? { bg: `bg-cyan-500/20`, border: `border-cyan-400`, text: `text-cyan-300` }
    : { bg: `bg-indigo-500/20`, border: `border-indigo-400`, text: `text-indigo-300` };

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? activeStyles.text + ' font-bold' : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new', 'char'].includes(part);
            const isObject = ['String', 'StringBuilder'].includes(part);
            const isVar = ['s', 'res', 'i', 'j', 'words'].includes(part);
            const isMapCall = ['length', 'charAt', 'append', 'substring', 'toString', 'trim', 'split'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-cyan-200';
            else if (isMapCall) className = 'text-fuchsia-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (part.startsWith("'") || part.startsWith('"') || (!isNaN(parseInt(part.trim())) && part.trim() !== '')) className = 'text-emerald-400';

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
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`}>
            <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface NodeBlockProps {
  val: string | null;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
  isSpace?: boolean;
  isWord?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, isSpace = false, isWord = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        space: { bg: 'bg-slate-100/50', border: 'border-slate-200 border-dashed', text: 'text-slate-400', index: 'bg-slate-100/50 text-slate-400' }
    };
    
    let activeTheme = themes[themeColor] || themes['slate'];
    if (isSpace && themeColor === 'slate') {
        activeTheme = themes['space'];
    }

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300').replace(' border-dashed', '')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === ' ' ? '␣' : val;
    const isWordClass = isWord ? 'px-4 min-w-[80px]' : 'min-w-[44px] md:min-w-[56px]';

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${isWordClass} min-h-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl md:text-2xl px-1 py-1 bg-white/60 ${activeTheme.text}`}>
                    {displayVal}
                </div>
                {idx !== undefined && (
                    <div className={`flex w-full h-4 md:h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">{idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function ReverseWordsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('twoPointers');
  
  const [inputString, setInputString] = useState('  hello world  ');
  const [baseString, setBaseString] = useState('');
  
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
    // Keep reasonable length for visualization performance
    setBaseString(inputString.substring(0, 30));
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputString, selectedOpId]);

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
    if (!baseString || baseString.length === 0) return [{ phase: 'Init', description: 'Enter a valid string.', line: 0, state: { sArr: [], res: [] } }];

    let s = baseString;
    let sArr = s.split('');
    let n = s.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            sArr: [...sArr],
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'twoPointers') {
        let res = [];
        let i = n - 1;
        
        add("Init Data", `StringBuilder res = new StringBuilder();\nint i = s.length() - 1;`, 2, { i, res: [...res] });

        while (i >= 0) {
            add("Outer Loop", `while (i >= 0) -> i is ${i}`, 5, { i, res: [...res] });
            
            // Skip trailing spaces
            add("Check Space (End)", `while (i >= 0 && s.charAt(i) == ' ')`, 7, { i, res: [...res], checkingI: true });
            while (i >= 0 && s[i] === ' ') {
                add("Skip Space", `Found space at ${i}. Decrement i--.`, 7, { i, res: [...res], isSpaceSkip: true });
                i--;
            }

            add("Bounds Check", `if (i < 0) break; -> Is i (${i}) < 0?`, 9, { i, res: [...res] });
            if (i < 0) {
                add("Break Loop", `i < 0. All words extracted.`, 9, { i, res: [...res], broke: true });
                break;
            }

            let j = i;
            add("Mark End of Word", `int j = i; -> Found non-space. j=${j} marks the end of the current word.`, 11, { i, j, res: [...res] });

            // Find start of the word
            add("Check Char (Start)", `while (i >= 0 && s.charAt(i) != ' ')`, 14, { i, j, res: [...res], checkingI: true });
            while (i >= 0 && s[i] !== ' ') {
                add("Scan Word", `Found char '${s[i]}' at ${i}. Decrement i--.`, 14, { i, j, res: [...res], isWordScan: true });
                i--;
            }

            add("Space Check", `if (res.length() > 0) res.append(" ");`, 16, { i, j, res: [...res] });
            if (res.length > 0) {
                res.push(" ");
                add("Append Space", `Not the first word. Appending a space to the builder.`, 16, { i, j, res: [...res], justAppended: " " });
            }

            let word = s.substring(i + 1, j + 1);
            res.push(word);
            add("Append Substring", `res.append(s.substring(${i + 1}, ${j + 1})); -> Extracted "${word}".`, 19, { i, j, res: [...res], hlWordRange: [i + 1, j], justAppended: word });
        }

        add("Return Result", `return res.toString(); Finished processing.`, 22, { res: [...res], isSuccess: true });

    } else if (selectedOpId === 'builtIn') {
        
        let trimmed = s.trim();
        add("Trim Input", `String.trim() removes leading/trailing spaces. -> "${trimmed}"`, 3, { sArr: trimmed.split(''), phase: 'trim' });
        
        let words = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
        add("Regex Split", `String.split("\\\\s+") cuts the string at every group of spaces.`, 3, { words: [...words], phase: 'split' });
        
        let res = [];
        add("Init Builder", `StringBuilder res = new StringBuilder();`, 4, { words: [...words], res: [...res], phase: 'split' });

        for (let i = words.length - 1; i >= 0; i--) {
            add("Loop Words", `for (int i = ${i}; i >= 0; i--) -> Process words[${i}]: "${words[i]}"`, 6, { words: [...words], i, res: [...res], phase: 'loop' });
            
            res.push(words[i]);
            add("Append Word", `res.append("${words[i]}");`, 7, { words: [...words], i, res: [...res], phase: 'loop', justAppended: words[i] });
            
            add("Check Last", `if (i > 0) -> Is ${i} > 0?`, 8, { words: [...words], i, res: [...res], phase: 'loop' });
            if (i > 0) {
                res.push(" ");
                add("Append Space", `res.append(" "); Add separator space.`, 9, { words: [...words], i, res: [...res], phase: 'loop', justAppended: " " });
            }
        }

        add("Return Result", `return res.toString();`, 13, { words: [...words], res: [...res], phase: 'loop', isSuccess: true });
    }

    return steps;
  }, [baseString, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { sArr: [] } };
  const st = curStepData.state || { sArr: [] };
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'twoPointers' ? 'cyan' : 'indigo';

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'cyan' ? 'bg-cyan-600' : 'bg-indigo-600'}`}>
                <Type className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Reverse Words</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'cyan' ? 'text-cyan-600 bg-cyan-50' : 'text-indigo-600 bg-indigo-50'}`}>
                      LC 151 • Strings & Pointers
                  </span>
                  <span>•</span>
                  <span>Multiple Spaces</span>
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
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'cyan' ? 'text-cyan-600' : 'text-indigo-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given an input string <code>s</code>, reverse the order of the <b>words</b>.<br/><br/>
                  A <b>word</b> is defined as a sequence of non-space characters. The words in <code>s</code> will be separated by at least one space.<br/>
                  Return a string of the words in reverse order concatenated by a single space.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border-l-4 border-cyan-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-cyan-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s = "the sky is blue"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "blue is sky the"</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2 (Trap)</span>
                        <div><span className="text-white font-bold">Input:</span> s = "&nbsp;&nbsp;hello world&nbsp;&nbsp;"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "world hello"</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Your reversed string should not contain leading or trailing spaces.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 3 (Trap)</span>
                        <div><span className="text-white font-bold">Input:</span> s = "a good&nbsp;&nbsp;&nbsp;example"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> "example good a"</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Reduce multiple spaces between two words to a single space.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Follow-up</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= s.length &lt;= 10<sup>4</sup></li>
                        <li><code>s</code> contains English letters, digits, and spaces <code>' '</code>.</li>
                        <li>There is at least one word in <code>s</code>.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'cyan' ? 'text-cyan-600' : 'text-indigo-600'}`}>Follow-up: If the string data type is mutable in your language, can you solve it in-place with O(1) extra space?</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'cyan' ? 'bg-cyan-600 text-white border-cyan-600 scale-[1.02]' : 'bg-indigo-600 text-white border-indigo-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'cyan' ? 'text-cyan-200' : 'text-indigo-200') : 'text-slate-400'}`}>{op.complexity}</div>
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
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'cyan' ? 'text-cyan-600' : 'text-indigo-600'}`}>
                                <span>Input String 's'</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'cyan' ? 'focus:ring-cyan-500' : 'focus:ring-indigo-500'}`} 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'cyan' ? 'bg-cyan-600 shadow-cyan-200 hover:bg-cyan-700' : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Reversal Complete</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'cyan' ? 'text-cyan-500' : 'text-indigo-500'}`}><Layout size={14}/> String & Pointers</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'cyan' ? 'hover:text-cyan-600' : 'hover:text-indigo-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'cyan' ? 'hover:text-cyan-600' : 'hover:text-indigo-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'cyan' ? 'hover:text-cyan-600' : 'hover:text-indigo-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-10 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Variables */}
                           {selectedOpId === 'twoPointers' && (
                               <div className="flex gap-4 min-w-max h-[70px]">
                                    {st.i !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-2 border-sky-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                            <span className="text-[9px] uppercase tracking-widest font-black text-sky-500">Ptr i</span>
                                            <span className="font-mono font-black text-xl text-sky-600">{st.i}</span>
                                        </div>
                                    )}
                                    {st.j !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-2 border-fuchsia-200 p-2 rounded-xl min-w-[80px] shadow-sm animate-in slide-in-from-left-4">
                                            <span className="text-[9px] uppercase tracking-widest font-black text-fuchsia-500">Ptr j</span>
                                            <span className="font-mono font-black text-xl text-fuchsia-600">{st.j}</span>
                                        </div>
                                    )}
                               </div>
                           )}

                           {selectedOpId === 'builtIn' && (
                               <div className="flex gap-4 min-w-max h-[70px]">
                                    {st.i !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-2 border-indigo-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                            <span className="text-[9px] uppercase tracking-widest font-black text-indigo-500">Loop i</span>
                                            <span className="font-mono font-black text-xl text-indigo-600">{st.i}</span>
                                        </div>
                                    )}
                               </div>
                           )}

                           {/* Main String Visualizer */}
                           <div className="flex flex-col items-center w-full max-w-4xl mt-2">
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center gap-1">Original String (Chars/Words)</div>
                               <div className="flex gap-2 p-4 border-2 border-slate-200 bg-white/90 rounded-2xl shadow-xl backdrop-blur-sm flex-wrap justify-center w-full min-h-[100px]">
                                   {(selectedOpId === 'builtIn' && st.phase === 'split' ? st.words : st.sArr).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   
                                   {selectedOpId === 'twoPointers' && st.sArr.map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'sky'; isHl = true;
                                           labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                                       }
                                       if (st.j === idx) {
                                           color = 'fuchsia'; isHl = true;
                                           labels.push({ text: 'j', color: 'fuchsia', pos: 'top' });
                                       }
                                       if (st.hlI && st.i === idx) color = 'amber';
                                       
                                       // Highlight the extracted word range
                                       if (st.hlRange && idx >= st.hlRange[0] && idx <= st.hlRange[1]) {
                                           color = 'emerald';
                                       }

                                       return (
                                           <div key={`char-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isSpace={val === ' '} />
                                           </div>
                                       )
                                   })}

                                   {selectedOpId === 'builtIn' && (st.phase === 'split' || st.phase === 'loop') && st.words.map((word, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'indigo'; isHl = true;
                                           labels.push({ text: 'i', color: 'indigo', pos: 'top' });
                                       }

                                       return (
                                           <div key={`word-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <NodeBlock val={word} idx={idx} themeColor={color} isTarget={isHl} isWord={true} />
                                           </div>
                                       )
                                   })}

                                   {selectedOpId === 'builtIn' && (!st.phase || st.phase === 'trim') && st.sArr.map((val, idx) => {
                                       return (
                                           <div key={`char-${idx}`} className={`relative transition-all duration-300 scale-100 z-10 m-1`}>
                                               <NodeBlock val={val} idx={idx} themeColor={'slate'} isSpace={val === ' '} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* StringBuilder Output */}
                           {st.res && (
                               <div className="flex flex-col items-center w-full max-w-4xl mt-4">
                                   <div className={`text-[10px] font-black uppercase tracking-widest font-mono mb-2 flex items-center gap-1 ${themeColor === 'cyan' ? 'text-cyan-600' : 'text-indigo-600'}`}><Code2 size={12}/> StringBuilder (res)</div>
                                   <div className={`flex gap-1 p-3 border-2 bg-white/80 rounded-2xl shadow-md min-w-[200px] min-h-[60px] flex-wrap justify-start w-full ${themeColor === 'cyan' ? 'border-cyan-200' : 'border-indigo-200'}`}>
                                       {st.res.length === 0 && <span className="text-slate-400 italic text-xs mt-2 mx-auto">Empty</span>}
                                       {st.res.map((val, idx) => {
                                           const isJustAdded = idx === st.res.length - 1 && (st.appendingWord === val || st.appendingSpace || st.justAppended === val);
                                           
                                           let colorClass = 'text-slate-800 border-slate-300 bg-white';
                                           if (isJustAdded) colorClass = 'text-emerald-700 border-emerald-400 bg-emerald-50 scale-110 shadow-md z-20 mx-1';
                                           if (val === ' ') colorClass = 'text-slate-300 border-slate-200 bg-slate-50 border-dashed';

                                           return (
                                               <div key={`res-${idx}`} className={`min-w-[40px] h-10 flex items-center justify-center border-2 font-mono font-bold text-lg rounded-lg transition-all duration-300 px-2 ${colorClass}`}>
                                                   {val === ' ' ? '␣' : val}
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><ArrowRightLeft size={120}/></div>
                        <h3 className="font-black text-cyan-400 text-lg uppercase tracking-widest mb-6">The Two Pointers (Manual) Strategy</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>To reverse the words without using split() or reversing the whole string first, we can scan from right to left.</p>
                            <p>Pointer <code>i</code> starts at the end. We skip any trailing spaces. When we hit a letter, we mark it with <code>j = i</code> (this is the end of our word).</p>
                            <p>Then <code>i</code> continues moving left until it hits a space. Now, <code>i+1</code> to <code>j</code> represents a perfectly isolated word!</p>
                            <p>We extract this substring and append it to our StringBuilder, managing the single spaces manually.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-indigo-700 text-lg uppercase tracking-widest mb-6">The Regex Split Strategy</h3>
                        <div className="space-y-4 text-sm text-indigo-900/80 leading-relaxed font-medium">
                            <p>In most modern languages, standard library functions handle edge cases cleanly and are highly optimized.</p>
                            <p>Using <code>s.trim()</code> perfectly cleans the leading and trailing edges of the string.</p>
                            <p>Using <code>s.split("\\s+")</code> uses a Regular Expression where <code>\s</code> means "whitespace character" and <code>+</code> means "one or more". This perfectly chunks the string into an array of words, completely ignoring the complex spacing.</p>
                            <p>Finally, we just iterate the array backwards and build the string.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-amber-50 border border-amber-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-amber-900/80 leading-relaxed font-medium">
                            <h3 className="font-black text-amber-800 text-lg uppercase tracking-widest mb-4">Java String Immutability (The O(1) Space Trap)</h3>
                            <p>Can you solve this in exactly $O(1)$ space? <strong>In Java and Python, NO.</strong></p>
                            <p>Strings in Java are immutable. Any modification forces the creation of a new String. Even if you use a <code>StringBuilder</code>, it is dynamically allocating an $O(N)$ sized char array under the hood.</p>
                            <p>In languages with mutable strings like C or C++, you CAN do it in $O(1)$ space. The famous algorithm is: 1) Reverse the entire string in place. 2) Reverse each individual word in place. 3) Shift characters to clean up the extra spaces.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-cyan-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-cyan-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Defending The Language</h3>
                    <p className="text-sm text-cyan-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers use this problem to see if you understand how Strings actually work in memory. The 'Follow-up' question about O(1) space is a trap for Java/Python developers."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-cyan-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-cyan-800 text-sm uppercase tracking-widest">
                               <div className="bg-cyan-200 p-2 rounded-lg text-cyan-700"><SplitSquareHorizontal size={16}/></div>
                               1. The Pragmatic Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-cyan-100 shadow-inner flex-1">
                                "In a production environment, I would solve this using built-in methods for readability. I'd trim the string and split it using the '\\s+' regex to handle multiple spaces. Then, I can iterate the resulting array backward and construct the final string using a StringBuilder."
                            </p>
                        </div>

                        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-cyan-800 text-sm uppercase tracking-widest">
                               <div className="bg-cyan-200 p-2 rounded-lg text-cyan-700"><ArrowRightLeft size={16}/></div>
                               2. The Algorithmic Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-cyan-100 shadow-inner flex-1">
                                "If we want to avoid allocating an intermediate array of strings, I can use two pointers and scan from right to left. I'll skip trailing spaces, identify the bounds of a word, and extract it using substring. This still takes O(N) time and O(N) space for the StringBuilder."
                            </p>
                        </div>

                        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-cyan-800 text-sm uppercase tracking-widest">
                               <div className="bg-cyan-200 p-2 rounded-lg text-cyan-700"><ShieldAlert size={16}/></div>
                               3. The O(1) Space Trap (Crucial)
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-cyan-100 shadow-inner flex-1">
                                "If asked about solving this in strictly O(1) space, I have to point out that Strings in Java are immutable. Any character manipulation requires converting the string to a char array, which inherently takes O(N) space. If the input WAS a mutable char array (like in C++), I could achieve O(1) space by first reversing the entire array in-place, then reversing each individual word in-place, and finally shifting characters to trim excess spaces."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'cyan' ? 'bg-cyan-500 shadow-cyan-900/50' : 'bg-indigo-500 shadow-indigo-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'cyan' ? 'bg-cyan-600 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'cyan' ? 'text-cyan-600' : 'text-indigo-600'}`}>Input String 's'</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'cyan' ? 'focus:ring-cyan-500' : 'focus:ring-indigo-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'cyan' ? 'hover:bg-cyan-50 hover:text-cyan-600' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'cyan' ? 'hover:bg-cyan-50 hover:text-cyan-600' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'cyan' ? 'hover:bg-cyan-50 hover:text-cyan-600' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'cyan' ? 'bg-cyan-600 hover:bg-cyan-700 border-cyan-400 shadow-cyan-900/30' : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-400 shadow-indigo-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* State Variables Row */}
                           {selectedOpId === 'twoPointers' && (
                               <div className="flex gap-8 origin-center mb-8 z-30">
                                    {st.i !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-[3px] border-sky-200 p-6 rounded-2xl min-w-[150px] shadow-xl">
                                            <span className="text-xs uppercase tracking-widest font-black text-sky-500">Ptr i</span>
                                            <span className="font-mono font-black text-5xl text-sky-600 mt-2">{st.i}</span>
                                        </div>
                                    )}
                                    {st.j !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-[3px] border-fuchsia-200 p-6 rounded-2xl min-w-[150px] shadow-xl animate-in slide-in-from-left-6">
                                            <span className="text-xs uppercase tracking-widest font-black text-fuchsia-500">Ptr j</span>
                                            <span className="font-mono font-black text-5xl text-fuchsia-600 mt-2">{st.j}</span>
                                        </div>
                                    )}
                               </div>
                           )}

                           {selectedOpId === 'builtIn' && (
                               <div className="flex gap-8 origin-center mb-8 z-30">
                                    {st.i !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-[3px] border-indigo-200 p-6 rounded-2xl min-w-[150px] shadow-xl">
                                            <span className="text-xs uppercase tracking-widest font-black text-indigo-500">Loop i</span>
                                            <span className="font-mono font-black text-5xl text-indigo-600 mt-2">{st.i}</span>
                                        </div>
                                    )}
                                </div>
                           )}

                           {/* Main String Visualizer */}
                           <div className="flex flex-col items-center w-full max-w-6xl mt-4 scale-125 origin-top">
                               <div className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono mb-4 bg-white/50 px-4 py-1.5 rounded-full shadow-sm">Original String (Chars/Words)</div>
                               <div className="flex gap-3 p-8 border-[4px] border-slate-200 bg-white/90 rounded-[2rem] shadow-2xl backdrop-blur-md flex-wrap justify-center w-full">
                                   {(selectedOpId === 'builtIn' && st.phase === 'split' ? st.words : st.sArr).length === 0 && <span className="text-slate-400 italic text-3xl p-4">empty</span>}
                                   
                                   {selectedOpId === 'twoPointers' && st.sArr.map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'sky'; isHl = true;
                                           labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                                       }
                                       if (st.j === idx) {
                                           color = 'fuchsia'; isHl = true;
                                           labels.push({ text: 'j', color: 'fuchsia', pos: 'top' });
                                       }
                                       if (st.hlI && st.i === idx) color = 'amber';
                                       
                                       if (st.hlRange && idx >= st.hlRange[0] && idx <= st.hlRange[1]) {
                                           color = 'emerald';
                                       }

                                       return (
                                           <div key={`char-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'scale-100 z-10 mx-1'} my-6`}>
                                               <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isSpace={val === ' '} />
                                           </div>
                                       )
                                   })}

                                   {selectedOpId === 'builtIn' && (st.phase === 'split' || st.phase === 'loop') && st.words.map((word, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'indigo'; isHl = true;
                                           labels.push({ text: 'i', color: 'indigo', pos: 'top' });
                                       }

                                       return (
                                           <div key={`word-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'scale-100 z-10 mx-2'} my-6`}>
                                               <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <NodeBlock val={word} idx={idx} themeColor={color} isTarget={isHl} isWord={true} />
                                           </div>
                                       )
                                   })}

                                   {selectedOpId === 'builtIn' && (!st.phase || st.phase === 'trim') && st.sArr.map((val, idx) => {
                                       return (
                                           <div key={`char-fs-${idx}`} className={`relative transition-all duration-300 scale-100 z-10 mx-1 my-2`}>
                                               <NodeBlock val={val} idx={idx} themeColor={'slate'} isSpace={val === ' '} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Secondary Arrays (Filter Reverse) Fullscreen */}
                           {selectedOpId === 'builtIn' && (st.phase === 'loop' || st.res !== undefined) && (
                               <div className="flex flex-col items-center w-full max-w-5xl mt-12 scale-125 origin-top">
                                   <div className={`text-xs font-black uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-indigo-100 px-6 py-2 rounded-full shadow-sm text-indigo-600`}><Code2 size={16} className="-mt-1"/> StringBuilder (res)</div>
                                   <div className={`flex gap-3 p-6 border-[3px] bg-white/90 rounded-[2rem] shadow-2xl min-w-[300px] min-h-[120px] flex-wrap justify-start w-full border-indigo-200`}>
                                       {st.res.length === 0 && <span className="text-slate-400 italic text-2xl mt-4 mx-auto">Empty</span>}
                                       {st.res.map((val, idx) => {
                                           const isJustAdded = idx === st.res.length - 1 && (st.appendingWord === val || st.appendingSpace || st.justAppended === val);
                                           
                                           let colorClass = 'text-slate-800 border-slate-300 bg-white';
                                           if (isJustAdded) colorClass = 'text-emerald-700 border-emerald-400 bg-emerald-50 scale-110 shadow-xl z-20 mx-2';
                                           if (val === ' ') colorClass = 'text-slate-300 border-slate-200 bg-slate-50 border-dashed';

                                           return (
                                               <div key={`res-fs-${idx}`} className={`min-w-[60px] h-16 flex items-center justify-center border-[3px] font-mono font-black text-3xl rounded-xl transition-all duration-300 px-4 ${colorClass}`}>
                                                   {val === ' ' ? '␣' : val}
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           )}

                           {selectedOpId === 'twoPointers' && st.res !== undefined && (
                               <div className="flex flex-col items-center w-full max-w-5xl mt-12 scale-125 origin-top">
                                   <div className={`text-xs font-black uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-cyan-100 px-6 py-2 rounded-full shadow-sm text-cyan-600`}><Code2 size={16} className="-mt-1"/> StringBuilder (res)</div>
                                   <div className={`flex gap-3 p-6 border-[3px] bg-white/90 rounded-[2rem] shadow-2xl min-w-[300px] min-h-[120px] flex-wrap justify-start w-full border-cyan-200`}>
                                       {st.res.length === 0 && <span className="text-slate-400 italic text-2xl mt-4 mx-auto">Empty</span>}
                                       {st.res.map((val, idx) => {
                                           const isJustAdded = idx === st.res.length - 1 && (st.appendingWord === val || st.appendingSpace || st.justAppended === val);
                                           
                                           let colorClass = 'text-slate-800 border-slate-300 bg-white';
                                           if (isJustAdded) colorClass = 'text-emerald-700 border-emerald-400 bg-emerald-50 scale-110 shadow-xl z-20 mx-2';
                                           if (val === ' ') colorClass = 'text-slate-300 border-slate-200 bg-slate-50 border-dashed';

                                           return (
                                               <div key={`res-fs-${idx}`} className={`min-w-[60px] h-16 flex items-center justify-center border-[3px] font-mono font-black text-3xl rounded-xl transition-all duration-300 px-4 ${colorClass}`}>
                                                   {val === ' ' ? '␣' : val}
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           )}

                      </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-emerald-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    REVERSAL COMPLETE
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest text-emerald-400`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20`}>
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