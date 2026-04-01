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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  recursion: {
    id: 'recursion',
    title: '1. Brute Force (Recursion)',
    icon: <ListTree size={16} />,
    complexity: 'Time: O(2^N) | Space: O(N)',
    theme: 'rose',
    code: `class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        return dfs(triangle, 0, 0);
    }
    
    private int dfs(List<List<Integer>> triangle, int row, int col) {
        if (row == triangle.size() - 1) return triangle.get(row).get(col);
        
        int left = dfs(triangle, row + 1, col);
        int right = dfs(triangle, row + 1, col + 1);
        
        return triangle.get(row).get(col) + Math.min(left, right);
    }
}`,
    desc: "The Brute Force Approach: We recursively explore every single valid path from the top of the triangle to the bottom. At every node, we branch out to the two adjacent nodes in the row below (index 'col' and 'col + 1'). While simple to write, this approach recalculates the same overlapping subproblems exponentially, making it extremely slow for large inputs."
  },
  memoization: {
    id: 'memoization',
    title: '2. Memoization (Top-Down)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N^2) | Space: O(N^2)',
    theme: 'sky',
    code: `class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        Integer[][] memo = new Integer[triangle.size()][triangle.size()];
        return dfs(triangle, 0, 0, memo);
    }
    
    private int dfs(List<List<Integer>> t, int r, int c, Integer[][] memo) {
        if (r == t.size() - 1) return t.get(r).get(c);
        if (memo[r][c] != null) return memo[r][c];
        
        int left = dfs(t, r + 1, c, memo);
        int right = dfs(t, r + 1, c + 1, memo);
        
        return memo[r][c] = t.get(r).get(c) + Math.min(left, right);
    }
}`,
    desc: "The Top-Down DP Approach: We optimize the recursion by introducing a 2D cache (memo array). Before recursively calculating the minimum path for a node, we check if we've already computed it! If so, we return the cached value instantly. This completely prunes the redundant branches, dropping the time complexity to O(N^2)."
  },
  tabulation: {
    id: 'tabulation',
    title: '3. Tabulation (Bottom-Up)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(N^2) | Space: O(N^2)',
    theme: 'fuchsia',
    code: `class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        int n = triangle.size();
        int[][] dp = new int[n][n];
        
        for (int i = 0; i < n; i++) dp[n - 1][i] = triangle.get(n - 1).get(i);
        
        for (int row = n - 2; row >= 0; row--) {
            for (int col = 0; col <= row; col++) {
                int minPath = Math.min(dp[row + 1][col], dp[row + 1][col + 1]);
                dp[row][col] = triangle.get(row).get(col) + minPath;
            }
        }
        return dp[0][0];
    }
}`,
    desc: "The Bottom-Up DP Approach: Instead of recursion, we use an iterative table. We initialize the bottom row of our DP table with the triangle's bottom row. Then, we iterate upwards row by row. For each node, its minimum path to the bottom is simply its own value plus the minimum of its two direct children from the row below. The final answer rests at dp[0][0]."
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '4. Space Optimized (1D DP)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N^2) | Space: O(N)',
    theme: 'emerald',
    code: `class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        int n = triangle.size();
        int[] dp = new int[n];
        
        for (int i = 0; i < n; i++) dp[i] = triangle.get(n - 1).get(i);
        
        for (int row = n - 2; row >= 0; row--) {
            for (int col = 0; col <= row; col++) {
                int minPath = Math.min(dp[col], dp[col + 1]);
                dp[col] = triangle.get(row).get(col) + minPath;
            }
        }
        return dp[0];
    }
}`,
    desc: "The Optimal Approach: Notice that in Tabulation, computing the current row only requires the values from the immediately previous row (row + 1). We don't need an entire 2D table! We can compress the state into a single 1D array of size N. We overwrite the array values in-place as we move upwards. This reduces space complexity from O(N^2) to strictly O(N)!"
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|for|while|String|minimumTotal|List|Integer|triangle|dfs|row|col|size|get|Math|min|left|right|memo|t|r|c|n|dp|minPath)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'List', 'Integer'].includes(part);
            const isPointer = ['triangle', 'row', 'col', 'left', 'right', 'memo', 't', 'r', 'c', 'n', 'dp', 'minPath'].includes(part);
            const isMapCall = ['minimumTotal', 'dfs', 'size', 'get', 'min'].includes(part);
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

export default function TriangleVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [triangleInput, setTriangleInput] = useState('2 | 3, 4 | 6, 5, 7 | 4, 1, 8, 3');
  const [baseTriangle, setBaseTriangle] = useState<number[][]>([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]);

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
      try {
        let rows = triangleInput.split('|').map(r => r.trim());
        let parsed: number[][] = [];
        let valid = true;
        for (let i = 0; i < rows.length; i++) {
            let nums = rows[i].split(',').map(n => parseInt(n.trim(), 10));
            if (nums.length !== i + 1 || nums.some(isNaN)) {
                valid = false;
                break;
            }
            parsed.push(nums);
        }
        
        if (!valid || parsed.length === 0) {
            parsed = [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]];
        }
        
        // Cap max size to 5 for UI performance (especially recursion)
        if (parsed.length > 5) parsed = parsed.slice(0, 5).map((r, i) => r.slice(0, i+1));

        setBaseTriangle(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
          setBaseTriangle([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [triangleInput, selectedOpId]);

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
    const t = baseTriangle;
    const n = t.length;

    const clone2D = (arr: any[][]) => arr.map(row => [...row]);

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { t, n, ...st } 
    });

    if (selectedOpId === 'recursion') {
        add("Function Call", `public int minimumTotal(...)`, 2, { hlInit: true });
        add("Start DFS", `return dfs(triangle, 0, 0);`, 3, { hlCall: true });

        const dfs = (r: number, c: number): number => {
            if (steps.length > 500) return 0; // Safety
            
            add("DFS Visit Node", `private int dfs(..., row=${r}, col=${c})`, 6, { activeR: r, activeC: c });
            
            if (r === n - 1) {
                let val = t[r][c];
                add("Base Case Reached", `if (row == triangle.size() - 1)\nBottom row reached! Returning leaf value ${val}.`, 7, { activeR: r, activeC: c, hlBase: true });
                return val;
            }

            add("Branch Left", `int left = dfs(triangle, row + 1, col);\nBranching to left child at (${r+1}, ${c}).`, 9, { activeR: r, activeC: c, leftR: r+1, leftC: c, hlLeft: true });
            let leftVal = dfs(r + 1, c);
            
            add("Branch Right", `int right = dfs(triangle, row + 1, col + 1);\nBranching to right child at (${r+1}, ${c+1}).`, 10, { activeR: r, activeC: c, rightR: r+1, rightC: c+1, hlRight: true });
            let rightVal = dfs(r + 1, c + 1);

            let res = t[r][c] + Math.min(leftVal, rightVal);
            add("Return Min Path", `return triangle.get(row).get(col) + Math.min(left, right);\nMin path from (${r}, ${c}) is ${t[r][c]} + min(${leftVal}, ${rightVal}) = ${res}.`, 12, { activeR: r, activeC: c, leftR: r+1, leftC: c, rightR: r+1, rightC: c+1, hlReturn: true, res });
            
            return res;
        };

        let finalAns = dfs(0, 0);
        add("Complete", `Recursion complete.`, 3, { isSuccess: true, finalAns });

    } else if (selectedOpId === 'memoization') {
        let memo: (number | null)[][] = Array.from({length: n}, (_, i) => new Array(i+1).fill(null));

        add("Function Call", `public int minimumTotal(...)`, 2, { hlInit: true });
        add("Init Memo Cache", `Integer[][] memo = new Integer[triangle.size()][triangle.size()];`, 3, { hlMemoInit: true, memo: clone2D(memo) });
        add("Start DFS", `return dfs(triangle, 0, 0, memo);`, 4, { hlCall: true, memo: clone2D(memo) });

        const dfs = (r: number, c: number): number => {
            if (steps.length > 500) return 0;
            
            add("DFS Visit Node", `private int dfs(..., r=${r}, c=${c}, memo)`, 7, { activeR: r, activeC: c, memo: clone2D(memo) });
            
            if (r === n - 1) {
                let val = t[r][c];
                add("Base Case Reached", `if (r == t.size() - 1)\nBottom row reached! Returning leaf value ${val}.`, 8, { activeR: r, activeC: c, hlBase: true, memo: clone2D(memo) });
                return val;
            }

            if (memo[r][c] !== null) {
                add("Cache Hit!", `if (memo[r][c] != null)\nWe've been here before! Returning cached value ${memo[r][c]}.`, 9, { activeR: r, activeC: c, hlCache: true, memo: clone2D(memo) });
                return memo[r][c] as number;
            }

            add("Branch Left", `int left = dfs(t, r + 1, c, memo);\nBranching to left child at (${r+1}, ${c}).`, 11, { activeR: r, activeC: c, leftR: r+1, leftC: c, hlLeft: true, memo: clone2D(memo) });
            let leftVal = dfs(r + 1, c);
            
            add("Branch Right", `int right = dfs(t, r + 1, c + 1, memo);\nBranching to right child at (${r+1}, ${c+1}).`, 12, { activeR: r, activeC: c, rightR: r+1, rightC: c+1, hlRight: true, memo: clone2D(memo) });
            let rightVal = dfs(r + 1, c + 1);

            let res = t[r][c] + Math.min(leftVal, rightVal);
            memo[r][c] = res;
            add("Store & Return", `return memo[r][c] = t.get(r).get(c) + Math.min(left, right);\nStoring result ${res} in cache and returning.`, 14, { activeR: r, activeC: c, leftR: r+1, leftC: c, rightR: r+1, rightC: c+1, hlReturn: true, res, memo: clone2D(memo) });
            
            return res;
        };

        let finalAns = dfs(0, 0);
        add("Complete", `Memoized Recursion complete.`, 4, { isSuccess: true, finalAns, memo: clone2D(memo) });

    } else if (selectedOpId === 'tabulation') {
        let dp: number[][] = Array.from({length: n}, (_, i) => new Array(n).fill(0));
        
        add("Function Call", `public int minimumTotal(...)`, 2, { hlInit: true });
        add("Init DP Table", `int[][] dp = new int[n][n];\nCreating full 2D DP array.`, 4, { hlDpInit: true, dp: clone2D(dp) });

        for (let i = 0; i < n; i++) dp[n-1][i] = t[n-1][i];
        add("Seed Base Cases", `for (int i = 0; i < n; i++) dp[n - 1][i] = triangle.get(n - 1).get(i);\nCopying the entire bottom row into DP table.`, 6, { hlSeed: true, dp: clone2D(dp) });

        for (let r = n - 2; r >= 0; r--) {
            add("Iterate Rows Upwards", `for (int row = n - 2; row >= 0; row--)\nProcessing row ${r}.`, 8, { hlRowLoop: true, activeR: r, dp: clone2D(dp) });
            for (let c = 0; c <= r; c++) {
                add("Iterate Columns", `for (int col = 0; col <= row; col++)\nProcessing node at (${r}, ${c}).`, 9, { hlColLoop: true, activeR: r, activeC: c, dp: clone2D(dp) });
                
                let minPath = Math.min(dp[r+1][c], dp[r+1][c+1]);
                add("Find Minimum Child", `int minPath = Math.min(dp[row + 1][col], dp[row + 1][col + 1]);\nComparing left child (${dp[r+1][c]}) and right child (${dp[r+1][c+1]}). Min is ${minPath}.`, 10, { hlMin: true, activeR: r, activeC: c, leftR: r+1, leftC: c, rightR: r+1, rightC: c+1, dp: clone2D(dp), minPath });
                
                dp[r][c] = t[r][c] + minPath;
                add("Update DP Cell", `dp[row][col] = triangle.get(row).get(col) + minPath;\nPath sum at (${r}, ${c}) becomes ${t[r][c]} + ${minPath} = ${dp[r][c]}.`, 11, { hlUpdate: true, activeR: r, activeC: c, dp: clone2D(dp) });
            }
        }
        
        add("Return Result", `return dp[0][0];\nThe absolute minimum path sum bubbles up to the top!`, 14, { isSuccess: true, finalAns: dp[0][0], dp: clone2D(dp) });

    } else if (selectedOpId === 'spaceOptimized') {
        let dp: number[] = new Array(n).fill(0);
        
        add("Function Call", `public int minimumTotal(...)`, 2, { hlInit: true });
        add("Init 1D DP Array", `int[] dp = new int[n];\nCreating a 1D DP array of size N to save space!`, 4, { hlDpInit: true, dp: [...dp] });

        for (let i = 0; i < n; i++) dp[i] = t[n-1][i];
        add("Seed Base Cases", `for (int i = 0; i < n; i++) dp[i] = triangle.get(n - 1).get(i);\nCopying the entire bottom row into DP array.`, 6, { hlSeed: true, dp: [...dp] });

        for (let r = n - 2; r >= 0; r--) {
            add("Iterate Rows Upwards", `for (int row = n - 2; row >= 0; row--)\nProcessing row ${r}.`, 8, { hlRowLoop: true, activeR: r, dp: [...dp] });
            for (let c = 0; c <= r; c++) {
                add("Iterate Columns", `for (int col = 0; col <= row; col++)\nProcessing node at (${r}, ${c}).`, 9, { hlColLoop: true, activeR: r, activeC: c, dp: [...dp] });
                
                let minPath = Math.min(dp[c], dp[c+1]);
                add("Find Minimum Child", `int minPath = Math.min(dp[col], dp[col + 1]);\nComparing current dp[col] (${dp[c]}) and dp[col+1] (${dp[c+1]}). Min is ${minPath}.`, 10, { hlMin: true, activeR: r, activeC: c, leftR: r+1, leftC: c, rightR: r+1, rightC: c+1, dp: [...dp], minPath });
                
                dp[c] = t[r][c] + minPath;
                add("Update DP In-Place", `dp[col] = triangle.get(row).get(col) + minPath;\nOverwriting dp[${c}] with ${t[r][c]} + ${minPath} = ${dp[c]}.`, 11, { hlUpdate: true, activeR: r, activeC: c, dp: [...dp] });
            }
        }
        
        add("Return Result", `return dp[0];\nThe absolute minimum path sum overwrites the very first slot!`, 14, { isSuccess: true, finalAns: dp[0], dp: [...dp] });
    }

    return steps;
  }, [baseTriangle, selectedOpId]);

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
      if (st.t === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"><Trophy size={16}/> Minimum Path Sum</div>
                      <div className={`flex items-center justify-center text-emerald-700 bg-emerald-100 border-emerald-400 font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full`}>
                          {st.finalAns}
                      </div>
                  </div>
              ) : st.activeR !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      
                      {/* Current Node */}
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">Node ({st.activeR}, {st.activeC})</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlUpdate ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeC !== undefined ? st.t[st.activeR][st.activeC] : '-'}
                          </div>
                      </div>

                      {st.minPath !== undefined && (
                          <>
                              <span className="text-2xl font-black text-slate-300">+</span>
                              {/* Min Path from Children */}
                              <div className="flex flex-col items-center animate-in zoom-in">
                                  <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><ArrowDown size={12}/> Min Child Path</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-100 border-sky-500 text-sky-800 shadow-md`}>
                                      {st.minPath}
                                  </div>
                              </div>
                          </>
                      )}

                      {(st.hlUpdate || st.hlReturn) && st.res !== undefined && st.activeC !== undefined && (
                          <>
                              <span className="text-2xl font-black text-slate-300">=</span>
                              {/* Result/Update */}
                              <div className="flex flex-col items-center animate-in zoom-in">
                                  <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><CheckCircle2 size={12}/> Updated Sum</span>
                                  <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 shadow-xl scale-110`}>
                                      {st.res || (st.t[st.activeR][st.activeC] + (st.minPath || 0))}
                                  </div>
                              </div>
                          </>
                      )}
                      
                      {st.hlUpdate && st.res === undefined && st.activeC !== undefined && (
                          <>
                              <span className="text-2xl font-black text-slate-300">=</span>
                              {/* Result/Update for DP */}
                              <div className="flex flex-col items-center animate-in zoom-in">
                                  <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><CheckCircle2 size={12}/> New DP Value</span>
                                  <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 shadow-xl scale-110`}>
                                      {st.dp ? (Array.isArray(st.dp[0]) ? st.dp[st.activeR][st.activeC] : st.dp[st.activeC]) : '?'}
                                  </div>
                              </div>
                          </>
                      )}

                  </div>
              ) : (
                  <span className="text-slate-400 italic text-sm py-4">Initializing Data Structures...</span>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.t === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 48;
      const nodeGapX = 16;
      const nodeGapY = 24;
      const rowHeight = nodeWidth + nodeGapY;
      
      const startY = 80;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Arrays */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '480px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Triangle Rendering */}
                          {st.t.map((rowArr: number[], r: number) => {
                              
                              const rowWidth = rowArr.length * nodeWidth + (rowArr.length - 1) * nodeGapX;
                              const rowStartX = -(rowWidth / 2) + (nodeWidth / 2);

                              return rowArr.map((val: number, c: number) => {
                                  let currentX = rowStartX + c * (nodeWidth + nodeGapX);
                                  let currentY = startY + r * rowHeight;
                                  
                                  let isActive = st.activeR === r && st.activeC === c;
                                  let isLeftChild = st.leftR === r && st.leftC === c;
                                  let isRightChild = st.rightR === r && st.rightC === c;

                                  let bgClass = "bg-white border-slate-300 text-slate-700 shadow-sm"; 
                                  let scaleClass = "scale-100";

                                  if (isActive) {
                                      bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                      scaleClass = "scale-125";
                                  } else if (isLeftChild || isRightChild) {
                                      bgClass = "bg-sky-50 border-sky-400 text-sky-800 shadow-md ring-2 ring-sky-200 z-20";
                                      scaleClass = "scale-110";
                                  }

                                  // Overlay values depending on approach
                                  let overlayVal = null;
                                  if (selectedOpId === 'memoization' && st.memo && st.memo[r] && st.memo[r][c] !== null) {
                                      overlayVal = st.memo[r][c];
                                  } else if (selectedOpId === 'tabulation' && st.dp && st.dp[r] && st.dp[r][c] !== 0) {
                                      overlayVal = st.dp[r][c];
                                  }

                                  return (
                                      <div key={`node-${r}-${c}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass} z-20`} style={{ left: `calc(50% + ${currentX}px)`, top: `${currentY}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {/* Element Box */}
                                          <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center border-[3px] rounded-full transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-xl">{val}</span>
                                          </div>
                                          
                                          {/* DP/Memo Overlay Badge */}
                                          {overlayVal !== null && (
                                              <div className="absolute -bottom-2 -right-2 bg-fuchsia-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm border border-fuchsia-600 z-40 animate-in zoom-in">
                                                  {overlayVal}
                                              </div>
                                          )}

                                          {/* Active Pointer */}
                                          {isActive && !st.isSuccess && (
                                              <div className="absolute -top-10 flex flex-col items-center animate-bounce z-50">
                                                  <span className="text-[9px] font-black uppercase text-amber-700 tracking-widest bg-amber-100 px-1 rounded border border-amber-300 shadow-sm mb-0.5">visiting</span>
                                                  <ArrowDown size={16} className="text-amber-500"/>
                                              </div>
                                          )}
                                      </div>
                                  )
                              });
                          })}
                          
                          {/* Render connection arrows down to children if active */}
                          {st.activeR !== undefined && st.activeC !== undefined && st.activeR < st.n - 1 && !st.isSuccess && (
                              <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-10 pointer-events-none" style={{ width: '1px', height: '1px', transform: 'translateX(50%)' }}>
                                  <defs>
                                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                          <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                                      </marker>
                                      <marker id="arrowheadActive" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                          <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
                                      </marker>
                                  </defs>
                                  
                                  {/* Left Child Line */}
                                  <line 
                                      x1={st.activeC * (nodeWidth + nodeGapX) - (st.activeR * (nodeWidth + nodeGapX) / 2)} 
                                      y1={startY + st.activeR * rowHeight + nodeWidth / 2 + 5} 
                                      x2={st.activeC * (nodeWidth + nodeGapX) - ((st.activeR + 1) * (nodeWidth + nodeGapX) / 2)} 
                                      y2={startY + (st.activeR + 1) * rowHeight - nodeWidth / 2 - 5} 
                                      stroke={st.hlLeft || st.hlMin ? "#38bdf8" : "#cbd5e1"} 
                                      strokeWidth={st.hlLeft || st.hlMin ? "3" : "2"} 
                                      strokeDasharray={st.hlLeft || st.hlMin ? "none" : "4 4"}
                                      markerEnd={st.hlLeft || st.hlMin ? "url(#arrowheadActive)" : "url(#arrowhead)"}
                                      className="transition-all duration-300"
                                  />
                                  {/* Right Child Line */}
                                  <line 
                                      x1={st.activeC * (nodeWidth + nodeGapX) - (st.activeR * (nodeWidth + nodeGapX) / 2)} 
                                      y1={startY + st.activeR * rowHeight + nodeWidth / 2 + 5} 
                                      x2={(st.activeC + 1) * (nodeWidth + nodeGapX) - ((st.activeR + 1) * (nodeWidth + nodeGapX) / 2)} 
                                      y2={startY + (st.activeR + 1) * rowHeight - nodeWidth / 2 - 5} 
                                      stroke={st.hlRight || st.hlMin ? "#38bdf8" : "#cbd5e1"} 
                                      strokeWidth={st.hlRight || st.hlMin ? "3" : "2"} 
                                      strokeDasharray={st.hlRight || st.hlMin ? "none" : "4 4"}
                                      markerEnd={st.hlRight || st.hlMin ? "url(#arrowheadActive)" : "url(#arrowhead)"}
                                      className="transition-all duration-300"
                                  />
                              </svg>
                          )}

                          {/* Render 1D DP Array for Space Optimized Approach at the bottom */}
                          {selectedOpId === 'spaceOptimized' && st.dp && (
                              <div className="absolute flex flex-col items-center" style={{ top: `${startY + st.n * rowHeight + 20}px` }}>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-3 shadow-sm">1D DP Array (Size N)</span>
                                  <div className="flex gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                                      {st.dp.map((val: number, idx: number) => {
                                          let isUpdating = st.hlUpdate && st.activeC === idx;
                                          let isReading = st.hlMin && (st.activeC === idx || st.activeC + 1 === idx);
                                          
                                          let boxBg = "bg-slate-50 border-slate-300 text-slate-600";
                                          if (isUpdating) boxBg = "bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 ring-2 ring-fuchsia-200 scale-110 shadow-md z-10 animate-pulse";
                                          else if (isReading) boxBg = "bg-sky-100 border-sky-400 text-sky-800 shadow-sm z-10";
                                          
                                          if (st.isSuccess && idx === 0) boxBg = "bg-emerald-500 border-emerald-600 text-white scale-125 shadow-xl ring-4 ring-emerald-200 z-20";

                                          return (
                                              <div key={`dp-${idx}`} className="flex flex-col items-center">
                                                  <div className={`w-10 h-10 flex items-center justify-center font-mono font-black border-2 rounded-lg transition-all duration-300 ${boxBg}`}>
                                                      {val}
                                                  </div>
                                                  <span className="text-[8px] font-mono text-slate-400 mt-1">idx:{idx}</span>
                                              </div>
                                          )
                                      })}
                                  </div>
                              </div>
                          )}

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
                <Triangle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Triangle</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming Options
                  </span>
                  <span>•</span>
                  <span>LeetCode 120</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Triangle size={28}/> Path to the Bottom</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a <code>triangle</code> array, return the minimum path sum from top to bottom.</p>
                        <p>For each step, you may move to an adjacent number of the row below. More formally, if you are on index <code>i</code> on the current row, you may move to either index <code>i</code> or index <code>i + 1</code> on the next row.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">11</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">The triangle looks like:<br/>   2<br/>  3 4<br/> 6 5 7<br/>4 1 8 3<br/>The minimum path sum from top to bottom is 2 + 3 + 5 + 1 = 11.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> triangle = [[-10]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">-10</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= triangle.length &lt;= 200</li>
                            <li>triangle[0].length == 1</li>
                            <li>triangle[i].length == triangle[i - 1].length + 1</li>
                            <li>-10^4 &lt;= triangle[i][j] &lt;= 10^4</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ListTree size={16} className="text-rose-500"/> Why Recursion Fails</h4>
                        <p className="text-sm leading-relaxed">If you try all paths from the top down, you branch into 2 paths at every step. This creates an exponential $O(2^N)$ tree of paths. Many of these paths overlap (e.g. going Left-then-Right lands on the same node as Right-then-Left). Without caching (memoization), the brute force approach is too slow.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Zap size={16} className={`text-${themeColor}-500`}/> The Inverted Paradigm</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Instead of thinking top-down, think <strong>bottom-up</strong>. If you are at the bottom row, the minimum path is just the node itself. Moving up one row, the minimum path from that node is itself plus the <code>min()</code> of its two children below it. We can ripple this logic all the way to the top in $O(N^2)$ time, and using a 1D array, we can do it in $O(N)$ space!</p>
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
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Triangle Array (Use | for rows, max 5 rows)</label>
                            <input type="text" value={triangleInput} onChange={(e) => setTriangleInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="2 | 3, 4 | 6, 5, 7 | 4, 1, 8, 3" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3">
                                <PartyPopper size={24}/> EXECUTION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Minimum path sum is {st.finalAns}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlUpdate || st.hlReturn ? 'text-fuchsia-400' : (st.hlMin || st.hlLeft || st.hlRight ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Triangle size={14} className={`text-${themeColor}-500`}/> Dynamic Visualization</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the progression from brute force to optimal DP.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Approach 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-rose-500"/> 1. Brute Force (Recursion)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">We explore every possible path. From a node at <code>(row, col)</code>, we must explore both <code>(row+1, col)</code> and <code>(row+1, col+1)</code>. The minimum path from our current node is its own value plus the minimum of these two recursive calls.</p>
                        <p className="text-slate-800 font-bold bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 w-fit">Time: O(2^N) | Space: O(N)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Because we branch into 2 paths at every single step across $N$ rows, the time complexity is exponential $O(2^N)$. Space is $O(N)$ due to the maximum depth of the call stack.</p>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 2. Memoization (Top-Down)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">During recursion, multiple paths overlap and end up requesting the answer for the exact same <code>(row, col)</code> node. By allocating a 2D cache <code>memo[N][N]</code>, we can save the result of a node the first time we calculate it. Future requests for that node instantly return the cached result.</p>
                        <p className="text-slate-800 font-bold bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 w-fit">Time: O(N^2) | Space: O(N^2)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">We only compute each of the $O(N^2)$ nodes in the triangle exactly once. Space is $O(N^2)$ for the 2D cache array plus $O(N)$ for the recursion stack.</p>
                    </div>

                    {/* Approach 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-fuchsia-500"/> 3. Tabulation (Bottom-Up)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Instead of relying on the call stack, we can iteratively build the solution from the bottom up. We fill a 2D <code>dp[N][N]</code> table. We initialize the bottom row with the triangle's last row. Then, moving upwards, <code>dp[r][c] = triangle[r][c] + min(dp[r+1][c], dp[r+1][c+1])</code>.</p>
                        <p className="text-slate-800 font-bold bg-fuchsia-100 px-3 py-1.5 rounded-lg border border-fuchsia-200 w-fit">Time: O(N^2) | Space: O(N^2)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Two nested loops over the triangle elements give $O(N^2)$ time. The explicit 2D table requires $O(N^2)$ space.</p>
                    </div>

                    {/* Approach 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 4. Space Optimized (1D DP)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice the DP recurrence in Tabulation: to calculate row <code>r</code>, we <strong>only</strong> need the values from row <code>r+1</code>. The rest of the table is useless! We can collapse the 2D table into a single 1D array <code>dp[N]</code>. As we process row <code>r</code>, we overwrite the array in place: <code>dp[c] = triangle[r][c] + min(dp[c], dp[c+1])</code>.</p>
                        <p className="text-slate-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">Time: O(N^2) | Space: O(N)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This is the ultimate optimal solution. Same fast $O(N^2)$ execution time, but the memory footprint is drastically reduced to a single $O(N)$ array.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a classic DP pathway problem. Interviewers usually ask you to start with the recursion, identify the overlapping subproblems, and incrementally optimize the space complexity down to O(N)."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we do Top-Down approach instead of Bottom-Up?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it's trickier to handle bounds and space optimization."</p>
                            <p>If you build the DP table from top to bottom, <code>dp[r][c]</code> depends on <code>dp[r-1][c-1]</code> and <code>dp[r-1][c]</code>. You have to be very careful with edge cases (the left and right boundaries of the triangle). Furthermore, the final answer isn't in a single cell like <code>dp[0][0]</code>; you have to scan the entire bottom row of the DP table to find the minimum. Bottom-Up naturally handles all of this elegantly without bounds checking."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Can we achieve O(1) space complexity?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Only if we are allowed to modify the input array."</p>
                            <p>If it is acceptable to mutate the <code>triangle</code> parameter, we can just use the triangle itself as our DP table! We would iterate bottom-up and simply add the minimum child value directly to <code>triangle.get(row).set(col, newValue)</code>. This takes strictly $O(1)$ auxiliary space. However, modifying inputs is often frowned upon in production systems, so $O(N)$ auxiliary space is generally the expected safe answer."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "How does the space optimization `dp[col] = triangle... + min(dp[col], dp[col+1])` not overwrite values prematurely?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because it reads from the right and writes to the left."</p>
                            <p>When calculating <code>dp[col]</code>, we read the *old* values of <code>dp[col]</code> and <code>dp[col+1]</code>. Then we overwrite <code>dp[col]</code>. In the very next iteration, we will calculate <code>dp[col+1]</code>, but that calculation only depends on the *old* values of <code>dp[col+1]</code> and <code>dp[col+2]</code>. Since we calculate from left to right (or right to left, actually both work here since it only depends on current and right neighbor), we never read an overwritten value from the current row."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlUpdate || st.hlReturn ? 'text-fuchsia-400' : (st.hlMin || st.hlLeft || st.hlRight ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        
                        {/* Persistent State Monitor for Fullscreen */}
                        {st.activeR !== undefined && !st.isSuccess && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Node</span>
                                    <span className="font-mono font-black text-amber-400">{st.activeC !== undefined ? st.t[st.activeR][st.activeC] : '-'}</span>
                                </div>
                                {st.minPath !== undefined && (
                                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">minChild</span>
                                        <span className="font-mono font-black text-sky-400">{st.minPath}</span>
                                    </div>
                                )}
                            </div>
                        )}

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
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Triangle Array (Use | for rows)</label>
                              <input type="text" value={triangleInput} onChange={(e) => setTriangleInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="2 | 3, 4 | 6, 5, 7" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EXECUTION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully calculated min path sum</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Min Path Sum</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2 break-all">{st.finalAns}</div>
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