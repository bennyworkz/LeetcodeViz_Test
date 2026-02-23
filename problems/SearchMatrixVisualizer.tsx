import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Database, ListOrdered, Zap, ArrowLeftRight, Timer,
  Search, Grid3X3, Crosshair, HelpCircle, XCircle
} from 'lucide-react';

const APPROACHES = {
  optimal1D: {
    id: 'optimal1D',
    title: '1. 1D Binary Search',
    subtitle: 'Optimal: O(log(M×N)) Time, O(1) Space.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(log(M×N)) | Space: O(1)',
    code: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        if (matrix == null || matrix.length == 0) return false;
        
        int m = matrix.length;
        int n = matrix[0].length;
        
        int low = 0;
        int high = m * n - 1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            
            // Map 1D index back to 2D coordinates
            int row = mid / n;
            int col = mid % n;
            int midVal = matrix[row][col];
            
            if (midVal == target) {
                return true;
            } else if (midVal < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        return false;
    }
}`,
    explanation: "Because the rows are sorted and the first element of a row is greater than the last element of the previous row, the entire matrix is strictly strictly sorted if we were to flatten it out into a single 1D array. Instead of actually flattening it (which takes O(M×N) memory), we can just pretend it's a 1D array of length M×N. We run standard binary search, and use simple math (mid / cols for row, mid % cols for column) to map the 1D mid index back to the 2D matrix coordinates to read the value."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Brute Force',
    subtitle: 'Naive: O(M×N) Time.',
    icon: <Database size={16} />,
    complexity: 'Time: O(M×N) | Space: O(1)',
    code: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length;
        int n = matrix[0].length;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == target) {
                    return true;
                }
            }
        }
        
        return false;
    }
}`,
    explanation: "The brute force approach completely ignores the sorted properties of the matrix. It simply iterates row by row, column by column, checking every single element to see if it equals the target. While this will successfully find the answer, it takes O(M×N) time, which is highly inefficient for large matrices and fails to utilize the problem's constraints."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">74. Search a 2D Matrix</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          You are given an <code>m x n</code> integer matrix <code>matrix</code> with the following two properties:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium">
            <li>Each row is sorted in non-decreasing order.</li>
            <li>The first integer of each row is greater than the last integer of the previous row.</li>
        </ul>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Given an integer <code>target</code>, return <code>true</code> <em>if</em> <code>target</code> <em>is in</em> <code>matrix</code> <em>or</em> <code>false</code> <em>otherwise</em>.
        </p>
        
        <p className="text-sm leading-relaxed text-slate-500 italic">
          You must write a solution in <code>O(log(m * n))</code> time complexity.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-3">
              <img src="https://assets.leetcode.com/uploads/2020/10/05/mat.jpg" alt="search grid" className="w-[320px] max-w-full rounded shadow-sm border border-slate-200 mb-2 bg-white" />
              <p><span className="text-slate-400 font-bold">Input:</span> matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <img src="https://assets.leetcode.com/uploads/2020/10/05/mat2.jpg" alt="search grid fail" className="w-[320px] max-w-full rounded shadow-sm border border-slate-200 mb-2 bg-white" />
              <p><span className="text-slate-400 font-bold">Input:</span> matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>m == matrix.length</code></li>
              <li><code>n == matrix[i].length</code></li>
              <li><code>1 &lt;= m, n &lt;= 100</code></li>
              <li><code>-10<sup>4</sup> &lt;= matrix[i][j], target &lt;= 10<sup>4</sup></code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SearchMatrixVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('optimal1D');
  const [matrixInput, setMatrixInput] = useState('1, 3, 5, 7 ; 10, 11, 16, 20 ; 23, 30, 34, 60');
  const [targetInput, setTargetInput] = useState('3');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let target = parseInt(targetInput.trim());
    if (isNaN(target)) target = 3;

    // Parse matrix format: row ; row ; row
    let matrix = [];
    try {
        const rows = matrixInput.split(';');
        for (let r of rows) {
            const cols = r.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            if (cols.length > 0) matrix.push(cols);
        }
        // Force uniform columns by taking the min length if they messed up, to avoid crashing
        if (matrix.length > 0) {
            const minCols = Math.min(...matrix.map(r => r.length));
            matrix = matrix.map(r => r.slice(0, minCols));
        }
    } catch (e) {
        matrix = [];
    }
    
    // Fallback if parsing fails or is empty
    if (matrix.length === 0 || matrix[0].length === 0) {
        matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
    }
    
    // Safety cap
    if (matrix.length > 6) matrix = matrix.slice(0, 6);
    if (matrix[0].length > 6) matrix = matrix.map(r => r.slice(0, 6));

    return { matrix, target };
  }, [matrixInput, targetInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { matrix, target } = parsedData;
    const m = matrix.length;
    const n = matrix[0].length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return;
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'optimal1D') {
        let low = 0;
        let high = m * n - 1;
        
        addStep(
            "1. Initialize Boundaries", 
            `We have a ${m}×${n} matrix. We imagine flattening it into a 1D array of length ${m * n} (indices 0 to ${high}).\n\n• Set 'low' = 0 (Start of virtual array)\n• Set 'high' = ${high} (End of virtual array)`, 
            8, 
            { low, high, mid: null, row: null, col: null, midVal: null }
        );
        
        let iter = 0;
        let found = false;

        while (low <= high && iter++ < 50) {
            addStep(
                "2. Binary Search Condition", 
                `Checking the loop condition: 'low' (${low}) <= 'high' (${high}).\n\nThis is TRUE, meaning our search space is valid and we haven't crossed pointers yet. We proceed to look at the middle.`, 
                11, 
                { low, high, mid: null, row: null, col: null, midVal: null }
            );
            
            let mid = low + Math.floor((high - low) / 2);
            addStep(
                "3. Calculate Midpoint", 
                `Find the middle index of our current virtual search space:\nmid = low + (high - low) / 2\n\n• mid = ${low} + (${high} - ${low}) / 2 = ${mid}\n\n(Note: We use this formula instead of (low+high)/2 to prevent integer overflow errors in Java/C++).`, 
                12, 
                { low, high, mid, row: null, col: null, midVal: null }
            );
            
            let row = Math.floor(mid / n);
            let col = mid % n;
            addStep(
                "4. 1D to 2D Math Mapping", 
                `CRITICAL STEP: We must map the virtual 1D 'mid' index (${mid}) back to a physical 2D [row][col] coordinate.\n\n• Row = mid / columns = ${mid} / ${n} = ${row}\n  (Integer division tells us we skipped ${row} full rows)\n• Col = mid % columns = ${mid} % ${n} = ${col}\n  (Modulo tells us we are at offset ${col} in that row)`, 
                15, 
                { low, high, mid, row, col, midVal: null, activeAction: 'mapping' }
            );
            
            let midVal = matrix[row][col];
            addStep(
                "5. Read Matrix Value", 
                `Now we read the actual value from the matrix at our calculated coordinates:\n\nmidVal = matrix[${row}][${col}] = ${midVal}\n\nWe will compare this value (${midVal}) against our target (${target}).`, 
                17, 
                { low, high, mid, row, col, midVal, activeAction: 'evaluating' }
            );
            
            if (midVal === target) {
                addStep(
                    "🎯 Target Found!", 
                    `midVal (${midVal}) == target (${target}) is TRUE.\n\nWe successfully found the target inside the matrix. We can immediately return true and exit the algorithm.`, 
                    19, 
                    { low, high, mid, row, col, midVal, isSuccess: true, found: true }
                );
                found = true;
                break;
            } else if (midVal < target) {
                addStep(
                    "6. Adjust Low (Move Right)", 
                    `The value we found (${midVal}) is LESS than our target (${target}).\n\nBecause the matrix is strictly sorted, the target CANNOT be in the left half of our search space. We discard the entire left half by moving 'low' past 'mid'.\n\n• low = mid + 1 = ${mid + 1}`, 
                    22, 
                    { low, high, mid, row, col, midVal, activeAction: 'movingRight' }
                );
                low = mid + 1;
            } else {
                addStep(
                    "6. Adjust High (Move Left)", 
                    `The value we found (${midVal}) is GREATER than our target (${target}).\n\nBecause the matrix is strictly sorted, the target CANNOT be in the right half of our search space. We discard the entire right half by moving 'high' before 'mid'.\n\n• high = mid - 1 = ${mid - 1}`, 
                    24, 
                    { low, high, mid, row, col, midVal, activeAction: 'movingLeft' }
                );
                high = mid - 1;
            }
        }
        
        if (!found) {
            addStep(
                "❌ Search Space Exhausted", 
                `Loop Condition Failed: 'low' (${low}) > 'high' (${high}).\n\nThe pointers have crossed, meaning we have eliminated every possible position in the matrix. The target ${target} does not exist here. Return false.`, 
                28, 
                { low, high, mid: null, row: null, col: null, midVal: null, isSuccess: true, found: false }
            );
        }
        
    } else if (selectedApproachId === 'bruteForce') {
        addStep(
            "1. Start Brute Force", 
            `We will ignore the sorted properties of the matrix completely. We will iterate row by row, column by column.\n\nLooking for target: ${target}`, 
            6, 
            { r: null, c: null }
        );
        
        let found = false;
        let iter = 0;
        
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (iter++ > 100) break; // safety
                
                addStep(
                    "2. Scan Element", 
                    `Checking current element at matrix[${i}][${j}].\n\nIs ${matrix[i][j]} equal to our target (${target})?`, 
                    8, 
                    { r: i, c: j, checkingVal: matrix[i][j] }
                );
                
                if (matrix[i][j] === target) {
                    addStep(
                        "🎯 Target Found", 
                        `Yes! Target ${target} found at row ${i}, col ${j}.\n\nReturn true.`, 
                        9, 
                        { r: i, c: j, checkingVal: matrix[i][j], isSuccess: true, found: true }
                    );
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        
        if (!found) {
            addStep(
                "❌ Exhausted Matrix", 
                `We have checked every single element in the ${m}×${n} matrix.\n\nThe target ${target} was not found. Return false.`, 
                15, 
                { r: null, c: null, isSuccess: true, found: false }
            );
        }
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
  const { isSuccess, found, low, high, mid, row, col, midVal, activeAction, r, c, checkingVal } = state;
  const { matrix, target } = parsedData;
  const m = matrix.length;
  const n = matrix[0]?.length || 0;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Search className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Search 2D Matrix</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 74</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Arrays / Binary Search</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? (found ? 'bg-emerald-500/20 border-emerald-500' : 'bg-rose-500/20 border-rose-500') : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
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
                    
                    {selectedApproachId === 'optimal1D' ? (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="low" val={low ?? null} color="rose" active={low !== null && low !== undefined} />
                            <VariableCard label="mid" val={mid ?? null} arrVal={midVal !== null && midVal !== undefined ? midVal : null} color="violet" active={mid !== null && mid !== undefined} />
                            <VariableCard label="high" val={high ?? null} color="sky" active={high !== null && high !== undefined} />
                        </div>
                    ) : (
                         <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="Row (i)" val={r ?? null} color="sky" active={r !== null} />
                            <VariableCard label="Col (j)" val={c ?? null} color="indigo" active={c !== null} />
                            <VariableCard label="Current Val" val={checkingVal ?? null} color="violet" active={checkingVal !== null} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Matrix (rows separated by ';')</label>
                        <input type="text" value={matrixInput} onChange={(e) => { setMatrixInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1,3,5,7 ; 10,11,16,20 ; 23,30,34,60" />
                    </div>
                    
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target</label>
                        <input type="number" value={targetInput} onChange={(e) => { setTargetInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="3" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${isSuccess ? (found ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? (found ? <Check size={100}/> : <XCircle size={100}/>) : <Crosshair size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? (found ? "text-emerald-400" : "text-rose-400") : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? (found ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30') : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center justify-center w-full h-full relative z-10 gap-8 pt-4">
                      
                      {/* Matrix Representation */}
                      <div 
                        className="grid gap-2 md:gap-3 p-3 bg-slate-100 border border-slate-200 rounded-3xl shadow-inner mx-auto relative w-max max-w-full overflow-x-auto"
                        style={{ 
                            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                            gridTemplateRows: `repeat(${m}, minmax(0, 1fr))`,
                        }}
                      >
                          {matrix.map((rowArr, i) => 
                              rowArr.map((cellVal, j) => {
                                  let flatIndex = i * n + j;
                                  
                                  let isLow = selectedApproachId === 'optimal1D' && low === flatIndex;
                                  let isHigh = selectedApproachId === 'optimal1D' && high === flatIndex;
                                  let isMid = selectedApproachId === 'optimal1D' && mid === flatIndex;
                                  
                                  let isOutOfRange = selectedApproachId === 'optimal1D' && (low !== undefined && high !== undefined) && (flatIndex < low || flatIndex > high);
                                  
                                  let isCurrentBrute = selectedApproachId === 'bruteForce' && r === i && c === j;

                                  let bgClass = "bg-white";
                                  let borderClass = "border-slate-300";
                                  let textClass = "text-slate-700";
                                  let extra = "shadow-sm";

                                  if (isMid || isCurrentBrute) {
                                      bgClass = "bg-violet-100";
                                      borderClass = "border-violet-500";
                                      textClass = "text-violet-900";
                                      extra = "scale-110 z-20 shadow-lg ring-4 ring-violet-500/20";
                                      
                                      if (isSuccess && found) {
                                          bgClass = "bg-emerald-100"; borderClass = "border-emerald-500"; textClass = "text-emerald-900"; extra = "scale-110 z-30 shadow-xl ring-4 ring-emerald-500/30";
                                      } else if (activeAction === 'movingRight' || activeAction === 'movingLeft') {
                                          bgClass = "bg-rose-50"; borderClass = "border-rose-400"; textClass = "text-rose-800";
                                      }
                                  } else if (isOutOfRange) {
                                      bgClass = "bg-slate-50 opacity-40";
                                      borderClass = "border-slate-200 border-dashed";
                                      textClass = "text-slate-400";
                                      extra = "scale-95";
                                  } else {
                                      bgClass = "bg-white";
                                      borderClass = "border-slate-300";
                                      textClass = "text-slate-800";
                                      if (isLow || isHigh) {
                                          borderClass = isLow ? "border-rose-400" : "border-sky-400";
                                          extra = "shadow-md ring-2 ring-slate-100";
                                      }
                                  }

                                  return (
                                      <div key={`${i}-${j}`} className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 flex flex-col items-center justify-center rounded-2xl border-2 font-mono font-black text-lg sm:text-xl lg:text-2xl transition-all duration-300 ${bgClass} ${borderClass} ${textClass} ${extra}`}>
                                          <span>{cellVal}</span>
                                          
                                          {/* Flat Index Label */}
                                          <div className={`absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-mono tracking-tighter ${isOutOfRange ? 'text-slate-300' : 'text-slate-400'}`}>
                                              {flatIndex}
                                          </div>

                                          {/* Pointers */}
                                          {isLow && !isMid && (
                                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-black text-rose-500 bg-rose-50 px-1 rounded border border-rose-200 tracking-widest">L</div>
                                          )}
                                          {isHigh && !isMid && (
                                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-black text-sky-500 bg-sky-50 px-1 rounded border border-sky-200 tracking-widest">R</div>
                                          )}
                                          {isMid && (
                                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] font-black text-violet-600 bg-violet-50 px-2 rounded-full border border-violet-200 tracking-widest shadow-sm animate-bounce">mid</div>
                                          )}
                                      </div>
                                  )
                              })
                          )}
                      </div>

                      {/* Math Calculation Visualization */}
                      {selectedApproachId === 'optimal1D' && (activeAction === 'mapping' || activeAction === 'evaluating' || activeAction === 'movingLeft' || activeAction === 'movingRight') && (
                          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl animate-in slide-in-from-bottom-4 flex flex-col items-center text-center mt-4">
                              <span className="text-[10px] uppercase text-slate-400 mb-3 tracking-widest font-black font-mono">1D to 2D Math Mapping</span>
                              
                              <div className="flex gap-6 md:gap-10 font-mono items-center">
                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] text-slate-500 font-bold mb-1">Row</span>
                                      <div className="flex items-center gap-2 font-black">
                                          <span className="text-violet-600">{mid}</span> <span className="text-slate-300">/</span> <span className="text-slate-600">{n}</span> <span className="text-slate-300">=</span> <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">{row}</span>
                                      </div>
                                  </div>

                                  <div className="h-8 w-px bg-slate-200"></div>

                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] text-slate-500 font-bold mb-1">Col</span>
                                      <div className="flex items-center gap-2 font-black">
                                          <span className="text-violet-600">{mid}</span> <span className="text-slate-300">%</span> <span className="text-slate-600">{n}</span> <span className="text-slate-300">=</span> <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">{col}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${found ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {found ? <Check size={32} strokeWidth={3}/> : <XCircle size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block ${found ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {found ? `Target ${target} Found at [${row}][${col}]` : `Target ${target} Not Found`}
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
                <Search className="text-violet-600"/> Flattening the Matrix
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                The problem gives us two massive hints: every row is sorted, and the start of a new row is strictly greater than the end of the previous row. This guarantees that if you placed all the rows side-by-side, you would have one giant, perfectly sorted 1D array. Since it's sorted, we can use Binary Search!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> The Virtual 1D Array
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We don't actually create a new array because that would require $O(M \times N)$ extra memory space. Instead, we use a "virtual" array.
                        </p>
                        <ul className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <li><strong>Length:</strong> <code>m * n</code></li>
                            <li><strong>low index:</strong> <code>0</code></li>
                            <li><strong>high index:</strong> <code>(m * n) - 1</code></li>
                        </ul>
                        <p className="text-xs text-sky-800 leading-relaxed mt-4">We calculate <code>mid</code> just like standard binary search: <code>low + (high - low) / 2</code>.</p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> 1D to 2D Mapping Math
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Once we have the 1D <code>mid</code> index, how do we look up its value in the actual 2D <code>matrix[row][col]</code>?
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner">
                            <strong>Row:</strong> <code>mid / cols</code><br/>
                            Integer division tells us how many full rows we have completely bypassed to reach this index.<br/><br/>
                            <strong>Col:</strong> <code>mid % cols</code><br/>
                            The remainder tells us how far along we are inside the current row.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Grid3X3 size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Example Mapping</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Imagine a $3 \times 4$ matrix. It has $12$ elements (indexes 0 to 11).
                        </p>
                        <p>
                           Let's say our 1D binary search calculates <code>mid = 5</code>.<br/>
                           How do we find index 5 in the 2D matrix?
                        </p>
                        <div className="bg-slate-800/80 border border-slate-700/50 text-emerald-300 p-4 rounded-xl mt-4 font-mono text-[11px] font-bold">
                           cols = 4<br/>
                           row = 5 / 4 = 1  // We are on row 1<br/>
                           col = 5 % 4 = 1  // We are on col 1<br/><br/>
                           Index 5 corresponds to matrix[1][1]!
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
                        "I used a single 1D Binary Search. Because the problem guarantees that the end of a row is smaller than the start of the next, the entire matrix is strictly sorted if laid out flat. I treated it as a virtual 1D array of length $M \times N$. Using `low = 0` and `high = (m*n) - 1`, I binary search normally. I mapped the 1D `mid` index back to the 2D matrix using integer division `mid / cols` for the row and modulo `mid % cols` for the column. This achieves the optimal $O(\log(M \times N))$ time complexity with $O(1)$ space, rather than allocating an actual flattened array."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Is Two-Phase BS better?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Another valid approach is doing a Binary Search on the first column to find the correct row $O(\log M)$, and then another Binary Search on that row to find the element $O(\log N)$. Both approaches yield exactly the same time complexity mathematically since $\log M + \log N = \log(M \times N)$. However, the 1D Virtual mapping is generally considered more elegant and requires slightly fewer lines of code.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(log(M × N))</span>
                                <p className="text-[10px] text-slate-500 mt-1">We are doing standard binary search on a search space of size $M \times N$. In each step, we cut the remaining search space strictly in half.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only use a few integer variables (`low`, `high`, `mid`, `row`, `col`) to track our position. No new arrays or matrices are created.</p>
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

const VariableCard: React.FC<{ label: string; val: any; arrVal?: any; color: string; active: boolean }> = ({ label, val, arrVal, color, active }) => {
    const bgMap = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className={`text-xl font-black font-mono leading-none truncate w-full text-center px-2`}>
                 {val !== null && val !== undefined ? val : '-'}
             </div>
             {active && arrVal !== undefined && arrVal !== null && (
                 <div className="absolute bottom-0 w-full text-center bg-black/5 text-[9px] font-black py-0.5 mt-2">
                     val: {arrVal}
                 </div>
             )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active: boolean; theme?: string }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|Stack|matrix|target|low|high|mid|midVal|row|col)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['matrix'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['target'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['low'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (['mid', 'row', 'col'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['high'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SearchMatrixVisualizer;