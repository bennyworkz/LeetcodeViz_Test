import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ListOrdered, ArrowRight, XSquare, Hash, 
  Crown, Grid, Maximize, RotateCcw, Timer
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: 'Backtracking w/ Sets',
    subtitle: 'Optimal: O(N!) Time, O(N) Space.',
    icon: <Crown size={16} />,
    complexity: 'Time: O(N!) | Space: O(N)', 
    code: `class Solution {
    private int solutions = 0;
    
    public int totalNQueens(int n) {
        boolean[] cols = new boolean[n];
        boolean[] posDiag = new boolean[2 * n]; // row + col
        boolean[] negDiag = new boolean[2 * n]; // row - col + n
        backtrack(0, n, cols, posDiag, negDiag);
        return solutions;
    }
    
    private void backtrack(int row, int n, boolean[] cols, boolean[] posDiag, boolean[] negDiag) {
        if (row == n) {
            solutions++;
            return;
        }
        
        for (int col = 0; col < n; col++) {
            // Check if cell is under attack
            if (cols[col] || posDiag[row + col] || negDiag[row - col + n]) {
                continue;
            }
            
            // Place Queen
            cols[col] = true;
            posDiag[row + col] = true;
            negDiag[row - col + n] = true;
            
            // Recurse to next row
            backtrack(row + 1, n, cols, posDiag, negDiag);
            
            // Backtrack: Remove Queen
            cols[col] = false;
            posDiag[row + col] = false;
            negDiag[row - col + n] = false;
        }
    }
}`,
    explanation: "To find all valid arrangements of N queens on an NxN board, we use Backtracking. We place queens row by row. For a given row, we iterate through every column. To efficiently check if a cell is under attack by previously placed queens, we use tracking arrays (or Sets). A queen attacks its column, its positive diagonal (where row + col is constant), and its negative diagonal (where row - col is constant). If a cell is safe, we mark its column and diagonals as attacked, place the queen, and recurse to the next row. If we reach row `N`, we've successfully placed all queens and found one valid solution. We then backtrack by removing the queen and unmarking the attacked lines to explore other configurations."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">52. N-Queens II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          The <strong>n-queens</strong> puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.
        </p>
        
        <p className="text-md">
          Given an integer <code>n</code>, return <em>the number of distinct solutions to the <strong>n-queens puzzle</strong></em>.
        </p>

        <div className="space-y-6 mt-8">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 4</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <p className="text-slate-500 leading-relaxed font-sans text-sm">
                <span className="text-slate-400 font-bold font-mono">Explanation:</span> There are two distinct solutions to the 4-queens puzzle as shown below.
              </p>
              <div className="flex gap-8 mt-4">
                  <pre className="text-xs bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
{`. Q . .
. . . Q
Q . . .
. . Q .`}
                  </pre>
                  <pre className="text-xs bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
{`. . Q .
Q . . .
. . . Q
. Q . .`}
                  </pre>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 1</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= n &lt;= 9</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const NQueensIIVisualizer = () =>{
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('backtracking');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Default input N
  const [nInput, setNInput] = useState('4');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let n = parseInt(nInput);
    if (isNaN(n) || n < 1) n = 1;
    if (n > 6) n = 6; // Limit to 6 for browser performance and visualizer bounds
    return { n };
  }, [nInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { n } = parsedData;
    
    let solutions = 0;
    let board = Array(n).fill(-1);
    let cols = new Set();
    let posDiag = new Set();
    let negDiag = new Set();

    const addStep = (phase, description, line, action, extra = {}) => {
        if (steps.length > 2500) return; // safeguard
        steps.push({
            phase, 
            description, 
            line,
            state: {
                board: [...board],
                cols: new Set(cols),
                posDiag: new Set(posDiag),
                negDiag: new Set(negDiag),
                solutions,
                action,
                ...extra
            }
        });
    };

    addStep('Initialization', `Setting up an ${n}x${n} board.\nTracking arrays for columns and diagonals initialized.`, 5, 'init');

    const backtrack = (row) => {
        if (steps.length > 2500) return;

        addStep('Check Base Case', `Evaluating row ${row}.\nAre we at the end of the board?`, 12, 'eval_row', { r: row, c: null });

        if (row === n) {
            solutions++;
            addStep('Solution Found!', `Successfully placed ${n} queens.\nIncrementing solution count to ${solutions}.`, 13, 'match', { r: row, c: null });
            return;
        }

        for (let col = 0; col < n; col++) {
            if (steps.length > 2500) return;
            
            addStep('Evaluate Cell', `Checking if we can place a queen at (${row}, ${col}).`, 18, 'eval_cell', { r: row, c: col });

            if (cols.has(col) || posDiag.has(row + col) || negDiag.has(row - col)) {
                let reason = cols.has(col) ? "Column" : posDiag.has(row + col) ? "Positive Diagonal" : "Negative Diagonal";
                addStep('Under Attack', `Cell (${row}, ${col}) is under attack by a queen on the same ${reason}.\nSkipping.`, 19, 'invalid', { r: row, c: col });
                continue;
            }

            // Place queen
            cols.add(col);
            posDiag.add(row + col);
            negDiag.add(row - col);
            board[row] = col;
            
            addStep('Place Queen', `Cell (${row}, ${col}) is safe.\nPlacing Queen and marking column and diagonals as attacked.`, 24, 'place', { r: row, c: col });

            backtrack(row + 1);

            if (steps.length > 2500) return;

            // Remove queen
            cols.delete(col);
            posDiag.delete(row + col);
            negDiag.delete(row - col);
            board[row] = -1;

            addStep('Backtrack', `Returned from recursion at row ${row + 1}.\nRemoving queen from (${row}, ${col}) to explore other column placements.`, 31, 'backtrack', { r: row, c: col });
        }
    };

    backtrack(0);
    
    addStep('Algorithm Complete', `Finished exploring the entire state space.\nTotal valid configurations found: ${solutions}.`, 8, 'complete');

    return steps;
  }, [parsedData]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const sState = cur.state || {};
  const N = parsedData.n;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Crown className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">N-Queens II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 52</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Backtracking / Search</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${sState.isSuccess || sState.action === 'match' ? 'bg-emerald-500/20 border-emerald-500' : (sState.action === 'invalid' ? 'bg-rose-500/20 border-rose-500' : (sState.action === 'place' ? 'bg-teal-500/20 border-teal-500' : (sState.action === 'backtrack' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={sState.isSuccess || sState.action === 'match' ? 'emerald' : (sState.action === 'invalid' ? 'rose' : (sState.action === 'place' ? 'teal' : (sState.action === 'backtrack' ? 'amber' : 'violet')))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Row (Depth)" val={sState.r !== null && sState.r !== undefined ? sState.r : "-"} color="purple" active={sState.r !== null && sState.r !== undefined} />
                        <VariableCard label="Col (Current)" val={sState.c !== null && sState.c !== undefined ? sState.c : "-"} color="sky" active={sState.c !== null && sState.c !== undefined} />
                        <VariableCard label="Attacked Cols" val={sState.cols ? sState.cols.size : "-"} color="rose" active={sState.cols !== undefined && sState.cols.size > 0} />
                        <VariableCard label="Solutions" val={sState.solutions !== undefined ? sState.solutions : "-"} color="emerald" active={sState.solutions > 0} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Board Size (N)</label>
                        <input type="number" min="1" max="6" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500" placeholder="4" />
                        <p className="text-[9px] text-slate-400 pl-1 font-mono">Recommended N=4 for visualization. Max 6.</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2.5 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-violet-200 hover:bg-violet-700 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${sState.isSuccess || sState.action === 'match' ? 'bg-emerald-900 border-emerald-800' : (sState.action === 'invalid' ? 'bg-rose-900 border-rose-800' : (sState.action === 'place' ? 'bg-teal-900 border-teal-800' : (sState.action === 'backtrack' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {sState.isSuccess || sState.action === 'match' ? <Check size={100}/> : (sState.action === 'invalid' ? <XSquare size={100}/> : (sState.action === 'place' ? <Target size={100}/> : (sState.action === 'backtrack' ? <RotateCcw size={100}/> : <Activity size={100}/>)))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={sState.isSuccess || sState.action === 'match' ? "text-emerald-400" : (sState.action === 'invalid' ? 'text-rose-400' : (sState.action === 'place' ? 'text-teal-400' : (sState.action === 'backtrack' ? 'text-amber-400' : 'text-slate-400')))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${sState.isSuccess || sState.action === 'match' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (sState.action === 'invalid' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (sState.action === 'place' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : (sState.action === 'backtrack' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')))}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[100px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-center justify-center min-h-[460px]">
                   
                   <div className="relative flex items-center justify-center w-full max-w-md aspect-square shadow-2xl rounded border-4 border-slate-800 bg-slate-800 overflow-hidden">
                       
                       <div 
                         className="grid w-full h-full" 
                         style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gridTemplateRows: `repeat(${N}, 1fr)` }}
                       >
                           {Array.from({ length: N }).map((_, rIdx) => 
                               Array.from({ length: N }).map((_, cIdx) => {
                                   const isDark = (rIdx + cIdx) % 2 === 1;
                                   const hasQueen = sState.board && sState.board[rIdx] === cIdx;
                                   const isCurrentCell = sState.r === rIdx && sState.c === cIdx;
                                   const isRowEval = sState.r === rIdx && sState.c === null;
                                   
                                   // Check if cell is under attack from PLACED queens
                                   // (using the actual state sets instead of calculating on the fly to perfectly match execution state)
                                   let isAttacked = false;
                                   if (sState.cols && sState.posDiag && sState.negDiag) {
                                       isAttacked = sState.cols.has(cIdx) || sState.posDiag.has(rIdx + cIdx) || sState.negDiag.has(rIdx - cIdx);
                                   }
                                   
                                   // It's only truly "attacked" in a visually disruptive way if it's below the current row,
                                   // or if we are actively highlighting the attack on the current cell.
                                   // Let's highlight attacked cells subtly if they are below the current row, 
                                   // and strongly if it's the current evaluated cell.
                                   
                                   const isAttackedFuture = isAttacked && rIdx >= (sState.r !== null ? sState.r : N);
                                   
                                   let cellClass = "flex items-center justify-center relative transition-all duration-300 ";
                                   
                                   if (isDark) cellClass += "bg-slate-300 ";
                                   else cellClass += "bg-slate-50 ";

                                   // Overlays
                                   if (isRowEval) {
                                       cellClass += "after:absolute after:inset-0 after:bg-sky-400/20 ";
                                   } else if (isCurrentCell) {
                                       if (sState.action === 'invalid') {
                                           cellClass += "ring-inset ring-4 ring-rose-500 after:absolute after:inset-0 after:bg-rose-500/40 z-10 ";
                                       } else if (sState.action === 'place') {
                                           cellClass += "ring-inset ring-4 ring-teal-500 after:absolute after:inset-0 after:bg-teal-500/40 z-10 animate-pulse ";
                                       } else if (sState.action === 'backtrack') {
                                           cellClass += "ring-inset ring-4 ring-amber-500 after:absolute after:inset-0 after:bg-amber-500/40 z-10 ";
                                       } else {
                                           cellClass += "ring-inset ring-4 ring-sky-400 after:absolute after:inset-0 after:bg-sky-400/30 z-10 ";
                                       }
                                   } else if (isAttackedFuture && !hasQueen) {
                                       cellClass += "after:absolute after:inset-0 after:bg-rose-500/10 ";
                                   } else if (sState.action === 'match' && hasQueen) {
                                        cellClass += "after:absolute after:inset-0 after:bg-emerald-400/30 ";
                                   }

                                   return (
                                       <div key={`${rIdx}-${cIdx}`} className={cellClass}>
                                           {hasQueen && (
                                               <Crown 
                                                  size={Math.max(16, 320 / N)} 
                                                  className={`drop-shadow-lg transition-all duration-300 ${sState.action === 'match' ? 'text-emerald-500 scale-110' : 'text-slate-800'}`} 
                                                  strokeWidth={2.5} 
                                                  fill={sState.action === 'match' ? '#10b981' : 'currentColor'}
                                               />
                                           )}
                                           
                                           {/* Visual indicator for current invalid eval */}
                                           {isCurrentCell && sState.action === 'invalid' && (
                                               <XSquare size={Math.max(16, 240 / N)} className="absolute text-rose-600 drop-shadow-md z-20" />
                                           )}
                                           
                                           {/* Coordinate Label */}
                                           {N <= 5 && (
                                               <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-slate-500 opacity-50 font-bold pointer-events-none">
                                                   {rIdx},{cIdx}
                                               </span>
                                           )}
                                       </div>
                                   );
                               })
                           )}
                       </div>
                   </div>

                  {/* Final Overlays */}
                  {sState.isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Found {sState.solutions} distinct solutions
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
                <Crown className="text-violet-600"/> Backtracking & State Space Tree
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                The N-Queens problem is the classic textbook example of Backtracking. We build a solution incrementally, row by row. As soon as we determine that placing a queen at a specific column violates the rules, we abandon that entire branch of the search tree.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Grid size={18}/> The Diagonal Math Trick
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            How do we quickly check if a cell <code>(r, c)</code> is on the same diagonal as a placed queen?
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p><strong>Positive Diagonal (/):</strong> Every cell on a bottom-left to top-right diagonal shares the same sum of its coordinates. <code>posDiagId = row + col</code>.</p>
                            <p><strong>Negative Diagonal (\):</strong> Every cell on a top-left to bottom-right diagonal shares the same difference. <code>negDiagId = row - col</code>.</p>
                            <p>By hashing or indexing these values into a Set or Boolean Array, we get an O(1) safety check!</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-rose-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <RotateCcw size={18}/> The Importance of Backtracking
                        </h3>
                        <p className="text-xs text-rose-800 leading-relaxed mb-4">
                            After exploring a valid placement deeply, we MUST undo our choice to explore siblings.
                        </p>
                        <div className="text-xs text-rose-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-rose-200 shadow-inner space-y-2">
                            <p>1. Place Queen at <code>(r, c)</code>.</p>
                            <p>2. Mark <code>col</code>, <code>posDiag</code>, and <code>negDiag</code> as true.</p>
                            <p>3. <code>backtrack(r + 1)</code></p>
                            <p>4. <strong>CRITICAL:</strong> Mark them all back to false. Without this, the board remains permanently "attacked", and other valid permutations in different branches will be incorrectly blocked.</p>
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
                        "To count the distinct solutions to the N-Queens puzzle, I use backtracking. I define a recursive function that places queens row by row. To validate placements in O(1) time, I maintain three boolean arrays (or Sets): one for columns, one for positive diagonals identified by `row + col`, and one for negative diagonals identified by `row - col`. At each row, I iterate through all columns. If the cell is safe, I update the arrays, recurse to the next row, and then backtrack by reverting the arrays. If I successfully reach row N, I increment my solutions counter. The time complexity is bounded by O(N!), as we place 1 queen per row and eliminate branches early, and space is O(N) for the call stack and tracking arrays."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-violet-500"/> FAQ: Arrays vs HashSet
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                In Python or JS, using a `Set()` is common and readable. In Java or C++, using `boolean[]` is preferred for performance.
                                <br/><br/>
                                <strong>Note on Negative Diagonals in Arrays:</strong> `row - col` can be negative. To use it as an array index, you must offset it by `+ N` (or `+ N - 1`) to ensure the index is always positive (e.g., `negDiag[row - col + n]`).
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-violet-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded">O(N!)</span>
                                <p className="text-[10px] text-slate-500 mt-1">In the worst case, the first row has N choices, the second has N-1, etc. However, pruning drastically reduces the actual number of states visited compared to N^N.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The maximum depth of the recursive call stack is N. The three tracking arrays/sets also take O(N) auxiliary space.</p>
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
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700'
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|totalNQueens|backtrack|solutions|cols|posDiag|negDiag|row|col|n|true|false)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['totalNQueens', 'backtrack', 'true', 'false'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['solutions', 'cols', 'posDiag', 'negDiag', 'row', 'col', 'n'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};


export default NQueensIIVisualizer;