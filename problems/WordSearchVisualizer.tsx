import React, { useState, useMemo } from 'react';
import { 
  Search, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, X, Grid, Timer, Network, ArrowUp, FlipHorizontal, 
  Hash, ShieldAlert, Zap, Repeat, MapPin, Footprints, RotateCcw, Compass, Database
} from 'lucide-react';

const APPROACHES = {
  inPlaceDFS: {
    id: 'inPlaceDFS',
    title: '1. In-Place DFS (Optimal)',
    subtitle: 'Modify the board to mark visited cells.',
    icon: <Footprints size={16} />,
    complexity: 'Time: O(M * N * 3^L) | Space: O(L)',
    code: `class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, word, i, j, 0)) return true;
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int i, int j, int index) {
        if (index == word.length()) return true;
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return false;
        if (board[i][j] != word.charAt(index)) return false;

        char temp = board[i][j];
        board[i][j] = '#'; // Mark as visited

        boolean found = dfs(board, word, i + 1, j, index + 1) ||
                        dfs(board, word, i - 1, j, index + 1) ||
                        dfs(board, word, i, j + 1, index + 1) ||
                        dfs(board, word, i, j - 1, index + 1);

        board[i][j] = temp; // Backtrack
        return found;
    }
}`,
    explanation: "The optimal approach. We iterate through every cell in the grid. If the cell matches the first letter of our word, we launch a Depth-First Search (DFS). To ensure we don't reuse the same cell, we temporarily change its value to '#' while exploring its neighbors. Once exploration from that cell is done, we 'backtrack' by restoring its original character."
  },
  visitedMatrix: {
    id: 'visitedMatrix',
    title: '2. DFS w/ Visited Matrix',
    subtitle: 'Use a boolean[][] to track visited cells.',
    icon: <Grid size={16} />,
    complexity: 'Time: O(M * N * 3^L) | Space: O(M * N)',
    code: `class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        boolean[][] visited = new boolean[m][n];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, word, i, j, 0, visited)) return true;
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int i, int j, int index, boolean[][] visited) {
        if (index == word.length()) return true;
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return false;
        if (visited[i][j] || board[i][j] != word.charAt(index)) return false;

        visited[i][j] = true;

        boolean found = dfs(board, word, i + 1, j, index + 1, visited) ||
                        dfs(board, word, i - 1, j, index + 1, visited) ||
                        dfs(board, word, i, j + 1, index + 1, visited) ||
                        dfs(board, word, i, j - 1, index + 1, visited);

        visited[i][j] = false; // Backtrack
        return found;
    }
}`,
    explanation: "A slightly easier to read approach that doesn't mutate the original input array. We maintain an identically sized 2D boolean array to keep track of which cells are currently in our path. It requires O(M * N) extra space, making it strictly less optimal than the in-place approach."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">79. Word Search</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          Given an <code className="bg-slate-100 px-1.5 py-0.5 rounded text-fuchsia-600 font-mono font-bold">m x n</code> grid of characters <code className="font-mono">board</code> and a string <code className="font-mono">word</code>, return <code className="font-bold text-fuchsia-700">true</code> <em>if </em> <code className="font-mono">word</code> <em> exists in the grid</em>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-fuchsia-500 pl-4 bg-fuchsia-50 py-2">
          The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-8 text-slate-700">
                 <div className="grid grid-cols-4 gap-1 bg-slate-200 p-1 rounded-lg">
                    {['A','B','C','E','S','F','C','S','A','D','E','E'].map((c, i) => {
                        const isMatch = [0, 1, 2, 6, 5, 9].includes(i); // ABCCED path
                        return (
                            <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-sm font-bold shadow-sm ${isMatch ? 'bg-fuchsia-500 text-white ring-2 ring-fuchsia-300' : 'bg-white text-slate-700'}`}>
                                {c}
                            </div>
                        );
                    })}
                 </div>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WordSearchVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('inPlaceDFS');
  const [matrixInput, setMatrixInput] = useState('[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]');
  const [wordInput, setWordInput] = useState('ABCCED');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    try {
        const board = JSON.parse(matrixInput);
        if (!Array.isArray(board) || board.length === 0 || !Array.isArray(board[0])) throw new Error();
        const word = wordInput.trim().toUpperCase();
        if (word.length === 0) throw new Error();
        return { board, word };
    } catch (e) {
        return { 
            board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], 
            word: "ABCCED" 
        };
    }
  }, [matrixInput, wordInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    let stepCount = 0;
    const MAX_STEPS = 500; // Prevent infinite loops
    
    const cloneBoard = (b: string[][]) => b.map(row => [...row]);
    let board = cloneBoard(parsedData.board);
    let word = parsedData.word;
    const m = board.length;
    const n = board[0].length;
    let visited = Array.from({length: m}, () => new Array(n).fill(false));
    let path: number[][] = [];
    let currentCallStack: { r: number, c: number, idx: number, char: string, status: string }[] = [];
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      if (stepCount++ > MAX_STEPS) return;
      steps.push({
        phase,
        description: desc,
        line,
        state: { 
            board: cloneBoard(board), 
            visited: visited.map(row => [...row]), 
            path: [...path], 
            callStack: currentCallStack.map(f => ({...f})), // Deep clone the call stack
            ...state 
        }
      });
    };

    let globalFound = false;

    const dfsInPlace = (r: number, c: number, idx: number): boolean => {
        if (stepCount > MAX_STEPS) return false;

        let frame = { r, c, idx, char: word[idx] || '', status: 'Checking Bounds' };
        currentCallStack.push(frame);

        addStep("DFS Enter", `Entered DFS for index ${idx}. Current cell: (${r}, ${c}).`, 10, { r, c, idx });

        if (idx === word.length) {
            frame.status = 'Word Found!';
            addStep("Word Found!", `Successfully matched all ${word.length} characters.`, 11, { r, c, idx, isSuccess: true });
            currentCallStack.pop();
            return true;
        }
        
        if (r < 0 || r >= m || c < 0 || c >= n) {
            frame.status = 'Out of Bounds';
            addStep("Base Case Failed", `Cell (${r}, ${c}) is outside the grid bounds. Return false.`, 12, { r, c, idx, isFailed: true });
            currentCallStack.pop();
            return false;
        }

        if (board[r][c] !== word[idx]) {
            frame.status = 'Char Mismatch';
            addStep("Mismatch", `Grid char '${board[r][c]}' != target '${word[idx]}'. Return false.`, 13, { r, c, idx, isFailed: true });
            currentCallStack.pop();
            return false;
        }

        let temp = board[r][c];
        board[r][c] = '#';
        path.push([r, c]);
        frame.status = 'Marking Visited';
        addStep("Match & Mark", `Matches! Marking cell (${r}, ${c}) as '#' and exploring 4 neighbors.`, 16, { r, c, idx, charMatch: true });

        // Explore neighbors
        frame.status = 'Exploring Down ↓';
        addStep("Dive Down", `Trying direction: Down (${r+1}, ${c}).`, 18, { r, c, idx });
        if (dfsInPlace(r + 1, c, idx + 1)) { currentCallStack.pop(); return true; }
        
        frame.status = 'Exploring Up ↑';
        addStep("Dive Up", `Down failed. Trying direction: Up (${r-1}, ${c}).`, 19, { r, c, idx });
        if (dfsInPlace(r - 1, c, idx + 1)) { currentCallStack.pop(); return true; }
        
        frame.status = 'Exploring Right →';
        addStep("Dive Right", `Up failed. Trying direction: Right (${r}, ${c+1}).`, 20, { r, c, idx });
        if (dfsInPlace(r, c + 1, idx + 1)) { currentCallStack.pop(); return true; }
        
        frame.status = 'Exploring Left ←';
        addStep("Dive Left", `Right failed. Trying direction: Left (${r}, ${c-1}).`, 21, { r, c, idx });
        if (dfsInPlace(r, c - 1, idx + 1)) { currentCallStack.pop(); return true; }

        board[r][c] = temp;
        path.pop();
        frame.status = 'Backtracking';
        addStep("Backtrack", `All 4 neighbors returned false! Restoring cell (${r}, ${c}) to '${temp}' and popping stack.`, 23, { r, c, idx, isBacktrack: true });

        currentCallStack.pop();
        return false;
    };

    const dfsVisited = (r: number, c: number, idx: number): boolean => {
        if (stepCount > MAX_STEPS) return false;

        let frame = { r, c, idx, char: word[idx] || '', status: 'Checking Bounds' };
        currentCallStack.push(frame);

        addStep("DFS Enter", `Entered DFS for index ${idx}. Current cell: (${r}, ${c}).`, 11, { r, c, idx });

        if (idx === word.length) {
            frame.status = 'Word Found!';
            addStep("Word Found!", `Successfully matched all ${word.length} characters.`, 12, { r, c, idx, isSuccess: true });
            currentCallStack.pop();
            return true;
        }
        
        if (r < 0 || r >= m || c < 0 || c >= n) {
            frame.status = 'Out of Bounds';
            addStep("Base Case Failed", `Cell (${r}, ${c}) is outside bounds. Return false.`, 13, { r, c, idx, isFailed: true });
            currentCallStack.pop();
            return false;
        }

        if (visited[r][c]) {
             frame.status = 'Already Visited';
             addStep("Base Case Failed", `Cell (${r}, ${c}) is already in current path. Return false.`, 14, { r, c, idx, isFailed: true });
             currentCallStack.pop();
             return false;
        }

        if (board[r][c] !== word[idx]) {
            frame.status = 'Char Mismatch';
            addStep("Mismatch", `Grid char '${board[r][c]}' != target '${word[idx]}'. Return false.`, 14, { r, c, idx, isFailed: true });
            currentCallStack.pop();
            return false;
        }

        visited[r][c] = true;
        path.push([r, c]);
        frame.status = 'Marking Visited';
        addStep("Match & Mark", `Matches! visited[${r}][${c}] = true. Exploring 4 neighbors.`, 16, { r, c, idx, charMatch: true });

        frame.status = 'Exploring Down ↓';
        addStep("Dive Down", `Trying direction: Down (${r+1}, ${c}).`, 18, { r, c, idx });
        if (dfsVisited(r + 1, c, idx + 1)) { currentCallStack.pop(); return true; }
        
        frame.status = 'Exploring Up ↑';
        addStep("Dive Up", `Down failed. Trying direction: Up (${r-1}, ${c}).`, 19, { r, c, idx });
        if (dfsVisited(r - 1, c, idx + 1)) { currentCallStack.pop(); return true; }
        
        frame.status = 'Exploring Right →';
        addStep("Dive Right", `Up failed. Trying direction: Right (${r}, ${c+1}).`, 20, { r, c, idx });
        if (dfsVisited(r, c + 1, idx + 1)) { currentCallStack.pop(); return true; }
        
        frame.status = 'Exploring Left ←';
        addStep("Dive Left", `Right failed. Trying direction: Left (${r}, ${c-1}).`, 21, { r, c, idx });
        if (dfsVisited(r, c - 1, idx + 1)) { currentCallStack.pop(); return true; }

        visited[r][c] = false;
        path.pop();
        frame.status = 'Backtracking';
        addStep("Backtrack", `All 4 neighbors returned false! visited[${r}][${c}] = false. Popping stack.`, 23, { r, c, idx, isBacktrack: true });

        currentCallStack.pop();
        return false;
    };

    addStep("Initialization", `Grid is ${m}x${n}. Target word is "${word}". Scanning grid...`, 3, { r: null, c: null, idx: null });

    for (let i = 0; i < m && !globalFound && stepCount <= MAX_STEPS; i++) {
        for (let j = 0; j < n && !globalFound && stepCount <= MAX_STEPS; j++) {
            addStep("Grid Scan", `Checking if board[${i}][${j}] starts a valid path.`, 5, { r: i, c: j, idx: 0, scanning: true });
            if (board[i][j] === word[0]) {
                if (selectedApproachId === 'inPlaceDFS') {
                    if (dfsInPlace(i, j, 0)) {
                        globalFound = true;
                    }
                } else {
                    if (dfsVisited(i, j, 0)) {
                        globalFound = true;
                    }
                }
            }
        }
    }

    if (!globalFound) {
        addStep("Search Exhausted", `Scanned the entire grid. Word "${word}" does not exist. Returning false.`, 8, { r: null, c: null, idx: null, isFailedFinal: true });
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
  const state = cur.state || { board: parsedData.board, visited: [], path: [], callStack: [] };
  const { isSuccess, isFailed, isFailedFinal, board, visited, path, callStack, r, c, idx, charMatch, isBacktrack, scanning } = state;
  const m = board.length;
  const n = board[0].length;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-fuchsia-600 p-4 rounded-2xl shadow-lg shadow-fuchsia-100 flex items-center justify-center">
                <Compass className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Word Search</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 79</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Backtracking / DFS</span>
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
              
              {/* Left Col: Approaches, Code & Variable Context (5/12) */}
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-fuchsia-600 border-fuchsia-600 text-white shadow-fuchsia-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-fuchsia-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-fuchsia-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-fuchsia-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[330px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-fuchsia-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : isFailed || isFailedFinal ? 'bg-rose-500/20 border-rose-500' : isBacktrack ? 'bg-amber-500/20 border-amber-500' : 'bg-fuchsia-500/20 border-fuchsia-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="fuchsia" />
                      ))}
                  </div>
                </div>

                {/* Call Stack Visualizer */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3 h-[240px]">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2 text-fuchsia-600">
                          <Network size={16} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Call Stack</h4>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 font-mono">Depth: {callStack?.length || 0}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 flex flex-col-reverse gap-2 pr-2">
                        {callStack?.map((frame: any, i: number) => {
                            const isTop = i === callStack.length - 1;
                            
                            // Color code status
                            let statusColor = "text-slate-400";
                            if (isTop) {
                                if (frame.status.includes('Exploring')) statusColor = "text-blue-600";
                                else if (frame.status === 'Backtracking' || frame.status.includes('Mismatch')) statusColor = "text-amber-600";
                                else if (frame.status === 'Word Found!') statusColor = "text-emerald-600";
                                else if (frame.status === 'Out of Bounds') statusColor = "text-rose-600";
                                else statusColor = "text-fuchsia-600";
                            }

                            return (
                                <div key={i} className={`p-2.5 rounded-xl border flex justify-between items-center transition-all duration-300 ${isTop ? 'bg-fuchsia-50 border-fuchsia-300 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-mono font-bold ${isTop ? 'text-fuchsia-900' : 'text-slate-500'}`}>dfs({frame.r}, {frame.c}, idx:{frame.idx})</span>
                                        <span className={`text-[9px] uppercase tracking-widest font-bold mt-0.5 ${statusColor}`}>{frame.status}</span>
                                    </div>
                                    <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold font-mono text-xs shadow-sm">
                                        {frame.char || '-'}
                                    </div>
                                </div>
                            )
                        })}
                        {(!callStack || callStack.length === 0) && (
                            <div className="text-center text-xs font-mono italic text-slate-400 mt-4">Stack Empty (Global Context)</div>
                        )}
                    </div>
                </div>

              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-fuchsia-600 uppercase block pl-1 tracking-widest font-mono">Input Board (JSON)</label>
                        <input type="text" value={matrixInput} onChange={(e) => { setMatrixInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner" placeholder='[["A","B"],["C","D"]]' />
                    </div>
                    <div className="w-full md:w-32 space-y-1.5">
                        <label className="text-[10px] font-black text-fuchsia-600 uppercase block pl-1 tracking-widest font-mono">Target Word</label>
                        <input type="text" value={wordInput} onChange={(e) => { setWordInput(e.target.value.toUpperCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner uppercase" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-fuchsia-100 hover:bg-fuchsia-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${isFailed || isFailedFinal ? 'bg-rose-900 border-rose-800' : isSuccess ? 'bg-emerald-900 border-emerald-800' : isBacktrack ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isBacktrack ? <RotateCcw size={100}/> : <Search size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isFailed || isFailedFinal ? "text-rose-400" : isSuccess ? "text-emerald-400" : isBacktrack ? "text-amber-400" : "text-fuchsia-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isFailed || isFailedFinal ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : isBacktrack ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'}`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-center justify-center min-h-[420px]">
                   
                   {/* Target Word Display */}
                   <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-100 p-2 rounded-xl border border-slate-200 shadow-sm z-20">
                      {parsedData.word.split('').map((char: string, charIndex: number) => {
                          let statusClass = "text-slate-400 bg-white border-slate-200";
                          if (idx !== null && charIndex < idx) statusClass = "text-white bg-emerald-500 border-emerald-600 shadow-sm"; // matched
                          else if (charIndex === idx && charMatch) statusClass = "text-white bg-fuchsia-500 border-fuchsia-600 shadow-md scale-110 z-10"; // currently matching
                          else if (charIndex === idx && !charMatch) statusClass = "text-amber-600 bg-amber-100 border-amber-300 scale-105 z-10"; // evaluating
                          
                          return (
                              <div key={charIndex} className={`w-8 h-8 flex items-center justify-center font-bold font-mono rounded-lg border transition-all duration-300 ${statusClass}`}>
                                  {char}
                              </div>
                          )
                      })}
                   </div>

                   <div className="relative p-6 bg-slate-50 border border-slate-200 rounded-3xl shadow-inner mt-12">
                       <div 
                           className="grid gap-2 relative z-10" 
                           style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
                       >
                           {board.map((row: string[], rowIndex: number) => (
                               row.map((cell: string, colIndex: number) => {
                                   
                                   const isCurrent = r === rowIndex && c === colIndex;
                                   const inPath = path.some((p: number[]) => p[0] === rowIndex && p[1] === colIndex);
                                   const isVis = visited && visited[rowIndex] && visited[rowIndex][colIndex];
                                   const isHash = cell === '#';

                                   let cellStyle = "bg-white border-slate-200 text-slate-700";
                                   
                                   if (isSuccess && inPath) {
                                       cellStyle = "bg-emerald-500 border-emerald-600 text-white shadow-emerald-200 shadow-lg scale-105 z-10";
                                   } else if (isCurrent) {
                                       if (isFailed) cellStyle = "bg-rose-100 border-rose-400 text-rose-800 scale-110 shadow-md z-20";
                                       else if (charMatch) cellStyle = "bg-fuchsia-500 border-fuchsia-600 text-white scale-110 shadow-md z-20";
                                       else if (scanning) cellStyle = "bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-md z-20";
                                       else cellStyle = "bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-md z-20"; // Exploring
                                   } else if (inPath || isHash || isVis) {
                                       cellStyle = "bg-fuchsia-100 border-fuchsia-400 text-fuchsia-800 shadow-sm";
                                   }

                                   return (
                                       <div 
                                          key={`${rowIndex}-${colIndex}`} 
                                          className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-2 rounded-xl font-mono font-black text-xl transition-all duration-300 relative ${cellStyle}`}
                                       >
                                           {cell}
                                           {/* Mini coordinates */}
                                           <div className={`absolute top-1 left-1.5 text-[8px] font-sans opacity-50 ${inPath || isCurrent ? 'text-current' : 'text-slate-400'}`}>
                                              {rowIndex},{colIndex}
                                           </div>
                                       </div>
                                   );
                               })
                           ))}
                       </div>
                   </div>

                  {/* Final Overlays */}
                  {isFailedFinal && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-200 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 pointer-events-auto">
                          <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-inner">
                              <X size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">NOT FOUND</span>
                              <span className="text-xs font-black uppercase text-slate-500 tracking-widest font-mono">Word does not exist</span>
                          </div>
                      </div>
                    </div>
                  )}
                  {isSuccess && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-2 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">WORD FOUND</span>
                              <span className="text-xs font-black uppercase text-emerald-600 tracking-widest font-mono">Path successfully traced</span>
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
                <Database className="text-fuchsia-600"/> The Magic of the Call Stack
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-fuchsia-100 pl-6">
                Backtracking can feel like "magic" because it remembers exactly where to resume execution after hitting a dead end. This memory isn't stored in arrays you create; it's managed entirely by the system's <strong>Execution Call Stack</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <MapPin size={18}/> 1. Explore (The Dive)
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed italic mb-4">
                            Go as deep as possible.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed">
                            When we find a letter that matches, we "mark" it and recursively call DFS on its neighbors (Up, Down, Left, Right). <strong>Every time we call DFS, a new "Frame" is pushed onto the Call Stack.</strong> This frame pauses the current function and begins evaluating the new cell.
                        </p>
                    </div>
                    
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <RotateCcw size={18}/> 2. Backtrack (The Pop)
                        </h3>
                        <p className="text-sm text-amber-800 leading-relaxed italic mb-4">
                            Resume exactly where you paused.
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            If all 4 directions from a cell return <code>false</code>, it means this path is a dead end. We restore the cell (unmark it) and <code>return false</code>. <br/><br/><strong>Returning pops the current frame off the stack!</strong> The system immediately jumps back to the previous frame, remembering exactly which direction it was waiting on, and tries the next one.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Network size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-fuchsia-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Visualizing the Tree</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Imagine exploring a maze. You leave a breadcrumb trail. When you hit a wall, you walk backwards along your trail until you find an intersection you haven't fully explored yet.
                        </p>
                        
                        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl mt-4 font-mono text-[10px] text-fuchsia-300">
                           [DFS idx 0] Match 'A'<br/>
                           &nbsp;&nbsp;├─&gt; [DFS idx 1] Try Down (Match 'B')<br/>
                           &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;├─&gt; [DFS idx 2] Try Down (Fail)<br/>
                           &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;├─&gt; [DFS idx 2] Try Up (Fail)<br/>
                           &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;└─&gt; <span className="text-emerald-400">Backtrack! Return to 'A', try next dir.</span><br/>
                           &nbsp;&nbsp;└─&gt; [DFS idx 1] Try Right (Match 'B') ...
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
                        "I chose to implement the DFS using in-place board modification. By temporarily setting the cell to a non-alphabet character like '#', I avoid the O(M * N) auxiliary space requirement of a separate 'visited' matrix. I ensure the board is strictly restored to its original state during the backtracking phase, so there are no unintended side-effects on the input data once the function terminates."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not BFS?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Breadth-First Search (BFS) explores all neighbors simultaneously level by level. In a path-finding problem where you can't reuse cells, BFS requires maintaining a separate "visited" state for <strong>every single path currently being explored</strong> in the queue. This leads to an exponential memory explosion. DFS naturally maintains only one path in memory via the call stack.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M * N * 3<sup>L</sup>)</span>
                                <p className="text-[10px] text-slate-500 mt-1">M, N are board dimensions. L is word length. For every cell, we might explore up to 3 directions (excluding the cell we just came from) up to depth L.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(L)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The maximum depth of the recursion call stack is L (the length of the word).</p>
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

const VariableCard = ({ label, val, color, active }: { label: string, val: number | string | null, color: 'blue' | 'purple' | 'amber' | 'emerald' | 'sky' | 'violet', active: boolean }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-fuchsia-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' | 'indigo' | 'fuchsia' }> = ({ num, code, active, theme = 'fuchsia' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|char)\b|\b\d+\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'void', 'char'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-yellow-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default WordSearchVisualizer;