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
  Split as SplitIcon, GitMerge, Share2, MousePointer2, 
  Binary, CircleDashed, CheckSquare, PlusSquare, 
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Target, Brackets, Smartphone, Globe, Grid, Crown, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square, Scale, CircleDot
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  recursion: {
    id: 'recursion',
    title: '1. Brute Force (Recursion)',
    icon: <ListTree size={16} />,
    complexity: 'Time: O(2^(A + N)) | Space: O(A)',
    theme: 'rose',
    code: `class Solution {
    public int change(int amount, int[] coins) {
        return dfs(coins, 0, amount);
    }
    
    private int dfs(int[] coins, int i, int amount) {
        if (amount == 0) return 1;
        if (i == coins.length || amount < 0) return 0;
        
        // Take the coin (stay at index 'i' to reuse it)
        int take = dfs(coins, i, amount - coins[i]);
        
        // Skip the coin (move to next index 'i+1')
        int skip = dfs(coins, i + 1, amount);
        
        return take + skip;
    }
}`,
    desc: "The Recursive Approach: This is the Unbounded Knapsack brute force. At every step, we evaluate a specific coin at index 'i'. We can either 'Take' it, or 'Skip' it. Crucially, if we take it, we DO NOT increment 'i'! Because we have an infinite supply, we recursively call the function staying on the same coin to see if we want to take it again. We only stop taking it when we manually choose the 'Skip' branch to move to 'i+1'. This causes massive exponential branching."
  },
  memoization: {
    id: 'memoization',
    title: '2. Memoization (Top-Down)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N * A) | Space: O(N * A)',
    theme: 'sky',
    code: `class Solution {
    public int change(int amount, int[] coins) {
        Integer[][] memo = new Integer[coins.length][amount + 1];
        return dfs(coins, 0, amount, memo);
    }
    
    private int dfs(int[] coins, int i, int amount, Integer[][] memo) {
        if (amount == 0) return 1;
        if (i == coins.length || amount < 0) return 0;
        
        if (memo[i][amount] != null) {
            return memo[i][amount];
        }
        
        int take = dfs(coins, i, amount - coins[i], memo);
        int skip = dfs(coins, i + 1, amount, memo);
        
        return memo[i][amount] = take + skip;
    }
}`,
    desc: "The Top-Down DP Approach: We notice that our recursive function is uniquely defined by two state variables: the current coin index 'i', and the remaining 'amount'. We declare a 2D cache array 'memo[i][amount]'. Before branching into the expensive take/skip paths, we check the cache. If the subproblem is already solved, we return the cached result. This prunes all redundant calculations."
  },
  tabulation: {
    id: 'tabulation',
    title: '3. Tabulation (Bottom-Up)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(N * A) | Space: O(N * A)',
    theme: 'fuchsia',
    code: `class Solution {
    public int change(int amount, int[] coins) {
        int n = coins.length;
        int[][] dp = new int[n + 1][amount + 1];
        
        // Base case: 1 way to make amount 0 (use 0 coins)
        for (int i = 0; i <= n; i++) dp[i][0] = 1;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= amount; j++) {
                // Inherit ways by skipping current coin
                dp[i][j] = dp[i - 1][j];
                
                // Add ways by taking current coin
                if (j >= coins[i - 1]) {
                    dp[i][j] += dp[i][j - coins[i - 1]];
                }
            }
        }
        return dp[n][amount];
    }
}`,
    desc: "The Bottom-Up DP Approach: We build a 2D table where dp[i][j] stores the number of combinations that make up amount 'j' using the first 'i' coins. We initialize column 0 to 1s because there is exactly 1 way to make amount 0. For each cell, we copy the value from the row above (skipping the coin). Then, if we can afford the current coin, we add the combinations from dp[i][j - coin] (the same row, representing using the coin again!)."
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '4. Space Optimized (1D DP)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N * A) | Space: O(A)',
    theme: 'emerald',
    code: `class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        
        for (int coin : coins) {
            for (int j = coin; j <= amount; j++) {
                dp[j] += dp[j - coin];
            }
        }
        
        return dp[amount];
    }
}`,
    desc: "The Ultimate Optimization: Look at Tabulation! To compute row 'i', we only read from the previous row 'i-1', and from the left side of our CURRENT row 'i'. We can compress the entire 2D matrix into a single 1D array of size (amount + 1). Crucially, we iterate FORWARDS (j = coin to amount). This causes dp[j] to read the newly updated value of dp[j - coin], perfectly simulating the 'unbounded' nature of reusing the same coin!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|change|coins|amount|dfs|take|skip|i|j|memo|Integer|null|n|dp|coin)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'Boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isPointer = ['coins', 'amount', 'memo', 'n', 'dp', 'take', 'skip', 'i', 'j', 'coin'].includes(part);
            const isMapCall = ['change', 'length', 'dfs'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"');
            
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

export default function CoinChangeVisualizerII() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [coinsInput, setCoinsInput] = useState('1, 2, 5');
  const [amountInput, setAmountInput] = useState('5');
  
  const [baseCoins, setBaseCoins] = useState<number[]>([1, 2, 5]);
  const [baseAmount, setBaseAmount] = useState<number>(5);

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
        let parsed = coinsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
        let parsedAmount = parseInt(amountInput.trim(), 10);
        
        if (parsed.length === 0) parsed = [1, 2, 5];
        if (isNaN(parsedAmount) || parsedAmount < 0) parsedAmount = 5;
        
        // Safety caps to prevent browser locking during recursion/2D rendering
        if (parsed.length > 5) parsed = parsed.slice(0, 5);
        if (parsedAmount > 20) parsedAmount = 5; 

        setBaseCoins(parsed);
        setBaseAmount(parsedAmount);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
          setBaseCoins([1, 2, 5]);
          setBaseAmount(5);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [coinsInput, amountInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone2D = (arr: any[][]) => arr.map(row => [...row]);
  const clone1D = (arr: any[]) => [...arr];

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const coins = baseCoins;
    const n = coins.length;
    const targetAmount = baseAmount;

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { coins, n, targetAmount, ...st } 
    });

    if (selectedOpId === 'recursion') {
        add("Function Call", `public int change(int amount, int[] coins)`, 2, { hlInit: true });
        add("Start DFS", `return dfs(coins, 0, amount);\nInitiating recursion at index 0 with full amount.`, 3, { hlDfsCall: true });

        const dfs = (i: number, remAmount: number, picked: number[]) => {
            if (steps.length > 800) return 0; // Safety cap
            
            add("DFS Call", `private int dfs(int[] coins, int i=${i}, int amount=${remAmount})\nEvaluating coin ${coins[i] ? coins[i] : 'OutOfBounds'} at index ${i} with ${remAmount} remaining.`, 6, { activeI: i, remAmount, picked: [...picked] });

            if (remAmount === 0) {
                add("Base Case: Target Reached", `if (amount == 0) return 1;\nRemaining amount is exactly 0! This combination [${picked.join(', ')}] works.`, 7, { activeI: i, remAmount, hlBase1: true, isMatch: true, picked: [...picked] });
                return 1;
            }
            if (i === n || remAmount < 0) {
                let reason = i === n ? "Out of bounds" : "Overshot amount";
                add("Base Case: Invalid Path", `if (i == coins.length || amount < 0) return 0;\n${reason}. Path is invalid.`, 8, { activeI: i, remAmount, hlBase2: true, isMatch: false, picked: [...picked] });
                return 0;
            }

            add("Branch: Take Coin", `int take = dfs(coins, i, amount - coins[i]);\nWe TAKE coin ${coins[i]}. Note we stay at index ${i} so we can take it again!`, 11, { activeI: i, remAmount, hlTake: true, nextI: i, nextAmount: remAmount - coins[i], picked: [...picked, coins[i]] });
            let take = dfs(i, remAmount - coins[i], [...picked, coins[i]]);

            add("Branch: Skip Coin", `int skip = dfs(coins, i + 1, amount);\nWe SKIP coin ${coins[i]} and move to index ${i+1}.`, 14, { activeI: i, remAmount, hlSkip: true, nextI: i+1, nextAmount: remAmount, picked: [...picked] });
            let skip = dfs(i + 1, remAmount, [...picked]);

            let totalWays = take + skip;
            add("Return Combinations", `return take + skip;\nReturning combinations found for this state: ${take} (take) + ${skip} (skip) = ${totalWays}.`, 16, { activeI: i, remAmount, hlReturn: true, take, skip, totalWays, picked: [...picked] });
            return totalWays;
        };

        let ans = dfs(0, targetAmount, []);
        add("Execution Complete", `return dfs(...);`, 3, { isSuccess: true, finalAns: ans });

    } else if (selectedOpId === 'memoization') {
        add("Function Call", `public int change(int amount, int[] coins)`, 2, { hlInit: true });
        
        let memo: (number | null)[][] = Array.from({length: n}, () => new Array(targetAmount + 1).fill(null));
        add("Init Memo Cache", `Integer[][] memo = new Integer[coins.length][amount + 1];\nAllocating 2D cache to map specific (index, amount) combinations to integer results.`, 3, { hlMemoInit: true, memo: clone2D(memo) });

        add("Start DFS", `return dfs(coins, 0, amount, memo);`, 4, { hlDfsCall: true, memo: clone2D(memo) });

        const dfs = (i: number, remAmount: number, picked: number[]): number => {
            if (steps.length > 1000) return 0;
            
            add("DFS Call", `private int dfs(int[] coins, int i=${i}, int amount=${remAmount}, Integer[][] memo)`, 7, { activeI: i, remAmount, memo: clone2D(memo), picked: [...picked] });

            if (remAmount === 0) {
                add("Base Case: Target Reached", `if (amount == 0) return 1;\nFound valid combination!`, 8, { activeI: i, remAmount, hlBase1: true, memo: clone2D(memo), picked: [...picked] });
                return 1;
            }
            if (i === n || remAmount < 0) {
                add("Base Case: Invalid Path", `if (i == coins.length || amount < 0) return 0;\nInvalid path.`, 9, { activeI: i, remAmount, hlBase2: true, memo: clone2D(memo), picked: [...picked] });
                return 0;
            }

            if (memo[i][remAmount] !== null) {
                add("Cache Hit", `if (memo[i][amount] != null) return memo[i][amount];\nCache Hit at [${i}][${remAmount}]! Returning ${memo[i][remAmount]}.`, 12, { activeI: i, remAmount, hlCacheHit: true, memo: clone2D(memo), cachedVal: memo[i][remAmount], picked: [...picked] });
                return memo[i][remAmount] as number;
            }

            add("Branch: Take Coin", `int take = dfs(coins, i, amount - coins[i], memo);`, 15, { activeI: i, remAmount, hlTake: true, nextI: i, nextAmount: remAmount - coins[i], memo: clone2D(memo), picked: [...picked, coins[i]] });
            let take = dfs(i, remAmount - coins[i], [...picked, coins[i]]);

            add("Branch: Skip Coin", `int skip = dfs(coins, i + 1, amount, memo);`, 16, { activeI: i, remAmount, hlSkip: true, nextI: i+1, nextAmount: remAmount, memo: clone2D(memo), picked: [...picked] });
            let skip = dfs(i + 1, remAmount, [...picked]);

            let totalWays = take + skip;
            memo[i][remAmount] = totalWays;
            add("Cache Store", `return memo[i][amount] = take + skip;\nStoring ${totalWays} ways into memo[${i}][${remAmount}].`, 18, { activeI: i, remAmount, hlStore: true, totalWays, memo: clone2D(memo), picked: [...picked] });
            return totalWays;
        };

        let ans = dfs(0, targetAmount, []);
        add("Execution Complete", `return dfs(...);`, 4, { isSuccess: true, finalAns: ans, memo: clone2D(memo) });

    } else if (selectedOpId === 'tabulation') {
        add("Function Call", `public int change(int amount, int[] coins)`, 2, { hlInit: true });
        
        let dp: number[][] = Array.from({length: n + 1}, () => new Array(targetAmount + 1).fill(0));
        add("Init DP Grid", `int[][] dp = new int[n + 1][amount + 1];\nAllocated 2D table representing items (0..N) vs target amounts (0..Amount).`, 4, { hlDpInit: true, dp: clone2D(dp) });

        for (let i = 0; i <= n; i++) dp[i][0] = 1;
        add("Seed DP Base Case", `for (int i = 0; i <= n; i++) dp[i][0] = 1;\nThere is exactly 1 way to form amount 0: by selecting no coins.`, 7, { hlSeed: true, dp: clone2D(dp) });

        for (let i = 1; i <= n; i++) {
            let coin = coins[i - 1];
            add("Outer Loop (Coins)", `for (int i = 1; i <= n; i++) { ... }\nProcessing coin at index ${i-1} with value ${coin}.`, 9, { activeI: i, activeCoin: coin, hlLoopI: true, dp: clone2D(dp) });
            
            for (let j = 1; j <= targetAmount; j++) {
                add("Inner Loop (Amounts)", `for (int j = 1; j <= amount; j++)\nCalculating combinations to form amount ${j}.`, 10, { activeI: i, activeCoin: coin, activeJ: j, hlLoopJ: true, dp: clone2D(dp) });
                
                dp[i][j] = dp[i - 1][j]; // Skip
                let inheritVal = dp[i - 1][j];
                add("Inherit Skip Ways", `dp[i][j] = dp[i - 1][j];\nInherit combinations by skipping this coin entirely: ${inheritVal} ways.`, 12, { activeI: i, activeCoin: coin, activeJ: j, hlSkip: true, dp: clone2D(dp), inheritVal });
                
                if (j >= coin) {
                    let takeVal = dp[i][j - coin];
                    dp[i][j] += takeVal;
                    add("Add Take Ways", `if (j >= coins[i - 1]) dp[i][j] += dp[i][j - coins[i - 1]];\nWe can afford the coin! We ADD the combinations from dp[${i}][${j - coin}] (${takeVal} ways) because we can REUSE this coin.`, 15, { activeI: i, activeCoin: coin, activeJ: j, hlTake: true, dp: clone2D(dp), takeIdx: j - coin, takeVal });
                } else {
                    add("Cannot Afford", `if (j >= coins[i - 1]) is false.\nCannot afford coin ${coin} for amount ${j}.`, 14, { activeI: i, activeCoin: coin, activeJ: j, hlNoTake: true, dp: clone2D(dp) });
                }
            }
        }
        
        add("Return Result", `return dp[n][amount];\nFinal answer rests at the bottom-right cell!`, 20, { isSuccess: true, finalAns: dp[n][targetAmount], dp: clone2D(dp) });

    } else if (selectedOpId === 'spaceOptimized') {
        add("Function Call", `public int change(int amount, int[] coins)`, 2, { hlInit: true });
        
        let dp: number[] = new Array(targetAmount + 1).fill(0);
        add("Init 1D DP Array", `int[] dp = new int[amount + 1];\nAllocated 1D array to save space! Tracks combinations to reach amounts 0..Amount.`, 3, { hlDpInit: true, dp: clone1D(dp) });

        dp[0] = 1;
        add("Seed DP Base Case", `dp[0] = 1;\n1 way to reach amount 0.`, 4, { hlSeed: true, dp: clone1D(dp) });

        for (let i = 0; i < n; i++) {
            let coin = coins[i];
            add("Outer Loop (Coins)", `for (int coin : coins)\nProcessing coin value ${coin}.`, 6, { activeCoin: coin, activeI: i, hlLoopI: true, dp: clone1D(dp) });

            for (let j = coin; j <= targetAmount; j++) {
                add("Inner FORWARDS Loop", `for (int j = coin; j <= amount; j++)\nCalculating amount ${j}. Crucially, we iterate FORWARDS!`, 7, { activeCoin: coin, activeI: i, activeJ: j, hlLoopJ: true, dp: clone1D(dp) });
                
                let oldVal = dp[j];
                let adding = dp[j - coin];
                dp[j] = dp[j] + adding;
                add("DP In-Place Accumulate", `dp[j] += dp[j - coin];\nWays to reach ${j} = (previous ways ${oldVal}) + (ways to reach ${j-coin}, which is ${adding}). New total: ${dp[j]}. Because we loop forwards, dp[${j-coin}] might have ALREADY used this coin!`, 8, { activeCoin: coin, activeI: i, activeJ: j, hlCalcDp: true, dp: clone1D(dp), oldVal, adding, takeIdx: j - coin });
            }
        }
        
        add("Return Result", `return dp[amount];\nFinal combinations stored in the last slot!`, 12, { isSuccess: true, finalAns: dp[targetAmount], dp: clone1D(dp) });
    }

    return steps;
  }, [baseCoins, baseAmount, selectedOpId]);

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
      if (st.coins === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-emerald-600`}>
                          <Trophy size={16}/> 
                          Total Coin Combinations
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-emerald-700 bg-emerald-100 border-emerald-400`}>
                          {st.finalAns} Ways Found
                      </div>
                  </div>
              ) : selectedOpId === 'tabulation' || selectedOpId === 'spaceOptimized' ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Evaluating Coin</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoopI ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeCoin !== undefined ? st.activeCoin : '-'}
                          </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">Target Amount (j)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoopJ || st.hlCalcTake || st.hlCalcDp ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeJ !== undefined ? st.activeJ : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Combinations (dp[j])</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlCalcTake || st.hlCalcDp || st.hlSkip ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.dp && st.activeJ !== undefined ? (selectedOpId === 'tabulation' ? st.dp[st.activeI][st.activeJ] : st.dp[st.activeJ]) : '-'}
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Coin Index (i)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                              {st.activeI !== undefined && st.activeI < st.coins.length ? st.activeI : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1">Coin Value</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-50 border-sky-300 text-sky-700`}>
                              {st.activeI !== undefined && st.activeI < st.coins.length ? st.coins[st.activeI] : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">Remaining Amount</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlTake || st.hlSkip ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-md' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                              {st.remAmount !== undefined ? st.remAmount : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Returned Ways</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlReturn || st.hlStore ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.totalWays !== undefined ? st.totalWays : '-'}
                          </div>
                      </div>
                  </div>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.coins === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 44;
      const nodeGap = 6;
      const totalSize = nodeWidth + nodeGap;
      
      const arrWidth = st.coins.length * totalSize;
      const startX = -(arrWidth / 2) + (totalSize / 2);
      
      const startY = 80;

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
                          
                          {/* Coins Array Rendering (For Recursion/Memoization) */}
                          {(selectedOpId === 'recursion' || selectedOpId === 'memoization') && (
                              <div className="absolute flex flex-col items-center gap-12 w-full" style={{ top: `${startY}px`, left: '0', transform: 'translateY(-50%)' }}>
                                  <div className="flex gap-2 relative">
                                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400">coins[]</span>
                                      {st.coins.map((val: number, idx: number) => {
                                          let isActive = st.activeI === idx && !st.isSuccess;
                                          let isTaken = st.hlTake && st.activeI === idx;
                                          let isSkipped = st.hlSkip && st.activeI === idx;
                                          
                                          let bgClass = "bg-white border-slate-300 text-slate-600 shadow-sm";
                                          let scaleClass = "scale-100";

                                          if (isTaken) {
                                              bgClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl ring-4 ring-emerald-200 z-30";
                                              scaleClass = "scale-125";
                                          } else if (isSkipped) {
                                              bgClass = "bg-rose-100 border-rose-500 text-rose-900 shadow-xl ring-4 ring-rose-200 z-30";
                                              scaleClass = "scale-125 opacity-70";
                                          } else if (isActive) {
                                              bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                              scaleClass = "scale-125";
                                          }

                                          return (
                                              <div key={`coin-${idx}`} className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center font-mono font-black text-xl border-[2px] rounded-full transition-all duration-300 ${scaleClass} ${bgClass}`}>
                                                  <CircleDot size={20} className="absolute opacity-20"/>
                                                  <span className="relative z-10">{val}</span>
                                              </div>
                                          )
                                      })}
                                  </div>
                                  
                                  {/* Visual Knapsack Bag */}
                                  {st.picked && (
                                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg min-w-[300px] flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Coins Picked So Far (Sum: {st.targetAmount - st.remAmount})</span>
                                          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xl font-bold">
                                              {st.picked.map((coinVal: number, idx: number) => (
                                                  <div key={`bag-${idx}`} className="w-8 h-8 rounded-full border-2 border-amber-500 bg-amber-100 text-amber-800 flex items-center justify-center text-sm shadow-sm animate-in zoom-in">
                                                      {coinVal}
                                                  </div>
                                              ))}
                                              {st.picked.length === 0 && <span className="text-slate-300 italic text-sm">Bag is empty</span>}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          )}

                          {/* Render DP Array for Tabulation/Space Optimized */}
                          {(selectedOpId === 'tabulation' || selectedOpId === 'spaceOptimized') && st.dp && (
                              <div className="absolute flex flex-col items-center w-full" style={{ top: `${startY + 10}px` }}>
                                  
                                  {/* Tabulation 2D Grid */}
                                  {selectedOpId === 'tabulation' && (
                                      <div className="flex flex-col items-center w-full max-w-4xl overflow-x-auto pb-4">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm">dp[][] (2D Ways Grid)</span>
                                          
                                          <div className="flex flex-col gap-1 p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                                              <div className="flex gap-1 mb-1 items-center">
                                                  <div className="w-12 h-4 text-[8px] font-bold text-slate-400 text-right pr-2 uppercase">Amts</div>
                                                  {st.dp[0].map((_, c) => <div key={`hc-${c}`} className="w-8 flex justify-center text-[8px] font-mono font-bold text-sky-500">{c}</div>)}
                                              </div>
                                              {st.dp.map((rowArr: number[], r: number) => (
                                                  <div key={`dp-r-${r}`} className="flex gap-1 items-center">
                                                      <span className="w-12 text-right text-[10px] font-mono font-bold text-emerald-600 pr-2">
                                                          {r === 0 ? 'Init' : `c: ${st.coins[r-1]}`}
                                                      </span>
                                                      {rowArr.map((val: number, c: number) => {
                                                          let isUpdating = st.activeI === r && st.activeJ === c && !st.isSuccess && (st.hlTake || st.hlSkip);
                                                          let isTop = st.activeI === r + 1 && st.activeJ === c;
                                                          let isTakeSource = st.hlTake && st.activeI === r && st.takeIdx === c; // Note: row is r, because we reuse the coin!

                                                          let boxBg = val > 0 ? "bg-slate-700 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-400";
                                                          let zIndex = "z-0";
                                                          
                                                          if (isUpdating) {
                                                              boxBg = "bg-fuchsia-400 border-fuchsia-600 text-white ring-4 ring-fuchsia-200 scale-125 shadow-xl animate-pulse";
                                                              zIndex = "z-20";
                                                          } else if (isTop) {
                                                              boxBg = val > 0 ? "bg-sky-500 border-sky-600 text-white ring-4 ring-sky-200 scale-110 shadow-lg" : "bg-sky-100 border-sky-300 text-sky-700 ring-4 ring-sky-200 scale-110 shadow-lg";
                                                              zIndex = "z-10";
                                                          } else if (isTakeSource) {
                                                              boxBg = "bg-emerald-400 border-emerald-600 text-white ring-4 ring-emerald-200 scale-110 z-20 shadow-lg";
                                                              zIndex = "z-10";
                                                          }

                                                          return (
                                                              <div key={`dp-${r}-${c}`} className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-[10px] border-[2px] rounded-sm transition-all duration-300 ${boxBg} ${zIndex}`}>
                                                                  {val}
                                                              </div>
                                                          )
                                                      })}
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  )}

                                  {/* Space Optimized 1D Array */}
                                  {selectedOpId === 'spaceOptimized' && (
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-6 shadow-sm">dp[] (1D Array updating forwards!)</span>
                                          
                                          <div className="flex gap-1 p-4 bg-white rounded-2xl border border-slate-200 shadow-md relative">
                                              
                                              {/* Jump Arrow Overlay (Forwards) */}
                                              {st.hlCalcDp && st.takeIdx !== undefined && !st.isSuccess && (
                                                  <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-30 pointer-events-none" style={{ transform: 'translateY(-15px)' }}>
                                                      <defs>
                                                          <marker id="jumpArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                                              <path d="M 0 0 L 6 3 L 0 6 Z" fill="#10b981" />
                                                          </marker>
                                                      </defs>
                                                      <path 
                                                          d={`M ${st.takeIdx * 42 + 25} 15 Q ${((st.takeIdx + st.activeJ) / 2) * 42 + 25} -30 ${st.activeJ * 42 + 25} 10`} 
                                                          fill="none" 
                                                          stroke="#10b981" 
                                                          strokeWidth="3" 
                                                          strokeDasharray="4 4"
                                                          markerEnd="url(#jumpArrow)"
                                                          className="animate-pulse"
                                                      />
                                                  </svg>
                                              )}

                                              {st.dp.map((val: number, idx: number) => {
                                                  let isUpdating = st.hlCalcDp && st.activeJ === idx;
                                                  let isSource = st.hlCalcDp && st.takeIdx === idx;
                                                  
                                                  let boxBg = val > 0 ? "bg-slate-700 border-slate-800 text-white shadow-sm" : "bg-slate-50 border-slate-300 text-slate-400";
                                                  
                                                  if (isUpdating) {
                                                      boxBg = "bg-fuchsia-500 border-fuchsia-700 text-white ring-4 ring-fuchsia-200 scale-110 shadow-xl z-20 animate-pulse";
                                                  } else if (isSource) {
                                                      boxBg = "bg-emerald-500 border-emerald-700 text-white ring-4 ring-emerald-200 scale-110 z-20 shadow-lg";
                                                  }
                                                  
                                                  if (st.isSuccess && idx === st.targetAmount) {
                                                      boxBg = "bg-emerald-500 border-emerald-600 text-white scale-125 shadow-2xl ring-4 ring-emerald-200 z-30";
                                                  }

                                                  return (
                                                      <div key={`dp-${idx}`} className="flex flex-col items-center">
                                                          <span className={`text-[9px] font-mono mb-1 ${isUpdating || isSource ? 'text-fuchsia-600 font-black' : 'text-sky-500 font-bold'}`}>{idx}</span>
                                                          <div className={`w-10 h-10 flex flex-col items-center justify-center font-mono font-bold text-sm border-[2px] rounded-lg transition-all duration-300 ${boxBg}`}>
                                                              {val}
                                                          </div>
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                      </div>
                                  )}
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
                <CircleDot className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Coin Change II</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Unbounded Knapsack DP
                  </span>
                  <span>•</span>
                  <span>LeetCode 518</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><CircleDot size={28}/> Infinite Supply Validation</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>
                        <p>Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return <code>0</code>.</p>
                        <p>You may assume that you have an <strong>infinite number</strong> of each kind of coin.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> amount = 5, coins = [1,2,5]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">4</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">There are four ways to make up the amount:<br/>5=5<br/>5=2+2+1<br/>5=2+1+1+1<br/>5=1+1+1+1+1</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= coins.length &lt;= 300</li>
                            <li>1 &lt;= coins[i] &lt;= 5000</li>
                            <li>0 &lt;= amount &lt;= 5000</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ListTree size={16} className="text-rose-500"/> Direct Recursion</h4>
                        <p className="text-sm leading-relaxed">We recursively explore the search space. Because we have an infinite supply, when we "take" a coin, we stay on the same coin index so we can take it again! This makes the decision tree massive, leading to TLE if we don't cache.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Zap size={16} className={`text-${themeColor}-500`}/> The Unbounded Shift</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The crucial difference between this and Target Sum (0/1 Knapsack) is the iteration direction in the 1D DP. Because we want to reuse coins, we iterate <strong>forwards</strong> from <code>coin</code> to <code>amount</code>. This allows combinations to build upon combinations that <em>already used the current coin</em>!</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Coins Array (Max 5 items)</label>
                            <input type="text" value={coinsInput} onChange={(e) => setCoinsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="1, 2, 5" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Amount (&le; 20)</label>
                            <input type="text" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="5" />
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
                                <PartyPopper size={24}/> EVALUATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Successfully counted all valid coin combinations!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCalcTake || st.hlCalcDp || st.hlReturn || st.hlStore ? 'text-fuchsia-400' : (st.hlAdd || st.hlSub || st.hlTake || st.hlSkip ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><CircleDot size={14} className={`text-${themeColor}-500`}/> Dynamic Evaluation Visualizer</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Line-by-line breakdown of why Unbounded Knapsack differs from 0/1 Knapsack.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Approach 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-rose-500"/> 1. Brute Force (Recursion)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why don't we increment `i` when taking a coin?</strong> This is the hallmark of the Unbounded Knapsack problem. Because we have an infinite supply of each coin, if we decide to 'take' coin <code>i</code>, we might want to take it again! Therefore, our recursive call is <code>dfs(coins, i, amount - coins[i])</code>. We only increment <code>i</code> when we decide to 'skip' the coin and move to the next denomination.</p>
                        <p className="text-slate-800 font-bold bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 w-fit">Time: O(2^(A + N)) | Space: O(A)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This exponential tree is even larger than 0/1 Knapsack because we can stay on the same element multiple times. The depth of the tree can be as deep as `amount / min_coin`.</p>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 2. Memoization (Top-Down)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a 2D Array?</strong> The recursive state is defined by the current index <code>i</code> and the remaining <code>amount</code>. Since <code>amount</code> can never be negative in our valid paths (we return 0 if it drops below 0), we don't need any complex offset arrays like in Target Sum. A simple <code>Integer[coins.length][amount + 1]</code> perfectly captures every possible unique state.</p>
                        <p className="text-slate-800 font-bold bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 w-fit">Time: O(N * A) | Space: O(N * A)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Caching ensures we compute each (coin, amount) pair exactly once. Time is bounded by the grid size.</p>
                    </div>

                    {/* Approach 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-fuchsia-500"/> 3. Tabulation (Bottom-Up)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Notice the 'Take' transition:</strong> When building the 2D DP table, <code>dp[i][j]</code> represents the ways to make amount <code>j</code> using the first <code>i</code> coins. To skip the coin, we inherit <code>dp[i-1][j]</code>. But to TAKE the coin, we look at <code>dp[i][j - coin]</code>. Note that it is <code>dp[i]</code>, not <code>dp[i-1]</code>! We are looking at the <em>current</em> row, which already includes previous combinations that used this coin!</p>
                        <p className="text-slate-800 font-bold bg-fuchsia-100 px-3 py-1.5 rounded-lg border border-fuchsia-200 w-fit">Time: O(N * A) | Space: O(N * A)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This iterative approach removes call stack overhead but still allocates a heavy 2D matrix.</p>
                    </div>

                    {/* Approach 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 4. Space Optimized (1D Array)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why traverse FORWARDS?</strong> This is the critical "Aha!" moment. In 0/1 Knapsack (like Target Sum), we traverse the 1D array backwards to prevent reusing the same item. But here, we <strong>want</strong> to reuse the item! By traversing forwards (<code>j = coin to amount</code>), when we calculate <code>dp[j] += dp[j - coin]</code>, the value at <code>dp[j - coin]</code> might have <em>already been updated</em> during this exact loop! This is what mathematically models the infinite supply.</p>
                        <p className="text-slate-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">Time: O(N * A) | Space: O(A)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This is the globally optimal solution. It collapses the 2D matrix into a single 1D array, crushing memory requirements while maintaining perfectly linear iterative time.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is the quintessential Unbounded Knapsack problem. Interviewers are heavily testing if you understand the difference in the 1D array iteration direction compared to 0/1 Knapsack."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "In the 1D array optimization, why do we loop forwards instead of backwards?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we have an infinite supply of coins!"</p>
                            <p>In 0/1 Knapsack, we loop backwards so that `dp[j - weight]` relies on the state from the *previous* item. In Unbounded Knapsack, we loop forwards so that `dp[j - coin]` relies on the state of the *current* item being processed. This allows combinations to compound, correctly modeling the ability to reuse the exact same coin multiple times in a single combination."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if the outer loop was `amount` and the inner loop was `coins`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "That calculates permutations, not combinations."</p>
                            <p>If we reverse the loops (outer loop `amount`, inner loop `coins`), we are solving a different problem: 'Combination Sum IV' (LeetCode 377). In that setup, order matters (e.g., `1+2` is considered different from `2+1`). Our current loop structure (outer `coins`, inner `amount`) ensures we process coins sequentially, enforcing an ordered combination and preventing duplicate sets."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why is `dp[0] = 1`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It represents the empty set."</p>
                            <p>There is exactly one mathematical way to make an amount of 0: by choosing zero coins. This base case is fundamental. When we process a coin that exactly matches our target (e.g., `coin = 5`, `j = 5`), `dp[5] += dp[0]`. Since `dp[0]` is 1, it correctly increments the combination count by 1, registering that single coin as a valid configuration."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCalcTake || st.hlCalcDp || st.hlReturn || st.hlStore ? 'text-fuchsia-400' : (st.hlTake || st.hlSkip || st.hlTargetInit ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Coins Array</label>
                              <input type="text" value={coinsInput} onChange={(e) => setCoinsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="1, 2, 5" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Amount</label>
                              <input type="text" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="5" />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns > 0 ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-slate-500 shadow-[0_0_150px_rgba(148,163,184,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns > 0 ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.finalAns > 0 ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-slate-500/20 text-slate-500 ring-slate-500/10'}`}>
                                    {st.finalAns > 0 ? <PartyPopper size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully counted all valid combinations</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Ways</div>
                                    <div className={`font-mono text-5xl font-black leading-relaxed flex items-center gap-2 break-all ${st.finalAns > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>{st.finalAns}</div>
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