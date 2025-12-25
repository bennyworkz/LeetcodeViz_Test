import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, LayoutList, DivideSquare, 
  ShieldAlert, ArrowRight, Grid2X2, ArrowRightCircle, ArrowDownCircle,
  CornerLeftUp, GitMerge
} from 'lucide-react';

const APPROACHES = {
  dp2d: {
    id: 'dp2d',
    title: '2D Dynamic Programming',
    subtitle: 'Classic: O(M×N) Time, O(M×N) Space.',
    icon: <Grid2X2 size={16} />,
    complexity: 'Time: O(M × N) | Space: O(M × N)',
    code: `class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        int[][] dp = new int[m][n];
        
        dp[0][0] = grid[0][0]; // Base case: starting cell
        
        // Initialize first row (can only come from the left)
        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j - 1] + grid[0][j];
        }
        
        // Initialize first column (can only come from above)
        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i - 1][0] + grid[i][0];
        }
        
        // Fill the rest of the DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                // The min path sum to current cell is its value + 
                // the minimum of the cell above or the cell to the left
                dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        
        return dp[m - 1][n - 1]; // Bottom-right corner
    }
}`,
    explanation: "This classic approach uses a separate 2D `dp` array of the exact same size as the `grid`. `dp[i][j]` stores the minimum sum required to reach cell `(i, j)` from the start `(0, 0)`. Because we can only move Down or Right, reaching the first row only happens by moving Right, and the first column by moving Down. We initialize those edges directly. For every other cell, the shortest path must come from either the cell directly above it (`dp[i-1][j]`) or directly to its left (`dp[i][j-1]`). We take the minimum of those two adjacent cells and add the current cell's value. The final answer sits at the bottom-right of the DP table."
  },
  inPlace: {
    id: 'inPlace',
    title: 'In-Place Modification',
    subtitle: 'Optimal: O(M×N) Time, O(1) Space.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(M × N) | Space: O(1)',
    code: `class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 && j == 0) {
                    continue; // Skip the starting cell
                } else if (i == 0) {
                    // First row: accumulate from the left
                    grid[i][j] += grid[i][j - 1];
                } else if (j == 0) {
                    // First column: accumulate from above
                    grid[i][j] += grid[i - 1][j];
                } else {
                    // General case: take the min of top or left, add to current
                    grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
                }
            }
        }
        
        return grid[m - 1][n - 1];
    }
}`,
    explanation: "If we are allowed to modify the input `grid`, we can achieve a highly optimal $O(1)$ space complexity! Instead of creating a new `dp` table, we simply overwrite the `grid` values with the accumulating path sums as we traverse it. The logic is identical: the first row accumulates horizontally, the first column accumulates vertically, and all other cells take their original value plus the minimum of the newly accumulated values in the cells above and to the left. By the end of the traversal, the bottom-right cell contains the globally minimum path sum."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">64. Minimum Path Sum</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a <code>m x n</code> <code>grid</code> filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          <strong>Note:</strong> You can only move either down or right at any point in time.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> grid = [[1,3,1],[1,5,1],[4,2,1]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 7</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: Because the path 1 → 3 → 1 → 1 → 1 minimizes the sum.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> grid = [[1,2,3],[4,5,6]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 12</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>m == grid.length</code></li>
              <li><code>n == grid[i].length</code></li>
              <li><code>1 &lt;= m, n &lt;= 200</code></li>
              <li><code>0 &lt;= grid[i][j] &lt;= 200</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const MinimumPathSumVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('dp2d');
  const [gridInput, setGridInput] = useState('1,3,1\n1,5,1\n4,2,1');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let rows = gridInput.trim().split('\n');
    let matrix = [];
    for (let r of rows) {
        let cols = r.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (cols.length > 0) matrix.push(cols);
    }
    
    // Fallback if completely invalid
    if (matrix.length === 0 || matrix[0].length === 0) {
        matrix = [[1,3,1],[1,5,1],[4,2,1]];
    }

    // Standardize column lengths (pad with 0s if uneven for robustness)
    let maxCols = Math.max(...matrix.map(row => row.length));
    for (let r of matrix) {
        while (r.length < maxCols) r.push(0);
    }

    // UI Safeguard to prevent freezing
    if (matrix.length > 6) matrix = matrix.slice(0, 6);
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].length > 6) matrix[i] = matrix[i].slice(0, 6);
    }

    return { grid: matrix };
  }, [gridInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { grid } = parsedData;
    const m = grid.length;
    const n = grid[0].length;

    const cloneMatrix = (matrix) => matrix.map(row => [...row]);

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'dp2d') {
        
        let dp = Array(m).fill(0).map(() => Array(n).fill(null));
        
        addStep(
            "Initialization", 
            `Line 3-5: int m = ${m}, n = ${n};\nint[][] dp = new int[${m}][${n}];\n\nCreate a DP matrix the exact same size as the input grid to store the minimum sum to reach each coordinate.`, 
            5, 
            { dp: cloneMatrix(dp), i: null, j: null, action: 'init' }
        );

        dp[0][0] = grid[0][0];
        addStep(
            "Base Case (Origin)", 
            `Line 7: dp[0][0] = grid[0][0];\n\nThe cost to reach the starting cell is just its own value (${grid[0][0]}).`, 
            7, 
            { dp: cloneMatrix(dp), i: 0, j: 0, action: 'baseOrigin' }
        );

        addStep(
            "Initialize First Row", 
            `Line 10: for (int j = 1; j < n; j++)\n\nBecause you can only move Right or Down, any cell in the very first row can ONLY be reached by continuously moving Right. We accumulate the sum from left to right.`, 
            10, 
            { dp: cloneMatrix(dp), i: 0, j: null, action: 'loopRow1' }
        );

        for (let j = 1; j < n; j++) {
            dp[0][j] = dp[0][j - 1] + grid[0][j];
            addStep(
                "Accumulate Row", 
                `Line 11: dp[0][${j}] = dp[0][${j - 1}] + grid[0][${j}];\n\nAccumulating path cost: ${dp[0][j - 1]} + ${grid[0][j]} = ${dp[0][j]}.`, 
                11, 
                { dp: cloneMatrix(dp), i: 0, j, action: 'calcRow1', leftVal: dp[0][j-1], currVal: grid[0][j] }
            );
        }

        addStep(
            "Initialize First Column", 
            `Line 15: for (int i = 1; i < m; i++)\n\nSimilarly, any cell in the very first column can ONLY be reached by continuously moving Down. We accumulate the sum from top to bottom.`, 
            15, 
            { dp: cloneMatrix(dp), i: null, j: 0, action: 'loopCol1' }
        );

        for (let i = 1; i < m; i++) {
            dp[i][0] = dp[i - 1][0] + grid[i][0];
            addStep(
                "Accumulate Column", 
                `Line 16: dp[${i}][0] = dp[${i - 1}][0] + grid[${i}][0];\n\nAccumulating path cost: ${dp[i - 1][0]} + ${grid[i][0]} = ${dp[i][0]}.`, 
                16, 
                { dp: cloneMatrix(dp), i, j: 0, action: 'calcCol1', topVal: dp[i-1][0], currVal: grid[i][0] }
            );
        }

        addStep(
            "Process Inner Grid", 
            `Line 20-21: for (int i = 1...) for (int j = 1...)\n\nWe now process the inner grid. For any inner cell, we could have reached it either from the cell directly above it, or the cell directly to its left. We want to choose the cheaper path!`, 
            20, 
            { dp: cloneMatrix(dp), i: null, j: null, action: 'loopInner' }
        );

        for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
                
                let topCost = dp[i - 1][j];
                let leftCost = dp[i][j - 1];
                let cellVal = grid[i][j];
                
                addStep(
                    "Evaluate Adjacent Costs", 
                    `Line 24: Math.min(dp[${i - 1}][${j}], dp[${i}][${j - 1}])\n\nEvaluating cell [${i}][${j}] (value ${cellVal}). \nCost from Top: ${topCost}.\nCost from Left: ${leftCost}.`, 
                    24, 
                    { dp: cloneMatrix(dp), i, j, action: 'evalInner', topVal: topCost, leftVal: leftCost, currVal: cellVal }
                );

                let minCost = Math.min(topCost, leftCost);
                dp[i][j] = cellVal + minCost;

                addStep(
                    "Calculate Minimum Path Sum", 
                    `Line 24: dp[${i}][${j}] = ${cellVal} + Math.min(${topCost}, ${leftCost})\n\nTaking the minimum path (${minCost}) and adding the current cell's value (${cellVal}) = ${dp[i][j]}.`, 
                    24, 
                    { dp: cloneMatrix(dp), i, j, action: 'calcInner', topVal: topCost, leftVal: leftCost, currVal: cellVal, minCost }
                );
            }
        }

        addStep(
            "Return Target Coordinate", 
            `Line 28: return dp[${m - 1}][${n - 1}];\n\nThe DP matrix is fully built. The globally optimal path sum to the bottom-right corner is ${dp[m-1][n-1]}.`, 
            28, 
            { dp: cloneMatrix(dp), i: m - 1, j: n - 1, action: 'success', isSuccess: true, ans: dp[m-1][n-1] }
        );

    } else if (selectedApproachId === 'inPlace') {
        
        // Deep copy grid so we can mutate it for the trace visually
        let dp = cloneMatrix(grid);

        addStep(
            "Initialization (In-Place)", 
            `Line 3-4: int m = ${m}, n = ${n};\n\nWe will traverse and modify the input grid directly, using it as our dynamic programming memory space to achieve O(1) auxiliary space.`, 
            4, 
            { dp: cloneMatrix(dp), i: null, j: null, action: 'init' }
        );

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                
                addStep(
                    "Iterate Grid", 
                    `Line 6-7: for (int i = ${i}...) for (int j = ${j}...)\n\nProcessing cell [${i}][${j}]. Original value: ${dp[i][j]}.`, 
                    7, 
                    { dp: cloneMatrix(dp), i, j, action: 'loop' }
                );

                if (i === 0 && j === 0) {
                    addStep(
                        "Skip Origin", 
                        `Line 8-9: if (i == 0 && j == 0) continue;\n\nThe origin cell requires no accumulation. Skip.`, 
                        9, 
                        { dp: cloneMatrix(dp), i, j, action: 'skipOrigin' }
                    );
                    continue;
                } 
                
                if (i === 0) {
                    let prevVal = dp[0][j-1];
                    let currVal = dp[0][j];
                    dp[0][j] += dp[0][j - 1];
                    addStep(
                        "Accumulate Row", 
                        `Line 11-12: else if (i == 0) grid[0][${j}] += grid[0][${j - 1}];\n\nFirst row can only come from the left. Adding ${prevVal} to ${currVal} = ${dp[0][j]}.`, 
                        12, 
                        { dp: cloneMatrix(dp), i, j, action: 'calcRow1', leftVal: prevVal, currVal }
                    );
                } else if (j === 0) {
                    let prevVal = dp[i-1][0];
                    let currVal = dp[i][0];
                    dp[i][0] += dp[i - 1][0];
                    addStep(
                        "Accumulate Column", 
                        `Line 14-15: else if (j == 0) grid[${i}][0] += grid[${i - 1}][0];\n\nFirst column can only come from the top. Adding ${prevVal} to ${currVal} = ${dp[i][0]}.`, 
                        15, 
                        { dp: cloneMatrix(dp), i, j, action: 'calcCol1', topVal: prevVal, currVal }
                    );
                } else {
                    let topCost = dp[i - 1][j];
                    let leftCost = dp[i][j - 1];
                    let currVal = dp[i][j];
                    
                    addStep(
                        "Evaluate Adjacent Costs", 
                        `Line 17: Math.min(grid[${i - 1}][${j}], grid[${i}][${j - 1}])\n\nEvaluating inner cell. \nCost from Top: ${topCost}.\nCost from Left: ${leftCost}.`, 
                        17, 
                        { dp: cloneMatrix(dp), i, j, action: 'evalInner', topVal: topCost, leftVal: leftCost, currVal }
                    );

                    let minCost = Math.min(topCost, leftCost);
                    dp[i][j] += minCost;

                    addStep(
                        "Add Minimum to Current", 
                        `Line 18: grid[${i}][${j}] += Math.min(${topCost}, ${leftCost});\n\nTaking the minimum path (${minCost}) and merging it into current cell (${currVal}) = ${dp[i][j]}.`, 
                        18, 
                        { dp: cloneMatrix(dp), i, j, action: 'calcInner', topVal: topCost, leftVal: leftCost, currVal, minCost }
                    );
                }
            }
        }

        addStep(
            "Return Target Coordinate", 
            `Line 23: return grid[${m - 1}][${n - 1}];\n\nThe original grid has been completely mutated into a DP matrix. The globally optimal path sum is ${dp[m-1][n-1]}.`, 
            23, 
            { dp: cloneMatrix(dp), i: m - 1, j: n - 1, action: 'success', isSuccess: true, ans: dp[m-1][n-1] }
        );
    }

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
  const { isSuccess, ans, action, dp, i: currI, j: currJ, leftVal, topVal, currVal, minCost } = state;
  const { grid } = parsedData;

  const m = grid.length;
  const n = grid[0].length;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Grid2X2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Minimum Path Sum</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 64</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('calc') || action === 'baseOrigin' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('calc') || action === 'baseOrigin' ? 'amber' : 'violet'} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Coordinates & Data</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Row (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Col (j)" val={currJ !== null && currJ !== undefined ? currJ : "-"} color="purple" active={currJ !== null && currJ !== undefined} />
                        <VariableCard label="Orig. Grid Val" val={currVal !== undefined && currVal !== null ? currVal : "-"} color="slate" active={currVal !== undefined && currVal !== null} />
                        <VariableCard label="New DP Val" val={dp && currI !== null && currJ !== null ? dp[currI][currJ] : "-"} color="emerald" active={dp && currI !== null && currJ !== null && (action.includes('calc') || action === 'baseOrigin')} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Input Grid (Rows by Newline)</label>
                        <textarea 
                            value={gridInput} 
                            onChange={(e) => { setGridInput(e.target.value); setCurrentStep(0); }} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner font-bold text-slate-700 min-h-[60px] resize-none" 
                            placeholder={"1,3,1\n1,5,1\n4,2,1"} 
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-1">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action.includes('calc') || action === 'baseOrigin' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <CornerLeftUp size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action.includes('calc') || action === 'baseOrigin' ? 'text-amber-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('calc') || action === 'baseOrigin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-6 overflow-y-auto overflow-x-auto">
                      
                      {/* Grid Header Info */}
                      <div className="flex items-center gap-2 mb-2 w-full justify-center">
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-2"><Layers size={14}/> {selectedApproachId === 'inPlace' ? 'Mutating Grid in-place' : 'DP Matrix Construction'}</span>
                      </div>

                      {dp && (
                          <div className="relative flex flex-col gap-2">
                              {dp.map((row, i) => (
                                  <div key={`row-${i}`} className="flex items-center gap-2">
                                      {row.map((val, j) => {
                                          
                                          let isTarget = currI === i && currJ === j && !isSuccess;
                                          let isCalculatedTarget = isTarget && (action.includes('calc') || action === 'baseOrigin');
                                          
                                          // Dependencies
                                          let isTopDep = currI !== null && currJ !== null && i === currI - 1 && j === currJ && (action.includes('Col') || action.includes('Inner'));
                                          let isLeftDep = currI !== null && currJ !== null && i === currI && j === currJ - 1 && (action.includes('Row') || action.includes('Inner'));
                                          
                                          let isFinalAns = isSuccess && i === m - 1 && j === n - 1;

                                          let cellClass = "w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center transition-all duration-300 relative border-2 font-mono ";
                                          
                                          if (isFinalAns) {
                                              cellClass += "bg-emerald-500 border-emerald-600 text-white font-black text-2xl shadow-xl z-30 scale-110 rounded-2xl ring-4 ring-emerald-200";
                                          } else if (isCalculatedTarget) {
                                              cellClass += "bg-amber-100 border-amber-500 text-amber-900 font-black text-2xl scale-110 shadow-lg z-30 rounded-2xl ring-4 ring-amber-300/40";
                                          } else if (isTarget) {
                                              cellClass += "bg-sky-100 border-sky-400 text-sky-900 font-black text-xl scale-105 shadow-md z-20 rounded-xl";
                                          } else if (isTopDep) {
                                              cellClass += "bg-indigo-100 border-indigo-400 text-indigo-800 font-bold z-10 rounded-xl";
                                          } else if (isLeftDep) {
                                              cellClass += "bg-purple-100 border-purple-400 text-purple-800 font-bold z-10 rounded-xl";
                                          } else if (val !== null) {
                                              // Already computed DP cells
                                              cellClass += "bg-slate-100 border-slate-300 text-slate-800 font-bold rounded-xl";
                                          } else {
                                              // Uncomputed DP cells
                                              cellClass += "bg-white border-dashed border-slate-300 text-slate-300 rounded-xl opacity-60";
                                          }

                                          let displayVal = val;
                                          if (val === null && selectedApproachId === 'inPlace') {
                                              // In place visually shows original grid if untouched
                                              displayVal = grid[i][j];
                                          }

                                          return (
                                              <div key={`cell-${i}-${j}`} className={cellClass}>
                                                  {displayVal !== null ? displayVal : ""}
                                                  
                                                  {/* Miniature Top-Left label for original grid value in DP approach */}
                                                  {selectedApproachId === 'dp2d' && grid[i] && grid[i][j] !== undefined && val !== null && (
                                                      <span className="absolute top-1 left-1.5 text-[8px] text-slate-400 font-normal">
                                                          {grid[i][j]}
                                                      </span>
                                                  )}

                                                  {/* Dependency Arrows Overlay */}
                                                  {isLeftDep && (action.includes('Row') || action.includes('Inner')) && <ArrowRight className="absolute -right-5 top-1/2 -translate-y-1/2 text-purple-500 z-50" size={20} strokeWidth={4} />}
                                                  {isTopDep && (action.includes('Col') || action.includes('Inner')) && <ArrowDown className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-indigo-500 z-50" size={20} strokeWidth={4} />}
                                                  
                                                  {/* Origin tag */}
                                                  {i === 0 && j === 0 && !isFinalAns && <span className="absolute -top-3 -left-3 text-[8px] font-black bg-slate-800 text-white px-1.5 py-0.5 rounded shadow">Start</span>}
                                                  {i === m - 1 && j === n - 1 && !isFinalAns && <span className="absolute -bottom-3 -right-3 text-[8px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded shadow">End</span>}
                                              </div>
                                          )
                                      })}
                                  </div>
                              ))}
                          </div>
                      )}

                      {/* Explicit Math Equation Block */}
                      {currI !== null && currJ !== null && currVal !== undefined && (action.includes('calc') || action === 'evalInner') && (
                          <div className="w-full flex items-center justify-center mt-6">
                              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm animate-in zoom-in w-max">
                                  
                                  {action.includes('Row') && leftVal !== undefined && (
                                      <div className="flex items-center gap-3 font-mono font-black text-xl">
                                          <span className="text-purple-600 bg-purple-50 px-2 rounded border border-purple-200">{leftVal}</span>
                                          <span className="text-slate-400">+</span>
                                          <span className="text-slate-600 bg-slate-100 px-2 rounded border border-slate-200">{currVal}</span>
                                          <span className="text-slate-400">=</span>
                                          <span className="text-amber-600">{leftVal + currVal}</span>
                                      </div>
                                  )}
                                  
                                  {action.includes('Col') && topVal !== undefined && (
                                      <div className="flex items-center gap-3 font-mono font-black text-xl">
                                          <span className="text-indigo-600 bg-indigo-50 px-2 rounded border border-indigo-200">{topVal}</span>
                                          <span className="text-slate-400">+</span>
                                          <span className="text-slate-600 bg-slate-100 px-2 rounded border border-slate-200">{currVal}</span>
                                          <span className="text-slate-400">=</span>
                                          <span className="text-amber-600">{topVal + currVal}</span>
                                      </div>
                                  )}

                                  {action.includes('Inner') && leftVal !== undefined && topVal !== undefined && (
                                      <div className="flex items-center gap-3 font-mono font-black text-xl flex-wrap justify-center">
                                          <span className="text-slate-600 bg-slate-100 px-2 rounded border border-slate-200">{currVal}</span>
                                          <span className="text-slate-400">+</span>
                                          <span className="text-slate-400 text-base flex items-center gap-1"><GitMerge size={16}/> min(</span>
                                          <span className="text-indigo-600 bg-indigo-50 px-2 rounded border border-indigo-200">{topVal}</span>
                                          <span className="text-slate-300">,</span>
                                          <span className="text-purple-600 bg-purple-50 px-2 rounded border border-purple-200">{leftVal}</span>
                                          <span className="text-slate-400 text-base">)</span>
                                          
                                          {action === 'calcInner' && (
                                              <>
                                                  <span className="text-slate-400 ml-2">=</span>
                                                  <span className="text-amber-600">{currVal + minCost}</span>
                                              </>
                                          )}
                                      </div>
                                  )}

                              </div>
                          </div>
                      )}

                   </div>

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
                <Grid2X2 className="text-violet-600"/> Pathfinding with DP
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Finding the shortest or cheapest path through a grid is a hallmark Dynamic Programming problem. Because you are restricted to moving only <strong>Down</strong> or <strong>Right</strong>, the subproblem dependencies are perfectly rigid and directed.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowRightCircle size={18}/> Edge Dependencies
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Look at the first row and first column. They are unique.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p><strong>First Row:</strong> You can't reach it from above (there is no above). You can ONLY reach these cells by coming from the left. Thus, it's a simple prefix sum array horizontally.</p>
                            <p><strong>First Column:</strong> You can't reach it from the left (there is no left). You can ONLY reach these cells by coming from above. Thus, it's a simple prefix sum array vertically.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <CornerLeftUp size={18}/> The Bellman Equation
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            For any cell not on the top or left edge, how do we find the cheapest path to it?
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We know we MUST enter it either from the cell directly above it, or the cell directly to its left.</p>
                            <p>If we already know the absolute minimum path to reach the cell above, and the minimum path to reach the cell to the left... we just pick whichever is smaller, and add our current cell's cost!</p>
                            <p><code>DP[i][j] = grid[i][j] + min(DP[i-1][j], DP[i][j-1])</code></p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Zap size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">O(1) Space Optimization</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            Why allocate a massive new 2D <code>dp</code> matrix if the original <code>grid</code> is no longer needed after a cell is processed?
                            <br/><br/>
                            We can mutate the input grid directly, using it as our memory!
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-emerald-300 space-y-2">
                            <p className="text-white">// Overwriting the input grid directly:</p>
                            <p>grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);</p>
                            <br/>
                            <p className="text-white">// This drops Space Complexity from O(M*N) to O(1).</p>
                            <p>// However, in production systems, modifying input parameters</p>
                            <p>// is sometimes considered a bad practice ("side effects").</p>
                            <p>// It's good to mention this tradeoff in an interview!</p>
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
                        "This is a fundamental 2D Dynamic Programming problem. Since movement is restricted to 'Down' and 'Right', the state of any cell relies solely on the cell directly above it and the cell directly to its left. To solve this, I first identify the base cases: the top-left origin cell remains its own value, while the first row and first column accumulate strictly from the left and from above, respectively. For all inner cells, I determine the minimum accumulated cost of the top neighbor and the left neighbor, and add it to the current cell's value. To optimize space complexity from $O(M \times N)$ down to $O(1)$, I perform this dynamic accumulation in-place, overwriting the input `grid` directly. Once the nested traversal is complete, the optimal minimum path sum resides in the bottom-right corner."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we do O(N) space without modifying input?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Yes. If you are forbidden from mutating the input <code>grid</code>, you can achieve $O(N)$ space (where N is the number of columns). Since computing the current row only requires data from the current row (left neighbor) and the immediately previous row (top neighbor), you only need to store a single 1D array of size N that updates dynamically as you iterate downwards.
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
                                <p className="text-[10px] text-slate-500 mt-1">We utilize a nested <code>for</code> loop that processes each of the $M \times N$ cells in the grid exactly once. Inside the loop, the operations are constant $O(1)$ math checks.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M × N) or O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The classic approach allocates a separate DP matrix. The In-Place approach uses $O(1)$ extra space by overriding values inside the existing input grid array structure.</p>
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
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|minPathSum|grid|dp|length|min)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['minPathSum', 'length', 'min'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['dp'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['grid'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MinimumPathSumVisualizer;