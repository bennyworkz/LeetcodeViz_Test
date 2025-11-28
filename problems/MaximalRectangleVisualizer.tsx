import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Grid2X2, Maximize, 
  ArrowRight, XSquare, CheckSquare, FastForward, Trello
} from 'lucide-react';

const APPROACHES = {
  dp: {
    id: 'dp',
    title: 'Dynamic Programming',
    subtitle: 'Optimal: O(M×N) Time, O(N) Space.',
    icon: <Grid2X2 size={16} />,
    complexity: 'Time: O(M × N) | Space: O(N)',
    code: `class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix == null || matrix.length == 0) return 0;
        
        int m = matrix.length;
        int n = matrix[0].length;
        
        int[] left = new int[n];
        int[] right = new int[n];
        int[] height = new int[n];
        
        Arrays.fill(right, n);
        int maxArea = 0;
        
        for (int i = 0; i < m; i++) {
            int curLeft = 0, curRight = n;
            
            // 1. Update height & left boundaries
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == '1') {
                    height[j]++;
                    left[j] = Math.max(left[j], curLeft);
                } else {
                    height[j] = 0;
                    left[j] = 0;
                    curLeft = j + 1;
                }
            }
            
            // 2. Update right boundaries
            for (int j = n - 1; j >= 0; j--) {
                if (matrix[i][j] == '1') {
                    right[j] = Math.min(right[j], curRight);
                } else {
                    right[j] = n;
                    curRight = j;
                }
            }
            
            // 3. Calculate max area for current row
            for (int j = 0; j < n; j++) {
                maxArea = Math.max(maxArea, (right[j] - left[j]) * height[j]);
            }
        }
        
        return maxArea;
    }
}`,
    explanation: "We can compute the maximum rectangle area by sweeping through the matrix row by row. We maintain three 1D arrays of size N (columns). \n\n`height[j]` records the number of continuous '1's ending at row `i`, forming a histogram.\n`left[j]` records the left-most boundary index of the current histogram bar. If we see a '0', the boundary resets to `j+1` for the next cells.\n`right[j]` records the right-most boundary index of the current histogram bar. If we see a '0', the boundary resets to `j` for the preceding cells.\n\nAt each cell `(i, j)`, the maximum rectangle ending there has area `(right[j] - left[j]) * height[j]`. Because we reuse these 1D arrays across rows, the space complexity is strictly O(N) while executing in O(M × N) time."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">85. Maximal Rectangle</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a <code>rows x cols</code> binary <code>matrix</code> filled with <code>0</code>'s and <code>1</code>'s, find the largest rectangle containing only <code>1</code>'s and return <em>its area</em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex flex-col opacity-90 text-lg leading-tight font-black w-max mx-auto border-4 border-slate-300 p-2 bg-white">
                  <div className="flex gap-2"><span className="text-slate-800">1</span><span className="text-slate-300">0</span><span className="text-slate-800">1</span><span className="text-slate-300">0</span><span className="text-slate-300">0</span></div>
                  <div className="flex gap-2"><span className="text-slate-800">1</span><span className="text-slate-300">0</span><span className="text-emerald-500 bg-emerald-100 px-1 rounded">1</span><span className="text-emerald-500 bg-emerald-100 px-1 rounded">1</span><span className="text-emerald-500 bg-emerald-100 px-1 rounded">1</span></div>
                  <div className="flex gap-2"><span className="text-slate-800">1</span><span className="text-slate-800">1</span><span className="text-emerald-500 bg-emerald-100 px-1 rounded">1</span><span className="text-emerald-500 bg-emerald-100 px-1 rounded">1</span><span className="text-emerald-500 bg-emerald-100 px-1 rounded">1</span></div>
                  <div className="flex gap-2"><span className="text-slate-800">1</span><span className="text-slate-300">0</span><span className="text-slate-300">0</span><span className="text-slate-800">1</span><span className="text-slate-300">0</span></div>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 6</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The maximal rectangle is shown above.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> matrix = [["0"]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 0</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> matrix = [["1"]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>rows == matrix.length</code></li>
              <li><code>cols == matrix[i].length</code></li>
              <li><code>1 &lt;= row, cols &lt;= 200</code></li>
              <li><code>matrix[i][j]</code> is <code>'0'</code> or <code>'1'</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const MaximalRectangleVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('dp');
  
  const defaultMatrix = "10100\n10111\n11111\n10010";
  const [matrixInput, setMatrixInput] = useState(defaultMatrix);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let rows = matrixInput.trim().split('\n');
    let matrix = [];
    
    for (let r of rows) {
        let cleaned = r.replace(/[^01]/g, '');
        if (cleaned.length > 0) {
            matrix.push(cleaned.split(''));
        }
    }
    
    if (matrix.length === 0) matrix = [["1"]];
    
    // Normalize column lengths
    let maxCols = 0;
    for (let r of matrix) maxCols = Math.max(maxCols, r.length);
    
    for (let i = 0; i < matrix.length; i++) {
        while (matrix[i].length < maxCols) matrix[i].push("0");
    }

    // UI Caps
    if (matrix.length > 8) matrix = matrix.slice(0, 8);
    for (let i=0; i<matrix.length; i++) {
        if(matrix[i].length > 8) matrix[i] = matrix[i].slice(0, 8);
    }

    return { matrix, m: matrix.length, n: matrix[0].length };
  }, [matrixInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { matrix, m, n } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 3000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    let left = new Array(n).fill(0);
    let right = new Array(n).fill(n);
    let height = new Array(n).fill(0);
    let maxArea = 0;
    let bestRect = null;

    addStep(
        "Initialization", 
        `Line 8-12: Initialize DP arrays.\n\nleft = [0...0]\nright = [${n}...${n}]\nheight = [0...0]\nmaxArea = 0`, 
        12, 
        { matrix, left: [...left], right: [...right], height: [...height], maxArea, bestRect, i: null, j: null, action: 'init' }
    );

    for (let i = 0; i < m; i++) {
        let curLeft = 0;
        let curRight = n;

        addStep(
            "Row Start", 
            `Line 14-15: for (int i = ${i}; ...)\n\nStarting processing for row ${i}. Resetting boundaries:\ncurLeft = 0\ncurRight = ${n}`, 
            15, 
            { matrix, left: [...left], right: [...right], height: [...height], maxArea, bestRect, i, j: null, curLeft, curRight, action: 'rowStart' }
        );

        // Height & Left pass
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === '1') {
                height[j]++;
                left[j] = Math.max(left[j], curLeft);
                addStep(
                    "Update Height & Left (1)", 
                    `Line 19-21: cell [${i}][${j}] == '1'\n\nheight[${j}] increments to ${height[j]}.\nleft[${j}] = Math.max(${left[j]}, curLeft ${curLeft}) = ${Math.max(left[j], curLeft)}.`, 
                    21, 
                    { matrix, left: [...left], right: [...right], height: [...height], maxArea, bestRect, i, j, curLeft, curRight, action: 'calcLeft' }
                );
            } else {
                height[j] = 0;
                left[j] = 0;
                curLeft = j + 1;
                addStep(
                    "Update Height & Left (0)", 
                    `Line 22-25: cell [${i}][${j}] == '0'\n\nHistogram breaks! height[${j}] = 0. left[${j}] = 0.\ncurLeft is pushed right to ${j + 1}.`, 
                    25, 
                    { matrix, left: [...left], right: [...right], height: [...height], maxArea, bestRect, i, j, curLeft, curRight, action: 'calcLeft' }
                );
            }
        }

        // Right pass
        for (let j = n - 1; j >= 0; j--) {
            if (matrix[i][j] === '1') {
                right[j] = Math.min(right[j], curRight);
                addStep(
                    "Update Right (1)", 
                    `Line 30-31: cell [${i}][${j}] == '1'\n\nright[${j}] = Math.min(${right[j]}, curRight ${curRight}) = ${Math.min(right[j], curRight)}.`, 
                    31, 
                    { matrix, left: [...left], right: [...right], height: [...height], maxArea, bestRect, i, j, curLeft, curRight, action: 'calcRight' }
                );
            } else {
                right[j] = n;
                curRight = j;
                addStep(
                    "Update Right (0)", 
                    `Line 32-34: cell [${i}][${j}] == '0'\n\nright[${j}] resets to ${n}.\ncurRight is pulled left to ${j}.`, 
                    34, 
                    { matrix, left: [...left], right: [...right], height: [...height], maxArea, bestRect, i, j, curLeft, curRight, action: 'calcRight' }
                );
            }
        }

        // Area pass
        for (let j = 0; j < n; j++) {
            let width = right[j] - left[j];
            let area = width * height[j];
            
            let isNewMax = area > maxArea;
            if (isNewMax) {
                maxArea = area;
                bestRect = {
                    r1: i - height[j] + 1,
                    c1: left[j],
                    r2: i,
                    c2: right[j] - 1
                };
            }

            addStep(
                "Calculate Area", 
                `Line 39: maxArea = Math.max(...)\n\nAt cell [${i}][${j}], width is right[${j}] - left[${j}] = ${right[j]} - ${left[j]} = ${width}.\nHeight is ${height[j]}.\nArea = ${width} * ${height[j]} = ${area}.\n${isNewMax ? `New Max Area! (${maxArea})` : `Max stays ${maxArea}.`}`, 
                39, 
                { matrix, left: [...left], right: [...right], height: [...height], maxArea, bestRect: bestRect ? {...bestRect} : null, i, j, curLeft, curRight, action: isNewMax ? 'newMax' : 'calcArea' }
            );
        }
    }

    addStep(
        "Algorithm Complete", 
        `Line 43: return maxArea;\n\nProcessed all rows. The maximum rectangle area found is ${maxArea}.`, 
        43, 
        { matrix, left: [...left], right: [...right], height: [...height], maxArea, bestRect: bestRect ? {...bestRect} : null, i: null, j: null, action: 'success', isSuccess: true, ans: maxArea }
    );

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedData, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || {};
  const { isSuccess, ans, action, matrix, left, right, height, maxArea, bestRect, i: currI, j: currJ, curLeft, curRight } = state;
  const { m, n } = parsedData;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Maximize className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Maximal Rectangle</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 85</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Dynamic Programming / Matrices</span>
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
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-violet-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-violet-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'newMax' ? 'bg-amber-500/20 border-amber-500' : (action.includes('calc') ? 'bg-sky-500/20 border-sky-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'newMax' ? 'amber' : (action.includes('calc') ? 'sky' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Dynamic State</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <VariableCard label="Row (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Col (j)" val={currJ !== null && currJ !== undefined ? currJ : "-"} color="purple" active={currJ !== null && currJ !== undefined} />
                        <VariableCard label="maxArea" val={maxArea !== null && maxArea !== undefined ? maxArea : "-"} color="emerald" active={maxArea !== null && maxArea !== undefined} />
                        <VariableCard label="curLeft" val={curLeft !== null && curLeft !== undefined ? curLeft : "-"} color="amber" active={curLeft !== null && curLeft !== undefined} />
                        <VariableCard label="curRight" val={curRight !== null && curRight !== undefined ? curRight : "-"} color="amber" active={curRight !== null && curRight !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start shrink-0">
                    <div className="flex-[3] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Matrix (0 and 1)</label>
                        <textarea 
                            value={matrixInput} 
                            onChange={(e) => { setMatrixInput(e.target.value); setCurrentStep(0); }} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner font-bold text-slate-700 min-h-[100px] resize-none whitespace-pre" 
                            rows={4}
                            wrap="off"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto self-end pb-1">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'newMax' ? 'bg-amber-900 border-amber-800' : (action.includes('calc') ? 'bg-sky-900 border-sky-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'newMax' ? <Maximize size={100}/> : (action.includes('calc') ? <Grid2X2 size={100}/> : <Activity size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'newMax' ? 'text-amber-400' : (action.includes('calc') ? 'text-sky-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'newMax' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : (action.includes('calc') ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[140px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[500px] items-center justify-start pt-12">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-8 overflow-y-auto overflow-x-hidden">
                      
                      {/* Matrix Rendering */}
                      {matrix && (
                          <div className="flex flex-col items-center w-max mx-auto relative">
                              
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-2 flex items-center gap-2"><Trello size={14}/> Matrix & Best Rectangle</span>
                              
                              <div className="bg-slate-800 p-2 rounded-xl shadow-xl border-4 border-slate-700 relative">
                                  
                                  {/* Render the actual Best Rect overlay if it exists */}
                                  {bestRect && (
                                      <div 
                                         className="absolute border-4 border-emerald-400 bg-emerald-400/20 pointer-events-none transition-all duration-500 z-30"
                                         style={{
                                             top: `${(bestRect.r1 * 40) + 8}px`, // 40px cell height + 8px padding
                                             left: `${(bestRect.c1 * 40) + 8}px`,
                                             height: `${(bestRect.r2 - bestRect.r1 + 1) * 40}px`,
                                             width: `${(bestRect.c2 - bestRect.c1 + 1) * 40}px`,
                                         }}
                                      ></div>
                                  )}

                                  <div className="flex flex-col gap-0 border-2 border-slate-900 bg-slate-900">
                                      {matrix.map((rowArr, i) => {
                                          let isCurrentRow = currI === i && !isSuccess;
                                          return (
                                              <div key={`m-row-${i}`} className="flex gap-0 relative">
                                                  {isCurrentRow && (
                                                      <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-sky-400 animate-in slide-in-from-left z-40">
                                                          <ArrowRight size={20} strokeWidth={3}/>
                                                      </div>
                                                  )}

                                                  {rowArr.map((cellVal, j) => {
                                                      let isCurrentCell = isCurrentRow && currJ === j;
                                                      let isInBestRect = bestRect && i >= bestRect.r1 && i <= bestRect.r2 && j >= bestRect.c1 && j <= bestRect.c2;
                                                      
                                                      let cellClass = "w-10 h-10 flex items-center justify-center font-mono font-black text-lg border border-slate-700 transition-all duration-300 relative ";
                                                      
                                                      if (isCurrentCell) {
                                                          cellClass += "bg-sky-400 text-slate-900 z-20 scale-110 shadow-lg ring-2 ring-sky-300 ";
                                                      } else if (isInBestRect) {
                                                          cellClass += "text-emerald-900 "; // bg is handled by overlay
                                                      } else if (isCurrentRow) {
                                                          cellClass += "bg-slate-700 text-white z-10 ";
                                                      } else {
                                                          cellClass += cellVal === '1' ? "bg-slate-200 text-slate-800" : "bg-slate-900 text-slate-500";
                                                      }

                                                      return (
                                                          <div key={`m-cell-${i}-${j}`} className={cellClass}>
                                                              {cellVal}
                                                          </div>
                                                      )
                                                  })}
                                              </div>
                                          )
                                      })}
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* 1D State Arrays for Current Row */}
                      {!isSuccess && height && left && right && (
                          <div className="flex flex-col gap-4 w-full max-w-lg mt-4 animate-in slide-in-from-bottom-8">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono border-b border-slate-200 pb-2">Row {currI} DP Arrays</span>
                              
                              <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                                  <span className="font-mono text-[10px] font-black uppercase text-purple-600">Height</span>
                                  <div className="flex gap-1 overflow-x-auto pb-1">
                                      {height.map((val, j) => (
                                          <div key={`h-${j}`} className={`w-8 h-8 flex items-center justify-center border-2 rounded font-mono font-bold text-sm shrink-0 transition-all ${currJ === j && action === 'calcLeft' ? 'bg-purple-100 border-purple-500 text-purple-900 scale-110 shadow-sm z-10' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{val}</div>
                                      ))}
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                                  <span className="font-mono text-[10px] font-black uppercase text-sky-600">Left</span>
                                  <div className="flex gap-1 overflow-x-auto pb-1">
                                      {left.map((val, j) => (
                                          <div key={`l-${j}`} className={`w-8 h-8 flex items-center justify-center border-2 rounded font-mono font-bold text-sm shrink-0 transition-all ${currJ === j && action === 'calcLeft' ? 'bg-sky-100 border-sky-500 text-sky-900 scale-110 shadow-sm z-10' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{val}</div>
                                      ))}
                                  </div>
                              </div>

                              <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                                  <span className="font-mono text-[10px] font-black uppercase text-amber-600">Right</span>
                                  <div className="flex gap-1 overflow-x-auto pb-1">
                                      {right.map((val, j) => (
                                          <div key={`r-${j}`} className={`w-8 h-8 flex items-center justify-center border-2 rounded font-mono font-bold text-sm shrink-0 transition-all ${currJ === j && action === 'calcRight' ? 'bg-amber-100 border-amber-500 text-amber-900 scale-110 shadow-sm z-10' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{val}</div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SWEEP COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Maximal Rectangle Area is {ans}
                              </span>
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
                <Grid2X2 className="text-violet-600"/> 1D DP Array Sweep
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Instead of searching all possible sub-matrices (which is $O(N^4)$ brute force), we can solve this optimally by treating each row as the base of a histogram and calculating the maximum area using 1D Dynamic Programming arrays.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowUp size={18}/> 1. The Height Array
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            <code>height[j]</code> counts how many consecutive '1's exist in column <code>j</code>, ending at the current row.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>If <code>matrix[i][j] == '1'</code>, then <code>height[j]++</code>.</p>
                            <p>If <code>matrix[i][j] == '0'</code>, the chain is broken, so <code>height[j] = 0</code>.</p>
                            <p>This effectively converts the 2D matrix into a 1D histogram that grows taller row by row.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowRight size={18}/> 2. The Left & Right Arrays
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            <code>left[j]</code> and <code>right[j]</code> track the horizontal boundaries of the histogram bar at column <code>j</code>.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>The boundary is constrained by the current row's '0's (tracked by <code>curLeft</code> / <code>curRight</code>), AND the boundaries of the rows above it!</p>
                            <p>For left: <code>left[j] = max(left[j], curLeft)</code>. We take the maximum to ensure the boundary is as tight as the narrowest part of the pillar.</p>
                            <p>For right: <code>right[j] = min(right[j], curRight)</code>.</p>
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
                        "To solve Maximal Rectangle optimally, I utilized a Dynamic Programming approach that processes the matrix row by row. At each row, I maintain three 1D arrays: `height`, `left`, and `right`. The `height` array acts as a running histogram of consecutive '1's ending at the current cell. The `left` and `right` arrays determine the horizontal boundaries of the rectangle that can be formed using that `height`. By taking the `max` for the left boundary and `min` for the right boundary against the constraints of the current row, the rectangle perfectly tightens around '0' barriers above it. For every cell, the local maximum area is simply `(right[j] - left[j]) * height[j]`. This achieves an optimal $O(M \times N)$ time complexity and requires only $O(N)$ auxiliary space, since we overwrite the 1D arrays for each row."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Monotonic Stack vs DP?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Another popular optimal solution involves converting each row to a histogram and calling the "Largest Rectangle in Histogram" (LC 84) Monotonic Stack subroutine on it. While conceptually identical, the DP approach using <code>left</code> and <code>right</code> arrays is often preferred in interviews because it avoids the overhead of stack manipulation and is purely array-based, making it incredibly fast.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M × N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We loop through the `M` rows. For each row, we run a few passes of size `N`. The work done inside the loops is strictly $O(1)$ constant operations, resulting in an optimal $O(M \times N)$ bounds.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only allocate three integer arrays of size `N` (`height`, `left`, `right`). We do not need an $O(M \times N)$ 2D DP matrix because the states only rely on the immediately preceding row.</p>
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

const VariableCard = ({ label, val, color, active }) => {
    const bgMap = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className={`text-xl font-black font-mono leading-none truncate w-full text-center px-2`}>
                 {val !== null && val !== undefined ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|maximalRectangle|matrix|length|left|right|height|fill|maxArea|curLeft|curRight|max|min)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'break', 'continue'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['maximalRectangle', 'length', 'fill', 'max', 'min'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['matrix', 'left', 'right', 'height', 'curLeft', 'curRight', 'maxArea'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MaximalRectangleVisualizer;