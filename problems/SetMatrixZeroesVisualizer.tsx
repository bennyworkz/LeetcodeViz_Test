import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ShieldAlert, Database, 
  Grid3X3, ArrowRightLeft, Maximize, Target as TargetIcon, LayoutGrid
} from 'lucide-react';

const APPROACHES = {
  optimalO1: {
    id: 'optimalO1',
    title: '1. In-Place Markers',
    subtitle: 'Optimal: O(M*N) Time, O(1) Space.',
    icon: <Grid3X3 size={16} />,
    complexity: 'Time: O(M*N) | Space: O(1)',
    code: `class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRowZero = false, firstColZero = false;
        
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) firstColZero = true;
        }
        for (int j = 0; j < n; j++) {
            if (matrix[0][j] == 0) firstRowZero = true;
        }
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                    matrix[i][j] = 0;
                }
            }
        }
        
        if (firstColZero) {
            for (int i = 0; i < m; i++) matrix[i][0] = 0;
        }
        if (firstRowZero) {
            for (int j = 0; j < n; j++) matrix[0][j] = 0;
        }
    }
}`,
    explanation: "To achieve O(1) space, we use the first row and first column of the matrix itself as our tracker arrays! First, we check if the first row/col originally contained any zeros and store that in two boolean variables. Then, we iterate through the rest of the matrix; if a cell is 0, we project that 0 to its corresponding cell in the first row and first column. Finally, we iterate again to apply those zeros, and optionally zero out the first row/col based on our initial boolean checks."
  },
  extraSpace: {
    id: 'extraSpace',
    title: '2. Tracker Arrays',
    subtitle: 'Intuitive: O(M+N) Extra Space.',
    icon: <Database size={16} />,
    complexity: 'Time: O(M*N) | Space: O(M+N)',
    code: `class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean[] rowZero = new boolean[m];
        boolean[] colZero = new boolean[n];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 0) {
                    rowZero[i] = true;
                    colZero[j] = true;
                }
            }
        }
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (rowZero[i] || colZero[j]) {
                    matrix[i][j] = 0;
                }
            }
        }
    }
}`,
    explanation: "The brute-force / extra memory approach. We allocate two separate boolean arrays: one for the rows (size M) and one for the columns (size N). In the first pass, anytime we see a 0, we flag its row and column in our tracker arrays. In the second pass, we check every cell against the trackers—if its row or column is flagged, we set the cell to 0."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">73. Set Matrix Zeroes</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an <code className="bg-slate-100 px-1.5 py-0.5 rounded text-cyan-600 font-mono font-bold">m x n</code> integer matrix <code className="font-mono">matrix</code>, if an element is <code className="font-mono font-bold text-rose-600">0</code>, set its entire row and column to <code className="font-mono font-bold text-rose-600">0</code>'s.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-cyan-500 pl-4 bg-cyan-50 py-2 mt-4">
          You must do it <strong>in place</strong>.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-6 items-start shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div className="space-y-2">
                <p><strong>Follow up constraints:</strong></p>
                <ul className="list-disc pl-4 marker:text-amber-500">
                    <li>A straightforward solution using <code>O(mn)</code> space is probably a bad idea.</li>
                    <li>A simple improvement uses <code>O(m + n)</code> space, but still not the best.</li>
                    <li>Could you devise a constant <code>O(1)</code> space solution?</li>
                </ul>
            </div>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex gap-8 items-center">
                  <div className="grid grid-cols-3 gap-1 bg-slate-300 border-4 border-slate-800 p-1 w-fit shadow-sm">
                      {[[1,1,1],[1,0,1],[1,1,1]].map((row, r) => row.map((cell, c) => (
                          <div key={`${r}-${c}`} className={`w-8 h-8 flex items-center justify-center bg-white font-bold ${cell === 0 ? 'text-rose-600 bg-rose-50' : 'text-slate-800'}`}>{cell}</div>
                      )))}
                  </div>
                  <ArrowRight className="text-slate-400" />
                  <div className="grid grid-cols-3 gap-1 bg-slate-300 border-4 border-slate-800 p-1 w-fit shadow-sm">
                      {[[1,0,1],[0,0,0],[1,0,1]].map((row, r) => row.map((cell, c) => (
                          <div key={`${r}-${c}`} className={`w-8 h-8 flex items-center justify-center font-bold ${cell === 0 ? 'text-white bg-rose-500' : 'bg-white text-slate-800'}`}>{cell}</div>
                      )))}
                  </div>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> matrix = [[1,1,1],[1,0,1],[1,1,1]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1,0,1],[0,0,0],[1,0,1]]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SetMatrixZeroesVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('optimalO1');
  const [matrixInput, setMatrixInput] = useState('[[0,1,2,0],[3,4,5,2],[1,3,1,5]]');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedMatrix = useMemo(() => {
    try {
        const arr = JSON.parse(matrixInput);
        if (!Array.isArray(arr) || arr.length === 0 || !Array.isArray(arr[0])) throw new Error();
        // Limit size to prevent UI overload
        const m = Math.min(arr.length, 5);
        const n = Math.min(arr[0].length, 6);
        const limited = [];
        for (let i = 0; i < m; i++) {
            limited.push(arr[i].slice(0, n).map(v => Number(v) || 0));
        }
        return limited;
    } catch (e) {
        return [[0,1,2,0],[3,4,5,2],[1,3,1,5]];
    }
  }, [matrixInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const matrix = parsedMatrix.map(row => [...row]);
    const m = matrix.length;
    const n = matrix[0].length;
    
    const cloneMatrix = (mat: number[][]) => mat.map(row => [...row]);

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      if (steps.length > 2000) return; // safety
      steps.push({
        phase,
        description: desc,
        line,
        state: { matrix: cloneMatrix(matrix), m, n, ...state }
      });
    };

    if (selectedApproachId === 'optimalO1') {
        let firstRowZero = false;
        let firstColZero = false;
        
        addStep("Initialization", `Line 3-4: Get dimensions m=${m}, n=${n}. Initialize firstRowZero=false, firstColZero=false.`, 4, { firstRowZero, firstColZero, r: null, c: null, subPhase: 'init' });
        
        // Pass 1: Check first col
        addStep("Check First Column", `Line 6: We must check if the first column contains any zeros natively, because we will overwrite it later.`, 6, { firstRowZero, firstColZero, r: 0, c: 0, subPhase: 'checkFirstCol' });
        for (let i = 0; i < m; i++) {
            addStep("Inspect Col 0", `Line 7: Is matrix[${i}][0] == 0? Value is ${matrix[i][0]}.`, 7, { firstRowZero, firstColZero, r: i, c: 0, subPhase: 'checkFirstCol' });
            if (matrix[i][0] === 0) {
                firstColZero = true;
                addStep("First Col Flagged", `Line 7: True! Set firstColZero = true.`, 7, { firstRowZero, firstColZero, r: i, c: 0, subPhase: 'checkFirstCol' });
            }
        }
        
        // Pass 2: Check first row
        addStep("Check First Row", `Line 9: We must check if the first row contains any zeros natively, because we will overwrite it later.`, 9, { firstRowZero, firstColZero, r: 0, c: 0, subPhase: 'checkFirstRow' });
        for (let j = 0; j < n; j++) {
            addStep("Inspect Row 0", `Line 10: Is matrix[0][${j}] == 0? Value is ${matrix[0][j]}.`, 10, { firstRowZero, firstColZero, r: 0, c: j, subPhase: 'checkFirstRow' });
            if (matrix[0][j] === 0) {
                firstRowZero = true;
                addStep("First Row Flagged", `Line 10: True! Set firstRowZero = true.`, 10, { firstRowZero, firstColZero, r: 0, c: j, subPhase: 'checkFirstRow' });
            }
        }
        
        // Pass 3: Map zeros to markers
        addStep("Map Zeros", `Line 13: We iterate the interior matrix (ignoring row 0 and col 0). If we find a 0, we project it to the markers in row 0 and col 0.`, 13, { firstRowZero, firstColZero, r: 1, c: 1, subPhase: 'mapZeros' });
        for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
                addStep("Inspect Interior", `Line 15: Is matrix[${i}][${j}] == 0? Value is ${matrix[i][j]}.`, 15, { firstRowZero, firstColZero, r: i, c: j, subPhase: 'mapZeros' });
                if (matrix[i][j] === 0) {
                    addStep("Project Zero", `Line 16-17: True! Projecting zero to markers: matrix[${i}][0] = 0, matrix[0][${j}] = 0.`, 16, { firstRowZero, firstColZero, r: i, c: j, subPhase: 'mapZeros', projecting: true });
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                    addStep("Markers Updated", `Line 18: Markers applied. The first row and column remember this 0.`, 18, { firstRowZero, firstColZero, r: i, c: j, subPhase: 'mapZeros' });
                }
            }
        }
        
        // Pass 4: Apply markers
        addStep("Apply Markers", `Line 22: Now we iterate the interior matrix again. We look at the first row/col markers to decide if a cell should become 0.`, 22, { firstRowZero, firstColZero, r: 1, c: 1, subPhase: 'applyMarkers' });
        for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
                addStep("Check Markers", `Line 24: Does row marker matrix[${i}][0] == 0 OR col marker matrix[0][${j}] == 0?`, 24, { firstRowZero, firstColZero, r: i, c: j, subPhase: 'applyMarkers', checkingMarkers: true });
                if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                    matrix[i][j] = 0;
                    addStep("Set Zero", `Line 25: True! One of the markers is 0. Setting matrix[${i}][${j}] = 0.`, 25, { firstRowZero, firstColZero, r: i, c: j, subPhase: 'applyMarkers', settingZero: true });
                } else {
                    addStep("Skip Cell", `Line 24: False. Neither marker is 0. Leave cell as is.`, 24, { firstRowZero, firstColZero, r: i, c: j, subPhase: 'applyMarkers' });
                }
            }
        }
        
        // Pass 5: Resolve first col
        addStep("Resolve First Column", `Line 30: Does the first column naturally need to be zeroed? firstColZero == ${firstColZero}.`, 30, { firstRowZero, firstColZero, r: null, c: null, subPhase: 'resolveFirsts' });
        if (firstColZero) {
            for (let i = 0; i < m; i++) matrix[i][0] = 0;
            addStep("Zero First Column", `Line 31: True! Overwriting entire first column to 0.`, 31, { firstRowZero, firstColZero, r: null, c: 0, subPhase: 'resolveFirsts', settingZero: true, forceCol: true });
        }
        
        // Pass 6: Resolve first row
        addStep("Resolve First Row", `Line 33: Does the first row naturally need to be zeroed? firstRowZero == ${firstRowZero}.`, 33, { firstRowZero, firstColZero, r: null, c: null, subPhase: 'resolveFirsts' });
        if (firstRowZero) {
            for (let j = 0; j < n; j++) matrix[0][j] = 0;
            addStep("Zero First Row", `Line 34: True! Overwriting entire first row to 0.`, 34, { firstRowZero, firstColZero, r: 0, c: null, subPhase: 'resolveFirsts', settingZero: true, forceRow: true });
        }
        
        addStep("Return Final", `Line 36: In-place matrix modification complete!`, 36, { firstRowZero, firstColZero, r: null, c: null, subPhase: 'done', isSuccess: true });
        
    } 
    else if (selectedApproachId === 'extraSpace') {
        let rowZero = new Array(m).fill(false);
        let colZero = new Array(n).fill(false);
        
        addStep("Allocate Arrays", `Line 4-5: Created rowZero array (size ${m}) and colZero array (size ${n}) initialized to false.`, 5, { rowZero: [...rowZero], colZero: [...colZero], r: null, c: null, subPhase: 'init' });

        // Pass 1: Find Zeros
        addStep("Find Zeros", `Line 7: Iterating through entire matrix to find original zeros.`, 7, { rowZero: [...rowZero], colZero: [...colZero], r: 0, c: 0, subPhase: 'find' });
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                addStep("Inspect Cell", `Line 9: Is matrix[${i}][${j}] == 0? Value is ${matrix[i][j]}.`, 9, { rowZero: [...rowZero], colZero: [...colZero], r: i, c: j, subPhase: 'find' });
                if (matrix[i][j] === 0) {
                    rowZero[i] = true;
                    colZero[j] = true;
                    addStep("Flag Trackers", `Line 10-11: True! Set rowZero[${i}] = true and colZero[${j}] = true.`, 11, { rowZero: [...rowZero], colZero: [...colZero], r: i, c: j, subPhase: 'find', flagging: true });
                }
            }
        }
        
        // Pass 2: Apply Zeros
        addStep("Apply Zeros", `Line 16: Iterating matrix again. If a cell's row or col is flagged, we overwrite it.`, 16, { rowZero: [...rowZero], colZero: [...colZero], r: 0, c: 0, subPhase: 'apply' });
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                addStep("Check Trackers", `Line 18: Is rowZero[${i}] OR colZero[${j}] true? (${rowZero[i]} || ${colZero[j]}).`, 18, { rowZero: [...rowZero], colZero: [...colZero], r: i, c: j, subPhase: 'apply', checkingTrackers: true });
                if (rowZero[i] || colZero[j]) {
                    matrix[i][j] = 0;
                    addStep("Set Zero", `Line 19: True! Setting matrix[${i}][${j}] to 0.`, 19, { rowZero: [...rowZero], colZero: [...colZero], r: i, c: j, subPhase: 'apply', settingZero: true });
                } else {
                     addStep("Skip Cell", `Line 18: False. Cell remains ${matrix[i][j]}.`, 18, { rowZero: [...rowZero], colZero: [...colZero], r: i, c: j, subPhase: 'apply' });
                }
            }
        }

        addStep("Return Final", `Line 23: Extra space approach complete!`, 23, { rowZero: [...rowZero], colZero: [...colZero], r: null, c: null, subPhase: 'done', isSuccess: true });
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
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
  const state = cur.state || { matrix: parsedMatrix, m: parsedMatrix.length, n: parsedMatrix[0].length };
  const { isSuccess, matrix, m, n, r, c, subPhase, firstRowZero, firstColZero, rowZero, colZero, projecting, checkingMarkers, settingZero, forceCol, forceRow, flagging, checkingTrackers } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-cyan-600 p-4 rounded-2xl shadow-lg shadow-cyan-100 flex items-center justify-center">
                <LayoutGrid className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Set Matrix Zeroes</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 73</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Matrix / In-Place</span>
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
              
              {/* Left Col: Code & Context (5/12) */}
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-cyan-600 border-cyan-600 text-white shadow-cyan-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-cyan-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-cyan-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Code Window */}
                <div className="bg-[#0f172a] rounded-3xl h-[460px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-cyan-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : projecting || settingZero || flagging ? 'bg-rose-500/20 border-rose-500' : 'bg-cyan-500/20 border-cyan-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="cyan" />
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-cyan-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">State</h4>
                      </div>
                      {subPhase && <span className={`uppercase tracking-widest text-[9px] px-2 py-0.5 rounded text-white ${subPhase.includes('check') || subPhase === 'find' ? 'bg-amber-500' : subPhase.includes('apply') || subPhase.includes('map') || subPhase.includes('resolve') ? 'bg-blue-500' : 'bg-slate-400'}`}>{subPhase}</span>}
                    </div>
                    
                    {selectedApproachId === 'optimalO1' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="firstColZero" val={firstColZero ? 'true' : 'false'} color={firstColZero ? "rose" : "emerald"} active={firstColZero !== undefined} isBool />
                            <VariableCard label="firstRowZero" val={firstRowZero ? 'true' : 'false'} color={firstRowZero ? "rose" : "emerald"} active={firstRowZero !== undefined} isBool />
                        </div>
                    ) : (
                         <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Row (i)" val={r ?? null} color="sky" active={r !== null} />
                            <VariableCard label="Col (j)" val={c ?? null} color="violet" active={c !== null} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-cyan-600 uppercase block pl-1 tracking-widest font-mono">Matrix Input (JSON)</label>
                        <input type="text" value={matrixInput} onChange={(e) => { setMatrixInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-inner truncate" placeholder="[[1,1,1],[1,0,1],[1,1,1]]" />
                    </div>

                    <div className="hidden xl:flex gap-2">
                       <button onClick={() => {setMatrixInput('[[1,1,1],[1,0,1],[1,1,1]]'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm">Ex 1</button>
                       <button onClick={() => {setMatrixInput('[[0,1,2,0],[3,4,5,2],[1,3,1,5]]'); setCurrentStep(0);}} className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm">Ex 2</button>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-cyan-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-cyan-100 hover:bg-cyan-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : projecting || settingZero ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : projecting || settingZero ? <TargetIcon size={100}/> : <LayoutGrid size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : projecting || settingZero ? "text-rose-400" : "text-cyan-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : projecting || settingZero ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col w-full h-full relative z-10 items-center justify-center pt-2 pb-2">
                      
                      {selectedApproachId === 'extraSpace' && (rowZero || colZero) && (
                          <div className="flex w-full justify-around mb-8 border-b border-slate-100 pb-6">
                              <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">rowZero Array</span>
                                  <div className="flex gap-1">
                                      {rowZero.map((z: boolean, idx: number) => (
                                          <div key={`rz-${idx}`} className={`w-6 h-6 sm:w-8 sm:h-8 flex flex-col items-center justify-center text-[10px] font-bold border rounded ${z ? 'bg-rose-500 border-rose-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'} ${idx === r && flagging ? 'scale-125 ring-2 ring-rose-300' : ''} ${checkingTrackers && idx === r ? 'ring-2 ring-amber-400' : ''}`}>
                                              {z ? 'T' : 'F'}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">colZero Array</span>
                                  <div className="flex gap-1">
                                      {colZero.map((z: boolean, idx: number) => (
                                          <div key={`cz-${idx}`} className={`w-6 h-6 sm:w-8 sm:h-8 flex flex-col items-center justify-center text-[10px] font-bold border rounded ${z ? 'bg-rose-500 border-rose-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'} ${idx === c && flagging ? 'scale-125 ring-2 ring-rose-300' : ''} ${checkingTrackers && idx === c ? 'ring-2 ring-amber-400' : ''}`}>
                                              {z ? 'T' : 'F'}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Main Matrix Rendering */}
                      <div 
                         className="grid bg-slate-300 border-4 border-slate-800 shadow-xl w-fit"
                         style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
                      >
                          {matrix.map((row: number[], rowIndex: number) => (
                              row.map((cellVal: number, colIndex: number) => {
                                  
                                  const isCurrent = rowIndex === r && colIndex === c && r !== null && c !== null;
                                  const isFirstRow = rowIndex === 0 && selectedApproachId === 'optimalO1';
                                  const isFirstCol = colIndex === 0 && selectedApproachId === 'optimalO1';
                                  const isMarker = isFirstRow || isFirstCol;

                                  let bgClass = "bg-white";
                                  let textClass = "text-slate-800";
                                  let zIndex = "z-0";
                                  let scaleClass = "";

                                  if (isMarker && !isSuccess) {
                                      bgClass = "bg-amber-50"; // Marker background
                                  }

                                  if (cellVal === 0) {
                                      if (isMarker && !isSuccess) {
                                          bgClass = "bg-amber-400"; // Triggered marker
                                          textClass = "text-amber-900";
                                      } else {
                                          bgClass = "bg-rose-100"; // Normal zero
                                          textClass = "text-rose-700";
                                      }
                                  }

                                  // Active highlights
                                  if (isCurrent) {
                                      bgClass = "bg-cyan-400";
                                      textClass = "text-white";
                                      scaleClass = "scale-110 shadow-lg";
                                      zIndex = "z-20";
                                      if (cellVal === 0) bgClass = "bg-rose-500";
                                  }

                                  if (selectedApproachId === 'optimalO1' && projecting) {
                                      if ((rowIndex === r && colIndex === 0) || (rowIndex === 0 && colIndex === c)) {
                                          bgClass = "bg-rose-400 animate-pulse";
                                          textClass = "text-white";
                                          scaleClass = "scale-110 shadow-lg";
                                          zIndex = "z-10";
                                      }
                                  }

                                  if (selectedApproachId === 'optimalO1' && checkingMarkers) {
                                      if ((rowIndex === r && colIndex === 0) || (rowIndex === 0 && colIndex === c)) {
                                          scaleClass = "scale-110 ring-2 ring-amber-500";
                                          zIndex = "z-10";
                                      }
                                  }

                                  if (selectedApproachId === 'optimalO1' && settingZero) {
                                      if (forceRow && isFirstRow) {
                                          bgClass = "bg-rose-500"; textClass = "text-white";
                                      }
                                      if (forceCol && isFirstCol) {
                                          bgClass = "bg-rose-500"; textClass = "text-white";
                                      }
                                      if (isCurrent) {
                                          bgClass = "bg-rose-500"; textClass = "text-white"; scaleClass = "scale-125 shadow-xl";
                                      }
                                  }
                                  
                                  if (selectedApproachId === 'extraSpace' && settingZero && isCurrent) {
                                      bgClass = "bg-rose-500"; textClass = "text-white"; scaleClass = "scale-125 shadow-xl";
                                  }

                                  if (isSuccess) {
                                      bgClass = cellVal === 0 ? "bg-rose-500" : "bg-white";
                                      textClass = cellVal === 0 ? "text-white" : "text-slate-800";
                                  }

                                  return (
                                      <div 
                                         key={`${rowIndex}-${colIndex}`} 
                                         className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center font-bold font-mono text-lg sm:text-xl border-b border-r border-slate-300 transition-all duration-300 ${bgClass} ${textClass} ${scaleClass} ${zIndex}`}
                                      >
                                          {cellVal}
                                      </div>
                                  )
                              })
                          ))}
                      </div>

                      {/* Legend */}
                      {selectedApproachId === 'optimalO1' && !isSuccess && (
                          <div className="flex gap-4 mt-8 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-50 border border-slate-300"></div> Marker Region</div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 border border-slate-300"></div> Active Marker</div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-100 border border-slate-300"></div> Matrix Zero</div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">MATRIX MODIFIED</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Zeroes cascaded successfully</span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl shadow-inner mt-2 flex flex-col items-center max-w-[280px] sm:max-w-md max-h-[150px] overflow-y-auto scrollbar-thin">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2 sticky top-0 bg-slate-50 w-full text-center pb-1">Final Output Matrix</span>
                                  <div className="flex flex-col gap-1 font-mono text-sm font-bold text-slate-700">
                                      {matrix.map((row: number[], i: number) => (
                                          <div key={i}>[{row.join(', ')}]</div>
                                      ))}
                                  </div>
                              </div>
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
                <Grid3X3 className="text-cyan-600"/> The In-Place Marker Trick
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-cyan-100 pl-6">
                To achieve O(1) space, we cannot allocate new arrays to remember which rows and columns have zeroes. Instead, we must store this information <em>inside the matrix itself</em>. We choose the first row and the first column to act as our memory.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowRightLeft size={18}/> Projecting Zeroes
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            When we traverse the interior of the matrix (ignoring the first row/col), if we see a <code>0</code> at <code>matrix[i][j]</code>, we "project" it to our markers.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            We set <code>matrix[i][0] = 0</code> to remember that Row i needs to be zeroed later. <br/><br/>
                            We set <code>matrix[0][j] = 0</code> to remember that Col j needs to be zeroed later.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <AlertCircle size={18}/> The Overwrite Problem
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            By using the first row and column as memory, we are overwriting their original values! How do we know if they originally contained a <code>0</code> themselves?
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-amber-200">
                            Before we do any projecting, we must perform a quick check. We scan the first row and set a boolean <code>firstRowZero = true</code> if it has a 0. We do the same for the first column. We hold onto these two booleans until the very end of the algorithm.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Database size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-cyan-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Applying the Memory</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Once all zeros are projected, we iterate through the interior of the matrix one more time.
                        </p>
                        <div className="bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           if (matrix[i][0] == 0 || matrix[0][j] == 0) &#123;<br/>
                           &nbsp;&nbsp;&nbsp;&nbsp;matrix[i][j] = 0;<br/>
                           &#125;
                        </div>
                        <p className="text-cyan-400 font-bold mt-2">
                            For every cell <code>(i, j)</code>, we check its corresponding markers at <code>(i, 0)</code> and <code>(0, j)</code>. If either is <code>0</code>, we crush the current cell to <code>0</code>. Finally, we look at our saved booleans and crush the first row/col if needed.
                        </p>
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
                        "While a naive approach might use an O(M*N) duplicate matrix, and a better approach uses O(M+N) tracker arrays, the optimal solution requires strict O(1) auxiliary space. To achieve this, I used the first row and first column of the input matrix as in-place state arrays to mark which rows and columns need to be zeroed. To prevent losing the initial state of these first row/col markers, I explicitly checked and stored their status in two boolean variables before beginning the main traversal."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not just set 0s immediately?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                If you traverse the matrix and set a row to 0 immediately upon seeing a 0, you corrupt the data. When you reach the next element in that same row, it is now a 0, and your algorithm will mistakenly think it needs to zero out THAT element's column as well. The zeroes will exponentially spread and destroy the entire matrix. This is why we need a 2-pass approach (mark, then apply).
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M * N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We iterate through the entire matrix twice. O(2 * M * N) simplifies to O(M * N).</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We mutate the input matrix directly and only use two primitive boolean variables (`firstRowZero`, `firstColZero`), achieving constant extra space.</p>
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

const VariableCard = ({ label, val, color, active, isBool }: { label: string, val: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet' | 'rose', active: boolean, isBool?: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className={`text-xl font-black font-mono leading-none ${isBool ? 'text-base' : ''}`}>
                 {val !== null ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' | 'blue' }> = ({ num, code, active, theme = 'cyan' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|char|List|Integer|Set|HashSet|Math|Arrays|false|true)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'false', 'true'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SetMatrixZeroesVisualizer;