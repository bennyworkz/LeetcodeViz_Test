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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard, AlignLeft, AlignRight, SplitSquareVertical
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Sort + Two Pointers',
    icon: <ArrowLeftRight size={16} />,
    complexity: 'Time: O(N log N + L×N) | Space: O(1)',
    theme: 'emerald',
    code: `class Solution {
    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        Arrays.sort(products);
        List<List<String>> res = new ArrayList<>();
        int left = 0, right = products.length - 1;
        
        for (int i = 0; i < searchWord.length(); i++) {
            char c = searchWord.charAt(i);
            
            while (left <= right && (products[left].length() <= i || products[left].charAt(i) != c)) {
                left++;
            }
            while (left <= right && (products[right].length() <= i || products[right].charAt(i) != c)) {
                right--;
            }
            
            List<String> list = new ArrayList<>();
            for (int j = 0; j < 3 && left + j <= right; j++) {
                list.add(products[left + j]);
            }
            res.add(list);
        }
        return res;
    }
}`,
    desc: "An extremely elegant and memory-efficient approach. We first sort the products lexicographically. Then, we use two pointers (`left` and `right`) to represent the valid window of products that match our current prefix. As we type each character of the search word, we shrink the window from the left and right if the products at those boundaries don't match the new character. Because the array is sorted, the top 3 suggestions are simply the first 3 items starting from the `left` pointer!"
  },
  triePrecomputed: {
    id: 'triePrecomputed',
    title: '2. Trie (Precomputed Lists)',
    icon: <Network size={16} />,
    complexity: 'Time: O(N log N + N×L) | Space: O(N×L)',
    theme: 'sky',
    code: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    List<String> suggestions = new ArrayList<>();
}
class Solution {
    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        Arrays.sort(products);
        TrieNode root = new TrieNode();
        
        for (String p : products) {
            TrieNode curr = root;
            for (char c : p.toCharArray()) {
                if (curr.children[c - 'a'] == null) {
                    curr.children[c - 'a'] = new TrieNode();
                }
                curr = curr.children[c - 'a'];
                if (curr.suggestions.size() < 3) {
                    curr.suggestions.add(p);
                }
            }
        }
        
        List<List<String>> res = new ArrayList<>();
        TrieNode curr = root;
        for (char c : searchWord.toCharArray()) {
            if (curr != null) curr = curr.children[c - 'a'];
            res.add(curr == null ? new ArrayList<>() : curr.suggestions);
        }
        return res;
    }
}`,
    desc: "A powerful Prefix Tree approach optimized for rapid querying. We first sort the products so that we process them in lexicographical order. As we insert each product character-by-character into the Trie, we proactively add the full word to a `suggestions` list stored directly inside the TrieNode. We cap this list at 3 items. Once the Trie is built, searching is insanely fast: we just walk down the path of the search word, and instantly pull the precomputed top 3 list from each node we touch in pure O(L) time."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|char|boolean|class|return|if|else|while|for|new|String|suggestedProducts|Arrays|sort|length|charAt|List|ArrayList|add|products|searchWord|res|left|right|c|i|j|list|TrieNode|root|curr|children|suggestions|toCharArray|size)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isObject = ['String', 'Arrays', 'List', 'ArrayList', 'TrieNode', 'Solution'].includes(part);
            const isPointer = ['products', 'searchWord', 'res', 'left', 'right', 'c', 'i', 'j', 'list', 'root', 'curr', 'children', 'suggestions'].includes(part);
            const isMapCall = ['suggestedProducts', 'sort', 'length', 'charAt', 'add', 'toCharArray', 'size'].includes(part);
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

export default function SearchSuggestionsVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('twoPointers');
  
  const [productsInput, setProductsInput] = useState('mobile, mouse, moneypot, monitor, mousepad');
  const [searchWordInput, setSearchWordInput] = useState('mouse');
  
  const [baseProducts, setBaseProducts] = useState<string[]>(['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad']);
  const [targetWord, setTargetWord] = useState<string>('mouse');

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

  const parseInputs = (pStr: string, tgtStr: string) => {
      let bProds = pStr.split(',').map(s => s.trim().toLowerCase().replace(/[^a-z]/g, '')).filter(s => s.length > 0);
      let tWord = tgtStr.trim().toLowerCase().replace(/[^a-z]/g, '');
      
      if (bProds.length === 0) bProds = ['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'];
      if (tWord.length === 0) tWord = 'mouse';
      
      return { bProds: bProds.slice(0, 10), tWord: tWord.substring(0, 10) };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const { bProds, tWord } = parseInputs(productsInput, searchWordInput);
      setBaseProducts(bProds);
      setTargetWord(tWord);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [productsInput, searchWordInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Geometry Generation for N-ary Trie (Used in Trie Phase)
  const buildTrieGeometry = (bWords: string[]) => {
      let sorted = [...bWords].sort();
      let root = { id: 0, char: '*', isWord: false, children: {} as any, suggestions: [] as string[], width: 0, x: 0, y: 0 };
      let nodeId = 1;
      
      for (let word of sorted) {
          let curr = root;
          for (let char of word) {
              if (!curr.children[char]) {
                  curr.children[char] = { id: nodeId++, char: char, isWord: false, children: {} as any, suggestions: [] as string[], width: 0, x: 0, y: 0 };
              }
              curr = curr.children[char];
              if (curr.suggestions.length < 3) {
                  curr.suggestions.push(word);
              }
          }
          curr.isWord = true;
      }

      // Calculate Subtree Widths
      const calcWidth = (node: any) => {
          let keys = Object.keys(node.children);
          if (keys.length === 0) {
              node.width = 70; // base node width spacing
              return node.width;
          }
          let w = 0;
          for (let k of keys) w += calcWidth(node.children[k]);
          node.width = Math.max(w, 70);
          return node.width;
      }
      calcWidth(root);

      // Assign Coordinates
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
                  sx: node.x, sy: node.y + 20, tx: childX, ty: y + 90 - 20 
              });
              
              assignCoords(child, childX, y + 90, depth + 1);
              currentX += child.width;
          }
      }
      assignCoords(root, 0, 50, 0);

      // Center horizontally
      if (renderNodes.length > 0) {
          let minX = Math.min(...renderNodes.map(n => n.x));
          let maxX = Math.max(...renderNodes.map(n => n.x));
          let cx = (minX + maxX) / 2;
          renderNodes.forEach(n => n.x -= cx);
          renderEdges.forEach(e => { e.sx -= cx; e.tx -= cx; });
      }

      return { root, nodes: renderNodes, edges: renderEdges, maxDepth };
  };

  const trieData = useMemo(() => {
      if (selectedOpId === 'triePrecomputed') return buildTrieGeometry(baseProducts);
      return { root: null, nodes: [], edges: [], maxDepth: 0 };
  }, [baseProducts, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseProducts.length === 0 || targetWord.length === 0) return [];

    let sortedProducts = [...baseProducts].sort();

    if (selectedOpId === 'twoPointers') {
        let left = 0;
        let right = sortedProducts.length - 1;
        let res: string[][] = [];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                sortedProducts, left, right, res: [...res], ...st 
            } 
        });

        add("Function Call", `public List<List<String>> suggestedProducts(...)`, 2, { hlPhase: 'init' });
        
        add("Sort Array", `Arrays.sort(products);`, 3, { hlPhase: 'sort' });
        
        add("Init Variables", `List<List<String>> res = new ArrayList<>();\nint left = 0, right = products.length - 1;`, 4, { hlPhase: 'initVars' });

        for (let i = 0; i < targetWord.length; i++) {
            let c = targetWord[i];
            
            add("Process Character", `for (int i = 0; i < searchWord.length(); i++) {\n    char c = searchWord.charAt(i);\nProcessing index ${i}, character '${c}'.`, 7, { hlPhase: 'loop', i, c });

            while (left <= right) {
                let outOfBounds = sortedProducts[left].length <= i;
                let charMismatch = !outOfBounds && sortedProducts[left][i] !== c;
                
                add("Evaluate Left", `while (left <= right && (... <= i || products[left].charAt(i) != c))\nEvaluating left pointer at index ${left} (${sortedProducts[left]}). Match at index ${i}?`, 10, { hlPhase: 'evalLeft', i, c, evalPtr: left, outOfBounds, charMismatch });

                if (outOfBounds || charMismatch) {
                    left++;
                    add("Shrink Left", `left++;\nProduct doesn't match prefix. Shrinking window from the left.`, 11, { hlPhase: 'moveLeft', i, c });
                } else {
                    break;
                }
            }

            while (left <= right) {
                let outOfBounds = sortedProducts[right].length <= i;
                let charMismatch = !outOfBounds && sortedProducts[right][i] !== c;
                
                add("Evaluate Right", `while (left <= right && (... <= i || products[right].charAt(i) != c))\nEvaluating right pointer at index ${right} (${sortedProducts[right]}). Match at index ${i}?`, 13, { hlPhase: 'evalRight', i, c, evalPtr: right, outOfBounds, charMismatch });

                if (outOfBounds || charMismatch) {
                    right--;
                    add("Shrink Right", `right--;\nProduct doesn't match prefix. Shrinking window from the right.`, 14, { hlPhase: 'moveRight', i, c });
                } else {
                    break;
                }
            }

            add("Window Settled", `Left and Right pointers settled. Valid window is [${left}, ${right}].`, 17, { hlPhase: 'settled', i, c });

            let list: string[] = [];
            for (let j = 0; j < 3 && left + j <= right; j++) {
                list.push(sortedProducts[left + j]);
            }
            res.push(list);
            
            add("Collect Suggestions", `for (int j = 0; j < 3 && left + j <= right; j++) {\n    list.add(products[left + j]);\n}\nres.add(list);\nTaking top 3 words from the left edge of our window.`, 18, { hlPhase: 'collect', i, c, list });
        }

        add("Return Result", `return res;\nFinished processing all characters in search word.`, 23, { hlPhase: 'done', isSuccess: true });
    } 
    else if (selectedOpId === 'triePrecomputed') {
        let res: string[][] = [];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                sortedProducts, res: [...res], ...st 
            } 
        });

        add("Function Call", `public List<List<String>> suggestedProducts(...)`, 3, { hlPhase: 'init' });
        
        add("Sort & Init Trie", `Arrays.sort(products);\nTrieNode root = new TrieNode();\nSorting guarantees we insert words into the Trie in lexicographical order.`, 4, { hlPhase: 'sort' });
        
        add("Build Trie", `for (String p : products) {\n    // ... build trie logic ...\n}\nBuilding the Trie. Caching up to 3 words at every node we touch!`, 7, { hlPhase: 'build', showTrie: true, currNodeId: 0 });

        let currId: number | null = 0;
        let currObj = trieData.root;

        add("Init Search Variables", `List<List<String>> res = new ArrayList<>();\nTrieNode curr = root;`, 20, { hlPhase: 'initSearch', showTrie: true, currNodeId: currId });

        for (let i = 0; i < targetWord.length; i++) {
            let c = targetWord[i];
            
            add("Process Character", `for (char c : searchWord.toCharArray())\nLooking for character '${c}'.`, 22, { hlPhase: 'loop', i, c, showTrie: true, currNodeId: currId });

            if (currObj !== null) {
                add("Traverse Trie", `if (curr != null) curr = curr.children[c - 'a'];\nAttempting to follow edge for '${c}'.`, 23, { hlPhase: 'traverse', i, c, showTrie: true, currNodeId: currId, nextChar: c });
                
                currObj = currObj.children[c] || null;
                currId = currObj ? currObj.id : null;
            } else {
                add("Traverse Trie", `if (curr != null) curr = curr.children[c - 'a'];\nPointer is already null. Cannot traverse further.`, 23, { hlPhase: 'traverse', i, c, showTrie: true, currNodeId: currId });
            }

            let suggestions = currObj ? [...currObj.suggestions] : [];
            res.push(suggestions);
            
            add("Collect Precomputed Suggestions", `res.add(curr == null ? new ArrayList<>() : curr.suggestions);\nPulling the pre-cached suggestions list directly from the node!`, 24, { hlPhase: 'collect', i, c, showTrie: true, currNodeId: currId, suggestions });
        }

        add("Return Result", `return res;\nFinished traversing Trie for search word.`, 26, { hlPhase: 'done', isSuccess: true, showTrie: true });
    }

    return steps;
  }, [baseProducts, targetWord, trieData, selectedOpId]);

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

      if (selectedOpId === 'twoPointers') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'collect' ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : `border-${themeColor}-200`}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Live Search State</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[80px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'loop' ? `text-${themeColor}-500` : 'text-slate-400'}`}>Search Char</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'loop' || st.hlPhase === 'evalLeft' || st.hlPhase === 'evalRight' ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.c !== undefined ? st.c : '?'}
                          </div>
                      </div>

                      <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

                      <div className="flex flex-col items-center min-w-[80px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'evalLeft' || st.hlPhase === 'moveLeft' ? `text-rose-500` : 'text-slate-400'}`}>Left Ptr</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'evalLeft' || st.hlPhase === 'moveLeft' ? `bg-rose-100 border-rose-500 text-rose-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.left !== undefined ? st.left : '?'}
                          </div>
                      </div>
                      
                      <div className="flex flex-col items-center min-w-[80px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'evalRight' || st.hlPhase === 'moveRight' ? `text-sky-500` : 'text-slate-400'}`}>Right Ptr</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'evalRight' || st.hlPhase === 'moveRight' ? `bg-sky-100 border-sky-500 text-sky-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.right !== undefined ? st.right : '?'}
                          </div>
                      </div>
                      
                  </div>
              </div>
          );
      } else if (selectedOpId === 'triePrecomputed') {
          let suggestionsStr = st.suggestions ? `[${st.suggestions.join(', ')}]` : '[]';
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'collect' ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : `border-${themeColor}-200`}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Live Search State</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[80px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'loop' || st.hlPhase === 'traverse' ? `text-${themeColor}-500` : 'text-slate-400'}`}>Search Char</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'loop' || st.hlPhase === 'traverse' ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-md scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.c !== undefined ? st.c : '?'}
                          </div>
                      </div>

                      <ArrowRight size={24} className={st.hlPhase === 'traverse' ? `text-${themeColor}-500 animate-pulse` : "text-slate-300"}/>

                      <div className="flex flex-col items-center min-w-[140px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'collect' ? `text-amber-500` : 'text-slate-400'}`}>Node Suggestions</span>
                          <div className={`border-2 text-xl font-black px-6 py-2.5 rounded-xl transition-all duration-300 ${st.hlPhase === 'collect' ? `bg-amber-100 border-amber-500 text-amber-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.hlPhase === 'build' ? 'Building...' : suggestionsStr}
                          </div>
                      </div>
                      
                  </div>
              </div>
          );
      }
      return null;
  }

  const renderVisuals = () => {
      // Common container height
      const containerSize = selectedOpId === 'triePrecomputed' ? Math.max(350, trieData.maxDepth * 90 + 150) : 400;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Results Tracker (Shared by both) */}
              {st.hlPhase !== 'build' && st.hlPhase !== 'sort' && st.hlPhase !== 'initVars' && st.hlPhase !== 'init' && (
                  <div className="flex w-full max-w-6xl gap-4 px-4 pointer-events-auto items-stretch justify-center">
                      <div className={`w-full flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'collect' ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                           <div className="flex justify-between items-center mb-2">
                               <span className={`text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2`}>
                                   <ListOrdered size={14}/> Result List of Lists (res)
                               </span>
                           </div>
                           <div className="flex gap-2 min-h-[60px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-center justify-start px-2">
                               {st.res && st.res.length > 0 ? st.res.map((list: string[], idx: number) => {
                                   let isNew = idx === st.i && st.hlPhase === 'collect';
                                   return (
                                       <div key={`res-${idx}`} className={`flex flex-col gap-1 transition-all duration-300 shrink-0 border-2 rounded-xl p-2 ${isNew ? 'bg-amber-100 border-amber-400 shadow-md scale-105' : 'bg-slate-50 border-slate-200'}`}>
                                           <span className="text-[9px] font-bold text-slate-400 font-mono border-b pb-1">idx {idx}</span>
                                           <span className="font-mono text-xs font-black text-slate-700">[{list.join(', ')}]</span>
                                       </div>
                                   );
                               }) : <span className="text-slate-400 italic text-xs font-mono">Empty</span>}
                           </div>
                      </div>
                  </div>
              )}

              {/* Graphical Visualizer */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  {selectedOpId === 'twoPointers' ? (
                      <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-center`} style={{ minHeight: `200px` }}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><SplitSquareVertical size={12} className="inline mr-1"/> Two Pointers Window</span>
                          
                          <div className="flex flex-col items-center w-full max-w-5xl mt-12 gap-2">
                              {/* Products Array Render */}
                              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                                  {st.sortedProducts && st.sortedProducts.map((prod: string, pIdx: number) => {
                                      
                                      let isInside = pIdx >= st.left && pIdx <= st.right;
                                      let isLeftBound = pIdx === st.left;
                                      let isRightBound = pIdx === st.right;
                                      let isEvaluatingLeft = st.hlPhase === 'evalLeft' && st.evalPtr === pIdx;
                                      let isEvaluatingRight = st.hlPhase === 'evalRight' && st.evalPtr === pIdx;
                                      let isBeingAdded = st.hlPhase === 'collect' && st.list && st.list.includes(prod);
                                      
                                      let boxClass = "bg-white border-slate-300 text-slate-700";
                                      if (!isInside) boxClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-50 scale-95";
                                      else if (isBeingAdded) boxClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-lg scale-110 z-20 ring-4 ring-amber-200";
                                      else if (isEvaluatingLeft) boxClass = "bg-rose-100 border-rose-500 text-rose-900 shadow-md scale-105 z-10";
                                      else if (isEvaluatingRight) boxClass = "bg-sky-100 border-sky-500 text-sky-900 shadow-md scale-105 z-10";

                                      return (
                                          <div key={`p-${pIdx}`} className="flex flex-col items-center gap-1 relative">
                                              {/* Left Pointer Marker */}
                                              {isLeftBound && (
                                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-rose-500 animate-bounce">
                                                      <span className="text-[10px] font-black font-mono">LEFT</span>
                                                      <ArrowDown size={14}/>
                                                  </div>
                                              )}
                                              {/* Right Pointer Marker */}
                                              {isRightBound && (
                                                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-sky-500 animate-bounce">
                                                      <ArrowUp size={14}/>
                                                      <span className="text-[10px] font-black font-mono">RIGHT</span>
                                                  </div>
                                              )}
                                              
                                              <div className={`flex border-2 rounded-xl overflow-hidden transition-all duration-300 font-mono text-base ${boxClass}`}>
                                                  {/* Render character by character to highlight the active matching index */}
                                                  {prod.split('').map((char, cIdx) => {
                                                      let isTargetChar = isInside && cIdx === st.i && (st.hlPhase === 'evalLeft' || st.hlPhase === 'evalRight');
                                                      let charClass = "";
                                                      if (isTargetChar) {
                                                          charClass = (st.c === char) ? "bg-emerald-300 text-emerald-900" : "bg-rose-400 text-white";
                                                      } else if (isInside && st.i !== undefined && cIdx < st.i) {
                                                          charClass = "bg-emerald-100 text-emerald-800"; // Previously matched prefix
                                                      }

                                                      return (
                                                          <span key={`pc-${cIdx}`} className={`px-1.5 py-1 ${charClass}`}>{char}</span>
                                                      );
                                                  })}
                                                  {/* Handle case where product is shorter than current index */}
                                                  {isInside && st.i !== undefined && prod.length <= st.i && (st.hlPhase === 'evalLeft' || st.hlPhase === 'evalRight') && (
                                                       <span className={`px-1.5 py-1 bg-rose-400 text-white italic text-xs flex items-center`}>_</span>
                                                  )}
                                              </div>
                                              <span className="text-[9px] font-bold text-slate-400 font-mono opacity-50">idx {pIdx}</span>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className={`relative w-full transition-all duration-700 flex items-center justify-center`} style={{ minHeight: `${containerSize}px` }}>
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> N-ary Prefix Tree</span>
                          
                          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                  {/* Render Edges */}
                                  {st.showTrie && trieData.edges.map((edge: any, idx: number) => {
                                      let isActivelyTraversing = st.currNodeId === edge.source && st.nextChar === edge.char && st.hlPhase === 'traverse';
                                      
                                      let strokeColor = '#cbd5e1'; // default slate
                                      let strokeWidth = 2;
                                      let opacity = 0.5;

                                      if (isActivelyTraversing) {
                                          strokeColor = themeColor === 'sky' ? '#0ea5e9' : (themeColor === 'emerald' ? '#10b981' : '#8b5cf6');
                                          strokeWidth = 4;
                                          opacity = 1;
                                      } 

                                      return <line key={`edge-${idx}`} x1={`calc(50% + ${edge.sx}px)`} y1={edge.sy} x2={`calc(50% + ${edge.tx}px)`} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                                  })}
                              </svg>

                              {/* Render Nodes */}
                              <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                              {st.showTrie && trieData.nodes.map((node: any) => {
                                  let isActive = st.currNodeId === node.id && !st.isSuccess;
                                  
                                  let bgClass = "bg-white border-slate-300 text-slate-500 opacity-90"; // Base
                                  let ringClass = node.isWord ? "ring-[3px] ring-slate-300 shadow-sm" : "";
                                  
                                  if (node.id === 0) {
                                      bgClass = "bg-slate-800 border-slate-900 text-white shadow-md z-10"; // Root
                                  } else if (isActive) {
                                      bgClass = `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-xl scale-125 z-30`;
                                      ringClass = node.isWord ? `ring-[3px] ring-${themeColor}-400` : "";
                                  }
                                  
                                  if (st.isSuccess && st.currNodeId === node.id) {
                                      bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-2xl scale-125 z-40 animate-pulse";
                                      ringClass = node.isWord ? "ring-[3px] ring-emerald-300" : "";
                                  }

                                  return (
                                      <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                          {isActive && !st.isSuccess && (
                                              <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce text-${themeColor}-600 border border-${themeColor}-200`}>
                                                  curr
                                              </span>
                                          )}
                                          
                                          {/* Precomputed Suggestions Badge */}
                                          {node.id !== 0 && node.suggestions.length > 0 && (
                                              <div className={`absolute -right-3 -bottom-3 bg-amber-400 text-amber-950 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-amber-500 z-20`}>
                                                  {node.suggestions.length}
                                              </div>
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
                  )}

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Search Suggestions</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      String Matching
                  </span>
                  <span>•</span>
                  <span>LeetCode 1268</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Search size={28}/> Autocomplete System</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an array of strings <code>products</code> and a string <code>searchWord</code>.</p>
                        <p>Design a system that suggests at most three product names from <code>products</code> after each character of <code>searchWord</code> is typed. Suggested products should have common prefix with <code>searchWord</code>. If there are more than three products with a common prefix return the three lexicographically minimums products.</p>
                        <p>Return <em>a list of lists of the suggested products after each character of <code>searchWord</code> is typed.</em></p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"</p>
                                <p><strong>Output:</strong> [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]</p>
                                <p><strong>Explanation:</strong> products sorted lexicographically = ["mobile","moneypot","monitor","mouse","mousepad"].<br/>
                                After typing m and mo all products match and we show user ["mobile","moneypot","monitor"].<br/>
                                After typing mou, mous and mouse the system suggests ["mouse","mousepad"].</p>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <div className="text-slate-300 break-all space-y-1">
                                <p><strong>Input:</strong> products = ["havana"], searchWord = "havana"</p>
                                <p><strong>Output:</strong> [["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]</p>
                                <p><strong>Explanation:</strong> The only word "havana" will be always suggested while typing the search word.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &le; products.length &le; 1000</li>
                            <li>1 &le; products[i].length &le; 3000</li>
                            <li>1 &le; sum(products[i].length) &le; 2 * 10^4</li>
                            <li>All the strings of <code>products</code> are <strong>unique</strong>.</li>
                            <li><code>products[i]</code> consists of lowercase English letters.</li>
                            <li>1 &le; searchWord.length &le; 1000</li>
                            <li><code>searchWord</code> consists of lowercase English letters.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">The requirement to return suggestions in <strong>lexicographical (alphabetical) order</strong> is the biggest clue. If we sort the <code>products</code> array first, all words that share a prefix will naturally clump together in a continuous block (e.g., all "mo..." words are next to each other). Finding suggestions just becomes a matter of finding the start of that block.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. Sort + Two Pointers:</strong> Sort the array. Place <code>left</code> and <code>right</code> pointers at the ends. For each typed character, shrink the pointers inward until the products at the boundaries match the character. The top 3 suggestions are just <code>left</code>, <code>left+1</code>, <code>left+2</code>.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Trie with Precomputed Memory:</strong> Sort the array. Insert each word into a Prefix Tree. Because we sorted them first, we can simply push the word into a <code>suggestions</code> list stored inside every TrieNode we touch, capping it at 3. Searching becomes a blazing fast $O(L)$ traversal!</p>
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
                  <div ref={codeContainerMainRef} className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Products Array (Comma Separated)</label>
                            <input type="text" value={productsInput} onChange={(e) => setProductsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="mobile, mouse, moneypot..." />
                        </div>
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Search Word</label>
                            <input type="text" value={searchWordInput} onChange={(e) => setSearchWordInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="mouse" />
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
                                <PartyPopper size={24}/> SEARCH COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Successfully gathered suggestions for all prefixes.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'evalLeft' || st.hlPhase === 'moveLeft' ? 'text-rose-400' : (st.hlPhase === 'evalRight' || st.hlPhase === 'moveRight' ? 'text-sky-400' : (st.hlPhase === 'collect' || st.hlPhase === 'loop' || st.hlPhase === 'traverse' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Two ways to conquer prefix string matching.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-emerald-500"/> 1. Sort + Two Pointers</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Sorting strings places words with the same prefix adjacent to each other. If we sort <code>["mobile","mouse","moneypot","monitor","mousepad"]</code>, we get <code>["mobile","moneypot","monitor","mouse","mousepad"]</code>.</p>
                        <p className="text-slate-600 leading-relaxed">We initialize a <code>left</code> pointer at the start and a <code>right</code> pointer at the end. When the user types 'm', both pointers are valid. When the user types 'o' (prefix "mo"), we shrink <code>left</code> rightwards if the word at <code>left</code> doesn't match "mo", and shrink <code>right</code> leftwards if the word at <code>right</code> doesn't match. Because the array is sorted, the top 3 suggestions are ALWAYS the 3 words immediately starting at the <code>left</code> pointer.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> 2. Precomputed Trie</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If we sort the words first, we are guaranteed to insert them into a Trie in perfect lexicographical order. Because of this guarantee, as we insert a word, we can simply add it to a <code>List&lt;String&gt; suggestions</code> stored inside every single node we pass through, stopping when the list hits size 3.</p>
                        <p className="text-slate-600 leading-relaxed">This trades memory for speed. When the user types a character, we just follow the Trie edge. The node we land on <em>already has the answer perfectly prepared</em>, requiring zero DFS or sorting during the actual search phase.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Two Pointers:</strong> Time is $O(N \log N)$ to sort, plus $O(L \times N)$ in the worst case to shrink pointers (where L is length of search word). Space is $O(1)$ auxiliary, making it incredibly memory efficient.</li>
                            <li><strong>Precomputed Trie:</strong> Time is $O(N \log N)$ to sort, plus $O(N \times L)$ to build the Trie, plus a blazing fast $O(L)$ to search. Space is $O(N \times L)$ because we store nodes and cache up to 3 strings per node, which can be memory-heavy.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem tests your ability to choose between Data Structures (Trie) and Algorithms (Two Pointers / Binary Search). The absolute best candidates will mention both and discuss the memory/speed trade-offs."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we use Binary Search instead of Two Pointers?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, Binary Search is a great optimization for this.</p>
                            <p>Instead of manually shrinking the <code>left</code> pointer by 1, we can use binary search (like <code>lower_bound</code> in C++) to find the exact starting index of the first string that is equal to or greater than our current prefix. This drops the pointer adjustment time from $O(N)$ to $O(\log N)$ per character, improving overall time complexity on massive arrays."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the Trie approach, what happens if we DON'T sort the array first?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We would have to sort later, costing more time.</p>
                            <p>If we don't sort the products array initially, the 3 words we cache in the <code>TrieNode</code> will just be the first 3 words we process, which aren't guaranteed to be lexicographically smallest. We would instead have to collect ALL matching words in the Trie via DFS, and then sort them at query time, drastically slowing down the search phase."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "If this was a production autocomplete system (like Google Search), which approach is better?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The Precomputed Trie is much closer to production systems.</p>
                            <p>In a real autocomplete system, the dictionary (products) is relatively static, but queries happen millions of times per second. The $O(N \log N)$ sorting and Two Pointers approach does significant work on *every single query*. The Trie does all the heavy lifting during the build phase (offline), allowing the actual user query to resolve in near-instant $O(L)$ time."</p>
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
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'evalLeft' || st.hlPhase === 'moveLeft' ? 'text-rose-400' : (st.hlPhase === 'evalRight' || st.hlPhase === 'moveRight' ? 'text-sky-400' : (st.hlPhase === 'collect' || st.hlPhase === 'loop' || st.hlPhase === 'traverse' ? `text-${themeColor}-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                  {st.isSuccess === undefined && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 w-full max-w-lg">
                           <div className={`w-full flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'collect' ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                               <div className="flex justify-between items-center mb-2">
                                   <span className={`text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2`}>
                                       <ListOrdered size={14}/> Result List of Lists (res)
                                   </span>
                               </div>
                               <div className="flex gap-2 min-h-[60px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-center justify-start px-2">
                                   {st.res && st.res.length > 0 ? st.res.map((list: string[], idx: number) => {
                                       let isNew = idx === st.i && st.hlPhase === 'collect';
                                       return (
                                           <div key={`fs-res-${idx}`} className={`flex flex-col gap-1 transition-all duration-300 shrink-0 border-2 rounded-xl p-2 ${isNew ? 'bg-amber-100 border-amber-400 shadow-md scale-105' : 'bg-slate-50 border-slate-200'}`}>
                                               <span className="text-[9px] font-bold text-slate-400 font-mono border-b pb-1">idx {idx}</span>
                                               <span className="font-mono text-xs font-black text-slate-700">[{list.join(', ')}]</span>
                                           </div>
                                       );
                                   }) : <span className="text-slate-400 italic text-xs font-mono">Empty</span>}
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Products Array</label>
                              <input type="text" value={productsInput} onChange={(e) => setProductsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='mobile, mouse...' />
                          </div>
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Search Word</label>
                              <input type="text" value={searchWordInput} onChange={(e) => setSearchWordInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='mouse' />
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
                                
                                <div className={`w-24 h-24 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    <Trophy size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">SEARCH COMPLETE</h2>
                                <p className={`text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Final Results Built</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4 text-center">
                                        SUCCESS
                                    </div>
                                </div>

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