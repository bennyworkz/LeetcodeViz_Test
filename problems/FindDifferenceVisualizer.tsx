import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, SquareSquare, Mountain, Hash
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalO1: {
    id: 'optimalO1',
    title: '1. Hash Sets (Optimal)',
    icon: <Hash size={16} />,
    complexity: 'Time: O(N + M) | Space: O(N + M)',
    code: `public List<List<Integer>> findDifference(int[] nums1, int[] nums2) {
    Set<Integer> set1 = new HashSet<>();
    Set<Integer> set2 = new HashSet<>();
    
    for (int num : nums1) {
        set1.add(num);
    }
    
    for (int num : nums2) {
        set2.add(num);
    }
    
    List<Integer> list1 = new ArrayList<>();
    for (int num : set1) {
        if (!set2.contains(num)) {
            list1.add(num);
        }
    }
    
    List<Integer> list2 = new ArrayList<>();
    for (int num : set2) {
        if (!set1.contains(num)) {
            list2.add(num);
        }
    }
    
    return Arrays.asList(list1, list2);
}`,
    desc: "The Optimal Hash Set approach. Finding distinct differences requires O(1) lookups to be efficient. By inserting both arrays into their own HashSets, we automatically remove duplicates. Then, we can iterate through each set and check if the other set '.contains()' the element in constant O(1) time."
  },
  naiveON2: {
    id: 'naiveON2',
    title: '2. Nested Loops (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(N * M) | Space: O(1)',
    code: `public List<List<Integer>> findDifference(int[] nums1, int[] nums2) {
    List<Integer> list1 = new ArrayList<>();
    for (int i = 0; i < nums1.length; i++) {
        boolean found = false;
        for (int j = 0; j < nums2.length; j++) {
            if (nums1[i] == nums2[j]) {
                found = true;
                break;
            }
        }
        if (!found && !list1.contains(nums1[i])) {
            list1.add(nums1[i]);
        }
    }
    
    List<Integer> list2 = new ArrayList<>();
    for (int i = 0; i < nums2.length; i++) {
        boolean found = false;
        for (int j = 0; j < nums1.length; j++) {
            if (nums2[i] == nums1[j]) {
                found = true;
                break;
            }
        }
        if (!found && !list2.contains(nums2[i])) {
            list2.add(nums2[i]);
        }
    }
    
    return Arrays.asList(list1, list2);
}`,
    desc: "The Naive Nested Loops approach. For every element in nums1, we scan the entirety of nums2 to check if it exists. If it doesn't, and it's not already in our answer list, we add it. We repeat the same nested process for nums2 against nums1. This overlapping scan takes O(N * M) time."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|double|int|char|return|if|else|for|while|continue|break|new|length|Math|max|min|findDifference|nums1|nums2|set1|set2|list1|list2|Set|HashSet|List|ArrayList|Arrays|asList|contains|add|num|i|j|found)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-amber-500/20`, border: `border-amber-400`, text: `text-amber-300` };

  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? activeStyles.text + ' font-bold' : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'boolean', 'double', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'Set', 'HashSet', 'List', 'ArrayList', 'Arrays'].includes(part);
            const isVar = ['nums1', 'nums2', 'set1', 'set2', 'list1', 'list2', 'num', 'i', 'j', 'found'].includes(part);
            const isMapCall = ['length', 'max', 'min', 'findDifference', 'contains', 'add', 'asList'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-emerald-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (part === 'true' || part === 'false') className = 'text-orange-400 font-bold';
            else if (part.startsWith("'") || part.startsWith('"') || (!isNaN(parseInt(part.trim())) && part.trim() !== '')) className = 'text-emerald-400';

            return <span key={idx} className={className}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const PointerLabel = ({ label, color = 'slate', position = 'top' }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300'
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

const NodeBlock = ({ val, idx = undefined, themeColor = 'slate', isTarget = false, isDimmed = false, subtext = undefined }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-300', index: 'bg-slate-50 text-slate-300' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[40px] md:min-w-[48px] min-h-[48px] md:min-h-[56px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl py-1 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {displayVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full h-4 md:h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">{subtext !== undefined ? subtext : `${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function FindDifferenceVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalO1');
  
  const [nums1Input, setNums1Input] = useState('1, 2, 3, 3');
  const [nums2Input, setNums2Input] = useState('1, 1, 2, 2');
  
  const [baseNums1, setBaseNums1] = useState([1, 2, 3, 3]);
  const [baseNums2, setBaseNums2] = useState([1, 1, 2, 2]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { setCurrentStep(0); setPan({ x: 0, y: 0 }); setZoom(1); };
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Debounce input parsing
  useEffect(() => {
    const timer = setTimeout(() => {
      let parsedNums1 = nums1Input.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      let parsedNums2 = nums2Input.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      
      if (parsedNums1.length === 0) parsedNums1 = [1, 2, 3, 3];
      if (parsedNums2.length === 0) parsedNums2 = [1, 1, 2, 2];
      
      if (parsedNums1.length > 15) parsedNums1 = parsedNums1.slice(0, 15);
      if (parsedNums2.length > 15) parsedNums2 = parsedNums2.slice(0, 15);

      setBaseNums1(parsedNums1);
      setBaseNums2(parsedNums2);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [nums1Input, nums2Input, selectedOpId]);

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
    if (!baseNums1 || !baseNums2) return [{ phase: 'Init', description: 'Enter valid arrays.', line: 1, state: {} }];

    let arr1 = [...baseNums1];
    let arr2 = [...baseNums2];
    const n1 = arr1.length;
    const n2 = arr2.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { arr1: [...arr1], arr2: [...arr2], n1, n2, ...st } 
    });

    if (selectedOpId === 'optimalO1') {
        let set1 = new Set();
        let set2 = new Set();
        let list1 = [];
        let list2 = [];
        
        add("Function Call", `public List<List<Integer>> findDifference(int[] nums1, int[] nums2)`, 1, { });
        
        add("Init Set 1", `Set<Integer> set1 = new HashSet<>();\nPrepares an O(1) lookup table for nums1.`, 2, { set1: Array.from(set1), set2: Array.from(set2) });
        add("Init Set 2", `Set<Integer> set2 = new HashSet<>();\nPrepares an O(1) lookup table for nums2.`, 3, { set1: Array.from(set1), set2: Array.from(set2) });
        
        for (let i = 0; i < n1; i++) {
            let num = arr1[i];
            add("Loop nums1", `for (int num : nums1)\nIterating nums1 to populate set1. Current: ${num}`, 5, { set1: Array.from(set1), set2: Array.from(set2), iter1: i, num, isEval1: true });
            set1.add(num);
            add("Add to set1", `set1.add(${num});\nAdds ${num} to set1 (duplicates are ignored).`, 6, { set1: Array.from(set1), set2: Array.from(set2), iter1: i, num, hlSet1Add: true });
        }
        add("Loop nums1 End", `Finished adding nums1 to set1.`, 5, { set1: Array.from(set1), set2: Array.from(set2) });
        
        for (let i = 0; i < n2; i++) {
            let num = arr2[i];
            add("Loop nums2", `for (int num : nums2)\nIterating nums2 to populate set2. Current: ${num}`, 9, { set1: Array.from(set1), set2: Array.from(set2), iter2: i, num, isEval2: true });
            set2.add(num);
            add("Add to set2", `set2.add(${num});\nAdds ${num} to set2 (duplicates are ignored).`, 10, { set1: Array.from(set1), set2: Array.from(set2), iter2: i, num, hlSet2Add: true });
        }
        add("Loop nums2 End", `Finished adding nums2 to set2.`, 9, { set1: Array.from(set1), set2: Array.from(set2) });
        
        add("Init List 1", `List<Integer> list1 = new ArrayList<>();\nPrepares the answer list for distinct elements only in nums1.`, 13, { set1: Array.from(set1), set2: Array.from(set2), list1: [...list1], list2: [...list2] });
        
        let set1Arr = Array.from(set1);
        for (let i = 0; i < set1Arr.length; i++) {
            let num = set1Arr[i];
            add("Iterate set1", `for (int num : set1)\nChecking distinct element ${num} against set2.`, 14, { set1: set1Arr, set2: Array.from(set2), list1: [...list1], list2: [...list2], check1: i, num, isIter1: true });
            
            let contains = set2.has(num);
            add("Check Contains", `if (!set2.contains(${num}))\nDoes set2 have ${num}? (${contains ? 'Yes' : 'No'})`, 15, { set1: set1Arr, set2: Array.from(set2), list1: [...list1], list2: [...list2], check1: i, num, isChecking2: true, checkVal: num });
            
            if (!contains) {
                list1.push(num);
                add("Add to List 1", `list1.add(${num});\n${num} is unique to nums1!`, 16, { set1: set1Arr, set2: Array.from(set2), list1: [...list1], list2: [...list2], check1: i, num, hlList1Add: true });
            }
        }
        add("End list1 Gen", `Finished building list1.`, 14, { set1: set1Arr, set2: Array.from(set2), list1: [...list1], list2: [...list2] });
        
        add("Init List 2", `List<Integer> list2 = new ArrayList<>();\nPrepares the answer list for distinct elements only in nums2.`, 20, { set1: set1Arr, set2: Array.from(set2), list1: [...list1], list2: [...list2] });
        
        let set2Arr = Array.from(set2);
        for (let i = 0; i < set2Arr.length; i++) {
            let num = set2Arr[i];
            add("Iterate set2", `for (int num : set2)\nChecking distinct element ${num} against set1.`, 21, { set1: set1Arr, set2: set2Arr, list1: [...list1], list2: [...list2], check2: i, num, isIter2: true });
            
            let contains = set1.has(num);
            add("Check Contains", `if (!set1.contains(${num}))\nDoes set1 have ${num}? (${contains ? 'Yes' : 'No'})`, 22, { set1: set1Arr, set2: set2Arr, list1: [...list1], list2: [...list2], check2: i, num, isChecking1: true, checkVal: num });
            
            if (!contains) {
                list2.push(num);
                add("Add to List 2", `list2.add(${num});\n${num} is unique to nums2!`, 23, { set1: set1Arr, set2: set2Arr, list1: [...list1], list2: [...list2], check2: i, num, hlList2Add: true });
            }
        }
        add("End list2 Gen", `Finished building list2.`, 21, { set1: set1Arr, set2: set2Arr, list1: [...list1], list2: [...list2] });
        
        add("Return Result", `return Arrays.asList(list1, list2);\nReturns the two lists grouped together.`, 27, { set1: set1Arr, set2: set2Arr, list1: [...list1], list2: [...list2], isSuccess: true });

    } else if (selectedOpId === 'naiveON2') {
        
        let list1 = [];
        let list2 = [];
        
        add("Function Call", `public List<List<Integer>> findDifference(int[] nums1, int[] nums2)`, 1, { });
        
        add("Init list1", `List<Integer> list1 = new ArrayList<>();`, 2, { list1: [...list1], list2: [...list2] });
        
        for (let i = 0; i < n1; i++) {
            add("Outer Loop nums1", `for (int i = 0; i < nums1.length; i++)\nChecking element nums1[${i}] = ${arr1[i]}`, 3, { list1: [...list1], list2: [...list2], i1: i, num: arr1[i], isEvalOuter1: true });
            
            let found = false;
            add("Init Found", `boolean found = false;`, 4, { list1: [...list1], list2: [...list2], i1: i, num: arr1[i], found });
            
            for (let j = 0; j < n2; j++) {
                add("Inner Loop nums2", `for (int j = 0; j < nums2.length; j++)\nScanning nums2 for ${arr1[i]}.`, 5, { list1: [...list1], list2: [...list2], i1: i, j2: j, num: arr1[i], found, isEvalInner2: true });
                
                let match = arr1[i] === arr2[j];
                add("Check Equality", `if (nums1[i] == nums2[j])\nIs ${arr1[i]} == ${arr2[j]}?`, 6, { list1: [...list1], list2: [...list2], i1: i, j2: j, num: arr1[i], found, isComparing: true });
                
                if (match) {
                    found = true;
                    add("Found Match", `found = true; break;\nElement exists in both. Break early.`, 7, { list1: [...list1], list2: [...list2], i1: i, j2: j, num: arr1[i], found, hlMatch: true });
                    break;
                }
            }
            
            let alreadyInList = list1.includes(arr1[i]);
            add("Check Constraints", `if (!found && !list1.contains(nums1[i]))\nWas it missing AND not already added? (!${found} && !${alreadyInList})`, 11, { list1: [...list1], list2: [...list2], i1: i, num: arr1[i], found, isCheckingConstraints: true });
            
            if (!found && !alreadyInList) {
                list1.push(arr1[i]);
                add("Add to list1", `list1.add(nums1[i]);\nAdded ${arr1[i]} to list1.`, 12, { list1: [...list1], list2: [...list2], i1: i, num: arr1[i], found, hlList1Add: true });
            }
        }
        
        add("Init list2", `List<Integer> list2 = new ArrayList<>();`, 16, { list1: [...list1], list2: [...list2] });
        
        for (let i = 0; i < n2; i++) {
            add("Outer Loop nums2", `for (int i = 0; i < nums2.length; i++)\nChecking element nums2[${i}] = ${arr2[i]}`, 17, { list1: [...list1], list2: [...list2], i2: i, num: arr2[i], isEvalOuter2: true });
            
            let found = false;
            add("Init Found", `boolean found = false;`, 18, { list1: [...list1], list2: [...list2], i2: i, num: arr2[i], found });
            
            for (let j = 0; j < n1; j++) {
                add("Inner Loop nums1", `for (int j = 0; j < nums1.length; j++)\nScanning nums1 for ${arr2[i]}.`, 19, { list1: [...list1], list2: [...list2], i2: i, j1: j, num: arr2[i], found, isEvalInner1: true });
                
                let match = arr2[i] === arr1[j];
                add("Check Equality", `if (nums2[i] == nums1[j])\nIs ${arr2[i]} == ${arr1[j]}?`, 20, { list1: [...list1], list2: [...list2], i2: i, j1: j, num: arr2[i], found, isComparing: true });
                
                if (match) {
                    found = true;
                    add("Found Match", `found = true; break;\nElement exists in both. Break early.`, 21, { list1: [...list1], list2: [...list2], i2: i, j1: j, num: arr2[i], found, hlMatch: true });
                    break;
                }
            }
            
            let alreadyInList = list2.includes(arr2[i]);
            add("Check Constraints", `if (!found && !list2.contains(nums2[i]))\nWas it missing AND not already added? (!${found} && !${alreadyInList})`, 25, { list1: [...list1], list2: [...list2], i2: i, num: arr2[i], found, isCheckingConstraints: true });
            
            if (!found && !alreadyInList) {
                list2.push(arr2[i]);
                add("Add to list2", `list2.add(nums2[i]);\nAdded ${arr2[i]} to list2.`, 26, { list1: [...list1], list2: [...list2], i2: i, num: arr2[i], found, hlList2Add: true });
            }
        }
        
        add("Return Result", `return Arrays.asList(list1, list2);\nReturns the two lists grouped together.`, 30, { list1: [...list1], list2: [...list2], isSuccess: true });
    }

    return steps;
  }, [baseNums1, baseNums2, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'optimalO1' ? 'emerald' : 'amber';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.arr1 === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-8 w-full">
              
              {/* Top Arrays */}
              <div className="flex flex-col xl:flex-row w-full max-w-6xl gap-6 items-start justify-center">
                  
                  {/* NUMS 1 */}
                  <div className="flex flex-col items-start w-full flex-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><Layout size={12}/> nums1 Array</span>
                      <div className="flex gap-1 p-3 border-[3px] border-sky-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px]">
                          {st.arr1.map((val, idx) => {
                              let isHl = false;
                              let color = 'sky';
                              let labels = [];

                              if (selectedOpId === 'optimalO1') {
                                  if (st.iter1 === idx) {
                                      isHl = true;
                                      color = 'sky';
                                      labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                                  }
                              } else {
                                  if (st.i1 === idx) {
                                      isHl = true;
                                      color = 'sky';
                                      labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                                  }
                                  if (st.j1 === idx) {
                                      isHl = true;
                                      color = 'sky';
                                      labels.push({ text: 'j', color: 'sky', pos: 'top' });
                                  }
                              }

                              return (
                                  <React.Fragment key={`arr1-${idx}`}>
                                      <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                            {labels.filter(l => l.pos === 'top').map((l, j) => (
                                                <React.Fragment key={j}>
                                                    <PointerLabel label={l.text} color={l.color} position="top" />
                                                </React.Fragment>
                                            ))}
                                          </div>
                                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                            {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                                <React.Fragment key={j}>
                                                    <PointerLabel label={l.text} color={l.color} position="bottom" />
                                                </React.Fragment>
                                            ))}
                                          </div>
                                          <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                      </div>
                                  </React.Fragment>
                              )
                          })}
                      </div>
                  </div>

                  {/* NUMS 2 */}
                  <div className="flex flex-col items-start w-full flex-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 flex items-center gap-2`}><Layout size={12}/> nums2 Array</span>
                      <div className="flex gap-1 p-3 border-[3px] border-fuchsia-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px]">
                          {st.arr2.map((val, idx) => {
                              let isHl = false;
                              let color = 'fuchsia';
                              let labels = [];

                              if (selectedOpId === 'optimalO1') {
                                  if (st.iter2 === idx) {
                                      isHl = true;
                                      color = 'fuchsia';
                                      labels.push({ text: 'i', color: 'fuchsia', pos: 'bottom' });
                                  }
                              } else {
                                  if (st.i2 === idx) {
                                      isHl = true;
                                      color = 'fuchsia';
                                      labels.push({ text: 'i', color: 'fuchsia', pos: 'bottom' });
                                  }
                                  if (st.j2 === idx) {
                                      isHl = true;
                                      color = 'fuchsia';
                                      labels.push({ text: 'j', color: 'fuchsia', pos: 'top' });
                                  }
                              }

                              return (
                                  <React.Fragment key={`arr2-${idx}`}>
                                      <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                            {labels.filter(l => l.pos === 'top').map((l, j) => (
                                                <React.Fragment key={j}>
                                                    <PointerLabel label={l.text} color={l.color} position="top" />
                                                </React.Fragment>
                                            ))}
                                          </div>
                                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                            {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                                <React.Fragment key={j}>
                                                    <PointerLabel label={l.text} color={l.color} position="bottom" />
                                                </React.Fragment>
                                            ))}
                                          </div>
                                          <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                      </div>
                                  </React.Fragment>
                              )
                          })}
                      </div>
                  </div>
              </div>

              {/* Hash Sets (Only for Optimal) */}
              {selectedOpId === 'optimalO1' && (
                  <div className="flex flex-col xl:flex-row w-full max-w-6xl gap-6 items-start justify-center">
                      {/* SET 1 */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Hash size={12}/> set1 (HashSet)</span>
                          <div className={`flex gap-2 p-4 border-[3px] border-indigo-200 bg-indigo-50/50 rounded-[2rem] shadow-md flex-wrap justify-start items-center w-full min-h-[90px] ${st.isChecking1 ? 'ring-4 ring-amber-300' : ''}`}>
                              {st.set1 && st.set1.map((val, idx) => {
                                  let isHl = false;
                                  let color = 'indigo';
                                  
                                  if (st.hlSet1Add && val === st.num) isHl = true;
                                  if (st.check1 === idx) {
                                      isHl = true;
                                      color = 'amber';
                                  }
                                  if (st.isChecking1 && val === st.checkVal) {
                                      isHl = true;
                                      color = 'amber';
                                  }

                                  return (
                                      <React.Fragment key={`set1-${val}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20' : 'scale-100 z-10'} ${st.hlSet1Add && val === st.num ? 'animate-in zoom-in slide-in-from-top-4' : ''}`}>
                                              <NodeBlock val={val} themeColor={color} isTarget={isHl} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {(!st.set1 || st.set1.length === 0) && <span className="text-indigo-300 italic text-sm font-mono px-4">empty</span>}
                          </div>
                      </div>

                      {/* SET 2 */}
                      <div className="flex flex-col items-start w-full flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Hash size={12}/> set2 (HashSet)</span>
                          <div className={`flex gap-2 p-4 border-[3px] border-indigo-200 bg-indigo-50/50 rounded-[2rem] shadow-md flex-wrap justify-start items-center w-full min-h-[90px] ${st.isChecking2 ? 'ring-4 ring-amber-300' : ''}`}>
                              {st.set2 && st.set2.map((val, idx) => {
                                  let isHl = false;
                                  let color = 'indigo';
                                  
                                  if (st.hlSet2Add && val === st.num) isHl = true;
                                  if (st.check2 === idx) {
                                      isHl = true;
                                      color = 'amber';
                                  }
                                  if (st.isChecking2 && val === st.checkVal) {
                                      isHl = true;
                                      color = 'amber';
                                  }

                                  return (
                                      <React.Fragment key={`set2-${val}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20' : 'scale-100 z-10'} ${st.hlSet2Add && val === st.num ? 'animate-in zoom-in slide-in-from-top-4' : ''}`}>
                                              <NodeBlock val={val} themeColor={color} isTarget={isHl} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {(!st.set2 || st.set2.length === 0) && <span className="text-indigo-300 italic text-sm font-mono px-4">empty</span>}
                          </div>
                      </div>
                  </div>
              )}

              {/* Output Lists */}
              <div className="flex flex-col xl:flex-row w-full max-w-6xl gap-6 items-start justify-center mt-2">
                  {/* LIST 1 */}
                  <div className="flex flex-col items-start w-full flex-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Target size={12}/> list1 (Output)</span>
                      <div className="flex gap-1 p-3 border-[3px] border-emerald-300 bg-white/90 rounded-[2rem] shadow-lg backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px]">
                          {st.list1 && st.list1.map((val, idx) => {
                              let isHl = st.hlList1Add && idx === st.list1.length - 1;
                              return (
                                  <React.Fragment key={`list1-${idx}`}>
                                      <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 animate-in zoom-in slide-in-from-top-4' : 'scale-100 z-10 m-1'}`}>
                                          <NodeBlock val={val} idx={idx} themeColor="emerald" isTarget={isHl} />
                                      </div>
                                  </React.Fragment>
                              )
                          })}
                          {(!st.list1 || st.list1.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">empty</span>}
                      </div>
                  </div>

                  {/* LIST 2 */}
                  <div className="flex flex-col items-start w-full flex-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Target size={12}/> list2 (Output)</span>
                      <div className="flex gap-1 p-3 border-[3px] border-emerald-300 bg-white/90 rounded-[2rem] shadow-lg backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[80px]">
                          {st.list2 && st.list2.map((val, idx) => {
                              let isHl = st.hlList2Add && idx === st.list2.length - 1;
                              return (
                                  <React.Fragment key={`list2-${idx}`}>
                                      <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 animate-in zoom-in slide-in-from-top-4' : 'scale-100 z-10 m-1'}`}>
                                          <NodeBlock val={val} idx={idx} themeColor="emerald" isTarget={isHl} />
                                      </div>
                                  </React.Fragment>
                              )
                          })}
                          {(!st.list2 || st.list2.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">empty</span>}
                      </div>
                  </div>
              </div>

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                <Hash className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Find the Difference of Two Arrays</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      LC 2215 • Hash Sets
                  </span>
                  <span>•</span>
                  <span>O(N+M) Time Constraint</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <div className="text-base leading-relaxed">
                  Given two <strong>0-indexed</strong> integer arrays <code>nums1</code> and <code>nums2</code>, return a list <code>answer</code> of size <code>2</code> where:<br/><br/>
                  <ul className="list-disc pl-8 space-y-2">
                    <li><code>answer[0]</code> is a list of all <strong>distinct</strong> integers in <code>nums1</code> which are <strong>not</strong> present in <code>nums2</code>.</li>
                    <li><code>answer[1]</code> is a list of all <strong>distinct</strong> integers in <code>nums2</code> which are <strong>not</strong> present in <code>nums1</code>.</li>
                  </ul>
                  <br/>
                  Note that the integers in the lists may be returned in <strong>any</strong> order.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> nums1 = [1,2,3], nums2 = [2,4,6]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [[1,3],[4,6]]</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
For nums1, 1 and 3 are not in nums2.
For nums2, 4 and 6 are not in nums1.
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> nums1 = [1,2,3,3], nums2 = [1,1,2,2]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [[3],[]]</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
For nums1, only 3 is not present in nums2. Since it must be distinct, we only return one 3.
For nums2, all elements are present in nums1, so we return an empty list.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= nums1.length, nums2.length &lt;= 1000</li>
                        <li>-1000 &lt;= nums1[i], nums2[i] &lt;= 1000</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            Trap: You must return DISTINCT integers. Even if '3' appears twice in nums1 and zero times in nums2, the output list for nums1 should only contain a single '3'. HashSets handle this requirement automatically.
                        </li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-amber-600 text-white border-amber-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-amber-200') : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-hidden relative">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                          <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                <span>'nums1' Array (Comma separated)</span>
                            </label>
                            <input 
                                type="text"
                                value={nums1Input} 
                                onChange={(e) => setNums1Input(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} 
                                spellCheck={false}
                                placeholder="1, 2, 3, 3"
                            />
                        </div>
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                <span>'nums2' Array (Comma separated)</span>
                            </label>
                            <input 
                                type="text"
                                value={nums2Input} 
                                onChange={(e) => setNums2Input(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} 
                                spellCheck={false}
                                placeholder="1, 1, 2, 2"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-amber-600 shadow-amber-200 hover:bg-amber-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className={`text-xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                <PartyPopper size={20}/> Evaluation Complete
                            </div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`}><Layout size={14}/> Memory Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           {renderVisuals()}
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Target size={120}/></div>
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">O(1) Lookups with Hash Sets</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>To find out if an element exists in another array, you normally have to scan the entire second array, taking O(M) time per element.</p>
                            <p>If you do this for every element in the first array, it takes <strong>O(N * M)</strong> time.</p>
                            <p>A <strong>HashSet</strong> is a data structure that allows for average O(1) constant time lookups by hashing the values. Converting the arrays to HashSets trades a little bit of Space for a massive leap in Time efficiency.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">Handling Distinct Values</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>The problem states we must return <strong>distinct</strong> integers. This is another area where HashSets shine.</p>
                            <p>A Set is defined mathematically as a collection of unique items. If you try to add the number <code>3</code> to a Set that already contains <code>3</code>, it simply does nothing.</p>
                            <p>By loading both arrays into Sets first, we completely eliminate the need to write complex <code>if (!list.contains(num))</code> logic to prevent duplicates in our final answer.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Vocalizing Data Structure Tradeoffs</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"This is a common warm-up question. Interviewers use it to see if you instinctively reach for Hash data structures when dealing with lookups and distinct constraints. The key is to verbally acknowledge that you are trading Space (O(N+M) for the sets) to gain Time (O(N+M) instead of O(N*M))."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge the Naive Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The brute force way would be to loop through `nums1`, and for each element, loop through the entirety of `nums2` to see if it exists. If it doesn't, we add it to our list, ensuring we don't add duplicates. This nested loop structure runs in O(N * M) time."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Hash size={16}/></div>
                               2. Pivot to Hash Sets
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "To optimize the lookups from O(M) to O(1), I will use HashSets. This also beautifully handles the 'distinct' constraint since Sets do not allow duplicates. I'll trade O(N + M) space to populate two sets."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Detail the Execution
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "First, I'll populate `set1` with all elements of `nums1`, and `set2` with `nums2`. Then, I'll instantiate `list1` and iterate over `set1`, adding any element where `!set2.contains(num)`. I'll do the exact inverse to build `list2`. Finally, I return them grouped via `Arrays.asList()`. This guarantees an O(N + M) total runtime."
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
              <div className="w-[400px] xl:w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-amber-500 shadow-amber-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 whitespace-pre-wrap flex flex-col">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-hidden shrink-0">
                        <div className="w-full">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>
                                    <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                                </React.Fragment>
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
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-amber-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-64 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>'nums1' Array</label>
                              <input type="text" value={nums1Input} onChange={(e) => setNums1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} />
                          </div>
                          <div className="w-64 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>'nums2' Array</label>
                              <input type="text" value={nums2Input} onChange={(e) => setNums2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-amber-600 hover:bg-amber-700 border-amber-400 shadow-amber-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           {renderVisuals()}
                      </div>
                  </div>
                  
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-emerald-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest text-emerald-400 max-w-lg break-words`}>
                                    Lists Generated Successfully
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