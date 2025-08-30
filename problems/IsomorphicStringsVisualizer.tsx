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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft, XSquare, ArrowRightLeft, TrendingUp, SearchCode, Languages, Link2
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoHashMaps: {
    id: 'twoHashMaps',
    title: '1. Two HashMaps (Intuitive)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public boolean isIsomorphic(String s, String t) {
    if (s.length() != t.length()) return false;
    
    Map<Character, Character> mapS2T = new HashMap<>();
    Map<Character, Character> mapT2S = new HashMap<>();
    
    for (int i = 0; i < s.length(); i++) {
        char c1 = s.charAt(i);
        char c2 = t.charAt(i);
        
        // Check if S->T mapping is consistent
        if (mapS2T.containsKey(c1) && mapS2T.get(c1) != c2) {
            return false;
        }
        
        // Check if T->S mapping is consistent
        if (mapT2S.containsKey(c2) && mapT2S.get(c2) != c1) {
            return false;
        }
        
        // Record the exact 1-to-1 mapping
        mapS2T.put(c1, c2);
        mapT2S.put(c2, c1);
    }
    
    return true;
}`,
    desc: "The most intuitive approach. Isomorphic strings require a strict 1-to-1 bijection mapping. Character 'a' in String S must always map to 'x' in String T, AND 'x' in String T must exclusively map back to 'a'. Using two HashMaps ensures no two characters map to the same character."
  },
  arrayIndexMapping: {
    id: 'arrayIndexMapping',
    title: '2. Array Last-Seen (Optimal)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public boolean isIsomorphic(String s, String t) {
    if (s.length() != t.length()) return false;
    
    // Arrays to store the last seen index (+1) of characters
    int[] map1 = new int[256];
    int[] map2 = new int[256];
    
    for (int i = 0; i < s.length(); i++) {
        char c1 = s.charAt(i);
        char c2 = t.charAt(i);
        
        // If their last seen positions differ, they are not isomorphic
        if (map1[c1] != map2[c2]) {
            return false;
        }
        
        // Update their last seen positions to current index + 1
        map1[c1] = i + 1;
        map2[c2] = i + 1;
    }
    
    return true;
}`,
    desc: "The hyper-optimized approach. Instead of mapping characters to characters, we track the *last seen index* of each character using a fixed integer array (size 256 for ASCII). If s[i] and t[i] have different last-seen indices, the mapping is broken. We store 'i + 1' to handle the default 0 initialization."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|char|String|Map|HashMap|Character|put|get|containsKey)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-violet-500/20`, border: `border-violet-400`, text: `text-violet-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-violet-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new', 'char'].includes(part);
            const isObject = ['String', 'Map', 'HashMap', 'Character'].includes(part);
            const isVar = ['s', 't', 'c1', 'c2', 'mapS2T', 'mapT2S', 'map1', 'map2', 'i'].includes(part);
            const isMapCall = ['length', 'charAt', 'put', 'get', 'containsKey'].includes(part);

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-violet-200';
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
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        violet: 'bg-violet-100 text-violet-700 border-violet-300',
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
  char: string | number;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
  shape?: 'square' | 'pill';
}

const CharNodeBlock: React.FC<CharNodeBlockProps> = ({ char, idx, themeColor = 'slate', isTarget, shape = 'square' }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-800', index: 'bg-violet-100 text-violet-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    const rounding = shape === 'pill' ? 'rounded-full' : 'rounded-xl';

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[56px] min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} ${rounding} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl px-2 py-2 bg-white/60 ${activeTheme.text}`}>
                    {char}
                </div>
                {idx !== undefined && shape === 'square' && (
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

export default function IsomorphicStringsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('twoHashMaps');
  
  const [inputS, setInputS] = useState('egg');
  const [inputT, setInputT] = useState('add');
  
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
    let s = inputS;
    let t = inputT;

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

    if (selectedOpId === 'twoHashMaps') {
        
        add("Check Lengths", `if (s.length() != t.length()) -> Is ${s.length} != ${t.length}?`, 2, {});
        
        if (s.length !== t.length) {
            add("Lengths Differ", `Strings have different lengths. They cannot be isomorphic. Return false.`, 2, { isFail: true });
            return steps;
        }

        let mapS2T = new Map();
        let mapT2S = new Map();
        add("Init HashMaps", `Create mapS2T (maps chars from S to T) and mapT2S (maps chars from T to S).`, 5, { mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S) });

        for (let i = 0; i < s.length; i++) {
            add("Loop Execution", `for (int i = ${i}; i < ${s.length}; i++) -> Read chars at index ${i}.`, 7, { i, mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S) });
            
            let c1 = s[i];
            let c2 = t[i];
            
            add("Extract Chars", `c1 = '${c1}', c2 = '${c2}'.`, 9, { i, c1, c2, mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S) });

            add("Check S->T Map", `if (mapS2T.containsKey('${c1}')) -> Has '${c1}' been mapped before?`, 12, { i, c1, c2, mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S), checkingS2T: c1 });

            if (mapS2T.has(c1)) {
                let mappedTo = mapS2T.get(c1);
                add("Verify S->T Mapping", `'${c1}' is mapped to '${mappedTo}'. Does it equal '${c2}'?`, 12, { i, c1, c2, mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S), checkingS2T: c1 });
                
                if (mappedTo !== c2) {
                    add("Mapping Conflict (S->T)!", `Conflict! '${c1}' mapped to '${mappedTo}' previously, but now maps to '${c2}'. Return false.`, 13, { i, c1, c2, mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S), isFail: true, failS2T: c1 });
                    return steps;
                }
            }

            add("Check T->S Map", `if (mapT2S.containsKey('${c2}')) -> Has '${c2}' been mapped backwards before?`, 17, { i, c1, c2, mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S), checkingT2S: c2 });

            if (mapT2S.has(c2)) {
                let mappedTo = mapT2S.get(c2);
                add("Verify T->S Mapping", `'${c2}' is mapped back to '${mappedTo}'. Does it equal '${c1}'?`, 17, { i, c1, c2, mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S), checkingT2S: c2 });
                
                if (mappedTo !== c1) {
                    add("Mapping Conflict (T->S)!", `Conflict! Two different characters in S map to '${c2}' in T. Return false.`, 18, { i, c1, c2, mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S), isFail: true, failT2S: c2 });
                    return steps;
                }
            }

            mapS2T.set(c1, c2);
            mapT2S.set(c2, c1);
            add("Record Mapping", `Put mapping ('${c1}' -> '${c2}') in mapS2T. Put mapping ('${c2}' -> '${c1}') in mapT2S.`, 22, { i, c1, c2, mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S), justAddedS: c1, justAddedT: c2 });
        }

        add("Validation Complete", `All characters processed successfully with consistent 1-to-1 mappings. Return true.`, 25, { mapS2T: new Map(mapS2T), mapT2S: new Map(mapT2S), isSuccess: true });

    } else if (selectedOpId === 'arrayIndexMapping') {
        
        add("Check Lengths", `if (s.length() != t.length()) -> Is ${s.length} != ${t.length}?`, 2, {});
        
        if (s.length !== t.length) {
            add("Lengths Differ", `Strings have different lengths. Return false.`, 2, { isFail: true });
            return steps;
        }

        // Store maps in state for visualizer mapping up to char length
        let map1 = {}; 
        let map2 = {};
        
        add("Init Array Maps", `Allocate map1 = int[256] and map2 = int[256] initialized to 0s. (We visualize only non-zero entries).`, 6, { map1: {...map1}, map2: {...map2} });

        for (let i = 0; i < s.length; i++) {
            add("Loop Execution", `for (int i = ${i}; i < ${s.length}; i++) -> Look at index ${i}.`, 8, { i, map1: {...map1}, map2: {...map2} });
            
            let c1 = s[i];
            let c2 = t[i];
            
            add("Extract Chars", `c1 = '${c1}', c2 = '${c2}'.`, 10, { i, c1, c2, map1: {...map1}, map2: {...map2} });

            let lastSeen1 = map1[c1] || 0;
            let lastSeen2 = map2[c2] || 0;

            add("Compare Last Seen", `if (map1['${c1}'] != map2['${c2}']) -> Is ${lastSeen1} != ${lastSeen2}?`, 13, { i, c1, c2, map1: {...map1}, map2: {...map2}, checkingIdx: true });

            if (lastSeen1 !== lastSeen2) {
                add("Mismatch Found!", `Last seen indices do not match (${lastSeen1} vs ${lastSeen2}). Structure is broken. Return false.`, 14, { i, c1, c2, map1: {...map1}, map2: {...map2}, isFail: true, checkingIdx: true });
                return steps;
            }

            map1[c1] = i + 1;
            map2[c2] = i + 1;
            
            add("Update Maps", `Update both maps to index + 1 (${i + 1}). map1['${c1}'] = ${i+1}; map2['${c2}'] = ${i+1};`, 18, { i, c1, c2, map1: {...map1}, map2: {...map2}, justUpdatedS: c1, justUpdatedT: c2 });
        }

        add("Validation Complete", `All characters processed. Mappings were consistent. Return true.`, 21, { map1: {...map1}, map2: {...map2}, isSuccess: true });
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
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Link2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Isomorphic Strings</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                      LC 205 • Hash Maps
                  </span>
                  <span>•</span>
                  <span>1-to-1 Mapping</span>
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
                <div className="flex items-center gap-3 text-violet-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given two strings <code>s</code> and <code>t</code>, determine if they are isomorphic.<br/><br/>
                  Two strings <code>s</code> and <code>t</code> are isomorphic if the characters in <code>s</code> can be replaced to get <code>t</code>. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s = "egg", t = "add"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> true</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: 'e' maps to 'a'. 'g' maps to 'd'. The mapping is strictly 1-to-1.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> s = "foo", t = "bar"</div>
                        <div><span className="text-rose-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: 'f' maps to 'b'. 'o' tries to map to 'a', but later 'o' tries to map to 'r'. Conflict!</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 3 (Trap)</span>
                        <div><span className="text-white font-bold">Input:</span> s = "bad", t = "bba"</div>
                        <div><span className="text-rose-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: 'b' maps to 'b'. 'a' maps to 'b'. Two different characters in S map to the same character in T!</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= s.length &lt;= 5 * 10<sup>4</sup></li>
                        <li>t.length == s.length</li>
                        <li><code>s</code> and <code>t</code> consist of any valid ascii character.</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-violet-600 text-white border-violet-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-violet-200' : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-violet-600 pl-1 flex justify-between">
                                <span>String S</span>
                            </label>
                            <input 
                                type="text"
                                value={inputS} 
                                onChange={(e) => setInputS(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" 
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
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.isFail} className={`px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Valid Isomorphic Strings</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : st.isFail ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><XCircle size={20}/> Invalid Mapping Found</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-violet-500"/> Variable State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-violet-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-violet-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-violet-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-16 pb-16 gap-10 items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* --- Strict Flexbox Layout (No Overlaps) --- */}

                           {/* Row 1 & 2: Strings S and T */}
                           <div className="flex flex-col items-center gap-6 w-full">
                               {/* String S */}
                               <div className="flex flex-col items-center max-w-full">
                                   <div className="text-[10px] font-black text-violet-500 uppercase tracking-widest font-mono mb-2">String S</div>
                                   <div className="flex gap-2 p-3 border border-violet-200 bg-violet-50/80 rounded-2xl shadow-sm backdrop-blur-sm flex-wrap justify-center">
                                       {(st.sArr || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                       {(st.sArr || []).map((char, idx) => {
                                           const isI = st.i === idx;
                                           return (
                                               <div key={`s-${idx}`} className="relative">
                                                   {isI && <PointerLabel label="i" color="violet" position="top" />}
                                                   <CharNodeBlock char={char} idx={idx} themeColor={isI ? 'violet' : 'slate'} isTarget={isI} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

                               {/* String T */}
                               <div className="flex flex-col items-center max-w-full">
                                   <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest font-mono mb-2">String T</div>
                                   <div className="flex gap-2 p-3 border border-sky-200 bg-sky-50/80 rounded-2xl shadow-sm backdrop-blur-sm flex-wrap justify-center">
                                       {(st.tArr || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                       {(st.tArr || []).map((char, idx) => {
                                           const isI = st.i === idx;
                                           return (
                                               <div key={`t-${idx}`} className="relative">
                                                   {isI && <PointerLabel label="i" color="sky" position="bottom" />}
                                                   <CharNodeBlock char={char} idx={idx} themeColor={isI ? 'sky' : 'slate'} isTarget={isI} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           </div>

                           {/* Row 3: HashMaps or Arrays */}
                           {selectedOpId === 'twoHashMaps' && st.mapS2T && st.mapT2S && (
                               <div className="flex flex-row items-start gap-8 mt-4 w-full justify-center">
                                   
                                   {/* mapS2T */}
                                   <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                       <div className="text-[10px] font-black text-violet-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Database size={12}/> mapS2T</div>
                                       <div className="w-full bg-white border-2 border-violet-200 rounded-xl shadow-md overflow-hidden">
                                           <div className="grid grid-cols-2 bg-violet-50 text-[10px] font-black uppercase tracking-widest text-violet-800 border-b border-violet-200">
                                               <div className="p-2 text-center border-r border-violet-200">Key (S)</div>
                                               <div className="p-2 text-center">Val (T)</div>
                                           </div>
                                           <div className="flex flex-col max-h-[120px] overflow-y-auto scrollbar-thin">
                                                {st.mapS2T.size === 0 && <div className="p-4 text-center text-xs italic text-slate-400">Empty</div>}
                                                {Array.from(st.mapS2T.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkingS2T === k;
                                                    const isFail = isChecking && st.isFail && st.failS2T === k;
                                                    const isJustAdded = st.justAddedS === k;
                                                    
                                                    let rowClass = "border-b border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-violet-100"; textClass = "text-violet-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-sm transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-2 text-center border-r border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-2 text-center ${textClass}`}>'{v}'</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                                   {/* mapT2S */}
                                   <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                       <div className="text-[10px] font-black text-sky-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Database size={12}/> mapT2S</div>
                                       <div className="w-full bg-white border-2 border-sky-200 rounded-xl shadow-md overflow-hidden">
                                           <div className="grid grid-cols-2 bg-sky-50 text-[10px] font-black uppercase tracking-widest text-sky-800 border-b border-sky-200">
                                               <div className="p-2 text-center border-r border-sky-200">Key (T)</div>
                                               <div className="p-2 text-center">Val (S)</div>
                                           </div>
                                           <div className="flex flex-col max-h-[120px] overflow-y-auto scrollbar-thin">
                                                {st.mapT2S.size === 0 && <div className="p-4 text-center text-xs italic text-slate-400">Empty</div>}
                                                {Array.from(st.mapT2S.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkingT2S === k;
                                                    const isFail = isChecking && st.isFail && st.failT2S === k;
                                                    const isJustAdded = st.justAddedT === k;
                                                    
                                                    let rowClass = "border-b border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-sky-100"; textClass = "text-sky-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-sm transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-2 text-center border-r border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-2 text-center ${textClass}`}>'{v}'</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                               </div>
                           )}

                           {selectedOpId === 'arrayIndexMapping' && st.map1 && st.map2 && (
                               <div className="flex flex-row items-start gap-8 mt-4 w-full justify-center">
                                    <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                       <div className="text-[10px] font-black text-violet-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><ListOrdered size={12}/> map1[]</div>
                                       <div className="w-full bg-white border-2 border-violet-200 rounded-xl shadow-md overflow-hidden">
                                           <div className="grid grid-cols-2 bg-violet-50 text-[10px] font-black uppercase tracking-widest text-violet-800 border-b border-violet-200">
                                               <div className="p-2 text-center border-r border-violet-200">Char</div>
                                               <div className="p-2 text-center">Last Idx+1</div>
                                           </div>
                                           <div className="flex flex-col max-h-[120px] overflow-y-auto scrollbar-thin">
                                                {Object.entries(st.map1).filter(([k,v]) => Number(v) > 0 || st.c1 === k).map(([k, v]) => {
                                                    const isChecking = st.checkingIdx && st.c1 === k;
                                                    const isJustAdded = st.justUpdatedS === k;
                                                    
                                                    let rowClass = "border-b border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-violet-100"; textClass = "text-violet-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-sm transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-2 text-center border-r border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-2 text-center ${textClass}`}>{v}</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                                   <div className="flex flex-col items-center flex-1 max-w-[200px]">
                                       <div className="text-[10px] font-black text-sky-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><ListOrdered size={12}/> map2[]</div>
                                       <div className="w-full bg-white border-2 border-sky-200 rounded-xl shadow-md overflow-hidden">
                                           <div className="grid grid-cols-2 bg-sky-50 text-[10px] font-black uppercase tracking-widest text-sky-800 border-b border-sky-200">
                                               <div className="p-2 text-center border-r border-sky-200">Char</div>
                                               <div className="p-2 text-center">Last Idx+1</div>
                                           </div>
                                           <div className="flex flex-col max-h-[120px] overflow-y-auto scrollbar-thin">
                                                {Object.entries(st.map2).filter(([k,v]) => Number(v) > 0 || st.c2 === k).map(([k, v]) => {
                                                    const isChecking = st.checkingIdx && st.c2 === k;
                                                    const isJustAdded = st.justUpdatedT === k;
                                                    
                                                    let rowClass = "border-b border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-sky-100"; textClass = "text-sky-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-sm transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-2 text-center border-r border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-2 text-center ${textClass}`}>{v}</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
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
                        <h3 className="font-black text-violet-400 text-lg uppercase tracking-widest mb-6">1-to-1 Mapping Rule</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Isomorphic strings require a perfect bijection. Every character in String S maps to exactly one character in String T, and no two characters in S can map to the same character in T.</p>
                            <p>For example, if S="egg" and T="add":<br/>'e' → 'a'<br/>'g' → 'd'<br/>This is valid.</p>
                            <p>If S="foo" and T="bar":<br/>'f' → 'b'<br/>'o' → 'a' <br/>'o' → 'r' (Conflict! 'o' is already mapped to 'a').</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-violet-50 border border-violet-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-violet-700 text-lg uppercase tracking-widest mb-6">Why Two HashMaps?</h3>
                        <div className="space-y-4 text-sm text-violet-900/80 leading-relaxed font-medium">
                            <p>You might think one HashMap (S → T) is enough. Let's test it on S="bad", T="bba".</p>
                            <p>i=0: 'b' → 'b' (Store in map)<br/>i=1: 'a' → 'b' (Store in map)<br/>i=2: 'd' → 'a' (Store in map)</p>
                            <p>If we only check S → T, there are no conflicts! But wait, both 'b' and 'a' map to 'b' in T. This violates the rule that "No two characters may map to the same character."</p>
                            <p>We need a second map (T → S) to guarantee that 'b' in T wasn't already assigned to someone else.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-sky-50 border border-sky-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-sky-900/80 leading-relaxed font-medium">
                            <h3 className="font-black text-sky-800 text-lg uppercase tracking-widest mb-4">The Index Mapping Trick (Arrays)</h3>
                            <p>Instead of mapping characters to characters, we can map characters to their <strong>last seen positions</strong>.</p>
                            <p>If we process S and T simultaneously, the characters at <code>s[i]</code> and <code>t[i]</code> must have the exact same last-seen index to be valid. E.g. For "egg" and "add":</p>
                            <ul className="list-disc ml-6 space-y-1 font-mono text-xs">
                                <li>i=0: 'e' and 'a' both last seen at 0. Valid. Update to index 1.</li>
                                <li>i=1: 'g' and 'd' both last seen at 0. Valid. Update to index 2.</li>
                                <li>i=2: 'g' and 'd' both last seen at index 2! Valid.</li>
                            </ul>
                            <p>Because the ASCII character set is small (256 chars), we use two <code>int[256]</code> arrays instead of HashMaps, massively speeding up execution time.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-violet-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-violet-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Avoiding the Directional Trap</h3>
                    <p className="text-sm text-violet-50 leading-relaxed italic max-w-2xl font-mono">"The most common way candidates fail this problem is by only mapping one way (S to T). Interviewers specifically look to see if you catch the edge case where two characters map to the same target."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-violet-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-violet-50/50 border border-violet-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-violet-800 text-sm uppercase tracking-widest">
                               <div className="bg-violet-200 p-2 rounded-lg text-violet-700"><CheckCircle2 size={16}/></div>
                               1. State the Trivial Case
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-violet-100 shadow-inner flex-1">
                                "First, if the lengths of string S and string T are different, they mathematically cannot be isomorphic. I'll add a quick guard clause to return false immediately to save processing."
                            </p>
                        </div>

                        <div className="bg-violet-50/50 border border-violet-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-violet-800 text-sm uppercase tracking-widest">
                               <div className="bg-violet-200 p-2 rounded-lg text-violet-700"><Database size={16}/></div>
                               2. Propose the HashMap Idea
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-violet-100 shadow-inner flex-1">
                                "The definition requires a 1-to-1 mapping. I can iterate through the strings simultaneously and use a HashMap to link characters from S to T. If I ever find a character in S that is already mapped, I verify it maps to the correct character in T."
                            </p>
                        </div>

                        <div className="bg-violet-50/50 border border-violet-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-violet-800 text-sm uppercase tracking-widest">
                               <div className="bg-violet-200 p-2 rounded-lg text-violet-700"><ShieldAlert size={16}/></div>
                               3. Catch the Mapping Trap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-violet-100 shadow-inner flex-1">
                                "However, one map isn't enough. If S='bad' and T='bba', 'b' maps to 'b' and 'a' maps to 'b'. The first map wouldn't catch this conflict. I must use a second map (or a HashSet of values) to ensure no two characters in S map to the same character in T."
                            </p>
                        </div>

                        <div className="bg-violet-50/50 border border-violet-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-violet-800 text-sm uppercase tracking-widest">
                               <div className="bg-violet-200 p-2 rounded-lg text-violet-700"><Zap size={16}/></div>
                               4. Optimize to Fixed Arrays
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-violet-100 shadow-inner flex-1">
                                "While Two HashMaps are O(N), the hashing overhead is slow. Because we are dealing with standard ASCII characters, I can optimize space and speed by using two integer arrays of size 256. Instead of mapping chars to chars, I map chars to their 'last seen index'. If the indices mismatch, it fails."
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
                          <div className="bg-violet-500 p-2 rounded-lg text-white shadow-lg shadow-violet-900/50"><Code2 size={20}/></div>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-violet-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-violet-600 pl-1">String S</label>
                              <input type="text" value={inputS} onChange={(e) => setInputS(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" />
                          </div>
                          <div className="w-64 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">String T</label>
                              <input type="text" value={inputT} onChange={(e) => setInputT(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-violet-600 rounded-xl hover:bg-violet-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-violet-600 rounded-xl hover:bg-violet-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-violet-600 rounded-xl hover:bg-violet-50 transition-all"><RotateCcw size={24}/></button>
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.isFail} className="px-12 py-6 bg-violet-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-violet-500 shadow-violet-900/20">NEXT <ChevronRight size={32}/></button>
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
                                   <div className="text-xs font-black text-violet-500 uppercase tracking-widest font-mono mb-4 bg-violet-100 px-4 py-1 rounded-full shadow-sm">String S</div>
                                   <div className="flex gap-4 p-5 border-[3px] border-violet-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-md flex-wrap justify-center">
                                       {(st.sArr || []).length === 0 && <span className="text-slate-400 italic text-2xl px-10">empty</span>}
                                       {(st.sArr || []).map((char, idx) => {
                                           const isI = st.i === idx;
                                           return (
                                               <div key={`s-fs-${idx}`} className="relative scale-110 mx-2 mb-2 mt-2">
                                                   {isI && <PointerLabel label="i" color="violet" position="top" />}
                                                   <CharNodeBlock char={char} idx={idx} themeColor={isI ? 'violet' : 'slate'} isTarget={isI} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>

                               {/* String T */}
                               <div className="flex flex-col items-center max-w-full scale-125 origin-center mt-6">
                                   <div className="text-xs font-black text-sky-500 uppercase tracking-widest font-mono mb-4 bg-sky-100 px-4 py-1 rounded-full shadow-sm">String T</div>
                                   <div className="flex gap-4 p-5 border-[3px] border-sky-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-md flex-wrap justify-center">
                                       {(st.tArr || []).length === 0 && <span className="text-slate-400 italic text-2xl px-10">empty</span>}
                                       {(st.tArr || []).map((char, idx) => {
                                           const isI = st.i === idx;
                                           return (
                                               <div key={`t-fs-${idx}`} className="relative scale-110 mx-2 mb-2 mt-2">
                                                   {isI && <PointerLabel label="i" color="sky" position="bottom" />}
                                                   <CharNodeBlock char={char} idx={idx} themeColor={isI ? 'sky' : 'slate'} isTarget={isI} />
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           </div>

                           {/* Row 3: HashMaps or Arrays (Theater) */}
                           {selectedOpId === 'twoHashMaps' && st.mapS2T && st.mapT2S && (
                               <div className="flex flex-row items-start gap-16 mt-16 w-full justify-center scale-125 origin-center">
                                   
                                   {/* mapS2T */}
                                   <div className="flex flex-col items-center flex-1 max-w-[300px]">
                                       <div className="text-xs font-black text-violet-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-violet-100 px-4 py-1.5 rounded-full shadow-sm"><Database size={16}/> mapS2T</div>
                                       <div className="w-full bg-white border-4 border-violet-200 rounded-[2rem] shadow-2xl overflow-hidden">
                                           <div className="grid grid-cols-2 bg-violet-50 text-xs font-black uppercase tracking-widest text-violet-800 border-b-2 border-violet-200">
                                               <div className="p-4 text-center border-r-2 border-violet-200">Key (S)</div>
                                               <div className="p-4 text-center">Val (T)</div>
                                           </div>
                                           <div className="flex flex-col max-h-[250px] overflow-y-auto scrollbar-thin">
                                                {st.mapS2T.size === 0 && <div className="p-8 text-center text-lg italic text-slate-400">Empty</div>}
                                                {Array.from(st.mapS2T.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkingS2T === k;
                                                    const isFail = isChecking && st.isFail && st.failS2T === k;
                                                    const isJustAdded = st.justAddedS === k;
                                                    
                                                    let rowClass = "border-b-2 border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-violet-100"; textClass = "text-violet-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-xl transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-4 text-center border-r-2 border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-4 text-center ${textClass}`}>'{v}'</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                                   {/* mapT2S */}
                                   <div className="flex flex-col items-center flex-1 max-w-[300px]">
                                       <div className="text-xs font-black text-sky-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-sky-100 px-4 py-1.5 rounded-full shadow-sm"><Database size={16}/> mapT2S</div>
                                       <div className="w-full bg-white border-4 border-sky-200 rounded-[2rem] shadow-2xl overflow-hidden">
                                           <div className="grid grid-cols-2 bg-sky-50 text-xs font-black uppercase tracking-widest text-sky-800 border-b-2 border-sky-200">
                                               <div className="p-4 text-center border-r-2 border-sky-200">Key (T)</div>
                                               <div className="p-4 text-center">Val (S)</div>
                                           </div>
                                           <div className="flex flex-col max-h-[250px] overflow-y-auto scrollbar-thin">
                                                {st.mapT2S.size === 0 && <div className="p-8 text-center text-lg italic text-slate-400">Empty</div>}
                                                {Array.from(st.mapT2S.entries()).map(([k, v]) => {
                                                    const isChecking = st.checkingT2S === k;
                                                    const isFail = isChecking && st.isFail && st.failT2S === k;
                                                    const isJustAdded = st.justAddedT === k;
                                                    
                                                    let rowClass = "border-b-2 border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isFail) { rowClass += " bg-rose-100 border-rose-300"; textClass = "text-rose-800 font-bold"; }
                                                    else if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-sky-100"; textClass = "text-sky-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-xl transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-4 text-center border-r-2 border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-4 text-center ${textClass}`}>'{v}'</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                               </div>
                           )}

                           {selectedOpId === 'arrayIndexMapping' && st.map1 && st.map2 && (
                               <div className="flex flex-row items-start gap-16 mt-16 w-full justify-center scale-125 origin-center">
                                    <div className="flex flex-col items-center flex-1 max-w-[300px]">
                                       <div className="text-xs font-black text-violet-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-violet-100 px-4 py-1.5 rounded-full shadow-sm"><ListOrdered size={16}/> map1[]</div>
                                       <div className="w-full bg-white border-4 border-violet-200 rounded-[2rem] shadow-2xl overflow-hidden">
                                           <div className="grid grid-cols-2 bg-violet-50 text-xs font-black uppercase tracking-widest text-violet-800 border-b-2 border-violet-200">
                                               <div className="p-4 text-center border-r-2 border-violet-200">Char</div>
                                               <div className="p-4 text-center">Last Idx+1</div>
                                           </div>
                                           <div className="flex flex-col max-h-[250px] overflow-y-auto scrollbar-thin">
                                                {Object.entries(st.map1).filter(([k,v]) => Number(v) > 0 || st.c1 === k).map(([k, v]) => {
                                                    const isChecking = st.checkingIdx && st.c1 === k;
                                                    const isJustAdded = st.justUpdatedS === k;
                                                    
                                                    let rowClass = "border-b-2 border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-violet-100"; textClass = "text-violet-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-xl transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-4 text-center border-r-2 border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-4 text-center ${textClass}`}>{v}</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
                                       </div>
                                   </div>

                                   <div className="flex flex-col items-center flex-1 max-w-[300px]">
                                       <div className="text-xs font-black text-sky-600 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 bg-sky-100 px-4 py-1.5 rounded-full shadow-sm"><ListOrdered size={16}/> map2[]</div>
                                       <div className="w-full bg-white border-4 border-sky-200 rounded-[2rem] shadow-2xl overflow-hidden">
                                           <div className="grid grid-cols-2 bg-sky-50 text-xs font-black uppercase tracking-widest text-sky-800 border-b-2 border-sky-200">
                                               <div className="p-4 text-center border-r-2 border-sky-200">Char</div>
                                               <div className="p-4 text-center">Last Idx+1</div>
                                           </div>
                                           <div className="flex flex-col max-h-[250px] overflow-y-auto scrollbar-thin">
                                                {Object.entries(st.map2).filter(([k,v]) => Number(v) > 0 || st.c2 === k).map(([k, v]) => {
                                                    const isChecking = st.checkingIdx && st.c2 === k;
                                                    const isJustAdded = st.justUpdatedT === k;
                                                    
                                                    let rowClass = "border-b-2 border-slate-100 last:border-0";
                                                    let textClass = "text-slate-600";
                                                    
                                                    if (isChecking) { rowClass += " bg-amber-100"; textClass = "text-amber-800 font-bold"; }
                                                    else if (isJustAdded) { rowClass += " bg-sky-100"; textClass = "text-sky-800 font-bold"; }

                                                    return (
                                                        <div key={k} className={`grid grid-cols-2 font-mono text-xl transition-all duration-300 ${rowClass}`}>
                                                            <div className={`p-4 text-center border-r-2 border-slate-100 ${textClass}`}>'{k}'</div>
                                                            <div className={`p-4 text-center ${textClass}`}>{v}</div>
                                                        </div>
                                                    )
                                                })}
                                           </div>
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
                                    {st.isSuccess ? 'ISOMORPHIC' : 'NOT ISOMORPHIC'}
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