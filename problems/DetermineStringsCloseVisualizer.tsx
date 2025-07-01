import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, SquareSquare, Mountain, Hash, Network
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalO1: {
    id: 'optimalO1',
    title: '1. Frequency Arrays (Optimal)',
    icon: <Layout size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public boolean closeStrings(String word1, String word2) {
    if (word1.length() != word2.length()) {
        return false;
    }
    int[] freq1 = new int[26];
    int[] freq2 = new int[26];
    for (char c : word1.toCharArray()) {
        freq1[c - 'a']++;
    }
    for (char c : word2.toCharArray()) {
        freq2[c - 'a']++;
    }
    for (int i = 0; i < 26; i++) {
        if ((freq1[i] == 0) != (freq2[i] == 0)) {
            return false;
        }
    }
    Arrays.sort(freq1);
    Arrays.sort(freq2);
    for (int i = 0; i < 26; i++) {
        if (freq1[i] != freq2[i]) {
            return false;
        }
    }
    return true;
}`,
    desc: "The Optimal Array approach. Because the alphabet is fixed to 26 lowercase English letters, we can use an integer array of size 26 instead of a HashMap. This reduces the Space Complexity to a pure O(1). We check if both strings contain the exact same set of unique characters, then we sort the frequency arrays to verify if they share the exact same multiset of frequencies."
  },
  hashMaps: {
    id: 'hashMaps',
    title: '2. Hash Maps (Naive)',
    icon: <Network size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    code: `public boolean closeStrings(String word1, String word2) {
    if (word1.length() != word2.length()) {
        return false;
    }
    Map<Character, Integer> map1 = new HashMap<>();
    Map<Character, Integer> map2 = new HashMap<>();
    for (char c : word1.toCharArray()) {
        map1.put(c, map1.getOrDefault(c, 0) + 1);
    }
    for (char c : word2.toCharArray()) {
        map2.put(c, map2.getOrDefault(c, 0) + 1);
    }
    if (!map1.keySet().equals(map2.keySet())) {
        return false;
    }
    List<Integer> list1 = new ArrayList<>(map1.values());
    List<Integer> list2 = new ArrayList<>(map2.values());
    Collections.sort(list1);
    Collections.sort(list2);
    return list1.equals(list2);
}`,
    desc: "The HashMap approach. We use Maps to dynamically count characters. We extract the KeySets to ensure both words contain the same distinct characters. Then, we extract the values into Lists, sort them, and compare them. While logically sound, allocating Maps and dynamic Lists introduces unnecessary O(N) space and object-wrapper overhead."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|double|int|char|return|if|else|for|while|continue|break|new|length|Math|max|min|closeStrings|word1|word2|freq1|freq2|toCharArray|Arrays|sort|Map|HashMap|List|ArrayList|Collections|keySet|values|put|getOrDefault|equals|c|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
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
            const isObject = ['String', 'Math', 'Integer', 'Character', 'Map', 'HashMap', 'List', 'ArrayList', 'Arrays', 'Collections'].includes(part);
            const isVar = ['word1', 'word2', 'freq1', 'freq2', 'map1', 'map2', 'list1', 'list2', 'c', 'i'].includes(part);
            const isMapCall = ['length', 'max', 'min', 'closeStrings', 'toCharArray', 'sort', 'keySet', 'values', 'put', 'getOrDefault', 'equals'].includes(part);
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
            <span className={`text-[9px] font-black font-mono px-1.5 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={12} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={12} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

const NodeBlock = ({ val, idx = undefined, themeColor = 'slate', isTarget = false, isDimmed = false, subtext = undefined, isMap = false, mapKey = undefined, compact = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-300', index: 'bg-slate-50 text-slate-300' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    const targetClasses = isTarget ? `ring-2 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-md z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    const dims = compact 
        ? "min-w-[28px] md:min-w-[34px] min-h-[36px] md:min-h-[44px]" 
        : "min-w-[40px] md:min-w-[48px] min-h-[48px] md:min-h-[56px]";
    const textSz = compact ? "text-sm md:text-base" : "text-xl";
    const subTextSz = compact ? "text-[7px]" : "text-[8px] md:text-[9px]";

    if (isMap) {
        return (
            <div className={`relative flex flex-col items-center group transition-all duration-500`}>
                <div className={`flex flex-col items-center min-w-[56px] md:min-w-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                    <div className={`flex w-full h-5 border-b border-black/10 ${themes['indigo'].index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">KEY: {mapKey}</span>
                        </div>
                    </div>
                    <div className={`flex-1 flex justify-center items-center w-full h-8 font-mono font-black text-xl bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter`}>
                        {displayVal}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-0.5 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {displayVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext !== undefined ? subtext : `${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function DetermineStringsCloseVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalO1');
  
  const [word1Input, setWord1Input] = useState('cabbba');
  const [word2Input, setWord2Input] = useState('abbccc');
  
  const [baseWord1, setBaseWord1] = useState('cabbba');
  const [baseWord2, setBaseWord2] = useState('abbccc');
  
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
      let clean1 = word1Input.trim().toLowerCase().replace(/[^a-z]/g, '');
      let clean2 = word2Input.trim().toLowerCase().replace(/[^a-z]/g, '');
      
      if (!clean1) clean1 = 'cabbba';
      if (!clean2) clean2 = 'abbccc';
      
      if (clean1.length > 15) clean1 = clean1.slice(0, 15);
      if (clean2.length > 15) clean2 = clean2.slice(0, 15);

      setBaseWord1(clean1);
      setBaseWord2(clean2);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [word1Input, word2Input, selectedOpId]);

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
    if (!baseWord1 || !baseWord2) return [{ phase: 'Init', description: 'Enter valid words.', line: 1, state: {} }];

    const w1 = baseWord1;
    const w2 = baseWord2;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { w1, w2, len1: w1.length, len2: w2.length, ...st } 
    });

    if (selectedOpId === 'optimalO1') {
        let freq1 = Array(26).fill(0);
        let freq2 = Array(26).fill(0);
        
        add("Function Call", `public boolean closeStrings(String word1, String word2)`, 1, { freq1: [...freq1], freq2: [...freq2] });
        
        add("Check Lengths", `if (word1.length() != word2.length())\nAre lengths different? (${w1.length} != ${w2.length}?)`, 2, { freq1: [...freq1], freq2: [...freq2], isCheckingLen: true });
        if (w1.length !== w2.length) {
            add("Length Mismatch", `return false;\nStrings of different lengths can never be close.`, 3, { freq1: [...freq1], freq2: [...freq2], isSuccess: true, finalAns: false });
            return steps;
        }
        
        add("Init Frequency Arrays", `int[] freq1 = new int[26];\nint[] freq2 = new int[26];\nO(1) memory since alphabet is exactly 26 lowercase letters.`, 5, { freq1: [...freq1], freq2: [...freq2] });
        
        for (let i = 0; i < w1.length; i++) {
            let char = w1[i];
            let cIdx = char.charCodeAt(0) - 97;
            add("Loop word1", `for (char c : word1.toCharArray())\nProcessing '${char}'.`, 7, { freq1: [...freq1], freq2: [...freq2], w1Iter: i, char });
            freq1[cIdx]++;
            add("Increment freq1", `freq1[c - 'a']++;\nIncremented freq1['${char}'].`, 8, { freq1: [...freq1], freq2: [...freq2], w1Iter: i, char, hlFreq1: cIdx });
        }
        
        for (let i = 0; i < w2.length; i++) {
            let char = w2[i];
            let cIdx = char.charCodeAt(0) - 97;
            add("Loop word2", `for (char c : word2.toCharArray())\nProcessing '${char}'.`, 10, { freq1: [...freq1], freq2: [...freq2], w2Iter: i, char });
            freq2[cIdx]++;
            add("Increment freq2", `freq2[c - 'a']++;\nIncremented freq2['${char}'].`, 11, { freq1: [...freq1], freq2: [...freq2], w2Iter: i, char, hlFreq2: cIdx });
        }

        // Presence Check
        for (let i = 0; i < 26; i++) {
            add("Loop Alphabet", `for (int i = ${i}; i < 26; i++)\nChecking presence for character '${String.fromCharCode(97 + i)}'.`, 13, { freq1: [...freq1], freq2: [...freq2], alphaIter: i, isPresenceCheck: true });
            let f1Zero = freq1[i] === 0;
            let f2Zero = freq2[i] === 0;
            add("Check Presence Match", `if ((freq1[i] == 0) != (freq2[i] == 0))\nIs one string missing '${String.fromCharCode(97 + i)}' while the other has it?`, 14, { freq1: [...freq1], freq2: [...freq2], alphaIter: i, isPresenceCheck: true, hlFreq1: i, hlFreq2: i });
            
            if (f1Zero !== f2Zero) {
                add("Mismatch Found", `return false;\nSets of unique characters must be exactly the same!`, 15, { freq1: [...freq1], freq2: [...freq2], alphaIter: i, isSuccess: true, finalAns: false, hlFreq1: i, hlFreq2: i, isMismatch: true });
                return steps;
            }
        }
        
        let sortedFreq1 = [...freq1].sort((a, b) => Number(a) - Number(b));
        add("Sort freq1", `Arrays.sort(freq1);\nSorting the multiset of frequencies for word1.`, 18, { freq1: sortedFreq1, freq2: [...freq2], isSorted1: true });
        
        let sortedFreq2 = [...freq2].sort((a, b) => Number(a) - Number(b));
        add("Sort freq2", `Arrays.sort(freq2);\nSorting the multiset of frequencies for word2.`, 19, { freq1: sortedFreq1, freq2: sortedFreq2, isSorted1: true, isSorted2: true });

        // Equality Check
        for (let i = 0; i < 26; i++) {
            add("Loop Sorted Arrays", `for (int i = ${i}; i < 26; i++)\nComparing sorted frequency arrays.`, 20, { freq1: sortedFreq1, freq2: sortedFreq2, isSorted1: true, isSorted2: true, sortIter: i });
            
            let mismatch = sortedFreq1[i] !== sortedFreq2[i];
            add("Compare Frequencies", `if (freq1[i] != freq2[i])\nDoes freq1[${i}] == freq2[${i}]? (${!mismatch ? 'Yes' : 'No'})`, 21, { freq1: sortedFreq1, freq2: sortedFreq2, isSorted1: true, isSorted2: true, sortIter: i, hlFreq1: i, hlFreq2: i });
            
            if (mismatch) {
                add("Frequency Mismatch", `return false;\nMultisets of frequencies do not match!`, 22, { freq1: sortedFreq1, freq2: sortedFreq2, isSorted1: true, isSorted2: true, sortIter: i, isSuccess: true, finalAns: false, hlFreq1: i, hlFreq2: i, isMismatch: true });
                return steps;
            }
        }
        
        add("Loop End", `for (int i = 26; i < 26; i++)\nCondition is false.`, 20, { freq1: sortedFreq1, freq2: sortedFreq2, isSorted1: true, isSorted2: true });
        add("Return True", `return true;\nBoth length, unique sets, and frequency multisets matched! Strings are close.`, 25, { freq1: sortedFreq1, freq2: sortedFreq2, isSorted1: true, isSorted2: true, isSuccess: true, finalAns: true });

    } else if (selectedOpId === 'hashMaps') {
        let map1 = {};
        let map2 = {};
        
        add("Function Call", `public boolean closeStrings(String word1, String word2)`, 1, { map1: {...map1}, map2: {...map2} });
        
        add("Check Lengths", `if (word1.length() != word2.length())\nAre lengths different?`, 2, { map1: {...map1}, map2: {...map2}, isCheckingLen: true });
        if (w1.length !== w2.length) {
            add("Length Mismatch", `return false;\nStrings of different lengths can never be close.`, 3, { map1: {...map1}, map2: {...map2}, isSuccess: true, finalAns: false });
            return steps;
        }
        
        add("Init Maps", `Map<Character, Integer> map1 = new HashMap<>();\nMap<Character, Integer> map2 = new HashMap<>();`, 5, { map1: {...map1}, map2: {...map2} });
        
        for (let i = 0; i < w1.length; i++) {
            let char = w1[i];
            add("Loop word1", `for (char c : word1.toCharArray())\nProcessing '${char}'.`, 7, { map1: {...map1}, map2: {...map2}, w1Iter: i, char });
            let prev = map1[char] || 0;
            map1[char] = prev + 1;
            add("Put Map1", `map1.put(c, map1.getOrDefault(c, 0) + 1);`, 8, { map1: {...map1}, map2: {...map2}, w1Iter: i, char, hlMap1Key: char });
        }
        
        for (let i = 0; i < w2.length; i++) {
            let char = w2[i];
            add("Loop word2", `for (char c : word2.toCharArray())\nProcessing '${char}'.`, 10, { map1: {...map1}, map2: {...map2}, w2Iter: i, char });
            let prev = map2[char] || 0;
            map2[char] = prev + 1;
            add("Put Map2", `map2.put(c, map2.getOrDefault(c, 0) + 1);`, 11, { map1: {...map1}, map2: {...map2}, w2Iter: i, char, hlMap2Key: char });
        }
        
        let keys1 = Object.keys(map1).sort().join('');
        let keys2 = Object.keys(map2).sort().join('');
        add("Check KeySets", `if (!map1.keySet().equals(map2.keySet()))\nDo both maps share the exact same keys (characters)?`, 13, { map1: {...map1}, map2: {...map2}, isCheckingKeys: true });
        
        if (keys1 !== keys2) {
            add("KeySet Mismatch", `return false;\nSets of unique characters must be exactly the same!`, 14, { map1: {...map1}, map2: {...map2}, isCheckingKeys: true, isSuccess: true, finalAns: false });
            return steps;
        }
        
        let list1 = Object.values(map1);
        let list2 = Object.values(map2);
        
        add("Init Lists", `List<Integer> list1 = new ArrayList<>(map1.values());\nList<Integer> list2 = new ArrayList<>(map2.values());`, 16, { map1: {...map1}, map2: {...map2}, list1: [...list1], list2: [...list2] });
        
        list1.sort((a, b) => Number(a) - Number(b));
        add("Sort List1", `Collections.sort(list1);`, 18, { map1: {...map1}, map2: {...map2}, list1: [...list1], list2: [...list2], isSorted1: true });
        
        list2.sort((a, b) => Number(a) - Number(b));
        add("Sort List2", `Collections.sort(list2);`, 19, { map1: {...map1}, map2: {...map2}, list1: [...list1], list2: [...list2], isSorted1: true, isSorted2: true });
        
        let isEq = JSON.stringify(list1) === JSON.stringify(list2);
        add("Compare Lists", `return list1.equals(list2);\nAre the sorted frequencies identical? (${isEq})`, 20, { map1: {...map1}, map2: {...map2}, list1: [...list1], list2: [...list2], isSorted1: true, isSorted2: true, isComparingLists: true });
        
        add("Return Result", `return ${isEq};`, 20, { map1: {...map1}, map2: {...map2}, list1: [...list1], list2: [...list2], isSorted1: true, isSorted2: true, isSuccess: true, finalAns: isEq });
    }

    return steps;
  }, [baseWord1, baseWord2, selectedOpId]);

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

  const themeColor = selectedOpId === 'optimalO1' ? 'emerald' : 'sky';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.w1 === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-6 w-full">
              
              {/* String Inputs */}
              <div className="flex flex-col xl:flex-row w-full max-w-6xl gap-4 items-start justify-center">
                  <div className="flex flex-col items-start flex-1 w-full">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Type size={12}/> word1</span>
                      <div className={`flex gap-1 p-3 border-[3px] bg-white/90 rounded-[2rem] shadow-sm flex-wrap justify-start items-center w-full min-h-[60px] ${st.isCheckingLen ? 'border-amber-300 ring-4 ring-amber-100' : 'border-emerald-200'}`}>
                          {st.w1.split('').map((char, idx) => {
                              let isHl = st.w1Iter === idx;
                              return (
                                  <React.Fragment key={`w1-${idx}`}>
                                      <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1' : 'scale-100 z-10 m-0.5'}`}>
                                          {isHl && (
                                              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                <PointerLabel label="i" color="emerald" position="bottom" />
                                              </div>
                                          )}
                                          <NodeBlock val={char} themeColor={isHl ? "emerald" : "slate"} isTarget={isHl} compact={true}/>
                                      </div>
                                  </React.Fragment>
                              )
                          })}
                      </div>
                  </div>
                  
                  <div className="flex flex-col items-start flex-1 w-full">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><Type size={12}/> word2</span>
                      <div className={`flex gap-1 p-3 border-[3px] bg-white/90 rounded-[2rem] shadow-sm flex-wrap justify-start items-center w-full min-h-[60px] ${st.isCheckingLen ? 'border-amber-300 ring-4 ring-amber-100' : 'border-sky-200'}`}>
                          {st.w2.split('').map((char, idx) => {
                              let isHl = st.w2Iter === idx;
                              return (
                                  <React.Fragment key={`w2-${idx}`}>
                                      <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1' : 'scale-100 z-10 m-0.5'}`}>
                                          {isHl && (
                                              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                <PointerLabel label="i" color="sky" position="bottom" />
                                              </div>
                                          )}
                                          <NodeBlock val={char} themeColor={isHl ? "sky" : "slate"} isTarget={isHl} compact={true}/>
                                      </div>
                                  </React.Fragment>
                              )
                          })}
                      </div>
                  </div>
              </div>

              {/* Optimal Array Visualization (A-Z Grids) */}
              {selectedOpId === 'optimalO1' && st.freq1 && (
                  <div className="flex flex-col xl:flex-row w-full max-w-6xl gap-6 items-start justify-center mt-2 animate-in slide-in-from-bottom-8">
                      {/* freq1 Array */}
                      <div className="flex flex-col items-start flex-1 w-full">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Layout size={12}/> freq1[26] Array</span>
                          <div className={`flex gap-0.5 p-3 border-[3px] border-emerald-200 bg-emerald-50/30 rounded-[2rem] shadow-lg flex-wrap justify-center items-center w-full min-h-[140px] ${st.isPresenceCheck || st.sortIter !== undefined ? 'ring-4 ring-amber-100' : ''}`}>
                              {st.freq1.map((val, idx) => {
                                  let isHl = false;
                                  let color = 'slate';
                                  if (st.hlFreq1 === idx) { isHl = true; color = st.isMismatch ? 'rose' : 'emerald'; }
                                  else if (val > 0 && !st.isSorted1) { color = 'emerald'; }
                                  else if (st.alphaIter === idx || st.sortIter === idx) { color = 'amber'; }
                                  
                                  let letter = String.fromCharCode(97 + idx);

                                  return (
                                      <React.Fragment key={`f1-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-125 z-20 mx-1' : 'scale-100 z-10 m-0.5'}`}>
                                              <NodeBlock val={val} subtext={st.isSorted1 ? undefined : letter} themeColor={color} isTarget={isHl} compact={true} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                          </div>
                      </div>

                      {/* freq2 Array */}
                      <div className="flex flex-col items-start flex-1 w-full">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><Layout size={12}/> freq2[26] Array</span>
                          <div className={`flex gap-0.5 p-3 border-[3px] border-sky-200 bg-sky-50/30 rounded-[2rem] shadow-lg flex-wrap justify-center items-center w-full min-h-[140px] ${st.isPresenceCheck || st.sortIter !== undefined ? 'ring-4 ring-amber-100' : ''}`}>
                              {st.freq2.map((val, idx) => {
                                  let isHl = false;
                                  let color = 'slate';
                                  if (st.hlFreq2 === idx) { isHl = true; color = st.isMismatch ? 'rose' : 'sky'; }
                                  else if (val > 0 && !st.isSorted2) { color = 'sky'; }
                                  else if (st.alphaIter === idx || st.sortIter === idx) { color = 'amber'; }
                                  
                                  let letter = String.fromCharCode(97 + idx);

                                  return (
                                      <React.Fragment key={`f2-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-125 z-20 mx-1' : 'scale-100 z-10 m-0.5'}`}>
                                              <NodeBlock val={val} subtext={st.isSorted2 ? undefined : letter} themeColor={color} isTarget={isHl} compact={true} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                          </div>
                      </div>
                  </div>
              )}

              {/* Hash Maps Visualization (Naive) */}
              {selectedOpId === 'hashMaps' && st.map1 && (
                  <div className="flex flex-col items-center w-full max-w-6xl gap-6 mt-4">
                      <div className="flex flex-col xl:flex-row w-full gap-6">
                          <div className="flex flex-col items-start w-full flex-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Network size={12}/> map1 (HashMap)</span>
                              <div className={`flex gap-2 p-4 border-[3px] border-indigo-200 bg-indigo-50/50 rounded-[2rem] shadow-md flex-wrap justify-start items-center w-full min-h-[90px] ${st.isCheckingKeys ? 'ring-4 ring-amber-300' : ''}`}>
                                  {Object.entries(st.map1).map(([keyStr, val]) => {
                                      let isHl = st.hlMap1Key === keyStr;
                                      return (
                                          <React.Fragment key={`m1-${keyStr}`}>
                                              <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 animate-in zoom-in' : 'scale-100 z-10'}`}>
                                                  <NodeBlock val={val} mapKey={keyStr} themeColor={isHl ? 'emerald' : 'indigo'} isMap={true} />
                                              </div>
                                          </React.Fragment>
                                      )
                                  })}
                                  {Object.keys(st.map1).length === 0 && <span className="text-indigo-300 italic text-sm font-mono px-4">empty</span>}
                              </div>
                          </div>
                          <div className="flex flex-col items-start w-full flex-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Network size={12}/> map2 (HashMap)</span>
                              <div className={`flex gap-2 p-4 border-[3px] border-indigo-200 bg-indigo-50/50 rounded-[2rem] shadow-md flex-wrap justify-start items-center w-full min-h-[90px] ${st.isCheckingKeys ? 'ring-4 ring-amber-300' : ''}`}>
                                  {Object.entries(st.map2).map(([keyStr, val]) => {
                                      let isHl = st.hlMap2Key === keyStr;
                                      return (
                                          <React.Fragment key={`m2-${keyStr}`}>
                                              <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 animate-in zoom-in' : 'scale-100 z-10'}`}>
                                                  <NodeBlock val={val} mapKey={keyStr} themeColor={isHl ? 'sky' : 'indigo'} isMap={true} />
                                              </div>
                                          </React.Fragment>
                                      )
                                  })}
                                  {Object.keys(st.map2).length === 0 && <span className="text-indigo-300 italic text-sm font-mono px-4">empty</span>}
                              </div>
                          </div>
                      </div>

                      {/* Lists */}
                      {st.list1 && st.list1.length > 0 && (
                           <div className="flex flex-col xl:flex-row w-full gap-6 animate-in slide-in-from-bottom-4">
                                <div className="flex flex-col items-start w-full flex-1">
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><Layout size={12}/> list1 (Values)</span>
                                    <div className={`flex gap-1 p-3 border-[3px] border-emerald-200 bg-white/90 rounded-[2rem] shadow-sm flex-wrap justify-start items-center w-full min-h-[60px] ${st.isComparingLists ? 'ring-4 ring-amber-300' : ''}`}>
                                        {st.list1.map((val, idx) => (
                                            <React.Fragment key={`l1-${idx}`}>
                                                <div className={`relative transition-all duration-300 scale-100 m-0.5`}>
                                                    <NodeBlock val={val} themeColor="emerald" compact={true}/>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-start w-full flex-1">
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><Layout size={12}/> list2 (Values)</span>
                                    <div className={`flex gap-1 p-3 border-[3px] border-sky-200 bg-white/90 rounded-[2rem] shadow-sm flex-wrap justify-start items-center w-full min-h-[60px] ${st.isComparingLists ? 'ring-4 ring-amber-300' : ''}`}>
                                        {st.list2.map((val, idx) => (
                                            <React.Fragment key={`l2-${idx}`}>
                                                <div className={`relative transition-all duration-300 scale-100 m-0.5`}>
                                                    <NodeBlock val={val} themeColor="sky" compact={true}/>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                           </div>
                      )}
                  </div>
              )}

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-sky-600'}`}>
                <ArrowRightLeft className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Determine if Two Strings Are Close</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-sky-600 bg-sky-50'}`}>
                      LC 1657 • Arrays / Hash Maps
                  </span>
                  <span>•</span>
                  <span>O(N) Time Constraint</span>
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
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <div className="text-base leading-relaxed">
                  Two strings are considered <strong>close</strong> if you can attain one from the other using the following operations:<br/><br/>
                  <ul className="list-disc pl-8 space-y-2">
                    <li><strong>Operation 1:</strong> Swap any two <em>existing</em> characters. (e.g., <code>a<u>b</u>cd<u>e</u></code> -&gt; <code>a<u>e</u>cd<u>b</u></code>)</li>
                    <li><strong>Operation 2:</strong> Transform <em>every</em> occurrence of one existing character into another existing character, and do the same with the other character. (e.g., <code><u>aa</u>c<u>abb</u></code> -&gt; <code><u>bb</u>c<u>baa</u></code>, all 'a's turn to 'b's and vice versa).</li>
                  </ul>
                  <br/>
                  Given two strings, <code>word1</code> and <code>word2</code>, return <code>true</code> if they are close, and <code>false</code> otherwise.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> word1 = "cabbba", word2 = "abbccc"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> true</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
Both contain exactly the set {"{'a', 'b', 'c'}"}.
word1 frequencies: a:2, b:3, c:1. (Sorted: 1, 2, 3)
word2 frequencies: a:1, b:2, c:3. (Sorted: 1, 2, 3)
Because the frequency multisets match, Operation 2 can transform the strings.
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> word1 = "uau", word2 = "ssx"</div>
                        <div><span className="text-rose-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
word1 has characters {"{'u', 'a'}"}.
word2 has characters {"{'s', 'x'}"}.
The sets of distinct characters do not match, so Operation 2 is impossible.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= word1.length, word2.length &lt;= 10⁵</li>
                        <li><code>word1</code> and <code>word2</code> contain only lowercase English letters.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                            Trap: Attempting to actually simulate the swaps will TLE. You must realize that Operations 1 & 2 mathematically translate to: "Do they have the same unique characters?" AND "Do they have the exact same multiset of frequencies?"
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
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-sky-600 text-white border-sky-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-sky-200') : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                                <span>'word1' String</span>
                            </label>
                            <input 
                                type="text"
                                value={word1Input} 
                                onChange={(e) => setWord1Input(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} 
                                spellCheck={false}
                                placeholder="cabbba"
                            />
                        </div>
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                                <span>'word2' String</span>
                            </label>
                            <input 
                                type="text"
                                value={word2Input} 
                                onChange={(e) => setWord2Input(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} 
                                spellCheck={false}
                                placeholder="abbccc"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-sky-600 shadow-sky-200 hover:bg-sky-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns === true ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.finalAns === true ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.finalAns === true ? <PartyPopper size={20}/> : <XCircle size={20}/>} Evaluation Complete
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-sky-500'}`}><Layout size={14}/> Memory Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-sky-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-sky-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-sky-600'}`}><Maximize2 size={16}/></button>
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">Breaking Down "Close Strings"</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>The problem lists two allowed operations: swapping any two characters, or transforming all occurrences of one character into another.</p>
                            <p>We don't need to simulate this. We just need to check the invariants that these operations preserve:</p>
                            <p><strong>1. Same Unique Characters:</strong> You can only swap existing characters. If <code>word1</code> has an 'x' and <code>word2</code> doesn't, no operation can fix this.</p>
                            <p><strong>2. Same Frequency Multiset:</strong> If <code>word1</code> has counts [1, 2, 3], and <code>word2</code> has counts [3, 2, 1], Operation 2 guarantees we can map the characters to the correct frequencies.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">The O(1) Memory Array Trick</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>Normally, tracking frequencies requires a HashMap (O(N) space).</p>
                            <p>However, the constraints clearly state that the strings contain <strong>only lowercase English letters</strong>.</p>
                            <p>Because the alphabet is fixed to exactly 26 letters, we can use a basic integer array of size 26! The letter 'a' maps to index 0, 'b' to 1, and so on. Since the array size never scales with the input size N, this is mathematically <strong>O(1) Space Complexity</strong>.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Vocalizing the Abstraction</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers use this question to test your ability to abstract operations into mathematical invariants. If you try to write code that actually swaps characters, you will fail. The key is to immediately tell the interviewer: 'Because of Operation 1 and 2, this just means they need the exact same set of unique characters, and the exact same set of frequencies.'"</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Network size={16}/></div>
                               1. Acknowledge the Hash Map Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "My initial thought is to use two HashMaps to count frequencies, compare their key sets to ensure they have the same distinct characters, and then extract their values into lists, sort them, and compare the lists. While this works in O(N log N) time, it takes O(N) space and has a lot of object overhead."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Layout size={16}/></div>
                               2. Pivot to Constant Space Arrays
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Because the problem constraints restrict the strings to lowercase English letters, I can optimize this heavily. Instead of HashMaps, I'll use two integer arrays of size 26. Since the size is strictly 26 regardless of string length, the space complexity becomes a pure O(1)."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Detail the Execution
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "First, I'll return false if the string lengths mismatch. Then I'll populate my two 26-length frequency arrays. I'll loop from 0 to 25 to verify that both arrays have zeros at the exact same indices (ensuring the sets of unique characters match). Then, I'll call `Arrays.sort()` on both frequency arrays. Finally, I check if `freq1[i] == freq2[i]` for all 26 indices. This solves it optimally in O(N) time and O(1) space."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-sky-500 shadow-sky-900/50'}`}><Code2 size={20}/></div>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns === true ? 'bg-emerald-900/40 border-emerald-800' : 'bg-rose-900/40 border-rose-800') : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-sky-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-48 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>'word1' String</label>
                              <input type="text" value={word1Input} onChange={(e) => setWord1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} />
                          </div>
                          <div className="w-48 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>'word2' String</label>
                              <input type="text" value={word2Input} onChange={(e) => setWord2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-sky-600 hover:bg-sky-700 border-sky-400 shadow-sky-900/30'}`}>NEXT <ChevronRight size={32}/></button>
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns === true ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns === true ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.finalAns === true ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.finalAns === true ? <PartyPopper size={48} /> : <XCircle size={48} />}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest ${st.finalAns === true ? 'text-emerald-400' : 'text-rose-400'} max-w-lg break-words`}>
                                    Result: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns === true ? 'TRUE' : 'FALSE'}</span>
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.finalAns === true ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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