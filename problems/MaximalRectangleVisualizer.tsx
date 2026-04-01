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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, Divide, Ship, Package, Calendar, Anchor, Waves, Weight, SearchCode, Minus, Type, RefreshCw, BarChart, Home, Triangle, Database, Box
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  recursion: {
    id: 'recursion',
    title: '1. Brute Force (Recursion)',
    icon: <ListTree size={16} />,
    complexity: 'Time: O(R^2 * C) | Space: O(C)',
    theme: 'rose',
    code: `class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix.length == 0) return 0;
        int maxArea = 0;
        for (int r = 0; r < matrix.length; r++) {
            for (int c = 0; c < matrix[0].length; c++) {
                int minWidth = Integer.MAX_VALUE;
                for (int k = r; k >= 0; k--) {
                    int w = getWidth(matrix, k, c);
                    if (w == 0) break;
                    minWidth = Math.min(minWidth, w);
                    maxArea = Math.max(maxArea, minWidth * (r - k + 1));
                }
            }
        }
        return maxArea;
    }
    
    private int getWidth(char[][] matrix, int r, int c) {
        if (c < 0 || matrix[r][c] == '0') return 0;
        return 1 + getWidth(matrix, r, c - 1);
    }
}`,
    desc: "The Recursive Approach: For every single cell (r, c), we recursively calculate the contiguous width of 1s ending at that cell. Then, we look upwards from that cell (k = r down to 0) to form a rectangle, keeping track of the minimum width found so far. The area is (minWidth * height). Because we use pure recursion without saving states, we redundantly calculate the width of the same cells over and over, making it slow."
  },
  memoization: {
    id: 'memoization',
    title: '2. Memoization (Top-Down)',
    icon: <Database size={16} />,
    complexity: 'Time: O(R^2 * C) | Space: O(R * C)',
    theme: 'sky',
    code: `class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix.length == 0) return 0;
        Integer[][] memo = new Integer[matrix.length][matrix[0].length];
        int maxArea = 0;
        for (int r = 0; r < matrix.length; r++) {
            for (int c = 0; c < matrix[0].length; c++) {
                int minWidth = Integer.MAX_VALUE;
                for (int k = r; k >= 0; k--) {
                    int w = getWidth(matrix, k, c, memo);
                    if (w == 0) break;
                    minWidth = Math.min(minWidth, w);
                    maxArea = Math.max(maxArea, minWidth * (r - k + 1));
                }
            }
        }
        return maxArea;
    }
    
    private int getWidth(char[][] matrix, int r, int c, Integer[][] memo) {
        if (c < 0 || matrix[r][c] == '0') return 0;
        if (memo[r][c] != null) return memo[r][c];
        return memo[r][c] = 1 + getWidth(matrix, r, c - 1, memo);
    }
}`,
    desc: "The Top-Down DP Approach: We declare a 2D Integer[][] array called 'memo'. Why 2D? Because the width depends on the specific row 'r' and column 'c' coordinates. Before recursively calculating the width, we check if memo[r][c] is not null. If it exists, we instantly return it! This guarantees we only calculate the width of each cell exactly once, storing the results for future rectangle checks."
  },
  tabulation: {
    id: 'tabulation',
    title: '3. Tabulation (Bottom-Up)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(R^2 * C) | Space: O(R * C)',
    theme: 'fuchsia',
    code: `class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix.length == 0) return 0;
        int rLen = matrix.length, cLen = matrix[0].length;
        int[][] dp = new int[rLen][cLen];
        int maxArea = 0;
        
        for (int r = 0; r < rLen; r++) {
            for (int c = 0; c < cLen; c++) {
                if (matrix[r][c] == '1') {
                    dp[r][c] = (c == 0) ? 1 : dp[r][c - 1] + 1;
                    int minWidth = dp[r][c];
                    for (int k = r; k >= 0; k--) {
                        if (dp[k][c] == 0) break;
                        minWidth = Math.min(minWidth, dp[k][c]);
                        maxArea = Math.max(maxArea, minWidth * (r - k + 1));
                    }
                }
            }
        }
        return maxArea;
    }
}`,
    desc: "The Bottom-Up DP Approach: We declare a 2D int[][] array called 'dp'. Instead of recursion, we iteratively compute the width left-to-right for each row. If the cell is '1', dp[r][c] = dp[r][c-1] + 1. Once the width is computed and stored iteratively, we do the same upwards scan to find the max rectangle. This avoids the call stack overhead completely, but still requires an O(R * C) 2D grid in memory."
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: '4. Space Optimized (1D DP)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(R * C) | Space: O(C)',
    theme: 'emerald',
    code: `class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix.length == 0) return 0;
        int rLen = matrix.length, cLen = matrix[0].length;
        int[] left = new int[cLen], right = new int[cLen], height = new int[cLen];
        Arrays.fill(right, cLen);
        int maxArea = 0;
        
        for (int r = 0; r < rLen; r++) {
            int curLeft = 0, curRight = cLen;
            for (int c = 0; c < cLen; c++) { // Update Height
                if (matrix[r][c] == '1') height[c]++;
                else height[c] = 0;
            }
            for (int c = 0; c < cLen; c++) { // Update Left
                if (matrix[r][c] == '1') left[c] = Math.max(left[c], curLeft);
                else { left[c] = 0; curLeft = c + 1; }
            }
            for (int c = cLen - 1; c >= 0; c--) { // Update Right
                if (matrix[r][c] == '1') right[c] = Math.min(right[c], curRight);
                else { right[c] = cLen; curRight = c; }
            }
            for (int c = 0; c < cLen; c++) { // Calculate Area
                maxArea = Math.max(maxArea, height[c] * (right[c] - left[c]));
            }
        }
        return maxArea;
    }
}`,
    desc: "The Ultimate Optimization: We completely drop the 2D grid! Why? Because the rectangle boundaries (left, right, height) at any row ONLY depend on the boundaries from the immediately previous row! We declare three 1D arrays of size 'C' (Columns). As we process row by row, we overwrite these 1D arrays in place. The height accumulates continuous 1s vertically. Left tracks the leftmost boundary, Right tracks the rightmost boundary. Area is simply height * (right - left). This runs in strict O(R * C) time and O(C) space!"
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|for|while|String|maximalRectangle|char|matrix|length|maxArea|r|c|minWidth|Integer|MAX_VALUE|k|w|getWidth|Math|min|max|memo|rLen|cLen|dp|left|right|height|Arrays|fill|curLeft|curRight)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isObject = ['String', 'Math', 'Integer', 'Arrays'].includes(part);
            const isPointer = ['matrix', 'maxArea', 'r', 'c', 'minWidth', 'k', 'w', 'memo', 'rLen', 'cLen', 'dp', 'left', 'right', 'height', 'curLeft', 'curRight'].includes(part);
            const isMapCall = ['maximalRectangle', 'getWidth', 'min', 'max', 'fill', 'length'].includes(part);
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

export default function MaximalRectangleVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('spaceOptimized');
  
  const [matrixInput, setMatrixInput] = useState('1,0,1,0,0 | 1,0,1,1,1 | 1,1,1,1,1 | 1,0,0,1,0');
  const [baseMatrix, setBaseMatrix] = useState<string[][]>([
      ['1','0','1','0','0'],
      ['1','0','1','1','1'],
      ['1','1','1','1','1'],
      ['1','0','0','1','0']
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
        let parsed: string[][] = [];
        let valid = true;
        let cLen = -1;

        for (let i = 0; i < rows.length; i++) {
            let cols = rows[i].split(',').map(c => c.trim().replace(/[^01]/g, ''));
            // Filter empty cols resulting from bad parsing
            cols = cols.filter(c => c === '0' || c === '1');
            
            if (cols.length === 0) continue;
            if (cLen === -1) cLen = cols.length;
            if (cols.length !== cLen) { valid = false; break; }
            parsed.push(cols);
        }
        
        if (!valid || parsed.length === 0) {
            parsed = [['1','0','1','0','0'],['1','0','1','1','1'],['1','1','1','1','1'],['1','0','0','1','0']];
        }
        
        // Cap max size to 5x5 for UI performance (especially for recursion trace)
        if (parsed.length > 5) parsed = parsed.slice(0, 5);
        parsed = parsed.map(row => row.length > 6 ? row.slice(0, 6) : row);

        setBaseMatrix(parsed);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
          setBaseMatrix([['1','0','1','0','0'],['1','0','1','1','1'],['1','1','1','1','1'],['1','0','0','1','0']]);
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

    let maxArea = 0;

    if (selectedOpId === 'recursion') {
        add("Function Call", `public int maximalRectangle(char[][] matrix)`, 2, { hlInit: true });
        if (rLen === 0) return steps;

        add("Init Area", `int maxArea = 0;`, 4, { hlInit: true, maxArea });

        for (let r = 0; r < rLen; r++) {
            for (let c = 0; c < cLen; c++) {
                add("Iterate Matrix", `for (int r = 0; r < matrix.length; r++) { for (int c = ...) }\nProcessing cell (${r}, ${c}).`, 6, { activeR: r, activeC: c, hlLoop: true, maxArea });
                
                let minWidth = Number.MAX_SAFE_INTEGER;
                add("Init Min Width", `int minWidth = Integer.MAX_VALUE;\nStarting upward scan for rectangles ending at (${r}, ${c}).`, 7, { activeR: r, activeC: c, hlInitWidth: true, minWidth: "MAX", maxArea });

                for (let k = r; k >= 0; k--) {
                    add("Scan Upwards", `for (int k = r; k >= 0; k--)\nLooking at row ${k} to extend rectangle upwards.`, 8, { activeR: r, activeC: c, scanK: k, hlScanUp: true, minWidth: minWidth === Number.MAX_SAFE_INTEGER ? "MAX" : minWidth, maxArea });
                    
                    // The recursive getWidth simulation
                    let w = 0;
                    for (let tempC = c; tempC >= 0; tempC--) {
                        if (mat[k][tempC] === '1') w++;
                        else break;
                    }
                    
                    add("Recursive Call", `int w = getWidth(matrix, k, c);\nRecursively found contiguous 1s width at (${k}, ${c}) is ${w}.`, 9, { activeR: r, activeC: c, scanK: k, hlGetWidth: true, w, minWidth: minWidth === Number.MAX_SAFE_INTEGER ? "MAX" : minWidth, maxArea });

                    if (w === 0) {
                        add("Zero Width Break", `if (w == 0) break;\nWidth is 0, rectangle broken. Stop scanning upwards.`, 10, { activeR: r, activeC: c, scanK: k, hlBreak: true, w, minWidth: minWidth === Number.MAX_SAFE_INTEGER ? "MAX" : minWidth, maxArea });
                        break;
                    }

                    minWidth = Math.min(minWidth, w);
                    add("Update Min Width", `minWidth = Math.min(minWidth, w);\nUpdating minimum bounding width to ${minWidth}.`, 11, { activeR: r, activeC: c, scanK: k, hlUpdateWidth: true, w, minWidth, maxArea });

                    let area = minWidth * (r - k + 1);
                    let oldMax = maxArea;
                    maxArea = Math.max(maxArea, area);
                    add("Update Max Area", `maxArea = Math.max(maxArea, minWidth * (r - k + 1));\nCalculated area: ${minWidth} * ${r - k + 1} = ${area}. ${maxArea > oldMax ? `New Max Area: ${maxArea}!` : `Max Area remains ${maxArea}.`}`, 12, { activeR: r, activeC: c, scanK: k, hlUpdateArea: true, w, minWidth, area, maxArea, isNewMax: maxArea > oldMax });
                }
            }
        }
        add("Return Result", `return maxArea;`, 16, { isSuccess: true, finalAns: maxArea });

    } else if (selectedOpId === 'memoization') {
        add("Function Call", `public int maximalRectangle(char[][] matrix)`, 2, { hlInit: true });
        
        let memo: (number | null)[][] = Array.from({length: rLen}, () => new Array(cLen).fill(null));
        add("Init Memo 2D Array", `Integer[][] memo = new Integer[matrix.length][matrix[0].length];\nAllocated 2D cache to prevent redundant width calculations.`, 4, { hlMemoInit: true, memo: clone2D(memo) });

        add("Init Area", `int maxArea = 0;`, 5, { hlInit: true, maxArea, memo: clone2D(memo) });

        for (let r = 0; r < rLen; r++) {
            for (let c = 0; c < cLen; c++) {
                add("Iterate Matrix", `for (int r = 0; r < matrix.length; r++) { for (int c = ...) }\nProcessing cell (${r}, ${c}).`, 7, { activeR: r, activeC: c, hlLoop: true, maxArea, memo: clone2D(memo) });
                
                let minWidth = Number.MAX_SAFE_INTEGER;

                for (let k = r; k >= 0; k--) {
                    // Memo getWidth simulation
                    let w = 0;
                    if (memo[k][c] !== null) {
                        w = memo[k][c] as number;
                        add("Cache Hit", `getWidth(matrix, ${k}, ${c}, memo);\nMemo cache HIT! Returning saved width ${w}.`, 10, { activeR: r, activeC: c, scanK: k, hlCacheHit: true, w, minWidth: minWidth === Number.MAX_SAFE_INTEGER ? "MAX" : minWidth, maxArea, memo: clone2D(memo) });
                    } else {
                        for (let tempC = c; tempC >= 0; tempC--) {
                            if (mat[k][tempC] === '1') w++;
                            else break;
                        }
                        memo[k][c] = w;
                        add("Cache Miss & Store", `getWidth(matrix, ${k}, ${c}, memo);\nMemo miss. Recursively calculated width ${w} and stored in memo[${k}][${c}].`, 10, { activeR: r, activeC: c, scanK: k, hlCacheStore: true, w, minWidth: minWidth === Number.MAX_SAFE_INTEGER ? "MAX" : minWidth, maxArea, memo: clone2D(memo) });
                    }

                    if (w === 0) break;

                    minWidth = Math.min(minWidth, w);
                    let area = minWidth * (r - k + 1);
                    maxArea = Math.max(maxArea, area);
                    add("Update Max Area", `maxArea = Math.max(maxArea, minWidth * (r - k + 1));\nCalculated area: ${minWidth} * ${r - k + 1} = ${area}.`, 13, { activeR: r, activeC: c, scanK: k, hlUpdateArea: true, w, minWidth, area, maxArea, memo: clone2D(memo) });
                }
            }
        }
        add("Return Result", `return maxArea;`, 17, { isSuccess: true, finalAns: maxArea, memo: clone2D(memo) });

    } else if (selectedOpId === 'tabulation') {
        add("Function Call", `public int maximalRectangle(char[][] matrix)`, 2, { hlInit: true });
        
        let dp: number[][] = Array.from({length: rLen}, () => new Array(cLen).fill(0));
        add("Init DP 2D Array", `int[][] dp = new int[rLen][cLen];\nAllocated bottom-up table to store continuous widths.`, 5, { hlDpInit: true, dp: clone2D(dp) });

        for (let r = 0; r < rLen; r++) {
            for (let c = 0; c < cLen; c++) {
                add("Iterate Matrix", `Processing cell (${r}, ${c}).`, 9, { activeR: r, activeC: c, hlLoop: true, maxArea, dp: clone2D(dp) });
                
                if (mat[r][c] === '1') {
                    dp[r][c] = c === 0 ? 1 : dp[r][c - 1] + 1;
                    add("Compute Width Bottom-Up", `dp[r][c] = (c == 0) ? 1 : dp[r][c - 1] + 1;\nComputed continuous width to the left iteratively: dp[${r}][${c}] = ${dp[r][c]}.`, 11, { activeR: r, activeC: c, hlCalcDp: true, maxArea, dp: clone2D(dp) });
                    
                    let minWidth = dp[r][c];
                    for (let k = r; k >= 0; k--) {
                        if (dp[k][c] === 0) {
                            add("Zero Width Break", `if (dp[k][c] == 0) break;\nWidth at row ${k} is 0. Stopping upward scan.`, 14, { activeR: r, activeC: c, scanK: k, hlBreak: true, minWidth, maxArea, dp: clone2D(dp) });
                            break;
                        }
                        
                        minWidth = Math.min(minWidth, dp[k][c]);
                        let area = minWidth * (r - k + 1);
                        maxArea = Math.max(maxArea, area);
                        add("Update Max Area", `maxArea = Math.max(maxArea, minWidth * (r - k + 1));\nArea with top-left at row ${k}: ${minWidth} * ${r - k + 1} = ${area}. Global maxArea = ${maxArea}.`, 16, { activeR: r, activeC: c, scanK: k, hlUpdateArea: true, minWidth, area, maxArea, dp: clone2D(dp) });
                    }
                } else {
                    add("Skip Zero", `Cell is '0'. Skip width calculation.`, 10, { activeR: r, activeC: c, hlSkip: true, maxArea, dp: clone2D(dp) });
                }
            }
        }
        add("Return Result", `return maxArea;`, 21, { isSuccess: true, finalAns: maxArea, dp: clone2D(dp) });

    } else if (selectedOpId === 'spaceOptimized') {
        add("Function Call", `public int maximalRectangle(char[][] matrix)`, 2, { hlInit: true });
        
        let left = new Array(cLen).fill(0);
        let right = new Array(cLen).fill(cLen);
        let height = new Array(cLen).fill(0);
        
        add("Init 1D Arrays", `int[] left = new int[cLen], right = new int[cLen], height = new int[cLen];\nArrays.fill(right, cLen);\nAllocated three 1D arrays to track boundaries! Replaces 2D grids completely.`, 5, { hlDpInit: true, left: clone1D(left), right: clone1D(right), height: clone1D(height) });

        for (let r = 0; r < rLen; r++) {
            let curLeft = 0;
            let curRight = cLen;
            
            add("Init Row Boundaries", `int curLeft = 0, curRight = cLen;\nStarting row ${r}. Resetting running left/right boundaries.`, 9, { activeR: r, hlRowInit: true, curLeft, curRight, left: clone1D(left), right: clone1D(right), height: clone1D(height), maxArea });

            // Height Pass
            for (let c = 0; c < cLen; c++) {
                if (mat[r][c] === '1') height[c]++;
                else height[c] = 0;
            }
            add("Update Height Array", `for (int c = 0; c < cLen; c++) { if (matrix[r][c] == '1') height[c]++; else height[c] = 0; }\nAccumulated continuous vertical 1s for row ${r}.`, 11, { activeR: r, hlUpdateHeight: true, curLeft, curRight, left: clone1D(left), right: clone1D(right), height: clone1D(height), maxArea });

            // Left Pass
            for (let c = 0; c < cLen; c++) {
                if (mat[r][c] === '1') left[c] = Math.max(left[c], curLeft);
                else { left[c] = 0; curLeft = c + 1; }
            }
            add("Update Left Array", `for (int c = 0; c < cLen; c++) { left[c] = Math.max(left[c], curLeft); }\nCalculated strict leftmost valid boundary for each column.`, 15, { activeR: r, hlUpdateLeft: true, curLeft, curRight, left: clone1D(left), right: clone1D(right), height: clone1D(height), maxArea });

            // Right Pass
            for (let c = cLen - 1; c >= 0; c--) {
                if (mat[r][c] === '1') right[c] = Math.min(right[c], curRight);
                else { right[c] = cLen; curRight = c; }
            }
            add("Update Right Array", `for (int c = cLen - 1; c >= 0; c--) { right[c] = Math.min(right[c], curRight); }\nCalculated strict rightmost valid boundary for each column.`, 19, { activeR: r, hlUpdateRight: true, curLeft, curRight, left: clone1D(left), right: clone1D(right), height: clone1D(height), maxArea });

            // Area Pass
            add("Calculate Max Area", `for (int c = 0; c < cLen; c++) { maxArea = Math.max(maxArea, height[c] * (right[c] - left[c])); }\nEvaluating area for all histogram bars in row ${r}.`, 23, { activeR: r, hlUpdateArea: true, curLeft, curRight, left: clone1D(left), right: clone1D(right), height: clone1D(height), maxArea });
            for (let c = 0; c < cLen; c++) {
                let area = height[c] * (right[c] - left[c]);
                maxArea = Math.max(maxArea, area);
            }
        }
        add("Return Result", `return maxArea;`, 27, { isSuccess: true, finalAns: maxArea, left: clone1D(left), right: clone1D(right), height: clone1D(height) });
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
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"><Trophy size={16}/> Maximal Rectangle Area</div>
                      <div className={`flex items-center justify-center text-emerald-700 bg-emerald-100 border-emerald-400 font-mono font-black text-4xl px-10 py-4 rounded-2xl border-2 shadow-md w-full`}>
                          {st.finalAns}
                      </div>
                  </div>
              ) : st.activeR !== undefined || st.left !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[80px]">
                      
                      {selectedOpId === 'spaceOptimized' ? (
                          <>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">Current Row (r)</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                                      {st.activeR !== undefined ? st.activeR : '-'}
                                  </div>
                              </div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-amber-500 mb-1 flex items-center gap-1">curLeft</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-amber-50 border-amber-300 text-amber-700`}>
                                      {st.curLeft !== undefined ? st.curLeft : '-'}
                                  </div>
                              </div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1">curRight</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-50 border-sky-300 text-sky-700`}>
                                      {st.curRight !== undefined ? st.curRight : '-'}
                                  </div>
                              </div>
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Max Area</span>
                                  <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.hlUpdateArea ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 scale-110 shadow-lg animate-in zoom-in' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                                      {st.maxArea !== undefined ? st.maxArea : '-'}
                                  </div>
                              </div>
                          </>
                      ) : (
                          <>
                              {/* Current Cell */}
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">Cell ({st.activeR}, {st.activeC})</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                                      {st.activeC !== undefined ? `'${st.mat[st.activeR][st.activeC]}'` : '-'}
                                  </div>
                              </div>

                              {st.minWidth !== undefined && (
                                  <div className="flex flex-col items-center animate-in zoom-in">
                                      <span className="text-[10px] font-bold uppercase text-sky-500 mb-1 flex items-center gap-1"><ArrowLeftRight size={12}/> Min Bound Width</span>
                                      <div className={`border-2 text-3xl font-black px-6 py-3 rounded-2xl transition-all duration-300 bg-sky-100 border-sky-500 text-sky-800 shadow-md`}>
                                          {st.minWidth}
                                      </div>
                                  </div>
                              )}

                              {st.maxArea !== undefined && (
                                  <div className="flex flex-col items-center animate-in zoom-in">
                                      <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Maximize2 size={12}/> Max Area</span>
                                      <div className={`border-2 text-4xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.isNewMax ? 'bg-fuchsia-100 border-fuchsia-500 text-fuchsia-800 shadow-xl scale-110' : 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800'}`}>
                                          {st.maxArea}
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
      const startY = selectedOpId === 'spaceOptimized' ? 50 : 120; // Shift up if we need space for 3 arrays

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
                          {st.mat.map((rowArr: string[], r: number) => {
                              return rowArr.map((val: string, c: number) => {
                                  let currentX = startX + c * totalSize;
                                  let currentY = startY + r * totalSize;
                                  
                                  let isAnchor = st.activeR === r && st.activeC === c;
                                  let isScanning = st.scanK !== undefined && r >= st.scanK && r <= st.activeR && c === st.activeC;
                                  let isRectHighlight = st.scanK !== undefined && r >= st.scanK && r <= st.activeR && c <= st.activeC && c > st.activeC - (st.minWidth === "MAX" ? 0 : st.minWidth);
                                  
                                  let isSpaceOptRow = selectedOpId === 'spaceOptimized' && st.activeR === r;

                                  let bgClass = "bg-white border-slate-200 text-slate-400"; 
                                  let scaleClass = "scale-100";

                                  if (val === '1') {
                                      bgClass = "bg-slate-700 border-slate-800 text-white"; // Base 1 color
                                  }

                                  if (isAnchor && !st.isSuccess && selectedOpId !== 'spaceOptimized') {
                                      bgClass = "bg-amber-400 border-amber-600 text-white shadow-xl ring-4 ring-amber-200 z-30";
                                      scaleClass = "scale-110";
                                  } else if (isRectHighlight && !st.isSuccess) {
                                      bgClass = "bg-fuchsia-500 border-fuchsia-700 text-white shadow-lg ring-2 ring-fuchsia-300 z-20";
                                      scaleClass = "scale-105";
                                  } else if (isScanning && !st.isSuccess) {
                                      bgClass = "bg-sky-400 border-sky-600 text-white shadow-md z-20";
                                  } else if (isSpaceOptRow && !st.isSuccess) {
                                      bgClass = val === '1' ? "bg-emerald-500 border-emerald-700 text-white shadow-lg z-20" : "bg-white border-slate-300 text-slate-400 shadow-md z-20";
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
                                          {overlayVal !== null && !isRectHighlight && (
                                              <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white text-[9px] font-black px-1 rounded shadow-sm border border-sky-600 z-40 animate-in zoom-in">
                                                  w:{overlayVal}
                                              </div>
                                          )}
                                      </div>
                                  )
                              });
                          })}
                          
                          {/* Render 1D Arrays for Space Optimized Approach below the matrix */}
                          {selectedOpId === 'spaceOptimized' && st.height && (
                              <div className="absolute flex flex-col items-center w-full" style={{ top: `${startY + st.rLen * totalSize + 20}px` }}>
                                  
                                  <div className="flex gap-10">
                                      {/* Height Array */}
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm">height[]</span>
                                          <div className="flex gap-1 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                              {st.height.map((val: number, idx: number) => {
                                                  let isUpdating = st.hlUpdateHeight;
                                                  return (
                                                      <div key={`h-${idx}`} className={`w-8 h-8 flex items-center justify-center font-mono font-black border-2 rounded transition-all duration-300 ${isUpdating ? 'bg-sky-100 border-sky-400 text-sky-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                          {val}
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                      </div>

                                      {/* Left Array */}
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm">left[]</span>
                                          <div className="flex gap-1 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                              {st.left.map((val: number, idx: number) => {
                                                  let isUpdating = st.hlUpdateLeft;
                                                  return (
                                                      <div key={`l-${idx}`} className={`w-8 h-8 flex items-center justify-center font-mono font-black border-2 rounded transition-all duration-300 ${isUpdating ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                          {val}
                                                      </div>
                                                  )
                                              })}
                                          </div>
                                      </div>

                                      {/* Right Array */}
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm">right[]</span>
                                          <div className="flex gap-1 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                              {st.right.map((val: number, idx: number) => {
                                                  let isUpdating = st.hlUpdateRight;
                                                  return (
                                                      <div key={`r-${idx}`} className={`w-8 h-8 flex items-center justify-center font-mono font-black border-2 rounded transition-all duration-300 ${isUpdating ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                          {val}
                                                      </div>
                                                  )
                                              })}
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
                <Box className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Maximal Rectangle</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming Options
                  </span>
                  <span>•</span>
                  <span>LeetCode 85</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Box size={28}/> The Largest Sub-Grid</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a <code>rows x cols</code> binary <code>matrix</code> filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> matrix = <br/>[["1","0","1","0","0"],<br/> ["1","0","1","1","1"],<br/> ["1","1","1","1","1"],<br/> ["1","0","0","1","0"]]</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">6</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">The maximal rectangle is at row 1 &amp; 2, cols 2-4, yielding an area of 2x3 = 6.</span>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>rows == matrix.length</li>
                            <li>cols == matrix[i].length</li>
                            <li>1 &lt;= row, cols &lt;= 200</li>
                            <li>matrix[i][j] is '0' or '1'.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ListTree size={16} className="text-rose-500"/> The Width-Scan Method</h4>
                        <p className="text-sm leading-relaxed">For every cell, we can calculate the contiguous width of 1s to its left. Then, treating that cell as the bottom-right corner of a rectangle, we scan upwards. The height is the number of rows scanned, and the width is the minimum of all widths seen so far. This forms the basis of our Recursion/Tabulation approaches!</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Zap size={16} className={`text-${themeColor}-500`}/> Left-Right-Height 1D DP</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The most optimal DP tracks the state row by row using three 1D arrays: <code>height</code>, <code>left</code>, and <code>right</code> boundaries. For each cell in a row, its maximal rectangle area is <code>height * (right - left)</code>. Since the next row's boundaries only depend on the current row, we strictly need 1D arrays!</p>
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
                            <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold tracking-[0.1em]`} placeholder="1,0,1,0 | 1,0,1,1 | 1,1,1,1" />
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
                                Max Rectangle Area is {st.finalAns}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlUpdateArea ? 'text-fuchsia-400' : (st.hlInitWidth || st.hlCalcDp || st.hlCacheHit ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[540px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Box size={14} className={`text-${themeColor}-500`}/> Dynamic Matrix Visualizer</span>
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
                        <p className="mb-4 text-slate-600 leading-relaxed">Why no arrays? We rely purely on the Call Stack memory. For every cell <code>(r, c)</code> in the matrix, we treat it as the bottom-right corner of a potential rectangle. We recursively calculate the continuous width of <code>1s</code> to its left. Then we scan vertically upwards (<code>k = r down to 0</code>), bounding the width by the minimum we've seen on the way up, to form a rectangle.</p>
                        <p className="text-slate-800 font-bold bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 w-fit">Time: O(R^2 * C) | Space: O(C)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">The fatal flaw is the recursive <code>getWidth</code> function. It re-evaluates the exact same left-width path for cell <code>(0,0)</code> every single time we evaluate cells in its row. The space is O(C) because the max recursive depth equals the columns.</p>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 2. Memoization (Top-Down)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a 2D Array?</strong> We declare <code>Integer[][] memo</code> because the recursive state requires two inputs: the row <code>r</code> and the column <code>c</code>. The memo acts as a direct cache. Before we launch the <code>getWidth</code> recursion, we check if <code>memo[r][c] != null</code>. If it exists, we return it instantly! This completely fixes the redundant horizontal scanning problem.</p>
                        <p className="text-slate-800 font-bold bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 w-fit">Time: O(R^2 * C) | Space: O(R * C)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">By caching, calculating the width of any cell becomes strictly O(1) after the first evaluation. The time complexity is dominated by the upward scan loop <code>(k = r to 0)</code>, creating the $R^2$ term. Space is explicitly $O(R \times C)$ for the 2D grid.</p>
                    </div>

                    {/* Approach 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className="text-fuchsia-500"/> 3. Tabulation (Bottom-Up)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why a 2D Array?</strong> We declare <code>int[][] dp</code> to flip the recursion into an iterative process. We move left-to-right, row-by-row. If a cell is '1', its contiguous width is simply <code>1 + dp[r][c-1]</code>. By building this 2D table of widths iteratively, we skip the overhead of the call stack entirely while achieving the exact same mathematical result as memoization.</p>
                        <p className="text-slate-800 font-bold bg-fuchsia-100 px-3 py-1.5 rounded-lg border border-fuchsia-200 w-fit">Time: O(R^2 * C) | Space: O(R * C)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">The time remains identical because we still execute the inner <code>for (int k = r; k &gt;= 0; k--)</code> scan to calculate the maximal vertical area. The space remains $O(R \times C)$ for the DP table.</p>
                    </div>

                    {/* Approach 4 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Zap size={24} className="text-emerald-500"/> 4. Space Optimized (1D Left-Right-Height)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Why exactly THREE 1D Arrays?</strong> This is the ultimate optimization. To calculate the maximum rectangle ending at row <code>r</code>, we only need to know three things about every column <code>c</code>: its accumulated height of continuous 1s (<code>height[]</code>), how far left that height can stretch (<code>left[]</code>), and how far right it stretches (<code>right[]</code>).</p>
                        <p className="text-slate-600 leading-relaxed">Because the boundaries for row <code>r</code> depend <strong>exclusively</strong> on the boundaries of row <code>r - 1</code>, we can drop the 2D matrix entirely! As we loop down the rows, we literally overwrite the 1D arrays in place. The area calculation simplifies to a single O(1) math check: <code>height[c] * (right[c] - left[c])</code> per cell.</p>
                        <p className="text-slate-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">Time: O(R * C) | Space: O(C)</p>
                        <p className="mt-4 text-sm text-slate-500 italic">This destroys the $R^2$ scanning loop. Everything is calculated in linear passes. Time is strictly bounded by the number of cells. Memory footprint is slashed from the entire matrix down to just the width of one row.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-emerald-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a notorious LeetCode Hard problem. Interviewers want to see if you can break down the complex 2D rectangle mapping into simpler 1D array boundaries."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this using a Stack (Histogram approach)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, absolutely! The Space Optimized 1D DP approach is mathematically identical to running 'Largest Rectangle in Histogram' (LeetCode 84) on every single row."</p>
                            <p>You can accumulate heights vertically, and for every row, treat it as the base of a histogram. You push indices into a Stack to find the left and right limits. That also yields $O(R \times C)$ time and $O(C)$ space, but requires an external Stack structure. The 1D DP boundary approach manages it entirely with arrays, making it faster due to contiguous memory cache locality!"</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the 1D Space Optimized solution, why is `right` initialized to `cLen` but `left` initialized to `0`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because of how the boundaries define the width."</p>
                            <p>The width of the rectangle is calculated as <code>right[c] - left[c]</code>. The <code>left</code> array points to the inclusive starting index, so a safe default is 0. The <code>right</code> array points to the <em>exclusive</em> ending index (the first zero encountered to the right), so the maximum possible boundary is the length of the row itself <code>cLen</code>. This ensures <code>cLen - 0 = cLen</code> for a row of all 1s.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "How does the space optimization `left[c] = Math.max(left[c], curLeft)` maintain vertical boundaries across rows?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we need the rectangle to be valid spanning all the way up!"</p>
                            <p>When calculating the left bound for row `r`, it's not just about the zeros in row `r`. If the row above (`r-1`) had a zero that forced a tighter (higher) left boundary, we MUST inherit it to maintain a valid continuous block of 1s upwards. By taking <code>Math.max(old_left, new_left)</code>, we guarantee the boundary is strictly constrained by whichever row has the tightest bottleneck!</p>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlUpdateArea ? 'text-fuchsia-400' : (st.hlInitWidth || st.hlCalcDp || st.hlCacheHit ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                              <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold tracking-[0.1em]`} placeholder="1,0,1 | 1,1,1" />
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
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully calculated maximal rectangle</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Maximal Area</div>
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