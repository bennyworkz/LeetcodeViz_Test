import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Grid3X3, RotateCcw, 
  XSquare, CheckSquare, ShieldAlert, GitBranch
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: 'Backtracking (DFS)',
    subtitle: 'Optimal: O(9^(empty cells)) Time.',
    icon: <RotateCcw size={16} />,
    complexity: 'Time: O(9^M) | Space: O(1)',
    code: `class Solution {
    public void solveSudoku(char[][] board) {
        solve(board);
    }
    
    private boolean solve(char[][] board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    // Empty cell found. Try all possible digits.
                    for (char c = '1'; c <= '9'; c++) {
                        if (isValid(board, i, j, c)) {
                            board[i][j] = c; // Place digit
                            
                            // Recurse to solve the rest of the board
                            if (solve(board)) {
                                return true;
                            } else {
                                // Dead end reached. Undo and try next digit.
                                board[i][j] = '.';
                            }
                        }
                    }
                    // No valid digit found. Trigger backtracking.
                    return false;
                }
            }
        }
        // Entire board is filled successfully
        return true;
    }
    
    private boolean isValid(char[][] board, int row, int col, char c) {
        for (int i = 0; i < 9; i++) {
            // Check row
            if (board[row][i] != '.' && board[row][i] == c) return false;
            // Check column
            if (board[i][col] != '.' && board[i][col] == c) return false;
            // Check 3x3 sub-box
            if (board[3 * (row / 3) + i / 3][ 3 * (col / 3) + i % 3] != '.' && 
                board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3] == c) return false;
        }
        return true;
    }
}`,
    explanation: "Sudoku is the textbook example for Backtracking. The algorithm scans the board for the first empty cell ('.'). Once found, it systematically tries placing digits '1' through '9'. For each digit, it runs an `isValid` check. This check scans the current row, column, and the local 3x3 sub-box to ensure the digit doesn't violate Sudoku rules. If valid, we tentatively place the digit and recursively call `solve()` to attack the next empty cell. If the recursive call eventually returns `false` (meaning a downstream cell got stuck with no valid options), we 'backtrack' by resetting the current cell back to '.' and continuing the loop to try the next valid digit. If the entire board is filled, it returns `true` all the way up the call stack."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">37. Sudoku Solver</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Write a program to solve a Sudoku puzzle by filling the empty cells.
        </p>

        <p className="text-base leading-relaxed mt-4">
          A sudoku solution must satisfy <strong>all of the following rules:</strong>
        </p>

        <ul className="list-decimal pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium bg-slate-50 p-4 rounded-xl border border-slate-200 w-max">
            <li>Each of the digits <code>1-9</code> must occur exactly once in each row.</li>
            <li>Each of the digits <code>1-9</code> must occur exactly once in each column.</li>
            <li>Each of the digits <code>1-9</code> must occur exactly once in each of the 9 <code>3x3</code> sub-boxes of the grid.</li>
        </ul>

        <p className="text-sm leading-relaxed text-slate-500 italic mt-4">
          The <code>'.'</code> character indicates empty cells.
        </p>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>board.length == 9</code></li>
              <li><code>board[i].length == 9</code></li>
              <li><code>board[i][j]</code> is a digit or <code>'.'</code>.</li>
              <li>It is <strong>guaranteed</strong> that the input board has only one solution.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SudokuVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('backtracking');
  
  // Default to a nearly solved board for quick visualization without crashing
  const defaultBoard = [
    "5 3 4 6 7 8 9 1 2",
    "6 7 2 1 9 5 3 4 8",
    "1 9 8 3 4 2 5 6 7",
    "8 5 9 7 6 1 4 2 3",
    "4 2 6 8 5 3 7 9 1",
    "7 1 3 9 2 4 8 5 6",
    "9 6 1 5 3 7 2 8 .",
    "2 8 7 4 1 9 . . .",
    "3 4 5 2 8 6 . . ."
  ].join("\n");

  const [boardInput, setBoardInput] = useState(defaultBoard);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let lines = boardInput.trim().split('\n');
    let grid = [];
    
    for (let i = 0; i < 9; i++) {
        let row = [];
        if (i < lines.length) {
            // Strip out spaces and commas, just look for chars
            let chars = lines[i].replace(/[^1-9\.]/g, '').split('');
            for (let j = 0; j < 9; j++) {
                if (j < chars.length) {
                    row.push(chars[j]);
                } else {
                    row.push('.');
                }
            }
        } else {
            for (let j = 0; j < 9; j++) row.push('.');
        }
        grid.push(row);
    }
    
    return { initialGrid: grid };
  }, [boardInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { initialGrid } = parsedData;

    // Deep copy helper
    const copyGrid = (g) => g.map(row => [...row]);
    
    // Create a working copy
    let board = copyGrid(initialGrid);
    
    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return; // Hard cap to prevent memory/UI freezes
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    addStep("Initialize", "Starting Sudoku Solver. Scanning for empty cells.", 3, { board: copyGrid(board), action: 'init' });

    const checkValid = (b, r, c, val) => {
        for (let i = 0; i < 9; i++) {
            if (b[r][i] === val) return { valid: false, conflictRow: r, conflictCol: i, reason: 'Row Conflict' };
            if (b[i][c] === val) return { valid: false, conflictRow: i, conflictCol: c, reason: 'Column Conflict' };
            
            let br = 3 * Math.floor(r / 3) + Math.floor(i / 3);
            let bc = 3 * Math.floor(c / 3) + (i % 3);
            if (b[br][bc] === val) return { valid: false, conflictRow: br, conflictCol: bc, reason: '3x3 Box Conflict' };
        }
        return { valid: true };
    };

    const solve = () => {
        if (steps.length > 2500) return true; // Abort deeply nested traces safely

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    
                    addStep("Empty Cell Found", `Line 9: if (board[i][j] == '.')\n\nFound empty cell at Row ${i}, Col ${j}. We will now try digits 1-9.`, 9, { board: copyGrid(board), currRow: i, currCol: j, action: 'findEmpty' });

                    for (let c = 1; c <= 9; c++) {
                        if (steps.length > 2500) return true;
                        
                        let charC = c.toString();
                        
                        addStep("Try Digit", `Line 11: for (char c = '1'; c <= '9'; c++)\n\nAttempting to place '${charC}' at [${i}][${j}]. Validating...`, 11, { board: copyGrid(board), currRow: i, currCol: j, attemptVal: charC, action: 'try' });

                        let validation = checkValid(board, i, j, charC);

                        if (validation.valid) {
                            board[i][j] = charC;
                            addStep("Valid Placement", `Line 12-13: if (isValid(...)) board[i][j] = c;\n\n'${charC}' is completely valid! Temporarily placing it at [${i}][${j}].`, 13, { board: copyGrid(board), currRow: i, currCol: j, placedVal: charC, action: 'place' });

                            addStep("Recurse Forward", `Line 16: if (solve(board)) return true;\n\nMoving forward to solve the remaining empty cells with this placement.`, 16, { board: copyGrid(board), currRow: i, currCol: j, placedVal: charC, action: 'recurse' });
                            
                            if (solve()) {
                                return true;
                            } else {
                                board[i][j] = '.';
                                addStep("Backtrack", `Line 20: board[i][j] = '.';\n\nDead end! The downstream solver returned false. We must undo our placement of '${charC}' at [${i}][${j}] and try the next available digit.`, 20, { board: copyGrid(board), currRow: i, currCol: j, removedVal: charC, action: 'backtrack' });
                            }
                        } else {
                            addStep("Invalid Placement", `Line 12: if (isValid(...)) is FALSE.\n\n'${charC}' is invalid due to a ${validation.reason} at [${validation.conflictRow}][${validation.conflictCol}].`, 12, { board: copyGrid(board), currRow: i, currCol: j, attemptVal: charC, conflictRow: validation.conflictRow, conflictCol: validation.conflictCol, action: 'invalid' });
                        }
                    }

                    addStep("Exhausted Options", `Line 24: return false;\n\nWe tried all digits 1-9 for [${i}][${j}] and none worked. This means an earlier placement was wrong. Triggering return false to backtrack the previous cell!`, 24, { board: copyGrid(board), currRow: i, currCol: j, action: 'exhausted' });
                    return false;
                }
            }
        }
        return true;
    };

    solve();

    if (steps.length > 2500) {
        addStep("Trace Limit Reached", "The visualizer stopped at 2500 steps to prevent freezing. The true backtracking algorithm would continue.", 3, { board: copyGrid(board), action: 'limit' });
    } else {
        addStep("Board Solved", `Line 29: return true;\n\nAll cells successfully filled without conflicts! The board is solved.`, 29, { board: copyGrid(board), action: 'success', isSuccess: true });
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
  const { isSuccess, action, board, currRow, currCol, attemptVal, placedVal, removedVal, conflictRow, conflictCol } = state;
  const { initialGrid } = parsedData;

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Sudoku Solver</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 37</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Matrices / Backtracking</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'backtrack' || action === 'invalid' || action === 'exhausted' ? 'bg-rose-500/20 border-rose-500' : (action === 'place' || action === 'recurse' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'backtrack' || action === 'invalid' || action === 'exhausted' ? 'rose' : (action === 'place' || action === 'recurse' ? 'emerald' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Execution State</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <VariableCard label="Active Cell" val={currRow !== undefined && currCol !== undefined ? `[${currRow}][${currCol}]` : "-"} color="purple" active={currRow !== undefined && currCol !== undefined} />
                        <VariableCard label="Attempt Digit" val={attemptVal !== undefined ? attemptVal : "-"} color="amber" active={attemptVal !== undefined} />
                        <VariableCard label="Status" val={action === 'invalid' ? "CONFLICT" : (action === 'place' ? "VALID" : (action === 'backtrack' ? "UNDO" : "-"))} color={action === 'invalid' || action === 'backtrack' ? "rose" : (action === 'place' ? "emerald" : "slate")} active={['invalid', 'place', 'backtrack'].includes(action)} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono flex items-center justify-between">
                            <span>Initial Board (9 lines)</span>
                            <span className="text-slate-400 normal-case tracking-normal">(Edit me!)</span>
                        </label>
                        <textarea 
                            value={boardInput} 
                            onChange={(e) => { setBoardInput(e.target.value); setCurrentStep(0); }} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700 min-h-[140px] resize-none whitespace-pre" 
                            rows={9}
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'backtrack' || action === 'invalid' || action === 'exhausted' ? 'bg-rose-900 border-rose-800' : (action === 'place' || action === 'recurse' ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'invalid' ? <XSquare size={100}/> : (action === 'backtrack' ? <RotateCcw size={100}/> : (action === 'place' ? <CheckSquare size={100}/> : <Grid3X3 size={100}/>)))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'backtrack' || action === 'invalid' || action === 'exhausted' ? 'text-rose-400' : (action === 'place' || action === 'recurse' ? 'text-emerald-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'backtrack' || action === 'invalid' || action === 'exhausted' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action === 'place' || action === 'recurse' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
                        <div className="px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter bg-slate-800 text-slate-400 border border-slate-700">Step {currentStep + 1}</div>
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-8 overflow-y-auto overflow-x-hidden">
                      
                      {board && (
                          <div className="bg-slate-800 p-2 rounded-xl shadow-xl w-max mx-auto border-4 border-slate-700">
                              <div className="grid grid-cols-9 grid-rows-9 gap-0 border-2 border-slate-900 bg-slate-900">
                                  {board.map((rowArr, i) => (
                                      rowArr.map((cellVal, j) => {
                                          
                                          let isOriginal = initialGrid[i][j] !== '.';
                                          let isCurrentCell = currRow === i && currCol === j && !isSuccess;
                                          let isConflict = conflictRow === i && conflictCol === j && !isSuccess && action === 'invalid';
                                          
                                          // Identify if cell is currently being evaluated for 'isValid' highlighting
                                          let isEvaluatedZone = false;
                                          if (isCurrentCell && (action === 'try' || action === 'invalid')) {
                                              isEvaluatedZone = true;
                                          } else if (currRow !== undefined && currCol !== undefined && !isSuccess && (action === 'try' || action === 'invalid')) {
                                              if (i === currRow || j === currCol) isEvaluatedZone = true;
                                              let br1 = Math.floor(i / 3), bc1 = Math.floor(j / 3);
                                              let br2 = Math.floor(currRow / 3), bc2 = Math.floor(currCol / 3);
                                              if (br1 === br2 && bc1 === bc2) isEvaluatedZone = true;
                                          }

                                          let displayVal = cellVal === '.' ? '' : cellVal;
                                          if (isCurrentCell && (action === 'try' || action === 'invalid')) {
                                              displayVal = attemptVal;
                                          } else if (isCurrentCell && action === 'backtrack') {
                                              displayVal = removedVal; // Show fading out
                                          }

                                          // Borders for 3x3
                                          let borderClasses = "border border-slate-700/50 ";
                                          if ((j + 1) % 3 === 0 && j !== 8) borderClasses += "border-r-slate-900 border-r-4 ";
                                          if ((i + 1) % 3 === 0 && i !== 8) borderClasses += "border-b-slate-900 border-b-4 ";

                                          let bgClass = "bg-white ";
                                          let textClass = "text-slate-800 ";

                                          if (isOriginal) {
                                              bgClass = "bg-slate-100 ";
                                              textClass = "text-slate-400 font-bold ";
                                          } else if (cellVal !== '.' && !isCurrentCell) {
                                              // Safely placed previously
                                              bgClass = "bg-emerald-50 ";
                                              textClass = "text-emerald-600 font-bold ";
                                          }

                                          if (isSuccess) {
                                              bgClass = isOriginal ? "bg-emerald-50 " : "bg-emerald-200 ";
                                              textClass = "text-emerald-800 font-bold ";
                                          } else if (isConflict) {
                                              bgClass = "bg-rose-500 animate-pulse z-10 ";
                                              textClass = "text-white font-black scale-125 ";
                                          } else if (isCurrentCell) {
                                              if (action === 'invalid') {
                                                  bgClass = "bg-rose-200 ring-2 ring-rose-400 z-20 ";
                                                  textClass = "text-rose-700 font-black ";
                                              } else if (action === 'place') {
                                                  bgClass = "bg-emerald-400 ring-4 ring-emerald-300 z-20 scale-110 ";
                                                  textClass = "text-white font-black ";
                                              } else if (action === 'backtrack') {
                                                  bgClass = "bg-amber-200 ring-2 ring-amber-400 z-20 ";
                                                  textClass = "text-amber-700 font-black opacity-50 line-through ";
                                              } else {
                                                  // Try or findEmpty
                                                  bgClass = "bg-violet-300 ring-4 ring-violet-400 z-20 scale-110 ";
                                                  textClass = "text-violet-900 font-black ";
                                              }
                                          } else if (isEvaluatedZone) {
                                              bgClass = "bg-violet-50 ";
                                          }

                                          return (
                                              <div 
                                                key={`cell-${i}-${j}`} 
                                                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-mono text-lg md:text-xl transition-all duration-200 ${borderClasses} ${bgClass}`}
                                              >
                                                  <span className={`transition-all duration-200 ${textClass}`}>
                                                      {displayVal}
                                                  </span>
                                              </div>
                                          );
                                      })
                                  ))}
                              </div>
                          </div>
                      )}

                      {!isSuccess && action === 'invalid' && (
                          <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-6 py-3 rounded-xl font-mono font-bold text-sm animate-in zoom-in flex items-center gap-2">
                              <ShieldAlert size={18} /> Validating Rule Broken!
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">PUZZLE SOLVED</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  All Constraints Satisfied
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
                Backtracking is a brute-force algorithmic technique that solves problems recursively by trying to build a solution incrementally, one piece at a time. If it realizes that a piece doesn't fit the rules, it instantly removes it ("backtracks") and tries the next option.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> 1. Choose
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We scan the board left-to-right, top-to-bottom, looking for the first empty cell (<code>'.'</code>).
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p>Once found, we sequentially guess numbers from <code>'1'</code> to <code>'9'</code>.</p>
                            <p>We use an <code>isValid</code> helper function to verify if the number exists in the same row, column, or 3x3 block. If it's valid, we place it!</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <GitBranch size={18}/> 2. Explore & 3. Un-choose
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            After placing a number, we recursively call the <code>solve()</code> function again.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>The new call starts scanning from the top again. If it completely solves the board, it returns <code>true</code> all the way up.</p>
                            <p>But if it gets stuck (an empty cell has no valid 1-9 options), it returns <code>false</code>. This triggers the "Un-choose": we revert our cell back to <code>'.'</code> and loop to the next number!</p>
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
                        "Sudoku Solver is a classic Constraint Satisfaction Problem perfectly suited for Backtracking. My algorithm iterates through the board until it finds an empty cell. It then attempts to place digits 1 through 9. For each digit, it calls a helper function that checks the row, column, and 3x3 block constraints. If the digit is valid, I tentatively place it and recursively call `solve()` to attack the remaining board. If the recursive call eventually hits a dead end and returns false, the algorithm backtracks by resetting the cell to `.` and tries the next valid digit. The time complexity is bounded by $O(9^M)$ where M is the number of empty cells, but aggressive pruning via the constraint check drastically reduces the actual search space. The space complexity is $O(1)$ auxiliary, ignoring the implicit call stack."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we optimize isValid()?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Yes. Currently, <code>isValid</code> loops 9 times for every guess. We can optimize this heavily by pre-computing constraints using <strong>Bitmasking</strong> or three Arrays of HashSets (one for rows, cols, and boxes). When placing a number, we flip a bit to register it. Checking validity becomes an $O(1)$ bitwise AND operation instead of an $O(9)$ loop!
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(9<sup>M</sup>)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Where M is the number of empty cells. In the absolute worst case, we might have 9 branches for every empty cell. (Practically much faster due to rules).</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We modify the board in-place. The only extra memory is the call stack, which can go at most 81 levels deep. Since 81 is a constant, space is $O(1)$.</p>
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

interface VariableCardProps {
  label: string;
  val: any;
  color: string;
  active: boolean;
}

const VariableCard: React.FC<VariableCardProps> = ({ label, val, color, active }) => {
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

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|solveSudoku|solve|isValid|board|row|col)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['solveSudoku', 'solve', 'isValid'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['board', 'row', 'col'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SudokuVisualizer;