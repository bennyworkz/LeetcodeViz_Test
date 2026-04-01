import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, 
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bucketSort: {
    id: 'bucketSort',
    title: '1. Bucket Sort (Optimal)',
    icon: <BarChart size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'amber',
    code: `class Solution {
    public String frequencySort(String s) {
        Map<Character, Integer> map = new HashMap<>();
        for (char c : s.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }
        
        List<Character>[] bucket = new List[s.length() + 1];
        for (Character key : map.keySet()) {
            int freq = map.get(key);
            if (bucket[freq] == null) {
                bucket[freq] = new ArrayList<>();
            }
            bucket[freq].add(key);
        }
        
        StringBuilder sb = new StringBuilder();
        for (int pos = bucket.length - 1; pos >= 0; pos--) {
            if (bucket[pos] != null) {
                for (char c : bucket[pos]) {
                    for (int i = 0; i < pos; i++) {
                        sb.append(c);
                    }
                }
            }
        }
        return sb.toString();
    }
}`,
    desc: "The Optimal Approach: Bucket Sort. Instead of using a Priority Queue (Heap) which takes O(N log K) time, we can achieve strictly O(N) time! First, we count the frequency of each character using a HashMap. Then, we create an array of 'buckets' where the index represents the frequency. Since a character's maximum frequency is the length of the string, the array size is N + 1. We place each character into the bucket corresponding to its frequency. Finally, we iterate the buckets backwards (from highest frequency to lowest) and append each character to the result string 'frequency' times!"
  },
  maxHeap: {
    id: 'maxHeap',
    title: '2. Priority Queue (Max Heap)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N log K) | Space: O(N)',
    theme: 'fuchsia',
    code: `class Solution {
    public String frequencySort(String s) {
        Map<Character, Integer> map = new HashMap<>();
        for (char c : s.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }
        
        PriorityQueue<Character> maxHeap = new PriorityQueue<>((a, b) -> map.get(b) - map.get(a));
        maxHeap.addAll(map.keySet());
        
        StringBuilder sb = new StringBuilder();
        while (!maxHeap.isEmpty()) {
            char current = maxHeap.poll();
            int count = map.get(current);
            for (int i = 0; i < count; i++) {
                sb.append(current);
            }
        }
        return sb.toString();
    }
}`,
    desc: "The Heap Approach: We count frequencies and then dump all unique characters into a Max Heap (Priority Queue) ordered by their frequency descending. Polling from the heap gives us the most frequent character in O(log K) time. It's a very elegant and practical approach, though technically bounded by O(N log K) rather than strict O(N)."
  },
  customSort: {
    id: 'customSort',
    title: '3. Custom Sorting (Brute Force)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public String frequencySort(String s) {
        Map<Character, Integer> map = new HashMap<>();
        for (char c : s.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }
        
        List<Character> list = new ArrayList<>(map.keySet());
        list.sort((a, b) -> map.get(b) - map.get(a));
        
        StringBuilder sb = new StringBuilder();
        for (char c : list) {
            int count = map.get(c);
            for (int i = 0; i < count; i++) {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}`,
    desc: "The Brute Force Approach: We count the frequencies and put the unique characters into a standard List. We then sort the list entirely using a custom comparator based on the frequency map. Finally, we iterate over the sorted list and construct our result. Sorting takes O(K log K) time, making the overall time roughly O(N log N)."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  themeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, themeColor }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-600 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'amber' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|for|while|String|StringBuilder|Map|HashMap|List|ArrayList|PriorityQueue|Character|Integer|frequencySort|s|map|bucket|c|freq|pos|key|maxHeap|list|current|count|toCharArray|put|getOrDefault|keySet|get|add|addAll|poll|isEmpty|sort|append|toString|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'StringBuilder', 'Map', 'HashMap', 'List', 'ArrayList', 'PriorityQueue', 'Character', 'Integer'].includes(part);
            const isPointer = ['s', 'map', 'bucket', 'c', 'freq', 'pos', 'key', 'maxHeap', 'list', 'current', 'count'].includes(part);
            const isMapCall = ['frequencySort', 'toCharArray', 'put', 'getOrDefault', 'keySet', 'get', 'add', 'addAll', 'poll', 'isEmpty', 'sort', 'append', 'toString', 'length'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'");
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isCharLiteral ? 'text-amber-300' :
                  isNaN(parseInt(part)) ? (part.startsWith('"') ? 'text-amber-300' : '') : 'text-emerald-400'
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

// --- Main Application ---

export default function FrequencySortVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bucketSort');
  
  const [sInput, setSInput] = useState('tree');
  const [baseS, setBaseS] = useState<string>('tree');

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      // Basic sanitization
      let parsedS = sInput.replace(/[^a-zA-Z0-9]/g, '');
      if (parsedS.length === 0) parsedS = "tree";
      if (parsedS.length > 15) parsedS = parsedS.slice(0, 15); // UI bounds limitation

      setBaseS(parsedS);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [sInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const sStr = baseS;

    let map: Record<string, number> = {};
    let sb = "";

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            sStr, map: {...map}, sb, ...st 
        } 
    });

    add("Function Call", `public String frequencySort(String s="${sStr}")`, 2, {});
    add("Init HashMap", `Map<Character, Integer> map = new HashMap<>();\nCreating map to store character frequencies.`, 3, { hlInitMap: true });

    // Phase 1: Frequency Counting (Common to all)
    for (let i = 0; i < sStr.length; i++) {
        let c = sStr[i];
        add("Read Character", `for (char c : s.toCharArray())\nReading character '${c}' at index ${i}.`, 4, { hlCountLoop: true, activeCharIdx: i, curChar: c });
        
        map[c] = (map[c] || 0) + 1;
        add("Update Frequency", `map.put(c, map.getOrDefault(c, 0) + 1);\nIncrementing frequency of '${c}'. It is now ${map[c]}.`, 5, { hlCountUpdate: true, activeCharIdx: i, curChar: c });
    }

    if (selectedOpId === 'bucketSort') {
        let buckets: string[][] = Array.from({length: sStr.length + 1}, () => []);
        const addBucket = (ph: string, ds: string, ln: number, st: any = {}) => add(ph, ds, ln, { buckets: buckets.map(b => [...b]), ...st });

        addBucket("Init Buckets", `List<Character>[] bucket = new List[s.length() + 1];\nCreating buckets array of size ${sStr.length + 1}.`, 8, { hlInitBucket: true });

        const uniqueChars = Object.keys(map);
        for (let i = 0; i < uniqueChars.length; i++) {
            let key = uniqueChars[i];
            let freq = map[key];
            
            addBucket("Iterate Map Keys", `for (Character key : map.keySet())\nProcessing character '${key}'.`, 9, { hlBucketLoop: true, activeKey: key, curFreq: freq });
            addBucket("Check Null Bucket", `if (bucket[freq] == null) { bucket[freq] = new ArrayList<>(); }\nEnsuring bucket at index ${freq} is initialized.`, 11, { hlBucketCheck: true, activeKey: key, curFreq: freq });
            
            buckets[freq].push(key);
            addBucket("Add to Bucket", `bucket[freq].add(key);\nPlacing character '${key}' into bucket ${freq}.`, 14, { hlBucketAdd: true, activeKey: key, curFreq: freq });
        }

        addBucket("Init StringBuilder", `StringBuilder sb = new StringBuilder();\nPreparing to construct the final sorted string.`, 17, { hlInitSb: true });

        for (let pos = buckets.length - 1; pos >= 0; pos--) {
            addBucket("Iterate Buckets Backwards", `for (int pos = bucket.length - 1; pos >= 0; pos--)\nChecking bucket ${pos}.`, 18, { hlBuildLoop: true, activePos: pos });
            
            if (buckets[pos].length > 0) {
                addBucket("Bucket Not Empty", `if (bucket[pos] != null)\nFound characters in bucket ${pos}: [${buckets[pos].join(', ')}].`, 19, { hlBuildCheck: true, activePos: pos });
                
                for (let j = 0; j < buckets[pos].length; j++) {
                    let c = buckets[pos][j];
                    addBucket("Iterate Characters", `for (char c : bucket[pos])\nProcessing character '${c}' from bucket ${pos}.`, 20, { hlBuildCharLoop: true, activePos: pos, activeBuildChar: c });
                    
                    let addedStr = "";
                    for (let i = 0; i < pos; i++) {
                        sb += c;
                        addedStr += c;
                    }
                    addBucket("Append to Result", `for (int i = 0; i < pos; i++) { sb.append(c); }\nAppended '${c}' exactly ${pos} times. Current result: "${sb}".`, 22, { hlBuildAppend: true, activePos: pos, activeBuildChar: c, appendedStr: addedStr });
                }
            }
        }
        addBucket("Return Result", `return sb.toString();\nReturning the fully sorted string.`, 27, { isSuccess: true, finalAns: sb });

    } else if (selectedOpId === 'maxHeap') {
        let pq = Object.keys(map).sort((a,b) => map[b] - map[a]);
        const addHeap = (ph: string, ds: string, ln: number, st: any = {}) => add(ph, ds, ln, { pq: [...st.pq || pq], ...st });

        addHeap("Init Priority Queue", `PriorityQueue<Character> maxHeap = new PriorityQueue<>...;\nCreating a Max Heap based on character frequency.`, 7, { hlInitHeap: true, pq: [] });
        addHeap("Add All to Heap", `maxHeap.addAll(map.keySet());\nInserting all unique characters into the heap.`, 8, { hlHeapAdd: true, pq: [...pq] });

        addHeap("Init StringBuilder", `StringBuilder sb = new StringBuilder();\nPreparing to construct the final sorted string.`, 10, { hlInitSb: true, pq: [...pq] });

        let currentPQ = [...pq];
        while (currentPQ.length > 0) {
            addHeap("Check Heap Not Empty", `while (!maxHeap.isEmpty())\nChecking if there are more characters to process.`, 11, { hlBuildLoop: true, pq: [...currentPQ] });
            
            let current = currentPQ.shift()!;
            addHeap("Poll Max Element", `char current = maxHeap.poll();\nExtracting '${current}' which has the highest remaining frequency (${map[current]}).`, 12, { hlHeapPoll: true, pq: [...currentPQ], activeBuildChar: current });
            
            addHeap("Get Count", `int count = map.get(current);\nFrequency is ${map[current]}.`, 13, { hlGetCount: true, pq: [...currentPQ], activeBuildChar: current });

            let addedStr = "";
            for (let i = 0; i < map[current]; i++) {
                sb += current;
                addedStr += current;
            }
            addHeap("Append to Result", `for (int i = 0; i < count; i++) { sb.append(current); }\nAppended '${current}' exactly ${map[current]} times. Current result: "${sb}".`, 15, { hlBuildAppend: true, pq: [...currentPQ], activeBuildChar: current, appendedStr: addedStr });
        }
        addHeap("Return Result", `return sb.toString();\nReturning the fully sorted string.`, 18, { isSuccess: true, finalAns: sb, pq: [] });

    } else if (selectedOpId === 'customSort') {
        let list = Object.keys(map);
        const addList = (ph: string, ds: string, ln: number, st: any = {}) => add(ph, ds, ln, { list: [...st.list || list], ...st });

        addList("Init List", `List<Character> list = new ArrayList<>(map.keySet());\nCreating a list of unique characters.`, 7, { hlInitList: true, list: [...list] });
        
        list.sort((a,b) => map[b] - map[a]);
        addList("Sort List", `list.sort((a, b) -> map.get(b) - map.get(a));\nSorting the list descending based on frequency.`, 8, { hlSortList: true, list: [...list] });

        addList("Init StringBuilder", `StringBuilder sb = new StringBuilder();\nPreparing to construct the final sorted string.`, 10, { hlInitSb: true, list: [...list] });

        for (let i = 0; i < list.length; i++) {
            let current = list[i];
            addList("Iterate Sorted List", `for (char c : list)\nProcessing character '${current}'.`, 11, { hlBuildLoop: true, list: [...list], activeBuildChar: current });
            
            addList("Get Count", `int count = map.get(c);\nFrequency is ${map[current]}.`, 12, { hlGetCount: true, list: [...list], activeBuildChar: current });

            let addedStr = "";
            for (let j = 0; j < map[current]; j++) {
                sb += current;
                addedStr += current;
            }
            addList("Append to Result", `for (int i = 0; i < count; i++) { sb.append(c); }\nAppended '${current}' exactly ${map[current]} times. Current result: "${sb}".`, 14, { hlBuildAppend: true, list: [...list], activeBuildChar: current, appendedStr: addedStr });
        }
        addList("Return Result", `return sb.toString();\nReturning the fully sorted string.`, 17, { isSuccess: true, finalAns: sb, list: [...list] });
    }

    return steps;
  }, [baseS, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(0.85); 
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => { 
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

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

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

  const renderActiveDashboard = () => {
      if (st.sStr === undefined) return null;

      let isCountingPhase = st.hlCountLoop || st.hlCountUpdate || st.hlInitMap;
      let isIntermediatePhase = st.hlInitBucket || st.hlBucketLoop || st.hlBucketCheck || st.hlBucketAdd || st.hlInitHeap || st.hlHeapAdd || st.hlInitList || st.hlSortList;
      let isBuildingPhase = st.hlInitSb || st.hlBuildLoop || st.hlBuildCheck || st.hlBuildCharLoop || st.hlBuildAppend || st.hlHeapPoll || st.hlGetCount || st.isSuccess;

      let intermediateTitle = selectedOpId === 'bucketSort' ? '2. Bucketing' : (selectedOpId === 'maxHeap' ? '2. Max Heap' : '2. Sort List');

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.isSuccess ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200'} scale-105 z-40`}>
              
              <div className="flex gap-4 w-full mb-6 relative justify-between">
                  <div className={`flex-1 rounded-xl py-2 px-4 text-center text-xs font-black uppercase tracking-widest transition-all ${isCountingPhase ? 'bg-amber-100 text-amber-700 border border-amber-300 shadow-sm' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>1. Freq Map</div>
                  <div className={`flex-1 rounded-xl py-2 px-4 text-center text-xs font-black uppercase tracking-widest transition-all ${isIntermediatePhase ? 'bg-sky-100 text-sky-700 border border-sky-300 shadow-sm' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>{intermediateTitle}</div>
                  <div className={`flex-1 rounded-xl py-2 px-4 text-center text-xs font-black uppercase tracking-widest transition-all ${isBuildingPhase ? 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-300 shadow-sm' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>3. Build Result</div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 font-mono w-full min-h-[80px]">
                  
                  {isCountingPhase && (
                      <>
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Type size={12}/> Target Char</span>
                              <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlCountLoop || st.hlCountUpdate ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                  {st.curChar !== undefined ? st.curChar : '-'}
                              </div>
                          </div>
                      </>
                  )}

                  {isIntermediatePhase && selectedOpId === 'bucketSort' && (
                      <>
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><Type size={12}/> Map Key</span>
                              <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.activeKey ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                  {st.activeKey !== undefined ? st.activeKey : '-'}
                              </div>
                          </div>
                          <ArrowRight size={24} className="text-slate-300" />
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><Hash size={12}/> Frequency (Index)</span>
                              <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.curFreq ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                  {st.curFreq !== undefined ? st.curFreq : '-'}
                              </div>
                          </div>
                      </>
                  )}
                  {isIntermediatePhase && (selectedOpId === 'maxHeap' || selectedOpId === 'customSort') && (
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><LayersIcon size={12}/> Status</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg uppercase`}>
                              {st.hlInitHeap ? "Allocating Heap" : st.hlHeapAdd ? "Filling Heap" : st.hlInitList ? "Extracting Keys" : "Sorting Array"}
                          </div>
                      </div>
                  )}

                  {isBuildingPhase && !st.isSuccess && (
                      <>
                          {selectedOpId === 'bucketSort' && (
                              <>
                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><LayersIcon size={12}/> Bucket Index (pos)</span>
                                      <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.activePos !== undefined ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                          {st.activePos !== undefined ? st.activePos : '-'}
                                      </div>
                                  </div>
                                  <ArrowRight size={24} className="text-slate-300" />
                              </>
                          )}
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Type size={12}/> Active Char</span>
                              <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.activeBuildChar ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                  {st.activeBuildChar !== undefined ? st.activeBuildChar : '-'}
                              </div>
                          </div>
                      </>
                  )}

                  {st.isSuccess && (
                      <div className="flex flex-col items-center justify-center gap-2 font-mono min-h-[80px] w-full">
                          <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Final Sorted String</div>
                          <div className={`flex items-center justify-center text-emerald-700 bg-emerald-100 border-emerald-400 font-mono font-black text-3xl px-8 py-4 rounded-2xl border-2 shadow-md w-full break-all`}>
                              "{st.finalAns}"
                          </div>
                      </div>
                  )}

              </div>
          </div>
      );
  };

  const renderVisuals = () => {
      if (st.sStr === undefined) return <span className="text-slate-400 italic">empty</span>;

      const totalBuckets = st.sStr.length + 1;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Arrays */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '600px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      {/* Top Row: Input String */}
                      <div className="w-full mt-10 px-10 flex flex-col items-center z-10 relative">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Input String 's'</span>
                          <div className="flex gap-2">
                              {st.sStr.split('').map((char: string, i: number) => {
                                  let isReading = st.hlCountLoop && st.activeCharIdx === i;
                                  return (
                                      <div key={`s-${i}`} className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-mono font-black text-lg rounded-lg border-2 transition-all duration-300 ${isReading ? 'bg-amber-100 border-amber-500 text-amber-800 scale-125 shadow-lg' : 'bg-white border-slate-300 text-slate-600 shadow-sm'}`}>
                                          {char}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Middle Row: Frequency Map */}
                      {st.map && Object.keys(st.map).length > 0 && (
                          <div className="w-full mt-8 px-10 flex flex-col items-center z-10 relative">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Frequency Map</span>
                              <div className="flex flex-wrap justify-center gap-3">
                                  {Object.entries(st.map).map(([char, count], i) => {
                                      let isUpdating = st.hlCountUpdate && st.curChar === char;
                                      let isAccessingForBucket = (st.hlBucketLoop || st.hlBucketCheck || st.hlBucketAdd || st.hlHeapPoll || st.hlBuildLoop || st.hlBuildAppend || st.hlGetCount) && (st.activeKey === char || st.activeBuildChar === char);
                                      let bgClass = "bg-white border-slate-300";
                                      
                                      if (isUpdating) bgClass = "bg-amber-100 border-amber-500 scale-110 shadow-lg ring-2 ring-amber-200";
                                      else if (isAccessingForBucket) bgClass = "bg-sky-100 border-sky-500 scale-110 shadow-lg ring-2 ring-sky-200";

                                      return (
                                          <div key={`map-${i}`} className={`flex border-2 rounded-xl overflow-hidden transition-all duration-300 ${bgClass}`}>
                                              <div className="bg-slate-100 px-3 py-1 font-mono font-black text-slate-700 border-r-2 border-slate-200 flex items-center justify-center">{char}</div>
                                              <div className="px-3 py-1 font-mono font-black text-slate-800 flex items-center justify-center">{String(count)}</div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      )}

                      {/* Bottom Row: Buckets Array (For Bucket Sort) */}
                      {st.buckets && selectedOpId === 'bucketSort' && (
                          <div className="w-full mt-10 px-10 flex flex-col items-center z-10 relative">
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-500 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 mb-4">Buckets Array (Index = Frequency)</span>
                              
                              <div className="flex justify-center gap-2 md:gap-4 w-full overflow-x-auto pb-4 px-4">
                                  {st.buckets.map((bucketList: string[], freqIdx: number) => {
                                      let isActiveBucket = (st.hlBucketCheck || st.hlBucketAdd) && st.curFreq === freqIdx;
                                      let isBuildingFromHere = (st.hlBuildLoop || st.hlBuildCheck || st.hlBuildCharLoop || st.hlBuildAppend) && st.activePos === freqIdx;
                                      
                                      let bucketBorder = "border-slate-300";
                                      let bucketBg = "bg-slate-50";
                                      let labelColor = "text-slate-400";
                                      
                                      if (isActiveBucket) {
                                          bucketBorder = "border-sky-400";
                                          bucketBg = "bg-sky-50";
                                          labelColor = "text-sky-600";
                                      } else if (isBuildingFromHere) {
                                          bucketBorder = "border-fuchsia-400";
                                          bucketBg = "bg-fuchsia-50";
                                          labelColor = "text-fuchsia-600";
                                      } else if (bucketList.length > 0) {
                                          bucketBorder = "border-emerald-300";
                                          bucketBg = "bg-emerald-50/50";
                                          labelColor = "text-emerald-600";
                                      }

                                      return (
                                          <div key={`bucket-${freqIdx}`} className={`flex flex-col items-center transition-all duration-300 ${isActiveBucket || isBuildingFromHere ? 'scale-110 -translate-y-2' : ''}`}>
                                              <div className={`w-12 md:w-16 min-h-[80px] border-x-4 border-b-4 rounded-b-xl flex flex-col-reverse items-center p-1 gap-1 transition-colors duration-300 ${bucketBorder} ${bucketBg}`}>
                                                  {bucketList.map((char: string, cIdx: number) => {
                                                      let isBeingAppended = st.hlBuildAppend && st.activeBuildChar === char && st.activePos === freqIdx;
                                                      return (
                                                          <div key={`bc-${freqIdx}-${cIdx}`} className={`w-full aspect-square rounded-lg flex items-center justify-center font-mono font-black border-2 transition-all duration-300 ${isBeingAppended ? 'bg-fuchsia-500 border-fuchsia-600 text-white animate-pulse' : 'bg-white border-slate-300 text-slate-700 shadow-sm'}`}>
                                                              {char}
                                                          </div>
                                                      )
                                                  })}
                                              </div>
                                              <span className={`font-mono text-[10px] font-black mt-2 bg-white px-2 py-0.5 rounded shadow-sm border ${labelColor}`}>{freqIdx}</span>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      )}

                      {/* Bottom Row: Priority Queue or List (For Heap/Custom Sort) */}
                      {(st.pq || st.list) && selectedOpId !== 'bucketSort' && (
                          <div className="w-full mt-10 px-10 flex flex-col items-center z-10 relative">
                              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500 bg-fuchsia-50 px-2 py-0.5 rounded border border-fuchsia-200 mb-4">
                                  {st.pq ? 'Priority Queue (Max Heap)' : 'Sorted Character List'}
                              </span>
                              <div className="flex justify-center gap-3 md:gap-5 w-full overflow-x-auto pb-4 px-4">
                                  {(st.pq || st.list).map((char: string, idx: number) => {
                                      let isActive = st.activeBuildChar === char;
                                      return (
                                          <div key={`col-${idx}`} className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-125 -translate-y-2' : 'scale-100'}`}>
                                              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center border-[3px] shadow-sm transition-all duration-300 ${isActive ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-900' : 'bg-white border-slate-300 text-slate-700'}`}>
                                                  <span className="font-mono font-black text-xl">{char}</span>
                                                  <span className="text-[10px] font-bold text-slate-400 mt-1">f:{st.map[char]}</span>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      )}

                      {/* Output StringBuilder */}
                      {st.sb !== undefined && (st.hlInitSb || st.hlBuildLoop || st.hlBuildCheck || st.hlBuildCharLoop || st.hlBuildAppend || st.hlHeapPoll || st.hlGetCount || st.isSuccess) && (
                          <div className="w-full mt-6 px-10 flex flex-col items-center z-10 relative">
                              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500 mb-2">StringBuilder Output</span>
                              <div className={`min-h-[48px] w-full max-w-lg border-2 rounded-xl flex items-center px-4 font-mono font-black text-xl transition-all duration-300 ${st.hlBuildAppend ? 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-800 ring-2 ring-fuchsia-200' : 'bg-white border-slate-300 text-slate-700'}`}>
                                  {st.sb}
                                  {st.hlBuildAppend && <span className="text-fuchsia-400 ml-1 animate-pulse">_</span>}
                              </div>
                          </div>
                      )}

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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <BarChart className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Sort Characters By Frequency</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Bucket Sort &amp; Heaps
                  </span>
                  <span>•</span>
                  <span>LeetCode 451</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><BarChart size={28}/> Order by Occurrence</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a string <code>s</code>, sort it in <strong>decreasing order</strong> based on the frequency of the characters.</p>
                        <p>The frequency of a character is the number of times it appears in the string.</p>
                        <p className="font-bold mt-4">Return the sorted string. If there are multiple answers, return any of them.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "tree"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">"eert"</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">'e' appears twice while 'r' and 't' both appear once.<br/>So 'e' must appear before both 'r' and 't'. Therefore "eetr" is also a valid answer.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "cccaaa"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">"aaaccc"</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs whitespace-normal">Both 'c' and 'a' appear three times, so both "cccaaa" and "aaaccc" are valid answers.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 3:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "Aabb"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">"bbAa"</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs whitespace-normal">"bbaA" is also a valid answer, but "Aabb" is incorrect. Note that 'A' and 'a' are treated as two different characters.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= s.length &lt;= 5 * 10^5</li>
                            <li>s consists of uppercase and lowercase English letters and digits.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Activity size={16} className="text-sky-500"/> Beyond Normal Sorting</h4>
                        <p className="text-sm leading-relaxed">You could count frequencies and dump them into a Priority Queue (Max Heap). Polling from the heap takes $O(\log K)$ time per unique character. It works, but we can do even better because the maximum possible frequency is strictly bounded by the length of the string $N$.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><LayersIcon size={16} className={`text-${themeColor}-500`}/> The Bucket Trick</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Instead of sorting the frequencies, we map the frequencies to array <strong>indices</strong>! We create an array of lists called `buckets` where `buckets[i]` holds all characters that appear exactly `i` times. By iterating this array backwards from $N$ to $1$, we naturally get the characters in sorted order in exactly $O(N)$ time.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Input String (s)</label>
                            <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.2em]`} placeholder="tree" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                <PartyPopper size={24}/> SORTING COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Characters successfully sorted by frequency.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCountUpdate || st.hlBucketAdd || st.hlBuildAppend ? 'text-amber-400' : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[380px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><BarChart size={14} className={`text-${themeColor}-500`}/> Data Structure Visualizer</span>
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-amber-100 text-amber-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering Bucket Sort for limited integer domains.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-amber-500"/> 1. Frequencies as Indices</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Usually, to sort items, we compare them against each other taking $O(K \log K)$ time. However, when the range of values we are sorting by is strictly bounded, we can use Bucket Sort.</p>
                        <p className="text-slate-600 leading-relaxed">Here, the maximum possible frequency of any character is $N$ (the length of the string). We create an array of "buckets" of size $N + 1$. We then place each character into the bucket at index exactly equal to its frequency. By doing this, the array naturally sorts the characters by frequency in $O(N)$ time!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-sky-500"/> 2. Backwards Reassembly</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Because we want to sort in <strong>decreasing</strong> order, we iterate through our buckets array backwards, starting from index $N$ down to $1$.</p>
                        <p className="text-slate-600 leading-relaxed">If a bucket is not empty, it contains characters that appeared exactly <code>pos</code> times. For each character in that bucket, we append it to our result string exactly <code>pos</code> times. This perfectly reconstructs the sorted string without any complex sorting comparator logic.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We iterate the string to count frequencies $O(N)$. We place up to $N$ unique characters into buckets $O(N)$. We iterate the bucket array (size $N+1$) and append characters to form the final $N$-length string $O(N)$. Everything scales linearly.</li>
                            <li><strong>Space Complexity: O(N).</strong> We allocate a frequency map, a bucket array of lists, and a final StringBuilder. In the worst case, these all scale linearly with $N$.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-amber-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a quintessential hash map and sorting problem. Interviewers will expect you to solve it quickly, but the true test is whether you can optimize it from $O(N \log N)$ down to $O(N)$."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we use an integer array instead of a HashMap for frequencies?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, and it would be faster."</p>
                            <p>Since the problem constraints state that characters consist of uppercase and lowercase English letters and digits, we could use an integer array of size 128 or 256 (covering standard ASCII). <code>int[] counts = new int[256];</code>. Looking up and updating an array by ASCII value is vastly faster than calculating hashes for a HashMap. I would mention this optimization in an interview.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "When is Priority Queue better than Bucket Sort?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "When the maximum frequency is extremely large, but the number of unique characters is very small."</p>
                            <p>If we had a string of length $10^9$ but it only contained 5 unique characters, bucket sort would force us to allocate and iterate over a massive empty array of size $10^9$. A Priority Queue would only hold 5 elements, sorting them in $O(5 \log 5)$ time, which is practically $O(1)$, taking virtually zero memory compared to the bucket array.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "What if multiple characters have the same frequency?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The problem states any order is valid."</p>
                            <p>Our buckets are Arrays/Lists of characters. If 'c' and 'a' both appear 3 times, bucket[3] will look like <code>['c', 'a']</code>. When we iterate through the bucket, we will just output all the 'c's then all the 'a's (or vice versa depending on insertion order). Since the problem accepts any valid output, we don't need any secondary sorting within the buckets."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-hidden">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCountUpdate || st.hlBucketAdd || st.hlBuildAppend ? 'text-amber-400' : 'text-white'}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Input String (s)</label>
                              <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.2em]`} placeholder="tree" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all`}><Minimize size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">SORTING COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Sorted String</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex items-center gap-2 break-all">"{st.finalAns}"</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-600 hover:bg-${themeColor}-700 shadow-${themeColor}-900/20`}>
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