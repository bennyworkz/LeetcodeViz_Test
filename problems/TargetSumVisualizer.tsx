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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Target, Brackets, Smartphone, Globe, Grid, Crown, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square, Scale
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
    public int findTargetSumWays(int[] nums, int target) {
        return dfs(nums, 0, 0, target);
    }
    
    private int dfs(int[] nums, int i, int sum, int target) {
        if (i == nums.length) {
            return sum == target ? 1 : 0;
        }
        
        int add = dfs(nums, i + 1, sum + nums[i], target);
        int sub = dfs(nums, i + 1, sum - nums[i], target);
        
        return add + sub;
    }
}`,
    desc: "The Recursive Approach: At every single element in the array, we make a choice: either add the number (+), or subtract the number (-). We recursively branch into both universes. When we reach the end of the array, we check if our accumulated 'sum' perfectly matches our 'target'. Since we branch 2 ways at every single step, this generates an exponential O(2^N) state tree."
  },
  memoization: {
    id: 'memoization',
    title: '2. Memoization (Top-Down)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N * Sum) | Space: O(N * Sum)',
    theme: 'sky',
    code: `class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int totalSum = 0;
        for (int num : nums) totalSum += num;
        if (Math.abs(target) > totalSum) return 0;
        
        Integer[][] memo = new Integer[nums.length][2 * totalSum + 1];
        return dfs(nums, 0, 0, target, totalSum, memo);
    }
    
    private int dfs(int[] nums, int i, int sum, int target, int totalSum, Integer[][] memo) {
        if (i == nums.length) return sum == target ? 1 : 0;
        
        if (memo[i][sum + totalSum] != null) {
            return memo[i][sum + totalSum];
        }
        
        int add = dfs(nums, i + 1, sum + nums[i], target, totalSum, memo);
        int sub = dfs(nums, i + 1, sum - nums[i], target, totalSum, memo);
        
        return memo[i][sum + totalSum] = add + sub;
    }
}`,
    desc: "The Top-Down DP Approach: We introduce a 2D cache. Since the 'sum' can drop below 0 during subtraction, we cannot use negative array indices! We offset the sum by 'totalSum' to ensure all indices are positive. Before doing recursive work, we check if memo[i][sum + offset] exists. This prevents recalculating the same subproblems, shifting time from O(2^N) to O(N * Sum)."
  },
  tabulation: {
    id: 'tabulation',
    title: '3. Tabulation (Math Pivot)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(N * S1) | Space: O(N * S1)',
    theme: 'fuchsia',
    code: `class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int totalSum = 0;
        for (int num : nums) totalSum += num;
        
        if (Math.abs(target) > totalSum || (totalSum + target) % 2 != 0) return 0;
        int subsetSum = (totalSum + target) / 2;
        
        int[][] dp = new int[nums.length + 1][subsetSum + 1];
        dp[0][0] = 1;
        
        for (int i = 1; i <= nums.length; i++) {
            int num = nums[i - 1];
            for (int j = 0; j <= subsetSum; j++) {
                if (j >= num) {
                    dp[i][j] = dp[i - 1][j] + dp[i - 1][j - num];
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }
        return dp[nums.length][subsetSum];
    }
}`,
    desc: "The Mathematical Tabulation Approach: We completely redefine the problem! Let S1 be elements we add, S2 be elements we subtract. We know S1 - S2 = target and S1 + S2 = totalSum. Solving this system of equations yields: S1 = (target + totalSum) / 2. The problem is now a classic 0/1 Knapsack: 'How many subsets sum to exactly S1?' We build a 2D DP array iteratively where dp[i][j] stores the number of ways to hit sum 'j' using the first 'i' items."
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '4. Space Optimized (1D DP)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N * S1) | Space: O(S1)',
    theme: 'emerald',
    code: `class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int totalSum = 0;
        for (int num : nums) totalSum += num;
        
        if (Math.abs(target) > totalSum || (totalSum + target) % 2 != 0) return 0;
        int subsetSum = (totalSum + target) / 2;
        
        int[] dp = new int[subsetSum + 1];
        dp[0] = 1;
        
        for (int num : nums) {
            for (int j = subsetSum; j >= num; j--) {
                dp[j] = dp[j] + dp[j - num];
            }
        }
        return dp[subsetSum];
    }
}`,
    desc: "The Ultimate Optimization: In our Tabulation matrix, evaluating row 'i' ONLY requires values from the row immediately above it ('i - 1'). We can collapse the massive 2D matrix into a single 1D array of size S1 + 1! For each number, we iterate backwards from subsetSum down to 'num'. We update dp[j] += dp[j - num]. Iterating backwards is absolutely vital to prevent using the same number more than once in the subset."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|findTargetSumWays|nums|target|totalSum|num|length|dfs|sum|memo|n|dp|add|sub|i|j|subsetSum|Integer|Math|abs)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isPointer = ['nums', 'target', 'totalSum', 'num', 'memo', 'n', 'dp', 'add', 'sub', 'i', 'j', 'sum', 'subsetSum'].includes(part);
            const isMapCall = ['findTargetSumWays', 'length', 'dfs', 'abs'].includes(part);
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

export default function TargetSumVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [numsInput, setNumsInput] = useState('1, 1, 2, 1');
  const [targetInput, setTargetInput] = useState('1');
  
  const [baseNums, setBaseNums] = useState<number[]>([1, 1, 2, 1]);
  const [baseTarget, setBaseTarget] = useState<number>(1);

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
        let parsed = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0);
        let parsedTarget = parseInt(targetInput.trim(), 10);
        
        if (parsed.length === 0) parsed = [1, 1, 2, 1];
        if (isNaN(parsedTarget)) parsedTarget = 1;
        
        // Safety caps to prevent browser locking during recursion/2D rendering
        if (parsed.length > 5) parsed = parsed.slice(0, 5);
        
        const total = parsed.reduce((a, b) => a + b, 0);
        if (total > 20) parsed = [1, 1, 2, 1]; // Fallback if arrays get too huge for DP grid

        setBaseNums(parsed);
        setBaseTarget(parsedTarget);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
          setBaseNums([1, 1, 2, 1]);
          setBaseTarget(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [numsInput, targetInput, selectedOpId]);

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
    const nums = baseNums;
    const n = nums.length;
    const target = baseTarget;

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { nums, n, target, ...st } 
    });

    let totalSum = nums.reduce((a, b) => a + b, 0);

    if (selectedOpId === 'recursion') {
        add("Function Call", `public int findTargetSumWays(int[] nums, int target)`, 2, { hlInit: true });
        add("Start DFS", `return dfs(nums, 0, 0, target);\nInitiate recursion from index 0 with current sum 0.`, 3, { hlDfsCall: true });

        const dfs = (i: number, sum: number, signs: string[]) => {
            if (steps.length > 800) return 0; // Safety cap
            
            add("DFS Call", `private int dfs(int[] nums, int i=${i}, int sum=${sum}, ...)\nEvaluating index ${i} with running sum ${sum}.`, 6, { activeI: i, sum, signs: [...signs] });

            if (i === n) {
                let match = sum === target;
                add("Base Case Checked", `if (i == nums.length) return sum == target ? 1 : 0;\nReached end. Sum ${sum} ${match ? '==' : '!='} Target ${target}. Returning ${match ? 1 : 0}.`, 8, { activeI: i, sum, signs: [...signs], hlBase: true, isMatch: match });
                return match ? 1 : 0;
            }

            add("Branch: Addition (+)", `int add = dfs(nums, i + 1, sum + nums[i], target);\nEvaluating '+' timeline for nums[${i}] (${nums[i]}).`, 11, { activeI: i, sum, signs: [...signs, '+'], hlAdd: true, nextSum: sum + nums[i] });
            let addWays = dfs(i + 1, sum + nums[i], [...signs, '+']);

            add("Branch: Subtraction (-)", `int sub = dfs(nums, i + 1, sum - nums[i], target);\nEvaluating '-' timeline for nums[${i}] (${nums[i]}).`, 12, { activeI: i, sum, signs: [...signs, '-'], hlSub: true, nextSum: sum - nums[i] });
            let subWays = dfs(i + 1, sum - nums[i], [...signs, '-']);

            let totalWays = addWays + subWays;
            add("Return Accumulated Ways", `return add + sub;\nReturning combinations found: ${addWays} (+) + ${subWays} (-) = ${totalWays}.`, 14, { activeI: i, sum, signs: [...signs], hlReturn: true, addWays, subWays, totalWays });
            return totalWays;
        };

        let ans = dfs(0, 0, []);
        add("Execution Complete", `return dfs(...);`, 3, { isSuccess: true, finalAns: ans });

    } else if (selectedOpId === 'memoization') {
        add("Function Call", `public int findTargetSumWays(int[] nums, int target)`, 2, { hlInit: true });
        
        add("Calculate Sum", `int totalSum = 0;\nfor (int num : nums) totalSum += num;\nTotal sum is ${totalSum}.`, 4, { hlSum: true, totalSum });
        
        let impossible = Math.abs(target) > totalSum;
        add("Check Impossibility", `if (Math.abs(target) > totalSum) return 0;\nIs target (${target}) out of reachable bounds? (${impossible ? 'Yes' : 'No'})`, 5, { hlCheckBound: true, totalSum, impossible });
        
        if (impossible) {
            add("Out of Bounds", `Target exceeds maximum possible positive or negative sum.`, 5, { isSuccess: true, finalAns: 0, totalSum });
            return steps;
        }

        let memo: (number | null)[][] = Array.from({length: n}, () => new Array(2 * totalSum + 1).fill(null));
        add("Init Memo Cache", `Integer[][] memo = new Integer[nums.length][2 * totalSum + 1];\nAllocated 2D cache. The column index is offset by 'totalSum' to handle negative sums!`, 7, { hlMemoInit: true, memo: clone2D(memo), totalSum });

        add("Start DFS", `return dfs(nums, 0, 0, target, totalSum, memo);`, 8, { hlDfsCall: true, memo: clone2D(memo), totalSum });

        const dfs = (i: number, sum: number, signs: string[]): number => {
            if (steps.length > 1000) return 0;
            
            add("DFS Call", `private int dfs(..., int i=${i}, int sum=${sum}, ...)\nEntering state index=${i}, sum=${sum}.`, 11, { activeI: i, sum, memo: clone2D(memo), totalSum, signs: [...signs] });

            if (i === n) {
                let match = sum === target;
                add("Base Case", `if (i == nums.length) return sum == target ? 1 : 0;\nReached end. Sum ${sum} ${match ? '==' : '!='} Target ${target}.`, 12, { activeI: i, sum, memo: clone2D(memo), hlBase: true, isMatch: match, totalSum, signs: [...signs] });
                return match ? 1 : 0;
            }

            let cacheIdx = sum + totalSum;
            if (memo[i][cacheIdx] !== null) {
                add("Cache Hit", `if (memo[i][sum + totalSum] != null) return memo[i][sum + totalSum];\nCache Hit at offset index [${i}][${cacheIdx}]! Returning ${memo[i][cacheIdx]}.`, 15, { activeI: i, sum, hlCacheHit: true, memo: clone2D(memo), totalSum, signs: [...signs], cachedVal: memo[i][cacheIdx] });
                return memo[i][cacheIdx] as number;
            }

            add("Branch: Addition (+)", `int add = dfs(..., sum + nums[i], ...);`, 18, { activeI: i, sum, hlAdd: true, nextSum: sum + nums[i], memo: clone2D(memo), totalSum, signs: [...signs, '+'] });
            let addWays = dfs(i + 1, sum + nums[i], [...signs, '+']);

            add("Branch: Subtraction (-)", `int sub = dfs(..., sum - nums[i], ...);`, 19, { activeI: i, sum, hlSub: true, nextSum: sum - nums[i], memo: clone2D(memo), totalSum, signs: [...signs, '-'] });
            let subWays = dfs(i + 1, sum - nums[i], [...signs, '-']);

            let totalWays = addWays + subWays;
            memo[i][cacheIdx] = totalWays;
            add("Cache Store", `return memo[i][sum + totalSum] = add + sub;\nStoring ${totalWays} ways for state [${i}][${cacheIdx}] into cache.`, 21, { activeI: i, sum, hlStore: true, totalWays, memo: clone2D(memo), totalSum, signs: [...signs] });
            return totalWays;
        };

        let ans = dfs(0, 0, []);
        add("Execution Complete", `return dfs(...);`, 8, { isSuccess: true, finalAns: ans, memo: clone2D(memo), totalSum });

    } else if (selectedOpId === 'tabulation') {
        add("Function Call", `public int findTargetSumWays(int[] nums, int target)`, 2, { hlInit: true });
        
        add("Calculate Sum", `int totalSum = 0;\nfor (int num : nums) totalSum += num;\nTotal array sum is ${totalSum}.`, 4, { hlSum: true, totalSum });
        
        let badMath = Math.abs(target) > totalSum || (totalSum + target) % 2 !== 0;
        add("Mathematical Verification", `if (Math.abs(target) > totalSum || (totalSum + target) % 2 != 0)\nTo find Subset S1: S1 = (totalSum + target) / 2. This must be a clean, positive integer! Valid? ${badMath ? 'No' : 'Yes'}.`, 6, { hlMathCheck: true, totalSum, badMath });
        
        if (badMath) {
            add("Invalid Partition", `Subset math failed. Impossible to reach target.`, 6, { isSuccess: true, finalAns: 0, totalSum });
            return steps;
        }

        let subsetSum = (totalSum + target) / 2;
        add("Pivot to Subset Sum Problem", `int subsetSum = (totalSum + target) / 2;\nWe pivoted from '+' and '-' to simply finding the number of subsets that strictly sum to S1 = ${subsetSum}!`, 7, { hlSubsetSum: true, totalSum, subsetSum });

        let dp: number[][] = Array.from({length: n + 1}, () => new Array(subsetSum + 1).fill(0));
        add("Init DP Grid", `int[][] dp = new int[nums.length + 1][subsetSum + 1];\nAllocated 2D table representing items 0..N vs subset sum 0..S1.`, 9, { hlDpInit: true, dp: clone2D(dp), subsetSum });

        dp[0][0] = 1;
        add("Seed DP Base Case", `dp[0][0] = 1;\nThere is exactly 1 way to form a sum of 0 using 0 items: by picking nothing.`, 10, { hlSeed: true, dp: clone2D(dp), subsetSum });

        for (let i = 1; i <= n; i++) {
            let num = nums[i - 1];
            add("Outer Loop (Items)", `for (int i = 1; i <= nums.length; i++) { int num = nums[i - 1]; }\nProcessing item at index ${i-1} with value ${num}.`, 12, { activeI: i, activeNum: num, hlLoopI: true, dp: clone2D(dp), subsetSum });
            
            for (let j = 0; j <= subsetSum; j++) {
                add("Inner Loop (Sums)", `for (int j = 0; j <= subsetSum; j++)\nCalculating combinations to reach sum ${j}.`, 14, { activeI: i, activeNum: num, activeJ: j, hlLoopJ: true, dp: clone2D(dp), subsetSum });
                
                if (j >= num) {
                    let oldWays = dp[i - 1][j];
                    let addedWays = dp[i - 1][j - num];
                    dp[i][j] = oldWays + addedWays;
                    add("DP Accumulate (Take & Skip)", `dp[i][j] = dp[i-1][j] + dp[i-1][j-num];\nWe can reach sum ${j} by skipping item (had ${oldWays} ways) OR taking item (came from sum ${j-num} which had ${addedWays} ways). Total = ${dp[i][j]}.`, 16, { activeI: i, activeNum: num, activeJ: j, hlCalcTake: true, dp: clone2D(dp), subsetSum, takeIdx: j - num, oldWays, addedWays });
                } else {
                    dp[i][j] = dp[i - 1][j];
                    add("DP Inherit (Skip Only)", `dp[i][j] = dp[i-1][j];\nTarget sum ${j} is smaller than item ${num}. We can ONLY skip it. Inheriting ${dp[i][j]} ways from above.`, 18, { activeI: i, activeNum: num, activeJ: j, hlCalcSkip: true, dp: clone2D(dp), subsetSum });
                }
            }
        }
        
        add("Return Result", `return dp[nums.length][subsetSum];\nFinal answer rests at the bottom-right cell!`, 22, { isSuccess: true, finalAns: dp[n][subsetSum], dp: clone2D(dp), subsetSum });

    } else if (selectedOpId === 'spaceOptimized') {
        add("Function Call", `public int findTargetSumWays(int[] nums, int target)`, 2, { hlInit: true });
        
        add("Calculate Sum", `int totalSum = 0;\nfor (int num : nums) totalSum += num;`, 4, { hlSum: true, totalSum });
        
        let badMath = Math.abs(target) > totalSum || (totalSum + target) % 2 !== 0;
        if (badMath) {
            add("Invalid Target Math", `if (Math.abs(target) > totalSum || (totalSum + target) % 2 != 0) return 0;\nSubset constraint mathematically impossible.`, 6, { hlMathCheck: true, totalSum, badMath, isSuccess: true, finalAns: 0 });
            return steps;
        }

        let subsetSum = (totalSum + target) / 2;
        add("Pivot to Subset Sum Problem", `int subsetSum = (totalSum + target) / 2;\nTargeting a single subset with exactly sum ${subsetSum}.`, 7, { hlSubsetSum: true, totalSum, subsetSum });

        let dp: number[] = new Array(subsetSum + 1).fill(0);
        add("Init 1D DP Array", `int[] dp = new int[subsetSum + 1];\nAllocated 1D array to save space! DP tracks ways to reach sums 0..${subsetSum}.`, 9, { hlDpInit: true, dp: clone1D(dp), subsetSum });

        dp[0] = 1;
        add("Seed DP Base Case", `dp[0] = 1;\n1 way to reach sum 0.`, 10, { hlSeed: true, dp: clone1D(dp), subsetSum });

        for (let i = 0; i < n; i++) {
            let num = nums[i];
            add("Outer Loop (Items)", `for (int num : nums)\nProcessing item value ${num}.`, 12, { activeNum: num, activeI: i, hlLoopI: true, dp: clone1D(dp), subsetSum });

            for (let j = subsetSum; j >= num; j--) {
                add("Inner Backwards Loop", `for (int j = subsetSum; j >= num; j--)\nCalculating sum ${j} backwards to prevent reusing '${num}'.`, 13, { activeNum: num, activeI: i, activeJ: j, hlLoopJ: true, dp: clone1D(dp), subsetSum });
                
                let oldVal = dp[j];
                let adding = dp[j - num];
                dp[j] = dp[j] + dp[j - num];
                add("DP In-Place Accumulate", `dp[j] = dp[j] + dp[j - num];\nWays to reach ${j} = (previous ways ${oldVal}) + (ways to reach ${j-num}, which is ${adding}). New total: ${dp[j]}.`, 14, { activeNum: num, activeI: i, activeJ: j, hlCalcDp: true, dp: clone1D(dp), subsetSum, oldVal, adding, takeIdx: j - num });
            }
        }
        
        add("Return Result", `return dp[subsetSum];\nFinal combinations stored in the last slot!`, 18, { isSuccess: true, finalAns: dp[subsetSum], dp: clone1D(dp), subsetSum });
    }

    return steps;
  }, [baseNums, baseTarget, selectedOpId]);

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
      if (st.nums === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? (st.finalAns > 0 ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-400 ring-4 ring-slate-100') : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${st.finalAns > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {st.finalAns > 0 ? <Trophy size={16}/> : <XCircle size={16}/>} 
                          Total Valid Target Expressions
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full ${st.finalAns > 0 ? 'text-emerald-700 bg-emerald-100 border-emerald-400' : 'text-slate-600 bg-slate-100 border-slate-300'}`}>
                          {st.finalAns} Ways Found
                      </div>
                  </div>
              ) : selectedOpId === 'tabulation' || selectedOpId === 'spaceOptimized' ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Target S1 Sum</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlSubsetSum ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.subsetSum !== undefined ? st.subsetSum : '-'}
                          </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Processing Num</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoopI ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeNum !== undefined ? st.activeNum : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">Evaluating Sum (j)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoopJ || st.hlCalcTake || st.hlCalcDp ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeJ !== undefined ? st.activeJ : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> DP Ways (dp[j])</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlCalcTake || st.hlCalcDp ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.dp && st.activeJ !== undefined ? (selectedOpId === 'tabulation' ? st.dp[st.activeI][st.activeJ] : st.dp[st.activeJ]) : '-'}
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Target</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                              {st.target}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Index (i)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-50 border-sky-300 text-sky-700`}>
                              {st.activeI !== undefined ? st.activeI : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">Accumulated Sum</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlAdd || st.hlSub ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-md' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                              {st.sum !== undefined ? st.sum : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Returned Ways</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlReturn || st.hlStore ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.totalWays !== undefined ? st.totalWays : (st.res !== undefined ? st.res : '-')}
                          </div>
                      </div>
                  </div>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.nums === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 44;
      const nodeGap = 6;
      const totalSize = nodeWidth + nodeGap;
      
      const arrWidth = st.nums.length * totalSize;
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
                          
                          {/* Nums Array Rendering (For Recursion/Memoization) */}
                          {(selectedOpId === 'recursion' || selectedOpId === 'memoization') && (
                              <div className="absolute flex flex-col items-center gap-12 w-full" style={{ top: `${startY}px`, left: '0', transform: 'translateY(-50%)' }}>
                                  <div className="flex gap-2 relative">
                                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400">nums[]</span>
                                      {st.nums.map((val: number, idx: number) => {
                                          let isActive = st.activeI === idx && !st.isSuccess;
                                          let assignedSign = st.signs && st.signs[idx];
                                          
                                          let bgClass = "bg-white border-slate-300 text-slate-600 shadow-sm";
                                          let scaleClass = "scale-100";

                                          if (isActive) {
                                              bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                              scaleClass = "scale-125";
                                          } else if (assignedSign === '+') {
                                              bgClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl z-20";
                                              scaleClass = "scale-110";
                                          } else if (assignedSign === '-') {
                                              bgClass = "bg-rose-100 border-rose-500 text-rose-900 shadow-xl z-20";
                                              scaleClass = "scale-110";
                                          }

                                          return (
                                              <div key={`num-${idx}`} className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center font-mono font-black text-xl border-[2px] rounded-lg transition-all duration-300 ${scaleClass} ${bgClass}`}>
                                                  {assignedSign && <span className="absolute -top-3 -left-3 w-6 h-6 flex items-center justify-center bg-slate-800 text-white rounded-full text-sm z-50 animate-in zoom-in">{assignedSign}</span>}
                                                  {val}
                                              </div>
                                          )
                                      })}
                                  </div>
                                  
                                  {/* Visual Sum Accumulator */}
                                  {st.signs && (
                                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg min-w-[300px] flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Current Expression Evaluator</span>
                                          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xl font-bold">
                                              {st.signs.map((sign: string, idx: number) => (
                                                  <React.Fragment key={`exp-${idx}`}>
                                                      <span className={sign === '+' ? 'text-emerald-500' : 'text-rose-500'}>{sign}</span>
                                                      <span className="text-slate-700">{st.nums[idx]}</span>
                                                  </React.Fragment>
                                              ))}
                                              {st.signs.length > 0 && <span className="text-slate-400 mx-2">=</span>}
                                              {st.signs.length > 0 && <span className={`text-2xl ${st.isMatch ? 'text-emerald-500 font-black scale-125 transition-transform' : 'text-slate-800'}`}>{st.sum}</span>}
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
                                                  <div className="w-12 h-4 text-[8px] font-bold text-slate-400 text-right pr-2 uppercase">Items</div>
                                                  {st.dp[0].map((_, c) => <div key={`hc-${c}`} className="w-8 flex justify-center text-[8px] font-mono font-bold text-sky-500">{c}</div>)}
                                              </div>
                                              {st.dp.map((rowArr: number[], r: number) => (
                                                  <div key={`dp-r-${r}`} className="flex gap-1 items-center">
                                                      <span className="w-12 text-right text-[10px] font-mono font-bold text-emerald-600 pr-2">
                                                          {r === 0 ? 'Init' : `num ${st.nums[r-1]}`}
                                                      </span>
                                                      {rowArr.map((val: number, c: number) => {
                                                          let isUpdating = st.hlCalcTake && st.activeI === r && st.activeJ === c;
                                                          let isSkipping = st.hlCalcSkip && st.activeI === r && st.activeJ === c;
                                                          let isTop = (st.hlCalcTake || st.hlCalcSkip) && st.activeI === r + 1 && st.activeJ === c;
                                                          let isTakeSource = st.hlCalcTake && st.activeI === r + 1 && st.takeIdx === c;

                                                          let boxBg = val > 0 ? "bg-slate-700 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-400";
                                                          let zIndex = "z-0";
                                                          
                                                          if (isUpdating || isSkipping) {
                                                              boxBg = "bg-fuchsia-400 border-fuchsia-600 text-white ring-4 ring-fuchsia-200 scale-125 shadow-xl animate-pulse";
                                                              zIndex = "z-20";
                                                          } else if (isTop || isTakeSource) {
                                                              boxBg = val > 0 ? "bg-sky-500 border-sky-600 text-white ring-4 ring-sky-200 scale-110 shadow-lg" : "bg-sky-100 border-sky-300 text-sky-700 ring-4 ring-sky-200 scale-110 shadow-lg";
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
                                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-6 shadow-sm">dp[] (1D Array updating in-place backwards!)</span>
                                          
                                          <div className="flex gap-1 p-4 bg-white rounded-2xl border border-slate-200 shadow-md relative">
                                              
                                              {/* Jump Arrow Overlay */}
                                              {st.hlCalcDp && st.takeIdx !== undefined && !st.isSuccess && (
                                                  <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-30 pointer-events-none" style={{ transform: 'translateY(-15px)' }}>
                                                      <defs>
                                                          <marker id="jumpArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                                              <path d="M 0 0 L 6 3 L 0 6 Z" fill="#f43f5e" />
                                                          </marker>
                                                      </defs>
                                                      <path 
                                                          d={`M ${st.takeIdx * 42 + 25} 15 Q ${((st.takeIdx + st.activeJ) / 2) * 42 + 25} -30 ${st.activeJ * 42 + 25} 10`} 
                                                          fill="none" 
                                                          stroke="#f43f5e" 
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
                                                      boxBg = val > 0 ? "bg-sky-500 border-sky-700 text-white ring-4 ring-sky-200 scale-110 z-20 shadow-lg" : "bg-sky-100 border-sky-400 text-sky-800 ring-4 ring-sky-200 scale-110 z-20";
                                                  }
                                                  
                                                  if (st.isSuccess && idx === st.subsetSum) {
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
                <Target className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Target Sum</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      0/1 Knapsack Subset DP
                  </span>
                  <span>•</span>
                  <span>LeetCode 494</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Target size={28}/> Reaching the Goal</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an integer array <code>nums</code> and an integer <code>target</code>.</p>
                        <p>You want to build an expression out of nums by adding one of the symbols <code>'+'</code> and <code>'-'</code> before each integer in nums and then concatenate all the integers.</p>
                        <p>Return the number of different expressions that you can build, which evaluates to <code>target</code>.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [1,1,1,1,1], target = 3</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">5</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">There are 5 ways to assign symbols to make the sum of nums be target 3.<br/>-1 + 1 + 1 + 1 + 1 = 3<br/>+1 - 1 + 1 + 1 + 1 = 3<br/>+1 + 1 - 1 + 1 + 1 = 3<br/>+1 + 1 + 1 - 1 + 1 = 3<br/>+1 + 1 + 1 + 1 - 1 = 3</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= nums.length &lt;= 20</li>
                            <li>0 &lt;= nums[i] &lt;= 1000</li>
                            <li>0 &lt;= sum(nums[i]) &lt;= 1000</li>
                            <li>-1000 &lt;= target &lt;= 1000</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ListTree size={16} className="text-rose-500"/> Direct Recursion</h4>
                        <p className="text-sm leading-relaxed">The immediate thought is to literally try every combination. At each element, branch into two paths: one where you add it to a running sum, and one where you subtract it. When you reach the end of the array, check if your sum equals the target. This forms a massive binary tree of possibilities taking O(2^N) time.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Grid size={16} className={`text-${themeColor}-500`}/> DP Math Pivot</h4>
                        <p className="text-sm leading-relaxed text-slate-600">To achieve optimal Tabulation and Space Optimization, we use algebra! If S1 is the positive numbers and S2 is negative: S1 - S2 = target. We also know S1 + S2 = totalSum. Solving this gives S1 = (target + totalSum) / 2. The problem magically transforms from <code>+</code>/<code>-</code> decisions into a standard "Find subsets that sum exactly to S1" problem!</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Numbers Array (Max 8 items, Target &le; 20)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="1, 1, 2, 1" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Target</label>
                            <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="1" />
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
                                Successfully counted all valid target expressions!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCalcTake || st.hlCalcDp || st.hlReturn || st.hlStore ? 'text-fuchsia-400' : (st.hlAdd || st.hlSub || st.hlTargetInit || st.hlSubsetSum ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Target size={14} className={`text-${themeColor}-500`}/> Dynamic Evaluation Visualizer</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Line-by-line breakdown of why we shift from top-down recursion to 1D array subset counting.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Approach 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-rose-500"/> 1. Brute Force (Recursion)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why no arrays?</strong> We map the physical reality of the problem directly to the Call Stack memory. The problem says "assign a + or a -". So for every index <code>i</code>, we branch execution into <code>dfs(..., sum + nums[i])</code> and <code>dfs(..., sum - nums[i])</code>. We return 1 if we hit the target exactly at the end.</p>
                        <p className="text-slate-800 font-bold bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 w-fit">Time: O(2^N) | Space: O(N)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This is an unoptimized binary tree. It explores 2^N leaves. It will easily cause Time Limit Exceeded (TLE) for N &gt; 20.</p>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 2. Memoization (Top-Down)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why an Offset Array?</strong> Our recursive state is <code>(index, sum)</code>. We want to cache this in a 2D array. But wait! The <code>sum</code> can be negative because of subtraction! Arrays cannot have negative indices in Java. Since the maximum negative sum is <code>-totalSum</code>, we add an offset of <code>totalSum</code> to every sum. The cache index becomes <code>sum + totalSum</code>, ensuring it maps cleanly from <code>0</code> to <code>2 * totalSum</code>.</p>
                        <p className="text-slate-800 font-bold bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 w-fit">Time: O(N * Sum) | Space: O(N * Sum)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">By caching, we never evaluate the same (index, sum) twice. Time falls dramatically to O(N * Sum). The explicit O(N * Sum) memory block is required for the 2D array.</p>
                    </div>

                    {/* Approach 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-fuchsia-500"/> 3. Tabulation (Math Pivot)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a mathematical transformation?</strong> Managing negative indices with offsets in a bottom-up DP table is extremely messy. Instead, we use algebra to completely eliminate negative numbers! Let S1 be the subset of positive numbers, and S2 be the subset of negative numbers. We know:<br/>1. S1 - S2 = target<br/>2. S1 + S2 = totalSum<br/>Adding equations: 2 * S1 = target + totalSum, so S1 = (target + totalSum) / 2.<br/>The problem becomes: <strong>Find the number of subsets that sum strictly to positive S1!</strong></p>
                        <p className="text-slate-800 font-bold bg-fuchsia-100 px-3 py-1.5 rounded-lg border border-fuchsia-200 w-fit">Time: O(N * S1) | Space: O(N * S1)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">The DP state is now just positive integers: `dp[i][j] = dp[i-1][j] + dp[i-1][j-num]`. Pure, elegant 0/1 knapsack.</p>
                    </div>

                    {/* Approach 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 4. Space Optimized (1D Array)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why exactly a 1D Array?</strong> Once we pivoted the math to standard Subset Sum, the optimization is straightforward. To calculate row <code>i</code> in the DP array, we only look at row <code>i-1</code>. We declare a single 1D array <code>int[] dp</code> of size <code>subsetSum + 1</code>. As we loop <code>j</code> backwards from <code>subsetSum</code> down to <code>num</code>, we do <code>dp[j] += dp[j - num]</code>.</p>
                        <p className="text-slate-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">Time: O(N * S1) | Space: O(S1)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Time remains exactly the same. However, the memory footprint is slashed from the entire matrix down to just a single row matching the positive subset sum S1, achieving absolute optimal performance.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a masterpiece DP problem. Interviewers want to see if you can naturally write out the + and - recurrence, and then critically observe that a simple math trick transforms the entire messy state into standard 0/1 Knapsack."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "In the 1D Array optimization, why do we iterate the inner loop backwards?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent using the same number multiple times, ensuring it's 0/1 Knapsack."</p>
                            <p>If we iterate forwards, by the time we calculate <code>dp[j] = dp[j] + dp[j - num]</code>, the value at <code>j - num</code> might have already been updated by the <em>current</em> item in this exact loop! This allows an item to be picked an infinite number of times (Unbounded Knapsack). Iterating backwards guarantees we only read data generated from the previous item's loop iteration."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What does `(totalSum + target) % 2 != 0` check for?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It checks if finding a valid positive subset sum is mathematically impossible."</p>
                            <p>Since we deduced S1 = (totalSum + target) / 2, S1 represents a sum of elements from our original array. Since all our elements are integers, S1 MUST be an integer. If (totalSum + target) is an odd number, dividing by 2 yields a fraction. It's impossible to sum integers to a fraction, so we immediately return 0."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why is the top-down array size `[nums.length][2 * totalSum + 1]`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To safely map negative sums to positive array indices."</p>
                            <p>If we subtract heavily, our running sum could drop to <code>-totalSum</code>. If we add heavily, it could reach <code>+totalSum</code>. The entire range of possible sums is from <code>-totalSum</code> to <code>+totalSum</code>, which spans exactly <code>2 * totalSum + 1</code> discrete values. By defining the array this wide and caching at index <code>sum + totalSum</code>, the lowest possible value <code>-totalSum</code> maps cleanly to array index <code>0</code>."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCalcTake || st.hlCalcDp || st.hlReturn || st.hlStore ? 'text-fuchsia-400' : (st.hlAdd || st.hlSub || st.hlTargetInit || st.hlSubsetSum ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Numbers Array</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="1, 1, 2, 1" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target</label>
                              <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="1" />
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully counted all valid expressions</p>
                                
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