import React, { useState, useMemo } from 'react';
import { 
  RotateCw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Grid, Timer, Network, ArrowUp, RefreshCw, FlipHorizontal, 
  ArrowLeftRight, Hash, ShieldAlert, Zap, Repeat, Repeat2
} from 'lucide-react';

const APPROACHES = {
  transposeReverse: {
    id: 'transposeReverse',
    title: '1. Transpose & Reverse',
    subtitle: 'Flip diagonally, then flip horizontally.',
    icon: <FlipHorizontal size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        
        // Step 1: Transpose the matrix (swap rows and cols)
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        
        // Step 2: Reverse each row horizontally
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = temp;
            }
        }
    }
}`,
    explanation: "The most intuitive and commonly accepted approach in interviews. Rotating a 2D matrix 90 degrees clockwise is mathematically equivalent to taking its Transpose (flipping it along its top-left to bottom-right diagonal) and then Reversing each row horizontally."
  },
  fourWaySwap: {
    id: 'fourWaySwap',
    title: '2. Four-Way Swap',
    subtitle: 'Rotate cells in groups of four.',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        
        // Iterate through concentric squares
        for (int i = 0; i < n / 2; i++) {
            // Iterate through cells in the current square
            for (int j = i; j < n - i - 1; j++) {
                // Save the top element
                int temp = matrix[i][j];
                
                // Move left to top
                matrix[i][j] = matrix[n - 1 - j][i];
                
                // Move bottom to left
                matrix[n - 1 - j][i] = matrix[n - 1 - i][n - 1 - j];
                
                // Move right to bottom
                matrix[n - 1 - i][n - 1 - j] = matrix[j][n - 1 - i];
                
                // Move top (saved in temp) to right
                matrix[j][n - 1 - i] = temp;
            }
        }
    }
}`,
    explanation: "The most optimal single-pass approach. We process the matrix layer by layer (like concentric squares). For each cell in the top row of a layer, we swap it with the corresponding cell in the right column, which swaps with the bottom row, which swaps with the left column. We do this 4-way swap using a single 'temp' variable."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">48. Rotate Image</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          You are given an <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono font-bold">n x n</code> 2D <code className="font-mono">matrix</code> representing an image, rotate the image by <strong>90</strong> degrees (clockwise).
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-indigo-500 pl-4 bg-indigo-50 py-2">
          You have to rotate the image <strong className="text-indigo-700">in-place</strong>, which means you have to modify the input 2D matrix directly. <strong>DO NOT</strong> allocate another 2D matrix and do the rotation.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-8 text-slate-700">
                 <div className="grid grid-cols-3 gap-1 bg-slate-200 p-1 rounded-lg">
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                        <div key={n} className="w-8 h-8 bg-white flex items-center justify-center rounded-sm font-bold shadow-sm">{n}</div>
                    ))}
                 </div>
                 <ArrowRight size={24} className="text-indigo-400"/>
                 <div className="grid grid-cols-3 gap-1 bg-indigo-200 p-1 rounded-lg">
                    {[7,4,1,8,5,2,9,6,3].map(n => (
                        <div key={n} className="w-8 h-8 bg-white flex items-center justify-center rounded-sm font-bold shadow-sm text-indigo-700">{n}</div>
                    ))}
                 </div>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> matrix = [[1,2,3],[4,5,6],[7,8,9]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[7,4,1],[8,5,2],[9,6,3]]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RotateImageVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('transposeReverse');
  const [matrixInput, setMatrixInput] = useState('[[1,2,3],[4,5,6],[7,8,9]]');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedMatrix = useMemo(() => {
    try {
        const parsed = JSON.parse(matrixInput);
        if (!Array.isArray(parsed) || parsed.length === 0 || !Array.isArray(parsed[0])) throw new Error();
        // Check if square
        const n = parsed.length;
        for (let row of parsed) {
            if (row.length !== n) throw new Error();
        }
        return parsed;
    } catch (e) {
        // Fallback to default 3x3
        return [[1,2,3],[4,5,6],[7,8,9]];
    }
  }, [matrixInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const cloneMatrix = (m: number[][]) => m.map(row => [...row]);
    let m = cloneMatrix(parsedMatrix);
    const n = m.length;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: { m: cloneMatrix(m), ...state }
      });
    };

    if (selectedApproachId === 'transposeReverse') {
        addStep("Initialization", `Matrix is ${n}x${n}. Starting Transpose phase.`, 3, { i: null, j: null, temp: null, highlights: [] });

        // Phase 1: Transpose
        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) {
                if (i !== j) {
                    addStep("Select Cells", `Preparing to swap matrix[${i}][${j}] (${m[i][j]}) with matrix[${j}][${i}] (${m[j][i]}).`, 7, { i, j, temp: m[i][j], highlights: [[i,j], [j,i]], type: 'transpose' });
                    
                    let temp = m[i][j];
                    m[i][j] = m[j][i];
                    m[j][i] = temp;
                    
                    addStep("Swapped", `Cells swapped across the main diagonal.`, 9, { i, j, temp, highlights: [[i,j], [j,i]], type: 'transpose' });
                }
            }
        }
        
        addStep("Transpose Complete", `Matrix is now transposed. Starting Row Reversal phase.`, 13, { i: null, j: null, temp: null, highlights: [] });

        // Phase 2: Reverse
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < Math.floor(n / 2); j++) {
                addStep("Select Cells", `Preparing to swap matrix[${i}][${j}] (${m[i][j]}) with matrix[${i}][${n - 1 - j}] (${m[i][n - 1 - j]}).`, 16, { i, j, temp: m[i][j], highlights: [[i,j], [i, n-1-j]], type: 'reverse' });
                
                let temp = m[i][j];
                m[i][j] = m[i][n - 1 - j];
                m[i][n - 1 - j] = temp;
                
                addStep("Swapped", `Row ${i} endpoints swapped.`, 18, { i, j, temp, highlights: [[i,j], [i, n-1-j]], type: 'reverse' });
            }
        }
        
        addStep("Rotation Complete", `Matrix is successfully rotated 90 degrees clockwise in-place.`, 21, { i: null, j: null, temp: null, highlights: [], isSuccess: true });

    } 
    else if (selectedApproachId === 'fourWaySwap') {
        addStep("Initialization", `Matrix is ${n}x${n}. Starting Four-Way Swap by layers.`, 3, { i: null, j: null, temp: null, highlights: [] });

        for (let i = 0; i < Math.floor(n / 2); i++) {
            for (let j = i; j < n - i - 1; j++) {
                let top = m[i][j];
                let right = m[j][n - 1 - i];
                let bottom = m[n - 1 - i][n - 1 - j];
                let left = m[n - 1 - j][i];

                addStep("Identify 4 Cells", `Selecting 4 symmetric cells for rotation in layer ${i}.`, 9, { 
                    i, j, temp: top, 
                    highlights: [[i,j], [j, n-1-i], [n-1-i, n-1-j], [n-1-j, i]],
                    type: 'fourWay'
                });
                
                m[i][j] = left;
                addStep("Move Left to Top", `matrix[${i}][${j}] = ${left}`, 12, { 
                    i, j, temp: top, 
                    highlights: [[i,j], [n-1-j, i]], type: 'fourWay'
                });

                m[n - 1 - j][i] = bottom;
                addStep("Move Bottom to Left", `matrix[${n - 1 - j}][${i}] = ${bottom}`, 15, { 
                    i, j, temp: top, 
                    highlights: [[n-1-j, i], [n-1-i, n-1-j]], type: 'fourWay'
                });

                m[n - 1 - i][n - 1 - j] = right;
                addStep("Move Right to Bottom", `matrix[${n - 1 - i}][${n - 1 - j}] = ${right}`, 18, { 
                    i, j, temp: top, 
                    highlights: [[n-1-i, n-1-j], [j, n-1-i]], type: 'fourWay'
                });

                m[j][n - 1 - i] = top;
                addStep("Move Top (Temp) to Right", `matrix[${j}][${n - 1 - i}] = ${top} (from temp)`, 21, { 
                    i, j, temp: top, 
                    highlights: [[j, n-1-i], [i,j]], type: 'fourWay'
                });
            }
        }
        
        addStep("Rotation Complete", `Matrix is successfully rotated 90 degrees clockwise in-place.`, 24, { i: null, j: null, temp: null, highlights: [], isSuccess: true });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, { highlights: [] });
    }

    return steps;
  }, [parsedMatrix, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || { m: parsedMatrix, highlights: [] };
  const { isSuccess, isFailed, m, highlights, type, i, j, temp } = state;
  const n = m.length;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <RotateCw className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Rotate Image</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 48</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">2D Matrix</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && <ProblemStatement />}

        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Approaches, Code & Variable Context (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Approach Selector */}
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id as keyof typeof APPROACHES); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[460px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-indigo-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-indigo-500/20 border-indigo-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="indigo" />
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <VariableCard label="Row (i)" val={i ?? null} color="sky" active={i !== null} />
                        <VariableCard label="Col (j)" val={j ?? null} color="violet" active={j !== null} />
                        <VariableCard label="Temp" val={temp ?? null} color="amber" active={temp !== null} />
                    </div>
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Input Matrix (JSON)</label>
                        <input type="text" value={matrixInput} onChange={(e) => { setMatrixInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" placeholder="e.g. [[1,2],[3,4]]" />
                    </div>
                    
                    {/* Quick inputs */}
                    <div className="hidden xl:flex gap-2">
                       <button onClick={() => {setMatrixInput('[[1,2,3],[4,5,6],[7,8,9]]'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">3x3</button>
                       <button onClick={() => {setMatrixInput('[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">4x4</button>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Grid size={100}/>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-indigo-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[420px] relative flex flex-col overflow-hidden shadow-inner items-center justify-center">
                   
                   <div className="relative p-6 bg-slate-50 border border-slate-200 rounded-3xl shadow-inner">
                       
                       {/* Contextual Background Overlays for Phase indicating */}
                       {type === 'transpose' && (
                           <div className="absolute inset-0 flex pointer-events-none">
                               <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                                   <line x1="10%" y1="10%" x2="90%" y2="90%" stroke="#6366f1" strokeWidth="4" strokeDasharray="8 8" />
                               </svg>
                           </div>
                       )}
                       {type === 'reverse' && (
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                               <div className="w-1 h-full bg-indigo-500/20 border-l border-r border-indigo-500/30 border-dashed" />
                           </div>
                       )}

                       <div 
                           className="grid gap-2 relative z-10" 
                           style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
                       >
                           {m.map((row: number[], rowIndex: number) => (
                               row.map((cell: number, colIndex: number) => {
                                   
                                   // Determine highlight colors based on approach and index
                                   let isHighlighted = false;
                                   let highlightColor = "bg-white border-slate-200 text-slate-700";
                                   
                                   const highlightIdx = highlights.findIndex((h: number[]) => h[0] === rowIndex && h[1] === colIndex);
                                   
                                   if (highlightIdx !== -1) {
                                       isHighlighted = true;
                                       if (type === 'transpose') {
                                           highlightColor = highlightIdx === 0 ? "bg-amber-100 border-amber-400 text-amber-800 scale-105 shadow-md z-10" : "bg-sky-100 border-sky-400 text-sky-800 scale-105 shadow-md z-10";
                                       } else if (type === 'reverse') {
                                           highlightColor = highlightIdx === 0 ? "bg-violet-100 border-violet-400 text-violet-800 scale-105 shadow-md z-10" : "bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800 scale-105 shadow-md z-10";
                                       } else if (type === 'fourWay') {
                                            const colors = [
                                                "bg-amber-100 border-amber-400 text-amber-800",
                                                "bg-sky-100 border-sky-400 text-sky-800",
                                                "bg-emerald-100 border-emerald-400 text-emerald-800",
                                                "bg-rose-100 border-rose-400 text-rose-800"
                                            ];
                                            highlightColor = `${colors[highlightIdx]} scale-105 shadow-md z-10`;
                                       }
                                   }

                                   return (
                                       <div 
                                          key={`${rowIndex}-${colIndex}`} 
                                          className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center border-2 rounded-xl font-mono font-black text-lg transition-all duration-500 ${highlightColor} ${isSuccess ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : ''}`}
                                       >
                                           {cell}
                                           {/* Mini coordinates */}
                                           <div className="absolute top-1 left-1.5 text-[8px] font-sans text-slate-400 opacity-60">
                                              {rowIndex},{colIndex}
                                           </div>
                                       </div>
                                   );
                               })
                           ))}
                       </div>
                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">ROTATION COMPLETE</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono">90° Clockwise</span>
                          </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theory / Learn Tab */}
        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Grid className="text-indigo-600"/> Matrix Math Magic
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                Linear algebra provides a beautiful shortcut for rotating matrices. A 90-degree clockwise rotation is mathematically identical to taking the <strong>Transpose</strong> of the matrix, followed by a <strong>Horizontal Reflection</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Repeat size={18}/> 1. Transpose
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed italic mb-4">
                            Swap rows with columns: <code>matrix[i][j] ↔ matrix[j][i]</code>
                        </p>
                        <div className="flex items-center gap-4 text-xs font-black text-slate-700 justify-center">
                            <div className="bg-white p-2 rounded-lg border border-sky-200 shadow-sm leading-relaxed text-center">
                                1  2  3<br/>
                                4  5  6<br/>
                                7  8  9
                            </div>
                            <ArrowRight className="text-sky-400" />
                            <div className="bg-white p-2 rounded-lg border border-sky-200 shadow-sm leading-relaxed text-center">
                                1  4  7<br/>
                                2  5  8<br/>
                                3  6  9
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 bg-violet-50 border border-violet-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-violet-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <FlipHorizontal size={18}/> 2. Reverse Rows
                        </h3>
                        <p className="text-sm text-violet-800 leading-relaxed italic mb-4">
                            Flip horizontally: <code>matrix[i][j] ↔ matrix[i][n-1-j]</code>
                        </p>
                        <div className="flex items-center gap-4 text-xs font-black text-slate-700 justify-center">
                            <div className="bg-white p-2 rounded-lg border border-violet-200 shadow-sm leading-relaxed text-center">
                                1  4  7<br/>
                                2  5  8<br/>
                                3  6  9
                            </div>
                            <ArrowRight className="text-violet-400" />
                            <div className="bg-white p-2 rounded-lg border border-violet-200 shadow-sm leading-relaxed text-center text-indigo-700">
                                7  4  1<br/>
                                8  5  2<br/>
                                9  6  3
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <RefreshCw size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The 4-Way Swap Alternative</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Instead of two full passes over the matrix (Transpose then Reverse), you can process concentric "rings" or "layers" of the matrix, moving 4 elements at a time in a circle.
                        </p>
                        <p>
                           This is slightly harder to write cleanly in an interview due to complex coordinate arithmetic, but it touches every element exactly once (1 pass).
                        </p>
                        <div className="bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           Top:    [i][j]<br/>
                           Right:  [j][n-1-i]<br/>
                           Bottom: [n-1-i][n-1-j]<br/>
                           Left:   [n-1-j][i]
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}
        
        {/* Interview Tab */}
        {activeTab === 'interview' && (
             <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8 font-mono">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "While the single-pass 4-way swap is technically strictly fewer operations, the 'Transpose and Reverse' method is overwhelmingly preferred in real-world interviews. It breaks a complex 2D coordinate problem into two distinct, trivial, and highly readable helper functions. It completely eliminates off-by-one errors that frequently happen during the concentric circle logic, while maintaining the exact same asymptotic Big O bounds."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Anti-Clockwise?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">How to rotate 90° Anti-Clockwise:</strong> The logic is beautifully symmetrical. You Reverse the rows horizontally FIRST, and then take the Transpose. Alternatively, you Transpose first, but then Reverse the <strong>columns</strong> vertically (top to bottom) instead of the rows.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-emerald-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N²)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We must touch every cell in the N x N grid to move it to its new location.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We perform all swaps in-place using a single temporary variable, completely satisfying the strict O(1) space constraint.</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  );
};

const VariableCard = ({ label, val, color, active }: { label: string, val: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' }> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break)\b|\b\d+\b)/g).filter(Boolean);
  
  const bgActive = `bg-${theme}-500/15`;
  const borderActive = `bg-${theme}-500`;
  const textActive = `text-${theme}-400`;

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? bgActive : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderActive}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? `${textActive} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-green-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RotateImageVisualizer;