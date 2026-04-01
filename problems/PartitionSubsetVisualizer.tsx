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
  Binary, CircleDashed, CheckSquare, PlusSquare, 
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Combine, Dices, BoxSelect, ArrowDownUp, Maximize2, Variable,
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Target, Brackets, Smartphone, Globe, Map, Grid, Crown, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square, Scale
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
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;
        if (sum % 2 != 0) return false;
        
        return dfs(nums, nums.length - 1, sum / 2);
    }
    
    private boolean dfs(int[] nums, int i, int target) {
        if (target == 0) return true;
        if (i == 0) return nums[0] == target;
        
        boolean notTake = dfs(nums, i - 1, target);
        boolean take = false;
        if (target >= nums[i]) {
            take = dfs(nums, i - 1, target - nums[i]);
        }
        
        return take || notTake;
    }
}`,
    desc: "The Recursive Approach: A classic 0/1 Knapsack brute force. To partition the array into two equal subsets, the total sum MUST be even. If it's even, our goal is to find a single subset that sums exactly to (total_sum / 2). At every element, we have two choices: TAKE it or NOT TAKE it. We recursively branch out both possibilities. If any branch hits exactly 0 remaining target, it returns true! Without caching, this overlapping branching takes exponential O(2^n) time."
  },
  memoization: {
    id: 'memoization',
    title: '2. Memoization (Top-Down)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N * Target) | Space: O(N * Target)',
    theme: 'sky',
    code: `class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;
        if (sum % 2 != 0) return false;
        
        int target = sum / 2;
        Boolean[][] memo = new Boolean[nums.length][target + 1];
        return dfs(nums, nums.length - 1, target, memo);
    }
    
    private boolean dfs(int[] nums, int i, int target, Boolean[][] memo) {
        if (target == 0) return true;
        if (i == 0) return nums[0] == target;
        if (memo[i][target] != null) return memo[i][target];
        
        boolean notTake = dfs(nums, i - 1, target, memo);
        boolean take = false;
        if (target >= nums[i]) {
            take = dfs(nums, i - 1, target - nums[i], memo);
        }
        
        return memo[i][target] = take || notTake;
    }
}`,
    desc: "The Top-Down DP Approach: We introduce a 2D cache array 'memo'. Why 2D? Because the recursive state is uniquely defined by two changing parameters: the current array index 'i' and the remaining 'target' sum. Before executing the expensive take/not-take branching, we check if memo[i][target] is not null. If it exists, we instantly return it! This guarantees we only solve each subproblem once, dropping time complexity to O(N * Target)."
  },
  tabulation: {
    id: 'tabulation',
    title: '3. Tabulation (Bottom-Up)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(N * Target) | Space: O(N * Target)',
    theme: 'fuchsia',
    code: `class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;
        if (sum % 2 != 0) return false;
        
        int target = sum / 2;
        int n = nums.length;
        boolean[][] dp = new boolean[n][target + 1];
        
        if (nums[0] <= target) dp[0][nums[0]] = true;
        for (int i = 0; i < n; i++) dp[i][0] = true;
        
        for (int i = 1; i < n; i++) {
            for (int j = 1; j <= target; j++) {
                boolean notTake = dp[i - 1][j];
                boolean take = false;
                if (j >= nums[i]) take = dp[i - 1][j - nums[i]];
                
                dp[i][j] = take || notTake;
            }
        }
        return dp[n - 1][target];
    }
}`,
    desc: "The Bottom-Up DP Approach: We build the solution iteratively using a 2D 'dp' grid, avoiding recursion entirely. dp[i][j] answers the question: 'Can we achieve sum j using a subset of the items from index 0 to i?' For each cell, the answer is true if we could achieve sum j without the current item (dp[i-1][j]) OR if we could achieve the remainder sum (j - nums[i]) using the previous items. This perfectly models the knapsack state transitions."
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '4. Space Optimized (1D DP)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N * Target) | Space: O(Target)',
    theme: 'emerald',
    code: `class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;
        if (sum % 2 != 0) return false;
        
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        
        for (int num : nums) {
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        
        return dp[target];
    }
}`,
    desc: "The Ultimate Optimization: We completely drop the 2D grid! Notice that in Tabulation, calculating row 'i' ONLY requires values from row 'i-1'. We can compress this into a single 1D array 'dp' of size (target + 1). As we process each 'num', we iterate backwards from 'target' down to 'num'. dp[j] becomes true if dp[j - num] is already true! We MUST iterate backwards so we don't accidentally reuse the same 'num' multiple times in the same step. Memory goes from O(N * Target) to strictly O(Target)!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|canPartition|nums|sum|num|length|dfs|target|memo|n|dp|notTake|take|i|j)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math'].includes(part);
            const isPointer = ['nums', 'sum', 'num', 'target', 'memo', 'n', 'dp', 'notTake', 'take', 'i', 'j'].includes(part);
            const isMapCall = ['canPartition', 'length', 'dfs'].includes(part);
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

export default function PartitionSubsetVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [numsInput, setNumsInput] = useState('1, 5, 11, 5');
  const [baseNums, setBaseNums] = useState<number[]>([1, 5, 11, 5]);

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
        let parsed = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
        
        if (parsed.length === 0) {
            parsed = [1, 5, 11, 5];
        }
        
        // Cap max size and max sum to prevent UI overload
        if (parsed.length > 8) parsed = parsed.slice(0, 8);
        
        // If total sum > 30, scale it down for UI bounds
        const total = parsed.reduce((a, b) => a + b, 0);
        if (total > 40) {
            parsed = [1, 5, 11, 5]; // Default back if too huge to render DP columns safely
        }

        setBaseNums(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
          setBaseNums([1, 5, 11, 5]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [numsInput, selectedOpId]);

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
    const nums = baseNums;
    const n = nums.length;

    const clone2D = (arr: any[][]) => arr.map(row => [...row]);
    const clone1D = (arr: any[]) => [...arr];

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { nums, n, ...st } 
    });

    let totalSum = nums.reduce((a, b) => a + b, 0);

    if (selectedOpId === 'recursion') {
        add("Function Call", `public boolean canPartition(int[] nums)`, 2, { hlInit: true });

        add("Calculate Sum", `int sum = 0;\nfor (int num : nums) sum += num;\nTotal sum of array elements is ${totalSum}.`, 4, { hlSum: true, totalSum });

        let isOdd = totalSum % 2 !== 0;
        add("Check Parity", `if (sum % 2 != 0) return false;\nIs ${totalSum} odd? (${isOdd ? 'Yes' : 'No'})`, 5, { hlParity: true, totalSum, isOdd });
        
        if (isOdd) {
            add("Odd Sum Exit", `Sum is odd. It is mathematically impossible to divide into two equal integers.`, 5, { hlReturnFalse: true, totalSum, isSuccess: true, finalAns: false });
            return steps;
        }

        let target = totalSum / 2;
        add("Target Identified", `return dfs(nums, nums.length - 1, sum / 2);\nWe must find a subset that sums perfectly to ${target}. Starting DFS from last element.`, 7, { hlDfsCall: true, totalSum, target });

        const dfs = (i: number, currTarget: number): boolean => {
            if (steps.length > 800) return false; // Safety

            add("DFS Call", `private boolean dfs(int[] nums, int i=${i}, int target=${currTarget})`, 10, { activeI: i, currTarget, totalSum, target });

            if (currTarget === 0) {
                add("Base Case: Zero Target", `if (target == 0) return true;\nWe hit exactly 0 remaining target! Subset found!`, 11, { activeI: i, currTarget, totalSum, target, hlBaseZero: true });
                return true;
            }
            if (i === 0) {
                let matchesFirst = nums[0] === currTarget;
                add("Base Case: First Element", `if (i == 0) return nums[0] == target;\nWe are at the last element. Does ${nums[0]} == ${currTarget}? (${matchesFirst})`, 12, { activeI: i, currTarget, totalSum, target, hlBaseFirst: true, isMatch: matchesFirst });
                return matchesFirst;
            }

            add("Branch: Not Take", `boolean notTake = dfs(nums, i - 1, target);\nExploring the timeline where we DO NOT pick ${nums[i]}. Target remains ${currTarget}.`, 14, { activeI: i, currTarget, totalSum, target, hlNotTake: true, nextI: i-1 });
            let notTake = dfs(i - 1, currTarget);

            if (notTake) {
                 add("Early Return (Not Take Works)", `take || notTake;\nSince 'notTake' found a valid subset, we return true immediately!`, 20, { activeI: i, currTarget, totalSum, target, hlReturn: true, res: true });
                 return true;
            }

            let take = false;
            add("Check Cap for Take", `if (target >= nums[i])\nCan we afford to take ${nums[i]}? Remaining target is ${currTarget}. (${currTarget >= nums[i] ? 'Yes' : 'No'})`, 16, { activeI: i, currTarget, totalSum, target, hlCheckTake: true });
            
            if (currTarget >= nums[i]) {
                add("Branch: Take", `take = dfs(nums, i - 1, target - nums[i]);\nExploring timeline where we DO pick ${nums[i]}. New target becomes ${currTarget - nums[i]}.`, 17, { activeI: i, currTarget, totalSum, target, hlTake: true, nextI: i-1, newTarget: currTarget - nums[i] });
                take = dfs(i - 1, currTarget - nums[i]);
            }

            add("Return OR", `return take || notTake;\nReturning ${take} || ${notTake} = ${take || notTake}.`, 20, { activeI: i, currTarget, totalSum, target, hlReturn: true, res: take || notTake });
            return take || notTake;
        };

        let res = dfs(n - 1, target);
        add("Final Result", `DFS fully evaluated.`, 20, { isSuccess: true, finalAns: res, totalSum, target });

    } else if (selectedOpId === 'memoization') {
        add("Function Call", `public boolean canPartition(int[] nums)`, 2, { hlInit: true });

        add("Calculate Sum", `int sum = 0;\nfor (int num : nums) sum += num;\nTotal sum of array elements is ${totalSum}.`, 4, { hlSum: true, totalSum });

        let isOdd = totalSum % 2 !== 0;
        add("Check Parity", `if (sum % 2 != 0) return false;\nIs ${totalSum} odd? (${isOdd ? 'Yes' : 'No'})`, 5, { hlParity: true, totalSum, isOdd });
        
        if (isOdd) {
            add("Odd Sum Exit", `Sum is odd. Impossible to partition.`, 5, { hlReturnFalse: true, totalSum, isSuccess: true, finalAns: false });
            return steps;
        }

        let target = totalSum / 2;
        add("Target Identified", `int target = sum / 2;\nWe must find a subset that sums perfectly to ${target}.`, 7, { hlTargetInit: true, totalSum, target });

        let memo: (boolean | null)[][] = Array.from({length: n}, () => new Array(target + 1).fill(null));
        add("Init Memo 2D Array", `Boolean[][] memo = new Boolean[nums.length][target + 1];\nAllocated 2D cache. Rows represent element index, columns represent remaining target sum.`, 8, { hlMemoInit: true, memo: clone2D(memo), totalSum, target });

        add("Start DFS", `return dfs(nums, nums.length - 1, target, memo);`, 9, { hlDfsCall: true, memo: clone2D(memo), totalSum, target });

        const dfs = (i: number, currTarget: number): boolean => {
            if (steps.length > 1500) return false;

            add("DFS Call", `private boolean dfs(int[] nums, int i=${i}, int target=${currTarget}, memo)`, 12, { activeI: i, currTarget, totalSum, target, memo: clone2D(memo) });

            if (currTarget === 0) return true;
            if (i === 0) return nums[0] === currTarget;

            if (memo[i][currTarget] !== null) {
                add("Cache Hit", `if (memo[i][target] != null) return memo[i][target];\nWe already solved for index ${i} with remaining target ${currTarget}! Returning cached value ${memo[i][currTarget]}.`, 15, { activeI: i, currTarget, hlCacheHit: true, memo: clone2D(memo), totalSum, target });
                return memo[i][currTarget] as boolean;
            }

            add("Branch: Not Take", `boolean notTake = dfs(nums, i - 1, target, memo);`, 17, { activeI: i, currTarget, hlNotTake: true, nextI: i-1, memo: clone2D(memo), totalSum, target });
            let notTake = dfs(i - 1, currTarget);

            if (notTake) {
                 memo[i][currTarget] = true;
                 add("Early Cache & Return", `memo[i][target] = take || notTake;\nSince 'notTake' was true, store true in memo[${i}][${currTarget}] and return.`, 22, { activeI: i, currTarget, hlStore: true, res: true, memo: clone2D(memo), totalSum, target });
                 return true;
            }

            let take = false;
            add("Check Cap for Take", `if (target >= nums[i])`, 19, { activeI: i, currTarget, hlCheckTake: true, memo: clone2D(memo), totalSum, target });
            
            if (currTarget >= nums[i]) {
                add("Branch: Take", `take = dfs(nums, i - 1, target - nums[i], memo);`, 20, { activeI: i, currTarget, hlTake: true, nextI: i-1, newTarget: currTarget - nums[i], memo: clone2D(memo), totalSum, target });
                take = dfs(i - 1, currTarget - nums[i]);
            }

            memo[i][currTarget] = take || notTake;
            add("Store & Return", `return memo[i][target] = take || notTake;\nStore ${take || notTake} in memo[${i}][${currTarget}].`, 22, { activeI: i, currTarget, hlStore: true, res: take || notTake, memo: clone2D(memo), totalSum, target });
            return take || notTake;
        };

        let res = dfs(n - 1, target);
        add("Final Result", `DFS with Memoization evaluated completely.`, 22, { isSuccess: true, finalAns: res, totalSum, target, memo: clone2D(memo) });

    } else if (selectedOpId === 'tabulation') {
        add("Function Call", `public boolean canPartition(int[] nums)`, 2, { hlInit: true });

        add("Calculate Sum", `int sum = 0;\nfor (int num : nums) sum += num;\nTotal sum of array elements is ${totalSum}.`, 4, { hlSum: true, totalSum });

        let isOdd = totalSum % 2 !== 0;
        if (isOdd) {
            add("Odd Sum Exit", `if (sum % 2 != 0) return false;\nSum is odd. Impossible to partition.`, 5, { hlReturnFalse: true, totalSum, isSuccess: true, finalAns: false });
            return steps;
        }

        let target = totalSum / 2;
        add("Target Identified", `int target = sum / 2;\nWe must find a subset that sums perfectly to ${target}.`, 7, { hlTargetInit: true, totalSum, target });

        let dp: boolean[][] = Array.from({length: n}, () => new Array(target + 1).fill(false));
        add("Init DP 2D Array", `boolean[][] dp = new boolean[n][target + 1];\nAllocated 2D boolean table to iterate bottom-up.`, 9, { hlDpInit: true, dp: clone2D(dp), totalSum, target });

        if (nums[0] <= target) {
            dp[0][nums[0]] = true;
            add("Seed Base Case (Item 0)", `if (nums[0] <= target) dp[0][nums[0]] = true;\nOnly element 0 can form exactly sum ${nums[0]}.`, 11, { hlSeedFirst: true, dp: clone2D(dp), totalSum, target });
        }

        for (let i = 0; i < n; i++) dp[i][0] = true;
        add("Seed Base Case (Sum 0)", `for (int i = 0; i < n; i++) dp[i][0] = true;\nA target sum of 0 is ALWAYS achievable by taking nothing.`, 12, { hlSeedZero: true, dp: clone2D(dp), totalSum, target });

        for (let i = 1; i < n; i++) {
            add("Outer Loop (Items)", `for (int i = 1; i < n; i++)\nProcessing element ${nums[i]} at index ${i}.`, 14, { activeI: i, hlLoopI: true, dp: clone2D(dp), totalSum, target });
            for (let j = 1; j <= target; j++) {
                add("Inner Loop (Targets)", `for (int j = 1; j <= target; j++)\nCalculating if we can form sum ${j}.`, 15, { activeI: i, activeJ: j, hlLoopJ: true, dp: clone2D(dp), totalSum, target });
                
                let notTake = dp[i - 1][j];
                let take = false;
                if (j >= nums[i]) take = dp[i - 1][j - nums[i]];
                
                dp[i][j] = take || notTake;
                add("DP Transition", `boolean notTake = dp[i-1][j];\nboolean take = (j >= nums[i]) ? dp[i-1][j - nums[i]] : false;\ndp[i][j] = take || notTake;\nnotTake (${notTake}) || take (${take}) -> ${dp[i][j]}.`, 19, { activeI: i, activeJ: j, hlCalcDp: true, take, notTake, dp: clone2D(dp), totalSum, target, takeIdx: j - nums[i] });
            }
        }
        add("Return Result", `return dp[n - 1][target];\nThe final answer is at the bottom right cell!`, 22, { isSuccess: true, finalAns: dp[n - 1][target], dp: clone2D(dp), totalSum, target });

    } else if (selectedOpId === 'spaceOptimized') {
        add("Function Call", `public boolean canPartition(int[] nums)`, 2, { hlInit: true });

        add("Calculate Sum", `int sum = 0;\nfor (int num : nums) sum += num;\nTotal sum of array elements is ${totalSum}.`, 4, { hlSum: true, totalSum });

        let isOdd = totalSum % 2 !== 0;
        if (isOdd) {
            add("Odd Sum Exit", `if (sum % 2 != 0) return false;\nSum is odd. Impossible to partition.`, 5, { hlReturnFalse: true, totalSum, isSuccess: true, finalAns: false });
            return steps;
        }

        let target = totalSum / 2;
        add("Target Identified", `int target = sum / 2;\nWe must find a subset that sums perfectly to ${target}.`, 7, { hlTargetInit: true, totalSum, target });
        
        let dp = new Array(target + 1).fill(false);
        add("Init 1D Array", `boolean[] dp = new boolean[target + 1];\nAllocated a single 1D array of size ${target + 1}.`, 8, { hlDpInit: true, dp: clone1D(dp), totalSum, target });

        dp[0] = true;
        add("Seed Base Case", `dp[0] = true;\nSum of 0 is always achievable (empty subset).`, 9, { hlSeedZero: true, dp: clone1D(dp), totalSum, target });

        for (let i = 0; i < n; i++) {
            let num = nums[i];
            add("Outer Loop (Items)", `for (int num : nums)\nProcessing element ${num} (index ${i}).`, 11, { activeNum: num, activeI: i, hlLoopI: true, dp: clone1D(dp), totalSum, target });

            for (let j = target; j >= num; j--) {
                add("Inner Backwards Loop", `for (int j = target; j >= num; j--)\nChecking if we can reach target ${j} using ${num}. Iterating BACKWARDS.`, 12, { activeNum: num, activeI: i, activeJ: j, hlLoopJ: true, dp: clone1D(dp), totalSum, target });
                
                let oldVal = dp[j];
                let inheritVal = dp[j - num];
                dp[j] = dp[j] || dp[j - num];
                add("Update DP Cell", `dp[j] = dp[j] || dp[j - num];\nWe can reach sum ${j} if we could ALREADY reach it (${oldVal}), OR if we could reach sum (${j} - ${num} = ${j - num}) which is ${inheritVal}. New dp[${j}] = ${dp[j]}.`, 13, { activeNum: num, activeI: i, activeJ: j, hlCalcDp: true, oldVal, inheritVal, dp: clone1D(dp), totalSum, target, takeIdx: j - num });
            }
        }
        
        add("Return Result", `return dp[target];\nThe final answer is at dp[target]!`, 17, { isSuccess: true, finalAns: dp[target], dp: clone1D(dp), totalSum, target });
    }

    return steps;
  }, [baseNums, selectedOpId]);

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
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? (st.finalAns ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-rose-400 ring-4 ring-rose-100') : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${st.finalAns ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {st.finalAns ? <Trophy size={16}/> : <XCircle size={16}/>} 
                          Partition Evaluation
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full ${st.finalAns ? 'text-emerald-700 bg-emerald-100 border-emerald-400' : 'text-rose-700 bg-rose-100 border-rose-400'}`}>
                          {st.finalAns ? "TRUE (Can Partition)" : "FALSE (Cannot Partition)"}
                      </div>
                  </div>
              ) : st.totalSum !== undefined && st.target === undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Total Sum</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlSum ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.totalSum}
                          </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Is Odd?</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlParity ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.isOdd !== undefined ? (st.isOdd ? 'YES' : 'NO') : '-'}
                          </div>
                      </div>
                  </div>
              ) : st.target !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1"><Target size={12}/> Target Sum</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlTargetInit ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-amber-50 border-amber-300 text-amber-700'}`}>
                              {st.target}
                          </div>
                      </div>
                      
                      {st.activeI !== undefined && (
                          <>
                              <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><Package size={12}/> Item nums[i]</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-50 border-sky-300 text-sky-700`}>
                                      {st.nums[st.activeI]}
                                  </div>
                              </div>
                          </>
                      )}

                      {st.activeJ !== undefined && (
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1">Evaluating Sum (j)</span>
                              <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoopJ || st.hlCalcDp ? 'bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800 scale-110 shadow-lg' : 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700'}`}>
                                  {st.activeJ}
                              </div>
                          </div>
                      )}
                      {st.currTarget !== undefined && (
                          <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1">Remaining Target</span>
                              <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700`}>
                                  {st.currTarget}
                              </div>
                          </div>
                      )}

                  </div>
              ) : (
                  <span className="text-slate-400 italic text-sm py-4">Initializing Data Structures...</span>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.nums === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 44;
      const nodeGap = 6;
      const totalSize = nodeWidth + nodeGap;
      
      const arrWidth = st.n * totalSize;
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
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '520px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Nums Array Rendering */}
                          <div className="absolute flex gap-2 justify-center" style={{ top: `${startY}px`, left: '0', transform: 'translateX(-50%)' }}>
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400">nums[]</span>
                              {st.nums.map((val: number, idx: number) => {
                                  let isActive = st.activeI === idx && !st.isSuccess;
                                  let bgClass = "bg-white border-slate-300 text-slate-600";
                                  let scaleClass = "scale-100";

                                  if (isActive) {
                                      bgClass = "bg-sky-100 border-sky-500 text-sky-900 shadow-xl ring-4 ring-sky-200 z-30";
                                      scaleClass = "scale-125";
                                  }

                                  return (
                                      <div key={`num-${idx}`} className={`flex flex-col items-center transition-all duration-500 ${scaleClass} z-20`}>
                                          <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center border-[2px] rounded-lg transition-all duration-300 ${bgClass}`}>
                                              <span className="font-mono font-black text-xl">{val}</span>
                                          </div>
                                          <span className="text-[10px] font-mono text-slate-400 mt-1">i:{idx}</span>
                                      </div>
                                  )
                              })}
                          </div>
                          
                          {/* Render 1D DP Array for Space Optimized Approach below */}
                          {selectedOpId === 'spaceOptimized' && st.dp && (
                              <div className="absolute flex flex-col items-center w-full" style={{ top: `${startY + 120}px` }}>
                                  
                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm">dp[] (Boolean Array representing possible sums 0 to Target)</span>
                                      
                                      <div className="flex gap-1 p-3 bg-white rounded-2xl border border-slate-200 shadow-md relative">
                                          {/* Jump Arrow Overlay */}
                                          {st.hlCalcDp && st.takeIdx !== undefined && !st.isSuccess && (
                                              <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-30 pointer-events-none" style={{ transform: 'translateY(-15px)' }}>
                                                  <defs>
                                                      <marker id="jumpArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                                          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#f43f5e" />
                                                      </marker>
                                                  </defs>
                                                  <path 
                                                      d={`M ${st.takeIdx * 42 + 21 + 12} 15 Q ${((st.takeIdx + st.activeJ) / 2) * 42 + 21 + 12} -20 ${st.activeJ * 42 + 21 + 12} 10`} 
                                                      fill="none" 
                                                      stroke="#f43f5e" 
                                                      strokeWidth="3" 
                                                      strokeDasharray="4 4"
                                                      markerEnd="url(#jumpArrow)"
                                                      className="animate-pulse"
                                                  />
                                              </svg>
                                          )}

                                          {st.dp.map((val: boolean, idx: number) => {
                                              let isUpdating = st.hlCalcDp && st.activeJ === idx;
                                              let isSource = st.hlCalcDp && st.takeIdx === idx;
                                              
                                              let boxBg = val ? "bg-emerald-500 border-emerald-700 text-white shadow-sm" : "bg-slate-100 border-slate-300 text-slate-400";
                                              
                                              if (isUpdating) {
                                                  boxBg = "bg-fuchsia-400 border-fuchsia-600 text-white ring-4 ring-fuchsia-200 scale-110 shadow-xl z-20 animate-pulse";
                                              } else if (isSource) {
                                                  boxBg = val ? "bg-emerald-400 border-emerald-600 text-white ring-4 ring-emerald-200 scale-110 z-20 shadow-lg" : "bg-slate-300 border-slate-400 text-slate-500 ring-4 ring-slate-200 scale-110 z-20";
                                              }

                                              return (
                                                  <div key={`dp-${idx}`} className="flex flex-col items-center">
                                                      <div className={`w-10 h-10 flex flex-col items-center justify-center font-mono font-bold text-[10px] border-[2px] rounded transition-all duration-300 ${boxBg}`}>
                                                          {val ? 'T' : 'F'}
                                                      </div>
                                                      <span className={`text-[9px] font-mono mt-1 ${isUpdating || isSource ? 'text-fuchsia-500 font-black' : 'text-slate-400'}`}>{idx}</span>
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* Render 2D DP Array for Tabulation */}
                          {selectedOpId === 'tabulation' && st.dp && (
                              <div className="absolute flex flex-col items-center w-full" style={{ top: `${startY + 100}px` }}>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm">dp[][] (2D Boolean Array)</span>
                                  
                                  <div className="flex flex-col gap-1 p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                                      <div className="flex gap-1 mb-1">
                                          <div className="w-6 h-4"></div>
                                          {st.dp[0].map((_, c) => <div key={`hc-${c}`} className="w-8 flex justify-center text-[8px] font-mono text-slate-400">{c}</div>)}
                                      </div>
                                      {st.dp.map((rowArr: boolean[], r: number) => (
                                          <div key={`dp-r-${r}`} className="flex gap-1 items-center">
                                              <span className="w-6 text-right text-[8px] font-mono text-slate-400 pr-2">{r}</span>
                                              {rowArr.map((val: boolean, c: number) => {
                                                  let isUpdating = st.hlCalcDp && st.activeI === r && st.activeJ === c;
                                                  let isTop = st.hlCalcDp && st.activeI === r + 1 && st.activeJ === c;
                                                  let isTakeSource = st.hlCalcDp && st.activeI === r + 1 && st.takeIdx === c;

                                                  let boxBg = val ? "bg-emerald-500 border-emerald-700 text-white" : "bg-slate-100 border-slate-300 text-slate-400";
                                                  
                                                  if (isUpdating) {
                                                      boxBg = "bg-fuchsia-400 border-fuchsia-600 text-white ring-4 ring-fuchsia-200 scale-125 shadow-xl z-20 animate-pulse";
                                                  } else if (isTop || isTakeSource) {
                                                      boxBg = val ? "bg-emerald-400 border-emerald-600 text-white ring-4 ring-emerald-200 scale-110 z-20 shadow-lg" : "bg-slate-300 border-slate-400 text-slate-500 ring-4 ring-slate-200 scale-110 z-20";
                                                  }

                                                  return (
                                                      <div key={`dp-${r}-${c}`} className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-[9px] border-[2px] rounded-sm transition-all duration-300 ${boxBg}`}>
                                                          {val ? 'T' : 'F'}
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                      ))}
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
                <Scale className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Partition Equal Subset Sum</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming Options
                  </span>
                  <span>•</span>
                  <span>LeetCode 416</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Scale size={28}/> Balancing the Array</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given an integer array <code>nums</code>, return <code>true</code> if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or <code>false</code> otherwise.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [1,5,11,5]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">true</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">The array can be partitioned as [1, 5, 5] and [11].<br/>Sum of [1, 5, 5] is 11. Sum of [11] is 11. Both are equal.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [1,2,3,5]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">false</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">The array cannot be partitioned into equal sum subsets. Total sum is 11, which is odd.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= nums.length &lt;= 200</li>
                            <li>1 &lt;= nums[i] &lt;= 100</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Activity size={16} className="text-rose-500"/> Redefining the Goal</h4>
                        <p className="text-sm leading-relaxed">If two subsets have equal sums, then their individual sums must be exactly half of the total sum of the array! Therefore, we just need to find if there is ANY single subset that adds up to <code>totalSum / 2</code>. This translates the problem perfectly into the classic 0/1 Knapsack Problem.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Zap size={16} className={`text-${themeColor}-500`}/> The 1D Compression</h4>
                        <p className="text-sm leading-relaxed text-slate-600">While a 2D DP array <code>dp[i][j]</code> can map out whether using items up to index <code>i</code> can form sum <code>j</code>, we only ever need row <code>i-1</code> to calculate row <code>i</code>. By traversing a 1D array <strong>backwards</strong>, we can update the array in-place without accidentally reusing the same item twice!</p>
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
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="1, 5, 11, 5" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.finalAns ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.finalAns ? <PartyPopper size={24}/> : <XCircle size={24}/>} EXECUTION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                {st.finalAns ? "Successfully found a valid partition subset." : "Impossible to partition into two equal subsets."}
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCalcDp ? 'text-fuchsia-400' : (st.hlTargetInit ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Scale size={14} className={`text-${themeColor}-500`}/> Dynamic Knapsack Visualizer</span>
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
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why no arrays?</strong> We rely purely on the Call Stack memory. We recursively traverse the array elements. For each element, we generate two distinct universes: one where we TAKE the element (subtracting it from the target sum), and one where we DO NOT TAKE it. We return true if any branching path reaches a target sum of exactly 0.</p>
                        <p className="text-slate-800 font-bold bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 w-fit">Time: O(2^N) | Space: O(N)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Because we branch exactly 2 ways at every single step, the time complexity is heavily exponential $O(2^N)$. The space is $O(N)$ due to the maximum depth of the recursive call stack equaling the array length.</p>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 2. Memoization (Top-Down)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a 2D Array?</strong> We declare <code>Boolean[][] memo = new Boolean[n][target + 1]</code> because the exact state of our recursive subproblem is defined by two variables: the current index <code>i</code> we are evaluating, and the remaining <code>target</code> sum we need to fulfill. If we arrive at index <code>i</code> needing a sum of <code>target</code> and we've already calculated whether that's possible before, we return the cached boolean instantly.</p>
                        <p className="text-slate-800 font-bold bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 w-fit">Time: O(N * Target) | Space: O(N * Target)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">By caching, we ensure each unique (index, target) pair is calculated exactly once. The time complexity drops to pseudo-polynomial $O(N \times \text{Target})$. Space is explicitly $O(N \times \text{Target})$ for the 2D grid.</p>
                    </div>

                    {/* Approach 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-fuchsia-500"/> 3. Tabulation (Bottom-Up)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a 2D Array?</strong> We declare <code>boolean[][] dp</code> to flip the recursion into an iterative process. We move item-by-item (rows), calculating achievable sums (columns). <code>dp[i][j]</code> is true if we can achieve sum <code>j</code> using a subset of the first <code>i</code> items. The logic is identical: it is true if we could achieve the sum without the current item <code>dp[i-1][j]</code>, OR if we could achieve the sum minus the current item <code>dp[i-1][j - nums[i]]</code>.</p>
                        <p className="text-slate-800 font-bold bg-fuchsia-100 px-3 py-1.5 rounded-lg border border-fuchsia-200 w-fit">Time: O(N * Target) | Space: O(N * Target)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">The time remains identical as we evaluate every cell once. The space remains $O(N \times \text{Target})$ for the explicit DP table.</p>
                    </div>

                    {/* Approach 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 4. Space Optimized (1D Array)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why exactly a 1D Array?</strong> This is the ultimate 0/1 Knapsack optimization. To calculate row <code>i</code> in the Tabulation approach, we only ever look at row <code>i-1</code>. We don't need the entire matrix in memory! We declare a single 1D array <code>boolean[] dp</code> of size <code>target + 1</code>.</p>
                        <p className="text-slate-600 leading-relaxed"><strong>Why backwards traversal?</strong> We loop <code>j</code> from <code>target</code> down to <code>num</code>. We do this to ensure that when calculating <code>dp[j] = dp[j] || dp[j - num]</code>, the value of <code>dp[j - num]</code> comes from the <em>previous</em> row (meaning the item hasn't been used yet). If we looped forwards, we might use the same item multiple times!</p>
                        <p className="text-slate-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">Time: O(N * Target) | Space: O(Target)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Time remains exactly the same. However, the memory footprint is slashed from the entire matrix down to just a single row matching the target sum, achieving absolute optimal performance.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is fundamentally the 0/1 Knapsack problem. Interviewers expect you to quickly recognize the parity check, then confidently write out the DP transition logic."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "In the 1D Array optimization, what happens if we traverse the inner loop forwards instead of backwards?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We would accidentally solve the Unbounded Knapsack problem instead of the 0/1 Knapsack problem."</p>
                            <p>If we iterate forwards, by the time we calculate <code>dp[j]</code> using <code>dp[j - num]</code>, the value at <code>j - num</code> might have already been set to true by the <em>current</em> item in this very iteration! This allows an item to be picked an infinite number of times. Iterating backwards guarantees we only read data from the previous item's state."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Could we use a HashSet to store reachable sums instead of a DP array?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, and it's quite elegant."</p>
                            <p>We could maintain a `HashSet` of all possible sums we can form. Initially it contains just `0`. For each number, we iterate over the current set and add `current_sum + num` to a temporary set, then merge it. If the target sum ever appears in the set, we return true. This has similar time complexity but can save space if the array values are sparse and high, making the explicit boolean array memory wasteful."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why is the time complexity considered 'pseudo-polynomial' rather than strictly polynomial?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because the runtime depends on the numeric VALUE of the input, not just the size of the input."</p>
                            <p>The time complexity is $O(N \times \text{Target})$. While $N$ is the number of elements, $\text{Target}$ is derived from the sum of the elements. If the numbers in the array are astronomically huge, the array size $N$ might be tiny, but the Target might be a billion, causing the algorithm to take a billion steps. Polynomial time algorithms should scale strictly based on $N$ (the quantity of items)."</p>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns ? 'bg-emerald-900/40 border-emerald-800' : 'bg-rose-900/40 border-rose-800') : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCalcDp ? 'text-fuchsia-400' : (st.hlTargetInit ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Numbers Array (Max 8 items, Target &le; 20)</label>
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="1, 5, 11, 5" />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.finalAns ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.finalAns ? <PartyPopper size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EXECUTION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">{st.finalAns ? 'Subset Sum Achieved' : 'Subset Sum Impossible'}</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Can Partition</div>
                                    <div className={`font-mono text-5xl font-black leading-relaxed flex items-center gap-2 break-all ${st.finalAns ? 'text-emerald-400' : 'text-rose-400'}`}>{st.finalAns ? 'TRUE' : 'FALSE'}</div>
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