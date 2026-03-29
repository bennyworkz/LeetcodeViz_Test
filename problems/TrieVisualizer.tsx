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
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  trieInsert: {
    id: 'trieInsert',
    title: '1. Insert Word',
    icon: <PlusSquare size={16} />,
    complexity: 'Time: O(M) | Space: O(M)',
    theme: 'violet',
    code: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;
}
class Trie {
    TrieNode root;
    public Trie() { root = new TrieNode(); }

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (node.children[index] == null) {
                node.children[index] = new TrieNode();
            }
            node = node.children[index];
        }
        node.isEndOfWord = true;
    }
}`,
    desc: "To insert a word into the Trie, we start at the root node and iterate through each character of the word. For each character, we calculate its array index (0-25). If the current node doesn't have a child at that index, we allocate a new TrieNode. We then move our pointer to that child node and repeat. After the loop finishes, we mark the final node's boolean flag `isEndOfWord = true` to signify a complete word ends there."
  },
  trieSearch: {
    id: 'trieSearch',
    title: '2. Search Exact Word',
    icon: <Search size={16} />,
    complexity: 'Time: O(M) | Space: O(1)',
    theme: 'emerald',
    code: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;
}
class Trie {
    TrieNode root;
    public Trie() { root = new TrieNode(); }

    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (node.children[index] == null) {
                return false;
            }
            node = node.children[index];
        }
        return node.isEndOfWord;
    }
}`,
    desc: "To search for a specific word, we traverse the Trie character by character. If at any point the next required character node is `null`, we know the word does not exist and immediately return `false`. If we successfully navigate through the entire word, we must check the final node's `isEndOfWord` flag. If it's true, the exact word exists. If it's false, it means the word is only present as a prefix to a longer word, so we return false."
  },
  trieStartsWith: {
    id: 'trieStartsWith',
    title: '3. StartsWith Prefix',
    icon: <ArrowRight size={16} />,
    complexity: 'Time: O(M) | Space: O(1)',
    theme: 'sky',
    code: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;
}
class Trie {
    TrieNode root;
    public Trie() { root = new TrieNode(); }

    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            int index = c - 'a';
            if (node.children[index] == null) {
                return false;
            }
            node = node.children[index];
        }
        return true;
    }
}`,
    desc: "Searching for a prefix is almost identical to searching for a full word. We traverse the Trie based on the characters in the prefix string. If we hit a `null` child path, the prefix does not exist in any word in the Trie, so we return `false`. However, if we successfully navigate to the end of the prefix string, we instantly return `true`. We do not care if `isEndOfWord` is true or false, because by definition, ANY valid path forms a prefix."
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
  idPrefix?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|char|boolean|class|return|if|else|while|for|new|String|insert|search|startsWith|TrieNode|Trie|children|isEndOfWord|root|word|prefix|node|index|toCharArray|c)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`${idPrefix}code-line-${num}`} className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const trimmed = part.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                return <span key={idx} className="text-slate-500 italic">{part}</span>;
            }
            
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['TrieNode', 'Trie', 'String'].includes(part);
            const isPointer = ['children', 'isEndOfWord', 'root', 'word', 'prefix', 'node', 'index', 'c'].includes(part);
            const isMapCall = ['insert', 'search', 'startsWith', 'toCharArray'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}'].includes(trimmed);
            
            return (
              <span 
                key={idx} 
                className={
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) && part.match(/^[a-zA-Z_]\w*$/) && !part.startsWith('"') && !part.startsWith("'") ? `text-${theme}-300` : 
                  (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : 'text-emerald-400')
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

export default function TrieVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('trieInsert');
  
  const [baseWordsInput, setBaseWordsInput] = useState('apple, app, bear');
  const [targetWordInput, setTargetWordInput] = useState('app');
  
  const [baseWords, setBaseWords] = useState<string[]>(['apple', 'app', 'bear']);
  const [targetWord, setTargetWord] = useState<string>('app');

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseInputs = (wordsStr: string, tgtStr: string) => {
      let bWords = wordsStr.split(',').map(s => s.trim().toLowerCase().replace(/[^a-z]/g, '')).filter(s => s.length > 0);
      let tWord = tgtStr.trim().toLowerCase().replace(/[^a-z]/g, '');
      
      if (bWords.length === 0) bWords = ['apple', 'app', 'bear'];
      if (tWord.length === 0) tWord = 'app';
      
      return { bWords: bWords.slice(0, 10), tWord: tWord.substring(0, 10) };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const { bWords, tWord } = parseInputs(baseWordsInput, targetWordInput);
      setBaseWords(bWords);
      setTargetWord(tWord);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [baseWordsInput, targetWordInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Geometry Generation for N-ary Trie
  const buildTrieGeometry = (bWords: string[], tWord: string, isInsert: boolean) => {
      let root = { id: 0, char: '*', isWord: false, children: {} as any, width: 0, x: 0, y: 0 };
      let nodeId = 1;
      
      let baseNodes = new Set<number>([0]);
      let baseEdges = new Set<string>();
      let baseWordsSet = new Set<number>();

      // 1. Build Base Tree
      for (let word of bWords) {
          let curr = root;
          for (let char of word) {
              if (!curr.children[char]) {
                  curr.children[char] = { id: nodeId++, char: char, isWord: false, children: {} as any, width: 0, x: 0, y: 0 };
              }
              let child = curr.children[char];
              baseNodes.add(child.id);
              baseEdges.add(`${curr.id}-${child.id}`);
              curr = child;
          }
          curr.isWord = true;
          baseWordsSet.add(curr.id);
      }

      // 2. Overlay Target Word (For geometry bounds ONLY if it's insert, we hide it later)
      if (isInsert) {
          let curr = root;
          for (let char of tWord) {
              if (!curr.children[char]) {
                  curr.children[char] = { id: nodeId++, char: char, isWord: false, children: {} as any, width: 0, x: 0, y: 0 };
              }
              curr = curr.children[char];
          }
      }

      // 3. Calculate Subtree Widths
      const calcWidth = (node: any) => {
          let keys = Object.keys(node.children);
          if (keys.length === 0) {
              node.width = 60; // base node width spacing
              return node.width;
          }
          let w = 0;
          for (let k of keys) w += calcWidth(node.children[k]);
          node.width = Math.max(w, 60);
          return node.width;
      }
      calcWidth(root);

      // 4. Assign Coordinates
      let renderNodes: any[] = [];
      let renderEdges: any[] = [];
      let maxDepth = 0;

      const assignCoords = (node: any, x: number, y: number, depth: number) => {
          if (depth > maxDepth) maxDepth = depth;
          node.x = x;
          node.y = y;
          renderNodes.push(node);
          
          let currentX = x - node.width / 2;
          let keys = Object.keys(node.children);
          for (let k of keys) {
              let child = node.children[k];
              let childX = currentX + child.width / 2;
              
              renderEdges.push({ 
                  source: node.id, target: child.id, char: k, 
                  sx: node.x, sy: node.y + 20, tx: childX, ty: y + 80 - 20 
              });
              
              assignCoords(child, childX, y + 80, depth + 1);
              currentX += child.width;
          }
      }
      assignCoords(root, 0, 50, 0);

      // Center horizontally
      let minX = Math.min(...renderNodes.map(n => n.x));
      let maxX = Math.max(...renderNodes.map(n => n.x));
      let cx = (minX + maxX) / 2;
      renderNodes.forEach(n => n.x -= cx);
      renderEdges.forEach(e => { e.sx -= cx; e.tx -= cx; });

      return { root, nodes: renderNodes, edges: renderEdges, baseNodes, baseEdges, baseWordsSet, maxDepth };
  };

  const trieData = useMemo(() => buildTrieGeometry(baseWords, targetWord, selectedOpId === 'trieInsert'), [baseWords, targetWord, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!trieData.root) return [];

    let visibleNodes = new Set<number>(trieData.baseNodes);
    let visibleEdges = new Set<string>(trieData.baseEdges);
    let isWordFlags = new Set<number>(trieData.baseWordsSet);

    if (selectedOpId === 'trieInsert') {
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                visibleNodes: new Set(visibleNodes), visibleEdges: new Set(visibleEdges), isWordFlags: new Set(isWordFlags), ...st 
            } 
        });

        add("Function Call", `public void insert(String word)`, 9, { hlPhase: 'init' });
        
        let currId = 0;
        let currObj = trieData.root;
        add("Init Pointer", `TrieNode node = root;`, 10, { hlPhase: 'init', currNodeId: currId });

        for (let i = 0; i < targetWord.length; i++) {
            let char = targetWord[i];
            add("For Loop", `for (char c : word.toCharArray())\nLooping over character '${char}'.`, 11, { hlPhase: 'loop', currNodeId: currId, currCharIdx: i, activeChar: char });

            let cIndex = char.charCodeAt(0) - 97;
            add("Calc Index", `int index = c - 'a';\nCharacter '${char}' resolves to array index ${cIndex}.`, 12, { hlPhase: 'math', currNodeId: currId, currCharIdx: i, activeChar: char, cIndex });

            let childObj = currObj.children[char];
            let isMissing = !visibleNodes.has(childObj.id);

            add("Check Children Array", `if (node.children[index] == null)\nDoes the current node have a branch for '${char}' (index ${cIndex})? ${isMissing ? 'NO. We must create it.' : 'YES. Path exists.'}`, 13, { hlPhase: 'check', currNodeId: currId, currCharIdx: i, activeChar: char, cIndex, isMissing });

            if (isMissing) {
                visibleNodes.add(childObj.id);
                visibleEdges.add(`${currId}-${childObj.id}`);
                add("Allocate Node", `node.children[index] = new TrieNode();\nAllocated a new TrieNode and connected it via '${char}'.`, 14, { hlPhase: 'mutate', currNodeId: currId, currCharIdx: i, activeChar: char, cIndex, createdId: childObj.id });
            }

            currId = childObj.id;
            currObj = childObj;
            add("Traverse Edge", `node = node.children[index];\nMoving pointer down the '${char}' edge to the child node.`, 16, { hlPhase: 'traverse', currNodeId: currId, currCharIdx: i, activeChar: char, cIndex });
        }

        isWordFlags.add(currId);
        add("Mark End of Word", `node.isEndOfWord = true;\nLoop complete. Marking the final node to signify a valid word ends here.`, 18, { hlPhase: 'mark', currNodeId: currId, isSuccess: true });
    } 
    else if (selectedOpId === 'trieSearch' || selectedOpId === 'trieStartsWith') {
        const isSearch = selectedOpId === 'trieSearch';
        const fnName = isSearch ? 'search' : 'startsWith';
        const startLine = 9;

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                visibleNodes: new Set(visibleNodes), visibleEdges: new Set(visibleEdges), isWordFlags: new Set(isWordFlags), ...st 
            } 
        });

        add("Function Call", `public boolean ${fnName}(String ${isSearch ? 'word' : 'prefix'})`, startLine, { hlPhase: 'init' });
        
        let currId = 0;
        let currObj = trieData.root;
        add("Init Pointer", `TrieNode node = root;`, startLine + 1, { hlPhase: 'init', currNodeId: currId });

        for (let i = 0; i < targetWord.length; i++) {
            let char = targetWord[i];
            add("For Loop", `for (char c : ${isSearch ? 'word' : 'prefix'}.toCharArray())\nLooking for character '${char}'.`, startLine + 2, { hlPhase: 'loop', currNodeId: currId, currCharIdx: i, activeChar: char });

            let cIndex = char.charCodeAt(0) - 97;
            add("Calc Index", `int index = c - 'a';\nCharacter '${char}' maps to index ${cIndex}.`, startLine + 3, { hlPhase: 'math', currNodeId: currId, currCharIdx: i, activeChar: char, cIndex });

            let childObj = currObj.children[char];
            let isMissing = !childObj || !visibleNodes.has(childObj.id);

            add("Check Children Array", `if (node.children[index] == null)\nDoes the current node have a branch for '${char}'? ${isMissing ? 'NO. Dead end.' : 'YES. Safe to proceed.'}`, startLine + 4, { hlPhase: 'check', currNodeId: currId, currCharIdx: i, activeChar: char, cIndex, isMissing });

            if (isMissing) {
                add("Return False", `return false;\nPath broken. The ${isSearch ? 'word' : 'prefix'} does not exist in the Trie.`, startLine + 5, { hlPhase: 'failure', currNodeId: currId, currCharIdx: i, activeChar: char, isSuccess: true, finalAns: false });
                return steps;
            }

            currId = childObj.id;
            currObj = childObj;
            add("Traverse Edge", `node = node.children[index];\nMoving pointer down the '${char}' edge.`, startLine + 7, { hlPhase: 'traverse', currNodeId: currId, currCharIdx: i, activeChar: char, cIndex });
        }

        if (isSearch) {
            let isWord = isWordFlags.has(currId);
            add("Check isEndOfWord", `return node.isEndOfWord;\nWe reached the end of the input word. Is it a valid word in the Trie? ${isWord ? 'YES.' : 'NO (it is only a prefix).'}`, startLine + 9, { hlPhase: 'mark', currNodeId: currId, isSuccess: true, finalAns: isWord, checkWordFlag: true });
        } else {
            add("Return True", `return true;\nWe successfully navigated the entire prefix. Returning true!`, startLine + 9, { hlPhase: 'success', currNodeId: currId, isSuccess: true, finalAns: true });
        }
    }

    return steps;
  }, [baseWords, targetWord, trieData, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Auto-scroll code view to active line
  useEffect(() => {
    const prefix = isFullscreen ? 'fs-' : 'main-';
    const container = isFullscreen ? codeContainerFullscreenRef.current : codeContainerMainRef.current;
    
    if (!container) return;
    
    const activeLineEl = document.getElementById(`${prefix}code-line-${curStepData.line}`);
    if (activeLineEl) {
        const offsetTop = activeLineEl.offsetTop;
        container.scrollTo({ top: offsetTop - 60, behavior: 'smooth' });
    }
  }, [currentStep, curStepData.line, isFullscreen]);

  // --- UI Handlers ---
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.scrollbar-thin')) return;
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
      if (st.isSuccess) return null;

      let cNode = trieData.nodes.find(n => n.id === st.currNodeId);
      
      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'mutate' ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : (st.hlPhase === 'traverse' ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-105` : 'border-slate-200')}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Keyboard size={14}/> Live Execution Trace</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  <div className="flex flex-col items-center min-w-[100px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'traverse' ? `text-${themeColor}-500` : 'text-slate-400'}`}>Pointer (node)</span>
                      <div className={`flex items-center justify-center w-14 h-14 border-4 rounded-full transition-all duration-300 ${st.hlPhase === 'traverse' ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          <span className="font-black text-xl">{cNode ? cNode.char : '?'}</span>
                      </div>
                  </div>

                  {st.activeChar !== undefined ? (
                      <>
                          <div className="flex flex-col items-center justify-center font-bold px-2 text-slate-400">
                              <ArrowRight size={24} className={st.hlPhase === 'check' || st.hlPhase === 'mutate' ? "text-amber-500 animate-pulse" : "text-slate-300"}/>
                          </div>

                          <div className="flex flex-col items-center min-w-[100px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'math' ? 'text-amber-500' : 'text-slate-400'}`}>Target Char</span>
                              <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'math' ? `bg-amber-100 border-amber-500 text-amber-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                  {st.activeChar}
                              </div>
                          </div>
                          
                          <div className="flex flex-col items-center min-w-[100px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'check' || st.hlPhase === 'mutate' ? 'text-rose-500' : 'text-slate-400'}`}>Array Index</span>
                              <div className={`border-2 text-2xl font-black px-6 py-2.5 rounded-xl transition-all duration-300 shadow-inner ${st.hlPhase === 'check' || st.hlPhase === 'mutate' ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                                  children[{st.cIndex !== undefined ? st.cIndex : '?'}]
                              </div>
                          </div>

                      </>
                  ) : (
                      <div className="flex items-center justify-center min-h-[80px] px-8 text-slate-400 italic text-sm font-mono">
                          Initializing traversal...
                      </div>
                  )}

              </div>
          </div>
      );
  }

  const renderVisuals = () => {
      if (trieData.nodes.length === 0) return <span className="text-slate-400 italic mt-10">Processing Trie...</span>;

      const containerSize = Math.max(350, trieData.maxDepth * 80 + 150);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Target Word Array Tracker */}
              <div className="flex w-full max-w-6xl gap-4 px-4 pointer-events-auto items-stretch justify-center">
                  
                  <div className={`w-full md:w-3/4 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 border-slate-200`}>
                       <div className="flex justify-between items-center mb-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2`}>
                               <ListOrdered size={14}/> Target Array ( word.toCharArray() )
                           </span>
                       </div>
                       <div className="flex gap-2 min-h-[60px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-center justify-center">
                           <div className="flex gap-1 bg-slate-50 border border-slate-200 rounded-xl p-2 shadow-inner">
                               {targetWord.split('').map((char, idx) => {
                                   let isPast = st.currCharIdx !== undefined && idx < st.currCharIdx;
                                   let isCurr = st.currCharIdx === idx && !st.isSuccess;
                                   
                                   let cellClass = "bg-white border-slate-300 text-slate-600";
                                   if (isCurr) cellClass = `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-md ring-2 ring-${themeColor}-200 scale-110 font-bold z-10`;
                                   else if (isPast) cellClass = "bg-slate-200 border-slate-300 text-slate-400 opacity-60";

                                   return (
                                       <div key={`w-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-300 shrink-0`}>
                                           <div className={`flex items-center justify-center w-10 h-10 border-2 rounded-lg font-mono text-lg font-black ${cellClass}`}>
                                               {char}
                                           </div>
                                           <span className="text-[9px] font-bold text-slate-400 font-mono">idx {idx}</span>
                                       </div>
                                   );
                               })}
                           </div>
                       </div>
                  </div>

              </div>

              {/* Free-floating Interactive State Space Graph */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700 flex items-center justify-center`} style={{ minHeight: `${containerSize}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> N-ary Prefix Tree</span>
                      
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                              {/* Render Edges */}
                              {trieData.edges.map((edge: any, idx: number) => {
                                  let isVisible = st.visibleEdges && st.visibleEdges.has(`${edge.source}-${edge.target}`);
                                  if (!isVisible) return null; // dynamically build tree

                                  let isActivelyTraversing = st.currNodeId === edge.source && st.activeChar === edge.char && st.hlPhase === 'traverse';
                                  let isCreating = st.createdId === edge.target && st.hlPhase === 'mutate';
                                  
                                  let strokeColor = '#cbd5e1'; // default slate
                                  let strokeWidth = 2;
                                  let opacity = 0.5;

                                  if (isCreating) {
                                      strokeColor = '#f59e0b'; // amber
                                      strokeWidth = 4;
                                      opacity = 1;
                                  } else if (isActivelyTraversing) {
                                      strokeColor = themeColor === 'sky' ? '#0ea5e9' : (themeColor === 'emerald' ? '#10b981' : '#8b5cf6');
                                      strokeWidth = 4;
                                      opacity = 1;
                                  } else if (st.isSuccess && st.finalAns === true) {
                                      // Optional: trace the full successful path? Hard to do perfectly without a full path array, standard coloring is fine.
                                  }

                                  return <line key={`edge-${idx}`} x1={`calc(50% + ${edge.sx}px)`} y1={edge.sy} x2={`calc(50% + ${edge.tx}px)`} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          {/* Render Nodes */}
                          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                          {trieData.nodes.map((node: any) => {
                              let isVisible = st.visibleNodes && st.visibleNodes.has(node.id);
                              if (!isVisible) return null;

                              let isActive = st.currNodeId === node.id && !st.isSuccess;
                              let isWord = st.isWordFlags && st.isWordFlags.has(node.id);
                              let isCreating = st.createdId === node.id && st.hlPhase === 'mutate';
                              
                              let bgClass = "bg-white border-slate-300 text-slate-500 opacity-90"; // Base
                              let ringClass = isWord ? "ring-[3px] ring-slate-300 shadow-sm" : "";
                              
                              if (node.id === 0) {
                                  bgClass = "bg-slate-800 border-slate-900 text-white shadow-md z-10"; // Root
                              } else if (isCreating) {
                                  bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl scale-125 z-40";
                                  ringClass = isWord ? "ring-[3px] ring-amber-400" : "";
                              } else if (isActive) {
                                  bgClass = `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-xl scale-125 z-30`;
                                  ringClass = isWord ? `ring-[3px] ring-${themeColor}-400` : "";
                              }
                              
                              if (st.isSuccess) {
                                  if (st.currNodeId === node.id) {
                                      if (st.finalAns === true) {
                                          bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-2xl scale-125 z-40 animate-pulse";
                                          ringClass = isWord ? "ring-[3px] ring-emerald-300" : "";
                                      } else {
                                          bgClass = "bg-rose-500 border-rose-600 text-white shadow-2xl scale-125 z-40";
                                          ringClass = isWord ? "ring-[3px] ring-rose-300" : "";
                                      }
                                  } else {
                                      bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-40 scale-90";
                                      ringClass = isWord ? "ring-[3px] ring-slate-200" : "";
                                  }
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && !isCreating && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce text-${themeColor}-600 border border-${themeColor}-200`}>
                                              curr
                                          </span>
                                      )}
                                      {isCreating && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-amber-500 text-white px-1.5 rounded shadow-lg animate-pulse`}>
                                              new node
                                          </span>
                                      )}
                                      {st.isSuccess && st.currNodeId === node.id && st.finalAns === false && (
                                           <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-rose-600 text-white px-1.5 rounded shadow-lg animate-pulse`}>
                                              DEAD END
                                          </span>
                                      )}

                                      <div className={`w-10 h-10 flex flex-col items-center justify-center border-4 rounded-full transition-all duration-300 ${bgClass} ${ringClass}`}>
                                          <span className={`font-mono font-black text-lg leading-none`}>{node.char}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          </div>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                {selectedOp.icon && React.cloneElement(selectedOp.icon as React.ReactElement, { className: "text-white", size: 28 })}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Implement Trie</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Prefix Tree Operations
                  </span>
                  <span>•</span>
                  <span>LeetCode 208</span>
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
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Network size={28}/> The Prefix Tree</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>A <strong>trie</strong> (pronounced as "try") or <strong>prefix tree</strong> is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this very efficient data structure, such as autocomplete and spellchecker.</p>
                        <p className="font-bold mt-4">Implement the Trie class with three primary methods:</p>
                        <ul className="list-disc pl-6 space-y-1 font-mono">
                            <li><code>void insert(String word)</code> Inserts the string into the trie.</li>
                            <li><code>boolean search(String word)</code> Returns true if the exact string is in the trie.</li>
                            <li><code>boolean startsWith(String prefix)</code> Returns true if there is ANY string in the trie that starts with the given prefix.</li>
                        </ul>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full space-y-2">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Execution Sequence:</span>
                            <div className="flex justify-between border-b border-slate-700 pb-1"><span>Trie trie = new Trie();</span><span className="text-slate-500">// null</span></div>
                            <div className="flex justify-between border-b border-slate-700 pb-1"><span>trie.insert("apple");</span><span className="text-slate-500">// null</span></div>
                            <div className="flex justify-between border-b border-slate-700 pb-1"><span>trie.search("apple");</span><span className="text-emerald-400 font-bold">// return True</span></div>
                            <div className="flex justify-between border-b border-slate-700 pb-1"><span>trie.search("app");</span><span className="text-rose-400 font-bold">// return False</span></div>
                            <div className="flex justify-between border-b border-slate-700 pb-1"><span>trie.startsWith("app");</span><span className="text-emerald-400 font-bold">// return True</span></div>
                            <div className="flex justify-between border-b border-slate-700 pb-1"><span>trie.insert("app");</span><span className="text-slate-500">// null</span></div>
                            <div className="flex justify-between border-b border-slate-700 pb-1"><span>trie.search("app");</span><span className="text-emerald-400 font-bold">// return True</span></div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &le; word.length, prefix.length &le; 2000</li>
                            <li><code>word</code> and <code>prefix</code> consist only of lowercase English letters.</li>
                            <li>At most 3 * 10^4 calls in total will be made to insert, search, and startsWith.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">Unlike a Hash Map which searches an entire string at once, a Trie breaks a string down into characters and stores them sequentially along a path. If "apple" and "app" are stored, they share the exact same nodes for 'a', 'p', and 'p'. This structural sharing makes Tries incredibly space-efficient for large dictionaries with overlapping prefixes.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Node Structure</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2">Each <code>TrieNode</code> does NOT store strings. Instead, it contains an array of 26 pointers (one for each letter 'a'-'z') to its children. We mathematically map the character to an index: <code>'c' - 'a' = 2</code>.</p>
                        <p className="text-sm leading-relaxed text-slate-600">The node also contains a boolean <code>isEndOfWord</code>. This is crucial! The path for "apple" goes through "app". If we search for "app", we successfully traverse the path, but we must check if "app" was actually inserted as a full word, or if it's just an incomplete prefix of "apple".</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-4 flex flex-col gap-4">
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
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Trie.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div ref={codeContainerMainRef} className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Base Trie Words (Pre-Inserted)</label>
                            <input type="text" value={baseWordsInput} onChange={(e) => setBaseWordsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="apple, app, bear" />
                        </div>
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Target Word / Prefix</label>
                            <input type="text" value={targetWordInput} onChange={(e) => setTargetWordInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="app" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns === true ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.finalAns === true ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.finalAns === true ? <PartyPopper size={24}/> : <ShieldAlert size={24}/>} 
                                OPERATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                {selectedOpId === 'trieInsert' ? `Successfully inserted "${targetWord}" into the Trie.` : `Returned ${String(st.finalAns).toUpperCase()}.`}
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'math' || st.hlPhase === 'check' ? 'text-amber-400' : (st.hlPhase === 'mutate' ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
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
                    <div className={`inline-flex items-center justify-center p-4 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl mb-2`}>
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Prefix Tree operations.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> 1. The Power of Indexing</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Why do Trie nodes use an array of size 26 instead of a HashMap? Because of constant-time math. If we guarantee inputs are lowercase 'a'-'z', we can instantly map a character to an array slot using ASCII arithmetic: <code>'c' - 'a' = 2</code>. Accessing <code>children[2]</code> is an $O(1)$ RAM fetch, vastly faster than resolving a HashMap hash collision.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><CheckCircle2 size={24} className="text-emerald-500"/> 2. Search vs StartsWith</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Both algorithms iterate through the word character by character. If a child link is ever <code>null</code>, they both immediately return <code>false</code>. The ONLY difference occurs if the loop finishes successfully.</p>
                        <p className="text-slate-600 leading-relaxed">If the loop finishes, <code>startsWith</code> immediately returns <code>true</code> (because finding the path means the prefix exists). However, <code>search</code> must return <code>node.isEndOfWord</code>. Just because you found the path for "app" doesn't mean "app" was inserted—it might just be the trunk for "apple".</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Sigma size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(M).</strong> Where $M$ is the length of the string. Inserting, searching, or prefix-matching a string requires exactly $M$ array lookups. This makes Tries incredibly fast compared to checking substrings in an array.</li>
                            <li><strong>Space Complexity: O(M).</strong> Inserting a word requires allocating up to $M$ new TrieNodes (if there's no prefix overlap). Each node contains a 26-element array, which can be memory-heavy compared to a flat hash set, trading RAM for absolute traversal speed.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is arguably the most common data structure implementation question asked at FAANG. Memorize this 26-array structure perfectly. It is the building block for dozens of hard string problems."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "When would you use a Trie instead of a standard HashSet?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Whenever prefix operations are required.</p>
                            <p>A HashSet is fantastic ($O(1)$) for exact word lookups. But if an interviewer asks you to 'find all words that start with APP' or 'build an autocomplete system', a HashSet is useless—you'd have to iterate through every word. A Trie natively groups words by prefix, allowing you to instantly navigate to the 'app' node and branch outward to find all completions in $O(1)$ relative to the dictionary size."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if the dictionary contains a million words? The 26-element arrays seem memory inefficient."</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "You are correct, a standard Trie is memory heavy.</p>
                            <p>If memory is a hard constraint, we can optimize the Trie by replacing the 26-element array with a <code>HashMap&lt;Character, TrieNode&gt;</code>. This prevents allocating 26 slots for nodes that only have 1 or 2 children, saving massive memory at the slight cost of HashMap lookup overhead. For extreme compression, a Radix Tree (or Patricia Trie) merges nodes with single children into strings."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "How would you implement a `delete` operation in this Trie?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It requires careful backtracking.</p>
                            <p>First, traverse to the end of the word. Set <code>isEndOfWord = false</code>. Then, check if that node has any children. If it doesn't, it is safe to delete. We can recursively traverse back up, deleting the child reference from the parent, stopping the deletion cascade as soon as we hit a node that either has <code>isEndOfWord == true</code> (it's another word) or has other valid children."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[480px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {/* Fixed Explanation Box */}
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? (st.finalAns === true || selectedOpId === 'trieInsert' ? 'bg-emerald-900/40 border-emerald-800' : 'bg-rose-900/40 border-rose-800') : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'math' || st.hlPhase === 'check' ? 'text-amber-400' : (st.hlPhase === 'mutate' ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                      <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                  </div>

                  {/* Scrollable Code Box */}
                  <div className="flex-1 overflow-x-hidden overflow-y-auto px-5 pb-10 relative scroll-smooth scrollbar-thin scrollbar-thumb-slate-700" ref={codeContainerFullscreenRef}>
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 relative">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Context Panel for Fullscreen */}
                  {st.finalAns === undefined && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 w-full max-w-md">
                           <div className={`w-full flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 border-slate-200`}>
                               <div className="flex justify-between items-center mb-2">
                                   <span className={`text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2`}>
                                       <ListOrdered size={14}/> Target Array
                                   </span>
                               </div>
                               <div className="flex gap-2 min-h-[60px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-center justify-center">
                                   <div className="flex gap-1 bg-slate-50 border border-slate-200 rounded-xl p-2 shadow-inner">
                                       {targetWord.split('').map((char, idx) => {
                                           let isPast = st.currCharIdx !== undefined && idx < st.currCharIdx;
                                           let isCurr = st.currCharIdx === idx && !st.isSuccess;
                                           
                                           let cellClass = "bg-white border-slate-300 text-slate-600";
                                           if (isCurr) cellClass = `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-md ring-2 ring-${themeColor}-200 scale-110 font-bold z-10`;
                                           else if (isPast) cellClass = "bg-slate-200 border-slate-300 text-slate-400 opacity-60";

                                           return (
                                               <div key={`fs-w-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-300 shrink-0`}>
                                                   <div className={`flex items-center justify-center w-8 h-8 border-2 rounded-lg font-mono text-base font-black ${cellClass}`}>
                                                       {char}
                                                   </div>
                                                   <span className="text-[9px] font-bold text-slate-400 font-mono">idx {idx}</span>
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                          </div>
                      </div>
                  )}

                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Base Trie Words</label>
                              <input type="text" value={baseWordsInput} onChange={(e) => setBaseWordsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='apple, app...' />
                          </div>
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target</label>
                              <input type="text" value={targetWordInput} onChange={(e) => setTargetWordInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='app' />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns === true || selectedOpId === 'trieInsert' ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns === true || selectedOpId === 'trieInsert' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 ${st.finalAns === true || selectedOpId === 'trieInsert' ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'} rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    {st.finalAns === true || selectedOpId === 'trieInsert' ? <Trophy size={48}/> : <ShieldAlert size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">OPERATION COMPLETE</h2>
                                <p className={`${st.finalAns === true || selectedOpId === 'trieInsert' ? 'text-emerald-400' : 'text-rose-400'} font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`${st.finalAns === true || selectedOpId === 'trieInsert' ? 'text-emerald-500' : 'text-rose-500'} text-[10px] font-black uppercase tracking-widest mb-2`}>Result</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4 text-center">
                                        {selectedOpId === 'trieInsert' ? 'SUCCESS' : String(st.finalAns).toUpperCase()}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.finalAns === true || selectedOpId === 'trieInsert' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-slate-700 hover:bg-slate-600'}`}>
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