import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ArrowUp, ArrowLeft,
  ChevronLeft, ChevronRight, Network, Database, RotateCcw, 
  ListOrdered, RefreshCw, Zap, Goal, Info, Layers, 
  ZoomIn, ZoomOut, Maximize, Hash, Trash2, Search,
  Scissors, ShieldAlert, Cpu, Lightbulb, PlayCircle,
  MonitorPlay, PartyPopper, CheckCircle2, XCircle, X,
  Filter, Terminal, Braces, Layout, Minimize, Repeat,
  GitCommit, Split, GitMerge, Share2, MousePointer2, 
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, ArrowLeftToLine, AlignVerticalSpaceAround,
  SkipForward, SplitSquareHorizontal, ShieldX, MapPin, Replace, Target, Keyboard, Type, KeyRound, Box, Landmark, Calculator, Plus, Minus, History, Grid3x3, LayoutGrid, AlertOctagon, Repeat1, AlignLeft, XSquare, ArrowRightLeft, TrendingUp, SearchCode, Languages, Link2, Puzzle, Users, BoxSelect
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  boundaryPointers: {
    id: 'boundaryPointers',
    title: '1. Boundary Shrink (Optimal)',
    icon: <BoxSelect size={16} />,
    complexity: 'Time: O(M×N) | Space: O(1)',
    code: `public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> res = new ArrayList<>();
    if (matrix == null || matrix.length == 0) return res;
    
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // 1. Traverse Right
        for (int i = left; i <= right; i++) {
            res.add(matrix[top][i]);
        }
        top++;
        
        // 2. Traverse Down
        for (int i = top; i <= bottom; i++) {
            res.add(matrix[i][right]);
        }
        right--;
        
        // 3. Traverse Left
        if (top <= bottom) {
            for (int i = right; i >= left; i--) {
                res.add(matrix[bottom][i]);
            }
            bottom--;
        }
        
        // 4. Traverse Up
        if (left <= right) {
            for (int i = bottom; i >= top; i--) {
                res.add(matrix[i][left]);
            }
            left++;
        }
    }
    return res;
}`,
    desc: "The O(1) space gold standard. We maintain 4 boundary pointers: top, bottom, left, and right. We simulate the spiral by traversing the top boundary, shrinking the top pointer, traversing the right boundary, shrinking the right pointer, and so on. We must strictly check if boundaries have crossed before traversing Left or Up to prevent duplicates in non-square matrices."
  },
  visitedMatrix: {
    id: 'visitedMatrix',
    title: '2. Visited Array (Simulation)',
    icon: <Grid3x3 size={16} />,
    complexity: 'Time: O(M×N) | Space: O(M×N)',
    code: `public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> res = new ArrayList<>();
    if (matrix.length == 0) return res;
    
    int m = matrix.length, n = matrix[0].length;
    boolean[][] visited = new boolean[m][n];
    
    int[] dr = {0, 1, 0, -1};
    int[] dc = {1, 0, -1, 0};
    
    int r = 0, c = 0, dir = 0;
    
    for (int i = 0; i < m * n; i++) {
        res.add(matrix[r][c]);
        visited[r][c] = true;
        
        int nextR = r + dr[dir];
        int nextC = c + dc[dir];
        
        if (nextR >= 0 && nextR < m && nextC >= 0 && nextC < n && !visited[nextR][nextC]) {
            r = nextR;
            c = nextC;
        } else {
            dir = (dir + 1) % 4;
            r = r + dr[dir];
            c = c + dc[dir];
        }
    }
    return res;
}`,
    desc: "An intuitive simulation approach. We maintain a Direction vector (Right, Down, Left, Up) and an M x N boolean 'visited' matrix. We move forward until we hit the edge of the matrix OR a previously visited cell. Then, we rotate 90 degrees clockwise. Simple, but costs O(M*N) auxiliary space."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|List|ArrayList|add|null)\b|\b\d+\b|[\+\-\*\/\%\=\<\>])/g).filter(Boolean);
  const activeStyles = { bg: `bg-indigo-500/20`, border: `border-indigo-400`, text: `text-indigo-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-indigo-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new', 'null'].includes(part);
            const isObject = ['List', 'ArrayList'].includes(part);
            const isVar = ['matrix', 'res', 'top', 'bottom', 'left', 'right', 'i', 'm', 'n', 'visited', 'dr', 'dc', 'r', 'c', 'dir', 'nextR', 'nextC'].includes(part);
            const isMapCall = ['length', 'add'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-indigo-200';
            else if (isMapCall) className = 'text-fuchsia-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (!isNaN(parseInt(part.trim())) && part.trim() !== '') className = 'text-emerald-400';

            return (
              <span key={i} className={className}>
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

// --- Main Application ---

export default function SpiralMatrixVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('boundaryPointers');
  
  const defaultMatrix = [
    "1, 2, 3, 4",
    "5, 6, 7, 8",
    "9, 10, 11, 12"
  ].join('\n');

  const [inputString, setInputString] = useState(defaultMatrix);
  const [baseGrid, setBaseGrid] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(1); 
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

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
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

  const parseInput = (str) => {
      const lines = str.trim().split('\n');
      const grid = [];
      for(let r=0; r<lines.length; r++) {
          if (!lines[r].trim()) continue;
          const cells = lines[r].split(',').map(s=>parseInt(s.trim())).filter(n => !isNaN(n));
          if (cells.length > 0) grid.push(cells);
      }
      
      // Ensure rectangular
      if (grid.length > 0) {
          const maxCols = Math.max(...grid.map(row => row.length));
          grid.forEach(row => {
              while(row.length < maxCols) row.push(0);
          });
      }
      return grid;
  };

  useEffect(() => {
    const grid = parseInput(inputString);
    setBaseGrid(grid);
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputString, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps = [];
    if (!baseGrid || baseGrid.length === 0 || baseGrid[0].length === 0) {
        return [{ phase: 'Init', description: 'Enter a valid M x N matrix.', line: 0, state: { grid: [], res: [], visited: [] } }];
    }
    
    const m = baseGrid.length;
    const n = baseGrid[0].length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            grid: baseGrid,
            m, n,
            ...st 
        } 
    });

    if (selectedOpId === 'boundaryPointers') {
        let res = [];
        let visited = [];
        let top = 0, bottom = m - 1;
        let left = 0, right = n - 1;

        add("Initialize", `Set top=0, bottom=${bottom}, left=0, right=${right}. Initialize empty res list.`, 5, { res: [...res], visited: [...visited], top, bottom, left, right });

        while (true) {
            add("While Loop Check", `while (top <= bottom && left <= right) -> (${top} <= ${bottom} && ${left} <= ${right})`, 7, { res: [...res], visited: [...visited], top, bottom, left, right, checkWhile: true });
            
            if (!(top <= bottom && left <= right)) {
                add("While Terminates", `Boundaries have crossed! Terminate main loop.`, 7, { res: [...res], visited: [...visited], top, bottom, left, right, failWhile: true });
                break;
            }

            // 1. Right
            add("Traverse Right", `Move left to right along top boundary. i goes from ${left} to ${right}.`, 9, { res: [...res], visited: [...visited], top, bottom, left, right, dir: 'R' });
            for (let i = left; i <= right; i++) {
                res.push(baseGrid[top][i]);
                visited.push(`${top}-${i}`);
                add("Add Element", `res.add(matrix[${top}][${i}]) -> Add ${baseGrid[top][i]}.`, 10, { res: [...res], visited: [...visited], top, bottom, left, right, r: top, c: i, dir: 'R' });
            }
            top++;
            add("Shrink Top", `top++ -> Top boundary shrinks down to row ${top}.`, 12, { res: [...res], visited: [...visited], top, bottom, left, right, justUpdated: 'top' });

            // 2. Down
            add("Traverse Down", `Move top to bottom along right boundary. i goes from ${top} to ${bottom}.`, 15, { res: [...res], visited: [...visited], top, bottom, left, right, dir: 'D' });
            for (let i = top; i <= bottom; i++) {
                res.push(baseGrid[i][right]);
                visited.push(`${i}-${right}`);
                add("Add Element", `res.add(matrix[${i}][${right}]) -> Add ${baseGrid[i][right]}.`, 16, { res: [...res], visited: [...visited], top, bottom, left, right, r: i, c: right, dir: 'D' });
            }
            right--;
            add("Shrink Right", `right-- -> Right boundary shrinks left to col ${right}.`, 18, { res: [...res], visited: [...visited], top, bottom, left, right, justUpdated: 'right' });

            // 3. Left
            add("Guard Clause (Left)", `if (top <= bottom) -> Is ${top} <= ${bottom}? We must check to avoid duplicating rows in asymmetric matrices.`, 21, { res: [...res], visited: [...visited], top, bottom, left, right, checkGuard1: true });
            if (top <= bottom) {
                add("Traverse Left", `Move right to left along bottom boundary. i goes from ${right} down to ${left}.`, 22, { res: [...res], visited: [...visited], top, bottom, left, right, dir: 'L' });
                for (let i = right; i >= left; i--) {
                    res.push(baseGrid[bottom][i]);
                    visited.push(`${bottom}-${i}`);
                    add("Add Element", `res.add(matrix[${bottom}][${i}]) -> Add ${baseGrid[bottom][i]}.`, 23, { res: [...res], visited: [...visited], top, bottom, left, right, r: bottom, c: i, dir: 'L' });
                }
                bottom--;
                add("Shrink Bottom", `bottom-- -> Bottom boundary shrinks up to row ${bottom}.`, 25, { res: [...res], visited: [...visited], top, bottom, left, right, justUpdated: 'bottom' });
            } else {
                add("Skip Traverse Left", `${top} is NOT <= ${bottom}. All rows processed. Skip left traversal to avoid duplicates.`, 21, { res: [...res], visited: [...visited], top, bottom, left, right, failGuard1: true });
            }

            // 4. Up
            add("Guard Clause (Up)", `if (left <= right) -> Is ${left} <= ${right}? We must check to avoid duplicating columns.`, 29, { res: [...res], visited: [...visited], top, bottom, left, right, checkGuard2: true });
            if (left <= right) {
                add("Traverse Up", `Move bottom to top along left boundary. i goes from ${bottom} down to ${top}.`, 30, { res: [...res], visited: [...visited], top, bottom, left, right, dir: 'U' });
                for (let i = bottom; i >= top; i--) {
                    res.push(baseGrid[i][left]);
                    visited.push(`${i}-${left}`);
                    add("Add Element", `res.add(matrix[${i}][${left}]) -> Add ${baseGrid[i][left]}.`, 31, { res: [...res], visited: [...visited], top, bottom, left, right, r: i, c: left, dir: 'U' });
                }
                left++;
                add("Shrink Left", `left++ -> Left boundary shrinks right to col ${left}.`, 33, { res: [...res], visited: [...visited], top, bottom, left, right, justUpdated: 'left' });
            } else {
                add("Skip Traverse Up", `${left} is NOT <= ${right}. All columns processed. Skip up traversal to avoid duplicates.`, 29, { res: [...res], visited: [...visited], top, bottom, left, right, failGuard2: true });
            }
        }

        add("Return Result", `Spiral complete! Returning result list of length ${res.length}.`, 36, { res: [...res], visited: [...visited], top, bottom, left, right, isSuccess: true });

    } else if (selectedOpId === 'visitedMatrix') {
        let res = [];
        let visited = [];
        const dr = [0, 1, 0, -1];
        const dc = [1, 0, -1, 0];
        
        let r = 0, c = 0, dir = 0;
        
        add("Initialize Arrays", `Create boolean visited matrix of size ${m}x${n}. dr/dc arrays track [R, D, L, U] directions.`, 7, { res: [...res], visited: [...visited], r, c, dir });

        for (let i = 0; i < m * n; i++) {
            res.push(baseGrid[r][c]);
            visited.push(`${r}-${c}`);
            add("Add and Mark Visited", `res.add(matrix[${r}][${c}]); visited[${r}][${c}] = true;`, 14, { res: [...res], visited: [...visited], r, c, dir, justAdded: true });
            
            let nextR = r + dr[dir];
            let nextC = c + dc[dir];
            
            add("Probe Next Cell", `Calculate next cell in current direction: (${nextR}, ${nextC}).`, 18, { res: [...res], visited: [...visited], r, c, dir, nextR, nextC });

            let inBounds = nextR >= 0 && nextR < m && nextC >= 0 && nextC < n;
            let isVisited = visited.includes(`${nextR}-${nextC}`);

            add("Boundary Check", `if(next in bounds && !visited) -> In bounds? ${inBounds}. Visited? ${isVisited}.`, 20, { res: [...res], visited: [...visited], r, c, dir, nextR, nextC, checkingBounds: true });

            if (inBounds && !isVisited) {
                r = nextR;
                c = nextC;
                add("Move Forward", `Valid! Update position to (${r}, ${c}).`, 21, { res: [...res], visited: [...visited], r, c, dir });
            } else {
                let oldDir = dir;
                dir = (dir + 1) % 4;
                r = r + dr[dir];
                c = c + dc[dir];
                add("Rotate & Move", `Blocked! Rotate 90 degrees clockwise. Dir ${oldDir} -> ${dir}. Move to new position (${r}, ${c}).`, 24, { res: [...res], visited: [...visited], r, c, dir, rotated: true });
            }
        }

        add("Return Result", `Visited all ${m*n} cells. Return result list.`, 29, { res: [...res], visited: [...visited], isSuccess: true });
    }

    return steps;
  }, [baseGrid, selectedOpId]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { grid: [], res: [], visited: [] } };
  const st = curStepData.state || { grid: [], res: [], visited: [] };
  const isLastStep = currentStep === trace.length - 1;

  // --- Rendering Helpers ---

  const renderMatrix = (isTheater = false) => {
      if (!st.grid || st.grid.length === 0) return <span className="text-slate-400 italic">empty</span>;

      // Mathematical Positioning for Boundary Lines
      // Calculate exact dimensions based on cell sizes and gaps
      const cellW = isTheater ? 80 : 56;  // w-20 vs w-14
      const cellH = isTheater ? 64 : 48;  // h-16 vs h-12
      const gap = isTheater ? 12 : 8;     // gap-3 vs gap-2
      const pad = isTheater ? 32 : 24;    // p-8 vs p-6
      
      const getLineCoords = () => {
          const safeTop = Math.max(0, Math.min(st.m, st.top));
          const safeBot = Math.max(-1, Math.min(st.m - 1, st.bottom));
          const safeLeft = Math.max(0, Math.min(st.n, st.left));
          const safeRight = Math.max(-1, Math.min(st.n - 1, st.right));

          return {
              topY: pad + safeTop * (cellH + gap) - (gap / 2),
              botY: pad + safeBot * (cellH + gap) + cellH + (gap / 2),
              leftX: pad + safeLeft * (cellW + gap) - (gap / 2),
              rightX: pad + safeRight * (cellW + gap) + cellW + (gap / 2)
          }
      };

      const coords = getLineCoords();
      
      // Styling classes to swap out based on mode
      const padClass = isTheater ? "p-8" : "p-6";
      const gapClass = isTheater ? "gap-3" : "gap-2";
      const sizeClass = isTheater ? "w-20 h-16 text-3xl rounded-2xl" : "w-14 h-12 text-xl rounded-xl";
      const lineOffset = isTheater ? "-40px" : "-24px";
      const labelTextClass = isTheater ? "text-sm" : "text-[10px]";

      return (
          <div className={`flex flex-col ${gapClass} ${padClass} border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-md w-max relative mx-16 my-8`}>
              
              {/* External Boundary Lines drawn perfectly inside gaps */}
              {selectedOpId === 'boundaryPointers' && st.top !== undefined && (
                  <>
                      {/* TOP Boundary Line */}
                      <div className="absolute h-[4px] bg-rose-400 z-30 transition-all duration-500 rounded-full shadow-[0_2px_4px_rgba(244,63,94,0.3)]" style={{ top: `${coords.topY}px`, left: lineOffset, right: lineOffset }}>
                          <div className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-rose-100 text-rose-700 border-2 border-rose-400 font-black px-3 py-1 rounded-xl whitespace-nowrap shadow-md ${labelTextClass}`}>Top = {st.top}</div>
                      </div>
                      
                      {/* BOTTOM Boundary Line */}
                      <div className="absolute h-[4px] bg-fuchsia-400 z-30 transition-all duration-500 rounded-full shadow-[0_2px_4px_rgba(217,70,239,0.3)]" style={{ top: `${coords.botY}px`, left: lineOffset, right: lineOffset }}>
                          <div className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-fuchsia-100 text-fuchsia-700 border-2 border-fuchsia-400 font-black px-3 py-1 rounded-xl whitespace-nowrap shadow-md ${labelTextClass}`}>Bot = {st.bottom}</div>
                      </div>
                      
                      {/* LEFT Boundary Line */}
                      <div className="absolute w-[4px] bg-sky-400 z-30 transition-all duration-500 rounded-full shadow-[2px_0_4px_rgba(56,189,248,0.3)]" style={{ left: `${coords.leftX}px`, top: lineOffset, bottom: lineOffset }}>
                          <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-sky-100 text-sky-700 border-2 border-sky-400 font-black px-3 py-1 rounded-xl whitespace-nowrap shadow-md ${labelTextClass}`}>Left = {st.left}</div>
                      </div>
                      
                      {/* RIGHT Boundary Line */}
                      <div className="absolute w-[4px] bg-amber-400 z-30 transition-all duration-500 rounded-full shadow-[-2px_0_4px_rgba(245,158,11,0.3)]" style={{ left: `${coords.rightX}px`, top: lineOffset, bottom: lineOffset }}>
                          <div className={`absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-700 border-2 border-amber-400 font-black px-3 py-1 rounded-xl whitespace-nowrap shadow-md ${labelTextClass}`}>Right = {st.right}</div>
                      </div>
                  </>
              )}

              {st.grid.map((row, r) => (
                  <div key={`r-${r}`} className={`flex ${gapClass}`}>
                      {row.map((val, c) => {
                          const coord = `${r}-${c}`;
                          const isVisited = st.visited && st.visited.includes(coord);
                          const isActive = st.r === r && st.c === c;
                          const isNext = selectedOpId === 'visitedMatrix' && st.nextR === r && st.nextC === c;
                          
                          let outOfBounds = false;
                          if (selectedOpId === 'boundaryPointers' && st.top !== undefined) {
                              if (r < st.top || r > st.bottom || c < st.left || c > st.right) outOfBounds = true;
                          }

                          let bgClass = "bg-slate-50 text-slate-600 border-slate-200";
                          let scale = "scale-100";
                          let z = "z-0";

                          if (isActive) {
                              bgClass = "bg-indigo-500 text-white border-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]";
                              scale = "scale-110";
                              z = "z-20";
                          } else if (isNext) {
                              bgClass = "bg-amber-100 text-amber-800 border-amber-400 border-dashed border-4";
                              scale = "scale-105";
                              z = "z-10";
                          } else if (isVisited) {
                              bgClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
                          }

                          let opacityClass = outOfBounds ? "opacity-20 grayscale scale-95" : "opacity-100";

                          return (
                              <div key={coord} className={`${sizeClass} flex items-center justify-center border-[3px] font-mono font-black transition-all duration-300 ${bgClass} ${scale} ${z} ${opacityClass}`}>
                                  {val}
                              </div>
                          );
                      })}
                  </div>
              ))}
          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <BoxSelect className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Spiral Matrix</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      LC 54 • Arrays & Matrix
                  </span>
                  <span>•</span>
                  <span>O(1) Space Constraint</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className="flex items-center gap-3 text-indigo-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given an <code>m x n</code> matrix, return all elements of the matrix in spiral order.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-indigo-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Example 1 (Square Matrix)</span>
                        <div><span className="text-white font-bold">Input:</span> matrix = [[1,2,3],[4,5,6],[7,8,9]]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [1,2,3,6,9,8,7,4,5]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Outer ring clockwise, then the inner core.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px]">Example 2 (Asymmetric Matrix)</span>
                        <div><span className="text-white font-bold">Input:</span> matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [1,2,3,4,8,12,11,10,9,5,6,7]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Notice how the inner row (6,7) only traverses left-to-right, and does not duplicate back.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Challenges</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li><code>m == matrix.length</code></li>
                        <li><code>n == matrix[i].length</code></li>
                        <li>1 &lt;= m, n &lt;= 10</li>
                        <li>-100 &lt;= matrix[i][j] &lt;= 100</li>
                        <li className="font-bold text-rose-500 mt-2">Challenge: Solve this in strictly O(1) auxiliary space (excluding the output array).</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-indigo-600 text-white border-indigo-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-indigo-200' : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1 flex justify-between">
                                <span>Input M x N Matrix (CSV rows)</span>
                            </label>
                            <textarea 
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-[10px] sm:text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner h-[80px] resize-none whitespace-pre overflow-auto scrollbar-thin" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center h-[80px] pb-1">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : st.failWhile || st.failGuard1 || st.failGuard2 ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Spiral Complete</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-indigo-500"/> Array & State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-8 items-center overflow-x-auto overflow-y-auto scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Strict Flexbox Hierarchy */}

                           {/* Running Variables */}
                           {selectedOpId === 'boundaryPointers' && st.top !== undefined && (
                               <div className="flex gap-4">
                                   <div className={`flex flex-col items-center bg-white border-2 p-2 rounded-xl min-w-[80px] shadow-sm transition-colors ${st.justUpdated === 'top' ? 'border-rose-400 bg-rose-50 scale-110' : 'border-slate-200'}`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-rose-500">Top</span>
                                       <span className="font-mono font-black text-xl text-slate-700">{st.top}</span>
                                   </div>
                                   <div className={`flex flex-col items-center bg-white border-2 p-2 rounded-xl min-w-[80px] shadow-sm transition-colors ${st.justUpdated === 'bottom' ? 'border-fuchsia-400 bg-fuchsia-50 scale-110' : 'border-slate-200'}`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-fuchsia-500">Bot</span>
                                       <span className="font-mono font-black text-xl text-slate-700">{st.bottom}</span>
                                   </div>
                                   <div className={`flex flex-col items-center bg-white border-2 p-2 rounded-xl min-w-[80px] shadow-sm transition-colors ${st.justUpdated === 'left' ? 'border-sky-400 bg-sky-50 scale-110' : 'border-slate-200'}`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-sky-500">Left</span>
                                       <span className="font-mono font-black text-xl text-slate-700">{st.left}</span>
                                   </div>
                                   <div className={`flex flex-col items-center bg-white border-2 p-2 rounded-xl min-w-[80px] shadow-sm transition-colors ${st.justUpdated === 'right' ? 'border-amber-400 bg-amber-50 scale-110' : 'border-slate-200'}`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-amber-500">Right</span>
                                       <span className="font-mono font-black text-xl text-slate-700">{st.right}</span>
                                   </div>
                               </div>
                           )}
                           {selectedOpId === 'visitedMatrix' && st.dir !== undefined && (
                                <div className="flex gap-4">
                                   <div className="flex flex-col items-center bg-white border-2 border-slate-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                       <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Row</span>
                                       <span className="font-mono font-black text-xl text-indigo-600">{st.r}</span>
                                   </div>
                                   <div className="flex flex-col items-center bg-white border-2 border-slate-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                       <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Col</span>
                                       <span className="font-mono font-black text-xl text-indigo-600">{st.c}</span>
                                   </div>
                                   <div className={`flex flex-col items-center border-2 p-2 rounded-xl min-w-[100px] shadow-sm transition-all ${st.rotated ? 'bg-amber-100 border-amber-400 scale-110' : 'bg-white border-slate-200'}`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-amber-600">Dir</span>
                                       <span className="font-mono font-black text-xl text-slate-800">{st.dir === 0 ? 'Right →' : st.dir === 1 ? 'Down ↓' : st.dir === 2 ? 'Left ←' : 'Up ↑'}</span>
                                   </div>
                               </div>
                           )}

                           {/* Main Matrix Rendering */}
                           {renderMatrix(false)}

                           {/* Output Array Building */}
                           {st.res && (
                               <div className="flex flex-col items-center w-full max-w-4xl mt-4">
                                   <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><ListOrdered size={12}/> Output List</div>
                                   <div className="flex gap-2 p-4 border-2 border-emerald-200 bg-emerald-50/80 rounded-2xl shadow-md backdrop-blur-sm flex-wrap justify-center w-full min-h-[60px]">
                                       {st.res.length === 0 && <span className="text-emerald-400/50 italic text-sm font-mono mt-1">Empty</span>}
                                       {st.res.map((val, idx) => {
                                           const isJustAdded = idx === st.res.length - 1 && st.phase === 'Add Element' || st.phase === 'Add and Mark Visited';
                                           return (
                                               <div key={`out-${idx}`} className={`w-8 h-8 flex items-center justify-center border-2 border-emerald-400 bg-white text-emerald-800 font-mono font-bold rounded-lg shadow-sm transition-all duration-300 ${isJustAdded ? 'scale-125 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-20' : ''}`}>
                                                   {val}
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
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><BoxSelect size={120}/></div>
                        <h3 className="font-black text-indigo-400 text-lg uppercase tracking-widest mb-6">The Boundary Shrink Strategy</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>To avoid $O(M \times N)$ auxiliary space, we don't use a "visited" array. Instead, we define 4 strict mathematical boundaries: <code>top</code>, <code>bottom</code>, <code>left</code>, and <code>right</code>.</p>
                            <p>We traverse the perimeter of these boundaries exactly once per ring. After traversing the <code>top</code> row, that row is effectively "done", so we simply do <code>top++</code> to push the boundary inward.</p>
                            <p>The spiral is literally just peeling the onion layer by layer until <code>top &gt; bottom</code> or <code>left &gt; right</code>.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-indigo-700 text-lg uppercase tracking-widest mb-6">The Asymmetric Trap</h3>
                        <div className="space-y-4 text-sm text-indigo-900/80 leading-relaxed font-medium">
                            <p>Square matrices ($N \times N$) are easy. The <code>while (top &lt;= bottom &amp;&amp; left &lt;= right)</code> loop handles them perfectly.</p>
                            <p>But what if the matrix is a long rectangle (e.g., $1 \times 5$)?</p>
                            <p>After going Right, <code>top</code> increments. Now <code>top &gt; bottom</code>. The Down traversal safely skips. But without an extra check, the Left traversal will run backwards over the exact same row you just processed!</p>
                            <p>Therefore, you <strong>MUST</strong> check <code>if (top &lt;= bottom)</code> before going Left, and <code>if (left &lt;= right)</code> before going Up.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Why Simulation (Visited Matrix) is Sub-optimal</h3>
                            <p>Using a <code>boolean[][] visited</code> array is highly intuitive. You just walk forward until you hit a wall or a <code>true</code> cell, then turn 90 degrees.</p>
                            <p>However, allocating an $M \times N$ boolean array violates the core intent of the problem, which is to solve it strictly in $O(1)$ space. Interviewers will almost always ask you to optimize it away.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-indigo-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-indigo-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Acing Matrix Traversal</h3>
                    <p className="text-sm text-indigo-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers love this question because it tests your ability to manage off-by-one errors and asymmetric matrix edge cases without getting flustered. State the variables clearly and explicitly call out the duplicate traversal trap."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-indigo-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><ShieldAlert size={16}/></div>
                               1. State Null/Empty Check
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "First, I'll add a quick guard clause. If the matrix is null, or the length is 0, I'll immediately return an empty list to avoid any index out of bounds exceptions."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><BoxSelect size={16}/></div>
                               2. Define the Boundaries
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "To achieve O(1) space, I won't use a 'visited' matrix. I will define 4 boundary pointers: top, bottom, left, and right. I'll use a while loop that continues as long as top &lt;= bottom AND left &lt;= right."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><RefreshCw size={16}/></div>
                               3. Walk the Spiral
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "Inside the loop, I'll execute 4 sequential for-loops. Traverse Right, then increment 'top'. Traverse Down, then decrement 'right'. Traverse Left, decrement 'bottom'. Traverse Up, increment 'left'."
                            </p>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-indigo-800 text-sm uppercase tracking-widest">
                               <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><AlertOctagon size={16}/></div>
                               4. Call Out the Asymmetric Trap
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-indigo-100 shadow-inner flex-1">
                                "Crucially, before traversing Left, I MUST check if 'top &lt;= bottom' again. And before traversing Up, I MUST check if 'left &lt;= right'. Because M and N might not be equal, the pointers could have crossed during the Right/Down phases. If I don't check, I'll end up pushing duplicate elements to my result array."
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[650px] 2xl:w-[800px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : st.failWhile || st.failGuard1 || st.failGuard2 ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-indigo-600 pl-1">Input Matrix (CSV rows)</label>
                              <textarea value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner h-12 resize-none whitespace-pre scrollbar-none" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <Keyboard size={16} />
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-indigo-400 shadow-indigo-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Row 1: Running Variables */}
                           {selectedOpId === 'boundaryPointers' && st.top !== undefined && (
                               <div className="flex gap-6 origin-center">
                                   <div className={`flex flex-col items-center bg-white border-[3px] p-4 rounded-2xl min-w-[120px] shadow-xl transition-all duration-300 ${st.justUpdated === 'top' ? 'border-rose-400 bg-rose-50 scale-110 shadow-rose-200/50' : 'border-slate-200'}`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-rose-500 mb-1">Top</span>
                                       <span className="font-mono font-black text-4xl text-slate-700">{st.top}</span>
                                   </div>
                                   <div className={`flex flex-col items-center bg-white border-[3px] p-4 rounded-2xl min-w-[120px] shadow-xl transition-all duration-300 ${st.justUpdated === 'bottom' ? 'border-fuchsia-400 bg-fuchsia-50 scale-110 shadow-fuchsia-200/50' : 'border-slate-200'}`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-fuchsia-500 mb-1">Bottom</span>
                                       <span className="font-mono font-black text-4xl text-slate-700">{st.bottom}</span>
                                   </div>
                                   <div className={`flex flex-col items-center bg-white border-[3px] p-4 rounded-2xl min-w-[120px] shadow-xl transition-all duration-300 ${st.justUpdated === 'left' ? 'border-sky-400 bg-sky-50 scale-110 shadow-sky-200/50' : 'border-slate-200'}`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-sky-500 mb-1">Left</span>
                                       <span className="font-mono font-black text-4xl text-slate-700">{st.left}</span>
                                   </div>
                                   <div className={`flex flex-col items-center bg-white border-[3px] p-4 rounded-2xl min-w-[120px] shadow-xl transition-all duration-300 ${st.justUpdated === 'right' ? 'border-amber-400 bg-amber-50 scale-110 shadow-amber-200/50' : 'border-slate-200'}`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-amber-500 mb-1">Right</span>
                                       <span className="font-mono font-black text-4xl text-slate-700">{st.right}</span>
                                   </div>
                               </div>
                           )}

                           {selectedOpId === 'visitedMatrix' && st.dir !== undefined && (
                                <div className="flex gap-8 origin-center">
                                   <div className="flex flex-col items-center bg-white border-[3px] border-slate-200 p-4 rounded-2xl min-w-[120px] shadow-xl">
                                       <span className="text-xs uppercase tracking-widest font-black text-slate-500 mb-1">Row</span>
                                       <span className="font-mono font-black text-4xl text-indigo-600">{st.r}</span>
                                   </div>
                                   <div className="flex flex-col items-center bg-white border-[3px] border-slate-200 p-4 rounded-2xl min-w-[120px] shadow-xl">
                                       <span className="text-xs uppercase tracking-widest font-black text-slate-500 mb-1">Col</span>
                                       <span className="font-mono font-black text-4xl text-indigo-600">{st.c}</span>
                                   </div>
                                   <div className={`flex flex-col items-center border-[3px] p-4 rounded-2xl min-w-[150px] shadow-xl transition-all ${st.rotated ? 'bg-amber-100 border-amber-400 scale-110' : 'bg-white border-slate-200'}`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-amber-600 mb-1">Direction</span>
                                       <span className="font-mono font-black text-2xl text-slate-800 mt-2">{st.dir === 0 ? 'Right →' : st.dir === 1 ? 'Down ↓' : st.dir === 2 ? 'Left ←' : 'Up ↑'}</span>
                                   </div>
                               </div>
                           )}

                           {/* Matrix Render */}
                           <div className="origin-center mt-10 relative">
                               {renderMatrix(true)}
                           </div>

                           {/* Output List Render */}
                           {st.res && (
                               <div className="flex flex-col items-center w-full max-w-5xl mt-12 origin-top">
                                   <div className="text-sm font-black text-emerald-600 uppercase tracking-widest font-mono mb-4 bg-emerald-100 px-6 py-2 rounded-full shadow-sm"><ListOrdered size={18} className="inline mr-2 -mt-1"/> Output List</div>
                                   <div className="flex gap-4 p-8 border-4 border-emerald-300 bg-emerald-50/90 rounded-[2rem] shadow-2xl backdrop-blur-md flex-wrap justify-center w-full min-h-[100px] mx-auto">
                                       {st.res.length === 0 && <span className="text-emerald-400/60 italic text-2xl font-mono mt-4">Empty</span>}
                                       {st.res.map((val, idx) => {
                                           const isJustAdded = idx === st.res.length - 1 && st.phase === 'Add Element' || st.phase === 'Add and Mark Visited';
                                           return (
                                               <div key={`out-fs-${idx}`} className={`w-14 h-14 flex items-center justify-center border-[3px] border-emerald-400 bg-white text-emerald-800 font-mono text-2xl font-black rounded-xl shadow-md transition-all duration-300 ${isJustAdded ? 'scale-125 shadow-[0_0_20px_rgba(52,211,153,0.6)] z-20' : ''}`}>
                                                   {val}
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           )}

                      </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-emerald-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    SPIRAL COMPLETE
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest text-emerald-400`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20`}>
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