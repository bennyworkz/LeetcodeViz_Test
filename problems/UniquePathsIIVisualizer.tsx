import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Grid2X2, Map, 
  ArrowRight, XSquare, CheckSquare, ShieldAlert, Navigation, Plus
} from 'lucide-react';

const APPROACHES = {
  dp2d: {
    id: 'dp2d',
    title: 'Dynamic Programming (2D)',
    subtitle: 'Optimal: O(M×N) Time, O(M×N) Space.',
    icon: <Grid2X2 size={16} />,
    complexity: 'Time: O(M × N) | Space: O(M × N)',
    code: `class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.length;
        int n = obstacleGrid[0].length;
        
        // If the starting cell has an obstacle, we can't even start
        if (obstacleGrid[0][0] == 1) {
            return 0;
        }
        
        int[][] dp = new int[m][n];
        
        // Base case: There is 1 way to be at the start
        dp[0][0] = 1;
        
        // Fill the DP table
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // If it's an obstacle, 0 paths can go through here
                if (obstacleGrid[i][j] == 1) {
                    dp[i][j] = 0;
                } else {
                    // Skip the start cell since it's already initialized
                    if (i == 0 && j == 0) continue;
                    
                    int pathsFromTop = (i > 0) ? dp[i - 1][j] : 0;
                    int pathsFromLeft = (j > 0) ? dp[i][j - 1] : 0;
                    
                    dp[i][j] = pathsFromTop + pathsFromLeft;
                }
            }
        }
        
        // The bottom-right cell contains the total unique paths
        return dp[m - 1][n - 1];
    }
}`,
    explanation: "This problem asks us to find the number of unique paths to the bottom-right corner, moving only right or down. This perfectly fits the Dynamic Programming pattern. Let `dp[i][j]` be the number of unique paths to reach cell `(i, j)`. Because we can only arrive from above or from the left, the number of ways to reach `(i, j)` is exactly the sum of the ways to reach `(i-1, j)` and `(i, j-1)`. \n\nThe twist here is the obstacles! If `obstacleGrid[i][j] == 1`, a robot cannot pass through it, meaning there are exactly `0` ways to reach or proceed from this cell. We simply set `dp[i][j] = 0` whenever we hit an obstacle. We initialize `dp[0][0] = 1` (unless the start is blocked) and sweep through the matrix. The final answer sits at `dp[m-1][n-1]`."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">63. Unique Paths II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          You are given an <code>m x n</code> integer array <code>obstacleGrid</code>. There is a robot initially located at the <strong>top-left corner</strong> (i.e., <code>obstacleGrid[0][0]</code>). The robot tries to move to the <strong>bottom-right corner</strong> (i.e., <code>obstacleGrid[m - 1][n - 1]</code>).
        </p>

        <p className="text-lg leading-relaxed">
          The robot can only move either down or right at any point in time.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-rose-500 pl-4 bg-rose-50 py-2 mt-4">
          An obstacle and space are marked as <code>1</code> or <code>0</code> respectively in <code>obstacleGrid</code>. A path that the robot takes cannot include <strong>any</strong> square that is an obstacle.
        </p>

        <p className="text-lg leading-relaxed">
          Return <em>the number of possible unique paths that the robot can take to reach the bottom-right corner</em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex flex-col opacity-90 text-lg leading-tight font-black w-max mx-auto border-4 border-slate-300 p-2 bg-white">
                  <div className="flex gap-2"><span className="text-slate-800">0</span><span className="text-slate-800">0</span><span className="text-slate-800">0</span></div>
                  <div className="flex gap-2"><span className="text-slate-800">0</span><span className="text-rose-500 bg-rose-100 px-1 rounded border border-rose-300">1</span><span className="text-slate-800">0</span></div>
                  <div className="flex gap-2"><span className="text-slate-800">0</span><span className="text-slate-800">0</span><span className="text-slate-800">0</span></div>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: There is one obstacle in the middle of the 3x3 grid above.
There are two ways to reach the bottom-right corner:</p>
                 <ul className="list-decimal pl-4 mt-2">
                     <li>Right -&gt; Right -&gt; Down -&gt; Down</li>
                     <li>Down -&gt; Down -&gt; Right -&gt; Right</li>
                 </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> obstacleGrid = [[0,1],[0,0]]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>m == obstacleGrid.length</code></li>
              <li><code>n == obstacleGrid[i].length</code></li>
              <li><code>1 &lt;= m, n &lt;= 100</code></li>
              <li><code>obstacleGrid[i][j]</code> is <code>0</code> or <code>1</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const UniquePathsIIVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('dp2d');
  
  const defaultGrid = "0 0 0\n0 1 0\n0 0 0";
  const [gridInput, setGridInput] = useState(defaultGrid);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let rows = gridInput.trim().split('\n');
    let matrix = [];
    
    for (let r of rows) {
        let parts = r.trim().split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        if (parts.length > 0) {
            matrix.push(parts.map(x => x === 1 ? 1 : 0)); // force 0 or 1
        }
    }
    
    if (matrix.length === 0) matrix = [[0,0,0],[0,1,0],[0,0,0]];
    
    let m = matrix.length;
    let n = Math.max(...matrix.map(r => r.length));
    
    // Normalize and cap for UI safety
    m = Math.min(m, 8);
    n = Math.min(n, 8);
    
    let normalized = [];
    for (let i = 0; i < m; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            row.push(matrix[i] && matrix[i][j] !== undefined ? matrix[i][j] : 0);
        }
        normalized.push(row);
    }

    return { grid: normalized, m, n };
  }, [gridInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { grid, m, n } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    const copyDP = (arr) => arr.map(row => [...row]);

    let dp = Array.from({length: m}, () => new Array(n).fill(0));

    addStep(
        "Initialization", 
        `Line 10: int[][] dp = new int[m][n];\n\nInitialize DP table of size ${m}x${n} with 0s. m=${m}, n=${n}.`, 
        10, 
        { grid, dp: copyDP(dp), i: null, j: null, action: 'init' }
    );

    addStep(
        "Check Start Obstacle", 
        `Line 6: if (obstacleGrid[0][0] == 1)\n\nIs there an obstacle at the very starting cell?`, 
        6, 
        { grid, dp: copyDP(dp), i: 0, j: 0, action: 'evalStart' }
    );

    if (grid[0][0] === 1) {
        addStep(
            "Start Blocked", 
            `Line 7: return 0;\n\nThe robot is blocked from the very start. No paths possible!`, 
            7, 
            { grid, dp: copyDP(dp), i: 0, j: 0, action: 'startBlocked', isSuccess: true, ans: 0 }
        );
        return steps;
    }

    dp[0][0] = 1;
    addStep(
        "Base Case Set", 
        `Line 13: dp[0][0] = 1;\n\nThe start cell is clear. There is exactly 1 way to be at the starting point.`, 
        13, 
        { grid, dp: copyDP(dp), i: 0, j: 0, action: 'baseCase' }
    );

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            
            addStep(
                "Evaluate Cell", 
                `Line 16: for (int i = ${i}; ...) for (int j = ${j}; ...)\n\nLooking at cell [${i}][${j}].`, 
                16, 
                { grid, dp: copyDP(dp), i, j, action: 'evalCell' }
            );

            if (grid[i][j] === 1) {
                dp[i][j] = 0;
                addStep(
                    "Obstacle Found", 
                    `Line 18-19: if (obstacleGrid[i][j] == 1) dp[i][j] = 0;\n\nCell [${i}][${j}] is a rock! The robot cannot enter here. Set paths to 0.`, 
                    19, 
                    { grid, dp: copyDP(dp), i, j, action: 'obstacle' }
                );
            } else {
                if (i === 0 && j === 0) {
                    addStep(
                        "Skip Start", 
                        `Line 22: if (i == 0 && j == 0) continue;\n\nStart cell is already processed.`, 
                        22, 
                        { grid, dp: copyDP(dp), i, j, action: 'skipStart' }
                    );
                    continue;
                }

                let pathsFromTop = i > 0 ? dp[i - 1][j] : 0;
                let pathsFromLeft = j > 0 ? dp[i][j - 1] : 0;
                
                dp[i][j] = pathsFromTop + pathsFromLeft;

                let topDesc = i > 0 ? `dp[${i-1}][${j}] (${pathsFromTop})` : `0 (out of bounds)`;
                let leftDesc = j > 0 ? `dp[${i}][${j-1}] (${pathsFromLeft})` : `0 (out of bounds)`;

                addStep(
                    "Calculate Paths", 
                    `Line 24-27: dp[i][j] = pathsFromTop + pathsFromLeft;\n\nPaths from Top: ${topDesc}\nPaths from Left: ${leftDesc}\nTotal ways to reach [${i}][${j}] = ${pathsFromTop} + ${pathsFromLeft} = ${dp[i][j]}.`, 
                    27, 
                    { grid, dp: copyDP(dp), i, j, action: 'calc', pathsFromTop, pathsFromLeft }
                );
            }
        }
    }

    let finalAns = dp[m - 1][n - 1];
    addStep(
        "Return Target Cell", 
        `Line 32: return dp[m - 1][n - 1];\n\nSweeping complete. The bottom-right cell contains the total number of unique valid paths: ${finalAns}.`, 
        32, 
        { grid, dp: copyDP(dp), i: m - 1, j: n - 1, action: 'success', isSuccess: true, ans: finalAns }
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
  const { isSuccess, ans, action, grid, dp, i: currI, j: currJ, pathsFromTop, pathsFromLeft } = state;
  const { m, n } = parsedData;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Map className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Unique Paths II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 63</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'obstacle' || action === 'startBlocked' ? 'bg-rose-500/20 border-rose-500' : (action === 'calc' ? 'bg-sky-500/20 border-sky-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'obstacle' || action === 'startBlocked' ? 'rose' : (action === 'calc' ? 'sky' : 'violet')} />
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Row (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Col (j)" val={currJ !== null && currJ !== undefined ? currJ : "-"} color="purple" active={currJ !== null && currJ !== undefined} />
                        <VariableCard label="Cell dp[i][j]" val={dp && currI !== null && currJ !== null && dp[currI] ? dp[currI][currJ] : "-"} color="emerald" active={dp !== undefined && currI !== null && currJ !== null} />
                        <VariableCard label="Target (m,n)" val={`${m-1},${n-1}`} color="slate" active={true} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start shrink-0">
                    <div className="flex-[3] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono flex items-center justify-between">
                            <span>obstacleGrid (0: space, 1: rock)</span>
                        </label>
                        <textarea 
                            value={gridInput} 
                            onChange={(e) => { setGridInput(e.target.value); setCurrentStep(0); }} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700 min-h-[100px] resize-none whitespace-pre" 
                            rows={3}
                            wrap="off"
                            placeholder="0 0 0&#10;0 1 0&#10;0 0 0"
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'obstacle' || action === 'startBlocked' ? 'bg-rose-900 border-rose-800' : (action === 'calc' ? 'bg-sky-900 border-sky-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'obstacle' || action === 'startBlocked' ? <ShieldAlert size={100}/> : (action === 'calc' ? <Plus size={100}/> : <Navigation size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'obstacle' || action === 'startBlocked' ? 'text-rose-400' : (action === 'calc' ? 'text-sky-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'obstacle' || action === 'startBlocked' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action === 'calc' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                      
                      {/* Grid Rendering */}
                      {grid && dp && (
                          <div className="flex flex-col items-center w-max mx-auto relative mt-4">
                              
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-2 flex items-center gap-2"><Map size={14}/> DP Array (Paths) & Grid</span>
                              
                              <div className="bg-slate-800 p-3 rounded-xl shadow-xl border-4 border-slate-700 relative mt-2">
                                  
                                  <div className="flex flex-col gap-0 border-2 border-slate-900 bg-slate-900 relative">
                                      {grid.map((rowArr, i) => {
                                          return (
                                              <div key={`m-row-${i}`} className="flex gap-0 relative">
                                                  {rowArr.map((cellVal, j) => {
                                                      let isCurrentCell = currI === i && currJ === j && !isSuccess;
                                                      let isObstacle = cellVal === 1;
                                                      let isStart = i === 0 && j === 0;
                                                      let isTarget = i === m - 1 && j === n - 1;
                                                      
                                                      // Dependencies for current cell calculation
                                                      let isTopDep = action === 'calc' && currI - 1 === i && currJ === j;
                                                      let isLeftDep = action === 'calc' && currI === i && currJ - 1 === j;
                                                      
                                                      let isProcessed = false;
                                                      if (currI !== null && currJ !== null) {
                                                          if (i < currI || (i === currI && j < currJ)) isProcessed = true;
                                                      } else if (isSuccess) {
                                                          isProcessed = true;
                                                      }

                                                      let cellClass = "w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center font-mono font-black text-lg border border-slate-700 transition-all duration-300 relative ";
                                                      
                                                      let valDisplay = "-";

                                                      if (isCurrentCell) {
                                                          if (action === 'obstacle') {
                                                              cellClass += "bg-rose-400 text-rose-900 z-20 scale-110 shadow-lg ring-2 ring-rose-300 ";
                                                              valDisplay = "0";
                                                          } else if (action === 'calc' || action === 'baseCase') {
                                                              cellClass += "bg-sky-400 text-slate-900 z-20 scale-110 shadow-lg ring-2 ring-sky-300 ";
                                                              valDisplay = dp[i][j];
                                                          } else {
                                                              cellClass += "bg-violet-300 text-violet-900 z-20 scale-110 shadow-lg ring-2 ring-violet-300 ";
                                                          }
                                                      } else if (isTopDep || isLeftDep) {
                                                          cellClass += "bg-sky-100 border-sky-400 text-sky-800 z-10 ";
                                                          valDisplay = dp[i][j];
                                                      } else if (isObstacle) {
                                                          cellClass += "bg-slate-700 text-slate-900 opacity-80 ";
                                                          valDisplay = "X"; // rock
                                                      } else if (isProcessed || isSuccess) {
                                                          cellClass += "bg-emerald-50 text-emerald-700 ";
                                                          valDisplay = dp[i][j];
                                                      } else {
                                                          cellClass += "bg-slate-100 text-slate-300";
                                                      }

                                                      if (isSuccess && isTarget) {
                                                          cellClass += "bg-emerald-400 border-emerald-500 text-emerald-900 scale-110 z-20 ring-4 ring-emerald-200 ";
                                                          valDisplay = dp[i][j];
                                                      }

                                                      return (
                                                          <div key={`m-cell-${i}-${j}`} className={cellClass}>
                                                              {isObstacle && !isCurrentCell ? <XSquare size={24} className="text-slate-500" strokeWidth={3}/> : valDisplay}
                                                              
                                                              {/* Labels for Start/End */}
                                                              {isStart && !isObstacle && <span className="absolute -top-4 text-[8px] text-emerald-500 uppercase tracking-widest bg-emerald-50 px-1 border border-emerald-200 rounded">Start</span>}
                                                              {isTarget && !isObstacle && !isSuccess && <span className="absolute -bottom-4 text-[8px] text-amber-500 uppercase tracking-widest bg-amber-50 px-1 border border-amber-200 rounded">End</span>}
                                                              
                                                              {/* Animation Arrows */}
                                                              {isTopDep && <ArrowDown className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-sky-500 z-50 animate-pulse" size={20} strokeWidth={4} />}
                                                              {isLeftDep && <ArrowRight className="absolute -right-5 top-1/2 -translate-y-1/2 text-sky-500 z-50 animate-pulse" size={20} strokeWidth={4} />}
                                                          </div>
                                                      )
                                                  })}
                                              </div>
                                          )
                                      })}
                                  </div>
                              </div>
                              
                              {/* Math Calculation Center Box for Calc Step */}
                              {!isSuccess && action === 'calc' && (
                                  <div className="absolute -bottom-24 bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col gap-2 shadow-xl w-max animate-in slide-in-from-top-4 z-50">
                                     <div className="text-[10px] text-slate-400 uppercase font-black text-center mb-1">dp[{currI}][{currJ}] Calculation</div>
                                     <div className={`flex items-center justify-between gap-4 font-mono text-xl font-black`}>
                                         <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] text-slate-400 leading-none mb-1">Top</span>
                                                <span className="bg-sky-100 text-sky-800 border border-sky-300 px-3 py-1 rounded shadow-sm">{pathsFromTop}</span>
                                            </div>
                                            <Plus size={18} className="text-slate-400 mt-3" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] text-slate-400 leading-none mb-1">Left</span>
                                                <span className="bg-sky-100 text-sky-800 border border-sky-300 px-3 py-1 rounded shadow-sm">{pathsFromLeft}</span>
                                            </div>
                                         </div>
                                         <div className="flex items-center gap-3 mt-3">
                                            <span className="text-slate-400">=</span>
                                            <span className="bg-emerald-100 text-emerald-800 border-2 border-emerald-400 px-4 py-1 rounded shadow-sm">{dp[currI][currJ]}</span>
                                         </div>
                                     </div>
                                  </div>
                              )}

                          </div>
                      )}
                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">COMPUTATION COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  {ans} Unique Paths Found
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
                <Grid2X2 className="text-violet-600"/> 2D Dynamic Programming
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                The problem requires finding the <strong>number of paths</strong> in a grid moving only right and down. This strict movement constraint guarantees that we can build the solution incrementally using Dynamic Programming without worrying about cycles.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Navigation size={18}/> State Transition
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Let <code>dp[i][j]</code> represent the number of unique paths to reach the cell at row <code>i</code> and column <code>j</code>.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>Because the robot can only move DOWN or RIGHT, a cell <code>(i, j)</code> can only be entered from exactly two previous cells: <code>(i-1, j)</code> (from above) or <code>(i, j-1)</code> (from the left).</p>
                            <p>Therefore, the fundamental DP equation is:<br/><code>dp[i][j] = dp[i-1][j] + dp[i][j-1]</code></p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ShieldAlert size={18}/> Handling Obstacles
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Obstacles block paths and act as broken links in the DP accumulation chain.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>If <code>obstacleGrid[i][j] == 1</code>, the robot cannot step on it. Thus, the number of ways to reach this cell is zero.</p>
                            <p>We simply set <code>dp[i][j] = 0</code>.</p>
                            <p>This gracefully ripples forward: any cell to the right or bottom of this obstacle will receive a <code>0</code> from it during their own additions!</p>
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
                        "I solved this using a 2D Dynamic Programming bottom-up approach. Let `dp[i][j]` be the number of paths to cell `(i, j)`. Since movement is strictly right and down, the subproblem relation is straightforward: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`. I allocate an $M \times N$ matrix and initialize `dp[0][0] = 1`. Then I iterate through the grid. If the current cell in the original `obstacleGrid` is `1` (an obstacle), I set `dp[i][j] = 0`, as it's impassable. Otherwise, I add the paths from the valid adjacent cells above and to the left. The final answer rests at `dp[m-1][n-1]`. This achieves an optimal $O(M \times N)$ time complexity because we process each cell exactly once."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we optimize the space to O(N)?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Yes! Because computing the current row only requires values from the <em>current</em> row (left cell) and the <em>immediately previous</em> row (top cell), we do not need the full 2D matrix. We can maintain a single 1D array `dp` of size `N`. As we iterate through rows, we update `dp[j] = dp[j] + dp[j-1]`. This drops the space complexity from $O(M \times N)$ down to $O(N)$.
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
                                <p className="text-[10px] text-slate-500 mt-1">We utilize a nested `for` loop to touch every cell in the grid exactly once, performing constant $O(1)$ additions and bounds checks.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M × N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">In this standard implementation, we allocate an $M \times N$ integer array for the DP table. (Can be optimized to $O(N)$ with a 1D array state).</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|uniquePathsWithObstacles|obstacleGrid|length|dp|pathsFromTop|pathsFromLeft)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['uniquePathsWithObstacles', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['obstacleGrid', 'dp', 'pathsFromTop', 'pathsFromLeft'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default UniquePathsIIVisualizer;