import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, ArrowLeft, Zap, Timer, ArrowRight, Hash, 
  Type, Grid2X2, ShieldAlert, FastForward, Edit3
} from 'lucide-react';

const APPROACHES = {
  dp: {
    id: 'dp',
    title: '2D Dynamic Programming',
    subtitle: 'Optimal: O(M×N) Time, O(M×N) Space.',
    icon: <Grid2X2 size={16} />,
    complexity: 'Time: O(M × N) | Space: O(M × N)',
    code: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    int replace = dp[i - 1][j - 1];
                    int delete  = dp[i - 1][j];
                    int insert  = dp[i][j - 1];
                    dp[i][j] = 1 + Math.min(replace, Math.min(delete, insert));
                }
            }
        }
        return dp[m][n];
    }
}`,
    explanation: "This problem is elegantly solved using 2D Dynamic Programming. We create a `dp` table of size `(m+1) x (n+1)`. `dp[i][j]` represents the minimum number of operations required to convert the first `i` characters of `word1` into the first `j` characters of `word2`. First, we initialize the base cases: converting any string to an empty string requires deleting all its characters, and converting an empty string to any string requires inserting all its characters. Then, we fill the table iteratively. If the current characters match, no new operation is needed, so we inherit the cost from `dp[i-1][j-1]`. If they mismatch, we take the minimum cost of Replacing (diagonal), Deleting (top), or Inserting (left) and add 1."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">72. Edit Distance</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two strings <code>word1</code> and <code>word2</code>, return <em>the minimum number of operations required to convert <code>word1</code> to <code>word2</code></em>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800">
          You have the following three operations permitted on a word:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium bg-slate-50 p-4 rounded-xl border border-slate-200 w-max">
            <li>Insert a character</li>
            <li>Delete a character</li>
            <li>Replace a character</li>
        </ul>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> word1 = "horse", word2 = "ros"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 3</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation:</p>
                 <ul className="list-none space-y-1">
                     <li>horse -&gt; rorse (replace 'h' with 'r')</li>
                     <li>rorse -&gt; rose (delete 'r')</li>
                     <li>rose -&gt; ros (delete 'e')</li>
                 </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> word1 = "intention", word2 = "execution"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 5</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation:</p>
                 <ul className="list-none space-y-1">
                     <li>intention -&gt; inention (remove 't')</li>
                     <li>inention -&gt; enention (replace 'i' with 'e')</li>
                     <li>enention -&gt; exention (replace 'n' with 'x')</li>
                     <li>exention -&gt; exection (replace 'n' with 'c')</li>
                     <li>exection -&gt; execution (insert 'u')</li>
                 </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>0 &lt;= word1.length, word2.length &lt;= 500</code></li>
              <li><code>word1</code> and <code>word2</code> consist of lowercase English letters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const EditDistanceVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('dp');
  const [word1Input, setWord1Input] = useState('horse');
  const [word2Input, setWord2Input] = useState('ros');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let w1 = word1Input.toLowerCase().replace(/[^a-z]/g, '');
    let w2 = word2Input.toLowerCase().replace(/[^a-z]/g, '');
    
    // UI Safeguards to prevent massive DP tables freezing the browser
    if (w1.length > 7) w1 = w1.substring(0, 7); 
    if (w2.length > 7) w2 = w2.substring(0, 7);

    return { word1: w1, word2: w2 };
  }, [word1Input, word2Input]);

  const trace = useMemo(() => {
    const steps = [];
    const { word1, word2 } = parsedData;
    const m = word1.length;
    const n = word2.length;

    const cloneDP = (dp) => dp.map(row => [...row]);

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 3000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'dp') {
        
        let dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null));

        addStep(
            "Initialization", 
            `Line 3-5: int m = ${m}; int n = ${n};\nint[][] dp = new int[${m + 1}][${n + 1}];\n\nWe initialize variables for lengths and create an empty 2D DP array. The extra +1 accommodates the 'empty string' base case.`, 
            5, 
            { dp: cloneDP(dp), i: null, j: null, action: 'init' }
        );

        addStep(
            "Base Case: Deletions", 
            `Line 7: for (int i = 0; i <= ${m}; i++)\n\nWe fill the first column. Converting any prefix of word1 to an empty word2 simply requires deleting all characters.`, 
            7, 
            { dp: cloneDP(dp), i: null, j: null, action: 'baseColStart' }
        );

        for (let i = 0; i <= m; i++) {
            dp[i][0] = i;
            addStep(
                "Set Deletion Cost", 
                `Line 8: dp[${i}][0] = ${i};\n\nCost to convert "${word1.substring(0, i)}" to "" is exactly ${i} deletions.`, 
                8, 
                { dp: cloneDP(dp), i, j: 0, action: 'baseCol' }
            );
        }

        addStep(
            "Base Case: Insertions", 
            `Line 11: for (int j = 0; j <= ${n}; j++)\n\nWe fill the first row. Converting an empty word1 to any prefix of word2 requires inserting all characters.`, 
            11, 
            { dp: cloneDP(dp), i: null, j: null, action: 'baseRowStart' }
        );

        for (let j = 0; j <= n; j++) {
            dp[0][j] = j;
            addStep(
                "Set Insertion Cost", 
                `Line 12: dp[0][${j}] = ${j};\n\nCost to convert "" to "${word2.substring(0, j)}" is exactly ${j} insertions.`, 
                12, 
                { dp: cloneDP(dp), i: 0, j, action: 'baseRow' }
            );
        }

        for (let i = 1; i <= m; i++) {
            addStep(
                "Outer Loop (word1)", 
                `Line 15: for (int i = ${i}; i <= ${m}; i++)\n\nProcessing the ${i}-th character of word1: '${word1[i-1]}'.`, 
                15, 
                { dp: cloneDP(dp), i, j: null, action: 'outerLoop' }
            );

            for (let j = 1; j <= n; j++) {
                
                addStep(
                    "Inner Loop (word2)", 
                    `Line 16: for (int j = ${j}; j <= ${n}; j++)\n\nProcessing the ${j}-th character of word2: '${word2[j-1]}'. Target cell: dp[${i}][${j}].`, 
                    16, 
                    { dp: cloneDP(dp), i, j, action: 'innerLoop' }
                );

                let char1 = word1[i-1];
                let char2 = word2[j-1];
                let isMatch = char1 === char2;

                addStep(
                    "Evaluate Match", 
                    `Line 17: if (word1.charAt(${i-1}) == word2.charAt(${j-1}))\n\nIs '${char1}' equal to '${char2}'?\n${isMatch ? 'YES! The characters match.' : 'NO. The characters differ.'}`, 
                    17, 
                    { dp: cloneDP(dp), i, j, action: 'evalMatch', isMatch, char1, char2 }
                );

                if (isMatch) {
                    dp[i][j] = dp[i-1][j-1];
                    addStep(
                        "Characters Match (Inherit Cost)", 
                        `Line 18: dp[${i}][${j}] = dp[${i-1}][${j-1}];\n\nSince '${char1}' == '${char2}', no new operation is needed! We simply inherit the cost from before these characters were added: dp[${i-1}][${j-1}] = ${dp[i-1][j-1]}.`, 
                        18, 
                        { dp: cloneDP(dp), i, j, action: 'match' }
                    );
                } else {
                    let replaceCost = dp[i-1][j-1];
                    let deleteCost = dp[i-1][j];
                    let insertCost = dp[i][j-1];

                    addStep(
                        "Mismatch Variables", 
                        `Line 20-22: Extracting costs from adjacent subproblems:\nReplace = dp[${i-1}][${j-1}] = ${replaceCost}\nDelete = dp[${i-1}][${j}] = ${deleteCost}\nInsert = dp[${i}][${j-1}] = ${insertCost}`, 
                        22, 
                        { dp: cloneDP(dp), i, j, action: 'mismatchVars', replaceCost, deleteCost, insertCost }
                    );

                    let minCost = Math.min(replaceCost, Math.min(deleteCost, insertCost));
                    dp[i][j] = 1 + minCost;

                    addStep(
                        "Calculate Minimum + 1", 
                        `Line 23: dp[${i}][${j}] = 1 + Math.min(...)\n\nWe must perform 1 operation. The cheapest prior path costs ${minCost}. Thus, dp[${i}][${j}] = 1 + ${minCost} = ${dp[i][j]}.`, 
                        23, 
                        { dp: cloneDP(dp), i, j, action: 'mismatchCalc', minCost }
                    );
                }
            }
        }

        addStep(
            "Algorithm Complete", 
            `Line 27: return dp[${m}][${n}];\n\nThe DP table is fully populated. The answer is in the bottom-right corner: ${dp[m][n]}.`, 
            27, 
            { dp: cloneDP(dp), i: m, j: n, action: 'success', isSuccess: true, ans: dp[m][n] }
        );
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
  const { isSuccess, ans, action = '', dp, i: currI, j: currJ, isMatch, char1, char2, replaceCost, deleteCost, insertCost } = state;
  const { word1, word2 } = parsedData;

  const m = word1.length;
  const n = word2.length;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Edit3 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Edit Distance</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 72</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Dynamic Programming / Strings</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('mismatch') ? 'bg-rose-500/20 border-rose-500' : (action.includes('match') && isMatch ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('mismatch') ? 'rose' : (action.includes('match') && isMatch ? 'emerald' : 'violet')} />
                        </React.Fragment>
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
                        <VariableCard label="Row (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Col (j)" val={currJ !== null && currJ !== undefined ? currJ : "-"} color="purple" active={currJ !== null && currJ !== undefined} />
                        <VariableCard label="word1 char" val={char1 ? `'${char1}'` : "-"} color="slate" active={char1 !== undefined} />
                        <VariableCard label="word2 char" val={char2 ? `'${char2}'` : "-"} color="slate" active={char2 !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Word 1</label>
                        <input type="text" value={word1Input} onChange={(e) => { setWord1Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-[0.1em] font-bold" placeholder="horse" />
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Word 2</label>
                        <input type="text" value={word2Input} onChange={(e) => { setWord2Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-[0.1em] font-bold" placeholder="ros" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action.includes('mismatch') ? 'bg-rose-900 border-rose-800' : (action.includes('match') && isMatch ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Type size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action.includes('mismatch') ? 'text-rose-400' : (action.includes('match') && isMatch ? 'text-emerald-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('mismatch') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action.includes('match') && isMatch ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-2 pb-8 gap-10 overflow-y-auto overflow-x-auto">
                      
                      {dp && (
                          <div className="relative">
                              {/* Word 2 Column Headers */}
                              <div className="flex ml-[48px] mb-2">
                                  <div className="w-12 h-8 flex items-center justify-center font-mono font-black text-slate-300 text-sm">""</div>
                                  {word2.split('').map((c, j) => (
                                      <div key={`head-w2-${j}`} className={`w-12 h-8 flex items-center justify-center font-mono font-black text-lg ${currJ === j + 1 && !isSuccess ? 'text-purple-600 bg-purple-100 rounded-lg border border-purple-200' : 'text-slate-500'}`}>
                                          {c}
                                      </div>
                                  ))}
                              </div>

                              <div className="flex flex-col">
                                  {dp.map((row, i) => (
                                      <div key={`row-${i}`} className="flex items-center">
                                          {/* Word 1 Row Headers */}
                                          <div className={`w-12 h-12 flex items-center justify-center font-mono font-black text-lg ${currI === i && i > 0 && !isSuccess ? 'text-sky-600 bg-sky-100 rounded-lg border border-sky-200' : (i === 0 ? 'text-slate-300 text-sm' : 'text-slate-500')}`}>
                                              {i === 0 ? '""' : word1[i-1]}
                                          </div>
                                          
                                          {row.map((val, j) => {
                                              let isTarget = currI === i && currJ === j && !isSuccess;
                                              let isMatchState = isTarget && isMatch;
                                              let isMismatchState = isTarget && isMatch === false && action.includes('mismatch');
                                              
                                              // Dependencies
                                              let isDiagonal = currI !== null && currJ !== null && i === currI - 1 && j === currJ - 1 && (action === 'match' || action.includes('mismatch'));
                                              let isTop = currI !== null && currJ !== null && i === currI - 1 && j === currJ && action.includes('mismatch');
                                              let isLeft = currI !== null && currJ !== null && i === currI && j === currJ - 1 && action.includes('mismatch');

                                              let isBaseHighlight = (action === 'baseCol' && j === 0 && i === currI) || (action === 'baseRow' && i === 0 && j === currJ);
                                              
                                              let isFinalAns = isSuccess && i === m && j === n;

                                              let cellClass = "w-12 h-12 border border-slate-200 flex flex-col items-center justify-center transition-all duration-300 relative ";
                                              
                                              if (isFinalAns) {
                                                  cellClass += "bg-emerald-500 text-white font-black text-xl shadow-xl z-20 scale-110 rounded-lg border-emerald-600 ring-4 ring-emerald-200";
                                              } else if (isTarget) {
                                                  if (isMatchState) cellClass += "bg-emerald-100 border-emerald-400 text-emerald-900 font-black text-xl scale-110 shadow-lg z-20 rounded-lg ring-4 ring-emerald-300/30";
                                                  else if (isMismatchState) cellClass += "bg-rose-100 border-rose-400 text-rose-900 font-black text-xl scale-110 shadow-lg z-20 rounded-lg ring-4 ring-rose-300/30";
                                                  else cellClass += "bg-violet-100 border-violet-400 text-violet-900 font-black text-xl scale-110 shadow-lg z-20 rounded-lg ring-4 ring-violet-300/30";
                                              } else if (isDiagonal) {
                                                  cellClass += "bg-amber-100 border-amber-300 text-amber-800 font-bold z-10";
                                              } else if (isTop) {
                                                  cellClass += "bg-sky-100 border-sky-300 text-sky-800 font-bold z-10";
                                              } else if (isLeft) {
                                                  cellClass += "bg-purple-100 border-purple-300 text-purple-800 font-bold z-10";
                                              } else if (isBaseHighlight) {
                                                  cellClass += "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold bg-stripes";
                                              } else if (val !== null) {
                                                  cellClass += "bg-white text-slate-700 font-medium";
                                              } else {
                                                  cellClass += "bg-slate-50 text-transparent";
                                              }

                                              return (
                                                  <div key={`cell-${i}-${j}`} className={cellClass}>
                                                      {val !== null ? val : ""}
                                                      
                                                      {/* Tiny dependency tags */}
                                                      {isDiagonal && <span className="absolute -top-3 text-[7px] font-black uppercase tracking-widest bg-amber-200 text-amber-800 px-1 rounded shadow-sm">Replace</span>}
                                                      {isTop && <span className="absolute -top-3 text-[7px] font-black uppercase tracking-widest bg-sky-200 text-sky-800 px-1 rounded shadow-sm">Delete</span>}
                                                      {isLeft && <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-[7px] font-black uppercase tracking-widest bg-purple-200 text-purple-800 px-1 rounded shadow-sm transform -rotate-90">Insert</span>}
                                                      
                                                      {isMatchState && isTarget && action === 'match' && <ArrowLeft size={16} className="absolute -top-3 -left-3 text-emerald-500 transform rotate-45" strokeWidth={3}/>}
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  ))}
                              </div>
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">DP COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Minimum Distance: {ans}
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
                Edit Distance (also known as Levenshtein Distance) is a classic computer science algorithm used in spell checkers, DNA sequencing, and natural language processing. The problem exhibits "Optimal Substructure": the solution to a large string can be found by looking at the solutions for slightly smaller substrings.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> The DP Table State
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We define a 2D table <code>dp[i][j]</code>. What does a single cell mean?
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            <code>dp[i][j]</code> holds the minimum number of operations required to convert the first <code>i</code> characters of <code>word1</code> into the first <code>j</code> characters of <code>word2</code>.<br/><br/>
                            We pad the matrix with an extra row and column (index 0) to represent the "empty string".
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Check size={18}/> Case 1: Characters Match
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            If the current characters we are evaluating match: <code>word1[i-1] == word2[j-1]</code>.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We do not need to perform any new operations! We simply inherit the cost from before these two matching characters were added.</p>
                            <p>We look at the diagonal: <code>dp[i][j] = dp[i-1][j-1]</code>.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Zap size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Case 2: Characters Mismatch</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            If the characters do NOT match, we are forced to perform 1 operation. We must choose the operation (Insert, Delete, or Replace) that yields the lowest total cost by looking at the adjacent completed subproblems.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-sky-300 space-y-2">
                            <p className="text-amber-300">// Replace (Diagonal): Both strings shrink by 1</p>
                            <p>cost = dp[i-1][j-1]</p>
                            <p className="text-sky-300">// Delete (Top): word1 shrinks by 1</p>
                            <p>cost = dp[i-1][j]</p>
                            <p className="text-purple-300">// Insert (Left): word2 shrinks by 1 (we added matching char)</p>
                            <p>cost = dp[i][j-1]</p>
                            <p className="text-white mt-2">dp[i][j] = 1 + min(Replace, Delete, Insert);</p>
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
                        "I solved Edit Distance using 2D Dynamic Programming. I allocate an `(M+1) x (N+1)` table where `dp[i][j]` tracks the minimum operations to convert `word1[0..i]` to `word2[0..j]`. The extra row and column handle base cases: converting to or from an empty string simply requires deleting or inserting all characters. Then, I iterate through the table. If the current characters match, I inherit the operation count from `dp[i-1][j-1]` without adding anything. If they mismatch, I simulate a Replace (diagonal `i-1, j-1`), Delete (top `i-1, j`), and Insert (left `i, j-1`) operation by retrieving their costs, taking the minimum, and adding 1. This ensures a globally optimal result in $O(M \times N)$ Time and Space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we optimize Space to O(N)?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Yes! This is a great follow-up. In the `dp` table, to compute the current row `i`, we only ever need data from the current row `i` and the immediately previous row `i-1`. We do not need the entire 2D grid. We can optimize space to $O(N)$ by keeping just two 1D arrays: `prevRow` and `currRow`.
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
                                <p className="text-[10px] text-slate-500 mt-1">We have two nested loops iterating from $1$ to $M$ and $1$ to $N$. The work done inside the loops (array lookups, `Math.min`) is purely constant $O(1)$ time.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M × N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate a 2D integer array of size $(M+1) \times (N+1)$ to store the dynamic programming tabulation state.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|word1|word2|dp|minDistance|length|charAt|min|replace|insert|delete)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['dp'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['word1', 'word2'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['replace', 'insert', 'delete'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (['minDistance', 'length', 'charAt', 'min'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default EditDistanceVisualizer;