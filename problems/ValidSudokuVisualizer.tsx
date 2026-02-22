import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Timer, ShieldAlert, Database, 
  Grid3X3, Search, Fingerprint, Eye, Hash, ShieldCheck
} from 'lucide-react';

const APPROACHES = {
  booleanArrays: {
    id: 'booleanArrays',
    title: '1. Arrays of Booleans',
    subtitle: 'Optimal: Track seen digits using 2D arrays.',
    icon: <Grid3X3 size={16} />,
    complexity: 'Time: O(N²) | Space: O(N²)',
    code: `class Solution {
    public boolean isValidSudoku(char[][] board) {
        // 9 rows, 9 cols, 9 sub-boxes. Each tracks digits 1-9.
        boolean[][] rows = new boolean[9][9];
        boolean[][] cols = new boolean[9][9];
        boolean[][] boxes = new boolean[9][9];
        
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    continue;
                }
                
                int val = board[r][c] - '1'; // Map '1'-'9' to 0-8
                int boxIdx = (r / 3) * 3 + (c / 3);
                
                // If the value was already seen, it's invalid!
                if (rows[r][val] || cols[c][val] || boxes[boxIdx][val]) {
                    return false;
                }
                
                // Mark the value as seen
                rows[r][val] = true;
                cols[c][val] = true;
                boxes[boxIdx][val] = true;
            }
        }
        
        return true;
    }
}`,
    explanation: "The most efficient approach. Since the board is strictly 9x9, we can initialize three 9x9 boolean arrays to track which digits we've seen in which row, column, and 3x3 sub-box. When we encounter a digit, we map it to an index (0-8) and calculate its 3x3 box index. If any of our tracking arrays already say 'true' for this digit in this region, the Sudoku is invalid."
  },
  hashSet: {
    id: 'hashSet',
    title: '2. HashSet of Strings',
    subtitle: 'Intuitive: Encode coordinates into strings.',
    icon: <Database size={16} />,
    complexity: 'Time: O(N²) | Space: O(N²)',
    code: `class Solution {
    public boolean isValidSudoku(char[][] board) {
        Set<String> seen = new HashSet<>();
        
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                char number = board[i][j];
                
                if (number != '.') {
                    // Set.add() returns false if the element already exists
                    if (!seen.add(number + " in row " + i) ||
                        !seen.add(number + " in col " + j) ||
                        !seen.add(number + " in block " + i/3 + "-" + j/3)) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
}`,
    explanation: "A highly readable and intuitive approach, perfect for interviews if you want to write clean code quickly. We encode the constraints into descriptive strings (e.g., '5 in row 0', '5 in col 0', '5 in block 0-0'). Since a HashSet cannot contain duplicate elements, `seen.add()` will return `false` if the string already exists, instantly letting us know a rule was violated."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">36. Valid Sudoku</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Determine if a <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono font-bold">9 x 9</code> Sudoku board is valid. Only the filled cells need to be validated <strong>according to three core rules</strong>. Empty cells are denoted by the character <code className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">'.'</code> and must be completely ignored during validation.
        </p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 space-y-6 shadow-sm mt-8">
            <h3 className="font-black text-indigo-900 uppercase tracking-widest text-sm flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-500" /> The 3 Rules of Validity
            </h3>
            <ul className="space-y-5 text-indigo-900 list-none p-0 m-0">
                <li className="flex gap-4 items-start">
                    <div className="bg-indigo-200 text-indigo-800 font-black w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5">1</div>
                    <div className="leading-relaxed"><strong>Row Constraint:</strong> Each of the 9 rows must contain the digits <code className="bg-indigo-100 px-1 rounded text-indigo-700">1-9</code> without repetition.</div>
                </li>
                <li className="flex gap-4 items-start">
                    <div className="bg-indigo-200 text-indigo-800 font-black w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5">2</div>
                    <div className="leading-relaxed"><strong>Column Constraint:</strong> Each of the 9 columns must contain the digits <code className="bg-indigo-100 px-1 rounded text-indigo-700">1-9</code> without repetition.</div>
                </li>
                <li className="flex gap-4 items-start">
                    <div className="bg-indigo-200 text-indigo-800 font-black w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5">3</div>
                    <div className="leading-relaxed"><strong>Sub-box Constraint:</strong> The board is divided into nine non-overlapping <code className="bg-indigo-100 px-1 rounded text-indigo-700">3 x 3</code> sub-boxes. Each of these sub-boxes must contain the digits <code>1-9</code> without repetition.</div>
                </li>
            </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm flex gap-4 items-start shadow-sm mt-8">
            <AlertCircle className="shrink-0 mt-1 text-amber-500" size={24} />
            <div className="space-y-2">
                <p className="font-black uppercase tracking-widest text-[11px] text-amber-600 mb-1">Crucial Distinction</p>
                <p className="text-base font-bold text-amber-900">Valid vs. Solvable</p>
                <p className="leading-relaxed opacity-90">This problem does <strong>not</strong> ask you to solve the Sudoku. A partially filled board could be completely valid (meaning there are no immediate rule violations) but still be fundamentally unsolvable. We only care about the <em>current state</em> of the board and whether any of the currently filled cells conflict with each other.</p>
            </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
               <Grid3X3 size={16} /> What is a 3x3 Sub-box?
           </h3>
           <p className="text-sm leading-relaxed text-slate-500 bg-slate-50 p-6 rounded-2xl border border-slate-100">
             The 9x9 grid is split into 9 distinct 3x3 areas. For example, the top-left box contains rows 0, 1, 2 and columns 0, 1, 2. If there is a '5' anywhere in this specific 3x3 area, no other cell in this exact 3x3 area can be a '5', regardless of what row or column they are in.
           </p>
        </div>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              {/* Visually Rendered Sudoku Grid for Example 1 */}
              <div className="grid grid-cols-9 bg-slate-400 border-4 border-slate-800 w-fit shadow-lg mb-4">
                  {[
                      ["5","3",".",".","7",".",".",".","."],
                      ["6",".",".","1","9","5",".",".","."],
                      [".","9","8",".",".",".",".","6","."],
                      ["8",".",".",".","6",".",".",".","3"],
                      ["4",".",".","8",".","3",".",".","1"],
                      ["7",".",".",".","2",".",".",".","6"],
                      [".","6",".",".",".",".","2","8","."],
                      [".",".",".","4","1","9",".",".","5"],
                      [".",".",".",".","8",".",".","7","9"]
                  ].map((row, r) => row.map((cell, c) => {
                      const isRightBorder = c === 2 || c === 5;
                      const isBottomBorder = r === 2 || r === 5;
                      const borderClasses = (isRightBorder ? 'border-r-4 border-r-slate-800 ' : 'border-r border-r-slate-300 ') + (isBottomBorder ? 'border-b-4 border-b-slate-800' : 'border-b border-b-slate-300');
                      return (
                          <div key={r + "-" + c} className={"w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-white font-bold font-sans text-sm sm:text-lg text-slate-800 " + borderClasses}>
                              {cell === '.' ? '' : cell}
                          </div>
                      );
                  }))}
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> board = [["5","3",".",".","7",".",".",".","."], ... ]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ValidSudokuVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('booleanArrays');
  const [boardInput, setBoardInput] = useState(`[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]`);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedBoard = useMemo(() => {
    try {
        const arr = JSON.parse(boardInput);
        if (!Array.isArray(arr) || arr.length !== 9) throw new Error();
        for (let row of arr) {
            if (!Array.isArray(row) || row.length !== 9) throw new Error();
        }
        return arr;
    } catch (e) {
        // Fallback to default valid board
        return [
          ["5","3",".",".","7",".",".",".","."],
          ["6",".",".","1","9","5",".",".","."],
          [".","9","8",".",".",".",".","6","."],
          ["8",".",".",".","6",".",".",".","3"],
          ["4",".",".","8",".","3",".",".","1"],
          ["7",".",".",".","2",".",".",".","6"],
          [".","6",".",".",".",".","2","8","."],
          [".",".",".","4","1","9",".",".","5"],
          [".",".",".",".","8",".",".","7","9"]
        ];
    }
  }, [boardInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const board = parsedBoard;
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      // Limit steps to prevent extreme lag
      if (steps.length > 500) return;
      steps.push({
        phase,
        description: desc,
        line,
        state: { ...state }
      });
    };

    if (selectedApproachId === 'booleanArrays') {
        let rows = Array.from({length: 9}, () => new Array(9).fill(false));
        let cols = Array.from({length: 9}, () => new Array(9).fill(false));
        let boxes = Array.from({length: 9}, () => new Array(9).fill(false));
        
        addStep("Allocate Memory", `Initializing three 9x9 boolean arrays. 'rows', 'cols', and 'boxes' will act as fast lookup tables to track which numbers (1-9) have been seen in each respective region.`, 4, { r: null, c: null, val: null, boxIdx: null });

        outer: for (let r = 0; r < 9; r++) {
            addStep("Row Iteration", `Evaluating row index r = ${r}. Entering the outer loop to process this row.`, 8, { r, c: null, val: null, boxIdx: null });
            
            for (let c = 0; c < 9; c++) {
                let char = board[r][c];
                
                addStep("Column Iteration", `Evaluating column index c = ${c}. The current cell under inspection is board[${r}][${c}].`, 9, { r, c, char, val: null, boxIdx: null });
                
                addStep("Check Empty", `Checking if the current cell contains the empty character '.'`, 10, { r, c, char, val: null, boxIdx: null });
                if (char === '.') {
                    addStep("Skip Empty Cell", `The cell board[${r}][${c}] is empty. We execute 'continue' to skip validation and proceed to the next cell.`, 11, { r, c, char, val: null, boxIdx: null });
                    continue;
                }
                
                let valNum = parseInt(char) - 1;
                let boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
                
                addStep("Calculate Indices", `The cell has digit '${char}'. We map '1'-'9' to array indices 0-8 (val = ${valNum}). We calculate its 3x3 block index: (r/3)*3 + (c/3) = ${boxIdx}.`, 14, { r, c, char, val: valNum, boxIdx });
                
                addStep("Validate Constraints", `Checking our 3 tracking arrays. Have we already seen digit '${char}' in row ${r}, col ${c}, or box ${boxIdx}?`, 18, { r, c, char, val: valNum, boxIdx, checking: true });
                
                if (rows[r][valNum] || cols[c][valNum] || boxes[boxIdx][valNum]) {
                    let conflictType = rows[r][valNum] ? "row" : cols[c][valNum] ? "column" : "sub-box";
                    addStep("Conflict Detected!", `Rule violation! The digit '${char}' was already seen in this ${conflictType}. The board is INVALID.`, 19, { r, c, char, val: valNum, boxIdx, isFailed: true, conflict: true, conflictType });
                    break outer;
                }
                
                rows[r][valNum] = true;
                cols[c][valNum] = true;
                boxes[boxIdx][valNum] = true;
                
                addStep("Mark as Seen", `No conflict found. We flag '${char}' as 'true' (seen) in our tracking arrays for row ${r}, col ${c}, and box ${boxIdx}.`, 23, { r, c, char, val: valNum, boxIdx, marked: true });
            }
        }
        
        let isValid = steps[steps.length - 1].state.isFailed !== true;
        if (isValid) {
            addStep("Verification Complete", `All filled cells have been checked without triggering a single conflict. The board is strictly VALID.`, 29, { isSuccess: true, finalAns: true });
        }
        
    } 
    else if (selectedApproachId === 'hashSet') {
        let seen = new Set<string>();
        addStep("Initialize Set", `Creating an empty HashSet of Strings. This will store unique identifiers for every digit we process.`, 3, { r: null, c: null, char: null });

        outerSet: for (let i = 0; i < 9; i++) {
            addStep("Row Iteration", `Evaluating row index i = ${i}. Entering the outer loop.`, 5, { r: i, c: null, char: null });
            
            for (let j = 0; j < 9; j++) {
                let char = board[i][j];
                addStep("Extract Character", `Evaluating column index j = ${j}. Extracting the character at board[${i}][${j}] into variable 'number'.`, 7, { r: i, c: j, char });
                
                addStep("Check if Empty", `Is the character '${char}' a valid digit? (number != '.')`, 9, { r: i, c: j, char });
                
                if (char !== '.') {
                    let rStr = `${char} in row ${i}`;
                    let cStr = `${char} in col ${j}`;
                    let bStr = `${char} in block ${Math.floor(i/3)}-${Math.floor(j/3)}`;
                    
                    addStep("Encode & Try Add", `Digit is '${char}'. We try to add three descriptive strings into the Set. If the Set already contains any of these exact strings, Set.add() will return false!`, 11, { r: i, c: j, char, checking: true, encoded: [rStr, cStr, bStr] });
                    
                    if (seen.has(rStr) || seen.has(cStr) || seen.has(bStr)) {
                        let conflictType = seen.has(rStr) ? "row" : seen.has(cStr) ? "column" : "sub-box";
                        addStep("Set Conflict!", `Set.add() evaluated to false! The string for this ${conflictType} already exists in the HashSet. Board is INVALID.`, 14, { r: i, c: j, char, isFailed: true, conflict: true, conflictType });
                        break outerSet;
                    }
                    
                    seen.add(rStr);
                    seen.add(cStr);
                    seen.add(bStr);
                    addStep("Strings Added", `No conflicts! All 3 unique strings evaluating this digit's placement were successfully added to the HashSet.`, 11, { r: i, c: j, char, marked: true, encodedSize: seen.size });
                } else {
                    addStep("Skip Empty Cell", `The cell is empty ('.'). We bypass the Set operations completely.`, 9, { r: i, c: j, char });
                }
            }
        }
        
        let isValid = steps[steps.length - 1].state.isFailed !== true;
        if (isValid) {
            addStep("Verification Complete", `Successfully traversed the entire board. No duplicate string collisions occurred in the HashSet. Returning true.`, 20, { isSuccess: true, finalAns: true });
        }
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedBoard, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const setInvalidBoard = () => {
      setBoardInput(`[["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],["8","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]`);
      setCurrentStep(0);
  };
  
  const setValidBoard = () => {
      setBoardInput(`[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]`);
      setCurrentStep(0);
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || { r: null, c: null };
  const { isSuccess, isFailed, r, c, char, val, boxIdx, checking, conflict, marked, encoded, encodedSize, finalAns, conflictType } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Grid3X3 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Valid Sudoku</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 36</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Hash Set / 2D Arrays</span>
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
              
              {/* Left Col: Code & Variable Context (5/12) */}
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

                <div className="bg-[#0f172a] rounded-3xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : isFailed ? 'bg-rose-500/20 border-rose-500' : 'bg-indigo-500/20 border-indigo-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="indigo" />
                      ))}
                  </div>
                </div>

                {/* Left Side Variables */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <VariableCard label="Row (r)" val={r ?? null} color="sky" active={r !== null && r !== undefined} />
                        <VariableCard label="Col (c)" val={c ?? null} color="violet" active={c !== null && c !== undefined} />
                        <VariableCard label="Char" val={char === '.' ? "'.'" : (char ?? null)} color="amber" active={char !== null && char !== undefined} isChar={true} />
                    </div>

                    {selectedApproachId === 'booleanArrays' && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-mono">
                             <div className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Box Calc: <span className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">(r/3)*3 + (c/3)</span></div>
                             <div className="font-black text-indigo-800">boxIdx = {boxIdx !== null && boxIdx !== undefined ? boxIdx : '?'}</div>
                        </div>
                    )}
                    
                    {selectedApproachId === 'hashSet' && encoded && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1 text-[10px] font-mono">
                             <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Encoded Strings</span>
                             {encoded.map((s: string, idx: number) => (
                                 <div key={idx} className="bg-indigo-50 text-indigo-800 px-2 py-1 rounded truncate border border-indigo-100">
                                     "{s}"
                                 </div>
                             ))}
                             <span className="text-slate-400 font-bold text-[9px] mt-1 text-right">Set Size: {encodedSize ?? '?'}</span>
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Input Board (JSON)</label>
                        <input type="text" value={boardInput} onChange={(e) => { setBoardInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner truncate" />
                    </div>

                    <div className="hidden xl:flex gap-2">
                       <button onClick={setValidBoard} className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors shadow-sm">Valid</button>
                       <button onClick={setInvalidBoard} className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors shadow-sm">Invalid</button>
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : isFailed ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <ShieldCheck size={100}/> : isFailed ? <ShieldAlert size={100}/> : <Search size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : isFailed ? "text-rose-400" : "text-indigo-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : isFailed ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[440px] items-center justify-center">
                   
                   <div className="flex flex-col w-full h-full relative z-10 items-center justify-center pt-2 pb-6">
                      
                      {/* 9x9 Sudoku Board */}
                      <div className="grid grid-cols-9 bg-slate-400 border-4 border-slate-800 shadow-xl w-fit">
                          {parsedBoard.map((row: string[], rowIndex: number) => (
                              row.map((cellChar: string, colIndex: number) => {
                                  
                                  // Determine borders for 3x3 visual
                                  const isRightBorder = colIndex === 2 || colIndex === 5;
                                  const isBottomBorder = rowIndex === 2 || rowIndex === 5;
                                  const borderClasses = `${isRightBorder ? 'border-r-4 border-r-slate-800' : 'border-r border-r-slate-300'} ${isBottomBorder ? 'border-b-4 border-b-slate-800' : 'border-b border-b-slate-300'}`;
                                  
                                  // State highlights
                                  const isCurrent = r === rowIndex && c === colIndex && r !== null && c !== null;
                                  
                                  let bgClass = "bg-white";
                                  let textClass = "text-slate-700";
                                  let scaleClass = "";
                                  let zIndex = "z-0";

                                  if (r !== null && c !== null) {
                                      // Highlight the rule regions being evaluated
                                      const inRow = rowIndex === r;
                                      const inCol = colIndex === c;
                                      const inBox = Math.floor(rowIndex/3) === Math.floor(r/3) && Math.floor(colIndex/3) === Math.floor(c/3);
                                      
                                      if (inRow || inCol || inBox) {
                                          bgClass = "bg-indigo-50";
                                          if (checking) bgClass = "bg-amber-50";
                                          if (conflict && (inRow || inCol || inBox)) {
                                              // Highlight entire region red if conflict
                                              if (conflictType === 'row' && inRow) bgClass = "bg-rose-100";
                                              if (conflictType === 'column' && inCol) bgClass = "bg-rose-100";
                                              if (conflictType === 'sub-box' && inBox) bgClass = "bg-rose-100";
                                          }
                                      }
                                  }

                                  if (isCurrent) {
                                      if (conflict) {
                                          bgClass = "bg-rose-500";
                                          textClass = "text-white";
                                          scaleClass = "scale-110 shadow-lg";
                                          zIndex = "z-20";
                                      } else if (marked) {
                                          bgClass = "bg-emerald-500";
                                          textClass = "text-white";
                                          scaleClass = "scale-110 shadow-lg";
                                          zIndex = "z-20";
                                      } else if (char !== '.') {
                                          bgClass = "bg-indigo-500";
                                          textClass = "text-white";
                                          scaleClass = "scale-110 shadow-lg";
                                          zIndex = "z-20";
                                      } else {
                                          bgClass = "bg-slate-200"; // Skipping empty
                                      }
                                  }

                                  return (
                                      <div 
                                         key={`${rowIndex}-${colIndex}`} 
                                         className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center font-bold font-mono text-lg transition-all duration-300 ${borderClasses} ${bgClass} ${textClass} ${scaleClass} ${zIndex}`}
                                      >
                                          {cellChar === '.' ? '' : cellChar}
                                      </div>
                                  )
                              })
                          ))}
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {(isSuccess || isFailed) && (
                    <div className={`absolute inset-0 z-40 flex items-center justify-center backdrop-blur-[3px] animate-in fade-in duration-500 pointer-events-none ${isSuccess ? 'bg-emerald-900/10' : 'bg-rose-900/10'}`}>
                       <div className={`bg-white border-2 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform ${isSuccess ? '-rotate-1 border-emerald-100' : 'rotate-1 border-rose-100'} pointer-events-auto`}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {isSuccess ? <ShieldCheck size={32} strokeWidth={3}/> : <X size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">
                                  {isSuccess ? 'VALID SUDOKU' : 'INVALID SUDOKU'}
                              </span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block ${isSuccess ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {isSuccess ? 'No rule violations found' : `Conflict in ${conflictType}`}
                              </span>
                              
                              <div className="bg-slate-50 border border-slate-200 px-8 py-3 rounded-2xl shadow-inner mt-2 flex flex-col items-center">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Returned Output</span>
                                  <div className={`flex gap-1 text-3xl font-mono font-black tracking-widest ${isSuccess ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {finalAns ? 'true' : 'false'}
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
                <Grid3X3 className="text-indigo-600"/> Demystifying the 3x3 Box Index
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                Checking rows and columns is trivial (`rows[r]`, `cols[c]`), but grouping 81 cells into 9 distinct 3x3 sub-boxes requires a bit of clever coordinate math.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowRight size={18}/> The Math: (r / 3) * 3 + (c / 3)
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Integer division automatically acts like `Math.floor()` in Java/C++. 
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-sky-200">
                            When you divide any index from 0 to 8 by 3, you map it into exactly three buckets: 0, 1, or 2. <br/><br/>
                            <code>r / 3</code> gives the "box row" (0, 1, or 2).<br/>
                            <code>c / 3</code> gives the "box col" (0, 1, or 2).
                        </p>
                    </div>
                    
                    <div className="p-8 bg-fuchsia-50 border border-fuchsia-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-fuchsia-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowDown size={18}/> Flattening 2D to 1D
                        </h3>
                        <p className="text-xs text-fuchsia-800 leading-relaxed mb-4">
                            We have 3 box rows and 3 box columns, making a 3x3 grid of boxes. How do we turn a (0-2, 0-2) coordinate into a single 0-8 index?
                        </p>
                        <p className="text-xs text-fuchsia-800 leading-relaxed font-bold bg-white p-3 rounded-lg border border-fuchsia-200">
                            We multiply the box row by 3, then add the box column! <br/><br/>
                            Example: Row 5, Col 7.<br/>
                            Box Row: 5 / 3 = 1<br/>
                            Box Col: 7 / 3 = 2<br/>
                            Index = 1 * 3 + 2 = <strong>5</strong>.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Fingerprint size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">HashSet vs Array</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Using a HashSet of strings (`"5 in row 2"`) is beautiful because the string itself perfectly encodes the uniqueness constraint without doing coordinate math.
                        </p>
                        <p>
                           However, string concatenation and hashing are <em>slow</em> and consume extra memory (O(1) relative to board size, but high constant factor overhead).
                        </p>
                        <div className="bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 p-4 rounded-xl mt-4 font-mono text-[10px]">
                           // HashSet String overhead:<br/>
                           Object Allocation + Hash Computation<br/><br/>
                           // Boolean Array overhead:<br/>
                           Direct memory offset lookup. Blazing fast.
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
                        "While a HashSet of encoded strings is very readable and demonstrates a solid understanding of set properties, I implemented the validation using 2D boolean arrays. Because the board size is fixed at 9x9, the boolean arrays take an absolute constant O(1) space and avoid the heavy constant-factor overhead of string concatenation and hashing. We evaluate all three rules (row, column, and sub-box) in a single pass over the board, achieving optimal O(1) time and space complexity."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why is Time/Space O(1)?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You might initially think traversing a grid is O(N²). However, Big O notation describes how the algorithm scales as the input scales. In this specific problem, the board size is fixed strictly at 9x9 (81 cells). The number of operations never changes. Therefore, both Time and Space complexity are O(1).
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-emerald-500"/> Bitmask Optimization
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                To optimize the space even further (for a slight flex in an interview), you can replace the <code>boolean[][]</code> with 3 1D integer arrays: <code>int[] rows = new int[9]</code>. Instead of a boolean matrix, you use the individual bits of the integer to track seen digits: <code>rows[r] |= (1 &lt;&lt; val)</code>.
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

const VariableCard = ({ label, val, color, active, isChar }: { label: string, val: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet' | 'fuchsia', active: boolean, isChar?: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
        fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? (isChar ? `'${val}'` : val) : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' | 'teal' | 'blue' }> = ({ num, code, active, theme = 'indigo' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|continue|char|Set|HashSet)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'boolean', 'String', 'void', 'char', 'Set', 'HashSet'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ValidSudokuVisualizer;