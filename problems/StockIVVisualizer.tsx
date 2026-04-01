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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Target, Brackets, Smartphone, Globe, Grid, Crown, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square, Scale, LineChart
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
    public int maxProfit(int k, int[] prices) {
        return dfs(prices, 0, 0, k);
    }
    
    private int dfs(int[] prices, int i, int holding, int k) {
        if (i == prices.length || k == 0) return 0;
        
        if (holding == 1) {
            int sell = prices[i] + dfs(prices, i + 1, 0, k - 1);
            int skip = dfs(prices, i + 1, 1, k);
            return Math.max(sell, skip);
        } else {
            int buy = -prices[i] + dfs(prices, i + 1, 1, k);
            int skip = dfs(prices, i + 1, 0, k);
            return Math.max(buy, skip);
        }
    }
}`,
    desc: "The Recursive Approach: We evaluate every single decision on every day. Our state is defined by 'i' (current day), 'holding' (0 or 1, whether we have a stock), and 'k' (transactions left). If we are holding, we can Sell or Skip. If we are not holding, we can Buy or Skip. Buying subtracts from our profit, selling adds to it. Branching 2 ways at every step creates an exponential O(2^N) time complexity, leading to Time Limit Exceeded."
  },
  memoization: {
    id: 'memoization',
    title: '2. Memoization (Top-Down)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N * K) | Space: O(N * K)',
    theme: 'sky',
    code: `class Solution {
    public int maxProfit(int k, int[] prices) {
        Integer[][][] memo = new Integer[prices.length][2][k + 1];
        return dfs(prices, 0, 0, k, memo);
    }
    
    private int dfs(int[] prices, int i, int hold, int remK, Integer[][][] memo) {
        if (i == prices.length || remK == 0) return 0;
        if (memo[i][hold][remK] != null) return memo[i][hold][remK];
        
        if (hold == 1) {
            int sell = prices[i] + dfs(prices, i + 1, 0, remK - 1, memo);
            int skip = dfs(prices, i + 1, 1, remK, memo);
            return memo[i][hold][remK] = Math.max(sell, skip);
        } else {
            int buy = -prices[i] + dfs(prices, i + 1, 1, remK, memo);
            int skip = dfs(prices, i + 1, 0, remK, memo);
            return memo[i][hold][remK] = Math.max(buy, skip);
        }
    }
}`,
    desc: "The Top-Down DP Approach: We declare a 3D cache array: memo[N][2][K+1]. Why 3D? Because our recursive state has 3 parameters! 'N' for the days, '2' for holding (0 or 1), and 'K+1' for transactions left. Before branching, we check if memo[i][hold][remK] exists. If so, we return it instantly. This collapses the exponential tree into exactly 2*N*K states, guaranteeing O(N * K) time."
  },
  tabulation: {
    id: 'tabulation',
    title: '3. Tabulation (Bottom-Up)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(N * K) | Space: O(N * K)',
    theme: 'fuchsia',
    code: `class Solution {
    public int maxProfit(int k, int[] prices) {
        int n = prices.length;
        if (n <= 1 || k == 0) return 0;
        
        int[][][] dp = new int[n + 1][2][k + 1];
        
        for (int i = n - 1; i >= 0; i--) {
            for (int t = 1; t <= k; t++) {
                
                int sell = prices[i] + dp[i + 1][0][t - 1];
                int skipSell = dp[i + 1][1][t];
                dp[i][1][t] = Math.max(sell, skipSell);
                
                int buy = -prices[i] + dp[i + 1][1][t];
                int skipBuy = dp[i + 1][0][t];
                dp[i][0][t] = Math.max(buy, skipBuy);
                
            }
        }
        return dp[0][0][k];
    }
}`,
    desc: "The Bottom-Up DP Approach: We invert the recursion. We build a 3D table 'dp[n+1][2][k+1]'. We loop backwards from the last day to day 0. For each day, we calculate the max profit for all states (t=1..k and hold=0,1) based solely on the values we already calculated for day 'i+1'. The answer for day 0, holding 0 stocks, with 'k' transactions available ends up at dp[0][0][k]. This removes recursive call stack overhead, but still uses O(N * K) space."
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '4. State Machine (Space Optimized)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N * K) | Space: O(K)',
    theme: 'emerald',
    code: `class Solution {
    public int maxProfit(int k, int[] prices) {
        if (prices.length <= 1 || k == 0) return 0;
        
        int[] buy = new int[k + 1];
        int[] sell = new int[k + 1];
        Arrays.fill(buy, Integer.MIN_VALUE);
        
        for (int price : prices) {
            for (int j = 1; j <= k; j++) {
                buy[j] = Math.max(buy[j], sell[j - 1] - price);
                sell[j] = Math.max(sell[j], buy[j] + price);
            }
        }
        
        return sell[k];
    }
}`,
    desc: "The Ultimate Optimization: Calculating day 'i' ONLY requires the values from day 'i+1'. Instead of a massive 3D grid, we can compress the entire state space down to two 1D arrays of size K+1: 'buy[]' and 'sell[]'. We iterate forwards through the prices, updating these arrays sequentially to form a continuous State Machine. For any transaction 'j', the max profit to buy is max(keep previous buy[j], or buy today using profit from sell[j-1]). This scales perfectly to any K and drops space complexity down to strictly O(K)!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|maxProfit|prices|dfs|holding|hold|k|sell|skip|buy|Math|max|memo|Integer|null|n|dp|length|buy1|sell1|buy2|sell2|MIN_VALUE|price|skipSell|skipBuy|Arrays|fill|remK|t|j)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'Arrays'].includes(part);
            const isPointer = ['prices', 'holding', 'hold', 'k', 'sell', 'skip', 'buy', 'memo', 'n', 'dp', 'buy1', 'sell1', 'buy2', 'sell2', 'price', 'skipSell', 'skipBuy', 'remK', 't', 'j'].includes(part);
            const isMapCall = ['maxProfit', 'length', 'dfs', 'max', 'fill'].includes(part);
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

export default function StockIVVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [pricesInput, setPricesInput] = useState('3, 2, 6, 5, 0, 3');
  const [kInput, setKInput] = useState('2');
  
  const [basePrices, setBasePrices] = useState<number[]>([3, 2, 6, 5, 0, 3]);
  const [baseK, setBaseK] = useState<number>(2);

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
        let parsed = pricesInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0);
        let parsedK = parseInt(kInput.trim(), 10);
        
        if (parsed.length === 0) parsed = [3, 2, 6, 5, 0, 3];
        if (isNaN(parsedK) || parsedK < 0) parsedK = 2;
        
        // Safety caps to prevent browser locking during recursion/DP rendering
        if (selectedOpId === 'recursion' && parsed.length > 8) parsed = parsed.slice(0, 8);
        else if (parsed.length > 15) parsed = parsed.slice(0, 15);
        
        if (parsedK > 6) parsedK = 6; // Max 6 transactions for UI visual sanity

        setBasePrices(parsed);
        setBaseK(parsedK);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
          setBasePrices([3, 2, 6, 5, 0, 3]);
          setBaseK(2);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [pricesInput, kInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone3D = (arr: any[][][]) => arr.map(mat => mat.map(row => [...row]));

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const prices = basePrices;
    const n = prices.length;
    const kLimit = baseK;

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { prices, n, kLimit, ...st } 
    });

    if (selectedOpId === 'recursion') {
        add("Function Call", `public int maxProfit(int k, int[] prices)`, 2, { hlInit: true });
        add("Start DFS", `return dfs(prices, 0, 0, k);\nInitiate recursion from day 0, holding 0, with ${kLimit} transactions left.`, 3, { hlDfsCall: true });

        const dfs = (i: number, hold: number, remK: number) => {
            if (steps.length > 800) return 0; // Safety cap
            
            add("DFS Call", `private int dfs(int[] prices, int i=${i}, int holding=${hold}, int k=${remK})\nEvaluating Day ${i}, Holding: ${hold}, Trans left: ${remK}.`, 6, { activeI: i, hold, k: remK });

            if (i === n || remK === 0) {
                add("Base Case", `if (i == prices.length || k == 0) return 0;\n${i === n ? 'End of days reached.' : 'Out of transactions.'} Returning 0.`, 7, { activeI: i, hold, k: remK, hlBase: true });
                return 0;
            }

            if (hold === 1) {
                add("Holding State", `if (holding == 1) { ... }\nWe have a stock. We can either SELL it today or SKIP.`, 9, { activeI: i, hold, k: remK, hlHoldCheck: true });
                
                add("Branch: Sell", `int sell = prices[i] + dfs(prices, i + 1, 0, k - 1);\nSelling at $${prices[i]} gives profit +${prices[i]}. Moving to day ${i+1}, holding 0, with ${remK-1} trans left.`, 10, { activeI: i, hold, k: remK, hlSell: true, nextI: i+1, nextHold: 0, nextK: remK-1 });
                let sellVal = prices[i] + dfs(i + 1, 0, remK - 1);

                add("Branch: Skip (Hold)", `int skip = dfs(prices, i + 1, 1, k);\nSkipping today. Moving to day ${i+1} still holding stock.`, 11, { activeI: i, hold, k: remK, hlSkipHold: true, nextI: i+1, nextHold: 1, nextK: remK });
                let skipVal = dfs(i + 1, 1, remK);

                let res = Math.max(sellVal, skipVal);
                add("Return Max (Hold)", `return Math.max(sell, skip);\nMax of Selling (${sellVal}) and Skipping (${skipVal}) is ${res}.`, 12, { activeI: i, hold, k: remK, hlReturnHold: true, res, sellVal, skipVal });
                return res;
            } else {
                add("Not Holding State", `} else { ... }\nWe don't have a stock. We can either BUY today or SKIP.`, 13, { activeI: i, hold, k: remK, hlNoHoldCheck: true });
                
                add("Branch: Buy", `int buy = -prices[i] + dfs(prices, i + 1, 1, k);\nBuying at $${prices[i]} costs -${prices[i]}. Moving to day ${i+1}, holding 1, with ${remK} trans left.`, 14, { activeI: i, hold, k: remK, hlBuy: true, nextI: i+1, nextHold: 1, nextK: remK });
                let buyVal = -prices[i] + dfs(i + 1, 1, remK);

                add("Branch: Skip (No Hold)", `int skip = dfs(prices, i + 1, 0, k);\nSkipping today. Moving to day ${i+1} still without stock.`, 15, { activeI: i, hold, k: remK, hlSkipNoHold: true, nextI: i+1, nextHold: 0, nextK: remK });
                let skipVal = dfs(i + 1, 0, remK);

                let res = Math.max(buyVal, skipVal);
                add("Return Max (No Hold)", `return Math.max(buy, skip);\nMax of Buying (${buyVal}) and Skipping (${skipVal}) is ${res}.`, 16, { activeI: i, hold, k: remK, hlReturnNoHold: true, res, buyVal, skipVal });
                return res;
            }
        };

        let ans = dfs(0, 0, kLimit);
        add("Execution Complete", `return dfs(...);`, 3, { isSuccess: true, finalAns: ans });

    } else if (selectedOpId === 'memoization') {
        add("Function Call", `public int maxProfit(int k, int[] prices)`, 2, { hlInit: true });
        
        let memo: (number | null)[][][] = Array.from({length: n}, () => Array.from({length: 2}, () => new Array(kLimit + 1).fill(null)));
        add("Init Memo Cache", `Integer[][][] memo = new Integer[prices.length][2][k + 1];\nAllocated 3D cache for Day [N], Holding [0,1], Trans Left [0..K].`, 3, { hlMemoInit: true, memoSize: 0 });
        
        add("Start DFS", `return dfs(prices, 0, 0, k, memo);`, 4, { hlDfsCall: true, memoSize: 0 });

        let cacheHits = 0;

        const dfs = (i: number, hold: number, remK: number): number => {
            if (steps.length > 1000) return 0;
            
            add("DFS Call", `private int dfs(..., int i=${i}, int hold=${hold}, int remK=${remK}, memo)`, 7, { activeI: i, hold, k: remK, memoSize: cacheHits });

            if (i === n || remK === 0) {
                add("Base Case", `if (i == prices.length || remK == 0) return 0;`, 8, { activeI: i, hold, k: remK, hlBase: true, memoSize: cacheHits });
                return 0;
            }

            if (memo[i][hold][remK] !== null) {
                cacheHits++;
                add("Cache Hit", `if (memo[i][hold][remK] != null) return memo[i][hold][remK];\nState [day ${i}][hold ${hold}][remK ${remK}] already computed! Returning ${memo[i][hold][remK]}.`, 9, { activeI: i, hold, k: remK, hlCacheHit: true, memoSize: cacheHits, cachedVal: memo[i][hold][remK] });
                return memo[i][hold][remK] as number;
            }

            if (hold === 1) {
                add("Branch: Sell", `int sell = prices[i] + dfs(prices, i + 1, 0, remK - 1, memo);`, 12, { activeI: i, hold, k: remK, hlSell: true, memoSize: cacheHits });
                let sellVal = prices[i] + dfs(i + 1, 0, remK - 1);

                add("Branch: Skip (Hold)", `int skip = dfs(prices, i + 1, 1, remK, memo);`, 13, { activeI: i, hold, k: remK, hlSkipHold: true, memoSize: cacheHits });
                let skipVal = dfs(i + 1, 1, remK);

                let res = Math.max(sellVal, skipVal);
                memo[i][hold][remK] = res;
                add("Cache & Return", `return memo[i][hold][remK] = Math.max(sell, skip);\nStored ${res} into cache.`, 14, { activeI: i, hold, k: remK, hlReturnHold: true, res, memoSize: cacheHits });
                return res;
            } else {
                add("Branch: Buy", `int buy = -prices[i] + dfs(prices, i + 1, 1, remK, memo);`, 16, { activeI: i, hold, k: remK, hlBuy: true, memoSize: cacheHits });
                let buyVal = -prices[i] + dfs(i + 1, 1, remK);

                add("Branch: Skip (No Hold)", `int skip = dfs(prices, i + 1, 0, remK, memo);`, 17, { activeI: i, hold, k: remK, hlSkipNoHold: true, memoSize: cacheHits });
                let skipVal = dfs(i + 1, 0, remK);

                let res = Math.max(buyVal, skipVal);
                memo[i][hold][remK] = res;
                add("Cache & Return", `return memo[i][hold][remK] = Math.max(buy, skip);\nStored ${res} into cache.`, 18, { activeI: i, hold, k: remK, hlReturnNoHold: true, res, memoSize: cacheHits });
                return res;
            }
        };

        let ans = dfs(0, 0, kLimit);
        add("Execution Complete", `return dfs(...);`, 4, { isSuccess: true, finalAns: ans, memoSize: cacheHits });

    } else if (selectedOpId === 'tabulation') {
        add("Function Call", `public int maxProfit(int k, int[] prices)`, 2, { hlInit: true });
        
        let dp: number[][][] = Array.from({length: n + 1}, () => Array.from({length: 2}, () => new Array(kLimit + 1).fill(0)));
        add("Init DP Grid", `int[][][] dp = new int[n + 1][2][k + 1];\nAllocated 3D table: Days (0..N) vs Hold (0,1) vs Trans (0..K). Initialized with 0s.`, 6, { hlDpInit: true, dp: clone3D(dp) });

        for (let i = n - 1; i >= 0; i--) {
            add("Outer Loop (Days Backwards)", `for (int i = n - 1; i >= 0; i--)\nProcessing Day ${i}.`, 8, { activeI: i, hlLoopI: true, dp: clone3D(dp) });
            
            for (let t = 1; t <= kLimit; t++) {
                add("Inner Loop (Transactions)", `for (int t = 1; t <= k; t++)\nEvaluating state for ${t} transactions left.`, 9, { activeI: i, activeK: t, hlLoopK: true, dp: clone3D(dp) });
                
                // Hold = 1
                let sellVal = prices[i] + dp[i + 1][0][t - 1];
                let skipSellVal = dp[i + 1][1][t];
                dp[i][1][t] = Math.max(sellVal, skipSellVal);
                add("DP Transition (Hold = 1)", `dp[i][1][t] = Math.max(sell, skipSell);\nIf holding: Max of Selling ($${prices[i]} + dp[${i+1}][0][${t-1}]=${dp[i+1][0][t-1]}) OR Skipping (dp[${i+1}][1][${t}]=${skipSellVal}). Value is ${dp[i][1][t]}.`, 13, { activeI: i, activeK: t, hlHoldTrans: true, dp: clone3D(dp), sellVal, skipSellVal, resHold: dp[i][1][t] });

                // Hold = 0
                let buyVal = -prices[i] + dp[i + 1][1][t];
                let skipBuyVal = dp[i + 1][0][t];
                dp[i][0][t] = Math.max(buyVal, skipBuyVal);
                add("DP Transition (Hold = 0)", `dp[i][0][t] = Math.max(buy, skipBuy);\nIf not holding: Max of Buying (-$${prices[i]} + dp[${i+1}][1][${t}]=${dp[i+1][1][t]}) OR Skipping (dp[${i+1}][0][${t}]=${skipBuyVal}). Value is ${dp[i][0][t]}.`, 17, { activeI: i, activeK: t, hlNoHoldTrans: true, dp: clone3D(dp), buyVal, skipBuyVal, resNoHold: dp[i][0][t] });
            }
        }
        
        add("Return Result", `return dp[0][0][k];\nFinal max profit at day 0, holding 0, with ${kLimit} transactions.`, 21, { isSuccess: true, finalAns: dp[0][0][kLimit], dp: clone3D(dp) });

    } else if (selectedOpId === 'spaceOptimized') {
        add("Function Call", `public int maxProfit(int k, int[] prices)`, 2, { hlInit: true });
        
        let buy = new Array(kLimit + 1).fill(-1000000); // UI visual safe MIN_VALUE
        let sell = new Array(kLimit + 1).fill(0);
        
        add("Init State Variables", `int[] buy = new int[k + 1];\nint[] sell = new int[k + 1];\nCollapsed the 3D DP array into two 1D arrays of size K+1!`, 6, { hlVarsInit: true, buy: [...buy], sell: [...sell] });

        for (let i = 0; i < n; i++) {
            let price = prices[i];
            add("Iterate Prices", `for (int price : prices)\nProcessing price $${price} on Day ${i}.`, 9, { activeI: i, activePrice: price, hlLoopI: true, buy: [...buy], sell: [...sell] });

            for (let j = 1; j <= kLimit; j++) {
                let oldBuy = buy[j];
                buy[j] = Math.max(buy[j], sell[j - 1] - price);
                add("Update buy[j]", `buy[j] = Math.max(buy[j], sell[j - 1] - price);\nMax of maintaining previous buy[${j}] (${oldBuy === -1000000 ? 'MIN' : oldBuy}) OR buying today using profit from sell[${j-1}] (${sell[j-1]} - $${price}) is ${buy[j]}.`, 11, { activeI: i, activeJ: j, activePrice: price, hlBuyJ: true, buy: [...buy], sell: [...sell], oldVal: oldBuy === -1000000 ? 'MIN' : oldBuy, newVal: sell[j-1] - price });

                let oldSell = sell[j];
                sell[j] = Math.max(sell[j], buy[j] + price);
                add("Update sell[j]", `sell[j] = Math.max(sell[j], buy[j] + price);\nMax of maintaining previous sell[${j}] (${oldSell}) OR selling today using cost from buy[${j}] (${buy[j]} + $${price}) is ${sell[j]}.`, 12, { activeI: i, activeJ: j, activePrice: price, hlSellJ: true, buy: [...buy], sell: [...sell], oldVal: oldSell, newVal: buy[j] + price });
            }
        }
        
        add("Return Result", `return sell[k];\nThe max profit across ${kLimit} transactions sits in sell[k]!`, 16, { isSuccess: true, finalAns: sell[kLimit], buy: [...buy], sell: [...sell] });
    }

    return steps;
  }, [basePrices, baseK, selectedOpId]);

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
      if (st.prices === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-emerald-600`}>
                          <Trophy size={16}/> 
                          Maximum Possible Profit
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-emerald-700 bg-emerald-100 border-emerald-400`}>
                          ${st.finalAns}
                      </div>
                  </div>
              ) : selectedOpId === 'spaceOptimized' ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Day</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-2xl transition-all duration-300 ${st.hlLoopI ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeI !== undefined ? st.activeI : '-'}
                          </div>
                      </div>
                      <ArrowRight size={20} className="text-slate-300" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">Price</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-2xl transition-all duration-300 ${st.hlLoopI ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                              {st.activePrice !== undefined ? `$${st.activePrice}` : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Trans (j)</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-2xl transition-all duration-300 ${st.hlBuyJ || st.hlSellJ ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                              {st.activeJ !== undefined ? st.activeJ : '-'}
                          </div>
                      </div>
                      <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1">Comparison Update</span>
                          <div className={`border-2 text-xl font-black px-4 py-2 rounded-2xl transition-all duration-300 ${st.hlBuyJ || st.hlSellJ ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 shadow-sm animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-transparent'}`}>
                              {st.oldVal !== undefined && st.newVal !== undefined ? `max(${st.oldVal}, ${st.newVal})` : '...'}
                          </div>
                      </div>
                  </div>
              ) : selectedOpId === 'tabulation' ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Day (i)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoopI ? 'bg-slate-200 border-slate-400 text-slate-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeI !== undefined ? st.activeI : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Trans (t)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoopK ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeK !== undefined ? st.activeK : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-emerald-500 mb-1 flex items-center gap-1">DP (Hold 1)</span>
                          <div className={`border-2 text-3xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlHoldTrans ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                              {st.resHold !== undefined ? `$${st.resHold}` : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-rose-500 mb-1 flex items-center gap-1">DP (Hold 0)</span>
                          <div className={`border-2 text-3xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlNoHoldTrans ? 'bg-rose-100 border-rose-500 text-rose-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                              {st.resNoHold !== undefined ? `$${st.resNoHold}` : '-'}
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Day (i)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                              {st.activeI !== undefined ? st.activeI : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Hold</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-50 border-sky-300 text-sky-700`}>
                              {st.hold !== undefined ? st.hold : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">Trans (k)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-amber-50 border-amber-300 text-amber-700`}>
                              {st.k !== undefined ? st.k : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Returned Profit</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlReturnHold || st.hlReturnNoHold || st.hlBase || st.hlCacheHit ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.res !== undefined ? `$${st.res}` : (st.cachedVal !== undefined ? `$${st.cachedVal}` : '-')}
                          </div>
                      </div>
                  </div>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.prices === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 44;
      const nodeGap = 6;
      const totalSize = nodeWidth + nodeGap;
      
      const arrWidth = st.prices.length * totalSize;
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
                          
                          {/* Prices Line Chart/Array Rendering */}
                          <div className="absolute flex flex-col items-center gap-2 w-full" style={{ top: `${startY}px`, left: '0', transform: 'translateY(-50%)' }}>
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400">prices[] (Daily Values)</span>
                              <div className="flex gap-2 relative">
                                  {st.prices.map((val: number, idx: number) => {
                                      let isActive = st.activeI === idx && !st.isSuccess;
                                      let isSell = st.hlSell && st.activeI === idx;
                                      let isBuy = st.hlBuy && st.activeI === idx;
                                      
                                      let bgClass = "bg-white border-slate-300 text-slate-600 shadow-sm";
                                      let scaleClass = "scale-100";

                                      if (isSell) {
                                          bgClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl ring-4 ring-emerald-200 z-30";
                                          scaleClass = "scale-125";
                                      } else if (isBuy) {
                                          bgClass = "bg-rose-100 border-rose-500 text-rose-900 shadow-xl ring-4 ring-rose-200 z-30";
                                          scaleClass = "scale-125";
                                      } else if (isActive) {
                                          bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                          scaleClass = "scale-125";
                                      }

                                      return (
                                          <div key={`price-${idx}`} className={`relative flex flex-col items-center transition-all duration-500 z-20`}>
                                              {isActive && <div className="absolute -top-10 flex flex-col items-center animate-bounce z-50">
                                                  <span className="text-[9px] font-black uppercase text-amber-700 tracking-widest bg-amber-100 px-1 rounded border border-amber-300 shadow-sm mb-0.5">Day {idx}</span>
                                                  <ArrowDown size={16} className="text-amber-500"/>
                                              </div>}
                                              <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex flex-col items-center justify-center font-mono font-black text-xl border-[2px] rounded-lg transition-all duration-300 ${scaleClass} ${bgClass}`}>
                                                  <DollarSign size={10} className="opacity-50 -mb-1"/>
                                                  {val}
                                              </div>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>

                          {/* Render Arrays for Space Optimized Approach below the prices array */}
                          {selectedOpId === 'spaceOptimized' && st.buy !== undefined && st.sell !== undefined && (
                              <div className="absolute flex flex-col items-center w-full max-w-full" style={{ top: `${startY + 120}px` }}>
                                  
                                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-6 shadow-sm">State Machine Arrays (buy[j], sell[j] for j=1..K)</span>
                                  
                                  <div className="flex gap-4 md:gap-8 items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-xl relative overflow-x-auto max-w-[90vw] scrollbar-thin scrollbar-thumb-slate-200 pb-8">
                                      
                                      {[...Array(st.kLimit).keys()].map(idx => {
                                          const j = idx + 1;
                                          const isActiveBuy = st.hlBuyJ && st.activeJ === j;
                                          const isActiveSell = st.hlSellJ && st.activeJ === j;
                                          const isFinalAns = st.isSuccess && j === st.kLimit;
                                          
                                          return (
                                              <React.Fragment key={`trans-${j}`}>
                                                  <div className="flex gap-4 items-center shrink-0">
                                                      {/* buy[j] */}
                                                      <div className={`flex flex-col items-center transition-all duration-300 ${isActiveBuy ? 'scale-110 -translate-y-2' : ''}`}>
                                                          <span className={`text-[10px] font-bold uppercase mb-2 ${isActiveBuy ? 'text-rose-500' : 'text-slate-400'}`}>buy[{j}]</span>
                                                          <div className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border-4 rounded-full font-mono font-black text-lg md:text-xl transition-colors ${isActiveBuy ? 'bg-rose-100 border-rose-500 text-rose-800 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                              {st.buy[j] === -1000000 ? '-∞' : st.buy[j]}
                                                          </div>
                                                      </div>
                                                      
                                                      <ArrowRight size={20} className="text-slate-300"/>

                                                      {/* sell[j] */}
                                                      <div className={`flex flex-col items-center transition-all duration-300 ${isActiveSell || isFinalAns ? 'scale-110 -translate-y-2' : ''}`}>
                                                          <span className={`text-[10px] font-bold uppercase mb-2 ${isActiveSell || isFinalAns ? 'text-emerald-500' : 'text-slate-400'}`}>sell[{j}]</span>
                                                          <div className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border-4 rounded-full font-mono font-black text-lg md:text-xl transition-colors ${isActiveSell ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-lg' : isFinalAns ? 'bg-emerald-500 border-emerald-600 text-white shadow-2xl ring-4 ring-emerald-200 scale-125' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                              {st.sell[j]}
                                                          </div>
                                                      </div>
                                                  </div>
                                                  {j < st.kLimit && <div className="h-16 w-px bg-slate-200 shrink-0"></div>}
                                              </React.Fragment>
                                          );
                                      })}

                                  </div>
                              </div>
                          )}

                          {/* Render Tabulation Grid */}
                          {selectedOpId === 'tabulation' && st.dp && (
                              <div className="absolute flex flex-col items-center w-full max-w-[90vw]" style={{ top: `${startY + 100}px` }}>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-4 shadow-sm">dp[days][hold][k] (Layered 3D State)</span>
                                  
                                  <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 max-w-full scrollbar-thin scrollbar-thumb-slate-300">
                                      {/* Hold = 0 Grid */}
                                      <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md border border-slate-200 shrink-0">
                                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-2">Holding = 0 (No Stock)</span>
                                          <div className="flex gap-1 mb-1">
                                              <div className="w-10 text-right pr-2 text-[8px] font-bold text-slate-400 uppercase">Day</div>
                                              {[...Array(st.kLimit + 1).keys()].map((k) => <div key={`klabel0-${k}`} className="w-8 text-center text-[8px] font-bold text-slate-400">k={k}</div>)}
                                          </div>
                                          {st.dp.slice(0, st.n).map((dayStates: any[][], dIdx: number) => (
                                              <div key={`dph0-${dIdx}`} className="flex gap-1 mb-1 items-center">
                                                  <span className="w-10 text-right pr-2 font-mono text-[10px] text-slate-500">d:{dIdx}</span>
                                                  {[...Array(st.kLimit + 1).keys()].map((k) => {
                                                      let val = dayStates[0][k];
                                                      let isUpdating = st.hlNoHoldTrans && st.activeI === dIdx && st.activeK === k;
                                                      let isSource = st.hlHoldTrans && st.activeI === dIdx - 1 && st.activeK === k + 1; // sell reading from k-1

                                                      let boxBg = val > 0 ? "bg-slate-700 text-white border-slate-800" : "bg-slate-50 text-slate-400 border-slate-200";
                                                      if (isUpdating) boxBg = "bg-fuchsia-400 text-white border-fuchsia-600 scale-110 shadow-lg z-20 animate-pulse ring-2 ring-fuchsia-200";
                                                      
                                                      if (st.isSuccess && dIdx === 0 && k === st.kLimit) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-125 shadow-xl ring-4 ring-emerald-200 z-30";

                                                      return (
                                                          <div key={`h0k${k}`} className={`w-8 h-6 flex items-center justify-center font-mono text-[9px] font-bold rounded border transition-all duration-300 ${boxBg}`}>
                                                              {val}
                                                          </div>
                                                      )
                                                  })}
                                              </div>
                                          ))}
                                      </div>

                                      {/* Hold = 1 Grid */}
                                      <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md border border-slate-200 shrink-0">
                                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-2">Holding = 1 (Have Stock)</span>
                                          <div className="flex gap-1 mb-1">
                                              <div className="w-10 text-right pr-2 text-[8px] font-bold text-slate-400 uppercase">Day</div>
                                              {[...Array(st.kLimit + 1).keys()].map((k) => <div key={`klabel1-${k}`} className="w-8 text-center text-[8px] font-bold text-slate-400">k={k}</div>)}
                                          </div>
                                          {st.dp.slice(0, st.n).map((dayStates: any[][], dIdx: number) => (
                                              <div key={`dph1-${dIdx}`} className="flex gap-1 mb-1 items-center">
                                                  <span className="w-10 text-right pr-2 font-mono text-[10px] text-slate-500">d:{dIdx}</span>
                                                  {[...Array(st.kLimit + 1).keys()].map((k) => {
                                                      let val = dayStates[1][k];
                                                      let isUpdating = st.hlHoldTrans && st.activeI === dIdx && st.activeK === k;
                                                      
                                                      let boxBg = val !== 0 ? "bg-slate-700 text-white border-slate-800" : "bg-slate-50 text-slate-400 border-slate-200";
                                                      if (isUpdating) boxBg = "bg-fuchsia-400 text-white border-fuchsia-600 scale-110 shadow-lg z-20 animate-pulse ring-2 ring-fuchsia-200";

                                                      return (
                                                          <div key={`h1k${k}`} className={`w-8 h-6 flex items-center justify-center font-mono text-[9px] font-bold rounded border transition-all duration-300 ${boxBg}`}>
                                                              {val}
                                                          </div>
                                                      )
                                                  })}
                                              </div>
                                          ))}
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
                <LineChart className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Best Time to Buy and Sell Stock IV</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Generalized K-State Machine
                  </span>
                  <span>•</span>
                  <span>LeetCode 188</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><LineChart size={28}/> Maximize K Transactions</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an integer array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i</code>th day, and an integer <code>k</code>.</p>
                        <p>Find the maximum profit you can achieve. You may complete <strong>at most <code>k</code> transactions</strong>: i.e. you may buy at most <code>k</code> times and sell at most <code>k</code> times.</p>
                        <p className="italic">Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> k = 2, prices = [2,4,1]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">2</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> k = 2, prices = [3,2,6,5,0,3]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">7</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4.<br/>Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>0 &lt;= k &lt;= 100</li>
                            <li>0 &lt;= prices.length &lt;= 1000</li>
                            <li>0 &lt;= prices[i] &lt;= 1000</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ListTree size={16} className="text-rose-500"/> The 3D State Problem</h4>
                        <p className="text-sm leading-relaxed">If we use standard DP, our state is determined by 3 factors: Which day is it? Do we hold a stock? How many transactions do we have left? This naturally maps to a 3D array <code>dp[N][2][K]</code>. This takes $O(N \times K)$ time and $O(N \times K)$ space, which scales decently but is heavy on memory.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Zap size={16} className={`text-${themeColor}-500`}/> The State Machine Array</h4>
                        <p className="text-sm leading-relaxed text-slate-600">Instead of an N-sized array, realize we only move through K distinct phases sequentially: Buy 1 $\rightarrow$ Sell 1 $\rightarrow \dots \rightarrow$ Buy K $\rightarrow$ Sell K. We can compress the entire 3D DP into just two 1D arrays `buy[k+1]` and `sell[k+1]` and iterate through the prices exactly once. This brilliant generalization drops space to $O(K)$!</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Prices Array</label>
                            <input type="text" value={pricesInput} onChange={(e) => setPricesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="3, 2, 6, 5, 0, 3" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>K (Max Trans)</label>
                            <input type="text" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="2" />
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
                                Successfully calculated maximum profit!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlBuyJ || st.hlSellJ ? 'text-fuchsia-400' : (st.hlBuy || st.hlSell || st.hlLoopJ ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><LineChart size={14} className={`text-${themeColor}-500`}/> Dynamic Evaluation Visualizer</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Line-by-line breakdown of why we shift from 3D array DP to generalized K-State Machine Arrays.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Approach 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-rose-500"/> 1. Brute Force (Recursion)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why no arrays?</strong> We map the physical reality of the problem directly to the Call Stack. Every day, if we have a stock, we branch into <code>Sell</code> or <code>Skip</code>. If we don't, we branch into <code>Buy</code> or <code>Skip</code>. We keep doing this until we run out of days or hit our K transaction limit.</p>
                        <p className="text-slate-800 font-bold bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 w-fit">Time: O(2^N) | Space: O(N)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Without memory, we evaluate the exact same (day, holding, transactions) states exponentially. This is guaranteed to cause Time Limit Exceeded (TLE).</p>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 2. Memoization (Top-Down)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a 3D Array?</strong> Our recursive state is uniquely defined by three specific variables: the current day <code>i</code>, whether we are holding a stock <code>hold</code> (0 or 1), and how many transactions we have left <code>k</code>. Therefore, we need an <code>Integer[][][] memo</code> array of size <code>[N][2][K+1]</code> to properly cache results and prevent duplicate branching!</p>
                        <p className="text-slate-800 font-bold bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 w-fit">Time: O(N * K) | Space: O(N * K)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">By caching, we never evaluate the same state twice. Time falls dramatically to $O(N \times K)$. Space is explicitly $O(N \times 2 \times K)$ for the 3D cache array.</p>
                    </div>

                    {/* Approach 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-fuchsia-500"/> 3. Tabulation (Bottom-Up)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why loop backwards?</strong> When building the 3D DP table iteratively, computing day <code>i</code> requires the optimal future choices from day <code>i + 1</code>. Geometrically, this means computing row <code>i</code> requires the row below it to be finished! Therefore, the outer loop MUST iterate <code>i</code> backwards from <code>N-1</code> down to <code>0</code>.</p>
                        <p className="text-slate-800 font-bold bg-fuchsia-100 px-3 py-1.5 rounded-lg border border-fuchsia-200 w-fit">Time: O(N * K) | Space: O(N * K)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This avoids the recursive call stack but still uses a full 3D array in memory.</p>
                    </div>

                    {/* Approach 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 4. Space Optimized (State Machine Arrays)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why arrays instead of 4 variables?</strong> In "Stock III", K was fixed at 2, so we could hardcode <code>buy1, sell1, buy2, sell2</code>. Since K is now variable, we must use arrays: <code>buy[K+1]</code> and <code>sell[K+1]</code>.</p>
                        <p className="text-slate-600 leading-relaxed">At any given day, our max profit to execute the $j$-th buy depends ONLY on our profit from the $(j-1)$-th sell! We iterate forwards through the prices, updating these arrays sequentially to form a continuous K-level State Machine: <code>buy[j] = max(buy[j], sell[j-1] - price)</code>. This eliminates the 3D array entirely.</p>
                        <p className="text-slate-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">Time: O(N * K) | Space: O(K)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This is the pinnacle of Stock DP optimization, crushing memory down to just two 1D arrays of size K.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is the generalized extension of Stock III. Interviewers want to see that you understand how to transition from hardcoded states (buy1, sell1) to dynamic array-based states (buy[j], sell[j]) seamlessly."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "In the State Machine solution, why is the `buy` array initialized to `Integer.MIN_VALUE` instead of `0`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because buying a stock represents a mathematical loss (negative profit)."</p>
                            <p>If we initialized <code>buy[j] = 0</code>, and the first stock price is $10, <code>Math.max(0, -10)</code> would choose 0. This implies we somehow bought a stock without spending money! By initializing it to negative infinity, the first price we evaluate will always successfully set <code>buy[j] = -price</code>."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if K is very large, like `K &gt;= N / 2`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It degrades into the 'Infinite Transactions' problem (Stock II)."</p>
                            <p>If K is greater than or equal to half the number of days, the transaction limit effectively vanishes because you can't logically execute more than $N/2$ profitable buy-sell pairs anyway. In production code, you can write an <code>if (k &gt;= n/2)</code> check to bypass the arrays and just do a greedy <code>O(N)</code> peak-valley accumulation to save overhead."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "In the inner loop, doesn't updating `buy[j]` right before `sell[j]` mean we might buy and sell on the exact same day?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it's mathematically harmless."</p>
                            <p>If we buy and sell on the same day, the profit for that specific transaction is <code>-price + price = 0</code>. This effectively acts as a 'Skip' operation. It will never override a legitimately profitable transaction from previous days. It simply allows the sequence of states to flow cleanly without needing to clone arrays."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlBuyJ || st.hlSellJ || st.hlHoldTrans || st.hlNoHoldTrans ? 'text-fuchsia-400' : (st.hlBuy || st.hlSell ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Prices Array</label>
                              <input type="text" value={pricesInput} onChange={(e) => setPricesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="3, 2, 6, 5, 0, 3" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>K</label>
                              <input type="text" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="2" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully calculated max profit</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Answer</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2 break-all">${st.finalAns}</div>
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