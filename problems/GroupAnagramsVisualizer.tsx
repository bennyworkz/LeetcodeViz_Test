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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  groupBySort: {
    id: 'groupBySort',
    title: 'Categorize by Sorting',
    icon: <Filter size={16} />,
    complexity: 'Time: O(N * K log K) | Space: O(N * K)',
    code: `public List<List<String>> groupAnagrams(String[] strs) {
    if (strs == null || strs.length == 0) return new ArrayList<>();
    
    Map<String, List<String>> map = new HashMap<>();
    
    for (String s : strs) {
        // 1. Transform string to char array and sort it
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        
        // 2. Use the sorted string as the Map Key
        String key = new String(chars);
        
        // 3. Initialize list if key doesn't exist
        if (!map.containsKey(key)) {
            map.put(key, new ArrayList<>());
        }
        
        // 4. Add original string to the corresponding list
        map.get(key).add(s);
    }
    
    return new ArrayList<>(map.values());
}`,
    desc: "The most common and intuitive approach. Two strings are anagrams if and only if their sorted strings are exactly equal. We sort each string to form a 'key'. All strings that produce the same key are grouped together into a list inside a Hash Map."
  },
  groupByCount: {
    id: 'groupByCount',
    title: 'Categorize by Char Count',
    icon: <Hash size={16} />,
    complexity: 'Time: O(N * K) | Space: O(N * K)',
    code: `public List<List<String>> groupAnagrams(String[] strs) {
    if (strs == null || strs.length == 0) return new ArrayList<>();
    
    Map<String, List<String>> map = new HashMap<>();
    
    for (String s : strs) {
        // 1. Count character frequencies
        int[] count = new int[26];
        for (char c : s.toCharArray()) {
            count[c - 'a']++;
        }
        
        // 2. Build a unique string key from the counts
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 26; i++) {
            sb.append('#');
            sb.append(count[i]);
        }
        String key = sb.toString();
        
        // 3. Group in Map
        if (!map.containsKey(key)) {
            map.put(key, new ArrayList<>());
        }
        map.get(key).add(s);
    }
    
    return new ArrayList<>(map.values());
}`,
    desc: "An optimization for long strings. Instead of sorting (K log K), we count the occurrences of each character in O(K) time. We build a unique key by concatenating these counts (e.g., '#1#0#0...#1'). Strings with identical character counts share the same key."
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
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|int|return|if|else|for|while|new|HashMap|Map|List|String|ArrayList|Arrays|char|StringBuilder)\b|\b\d+\b)/g).filter(Boolean);
  const activeStyles = { bg: `bg-violet-500/20`, border: `border-violet-500`, text: `text-violet-400` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-violet-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'int', 'return', 'if', 'else', 'for', 'while', 'new', 'char'].includes(part);
            const isObject = ['HashMap', 'Map', 'List', 'String', 'ArrayList', 'Arrays', 'StringBuilder'].includes(part);
            const isVar = ['strs', 'map', 's', 'chars', 'key', 'count', 'c', 'sb', 'i'].includes(part);
            const isMapCall = ['put', 'get', 'containsKey', 'add', 'toCharArray', 'sort', 'append', 'toString', 'values', 'length'].includes(part);
            return (
              <span 
                key={i} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-sky-400 font-bold' : 
                  isVar ? 'text-violet-300' : 
                  isMapCall ? 'text-amber-400' :
                  isNaN(parseInt(part)) && part.trim() !== '<' && part.trim() !== '>' ? '' : 'text-emerald-400'
                }
              >
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
  offset?: number;
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, offset = 0 }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        violet: 'bg-violet-100 text-violet-700 border-violet-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30`} style={{ transform: `translateX(${offset}px)`}}>
            <span className={`text-[11px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass}`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={16} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={16} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface StringNodeBlockProps {
  val: string;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
}

const StringNodeBlock: React.FC<StringNodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800' },
        violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-800' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-300`}>
            <div className={`flex flex-col items-center min-w-[4rem] px-3 h-14 border-2 rounded-xl transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-lg bg-white/50 ${activeTheme.text}`}>
                    "{String(val)}"
                </div>
                {idx !== undefined && (
                    <div className="flex w-full h-4 border-t border-black/10">
                        <div className="flex-1 flex items-center justify-center bg-slate-100">
                             <span className="text-[8px] font-black tracking-widest text-slate-400">idx {idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function GroupAnagramsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('groupBySort');
  
  const [inputArray, setInputArray] = useState('eat, tea, tan, ate, nat, bat');
  const [baseArray, setBaseArray] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 100, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 100, y: 150 }); 
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
    if (e.target.closest('button') || e.target.closest('input')) return;
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

  const parseInput = (arrStr) => {
      // Allow spaces, trim, remove quotes if user types them
      return arrStr.split(',').map(s => s.trim().replace(/['"]/g, '')).filter(s => s.length > 0);
  };

  useEffect(() => {
    const arr = parseInput(inputArray);
    setBaseArray(arr);
    setCurrentStep(0);
    setPan({ x: 100, y: 150 });
  }, [inputArray, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Deep clone map helper
  const cloneMap = (map) => {
      return new Map(Array.from(map.entries()).map(([k, v]) => [k, [...v]]));
  };

  const trace = useMemo(() => {
    const steps = [];
    if (baseArray.length === 0) return [{ phase: 'Init', description: 'Enter array values.', line: 0, state: { arr: [] } }];
    
    let arr = [...baseArray];

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            arr: [...arr],
            ...st 
        } 
    });

    if (selectedOpId === 'groupBySort') {
        let hashMap = new Map();
        
        add("Initialize Map", "Create a Hash Map where keys are strings, and values are Lists of strings.", 4, { map: cloneMap(hashMap) });

        for (let i = 0; i < arr.length; i++) {
            let s = arr[i];
            add("Loop Start", `Processing strs[${i}] = "${s}".`, 6, { i, currStr: s, map: cloneMap(hashMap) });

            let chars = s.split('');
            add("Convert to Char Array", `char[] chars = "${s}".toCharArray();`, 8, { i, currStr: s, chars: [...chars], map: cloneMap(hashMap) });

            chars.sort();
            add("Sort Char Array", `Arrays.sort(chars); Now the characters are in alphabetical order.`, 9, { i, currStr: s, chars: [...chars], map: cloneMap(hashMap) });

            let key = chars.join('');
            add("Generate Key", `String key = new String(chars); The map key is "${key}".`, 12, { i, currStr: s, chars: [...chars], key, map: cloneMap(hashMap) });

            add("Check Condition", `if (!map.containsKey("${key}")) -> Does the map have this key yet?`, 15, { i, currStr: s, key, map: cloneMap(hashMap) });

            if (!hashMap.has(key)) {
                hashMap.set(key, []);
                add("Initialize List", `map.put("${key}", new ArrayList<>()); Condition met. Created a new empty bucket.`, 16, { i, currStr: s, key, map: cloneMap(hashMap) });
            }

            let newList = [...hashMap.get(key), s];
            hashMap.set(key, newList);
            add("Add to Group", `map.get("${key}").add("${s}"); Appended the original string to the bucket.`, 20, { i, currStr: s, key, map: cloneMap(hashMap), justAddedKey: key });
        }

        const finalResult = Array.from(hashMap.values());
        add("Complete", "Array completely processed. Returning the grouped lists.", 23, { map: cloneMap(hashMap), isSuccess: true, finalResult });

    } else if (selectedOpId === 'groupByCount') {
        let hashMap = new Map();
        
        add("Initialize Map", "Create an empty Hash Map.", 4, { map: cloneMap(hashMap) });

        for (let i = 0; i < arr.length; i++) {
            let s = arr[i];
            add("Loop Start", `Processing strs[${i}] = "${s}".`, 6, { i, currStr: s, map: cloneMap(hashMap) });
            
            // Build visual representation of character count
            let charCounts = {};
            for(let char of s) {
                charCounts[char] = (charCounts[char] || 0) + 1;
            }
            
            add("Init Count Array", `int[] count = new int[26]; Create an array to track char frequencies.`, 8, { i, currStr: s, map: cloneMap(hashMap) });

            let countStrRepr = Object.entries(charCounts).sort(([a],[b])=>a.localeCompare(b)).map(([k,v]) => `${k}:${v}`).join(', ');
            add("Count Frequencies", `for (char c : s.toCharArray()) count[c - 'a']++; -> Frequencies: { ${countStrRepr} }.`, 10, { i, currStr: s, charCounts, map: cloneMap(hashMap) });

            add("Init StringBuilder", `StringBuilder sb = new StringBuilder(); Preparing to construct the string key.`, 14, { i, currStr: s, charCounts, map: cloneMap(hashMap) });

            // Actual algorithm string builder logic representation
            let countArr = new Array(26).fill(0);
            for(let j=0; j<s.length; j++) {
                countArr[s.charCodeAt(j) - 97]++;
            }
            let key = countArr.map(c => `#${c}`).join('');
            
            // Simplify key for visualizer display if too long
            let visualKey = key.replace(/(#0)+/g, '#0...'); 
            if (visualKey.length > 20) visualKey = visualKey.substring(0, 20) + "...";

            add("Append Counts", `for (...) sb.append(count[i]); Building the frequency string footprint.`, 17, { i, currStr: s, charCounts, map: cloneMap(hashMap), sbStr: visualKey });

            add("Generate Key", `String key = sb.toString(); Built string key: "${visualKey}".`, 19, { i, currStr: s, charCounts, key: visualKey, map: cloneMap(hashMap) });

            add("Check Condition", `if (!map.containsKey("${visualKey}")) -> Check if this footprint exists.`, 22, { i, currStr: s, key: visualKey, map: cloneMap(hashMap) });

            if (!hashMap.has(key)) {
                hashMap.set(key, []);
                add("Initialize List", `map.put(key, new ArrayList<>()); Condition met. Created a new empty bucket.`, 23, { i, currStr: s, key: visualKey, map: cloneMap(hashMap) });
            }

            let newList = [...hashMap.get(key), s];
            hashMap.set(key, newList);
            add("Add to Group", `map.get(key).add("${s}"); Added the string to its footprint bucket.`, 25, { i, currStr: s, key: visualKey, map: cloneMap(hashMap), justAddedKey: key });
        }

        const finalResult = Array.from(hashMap.values());
        add("Complete", "Array completely processed. Returning the grouped lists.", 28, { map: cloneMap(hashMap), isSuccess: true, finalResult });
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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { arr: [] } };
  const st = curStepData.state || { arr: [] };
  const isLastStep = currentStep === trace.length - 1;

  const startX = 60;
  const startY = 60;

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <Box className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Group Anagrams</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                      Hash Map
                  </span>
                  <span>•</span>
                  <span>String Keys</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-violet-600 font-black text-2xl uppercase tracking-tighter"><Type size={28}/> The Anagram Buckets</div>
                    <p className="text-lg leading-relaxed max-w-3xl">
                      Given an array of strings <code>strs</code>, group the <strong>anagrams</strong> together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.
                    </p>
                    <div className="bg-slate-900 border-l-4 border-violet-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white space-y-4 overflow-x-auto whitespace-nowrap">
                       <div><span className="text-violet-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input Array</span>
                       strs = ["eat", "tea", "tan", "ate", "nat", "bat"]</div>
                       <div><span className="text-emerald-400 block mb-1 uppercase text-[10px] font-black tracking-widest mt-2">Expected Output</span>
                       [ ["bat"], ["nat","tan"], ["ate","eat","tea"] ]</div>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Goal</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We need a way to look at "eat", "tea", and "ate" and definitively say "These all belong in the same bucket". We need a Universal Identifier (a Key) that all anagrams will naturally evaluate to.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><KeyRound size={16} className="text-amber-500"/> The Key Generation</h4>
                        <p className="text-sm leading-relaxed text-slate-600">If we sort the letters in "eat", we get "aet". If we sort "tea", we also get "aet". Sorting is the easiest way to generate a reliable Key. Alternatively, counting the frequencies of a-z also generates a unique footprint.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-violet-600 text-white border-violet-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-violet-200' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[420px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> GroupAnagrams.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-violet-600 pl-1">Input Strings (comma separated)</label>
                            <input type="text" value={inputArray} onChange={(e) => setInputArray(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center">
                            <div className="hidden lg:flex items-center gap-1.5 mr-2 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                <Keyboard size={14} />
                                <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Use &larr; &rarr;</span>
                            </div>
                            <button onClick={handleReset} className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-2.5 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-2.5 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Grouping Complete</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 h-[400px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-violet-500"/> Memory & State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-violet-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-violet-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-violet-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Array Elements */}
                           <div className="absolute flex gap-4" style={{ left: startX, top: startY }}>
                               {(st.arr || []).map((val, idx) => {
                                  const isI = st.i === idx;
                                  
                                  let theme = 'slate';
                                  if (isI) theme = 'violet';
                                  else if (st.i !== undefined && idx < st.i) theme = 'emerald'; // completed

                                  const labels = [];
                                  if (isI) labels.push({ text: "i", color: "violet", pos: "top" });

                                  return (
                                      <div key={`arr-${idx}`} className="relative">
                                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                          
                                          <StringNodeBlock val={val} idx={idx} themeColor={theme} isTarget={isI} />
                                      </div>
                                  )
                               })}
                           </div>

                           {/* Key Generation Visualization */}
                           {st.currStr !== undefined && (st.key !== undefined || st.chars || st.sbStr) && (
                               <div className="absolute left-[60px] animate-in fade-in slide-in-from-top-4" style={{ top: startY + 110 }}>
                                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xl flex items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] uppercase font-bold text-slate-400 mb-1 font-mono tracking-widest">Original</span>
                                            <div className="bg-slate-100 text-slate-700 font-mono font-black text-lg px-3 py-1 rounded-lg border border-slate-200">"{st.currStr}"</div>
                                        </div>
                                        
                                        <ArrowRight className="text-slate-300" size={24}/>
                                        
                                        <div className="flex flex-col items-center min-w-[120px]">
                                            <span className="text-[9px] uppercase font-bold text-fuchsia-400 mb-1 font-mono tracking-widest">Transform Logic</span>
                                            {selectedOpId === 'groupBySort' ? (
                                                <div className="bg-fuchsia-50 text-fuchsia-700 font-mono text-xs px-3 py-1.5 rounded-lg border border-fuchsia-200 flex flex-col gap-1 items-center w-full">
                                                    {st.chars ? (
                                                        <>
                                                            <span className="italic opacity-70">char[] array</span>
                                                            <span className="font-bold tracking-widest text-sm">[{st.chars.join(', ')}]</span>
                                                        </>
                                                    ) : (
                                                        <span className="italic">processing...</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-fuchsia-50 text-fuchsia-700 font-mono text-xs px-3 py-1.5 rounded-lg border border-fuchsia-200 flex flex-col gap-1 items-center w-full">
                                                    {st.charCounts ? (
                                                       <span className="font-bold text-[10px] whitespace-nowrap">Counts: {Object.entries(st.charCounts || {}).map(([k,v])=>`${k}:${v}`).join(', ')}</span>
                                                    ) : (
                                                       <span className="italic opacity-70">counting...</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <ArrowRight className="text-slate-300" size={24}/>

                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] uppercase font-bold text-amber-500 mb-1 font-mono tracking-widest flex items-center gap-1"><KeyRound size={10}/> Map Key</span>
                                            <div className="bg-amber-100 text-amber-800 font-mono font-black text-lg px-3 py-1 rounded-lg border border-amber-300 shadow-inner min-w-[60px] text-center">
                                                {st.key !== undefined ? `"${st.key}"` : <span className="opacity-40 italic text-sm">building...</span>}
                                            </div>
                                        </div>
                                    </div>
                               </div>
                           )}

                           {/* Hash Map UI */}
                           {st.map && (
                               <div className="absolute left-[60px]" style={{ top: startY + 230 }}>
                                   <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-5 shadow-2xl min-w-[500px] flex flex-col">
                                       <div className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
                                           <div className="flex items-center gap-2"><Database size={16} className="text-emerald-400"/> Hash Map Buckets</div>
                                           <div className="font-mono opacity-50 text-[10px]">Key (String) &rarr; Value (List of Strings)</div>
                                       </div>
                                       
                                       <div className="flex gap-4 flex-wrap">
                                           {st.map.size === 0 && <div className="text-sm text-slate-500 font-mono italic p-4">Map is currently empty</div>}
                                           {Array.from(st.map.entries()).map(([key, valueList]) => {
                                               const isActiveKey = st.key === key;
                                               const isJustAddedKey = st.justAddedKey === key; // Unused but good for future
                                               
                                               return (
                                                   <div key={key} className={`flex flex-col rounded-xl overflow-hidden shadow-lg border-2 transition-all duration-500 min-w-[120px] ${isActiveKey ? 'border-amber-400 scale-105 shadow-amber-900/40 z-20' : 'border-slate-600 bg-slate-700'}`}>
                                                       {/* Bucket Header (Key) */}
                                                       <div className={`px-3 py-2 text-center font-mono font-black border-b ${isActiveKey ? 'bg-amber-400 text-amber-950 border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-600'}`}>
                                                           {key}
                                                       </div>
                                                       {/* Bucket Content (List) */}
                                                       <div className={`p-3 flex flex-col gap-2 ${isActiveKey ? 'bg-amber-50' : 'bg-slate-700'}`}>
                                                           {valueList.length === 0 && <span className="text-xs italic opacity-50 text-center">Empty List</span>}
                                                           {valueList.map((str, vi) => {
                                                               // Highlight the newly added string
                                                               const isNewStrInActive = isActiveKey && vi === valueList.length - 1 && st.phase === 'Add to Group';
                                                               return (
                                                                <div key={vi} className={`text-center font-mono text-sm px-2 py-1 rounded shadow-sm border transition-all duration-300 ${isNewStrInActive ? 'bg-violet-600 text-white border-violet-500 animate-in slide-in-from-top-2' : isActiveKey ? 'bg-white text-slate-800 border-amber-200' : 'bg-slate-600 text-slate-200 border-slate-500'}`}>
                                                                    "{str}"
                                                                </div>
                                                               );
                                                           })}
                                                       </div>
                                                   </div>
                                               );
                                           })}
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Hash size={120}/></div>
                        <h3 className="font-black text-amber-400 text-lg uppercase tracking-widest mb-6">The Sorting Key</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium">
                            <p>Sorting strings transforms any anagram permutation into its canonical (alphabetical) form. "tea", "eat", and "ate" all sort down to "aet".</p>
                            <p>Because they evaluate to the exact same string, we can use this canonical string as a dictionary key. Everything that shares this key gets grouped perfectly.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-violet-50 border border-violet-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-violet-700 text-lg uppercase tracking-widest mb-6">The Counting Key Optimization</h3>
                        <div className="space-y-4 text-sm text-violet-900/80 leading-relaxed font-medium">
                            <p>Sorting takes $O(K \log K)$ time per string (where $K$ is string length). If strings are very long, sorting is slow.</p>
                            <p>Since we only have lowercase English letters (usually), we can just count the frequencies in an array of size 26 in $O(K)$ time. "eat" becomes 1 'a', 1 'e', 1 't'. We serialize this array to a string (e.g. <code>#1#0#0...</code>) to use as the Map key.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-emerald-50 border border-emerald-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <h3 className="font-black text-emerald-800 text-lg uppercase tracking-widest mb-4">Prime Factorization Key (Advanced)</h3>
                            <p>There is a mathematically beautiful but risky third way. The Fundamental Theorem of Arithmetic states every integer greater than 1 has a unique prime factorization.</p>
                            <p>If we map a-z to the first 26 prime numbers (a=2, b=3, c=5, d=7...), we can calculate the product of the primes for each character. "eat" = 2 * 11 * 71 = 1562. "tea" = 71 * 11 * 2 = 1562.</p>
                            <p className="font-bold text-rose-700 bg-rose-100 p-2 rounded inline-block">Warning: This product causes Integer Overflow extremely fast on long strings!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-violet-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-violet-500">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Navigating the Discussion</h3>
                    <p className="text-sm text-violet-100 leading-relaxed italic max-w-2xl font-mono">"Start with the Sorting approach. It's universally accepted and shows good use of Hash Maps. Then, proactively mention the Frequency Count approach as a performance optimization. Interviewers love candidates who optimize without being prompted."</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 text-slate-700">
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-violet-600 border-b pb-2">Technical Deep Dive</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>What is K?</strong> Always clarify the Time Complexity accurately. It is NOT just $O(N \log N)$. It is $O(N \cdot K \log K)$ where $N$ is array length and $K$ is max string length. The interviewer will grill you if you omit $K$.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Why a String Key?</strong> Why not use the `int[]` array directly as a key in Java? Because array equality checks reference equality, not content equality. We must serialize the array to a String, or use `Arrays.hashCode()` / a wrapper class.</div></li>
                            <li className="flex gap-4 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> <div><strong>Which is actually faster?</strong> For short strings (like dictionary words), the $O(K \log K)$ sorting approach is often faster in reality because building a 26-element array and serializing it into a string involves heavier overhead/constants than a fast primitive char sort.</div></li>
                        </ul>
                    </div>
                    
                    <div className="space-y-6">
                        <h5 className="font-black uppercase tracking-widest text-[11px] text-rose-500 border-b pb-2">Edge Cases to Mention</h5>
                        <ul className="text-sm space-y-5">
                            <li className="flex gap-4 items-start"><ShieldAlert className="text-rose-400 shrink-0" size={20}/> <div><strong>Empty Strings:</strong> Input <code>["", "b", ""]</code>. Empty strings are valid anagrams of each other. The sorted/counted key for `""` is just an empty string or `#0#0...`, which is perfectly fine.</div></li>
                            <li className="flex gap-4 items-start"><ShieldAlert className="text-rose-400 shrink-0" size={20}/> <div><strong>Different Character Sets:</strong> The Frequency Count approach hardcodes an array size of 26 assuming lowercase English letters. If the input contains Unicode, sorting still works, but the frequency array size would explode. Mentioning this shows massive system-design foresight.</div></li>
                        </ul>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm mt-8">
                            <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-500 mb-5">Interview Communication Checklist</h5>
                            <div className="space-y-3 font-mono text-[11px] text-slate-600 uppercase tracking-tight font-bold">
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-violet-500"/> Clarify constraints (lowercase only?)</div>
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-violet-500"/> Describe Hash Map + Sorting Key logic</div>
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-violet-500"/> Detail the $O(N \cdot K \log K)$ Time complexity</div>
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-violet-500"/> Propose Frequency Count for $O(N \cdot K)$</div>
                                <div className="flex items-center gap-3"><CheckSquare size={16} className="text-violet-500"/> Mention the `int[]` vs `String` hash map key caveat</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[550px] xl:w-[600px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="bg-violet-600 p-2 rounded-lg text-white shadow-lg shadow-violet-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                        ))}
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-violet-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-violet-600 pl-1">Input Strings (comma separated)</label>
                              <input type="text" value={inputArray} onChange={(e) => setInputArray(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" />
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
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <Keyboard size={16} />
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-violet-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-violet-500 shadow-violet-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-500" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* Array Elements (Theater) */}
                           <div className="absolute flex gap-6" style={{ left: startX + 100, top: startY + 100 }}>
                               {(st.arr || []).map((val, idx) => {
                                  const isI = st.i === idx;
                                  let theme = 'slate';
                                  if (isI) theme = 'violet';
                                  else if (st.i !== undefined && idx < st.i) theme = 'emerald'; 

                                  const labels = [];
                                  if (isI) labels.push({ text: "i", color: "violet", pos: "top" });

                                  return (
                                      <div key={`arr-fs-${idx}`} className="relative">
                                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                          
                                          <StringNodeBlock val={val} idx={idx} themeColor={theme} isTarget={isI} />
                                      </div>
                                  )
                               })}
                           </div>

                           {/* Key Generation (Theater) */}
                           {st.currStr !== undefined && (st.key !== undefined || st.chars || st.sbStr) && (
                               <div className="absolute left-[160px] animate-in fade-in slide-in-from-top-4" style={{ top: startY + 200 }}>
                                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-2xl flex items-center gap-6 scale-110 origin-top-left">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs uppercase font-bold text-slate-400 mb-2 font-mono tracking-widest">Original</span>
                                            <div className="bg-slate-100 text-slate-700 font-mono font-black text-2xl px-5 py-2 rounded-xl border border-slate-200 shadow-inner">"{st.currStr}"</div>
                                        </div>
                                        
                                        <ArrowRight className="text-slate-300" size={32}/>
                                        
                                        <div className="flex flex-col items-center min-w-[160px]">
                                            <span className="text-xs uppercase font-bold text-fuchsia-400 mb-2 font-mono tracking-widest">Transform Logic</span>
                                            {selectedOpId === 'groupBySort' ? (
                                                <div className="bg-fuchsia-50 text-fuchsia-700 font-mono text-sm px-4 py-2 rounded-xl border border-fuchsia-200 flex flex-col gap-1 shadow-sm items-center w-full">
                                                    {st.chars ? (
                                                        <>
                                                            <span className="italic opacity-70">char[] array</span>
                                                            <span className="font-bold tracking-widest text-xl">[{st.chars.join(', ')}]</span>
                                                        </>
                                                    ) : (
                                                        <span className="italic">processing...</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-fuchsia-50 text-fuchsia-700 font-mono text-sm px-4 py-2 rounded-xl border border-fuchsia-200 flex flex-col gap-1 shadow-sm max-w-[250px] text-center w-full">
                                                    {st.charCounts ? (
                                                       <span className="font-bold text-xs whitespace-normal">Counts: {Object.entries(st.charCounts || {}).map(([k,v])=>`${k}:${v}`).join(', ')}</span>
                                                    ) : (
                                                       <span className="italic opacity-70">counting...</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <ArrowRight className="text-slate-300" size={32}/>

                                        <div className="flex flex-col items-center">
                                            <span className="text-xs uppercase font-bold text-amber-500 mb-2 font-mono tracking-widest flex items-center gap-2"><KeyRound size={14}/> Map Key</span>
                                            <div className="bg-amber-100 text-amber-800 font-mono font-black text-2xl px-5 py-2 rounded-xl border border-amber-300 shadow-inner min-w-[80px] text-center">
                                                {st.key !== undefined ? `"${st.key}"` : <span className="opacity-40 italic text-lg">building...</span>}
                                            </div>
                                        </div>
                                    </div>
                               </div>
                           )}

                           {/* Hash Map UI (Theater) */}
                           {st.map && (
                               <div className="absolute left-[160px]" style={{ top: startY + 380 }}>
                                   <div className="bg-slate-800 border-2 border-slate-700 rounded-3xl p-8 shadow-2xl min-w-[700px] flex flex-col">
                                       <div className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center justify-between border-b border-slate-700 pb-4">
                                           <div className="flex items-center gap-3"><Database size={24} className="text-emerald-400"/> Hash Map Buckets</div>
                                           <div className="font-mono opacity-50 text-xs bg-slate-900 px-3 py-1 rounded">Key &rarr; List of Strings</div>
                                       </div>
                                       
                                       <div className="flex gap-6 flex-wrap">
                                           {st.map.size === 0 && <div className="text-lg text-slate-500 font-mono italic p-6">Map is currently empty</div>}
                                           {Array.from(st.map.entries()).map(([key, valueList]) => {
                                               const isActiveKey = st.key === key;
                                               
                                               return (
                                                   <div key={key} className={`flex flex-col rounded-2xl overflow-hidden shadow-2xl border-[3px] transition-all duration-500 min-w-[150px] ${isActiveKey ? 'border-amber-400 scale-110 shadow-amber-500/30 z-20' : 'border-slate-600 bg-slate-700'}`}>
                                                       <div className={`px-4 py-3 text-center font-mono font-black text-lg border-b-2 ${isActiveKey ? 'bg-amber-400 text-amber-950 border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-600'}`}>
                                                           {key}
                                                       </div>
                                                       <div className={`p-4 flex flex-col gap-3 min-h-[60px] ${isActiveKey ? 'bg-amber-50' : 'bg-slate-700'}`}>
                                                           {valueList.length === 0 && <span className="text-sm italic opacity-50 text-center mt-2">Empty List</span>}
                                                           {valueList.map((str, vi) => {
                                                               const isNewStrInActive = isActiveKey && vi === valueList.length - 1 && st.phase === 'Add to Group';
                                                               return (
                                                                <div key={vi} className={`text-center font-mono text-lg px-3 py-1.5 rounded shadow-md border transition-all duration-300 ${isNewStrInActive ? 'bg-violet-600 text-white border-violet-500 animate-in slide-in-from-top-2' : isActiveKey ? 'bg-white text-slate-800 border-amber-200' : 'bg-slate-600 text-slate-200 border-slate-500'}`}>
                                                                    "{str}"
                                                                </div>
                                                               );
                                                           })}
                                                       </div>
                                                   </div>
                                               );
                                           })}
                                       </div>
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
                                    GROUPING COMPLETE
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