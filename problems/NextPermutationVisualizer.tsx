import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, GitCompare, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, SplitSquareHorizontal, FastForward
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimal: {
    id: 'optimal',
    title: '1. Single Pass Algorithm (Optimal)',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public void nextPermutation(int[] nums) {
    int i = nums.length - 2;
    
    // 1. Find the first decreasing element from the right
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    
    if (i >= 0) {
        int j = nums.length - 1;
        // 2. Find the element just larger than nums[i] from the right
        while (j >= 0 && nums[j] <= nums[i]) {
            j--;
        }
        // 3. Swap them
        swap(nums, i, j);
    }
    
    // 4. Reverse the suffix starting at i + 1
    reverse(nums, i + 1, nums.length - 1);
}

private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

private void reverse(int[] nums, int start, int end) {
    while (start < end) {
        swap(nums, start, end);
        start++;
        end--;
    }
}`,
    desc: "The standard O(N) time, O(1) space approach. We scan from right-to-left to find the first 'dip' (a number smaller than the one to its right). This marks the digit we need to increment. We then find the smallest number to its right that is larger than the dip, swap them, and finally reverse the entire remaining suffix to get the smallest possible permutation of that suffix."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|boolean|int|return|if|else|for|while|continue|break|new|length|swap|reverse)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
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
            const isKeyword = ['public', 'private', 'void', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isVar = ['nums', 'i', 'j', 'temp', 'start', 'end'].includes(part);
            const isMapCall = ['length', 'swap', 'reverse'].includes(part);
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
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    let activeTheme = themes[themeColor] || themes['slate'];

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[48px] min-h-[56px] md:min-w-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
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

export default function NextPermutationVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimal');
  
  const [inputString, setInputString] = useState('1, 3, 5, 4, 2');
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
      return arr.slice(0, 15); // Limit max length for UI safety
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
    if (!baseArray || baseArray.length === 0) return [{ phase: 'Init', description: 'Enter valid numbers.', line: 0, state: { nums: [] } }];

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

    if (n <= 1) {
        add("Base Case", `Array length is <= 1. No permutations possible. Return as-is.`, 1, { isSuccess: true });
        return steps;
    }

    let i = n - 2;
    add("Phase 1: Find Dip", `int i = nums.length - 2; Start scanning right-to-left to find the first decreasing element (the dip).`, 2, { i, phase: 'find_dip' });

    while (i >= 0) {
        add("Check Element", `while (i >= 0 && nums[i] >= nums[i+1]) -> Is nums[${i}] (${nums[i]}) >= nums[${i+1}] (${nums[i+1]})?`, 5, { i, phase: 'find_dip', hlDip: true });
        if (nums[i] < nums[i + 1]) {
            add("Dip Found", `False. Found the dip at index ${i} (${nums[i]} < ${nums[i+1]}). This marks the prefix boundary.`, 5, { i, phase: 'find_dip', dipFound: true });
            break;
        }
        add("Move Left", `True. Current element is >= the right neighbor. Keep scanning left.`, 6, { i, phase: 'find_dip' });
        i--;
    }

    add("Evaluate Dip", `if (i >= 0) -> Was a dip found? i = ${i}.`, 9, { i });

    if (i >= 0) {
        let j = n - 1;
        add("Phase 2: Find Swap Target", `int j = nums.length - 1; Start scanning right-to-left to find the smallest number strictly greater than the dip (${nums[i]}).`, 10, { i, j, phase: 'find_target' });
        
        while (j >= 0) {
            add("Check Target", `while (j >= 0 && nums[j] <= nums[i]) -> Is nums[${j}] (${nums[j]}) <= nums[${i}] (${nums[i]})?`, 12, { i, j, phase: 'find_target', hlJ: true });
            if (nums[j] > nums[i]) {
                add("Target Found", `False. Found the swap target at index ${j} (${nums[j]} > ${nums[i]}).`, 12, { i, j, phase: 'find_target', targetFound: true });
                break;
            }
            add("Move Target Left", `True. Element is too small. Keep scanning left.`, 13, { i, j, phase: 'find_target' });
            j--;
        }
        
        add("Phase 3: Swap", `swap(nums, i, j); Swap the dip (${nums[i]}) with the target (${nums[j]}).`, 16, { i, j, phase: 'swap', isSwapping: true });
        
        let temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
        
        add("Swap Completed", `Swap executed. The prefix is now incremented to the next lexicographical state.`, 16, { i, j, phase: 'swap', isSwapped: true });
    } else {
        add("No Dip Found", `i is < 0. The entire array is sorted in descending order (last permutation). We just need to reverse the whole array.`, 9, { i, phase: 'no_dip' });
    }

    let left = i + 1;
    let right = n - 1;
    add("Phase 4: Reverse Suffix", `reverse(nums, i + 1, nums.length - 1); Reverse the suffix from index ${left} to ${right} to make it as small as possible.`, 20, { i, left, right, phase: 'reverse_init' });

    while (left < right) {
        add("Reverse Swap", `while (start < end) -> Swap nums[${left}] and nums[${right}].`, 30, { i, left, right, phase: 'reverse_swap', isSwappingRev: true });
        
        let t = nums[left];
        nums[left] = nums[right];
        nums[right] = t;
        
        add("Reversed Iteration", `Swapped. Move pointers inwards.`, 31, { i, left, right, phase: 'reverse_swap', isSwappedRev: true });
        left++;
        right--;
    }

    add("Complete", `Next permutation successfully generated!`, 21, { isSuccess: true });

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
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <FastForward className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Next Permutation</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      LC 31 • Arrays & Math
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
                <div className="flex items-center gap-3 text-emerald-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  A permutation of an array of integers is an arrangement of its members into a sequence or linear order.<br/><br/>
                  The <strong>next permutation</strong> of an array of integers is the next lexicographically greater permutation of its integer. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Requirements</h4>
                    <ul className="list-disc list-inside text-sm font-mono text-slate-600 space-y-2">
                        <li>The replacement must be <strong>in place</strong> and use only constant extra memory.</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-sky-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [1,2,3]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [1,3,2]</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px]">Example 2 (Wrap Around)</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [3,2,1]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [1,2,3]</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 3</span>
                        <div><span className="text-white font-bold">Input:</span> nums = [1,1,5]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [1,5,1]</div>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-emerald-500 pl-1 flex justify-between">
                                <span>Input Array (nums)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Next Permutation Generated</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-emerald-500`}><Layout size={14}/> Array Engine</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors hover:text-emerald-600`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors hover:text-emerald-600`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors hover:text-emerald-600`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-8 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Variable Monitors --- */}
                           <div className="flex gap-4 min-w-max">
                               {st.i !== undefined && (
                                   <div className={`flex flex-col items-center bg-white border-2 border-sky-200 p-3 rounded-xl min-w-[80px] shadow-sm transition-all duration-300 ${st.phase === 'find_dip' ? 'scale-110 shadow-sky-200/50' : ''}`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-sky-500">Dip Index (i)</span>
                                       <span className="font-mono font-black text-2xl text-sky-600">{st.i}</span>
                                   </div>
                               )}
                               {st.j !== undefined && (
                                   <div className={`flex flex-col items-center bg-white border-2 border-fuchsia-200 p-3 rounded-xl min-w-[80px] shadow-sm animate-in slide-in-from-left-4 transition-all duration-300 ${st.phase === 'find_target' ? 'scale-110 shadow-fuchsia-200/50' : ''}`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-fuchsia-500">Target (j)</span>
                                       <span className="font-mono font-black text-2xl text-fuchsia-600">{st.j}</span>
                                   </div>
                               )}
                               {st.left !== undefined && (
                                   <div className={`flex flex-col items-center bg-white border-2 border-amber-200 p-3 rounded-xl min-w-[80px] shadow-sm animate-in slide-in-from-left-4`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-amber-500">Rev Left</span>
                                       <span className="font-mono font-black text-2xl text-amber-600">{st.left}</span>
                                   </div>
                               )}
                               {st.right !== undefined && (
                                   <div className={`flex flex-col items-center bg-white border-2 border-amber-200 p-3 rounded-xl min-w-[80px] shadow-sm animate-in slide-in-from-left-4`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-amber-500">Rev Right</span>
                                       <span className="font-mono font-black text-2xl text-amber-600">{st.right}</span>
                                   </div>
                               )}
                           </div>

                           {/* --- Array Visualizer --- */}
                           <div className="flex flex-col items-center w-full max-w-4xl mt-4">
                               <div className="flex gap-2 p-4 border-2 border-slate-200 bg-white/90 rounded-3xl shadow-xl backdrop-blur-sm flex-wrap justify-center min-w-[200px] min-h-[100px] items-center">
                                   
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       // Phase 1: Dip Finder
                                       if (st.phase === 'find_dip') {
                                           if (st.i === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                           }
                                           if (st.i + 1 === idx && st.hlDip) {
                                               color = 'amber'; isHl = true;
                                           }
                                           if (st.dipFound && st.i === idx) {
                                               color = 'emerald';
                                           }
                                       }

                                       // Phase 2: Target Finder
                                       if (st.phase === 'find_target') {
                                           if (st.i === idx) {
                                               color = 'emerald'; isHl = true;
                                               labels.push({ text: 'dip i', color: 'emerald', pos: 'top' });
                                           }
                                           if (st.j === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'j', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.hlJ && st.j === idx) color = 'amber';
                                           if (st.targetFound && st.j === idx) color = 'emerald';
                                       }

                                       // Phase 3: Swap
                                       if (st.phase === 'swap') {
                                           if (st.i === idx || st.j === idx) {
                                               color = st.isSwapped ? 'emerald' : 'amber';
                                               isHl = true;
                                               labels.push({ text: st.i === idx ? 'i' : 'j', color: color, pos: st.i === idx ? 'top' : 'bottom' });
                                           }
                                       }

                                       // Phase 4: Reverse Suffix
                                       if (st.phase?.startsWith('reverse')) {
                                           // Highlight the entire suffix boundary softly
                                           if (st.i !== undefined && idx > st.i) {
                                               color = 'amber';
                                           }
                                           if (st.left === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'L', color: 'sky', pos: 'bottom' });
                                           }
                                           if (st.right === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'R', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.isSwappingRev && (st.left === idx || st.right === idx)) {
                                               color = 'rose';
                                           }
                                           if (st.isSwappedRev && (st.left === idx || st.right === idx)) {
                                               color = 'emerald';
                                           }
                                       }

                                       if (st.isSuccess) {
                                           color = 'emerald';
                                       }

                                       return (
                                           <div key={`num-${idx}`} className={`relative transition-all duration-500 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><FastForward size={120}/></div>
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Lexicographical Truth</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>To find the <em>next</em> permutation, we want to increase the sequence as little as possible.</p>
                            <p>If an array is completely sorted in descending order (e.g., <code>[5, 4, 3, 2, 1]</code>), it is already at its absolute maximum value. No permutation can make it larger. The algorithm detects this when the 'dip' pointer reaches <code>-1</code>.</p>
                            <p>To increase the value of a sequence, we must find a smaller number on the left and swap it with a larger number on the right.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">The 3-Step Algorithm</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <ol className="list-decimal ml-4 space-y-4">
                                <li><strong>Find the Dip (i):</strong> Scan right-to-left. Find the first element that is smaller than the element to its right. This index <code>i</code> is the boundary that must be incremented.</li>
                                <li><strong>Find Swap Target (j):</strong> Scan right-to-left again. Find the smallest element that is strictly greater than <code>nums[i]</code>. Swap them. This increments the prefix by the smallest possible amount.</li>
                                <li><strong>Reverse Suffix:</strong> After swapping, the elements to the right of <code>i</code> are guaranteed to be in descending order. To make the new permutation as small as possible, we reverse this suffix to make it ascending.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering The 3 Phases</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"This is a classic algorithmic memorization problem. Interviewers know that if you understand the 3 distinct phases (Find Dip, Find Target, Reverse Suffix), you truly understand permutation math."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Identifying the Dip
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "To find the next permutation, we need to find the rightmost character that can be incremented. I'll scan the array from right to left to find the first element that is smaller than its right neighbor. I'll call this index 'i'. Everything to the right of 'i' is strictly descending."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ShieldAlert size={16}/></div>
                               2. Edge Case Check
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Before proceeding, I must check if 'i' is valid. If the entire array was descending (like [3, 2, 1]), then 'i' will drop to -1. In this case, we skip the swap phase entirely because this is the maximum possible permutation."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ArrowRightLeft size={16}/></div>
                               3. The Swap & Reverse Optimization
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "If 'i' is valid, I scan right-to-left again to find the smallest number greater than nums[i]. I swap them. This guarantees the prefix is incremented by the smallest possible amount. Finally, the suffix to the right of 'i' is still in descending order. To make the overall permutation as small as possible, I reverse that suffix in-place to make it ascending. This runs in O(N) time and O(1) space."
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-emerald-600`}>Input Array (nums)</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-emerald-500`} />
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
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Variable Monitors */}
                           <div className="flex gap-8 origin-center z-30 mb-8">
                               {st.i !== undefined && (
                                   <div className={`flex flex-col items-center bg-white border-[3px] border-sky-200 p-6 rounded-2xl min-w-[150px] shadow-xl transition-all duration-300 ${st.phase === 'find_dip' ? 'scale-110 shadow-sky-200/50' : ''}`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-sky-500 mb-2">Dip Index (i)</span>
                                       <span className="font-mono font-black text-5xl text-sky-600">{st.i}</span>
                                   </div>
                               )}
                               {st.j !== undefined && (
                                   <div className={`flex flex-col items-center bg-white border-[3px] border-fuchsia-200 p-6 rounded-2xl min-w-[150px] shadow-xl animate-in slide-in-from-left-6 transition-all duration-300 ${st.phase === 'find_target' ? 'scale-110 shadow-fuchsia-200/50' : ''}`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-fuchsia-500 mb-2">Target (j)</span>
                                       <span className="font-mono font-black text-5xl text-fuchsia-600">{st.j}</span>
                                   </div>
                               )}
                               {st.left !== undefined && (
                                   <div className={`flex flex-col items-center bg-white border-[3px] border-amber-200 p-6 rounded-2xl min-w-[150px] shadow-xl animate-in slide-in-from-left-6`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-amber-500 mb-2">Rev Left</span>
                                       <span className="font-mono font-black text-5xl text-amber-600">{st.left}</span>
                                   </div>
                               )}
                               {st.right !== undefined && (
                                   <div className={`flex flex-col items-center bg-white border-[3px] border-amber-200 p-6 rounded-2xl min-w-[150px] shadow-xl animate-in slide-in-from-left-6`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-amber-500 mb-2">Rev Right</span>
                                       <span className="font-mono font-black text-5xl text-amber-600">{st.right}</span>
                                   </div>
                               )}
                           </div>

                           {/* Main Array Visualizer */}
                           <div className="flex flex-col items-center w-full max-w-6xl mt-4 scale-125 origin-top">
                               <div className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono mb-4 bg-white/50 px-6 py-2 rounded-full shadow-sm border border-slate-200">Array Engine</div>
                               <div className="flex gap-4 p-8 border-[4px] border-slate-200 bg-white/90 rounded-[2rem] shadow-2xl backdrop-blur-sm flex-wrap justify-center w-full min-h-[160px] items-center">
                                   
                                   {(st.nums || []).length === 0 && <span className="text-slate-400 italic text-3xl p-4">empty</span>}
                                   {(st.nums || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       // Phase 1: Dip Finder
                                       if (st.phase === 'find_dip') {
                                           if (st.i === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                           }
                                           if (st.i + 1 === idx && st.hlDip) {
                                               color = 'amber'; isHl = true;
                                           }
                                           if (st.dipFound && st.i === idx) {
                                               color = 'emerald';
                                           }
                                       }

                                       // Phase 2: Target Finder
                                       if (st.phase === 'find_target') {
                                           if (st.i === idx) {
                                               color = 'emerald'; isHl = true;
                                               labels.push({ text: 'dip i', color: 'emerald', pos: 'top' });
                                           }
                                           if (st.j === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'j', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.hlJ && st.j === idx) color = 'amber';
                                           if (st.targetFound && st.j === idx) color = 'emerald';
                                       }

                                       // Phase 3: Swap
                                       if (st.phase === 'swap') {
                                           if (st.i === idx || st.j === idx) {
                                               color = st.isSwapped ? 'emerald' : 'amber';
                                               isHl = true;
                                               labels.push({ text: st.i === idx ? 'i' : 'j', color: color, pos: st.i === idx ? 'top' : 'bottom' });
                                           }
                                       }

                                       // Phase 4: Reverse Suffix
                                       if (st.phase?.startsWith('reverse')) {
                                           if (st.i !== undefined && idx > st.i) {
                                               color = 'amber';
                                           }
                                           if (st.left === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'L', color: 'sky', pos: 'bottom' });
                                           }
                                           if (st.right === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'R', color: 'fuchsia', pos: 'bottom' });
                                           }
                                           if (st.isSwappingRev && (st.left === idx || st.right === idx)) {
                                               color = 'rose';
                                           }
                                           if (st.isSwappedRev && (st.left === idx || st.right === idx)) {
                                               color = 'emerald';
                                           }
                                       }

                                       if (st.isSuccess) {
                                           color = 'emerald';
                                       }

                                       return (
                                           <div key={`num-fs-${idx}`} className={`relative transition-all duration-500 ${isHl ? 'scale-110 z-20 mx-4' : 'scale-100 z-10 mx-2'} my-8`}>
                                               <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
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
                                    PERMUTATION GENERATED
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