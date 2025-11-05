import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ListOrdered, ArrowRight, ArrowDown, ArrowLeft, ArrowUp, Hash, 
  Grid3X3, Maximize2, RefreshCw, Timer
} from 'lucide-react';

const APPROACHES = {
  simulation: {
    id: 'simulation',
    title: 'Boundary Simulation',
    subtitle: 'Optimal: O(N^2) Time, O(1) Space.',
    icon: <RefreshCw size={16} />,
    complexity: 'Time: O(N^2) | Space: O(1)', 
    code: `class Solution {
    public int[][] generateMatrix(int n) {
        int[][] matrix = new int[n][n];
        int top = 0, bottom = n - 1;
        int left = 0, right = n - 1;
        int val = 1;
        
        while (top <= bottom && left <= right) {
            // 1. Traverse Right
            for (int j = left; j <= right; j++) {
                matrix[top][j] = val++;
            }
            top++;
            
            // 2. Traverse Down
            for (int i = top; i <= bottom; i++) {
                matrix[i][right] = val++;
            }
            right--;
            
            // 3. Traverse Left
            if (top <= bottom) {
                for (int j = right; j >= left; j--) {
                    matrix[bottom][j] = val++;
                }
                bottom--;
            }
            
            // 4. Traverse Up
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    matrix[i][left] = val++;
                }
                left++;
            }
        }
        
        return matrix;
    }
}`,
    explanation: "We simulate the spiral traversal by maintaining four boundary pointers: `top`, `bottom`, `left`, and `right`. We peel the matrix layer by layer. First, we traverse from `left` to `right` along the `top` row, then shrink the `top` boundary. Next, we go from `top` to `bottom` along the `right` column, shrinking the `right` boundary. We repeat this for the `bottom` row (going left) and the `left` column (going up), shrinking boundaries as we go until the entire matrix is filled."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">59. Spiral Matrix II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a positive integer <code>n</code>, generate an <code>n x n</code> matrix filled with elements from <code>1</code> to <code>n<sup>2</sup></code> in spiral order.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1,2,3],[8,9,4],[7,6,5]]</p>
              <p className="text-slate-500 leading-relaxed">
                <span className="text-slate-400 font-bold">Explanation:</span>{"\n"}
                The matrix is filled sequentially in a spiral:
              </p>
              <pre className="text-sm font-bold text-slate-700 bg-white p-4 rounded-xl border border-slate-200 w-max">
{`[ 1, 2, 3 ]
[ 8, 9, 4 ]
[ 7, 6, 5 ]`}
              </pre>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1]]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= n &lt;= 20</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SpiralMatrixIIVisualizer = () =>{
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('simulation');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const [nInput, setNInput] = useState('3');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let n = parseInt(nInput);
    if (isNaN(n) || n < 1) n = 1;
    // Cap at 6 for UI visualizer performance and grid fitting
    if (n > 6) n = 6;
    return { n };
  }, [nInput]);

  const trace = useMemo(() => {
    const steps = [];
    let { n } = parsedData;
    
    let matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    let top = 0, bottom = n - 1;
    let left = 0, right = n - 1;
    let val = 1;

    const cloneMatrix = () => matrix.map(row => [...row]);

    steps.push({
        phase: 'Initialization',
        description: `Created an empty ${n}x${n} matrix.\nSet boundaries:\ntop = 0, bottom = ${n-1}\nleft = 0, right = ${n-1}\nNext value to place: 1`,
        line: 5,
        state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: null, c: null, dir: null, action: 'init' }
    });

    while (top <= bottom && left <= right) {
        // Traverse Right
        if (left <= right) {
            steps.push({
                phase: 'Check Condition & Traverse Right',
                description: `Moving RIGHT from col ${left} to ${right} along row ${top}.`,
                line: 8,
                state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: top, c: left, dir: 'right', action: 'eval' }
            });
            for (let j = left; j <= right; j++) {
                matrix[top][j] = val;
                steps.push({
                    phase: 'Traverse Right',
                    description: `Placed ${val} at matrix[${top}][${j}]`,
                    line: 9,
                    state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: top, c: j, dir: 'right', action: 'fill' }
                });
                val++;
            }
            top++;
            steps.push({
                phase: 'Shrink Top Boundary',
                description: `Finished top row.\nShrinking top boundary downwards: top++ (now ${top})`,
                line: 11,
                state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: null, c: null, dir: null, action: 'boundary' }
            });
        }

        // Traverse Down
        if (top <= bottom) {
            steps.push({
                phase: 'Traverse Down',
                description: `Moving DOWN from row ${top} to ${bottom} along col ${right}.`,
                line: 14,
                state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: top, c: right, dir: 'down', action: 'eval' }
            });
            for (let i = top; i <= bottom; i++) {
                matrix[i][right] = val;
                steps.push({
                    phase: 'Traverse Down',
                    description: `Placed ${val} at matrix[${i}][${right}]`,
                    line: 15,
                    state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: i, c: right, dir: 'down', action: 'fill' }
                });
                val++;
            }
            right--;
            steps.push({
                phase: 'Shrink Right Boundary',
                description: `Finished right column.\nShrinking right boundary leftwards: right-- (now ${right})`,
                line: 17,
                state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: null, c: null, dir: null, action: 'boundary' }
            });
        }

        // Traverse Left
        if (top <= bottom) {
            steps.push({
                phase: 'Check Condition & Traverse Left',
                description: `Condition top (${top}) <= bottom (${bottom}) is met.\nMoving LEFT from col ${right} down to ${left} along row ${bottom}.`,
                line: 20,
                state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: bottom, c: right, dir: 'left', action: 'eval' }
            });
            for (let j = right; j >= left; j--) {
                matrix[bottom][j] = val;
                steps.push({
                    phase: 'Traverse Left',
                    description: `Placed ${val} at matrix[${bottom}][${j}]`,
                    line: 22,
                    state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: bottom, c: j, dir: 'left', action: 'fill' }
                });
                val++;
            }
            bottom--;
            steps.push({
                phase: 'Shrink Bottom Boundary',
                description: `Finished bottom row.\nShrinking bottom boundary upwards: bottom-- (now ${bottom})`,
                line: 24,
                state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: null, c: null, dir: null, action: 'boundary' }
            });
        }

        // Traverse Up
        if (left <= right) {
            steps.push({
                phase: 'Check Condition & Traverse Up',
                description: `Condition left (${left}) <= right (${right}) is met.\nMoving UP from row ${bottom} up to ${top} along col ${left}.`,
                line: 28,
                state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: bottom, c: left, dir: 'up', action: 'eval' }
            });
            for (let i = bottom; i >= top; i--) {
                matrix[i][left] = val;
                steps.push({
                    phase: 'Traverse Up',
                    description: `Placed ${val} at matrix[${i}][${left}]`,
                    line: 30,
                    state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: i, c: left, dir: 'up', action: 'fill' }
                });
                val++;
            }
            left++;
            steps.push({
                phase: 'Shrink Left Boundary',
                description: `Finished left column.\nShrinking left boundary rightwards: left++ (now ${left})`,
                line: 32,
                state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: null, c: null, dir: null, action: 'boundary' }
            });
        }
    }

    steps.push({
        phase: 'Algorithm Complete',
        description: `Loop condition failed: boundaries have crossed.\nSuccessfully filled the matrix up to ${n*n}!`,
        line: 36,
        state: { matrix: cloneMatrix(), top, bottom, left, right, val, r: null, c: null, dir: null, action: 'complete', isSuccess: true }
    });

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
  const s = cur.state || {};
  const n = parsedData.n;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-teal-600 p-4 rounded-2xl shadow-lg shadow-teal-100 flex items-center justify-center">
                <Grid3X3 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Spiral Matrix II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 59</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Arrays / Matrix / Simulation</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-teal-600 border-teal-600 text-white shadow-teal-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-teal-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-teal-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${s.isSuccess || s.action === 'init' ? 'bg-emerald-500/20 border-emerald-500' : (s.action === 'fill' ? 'bg-cyan-500/20 border-cyan-500' : (s.action === 'boundary' ? 'bg-amber-500/20 border-amber-500' : 'bg-teal-500/20 border-teal-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={s.isSuccess || s.action === 'init' ? 'emerald' : (s.action === 'fill' ? 'cyan' : (s.action === 'boundary' ? 'amber' : 'teal'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-teal-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Pointers & Boundaries</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                        <VariableCard label="Val++" val={s.val !== null && s.val !== undefined ? s.val : "-"} color="cyan" active={true} />
                        <VariableCard label="Top" val={s.top !== null && s.top !== undefined ? s.top : "-"} color="amber" active={s.top !== null && s.top !== undefined} />
                        <VariableCard label="Bottom" val={s.bottom !== null && s.bottom !== undefined ? s.bottom : "-"} color="rose" active={s.bottom !== null && s.bottom !== undefined} />
                        <VariableCard label="Left" val={s.left !== null && s.left !== undefined ? s.left : "-"} color="indigo" active={s.left !== null && s.left !== undefined} />
                        <VariableCard label="Right" val={s.right !== null && s.right !== undefined ? s.right : "-"} color="purple" active={s.right !== null && s.right !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-teal-600 uppercase block pl-1 tracking-widest font-mono">Matrix Size (N)</label>
                        <input type="number" min="1" max="6" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500" placeholder="3" />
                        <p className="text-[9px] text-slate-400 pl-1 font-mono">Range: 1 to 6 (for visualization)</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2.5 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2.5 bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-teal-200 hover:bg-teal-700 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${s.isSuccess || s.action === 'init' ? 'bg-emerald-900 border-emerald-800' : (s.action === 'eval' ? 'bg-sky-900 border-sky-800' : (s.action === 'boundary' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {s.isSuccess || s.action === 'init' ? <Check size={100}/> : (s.action === 'boundary' ? <Maximize2 size={100}/> : (s.dir === 'right' ? <ArrowRight size={100}/> : s.dir === 'down' ? <ArrowDown size={100}/> : s.dir === 'left' ? <ArrowLeft size={100}/> : s.dir === 'up' ? <ArrowUp size={100}/> : <Activity size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={s.isSuccess || s.action === 'init' ? "text-emerald-400" : (s.action === 'eval' ? 'text-sky-400' : (s.action === 'boundary' ? 'text-amber-400' : 'text-slate-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${s.isSuccess || s.action === 'init' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (s.action === 'eval' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : (s.action === 'boundary' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'))}`}>Line {cur.line}</div>
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
                   
                   <div className="relative flex items-center justify-center p-8 bg-slate-50 border-2 border-slate-100 rounded-3xl w-full max-w-lg shadow-sm">
                      
                      {/* Subgrid Boundary Outline (Visual Cue) */}
                      {s.top !== undefined && s.bottom !== undefined && s.left !== undefined && s.right !== undefined && s.top <= s.bottom && s.left <= s.right && !s.isSuccess && (
                          <div 
                             className="absolute border-4 border-dashed border-teal-300/50 rounded-xl transition-all duration-500 pointer-events-none z-0"
                             style={{
                                 top: `calc(${s.top * (100 / n)}% + 1.5rem)`,
                                 bottom: `calc(${(n - 1 - s.bottom) * (100 / n)}% + 1.5rem)`,
                                 left: `calc(${s.left * (100 / n)}% + 1.5rem)`,
                                 right: `calc(${(n - 1 - s.right) * (100 / n)}% + 1.5rem)`,
                             }}
                          />
                      )}

                      <div 
                         className="grid gap-2 sm:gap-3 w-full h-full relative z-10" 
                         style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
                      >
                          {s.matrix && s.matrix.map((row, rIdx) => 
                              row.map((cellVal, cIdx) => {
                                  const isCurrent = s.r === rIdx && s.c === cIdx;
                                  const isFilled = cellVal !== 0;
                                  const isUnfilled = !isFilled;
                                  const isBoundaryRow = (rIdx === s.top || rIdx === s.bottom) && cIdx >= s.left && cIdx <= s.right;
                                  const isBoundaryCol = (cIdx === s.left || cIdx === s.right) && rIdx >= s.top && rIdx <= s.bottom;
                                  
                                  let cellClass = "aspect-square rounded-2xl flex items-center justify-center font-mono font-black transition-all duration-300 relative ";
                                  let textClass = "text-xl sm:text-2xl z-10 ";
                                  
                                  if (isCurrent && s.action === 'fill') {
                                      // Just filled pulse
                                      cellClass += "bg-cyan-100 border-4 border-cyan-500 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.5)] z-20";
                                      textClass += "text-cyan-700 scale-125";
                                  } else if (isCurrent && s.action === 'eval') {
                                      // Looking at it
                                      cellClass += "bg-sky-50 border-4 border-dashed border-sky-400 scale-105 z-20";
                                      textClass += "text-sky-300";
                                  } else if (isFilled) {
                                      // Already filled
                                      cellClass += "bg-teal-600 border-2 border-teal-700 shadow-sm text-white z-10";
                                      textClass += "text-white";
                                  } else {
                                      // Unfilled
                                      cellClass += "bg-white border-2 border-slate-200 shadow-inner z-0";
                                      textClass += "text-slate-200";
                                      
                                      // Subtle highlight if it's on the active boundary
                                      if (isBoundaryRow || isBoundaryCol) {
                                          cellClass += " border-dashed border-slate-300";
                                      }
                                  }

                                  return (
                                      <div key={`${rIdx}-${cIdx}`} className={cellClass}>
                                          <span className={textClass}>
                                              {isFilled ? cellVal : ''}
                                          </span>
                                          
                                          {/* Coordinates watermark */}
                                          {isUnfilled && (
                                              <span className="absolute bottom-1 right-1.5 text-[8px] font-bold text-slate-300 font-mono">
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
                  {s.isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">MATRIX FILLED</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  All {n*n} elements placed
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
                <Grid3X3 className="text-teal-600"/> Layer-by-Layer Simulation
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-teal-100 pl-6">
                To fill an <code>N x N</code> matrix in spiral order, we don't need complex math. We can simply simulate the path a person would walk around the perimeter, steadily shrinking the allowed boundaries inwards.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Maximize2 size={18}/> The Four Boundaries
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We use four integer variables to constrain our movement:
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p><strong>1. top:</strong> Represents the highest un-filled row. Starts at 0.</p>
                            <p><strong>2. bottom:</strong> Represents the lowest un-filled row. Starts at N-1.</p>
                            <p><strong>3. left:</strong> Represents the leftmost un-filled column. Starts at 0.</p>
                            <p><strong>4. right:</strong> Represents the rightmost un-filled column. Starts at N-1.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-teal-50 border border-teal-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-teal-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <RefreshCw size={18}/> The 4-Step Cycle
                        </h3>
                        <p className="text-xs text-teal-800 leading-relaxed mb-4">
                            Inside a <code>while(top &lt;= bottom && left &lt;= right)</code> loop, we do 4 traversals:
                        </p>
                        <div className="text-xs text-teal-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-teal-200 shadow-inner space-y-2">
                            <p><strong>Right:</strong> Walk along `top` row from `left` to `right`. Then `top++` to peel off that row.</p>
                            <p><strong>Down:</strong> Walk along `right` col from `top` to `bottom`. Then `right--`.</p>
                            <p><strong>Left:</strong> (Check condition!) Walk along `bottom` row from `right` to `left`. Then `bottom--`.</p>
                            <p><strong>Up:</strong> (Check condition!) Walk along `left` col from `bottom` to `top`. Then `left++`.</p>
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
                        "To solve Spiral Matrix II, I use boundary simulation. I initialize an N x N matrix and four pointers: top, bottom, left, and right, representing the edges of the un-filled area. I loop while the boundaries haven't crossed. In each iteration, I fill the top row moving right, then increment top. I fill the right column moving down, then decrement right. Crucially, I check if boundaries are still valid before filling the bottom row moving left, and the left column moving up, adjusting bottom and left respectively. This visits each cell exactly once, resulting in an O(N^2) time complexity and O(1) auxiliary space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-teal-500"/> FAQ: Why the extra 'if' conditions?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You might notice <code>if (top &lt;= bottom)</code> before traversing Left, and <code>if (left &lt;= right)</code> before traversing Up.
                                <br/><br/>
                                For a perfectly square <code>N x N</code> matrix, these inner checks are actually redundant because a square will naturally finish symmetrically! However, including them makes the exact same logic applicable to <strong>M x N</strong> matrices (like Spiral Matrix I). It is best practice to include them so your code handles non-square rectangles gracefully.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-teal-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">O(N²)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We touch every cell in the N x N matrix exactly once. Therefore, the number of operations is directly proportional to the total number of cells.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Excluding the output matrix which is required by the problem prompt, we only allocate a few integer variables (`top`, `bottom`, `left`, `right`, `val`). The auxiliary space is O(1).</p>
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
    const bgMap: Record<string, string> = {
        cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
        teal: 'bg-teal-50 border-teal-200 text-teal-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'teal' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Math|Arrays|ArrayList|generateMatrix|size|add|get|length)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Math', 'Arrays', 'ArrayList'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['generateMatrix', 'size', 'add', 'get', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['matrix', 'top', 'bottom', 'left', 'right', 'val', 'n', 'i', 'j'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SpiralMatrixIIVisualizer;
