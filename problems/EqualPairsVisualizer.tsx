import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, SquareSquare, Mountain, Hash, Network, Grid3X3
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalHash: {
    id: 'optimalHash',
    title: '1. Hash Map (Optimal)',
    icon: <Network size={16} />,
    complexity: 'Time: O(N²) | Space: O(N²)',
    code: `public int equalPairs(int[][] grid) {
    int n = grid.length;
    Map<String, Integer> rowCounts = new HashMap<>();
    
    for (int i = 0; i < n; i++) {
        String rowStr = Arrays.toString(grid[i]);
        rowCounts.put(rowStr, rowCounts.getOrDefault(rowStr, 0) + 1);
    }
    
    int pairs = 0;
    for (int j = 0; j < n; j++) {
        int[] colArray = new int[n];
        for (int i = 0; i < n; i++) {
            colArray[i] = grid[i][j];
        }
        
        String colStr = Arrays.toString(colArray);
        pairs += rowCounts.getOrDefault(colStr, 0);
    }
    
    return pairs;
}`,
    desc: "The Optimal Hash Map approach. Instead of comparing every row to every column element-by-element (which takes O(N³)), we can convert each row into a String and store its frequency in a HashMap. Then, we convert each column into a String and instantly check the HashMap in O(1) time to see how many matching rows exist. This reduces the time complexity to O(N²)."
  },
  naiveBrute: {
    id: 'naiveBrute',
    title: '2. Nested Loops (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(N³) | Space: O(1)',
    code: `public int equalPairs(int[][] grid) {
    int n = grid.length;
    int pairs = 0;
    
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            boolean isEqual = true;
            for (int i = 0; i < n; i++) {
                if (grid[r][i] != grid[i][c]) {
                    isEqual = false;
                    break;
                }
            }
            if (isEqual) {
                pairs++;
            }
        }
    }
    
    return pairs;
}`,
    desc: "The Naive approach. For every single row 'r', we iterate over every single column 'c'. For each (r, c) pair, we run a third inner loop 'i' to compare elements one by one. This 3-deep nested loop structure leads to an inefficient O(N³) time complexity."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|double|int|char|return|if|else|for|while|continue|break|new|length|Math|max|min|equalPairs|grid|rowCounts|Arrays|toString|colArray|colStr|rowStr|isEqual|pairs|r|c|HashMap|Map|String|getOrDefault|put)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-amber-500/20`, border: `border-amber-400`, text: `text-amber-300` };

  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? activeStyles.text + ' font-bold' : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'boolean', 'double', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'Map', 'HashMap', 'Arrays'].includes(part);
            const isVar = ['grid', 'rowCounts', 'colArray', 'colStr', 'rowStr', 'isEqual', 'pairs', 'r', 'c', 'i', 'j', 'n'].includes(part);
            const isMapCall = ['length', 'max', 'min', 'equalPairs', 'toString', 'getOrDefault', 'put'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-emerald-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (part === 'true' || part === 'false') className = 'text-orange-400 font-bold';
            else if (part.startsWith("'") || part.startsWith('"') || (!isNaN(parseInt(part.trim())) && part.trim() !== '')) className = 'text-emerald-400';

            return <span key={idx} className={className}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const NodeBlock = ({ val, idx = undefined, themeColor = 'slate', isTarget = false, isDimmed = false, subtext = undefined, isMap = false, mapKey = undefined, compact = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-300', index: 'bg-slate-50 text-slate-300' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    const targetClasses = isTarget ? `ring-2 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-md z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);
    const prefixStr = typeof val === 'number' && val < 0 ? '-' : '';
    const absVal = typeof val === 'number' ? Math.abs(val) : displayVal;

    const dims = compact 
        ? "min-w-[36px] md:min-w-[42px] min-h-[36px] md:min-h-[42px]" 
        : "min-w-[48px] md:min-w-[56px] min-h-[48px] md:min-h-[56px]";
    const textSz = compact ? "text-lg md:text-xl" : "text-2xl";
    const subTextSz = compact ? "text-[8px]" : "text-[9px] md:text-[10px]";

    if (isMap) {
        return (
            <div className={`relative flex flex-col items-center group transition-all duration-500`}>
                <div className={`flex flex-col items-center min-w-[70px] md:min-w-[80px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                    <div className={`flex w-full h-5 border-b border-black/10 ${themes['indigo'].index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-tight px-1 truncate">"{mapKey}"</span>
                        </div>
                    </div>
                    <div className={`flex-1 flex justify-center items-center w-full h-8 font-mono font-black text-xl bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter`}>
                        Count: {displayVal}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-0.5 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {prefixStr}{absVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext !== undefined ? subtext : `${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function EqualPairsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalHash');
  
  const [gridInput, setGridInput] = useState('3,2,1; 1,7,6; 2,7,7');
  
  const [baseGrid, setBaseGrid] = useState([
      [3, 2, 1],
      [1, 7, 6],
      [2, 7, 7]
  ]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { setCurrentStep(0); setPan({ x: 0, y: 0 }); setZoom(1); };
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Debounce input parsing
  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = gridInput.split(';').map(row => row.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)));
      
      // Ensure square matrix and valid size
      let n = parsed.length;
      if (n === 0) {
          parsed = [[3,2,1], [1,7,6], [2,7,7]];
          n = 3;
      }
      if (n > 5) n = 5; // Cap size for visualization limits
      
      parsed = parsed.slice(0, n).map(row => {
          let r = [...row];
          while (r.length < n) r.push(0);
          return r.slice(0, n);
      });

      setBaseGrid(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [gridInput, selectedOpId]);

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
    if (!baseGrid || baseGrid.length === 0) return [{ phase: 'Init', description: 'Enter valid matrix.', line: 1, state: {} }];

    let grid = baseGrid.map(row => [...row]);
    const n = grid.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { grid, n, ...st } 
    });

    if (selectedOpId === 'optimalHash') {
        let map = {};
        let pairs = 0;
        
        add("Function Call", `public int equalPairs(int[][] grid)`, 1, { });
        add("Init Length", `int n = grid.length; // n = ${n}`, 2, { });
        add("Init Map", `Map<String, Integer> rowCounts = new HashMap<>();`, 3, { map: {...map} });
        
        // Build Map Loop
        for (let i = 0; i < n; i++) {
            add("Loop Rows", `for (int i = ${i}; i < n; i++)`, 5, { map: {...map}, hlRow: i, isEvaluatingFor: true });
            
            let rowStr = `[${grid[i].join(', ')}]`;
            add("Row to String", `String rowStr = Arrays.toString(grid[i]);\nSerialized row ${i} to string: "${rowStr}"`, 6, { map: {...map}, hlRow: i, rowStr });
            
            let count = map[rowStr] || 0;
            map[rowStr] = count + 1;
            add("Put in Map", `rowCounts.put(rowStr, rowCounts.getOrDefault(rowStr, 0) + 1);\nIncrementing frequency for key "${rowStr}".`, 7, { map: {...map}, hlRow: i, rowStr, hlMapKey: rowStr });
        }
        add("Loop Rows End", `for (int i = ${n}; i < n; i++)\nFinished hashing all rows.`, 5, { map: {...map}, isEvaluatingFor: true });
        
        add("Init Pairs", `int pairs = 0;`, 10, { map: {...map}, pairs });
        
        // Check Cols Loop
        for (let j = 0; j < n; j++) {
            add("Loop Columns", `for (int j = ${j}; j < n; j++)`, 11, { map: {...map}, pairs, hlCol: j, isEvaluatingFor: true });
            
            let colArr = [];
            add("Init Column Array", `int[] colArray = new int[n];`, 12, { map: {...map}, pairs, hlCol: j, colArr: [...colArr] });
            
            for (let i = 0; i < n; i++) {
                add("Inner Loop Column", `for (int i = ${i}; i < n; i++)\nExtracting element grid[${i}][${j}].`, 13, { map: {...map}, pairs, hlCol: j, colArr: [...colArr], hlCell: [i, j], isEvaluatingFor: true });
                
                colArr.push(grid[i][j]);
                add("Extract Cell", `colArray[i] = grid[i][j];`, 14, { map: {...map}, pairs, hlCol: j, colArr: [...colArr], hlCell: [i, j] });
            }
            add("Inner Loop Column End", `for (int i = ${n}; i < n; i++)\nFinished extracting column ${j}.`, 13, { map: {...map}, pairs, hlCol: j, colArr: [...colArr], isEvaluatingFor: true });
            
            let colStr = `[${colArr.join(', ')}]`;
            add("Col to String", `String colStr = Arrays.toString(colArray);\nSerialized col ${j} to string: "${colStr}"`, 17, { map: {...map}, pairs, hlCol: j, colArr: [...colArr], colStr });
            
            let matches = map[colStr] || 0;
            let prevPairs = pairs;
            pairs += matches;
            add("Add to Pairs", `pairs += rowCounts.getOrDefault(colStr, 0);\nColumn "${colStr}" matched ${matches} row(s). Pairs: ${prevPairs} -> ${pairs}.`, 18, { map: {...map}, pairs, hlCol: j, colArr: [...colArr], colStr, hlMapKey: colStr, matches });
        }
        add("Loop Columns End", `for (int j = ${n}; j < n; j++)\nFinished checking all columns.`, 11, { map: {...map}, pairs, isEvaluatingFor: true });
        
        add("Return Result", `return pairs;\nTotal equal pairs found: ${pairs}.`, 21, { map: {...map}, pairs, isSuccess: true, finalAns: pairs });

    } else if (selectedOpId === 'naiveBrute') {
        
        add("Function Call", `public int equalPairs(int[][] grid)`, 1, { });
        add("Init Length", `int n = grid.length;`, 2, { });
        
        let pairs = 0;
        add("Init Pairs", `int pairs = 0;`, 3, { pairs });
        
        for (let r = 0; r < n; r++) {
            add("Outer Loop Rows", `for (int r = ${r}; r < n; r++)`, 5, { pairs, outerR: r, isEvaluatingOuterR: true });
            
            for (let c = 0; c < n; c++) {
                add("Middle Loop Cols", `for (int c = ${c}; c < n; c++)`, 6, { pairs, outerR: r, middleC: c, isEvaluatingMiddleC: true });
                
                let isEqual = true;
                add("Init isEqual", `boolean isEqual = true;`, 7, { pairs, outerR: r, middleC: c, isEqual });
                
                for (let i = 0; i < n; i++) {
                    add("Inner Loop Elements", `for (int i = ${i}; i < n; i++)\nComparing grid[${r}][${i}] with grid[${i}][${c}].`, 8, { pairs, outerR: r, middleC: c, isEqual, innerI: i, isEvaluatingInnerI: true, hlCell1: [r, i], hlCell2: [i, c] });
                    
                    let cell1 = grid[r][i];
                    let cell2 = grid[i][c];
                    let match = cell1 === cell2;
                    
                    add("Check Equality", `if (grid[r][i] != grid[i][c])\nIs ${cell1} != ${cell2}? (${!match ? 'Yes' : 'No'})`, 9, { pairs, outerR: r, middleC: c, isEqual, innerI: i, hlCell1: [r, i], hlCell2: [i, c], isComparing: true, matchResult: match });
                    
                    if (!match) {
                        isEqual = false;
                        add("Set False", `isEqual = false;`, 10, { pairs, outerR: r, middleC: c, isEqual, innerI: i, hlCell1: [r, i], hlCell2: [i, c], isMismatch: true });
                        add("Break Loop", `break;\nMismatch found. Skip remaining elements.`, 11, { pairs, outerR: r, middleC: c, isEqual, innerI: i, hlCell1: [r, i], hlCell2: [i, c], isMismatch: true });
                        break;
                    }
                }
                
                add("Check isEqual flag", `if (isEqual)\nDid all elements match? (${isEqual ? 'Yes' : 'No'})`, 14, { pairs, outerR: r, middleC: c, isEqual, isCheckingFlag: true });
                if (isEqual) {
                    pairs++;
                    add("Increment Pairs", `pairs++;\nFound an equal row and column pair!`, 15, { pairs, outerR: r, middleC: c, isEqual, hlSuccessPair: true });
                }
            }
            add("Middle Loop Cols End", `for (int c = ${n}; c < n; c++)\nFinished checking row ${r} against all columns.`, 6, { pairs, outerR: r, isEvaluatingMiddleC: true });
        }
        
        add("Outer Loop Rows End", `for (int r = ${n}; r < n; r++)\nChecked all rows.`, 5, { pairs, isEvaluatingOuterR: true });
        add("Return Result", `return pairs;\nTotal equal pairs found: ${pairs}.`, 20, { pairs, isSuccess: true, finalAns: pairs });
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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'optimalHash' ? 'emerald' : 'amber';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.grid === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-8 w-full">
              
              {/* Matrix Grid Visualization */}
              <div className="flex flex-col xl:flex-row w-full max-w-6xl gap-8 items-start justify-center">
                  
                  {/* The Matrix */}
                  <div className="flex flex-col items-center justify-center flex-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><Grid3X3 size={12}/> grid (int[][])</span>
                      <div className="flex flex-col gap-1.5 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm justify-center items-center">
                          {st.grid.map((row, r) => (
                              <div key={`row-${r}`} className="flex gap-1.5">
                                  {row.map((val, c) => {
                                      let isHl = false;
                                      let color = 'slate';
                                      let isDimmed = false;

                                      if (selectedOpId === 'optimalHash') {
                                          if (st.hlRow === r) {
                                              isHl = true;
                                              color = 'emerald';
                                          }
                                          if (st.hlCol === c) {
                                              isHl = true;
                                              color = 'sky';
                                          }
                                          if (st.hlCell !== undefined && st.hlCell[0] === r && st.hlCell[1] === c) {
                                              isHl = true;
                                              color = 'fuchsia';
                                          }
                                      } else if (selectedOpId === 'naiveBrute') {
                                          if (st.hlSuccessPair && (r === st.outerR || c === st.middleC)) {
                                              color = 'emerald';
                                              isHl = true;
                                          } else {
                                              if (st.hlCell1 && st.hlCell1[0] === r && st.hlCell1[1] === c) {
                                                  isHl = true;
                                                  color = 'amber';
                                              }
                                              if (st.hlCell2 && st.hlCell2[0] === r && st.hlCell2[1] === c) {
                                                  isHl = true;
                                                  // if overlap, make it fuchsia
                                                  color = color === 'amber' ? 'fuchsia' : 'sky';
                                              }
                                              if (st.isMismatch && ( (st.hlCell1 && st.hlCell1[0]===r && st.hlCell1[1]===c) || (st.hlCell2 && st.hlCell2[0]===r && st.hlCell2[1]===c) )) {
                                                  color = 'rose';
                                              }
                                          }
                                      }

                                      if (st.isSuccess) {
                                          isDimmed = false;
                                          isHl = false;
                                          color = 'slate';
                                      }

                                      return (
                                          <div key={`cell-${r}-${c}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20' : 'scale-100 z-10'}`}>
                                              <NodeBlock val={val} themeColor={color} isTarget={isHl} isDimmed={isDimmed} compact={true} />
                                          </div>
                                      );
                                  })}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Hash Map (Optimal O1) */}
                  {selectedOpId === 'optimalHash' && st.map && (
                      <div className="flex flex-col items-center flex-1 w-full mt-8 xl:mt-0 animate-in slide-in-from-right-8">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-3 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Network size={12}/> rowCounts (HashMap)</span>
                          <div className={`flex gap-3 p-5 border-[3px] border-indigo-200 bg-indigo-50/50 rounded-[2rem] shadow-md flex-wrap justify-center items-center w-full min-h-[140px] max-w-sm`}>
                              {Object.entries(st.map).map(([keyStr, val]) => {
                                  let isHl = false;
                                  let color = 'indigo';
                                  
                                  if (st.hlMapKey === keyStr) {
                                      isHl = true;
                                      color = st.matches !== undefined ? 'sky' : 'emerald';
                                  }

                                  return (
                                      <React.Fragment key={`map-${keyStr}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20' : 'scale-100 z-10'} ${st.hlMapKey === keyStr && st.matches === undefined ? 'animate-in zoom-in' : ''}`}>
                                              <NodeBlock val={val} mapKey={keyStr} themeColor={color} isTarget={isHl} isMap={true} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {Object.keys(st.map).length === 0 && <span className="text-indigo-300 italic text-sm font-mono px-4">empty</span>}
                          </div>
                      </div>
                  )}
                  
                  {/* Naive Dynamic Arrays/Status */}
                  {selectedOpId === 'naiveBrute' && !st.isSuccess && (
                      <div className="flex flex-col items-center flex-1 w-full mt-8 xl:mt-0 animate-in slide-in-from-right-8 gap-4">
                          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-lg w-full max-w-sm">
                              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b pb-2">Subarray Comparison</h3>
                              <div className="flex justify-between items-center mb-2">
                                  <span className="font-mono text-sm text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">Row {st.outerR !== undefined ? st.outerR : '-'}</span>
                                  <ArrowRightLeft size={16} className="text-slate-300"/>
                                  <span className="font-mono text-sm text-sky-600 font-bold bg-sky-50 px-2 py-1 rounded">Col {st.middleC !== undefined ? st.middleC : '-'}</span>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                  <span className="font-mono text-xl font-black text-amber-600">
                                      {st.hlCell1 ? st.grid[st.hlCell1[0]][st.hlCell1[1]] : '-'}
                                  </span>
                                  <span className={`font-mono text-xl font-black ${st.matchResult === true ? 'text-emerald-500' : (st.matchResult === false ? 'text-rose-500' : 'text-slate-400')}`}>
                                      {st.matchResult === true ? '==' : (st.matchResult === false ? '!=' : '?')}
                                  </span>
                                  <span className="font-mono text-xl font-black text-sky-600">
                                      {st.hlCell2 ? st.grid[st.hlCell2[0]][st.hlCell2[1]] : '-'}
                                  </span>
                              </div>
                          </div>
                          
                          <div className={`bg-white border-2 rounded-2xl p-5 shadow-lg w-full max-w-sm transition-colors ${st.isEqual === false ? 'border-rose-400 bg-rose-50' : (st.hlSuccessPair ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200')}`}>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">isEqual Flag</span>
                              <span className={`font-mono text-2xl font-black ${st.isEqual === false ? 'text-rose-600' : (st.isEqual ? 'text-emerald-600' : 'text-slate-600')}`}>
                                  {st.isEqual !== undefined ? (st.isEqual ? 'true' : 'false') : '-'}
                              </span>
                          </div>
                      </div>
                  )}

              </div>

              {/* Pairs Tracker / Col Builder Array */}
              {!st.isSuccess && (
                  <div className="flex w-full max-w-4xl gap-4 mt-6 animate-in slide-in-from-bottom-4">
                      
                      {selectedOpId === 'optimalHash' && st.colArr !== undefined && (
                          <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all border-sky-200`}>
                              <span className={`text-[10px] font-black uppercase tracking-widest mb-2 text-sky-600`}>colArray (Building)</span>
                              <div className="flex gap-1">
                                  {st.colArr.map((v, i) => <span key={i} className="font-mono font-black text-lg bg-sky-100 text-sky-700 px-2 rounded">{v}</span>)}
                                  {st.colArr.length === 0 && <span className="text-slate-300 italic text-sm">Empty</span>}
                              </div>
                              {st.colStr && <span className="text-[10px] font-mono mt-2 bg-slate-100 px-2 py-0.5 rounded">String: "{st.colStr}"</span>}
                          </div>
                      )}

                      <div className={`bg-slate-800 border-2 rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center flex-1 transition-all ${st.hlSuccessPair || st.matches > 0 ? 'border-emerald-400 ring-4 ring-emerald-500 scale-105' : 'border-slate-700'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Equal Pairs</span>
                          <span className={`font-mono font-black text-5xl text-emerald-400`}>
                              {st.pairs !== undefined ? st.pairs : '-'}
                          </span>
                      </div>

                  </div>
              )}

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                <Grid3X3 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Equal Row and Column Pairs</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      LC 2352 • Hash Map / Matrices
                  </span>
                  <span>•</span>
                  <span>O(N²) Time Constraint</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <div className="text-base leading-relaxed">
                  Given a <strong>0-indexed</strong> <code>n x n</code> integer matrix <code>grid</code>, return the number of pairs <code>(r, c)</code> such that row <code>r</code> and column <code>c</code> are equal.<br/><br/>
                  A row and column pair is considered equal if they contain the same elements in the same order (i.e., an equal array).
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> grid = [[3,2,1],[1,7,6],[2,7,7]]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 1</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: There is 1 equal row and column pair:
- (Row 2, Column 1): [2,7,7]
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> grid = [[3,1,2,2],[1,4,4,5],[2,4,2,2],[2,4,2,2]]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 3</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: There are 3 equal row and column pairs:
- (Row 0, Column 0): [3,1,2,2]
- (Row 2, Column 2): [2,4,2,2]
- (Row 3, Column 2): [2,4,2,2]
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li><code>n == grid.length == grid[i].length</code></li>
                        <li>1 &lt;= n &lt;= 200</li>
                        <li>1 &lt;= grid[i][j] &lt;= 10⁵</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            Trap: Nested loop checking takes O(N³) which will Time Limit Exceed (TLE) on an N=200 grid. You must map entire rows to frequencies first to achieve O(N²).
                        </li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-amber-600 text-white border-amber-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-amber-200') : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-hidden relative">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                          <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                <span>'grid' Matrix (Rows separated by ;)</span>
                            </label>
                            <input 
                                type="text"
                                value={gridInput} 
                                onChange={(e) => setGridInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} 
                                spellCheck={false}
                                placeholder="3,2,1; 1,7,6; 2,7,7"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-amber-600 shadow-amber-200 hover:bg-amber-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className={`text-xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                <PartyPopper size={20}/> Evaluation Complete
                            </div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`}><Layout size={14}/> Memory Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           {renderVisuals()}
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Target size={120}/></div>
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">Matrix Comparison Complexity</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>To compare every row with every column, a brute force approach uses 3 nested loops: one for rows (N), one for columns (N), and one to check each element within them (N).</p>
                            <p>This results in an <strong>O(N³)</strong> time complexity. If N=200, N³ is 8,000,000 operations. We need a faster way.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">Serialization & Hashing</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>Instead of manual element-by-element comparison, we can serialize an entire row into a String signature (e.g., <code>"[3, 2, 1]"</code>).</p>
                            <p>By mapping these signatures to their frequency in a HashMap, we pre-process all rows in <strong>O(N²)</strong> time (N rows * N elements to stringify).</p>
                            <p>Then, we serialize each column in the same way, and instantly look it up in the HashMap in O(1) time. This brings our total complexity down from O(N³) to an optimal O(N²).</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering Serialization</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers use this question to see if you know how to reduce multidimensional complexity using Maps. The key is to verbally explain the concept of 'Serialization': turning a complex structure (like an array) into a simple, hashable primitive (like a String) so it can be O(1) looked up."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge the Naive Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The straightforward approach would be to iterate through each row `r` and each column `c`, and then use an inner loop `i` to verify if `grid[r][i] == grid[i][c]`. This triple-nested loop would result in an O(N³) time complexity."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Network size={16}/></div>
                               2. Pivot to HashMap & Serialization
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "We can optimize this to O(N²) by serializing the rows. Since arrays in Java don't hash by value natively, I will convert each row to a String representation. I can then store the frequency of each row String in a HashMap."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Detail the Execution
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "First, I'll loop over the grid's rows, call `Arrays.toString()` on them, and populate the HashMap with their counts. Then, I'll iterate through the columns. Because columns aren't pre-built arrays in Java, I'll extract each column into a temporary array, convert it to a String, and check the Map to see how many matching rows exist, adding that to my total pairs count."
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
              <div className="w-[400px] xl:w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-amber-500 shadow-amber-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 whitespace-pre-wrap flex flex-col">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-hidden shrink-0">
                        <div className="w-full">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>
                                    <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                                </React.Fragment>
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
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-amber-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>'grid' Matrix (Rows sep by ;)</label>
                              <input type="text" value={gridInput} onChange={(e) => setGridInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-amber-600 hover:bg-amber-700 border-amber-400 shadow-amber-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           {renderVisuals()}
                      </div>
                  </div>
                  
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-emerald-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest text-emerald-400 max-w-lg break-words`}>
                                    Equal Pairs Found: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns}</span>
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