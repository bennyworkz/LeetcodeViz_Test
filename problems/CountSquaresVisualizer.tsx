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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  recursion: {
    id: 'recursion',
    title: '1. Brute Force (Recursion)',
    icon: <ListTree size={16} />,
    complexity: 'Time: O(3^(min(R,C)) * R * C) | Space: O(min(R,C))',
    theme: 'rose',
    code: `class Solution {
    public int countSquares(int[][] matrix) {
        int count = 0;
        for (int r = 0; r < matrix.length; r++) {
            for (int c = 0; c < matrix[0].length; c++) {
                count += dfs(matrix, r, c);
            }
        }
        return count;
    }
    
    private int dfs(int[][] mat, int r, int c) {
        if (r >= mat.length || c >= mat[0].length || mat[r][c] == 0) {
            return 0;
        }
        int right = dfs(mat, r, c + 1);
        int down = dfs(mat, r + 1, c);
        int diag = dfs(mat, r + 1, c + 1);
        
        return 1 + Math.min(right, Math.min(down, diag));
    }
}`,
    desc: "The Recursive Approach: We iterate over every cell. For each cell (r, c), we run a DFS to find the maximum square size that has its TOP-LEFT corner at (r, c). The size of this max square corresponds exactly to the number of squares starting there! The recursion explores right, down, and diagonal. Because it branches 3 ways at every step without saving results, the overlapping subproblems cause exponential time explosion."
  },
  memoization: {
    id: 'memoization',
    title: '2. Memoization (Top-Down)',
    icon: <Database size={16} />,
    complexity: 'Time: O(R * C) | Space: O(R * C)',
    theme: 'sky',
    code: `class Solution {
    public int countSquares(int[][] matrix) {
        int count = 0;
        Integer[][] memo = new Integer[matrix.length][matrix[0].length];
        
        for (int r = 0; r < matrix.length; r++) {
            for (int c = 0; c < matrix[0].length; c++) {
                count += dfs(matrix, r, c, memo);
            }
        }
        return count;
    }
    
    private int dfs(int[][] mat, int r, int c, Integer[][] memo) {
        if (r >= mat.length || c >= mat[0].length || mat[r][c] == 0) return 0;
        if (memo[r][c] != null) return memo[r][c];
        
        int right = dfs(mat, r, c + 1, memo);
        int down = dfs(mat, r + 1, c, memo);
        int diag = dfs(mat, r + 1, c + 1, memo);
        
        return memo[r][c] = 1 + Math.min(right, Math.min(down, diag));
    }
}`,
    desc: "The Top-Down DP Approach: We introduce a 2D cache array 'memo'. Why 2D? Because a subproblem's state is uniquely identified by its row 'r' and column 'c' coordinate! Before executing the 3-way branching, we check if memo[r][c] already holds the answer. If so, we return it instantly. This entirely eliminates redundant recursive calculations, dropping the time complexity to O(R * C)."
  },
  tabulation: {
    id: 'tabulation',
    title: '3. Tabulation (Bottom-Up)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(R * C) | Space: O(R * C)',
    theme: 'fuchsia',
    code: `class Solution {
    public int countSquares(int[][] matrix) {
        int rLen = matrix.length, cLen = matrix[0].length;
        int[][] dp = new int[rLen][cLen];
        int count = 0;
        
        for (int r = 0; r < rLen; r++) {
            for (int c = 0; c < cLen; c++) {
                if (matrix[r][c] == 1) {
                    if (r == 0 || c == 0) {
                        dp[r][c] = 1;
                    } else {
                        dp[r][c] = 1 + Math.min(dp[r-1][c], 
                                     Math.min(dp[r][c-1], dp[r-1][c-1]));
                    }
                    count += dp[r][c];
                }
            }
        }
        return count;
    }
}`,
    desc: "The Bottom-Up DP Approach: We invert the perspective! We declare a 2D 'dp' array where dp[r][c] stores the max square size ending at the BOTTOM-RIGHT corner (r, c). We iterate row-by-row, left-to-right. A cell's square size is simply 1 plus the minimum of its top, left, and top-left neighbors from the DP table. This cleanly removes the recursion call stack but still takes O(R * C) memory."
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '4. Space Optimized (1D DP)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(R * C) | Space: O(C)',
    theme: 'emerald',
    code: `class Solution {
    public int countSquares(int[][] matrix) {
        int rLen = matrix.length, cLen = matrix[0].length;
        int[] dp = new int[cLen];
        int count = 0, prevDiag = 0;
        
        for (int r = 0; r < rLen; r++) {
            for (int c = 0; c < cLen; c++) {
                int temp = dp[c];
                if (matrix[r][c] == 1) {
                    if (r == 0 || c == 0) {
                        dp[c] = 1;
                    } else {
                        dp[c] = 1 + Math.min(dp[c], Math.min(dp[c-1], prevDiag));
                    }
                    count += dp[c];
                } else {
                    dp[c] = 0;
                }
                prevDiag = temp;
            }
        }
        return count;
    }
}`,
    desc: "The Ultimate Optimization: We completely drop the 2D grid! Why? Because to calculate row 'r', Tabulation ONLY looks at row 'r' (left) and row 'r-1' (top, top-left). We just need a single 1D array 'dp' of size C (columns) representing the previous row! We overwrite it as we move. We use a single integer 'prevDiag' to cache the top-left value before it gets overwritten. This shrinks our memory from O(R * C) down to strictly O(C)!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|for|while|String|countSquares|matrix|length|count|r|c|dfs|mat|right|down|diag|Math|min|max|memo|Integer|null|rLen|cLen|dp|prevDiag|temp)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isPointer = ['matrix', 'count', 'r', 'c', 'mat', 'right', 'down', 'diag', 'memo', 'rLen', 'cLen', 'dp', 'prevDiag', 'temp'].includes(part);
            const isMapCall = ['countSquares', 'length', 'dfs', 'min', 'max'].includes(part);
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

export default function CountSquaresVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [matrixInput, setMatrixInput] = useState('0,1,1,1 | 1,1,1,1 | 0,1,1,1');
  const [baseMatrix, setBaseMatrix] = useState<number[][]>([
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 1]
  ]);

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
        let rows = matrixInput.split('|').map(r => r.trim());
        let parsed: number[][] = [];
        let valid = true;
        let cLen = -1;

        for (let i = 0; i < rows.length; i++) {
            let cols = rows[i].split(',').map(c => parseInt(c.trim().replace(/[^01]/g, ''), 10));
            cols = cols.filter(c => !isNaN(c));
            
            if (cols.length === 0) continue;
            if (cLen === -1) cLen = cols.length;
            if (cols.length !== cLen) { valid = false; break; }
            parsed.push(cols);
        }
        
        if (!valid || parsed.length === 0) {
            parsed = [[0,1,1,1],[1,1,1,1],[0,1,1,1]];
        }
        
        // Cap max size for UI performance (especially for recursion trace)
        if (parsed.length > 5) parsed = parsed.slice(0, 5);
        parsed = parsed.map(row => row.length > 6 ? row.slice(0, 6) : row);

        setBaseMatrix(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
          setBaseMatrix([[0,1,1,1],[1,1,1,1],[0,1,1,1]]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [matrixInput, selectedOpId]);

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
    const mat = baseMatrix;
    const rLen = mat.length;
    const cLen = mat[0].length;

    const clone2D = (arr: any[][]) => arr.map(row => [...row]);
    const clone1D = (arr: any[]) => [...arr];

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { mat, rLen, cLen, ...st } 
    });

    let count = 0;

    if (selectedOpId === 'recursion') {
        add("Function Call", `public int countSquares(int[][] matrix)`, 2, { hlInit: true });

        add("Init Count", `int count = 0;`, 3, { hlInit: true, count });

        for (let mainR = 0; mainR < rLen; mainR++) {
            for (let mainC = 0; mainC < cLen; mainC++) {
                add("Main Loop", `for (int r = 0; r < matrix.length; r++) { for (int c = ...) }\nTriggering DFS from Top-Left corner at (${mainR}, ${mainC}).`, 5, { mainR, mainC, hlMainLoop: true, count });
                
                const dfs = (r: number, c: number): number => {
                    if (steps.length > 1000) return 0; // Cut off insane depth for visualizer

                    add("DFS Call", `private int dfs(int[][] mat, int r=${r}, int c=${c})`, 12, { mainR, mainC, activeR: r, activeC: c, count });

                    if (r >= rLen || c >= cLen || mat[r][c] === 0) {
                        let reason = r >= rLen || c >= cLen ? 'Out of bounds' : 'Cell is 0';
                        add("DFS Base Case", `if (r >= mat.length || c >= mat[0].length || mat[r][c] == 0)\n${reason}. Returning 0.`, 13, { mainR, mainC, activeR: r, activeC: c, hlBase: true, count });
                        return 0;
                    }

                    add("Branch Right", `int right = dfs(mat, r, c + 1);\nExploring cell to the right.`, 16, { mainR, mainC, activeR: r, activeC: c, scanR: r, scanC: c + 1, hlRight: true, count });
                    let right = dfs(r, c + 1);

                    add("Branch Down", `int down = dfs(mat, r + 1, c);\nExploring cell directly below.`, 17, { mainR, mainC, activeR: r, activeC: c, scanR: r + 1, scanC: c, hlDown: true, count });
                    let down = dfs(r + 1, c);

                    add("Branch Diagonal", `int diag = dfs(mat, r + 1, c + 1);\nExploring diagonal cell.`, 18, { mainR, mainC, activeR: r, activeC: c, scanR: r + 1, scanC: c + 1, hlDiag: true, count });
                    let diag = dfs(r + 1, c + 1);

                    let minChild = Math.min(right, Math.min(down, diag));
                    let res = 1 + minChild;
                    add("Return Size", `return 1 + Math.min(right, Math.min(down, diag));\nMin of children is ${minChild}. Square size starting at (${r}, ${c}) is 1 + ${minChild} = ${res}.`, 20, { mainR, mainC, activeR: r, activeC: c, hlReturn: true, res, right, down, diag, count });
                    
                    return res;
                };

                let res = dfs(mainR, mainC);
                let oldCount = count;
                count += res;
                add("Accumulate Count", `count += dfs(matrix, r, c);\nDFS from (${mainR}, ${mainC}) returned ${res}. Count increases from ${oldCount} to ${count}.`, 6, { mainR, mainC, hlAccumulate: true, count, res });
            }
        }
        add("Return Result", `return count;`, 9, { isSuccess: true, finalAns: count });

    } else if (selectedOpId === 'memoization') {
        add("Function Call", `public int countSquares(int[][] matrix)`, 2, { hlInit: true });
        
        add("Init Count", `int count = 0;`, 3, { hlInit: true, count });
        
        let memo: (number | null)[][] = Array.from({length: rLen}, () => new Array(cLen).fill(null));
        add("Init Memo Array", `Integer[][] memo = new Integer[matrix.length][matrix[0].length];\nWhy 2D? The state depends on row 'r' and col 'c'.`, 4, { hlMemoInit: true, memo: clone2D(memo), count });

        for (let mainR = 0; mainR < rLen; mainR++) {
            for (let mainC = 0; mainC < cLen; mainC++) {
                add("Main Loop", `for (int r = 0; r < matrix.length; r++) { for (int c = ...) }\nTriggering DFS from Top-Left corner at (${mainR}, ${mainC}).`, 6, { mainR, mainC, hlMainLoop: true, count, memo: clone2D(memo) });
                
                const dfs = (r: number, c: number): number => {
                    if (steps.length > 1500) return 0;

                    add("DFS Call", `private int dfs(int[][] mat, int r=${r}, int c=${c}, memo)`, 12, { mainR, mainC, activeR: r, activeC: c, count, memo: clone2D(memo) });

                    if (r >= rLen || c >= cLen || mat[r][c] === 0) {
                        add("DFS Base Case", `if (r >= mat.length || c >= mat[0].length || mat[r][c] == 0)\nBase case hit. Returning 0.`, 13, { mainR, mainC, activeR: r, activeC: c, hlBase: true, count, memo: clone2D(memo) });
                        return 0;
                    }

                    if (memo[r][c] !== null) {
                        add("Cache Hit", `if (memo[r][c] != null) return memo[r][c];\nWe already computed (${r}, ${c})! Returning cached value ${memo[r][c]}.`, 14, { mainR, mainC, activeR: r, activeC: c, hlCacheHit: true, count, memo: clone2D(memo) });
                        return memo[r][c] as number;
                    }

                    let right = dfs(r, c + 1);
                    let down = dfs(r + 1, c);
                    let diag = dfs(r + 1, c + 1);

                    let minChild = Math.min(right, Math.min(down, diag));
                    let res = 1 + minChild;
                    memo[r][c] = res;
                    add("Store & Return", `return memo[r][c] = 1 + Math.min(right, Math.min(down, diag));\nStoring ${res} into memo[${r}][${c}] and returning.`, 20, { mainR, mainC, activeR: r, activeC: c, hlStore: true, res, count, memo: clone2D(memo) });
                    
                    return res;
                };

                let res = dfs(mainR, mainC);
                count += res;
                add("Accumulate Count", `count += dfs(matrix, r, c, memo);\nDFS from (${mainR}, ${mainC}) returned ${res}. Count is now ${count}.`, 8, { mainR, mainC, hlAccumulate: true, count, res, memo: clone2D(memo) });
            }
        }
        add("Return Result", `return count;`, 11, { isSuccess: true, finalAns: count, memo: clone2D(memo) });

    } else if (selectedOpId === 'tabulation') {
        add("Function Call", `public int countSquares(int[][] matrix)`, 2, { hlInit: true });
        
        let dp: number[][] = Array.from({length: rLen}, () => new Array(cLen).fill(0));
        add("Init DP Array", `int[][] dp = new int[rLen][cLen];\nWhy 2D? To store the max square size ending at the bottom-right corner (r, c).`, 4, { hlDpInit: true, dp: clone2D(dp), count });

        for (let r = 0; r < rLen; r++) {
            for (let c = 0; c < cLen; c++) {
                add("Iterate Matrix", `Processing cell (${r}, ${c}).`, 7, { activeR: r, activeC: c, hlLoop: true, count, dp: clone2D(dp) });
                
                if (mat[r][c] === 1) {
                    if (r === 0 || c === 0) {
                        dp[r][c] = 1;
                        add("Border Case", `if (r == 0 || c == 0) dp[r][c] = 1;\nOn the top/left edge, the max square ending here is exactly size 1.`, 10, { activeR: r, activeC: c, hlBaseBorder: true, dp: clone2D(dp), count });
                    } else {
                        let top = dp[r-1][c];
                        let left = dp[r][c-1];
                        let diag = dp[r-1][c-1];
                        let minNeigh = Math.min(top, Math.min(left, diag));
                        dp[r][c] = 1 + minNeigh;
                        add("DP Calculation", `dp[r][c] = 1 + Math.min(dp[r-1][c], Math.min(dp[r][c-1], dp[r-1][c-1]));\nNeighbors: Top(${top}), Left(${left}), Diag(${diag}). Min is ${minNeigh}. New square size is ${dp[r][c]}.`, 12, { activeR: r, activeC: c, hlCalcDp: true, top, left, diag, dp: clone2D(dp), count });
                    }
                    count += dp[r][c];
                    add("Accumulate Output", `count += dp[r][c];\nAdding ${dp[r][c]} squares found ending here. Total count = ${count}.`, 15, { activeR: r, activeC: c, hlAccum: true, dp: clone2D(dp), count });
                } else {
                    add("Skip Zero", `Cell is 0. Cannot form a square ending here.`, 9, { activeR: r, activeC: c, hlSkip: true, dp: clone2D(dp), count });
                }
            }
        }
        add("Return Result", `return count;`, 20, { isSuccess: true, finalAns: count, dp: clone2D(dp) });

    } else if (selectedOpId === 'spaceOptimized') {
        add("Function Call", `public int countSquares(int[][] matrix)`, 2, { hlInit: true });
        
        let dp = new Array(cLen).fill(0);
        let prevDiag = 0;
        
        add("Init 1D Array", `int[] dp = new int[cLen];\nint count = 0, prevDiag = 0;\nWhy 1D? To compute row 'r', we only need the values from row 'r-1' (stored in dp[]) and the top-left value (stored in prevDiag)!`, 4, { hlDpInit: true, dp: clone1D(dp), count, prevDiag });

        for (let r = 0; r < rLen; r++) {
            add("Start Row", `for (int r = 0; r < rLen; r++)\nProcessing row ${r}.`, 7, { activeR: r, hlRowLoop: true, dp: clone1D(dp), count, prevDiag });

            for (let c = 0; c < cLen; c++) {
                add("Iterate Column", `for (int c = 0; c < cLen; c++)\nProcessing cell (${r}, ${c}).`, 8, { activeR: r, activeC: c, hlColLoop: true, dp: clone1D(dp), count, prevDiag });
                
                let temp = dp[c];
                add("Save Temp", `int temp = dp[c];\nSaving the 'top' value (${temp}) before it gets overwritten, to be used as 'prevDiag' for the NEXT column.`, 9, { activeR: r, activeC: c, hlTemp: true, dp: clone1D(dp), count, prevDiag, temp });

                if (mat[r][c] === 1) {
                    if (r === 0 || c === 0) {
                        dp[c] = 1;
                        add("Border Case", `if (r == 0 || c == 0) dp[c] = 1;\nOn the top/left edge, max square ending here is size 1.`, 12, { activeR: r, activeC: c, hlBaseBorder: true, dp: clone1D(dp), count, prevDiag, temp });
                    } else {
                        let top = dp[c]; // Unoverwritten
                        let left = dp[c-1]; // Already overwritten in previous step
                        let diag = prevDiag;
                        let minNeigh = Math.min(top, Math.min(left, diag));
                        dp[c] = 1 + minNeigh;
                        add("DP Calculation", `dp[c] = 1 + Math.min(dp[c], Math.min(dp[c-1], prevDiag));\nTop(${top}), Left(${left}), Diag(${diag}). Min is ${minNeigh}. Overwriting dp[${c}] with ${dp[c]}.`, 14, { activeR: r, activeC: c, hlCalcDp: true, dp: clone1D(dp), count, prevDiag, temp, top, left, diag });
                    }
                    count += dp[c];
                    add("Accumulate Output", `count += dp[c];\nAdding ${dp[c]} squares found. Total count = ${count}.`, 16, { activeR: r, activeC: c, hlAccum: true, dp: clone1D(dp), count, prevDiag, temp });
                } else {
                    dp[c] = 0;
                    add("Reset Zero", `dp[c] = 0;\nCell is 0. Resetting dp[${c}] to 0.`, 18, { activeR: r, activeC: c, hlReset: true, dp: clone1D(dp), count, prevDiag, temp });
                }
                
                prevDiag = temp;
                add("Update PrevDiag", `prevDiag = temp;\nUpdating prevDiag to ${temp} for the next column's calculation.`, 20, { activeR: r, activeC: c, hlUpdateDiag: true, dp: clone1D(dp), count, prevDiag, temp });
            }
        }
        add("Return Result", `return count;`, 23, { isSuccess: true, finalAns: count, dp: clone1D(dp) });
    }

    return steps;
  }, [baseMatrix, selectedOpId]);

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
      if (st.mat === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"><Trophy size={16}/> Total Squares Counted</div>
                      <div className={`flex items-center justify-center text-emerald-700 bg-emerald-100 border-emerald-400 font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full`}>
                          {st.finalAns}
                      </div>
                  </div>
              ) : st.activeR !== undefined || st.mainR !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      
                      {selectedOpId === 'spaceOptimized' ? (
                          <>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">Cell (r, c)</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                                      {st.activeR !== undefined && st.activeC !== undefined ? `(${st.activeR}, ${st.activeC})` : '-'}
                                  </div>
                              </div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1">prevDiag</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlTemp || st.hlUpdateDiag ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                                      {st.prevDiag !== undefined ? st.prevDiag : '-'}
                                  </div>
                              </div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1">temp</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlTemp ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-sky-50 border-sky-300 text-sky-700'}`}>
                                      {st.temp !== undefined ? st.temp : '-'}
                                  </div>
                              </div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Total Count</span>
                                  <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlAccum ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                                      {st.count !== undefined ? st.count : '-'}
                                  </div>
                              </div>
                          </>
                      ) : (
                          <>
                              {/* Current Cell */}
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">Cell ({st.activeR !== undefined ? st.activeR : st.mainR}, {st.activeC !== undefined ? st.activeC : st.mainC})</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                                      {st.activeR !== undefined && st.activeC !== undefined && st.activeR < st.rLen && st.activeC < st.cLen ? st.mat[st.activeR][st.activeC] : '-'}
                                  </div>
                              </div>

                              {st.res !== undefined && (
                                  <div className="flex flex-col items-center animate-in zoom-in">
                                      <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><ArrowLeftRight size={12}/> Squares Here</span>
                                      <div className={`border-2 text-3xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-100 border-sky-500 text-sky-800 shadow-md`}>
                                          {st.res}
                                      </div>
                                  </div>
                              )}
                              
                              {st.top !== undefined && (
                                  <div className="flex flex-col items-center animate-in zoom-in">
                                      <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><LayersIcon size={12}/> Neighbors</span>
                                      <div className={`border-2 text-sm font-black px-4 py-3 rounded-2xl transition-all duration-300 bg-amber-50 border-amber-300 text-amber-800 shadow-sm text-center`}>
                                          T:{st.top} | L:{st.left} | D:{st.diag}
                                      </div>
                                  </div>
                              )}

                              {st.count !== undefined && (
                                  <div className="flex flex-col items-center animate-in zoom-in">
                                      <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Total Count</span>
                                      <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlAccumulate || st.hlAccum ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 shadow-xl scale-110' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                                          {st.count}
                                      </div>
                                  </div>
                              )}
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
      if (st.mat === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 40;
      const nodeGap = 6;
      const totalSize = nodeWidth + nodeGap;
      
      const gridWidth = st.cLen * totalSize;
      const gridHeight = st.rLen * totalSize;
      const startX = -(gridWidth / 2) + (totalSize / 2);
      const startY = selectedOpId === 'spaceOptimized' ? 50 : 120;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Middle: Logic Dashboard */}
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              {/* Bottom: The Arrays */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '620px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Matrix Rendering */}
                          {st.mat.map((rowArr: number[], r: number) => {
                              return rowArr.map((val: number, c: number) => {
                                  let currentX = startX + c * totalSize;
                                  let currentY = startY + r * totalSize;
                                  
                                  let isAnchor = (st.activeR === r && st.activeC === c) || (st.mainR === r && st.mainC === c && !st.hlMainLoop && st.activeR === undefined);
                                  
                                  // Highlight neighbors based on approach
                                  let isNeighbor = false;
                                  if (selectedOpId === 'recursion' || selectedOpId === 'memoization') {
                                      isNeighbor = (st.scanR === r && st.scanC === c);
                                  } else if (selectedOpId === 'tabulation' || selectedOpId === 'spaceOptimized') {
                                      isNeighbor = st.activeR !== undefined && st.activeC !== undefined && 
                                                   ((r === st.activeR - 1 && c === st.activeC) || 
                                                    (r === st.activeR && c === st.activeC - 1) || 
                                                    (r === st.activeR - 1 && c === st.activeC - 1));
                                  }

                                  let isSpaceOptRow = selectedOpId === 'spaceOptimized' && st.activeR === r;

                                  let bgClass = "bg-white border-slate-200 text-slate-400"; 
                                  let scaleClass = "scale-100";

                                  if (val === 1) {
                                      bgClass = "bg-slate-700 border-slate-800 text-white"; // Base 1 color
                                  }

                                  if (isAnchor && !st.isSuccess && selectedOpId !== 'spaceOptimized') {
                                      bgClass = "bg-amber-400 border-amber-600 text-white shadow-xl ring-4 ring-amber-200 z-30";
                                      scaleClass = "scale-110";
                                  } else if (isNeighbor && !st.isSuccess) {
                                      bgClass = "bg-sky-400 border-sky-600 text-white shadow-md z-20";
                                  } else if (isSpaceOptRow && !st.isSuccess) {
                                      bgClass = val === 1 ? "bg-emerald-500 border-emerald-700 text-white shadow-lg z-20" : "bg-white border-slate-300 text-slate-400 shadow-md z-20";
                                      scaleClass = "scale-110";
                                  }

                                  // Overlay values depending on approach (DP/Memo)
                                  let overlayVal = null;
                                  if (selectedOpId === 'memoization' && st.memo && st.memo[r] && st.memo[r][c] !== null) {
                                      overlayVal = st.memo[r][c];
                                  } else if (selectedOpId === 'tabulation' && st.dp && st.dp[r] && st.dp[r][c] !== 0) {
                                      overlayVal = st.dp[r][c];
                                  }

                                  return (
                                      <div key={`node-${r}-${c}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass} z-20`} style={{ left: `calc(50% + ${currentX}px)`, top: `${currentY}px`, transform: 'translate(-50%, -50%)' }}>
                                          
                                          {/* Element Box */}
                                          <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center border-[2px] rounded-sm transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-xl">{val}</span>
                                          </div>
                                          
                                          {/* DP/Memo Overlay Badge */}
                                          {overlayVal !== null && (
                                              <div className="absolute -bottom-2 -right-2 bg-fuchsia-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm border border-fuchsia-600 z-40 animate-in zoom-in">
                                                  sz:{overlayVal}
                                              </div>
                                          )}
                                      </div>
                                  )
                              });
                          })}
                          
                          {/* Render 1D DP Array for Space Optimized Approach below the matrix */}
                          {selectedOpId === 'spaceOptimized' && st.dp && (
                              <div className="absolute flex flex-col items-center w-full" style={{ top: `${startY + st.rLen * totalSize + 40}px` }}>
                                  
                                  <div className="flex gap-10">
                                      {/* dp[] Array */}
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm">dp[] (Previous/Current Row)</span>
                                          <div className="flex gap-1 p-2 bg-white rounded-xl border border-slate-200 shadow-sm relative">
                                              
                                              {st.dp.map((val: number, idx: number) => {
                                                  let isUpdating = st.hlCalcDp && st.activeC === idx;
                                                  let isReading = st.hlCalcDp && (st.activeC === idx || st.activeC - 1 === idx);
                                                  
                                                  let boxBg = "bg-slate-50 border-slate-200 text-slate-500";
                                                  if (isUpdating) boxBg = "bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800 ring-2 ring-fuchsia-200 scale-110 shadow-md z-10 animate-pulse";
                                                  else if (isReading) boxBg = "bg-sky-100 border-sky-400 text-sky-800 shadow-sm z-10";

                                                  return (
                                                      <div key={`dp-${idx}`} className={`w-8 h-8 flex flex-col items-center justify-center font-mono font-black border-2 rounded transition-all duration-300 ${boxBg}`}>
                                                          <span>{val}</span>
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                      </div>

                                      {/* prevDiag Box */}
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm">prevDiag</span>
                                          <div className="flex gap-1 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                              <div className={`w-8 h-8 flex items-center justify-center font-mono font-black border-2 rounded transition-all duration-300 ${st.hlTemp || st.hlUpdateDiag || (st.hlCalcDp && st.diag !== undefined) ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                  {st.prevDiag !== undefined ? st.prevDiag : 0}
                                              </div>
                                          </div>
                                      </div>
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
                <Square className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Count Square Submatrices with All Ones</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming Options
                  </span>
                  <span>•</span>
                  <span>LeetCode 1277</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Square size={28}/> Squares Within Squares</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a <code>m * n</code> matrix of ones and zeros, return how many <strong>square</strong> submatrices have all ones.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> matrix = <br/>[<br/>  [0,1,1,1],<br/>  [1,1,1,1],<br/>  [0,1,1,1]<br/>]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">15</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">There are 10 squares of side 1.<br/>There are 4 squares of side 2.<br/>There is 1 square of side 3.<br/>Total number of squares = 10 + 4 + 1 = 15.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= arr.length &lt;= 300</li>
                            <li>1 &lt;= arr[0].length &lt;= 300</li>
                            <li>0 &lt;= arr[i][j] &lt;= 1</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ListTree size={16} className="text-rose-500"/> Finding Submatrices</h4>
                        <p className="text-sm leading-relaxed">The brute force approach recursively checks every possible square starting at (r, c). It expands right, down, and diagonally to verify if the expanded grid remains full of 1s. This recursive branching without memory cache causes exponential overlapping work.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Grid size={16} className={`text-${themeColor}-500`}/> DP Square Counting Magic</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The DP solution is incredibly elegant. If we let <code>dp[r][c]</code> represent the size of the <em>largest</em> square ending at <code>(r, c)</code>, then the cell <code>(r, c)</code> actually contributes exactly <code>dp[r][c]</code> squares to the total count! (E.g. if the max square ending there is 3x3, it also forms a 2x2 and 1x1 ending there). The DP transitions beautifully by taking <code>1 + min(top, left, top-left)</code>.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Binary Matrix (Use | for rows, max 5x6)</label>
                            <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="0,1,1 | 1,1,1" />
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
                                Total squares counted is {st.finalAns}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAccum || st.hlAccumulate ? 'text-fuchsia-400' : (st.hlCalcDp || st.hlReturn ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Square size={14} className={`text-${themeColor}-500`}/> Dynamic Matrix Visualizer</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Line-by-line breakdown of why we use arrays to crush time complexities.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Approach 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-rose-500"/> 1. Brute Force (Recursion)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why no arrays?</strong> We rely purely on the Call Stack memory. For every cell <code>(r, c)</code> in the matrix, we treat it as the top-left corner of a potential square. We recursively branch in 3 directions (right, down, diagonal) to calculate the size of the maximum valid square starting there. The size of that max square perfectly equals the number of squares originating from that cell.</p>
                        <p className="text-slate-800 font-bold bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 w-fit">Time: Exponential | Space: O(min(R,C))</p>
                        <p className="mt-4 text-sm text-slate-500 italic">The fatal flaw is the recursive 3-way branching. It re-evaluates the exact same cells repeatedly. Because it branches 3 times at every step and the max depth is the diagonal length, the time complexity is heavily exponential O(3^min(R,C) * R * C). The space is O(min(R,C)) due to the maximum depth of the recursive call stack.</p>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 2. Memoization (Top-Down)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a 2D Array?</strong> We declare <code>Integer[][] memo</code> because the recursive state requires two inputs: the row <code>r</code> and the column <code>c</code>. The memo acts as a direct cache. Before we launch the 3-way recursion, we check if <code>memo[r][c] != null</code>. If it exists, we return it instantly! This completely fixes the redundant overlapping branches.</p>
                        <p className="text-slate-800 font-bold bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 w-fit">Time: O(R * C) | Space: O(R * C)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">By caching, calculating the square size of any cell becomes strictly O(1) after the first evaluation. The time complexity drops drastically to linear regarding the total number of cells. Space is explicitly O(R * C) for the 2D grid.</p>
                    </div>

                    {/* Approach 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-fuchsia-500"/> 3. Tabulation (Bottom-Up)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a 2D Array?</strong> We declare <code>int[][] dp</code> to flip the recursion into an iterative process. We move left-to-right, row-by-row. If a cell is '1', its maximal square size ending at its bottom-right corner is <code>1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1])</code>. By building this 2D table iteratively, we skip the overhead of the call stack entirely while achieving the exact same mathematical result.</p>
                        <p className="text-slate-800 font-bold bg-fuchsia-100 px-3 py-1.5 rounded-lg border border-fuchsia-200 w-fit">Time: O(R * C) | Space: O(R * C)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">The time remains identical as we evaluate every cell once. The space remains O(R * C) for the DP table.</p>
                    </div>

                    {/* Approach 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 4. Space Optimized (1D Array)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why exactly a 1D Array and one variable?</strong> This is the ultimate optimization. To calculate row <code>r</code> in the Tabulation approach, look closely at the dependencies: <code>dp[r][c]</code> only looks at <code>dp[r-1]</code> (the row directly above) and <code>dp[r]</code> (the current row being processed). We don't need the entire $R \times C$ matrix in memory!</p>
                        <p className="text-slate-600 leading-relaxed">We declare a single 1D array <code>int[] dp</code> representing the previous row. As we loop across columns, we overwrite <code>dp[c]</code>. The only trick is that <code>dp[r-1][c-1]</code> (the top-left diagonal) gets overwritten before we can use it! We solve this by keeping a single integer <code>prevDiag</code> to cache that specific value right before overwriting.</p>
                        <p className="text-slate-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">Time: O(R * C) | Space: O(C)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Time remains exactly the same. However, the memory footprint is slashed from the entire matrix down to just the width of one row, achieving absolute optimal performance.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a brilliant DP question. Interviewers love it because the transition logic (1 + min of 3 neighbors) is highly intuitive, but optimizing the space to 1D requires a deep understanding of how DP tables are traversed."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why does `dp[r][c]` directly add to the total count?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because of the mathematical properties of nested squares."</p>
                            <p>If <code>dp[r][c] = 3</code>, it means the largest square ending at this bottom-right corner is a 3x3 square. But if a 3x3 square ends there, a 2x2 square MUST also end there, and a 1x1 square MUST also end there. Therefore, a max size of 3 implies exactly 3 valid squares end at this specific pixel. Summing all <code>dp[r][c]</code> directly accumulates every valid square in the entire matrix perfectly."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the 1D Space Optimized solution, why is the `prevDiag` variable necessary?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent reading corrupted data during overwrites."</p>
                            <p>To calculate the new <code>dp[c]</code>, we need the old <code>dp[c]</code> (top), the newly written <code>dp[c-1]</code> (left), and the old <code>dp[c-1]</code> (top-left diagonal). However, when we calculated the left cell in the previous loop iteration, we already overwrote <code>dp[c-1]</code>! If we try to read it now, we get the wrong row's data. By saving the old <code>dp[c]</code> into <code>prevDiag</code> *before* overwriting it, we preserve the top-left value for the next column's calculation.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Can we achieve O(1) space complexity?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Only if we are allowed to mutate the input matrix."</p>
                            <p>If mutating the input is allowed, we don't even need the 1D array. We can use the <code>matrix</code> itself as our DP table. We would loop through and update <code>matrix[r][c] = 1 + min(matrix[r-1][c], ...)</code>. This is $O(1)$ auxiliary space. However, modifying inputs is generally frowned upon in production code, making $O(C)$ the preferred safe optimization."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAccum || st.hlAccumulate ? 'text-fuchsia-400' : (st.hlCalcDp || st.hlReturn ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                          <div className="flex-[3] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Binary Matrix (Use | for rows)</label>
                              <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="0,1,1 | 1,1,1" />
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully counted all squares</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Squares Found</div>
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