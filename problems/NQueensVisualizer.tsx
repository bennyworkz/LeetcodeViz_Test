import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Database, ListOrdered, Zap, ArrowLeftRight, Timer,
  Grid3X3, Crown, ShieldAlert, XCircle, RotateCcw
} from 'lucide-react';

const APPROACHES = {
  optimizedBacktracking: {
    id: 'optimizedBacktracking',
    title: '1. Backtracking (Optimized Arrays)',
    subtitle: 'Optimal: O(N!) Time, O(N) Space.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N!) | Space: O(N)',
    code: `class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        char[][] board = new char[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(board[i], '.');
        }
        
        // Arrays to track attacked lines in O(1) time
        boolean[] cols = new boolean[n];
        boolean[] posDiag = new boolean[2 * n];
        boolean[] negDiag = new boolean[2 * n];
        
        backtrack(0, board, cols, posDiag, negDiag, res, n);
        return res;
    }
    
    private void backtrack(int r, char[][] board, boolean[] cols, boolean[] posDiag, boolean[] negDiag, List<List<String>> res, int n) {
        if (r == n) {
            res.add(construct(board));
            return;
        }
        
        for (int c = 0; c < n; c++) {
            int pDiag = r + c;
            int nDiag = r - c + n;
            
            // Check if square is under attack
            if (cols[c] || posDiag[pDiag] || negDiag[nDiag]) {
                continue;
            }
            
            // PLACE QUEEN
            board[r][c] = 'Q';
            cols[c] = true;
            posDiag[pDiag] = true;
            negDiag[nDiag] = true;
            
            // RECURSE TO NEXT ROW
            backtrack(r + 1, board, cols, posDiag, negDiag, res, n);
            
            // BACKTRACK (REMOVE QUEEN)
            board[r][c] = '.';
            cols[c] = false;
            posDiag[pDiag] = false;
            negDiag[nDiag] = false;
        }
    }
    
    private List<String> construct(char[][] board) {
        List<String> res = new ArrayList<>();
        for (int i = 0; i < board.length; i++) {
            res.add(new String(board[i]));
        }
        return res;
    }
}`,
    explanation: "This is the classic Backtracking algorithm optimized with tracking arrays. The brute-force way to check if a Queen is under attack is to scan the entire board ($O(N)$ per check). However, we can track attacked lines using three boolean arrays: one for columns, one for positive diagonals (where `row + col` is constant), and one for negative diagonals (where `row - col` is constant). When we place a Queen at `(r, c)`, we immediately mark its column and both diagonals as `true`. We then recurse to the next row. If a path fails, we BACKTRACK by removing the Queen and un-marking the arrays before trying the next column."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">51. N-Queens</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          The <strong>n-queens</strong> puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.
        </p>

        <p className="text-lg leading-relaxed">
          Given an integer <code>n</code>, return <em>all distinct solutions to the <strong>n-queens puzzle</strong></em>. You may return the answer in <strong>any order</strong>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Each solution contains a distinct board configuration of the n-queens' placement, where <code>'Q'</code> and <code>'.'</code> both indicate a queen and an empty space, respectively.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-3">
              <img src="https://assets.leetcode.com/uploads/2020/11/13/queens.jpg" alt="n-queens" className="w-[400px] max-w-full rounded shadow-sm border border-slate-200 mb-2 bg-white" />
              <p><span className="text-slate-400 font-bold">Input:</span> n = 4</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]</p>
              <p className="text-slate-500 italic mt-2 text-xs font-sans">// Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [["Q"]]</p>
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

const NQueensVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('optimizedBacktracking');
  const [nInput, setNInput] = useState('4');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let n = parseInt(nInput.trim());
    if (isNaN(n) || n < 1) n = 4;
    // Hard cap for the visualizer to prevent browser freezing (N=8 has over 15,000 steps)
    if (n > 5) n = 5; 

    return { n };
  }, [nInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { n } = parsedData;
    
    let board = Array(n).fill(null).map(() => Array(n).fill('.'));
    let cols = Array(n).fill(false);
    let posDiag = Array(2 * n).fill(false);
    let negDiag = Array(2 * n).fill(false);
    let solutions = [];

    const cloneBoard = (b) => b.map(row => [...row]);
    const cloneArr = (arr) => [...arr];

    // Helper to capture the global state effortlessly
    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 5000) return; // Hard safety cap
      steps.push({ 
          phase, 
          description: desc, 
          line, 
          state: { 
              board: cloneBoard(board),
              cols: cloneArr(cols),
              posDiag: cloneArr(posDiag),
              negDiag: cloneArr(negDiag),
              solutionsCount: solutions.length,
              ...vars 
          } 
      });
    };

    if (selectedApproachId === 'optimizedBacktracking') {
        
        addStep("Initialize Result List", `Line 3: List<List<String>> res = new ArrayList<>();\nCreate a list to hold valid board configurations.`, 3, { r: null, c: null, action: 'init' });

        addStep("Initialize Board", `Line 4: char[][] board = new char[n][n];\nCreate an ${n}x${n} character matrix for the chessboard.`, 4, { r: null, c: null, action: 'init' });

        for (let i = 0; i < n; i++) {
            addStep("Board Fill Loop", `Line 5: for (int i = ${i}; i < ${n}; i++)\nEntering loop to initialize board rows.`, 5, { r: null, c: null, action: 'init' });
            addStep("Fill Row", `Line 6: Arrays.fill(board[${i}], '.');\nFill row ${i} with '.' to represent empty squares.`, 6, { r: null, c: null, action: 'init' });
        }

        addStep("Initialize Cols Tracker", `Line 10: boolean[] cols = new boolean[${n}];\nTracks which columns currently contain a Queen.`, 10, { r: null, c: null, action: 'init' });
        
        addStep("Initialize Pos Diag Tracker", `Line 11: boolean[] posDiag = new boolean[${2 * n}];\nTracks positive diagonals (↗). A square is on a specific diagonal if its (row + col) value is the same.`, 11, { r: null, c: null, action: 'init' });
        
        addStep("Initialize Neg Diag Tracker", `Line 12: boolean[] negDiag = new boolean[${2 * n}];\nTracks negative diagonals (↘). A square is on a specific diagonal if its (row - col) value is the same. We add +n to avoid negative array indices.`, 12, { r: null, c: null, action: 'init' });

        addStep("Start Backtracking", `Line 14: backtrack(0, board, cols, posDiag, negDiag, res, n);\nBegin the recursive process starting at the very top row (row 0).`, 14, { r: null, c: null, action: 'init' });

        const backtrack = (r) => {
            if (steps.length > 4900) return;

            addStep("Enter Function", `Line 18: private void backtrack(int r = ${r}...)\nEnter function attempting to place a Queen anywhere in row ${r}.`, 18, { r, c: null, action: 'enter' });

            addStep("Check Base Case", `Line 19: if (r == n)\nIs ${r} == ${n}? ${r === n ? 'Yes! All queens have been successfully placed without attacking each other.' : 'No. We must continue finding a safe spot in this row.'}`, 19, { r, c: null, action: 'checkBase' });

            if (r === n) {
                solutions.push(cloneBoard(board));
                addStep("Store Valid Solution", `Line 20: res.add(construct(board));\nConvert our internal char[][] board to a List of Strings and save it to 'res'.`, 20, { r, c: null, action: 'solution' });
                addStep("Return From Base Case", `Line 21: return;\nGo back up the call stack to find MORE solutions.`, 21, { r, c: null, action: 'return' });
                return;
            }

            for (let c = 0; c < n; c++) {
                if (steps.length > 4900) break;
                
                addStep("Evaluate Column", `Line 24: for (int c = ${c}; c < ${n}; c++)\nEvaluating if we can place a Queen at row ${r}, column ${c}.`, 24, { r, c, action: 'evaluating' });

                let pDiag = r + c;
                addStep("Calculate Pos Diag Index", `Line 25: int pDiag = r + c = ${r} + ${c} = ${pDiag};\nThe positive diagonal identifier for this square is ${pDiag}.`, 25, { r, c, pDiag, nDiag: null, action: 'evaluating' });

                let nDiag = r - c + n;
                addStep("Calculate Neg Diag Index", `Line 26: int nDiag = r - c + n = ${r} - ${c} + ${n} = ${nDiag};\nThe negative diagonal identifier for this square is ${nDiag}.`, 26, { r, c, pDiag, nDiag, action: 'evaluating' });

                let isAttackedCol = cols[c];
                let isAttackedPDiag = posDiag[pDiag];
                let isAttackedNDiag = negDiag[nDiag];
                let isAttacked = isAttackedCol || isAttackedPDiag || isAttackedNDiag;

                let conditionStr = `cols[${c}](${isAttackedCol}) || posDiag[${pDiag}](${isAttackedPDiag}) || negDiag[${nDiag}](${isAttackedNDiag})`;

                addStep("Check Attack Constraints", `Line 29: if (${conditionStr})\n\nIs the square (${r}, ${c}) under attack by any previously placed Queen?\n${isAttacked ? 'YES. This square is attacked!' : 'NO. The square is safe!'}`, 29, { r, c, pDiag, nDiag, action: isAttacked ? 'invalid' : 'safe' });

                if (isAttacked) {
                    addStep("Skip Attacked Square", `Line 30: continue;\nThe square is attacked. We immediately skip to the next column.`, 30, { r, c, pDiag, nDiag, action: 'skip' });
                    continue;
                }

                // Place Queen Mutation
                board[r][c] = 'Q';
                addStep("Place Queen on Board", `Line 34: board[${r}][${c}] = 'Q';\nWe visually place the Queen on the board.`, 34, { r, c, pDiag, nDiag, action: 'place' });

                cols[c] = true;
                addStep("Mark Column Attacked", `Line 35: cols[${c}] = true;\nUpdate state: No other Queen can be placed in column ${c}.`, 35, { r, c, pDiag, nDiag, action: 'place' });

                posDiag[pDiag] = true;
                addStep("Mark Pos Diag Attacked", `Line 36: posDiag[${pDiag}] = true;\nUpdate state: No other Queen can be placed on positive diagonal ${pDiag}.`, 36, { r, c, pDiag, nDiag, action: 'place' });

                negDiag[nDiag] = true;
                addStep("Mark Neg Diag Attacked", `Line 37: negDiag[${nDiag}] = true;\nUpdate state: No other Queen can be placed on negative diagonal ${nDiag}.`, 37, { r, c, pDiag, nDiag, action: 'place' });

                addStep("Recurse to Next Row", `Line 40: backtrack(r + 1 = ${r + 1}, ...);\nA Queen is securely locked into row ${r}. We pause this execution context and recursively call backtrack for row ${r + 1}.`, 40, { r, c, pDiag, nDiag, action: 'recurse' });
                
                backtrack(r + 1);

                addStep("Returned from Recursion", `Line 40: Recursive call returned.\nWe have explored all possibilities branching from placing a Queen at (${r}, ${c}). We must now UNDO this placement to explore other columns.`, 42, { r, c, pDiag, nDiag, action: 'remove' });

                // Backtrack Mutation
                board[r][c] = '.';
                addStep("Remove Queen", `Line 43: board[${r}][${c}] = '.';\nPhysically remove the Queen from the board.`, 43, { r, c, pDiag, nDiag, action: 'remove' });

                cols[c] = false;
                addStep("Unmark Column", `Line 44: cols[${c}] = false;\nRelease column ${c} constraint.`, 44, { r, c, pDiag, nDiag, action: 'remove' });

                posDiag[pDiag] = false;
                addStep("Unmark Pos Diag", `Line 45: posDiag[${pDiag}] = false;\nRelease positive diagonal ${pDiag} constraint.`, 45, { r, c, pDiag, nDiag, action: 'remove' });

                negDiag[nDiag] = false;
                addStep("Unmark Neg Diag", `Line 46: negDiag[${nDiag}] = false;\nRelease negative diagonal ${nDiag} constraint. State is completely restored!`, 46, { r, c, pDiag, nDiag, action: 'remove' });
            }
            
            addStep("End of Row Combinations", `Line 48: }\nWe have exhausted all ${n} columns for row ${r}. This function call terminates and returns to the previous row's execution context.`, 48, { r, c: null, action: 'return' });
        };

        backtrack(0);
        
        addStep("Algorithm Complete", `Line 15: return res;\n\nBacktracking has completely exhausted the state space. We found ${solutions.length} valid distinct configuration(s).`, 15, { r: null, c: null, action: 'success', isSuccess: true });

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
  const { isSuccess, board, cols, posDiag, negDiag, r: currR, c: currC, pDiag, nDiag, action, solutionsCount } = state;
  const { n } = parsedData;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Crown className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">N-Queens</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 51</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Backtracking / Arrays</span>
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Row (r)" val={currR !== null ? currR : "None"} color="violet" active={currR !== null} />
                        <VariableCard label="Col (c)" val={currC !== null ? currC : "None"} color="sky" active={currC !== null} />
                        <VariableCard label="Valid Boards" val={solutionsCount !== undefined ? solutionsCount : 0} color="emerald" active={true} />
                        <VariableCard label="Pos/Neg Diag" val={pDiag !== undefined && pDiag !== null ? `${pDiag} / ${nDiag}` : '-'} color="amber" active={pDiag !== undefined && pDiag !== null} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Grid Size (N)</label>
                        <input type="number" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} min="1" max="5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="4" />
                        <p className="text-[9px] text-slate-400 pl-1">Max 5 for visualizer performance (N=8 takes ~15k steps!)</p>
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[180px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Crown size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[120px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px]">
                   
                   <div className="flex flex-col items-center justify-center w-full h-full relative z-10 pt-4 pb-8 gap-8">
                      
                      {board && (
                          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start w-full justify-center">
                              
                              {/* Chessboard */}
                              <div 
                                  className="grid border-4 border-slate-700 rounded shadow-2xl relative bg-slate-300 overflow-hidden"
                                  style={{
                                      gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                                      gridTemplateRows: `repeat(${n}, minmax(0, 1fr))`,
                                      width: 'fit-content'
                                  }}
                              >
                                  {board.map((rowArr, i) => 
                                      rowArr.map((cellVal, j) => {
                                          let isLightSquare = (i + j) % 2 === 0;
                                          let baseBg = isLightSquare ? "bg-slate-50" : "bg-slate-300";
                                          let isCurrentCell = (currR === i && currC === j);
                                          
                                          // Constraints overlay calculation
                                          let isCellAttacked = cols[j] || posDiag[i + j] || negDiag[i - j + n];
                                          let isAttackedCol = cols[j];
                                          let isAttackedPDiag = posDiag[i + j];
                                          let isAttackedNDiag = negDiag[i - j + n];
                                          let isCurrentlyAttacked = isCurrentCell && (isAttackedCol || isAttackedPDiag || isAttackedNDiag);

                                          let highlightClass = "";
                                          if (isCurrentCell) {
                                              if (action === 'evaluating') highlightClass = "ring-inset ring-4 ring-violet-500 z-20 animate-pulse bg-violet-100";
                                              else if (action === 'invalid') highlightClass = "ring-inset ring-4 ring-rose-500 z-20 bg-rose-200";
                                              else if (action === 'safe') highlightClass = "ring-inset ring-4 ring-emerald-500 z-20 bg-emerald-100";
                                              else if (action === 'place') highlightClass = "ring-inset ring-4 ring-emerald-500 z-20 bg-emerald-200 scale-105 shadow-xl transition-transform";
                                              else if (action === 'remove') highlightClass = "ring-inset ring-4 ring-amber-500 z-20 bg-amber-200 scale-95 opacity-50 transition-all duration-500";
                                          } else if (isAttackedCol || isAttackedPDiag || isAttackedNDiag) {
                                              highlightClass = "bg-rose-50 opacity-80"; // Subtle red tint for attacked squares
                                          }

                                          return (
                                              <div 
                                                  key={`cell-${i}-${j}`} 
                                                  className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl relative ${baseBg} ${highlightClass}`}
                                              >
                                                  {cellVal === 'Q' && (
                                                      <Crown size={32} className={`text-slate-800 drop-shadow-md ${action === 'remove' && isCurrentCell ? 'animate-bounce text-amber-600' : ''}`} fill="currentColor"/>
                                                  )}
                                                  
                                                  {isCurrentCell && action === 'evaluating' && cellVal !== 'Q' && (
                                                      <div className="absolute text-violet-500 opacity-50"><Crown size={24}/></div>
                                                  )}

                                                  {isCurrentlyAttacked && (
                                                      <div className="absolute inset-0 flex items-center justify-center text-rose-500 opacity-80">
                                                          <XCircle size={40} strokeWidth={1}/>
                                                      </div>
                                                  )}

                                                  {/* Row/Col indices for learning */}
                                                  {i === 0 && <span className="absolute top-0 right-0.5 text-[8px] font-mono text-slate-400 opacity-50">{j}</span>}
                                                  {j === 0 && <span className="absolute bottom-0 left-0.5 text-[8px] font-mono text-slate-400 opacity-50">{i}</span>}
                                              </div>
                                          )
                                      })
                                  )}

                                  {/* Row Indicator overlay */}
                                  {currR !== null && currR < n && !isSuccess && (
                                      <div 
                                          className="absolute left-0 w-full h-12 sm:h-16 border-y-2 border-dashed border-violet-400/50 pointer-events-none transition-all duration-300"
                                          style={{ top: `${currR * (100 / n)}%` }}
                                      ></div>
                                  )}
                              </div>

                              {/* Array Visualizations */}
                              <div className="flex flex-col gap-4 shrink-0 mt-4 md:mt-0">
                                  {/* Cols Array */}
                                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-inner w-full">
                                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest font-mono mb-2 block">Cols Tracker</span>
                                      <div className="flex gap-1">
                                          {cols.map((val, idx) => (
                                              <div key={`col-${idx}`} className={`w-6 h-6 flex flex-col items-center justify-center rounded border text-[10px] font-mono font-bold ${val ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-white border-slate-300 text-slate-400'} ${currC === idx ? 'ring-2 ring-violet-400 scale-110 z-10' : ''}`}>
                                                  {idx}
                                              </div>
                                          ))}
                                      </div>
                                  </div>

                                  {/* PosDiag Array */}
                                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-inner w-full">
                                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest font-mono mb-2 block">Pos Diag (r + c)</span>
                                      <div className="flex gap-1 flex-wrap w-[180px]">
                                          {posDiag.map((val, idx) => {
                                              if(idx >= 2*n - 1) return null; // Only 2n-1 diagonals exist
                                              let isTarget = pDiag === idx;
                                              return (
                                                  <div key={`pd-${idx}`} className={`w-6 h-6 flex flex-col items-center justify-center rounded border text-[10px] font-mono font-bold ${val ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-white border-slate-300 text-slate-400'} ${isTarget ? 'ring-2 ring-violet-400 scale-110 z-10' : ''}`}>
                                                      {idx}
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  </div>

                                  {/* NegDiag Array */}
                                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-inner w-full">
                                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest font-mono mb-2 block">Neg Diag (r - c + n)</span>
                                      <div className="flex gap-1 flex-wrap w-[180px]">
                                          {negDiag.map((val, idx) => {
                                              if(idx >= 2*n) return null; // 2n size array, max val is 2n-1 (or 2n-2 depending on mapping)
                                              // For formula r-c+n: max r=n-1, min c=0 -> (n-1)-0+n = 2n-1. Min r=0, max c=n-1 -> 0-(n-1)+n = 1.
                                              if(idx === 0) return null; // 0 is never hit with this formula
                                              let isTarget = nDiag === idx;
                                              return (
                                                  <div key={`nd-${idx}`} className={`w-6 h-6 flex flex-col items-center justify-center rounded border text-[10px] font-mono font-bold ${val ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-white border-slate-300 text-slate-400'} ${isTarget ? 'ring-2 ring-violet-400 scale-110 z-10' : ''}`}>
                                                      {idx}
                                                  </div>
                                              )
                                          })}
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
                          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH EXHAUSTED</span>
                              <span className="text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600">
                                  Found {solutionsCount} distinct solutions for N={n}
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
                <RotateCcw className="text-violet-600"/> The Art of Backtracking
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Backtracking is a systematic way to iterate through all possible configurations of a search space. It works by building a solution piece by piece. If we reach a point where the current piece violates our rules, we "backtrack"—we undo our last move and try the next available option.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Grid3X3 size={18}/> Row-by-Row Strategy
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We know that no two Queens can ever share the same row. Therefore, a massive optimization right out of the gate is to <strong>only place one Queen per row</strong>.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            Our recursive function <code>backtrack(int r)</code> handles exactly one row. Inside that call, we iterate through all columns <code>c</code>. If we place a Queen safely, we instantly recurse to <code>r + 1</code>. This perfectly avoids row collisions inherently.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> O(1) Constraint Checking
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            The naive way to check if a Queen is attacked is to scan its row, column, and both diagonals using a loop ($O(N)$). But we can do this in $O(1)$!
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p><strong>Columns:</strong> Array of size N.</p>
                            <p><strong>Positive Diagonal (↙):</strong> For any square on this diagonal, <code>row + col</code> is a constant unique value.</p>
                            <p><strong>Negative Diagonal (↘):</strong> For any square on this diagonal, <code>row - col</code> is constant. We add <code>+ N</code> to prevent negative array indices.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ShieldAlert size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The Crucial "Undo" Step</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            When we place a Queen, we explicitly alter the shared state (the board and the 3 boolean arrays). 
                            <br/><br/>
                            When our recursion returns, it means that specific path either found a solution or hit a dead end. In both cases, we must try placing the Queen in the *next* column.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-amber-300">
                            // 1. Alter state<br/>
                            board[r][c] = 'Q';<br/>
                            cols[c] = true;<br/><br/>
                            // 2. Explore<br/>
                            backtrack(r + 1);<br/><br/>
                            // 3. UNDO STATE (Backtrack!)<br/>
                            board[r][c] = '.';<br/>
                            cols[c] = false;
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
                        "I used an optimized Backtracking approach to solve N-Queens. I iterate row by row, attempting to place a Queen in each column. To ensure $O(1)$ constraint checking, I maintain three boolean arrays: one for columns, one for positive diagonals (where `row + col` is constant), and one for negative diagonals (where `row - col` is constant). If a placement is valid, I mark the arrays, place the Queen, and recurse to the next row. Critically, after the recursion returns, I backtrack by un-marking the arrays and removing the Queen, ensuring the shared state is clean for the next iteration. This runs in $O(N!)$ time, which is strictly optimal for generating all permutations."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Arrays vs HashSets?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You can absolutely use HashSets (e.g., <code>Set&lt;Integer&gt; cols</code>) to track the attacked lines. HashSets are conceptually easier because you don't have to calculate precise array sizes or offsets (like adding `+ n` to the negative diagonal). However, boolean arrays are the superior answer in an interview: they have significantly less memory overhead, avoid object instantiation, and array lookups are blazingly fast compared to hashing.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N!)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Placing the 1st queen has N options, the 2nd has at most N-1 options, the 3rd N-2, and so on. It results in N! possibilities in the worst case, though constraints prune many branches early.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Ignoring the space required to store the final output strings, we need $O(N)$ space for the recursive call stack, the board arrays, and our 3 boolean tracking arrays.</p>
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

const VariableCard: React.FC<{ label: string; val: any; color: string; active: boolean }> = ({ label, val, color, active }) => {
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

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean; theme?: string }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|board|cols|posDiag|negDiag|backtrack|res|pDiag|nDiag)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['backtrack'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['board', 'res'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['cols', 'posDiag', 'negDiag'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (['pDiag', 'nDiag'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default NQueensVisualizer;