
import React, { useState, useMemo } from 'react';
// Added missing 'List' icon to the lucide-react imports
import { 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  BookOpen, 
  Code2, 
  Check, 
  Copy, 
  Zap, 
  Trophy, 
  MessageSquare, 
  Target, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Hash, 
  Database, 
  Calculator, 
  FileText, 
  ArrowRight, 
  ArrowDown, 
  Info, 
  BarChart3, 
  X, 
  LayoutGrid,
  RefreshCw,
  MoreHorizontal,
  Compass,
  ArrowUpLeft,
  Spline,
  Timer,
  ShieldCheck,
  Binary,
  Maximize2,
  List
} from 'lucide-react';

const APPROACHES = {
  boundary: {
    id: 'boundary',
    title: '1. Boundary Shrinking',
    subtitle: 'Optimal O(M*N)',
    icon: <Maximize2 size={16} />,
    complexity: 'Time: O(M*N) | Space: O(1)',
    code: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        if (matrix.length == 0) return res;
        
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        
        while (top <= bottom && left <= right) {
            // Traverse Right
            for (int i = left; i <= right; i++) res.add(matrix[top][i]);
            top++;
            
            // Traverse Down
            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);
            right--;
            
            if (top <= bottom) {
                // Traverse Left
                for (int i = right; i >= left; i--) res.add(matrix[bottom][i]);
                bottom--;
            }
            
            if (left <= right) {
                // Traverse Up
                for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
                left--;
            }
        }
        return res;
    }
}`,
    explanation: "This approach treats the matrix as a series of nested layers. We define four pointers: top, bottom, left, and right. After processing a boundary (e.g., the top row), we 'shrink' that boundary inward. The checks inside the loop ensure we don't double-process rows or columns in non-square matrices."
  }
};

const DEFAULT_MATRIX = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12]
];

const SpiralMatrixVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [matrixInput, setMatrixInput] = useState(JSON.stringify(DEFAULT_MATRIX));
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const matrix = useMemo(() => {
    try {
      return JSON.parse(matrixInput);
    } catch {
      return DEFAULT_MATRIX;
    }
  }, [matrixInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const res: number[] = [];
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          res: [...res],
          ...state 
        } 
      });
    };

    addStep("Entry", "Method called. Initializing results list.", 3, { top: 0, bottom: rows - 1, left: 0, right: cols - 1 });
    
    if (rows === 0) {
      addStep("Guard Clause", "Empty matrix detected. Returning empty list.", 4, { finished: true });
      return steps;
    }

    let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
    addStep("Init Boundaries", `Pointers set: top=${top}, bottom=${bottom}, left=${left}, right=${right}.`, 6, { top, bottom, left, right });

    while (top <= bottom && left <= right) {
      addStep("While Loop", `Boundary check: top(${top}) <= bottom(${bottom}) and left(${left}) <= right(${right}).`, 9, { top, bottom, left, right });

      // Traverse Right
      addStep("Loop: Right", `Processing top row (index ${top}) from index ${left} to ${right}.`, 11, { top, bottom, left, right, dir: 'right' });
      for (let i = left; i <= right; i++) {
        res.push(matrix[top][i]);
        addStep("Traversing", `Added ${matrix[top][i]} from [${top}, ${i}].`, 11, { top, bottom, left, right, dir: 'right', active: [top, i] });
      }
      top++;
      addStep("Boundary Shrink", "Finished top row. Shifting 'top' boundary down.", 12, { top, bottom, left, right, dir: 'right' });

      // Traverse Down
      addStep("Loop: Down", `Processing right column (index ${right}) from index ${top} to ${bottom}.`, 15, { top, bottom, left, right, dir: 'down' });
      for (let i = top; i <= bottom; i++) {
        res.push(matrix[i][right]);
        addStep("Traversing", `Added ${matrix[i][right]} from [${i}, ${right}].`, 15, { top, bottom, left, right, dir: 'down', active: [i, right] });
      }
      right--;
      addStep("Boundary Shrink", "Finished right column. Shifting 'right' boundary left.", 16, { top, bottom, left, right, dir: 'down' });

      // Check for Bottom row
      addStep("Condition Check", `Checking if top (${top}) is still <= bottom (${bottom}) to ensure row exists.`, 18, { top, bottom, left, right });
      if (top <= bottom) {
        addStep("Loop: Left", `Processing bottom row (index ${bottom}) from index ${right} back to ${left}.`, 20, { top, bottom, left, right, dir: 'left' });
        for (let i = right; i >= left; i--) {
          res.push(matrix[bottom][i]);
          addStep("Traversing", `Added ${matrix[bottom][i]} from [${bottom}, ${i}].`, 20, { top, bottom, left, right, dir: 'left', active: [bottom, i] });
        }
        bottom--;
        addStep("Boundary Shrink", "Finished bottom row. Shifting 'bottom' boundary up.", 21, { top, bottom, left, right, dir: 'left' });
      }

      // Check for Left column
      addStep("Condition Check", `Checking if left (${left}) is still <= right (${right}) to ensure column exists.`, 24, { top, bottom, left, right });
      if (left <= right) {
        addStep("Loop: Up", `Processing left column (index ${left}) from index ${bottom} up to ${top}.`, 26, { top, bottom, left, right, dir: 'up' });
        for (let i = bottom; i >= top; i--) {
          res.push(matrix[i][left]);
          addStep("Traversing", `Added ${matrix[i][left]} from [${i}, ${left}].`, 26, { top, bottom, left, right, dir: 'up', active: [i, left] });
        }
        left++;
        addStep("Boundary Shrink", "Finished left column. Shifting 'left' boundary right.", 27, { top, bottom, left, right, dir: 'up' });
      }
    }

    addStep("Conclusion", "All boundaries have met or crossed. Spiral complete.", 31, { finished: true });

    return steps;
  }, [matrix]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES.boundary.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { res: resList, top, bottom, left, right, active, dir, finished } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-500 hover:shadow-md">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center text-white">
                <Compass size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Spiral Matrix</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-2 font-mono">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 54</span>
                <span className="opacity-60">•</span>
                <span className="font-bold text-slate-400">BOUNDARY LAB</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 animate-in fade-in duration-700">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter">54. Spiral Matrix</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed font-mono">
                  <p>Given an <code>m x n</code> <code>matrix</code>, return <em>all elements of the <code>matrix</code> in spiral order</em>.</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Hash size={16}/> Examples:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> matrix = [[1,2,3],[4,5,6],[7,8,9]]</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> [1,2,3,6,9,8,7,4,5]</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> [1,2,3,4,8,12,11,10,9,5,6,7]</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold">m == matrix.length</code></li>
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold">n == matrix[i].length</code></li>
                  <li><code>1 {'<='} m, n {'<='} 10</code></li>
                  <li><code>-100 {'<='} matrix[i][j] {'<='} 100</code></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            
            {/* Left Col: Code & Variables (4/12) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase tracking-tight text-white">Spiral.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 border-l-4 bg-emerald-500/10 border-emerald-500 transition-all duration-200 z-0" style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                    {APPROACHES.boundary.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600">
                        <Layers size={18} />
                        <h4 className="text-sm font-black uppercase tracking-widest font-mono">Boundaries</h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      <PointerBadge label="TOP" value={top} active={dir === 'right'} color="emerald" />
                      <PointerBadge label="RIGHT" value={right} active={dir === 'down'} color="blue" />
                      <PointerBadge label="BOTTOM" value={bottom} active={dir === 'left'} color="rose" />
                      <PointerBadge label="LEFT" value={left} active={dir === 'up'} color="amber" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase font-mono">Budget Met</span>
                    <span className="text-xs font-mono font-bold text-emerald-600">{resList.length} / {matrix.length * matrix[0]?.length}</span>
                  </div>
              </div>
            </div>

            {/* Right Col: Simulation (8/12) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Controls */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1 space-y-1.5 w-full">
                      <label className="text-[10px] font-black text-emerald-600 uppercase block pl-1 tracking-widest font-mono">Matrix Data (JSON)</label>
                      <input value={matrixInput} onChange={(e) => { setMatrixInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner" />
                   </div>
                   <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-6 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <ChevronLeft size={16}/> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                      Next Step <ChevronRight size={16}/>
                    </button>
                   </div>
              </div>

              {/* Action Log */}
              <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group ${finished ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <RefreshCw size={100}/>
                </div>
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <Target size={14} className="text-emerald-400"/>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono tracking-tighter">Execution Stream</span>
                   </div>
                </div>
                <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[480px] relative flex flex-col items-center justify-center overflow-hidden shadow-inner">
                {/* Result Tape */}
                <div className="absolute top-8 left-8 right-8 z-10">
                   <div className="flex items-center gap-2 mb-2">
                    <List size={14} className="text-emerald-600"/>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Result List (Spiral Order)</span>
                   </div>
                   <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none scroll-smooth">
                    {resList.map((val: number, idx: number) => (
                      <div key={idx} className="w-10 h-10 bg-emerald-600 text-white border-2 border-emerald-700 flex items-center justify-center font-mono font-black rounded-xl shadow-lg shrink-0 animate-in zoom-in">
                        {val}
                      </div>
                    ))}
                    {!finished && <div className="w-10 h-10 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center rounded-xl shrink-0 animate-pulse" />}
                   </div>
                </div>

                {/* Matrix Grid */}
                <div className="relative pt-24">
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 1}, minmax(0, 1fr))` }}>
                        {matrix.map((row: number[], rIdx: number) => (
                            row.map((val: number, cIdx: number) => {
                                const isVisited = resList.includes(val) && !(active?.[0] === rIdx && active?.[1] === cIdx);
                                const isActive = active?.[0] === rIdx && active?.[1] === cIdx;
                                const isBoundary = rIdx === top || rIdx === bottom || cIdx === left || cIdx === right;
                                
                                return (
                                    <div 
                                        key={`${rIdx}-${cIdx}`}
                                        className={`
                                            w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-mono font-black text-lg transition-all duration-300 relative
                                            ${isActive ? 'bg-emerald-600 text-white border-emerald-700 scale-110 shadow-2xl z-20 ring-4 ring-emerald-100' : 
                                              isVisited ? 'bg-slate-100 text-slate-400 border-slate-100' : 
                                              isBoundary ? 'bg-white border-indigo-200 text-slate-800' :
                                              'bg-white border-slate-100 text-slate-300'}
                                        `}
                                    >
                                        {val}
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                    
                    {/* Boundary Visualizers */}
                    {!finished && (
                        <>
                            <BoundaryLine type="top" index={top} count={matrix[0]?.length} active={dir === 'right'} />
                            <BoundaryLine type="bottom" index={bottom} count={matrix[0]?.length} active={dir === 'left'} />
                            <BoundaryLine type="left" index={left} count={matrix.length} active={dir === 'up'} />
                            <BoundaryLine type="right" index={right} count={matrix.length} active={dir === 'down'} />
                        </>
                    )}
                </div>

                {/* Success Overlay */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-emerald-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-emerald-100 px-12 py-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Spiral Complete</span>
                        <div className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums font-mono italic underline decoration-emerald-100 decoration-8 underline-offset-8">
                           {resList.length} Elements
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <BookOpen className="text-emerald-600"/> The Mechanics of Spiral Traversal
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-emerald-100 pl-6">
                Spiral Matrix is an exercise in <strong>State Management</strong>. The primary challenge isn't just visiting nodes, but correctly shrinking the search space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-emerald-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Layers size={18}/> Boundary Shrinking Pattern</h3>
                        <p className="text-sm text-emerald-800 leading-relaxed italic border-l-2 border-emerald-200 pl-4 font-black">
                          "Treat the matrix as nested loops of edges."
                        </p>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                          By maintaining 4 cursors, we define a rectangle. Every time we process an entire edge (like the top row), that edge is "burnt" and no longer part of the valid matrix. Moving <code>top++</code> is a physical representation of that burn.
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><AlertCircle size={18}/> The Rectangular Trap</h3>
                        <p className="text-sm text-amber-700 leading-relaxed">
                          In non-square matrices (e.g., 3x5), it is easy to double-process the middle row or column. This is why the <code>if (top {'<='} bottom)</code> checks inside the loop are mandatory. They ensure that after the <code>top++</code> or <code>right--</code> operations, the remaining matrix still has dimensions.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Timer size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Asymptotic Complexity</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono tracking-tighter">Time Complexity</span>
                          <div className="font-mono text-lg font-bold text-emerald-300">O(M &times; N)</div>
                          <p className="text-[9px] text-slate-400 mt-2 uppercase font-black tracking-widest">M rows, N columns. Every element is visited exactly once.</p>
                      </div>
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono tracking-tighter">Space Complexity</span>
                          <div className="font-mono text-lg font-bold text-emerald-300">O(1)</div>
                          <p className="text-[9px] text-slate-400 mt-2 uppercase font-black tracking-widest">Auxiliary space beyond result list. Just 4 pointers.</p>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500 font-mono">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "Traversing a matrix in spiral order is a problem of defining dynamic invariants. I implemented a boundary-shrink strategy that maintains four pointers: top, bottom, left, and right. These pointers define the 'unvisited' rectangle. By processing edges in clockwise cycles and immediately adjusting boundaries, I ensure O(M &times; N) time complexity with O(1) auxiliary space. The specific conditional checks for the bottom row and left column are critical for correctness in non-square matrices, preventing duplicate processing of elements in the final inner layer."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-black tracking-tight">
                        <MessageSquare className="text-emerald-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-black underline underline-offset-4 decoration-emerald-200">"Why the inner checks?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                                "In a rectangular matrix like 1x5, we finish the 'Right' traversal and `top++` makes top &gt; bottom. Without checking `top &lt;= bottom` again, we would attempt a 'Left' traversal on an already processed row."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-black underline underline-offset-4 decoration-emerald-200">"Alternative Approaches?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                                "We could use a 'Direction Array' [0, 1], [1, 0], etc., and a 'Seen' boolean matrix. While more generic, it uses O(M*N) extra space. The boundary method is more memory-frugal."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-emerald-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-black">
                        <ShieldCheck size={20}/> Leadership Principles
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-200 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-emerald-900 uppercase tracking-tight font-black">Bias for Action: Guard Rails</p>
                              <p className="text-xs text-emerald-800 leading-relaxed mt-1 font-mono">Always mention <code>if (matrix.length == 0)</code>. Handling empty or malformed inputs is the hallmark of production-ready code.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-200 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-emerald-900 uppercase tracking-tight font-black">Dive Deep: Boundary Conditions</p>
                              <p className="text-xs text-emerald-800 leading-relaxed mt-1 font-mono">Discuss the 1x1, 1xN, and Mx1 edge cases. Proving your code works on these extremes shows deep architectural rigor.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Binary className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter font-black underline decoration-emerald-100 decoration-8">Data Flow</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-black">Input Complexity</span>
                                <span className="text-emerald-500 font-black font-mono">O(M&times;N)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-black">Pointer Memory</span>
                                <span className="text-indigo-500 font-black font-mono">O(1)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-50 w-[5%]" />
                            </div>
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

const PointerBadge = ({ label, value, active, color }: { label: string, value: number, active: boolean, color: string }) => {
    const colors: any = {
        emerald: active ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-emerald-50 border-emerald-100 text-emerald-700',
        blue: active ? 'bg-blue-600 border-blue-700 text-white' : 'bg-blue-50 border-blue-100 text-blue-700',
        rose: active ? 'bg-rose-600 border-rose-700 text-white' : 'bg-rose-50 border-rose-100 text-rose-700',
        amber: active ? 'bg-amber-600 border-amber-700 text-white' : 'bg-amber-50 border-amber-100 text-amber-700',
    };
    return (
        <div className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${colors[color]} ${active ? 'scale-105 shadow-md' : 'opacity-60'}`}>
            <span className="text-[8px] font-black uppercase tracking-widest mb-1">{label}</span>
            <span className="text-lg font-black font-mono">{value}</span>
        </div>
    );
};

const BoundaryLine = ({ type, index, count, active }: { type: 'top' | 'bottom' | 'left' | 'right', index: number, count: number, active: boolean }) => {
    const isHorizontal = type === 'top' || type === 'bottom';
    const offset = index * 64; // w-14 (56px) + gap-2 (8px)

    const styles: any = {
        top: { top: offset - 8, left: 0, width: '100%', height: '2px' },
        bottom: { top: offset + 64 - 2, left: 0, width: '100%', height: '2px' },
        left: { left: offset - 8, top: 0, height: '100%', width: '2px' },
        right: { left: offset + 64 - 2, top: 0, height: '100%', width: '2px' },
    };

    return (
        <div 
            className={`absolute z-10 transition-all duration-500 rounded-full ${active ? 'bg-emerald-500 scale-105 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-200/50'}`}
            style={styles[type]}
        />
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|void|String|boolean|new|this|for|char|List|ArrayList|Arrays|length|Math|max|min|add|charAt|valueOf)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? 'bg-emerald-500/15' : ''}`}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? 'text-emerald-400 font-bold' : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100 font-bold' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'char'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['List', 'ArrayList', 'Arrays', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['length', 'Math', 'max', 'min', 'add', 'charAt', 'valueOf'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SpiralMatrixVisualizer;
