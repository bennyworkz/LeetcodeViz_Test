import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  floodFill: {
    id: 'floodFill',
    title: 'Flood Fill (Grid DFS)',
    icon: <PaintBucket size={16} />,
    complexity: 'Time: O(N * M) | Space: O(N * M)',
    theme: 'rose',
    code: `class Solution {
    private void dfs(int row, int col, int[][] ans, int[][] image, int newColor, int delRow[], int delCol[], int iniColor) {
        ans[row][col] = newColor;
        int n = image.length;
        int m = image[0].length;
        
        // Traverse 4 directions
        for (int i = 0; i < 4; i++) {
            int nrow = row + delRow[i];
            int ncol = col + delCol[i];
            
            // Check boundaries and if the neighboring color matches the initial color
            if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && 
                image[nrow][ncol] == iniColor && ans[nrow][ncol] != newColor) {
                dfs(nrow, ncol, ans, image, newColor, delRow, delCol, iniColor);
            }
        }
    }
    
    public int[][] floodFill(int[][] image, int sr, int sc, int newColor) {
        int iniColor = image[sr][sc];
        int[][] ans = image; // Modifies the array in place, effectively
        
        // Coordinate modifiers for: Up, Right, Down, Left
        int delRow[] = {-1, 0, +1, 0};
        int delCol[] = {0, 1, 0, -1};
        
        dfs(sr, sc, ans, image, newColor, delRow, delCol, iniColor);
        return ans;
    }
}`,
    desc: "Flood Fill: A classic Depth-First Search (DFS) algorithm commonly used in paint programs (the 'bucket fill' tool). Starting from a given source coordinate, it identifies the initial color, instantly paints it with the new color, and recursively plunges into all 4 cardinal directions to paint connected pixels of the same original color."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|class|return|if|else|new|for|while|dfs|floodFill|image|ans|sr|sc|newColor|iniColor|row|col|nrow|ncol|delRow|delCol|n|m|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`code-line-${num}`} className={`flex relative z-10 min-h-[22px] transition-colors duration-200 ${active ? `active-code-line ${activeStyles.bg}` : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-10 select-none text-right pr-2 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[3px] flex items-center justify-between ${active ? `${activeStyles.text} font-black` : 'text-slate-600'}`}>
        <span className="w-3 flex justify-center">{active ? <ArrowRight size={10} className="animate-pulse" /> : ''}</span>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'Boolean', 'class', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isMapCall = ['dfs', 'floodFill', 'length'].includes(part);
            const isPointer = ['image', 'ans', 'sr', 'sc', 'newColor', 'iniColor', 'row', 'col', 'nrow', 'ncol', 'delRow', 'delCol', 'n', 'm'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) ? '' : 'text-emerald-400'
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

// --- Color Mapping Utility for Grid ---
const getColorTheme = (val: number) => {
    const themes = [
        'bg-slate-100 text-slate-600 border-slate-300',      // 0
        'bg-emerald-100 text-emerald-700 border-emerald-300', // 1
        'bg-rose-100 text-rose-700 border-rose-300',         // 2
        'bg-sky-100 text-sky-700 border-sky-300',            // 3
        'bg-amber-100 text-amber-700 border-amber-300',      // 4
        'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',// 5
        'bg-indigo-100 text-indigo-700 border-indigo-300'    // 6
    ];
    return themes[val % themes.length];
};

// --- Main Application ---

export default function FloodFillVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('floodFill');
  
  const [gridInput, setGridInput] = useState('1 1 1 | 1 1 0 | 1 0 1');
  const [srInput, setSrInput] = useState('1');
  const [scInput, setScInput] = useState('1');
  const [newColorInput, setNewColorInput] = useState('2');

  const [baseGrid, setBaseGrid] = useState<number[][]>([
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1]
  ]);
  const [validSr, setValidSr] = useState(1);
  const [validSc, setValidSc] = useState(1);
  const [validNewColor, setValidNewColor] = useState(2);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1.1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let rows = gridInput.split('|').map(r => r.trim());
        let parsed: number[][] = rows.map(r => r.split(/\s+/).map(Number).filter(n => !isNaN(n)));
        
        let maxCols = Math.max(...parsed.map(r => r.length), 1);
        parsed = parsed.map(r => {
            while (r.length < maxCols) r.push(0);
            return r;
        });

        if (parsed.length === 0 || parsed[0].length === 0) {
            parsed = [[1, 1, 1], [1, 1, 0], [1, 0, 1]];
        }
        if (parsed.length > 10) parsed = parsed.slice(0, 10);
        parsed = parsed.map(r => r.slice(0, 10));

        let r = parseInt(srInput);
        let c = parseInt(scInput);
        let nc = parseInt(newColorInput);

        r = isNaN(r) ? 0 : Math.max(0, Math.min(r, parsed.length - 1));
        c = isNaN(c) ? 0 : Math.max(0, Math.min(c, parsed[0].length - 1));
        nc = isNaN(nc) ? 2 : nc;

        setBaseGrid(parsed);
        setValidSr(r);
        setValidSc(c);
        setValidNewColor(nc);

        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [gridInput, srInput, scInput, newColorInput]);

  // Robust Auto-scroll effect specifically targeting the active line in the code container
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeLineElements = document.querySelectorAll('.active-code-line');
      activeLineElements.forEach(el => {
         if ((el as HTMLElement).offsetParent !== null) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
         }
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep, isFullscreen, activeTab]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.4), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone2D = (arr: any[][]) => arr.map(row => [...row]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const initialGrid = clone2D(baseGrid);
    const n = initialGrid.length;
    if (n === 0) return steps;
    const m = initialGrid[0].length;
    if (m === 0) return steps;

    const stack: {r: number, c: number}[] = [];
    let currentGrid = clone2D(initialGrid);
    const delRow = [-1, 0, 1, 0];
    const delCol = [0, 1, 0, -1];
    
    // Bounds check for source
    if(validSr >= n || validSc >= m) return steps;
    const iniColor = currentGrid[validSr][validSc];

    const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { grid: clone2D(currentGrid), n, m, stack: [...stack], ...st } 
    });

    add("Function Call", `public int[][] floodFill(int[][] image, int sr=${validSr}, int sc=${validSc}, int newColor=${validNewColor})`, 20, { phase: 'init' });
    
    add("Init Target Color", `int iniColor = image[sr][sc];\nIdentified the color at source (${validSr}, ${validSc}) is ${iniColor}.`, 21, { phase: 'init_colors', iniColor });
    add("Init Answer Array", `int[][] ans = image;\nPointing 'ans' to the original image for in-place modification.`, 22, { phase: 'init_ans', iniColor });
    
    add("Init Directions", `int delRow[] = {-1, 0, +1, 0};\nint delCol[] = {0, 1, 0, -1};\nSetting up the 4 cardinal direction vectors (Up, Right, Down, Left).`, 25, { phase: 'init_dirs', iniColor });

    const runDFS = (r: number, c: number) => {
        stack.push({r, c});
        add("DFS: Enter", `dfs(row=${r}, col=${c}, ...);\nEntering deep recursion for cell (${r}, ${c}).`, 2, { phase: 'dfs_enter', activeR: r, activeC: c, iniColor });
        
        currentGrid[r][c] = validNewColor;
        add("DFS: Paint Cell", `ans[row][col] = newColor;\nPainted cell (${r}, ${c}) with newColor ${validNewColor}.`, 3, { phase: 'dfs_paint', activeR: r, activeC: c, iniColor });
        
        add("DFS: Fetch Bounds", `int n = image.length;\nint m = image[0].length;\nFetched grid boundaries.`, 4, { phase: 'dfs_bounds', activeR: r, activeC: c, iniColor });

        add("DFS: Neighbor Loop", `for (int i = 0; i < 4; i++)\nStarting 4-directional scan around (${r}, ${c}).`, 8, { phase: 'dfs_loop_start', activeR: r, activeC: c, iniColor });
        
        for (let i = 0; i < 4; i++) {
            let nrow = r + delRow[i];
            let ncol = c + delCol[i];
            
            add("DFS: Calc Direction", `int nrow = row + delRow[i];\nint ncol = col + delCol[i];\nCalculated neighbor coordinate: (${nrow}, ${ncol}).`, 9, { phase: 'dfs_calc_dir', activeR: r, activeC: c, checkR: nrow, checkC: ncol, iniColor });
            
            add("DFS: Condition Check", `if (nrow >= 0 ... && image[nrow][ncol] == iniColor && ans[nrow][ncol] != newColor)\nEvaluating if neighbor (${nrow}, ${ncol}) is valid to paint.`, 13, { phase: 'dfs_eval_cond', activeR: r, activeC: c, checkR: nrow, checkC: ncol, iniColor });
            
            if (nrow >= 0 && nrow < n && ncol >= 0 && ncol < m && initialGrid[nrow][ncol] === iniColor && currentGrid[nrow][ncol] !== validNewColor) {
                add("DFS: Valid Neighbor", `Condition passed! Neighbor (${nrow}, ${ncol}) matches initial color ${iniColor}. Traversing deeper...`, 14, { phase: 'dfs_valid', activeR: r, activeC: c, checkR: nrow, checkC: ncol, iniColor });
                
                runDFS(nrow, ncol);
                
                add("DFS: Backtrack", `Returned from recursive dfs() call at (${nrow}, ${ncol}). Resuming loop for (${r}, ${c}).`, 15, { phase: 'dfs_backtrack', activeR: r, activeC: c, iniColor });
            } else {
                add("DFS: Invalid Skip", `Condition failed. Cell (${nrow}, ${ncol}) is out of bounds, wrong color, or already painted. Skip.`, 13, { phase: 'dfs_invalid', activeR: r, activeC: c, checkR: nrow, checkC: ncol, iniColor });
            }
        }
        
        stack.pop();
        add("DFS: Exit", `Finished all 4 directions for (${r}, ${c}). Returning to parent call.`, 18, { phase: 'dfs_exit', activeR: r, activeC: c, iniColor });
    };

    add("Trigger Primary DFS", `dfs(sr, sc, ans, image, newColor, delRow, delCol, iniColor);\nLaunching the initial recursive depth-first search.`, 28, { phase: 'call_dfs', iniColor });
    
    if (iniColor !== validNewColor) {
        runDFS(validSr, validSc);
    } else {
        add("Optimization Skip", `Wait! Initial color is already the New Color. No recursive work needed to prevent infinite loops.`, 28, { phase: 'skip_dfs', iniColor });
    }

    add("Return Result", `return ans;\nFlood Fill complete. Returning the modified image array.`, 29, { phase: 'done', isSuccess: true, iniColor });

    return steps;
  }, [baseGrid, validSr, validSc, validNewColor]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(1.1); 
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

  // Render Trace Operations Box helper to avoid re-mounting nested components
  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isSuccess ? 'bg-sky-900 border-sky-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><PaintBucket size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isSuccess ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-sky-400`}>
                    <PartyPopper size={24}/> FLOOD FILL COMPLETE
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Successfully propagated the new color across the region.
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.phase.includes('paint') || st.phase === 'dfs_valid' ? 'text-rose-400' : (st.phase.includes('enter') || st.phase.includes('exit') || st.phase.includes('backtrack') ? 'text-fuchsia-400' : (st.phase.includes('eval_cond') || st.phase.includes('check_dir') ? 'text-amber-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderActiveDashboard = () => {
      if (st.grid === undefined) return null;
      let isSuccessEnd = st.isSuccess;

      return (
          <div className={`bg-white p-4 md:p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-sky-400 ring-4 ring-sky-100' : 'border-slate-200'} scale-105 z-40`}>
              {isSuccessEnd ? (
                  <div className="flex flex-col items-center justify-center gap-2 font-mono w-full px-4 md:px-12">
                      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-sky-600`}>
                          <Trophy size={16}/> Fill Operation Finished
                      </div>
                      <div className={`flex items-center justify-center font-mono font-black text-2xl px-10 py-4 rounded-2xl border-2 shadow-md w-full text-sky-700 bg-sky-100 border-sky-400 break-all`}>
                          Grid updated in-place.
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono w-full min-h-[70px]">
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><Palette size={12}/> Color Data</span>
                          <div className={`border-2 text-sm font-black px-4 py-2 rounded-2xl bg-slate-50 border-slate-200 text-slate-500 shadow-sm flex flex-col items-center`}>
                              <span>Target = <span className="text-rose-500">{st.iniColor !== undefined ? st.iniColor : '?'}</span></span>
                              <span>New = <span className="text-emerald-500">{validNewColor}</span></span>
                          </div>
                      </div>
                      <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-fuchsia-500 mb-1 flex items-center gap-1"><Crosshair size={12}/> Active Node (row, col)</span>
                          <div className={`border-2 text-xl font-black px-6 py-4 rounded-2xl transition-all duration-300 ${st.phase.startsWith('dfs') ? 'bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {st.activeR !== undefined && st.activeC !== undefined ? `(${st.activeR}, ${st.activeC})` : '(-, -)'}
                          </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300 hidden md:block" />
                      <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase text-indigo-500 mb-1 flex items-center gap-1"><Layers size={12}/> DFS Call Stack Depth</span>
                          <div className={`border-2 text-2xl font-black px-6 py-3 rounded-2xl transition-all duration-300 ${st.phase === 'dfs_enter' || st.phase === 'dfs_exit' ? 'bg-indigo-100 border-indigo-500 text-indigo-800 shadow-sm animate-in zoom-in' : 'bg-indigo-50 border-indigo-200 text-indigo-800'}`}>
                              {st.stack !== undefined ? st.stack.length : '0'}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const renderVisuals = () => {
      if (st.grid === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              <div className="flex flex-col items-center w-full mt-2 pointer-events-auto z-50">
                  {renderActiveDashboard()}
              </div>

              <div className="flex flex-col items-center justify-center relative w-full mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-row items-center justify-center p-4 md:p-8 gap-6 lg:gap-16 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-hidden`} style={{ minHeight: '600px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      {/* --- LEFT: GRID MATRIX RENDERER --- */}
                      <div className="relative flex flex-col gap-1 md:gap-1.5 p-4 md:p-6 bg-white/90 rounded-3xl shadow-2xl border border-slate-300 backdrop-blur-sm z-10 shrink-0">
                          <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Image Grid (int[][])</span>
                          {st.grid.map((rowArr: number[], rIdx: number) => (
                              <div key={`r-${rIdx}`} className="flex gap-1 md:gap-1.5">
                                  {rowArr.map((cellValue: number, cIdx: number) => {
                                      
                                      let isActive = st.activeR === rIdx && st.activeC === cIdx;
                                      let isCheck = st.checkR === rIdx && st.checkC === cIdx;
                                      let isSource = validSr === rIdx && validSc === cIdx && st.phase === 'init';
                                      
                                      // Minimalistic Base Styling tied to the cell's integer value
                                      let bgClass = getColorTheme(cellValue);
                                      let ringClass = 'border-2';
                                      let scaleClass = 'scale-100';
                                      let zIndex = 'z-10';

                                      // Subtly highlight active operations with rings, avoiding bulky icons
                                      if (isActive) {
                                          ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent shadow-lg';
                                          scaleClass = 'scale-110';
                                          zIndex = 'z-30';
                                      } else if (isCheck) {
                                          let isMatchingTarget = cellValue === st.iniColor && cellValue !== validNewColor;
                                          ringClass = isMatchingTarget ? 'ring-4 ring-emerald-400 ring-offset-2 border-transparent shadow-md' : 'ring-4 ring-rose-400 ring-offset-2 border-transparent shadow-md';
                                          scaleClass = 'scale-105';
                                          zIndex = 'z-20';
                                      } else if (isSource) {
                                          ringClass = 'ring-4 ring-indigo-500 ring-offset-2 border-transparent animate-pulse';
                                          scaleClass = 'scale-105';
                                          zIndex = 'z-20';
                                      }

                                      let cellClass = `w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-mono font-black text-xl md:text-2xl rounded-xl transition-all duration-300 relative select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`;

                                      return (
                                          <div key={`c-${rIdx}-${cIdx}`} className={cellClass}>
                                              {cellValue}
                                              <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-black/20 opacity-0 group-hover:opacity-100">{rIdx},{cIdx}</span>
                                          </div>
                                      );
                                  })}
                              </div>
                          ))}
                      </div>

                      {/* --- RIGHT: DATA STRUCTURES (Call Stack) --- */}
                      <div className="flex flex-col gap-6 z-20 items-center justify-start shrink-0 w-[200px] md:w-[280px]">
                          <div className="flex flex-col items-center w-full">
                              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> System Call Stack</span>
                              <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-3 gap-2 relative min-h-[350px] max-h-[500px] overflow-y-auto scrollbar-thin">
                                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                                      <span>TOP (CURRENT)</span>
                                  </div>
                                  
                                  {/* Rendering stack dynamically (Reverse to show Top of Stack visually at the top) */}
                                  <div className="flex flex-col gap-2 transition-all duration-500">
                                      {[...(st.stack || [])].reverse().map((val: {r: number, c: number}, i: number) => {
                                          let isTop = i === 0;
                                          let isEntering = isTop && st.phase === 'dfs_enter';
                                          
                                          return (
                                              <div key={`stack-${i}-${val.r}-${val.c}`} className={`px-4 py-3 flex items-center justify-between font-mono font-black rounded-xl border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-indigo-500 border-indigo-600 text-white animate-in slide-in-from-top-4' : (isTop ? 'bg-slate-700 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-400')}`}>
                                                  <span>dfs({val.r}, {val.c})</span>
                                                  {isTop && <Activity size={14} className={isEntering ? "animate-pulse" : "opacity-50"}/>}
                                              </div>
                                          )
                                      })}
                                      {st.stack && st.stack.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-4">Stack is empty</span>}
                                  </div>
                                  
                                  <div className="sticky bottom-0 left-0 right-0 text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center pt-2 border-t border-slate-100 bg-white/90 backdrop-blur z-10 mt-auto">
                                      BOTTOM (BASE)
                                  </div>
                              </div>
                          </div>
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
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      2D Grid Graph Traversal
                  </span>
                  <span>•</span>
                  <span>Recursion Based</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><PaintBucket size={28}/> The Magic Fill Tool</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>An image is represented by an <code>m x n</code> integer grid <code>image</code> where <code>image[i][j]</code> represents the pixel value of the image.</p>
                        <p>You are also given three integers <code>sr</code>, <code>sc</code>, and <code>color</code>. You should perform a <strong>flood fill</strong> on the image starting from the pixel <code>image[sr][sc]</code>.</p>
                        <p>To perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel of the same color as the starting pixel, plus any pixels connected 4-directionally to those pixels (also with the same color), and so on. Replace the color of all of the aforementioned pixels with <code>color</code>.</p>
                    </div>
                    
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white overflow-x-auto whitespace-pre`}>
                       <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                       <span className="text-slate-300 block mb-2"><strong>Input:</strong> image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2</span>
                       <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                       <span className="text-slate-300 block mb-4">[[2,2,2],[2,2,0],[2,0,1]]</span>
                       <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                       <span className="text-slate-400 text-xs">From the center of the image with position (sr, sc) = (1, 1) (i.e., the red pixel), all pixels connected by a path of the same color as the starting pixel are colored with the new color.<br/>Note the bottom corner is not colored 2, because it is not 4-directionally connected to the starting pixel.</span>
                    </div>
                </section>
                
                <section className="my-10 flex flex-col items-center">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-6">Algorithm Strategy Mechanics</h4>
                    <div className="flex flex-col md:flex-row gap-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner w-full justify-center">
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Palette size={16}/> 1. Identify Target</span>
                            <p className="text-sm text-slate-500">Record the initial color at the source coordinate. We only want to modify pixels matching this exact hue.</p>
                        </div>
                        <div className="hidden md:flex items-center w-px bg-slate-300"></div>
                        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                            <span className="text-rose-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ArrowDownToLine size={16}/> 2. Deep Dive (DFS)</span>
                            <p className="text-sm text-slate-500">Paint the current cell, then immediately plunge recursively into the next valid neighbor until hitting a wall. The Call Stack handles the backtracking automatically.</p>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Split Screen Normal Mode */}
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                {renderTraceOperationsBox()}
                
                <div className="bg-[#1e293b] px-5 py-3 border-y border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                  <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                </div>
                <div ref={codeContainerRef} className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pb-10 min-h-[300px] max-h-[500px]">
                  {selectedOp.code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                  ))}
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid (Use | for rows)</label>
                            <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1 1 1 | 1 1 0" />
                        </div>
                        <div className="md:col-span-1 space-y-1.5 flex gap-2">
                             <div className="w-1/2">
                                <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>sr</label>
                                <input type="number" min="0" value={srInput} onChange={(e) => setSrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} />
                             </div>
                             <div className="w-1/2">
                                <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>sc</label>
                                <input type="number" min="0" value={scInput} onChange={(e) => setScInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} />
                             </div>
                        </div>
                        <div className="md:col-span-1 space-y-1.5">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>New Color</label>
                            <input type="number" min="0" value={newColorInput} onChange={(e) => setNewColorInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} />
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

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-2 md:p-8 relative flex flex-col shadow-inner overflow-hidden flex-1 min-h-[600px]">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none flex flex-col gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-500`}><Compass size={14} className={`text-${themeColor}-500`}/> Spatial Paint Visualizer</span>
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
                    <div className="inline-flex items-center justify-center p-4 bg-rose-100 text-rose-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Deconstructing the grid traversal mechanics and why Depth-First Search is perfect for contiguous mapping.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowDownToLine size={24} className="text-indigo-500"/> Depth First Search (DFS)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Instead of evaluating all neighbors at once like BFS, DFS dives blindly into the first valid neighbor it finds. It continues plunging deeper and deeper into the matrix until it hits a boundary or a mismatched color. Only then does it backtrack. The system's Call Stack acts as the memory backbone.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Compass size={24} className="text-sky-500"/> 4-Directional Vectors</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The algorithm dynamically calculates neighbors using <code>delRow = [-1, 0, 1, 0]</code> and <code>delCol = [0, 1, 0, -1]</code>. This cleanly tests Up, Right, Down, and Left respectively within a tidy `for` loop, eliminating messy repetitive `if-else` blocks.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><CheckCircle2 size={24} className="text-emerald-500"/> Implicit Visited Array</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Notice there is no boolean <code>visited[][]</code> matrix here! Because we are fundamentally modifying the pixel color to <code>newColor</code> instantly upon entering, any backward checks will fail the <code>ans[nrow][ncol] != newColor</code> condition naturally. The matrix itself acts as the visited state tracker.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N * M)</strong><br/>In the worst-case scenario, the initial color covers the entire matrix, meaning we must visit and paint every single pixel exactly once. This scales linearly with the total area of the matrix.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N * M)</strong><br/>While no auxiliary data structures are explicitly allocated, the implicit Call Stack grows with each recursive plunge. If the shape is a massive snake covering the grid, the recursion depth will hit $N \times M$ frames before backtracking.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-rose-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Flood Fill tests your foundational knowledge of recursive bounds checking. Interviewers will look closely at how you handle infinite loops and in-place memory modifications."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we need the optimization check `if (iniColor == newColor)`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent an immediate infinite StackOverflow."</p>
                            <p>If the source pixel is already the target color, calling DFS means it paints the cell with the *same* color. When it looks at its neighbors, they appear as valid unpainted targets because their color technically still equals <code>iniColor</code>. It will bounce endlessly between cells forever because the terminating state (being a different color) is never achieved."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What happens if we use BFS instead of DFS? Is it better?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Both are $O(N \times M)$ time. BFS avoids Call Stack overflow risks."</p>
                            <p>For standard matrices, DFS is shorter to write in a whiteboard interview. However, for a $10000 \times 10000$ grid, DFS will crash the system due to recursion depth limits. BFS uses a Heap-allocated Queue object, meaning memory scales safely up to the RAM limit, making it definitively better for extreme production constraints."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Grid size={24}/></span>
                            <span>Q3: "Can you explain why we don't use a `visited[][]` array here?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We manipulate the input array in-place."</p>
                            <p>By immediately writing <code>ans[row][col] = newColor</code>, we permanently destroy the <code>iniColor</code> footprint. Since our DFS condition explicitly requires <code>image[nrow][ncol] == iniColor</code>, a cell we have already visited and painted will automatically fail this check. The state mutation itself acts as our memory tracker, saving $O(N \times M)$ auxiliary array overhead."</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* FIXED LEFT SIDEBAR: Trace Top, Code Bottom */}
              <div className="w-[450px] lg:w-[500px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {/* Pinned Trace Box */}
                  {renderTraceOperationsBox()}

                  {/* Auto-scrolling Source Code */}
                  <div className="bg-[#1e293b] px-5 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Source Code</span>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 relative pb-32" id="fullscreen-code-container">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                  </div>
              </div>

              {/* RIGHT CANVAS AREA */}
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <button className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all bg-${themeColor}-600 text-white shadow-md`}>
                              {selectedOp.icon} <span>{selectedOp.title}</span>
                          </button>
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                           <div className="flex gap-2 w-full">
                                <div className="space-y-1.5 flex-[2]">
                                    <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Grid Matrix (Use | for rows)</label>
                                    <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1 1 1 | 1 1 0" />
                                </div>
                                <div className="space-y-1.5 w-16">
                                    <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>sr</label>
                                    <input type="number" min="0" value={srInput} onChange={(e) => setSrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} />
                                </div>
                                <div className="space-y-1.5 w-16">
                                    <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>sc</label>
                                    <input type="number" min="0" value={scInput} onChange={(e) => setScInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} />
                                </div>
                                <div className="space-y-1.5 w-20">
                                    <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>newColor</label>
                                    <input type="number" min="0" value={newColorInput} onChange={(e) => setNewColorInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} />
                                </div>
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
                      {/* Flex Row Layout precisely enforced for Grid on Left, Queue on Right */}
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-row justify-center items-center gap-12 lg:gap-24 pt-16" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
                           
                           {/* Only rendering pure visuals here to enforce strict side-by-side spacing */}
                           {st.grid !== undefined && (
                                <>
                                    {/* Grid Visual */}
                                    <div className="relative flex flex-col gap-1.5 p-6 bg-white/90 rounded-3xl shadow-2xl border border-slate-300 backdrop-blur-sm z-10 shrink-0">
                                        <span className="absolute -top-3 left-6 bg-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 shadow-sm border border-slate-200">Image Grid (int[][])</span>
                                        {st.grid.map((rowArr: number[], rIdx: number) => (
                                            <div key={`rf-${rIdx}`} className="flex gap-1.5">
                                                {rowArr.map((cellValue: number, cIdx: number) => {
                                                    let isActive = st.activeR === rIdx && st.activeC === cIdx;
                                                    let isCheck = st.checkR === rIdx && st.checkC === cIdx;
                                                    let isSource = validSr === rIdx && validSc === cIdx && st.phase === 'init';
                                                    
                                                    // Minimalistic Base Styling tied to integer value
                                                    let bgClass = getColorTheme(cellValue);
                                                    let ringClass = 'border-2';
                                                    let scaleClass = 'scale-100';
                                                    let zIndex = 'z-10';

                                                    if (isActive) {
                                                        ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent shadow-lg';
                                                        scaleClass = 'scale-110';
                                                        zIndex = 'z-30';
                                                    } else if (isCheck) {
                                                        let isMatchingTarget = cellValue === st.iniColor && cellValue !== validNewColor;
                                                        ringClass = isMatchingTarget ? 'ring-4 ring-emerald-400 ring-offset-2 border-transparent shadow-md' : 'ring-4 ring-rose-400 ring-offset-2 border-transparent shadow-md';
                                                        scaleClass = 'scale-105';
                                                        zIndex = 'z-20';
                                                    } else if (isSource) {
                                                        ringClass = 'ring-4 ring-indigo-500 ring-offset-2 border-transparent animate-pulse';
                                                        scaleClass = 'scale-105';
                                                        zIndex = 'z-20';
                                                    }

                                                    let cellClass = `w-16 h-16 flex items-center justify-center font-mono font-black text-2xl rounded-xl transition-all duration-300 relative select-none ${bgClass} ${ringClass} ${scaleClass} ${zIndex}`;

                                                    return (
                                                        <div key={`cf-${rIdx}-${cIdx}`} className={cellClass}>
                                                            {cellValue}
                                                            <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-black/20 opacity-0 group-hover:opacity-100">{rIdx},{cIdx}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Call Stack Visual */}
                                    <div className="flex flex-col items-center shrink-0 w-[260px]">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2"><Layers size={12}/> System Call Stack</span>
                                        <div className="flex flex-col w-full bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-2xl p-4 gap-2 relative min-h-[400px] max-h-[600px] overflow-y-auto scrollbar-thin">
                                            <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white/90 backdrop-blur z-10 mb-2">
                                                <span>TOP (CURRENT)</span>
                                            </div>
                                            
                                            <div className="flex flex-col gap-2 transition-all duration-500">
                                                {[...(st.stack || [])].reverse().map((val: {r: number, c: number}, i: number) => {
                                                    let isTop = i === 0;
                                                    let isEntering = isTop && st.phase === 'dfs_enter';
                                                    
                                                    return (
                                                        <div key={`qf-${i}-${val.r}-${val.c}`} className={`px-4 py-3 flex items-center justify-between font-mono font-black rounded-xl border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-indigo-500 border-indigo-600 text-white animate-in slide-in-from-top-4' : (isTop ? 'bg-slate-700 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-400')}`}>
                                                            <span>dfs({val.r}, {val.c})</span>
                                                            {isTop && <Activity size={14} className={isEntering ? "animate-pulse" : "opacity-50"}/>}
                                                        </div>
                                                    )
                                                })}
                                                {st.stack && st.stack.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-4">Stack is empty</span>}
                                            </div>

                                            <div className="sticky bottom-0 left-0 right-0 text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center pt-2 border-t border-slate-100 bg-white/90 backdrop-blur z-10 mt-auto">
                                                BOTTOM (BASE)
                                            </div>
                                        </div>
                                    </div>
                                </>
                           )}

                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-rose-500`}></div>
                                
                                <div className="w-24 h-24 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-rose-500/10"><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">FLOOD FILL COMPLETE</h2>
                                <p className="text-rose-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Successfully propagated the new color.</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-2">Original Color Swapped</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex items-center gap-2">{st.iniColor} <ArrowRight size={20} className="text-slate-500"/> {validNewColor}</div>
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