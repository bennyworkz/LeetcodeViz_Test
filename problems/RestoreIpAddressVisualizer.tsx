import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ListOrdered, ArrowRight, XSquare, Hash, 
  Network, Globe, GitBranch, RotateCcw, Timer
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: 'Backtracking',
    subtitle: 'Optimal: O(1) Time, O(1) Space.',
    icon: <GitBranch size={16} />,
    complexity: 'Time: O(1) | Space: O(1)', 
    code: `class Solution {
    public List<String> restoreIpAddresses(String s) {
        List<String> res = new ArrayList<>();
        if (s.length() < 4 || s.length() > 12) return res;
        backtrack(s, 0, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(String s, int start, List<String> path, List<String> res) {
        if (path.size() == 4 && start == s.length()) {
            res.add(String.join(".", path));
            return;
        }
        if (path.size() == 4 || start == s.length()) return;

        for (int len = 1; len <= 3; len++) {
            if (start + len > s.length()) break;
            String part = s.substring(start, start + len);
            if (isValid(part)) {
                path.add(part);
                backtrack(s, start + len, path, res);
                path.remove(path.size() - 1);
            }
        }
    }

    private boolean isValid(String part) {
        if (part.length() > 1 && part.startsWith("0")) return false;
        int val = Integer.parseInt(part);
        return val >= 0 && val <= 255;
    }
}`,
    explanation: "We use backtracking to try all possible placements of the 3 dots. Since an IP address has exactly 4 parts, our recursion depth is at most 4. At each step, we can choose a segment of length 1, 2, or 3. We validate each segment (it must be between 0 and 255, and cannot have leading zeros unless it's exactly \"0\"). Because the maximum string length is 12 and depth is 4, the number of operations is strictly bounded, making the time complexity O(1) relative to any unbounded input length."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">93. Restore IP Addresses</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          A <strong>valid IP address</strong> consists of exactly four integers separated by single dots. Each integer is between <code>0</code> and <code>255</code> (inclusive) and cannot have leading zeros.
        </p>
        <ul className="list-disc pl-6 space-y-2">
            <li>For example, <code>"0.1.2.201"</code> and <code>"192.168.1.1"</code> are valid IP addresses, but <code>"0.011.255.245"</code>, <code>"192.168.1.312"</code> and <code>"192.168@1.1"</code> are invalid.</li>
        </ul>
        <p className="text-lg leading-relaxed mt-4">
          Given a string <code>s</code> containing only digits, return all possible valid IP addresses that can be formed by inserting dots into <code>s</code>. You are not allowed to reorder or remove any digits in <code>s</code>. You may return the valid IP addresses in <strong>any order</strong>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "25525511135"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> ["255.255.11.135","255.255.111.35"]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "0000"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> ["0.0.0.0"]</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "101023"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= s.length &lt;= 20</code></li>
              <li><code>s</code> consists of digits only.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const RestoreIpAddressVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('backtracking');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Default value that creates a nice visualization with leading zero pruning
  const [sInput, setSInput] = useState('101023');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    // Strip non-digits and limit length to keep visualizations manageable and logical
    let s = sInput.replace(/\D/g, '').substring(0, 12);
    if (!s) s = "255255";
    return { s };
  }, [sInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s } = parsedData;
    let res = [];
    let path = [];

    steps.push({
        phase: 'Initialization',
        description: `Starting Backtracking for string:\ns = "${s}"`,
        line: 5,
        state: { s, path: [...path], res: [...res], start: 0, part: null, action: 'init' }
    });

    const backtrack = (start) => {
        if (steps.length > 2000) return; // UI safeguard

        steps.push({
            phase: 'Check Base Case',
            description: `Current parts: ${path.length}/4\nRemaining string: "${s.substring(start)}"`,
            line: 10,
            state: { s, path: [...path], res: [...res], start, part: null, action: 'eval' }
        });

        if (path.length === 4 && start === s.length) {
            let validIp = path.join('.');
            res.push(validIp);
            steps.push({
                phase: 'Valid IP Found!',
                description: `Successfully partitioned string into 4 valid parts:\n\n${validIp}`,
                line: 11,
                state: { s, path: [...path], res: [...res], start, part: null, action: 'match' }
            });
            return;
        }
        
        if (path.length === 4 || start === s.length) {
             steps.push({
                phase: 'Prune Branch',
                description: path.length === 4 ? `We have 4 parts but string is not fully consumed. Pruning.` : `String consumed but we don't have 4 parts yet. Pruning.`,
                line: 14,
                state: { s, path: [...path], res: [...res], start, part: null, action: 'prune' }
            });
            return;
        }

        for (let len = 1; len <= 3; len++) {
            if (start + len > s.length) break;
            
            let part = s.substring(start, start + len);
            steps.push({
                phase: `Evaluate Length ${len}`,
                description: `Extracting part of length ${len}: "${part}"`,
                line: 18,
                state: { s, path: [...path], res: [...res], start, len, part, action: 'eval_part' }
            });

            // Validation
            let isValid = true;
            let reason = "";
            if (part.length > 1 && part.startsWith('0')) {
                isValid = false;
                reason = "Leading zero is not allowed.";
            } else if (parseInt(part) > 255) {
                isValid = false;
                reason = "Value exceeds 255.";
            }

            if (!isValid) {
                 steps.push({
                    phase: `Invalid Part`,
                    description: `Part "${part}" is invalid: ${reason}`,
                    line: 28,
                    state: { s, path: [...path], res: [...res], start, len, part, action: 'prune_part' }
                });
                continue;
            }

            path.push(part);
            steps.push({
                phase: `Choose Valid Part`,
                description: `Part "${part}" is valid. Adding to current path and recursing.`,
                line: 20,
                state: { s, path: [...path], res: [...res], start, len, part, action: 'choose' }
            });

            backtrack(start + len);
            if (steps.length > 2000) return;

            let removed = path.pop();
            steps.push({
                phase: `Backtrack`,
                description: `Returned from recursion.\nRemoving "${removed}" from path to explore other combinations.`,
                line: 22,
                state: { s, path: [...path], res: [...res], start, len, part: removed, action: 'backtrack' }
            });
        }
    };
    
    if (s.length >= 4 && s.length <= 12) {
        backtrack(0);
    } else {
         steps.push({
            phase: 'Immediate Failure',
            description: `String length must be between 4 and 12 to form a valid IP.`,
            line: 4,
            state: { s, path: [...path], res: [...res], start: 0, part: null, action: 'prune' }
        });
    }
    
    steps.push({
        phase: 'Algorithm Complete',
        description: `Finished searching all branches. Found ${res.length} valid IP addresses.`,
        line: 6,
        state: { s, path: [], res: [...res], start: null, part: null, action: 'complete', isSuccess: true }
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
  const sState = cur.state || {};
  const sStr = parsedData.s;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-sky-600 p-4 rounded-2xl shadow-lg shadow-sky-100 flex items-center justify-center">
                <Globe className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Restore IP Addresses</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 93</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Backtracking / Strings</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-sky-600 border-sky-600 text-white shadow-sky-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-sky-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-sky-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${sState.isSuccess || sState.action === 'match' ? 'bg-emerald-500/20 border-emerald-500' : (sState.action === 'prune' || sState.action === 'prune_part' ? 'bg-rose-500/20 border-rose-500' : (sState.action === 'choose' ? 'bg-teal-500/20 border-teal-500' : (sState.action === 'backtrack' ? 'bg-amber-500/20 border-amber-500' : 'bg-sky-500/20 border-sky-500')))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={sState.isSuccess || sState.action === 'match' ? 'emerald' : (sState.action === 'prune' || sState.action === 'prune_part' ? 'rose' : (sState.action === 'choose' ? 'teal' : (sState.action === 'backtrack' ? 'amber' : 'sky')))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sky-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Start Index" val={sState.start !== null && sState.start !== undefined ? sState.start : "-"} color="purple" active={sState.start !== null && sState.start !== undefined} />
                        <VariableCard label="Path Size" val={sState.path ? sState.path.length : "-"} color="indigo" active={sState.path !== undefined} />
                        <VariableCard label="Curr Length" val={sState.len !== null && sState.len !== undefined ? sState.len : "-"} color="sky" active={sState.len !== null && sState.len !== undefined} />
                        <VariableCard label="Results" val={sState.res ? sState.res.length : "-"} color="emerald" active={sState.res !== undefined && sState.res.length > 0} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-sky-600 uppercase block pl-1 tracking-widest font-mono">Digit String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500" placeholder="25525511135" maxLength={12} />
                        <p className="text-[9px] text-slate-400 pl-1 font-mono">Numbers only. Max 12 chars.</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2.5 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2.5 bg-sky-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-sky-200 hover:bg-sky-700 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${sState.isSuccess || sState.action === 'match' ? 'bg-emerald-900 border-emerald-800' : (sState.action === 'prune' || sState.action === 'prune_part' ? 'bg-rose-900 border-rose-800' : (sState.action === 'choose' ? 'bg-teal-900 border-teal-800' : (sState.action === 'backtrack' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {sState.isSuccess || sState.action === 'match' ? <Check size={100}/> : (sState.action === 'prune' || sState.action === 'prune_part' ? <XSquare size={100}/> : (sState.action === 'choose' ? <Target size={100}/> : (sState.action === 'backtrack' ? <RotateCcw size={100}/> : <Activity size={100}/>)))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={sState.isSuccess || sState.action === 'match' ? "text-emerald-400" : (sState.action === 'prune' || sState.action === 'prune_part' ? 'text-rose-400' : (sState.action === 'choose' ? 'text-teal-400' : (sState.action === 'backtrack' ? 'text-amber-400' : 'text-slate-400')))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${sState.isSuccess || sState.action === 'match' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (sState.action === 'prune' || sState.action === 'prune_part' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (sState.action === 'choose' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : (sState.action === 'backtrack' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30')))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-center justify-start pt-8 min-h-[460px]">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-10 overflow-y-auto overflow-x-auto">
                      
                      {/* String Decomposition View */}
                      <div className="flex flex-col items-center w-full">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><ListOrdered size={14}/> String Parsing</span>
                          
                          <div className="flex gap-1 items-center bg-slate-900 p-4 rounded-2xl shadow-xl w-full max-w-lg justify-center relative overflow-hidden">
                              {sStr && sStr.split('').map((char, index) => {
                                  // Determine status of this character
                                  const isConsumed = index < sState.start;
                                  const isEvaluating = sState.action === 'eval_part' || sState.action === 'prune_part' || sState.action === 'choose' || (sState.action === 'backtrack' && sState.part !== null);
                                  const isPartChar = isEvaluating && index >= sState.start && index < sState.start + sState.len;
                                  
                                  let boxClass = "w-8 h-12 flex items-center justify-center font-mono font-black text-xl rounded transition-all duration-300 border-2 ";
                                  
                                  if (isConsumed) {
                                      boxClass += "bg-slate-700 border-slate-600 text-slate-400 opacity-60";
                                  } else if (isPartChar) {
                                      if (sState.action === 'prune_part') {
                                          boxClass += "bg-rose-500/20 border-rose-500 text-rose-400";
                                      } else if (sState.action === 'choose') {
                                          boxClass += "bg-teal-500/20 border-teal-500 text-teal-400";
                                      } else if (sState.action === 'backtrack') {
                                          boxClass += "bg-amber-500/20 border-amber-500 text-amber-400";
                                      } else {
                                          boxClass += "bg-sky-500/20 border-sky-500 text-sky-400 animate-pulse";
                                      }
                                  } else {
                                      boxClass += "bg-slate-800 border-slate-700 text-white";
                                  }

                                  return (
                                      <div key={`char-${index}`} className={boxClass}>
                                          {char}
                                      </div>
                                  );
                              })}
                              
                              {/* Start index marker */}
                              {sState.start !== undefined && sState.start <= sStr.length && (
                                  <div className="absolute top-0 bottom-0 w-1 bg-amber-400 z-20 pointer-events-none transition-all duration-300" 
                                       style={{ left: `calc(50% - ${(sStr.length * 36) / 2}px + ${sState.start * 36}px - 2px)` }}>
                                  </div>
                              )}
                          </div>
                          <div className="mt-2 text-[10px] font-mono font-bold text-amber-500 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-amber-500 block"></span> Start Index Cursor
                          </div>
                      </div>

                      {/* Current IP Blocks */}
                      <div className="flex flex-col items-center w-full mt-2">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><Network size={14}/> Current IP Path</span>
                          
                          <div className="flex gap-2 items-end">
                              {[0, 1, 2, 3].map((idx) => {
                                  const partVal = sState.path && sState.path.length > idx ? sState.path[idx] : null;
                                  const isLastAdded = sState.action === 'choose' && idx === sState.path.length - 1;
                                  
                                  let boxClass = "w-20 h-16 rounded-xl flex items-center justify-center font-mono font-black text-2xl border-4 transition-all duration-300 ";
                                  
                                  if (partVal !== null) {
                                      if (isLastAdded) {
                                          boxClass += "bg-teal-50 border-teal-400 text-teal-700 scale-110 shadow-lg";
                                      } else if (sState.action === 'match') {
                                          boxClass += "bg-emerald-100 border-emerald-500 text-emerald-800 animate-pulse";
                                      } else {
                                          boxClass += "bg-white border-slate-300 text-slate-800 shadow-sm";
                                      }
                                  } else {
                                      boxClass += "bg-slate-50 border-slate-200 border-dashed text-transparent";
                                  }

                                  return (
                                      <React.Fragment key={`ip-part-${idx}`}>
                                          <div className={boxClass}>
                                              {partVal !== null ? partVal : '-'}
                                          </div>
                                          {idx < 3 && <div className="text-3xl font-black text-slate-300 mb-2">.</div>}
                                      </React.Fragment>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Results Array */}
                      <div className="w-full flex flex-col items-center mt-auto border-t border-slate-200 pt-6">
                           <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest font-mono mb-4 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Discovered IP Addresses</span>
                           
                           <div className="flex flex-wrap gap-2 justify-center w-full max-w-lg min-h-[40px]">
                               {sState.res && sState.res.length > 0 ? sState.res.map((ip, idx) => (
                                   <div key={`res-${idx}`} className={`px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono font-bold rounded-lg shadow-sm text-xs ${sState.action === 'match' && idx === sState.res.length - 1 ? 'animate-in zoom-in slide-in-from-top-4 shadow-emerald-200/50 shadow-lg scale-110 border-emerald-500' : ''}`}>
                                       {ip}
                                   </div>
                               )) : (
                                   <div className="text-slate-400 italic text-sm font-mono border border-dashed border-slate-300 px-6 py-1.5 rounded-lg">No valid IP addresses found yet.</div>
                               )}
                           </div>
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
                                  Found {sState.res.length} valid IPs
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
                <GitBranch className="text-sky-600"/> Backtracking over Partitions
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-sky-100 pl-6">
                When a problem asks us to divide a string into valid segments (like 4 integers for an IP address), we can use a depth-first search (DFS) combined with backtracking.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Validating a Segment
                        </h3>
                        <p className="text-sm text-indigo-800 leading-relaxed mb-4">
                            Before we recurse, we must ensure the substring is a valid IP block.
                        </p>
                        <div className="text-xs text-indigo-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-indigo-200 shadow-inner space-y-3">
                            <p><strong>Length:</strong> It can be 1, 2, or 3 characters.</p>
                            <p><strong>Leading Zeros:</strong> If length &gt; 1, it CANNOT start with <code>'0'</code>. So "01" is invalid, but "0" is valid.</p>
                            <p><strong>Value constraint:</strong> Once parsed to an integer, it must be <code>&lt;= 255</code>. Thus, "256" is invalid.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <RotateCcw size={18}/> The Recursion Tree
                        </h3>
                        <p className="text-xs text-sky-800 leading-relaxed mb-4">
                            At each depth level of our recursion, we try chopping off a chunk of size 1, 2, or 3 from the start of the remaining string.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p>We pass down the <code>start</code> index and our current <code>path</code> (the list of valid segments chosen so far).</p>
                            <p>If we successfully collect exactly 4 segments AND our <code>start</code> index has reached the end of the string, we have found a valid IP address!</p>
                            <p>Otherwise, we backtrack by popping the last added segment off the path and looping to try the next segment length.</p>
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
                        "To solve this, I'll use a backtracking approach. I'll maintain a list representing the current path of IP blocks and a starting index. In my recursive function, if the path size is 4 and I've consumed the entire string, I add the joined path to my results. Otherwise, I loop to try segment lengths of 1, 2, and 3. For each substring, I check if it's a valid IP block—no leading zeros and value &lt;= 255. If valid, I add it to the path, recurse with the updated start index, and then backtrack by removing the block. The time and space complexities are technically O(1) since the max depth is 4 and max string length is 12."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-sky-500"/> FAQ: Why is the complexity O(1)?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                This trips up a lot of candidates. Backtracking usually has exponential time complexity.
                                <br/><br/>
                                However, in this specific problem, the depth of the recursion tree is <strong>strictly capped at 4</strong> (since an IP has exactly 4 parts). Furthermore, at each node, we only branch a maximum of 3 times (for lengths 1, 2, 3). The total number of states evaluated is bounded by $3^4 = 81$, which is a constant regardless of theoretical input size. Therefore, Time is $O(1)$.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-sky-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Bounded by $3^4 = 81$ maximum checks. The input string is also capped at length 12.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The maximum depth of the call stack is 4. The `path` list will store at most 4 strings. It is constant auxiliary space.</p>
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
        cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
        teal: 'bg-teal-50 border-teal-200 text-teal-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
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

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'sky' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Math|Arrays|ArrayList|restoreIpAddresses|backtrack|isValid|size|add|remove|length|substring|join|startsWith|parseInt)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['restoreIpAddresses', 'backtrack', 'isValid', 'size', 'add', 'remove', 'length', 'substring', 'join', 'startsWith', 'parseInt'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['s', 'res', 'path', 'start', 'len', 'part', 'val'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};


export default RestoreIpAddressVisualizer;