import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowRight, Database, ListOrdered, Zap, ArrowLeftRight, Timer,
  Grid3X3, Flag, Bot, Plus
} from 'lucide-react';

const APPROACHES = {
  dynamicProgramming: {
    id: 'dynamicProgramming',
    title: '1. Dynamic Programming',
    subtitle: 'Standard: O(m × n) Time & Space.',
    icon: <Grid3X3 size={16} />,
    complexity: 'Time: O(M × N) | Space: O(M × N)',
    code: `class Solution {
    public int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // Base condition: Top row or left column
                if (i == 0 || j == 0) {
                    dp[i][j] = 1;
                } 
                // Transition: Paths from top + paths from left
                else {
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
                }
            }
        }
        
        return dp[m - 1][n - 1];
    }
}`,
    explanation: "Dynamic Programming breaks this grid problem into overlapping subproblems. If you want to reach cell (i, j), you MUST have come from exactly two possible places: the cell directly above it (i-1, j), or the cell directly to its left (i, j-1). Therefore, the total unique paths to reach (i, j) is simply the sum of the paths to reach its top and left neighbors. We initialize the top row and left column with 1, because you can only travel in straight lines to reach them."
  },
  combinatorics: {
    id: 'combinatorics',
    title: '2. Combinatorics (Math)',
    subtitle: 'Optimal: O(m) Time, O(1) Space.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(min(M, N)) | Space: O(1)',
    code: `class Solution {
    public int uniquePaths(int m, int n) {
        // Total steps to take is (m - 1) + (n - 1)
        int N = m + n - 2;
        // We need to choose (m - 1) down steps (or n - 1 right steps)
        int r = m - 1; 
        
        double res = 1;
        
        // Calculate nCr: N! / (r! * (N - r)!)
        for (int i = 1; i <= r; i++) {
            res = res * (N - r + i) / i;
        }
        
        return (int)res;
    }
}`,
    explanation: "This problem is secretly a permutation/combination problem. To go from top-left (0,0) to bottom-right (m-1, n-1), you must take exactly (m-1) steps DOWN and (n-1) steps RIGHT. The total number of steps is ALWAYS (m+n-2). The sequence of steps is just a string of D's and R's. The number of unique paths is exactly the number of ways to choose where the 'D's go in that sequence, which is the binomial coefficient: (m+n-2) Choose (m-1)."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">62. Unique Paths</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          There is a robot on an <code>m x n</code> grid. The robot is initially located at the <strong>top-left corner</strong> (i.e., <code>grid[0][0]</code>). The robot tries to move to the <strong>bottom-right corner</strong> (i.e., <code>grid[m - 1][n - 1]</code>).
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          The robot can only move either down or right at any point in time.
        </p>

        <p className="text-lg leading-relaxed">
          Given the two integers <code>m</code> and <code>n</code>, return <em>the number of possible unique paths that the robot can take to reach the bottom-right corner</em>.
        </p>
        
        <p className="text-sm leading-relaxed text-slate-500 italic">
          The test cases are generated so that the answer will be less than or equal to <code>2 * 10<sup>9</sup></code>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-3">
              <img src="https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png" alt="robot maze" className="w-[400px] max-w-full rounded shadow-sm border border-slate-200 mb-2 bg-white" />
              <p><span className="text-slate-400 font-bold">Input:</span> m = 3, n = 7</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 28</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> m = 3, n = 2</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 3</p>
              <div className="text-slate-500 italic mt-2 text-xs space-y-1">
                 <p><span className="font-bold text-slate-400 font-sans normal-case text-sm">Explanation:</span> From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:</p>
                 <p>1. Right -&gt; Down -&gt; Down</p>
                 <p>2. Down -&gt; Down -&gt; Right</p>
                 <p>3. Down -&gt; Right -&gt; Down</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= m, n &lt;= 100</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const UniquePathsVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('dynamicProgramming');
  const [mInput, setMInput] = useState('3');
  const [nInput, setNInput] = useState('5');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let m = parseInt(mInput.trim());
    let n = parseInt(nInput.trim());
    if (isNaN(m) || m < 1) m = 1;
    if (isNaN(n) || n < 1) n = 1;
    
    // Safety caps for visualization to prevent massive grids destroying UI
    if (m > 8) m = 8;
    if (n > 8) n = 8;

    return { m, n };
  }, [mInput, nInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { m, n } = parsedData;
    
    const cloneGrid = (grid) => grid.map(row => [...row]);

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return;
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'dynamicProgramming') {
        let dp = Array(m).fill(null).map(() => Array(n).fill(null));
        
        addStep("Initialization", `Start algorithm. Create a ${m}x${n} DP grid initialized to empty.`, 3, { dp: cloneGrid(dp), r: null, c: null, action: 'init' });
        
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                addStep("Loop Check", `Visiting cell (${i}, ${j}). Check if it's in the top row or left column.`, 7, { dp: cloneGrid(dp), r: i, c: j, action: 'visiting' });
                
                if (i === 0 || j === 0) {
                    dp[i][j] = 1;
                    addStep("Base Case", `Line 8: (i == 0 || j == 0) is true.\nYou can only reach cells on the top edge by moving right, and cells on the left edge by moving down. There is exactly 1 way.`, 8, { dp: cloneGrid(dp), r: i, c: j, action: 'base' });
                } else {
                    addStep("State Transition Prep", `Line 12: Look at the cell above (${i-1}, ${j}) and to the left (${i}, ${j-1}).`, 12, { dp: cloneGrid(dp), r: i, c: j, action: 'looking' });
                    
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
                    addStep("Add Paths", `Line 12: dp[${i}][${j}] = dp[${i-1}][${j}] + dp[${i}][${j-1}]\n= ${dp[i-1][j]} + ${dp[i][j-1]} = ${dp[i][j]}`, 12, { dp: cloneGrid(dp), r: i, c: j, action: 'add' });
                }
            }
        }
        
        addStep("Return Result", `Line 17: Return dp[${m-1}][${n-1}], which contains the total unique paths.`, 17, { dp: cloneGrid(dp), r: m-1, c: n-1, action: 'success', isSuccess: true, ans: dp[m-1][n-1] });
        
    } else if (selectedApproachId === 'combinatorics') {
        let N = m + n - 2;
        let r = m - 1;
        
        addStep("Initialization", `Calculate N (total steps) and r (down steps).`, 3, { N: null, r: null, res: null });
        addStep("Set N", `Line 4: int N = m + n - 2 = ${m} + ${n} - 2 = ${N}.`, 4, { N, r: null, res: null });
        addStep("Set r", `Line 6: int r = m - 1 = ${m} - 1 = ${r}.`, 6, { N, r, res: null });
        
        let res = 1;
        addStep("Init Result", `Line 8: double res = 1;`, 8, { N, r, res, i: null });
        
        for (let i = 1; i <= r; i++) {
            addStep("Loop Iteration", `Line 11: i = ${i}. Calculate multiplier.`, 11, { N, r, res, i });
            
            let oldRes = res;
            res = res * (N - r + i) / i;
            addStep("Multiply & Divide", `Line 12: res = res * (N - r + i) / i\n= ${oldRes} * (${N} - ${r} + ${i}) / ${i}\n= ${res}`, 12, { N, r, res, i, oldRes, action: 'math' });
        }
        
        addStep("Loop End", `Line 11: Loop completes.`, 11, { N, r, res, i: r+1 });
        addStep("Return Result", `Line 15: Return final combination count.`, 15, { N, r, res, isSuccess: true, ans: res });
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
  const { isSuccess, dp, r, c, action, N, r: mathR, res, i: mathI, ans } = state;
  const { m, n } = parsedData;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Grid3X3 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Unique Paths</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 62</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Dynamic Programming / Matrix</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="violet" />
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'dynamicProgramming' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Row (m)" val={m} color="sky" active={true} />
                            <VariableCard label="Col (n)" val={n} color="purple" active={true} />
                            <VariableCard label="curr R (i)" val={r ?? null} color="rose" active={r !== null && r !== undefined} />
                            <VariableCard label="curr C (j)" val={c ?? null} color="emerald" active={c !== null && c !== undefined} />
                        </div>
                    ) : (
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Total Steps (N)" val={N ?? null} color="sky" active={N !== null} />
                            <VariableCard label="Downs (r)" val={mathR ?? null} color="purple" active={mathR !== null} />
                            <VariableCard label="Loop (i)" val={mathI ?? null} color="rose" active={mathI !== null} />
                            <VariableCard label="Combinations" val={res !== null ? res : null} color="emerald" active={res !== null} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Rows (m)</label>
                        <input type="number" value={mInput} onChange={(e) => { setMInput(e.target.value); setCurrentStep(0); }} min="1" max="8" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="3" />
                    </div>
                    
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Cols (n)</label>
                        <input type="number" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} min="1" max="8" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="7" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Grid3X3 size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center justify-center w-full h-full relative z-10 gap-8">
                      
                      {selectedApproachId === 'dynamicProgramming' && dp ? (
                          <>
                              {/* Grid Container */}
                              <div 
                                className="grid gap-2 p-2 bg-slate-100 border border-slate-200 rounded-2xl shadow-inner mx-auto"
                                style={{ 
                                    gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                                    gridTemplateRows: `repeat(${m}, minmax(0, 1fr))`,
                                }}
                              >
                                  {dp.map((row, i) => 
                                      row.map((cellVal, j) => {
                                          let isCurrent = (r === i && c === j) && !isSuccess;
                                          let isTopSrc = action === 'looking' || action === 'add' ? (r - 1 === i && c === j) : false;
                                          let isLeftSrc = action === 'looking' || action === 'add' ? (r === i && c - 1 === j) : false;
                                          let isUnvisited = cellVal === null;
                                          let isStart = i === 0 && j === 0;
                                          let isEnd = i === m - 1 && j === n - 1;

                                          let baseClasses = "relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl border-2 font-mono font-black text-sm sm:text-base md:text-lg transition-all duration-300 ";
                                          
                                          if (isCurrent && action === 'base') baseClasses += "bg-emerald-100 border-emerald-400 text-emerald-800 scale-110 shadow-lg z-20";
                                          else if (isCurrent) baseClasses += "bg-violet-100 border-violet-500 text-violet-900 scale-110 shadow-lg z-20";
                                          else if (isTopSrc) baseClasses += "bg-sky-50 border-sky-400 text-sky-800 z-10 scale-105 shadow-md border-dashed";
                                          else if (isLeftSrc) baseClasses += "bg-rose-50 border-rose-400 text-rose-800 z-10 scale-105 shadow-md border-dashed";
                                          else if (isUnvisited) baseClasses += "bg-white/50 border-slate-200 text-transparent border-dashed";
                                          else baseClasses += "bg-white border-slate-300 text-slate-700 shadow-sm";

                                          return (
                                              <div key={`${i}-${j}`} className={baseClasses}>
                                                  {cellVal !== null ? cellVal : ''}
                                                  
                                                  {isStart && <Bot size={16} className={`absolute -top-3 -left-3 ${isUnvisited ? 'text-slate-400' : 'text-violet-600'} bg-white rounded-full p-0.5 border shadow-sm`} />}
                                                  {isEnd && <Flag size={16} className="absolute -bottom-3 -right-3 text-emerald-600 bg-white rounded-full p-0.5 border shadow-sm" />}
                                                  
                                                  {/* Connecting Arrows for sources */}
                                                  {isTopSrc && (
                                                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
                                                          <ArrowDown size={18} strokeWidth={3} className="text-sky-500" />
                                                      </div>
                                                  )}
                                                  {isLeftSrc && (
                                                      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-30 animate-bounce">
                                                          <ArrowRight size={18} strokeWidth={3} className="text-rose-500" />
                                                      </div>
                                                  )}
                                              </div>
                                          )
                                      })
                                  )}
                              </div>

                              {/* Equation Visualization */}
                              {action === 'add' && (
                                  <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-lg animate-in slide-in-from-bottom-4 flex items-center gap-4 text-xl md:text-2xl font-mono font-black absolute bottom-6">
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] uppercase text-slate-400 mb-1 tracking-widest">dp[{r-1}][{c}]</span>
                                          <span className="text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">{dp[r-1][c]}</span>
                                      </div>
                                      <Plus size={24} className="text-slate-300" />
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] uppercase text-slate-400 mb-1 tracking-widest">dp[{r}][{c-1}]</span>
                                          <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">{dp[r][c-1]}</span>
                                      </div>
                                      <span className="text-slate-300 mx-2">=</span>
                                      <div className="flex flex-col items-center">
                                          <span className="text-[10px] uppercase text-violet-400 mb-1 tracking-widest">dp[{r}][{c}]</span>
                                          <span className="text-violet-700 bg-violet-100 px-4 py-1 rounded-xl border-2 border-violet-400 shadow-sm">{dp[r][c]}</span>
                                      </div>
                                  </div>
                              )}
                          </>
                      ) : (
                          /* Math Visualization */
                          <div className="flex flex-col items-center gap-8 w-full">
                              <div className="text-center space-y-2 mb-4">
                                  <div className="text-slate-500 font-mono text-sm">Total Steps: <span className="text-violet-600 font-bold">{m+n-2}</span></div>
                                  <div className="text-slate-500 font-mono text-sm">Down Steps Needed: <span className="text-rose-600 font-bold">{m-1}</span></div>
                                  <div className="text-2xl font-black font-mono text-slate-800 mt-2">
                                      C({m+n-2}, {m-1})
                                  </div>
                              </div>
                              
                              {action === 'math' && (
                                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl animate-in zoom-in-95 flex flex-col items-center">
                                      <span className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest font-mono">Iteration {mathI}</span>
                                      <div className="flex items-center gap-4 text-2xl md:text-4xl font-mono font-black">
                                          <span className="text-slate-400">{state.oldRes}</span>
                                          <span className="text-slate-300">×</span>
                                          <span className="text-sky-600">{N - mathR + mathI}</span>
                                          <span className="text-slate-300">/</span>
                                          <span className="text-rose-600">{mathI}</span>
                                          <span className="text-slate-300">=</span>
                                          <span className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border-2 border-emerald-400">{res}</span>
                                      </div>
                                  </div>
                              )}
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">PATHS CALCULATED</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 block">Found {ans} Unique Paths</span>
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
                <Grid3X3 className="text-violet-600"/> 2D Dynamic Programming
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Many grid-based traversal problems can be elegantly solved using Dynamic Programming. The core intuition is that the solution for a complex problem (reaching the bottom right) can be built from the solutions of its immediate sub-problems (reaching the cells right next to it).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> State & Transition
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            <strong>State:</strong> Let <code>dp[i][j]</code> be the number of unique paths from <code>(0,0)</code> to <code>(i,j)</code>.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            <strong>Transition:</strong> How can you possibly land on <code>(i, j)</code>? The problem states you can ONLY move right or down. <br/><br/>
                            Therefore, to land on <code>(i, j)</code>, your very last step MUST have been a move DOWN from <code>(i-1, j)</code>, OR a move RIGHT from <code>(i, j-1)</code>.<br/><br/>
                            Total paths to <code>(i, j)</code> = Paths to <code>(i-1, j)</code> + Paths to <code>(i, j-1)</code>.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> Base Cases
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            The recursive transition equation needs a starting point. What are the edges of our grid?
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner">
                            <strong>Top Row (i = 0):</strong> You can only reach any cell in the top row by continually moving RIGHT. There is exactly 1 way. So, <code>dp[0][j] = 1</code>.<br/><br/>
                            <strong>Left Column (j = 0):</strong> You can only reach any cell in the left column by continually moving DOWN. There is exactly 1 way. So, <code>dp[i][0] = 1</code>.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ArrowLeftRight size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The Hidden Math (Pascal's Triangle)</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           If you tilt the DP grid 45 degrees, you might notice something fascinating: The numbers generated are exactly the numbers in <strong>Pascal's Triangle</strong>!
                        </p>
                        <p>
                           Because <code>dp[i][j] = dp[i-1][j] + dp[i][j-1]</code> is the exact same recurrence relation used to generate Pascal's Triangle (where each number is the sum of the two directly above it). This is why the Combinatorics approach $O(m)$ works so beautifully. 
                        </p>
                        <p>
                            Finding the number of paths is identical to finding the binomial coefficient $\binom{m+n-2}{m-1}$.
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
                        "I solved this using bottom-up Dynamic Programming. Since the robot can only move right and down, the number of unique paths to any cell `(i, j)` is simply the sum of the paths to the cell directly above it and the cell directly to its left. By initializing the top row and left column to 1, I iterate through the `m x n` grid filling out the states, ensuring an optimal $O(M \times N)$ time complexity. I could also optimize the space complexity to $O(N)$ by only storing the previous row, instead of the entire 2D matrix."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Space Optimization to O(N)?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Notice that to calculate <code>dp[i][j]</code>, we only ever look at <code>dp[i-1][j]</code> (the cell directly above in the <strong>previous row</strong>) and <code>dp[i][j-1]</code> (the cell to the left in the <strong>current row</strong>). We don't need the whole matrix! We can just use a 1D array <code>dp[n]</code> where we continuously update the values. <code>dp[j] = dp[j] + dp[j-1]</code>. This drops space from $O(M \times N)$ to $O(N)$.
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
                                <p className="text-[10px] text-slate-500 mt-1">We must visit every single cell in the $M \times N$ grid exactly once to calculate its path value.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M × N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The standard DP approach utilizes a 2D matrix of size $M \times N$. As mentioned, this can be optimized to $O(N)$ using a 1D array.</p>
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
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
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

const CodeLineRenderer: React.FC<{ num: number; code: string; active: boolean; theme?: string }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|Stack|dp|m|n)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'continue', 'break'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'Stack'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['dp'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default UniquePathsVisualizer;