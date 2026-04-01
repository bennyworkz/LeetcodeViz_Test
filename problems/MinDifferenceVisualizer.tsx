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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Target, Brackets, Smartphone, Globe, Grid, Crown, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square, Scale
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  recursion: {
    id: 'recursion',
    title: '1. Brute Force (Recursion)',
    icon: <ListTree size={16} />,
    complexity: 'Time: O(2^(2N)) | Space: O(N)',
    theme: 'rose',
    code: `class Solution {
    int minDiff = Integer.MAX_VALUE;
    
    public int minimumDifference(int[] nums) {
        int totalSum = 0;
        for (int num : nums) totalSum += num;
        dfs(nums, 0, 0, 0, totalSum);
        return minDiff;
    }
    
    private void dfs(int[] nums, int i, int count, int currentSum, int totalSum) {
        if (count == nums.length / 2) {
            minDiff = Math.min(minDiff, Math.abs(totalSum - 2 * currentSum));
            return;
        }
        if (i == nums.length) return;
        
        dfs(nums, i + 1, count + 1, currentSum + nums[i], totalSum); // Take
        dfs(nums, i + 1, count, currentSum, totalSum); // Not Take
    }
}`,
    desc: "The Recursive Approach: We must pick exactly N elements from an array of 2N elements to form one array, leaving the rest for the second array. We use a DFS to explore two branches at every element: Take it (incrementing count and sum) or Skip it. When we have exactly N elements (count == nums.length / 2), we evaluate the absolute difference. Because we branch 2 ways at 2N steps, the time complexity explodes to O(2^(2N)), causing Time Limit Exceeded (TLE) for N=15."
  },
  memoization: {
    id: 'memoization',
    title: '2. Memoization (Top-Down)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N * Target) | Space: O(N * Target) -> TLE',
    theme: 'sky',
    code: `class Solution {
    public int minimumDifference(int[] nums) {
        int totalSum = 0;
        for (int num : nums) totalSum += num;
        Map<String, Integer> memo = new HashMap<>();
        return dfs(nums, 0, 0, 0, totalSum, memo);
    }
    
    private int dfs(int[] nums, int i, int count, int currentSum, int totalSum, Map<String, Integer> memo) {
        if (count == nums.length / 2) return Math.abs(totalSum - 2 * currentSum);
        if (i == nums.length) return Integer.MAX_VALUE;
        
        String key = i + "," + count + "," + currentSum;
        if (memo.containsKey(key)) return memo.get(key);
        
        int take = dfs(nums, i + 1, count + 1, currentSum + nums[i], totalSum, memo);
        int notTake = dfs(nums, i + 1, count, currentSum, totalSum, memo);
        
        int res = Math.min(take, notTake);
        memo.put(key, res);
        return res;
    }
}`,
    desc: "The Top-Down DP Approach: We attempt to optimize recursion by caching results. Because sums can be negative and extremely large (up to 10^7), we cannot use a standard array. We must use a Map with a String key representing (index, count, currentSum). However, because the range of possible sums is so massive, caching strings becomes too slow and memory-intensive. This approach fails on LeetCode 2035 with Memory Limit Exceeded (MLE) or Time Limit Exceeded (TLE)!"
  },
  tabulation: {
    id: 'tabulation',
    title: '3. Tabulation (Bottom-Up)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(N * Sums) | Space: MLE',
    theme: 'fuchsia',
    code: `class Solution {
    public int minimumDifference(int[] nums) {
        int n = nums.length / 2;
        int totalSum = Arrays.stream(nums).sum();
        
        List<Map<Integer, Integer>> dp = new ArrayList<>();
        for(int i=0; i<=n; i++) dp.add(new HashMap<>());
        dp.get(0).put(0, 0); 
        
        for (int num : nums) {
            for (int count = n; count >= 1; count--) {
                Map<Integer, Integer> prevMap = dp.get(count - 1);
                Map<Integer, Integer> currMap = dp.get(count);
                for (int prevSum : prevMap.keySet()) {
                    currMap.put(prevSum + num, 1);
                }
            }
        }
        
        int minDiff = Integer.MAX_VALUE;
        for (int sum : dp.get(n).keySet()) {
            minDiff = Math.min(minDiff, Math.abs(totalSum - 2 * sum));
        }
        return minDiff;
    }
}`,
    desc: "The Bottom-Up Tabulation Approach: We invert the memoization. Instead of a 3D array (which would instantly run out of memory), we use an array of N HashMaps, where dp[count] holds all reachable sums using exactly 'count' elements. For each number, we iterate backwards updating the maps. Unfortunately, generating millions of map entries for large numbers still results in a massive Memory Limit Exceeded (MLE) error. DP fundamentally breaks on this problem!"
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '4. Meet in the Middle (Optimal)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N * 2^N) | Space: O(2^N)',
    theme: 'emerald',
    code: `class Solution {
    public int minimumDifference(int[] nums) {
        int n = nums.length / 2, sum = 0;
        for (int num : nums) sum += num;
        
        List<List<Integer>> left = new ArrayList<>(), right = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            left.add(new ArrayList<>()); right.add(new ArrayList<>());
        }
        
        generate(nums, 0, n, 0, 0, left);
        generate(nums, n, 2 * n, 0, 0, right);
        for (int i = 0; i <= n; i++) Collections.sort(right.get(i));
        
        int minDiff = Integer.MAX_VALUE, target = sum / 2;
        for (int k = 0; k <= n; k++) {
            List<Integer> lList = left.get(k), rList = right.get(n - k);
            for (int lSum : lList) {
                int rTarget = target - lSum;
                int idx = Collections.binarySearch(rList, rTarget);
                if (idx < 0) idx = -(idx + 1);
                
                if (idx < rList.size()) {
                    minDiff = Math.min(minDiff, Math.abs(sum - 2 * (lSum + rList.get(idx))));
                }
                if (idx > 0) {
                    minDiff = Math.min(minDiff, Math.abs(sum - 2 * (lSum + rList.get(idx - 1))));
                }
            }
        }
        return minDiff;
    }
    
    private void generate(int[] nums, int i, int end, int cnt, int sum, List<List<Integer>> res) {
        if (i == end) { res.get(cnt).add(sum); return; }
        generate(nums, i + 1, end, cnt + 1, sum + nums[i], res);
        generate(nums, i + 1, end, cnt, sum, res);
    }
}`,
    desc: "The Ultimate Optimization: Since standard DP memory explodes, we use 'Meet in the Middle'. We split the array exactly in half. For both halves (size N), we generate ALL possible combinations (2^N is very small, max 32,768). We group these sums by the number of elements picked (k). We then sort the Right half sums. Finally, for every sum in the Left half of size 'k', we binary search the Right half of size 'N-k' for the value closest to (Target - lSum). This radically cuts time from O(2^30) down to O(2^15 * 15)!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|minimumDifference|nums|sum|totalSum|num|length|dfs|target|memo|n|dp|notTake|take|i|j|minDiff|Integer|MAX_VALUE|Math|min|abs|Map|HashMap|String|key|containsKey|get|put|List|ArrayList|Arrays|stream|keySet|left|right|add|generate|Collections|sort|k|lList|rList|lSum|rTarget|binarySearch|idx|size|end|cnt|res)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'Map', 'HashMap', 'List', 'ArrayList', 'Arrays', 'Collections'].includes(part);
            const isPointer = ['nums', 'sum', 'totalSum', 'num', 'target', 'memo', 'n', 'dp', 'notTake', 'take', 'i', 'j', 'minDiff', 'key', 'left', 'right', 'k', 'lList', 'rList', 'lSum', 'rTarget', 'idx', 'end', 'cnt', 'res'].includes(part);
            const isMapCall = ['minimumDifference', 'length', 'dfs', 'min', 'max', 'abs', 'containsKey', 'get', 'put', 'stream', 'keySet', 'add', 'generate', 'sort', 'binarySearch', 'size'].includes(part);
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

export default function MinDifferenceVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [numsInput, setNumsInput] = useState('3, 9, 7, 3');
  const [baseNums, setBaseNums] = useState<number[]>([3, 9, 7, 3]);

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
        let parsed = numsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        
        if (parsed.length === 0) {
            parsed = [3, 9, 7, 3];
        }
        
        // Ensure even length by padding or trimming
        if (parsed.length % 2 !== 0) {
            parsed.push(0);
        }

        // Cap max size to prevent massive traces in UI (Max 6 for MitM)
        if (parsed.length > 6) parsed = parsed.slice(0, 6);

        setBaseNums(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
          setBaseNums([3, 9, 7, 3]);
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

  const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const nums = baseNums;
    const n = nums.length / 2;
    const totalSum = nums.reduce((a, b) => a + b, 0);

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { nums, n, totalSum, ...st } 
    });

    if (selectedOpId === 'recursion') {
        add("Function Call", `public int minimumDifference(int[] nums)\nStarting our brute force subset generation.`, 4, { hlInit: true });
        add("Calculate Sum", `for (int num : nums) totalSum += num;\nWe need the total sum (${totalSum}) to evaluate the difference later.`, 6, { hlSum: true });
        
        let minDiff = Number.MAX_SAFE_INTEGER;
        let taken = new Array(nums.length).fill(false);
        add("Start DFS", `dfs(nums, 0, 0, 0, totalSum);\nLaunch recursive DFS from index 0.`, 7, { hlDfsCall: true, minDiff: "MAX", taken: [...taken] });

        const dfs = (i: number, count: number, currentSum: number) => {
            if (steps.length > 800) return; // Safety limit
            
            add("DFS Call", `private void dfs(int[] nums, int i=${i}, int count=${count}, int currentSum=${currentSum}, int totalSum)\nEvaluating index ${i} with ${count} elements picked so far.`, 11, { activeI: i, count, currentSum, minDiff: minDiff === Number.MAX_SAFE_INTEGER ? "MAX" : minDiff, taken: [...taken] });
            
            if (count === n) {
                let diff = Math.abs(totalSum - 2 * currentSum);
                let isNewMin = diff < minDiff;
                minDiff = Math.min(minDiff, diff);
                add("Base Case: N Elements", `if (count == nums.length / 2)\nWe successfully picked N elements! We evaluate the difference and stop branching here.`, 12, { activeI: i, count, currentSum, hlBase1: true, diff, minDiff, isNewMin, taken: [...taken] });
                add("Update Min Diff", `minDiff = Math.min(minDiff, Math.abs(totalSum - 2 * currentSum));\nThe difference is |${totalSum} - 2*${currentSum}| = ${diff}. Updating global minDiff.`, 13, { activeI: i, count, currentSum, hlBase1Return: true, diff, minDiff, isNewMin, taken: [...taken] });
                return;
            }
            if (i === nums.length) {
                add("Base Case: Out of Bounds", `if (i == nums.length) return;\nWe ran out of elements before picking N items. Invalid path.`, 16, { activeI: i, count, currentSum, hlBase2: true, minDiff: minDiff === Number.MAX_SAFE_INTEGER ? "MAX" : minDiff, taken: [...taken] });
                return;
            }

            taken[i] = true;
            add("Branch: Take", `dfs(nums, i + 1, count + 1, currentSum + nums[i], totalSum); // Take\nWe choose to TAKE nums[${i}] (${nums[i]}). Increasing count and sum.`, 18, { activeI: i, count, currentSum, hlTake: true, nextI: i+1, nextCount: count+1, nextSum: currentSum + nums[i], minDiff: minDiff === Number.MAX_SAFE_INTEGER ? "MAX" : minDiff, taken: [...taken] });
            dfs(i + 1, count + 1, currentSum + nums[i]);
            taken[i] = false;

            add("Branch: Skip", `dfs(nums, i + 1, count, currentSum, totalSum); // Not Take\nWe choose to SKIP nums[${i}] (${nums[i]}). Count and sum remain the same.`, 19, { activeI: i, count, currentSum, hlSkip: true, nextI: i+1, nextCount: count, nextSum: currentSum, minDiff: minDiff === Number.MAX_SAFE_INTEGER ? "MAX" : minDiff, taken: [...taken] });
            dfs(i + 1, count, currentSum);
        };

        dfs(0, 0, 0);
        add("Return Result", `return minDiff;\nDFS complete. Returning minimum difference found.`, 8, { isSuccess: true, finalAns: minDiff });

    } else if (selectedOpId === 'memoization') {
        add("Function Call", `public int minimumDifference(int[] nums)\nStarting top-down DP with caching.`, 2, { hlInit: true });
        add("Calculate Sum", `for (int num : nums) totalSum += num;\nTotal sum is ${totalSum}.`, 4, { hlSum: true });
        
        let memo = new globalThis.Map<string, number>();
        let taken = new Array(nums.length).fill(false);
        add("Init Map Cache", `Map<String, Integer> memo = new HashMap<>();\nWhy a HashMap and not a 2D/3D array? The sum can be negative or up to 10^7. Arrays would exceed memory limits instantly. We map a String state to the result.`, 5, { hlMemoInit: true, memoSize: 0 });
        add("Start DFS", `return dfs(nums, 0, 0, 0, totalSum, memo);\nLaunch DFS.`, 6, { hlDfsCall: true, memoSize: 0, taken: [...taken] });

        const dfs = (i: number, count: number, currentSum: number): number => {
            if (steps.length > 1000) return 0;
            
            add("DFS Call", `private int dfs(int[] nums, int i=${i}, int count=${count}, int currentSum=${currentSum}, ...)\nEntering state index=${i}, count=${count}, sum=${currentSum}.`, 9, { activeI: i, count, currentSum, memoSize: memo.size, taken: [...taken] });
            
            if (count === n) {
                let diff = Math.abs(totalSum - 2 * currentSum);
                add("Base Case: N Elements", `if (count == nums.length / 2) return Math.abs(totalSum - 2 * currentSum);\nPicked N elements. Returning diff ${diff}.`, 10, { activeI: i, count, currentSum, hlBase1: true, diff, memoSize: memo.size, taken: [...taken] });
                return diff;
            }
            if (i === nums.length) {
                add("Base Case: Out of Bounds", `if (i == nums.length) return Integer.MAX_VALUE;\nInvalid path, returning MAX.`, 11, { activeI: i, count, currentSum, hlBase2: true, memoSize: memo.size, taken: [...taken] });
                return Number.MAX_SAFE_INTEGER;
            }

            let key = `${i},${count},${currentSum}`;
            add("Generate Cache Key", `String key = i + "," + count + "," + currentSum;\nCreating a unique string representation of our current recursive state.`, 13, { activeI: i, count, currentSum, hlKey: true, key, memoSize: memo.size, taken: [...taken] });

            if (memo.has(key)) {
                add("Cache Hit", `if (memo.containsKey(key)) return memo.get(key);\nWe've seen this exact state before! Returning cached answer to skip redundant branching.`, 14, { activeI: i, count, currentSum, hlCacheHit: true, key, memoSize: memo.size, cachedVal: memo.get(key), taken: [...taken] });
                return memo.get(key)!;
            }

            taken[i] = true;
            add("Branch: Take", `int take = dfs(nums, i + 1, count + 1, currentSum + nums[i], totalSum, memo);\nExplore taking nums[${i}].`, 16, { activeI: i, count, currentSum, hlTake: true, nextI: i+1, nextCount: count+1, nextSum: currentSum + nums[i], memoSize: memo.size, taken: [...taken] });
            let take = dfs(i + 1, count + 1, currentSum + nums[i]);
            taken[i] = false;

            add("Branch: Skip", `int notTake = dfs(nums, i + 1, count, currentSum, totalSum, memo);\nExplore skipping nums[${i}].`, 17, { activeI: i, count, currentSum, hlSkip: true, nextI: i+1, nextCount: count, nextSum: currentSum, memoSize: memo.size, taken: [...taken] });
            let notTake = dfs(i + 1, count, currentSum);

            let res = Math.min(take, notTake);
            memo.set(key, res);
            add("Cache Store", `memo.put(key, res);\nStore the minimum of (take, notTake) in our HashMap for future cache hits.`, 20, { activeI: i, count, currentSum, hlStore: true, res, key, memoSize: memo.size, taken: [...taken] });
            return res;
        };

        let res = dfs(0, 0, 0);
        add("Return Result", `return res;\nReturn the final evaluated answer from the top-level call.`, 6, { isSuccess: true, finalAns: res });

    } else if (selectedOpId === 'tabulation') {
        add("Function Call", `public int minimumDifference(int[] nums)\nAttempting bottom-up generation.`, 2, { hlInit: true });
        add("List of Maps Init", `List<Map<Integer, Integer>> dp = new ArrayList<>();\nWhy a List of Maps? Because an int[][] array would be too large (15 x 10^7). We track reachable sums for each count 0 to N.`, 6, { hlDpInit: true });
        add("Seed DP", `dp.get(0).put(0, 0);\nBase state: using 0 elements, we can reach sum 0.`, 8, { hlSeed: true });
        
        // Simulating the memory explosion visually via loop
        let mapSizes = [1, 0, 0, 0];
        for(let i=0; i<3; i++) {
            add("DP Execution Failed", `for (int num : nums) { ... }\nMemory usage rapidly expanding as we generate unconstrained Map permutations...`, 10, { hlFail: true, isFail: false, mapSizes: [...mapSizes] });
            mapSizes[i+1] = Math.pow(2, i+1) * 1000; // Fake large numbers
        }

        add("DP Execution Failed", `for (int num : nums) { ... }\nMEMORY LIMIT EXCEEDED! Generating millions of permutations iteratively breaks standard DP memory constraints.`, 10, { hlFail: true, isFail: true, mapSizes: [...mapSizes] });

    } else if (selectedOpId === 'spaceOptimized') {
        add("Function Call", `public int minimumDifference(int[] nums)\nStarting Meet in the Middle algorithm to bypass DP memory limits.`, 2, { phase: 'init' });
        add("Init Split", `List<List<Integer>> left = new ArrayList<>(), right = new ArrayList<>();\nWe split the array exactly in half. We will store reachable sums grouped by how many items were picked (0 to N).`, 6, { phase: 'split' });

        let leftLists: number[][] = Array.from({length: n + 1}, () => []);
        let rightLists: number[][] = Array.from({length: n + 1}, () => []);

        // Simulation of generate...
        const generate = (start: number, end: number, count: number, currentSum: number, resList: number[][]) => {
            if (start === end) {
                resList[count].push(currentSum);
                return;
            }
            generate(start + 1, end, count + 1, currentSum + nums[start], resList);
            generate(start + 1, end, count, currentSum, resList);
        };

        generate(0, n, 0, 0, leftLists);
        generate(n, 2 * n, 0, 0, rightLists);

        add("Generate Subsets", `generate(nums, 0, n, 0, 0, left);\nRecursively generating all 2^N subset sums for both halves independently. 2^15 is tiny, so this is fast!`, 11, { phase: 'generate', leftLists: deepClone(leftLists), rightLists: deepClone(rightLists) });

        for (let i = 0; i <= n; i++) {
            rightLists[i].sort((a, b) => a - b);
        }

        add("Sort Right Half", `for (int i = 0; i <= n; i++) Collections.sort(right.get(i));\nWe sort the right half's sums so we can rapidly Binary Search them later.`, 13, { phase: 'sort', leftLists: deepClone(leftLists), rightLists: deepClone(rightLists) });

        let minDiff = Number.MAX_SAFE_INTEGER;
        let target = Math.floor(totalSum / 2);

        for (let k = 0; k <= n; k++) {
            let lList = leftLists[k];
            let rList = rightLists[n - k];

            add("Init Loop", `for (int k = 0; k <= n; k++)\nIf we pick 'k' elements from the left, we MUST pick 'n-k' elements from the right to form a subset of exactly N items.`, 16, { phase: 'match', k, leftLists: deepClone(leftLists), rightLists: deepClone(rightLists), minDiff: minDiff === Number.MAX_SAFE_INTEGER ? 'MAX' : minDiff, target });

            for (let lSum of lList) {
                let rTarget = target - lSum;

                add("Binary Search Target", `int rTarget = target - lSum;\nOur ideal total subset sum is 'target' (totalSum/2 = ${target}). Since we have 'lSum' (${lSum}), we need the right half to provide (${target} - ${lSum}) = ${rTarget}.`, 19, { phase: 'bs_target', k, leftLists: deepClone(leftLists), rightLists: deepClone(rightLists), minDiff: minDiff === Number.MAX_SAFE_INTEGER ? 'MAX' : minDiff, target, lSum, rTarget });

                // Simulate binary search visually
                let low = 0, high = rList.length - 1;
                let idx = rList.length;
                
                while (low <= high) {
                    let mid = Math.floor((low + high) / 2);
                    add("Binary Search Step", `int idx = Collections.binarySearch(rList, rTarget);\nSearching for ${rTarget}. Low:${low}, High:${high}, Mid:${mid} (Val: ${rList[mid]}).`, 20, { phase: 'bs_step', k, leftLists: deepClone(leftLists), rightLists: deepClone(rightLists), minDiff: minDiff === Number.MAX_SAFE_INTEGER ? 'MAX' : minDiff, target, lSum, rTarget, bsLow: low, bsHigh: high, bsMid: mid, rList });

                    if (rList[mid] >= rTarget) {
                        idx = mid;
                        high = mid - 1;
                    } else {
                        low = mid + 1;
                    }
                }

                if (idx < rList.length) {
                    let currentSum = lSum + rList[idx];
                    let diff = Math.abs(totalSum - 2 * currentSum);
                    let isNewMin = diff < minDiff;
                    minDiff = Math.min(minDiff, diff);
                    add("Check >= Bound", `if (idx < rList.size()) { ... }\nEvaluating closest >= sum: ${rList[idx]}. Total subset sum: ${currentSum}. Diff: |${totalSum} - 2*${currentSum}| = ${diff}.`, 24, { phase: 'bs_check1', k, leftLists: deepClone(leftLists), rightLists: deepClone(rightLists), minDiff, target, lSum, rTarget, rSum: rList[idx], idx, diff, isNewMin, rList });
                }
                
                if (idx > 0) {
                    let currentSum = lSum + rList[idx - 1];
                    let diff = Math.abs(totalSum - 2 * currentSum);
                    let isNewMin = diff < minDiff;
                    minDiff = Math.min(minDiff, diff);
                    add("Check <= Bound", `if (idx > 0) { ... }\nEvaluating closest <= sum: ${rList[idx - 1]}. Total subset sum: ${currentSum}. Diff: |${totalSum} - 2*${currentSum}| = ${diff}.`, 27, { phase: 'bs_check2', k, leftLists: deepClone(leftLists), rightLists: deepClone(rightLists), minDiff, target, lSum, rTarget, rSum: rList[idx - 1], idx: idx - 1, diff, isNewMin, rList });
                }
            }
        }
        
        add("Return Min Diff", `return minDiff;\nThe absolute minimum difference achieved by marrying the two optimal subsets.`, 31, { phase: 'done', isSuccess: true, finalAns: minDiff });
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
      let isFailEnd = st.isFail;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : isFailEnd ? 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-emerald-600`}>
                          <Trophy size={16}/> 
                          Absolute Minimum Difference
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-emerald-700 bg-emerald-100 border-emerald-400`}>
                          {String(st.finalAns)}
                      </div>
                  </div>
              ) : isFailEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12 animate-in zoom-in">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-rose-600`}>
                          <ShieldAlert size={16}/> 
                          Memory Limit Exceeded
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-rose-700 bg-rose-100 border-rose-400 text-center leading-relaxed`}>
                          DP arrays explode in size due to vast sum permutations.<br/>Meet in the Middle is strictly required!
                      </div>
                  </div>
              ) : selectedOpId === 'spaceOptimized' ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Target (sum/2)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                              {st.target !== undefined ? String(st.target) : '-'}
                          </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">Left Sum (k={st.k !== undefined ? String(st.k) : '-'})</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.lSum !== undefined ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.lSum !== undefined ? String(st.lSum) : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">Needed Right Sum</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.rTarget !== undefined ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.rTarget !== undefined ? String(st.rTarget) : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Min Diff</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.isNewMin ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.minDiff !== undefined && st.minDiff !== "MAX" ? String(st.minDiff) : '-'}
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Cell (i={st.activeI !== undefined ? String(st.activeI) : '-'})</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                              {st.activeI !== undefined && st.activeI < st.nums.length ? String(st.nums[st.activeI]) : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1">Count Taken</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-50 border-sky-300 text-sky-700`}>
                              {st.count !== undefined ? String(st.count) : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1">Current Sum</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-amber-50 border-amber-300 text-amber-700`}>
                              {st.currentSum !== undefined ? String(st.currentSum) : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Min Diff</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.isNewMin ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.minDiff !== undefined && st.minDiff !== "MAX" ? String(st.minDiff) : '-'}
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
                          
                          {selectedOpId === 'tabulation' && st.hlFail && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
                                  <div className="flex gap-4">
                                      {(st.mapSizes || []).map((s: number, idx: number) => (
                                          <div key={`m-${idx}`} className={`w-24 border-2 border-rose-400 bg-rose-50 flex flex-col justify-end overflow-hidden transition-all duration-700 ${s > 0 ? 'h-64 shadow-[0_0_50px_rgba(244,63,94,0.5)]' : 'h-12'}`}>
                                              <span className="text-center font-bold text-rose-800 text-xs py-2">{s} keys</span>
                                              <div className="w-full bg-rose-500 transition-all duration-700" style={{ height: `${Math.min(100, s/100)}%` }}></div>
                                          </div>
                                      ))}
                                  </div>
                                  <div className="text-rose-500 font-black mt-8 text-2xl uppercase tracking-widest bg-rose-50 px-6 py-2 rounded-xl border-2 border-rose-500 shadow-xl">Memory Limit Exceeded</div>
                              </div>
                          )}

                          {/* Split Array Rendering */}
                          {(selectedOpId !== 'tabulation') && (
                              <div className="absolute flex flex-col items-center justify-center w-full" style={{ top: `${startY}px`, left: '0', transform: 'translateY(-50%)' }}>
                                  
                                  {selectedOpId === 'spaceOptimized' ? (
                                      <div className="flex gap-16 relative">
                                          {/* Left Half Line */}
                                          <div className="absolute h-1 bg-sky-200 w-[calc(50%-2rem)] left-0 top-1/2 -translate-y-1/2 rounded-full z-0"></div>
                                          {/* Right Half Line */}
                                          <div className="absolute h-1 bg-fuchsia-200 w-[calc(50%-2rem)] right-0 top-1/2 -translate-y-1/2 rounded-full z-0"></div>
                                          
                                          <div className="flex gap-2 relative z-10 p-2 bg-white rounded-2xl shadow-sm border border-sky-100">
                                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-2 rounded border border-sky-200">Left Half (Size N)</span>
                                              {st.nums.slice(0, st.n).map((val: number, idx: number) => {
                                                  return (
                                                      <div key={`lnum-${idx}`} className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center font-mono font-black text-xl border-2 rounded-lg bg-sky-50 border-sky-300 text-sky-800 shadow-sm`}>
                                                          {val}
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                          <div className="flex gap-2 relative z-10 p-2 bg-white rounded-2xl shadow-sm border border-fuchsia-100">
                                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-2 rounded border border-fuchsia-200">Right Half (Size N)</span>
                                              {st.nums.slice(st.n, st.nums.length).map((val: number, idx: number) => {
                                                  return (
                                                      <div key={`rnum-${idx}`} className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center font-mono font-black text-xl border-2 rounded-lg bg-fuchsia-50 border-fuchsia-300 text-fuchsia-800 shadow-sm`}>
                                                          {val}
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center gap-12">
                                          <div className="flex gap-2 relative">
                                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400">nums[]</span>
                                              {st.nums.map((val: number, idx: number) => {
                                                  let isActive = st.activeI === idx && !st.isSuccess;
                                                  let isTaken = st.taken && st.taken[idx];
                                                  
                                                  let bgClass = "bg-white border-slate-300 text-slate-600 shadow-sm";
                                                  let scaleClass = "scale-100";

                                                  if (isActive) {
                                                      bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                                      scaleClass = "scale-125";
                                                  } else if (isTaken) {
                                                      bgClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl z-20";
                                                      scaleClass = "scale-110";
                                                  }

                                                  return (
                                                      <div key={`num-${idx}`} className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center font-mono font-black text-xl border-[2px] rounded-lg transition-all duration-300 ${scaleClass} ${bgClass}`}>
                                                          {val}
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                          
                                          {st.taken && (
                                              <div className="flex gap-12 w-full justify-center">
                                                  <div className="flex flex-col items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-md w-64 min-h-[150px]">
                                                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-4">Subset 1 (Taken)</span>
                                                      <div className="flex flex-wrap justify-center gap-2">
                                                          {st.nums.map((val: number, idx: number) => {
                                                              if(st.taken[idx]) return <div key={`s1-${idx}`} className="w-10 h-10 flex items-center justify-center font-mono font-bold border-2 rounded-lg bg-emerald-50 border-emerald-400 text-emerald-800">{val}</div>
                                                              return null;
                                                          })}
                                                      </div>
                                                  </div>
                                                  <div className="flex flex-col items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-md w-64 min-h-[150px]">
                                                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 mb-4">Subset 2 (Skipped)</span>
                                                      <div className="flex flex-wrap justify-center gap-2 opacity-50">
                                                          {st.nums.map((val: number, idx: number) => {
                                                              if(!st.taken[idx] && idx < (st.activeI !== undefined ? st.activeI : 0)) return <div key={`s2-${idx}`} className="w-10 h-10 flex items-center justify-center font-mono font-bold border-2 rounded-lg bg-rose-50 border-rose-400 text-rose-800">{val}</div>
                                                              return null;
                                                          })}
                                                      </div>
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  )}
                              </div>
                          )}
                          
                          {/* Render Meet in the Middle Lists */}
                          {selectedOpId === 'spaceOptimized' && st.leftLists && st.rightLists && !st.phase.startsWith('bs_') && (
                              <div className="absolute flex flex-col items-center w-full" style={{ top: `${startY + 80}px` }}>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 bg-white px-4 py-1 rounded-full shadow-sm border border-slate-200">Subset Sums Grouped by Size (K elements)</span>
                                  
                                  <div className="flex gap-8 md:gap-16 items-start">
                                      {/* Left Columns */}
                                      <div className="flex gap-4">
                                          {st.leftLists.map((list: number[], kIdx: number) => {
                                              let isMatching = st.k === kIdx && (st.phase.startsWith('match') || st.phase.startsWith('pick'));
                                              return (
                                                  <div key={`ll-${kIdx}`} className={`flex flex-col items-center transition-all duration-300 ${isMatching ? 'scale-110 -translate-y-2' : 'opacity-70 scale-95'}`}>
                                                      <span className={`text-[10px] font-bold mb-2 ${isMatching ? 'text-sky-600' : 'text-slate-400'}`}>Size {kIdx}</span>
                                                      <div className={`flex flex-col gap-1 p-2 rounded-xl border-2 transition-all ${isMatching ? 'bg-sky-50 border-sky-300 shadow-lg' : 'bg-slate-50 border-slate-200'}`}>
                                                          {list.length === 0 ? <div className="text-slate-300 text-xs italic p-2">Empty</div> : list.map((val, vIdx) => {
                                                              let isPicked = isMatching && st.lSum === val;
                                                              return (
                                                                  <div key={`llv-${kIdx}-${vIdx}`} className={`px-4 py-1.5 text-sm font-mono font-bold rounded border transition-all ${isPicked ? 'bg-sky-500 text-white border-sky-600 shadow-md ring-2 ring-sky-200 animate-pulse z-20' : 'bg-white border-slate-200 text-slate-600'}`}>
                                                                      {val}
                                                                  </div>
                                                              )
                                                          })}
                                                      </div>
                                                  </div>
                                              )
                                          })}
                                      </div>

                                      {/* Visual Divider */}
                                      <div className="flex items-center h-full">
                                          <Split size={24} className="text-slate-300 opacity-50"/>
                                      </div>

                                      {/* Right Columns */}
                                      <div className="flex gap-4">
                                          {st.rightLists.map((list: number[], kIdx: number) => {
                                              let isMatching = st.k !== undefined && st.n - st.k === kIdx && (st.phase.startsWith('match') || st.phase.startsWith('pick'));
                                              return (
                                                  <div key={`rl-${kIdx}`} className={`flex flex-col items-center transition-all duration-300 ${isMatching ? 'scale-110 -translate-y-2' : 'opacity-70 scale-95'}`}>
                                                      <span className={`text-[10px] font-bold mb-2 ${isMatching ? 'text-fuchsia-600' : 'text-slate-400'}`}>Size {kIdx}</span>
                                                      <div className={`flex flex-col gap-1 p-2 rounded-xl border-2 transition-all ${isMatching ? 'bg-fuchsia-50 border-fuchsia-300 shadow-lg' : 'bg-slate-50 border-slate-200'}`}>
                                                          {list.length === 0 ? <div className="text-slate-300 text-xs italic p-2">Empty</div> : list.map((val, vIdx) => {
                                                              return (
                                                                  <div key={`rlv-${kIdx}-${vIdx}`} className={`px-4 py-1.5 text-sm font-mono font-bold rounded border transition-all bg-white border-slate-200 text-slate-600`}>
                                                                      {val}
                                                                  </div>
                                                              )
                                                          })}
                                                      </div>
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* Specific Binary Search Visualization */}
                          {selectedOpId === 'spaceOptimized' && st.phase.startsWith('bs_') && st.rList && (
                              <div className="absolute flex flex-col items-center w-full animate-in slide-in-from-bottom-10 fade-in duration-500" style={{ top: `${startY + 150}px` }}>
                                  <div className="bg-white p-6 rounded-3xl border-2 border-fuchsia-200 shadow-xl flex flex-col items-center w-fit relative overflow-visible">
                                      <span className="absolute -top-4 bg-fuchsia-100 text-fuchsia-700 font-black uppercase text-[10px] px-4 py-1 rounded-full border border-fuchsia-300 shadow-sm">
                                          Binary Searching Right List (Size {st.n - st.k})
                                      </span>
                                      
                                      <div className="flex gap-3 mt-4 mb-8">
                                          {st.rList.map((val: number, idx: number) => {
                                              let isMid = st.bsMid === idx;
                                              let isLow = st.bsLow === idx;
                                              let isHigh = st.bsHigh === idx;
                                              let isResult = (st.phase === 'bs_check1' || st.phase === 'bs_check2') && st.idx === idx;
                                              
                                              return (
                                                  <div key={`bs-${idx}`} className="relative flex flex-col items-center">
                                                      {isLow && <div className="absolute -top-6 text-[10px] font-bold text-sky-500">LOW</div>}
                                                      {isHigh && <div className="absolute -bottom-6 text-[10px] font-bold text-rose-500">HIGH</div>}
                                                      {isMid && <div className="absolute -top-10 text-[10px] font-bold text-amber-500 animate-bounce">MID</div>}
                                                      
                                                      <div className={`w-14 h-14 flex items-center justify-center font-mono font-black text-xl border-[3px] rounded-xl transition-all duration-300 ${isResult ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 z-20 scale-125 shadow-lg' : isMid ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 z-10' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                         {val}
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Partition Array to Minimize Sum Difference</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Meet in the Middle
                  </span>
                  <span>•</span>
                  <span>LeetCode 2035</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Scale size={28}/> Balancing Exactly N Elements</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an integer array <code>nums</code> of <code>2 * n</code> integers. You need to partition <code>nums</code> into <strong>two arrays of length <code>n</code></strong> to minimize the absolute difference of the sums of the arrays.</p>
                        <p>To partition <code>nums</code>, put each element of <code>nums</code> into one of the two arrays. Return the minimum possible absolute difference.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [3,9,7,3]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">2</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">One optimal partition is: [3,9] and [7,3].<br/>The absolute difference is |(3 + 9) - (7 + 3)| = 2.</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> nums = [2,-1,0,4,-2,-9]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">0</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">One optimal partition is: [2,4,-9] and [-1,0,-2].<br/>The absolute difference is |(2 + 4 + -9) - (-1 + 0 + -2)| = 0.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= n &lt;= 15</li>
                            <li>nums.length == 2 * n</li>
                            <li>-10^7 &lt;= nums[i] &lt;= 10^7</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ShieldAlert size={16} className="text-rose-500"/> Why Standard DP Fails Here</h4>
                        <p className="text-sm leading-relaxed">Unlike standard "Subset Sum" problems, the elements can be negative and up to 10^7. A DP array indexing sums would require size 15 * 10^7 = 1.5 * 10^8 booleans! Attempting to cache using a Map (Top-Down) also causes Time/Memory Limit Exceeded. <strong>Standard DP is structurally impossible for this problem!</strong></p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><SplitSquareHorizontal size={16} className={`text-${themeColor}-500`}/> The "Meet in the Middle" Paradigm</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The array length is small (max 30). While O(2^30) is too slow, O(2^15) is instant! We split the array perfectly in half. We generate all combinations for both halves independently. Then, using Binary Search, we efficiently mix and match subsets from the Left and Right halves to form exactly size N.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Numbers Array (Max 6 elements, must be even length)</label>
                            <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="3, 9, 7, 3" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : (st.isFail ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
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
                                <PartyPopper size={24}/> EXECUTION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Minimum Difference found!
                            </p>
                         </div>
                    ) : st.isFail ? (
                        <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-rose-400`}>
                                <ShieldAlert size={24}/> EXECUTION HALTED
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Generating permutations via Tabulation directly triggers MLE on LeetCode!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase && st.phase.startsWith('bs') ? 'text-fuchsia-400' : (st.hlTargetInit || st.phase === 'sort' || st.phase === 'split' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Scale size={14} className={`text-${themeColor}-500`}/> Dynamic Visualization</span>
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
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why no arrays?</strong> We rely purely on the Call Stack memory. We recursively traverse the array elements. For each element, we generate two distinct universes: one where we TAKE the element (incrementing count and sum), and one where we DO NOT TAKE it. When we pick exactly N items, we check the difference.</p>
                        <p className="text-slate-800 font-bold bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 w-fit">Time: O(2^(2N)) | Space: O(N)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Because we branch exactly 2 ways at every single step, the time complexity is heavily exponential O(2^(2N)). The space is O(N) due to the maximum depth of the recursive call stack equaling the array length.</p>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 2. Memoization (Top-Down)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a Map?</strong> We declare a <code>HashMap</code> because the exact state of our recursive subproblem is defined by three variables: the current index <code>i</code>, the <code>count</code> of elements picked, and the <code>currentSum</code>. We cannot use a 3D array because the sum could be negative or massive. We cache the results as Strings.</p>
                        <p className="text-slate-800 font-bold bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 w-fit">Time: O(N * Target) | Space: O(N * Target)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">However, caching string combinations in this context is notoriously slow and memory-intensive. On LeetCode, it directly causes Memory Limit Exceeded or Time Limit Exceeded due to the overhead of string hashing and massive sum domains.</p>
                    </div>

                    {/* Approach 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-fuchsia-500"/> 3. Tabulation (Bottom-Up)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a List of Maps?</strong> We try to flip the recursion into an iterative process. We keep an array of <code>Maps</code> where index <code>k</code> holds all reachable sums using exactly <code>k</code> elements. We iteratively push new sums into these maps as we evaluate numbers.</p>
                        <p className="text-slate-800 font-bold bg-fuchsia-100 px-3 py-1.5 rounded-lg border border-fuchsia-200 w-fit">Time: O(N * Sums) | Space: MLE</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This still results in massive Map sizes that crash memory limits. Generating the permutations sequentially without an upper integer bound is systematically impossible for this LeetCode constraint.</p>
                    </div>

                    {/* Approach 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 4. Space Optimized (Meet in the Middle)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why Meet in the Middle?</strong> If 2^30 operations takes over 1 billion steps, we can split it in half! 2^15 operations takes only 32,768 steps! We independently calculate every combination of sums for the first half, and every combination for the second half.</p>
                        <p className="text-slate-600 leading-relaxed"><strong>The Binary Search:</strong> To form a valid partition, if we pick <code>k</code> elements from the left half with sum <code>L</code>, we must pick <code>n - k</code> elements from the right half! We sort the right half's permutations, and use Binary Search to instantly find the value closest to <code>target - L</code>. We never process impossible memory states.</p>
                        <p className="text-slate-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">Time: O(N * 2^N) | Space: O(2^N)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This drastically cuts both time and space by evaluating small 2^N combinations independently and pairing them using fast O(log(2^N)) searches, safely securing an optimal run.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem is designed to break standard DP logic. The interviewer wants to test your knowledge of algorithm bounds and see if you can pivot to Meet-in-the-Middle when DP memory constraints fail."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why can't we use a standard 2D DP boolean array like we do in Subset Sum?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because of the possibility of negative numbers and the sheer size of the elements."</p>
                            <p>In standard subset sum, elements are usually positive and small (e.g., nums[i] &lt;= 100). Here, the elements range from -10^7 to 10^7. A 2D array would need columns covering every possible sum, requiring arrays of size hundreds of millions, which instantly triggers an OutOfMemory Exception. Meet-in-the-middle bypasses this by only storing the 2^15 actual combinations produced."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "When searching the right half, why do we use `target = sum / 2` and binary search?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To guarantee the minimal difference between the two arrays."</p>
                            <p>If we want two arrays to have sums as close to each other as possible, we want their individual sums to be as close to exactly half of the total sum as possible. If we picked a left combination of sum <code>L</code>, we want a right combination of sum <code>R</code> such that <code>L + R \approx totalSum / 2</code>. We binary search the sorted right half to find the available <code>R</code> that satisfies this closest match."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "What does `idx = -(idx + 1)` mean in the Binary Search?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It decodes Java's built-in Collections.binarySearch negative result."</p>
                            <p>When Java's <code>binarySearch</code> cannot find an exact match, it returns <code>-(insertion_point) - 1</code>. By reverting the math via <code>-(idx + 1)</code>, we extract the exact index where the target <em>would</em> be inserted. We then simply check the element at that insertion point (the closest value greater than target) and the element just before it (the closest value lesser than target) to see which yields a smaller global difference."</p>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : (st.isFail ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700')}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase && st.phase.startsWith('bs') ? 'text-fuchsia-400' : (st.hlTargetInit || st.phase === 'sort' || st.phase === 'split' ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <input type="text" value={numsInput} onChange={(e) => setNumsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="3, 9, 7, 3" />
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