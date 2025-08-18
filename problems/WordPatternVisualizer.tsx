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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft, XSquare, ArrowRightLeft, TrendingUp, SearchCode, Languages, Link2, Puzzle
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoHashMaps: {
    id: 'twoHashMaps',
    title: '1. Two HashMaps (Intuitive)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(M)',
    code: `public boolean wordPattern(String pattern, String s) {
    String[] words = s.split(" ");
    if (words.length != pattern.length()) return false;
    
    Map<Character, String> charToWord = new HashMap<>();
    Map<String, Character> wordToChar = new HashMap<>();
    
    for (int i = 0; i < pattern.length(); i++) {
        char c = pattern.charAt(i);
        String w = words[i];
        
        // Check Character -> Word mapping
        if (charToWord.containsKey(c) && !charToWord.get(c).equals(w)) {
            return false;
        }
        
        // Check Word -> Character mapping
        if (wordToChar.containsKey(w) && wordToChar.get(w) != c) {
            return false;
        }
        
        charToWord.put(c, w);
        wordToChar.put(w, c);
    }
    
    return true;
}`,
    desc: "The standard intuitive approach. A bijection means that a character 'a' must always map to 'dog', AND 'dog' must always map back to 'a'. Two HashMaps guarantee that no two characters map to the same word, and no two words map to the same character."
  },
  mapAndSet: {
    id: 'mapAndSet',
    title: '2. Map + HashSet (Optimized)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(M)',
    code: `public boolean wordPattern(String pattern, String s) {
    String[] words = s.split(" ");
    if (words.length != pattern.length()) return false;
    
    Map<Character, String> map = new HashMap<>();
    Set<String> usedWords = new HashSet<>();
    
    for (int i = 0; i < pattern.length(); i++) {
        char c = pattern.charAt(i);
        String w = words[i];
        
        if (map.containsKey(c)) {
            // Character is mapped, check if word matches
            if (!map.get(c).equals(w)) return false;
        } else {
            // Character is NOT mapped. Check if word is already taken
            if (usedWords.contains(w)) return false;
            
            // Safe to map
            map.put(c, w);
            usedWords.add(w);
        }
    }
    
    return true;
}`,
    desc: "A cleaner, slightly optimized approach. Instead of mapping word->char, we use a single HashMap for char->word. We use a HashSet to track which words have already been assigned to a character. This avoids the object unboxing issues and makes the logic very explicit."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|char|String|Map|HashMap|Set|HashSet|Character|put|get|containsKey|contains|add|equals|split)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-400`, text: `text-indigo-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new', 'char'].includes(part);
            const isObject = ['String', 'Map', 'HashMap', 'Set', 'HashSet', 'Character'].includes(part);
            const isVar = ['s', 'pattern', 'c', 'w', 'words', 'charToWord', 'wordToChar', 'map', 'usedWords', 'i'].includes(part);
            const isMapCall = ['length', 'charAt', 'put', 'get', 'containsKey', 'contains', 'add', 'equals', 'split'].includes(part);

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-indigo-200';
            else if (isMapCall) className = 'text-sky-300';
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
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        orange: 'bg-orange-100 text-orange-700 border-orange-300',
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
  val: string | number;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
  isWide?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, isWide = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-800', index: 'bg-orange-100 text-orange-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    const widthClass = isWide ? 'px-4 min-w-[80px]' : 'min-w-[56px]';

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${widthClass} min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl px-2 py-2 bg-white/60 ${activeTheme.text}`}>
                    {val}
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

export default function WordPatternVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('mapAndSet');
  
  const [inputPattern, setInputPattern] = useState('abba');
  const [inputS, setInputS] = useState('dog cat cat dog');
  
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
  }, [inputPattern, inputS, selectedOpId]);

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
    let p = inputPattern.trim();
    let s = inputS.trim();

    if (p.length === 0 || s.length === 0) return [{ phase: 'Init', description: 'Enter pattern and string s.', line: 0, state: { pArr: [], wArr: [] } }];

    const pArr = p.split('');
    const wArr = s.split(/\s+/);

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            pArr: [...pArr],
            wArr: [...wArr],
            ...st 
        } 
    });

    if (selectedOpId === 'twoHashMaps') {
        add("Split Strings", `String[] words = s.split(" "); Array lengths: Words=${wArr.length}, Pattern=${pArr.length}.`, 2, {});
        
        add("Check Lengths", `if (words.length != pattern.length()) -> Is ${wArr.length} != ${pArr.length}?`, 3, {});
        
        if (pArr.length !== wArr.length) {
            add("Lengths Differ", `Lengths differ. return false;`, 3, { isFail: true });
            return steps;
        }

        let charToWord = new Map();
        let wordToChar = new Map();
        add("Init HashMaps", `Initialize charToWord and wordToChar maps to empty.`, 6, { charToWord: new Map(charToWord), wordToChar: new Map(wordToChar) });

        for (let i = 0; i < pArr.length; i++) {
            add("Loop Condition", `for (int i = ${i}; i < ${pArr.length}; i++) -> Check index ${i}.`, 8, { i, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar) });
            
            let c = pArr[i];
            let w = wArr[i];
            
            add("Extract Variables", `char c = '${c}';\nString w = "${w}";`, 10, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar) });

            add("Check Char->Word", `if (charToWord.containsKey('${c}') && !charToWord.get('${c}').equals("${w}"))`, 13, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar), checkC2W: c });

            if (charToWord.has(c)) {
                let mappedTo = charToWord.get(c);
                if (mappedTo !== w) {
                    add("Condition Met", `'${c}' mapped to "${mappedTo}", which is NOT "${w}". Enter if block.`, 13, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar), checkC2W: c });
                    add("Mapping Conflict (C->W)!", `return false;`, 14, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar), isFail: true, failC2W: c });
                    return steps;
                } else {
                    add("Condition Failed", `'${c}' maps to "${mappedTo}" == "${w}". Check passes.`, 13, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar) });
                }
            }

            add("Check Word->Char", `if (wordToChar.containsKey("${w}") && wordToChar.get("${w}") != '${c}')`, 18, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar), checkW2C: w });

            if (wordToChar.has(w)) {
                let mappedTo = wordToChar.get(w);
                if (mappedTo !== c) {
                    add("Condition Met", `"${w}" mapped to '${mappedTo}', which is NOT '${c}'. Enter if block.`, 18, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar), checkW2C: w });
                    add("Mapping Conflict (W->C)!", `return false;`, 19, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar), isFail: true, failW2C: w });
                    return steps;
                } else {
                    add("Condition Failed", `"${w}" maps to '${mappedTo}' == '${c}'. Check passes.`, 18, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar) });
                }
            }

            add("Record Mapping (C->W)", `charToWord.put('${c}', "${w}");`, 22, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar), justAddedC: c });
            charToWord.set(c, w);
            
            add("Record Mapping (W->C)", `wordToChar.put("${w}", '${c}');`, 23, { i, c, w, charToWord: new Map(charToWord), wordToChar: new Map(wordToChar), justAddedW: w });
            wordToChar.set(w, c);
        }

        add("Validation Complete", `Loop finishes. return true;`, 26, { charToWord: new Map(charToWord), wordToChar: new Map(wordToChar), isSuccess: true });

    } else if (selectedOpId === 'mapAndSet') {
        
        add("Split Strings", `String[] words = s.split(" ");`, 2, {});
        
        add("Check Lengths", `if (words.length != pattern.length()) -> Is ${wArr.length} != ${pArr.length}?`, 3, {});
        
        if (pArr.length !== wArr.length) {
            add("Lengths Differ", `Lengths differ. return false;`, 3, { isFail: true });
            return steps;
        }

        let map = new Map();
        let usedWords = new Set();
        
        add("Init Map & Set", `Map<Character, String> map = new HashMap<>();\nSet<String> usedWords = new HashSet<>();`, 6, { map: new Map(map), usedWords: Array.from(usedWords) });

        for (let i = 0; i < pArr.length; i++) {
            add("Loop Condition", `for (int i = ${i}; i < ${pArr.length}; i++)`, 8, { i, map: new Map(map), usedWords: Array.from(usedWords) });
            
            let c = pArr[i];
            let w = wArr[i];
            
            add("Extract Variables", `char c = '${c}'; String w = "${w}";`, 10, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords) });

            add("Check Map Contains", `if (map.containsKey('${c}'))`, 12, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords), checkingMap: c });

            if (map.has(c)) {
                add("Map Contains Char", `'${c}' is in map. Enter if block.`, 12, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords), checkingMap: c });
                let mappedTo = map.get(c);
                add("Check Equality", `if (!map.get('${c}').equals("${w}")) -> "${mappedTo}" != "${w}"?`, 14, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords), checkingMap: c });
                
                if (mappedTo !== w) {
                    add("Conflict Found!", `Conflict! return false;`, 14, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords), isFail: true, failMap: c });
                    return steps;
                } else {
                    add("Equality Passed", `Matches correctly. Proceed.`, 14, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords) });
                }
            } else {
                add("Map Missing Char", `'${c}' is NOT mapped. Enter else block.`, 15, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords) });
                add("Check Set", `if (usedWords.contains("${w}")) -> Is "${w}" taken?`, 17, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords), checkingSet: w });
                
                if (usedWords.has(w)) {
                    add("Word Taken!", `Word "${w}" already claimed. return false;`, 17, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords), isFail: true, failSet: w });
                    return steps;
                } else {
                    add("Word Available", `"${w}" is free. Proceed.`, 17, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords) });
                }
                
                add("Map Char", `map.put('${c}', "${w}");`, 20, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords), justAddedMap: c });
                map.set(c, w);
                
                add("Add Word to Set", `usedWords.add("${w}");`, 21, { i, c, w, map: new Map(map), usedWords: Array.from(usedWords), justAddedSet: w });
                usedWords.add(w);
            }
        }

        add("Validation Complete", `Loop finishes. return true;`, 25, { map: new Map(map), usedWords: Array.from(usedWords), isSuccess: true });
    }

    return steps;
  }, [inputPattern, inputS, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { pArr: [], wArr: [] } };
  const st = curStepData.state || { pArr: [], wArr: [] };
  const isLastStep = currentStep === trace.length - 1;

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Puzzle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Word Pattern</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      LC 290 • Hash Maps
                  </span>
                  <span>•</span>
                  <span>Bijection Mapping</span>
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
                <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given a <code>pattern</code> and a string <code>s</code>, find if <code>s</code> follows the same pattern.<br/><br/>
                  Here <b>follow</b> means a full match, such that there is a bijection (1-to-1 mapping) between a letter in <code>pattern</code> and a non-empty word in <code>s</code>.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> pattern = "abba", s = "dog cat cat dog"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> true</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: 'a' maps to "dog", 'b' maps to "cat". Perfect 1-to-1 match.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> pattern = "abba", s = "dog cat cat fish"</div>
                        <div><span className="text-rose-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: 'a' maps to "dog", but later 'a' tries to map to "fish". Conflict!</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 3 (Trap)</span>
                        <div><span className="text-white font-bold">Input:</span> pattern = "aaaa", s = "dog cat cat dog"</div>
                        <div><span className="text-rose-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The lengths match, but 'a' maps to "dog" then tries to map to "cat".</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= pattern.length &lt;= 300</li>
                        <li><code>pattern</code> contains only lower-case English letters.</li>
                        <li>1 &lt;= s.length &lt;= 3000</li>
                        <li><code>s</code> contains only lowercase English letters and spaces <code>' '</code>.</li>
                        <li><code>s</code> <b>does not contain</b> any leading or trailing spaces.</li>
                        <li>All the words in <code>s</code> are separated by a <b>single space</b>.</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-indigo-600 text-white border-indigo-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-indigo-200' : 'text-slate-400'}`}>{op.complexity}</div>
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
                        <div className="w-full xl:w-1/3 space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1 flex justify-between">
                                <span>Pattern</span>
                            </label>
                            <input 
                                type="text"
                                value={inputPattern} 
                                onChange={(e) => setInputPattern(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-orange-600 pl-1 flex justify-between">
                                <span>String S (Words)</span>
                            </label>
                            <input 
                                type="text"
                                value={inputS} 
                                onChange={(e) => setInputS(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center w-full xl:w-auto mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.isFail} className={`px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Valid Word Pattern</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : st.isFail ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><XCircle size={20}/> Invalid Mapping</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-indigo-500"/> Variable State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-16 pb-16 gap-10 items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Strict Flexbox Layout (No Overlaps) --- */}

                           {/* Row 1 & 2: Arrays */}
                           <div className="flex flex-col items-center gap-6 w-full">
                               {/* Pattern Array */}
                               <div className="flex flex-col items-center max-w-full">
                                   <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest font-mono mb-2">Pattern</div>
                                   <div className="flex gap-2 p-3 border border-indigo-200 bg-indigo-50/80 rounded-2xl shadow-sm backdrop-blur-sm flex-wrap justify-center">
                                       {(st.pArr || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                       {(st.pArr || []).map((char, idx) => {
                                           const isI = st.i === idx;
                                           return (
                                               <div key={`p-${idx}`} className="relative">
                                                   {isI && <PointerLabel label="i" color="indigo" position="top" />}
                                                   <NodeBlock val={char} idx={idx} themeColor={isI ? 'indigo' : 'slate'} isTarget={isI} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

                               {/* Words Array */}
                               <div className="flex flex-col items-center max-w-full">
                                   <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest font-mono mb-2">Words</div>
                                   <div className="flex gap-2 p-3 border border-orange-200 bg-orange-50/80 rounded-2xl shadow-sm backdrop-blur-sm flex-wrap justify-center">
                                       {(st.wArr || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                       {(st.wArr || []).map((word, idx) => {
                                           const isI = st.i === idx;
                                           return (
                                               <div key={`w-${idx}`} className="relative">
                                                   {isI && <PointerLabel label="i" color="orange" position="bottom" />}
                                                   <NodeBlock val={word} idx={idx} themeColor={isI ? 'orange' : 'slate'} isTarget={isI} isWide={true} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           </div>

                           {/* Row 3: HashMaps or Sets */}
                           {selectedOpId === 'twoHashMaps' && st.charToWord && st.wordToChar && (
                               <div className="flex flex-row items-start gap-8 mt-4 w-full justify-center">
                                   
                                   {/* charToWord */}
                                   <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                       <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Database size={12}/> charToWord</div>
                                       <div className="w-full bg-white border-2 border-indigo-200 rounded-xl shadow-md overflow-hidden">
                                           <div className="grid grid-cols-2 bg-indigo-50 text-[10px] font-black uppercase tracking-widest text-indigo-800 border-b border-indigo-200">
                                               <div className="p-2 text-center border-r border-indigo-200">Char</div>
                                               <div className="p-2 text-center">Word</div>
                                           </div>
                                           <div className="flex flex-col max-h-[120px] overflow-y-auto scrollbar-thin">
                                                {st.charToWord.size === 0 && <div className="p-4 text-center text-xs italic text-slate-400">Empty</div>}
                                                {Array.from(st.charToWord.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkC2W === k;
                                                    const isFail = isChecking && st.isFail && st.failC2W === k;
                                                    const isJustAdded = st.justAddedC === k;
                                                    
                                                    let rowClass = "border-b border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-indigo-100"; textClass = "text-indigo-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-sm transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-2 text-center border-r border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-2 text-center ${textClass} truncate max-w-[80px] mx-auto`} title={v}>"{v}"</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                                   {/* wordToChar */}
                                   <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                       <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Database size={12}/> wordToChar</div>
                                       <div className="w-full bg-white border-2 border-orange-200 rounded-xl shadow-md overflow-hidden">
                                           <div className="grid grid-cols-2 bg-orange-50 text-[10px] font-black uppercase tracking-widest text-orange-800 border-b border-orange-200">
                                               <div className="p-2 text-center border-r border-orange-200">Word</div>
                                               <div className="p-2 text-center">Char</div>
                                           </div>
                                           <div className="flex flex-col max-h-[120px] overflow-y-auto scrollbar-thin">
                                                {st.wordToChar.size === 0 && <div className="p-4 text-center text-xs italic text-slate-400">Empty</div>}
                                                {Array.from(st.wordToChar.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkW2C === k;
                                                    const isFail = isChecking && st.isFail && st.failW2C === k;
                                                    const isJustAdded = st.justAddedW === k;
                                                    
                                                    let rowClass = "border-b border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-orange-100"; textClass = "text-orange-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-sm transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-2 text-center border-r border-slate-100 ${textClass} truncate max-w-[80px] mx-auto`} title={k}>"{k}"</div>
                                                            <div className={`p-2 text-center ${textClass}`}>'{v}'</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                               </div>
                           )}

                           {selectedOpId === 'mapAndSet' && st.map && st.usedWords && (
                               <div className="flex flex-row items-start gap-8 mt-4 w-full justify-center">
                                    <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                       <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Database size={12}/> charToWord Map</div>
                                       <div className="w-full bg-white border-2 border-indigo-200 rounded-xl shadow-md overflow-hidden">
                                           <div className="grid grid-cols-2 bg-indigo-50 text-[10px] font-black uppercase tracking-widest text-indigo-800 border-b border-indigo-200">
                                               <div className="p-2 text-center border-r border-indigo-200">Char</div>
                                               <div className="p-2 text-center">Word</div>
                                           </div>
                                           <div className="flex flex-col max-h-[120px] overflow-y-auto scrollbar-thin">
                                                {st.map.size === 0 && <div className="p-4 text-center text-xs italic text-slate-400">Empty</div>}
                                                {Array.from(st.map.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkingMap === k;
                                                    const isFail = isChecking && st.isFail && st.failMap === k;
                                                    const isJustAdded = st.justAddedMap === k;
                                                    
                                                    let rowClass = "border-b border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-indigo-100"; textClass = "text-indigo-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-sm transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-2 text-center border-r border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-2 text-center ${textClass} truncate max-w-[80px] mx-auto`} title={v}>"{v}"</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                                   <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                       <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Hash size={12}/> usedWords Set</div>
                                       <div className="w-full bg-white border-2 border-orange-200 rounded-xl shadow-md overflow-hidden p-3 flex flex-wrap gap-2 justify-center">
                                            {st.usedWords.length === 0 && <div className="p-2 text-center text-xs italic text-slate-400">Empty</div>}
                                            {st.usedWords.map((w, idx) => {
                                                const isChecking = st.checkingSet === w;
                                                const isFail = isChecking && st.isFail && st.failSet === w;
                                                const isJustAdded = st.justAddedSet === w;
                                                
                                                let bgClass = "bg-orange-50 border-orange-200 text-orange-800";
                                                
                                                if (isFail) { bgClass = "bg-rose-100 border-rose-400 text-rose-800 font-bold scale-110"; }
                                                else if (isChecking) { bgClass = "bg-amber-100 border-amber-400 text-amber-800 font-bold"; }
                                                else if (isJustAdded) { bgClass = "bg-orange-100 border-orange-400 text-orange-800 font-bold animate-in zoom-in"; }

                                                return (
                                                    <div key={idx} className={`font-mono text-xs border rounded px-2 py-1 transition-all duration-300 ${bgClass}`}>
                                                        "{w}"
                                                    </div>
                                                )
                                            })}
                                            {st.isFail && st.failSet && !st.usedWords.includes(st.failSet) && (
                                                <div className="font-mono text-xs border-dashed border-2 rounded px-2 py-1 bg-rose-50 border-rose-300 text-rose-800 font-bold scale-110">
                                                    "{st.failSet}" ?
                                                </div>
                                            )}
                                       </div>
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Link2 size={120}/></div>
                        <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">Bijection (1-to-1 Mapping)</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Just like "Isomorphic Strings", this problem requires a perfect bijection. Every character in the pattern maps to exactly one word, and no two characters can map to the same word.</p>
                            <p>Example: If pattern="abba" and words=["dog", "cat", "cat", "dog"]:<br/>'a' → "dog"<br/>'b' → "cat"<br/>This works perfectly!</p>
                            <p>If pattern="abba" and words=["dog", "cat", "cat", "fish"]:<br/>'a' → "dog"<br/>But later 'a' sees "fish". Conflict!</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-indigo-700 text-lg uppercase tracking-widest mb-6">Why Two HashMaps?</h3>
                        <div className="space-y-4 text-sm text-indigo-900/80 leading-relaxed font-medium">
                            <p>Consider pattern="aaaa" and words=["dog", "cat", "cat", "dog"].</p>
                            <p>If we only map <code>word -&gt; char</code>: "dog" → 'a', "cat" → 'a'. This fails because two different words mapped to the same character.</p>
                            <p>If we only map <code>char -&gt; word</code>: Consider pattern="ab" and words=["dog", "dog"]. 'a' → "dog", 'b' → "dog". This fails because two different characters mapped to the same word.</p>
                            <p>We MUST check both directions to guarantee a strict 1-to-1 relationship.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-orange-50 border border-orange-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-orange-900/80 leading-relaxed font-medium">
                            <h3 className="font-black text-orange-800 text-lg uppercase tracking-widest mb-4">The Map + Set Optimization</h3>
                            <p>Instead of maintaining two full HashMaps, we can simplify our logic and save a bit of memory overhead.</p>
                            <p>We keep the <code>charToWord</code> Map. To handle the reverse check (ensuring two chars don't map to the same word), we just use a <code>HashSet</code> called <code>usedWords</code>.</p>
                            <p>When we see a character for the first time, before we assign it to a word, we check <code>if (usedWords.contains(word))</code>. If true, another character already claimed this word. It's an immediate fail!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Crushing The Bijection Test</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"This is a classic mapping problem. The interviewer wants to see two things: 1) You remember to check if lengths match after splitting. 2) You catch the directional mapping trap (where 'a' maps to 'dog' AND 'b' maps to 'dog')."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-indigo-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Scissors size={16}/></div>
                               1. Split and Length Guard
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "The first thing I'll do is split the string 's' into an array of words using space as the delimiter. Immediately after, I must check if the number of words matches the length of the pattern. If they don't match, they obviously cannot follow the pattern, so I return false early."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><ArrowRightLeft size={16}/></div>
                               2. Explain the Bijection Trap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "To verify the pattern, I need to ensure a 1-to-1 mapping. A common pitfall is only checking if the character maps to the correct word. But what if pattern is 'ab' and words are 'dog dog'? Both 'a' and 'b' would map to 'dog'. I must ensure the word isn't already mapped to a DIFFERENT character."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Database size={16}/></div>
                               3. Propose Map + Set
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "I could use two HashMaps for this, but it's cleaner to use one HashMap for Character -&gt; String, and a HashSet to simply keep track of 'usedWords'. When I encounter a new character, I check if its corresponding word is already in the HashSet. If it is, someone else claimed it, and I return false."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Zap size={16}/></div>
                               4. The Map.put() Trick (Bonus)
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "In Java, Map.put() actually returns the previous value associated with the key. Some developers use a single Map&lt;Object, Integer&gt; and put both the Char and the Word into the same map, checking if their returned indices match. While clever, I prefer the Map + Set approach as it is much more readable for team environments."
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
                          <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/50"><Code2 size={20}/></div>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Pattern</label>
                              <input type="text" value={inputPattern} onChange={(e) => setInputPattern(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                          </div>
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-orange-600 pl-1">String S (Words)</label>
                              <input type="text" value={inputS} onChange={(e) => setInputS(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-inner" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><RotateCcw size={24}/></button>
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.isFail} className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-500 shadow-indigo-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500 flex flex-col p-16 pt-32 gap-12 items-center min-w-max h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Row 1 & 2: Pattern and Words */}
                           <div className="flex flex-col items-center gap-10 w-full">
                               {/* Pattern Array */}
                               <div className="flex flex-col items-center max-w-full scale-125 origin-center">
                                   <div className="text-xs font-black text-indigo-500 uppercase tracking-widest font-mono mb-4 bg-indigo-100 px-4 py-1 rounded-full shadow-sm">Pattern</div>
                                   <div className="flex gap-4 p-5 border-[3px] border-indigo-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-md flex-wrap justify-center">
                                       {(st.pArr || []).length === 0 && <span className="text-slate-400 italic text-2xl px-10">empty</span>}
                                       {(st.pArr || []).map((char, idx) => {
                                           const isI = st.i === idx;
                                           return (
                                               <div key={`p-fs-${idx}`} className="relative scale-110 mx-2 mb-2 mt-2">
                                                   {isI && <PointerLabel label="i" color="indigo" position="top" />}
                                                   <NodeBlock val={char} idx={idx} themeColor={isI ? 'indigo' : 'slate'} isTarget={isI} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

                               {/* Words Array */}
                               <div className="flex flex-col items-center max-w-full scale-125 origin-center mt-6">
                                   <div className="text-xs font-black text-orange-500 uppercase tracking-widest font-mono mb-4 bg-orange-100 px-4 py-1 rounded-full shadow-sm">Words</div>
                                   <div className="flex gap-4 p-5 border-[3px] border-orange-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-md flex-wrap justify-center">
                                       {(st.wArr || []).length === 0 && <span className="text-slate-400 italic text-2xl px-10">empty</span>}
                                       {(st.wArr || []).map((word, idx) => {
                                           const isI = st.i === idx;
                                           return (
                                               <div key={`w-fs-${idx}`} className="relative scale-110 mx-2 mb-2 mt-2">
                                                   {isI && <PointerLabel label="i" color="orange" position="bottom" />}
                                                   <NodeBlock val={word} idx={idx} themeColor={isI ? 'orange' : 'slate'} isTarget={isI} isWide={true} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           </div>

                           {/* Row 3: HashMaps or Map/Set (Theater) */}
                           {selectedOpId === 'twoHashMaps' && st.charToWord && st.wordToChar && (
                               <div className="flex flex-row items-start gap-16 mt-16 w-full justify-center scale-125 origin-center">
                                   
                                   {/* charToWord */}
                                   <div className="flex flex-col items-center flex-1 max-w-[350px]">
                                       <div className="text-xs font-black text-indigo-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-indigo-100 px-4 py-1.5 rounded-full shadow-sm"><Database size={16}/> charToWord</div>
                                       <div className="w-full bg-white border-4 border-indigo-200 rounded-[2rem] shadow-2xl overflow-hidden">
                                           <div className="grid grid-cols-2 bg-indigo-50 text-xs font-black uppercase tracking-widest text-indigo-800 border-b-2 border-indigo-200">
                                               <div className="p-4 text-center border-r-2 border-indigo-200">Char</div>
                                               <div className="p-4 text-center">Word</div>
                                           </div>
                                           <div className="flex flex-col max-h-[250px] overflow-y-auto scrollbar-thin">
                                                {st.charToWord.size === 0 && <div className="p-8 text-center text-lg italic text-slate-400">Empty</div>}
                                                {Array.from(st.charToWord.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkC2W === k;
                                                    const isFail = isChecking && st.isFail && st.failC2W === k;
                                                    const isJustAdded = st.justAddedC === k;
                                                    
                                                    let rowClass = "border-b-2 border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-indigo-100"; textClass = "text-indigo-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-xl transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-4 text-center border-r-2 border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-4 text-center ${textClass} truncate max-w-[150px] mx-auto`}>"{v}"</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                                   {/* wordToChar */}
                                   <div className="flex flex-col items-center flex-1 max-w-[350px]">
                                       <div className="text-xs font-black text-orange-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-orange-100 px-4 py-1.5 rounded-full shadow-sm"><Database size={16}/> wordToChar</div>
                                       <div className="w-full bg-white border-4 border-orange-200 rounded-[2rem] shadow-2xl overflow-hidden">
                                           <div className="grid grid-cols-2 bg-orange-50 text-xs font-black uppercase tracking-widest text-orange-800 border-b-2 border-orange-200">
                                               <div className="p-4 text-center border-r-2 border-orange-200">Word</div>
                                               <div className="p-4 text-center">Char</div>
                                           </div>
                                           <div className="flex flex-col max-h-[250px] overflow-y-auto scrollbar-thin">
                                                {st.wordToChar.size === 0 && <div className="p-8 text-center text-lg italic text-slate-400">Empty</div>}
                                                {Array.from(st.wordToChar.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkW2C === k;
                                                    const isFail = isChecking && st.isFail && st.failW2C === k;
                                                    const isJustAdded = st.justAddedW === k;
                                                    
                                                    let rowClass = "border-b-2 border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-orange-100"; textClass = "text-orange-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-xl transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-4 text-center border-r-2 border-slate-100 ${textClass} truncate max-w-[150px] mx-auto`}>"{k}"</div>
                                                            <div className={`p-4 text-center ${textClass}`}>'{v}'</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                               </div>
                           )}

                           {selectedOpId === 'mapAndSet' && st.map && st.usedWords && (
                               <div className="flex flex-row items-start gap-16 mt-16 w-full justify-center scale-125 origin-center">
                                    <div className="flex flex-col items-center flex-1 max-w-[350px]">
                                       <div className="text-xs font-black text-indigo-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-indigo-100 px-4 py-1.5 rounded-full shadow-sm"><Database size={16}/> map (char-&gt;word)</div>
                                       <div className="w-full bg-white border-4 border-indigo-200 rounded-[2rem] shadow-2xl overflow-hidden">
                                           <div className="grid grid-cols-2 bg-indigo-50 text-xs font-black uppercase tracking-widest text-indigo-800 border-b-2 border-indigo-200">
                                               <div className="p-4 text-center border-r-2 border-indigo-200">Char</div>
                                               <div className="p-4 text-center">Word</div>
                                           </div>
                                           <div className="flex flex-col max-h-[250px] overflow-y-auto scrollbar-thin">
                                                {st.map.size === 0 && <div className="p-8 text-center text-lg italic text-slate-400">Empty</div>}
                                                {Array.from(st.map.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkingMap === k;
                                                    const isFail = isChecking && st.isFail && st.failMap === k;
                                                    const isJustAdded = st.justAddedMap === k;
                                                    
                                                    let rowClass = "border-b-2 border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-indigo-100"; textClass = "text-indigo-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-xl transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-4 text-center border-r-2 border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-4 text-center ${textClass} truncate max-w-[150px] mx-auto`}>"{v}"</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                                   <div className="flex flex-col items-center flex-1 max-w-[350px]">
                                       <div className="text-xs font-black text-orange-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-orange-100 px-4 py-1.5 rounded-full shadow-sm"><Hash size={16}/> usedWords Set</div>
                                       <div className="w-full bg-white border-4 border-orange-200 rounded-[2rem] shadow-2xl overflow-hidden p-6 flex flex-wrap gap-3 justify-center">
                                            {st.usedWords.length === 0 && <div className="p-4 text-center text-lg italic text-slate-400">Empty</div>}
                                            {st.usedWords.map((w, idx) => {
                                                const isChecking = st.checkingSet === w;
                                                const isFail = isChecking && st.isFail && st.failSet === w;
                                                const isJustAdded = st.justAddedSet === w;
                                                
                                                let bgClass = "bg-orange-50 border-orange-200 text-orange-800";
                                                
                                                if (isFail) { bgClass = "bg-rose-100 border-rose-400 text-rose-800 font-bold scale-110"; }
                                                else if (isChecking) { bgClass = "bg-amber-100 border-amber-400 text-amber-800 font-bold"; }
                                                else if (isJustAdded) { bgClass = "bg-orange-100 border-orange-400 text-orange-800 font-bold animate-in zoom-in"; }

                                                return (
                                                    <div key={idx} className={`font-mono text-xl border-2 rounded-xl px-4 py-2 transition-all duration-300 shadow-sm ${bgClass}`}>
                                                        "{w}"
                                                    </div>
                                                )
                                            })}
                                            {st.isFail && st.failSet && !st.usedWords.includes(st.failSet) && (
                                                <div className="font-mono text-xl border-dashed border-4 rounded-xl px-4 py-2 bg-rose-50 border-rose-300 text-rose-800 font-bold scale-110 shadow-md">
                                                    "{st.failSet}" ?
                                                </div>
                                            )}
                                       </div>
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
                                    {st.isSuccess ? 'VALID PATTERN' : 'INVALID MAPPING'}
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