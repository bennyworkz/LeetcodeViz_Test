import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, GitCompare, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, SplitSquareHorizontal
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Two Pointers (Optimal)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int compareVersion(String version1, String version2) {
    int i = 0, j = 0;
    int n1 = version1.length(), n2 = version2.length();
    
    while (i < n1 || j < n2) {
        int num1 = 0, num2 = 0;
        
        // Extract chunk from version1
        while (i < n1 && version1.charAt(i) != '.') {
            num1 = num1 * 10 + (version1.charAt(i) - '0');
            i++;
        }
        
        // Extract chunk from version2
        while (j < n2 && version2.charAt(j) != '.') {
            num2 = num2 * 10 + (version2.charAt(j) - '0');
            j++;
        }
        
        // Compare chunks
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
        
        // Skip the '.'
        i++;
        j++;
    }
    
    return 0;
}`,
    desc: "The O(1) space optimal approach. Instead of splitting the strings into arrays, we parse them on the fly. We use two pointers to read character by character, building the integer value for the current chunk. When we hit a dot '.', we compare the two chunks. If one string ends early, its missing chunks automatically evaluate to 0."
  },
  builtIn: {
    id: 'builtIn',
    title: '2. Built-in Split',
    icon: <SplitSquareHorizontal size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int compareVersion(String version1, String version2) {
    // Split by literal dot (requires escaping in Java regex)
    String[] v1 = version1.split("\\\\.");
    String[] v2 = version2.split("\\\\.");
    
    int maxLen = Math.max(v1.length, v2.length);
    
    for (int i = 0; i < maxLen; i++) {
        // Pad with 0 if we exceed the length of a version array
        int num1 = i < v1.length ? Integer.parseInt(v1[i]) : 0;
        int num2 = i < v2.length ? Integer.parseInt(v2[i]) : 0;
        
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    
    return 0;
}`,
    desc: "The pragmatic string manipulation approach. We split both strings by the '.' character. We iterate up to the maximum length of both resulting arrays. If we go out of bounds on a shorter array, we treat the missing chunk as 0. This approach is highly readable but consumes O(N) auxiliary space."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|break|new|length|char|String|charAt|split|Math|max|Integer|parseInt)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
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
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isVar = ['version1', 'version2', 'v1', 'v2', 'i', 'j', 'n1', 'n2', 'num1', 'num2', 'maxLen'].includes(part);
            const isMapCall = ['length', 'charAt', 'split', 'max', 'parseInt'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
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
  isDot?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, isDot = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        dot: { bg: 'bg-slate-200', border: 'border-slate-400', text: 'text-slate-500', index: 'bg-slate-300 text-slate-500' }
    };
    
    let activeTheme = themes[themeColor] || themes['slate'];
    if (isDot && themeColor === 'slate') {
        activeTheme = themes['dot'];
    }

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[40px] min-h-[48px] md:min-w-[48px] md:min-h-[56px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-lg md:text-xl px-1 py-1 bg-white/60 ${activeTheme.text}`}>
                    {displayVal}
                </div>
                {idx !== undefined && (
                    <div className={`flex w-full h-3 md:h-4 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[7px] md:text-[8px] font-black tracking-widest uppercase">{idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function CompareVersionNumbersVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('twoPointers');
  
  const [inputV1, setInputV1] = useState('1.01');
  const [inputV2, setInputV2] = useState('1.001.0');
  
  const [baseV1, setBaseV1] = useState('');
  const [baseV2, setBaseV2] = useState('');
  
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
    setBaseV1(inputV1.substring(0, 20).trim());
    setBaseV2(inputV2.substring(0, 20).trim());
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputV1, inputV2, selectedOpId]);

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
    if (!baseV1 || !baseV2) return [{ phase: 'Init', description: 'Enter valid version strings.', line: 0, state: { v1Arr: [], v2Arr: [] } }];

    let v1 = baseV1;
    let v2 = baseV2;
    let v1Arr = v1.split('');
    let v2Arr = v2.split('');
    let n1 = v1.length;
    let n2 = v2.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            v1Arr: [...v1Arr],
            v2Arr: [...v2Arr],
            n1, n2,
            ...st 
        } 
    });

    if (selectedOpId === 'twoPointers') {
        let i = 0, j = 0;
        add("Init Pointers", `int i = 0, j = 0; Start both pointers at the beginning.`, 2, { i, j });
        add("Length Checks", `n1 = ${n1}, n2 = ${n2}; Track boundaries.`, 3, { i, j });

        while (i < n1 || j < n2) {
            add("Loop Check", `while (i < ${n1} || j < ${n2}) -> Keep going if either string has characters left.`, 5, { i, j, checkingWhile: true });
            
            let num1 = 0;
            let num2 = 0;
            add("Init Chunks", `int num1 = 0, num2 = 0; Reset accumulators for the current chunk.`, 6, { i, j, num1, num2 });

            // Extract version1 chunk
            add("Extract V1 Loop", `while (i < ${n1} && version1.charAt(i) != '.') -> Extract chunk for V1.`, 9, { i, j, num1, num2, isV1Loop: true });
            while (i < n1 && v1[i] !== '.') {
                let digit = parseInt(v1[i]);
                let oldNum = num1;
                num1 = num1 * 10 + digit;
                add("V1 Build Integer", `Read '${digit}'. num1 = ${oldNum} * 10 + ${digit} = ${num1}.`, 10, { i, j, num1, num2, isV1Loop: true, hlI: true });
                i++;
            }
            if (i >= n1) {
                 add("V1 Extract End", `Reached end of V1 string. V1 chunk is ${num1}.`, 9, { i, j, num1, num2 });
            } else {
                 add("V1 Hit Dot", `Hit '.' in V1. Stop extracting. V1 chunk is ${num1}.`, 9, { i, j, num1, num2, hitDot1: true });
            }

            // Extract version2 chunk
            add("Extract V2 Loop", `while (j < ${n2} && version2.charAt(j) != '.') -> Extract chunk for V2.`, 15, { i, j, num1, num2, isV2Loop: true });
            while (j < n2 && v2[j] !== '.') {
                let digit = parseInt(v2[j]);
                let oldNum = num2;
                num2 = num2 * 10 + digit;
                add("V2 Build Integer", `Read '${digit}'. num2 = ${oldNum} * 10 + ${digit} = ${num2}.`, 16, { i, j, num1, num2, isV2Loop: true, hlJ: true });
                j++;
            }
            if (j >= n2) {
                 add("V2 Extract End", `Reached end of V2 string. V2 chunk is ${num2}.`, 15, { i, j, num1, num2 });
            } else {
                 add("V2 Hit Dot", `Hit '.' in V2. Stop extracting. V2 chunk is ${num2}.`, 15, { i, j, num1, num2, hitDot2: true });
            }

            // Compare
            add("Compare Chunks", `Compare chunks: V1 (${num1}) vs V2 (${num2}).`, 20, { i, j, num1, num2, comparing: true });
            
            if (num1 > num2) {
                add("V1 is Greater", `num1 (${num1}) > num2 (${num2}). Return 1.`, 20, { i, j, num1, num2, isV1Win: true });
                return steps;
            } else if (num1 < num2) {
                add("V2 is Greater", `num1 (${num1}) < num2 (${num2}). Return -1.`, 21, { i, j, num1, num2, isV2Win: true });
                return steps;
            }

            add("Chunks Equal", `Chunks are equal. Move to next segment.`, 24, { i, j, num1, num2, isEqual: true });
            
            i++;
            j++;
            add("Skip Dots", `i++, j++ -> Advance past the dots to start next chunks.`, 25, { i, j, num1, num2 });
        }

        add("Return Result", `Strings are identical in value. Return 0.`, 28, { isTie: true });

    } else if (selectedOpId === 'builtIn') {
        let splitV1 = v1.split('.');
        let splitV2 = v2.split('.');
        
        add("Split Arrays", `split("\\\\.") chunks the strings into arrays.`, 3, { splitV1: [...splitV1], splitV2: [...splitV2], phase: 'split' });
        
        let maxLen = Math.max(splitV1.length, splitV2.length);
        add("Find Max Length", `maxLen = Math.max(${splitV1.length}, ${splitV2.length}) = ${maxLen}.`, 6, { splitV1: [...splitV1], splitV2: [...splitV2], maxLen, phase: 'split' });

        for (let i = 0; i < maxLen; i++) {
            add("Loop Condition", `for (int i = ${i}; i < ${maxLen}; i++) -> Check segment ${i}.`, 8, { splitV1: [...splitV1], splitV2: [...splitV2], maxLen, i, phase: 'loop' });
            
            let num1 = i < splitV1.length ? parseInt(splitV1[i]) : 0;
            let num1Desc = i < splitV1.length ? `Integer.parseInt("${splitV1[i]}") = ${num1}` : `i >= v1.length. Pad with 0.`;
            add("Parse V1", `int num1 = ${num1Desc}`, 10, { splitV1: [...splitV1], splitV2: [...splitV2], maxLen, i, num1, hlI1: true, phase: 'loop' });

            let num2 = i < splitV2.length ? parseInt(splitV2[i]) : 0;
            let num2Desc = i < splitV2.length ? `Integer.parseInt("${splitV2[i]}") = ${num2}` : `i >= v2.length. Pad with 0.`;
            add("Parse V2", `int num2 = ${num2Desc}`, 11, { splitV1: [...splitV1], splitV2: [...splitV2], maxLen, i, num1, num2, hlI2: true, phase: 'loop' });

            add("Compare Chunks", `Compare parsed ints: ${num1} vs ${num2}.`, 13, { splitV1: [...splitV1], splitV2: [...splitV2], maxLen, i, num1, num2, comparing: true, phase: 'loop' });

            if (num1 > num2) {
                add("V1 is Greater", `${num1} > ${num2}. Return 1.`, 13, { splitV1: [...splitV1], splitV2: [...splitV2], maxLen, i, num1, num2, isV1Win: true, phase: 'loop' });
                return steps;
            }
            if (num1 < num2) {
                add("V2 is Greater", `${num1} < ${num2}. Return -1.`, 14, { splitV1: [...splitV1], splitV2: [...splitV2], maxLen, i, num1, num2, isV2Win: true, phase: 'loop' });
                return steps;
            }
            
            add("Chunks Equal", `Equal value. Continue loop.`, 14, { splitV1: [...splitV1], splitV2: [...splitV2], maxLen, i, num1, num2, isEqual: true, phase: 'loop' });
        }

        add("Return Result", `Checked all chunks. They are perfectly equivalent. return 0.`, 17, { splitV1: [...splitV1], splitV2: [...splitV2], maxLen, isTie: true, phase: 'loop' });
    }

    return steps;
  }, [baseV1, baseV2, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { v1Arr: [], v2Arr: [] } };
  const st = curStepData.state || { v1Arr: [], v2Arr: [] };
  const isLastStep = currentStep === trace.length - 1;

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <GitCompare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Compare Versions</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      LC 165 • Two Pointers
                  </span>
                  <span>•</span>
                  <span>String Parsing</span>
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
                <div className="flex items-center gap-3 text-emerald-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given two version strings, <code>version1</code> and <code>version2</code>, compare them.<br/><br/>
                  Versions consist of one or more revisions joined by a dot <code>'.'</code>. Each revision consists of digits and may contain leading zeros. Every revision contains at least one character. Revisions are 0-indexed from left to right, with the leftmost revision being revision 0, the next revision being revision 1, and so on.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Return Rules</h4>
                    <ul className="list-disc list-inside text-sm font-mono text-slate-600 space-y-2">
                        <li>If <code>version1 &lt; version2</code>, return <code>-1</code>.</li>
                        <li>If <code>version1 &gt; version2</code>, return <code>1</code>.</li>
                        <li>Otherwise, return <code>0</code>.</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-sky-400 font-black uppercase tracking-widest text-[10px]">Example 1 (Leading Zeros)</span>
                        <div><span className="text-white font-bold">Input:</span> version1 = "1.01", version2 = "1.001"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 0</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Ignoring leading zeroes, both "01" and "001" represent the same integer "1".</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px]">Example 2 (Missing Chunks)</span>
                        <div><span className="text-white font-bold">Input:</span> version1 = "1.0", version2 = "1.0.0.0"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 0</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: version1 does not specify revision 2 and 3, which means they are treated as "0".</div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-emerald-600 text-white border-emerald-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-emerald-200' : 'text-slate-400'}`}>{op.complexity}</div>
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
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme="emerald" />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-sky-500 pl-1 flex justify-between">
                                <span>Version 1</span>
                            </label>
                            <input 
                                type="text"
                                value={inputV1} 
                                onChange={(e) => setInputV1(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-500 pl-1 flex justify-between">
                                <span>Version 2</span>
                            </label>
                            <input 
                                type="text"
                                value={inputV2} 
                                onChange={(e) => setInputV2(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isV1Win || st.isV2Win || st.isTie} className={`px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isV1Win ? 'bg-sky-900 border-sky-800' : st.isV2Win ? 'bg-fuchsia-900 border-fuchsia-800' : st.isTie ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isV1Win ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-sky-400 flex items-center gap-3"><PartyPopper size={20}/> V1 &gt; V2 (Return 1)</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : st.isV2Win ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-fuchsia-400 flex items-center gap-3"><PartyPopper size={20}/> V1 &lt; V2 (Return -1)</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : st.isTie ? (
                        <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                           <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><CheckCircle2 size={20}/> V1 == V2 (Return 0)</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-emerald-500`}><Layout size={14}/> Compare Engine</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors hover:text-emerald-600`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors hover:text-emerald-600`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors hover:text-emerald-600`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-8 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Central Evaluation Display --- */}
                           {(st.num1 !== undefined || st.num2 !== undefined) && (
                               <div className="flex items-center gap-4 animate-in zoom-in border-4 border-slate-200 bg-white p-4 rounded-2xl shadow-xl min-w-max mb-2">
                                   <div className="flex flex-col items-center">
                                       <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">num1</span>
                                       <div className={`px-4 py-2 rounded-xl font-mono font-black text-2xl border-2 ${st.isV1Win ? 'bg-sky-100 border-sky-400 text-sky-800' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>{st.num1}</div>
                                   </div>

                                   <div className="flex flex-col items-center px-2">
                                       <span className="text-xs font-black text-slate-400 mb-4 uppercase">Vs</span>
                                       {st.comparing ? (
                                           st.num1 > st.num2 ? <span className="font-black text-sky-500 text-2xl">&gt;</span> :
                                           st.num1 < st.num2 ? <span className="font-black text-fuchsia-500 text-2xl">&lt;</span> :
                                           <span className="font-black text-emerald-500 text-2xl">==</span>
                                       ) : (
                                           <span className="font-black text-slate-300 text-xl">?</span>
                                       )}
                                   </div>

                                   <div className="flex flex-col items-center">
                                       <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest mb-1">num2</span>
                                       <div className={`px-4 py-2 rounded-xl font-mono font-black text-2xl border-2 ${st.isV2Win ? 'bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>{st.num2}</div>
                                   </div>
                               </div>
                           )}

                           {/* --- Version 1 Array --- */}
                           <div className="flex flex-col items-center w-full max-w-4xl">
                               <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest font-mono mb-2 bg-sky-50 px-3 py-1 rounded-md border border-sky-100 shadow-sm">Version 1 {selectedOpId === 'builtIn' && `(Length: ${st.splitV1?.length || 0})`}</div>
                               <div className="flex gap-2 p-3 border-2 border-sky-200 bg-sky-50/50 rounded-2xl shadow-md backdrop-blur-sm flex-wrap justify-center min-w-[200px] min-h-[80px] items-center">
                                   
                                   {/* Two Pointers Rendering */}
                                   {selectedOpId === 'twoPointers' && (st.v1Arr || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'sky'; isHl = true;
                                           labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                       }
                                       if (st.hlI && st.i === idx) color = 'emerald';
                                       if (st.hitDot1 && st.i === idx) color = 'amber';

                                       return (
                                           <div key={`v1-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDot={val === '.'} />
                                           </div>
                                       )
                                   })}

                                   {/* Built In Rendering */}
                                   {selectedOpId === 'builtIn' && st.splitV1 !== undefined && (st.splitV1 || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'sky'; isHl = true;
                                           labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                       }
                                       if (st.hlI1 && st.i === idx) color = 'emerald';

                                       return (
                                           <div key={`v1s-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isWord={true} />
                                           </div>
                                       )
                                   })}
                                   {/* Fake Zero Padding for Built-in Visual */}
                                   {selectedOpId === 'builtIn' && st.splitV1 && st.i >= st.splitV1.length && st.i < st.maxLen && (
                                       <div className="relative transition-all duration-300 scale-110 z-20 mx-2 animate-in zoom-in">
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center"><PointerLabel label="pad" color="amber" position="top" /></div>
                                            <NodeBlock val="0" idx={st.i} themeColor="amber" isTarget={true} isWord={true} />
                                       </div>
                                   )}
                               </div>
                           </div>

                           {/* --- Version 2 Array --- */}
                           <div className="flex flex-col items-center w-full max-w-4xl">
                               <div className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest font-mono mb-2 bg-fuchsia-50 px-3 py-1 rounded-md border border-fuchsia-100 shadow-sm">Version 2 {selectedOpId === 'builtIn' && `(Length: ${st.splitV2?.length || 0})`}</div>
                               <div className="flex gap-2 p-3 border-2 border-fuchsia-200 bg-fuchsia-50/50 rounded-2xl shadow-md backdrop-blur-sm flex-wrap justify-center w-full min-h-[80px] items-center">
                                   
                                   {/* Two Pointers Rendering */}
                                   {selectedOpId === 'twoPointers' && (st.v2Arr || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.j === idx) {
                                           color = 'fuchsia'; isHl = true;
                                           labels.push({ text: 'j', color: 'fuchsia', pos: 'bottom' });
                                       }
                                       if (st.hlJ && st.j === idx) color = 'emerald';
                                       if (st.hitDot2 && st.j === idx) color = 'amber';

                                       return (
                                           <div key={`v2-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDot={val === '.'} />
                                           </div>
                                       )
                                   })}

                                   {/* Built In Rendering */}
                                   {selectedOpId === 'builtIn' && st.splitV2 !== undefined && (st.splitV2 || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'fuchsia'; isHl = true;
                                           labels.push({ text: 'i', color: 'fuchsia', pos: 'bottom' });
                                       }
                                       if (st.hlI2 && st.i === idx) color = 'emerald';

                                       return (
                                           <div key={`v2s-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isWord={true} />
                                           </div>
                                       )
                                   })}
                                   {/* Fake Zero Padding for Built-in Visual */}
                                   {selectedOpId === 'builtIn' && st.splitV2 && st.i >= st.splitV2.length && st.i < st.maxLen && (
                                       <div className="relative transition-all duration-300 scale-110 z-20 mx-2 animate-in zoom-in">
                                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center"><PointerLabel label="pad" color="amber" position="bottom" /></div>
                                            <NodeBlock val="0" idx={st.i} themeColor="amber" isTarget={true} isWord={true} />
                                       </div>
                                   )}
                               </div>
                           </div>

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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">On-The-Fly Parsing</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>To avoid $O(N)$ auxiliary space (allocating new string arrays), we can read the string character by character.</p>
                            <p>For each chunk, we initialize an accumulator <code>num = 0</code>. We read digits one by one. For each digit, we multiply the accumulator by 10 and add the digit: <br/><code>num = num * 10 + (char - '0')</code></p>
                            <p>This automatically handles leading zeros! "001" becomes: <br/><code>0*10 + 0 = 0</code><br/><code>0*10 + 0 = 0</code><br/><code>0*10 + 1 = 1</code>.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">Handling Missing Chunks</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>The problem states: <em>"If a version number does not specify a revision at an index, treat it as 0."</em></p>
                            <p>In the array split method, we loop up to <code>max(v1.length, v2.length)</code>. If our loop index <code>i</code> is greater than the bounds of one of the arrays, we just assign the number to 0 instead of throwing an index out of bounds error.</p>
                            <p>In the Two Pointers method, our while loop continues as long as <em>either</em> pointer is valid. If a pointer exceeds the string length, the inner extraction loop skips completely, leaving its <code>num</code> safely at 0.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Regex Trap in Java</h3>
                            <p>A common mistake in Java when using the Split approach is writing: <code>version.split(".")</code>.</p>
                            <p>Because the <code>split()</code> function takes a Regular Expression, a single dot <code>.</code> means "match any character". It will shatter your entire string into empty pieces.</p>
                            <p>You must escape the dot with a backslash. And because backslashes themselves must be escaped in Java strings, the correct syntax is strictly: <code>version.split("\\\\.")</code>.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering The Edge Cases</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers use this problem to test your attention to detail. Handling different string lengths gracefully and knowing how to build integers from characters are key signals of a competent engineer."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SplitSquareHorizontal size={16}/></div>
                               1. Discuss the Split Method
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The most straightforward way is to split both strings by the '.' character. I'll iterate from 0 to the maximum length of the two arrays. For each index, I'll parse the integer. If the index is out of bounds for one of the arrays, I'll default its value to 0. Then I just compare the two integers."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ShieldAlert size={16}/></div>
                               2. Call Out the Regex Trap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "A quick note: if I'm writing this in Java, I must be careful to use '.split(\"\\\\.\")' with double backslashes, because the split method takes a regex, and a raw dot evaluates to 'any character'."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ArrowRightLeft size={16}/></div>
                               3. Optimize to O(1) Space
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "However, splitting the string creates an O(N) array allocation overhead. To achieve strictly O(1) space, I'll use Two Pointers. I'll read the strings character by character. I'll keep a running sum for the current chunk: 'sum = sum * 10 + (char - 0)'. When either pointer hits a dot, I compare the sums, reset them to 0, and advance the pointers. If one string finishes early, its inner loop just won't run, leaving its sum safely at 0."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-emerald-500 shadow-emerald-900/50`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme="emerald" />
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isV1Win ? 'bg-sky-900/40 border-sky-800' : st.isV2Win ? 'bg-fuchsia-900/40 border-fuchsia-800' : st.isTie ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-48 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-sky-500`}>Version 1</label>
                              <input type="text" value={inputV1} onChange={(e) => setInputV1(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-sky-500`} />
                          </div>
                          <div className="w-48 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-fuchsia-500`}>Version 2</label>
                              <input type="text" value={inputV2} onChange={(e) => setInputV2(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-fuchsia-500`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all hover:bg-emerald-50 hover:text-emerald-600`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all hover:bg-emerald-50 hover:text-emerald-600`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all hover:bg-emerald-50 hover:text-emerald-600`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {(!st.isV1Win && !st.isV2Win && !st.isTie) && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isV1Win || st.isV2Win || st.isTie} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Central Evaluation Display (FS) */}
                           {(st.num1 !== undefined || st.num2 !== undefined) && (
                               <div className="flex items-center gap-8 animate-in zoom-in border-[4px] border-slate-200 bg-white p-8 rounded-[2rem] shadow-2xl min-w-max mb-6">
                                   <div className="flex flex-col items-center">
                                       <span className="text-xs font-black text-sky-500 uppercase tracking-widest mb-2">num1</span>
                                       <div className={`px-8 py-4 rounded-2xl font-mono font-black text-5xl border-[4px] ${st.isV1Win ? 'bg-sky-100 border-sky-400 text-sky-800 shadow-[0_0_20px_rgba(56,189,248,0.5)]' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>{st.num1}</div>
                                   </div>

                                   <div className="flex flex-col items-center px-4">
                                       <span className="text-base font-black text-slate-400 mb-6 uppercase tracking-widest">Comparing</span>
                                       {st.comparing ? (
                                           st.num1 > st.num2 ? <span className="font-black text-sky-500 text-6xl">&gt;</span> :
                                           st.num1 < st.num2 ? <span className="font-black text-fuchsia-500 text-6xl">&lt;</span> :
                                           <span className="font-black text-emerald-500 text-6xl">==</span>
                                       ) : (
                                           <span className="font-black text-slate-300 text-5xl">?</span>
                                       )}
                                   </div>

                                   <div className="flex flex-col items-center">
                                       <span className="text-xs font-black text-fuchsia-500 uppercase tracking-widest mb-2">num2</span>
                                       <div className={`px-8 py-4 rounded-2xl font-mono font-black text-5xl border-[4px] ${st.isV2Win ? 'bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800 shadow-[0_0_20px_rgba(217,70,239,0.5)]' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>{st.num2}</div>
                                   </div>
                               </div>
                           )}

                           {/* Main String Visualizer V1 */}
                           <div className="flex flex-col items-center w-full max-w-6xl mt-4 scale-125 origin-top">
                               <div className="text-xs font-black text-sky-500 uppercase tracking-widest font-mono mb-4 bg-sky-50 px-6 py-2 rounded-full shadow-sm border border-sky-200">Version 1 {selectedOpId === 'builtIn' && `(Length: ${st.splitV1?.length || 0})`}</div>
                               <div className="flex gap-3 p-8 border-[4px] border-sky-200 bg-sky-50/50 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center w-full min-h-[140px] items-center">
                                   
                                   {selectedOpId === 'twoPointers' && st.v1Arr.map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'sky'; isHl = true;
                                           labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                       }
                                       if (st.hlI && st.i === idx) color = 'emerald';
                                       if (st.hitDot1 && st.i === idx) color = 'amber';

                                       return (
                                           <div key={`v1-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'scale-100 z-10 mx-1'}`}>
                                               <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDot={val === '.'} />
                                           </div>
                                       )
                                   })}

                                   {selectedOpId === 'builtIn' && st.splitV1 !== undefined && (st.splitV1 || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'sky'; isHl = true;
                                           labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                       }
                                       if (st.hlI1 && st.i === idx) color = 'emerald';

                                       return (
                                           <div key={`v1s-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'scale-100 z-10 mx-1'}`}>
                                               <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isWord={true} />
                                           </div>
                                       )
                                   })}
                                   {selectedOpId === 'builtIn' && st.splitV1 && st.i >= st.splitV1.length && st.i < st.maxLen && (
                                       <div className="relative transition-all duration-300 scale-110 z-20 mx-4 animate-in zoom-in">
                                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center"><PointerLabel label="pad" color="amber" position="top" /></div>
                                            <NodeBlock val="0" idx={st.i} themeColor="amber" isTarget={true} isWord={true} />
                                       </div>
                                   )}
                               </div>
                           </div>

                           {/* Main String Visualizer V2 */}
                           <div className="flex flex-col items-center w-full max-w-6xl mt-12 scale-125 origin-top">
                               <div className="text-xs font-black text-fuchsia-500 uppercase tracking-widest font-mono mb-4 bg-fuchsia-50 px-6 py-2 rounded-full shadow-sm border border-fuchsia-200">Version 2 {selectedOpId === 'builtIn' && `(Length: ${st.splitV2?.length || 0})`}</div>
                               <div className="flex gap-3 p-8 border-[4px] border-fuchsia-200 bg-fuchsia-50/50 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center w-full min-h-[140px] items-center">
                                   
                                   {selectedOpId === 'twoPointers' && st.v2Arr.map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.j === idx) {
                                           color = 'fuchsia'; isHl = true;
                                           labels.push({ text: 'j', color: 'fuchsia', pos: 'bottom' });
                                       }
                                       if (st.hlJ && st.j === idx) color = 'emerald';
                                       if (st.hitDot2 && st.j === idx) color = 'amber';

                                       return (
                                           <div key={`v2-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'scale-100 z-10 mx-1'}`}>
                                               <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDot={val === '.'} />
                                           </div>
                                       )
                                   })}

                                   {selectedOpId === 'builtIn' && st.splitV2 !== undefined && (st.splitV2 || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       if (st.i === idx) {
                                           color = 'fuchsia'; isHl = true;
                                           labels.push({ text: 'i', color: 'fuchsia', pos: 'bottom' });
                                       }
                                       if (st.hlI2 && st.i === idx) color = 'emerald';

                                       return (
                                           <div key={`v2s-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'scale-100 z-10 mx-1'}`}>
                                               <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isWord={true} />
                                           </div>
                                       )
                                   })}
                                   {selectedOpId === 'builtIn' && st.splitV2 && st.i >= st.splitV2.length && st.i < st.maxLen && (
                                       <div className="relative transition-all duration-300 scale-110 z-20 mx-4 animate-in zoom-in">
                                            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center"><PointerLabel label="pad" color="amber" position="bottom" /></div>
                                            <NodeBlock val="0" idx={st.i} themeColor="amber" isTarget={true} isWord={true} />
                                       </div>
                                   )}
                               </div>
                           </div>

                      </div>
                  </div>
                  {(st.isV1Win || st.isV2Win || st.isTie) && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isV1Win ? 'border-sky-500 shadow-sky-500/30' : st.isV2Win ? 'border-fuchsia-500 shadow-fuchsia-500/30' : 'border-emerald-500 shadow-emerald-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isV1Win ? 'bg-sky-500' : st.isV2Win ? 'bg-fuchsia-500' : 'bg-emerald-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isV1Win ? 'bg-sky-500/20 text-sky-500 ring-sky-500/10' : st.isV2Win ? 'bg-fuchsia-500/20 text-fuchsia-500 ring-fuchsia-500/10' : 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10'}`}>
                                    {st.isTie ? <CheckCircle2 size={48}/> : <PartyPopper size={48} />}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    {st.isV1Win ? 'VERSION 1 IS GREATER' : st.isV2Win ? 'VERSION 2 IS GREATER' : 'VERSIONS ARE EQUAL'}
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest ${st.isV1Win ? 'text-sky-400' : st.isV2Win ? 'text-fuchsia-400' : 'text-emerald-400'}`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.isV1Win ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-900/20' : st.isV2Win ? 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-900/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'}`}>
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