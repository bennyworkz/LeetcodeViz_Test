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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Target, Brackets, Smartphone, Globe, Grid, Crown, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box, Square, Scale, AlignCenter
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
    public int minInsertions(String s) {
        int lps = lps(s, 0, s.length() - 1);
        return s.length() - lps;
    }
    
    private int lps(String s, int i, int j) {
        if (i == j) return 1;
        if (i > j) return 0;
        
        if (s.charAt(i) == s.charAt(j)) {
            return 2 + lps(s, i + 1, j - 1);
        }
        
        int skipLeft = lps(s, i + 1, j);
        int skipRight = lps(s, i, j - 1);
        
        return Math.max(skipLeft, skipRight);
    }
}`,
    desc: "The Recursive Approach: To find the minimum insertions to make a palindrome, we just need to find the Longest Palindromic Subsequence (LPS). The answer is simply (String Length - LPS). We recursively check the outer characters (i and j). If they match, they contribute 2 to the LPS, and we shrink both sides. If they don't match, we must skip one of them and find the max LPS of the remaining substrings. This 2-way branching creates an exponential O(2^N) time complexity."
  },
  memoization: {
    id: 'memoization',
    title: '2. Memoization (Top-Down)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N^2) | Space: O(N^2)',
    theme: 'sky',
    code: `class Solution {
    public int minInsertions(String s) {
        int n = s.length();
        Integer[][] memo = new Integer[n][n];
        int lps = lps(s, 0, n - 1, memo);
        return n - lps;
    }
    
    private int lps(String s, int i, int j, Integer[][] memo) {
        if (i == j) return 1;
        if (i > j) return 0;
        
        if (memo[i][j] != null) return memo[i][j];
        
        if (s.charAt(i) == s.charAt(j)) {
            return memo[i][j] = 2 + lps(s, i + 1, j - 1, memo);
        }
        
        int skipLeft = lps(s, i + 1, j, memo);
        int skipRight = lps(s, i, j - 1, memo);
        
        return memo[i][j] = Math.max(skipLeft, skipRight);
    }
}`,
    desc: "The Top-Down DP Approach: We notice that our recursive function is uniquely defined by two state variables: the starting index 'i', and the ending index 'j'. We declare a 2D cache array 'memo[i][j]'. Before branching into the expensive skipLeft/skipRight paths, we check the cache. If the subproblem is already solved, we return the cached result. This completely prunes overlapping branch calculations, shifting time to O(N^2)."
  },
  tabulation: {
    id: 'tabulation',
    title: '3. Tabulation (Bottom-Up)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(N^2) | Space: O(N^2)',
    theme: 'fuchsia',
    code: `class Solution {
    public int minInsertions(String s) {
        int n = s.length();
        int[][] dp = new int[n][n];
        
        for (int i = 0; i < n; i++) dp[i][i] = 1;
        
        for (int i = n - 2; i >= 0; i--) {
            for (int j = i + 1; j < n; j++) {
                if (s.charAt(i) == s.charAt(j)) {
                    dp[i][j] = 2 + dp[i + 1][j - 1];
                } else {
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }
        return n - dp[0][n - 1];
    }
}`,
    desc: "The Bottom-Up DP Approach: We invert the recursion. We build a 2D table where dp[i][j] stores the LPS of the substring from index i to j. We initialize the diagonal (i == j) to 1, since single characters are palindromes of length 1. We must iterate 'i' BACKWARDS (from n-2 down to 0) because calculating dp[i][j] requires dp[i+1][j] (the row below it). We iterate 'j' forwards. The final LPS is at dp[0][n-1]."
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '4. Space Optimized (1D DP)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N^2) | Space: O(N)',
    theme: 'emerald',
    code: `class Solution {
    public int minInsertions(String s) {
        int n = s.length();
        int[] dp = new int[n];
        
        for (int i = n - 1; i >= 0; i--) {
            dp[i] = 1;
            int prev = 0;
            for (int j = i + 1; j < n; j++) {
                int temp = dp[j];
                if (s.charAt(i) == s.charAt(j)) {
                    dp[j] = 2 + prev;
                } else {
                    dp[j] = Math.max(dp[j], dp[j - 1]);
                }
                prev = temp;
            }
        }
        return n - dp[n - 1];
    }
}`,
    desc: "The Ultimate Optimization: In Tabulation, to compute row 'i', we ONLY need row 'i+1' (the row directly below it) and the current row 'i'. We can compress the entire 2D matrix into a single 1D array representing the 'previous' row! The only trick is dp[i+1][j-1] (the bottom-left diagonal cell), which gets overwritten by dp[j-1] before we can use it. We use a single 'prev' variable to safely cache it. Memory drops from O(N^2) to strictly O(N)!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|minInsertions|s|lps|length|i|j|charAt|skipLeft|skipRight|Math|max|memo|Integer|null|n|dp|prev|temp)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isPointer = ['s', 'lps', 'i', 'j', 'skipLeft', 'skipRight', 'memo', 'n', 'dp', 'prev', 'temp'].includes(part);
            const isMapCall = ['minInsertions', 'length', 'charAt', 'max'].includes(part);
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

export default function MinInsertionsVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [strInput, setStrInput] = useState('mbadm');
  const [baseStr, setBaseStr] = useState<string>('mbadm');

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
      let parsed = strInput.trim().replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (parsed.length === 0) parsed = "mbadm";
      if (parsed.length > 8) parsed = parsed.slice(0, 8); // Safety cap for visualizer DP Grid limits
      setBaseStr(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [strInput, selectedOpId]);

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
    const s = baseStr;
    const n = s.length;

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { s, n, ...st } 
    });

    if (selectedOpId === 'recursion') {
        add("Function Call", `public int minInsertions(String s="${s}")`, 2, { hlInit: true });
        add("Call LPS", `int lps = lps(s, 0, s.length() - 1);\nFinding Longest Palindromic Subsequence to compute insertions.`, 3, { hlLpsCall: true });

        const lps = (i: number, j: number): number => {
            if (steps.length > 1000) return 0;
            
            add("DFS Call", `private int lps(String s, int i=${i}, int j=${j})\nEvaluating substring: "${s.substring(i, j + 1)}"`, 7, { activeI: i, activeJ: j });

            if (i === j) {
                add("Base Case 1", `if (i == j) return 1;\nSingle character '${s[i]}' is a palindrome of length 1.`, 8, { activeI: i, activeJ: j, hlBase1: true });
                return 1;
            }
            if (i > j) {
                add("Base Case 2", `if (i > j) return 0;\nPointers crossed, returning 0.`, 9, { activeI: i, activeJ: j, hlBase2: true });
                return 0;
            }

            if (s[i] === s[j]) {
                add("Match Found", `if (s.charAt(i) == s.charAt(j))\nCharacters '${s[i]}' match! They contribute 2 to LPS. Shrinking both bounds.`, 11, { activeI: i, activeJ: j, hlMatchCheck: true, isMatch: true });
                add("Match Recursive Call", `return 2 + lps(s, i + 1, j - 1);`, 12, { activeI: i, activeJ: j, hlMatchReturn: true, nextI: i+1, nextJ: j-1 });
                let inner = lps(i + 1, j - 1);
                add("Match Evaluated", `return 2 + lps(...);\nInner LPS returned ${inner}. Total = ${2 + inner}.`, 12, { activeI: i, activeJ: j, hlMatchReturn: true, res: 2 + inner });
                return 2 + inner;
            }

            add("Mismatch", `s.charAt(${i}) != s.charAt(${j})\nCharacters '${s[i]}' and '${s[j]}' do NOT match. Branching to skip one at a time.`, 11, { activeI: i, activeJ: j, hlMatchCheck: true, isMatch: false });
            
            add("Branch: Skip Left", `int skipLeft = lps(s, i + 1, j);\nSkipping left char '${s[i]}'.`, 15, { activeI: i, activeJ: j, hlSkipLeft: true, nextI: i+1, nextJ: j });
            let skipLeft = lps(i + 1, j);

            add("Branch: Skip Right", `int skipRight = lps(s, i, j - 1);\nSkipping right char '${s[j]}'.`, 16, { activeI: i, activeJ: j, hlSkipRight: true, nextI: i, nextJ: j-1 });
            let skipRight = lps(i, j - 1);

            let res = Math.max(skipLeft, skipRight);
            add("Return Max", `return Math.max(skipLeft, skipRight);\nMax(skipLeft:${skipLeft}, skipRight:${skipRight}) = ${res}.`, 18, { activeI: i, activeJ: j, hlReturn: true, res, skipLeft, skipRight });
            return res;
        };

        let finalLps = lps(0, n - 1);
        add("Calculate Insertions", `return s.length() - lps;\nString Length (${n}) - LPS (${finalLps}) = Minimum Insertions (${n - finalLps}).`, 4, { isSuccess: true, finalLps, finalAns: n - finalLps });

    } else if (selectedOpId === 'memoization') {
        add("Function Call", `public int minInsertions(String s="${s}")`, 2, { hlInit: true });
        
        let memo: (number | null)[][] = Array.from({length: n}, () => new Array(n).fill(null));
        add("Init Cache", `Integer[][] memo = new Integer[n][n];\nAllocated 2D cache to prevent redundant evaluations of (i, j) substrings.`, 4, { hlMemoInit: true, memo: clone2D(memo) });

        add("Call LPS", `int lps = lps(s, 0, n - 1, memo);`, 5, { hlLpsCall: true, memo: clone2D(memo) });

        const lps = (i: number, j: number): number => {
            if (steps.length > 1000) return 0;
            
            add("DFS Call", `private int lps(..., int i=${i}, int j=${j}, memo)`, 9, { activeI: i, activeJ: j, memo: clone2D(memo) });

            if (i === j) {
                add("Base Case 1", `if (i == j) return 1;`, 10, { activeI: i, activeJ: j, hlBase1: true, memo: clone2D(memo) });
                return 1;
            }
            if (i > j) {
                add("Base Case 2", `if (i > j) return 0;`, 11, { activeI: i, activeJ: j, hlBase2: true, memo: clone2D(memo) });
                return 0;
            }

            if (memo[i][j] !== null) {
                add("Cache Hit", `if (memo[i][j] != null) return memo[i][j];\nSubproblem already solved! Returning cached value ${memo[i][j]}.`, 13, { activeI: i, activeJ: j, hlCacheHit: true, cachedVal: memo[i][j], memo: clone2D(memo) });
                return memo[i][j] as number;
            }

            if (s[i] === s[j]) {
                add("Match Found", `if (s.charAt(i) == s.charAt(j))`, 15, { activeI: i, activeJ: j, hlMatchCheck: true, isMatch: true, memo: clone2D(memo) });
                add("Match Recursive Call", `return memo[i][j] = 2 + lps(...);`, 16, { activeI: i, activeJ: j, hlMatchReturn: true, nextI: i+1, nextJ: j-1, memo: clone2D(memo) });
                let inner = lps(i + 1, j - 1);
                memo[i][j] = 2 + inner;
                add("Cache & Return", `return memo[i][j] = 2 + lps(...);\nStored ${2 + inner} in cache and returning.`, 16, { activeI: i, activeJ: j, hlMatchReturn: true, res: 2 + inner, memo: clone2D(memo) });
                return 2 + inner;
            }

            add("Mismatch", `s.charAt(${i}) != s.charAt(${j})\nBranching to evaluate skips.`, 15, { activeI: i, activeJ: j, hlMatchCheck: true, isMatch: false, memo: clone2D(memo) });
            
            add("Branch: Skip Left", `int skipLeft = lps(s, i + 1, j, memo);`, 19, { activeI: i, activeJ: j, hlSkipLeft: true, nextI: i+1, nextJ: j, memo: clone2D(memo) });
            let skipLeft = lps(i + 1, j);

            add("Branch: Skip Right", `int skipRight = lps(s, i, j - 1, memo);`, 20, { activeI: i, activeJ: j, hlSkipRight: true, nextI: i, nextJ: j-1, memo: clone2D(memo) });
            let skipRight = lps(i, j - 1);

            let res = Math.max(skipLeft, skipRight);
            memo[i][j] = res;
            add("Cache & Return", `return memo[i][j] = Math.max(skipLeft, skipRight);\nStored max(${skipLeft}, ${skipRight}) = ${res} in cache.`, 22, { activeI: i, activeJ: j, hlReturn: true, res, skipLeft, skipRight, memo: clone2D(memo) });
            return res;
        };

        let finalLps = lps(0, n - 1);
        add("Calculate Insertions", `return n - lps;\nString Length (${n}) - LPS (${finalLps}) = Minimum Insertions (${n - finalLps}).`, 6, { isSuccess: true, finalLps, finalAns: n - finalLps, memo: clone2D(memo) });

    } else if (selectedOpId === 'tabulation') {
        add("Function Call", `public int minInsertions(String s="${s}")`, 2, { hlInit: true });
        
        let dp: number[][] = Array.from({length: n}, () => new Array(n).fill(0));
        add("Init DP Grid", `int[][] dp = new int[n][n];\nAllocated 2D table representing start index 'i' vs end index 'j'.`, 4, { hlDpInit: true, dp: clone2D(dp) });

        for (let i = 0; i < n; i++) dp[i][i] = 1;
        add("Seed DP Base Case", `for (int i = 0; i < n; i++) dp[i][i] = 1;\nSingle characters are palindromes of length 1 (Diagonal setup).`, 6, { hlSeed: true, dp: clone2D(dp) });

        for (let i = n - 2; i >= 0; i--) {
            add("Outer Loop (i - Bottom Up)", `for (int i = n - 2; i >= 0; i--)\nEvaluating start index ${i}. Crucially moving BACKWARDS!`, 8, { activeI: i, hlLoopI: true, dp: clone2D(dp) });
            
            for (let j = i + 1; j < n; j++) {
                add("Inner Loop (j)", `for (int j = i + 1; j < n; j++)\nEvaluating end index ${j}.`, 9, { activeI: i, activeJ: j, hlLoopJ: true, dp: clone2D(dp) });
                
                if (s[i] === s[j]) {
                    dp[i][j] = 2 + dp[i + 1][j - 1];
                    add("Match - DP Calculation", `dp[i][j] = 2 + dp[i + 1][j - 1];\n'${s[i]}' == '${s[j]}'! Inheriting LPS from inner substring dp[${i+1}][${j-1}] and adding 2. New LPS = ${dp[i][j]}.`, 11, { activeI: i, activeJ: j, hlMatchCalc: true, isMatch: true, dp: clone2D(dp), diagVal: dp[i+1][j-1] });
                } else {
                    let skipLeft = dp[i + 1][j];
                    let skipRight = dp[i][j - 1];
                    dp[i][j] = Math.max(skipLeft, skipRight);
                    add("Mismatch - DP Calculation", `dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);\n'${s[i]}' != '${s[j]}'. Max of skip left (${skipLeft}) and skip right (${skipRight}) = ${dp[i][j]}.`, 13, { activeI: i, activeJ: j, hlMismatchCalc: true, isMatch: false, dp: clone2D(dp), skipLeft, skipRight });
                }
            }
        }
        
        let finalLps = dp[0][n - 1];
        add("Return Result", `return n - dp[0][n - 1];\nLength (${n}) - LPS (${finalLps}) = Minimum Insertions (${n - finalLps}).`, 17, { isSuccess: true, finalLps, finalAns: n - finalLps, dp: clone2D(dp) });

    } else if (selectedOpId === 'spaceOptimized') {
        add("Function Call", `public int minInsertions(String s="${s}")`, 2, { hlInit: true });
        
        let dp: number[] = new Array(n).fill(0);
        add("Init 1D DP Array", `int[] dp = new int[n];\nAllocated 1D array to save space! This tracks the 'previous row' in tabulation.`, 4, { hlDpInit: true, dp: clone1D(dp) });

        for (let i = n - 1; i >= 0; i--) {
            add("Outer Loop (i)", `for (int i = n - 1; i >= 0; i--)\nEvaluating start index ${i}. Moving backwards.`, 6, { activeI: i, hlLoopI: true, dp: clone1D(dp) });
            
            dp[i] = 1;
            let prev = 0;
            add("Setup Row State", `dp[i] = 1;\nint prev = 0;\nSetting diagonal dp[i][i] = 1. 'prev' variable holds 0 initially.`, 8, { activeI: i, hlRowSetup: true, dp: clone1D(dp), prev });

            for (let j = i + 1; j < n; j++) {
                add("Inner Loop (j)", `for (int j = i + 1; j < n; j++)\nEvaluating end index ${j}.`, 9, { activeI: i, activeJ: j, hlLoopJ: true, dp: clone1D(dp), prev });
                
                let temp = dp[j];
                add("Save Temp", `int temp = dp[j];\nSaving current dp[${j}] (${temp}) into 'temp'. This represents dp[i+1][j], which will become the bottom-left diagonal (dp[i+1][j-1]) for the NEXT column j+1!`, 10, { activeI: i, activeJ: j, hlTemp: true, dp: clone1D(dp), prev, temp });

                if (s[i] === s[j]) {
                    dp[j] = 2 + prev;
                    add("Match - DP In-Place Update", `dp[j] = 2 + prev;\n'${s[i]}' == '${s[j]}'! We add 2 to 'prev' (which reliably holds the old diagonal value). Overwriting dp[${j}] = ${dp[j]}.`, 12, { activeI: i, activeJ: j, hlMatchCalc: true, isMatch: true, dp: clone1D(dp), prev, temp });
                } else {
                    let oldVal = dp[j]; // essentially skip left
                    let leftVal = dp[j - 1]; // essentially skip right
                    dp[j] = Math.max(oldVal, leftVal);
                    add("Mismatch - DP In-Place Update", `dp[j] = Math.max(dp[j], dp[j - 1]);\n'${s[i]}' != '${s[j]}'. Max of skip left (${oldVal}) and skip right (${leftVal}) = ${dp[j]}.`, 14, { activeI: i, activeJ: j, hlMismatchCalc: true, isMatch: false, dp: clone1D(dp), prev, temp, oldVal, leftVal });
                }
                
                prev = temp;
                add("Shift Prev", `prev = temp;\nUpdating 'prev' to ${temp} so the next iteration can use it as its diagonal!`, 16, { activeI: i, activeJ: j, hlShiftPrev: true, dp: clone1D(dp), prev, temp });
            }
        }
        
        let finalLps = dp[n - 1];
        add("Return Result", `return n - dp[n - 1];\nLength (${n}) - LPS (${finalLps}) = Minimum Insertions (${n - finalLps}).`, 19, { isSuccess: true, finalLps, finalAns: n - finalLps, dp: clone1D(dp) });
    }

    return steps;
  }, [baseStr, selectedOpId]);

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
      if (st.s === undefined) return null;

      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-slate-200'} scale-105 z-40`}>
              
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-emerald-600`}>
                          <Trophy size={16}/> 
                          Minimum Insertions Required
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-emerald-700 bg-emerald-100 border-emerald-400`}>
                          Length ({st.n}) - LPS ({st.finalLps}) = {st.finalAns}
                      </div>
                  </div>
              ) : selectedOpId === 'tabulation' || selectedOpId === 'spaceOptimized' ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Start Index (i)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoopI || st.hlRowSetup ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeI !== undefined ? st.activeI : '-'}
                          </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">End Index (j)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlLoopJ || st.hlMatchCalc || st.hlMismatchCalc ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                              {st.activeJ !== undefined ? st.activeJ : '-'}
                          </div>
                      </div>
                      {selectedOpId === 'spaceOptimized' && (
                          <>
                              <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-rose-500 mb-1">temp</span>
                                  <div className={`border-2 text-xl font-black px-4 py-2 rounded-2xl transition-all duration-300 ${st.hlTemp ? 'bg-rose-100 border-rose-400 text-rose-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                      {st.temp !== undefined ? st.temp : '-'}
                                  </div>
                              </div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">prev</span>
                                  <div className={`border-2 text-xl font-black px-4 py-2 rounded-2xl transition-all duration-300 ${st.hlRowSetup || st.hlShiftPrev || st.hlMatchCalc ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                      {st.prev !== undefined ? st.prev : '-'}
                                  </div>
                              </div>
                          </>
                      )}
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> LPS (dp[j])</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlMatchCalc || st.hlMismatchCalc ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.dp && st.activeJ !== undefined ? (selectedOpId === 'tabulation' ? st.dp[st.activeI][st.activeJ] : st.dp[st.activeJ]) : '-'}
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-amber-500 mb-1">Start Index (i)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-amber-50 border-amber-300 text-amber-700`}>
                              {st.activeI !== undefined ? st.activeI : '-'}
                          </div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-sky-500 mb-1">End Index (j)</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-50 border-sky-300 text-sky-700`}>
                              {st.activeJ !== undefined ? st.activeJ : '-'}
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Returned LPS</span>
                          <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlReturn || st.hlMatchReturn || st.hlBase1 || st.hlBase2 ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                              {st.res !== undefined ? st.res : '-'}
                          </div>
                      </div>
                  </div>
              )}

          </div>
      );
  };

  const renderVisuals = () => {
      if (st.s === undefined) return <span className="text-slate-400 italic">empty</span>;

      const nodeWidth = 44;
      const nodeGap = 6;
      const totalSize = nodeWidth + nodeGap;
      
      const arrWidth = st.s.length * totalSize;
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
                          
                          {/* String Array Rendering */}
                          <div className="absolute flex flex-col items-center gap-12 w-full" style={{ top: `${startY}px`, left: '0', transform: 'translateY(-50%)' }}>
                              <div className="flex gap-2 relative">
                                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400">s (Input String)</span>
                                  {st.s.split('').map((char: string, idx: number) => {
                                      let isI = st.activeI === idx && !st.isSuccess;
                                      let isJ = st.activeJ === idx && !st.isSuccess;
                                      let isBoth = isI && isJ;
                                      
                                      let isMatching = st.isMatch === true && (isI || isJ);
                                      let isMismatching = st.isMatch === false && (isI || isJ);

                                      let bgClass = "bg-white border-slate-300 text-slate-600 shadow-sm";
                                      let scaleClass = "scale-100";

                                      if (isMatching) {
                                          bgClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl ring-4 ring-emerald-200 z-30";
                                          scaleClass = "scale-125";
                                      } else if (isMismatching) {
                                          bgClass = "bg-rose-100 border-rose-500 text-rose-900 shadow-xl ring-4 ring-rose-200 z-30";
                                          scaleClass = "scale-125";
                                      } else if (isI) {
                                          bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                          scaleClass = "scale-110";
                                      } else if (isJ) {
                                          bgClass = "bg-sky-100 border-sky-500 text-sky-900 shadow-xl ring-4 ring-sky-200 z-30";
                                          scaleClass = "scale-110";
                                      }

                                      return (
                                          <div key={`char-${idx}`} className={`relative flex flex-col items-center transition-all duration-500 z-20`}>
                                              {isI && !isBoth && <span className="absolute -top-6 text-[10px] font-black uppercase text-amber-600">i</span>}
                                              {isJ && !isBoth && <span className="absolute -top-6 text-[10px] font-black uppercase text-sky-600">j</span>}
                                              {isBoth && <span className="absolute -top-6 text-[10px] font-black uppercase text-fuchsia-600">i,j</span>}
                                              
                                              <div className={`w-[${nodeWidth}px] h-[${nodeWidth}px] flex items-center justify-center font-mono font-black text-2xl border-[2px] rounded-lg transition-all duration-300 ${scaleClass} ${bgClass}`}>
                                                  {char}
                                              </div>
                                              <span className="text-[10px] font-mono text-slate-400 mt-1">{idx}</span>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>

                          {/* Render DP Array for Tabulation/Space Optimized */}
                          {(selectedOpId === 'tabulation' || selectedOpId === 'spaceOptimized') && st.dp && (
                              <div className="absolute flex flex-col items-center w-full" style={{ top: `${startY + 80}px` }}>
                                  
                                  {/* Tabulation 2D Grid */}
                                  {selectedOpId === 'tabulation' && (
                                      <div className="flex flex-col items-center w-full max-w-4xl overflow-x-auto pb-4">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm">dp[][] (2D LPS Grid)</span>
                                          
                                          <div className="flex flex-col gap-1 p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                                              <div className="flex gap-1 mb-1 items-center">
                                                  <div className="w-8 h-4 text-[8px] font-bold text-slate-400 text-right pr-2 uppercase">End j</div>
                                                  {st.dp[0].map((_, c) => <div key={`hc-${c}`} className="w-10 flex justify-center text-[10px] font-mono font-bold text-sky-500">{c}</div>)}
                                              </div>
                                              {st.dp.map((rowArr: number[], r: number) => (
                                                  <div key={`dp-r-${r}`} className="flex gap-1 items-center">
                                                      <span className="w-8 text-right text-[10px] font-mono font-bold text-amber-600 pr-2">
                                                          {r}
                                                      </span>
                                                      {rowArr.map((val: number, c: number) => {
                                                          let isUpdating = (st.hlMatchCalc || st.hlMismatchCalc) && st.activeI === r && st.activeJ === c && !st.isSuccess;
                                                          let isDiagSource = st.hlMatchCalc && st.activeI === r - 1 && st.activeJ === c + 1; // It reads dp[i+1][j-1], meaning row is r-1 in this scope logically? No, st.activeI is i. So it reads r == st.activeI + 1 and c == st.activeJ - 1.
                                                          let isLeftSource = st.hlMismatchCalc && st.activeI === r && st.activeJ === c + 1; // Reads dp[i][j-1]
                                                          let isBotSource = st.hlMismatchCalc && st.activeI === r - 1 && st.activeJ === c; // Reads dp[i+1][j]

                                                          let isSource = isDiagSource || isLeftSource || isBotSource;
                                                          let isBaseDiag = r === c && val === 1;

                                                          let boxBg = val > 0 ? (isBaseDiag ? "bg-slate-100 border-slate-300 text-slate-500" : "bg-slate-700 border-slate-800 text-white") : "bg-slate-50 border-slate-200 text-transparent"; // transparent to hide 0s nicely
                                                          if(val === 0) boxBg = "bg-white border-slate-100 text-slate-200";

                                                          let zIndex = "z-0";
                                                          
                                                          if (isUpdating) {
                                                              boxBg = "bg-fuchsia-400 border-fuchsia-600 text-white ring-4 ring-fuchsia-200 scale-110 shadow-xl animate-pulse";
                                                              zIndex = "z-20";
                                                          } else if (isSource) {
                                                              boxBg = "bg-emerald-400 border-emerald-600 text-white ring-4 ring-emerald-200 scale-110 z-20 shadow-lg";
                                                              zIndex = "z-10";
                                                          }
                                                          
                                                          if (st.isSuccess && r === 0 && c === st.n - 1) {
                                                              boxBg = "bg-fuchsia-500 border-fuchsia-700 text-white ring-4 ring-fuchsia-200 scale-125 shadow-xl z-30";
                                                          }

                                                          return (
                                                              <div key={`dp-${r}-${c}`} className={`w-10 h-10 flex items-center justify-center font-mono font-bold text-[12px] border-[2px] rounded-md transition-all duration-300 ${boxBg} ${zIndex}`}>
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
                                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-6 shadow-sm">dp[] (1D Array updating in-place!)</span>
                                          
                                          <div className="flex gap-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-md relative">
                                              
                                              {st.dp.map((val: number, idx: number) => {
                                                  let isUpdating = (st.hlMatchCalc || st.hlMismatchCalc || st.hlTemp || st.hlShiftPrev || st.hlRowSetup) && st.activeJ === idx && !st.isSuccess;
                                                  let isSourceLeft = st.hlMismatchCalc && st.activeJ === idx + 1; // Reading dp[j-1]
                                                  
                                                  let boxBg = val > 0 ? "bg-slate-700 border-slate-800 text-white shadow-sm" : "bg-slate-50 border-slate-300 text-slate-300";
                                                  
                                                  if (isUpdating) {
                                                      if(st.hlTemp) boxBg = "bg-rose-400 border-rose-600 text-white ring-4 ring-rose-200 scale-110 shadow-xl z-20";
                                                      else boxBg = "bg-fuchsia-500 border-fuchsia-700 text-white ring-4 ring-fuchsia-200 scale-110 shadow-xl z-20 animate-pulse";
                                                  } else if (isSourceLeft) {
                                                      boxBg = "bg-sky-400 border-sky-600 text-white ring-4 ring-sky-200 scale-110 z-20 shadow-lg";
                                                  }
                                                  
                                                  if (st.isSuccess && idx === st.n - 1) {
                                                      boxBg = "bg-fuchsia-500 border-fuchsia-600 text-white scale-125 shadow-2xl ring-4 ring-fuchsia-200 z-30";
                                                  }

                                                  return (
                                                      <div key={`dp-${idx}`} className="flex flex-col items-center">
                                                          <span className={`text-[10px] font-mono mb-1 ${isUpdating ? 'text-fuchsia-600 font-black' : 'text-slate-400 font-bold'}`}>{idx}</span>
                                                          <div className={`w-12 h-12 flex flex-col items-center justify-center font-mono font-black text-xl border-[2px] rounded-lg transition-all duration-300 ${boxBg}`}>
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
                <AlignCenter className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Minimum Insertions to Make Palindrome</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      String DP (LPS Reduction)
                  </span>
                  <span>•</span>
                  <span>LeetCode 1312</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><AlignCenter size={28}/> Creating Symmetry</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a string <code>s</code>. In one step you can insert any character at any index of the string.</p>
                        <p>Return the <strong>minimum number of steps</strong> to make <code>s</code> a palindrome.</p>
                        <p>A <strong>Palindrome String</strong> is one that reads the same backward as well as forward.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "mbadm"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">2</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">String can be "mbdadbm" or "mdbabdm".</span>
                    </div>

                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre mt-4`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> s = "leetcode"</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">5</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">Inserting 5 characters the string becomes "leetcodocteel".</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &lt;= s.length &lt;= 500</li>
                            <li>s consists of lowercase English letters.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ListTree size={16} className="text-rose-500"/> The Math Pivot</h4>
                        <p className="text-sm leading-relaxed">Instead of figuring out what to insert, figure out what's <strong>already a palindrome!</strong> The existing symmetric characters form the <em>Longest Palindromic Subsequence (LPS)</em>. Everything else is out of place. So, the minimum insertions perfectly equals <code>s.length() - LPS(s)</code>.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Zap size={16} className={`text-${themeColor}-500`}/> Caching the Diagonal</h4>
                        <p className="text-sm leading-relaxed text-slate-600">This translates to the standard 2-pointer string DP. Tabulation uses a 2D array <code>dp[i][j]</code>. But when converting to 1D, we have a unique challenge: calculating <code>dp[j]</code> requires the bottom-left diagonal <code>dp[i+1][j-1]</code>, which was <em>just overwritten</em>! We use a single <code>prev</code> variable to cache it securely.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>String Input (Max 8 chars)</label>
                            <input type="text" value={strInput} onChange={(e) => setStrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="mbadm" />
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
                                Successfully calculated minimum insertions!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMatchCalc || st.hlMismatchCalc || st.hlMatchReturn || st.hlReturn ? 'text-fuchsia-400' : (st.hlShiftPrev || st.hlTemp || st.hlRowSetup ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><AlignCenter size={14} className={`text-${themeColor}-500`}/> Dynamic Evaluation Visualizer</span>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Line-by-line breakdown of why caching a single variable solves the 2D memory crisis.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Approach 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListTree size={24} className="text-rose-500"/> 1. Brute Force (Recursion)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why no arrays?</strong> We rely purely on the Call Stack memory. We define a subproblem mathematically: from index <code>i</code> to <code>j</code>, what is the longest palindrome? If <code>s[i] == s[j]</code>, it's 2 plus the inner substring. If not, it's the max of skipping the left char or skipping the right char. This perfectly maps to recursion.</p>
                        <p className="text-slate-800 font-bold bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 w-fit">Time: O(2^N) | Space: O(N)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">Without memory, we evaluate the same substrings exponentially. Time is severely $O(2^N)$, Space is $O(N)$ for recursion depth.</p>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 2. Memoization (Top-Down)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a 2D Array?</strong> The recursive state is uniquely defined by two pointers: <code>i</code> and <code>j</code>. We allocate a <code>Integer[][] memo</code> matrix to cache these answers. Before doing the 2-way branching, we check <code>memo[i][j]</code>. If not null, we return it instantly.</p>
                        <p className="text-slate-800 font-bold bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 w-fit">Time: O(N^2) | Space: O(N^2)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This effectively computes each possible substring only once. Time falls perfectly to $O(N^2)$, but requires an explicit $O(N^2)$ memory footprint.</p>
                    </div>

                    {/* Approach 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-fuchsia-500"/> 3. Tabulation (Bottom-Up)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why loop backwards?</strong> When building the 2D DP table iteratively, computing <code>dp[i][j]</code> requires knowing <code>dp[i+1][j-1]</code>. Geometrically, this means computing row <code>i</code> requires the row <em>below</em> it (<code>i+1</code>) to be finished already! Therefore, the outer loop MUST iterate <code>i</code> backwards from <code>n-2</code> down to <code>0</code>.</p>
                        <p className="text-slate-800 font-bold bg-fuchsia-100 px-3 py-1.5 rounded-lg border border-fuchsia-200 w-fit">Time: O(N^2) | Space: O(N^2)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This avoids the recursive call stack but still uses a full 2D grid in memory.</p>
                    </div>

                    {/* Approach 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 4. Space Optimized (1D Array)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why the 'temp' and 'prev' variables?</strong> Since row <code>i</code> only reads from row <code>i+1</code>, we can collapse the grid into a single 1D array. But there is a massive collision! When we calculate <code>dp[j] = 2 + dp[j-1]</code> (representing the diagonal <code>dp[i+1][j-1]</code>), the array slot <code>dp[j-1]</code> has <strong>ALREADY BEEN OVERWRITTEN</strong> by the current row's evaluation!</p>
                        <p className="text-slate-600 leading-relaxed">To fix this, before we overwrite <code>dp[j]</code>, we save its old value in <code>temp</code>. After processing, we assign <code>prev = temp</code>. Thus, <code>prev</code> perfectly carries the undisturbed diagonal value into the next iteration!</p>
                        <p className="text-slate-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">Time: O(N^2) | Space: O(N)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This is the pinnacle of DP String optimization, crushing memory down to a single row.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem tests your ability to pivot. Don't try to calculate insertions directly; realize it's just the Longest Palindromic Subsequence problem in disguise! Then, nail the `prev` variable diagonal caching trick."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this using Longest Common Subsequence (LCS) instead?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes! LPS is mathematically equivalent to LCS(s, reverse(s))."</p>
                            <p>You could reverse the string <code>s</code> into <code>rev_s</code>. Then, you simply run the classic Longest Common Subsequence (LCS) algorithm on <code>s</code> and <code>rev_s</code>. The length of that LCS is exactly the LPS. The DP code for LCS is slightly easier for some to remember, but the 2-pointer substring approach used here avoids allocating a new reversed string in memory."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the 1D Space Optimized solution, what exactly does `prev` represent geographically in the 2D grid?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It represents the bottom-left diagonal cell: `dp[i+1][j-1]`."</p>
                            <p>When computing <code>dp[j]</code> (which maps to <code>dp[i][j]</code>), we need three values: the cell directly below it (<code>dp[j]</code> un-overwritten), the cell to its left (<code>dp[j-1]</code> already overwritten for the current row), and the diagonal cell (<code>dp[j-1]</code> BEFORE it was overwritten). <code>prev</code> perfectly caches that diagonal value across iterations."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why doesn't this DP need an offset array like Target Sum?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because our state variables are string indices, which are strictly bounded and positive."</p>
                            <p>In Target Sum, the state was an arbitrary accumulating integer sum that could drop below zero. Here, our state variables are <code>i</code> and <code>j</code>, which are strictly bounds within the string <code>[0, n-1]</code>. They naturally map directly to array indices without any messy mathematical shifting."</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlMatchCalc || st.hlMismatchCalc || st.hlMatchReturn || st.hlReturn ? 'text-fuchsia-400' : (st.hlShiftPrev || st.hlTemp || st.hlRowSetup ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>String Input</label>
                              <input type="text" value={strInput} onChange={(e) => setStrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="mbadm" />
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully calculated minimum insertions</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Answer</div>
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