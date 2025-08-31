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
  Binary, Layers as LayersIcon, CircleDashed, CheckSquare, PlusSquare, AlignLeft, XSquare, ArrowRightLeft, TrendingUp, SearchCode, Languages, Link2, Puzzle, Users, BoxSelect, ArrowUpRight, ArrowDownLeft,
  Keyboard
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  simulation: {
    id: 'simulation',
    title: '1. Direction Simulation (Optimal)',
    icon: <ArrowUpRight size={16} />,
    complexity: 'Time: O(M×N) | Space: O(1)',
    code: `public int[] findDiagonalOrder(int[][] mat) {
    if (mat == null || mat.length == 0) return new int[0];
    
    int m = mat.length, n = mat[0].length;
    int[] res = new int[m * n];
    int r = 0, c = 0;
    boolean up = true;
    
    for (int i = 0; i < m * n; i++) {
        res[i] = mat[r][c];
        
        if (up) {
            // Order matters! Check right bound BEFORE top bound
            if (c == n - 1) { r++; up = false; }
            else if (r == 0) { c++; up = false; }
            else { r--; c++; }
        } else {
            // Order matters! Check bottom bound BEFORE left bound
            if (r == m - 1) { c++; up = true; }
            else if (c == 0) { r++; up = true; }
            else { r++; c--; }
        }
    }
    return res;
}`,
    desc: "The optimal O(1) auxiliary space approach. We simulate the traversal exactly as described using a boolean flag 'up'. Moving Up-Right means (row-1, col+1). Moving Down-Left means (row+1, col-1). When we hit boundaries, we adjust coordinates and flip the direction flag. The critical trap is handling the corners correctly by checking the extreme boundaries first."
  },
  diagonalGrouping: {
    id: 'diagonalGrouping',
    title: '2. Diagonal Grouping (HashMap)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(M×N) | Space: O(M×N)',
    code: `public int[] findDiagonalOrder(int[][] mat) {
    if (mat == null || mat.length == 0) return new int[0];
    
    int m = mat.length, n = mat[0].length;
    Map<Integer, List<Integer>> map = new HashMap<>();
    
    // Group elements by diagonal (r + c is constant)
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            map.computeIfAbsent(r + c, k -> new ArrayList<>()).add(mat[r][c]);
        }
    }
    
    int[] res = new int[m * n];
    int idx = 0;
    
    // Read diagonals. Reverse if sum is even.
    for (int i = 0; i < m + n - 1; i++) {
        List<Integer> diag = map.get(i);
        if (i % 2 == 0) Collections.reverse(diag);
        
        for (int val : diag) res[idx++] = val;
    }
    
    return res;
}`,
    desc: "A highly elegant mathematical approach. Every element on the same diagonal shares the exact same sum of their indices (row + col). We group elements into lists inside a HashMap using (r+c) as the key. Then, we iterate through keys 0 to (m+n-2). If the key is even, we traverse Up-Right (reverse the list). If odd, Down-Left."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|List|ArrayList|Map|HashMap|add|null|true|false)\b|\b\d+\b|[\+\-\*\/\%\=\<\>])/g).filter(Boolean);
  const activeStyles = { bg: `bg-cyan-500/20`, border: `border-cyan-400`, text: `text-cyan-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-cyan-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new', 'null', 'true', 'false'].includes(part);
            const isObject = ['List', 'ArrayList', 'Map', 'HashMap', 'Collections'].includes(part);
            const isVar = ['mat', 'res', 'm', 'n', 'r', 'c', 'up', 'i', 'map', 'diag', 'val', 'idx'].includes(part);
            const isMapCall = ['length', 'add', 'computeIfAbsent', 'get', 'reverse'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-cyan-200';
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

export default function DiagonalTraverseVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('simulation');
  
  const defaultMatrix = [
    "1, 2, 3",
    "4, 5, 6",
    "7, 8, 9"
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
        return [{ phase: 'Init', description: 'Enter a valid M x N matrix.', line: 0, state: { grid: [], res: [], visited: {} } }];
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

    if (selectedOpId === 'simulation') {
        let res = [];
        let visited = {}; // key: "r-c", val: direction ("up" or "down") for visual trail
        let r = 0, c = 0;
        let up = true;

        add("Initialize", `Set r=0, c=0. Start direction 'up' = true. M=${m}, N=${n}.`, 5, { res: [...res], visited: {...visited}, r, c, up });

        for (let i = 0; i < m * n; i++) {
            add("Loop Start", `Iteration ${i}: Read matrix[${r}][${c}].`, 8, { res: [...res], visited: {...visited}, r, c, up, hlCell: true });
            
            res.push(baseGrid[r][c]);
            visited[`${r}-${c}`] = up ? 'up' : 'down';
            
            add("Add to Result", `Add ${baseGrid[r][c]} to result array.`, 9, { res: [...res], visited: {...visited}, r, c, up, hlCell: true, justAdded: true });

            add("Direction Check", `if (${up ? 'up' : '!up'}) -> Currently moving ${up ? 'Up-Right ↗' : 'Down-Left ↙'}.`, up ? 11 : 16, { res: [...res], visited: {...visited}, r, c, up });

            if (up) {
                // UP-RIGHT TRAVERSAL
                add("Bounds Check (Up)", `Check boundaries. Right edge (c == n-1)? Top edge (r == 0)?`, 13, { res: [...res], visited: {...visited}, r, c, up, checkingBounds: true });
                
                if (c === n - 1) {
                    add("Hit Right Edge", `c == ${n-1} (Right edge). MUST check this BEFORE top edge to handle top-right corner safely! Move DOWN (r++) and flip direction.`, 13, { res: [...res], visited: {...visited}, r, c, up, boundHit: 'right' });
                    r++;
                    up = false;
                } else if (r === 0) {
                    add("Hit Top Edge", `r == 0 (Top edge). Move RIGHT (c++) and flip direction.`, 14, { res: [...res], visited: {...visited}, r, c, up, boundHit: 'top' });
                    c++;
                    up = false;
                } else {
                    add("Normal Move (Up-Right)", `Not at boundary. Move Up-Right: r--, c++.`, 15, { res: [...res], visited: {...visited}, r, c, up });
                    r--;
                    c++;
                }
                add("Updated Coordinates", `New position: (${r}, ${c}). New direction: ${up ? 'Up-Right ↗' : 'Down-Left ↙'}.`, 13, { res: [...res], visited: {...visited}, r, c, up });

            } else {
                // DOWN-LEFT TRAVERSAL
                add("Bounds Check (Down)", `Check boundaries. Bottom edge (r == m-1)? Left edge (c == 0)?`, 18, { res: [...res], visited: {...visited}, r, c, up, checkingBounds: true });
                
                if (r === m - 1) {
                    add("Hit Bottom Edge", `r == ${m-1} (Bottom edge). MUST check this BEFORE left edge to handle bottom-left corner safely! Move RIGHT (c++) and flip direction.`, 18, { res: [...res], visited: {...visited}, r, c, up, boundHit: 'bottom' });
                    c++;
                    up = true;
                } else if (c === 0) {
                    add("Hit Left Edge", `c == 0 (Left edge). Move DOWN (r++) and flip direction.`, 19, { res: [...res], visited: {...visited}, r, c, up, boundHit: 'left' });
                    r++;
                    up = true;
                } else {
                    add("Normal Move (Down-Left)", `Not at boundary. Move Down-Left: r++, c--.`, 20, { res: [...res], visited: {...visited}, r, c, up });
                    r++;
                    c--;
                }
                add("Updated Coordinates", `New position: (${r}, ${c}). New direction: ${up ? 'Up-Right ↗' : 'Down-Left ↙'}.`, 18, { res: [...res], visited: {...visited}, r, c, up });
            }
        }

        add("Return Result", `All ${m*n} elements processed. Return the final diagonal array.`, 23, { res: [...res], visited: {...visited}, isSuccess: true });

    } else if (selectedOpId === 'diagonalGrouping') {
        let map = new Map();
        let res = [];
        
        add("Initialize Map", `Create HashMap. Key = (r + c), Value = List of elements on that diagonal.`, 5, { mapState: new Map(map), res: [...res] });

        for (let r = 0; r < m; r++) {
            for (let c = 0; c < n; c++) {
                let diagKey = r + c;
                add("Calculate Diagonal Key", `Cell (${r}, ${c}) has value ${baseGrid[r][c]}. Diagonal Key = ${r} + ${c} = ${diagKey}.`, 9, { mapState: new Map(map), res: [...res], r, c, hlCell: true, diagKey });
                
                if (!map.has(diagKey)) map.set(diagKey, []);
                map.get(diagKey).push(baseGrid[r][c]);
                
                add("Group Element", `Add ${baseGrid[r][c]} to list for diagonal ${diagKey}.`, 10, { mapState: new Map(map), res: [...res], r, c, diagKey, justAddedMap: diagKey });
            }
        }

        add("Grouping Complete", `All elements grouped by their diagonal index. Now extract them.`, 13, { mapState: new Map(map), res: [...res], phase2: true });

        for (let i = 0; i < m + n - 1; i++) {
            let diagList = map.get(i) || [];
            add("Fetch Diagonal", `Fetch list for diagonal key ${i}: [${diagList.join(', ')}].`, 18, { mapState: new Map(map), res: [...res], fetchingKey: i, diagList: [...diagList], phase2: true });

            if (i % 2 === 0) {
                diagList.reverse();
                add("Reverse Even Diagonal", `Diagonal ${i} is EVEN. Reverse the list for Up-Right order: [${diagList.join(', ')}].`, 19, { mapState: new Map(map), res: [...res], fetchingKey: i, diagList: [...diagList], phase2: true, reversed: true });
            } else {
                add("Keep Odd Diagonal", `Diagonal ${i} is ODD. Keep the list as-is for Down-Left order: [${diagList.join(', ')}].`, 19, { mapState: new Map(map), res: [...res], fetchingKey: i, diagList: [...diagList], phase2: true });
            }

            res.push(...diagList);
            add("Append to Result", `Add processed diagonal ${i} to final result array.`, 21, { mapState: new Map(map), res: [...res], fetchingKey: i, phase2: true, justAppended: true });
        }

        add("Return Result", `All diagonals merged. Return final array.`, 24, { mapState: new Map(map), res: [...res], isSuccess: true });
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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { grid: [], res: [], visited: {} } };
  const st = curStepData.state || { grid: [], res: [], visited: {} };
  const isLastStep = currentStep === trace.length - 1;

  // --- Rendering Helpers ---

  const renderMatrix = (isTheater = false) => {
      if (!st.grid || st.grid.length === 0) return <span className="text-slate-400 italic">empty</span>;

      const cellW = isTheater ? "w-20" : "w-14";
      const cellH = isTheater ? "h-16" : "h-12";
      const textSize = isTheater ? "text-3xl" : "text-xl";
      const gapClass = isTheater ? "gap-3" : "gap-2";

      return (
          <div className={`flex flex-col ${gapClass} p-6 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-md w-max mx-auto`}>
              {st.grid.map((row, r) => (
                  <div key={`r-${r}`} className={`flex ${gapClass}`}>
                      {row.map((val, c) => {
                          const coord = `${r}-${c}`;
                          
                          let bgClass = "bg-slate-50 text-slate-600 border-slate-200";
                          let scale = "scale-100";
                          let z = "z-0";
                          let icon = null;
                          let isActive = false;

                          if (selectedOpId === 'simulation') {
                              const isVisited = st.visited && st.visited[coord];
                              isActive = st.hlCell && st.r === r && st.c === c;
                              
                              if (isActive) {
                                  bgClass = st.up ? "bg-cyan-500 text-white border-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.5)]" : "bg-rose-500 text-white border-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.5)]";
                                  scale = isTheater ? "scale-125" : "scale-110";
                                  z = "z-20";
                                  icon = st.up ? <ArrowUpRight size={isTheater ? 20 : 14} className="absolute top-1 right-1 opacity-50"/> : <ArrowDownLeft size={isTheater ? 20 : 14} className="absolute bottom-1 left-1 opacity-50"/>;
                              } else if (isVisited === 'up') {
                                  bgClass = "bg-cyan-50 text-cyan-800 border-cyan-300";
                                  icon = <ArrowUpRight size={isTheater ? 16 : 12} className="absolute top-1 right-1 opacity-30 text-cyan-500"/>;
                              } else if (isVisited === 'down') {
                                  bgClass = "bg-rose-50 text-rose-800 border-rose-300";
                                  icon = <ArrowDownLeft size={isTheater ? 16 : 12} className="absolute bottom-1 left-1 opacity-30 text-rose-500"/>;
                              }
                          } else if (selectedOpId === 'diagonalGrouping') {
                              isActive = st.hlCell && st.r === r && st.c === c;
                              const isGrouped = st.diagKey !== undefined && (r + c) === st.diagKey;
                              const isFetching = st.fetchingKey !== undefined && (r + c) === st.fetchingKey;

                              if (isActive) {
                                  bgClass = "bg-amber-500 text-white border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)]";
                                  scale = isTheater ? "scale-125" : "scale-110";
                                  z = "z-20";
                              } else if (isGrouped || isFetching) {
                                  bgClass = "bg-amber-100 text-amber-800 border-amber-400";
                              }
                          }

                          return (
                              <div key={coord} className={`${cellW} ${cellH} flex items-center justify-center border-[3px] rounded-xl font-mono font-black ${textSize} transition-all duration-300 ${bgClass} ${scale} ${z} relative`}>
                                  {val}
                                  {icon}
                                  {selectedOpId === 'diagonalGrouping' && !isActive && (
                                      <div className="absolute -top-2 -left-2 text-[8px] font-black bg-slate-200 text-slate-500 px-1 rounded-sm border border-slate-300">{r+c}</div>
                                  )}
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
            <div className="bg-cyan-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <ArrowUpRight className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Diagonal Traverse</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">
                      LC 498 • Arrays & Matrix
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
                <div className="flex items-center gap-3 text-cyan-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given an <code>m x n</code> matrix <code>mat</code>, return an array of all the elements of the array in a diagonal order.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-cyan-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-cyan-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> mat = [[1,2,3],[4,5,6],[7,8,9]]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [1,2,4,7,5,3,6,8,9]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Trace zig-zag. 1 (up), 2&rarr;4 (down), 7&rarr;5&rarr;3 (up), 6&rarr;8 (down), 9 (up).</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> mat = [[1,2],[3,4]]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [1,2,3,4]</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: 1 (up), 2&rarr;3 (down), 4 (up).</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Challenges</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li><code>m == mat.length</code></li>
                        <li><code>n == mat[i].length</code></li>
                        <li>1 &lt;= m, n &lt;= 10<sup>4</sup></li>
                        <li>1 &lt;= m * n &lt;= 10<sup>4</sup></li>
                        <li>-10<sup>5</sup> &lt;= mat[i][j] &lt;= 10<sup>5</sup></li>
                        <li className="font-bold text-amber-600 mt-2">Challenge: The boundaries (especially corners) are mathematically tricky to bounce off correctly without going out of bounds.</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-cyan-600 text-white border-cyan-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-cyan-200' : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1 flex justify-between">
                                <span>Input M x N Matrix (CSV rows)</span>
                            </label>
                            <textarea 
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-[10px] sm:text-xs focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner h-[80px] resize-none whitespace-pre overflow-auto scrollbar-thin" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center h-[80px] pb-1">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-200 hover:bg-cyan-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Traversal Complete</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-cyan-500"/> Array & State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-cyan-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-cyan-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-cyan-600 rounded-lg transition-colors"><Maximize size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-8 items-center overflow-x-auto overflow-y-auto scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* Strict Flexbox Hierarchy */}

                           {/* Running Variables */}
                           {selectedOpId === 'simulation' && st.r !== undefined && (
                               <div className="flex gap-4">
                                   <div className="flex flex-col items-center bg-white border-2 border-slate-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                       <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Row</span>
                                       <span className="font-mono font-black text-xl text-slate-700">{st.r}</span>
                                   </div>
                                   <div className="flex flex-col items-center bg-white border-2 border-slate-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                       <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Col</span>
                                       <span className="font-mono font-black text-xl text-slate-700">{st.c}</span>
                                   </div>
                                   <div className={`flex flex-col items-center border-2 p-2 rounded-xl min-w-[120px] shadow-sm transition-all duration-300 ${st.up ? 'bg-cyan-50 border-cyan-400 text-cyan-700' : 'bg-rose-50 border-rose-400 text-rose-700'}`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black opacity-60">Direction</span>
                                       <span className="font-mono font-black text-lg mt-1 flex items-center gap-1">
                                           {st.up ? 'Up-Right' : 'Down-Left'} 
                                           {st.up ? <ArrowUpRight size={16}/> : <ArrowDownLeft size={16}/>}
                                       </span>
                                   </div>
                               </div>
                           )}

                           {selectedOpId === 'diagonalGrouping' && st.diagKey !== undefined && (
                               <div className="flex gap-4">
                                   <div className="flex flex-col items-center bg-white border-2 border-slate-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                       <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Row</span>
                                       <span className="font-mono font-black text-xl text-amber-600">{st.r}</span>
                                   </div>
                                   <div className="flex flex-col items-center bg-white border-2 border-slate-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                       <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Col</span>
                                       <span className="font-mono font-black text-xl text-amber-600">{st.c}</span>
                                   </div>
                                   <div className={`flex flex-col items-center border-2 bg-amber-50 border-amber-400 p-2 rounded-xl min-w-[100px] shadow-sm transition-all`}>
                                       <span className="text-[9px] uppercase tracking-widest font-black text-amber-600">Diag Key (r+c)</span>
                                       <span className="font-mono font-black text-xl text-amber-800">{st.diagKey}</span>
                                   </div>
                               </div>
                           )}

                           {/* Main Matrix Rendering */}
                           {renderMatrix(false)}

                           {/* Map State (Grouping Approach) */}
                           {selectedOpId === 'diagonalGrouping' && st.mapState && (
                                <div className="flex flex-col items-center w-full max-w-3xl mt-2">
                                   <div className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><Database size={12}/> Diagonal HashMap</div>
                                   <div className="flex gap-2 flex-wrap justify-center w-full">
                                       {Array.from(st.mapState.entries()).map(([k, v]) => {
                                           const isJustAdded = st.justAddedMap === k;
                                           const isFetching = st.fetchingKey === k;
                                           
                                           let bg = "bg-white border-slate-200";
                                           if (isJustAdded) bg = "bg-amber-100 border-amber-400 scale-105";
                                           if (isFetching) bg = "bg-fuchsia-100 border-fuchsia-400 scale-110 shadow-md";

                                           return (
                                               <div key={`map-${k}`} className={`flex flex-col border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${bg}`}>
                                                   <div className="bg-slate-100/50 text-[9px] font-black font-mono text-center p-1 border-b border-inherit opacity-80">Key: {k}</div>
                                                   <div className="p-2 font-mono text-xs font-bold flex gap-1">
                                                       [{v.join(', ')}]
                                                   </div>
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           )}

                           {/* Output Array Building */}
                           {st.res && (
                               <div className="flex flex-col items-center w-full max-w-4xl mt-4">
                                   <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono mb-2 flex items-center gap-1"><ListOrdered size={12}/> Output Array</div>
                                   <div className="flex gap-2 p-4 border-2 border-emerald-200 bg-emerald-50/80 rounded-2xl shadow-md backdrop-blur-sm flex-wrap justify-start w-full min-h-[60px]">
                                       {st.res.length === 0 && <span className="text-emerald-400/50 italic text-sm font-mono mt-1">Empty</span>}
                                       {st.res.map((val, idx) => {
                                           const isJustAdded = (selectedOpId === 'simulation' && st.justAdded && idx === st.res.length - 1) || 
                                                             (selectedOpId === 'diagonalGrouping' && st.justAppended && idx >= st.res.length - (st.diagList?.length || 0));
                                           
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><ArrowUpRight size={120}/></div>
                        <h3 className="font-black text-cyan-400 text-lg uppercase tracking-widest mb-6">Direction Simulation</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>We can solve this purely by simulating movement. We use a boolean <code>up</code> to track if we are moving Up-Right or Down-Left.</p>
                            <p className="font-mono bg-slate-800 p-2 rounded-lg text-xs text-cyan-300">Up-Right: Row decreases (r--), Col increases (c++)</p>
                            <p className="font-mono bg-slate-800 p-2 rounded-lg text-xs text-rose-300">Down-Left: Row increases (r++), Col decreases (c--)</p>
                            <p>The entire algorithm is just taking a step in the current direction, and checking if we hit a wall to 'bounce' off and flip direction.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-amber-50 border border-amber-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-amber-700 text-lg uppercase tracking-widest mb-6">The Corner Trap (Order of Checks)</h3>
                        <div className="space-y-4 text-sm text-amber-900/80 leading-relaxed font-medium">
                            <p>When bouncing off walls, the <strong>order</strong> of your IF statements is critical to avoid Out Of Bounds errors in corners.</p>
                            <p>Imagine moving Up-Right and hitting the <strong>Top-Right corner</strong>. Both <code>r == 0</code> and <code>c == n-1</code> are true.</p>
                            <p>If you check <code>r == 0</code> first, your code does <code>c++</code>. But <code>c</code> is already at the max column! You just plunged off the right side of the matrix.</p>
                            <p>Therefore, you MUST check the <code>Right</code> edge before the <code>Top</code> edge when moving up, and the <code>Bottom</code> edge before the <code>Left</code> edge when moving down.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Diagonal Grouping Math</h3>
                            <p>If you don't want to deal with complex boundary IF statements, you can use mathematical grouping.</p>
                            <p>Notice that for any cell <code>(r, c)</code>, the sum of its indices <code>r + c</code> perfectly identifies which diagonal it belongs to.</p>
                            <p>The first element (0,0) has sum 0. The next diagonal (0,1) and (1,0) have sum 1. We group elements into lists mapped by this sum. Then, we simply reverse the lists that have an even sum (to simulate the Up-Right direction) and flatten them into the result!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-cyan-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-cyan-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering The Simulation</h3>
                    <p className="text-sm text-cyan-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers will watch you closely when you write the IF statements for the boundaries. Explaining WHY you check the right boundary before the top boundary is what separates a good candidate from a great one."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-cyan-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-cyan-800 text-sm uppercase tracking-widest">
                               <div className="bg-cyan-200 p-2 rounded-lg text-cyan-700"><LayersIcon size={16}/></div>
                               1. Propose the HashMap Math First
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-cyan-100 shadow-inner flex-1">
                                "An elegant, math-based way to solve this is to realize that all elements on the same diagonal share the exact same 'row + col' sum. I could group them in a HashMap, and then reverse the lists with an even sum. However, this takes O(M*N) auxiliary space. I can optimize space to O(1) by simply simulating the traversal."
                            </p>
                        </div>

                        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-cyan-800 text-sm uppercase tracking-widest">
                               <div className="bg-cyan-200 p-2 rounded-lg text-cyan-700"><ArrowUpRight size={16}/></div>
                               2. Define the Simulation State
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-cyan-100 shadow-inner flex-1">
                                "For O(1) space, I'll track my current row and col, and a boolean flag 'up' to track direction. When 'up' is true, I move row-1, col+1. When false, row+1, col-1. The only complex part is handling the 'bounce' when hitting a boundary."
                            </p>
                        </div>

                        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-cyan-800 text-sm uppercase tracking-widest">
                               <div className="bg-cyan-200 p-2 rounded-lg text-cyan-700"><ShieldAlert size={16}/></div>
                               3. The Corner Guard Clause (Crucial)
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-cyan-100 shadow-inner flex-1">
                                "When writing the boundary checks, the order of IF statements is critical. When moving UP, I might hit the top-right corner. If I check 'row == 0' first, I will blindly increment the column and go out of bounds! I MUST check 'col == n-1' first so I increment the row instead. The same logic applies moving DOWN: I must check the bottom boundary before the left boundary."
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
                          <div className="bg-cyan-500 p-2 rounded-lg text-white shadow-lg shadow-cyan-900/50"><Code2 size={20}/></div>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-cyan-600 pl-1">Input Matrix (CSV rows)</label>
                              <textarea value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner h-12 resize-none whitespace-pre scrollbar-none" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all"><RotateCcw size={24}/></button>
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
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className="px-12 py-6 bg-cyan-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(6,182,212,0.3)] hover:bg-cyan-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-cyan-400 shadow-cyan-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* Running Variables */}
                           {selectedOpId === 'simulation' && st.r !== undefined && (
                               <div className="flex gap-8 origin-center">
                                   <div className="flex flex-col items-center bg-white border-[3px] border-slate-200 p-4 rounded-2xl min-w-[120px] shadow-xl">
                                       <span className="text-xs uppercase tracking-widest font-black text-slate-500 mb-1">Row</span>
                                       <span className="font-mono font-black text-4xl text-slate-700">{st.r}</span>
                                   </div>
                                   <div className="flex flex-col items-center bg-white border-[3px] border-slate-200 p-4 rounded-2xl min-w-[120px] shadow-xl">
                                       <span className="text-xs uppercase tracking-widest font-black text-slate-500 mb-1">Col</span>
                                       <span className="font-mono font-black text-4xl text-slate-700">{st.c}</span>
                                   </div>
                                   <div className={`flex flex-col items-center border-[3px] p-4 rounded-2xl min-w-[200px] shadow-xl transition-all duration-300 ${st.up ? 'bg-cyan-100 border-cyan-400 text-cyan-800 scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'bg-rose-100 border-rose-400 text-rose-800 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.4)]'}`}>
                                       <span className="text-xs uppercase tracking-widest font-black opacity-60 mb-1">Direction</span>
                                       <span className="font-mono font-black text-3xl mt-1 flex items-center gap-2">
                                           {st.up ? 'Up ↗' : 'Down ↙'} 
                                       </span>
                                   </div>
                               </div>
                           )}

                           {selectedOpId === 'diagonalGrouping' && st.diagKey !== undefined && (
                               <div className="flex gap-8 origin-center">
                                   <div className="flex flex-col items-center bg-white border-[3px] border-slate-200 p-4 rounded-2xl min-w-[120px] shadow-xl">
                                       <span className="text-xs uppercase tracking-widest font-black text-slate-500 mb-1">Row</span>
                                       <span className="font-mono font-black text-4xl text-amber-600">{st.r}</span>
                                   </div>
                                   <div className="flex flex-col items-center bg-white border-[3px] border-slate-200 p-4 rounded-2xl min-w-[120px] shadow-xl">
                                       <span className="text-xs uppercase tracking-widest font-black text-slate-500 mb-1">Col</span>
                                       <span className="font-mono font-black text-4xl text-amber-600">{st.c}</span>
                                   </div>
                                   <div className={`flex flex-col items-center border-[3px] bg-amber-50 border-amber-400 p-4 rounded-2xl min-w-[200px] shadow-xl transition-all`}>
                                       <span className="text-xs uppercase tracking-widest font-black text-amber-600 mb-1">Diag Key (r+c)</span>
                                       <span className="font-mono font-black text-4xl text-amber-800">{st.diagKey}</span>
                                   </div>
                               </div>
                           )}

                           {/* Matrix Render */}
                           <div className="origin-center mt-10 relative">
                               {renderMatrix(true)}
                           </div>

                           {/* Map State (Grouping Approach) */}
                           {selectedOpId === 'diagonalGrouping' && st.mapState && (
                                <div className="flex flex-col items-center w-full max-w-5xl mt-6 scale-110 origin-center">
                                   <div className="text-xs font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-4 bg-fuchsia-100 px-6 py-2 rounded-full shadow-sm"><Database size={16} className="inline mr-2 -mt-1"/> Diagonal HashMap</div>
                                   <div className="flex gap-4 flex-wrap justify-center w-full">
                                       {Array.from(st.mapState.entries()).map(([k, v]) => {
                                           const isJustAdded = st.justAddedMap === k;
                                           const isFetching = st.fetchingKey === k;
                                           
                                           let bg = "bg-white border-slate-200";
                                           if (isJustAdded) bg = "bg-amber-100 border-amber-400 scale-110 shadow-xl";
                                           if (isFetching) bg = "bg-fuchsia-100 border-fuchsia-400 scale-125 shadow-2xl z-20 mx-4";

                                           return (
                                               <div key={`map-fs-${k}`} className={`flex flex-col border-[3px] rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${bg}`}>
                                                   <div className="bg-slate-100/50 text-xs font-black font-mono text-center p-2 border-b-2 border-inherit opacity-80">Key: {k}</div>
                                                   <div className="p-4 font-mono text-xl font-bold flex gap-2">
                                                       [{v.join(', ')}]
                                                   </div>
                                               </div>
                                           )
                                       })}
                                   </div>
                               </div>
                           )}

                           {/* Output List Render */}
                           {st.res && (
                               <div className="flex flex-col items-center w-full max-w-5xl mt-12 scale-110 origin-top">
                                   <div className="text-sm font-black text-emerald-600 uppercase tracking-widest font-mono mb-4 bg-emerald-100 px-6 py-2 rounded-full shadow-sm"><ListOrdered size={18} className="inline mr-2 -mt-1"/> Output List</div>
                                   <div className="flex gap-4 p-8 border-4 border-emerald-300 bg-emerald-50/90 rounded-[2rem] shadow-2xl backdrop-blur-md flex-wrap justify-start w-full min-h-[120px] mx-auto">
                                       {st.res.length === 0 && <span className="text-emerald-400/60 italic text-2xl font-mono mt-4">Empty</span>}
                                       {st.res.map((val, idx) => {
                                           const isJustAdded = (selectedOpId === 'simulation' && st.justAdded && idx === st.res.length - 1) || 
                                                             (selectedOpId === 'diagonalGrouping' && st.justAppended && idx >= st.res.length - (st.diagList?.length || 0));
                                           
                                           return (
                                               <div key={`out-fs-${idx}`} className={`w-14 h-14 flex items-center justify-center border-[3px] border-emerald-400 bg-white text-emerald-800 font-mono text-2xl font-black rounded-xl shadow-md transition-all duration-300 ${isJustAdded ? 'scale-125 shadow-[0_0_20px_rgba(52,211,153,0.6)] z-20 mx-2' : ''}`}>
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
                                    TRAVERSAL COMPLETE
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