import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, FastForward,
  Goal, Workflow, CheckSquare, ShieldAlert, ArrowUp, ArrowDown, Minus,
  RefreshCw, CheckCircle2, CornerDownRight, Triangle, Plus
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  dpGeneration: {
    id: 'dpGeneration',
    title: '1. Dynamic Programming (Iterative)',
    icon: <Triangle size={16} />,
    complexity: 'Time: O(numRows²) | Space: O(numRows²)',
    theme: 'rose',
    code: `class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> triangle = new ArrayList<>();
        
        // Base case: first row is always [1]
        triangle.add(new ArrayList<>());
        triangle.get(0).add(1);
        
        for (int i = 1; i < numRows; i++) {
            List<Integer> row = new ArrayList<>();
            List<Integer> prevRow = triangle.get(i - 1);
            
            // The first element of every row is always 1
            row.add(1);
            
            // Each interior element is the sum of the two elements above it
            for (int j = 1; j < i; j++) {
                int aboveLeft = prevRow.get(j - 1);
                int aboveRight = prevRow.get(j);
                row.add(aboveLeft + aboveRight);
            }
            
            // The last element of every row is always 1
            row.add(1);
            
            triangle.add(row);
        }
        
        return triangle;
    }
}`,
    desc: "A classic Dynamic Programming generation problem. We build the triangle row by row. We know that the very first row is always [1]. For every subsequent row 'i', the first and last elements are always 1. For any interior element at index 'j', its value is strictly the sum of the element directly above-left (prevRow[j-1]) and directly above-right (prevRow[j]). We construct the row sequentially and add it to our main list."
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
  idPrefix?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'rose', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|generate|List|ArrayList|Integer|triangle|numRows|row|prevRow|aboveLeft|aboveRight|add|get|Solution)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`${idPrefix}code-line-${num}`} className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const trimmed = part.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                return <span key={`code-${num}-${idx}`} className="text-slate-500 italic">{part}</span>;
            }
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['Solution', 'List', 'ArrayList', 'Integer'].includes(part);
            const isPointer = ['triangle', 'numRows', 'row', 'prevRow', 'aboveLeft', 'aboveRight', 'i', 'j'].includes(part);
            const isMapCall = ['generate', 'add', 'get'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}', '(', ')'].includes(trimmed);
            
            return (
              <span 
                key={`code-${num}-${idx}`} 
                className={
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) ? (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : '') : 'text-emerald-400'
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

export default function PascalsTriangleVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('dpGeneration');
  
  const [rowsInput, setRowsInput] = useState('6');
  const [numRows, setNumRows] = useState<number>(6);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = parseInt(rowsInput, 10);
      if (isNaN(parsed) || parsed < 1) parsed = 1;
      if (parsed > 15) parsed = 15; // Hard cap for UI sanity
      setNumRows(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [rowsInput]);

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
    
    let triangle: number[][] = [];
    
    const cloneTriangle = () => triangle.map(r => [...r]);

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { triangle: cloneTriangle(), ...st } 
    });

    add("Init Function", `public List<List<Integer>> generate(int numRows)`, 2, { hlPhase: 'init' });
    add("Init Triangle", `List<List<Integer>> triangle = new ArrayList<>();\nCreated main container.`, 3, { hlPhase: 'initData' });

    triangle.push([1]);
    add("Base Case Row 0", `triangle.add(new ArrayList<>());\ntriangle.get(0).add(1);\nInjected the foundational top row [1].`, 6, { hlPhase: 'baseCase', curRowIdx: 0 });

    for (let i = 1; i < numRows; i++) {
        if (steps.length > 2000) break;

        let curRow: number[] = [];
        
        add("Outer Loop", `for (int i = 1; i < numRows; i++)\nGenerating row ${i}.`, 9, { hlPhase: 'outerLoop', curRowIdx: i, curRow: [...curRow] });
        
        add("Init Row", `List<Integer> row = new ArrayList<>();\nList<Integer> prevRow = triangle.get(i - 1);\nGrabbing reference to row ${i-1} to calculate current row.`, 10, { hlPhase: 'initRow', curRowIdx: i, curRow: [...curRow] });

        curRow.push(1);
        add("First Edge", `row.add(1);\nEvery row always begins with 1.`, 14, { hlPhase: 'firstEdge', curRowIdx: i, curRow: [...curRow] });

        for (let j = 1; j < i; j++) {
            let leftVal = triangle[i - 1][j - 1];
            let rightVal = triangle[i - 1][j];
            let sum = leftVal + rightVal;

            add("Inner Loop Evaluation", `for (int j = 1; j < i; j++)\nCalculating interior element at column ${j}.`, 17, { hlPhase: 'innerLoop', curRowIdx: i, curColIdx: j, curRow: [...curRow], leftVal, rightVal });

            add("Fetch Parents", `int aboveLeft = prevRow.get(j - 1);\nint aboveRight = prevRow.get(j);\nFetching parents from previous row.`, 18, { hlPhase: 'fetchParents', curRowIdx: i, curColIdx: j, curRow: [...curRow], leftVal, rightVal });

            curRow.push(sum);
            add("Calculate & Push", `row.add(aboveLeft + aboveRight);\nSummed ${leftVal} + ${rightVal} = ${sum}. Pushed to current row.`, 20, { hlPhase: 'calcSum', curRowIdx: i, curColIdx: j, curRow: [...curRow], leftVal, rightVal, sum });
        }

        curRow.push(1);
        add("Last Edge", `row.add(1);\nEvery row always ends with 1.`, 24, { hlPhase: 'lastEdge', curRowIdx: i, curRow: [...curRow] });

        triangle.push([...curRow]);
        add("Commit Row", `triangle.add(row);\nRow ${i} is complete. Adding it to the main triangle list.`, 26, { hlPhase: 'commitRow', curRowIdx: i, curRow: [...curRow] });
    }

    add("Success", `return triangle;\nGeneration complete for ${numRows} rows!`, 29, { hlPhase: 'success', isSuccess: true });

    return steps;
  }, [numRows, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Auto-scroll code view to active line
  useEffect(() => {
    const prefix = isFullscreen ? 'fs-' : 'main-';
    const container = isFullscreen ? codeContainerFullscreenRef.current : codeContainerMainRef.current;
    
    if (!container) return;
    
    const activeLineEl = document.getElementById(`${prefix}code-line-${curStepData.line}`);
    if (activeLineEl) {
        const offsetTop = activeLineEl.offsetTop;
        container.scrollTo({ top: offsetTop - 60, behavior: 'smooth' });
    }
  }, [currentStep, curStepData.line, isFullscreen]);

  // --- UI Handlers ---
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.scrollbar-thin')) return;
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
      if (!st.triangle) return null;

      let isSuccessEnd = st.hlPhase === 'success';

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200'} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1">
                  <Activity size={14}/> Row Construction State
              </span>
              
              {isSuccessEnd ? (
                  <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                      <div className={`flex items-center gap-4 text-rose-600 bg-rose-50 border-rose-300 font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                          <span>Generation Complete</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-200`}>Return Triangle</span>
                      </div>
                  </div>
              ) : st.curRowIdx !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                      
                      {/* Current Row Info */}
                      <div className="flex flex-col items-center">
                          <span className="text-[9px] font-bold uppercase text-slate-400">Current Row</span>
                          <div className={`flex items-center justify-center w-14 h-14 text-2xl rounded-xl border-2 shadow-sm bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-100`}>
                              <span className="font-black">{st.curRowIdx}</span>
                          </div>
                      </div>

                      <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                      
                      {/* Equation Builder */}
                      {st.hlPhase === 'fetchParents' || st.hlPhase === 'calcSum' ? (
                          <div className="flex items-center gap-4 animate-in zoom-in bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <div className="flex flex-col items-center w-[80px]">
                                  <span className={`text-[9px] font-bold uppercase mb-1 text-indigo-500`}>Above Left</span>
                                  <div className={`border-2 text-2xl font-black w-full text-center rounded-xl py-1 bg-indigo-100 border-indigo-400 text-indigo-900 shadow-md`}>
                                      {st.leftVal}
                                  </div>
                              </div>
                              
                              <Plus size={20} className="text-slate-400"/>
                              
                              <div className="flex flex-col items-center w-[80px]">
                                  <span className={`text-[9px] font-bold uppercase mb-1 text-indigo-500`}>Above Right</span>
                                  <div className={`border-2 text-2xl font-black w-full text-center rounded-xl py-1 bg-indigo-100 border-indigo-400 text-indigo-900 shadow-md`}>
                                      {st.rightVal}
                                  </div>
                              </div>

                              <ArrowRight size={20} className="text-slate-400 mx-2"/>

                              <div className="flex flex-col items-center w-[90px]">
                                  <span className={`text-[9px] font-bold uppercase mb-1 ${st.hlPhase === 'calcSum' ? 'text-amber-600' : 'text-slate-400'}`}>New Value</span>
                                  <div className={`border-2 text-2xl font-black w-full text-center rounded-xl py-1 transition-all ${st.hlPhase === 'calcSum' ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-xl scale-110 ring-2 ring-amber-200' : 'bg-slate-100 border-slate-300 text-slate-500'}`}>
                                      {st.sum !== undefined ? st.sum : '?'}
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="flex items-center justify-center h-full min-w-[250px] bg-slate-50 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest px-4 py-2">
                              {st.hlPhase === 'firstEdge' || st.hlPhase === 'lastEdge' ? 'Edge Insertion: Adding 1' : 'Evaluating row conditions...'}
                          </div>
                      )}
                      
                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Initializing Structure...</span>
                  </div>
              )}
          </div>
      );
  };

  const renderVisuals = () => {
      if (!st.triangle) return <span className="text-slate-400 italic mt-10">Initializing Triangle...</span>;

      const nodeSize = 48;
      const xGap = 12; // Gap between columns horizontally
      const yGap = 24; // Gap between rows vertically

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-auto relative pt-4 px-4 pb-12 overflow-x-hidden">
              
              {/* Dynamic State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Graphical Arrays Area */}
              <div className="flex flex-col items-center justify-center relative w-full max-w-6xl mt-4">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner overflow-x-auto`} style={{ minHeight: '500px' }}>
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                      <div className="relative w-full h-full overflow-visible flex flex-col items-center pt-16 pb-24 px-8 min-w-max">
                          
                          {/* Rendering Previous Rows */}
                          {st.triangle.map((row: number[], rowIdx: number) => {
                              
                              let isPrevRow = (st.hlPhase === 'innerLoop' || st.hlPhase === 'fetchParents' || st.hlPhase === 'calcSum') && rowIdx === st.curRowIdx - 1;
                              let isFinalComplete = st.isSuccess;

                              return (
                                  <div key={`t-row-${rowIdx}`} className="flex relative justify-center" style={{ marginBottom: `${yGap}px` }}>
                                      {row.map((val: number, colIdx: number) => {
                                          
                                          let isAboveLeft = isPrevRow && colIdx === st.curColIdx - 1;
                                          let isAboveRight = isPrevRow && colIdx === st.curColIdx;
                                          let isParent = isAboveLeft || isAboveRight;
                                          
                                          let bgClass = "bg-white border-slate-300 text-slate-600 shadow-sm";
                                          let scaleClass = "scale-100 opacity-80";

                                          if (isParent) {
                                              bgClass = "bg-indigo-100 border-indigo-400 text-indigo-900 shadow-md ring-4 ring-indigo-50 z-20";
                                              scaleClass = "scale-110 opacity-100";
                                          } else if (isFinalComplete) {
                                              bgClass = "bg-rose-50 border-rose-300 text-rose-800 shadow-sm";
                                              scaleClass = "scale-100 opacity-100";
                                          }

                                          return (
                                              <div key={`t-cell-${rowIdx}-${colIdx}`} className={`flex flex-col items-center justify-center transition-all duration-300 ${scaleClass}`} style={{ margin: `0 ${xGap/2}px`, width: `${nodeSize}px`, height: `${nodeSize}px` }}>
                                                  <div className={`w-full h-full flex items-center justify-center border-[3px] rounded-xl transition-all duration-300 ${bgClass}`}>
                                                      <span className="font-mono font-black text-lg">{val}</span>
                                                  </div>
                                              </div>
                                          );
                                      })}
                                  </div>
                              );
                          })}

                          {/* Rendering the "Active" Under-Construction Row */}
                          {!st.isSuccess && st.curRow !== undefined && (
                              <div className="flex relative justify-center bg-slate-100/50 p-2 rounded-2xl border-2 border-dashed border-slate-300 min-h-[60px] min-w-[60px]">
                                  {/* Absolute positioning helper to push elements in correctly */}
                                  {st.curRow.map((val: number, colIdx: number) => {
                                      
                                      let isJustAdded = (st.hlPhase === 'firstEdge' && colIdx === 0) || 
                                                        (st.hlPhase === 'lastEdge' && colIdx === st.curRowIdx) ||
                                                        (st.hlPhase === 'calcSum' && colIdx === st.curColIdx);
                                                        
                                      let bgClass = "bg-rose-50 border-rose-300 text-rose-700 shadow-sm";
                                      let scaleClass = "scale-100";

                                      if (isJustAdded) {
                                          bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                          scaleClass = "scale-110 animate-in zoom-in duration-300";
                                      }

                                      return (
                                          <div key={`active-cell-${st.curRowIdx}-${colIdx}`} className={`flex flex-col items-center justify-center transition-all duration-300 ${scaleClass}`} style={{ margin: `0 ${xGap/2}px`, width: `${nodeSize}px`, height: `${nodeSize}px` }}>
                                              <div className={`w-full h-full flex items-center justify-center border-[3px] rounded-xl transition-all duration-300 ${bgClass}`}>
                                                  <span className="font-mono font-black text-lg">{val}</span>
                                              </div>
                                          </div>
                                      );
                                  })}
                                  
                                  {/* Placeholder for the target cell being calculated */}
                                  {(st.hlPhase === 'innerLoop' || st.hlPhase === 'fetchParents') && (
                                      <div className={`flex flex-col items-center justify-center`} style={{ margin: `0 ${xGap/2}px`, width: `${nodeSize}px`, height: `${nodeSize}px` }}>
                                          <div className={`w-full h-full flex items-center justify-center border-[3px] rounded-xl transition-all duration-300 bg-slate-100 border-amber-400 border-dashed opacity-70`}>
                                              <span className="font-mono font-bold text-slate-400 text-xs">?</span>
                                          </div>
                                      </div>
                                  )}

                                  <div className="absolute -left-16 top-1/2 -translate-y-1/2">
                                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex flex-col items-center">Row<br/><span className="text-rose-500 text-lg">{st.curRowIdx}</span></span>
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Triangle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Pascal's Triangle</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming
                  </span>
                  <span>•</span>
                  <span>LeetCode 118</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none w-full xl:w-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><FileText size={28}/> Problem Statement</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given an integer <code>numRows</code>, return the first numRows of <strong>Pascal's triangle</strong>.</p>
                        <p>In Pascal's triangle, each number is the sum of the two numbers directly above it.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1: Multiple Rows</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> numRows = 5</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                The output represents the classic triangular format where each inner element adds the two elements strictly above it from the previous list.
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>1 &le; numRows &le; 30</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className="text-sky-500"/> Iterative Building</h5>
                        <p className="text-sm leading-relaxed text-slate-600">The problem is naturally recursive/iterative. You cannot build row <code>i</code> without first building row <code>i-1</code>. Because we need to return the entire triangle (all rows), iterative generation is perfectly optimal. We just start at the top <code>[1]</code> and loop downwards.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><RefreshCw size={16} className={`text-emerald-500`}/> Index Mapping</h5>
                        <p className="text-sm leading-relaxed text-slate-600">When building row <code>i</code> (0-indexed), the row will have exactly <code>i + 1</code> elements. The first element <code>row[0]</code> and last element <code>row[i]</code> are always <code>1</code>. For any interior element <code>row[j]</code>, its two parents in the previous row are strictly at indices <code>j - 1</code> (above-left) and <code>j</code> (above-right).</p>
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
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className={`text-${themeColor}-400`} /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth" ref={codeContainerMainRef}>
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={`code-line-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Number of Rows (1-15)</label>
                            <input type="number" value={rowsInput} onChange={(e) => setRowsInput(e.target.value)} className={`w-full max-w-[200px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-slate-900 tracking-widest`} placeholder="6" min="1" max="15" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess === true ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess === true ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><PartyPopper size={24}/> GENERATION COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Triangle built perfectly.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('Sum') || st.hlPhase?.includes('fetch') ? 'text-indigo-400' : (st.hlPhase?.includes('Edge') ? `text-amber-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 relative flex flex-col shadow-inner overflow-hidden flex-1 min-h-[400px]">
                   {renderVisuals()}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className={`inline-flex items-center justify-center p-4 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl mb-2`}>
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory & Complexity Analysis</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding 2D List operations and basic DP states.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className={`text-rose-500`}/> 1. Combinatorics & The Triangle</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">While Pascal's triangle represents the coefficients in binomial expansions (e.g., (x+y)^n), dynamically generating it programmatically is purely a state-transition problem.</p>
                        <p className="text-slate-600 leading-relaxed">Because we require every single row as part of our output, there's no way to optimize away the space required to store them. We just follow the definition directly: <code>value = above_left + above_right</code>.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowRight size={24} className="text-emerald-500"/> 2. Dealing with List boundaries</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A common mistake is trying to write a generic loop and adding <code>if (out of bounds) return 0</code> checks inside the loop to handle the edges. While technically possible, it is much slower and messier in Java.</p>
                        <p className="text-slate-600 leading-relaxed">The cleanest, most optimized way is to explicitly append a <code>1</code> before the inner loop starts, run the inner loop strictly from index <code>1</code> to <code>i-1</code>, and then append the closing <code>1</code>. This guarantees we never query an out-of-bounds index from the previous row!</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Clock size={24} className="text-amber-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N²).</strong> The first row has 1 element, the second has 2, the third has 3... the Nth row has N elements. The total number of elements generated is the sum of an arithmetic progression: 1 + 2 + 3 + ... + N, which evaluates to <span className="font-mono bg-slate-100 px-1 rounded border border-slate-200">N * (N + 1) / 2</span>. This simplifies asymptotically to O(N²).</li>
                            <li><strong>Space Complexity: O(N²).</strong> We must store every single element we generate to return the final list of lists. Thus, the space complexity perfectly mirrors the time complexity at O(N²).</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem is considered Easy on LeetCode. In an interview, the focus isn't on solving it—it's expected you solve it in 5 minutes—but rather on writing bug-free, perfectly bounded loops on the first try."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "What if you were asked to return ONLY the Nth row of Pascal's triangle?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "That is a variation known as Pascal's Triangle II (LeetCode 119)."</p>
                            <p>If we only need the Nth row, we can optimize the space complexity from O(N²) down to O(N). We maintain a single 1D array of size N, and we update it backwards (from right to left) during each simulated row generation to avoid overwriting values we still need. Alternatively, we could use the mathematical combinations formula <span className="font-mono bg-slate-100 px-1 rounded border border-slate-200">"n choose k"</span> to generate it in O(N) time directly without simulation."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "Is there a risk of integer overflow here?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "For standard constraints (numRows ≤ 30), no."</p>
                            <p>The maximum value in a 30-row Pascal's triangle is <span className="font-mono bg-slate-100 px-1 rounded border border-slate-200">"30 choose 15"</span>, which is 155,117,520. This easily fits within a standard 32-bit signed Java <code>int</code> (which holds up to ~2.1 billion). However, if the constraint asked for 40+ rows, we would absolutely need to switch from <code>Integer</code> to <code>Long</code> or handle arbitrary precision."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Cpu size={24}/></span>
                            <span>Q3: "Why did you use an ArrayList instead of a raw 2D array (`int[][]`)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To match the required return type signature."</p>
                            <p>The problem signature explicitly requests <code>List&lt;List&lt;Integer&gt;&gt;</code>. While building a jagged <code>int[][]</code> array and then converting it to nested Lists at the end is possible (and might offer marginal cache-locality performance boosts), doing so requires double the memory allocation overhead during the conversion step. Creating the ArrayLists directly is the cleanest idiomatic Java approach for this specific prompt."</p>
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
                  <div ref={codeContainerFullscreenRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10 relative scroll-smooth">
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess === true ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('Sum') || st.hlPhase?.includes('fetch') ? 'text-indigo-400' : (st.hlPhase?.includes('Edge') ? `text-amber-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={`fs-code-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>

                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px] flex flex-col">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex w-64 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600 block`}>Number of Rows</label>
                              <input type="number" value={rowsInput} onChange={(e) => setRowsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-slate-900 tracking-widest`} placeholder="6" min="1" max="15" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-lg transition-colors`}><Minimize size={24}/></button>
                        </div>
                  </div>

                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div className="flex-1 w-full h-full flex flex-col pt-32 pb-10 px-10 overflow-y-auto">
                       {renderVisuals()}
                  </div>

                  {(st.isSuccess === true) && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-rose-500`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-rose-500/20 text-rose-500 ring-rose-500/10`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">GENERATION COMPLETE</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 text-rose-400`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 text-rose-500`}>Final Triangle</div>
                                    <div className="font-mono text-white text-xl font-black leading-relaxed flex items-center gap-2">Output returned successfully</div>
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