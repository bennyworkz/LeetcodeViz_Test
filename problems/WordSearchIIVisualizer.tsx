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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalBacktracking: {
    id: 'optimalBacktracking',
    title: '1. Trie + DFS (Optimal)',
    icon: <Network size={16} />,
    complexity: 'Time: O(M*N*3^L) | Space: O(W)',
    code: `public List<String> findWords(char[][] board, String[] words) {
    List<String> res = new ArrayList<>();
    TrieNode root = buildTrie(words);
    for (int i = 0; i < board.length; i++) {
        for (int j = 0; j < board[0].length; j++) {
            dfs(board, i, j, root, res);
        }
    }
    return res;
}

private void dfs(char[][] board, int i, int j, TrieNode p, List<String> res) {
    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return;
    char c = board[i][j];
    if (c == '#' || p.children[c - 'a'] == null) return;
    
    p = p.children[c - 'a'];
    if (p.word != null) {
        res.add(p.word);
        p.word = null;
    }
    
    board[i][j] = '#';
    dfs(board, i - 1, j, p, res);
    dfs(board, i + 1, j, p, res);
    dfs(board, i, j - 1, p, res);
    dfs(board, i, j + 1, p, res);
    board[i][j] = c;
}`,
    desc: "The Word Search II approach utilizing a Trie (Prefix Tree) integrated with DFS. Instead of searching for words one by one, we insert all words into a Trie. We then launch a DFS from every cell on the board. As we traverse the grid, we simultaneously walk down the Trie. If the current sequence of characters doesn't match any valid prefix in the Trie, we immediately prune the DFS branch. This allows us to search for thousands of words simultaneously in a single pass."
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-violet-600 text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|boolean|char|return|if|else|while|for|continue|break|new|String|findWords|board|words|buildTrie|dfs|TrieNode|root|res|children|word|length|c|p|i|j|ArrayList|List)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]])/g).filter(Boolean);
  const activeStyles = { bg: `bg-violet-500/20`, border: `border-violet-500`, text: `text-violet-400` };
  
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
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'char', 'return', 'if', 'else', 'while', 'for', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'TrieNode', 'List', 'ArrayList'].includes(part);
            const isPointer = ['board', 'words', 'res', 'root', 'c', 'p', 'i', 'j'].includes(part);
            const isMapCall = ['findWords', 'buildTrie', 'dfs', 'length', 'children', 'word'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? 'text-violet-300' : 
                  isNaN(parseInt(part)) ? (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : '') : 'text-emerald-400'
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
  position: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, offset = 0 }) => {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300',
        violet: 'bg-violet-100 text-violet-700 border-violet-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    
    let alignClass = "";
    let arrow = null;

    if (position === 'top') {
        alignClass = 'flex-col-reverse -top-12 left-1/2 -translate-x-1/2';
        arrow = <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/>;
    } else if (position === 'bottom') {
        alignClass = 'flex-col -bottom-12 left-1/2 -translate-x-1/2';
        arrow = <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>;
    }

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`} style={{ transform: position === 'top' || position === 'bottom' ? `translateX(-50%) translateX(${offset}px)` : `translateY(-50%) translateY(${offset}px)`}}>
            <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {arrow}
        </div>
    );
};

interface NodeBlockProps {
  val: string | number;
  r?: number;
  c?: number;
  themeColor?: string;
  isTarget?: boolean;
  isDimmed?: boolean;
  isDeleted?: boolean;
  compact?: boolean;
  subtext?: string;
  isLinked?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, r, c, themeColor = 'slate', isTarget, isDimmed = false, isDeleted = false, compact = false, subtext, isLinked = false }) => {
    const themes: Record<string, any> = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-800', index: 'bg-violet-100 text-violet-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-400', index: 'bg-slate-100 text-slate-400' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    if (isDeleted) activeTheme = themes['disabled'];

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const linkClasses = isLinked ? `border-violet-400 bg-violet-50` : ``;
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    const dims = compact 
        ? "min-w-[40px] md:min-w-[48px] min-h-[40px] md:min-h-[48px]" 
        : "min-w-[56px] md:min-w-[64px] min-h-[48px] md:min-h-[56px]";
    
    const textSz = compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";
    const subTextSz = compact ? "text-[8px]" : "text-[9px] md:text-[10px]";

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${isLinked ? linkClasses : activeTheme.bg} ${isLinked ? 'border-violet-400' : activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-1 ${isDeleted ? 'bg-rose-50 text-rose-300' : 'bg-white/60 ' + (isLinked ? 'text-violet-700' : activeTheme.text)} ${isDimmed && !isDeleted ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {displayVal}
                </div>
                {(r !== undefined && c !== undefined) && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${isLinked ? 'bg-violet-100 text-violet-600' : activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{r},{c}</span>
                        </div>
                    </div>
                )}
                {subtext !== undefined && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${isLinked ? 'bg-violet-100 text-violet-600' : activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Mini Trie Engine for Logic Tracing ---
class TrieNode {
    children: Record<string, TrieNode> = {};
    word: string | null = null;
}

// --- Main Application ---

export default function WordSearchIIVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalBacktracking');
  
  const [wordsInput, setWordsInput] = useState('OATH, PEA, EAT, RAIN');
  
  // Fixed board for visualization
  const initialBoard = [
      ['O', 'A', 'A', 'N'],
      ['E', 'T', 'A', 'E'],
      ['I', 'H', 'K', 'R'],
      ['I', 'F', 'L', 'V']
  ];

  const [baseWords, setBaseWords] = useState<string[]>(['OATH', 'PEA', 'EAT', 'RAIN']);
  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = 'violet';

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = wordsInput.split(',').map(w => w.trim().toUpperCase().replace(/[^A-Z]/g, '')).filter(w => w.length > 0);
      if (parsed.length === 0) parsed = ["OATH", "PEA", "EAT", "RAIN"];
      if (parsed.length > 6) parsed = parsed.slice(0, 6); // Safety limit
      
      setBaseWords(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [wordsInput, selectedOpId]);

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
    if (baseWords.length === 0) return [{ phase: 'Init', description: 'Enter valid words.', line: 1, state: {} }];

    let board = initialBoard.map(row => [...row]);
    let rows = board.length;
    let cols = board[0].length;
    
    let path: {r: number, c: number, char: string}[] = [];
    let callStack: string[] = [];
    let resultList: string[] = [];
    
    // Build actual Trie
    let root = new TrieNode();
    for (let w of baseWords) {
        let p = root;
        for (let char of w) {
            if (!p.children[char]) p.children[char] = new TrieNode();
            p = p.children[char];
        }
        p.word = w;
    }

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            board: board.map(row => [...row]),
            words: baseWords,
            rows, cols,
            path: [...path],
            callStack: [...callStack],
            res: [...resultList],
            ...st 
        } 
    });

    if (selectedOpId === 'optimalBacktracking') {
        
        add("Function Call", `public List<String> findWords(char[][] board, String[] words)`, 1, {});
        add("Init Result List", `List<String> res = new ArrayList<>();\nWill store all found words.`, 2, {});
        add("Build Trie", `TrieNode root = buildTrie(words);\nInserted all words into the Prefix Tree.`, 3, {});

        // Outer loops
        for (let i = 0; i < rows; i++) {
            add("Outer Loop (i)", `for (int i = ${i}; i < board.length; i++)`, 4, { outerI: i });
            for (let j = 0; j < cols; j++) {
                add("Inner Loop (j)", `for (int j = ${j}; j < board[0].length; j++)\nTesting start position [${i}, ${j}]`, 5, { outerI: i, outerJ: j });
                
                // Backtrack engine
                const dfs = (r: number, c: number, p: TrieNode, currentPrefix: string) => {
                    if (steps.length > 2500) return; // Hard limit to prevent browser crash
                    callStack.push(`dfs(i=${r}, j=${c}, prefix="${currentPrefix}")`);
                    let currentDepth = callStack.length - 1;

                    add("DFS Entry", `private void dfs(..., int i, int j, TrieNode p, List<String> res)`, 12, { callDepth: currentDepth, r, c, currentPrefix });
                    
                    // Line 13: Bounds Check
                    let outOfBounds = r < 0 || r >= rows || c < 0 || c >= cols;
                    add("Check Bounds", `if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return;\nAre we out of grid bounds? (${outOfBounds ? 'Yes' : 'No'})`, 13, { callDepth: currentDepth, r, c, isCheckingBounds: true, outOfBounds, currentPrefix });

                    if (outOfBounds) {
                        add("Prune (Bounds)", `return;\nOut of bounds. Pruning path.`, 13, { callDepth: currentDepth, r, c, isFailedPrune: true, failReason: "Out of bounds", currentPrefix });
                        callStack.pop();
                        return;
                    }

                    // Line 14: Get Char
                    let char = board[r][c];
                    add("Get Character", `char c = board[${r}][${c}];\nCurrent cell has character '${char}'.`, 14, { callDepth: currentDepth, r, c, char, currentPrefix });

                    // Line 15: Visited and Trie Check
                    let isVisited = char === '#';
                    let hasNoChild = !isVisited && !p.children[char];
                    add("Check Visited & Trie", `if (c == '#' || p.children[c - 'a'] == null) return;\nIs visited? (${isVisited ? 'Yes' : 'No'}). Does Trie have path for '${char}'? (${hasNoChild ? 'No' : 'Yes'})`, 15, { callDepth: currentDepth, r, c, char, isCheckingTrie: true, isVisited, hasNoChild, currentPrefix });

                    if (isVisited || hasNoChild) {
                        let reason = isVisited ? "Already visited (#)" : `Trie has no prefix matching "${currentPrefix + char}"`;
                        add("Prune (Trie/Visited)", `return;\n${reason}. Pruning path.`, 15, { callDepth: currentDepth, r, c, isFailedPrune: true, failReason: reason, isVisited, currentPrefix, char });
                        callStack.pop();
                        return;
                    }

                    // Line 17: Advance Trie Pointer
                    let nextP = p.children[char];
                    let nextPrefix = currentPrefix + char;
                    add("Advance Trie Node", `p = p.children[c - 'a'];\nAdvanced Trie pointer to prefix "${nextPrefix}".`, 17, { callDepth: currentDepth, r, c, char, currentPrefix: nextPrefix });

                    // Line 18: Check for full word
                    let foundWord = nextP.word;
                    add("Check Word Complete", `if (p.word != null)\nDoes this Trie node complete a word? (${foundWord ? 'Yes' : 'No'})`, 18, { callDepth: currentDepth, r, c, char, currentPrefix: nextPrefix, foundWord });
                    
                    if (foundWord) {
                        resultList.push(foundWord);
                        nextP.word = null; // Deduplicate
                        add("Word Found!", `res.add(p.word);\nSuccessfully found "${foundWord}"! Adding to results.`, 19, { callDepth: currentDepth, r, c, hlAddResult: resultList.length - 1, foundWord, currentPrefix: nextPrefix });
                        add("Deduplicate", `p.word = null;\nNulling the word in Trie so we don't add it again if found via another path.`, 20, { callDepth: currentDepth, r, c, currentPrefix: nextPrefix });
                    }

                    // Line 23: Mark Visited
                    board[r][c] = '#';
                    path.push({r, c, char});
                    add("Mark Visited", `board[i][j] = '#';\nMarking cell [${r}, ${c}] as visited to prevent self-crossing.`, 23, { callDepth: currentDepth, r, c, char, hlMarkVisited: true, currentPrefix: nextPrefix });

                    // Line 24-27: 4-Directional Recursion
                    add("Recurse Up", `dfs(board, i - 1, j, p, res);\nTrying UP neighbor [${r - 1}, ${c}].`, 24, { callDepth: currentDepth, r, c, currentPrefix: nextPrefix, tryingDir: 'up' });
                    dfs(r - 1, c, nextP, nextPrefix);
                    
                    add("Recurse Down", `dfs(board, i + 1, j, p, res);\nTrying DOWN neighbor [${r + 1}, ${c}].`, 25, { callDepth: currentDepth, r, c, currentPrefix: nextPrefix, tryingDir: 'down' });
                    dfs(r + 1, c, nextP, nextPrefix);
                    
                    add("Recurse Left", `dfs(board, i, j - 1, p, res);\nTrying LEFT neighbor [${r}, ${c - 1}].`, 26, { callDepth: currentDepth, r, c, currentPrefix: nextPrefix, tryingDir: 'left' });
                    dfs(r, c - 1, nextP, nextPrefix);
                    
                    add("Recurse Right", `dfs(board, i, j + 1, p, res);\nTrying RIGHT neighbor [${r}, ${c + 1}].`, 27, { callDepth: currentDepth, r, c, currentPrefix: nextPrefix, tryingDir: 'right' });
                    dfs(r, c + 1, nextP, nextPrefix);

                    // Line 28: Backtrack restoration
                    board[r][c] = char;
                    path.pop();
                    add("Backtrack (Restore)", `board[i][j] = c;\nExplored all directions. Restoring cell [${r}, ${c}] to '${char}'.`, 28, { callDepth: currentDepth, r, c, char, hlRestore: true, currentPrefix: currentPrefix });

                    callStack.pop();
                };

                add("Initiate Search", `dfs(board, ${i}, ${j}, root, res);\nLaunching DFS from [${i}, ${j}].`, 6, { outerI: i, outerJ: j });
                dfs(i, j, root, "");
            }
        }

        add("Return Results", `return res;\nSearched all cells. Found ${resultList.length} words.`, 9, { isSuccess: true, finalAns: true });
    }

    return steps;
  }, [baseWords, selectedOpId]);

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

  const renderVisuals = () => {
      if (st.board === undefined) return <span className="text-slate-400 italic">empty</span>;

      // Calculate grid dimensions
      const cellW = 60;
      const cellH = 60;
      const gap = 12;
      const totalW = st.cols * cellW + (st.cols - 1) * gap;
      const totalH = st.rows * cellH + (st.rows - 1) * gap;
      
      const getPos = (r: number, c: number) => {
          return {
              x: c * (cellW + gap) - totalW / 2 + cellW / 2,
              y: r * (cellH + gap) - totalH / 2 + cellH / 2
          };
      };

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-6">
              
              {/* Top Section: Target Words & Trie Prefix */}
              <div className="flex flex-col w-full max-w-5xl gap-6 pointer-events-auto relative z-40 px-4 items-center">
                  <div className="flex flex-col items-center w-full">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-violet-50 text-violet-600 border-violet-200 flex items-center gap-2`}><FileText size={12}/> Target Words</span>
                      
                      <div className="flex gap-3 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center relative min-w-[300px] min-h-[70px]">
                          {st.words.map((w: string, idx: number) => {
                              let isFound = st.res && st.res.includes(w);
                              return (
                                  <div key={`w-${idx}`} className={`px-4 py-2 font-mono font-black text-sm rounded-xl border-2 shadow-sm transition-all duration-300 flex items-center gap-2 ${isFound ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200 scale-105' : 'bg-slate-50 border-slate-300 text-slate-500'}`}>
                                      {w} {isFound && <Check size={16}/>}
                                  </div>
                              )
                          })}
                      </div>

                      {/* Live Trie Prefix Tracker */}
                      {st.currentPrefix !== undefined && !st.isSuccess && (
                          <div className="mt-6 flex flex-col items-center">
                              <span className={`text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400 flex items-center gap-2`}><Network size={12}/> Current Trie Prefix Path</span>
                              <div className="flex items-center gap-2 font-mono font-black text-xl text-violet-600 bg-violet-50 px-6 py-3 rounded-2xl border-2 border-violet-200 shadow-inner">
                                  {st.currentPrefix === "" ? <span className="text-slate-300 italic text-sm">" root "</span> : `"${st.currentPrefix}"`}
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* Grid Space Visualization */}
              <div className="relative w-full flex justify-center items-center mt-8" style={{ minHeight: totalH + 120 }}>
                  <div className="relative w-0 h-0">
                      
                      {/* Grid Edges (Path Snake) */}
                      <svg className="absolute overflow-visible z-0 pointer-events-none" style={{ left: 0, top: 0 }}>
                          {st.path && st.path.map((node: any, i: number) => {
                              if (i === 0) return null;
                              let prev = st.path[i - 1];
                              let p1 = getPos(prev.r, prev.c);
                              let p2 = getPos(node.r, node.c);

                              return <line key={`path-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" className="transition-all duration-500 animate-[dash_1s_linear_infinite] opacity-80"/>
                          })}

                          {/* Ghost Red Edge for Failed Match or OOB */}
                          {st.isFailedPrune && st.r !== undefined && st.c !== undefined && (
                              (() => {
                                  // If we have a path, draw from last path node to this failed one
                                  if (!st.path || st.path.length === 0) return null;
                                  let prev = st.path[st.path.length - 1];
                                  
                                  let p1 = getPos(prev.r, prev.c);
                                  let p2 = getPos(st.r, st.c);

                                  return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f43f5e" strokeWidth="4" strokeDasharray="6,6" strokeLinecap="round" className="transition-all duration-300 opacity-80"/>
                              })()
                          )}
                      </svg>

                      {/* Grid Cells */}
                      {st.board && st.board.map((row: string[], rIdx: number) => {
                          return row.map((val: string, cIdx: number) => {
                              let pos = getPos(rIdx, cIdx);
                              
                              let isActive = false;
                              let isVisited = val === '#';
                              let nodeTheme = isVisited ? 'slate' : 'slate';
                              let isDimmed = isVisited;
                              
                              // Is it in the current path?
                              if (st.path && st.path.some((p: any) => p.r === rIdx && p.c === cIdx)) {
                                  isActive = true;
                                  nodeTheme = 'violet';
                                  isDimmed = false;
                              }

                              // Is it the cell currently being evaluated?
                              if (st.r === rIdx && st.c === cIdx) {
                                  isActive = true;
                                  if (st.isFailedPrune) {
                                      nodeTheme = 'rose';
                                  } else if (st.isCheckingBounds || st.isCheckingTrie) {
                                      nodeTheme = 'amber';
                                  } else {
                                      nodeTheme = 'violet';
                                  }
                                  isDimmed = false;
                              }

                              // Outer Loop targeting
                              if (st.outerI === rIdx && st.outerJ === cIdx && st.callDepth === undefined) {
                                  isActive = true;
                                  nodeTheme = 'indigo';
                              }

                              // Make found words pop globally
                              if (st.isSuccess && st.finalAns === true) {
                                  isDimmed = true;
                                  nodeTheme = 'slate';
                              }

                              return (
                                  <div key={`cell-${rIdx}-${cIdx}`} className={`absolute transition-all duration-500 z-10 ${isActive ? 'z-20 scale-110' : ''}`} style={{ left: pos.x, top: pos.y, transform: `translate(-50%, -50%) ${isActive ? 'scale(1.1)' : 'scale(1)'}` }}>
                                      <NodeBlock val={val} r={rIdx} c={cIdx} themeColor={nodeTheme} isTarget={isActive} isDimmed={isDimmed} isDeleted={isVisited} compact={false}/>
                                  </div>
                              )
                          });
                      })}

                      {/* Ghost Red Node for Out of Bounds or Pruning Check */}
                      {st.isFailedPrune && st.outOfBounds && (
                          (() => {
                              let pos = getPos(st.r, st.c);
                              return (
                                  <div className="absolute z-30 transition-all duration-300 animate-in zoom-in slide-in-from-top-4" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}>
                                      <NodeBlock val={'X'} r={st.r} c={st.c} themeColor="rose" isTarget={true} compact={false}/>
                                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-rose-100 text-rose-700 text-[8px] font-black px-2 py-1 rounded shadow-sm whitespace-nowrap flex items-center gap-1">
                                          <XCircle size={10}/> Out of Bounds
                                      </div>
                                  </div>
                              )
                          })()
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'violet' ? 'bg-violet-600' : 'bg-emerald-600'}`}>
                <Network className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Word Search II</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'violet' ? 'text-violet-600 bg-violet-50' : 'text-emerald-600 bg-emerald-50'}`}>
                      Trie + DFS
                  </span>
                  <span>•</span>
                  <span>LeetCode 212</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'violet' ? 'text-violet-600' : 'text-emerald-600'}`}><Network size={28}/> Multi-Word Matrix Search</div>
                    <div className="text-lg leading-relaxed max-w-3xl">
                      Given an <code>m x n</code> <code>board</code> of characters and a list of strings <code>words</code>, return all words on the board.<br/><br/>
                      Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a single word.
                    </div>
                    <div className="bg-slate-900 border-l-4 border-violet-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-nowrap">
                       <span className="text-violet-400 block mb-1 uppercase text-[10px] font-black tracking-widest">Input: words = ["OATH", "PEA", "EAT", "RAIN"]</span>
                       <span className="text-emerald-400 block mt-3 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300">
                           ["OATH", "EAT"]
                       </span>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">Unlike Word Search I where we only look for ONE word, here we are given a list of potentially 10,000 words. Running standard DFS 10,000 separate times would result in a massive $O(W \cdot M \cdot N \cdot 3^L)$ time limit exceeded error.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className="text-violet-500"/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600">We optimize the search using a <strong>Trie (Prefix Tree)</strong>. We insert all 10,000 target words into the Trie. Then, we launch a single DFS pass from each cell. As we move on the board, we simultaneously move down the Trie. If the current sequence of characters on the board does not form a valid prefix in the Trie, we immediately prune the branch.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white border-${themeColor}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${themeColor}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> WordSearchII.java</span>
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
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Target Words (Comma Separated)</label>
                            <input type="text" value={wordsInput} onChange={(e) => setWordsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner uppercase font-bold`} placeholder="OATH, PEA, EAT, RAIN" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SEARCH COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Found {st.res.length} words in the grid!</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.isFailedPrune ? 'text-rose-400' : (st.hlAddResult ? 'text-emerald-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Network size={14} className={`text-${themeColor}-500`}/> 2D Grid Search State</span>
                       
                       {/* Call Stack Tracker with Scroll */}
                       {!st.isSuccess && st.callStack && (
                           <div className={`bg-white border-2 border-violet-200 rounded-xl p-3 shadow-md flex flex-col gap-2 transition-all duration-300 w-56 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-200 pointer-events-auto`}>
                               <div className="flex justify-between items-center border-b border-violet-100 pb-1 mb-1 shrink-0 sticky top-0 bg-white z-10">
                                   <span className={`text-[9px] font-black uppercase tracking-widest text-violet-600`}>Call Stack Depth</span>
                               </div>
                               <div className="flex flex-col gap-1">
                                    {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                        let isTop = idx === 0;
                                        return (
                                            <span key={idx} className={`font-mono text-[10px] font-black px-2 py-1 rounded flex justify-between shrink-0 ${isTop ? 'bg-violet-600 text-white shadow-sm' : 'bg-violet-50 text-violet-600 border border-violet-100'}`}>
                                                {frameStr}
                                            </span>
                                        )
                                    })}
                                    {st.callStack.length === 0 && <span className="text-slate-300 italic text-[10px]">Empty</span>}
                               </div>
                           </div>
                       )}
                   </div>

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <div className="inline-flex items-center justify-center p-4 bg-violet-100 text-violet-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Trie integration for massive scale state space pruning.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-violet-500"/> 1. The Trie + DFS Synergy</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A Trie (Prefix Tree) is the perfect data structure for this problem because it stores strings optimally by sharing common prefixes. When we run DFS on the grid, we aren't looking for a single word anymore—we are just blindly traversing valid paths.</p>
                        <p className="text-slate-600 leading-relaxed">At every step of the DFS, we consult the Trie. If the Trie says "there are absolutely no words that start with this sequence of characters," we instantly abort that DFS branch. This synergistic pruning is what makes the algorithm blazing fast even with 10,000 words.</p>
                    </div>

                    {/* Section 2 - TIME COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. Time Complexity: O(M * N * 3^L)</h4>
                        <p className="mb-4 text-slate-600">Let M be rows, N be columns, and L be the maximum length of any word in the dictionary.</p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Building the Trie:</strong> Takes O(Σ length of all words). This is a one-time upfront cost.</li>
                            <li><strong>DFS Traversal:</strong> We launch a DFS from all M &times; N cells.</li>
                            <li><strong>DFS Branching:</strong> At the very first step, we have 4 directions. For every subsequent step, we only have 3 valid directions (we can't go back). The max depth is L. The number of paths explored is bounded by 4 &times; 3^(L-1).</li>
                        </ul>
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 font-bold text-center">
                            Total DFS Time Complexity = O(M &times; N &times; 4 &times; 3^(L-1))
                        </div>
                    </div>

                    {/* Section 3 - SPACE COMPLEXITY */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 3. Space Complexity Analysis: O(Total Letters)</h4>
                        <p className="mb-4 text-slate-600">Space complexity is dominated by the Trie data structure.</p>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <strong className="text-slate-800 block mb-1">Trie Memory: O(Total Letters)</strong>
                                <span className="text-sm text-slate-600">In the worst case (where no words share any common prefixes), the Trie creates a unique node for every single character across all words in the input array.</span>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <strong className="text-slate-800 block mb-1">Call Stack: O(L)</strong>
                                <span className="text-sm text-slate-600">The recursive DFS stack goes as deep as the longest word length L. Thus auxiliary recursive space is O(L). Overall space is strictly O(Σ length).</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Word Search II is the ultimate test of combining multiple advanced data structures (Tries + Matrices) with recursive algorithms. Interviewers will specifically ask you about deduplication and advanced dynamic pruning."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-violet-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-violet-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we set <code>p.word = null</code> after finding a word?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "This is an elegant form of <strong>deduplication</strong>. The same word might be found multiple times on the board via different DFS paths.</p>
                            <p>If we use a <code>List&lt;String&gt;</code> to collect results, we risk adding duplicates. We could use a <code>HashSet</code> to prevent duplicates, but that wastes memory and hashing time. By simply nullifying the word in the Trie immediately after finding it the first time, we guarantee it can never be found and added again, completely eliminating the need for a HashSet."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What is an advanced optimization we could do to speed up the DFS even further?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We can dynamically prune the Trie. Once a word is found and we set <code>p.word = null</code>, that leaf node in the Trie might now be completely useless (if it has no other children).</p>
                            <p>We can modify the DFS to return a boolean indicating if the child node is now 'empty'. If it is, we can sever the reference from the parent node (<code>p.children[c - 'a'] = null</code>). This gradually destroys the Trie as words are found, speeding up subsequent DFS passes since they hit dead ends much faster."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Why don't we just run Word Search I's algorithm repeatedly for every word in the array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "If we have $W$ words, running standard DFS for each word takes $O(W \cdot M \cdot N \cdot 3^L)$ time. This is wildly inefficient because many words share prefixes (e.g., 'APPLE' and 'APP').</p>
                            <p>If we search for them individually, we traverse the 'A-P-P' path on the board twice. By inserting them into a Trie, we traverse the 'A-P-P' path on the board exactly once, checking both words simultaneously. The Trie compresses the state space."</p>
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
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-violet-600 shadow-violet-900/50`}><Code2 size={20}/></div>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult !== undefined ? 'text-emerald-400' : (st.isFailedPrune ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target Words</label>
                              <input type="text" maxLength={40} value={wordsInput} onChange={(e) => setWordsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold uppercase`} />
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-violet-600 text-white rounded-[2rem] hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-violet-500 shadow-[0_20px_50px_rgba(139,92,246,0.3)]`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {!st.isSuccess && st.callStack && (
                      <div className="absolute bottom-10 left-10 z-50 flex flex-col gap-2 animate-in slide-in-from-bottom-10">
                          <div className={`bg-slate-900 border-2 border-slate-700 rounded-[2rem] p-6 shadow-2xl flex flex-col justify-end gap-2 transition-all duration-300 w-64 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pointer-events-auto`}>
                               <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-1 shrink-0 sticky top-0 bg-slate-900 z-10">
                                   <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400`}>Call Stack Depth</span>
                               </div>
                               <div className="flex flex-col gap-2">
                                    {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                        let isTop = idx === 0;
                                        return (
                                            <div key={idx} className={`font-mono text-sm font-black px-4 py-2 rounded-xl flex justify-between shrink-0 ${isTop ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-800 text-violet-400'}`}>
                                                <span>{frameStr}</span>
                                            </div>
                                        )
                                    })}
                                    {st.callStack.length === 0 && <span className="text-slate-500 italic text-sm font-mono px-2">Empty</span>}
                               </div>
                           </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPLETED</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Word Search II Finished</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Words Found</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed">{st.res.length} Words</div>
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