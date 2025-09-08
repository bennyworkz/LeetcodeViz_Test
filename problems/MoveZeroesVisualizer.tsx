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
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, AlignLeft, XSquare, ArrowRightLeft, TrendingUp, SearchCode, Languages, Link2, Puzzle, Users, BoxSelect, Maximize2, MoveRight
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Single Pass Swap (Optimal)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public void moveZeroes(int[] nums) {
    int left = 0;
    
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] != 0) {
            // Swap non-zero element to the 'left' insert position
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            
            left++;
        }
    }
}`,
    desc: "The most optimal O(1) space approach. We maintain two pointers: 'left' points to where the next non-zero element should go, and 'right' explores the array. Whenever 'right' finds a non-zero, we swap it with 'left' and increment 'left'. This elegantly pushes all zeros to the end in a single pass."
  },
  twoPasses: {
    id: 'twoPasses',
    title: '2. Two Passes (Overwrite)',
    icon: <MoveRight size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public void moveZeroes(int[] nums) {
    int insertPos = 0;
    
    // Pass 1: Overwrite the front of the array with non-zeros
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            nums[insertPos] = nums[i];
            insertPos++;
        }
    }
    
    // Pass 2: Fill the remaining positions with zeros
    while (insertPos < nums.length) {
        nums[insertPos] = 0;
        insertPos++;
    }
}`,
    desc: "A very intuitive O(1) space approach. In the first pass, we shift all non-zero elements to the front of the array by overwriting. Once we finish, our 'insertPos' tells us exactly where the zeros should begin. In the second pass, we simply fill the rest of the array with 0s."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|boolean|int|return|if|else|for|while|continue|new|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!])/g).filter(Boolean);
  const activeStyles = { bg: `bg-fuchsia-500/20`, border: `border-fuchsia-400`, text: `text-fuchsia-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-fuchsia-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'void', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new'].includes(part);
            const isVar = ['nums', 'left', 'right', 'temp', 'insertPos', 'i'].includes(part);
            const isMapCall = ['length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isVar) className = 'text-fuchsia-200';
            else if (isMapCall) className = 'text-sky-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (!isNaN(parseInt(part.trim())) && part.trim() !== '') className = 'text-emerald-400';

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

interface NodeBlockProps {
  val: string | number | null;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget }) => {
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

    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[64px] min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl px-2 py-2 bg-white/60 ${activeTheme.text}`}>
                    {displayVal}
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

// --- Main Application ---

export default function MoveZeroesVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('twoPointers');
  
  const [inputString, setInputString] = useState('0, 1, 0, 3, 12');
  const [baseArray, setBaseArray] = useState([]);
  
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

  const parseInput = (str) => {
      const arr = str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      return arr.slice(0, 20); 
  };

  useEffect(() => {
    const arr = parseInput(inputString);
    setBaseArray(arr);
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
    if (!baseArray || baseArray.length === 0) return [{ phase: 'Init', description: 'Enter an array of numbers.', line: 0, state: { nums: [] } }];

    let nums = [...baseArray];
    let n = nums.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            nums: [...nums],
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'twoPointers') {
        let left = 0;
        add("Init Pointers", `int left = 0; This pointer tracks where the next non-zero element should be placed.`, 2, { left });

        for (let right = 0; right < n; right++) {
            add("Loop Start", `for (int right = ${right}...); The 'right' pointer explores the array looking for non-zero elements.`, 4, { left, right });
            
            add("Check Zero", `if (nums[right] != 0) -> Is nums[${right}] (${nums[right]}) not zero?`, 5, { left, right, checkZero: true });

            if (nums[right] !== 0) {
                add("Swap Prepare", `Yes, ${nums[right]} is not zero. We must swap it to the 'left' insert position.`, 5, { left, right, isSwapping: true });
                
                // Track state BEFORE the swap
                let oldLeftVal = nums[left];
                let oldRightVal = nums[right];
                
                add("Swap Execution", `Swap nums[${left}] (${oldLeftVal}) and nums[${right}] (${oldRightVal}).`, 7, { left, right, isSwapping: true, preSwapL: oldLeftVal, preSwapR: oldRightVal });
                
                let temp = nums[left];
                nums[left] = nums[right];
                nums[right] = temp;
                
                add("Increment Left", `left++; Move the insert position forward.`, 11, { left: left + 1, right, justSwapped: true, hlLeft: left, hlRight: right });
                left++;
            } else {
                add("Skip Zero", `No, it is zero. Do nothing. Just advance the 'right' explorer pointer.`, 5, { left, right });
            }
        }
        add("Return Result", `Array completely processed. All zeros successfully pushed to the end.`, 14, { left, isSuccess: true });

    } else if (selectedOpId === 'twoPasses') {
        let insertPos = 0;
        add("Init Pointer", `int insertPos = 0; Tracks where to place the next valid non-zero element.`, 2, { insertPos });

        for (let i = 0; i < n; i++) {
            add("Loop 1 Condition", `Pass 1: for (int i = ${i}...); Check element at index ${i}.`, 5, { insertPos, i });
            
            add("Check Non-Zero", `if (nums[i] != 0) -> Is nums[${i}] (${nums[i]}) != 0?`, 6, { insertPos, i, checkZero: true });
            
            if (nums[i] !== 0) {
                add("Overwrite", `Yes. Overwrite: nums[insertPos] = nums[i] -> nums[${insertPos}] = ${nums[i]}.`, 7, { insertPos, i, writing: true, overwriteTarget: insertPos });
                nums[insertPos] = nums[i];
                
                add("Increment Insert", `insertPos++ -> Next insert position is ${insertPos + 1}.`, 8, { insertPos: insertPos + 1, i, justWritten: insertPos });
                insertPos++;
            } else {
                add("Skip Zero", `No, it's zero. Skip it.`, 6, { insertPos, i });
            }
        }

        add("Pass 1 Complete", `All non-zeros compacted at the front. Remaining positions from ${insertPos} to ${n-1} must be filled with 0s.`, 11, { insertPos, pass1Done: true });

        while (insertPos < n) {
            add("Loop 2 Condition", `while (insertPos < nums.length) -> Fill zero at index ${insertPos}.`, 13, { insertPos });
            nums[insertPos] = 0;
            add("Fill Zero", `nums[${insertPos}] = 0; Fill with zero.`, 14, { insertPos: insertPos + 1, writingZero: true, overwriteTarget: insertPos });
            insertPos++;
        }

        add("Return Result", `Pass 2 complete. All zeros successfully placed.`, 17, { insertPos, isSuccess: true });
    }

    return steps;
  }, [baseArray, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { nums: [] } };
  const st = curStepData.state || { nums: [] };
  const isLastStep = currentStep === trace.length - 1;

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-fuchsia-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <ArrowRightLeft className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Move Zeroes</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded">
                      LC 283 • Two Pointers
                  </span>
                  <span>•</span>
                  <span>In-Place Operations</span>
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
                  Given an integer array <code>nums</code>, move all <code>0</code>'s to the end of it while maintaining the relative order of the non-zero elements.<br/><br/>
                  <b>Note</b> that you must do this in-place without making a copy of the array.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [0,1,0,3,12]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [1,3,12,0,0]</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [0]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [0]</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Follow-up</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= nums.length &lt;= 10<sup>4</sup></li>
                        <li>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</li>
                        <li className="font-bold text-fuchsia-600 mt-2">Follow-up: Could you minimize the total number of operations done?</li>
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
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1 flex justify-between">
                                <span>Input Array (nums)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-fuchsia-200 hover:bg-fuchsia-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Evaluation Complete</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-fuchsia-500"/> Array & State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-fuchsia-600 rounded-lg transition-colors"><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-10 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* State Variables */}
                           <div className="flex gap-4">
                                <div className="flex flex-col items-center bg-white border-2 border-fuchsia-200 p-3 rounded-xl min-w-[100px] shadow-sm">
                                    <span className="text-[9px] uppercase tracking-widest font-black text-fuchsia-500">Insert Pos</span>
                                    <span className="font-mono font-black text-2xl text-fuchsia-600">{st.left !== undefined ? st.left : (st.insertPos !== undefined ? st.insertPos : '-')}</span>
                                </div>
                                {(st.right !== undefined || st.i !== undefined) && (
                                    <div className="flex flex-col items-center bg-white border-2 border-sky-200 p-3 rounded-xl min-w-[100px] shadow-sm">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-sky-500">Explorer i</span>
                                        <span className="font-mono font-black text-2xl text-sky-600">{st.right !== undefined ? st.right : (st.i !== undefined ? st.i : '-')}</span>
                                    </div>
                                )}
                           </div>

                           {/* Array Visualizer */}
                           <div className="flex flex-col items-center w-full max-w-4xl mt-4">
                               <div className="flex gap-3 p-4 border-2 border-slate-200 bg-white/90 rounded-3xl shadow-xl backdrop-blur-sm flex-wrap justify-center w-full">
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       // Two Pointers Logic
                                       if (selectedOpId === 'twoPointers') {
                                           if (st.left === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'left', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.right === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'right', color: 'sky', pos: 'top' });
                                           }
                                           // During swap, highlight both with emerald briefly if valid
                                           if (st.isSwapping && (st.left === idx || st.right === idx)) {
                                               color = 'amber';
                                           }
                                           if (st.justSwapped && (st.hlLeft === idx || st.hlRight === idx)) {
                                               color = 'emerald';
                                           }
                                       } 
                                       // Two Passes Logic
                                       else if (selectedOpId === 'twoPasses') {
                                           if (st.insertPos === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'insert', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.i === idx && !st.pass1Done) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                           }
                                           if (st.writing && st.overwriteTarget === idx) {
                                               color = 'amber';
                                           }
                                           if (st.justWritten === idx || (st.writingZero && st.overwriteTarget === idx)) {
                                               color = 'emerald';
                                           }
                                       }

                                       if (st.isSuccess) {
                                           color = val === 0 ? 'slate' : 'emerald';
                                       }

                                       return (
                                           <div key={`num-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
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
                        <h3 className="font-black text-fuchsia-400 text-lg uppercase tracking-widest mb-6">The "Snowball" Swap</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>The optimal approach uses a <code>left</code> pointer to keep track of the boundary between the "non-zero" processed elements and the "zeroes".</p>
                            <p>As the <code>right</code> pointer explores the array, it throws every non-zero element it finds to the <code>left</code> pointer via a swap.</p>
                            <p>This naturally builds a "snowball" of zeroes between the <code>left</code> and <code>right</code> pointers, rolling them to the end of the array.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-fuchsia-50 border border-fuchsia-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-fuchsia-700 text-lg uppercase tracking-widest mb-6">Why In-Place Operations Matter</h3>
                        <div className="space-y-4 text-sm text-fuchsia-900/80 leading-relaxed font-medium">
                            <p>It is trivial to create a new array, append non-zeros, and then append zeros. However, allocating a new array takes $O(N)$ Space.</p>
                            <p>In low-level systems, allocating memory is an expensive operation. If this function is called millions of times per second, garbage collection would become a severe bottleneck.</p>
                            <p>Modifying the array <strong>in-place</strong> using pointers requires zero extra memory allocations, making it blazingly fast and robust.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Operations Tradeoff: Swapping vs Overwriting</h3>
                            <p>The Two Passes approach (Overwrite) is often simpler to write. However, consider the edge case where the array has no zeroes at all: <code>[1, 2, 3, 4]</code>.</p>
                            <p>The Overwrite approach will still write every element to its own index, and then do a second while-loop check. The Single Pass Swap approach will swap elements with themselves (which is a no-op, but still executes the swap logic).</p>
                            <p>In the real world, the "Optimal" approach minimizes total operations when the array is sparse (many zeroes), while the overwrite approach might be slightly faster if the array is dense (few zeroes).</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-fuchsia-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-fuchsia-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Navigating the In-Place Constraint</h3>
                    <p className="text-sm text-fuchsia-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers use this problem to see if you understand how to manipulate arrays without relying on secondary data structures. Start with the two-pass overwrite, then naturally progress to the single-pass swap."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-fuchsia-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><MoveRight size={16}/></div>
                               1. Propose the Two-Pass Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "Because the problem requires O(1) space, I can't build a new array. A simple way to do this in-place is a two-pass approach. In the first pass, I'll maintain an 'insertPosition' index. I'll iterate through the array and whenever I find a non-zero, I'll write it to the 'insertPosition' and increment it. In the second pass, I'll fill all remaining indices with zeros."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><Zap size={16}/></div>
                               2. Pivot to the Optimization Follow-Up
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "While the two-pass approach is O(N) time, I can actually optimize this to be done in a single pass, which minimizes total operations written to the array as requested by the follow-up prompt."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><ArrowRightLeft size={16}/></div>
                               3. Deliver the Snowball Swap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "I will use a Two Pointer approach. 'left' will track the position where the next non-zero should go, and 'right' will iterate through the array. When 'right' encounters a non-zero element, I will swap the elements at 'left' and 'right', then increment 'left'. This continuously pushes non-zero elements to the front and 'snowballs' the zeros to the back in a single pass."
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-fuchsia-600 pl-1">Input Array (nums)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" />
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
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-fuchsia-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(217,70,239,0.3)] hover:bg-fuchsia-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-fuchsia-400 shadow-fuchsia-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* State Variables */}
                           <div className="flex gap-8 origin-center mb-8 z-30">
                                <div className="flex flex-col items-center bg-white border-[3px] border-fuchsia-200 p-6 rounded-2xl min-w-[150px] shadow-xl">
                                    <span className="text-xs uppercase tracking-widest font-black text-fuchsia-500">Insert Pos</span>
                                    <span className="font-mono font-black text-5xl text-fuchsia-600 mt-2">{st.left !== undefined ? st.left : (st.insertPos !== undefined ? st.insertPos : '-')}</span>
                                </div>
                                {(st.right !== undefined || st.i !== undefined) && (
                                    <div className="flex flex-col items-center bg-white border-[3px] border-sky-200 p-6 rounded-2xl min-w-[150px] shadow-xl">
                                        <span className="text-xs uppercase tracking-widest font-black text-sky-500">Explorer i</span>
                                        <span className="font-mono font-black text-5xl text-sky-600 mt-2">{st.right !== undefined ? st.right : (st.i !== undefined ? st.i : '-')}</span>
                                    </div>
                                )}
                           </div>

                           {/* Array Visualizer */}
                           <div className="flex flex-col items-center w-full max-w-5xl mt-4 scale-125 origin-top">
                               <div className="flex gap-4 p-6 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-2xl backdrop-blur-sm flex-wrap justify-center w-full">
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic text-2xl">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       // Two Pointers Logic
                                       if (selectedOpId === 'twoPointers') {
                                           if (st.left === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'left', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.right === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'right', color: 'sky', pos: 'top' });
                                           }
                                           if (st.isSwapping && (st.left === idx || st.right === idx)) {
                                               color = 'amber';
                                           }
                                           if (st.justSwapped && (st.hlLeft === idx || st.hlRight === idx)) {
                                               color = 'emerald';
                                           }
                                       } 
                                       // Two Passes Logic
                                       else if (selectedOpId === 'twoPasses') {
                                           if (st.insertPos === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'insert', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.i === idx && !st.pass1Done) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                           }
                                           if (st.writing && st.overwriteTarget === idx) {
                                               color = 'amber';
                                           }
                                           if (st.justWritten === idx || (st.writingZero && st.overwriteTarget === idx)) {
                                               color = 'emerald';
                                           }
                                       }

                                       if (st.isSuccess) {
                                           color = val === 0 ? 'slate' : 'emerald';
                                       }

                                       return (
                                           <div key={`num-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'scale-100 z-10 mx-2'} my-6`}>
                                               <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

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
                                    ARRAY PROCESSED
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