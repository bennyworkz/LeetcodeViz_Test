import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, Folder, CornerUpLeft, SplitSquareHorizontal, ShieldAlert,
  ArrowRight, FolderOpen, MinusCircle,
  Timer
} from 'lucide-react';

const APPROACHES = {
  stack: {
    id: 'stack',
    title: 'String Split & Stack',
    subtitle: 'Optimal: O(N) Time, O(N) Space.',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public String simplifyPath(String path) {
        Stack<String> stack = new Stack<>();
        
        // Split the path by the slash character
        String[] parts = path.split("/");
        
        for (String p : parts) {
            // ".." means go up one directory (pop from stack)
            if (p.equals("..")) {
                if (!stack.isEmpty()) {
                    stack.pop();
                }
            } 
            // Ignore empty strings (from "//") and "." (current directory)
            else if (!p.equals("") && !p.equals(".")) {
                stack.push(p);
            }
        }
        
        // Reconstruct the canonical path
        return "/" + String.join("/", stack);
    }
}`,
    explanation: "The most elegant way to solve this Unix path parsing problem is by using a Stack. First, we split the string by the `/` character. This automatically handles multiple consecutive slashes (like `///`), transforming them into empty string components. Then, we iterate through the split components. If we encounter a `.` or an empty string, we do nothing (stay in the current directory). If we encounter `..`, we pop from our stack (go up a directory), provided the stack isn't empty. Otherwise, it must be a valid directory name, so we push it onto the stack. Finally, we join the contents of the stack with `/` and prepend a root `/`."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">71. Simplify Path</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an absolute path for a Unix-style file system, which begins with a slash <code>'/'</code>, transform this path into its <strong>simplified canonical path</strong>.
        </p>

        <p className="text-base leading-relaxed">
          In Unix-style file system context:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium bg-slate-50 p-4 rounded-xl border border-slate-200 w-max">
            <li>A single period <code>'.'</code> signifies the current directory.</li>
            <li>A double period <code>'..'</code> signifies moving up one directory level.</li>
            <li>Multiple consecutive slashes such as <code>'//'</code> are treated as a single slash <code>'/'</code>.</li>
        </ul>

        <p className="text-base leading-relaxed mt-4">
          The canonical path should have the following format:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-emerald-500 font-medium bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 w-max">
            <li>The path must always start with a single slash <code>'/'</code>.</li>
            <li>Any two directories must be separated by a single slash <code>'/'</code>.</li>
            <li>The path must not end with a trailing <code>'/'</code> unless it's just the root directory.</li>
            <li>The path must only contain the directories on the path from the root to the target file or directory (i.e., no period <code>'.'</code> or double period <code>'..'</code>)</li>
        </ul>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> path = "/home/"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "/home"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The trailing slash should be removed.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> path = "/a/./b/../../c/"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "/c"</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> path = "/../"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "/"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: Going one level up from the root directory is a no-op, as the root level is the highest level you can go.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SimplifyPathVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('stack');
  const [pathInput, setPathInput] = useState('/a/./b/../../c/');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let p = pathInput.trim();
    if (!p) p = '/a/./b/../../c/';
    if (p.length > 30) p = p.substring(0, 30); // Prevent overflow on UI
    return { path: p };
  }, [pathInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { path } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    let stack = [];
    let parts = path.split("/");

    addStep(
        "Initialization", 
        `Line 3-6: Stack<String> stack = new Stack<>();\nString[] parts = path.split("/");\n\nWe initialize an empty stack and split the raw path string by the slash ('/') character. Note how consecutive slashes create empty string components!`, 
        6, 
        { stack: [...stack], parts: [...parts], currI: null, p: null, action: 'init' }
    );

    let iter = 0;
    for (let i = 0; i < parts.length; i++) {
        if (iter++ > 100) break;
        
        let p = parts[i];

        addStep(
            "Evaluate Component", 
            `Line 8: for (String p : parts)\n\nWe are currently evaluating the component at index ${i}: "${p}".`, 
            8, 
            { stack: [...stack], parts: [...parts], currI: i, p, action: 'eval' }
        );

        if (p === "..") {
            addStep(
                "Check '..' (Up Directory)", 
                `Line 10: if (p.equals(".."))\n\nThe component is "..". We need to navigate up one directory level by popping the top element from the stack.`, 
                10, 
                { stack: [...stack], parts: [...parts], currI: i, p, action: 'checkUp' }
            );

            if (stack.length > 0) {
                let popped = stack.pop();
                addStep(
                    "Pop from Stack", 
                    `Line 12: stack.pop();\n\nThe stack is not empty, so we pop "${popped}". We just navigated out of that directory!`, 
                    12, 
                    { stack: [...stack], parts: [...parts], currI: i, p, action: 'pop', popped }
                );
            } else {
                addStep(
                    "Stack Empty (No-Op)", 
                    `Line 11: if (!stack.isEmpty())\n\nThe stack is already empty. We are already at the root directory. You cannot go above root, so this '..' is safely ignored.`, 
                    11, 
                    { stack: [...stack], parts: [...parts], currI: i, p, action: 'ignoreUp' }
                );
            }
        } else if (p !== "" && p !== ".") {
            addStep(
                "Check Valid Directory", 
                `Line 16: else if (!p.equals("") && !p.equals("."))\n\nThe component "${p}" is a valid directory name!`, 
                16, 
                { stack: [...stack], parts: [...parts], currI: i, p, action: 'checkValid' }
            );
            
            stack.push(p);
            
            addStep(
                "Push to Stack", 
                `Line 17: stack.push(p);\n\nWe push "${p}" onto the stack, effectively entering this directory.`, 
                17, 
                { stack: [...stack], parts: [...parts], currI: i, p, action: 'push' }
            );
        } else {
            let reason = p === "" ? "an empty string (caused by consecutive slashes or trailing slashes)" : "a single dot '.' (meaning current directory)";
            addStep(
                "Ignore Component", 
                `Line 16: else if (!p.equals("") && !p.equals("."))\n\nThe component is ${reason}. It does not change our directory path, so we do nothing.`, 
                16, 
                { stack: [...stack], parts: [...parts], currI: i, p, action: 'ignore' }
            );
        }
    }

    addStep(
        "Loop Complete", 
        `Line 8: Loop finishes.\n\nWe have processed all components in the path. The stack now contains the exact directory hierarchy from root to target.`, 
        8, 
        { stack: [...stack], parts: [...parts], currI: null, p: null, action: 'loopEnd' }
    );

    let finalAns = "/" + stack.join("/");
    
    addStep(
        "Construct Canonical Path", 
        `Line 21: return "/" + String.join("/", stack);\n\nWe join all items in the stack separated by a slash, and prepend the root slash.`, 
        21, 
        { stack: [...stack], parts: [...parts], currI: null, p: null, action: 'success', isSuccess: true, ans: finalAns }
    );

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
  const { isSuccess, ans, action, stack, parts, currI, p, popped } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Folder className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Simplify Path</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 71</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Strings / Stack</span>
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
                            <div 
                               key={app.id}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200' : 'bg-white border-slate-200 text-slate-500'}`}
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
                            </div>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('pop') ? 'bg-rose-500/20 border-rose-500' : (action === 'push' ? 'bg-emerald-500/20 border-emerald-500' : (action === 'ignore' ? 'bg-slate-500/20 border-slate-500' : 'bg-violet-500/20 border-violet-500')))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('pop') ? 'rose' : (action === 'push' ? 'emerald' : (action === 'ignore' ? 'slate' : 'violet'))} />
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <VariableCard label="Index (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Part (p)" val={p !== null && p !== undefined ? `"${p}"` : "-"} color="purple" active={p !== null && p !== undefined} />
                        <VariableCard label="Stack Size" val={stack !== undefined ? stack.length : "-"} color="amber" active={stack !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Raw Path (path)</label>
                        <input type="text" value={pathInput} onChange={(e) => { setPathInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="/a/./b/../../c/" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'pop' ? 'bg-rose-900 border-rose-800' : (action === 'push' ? 'bg-emerald-900 border-emerald-800' : (action === 'ignore' ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-slate-800')))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'pop' ? <CornerUpLeft size={100} /> : <Folder size={100}/>)}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'pop' ? 'text-rose-400' : (action === 'push' ? 'text-emerald-400' : (action === 'ignore' ? 'text-slate-400' : 'text-violet-400')))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'pop' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action === 'push' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'ignore' ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')))}`}>Line {cur.line}</div>
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-8 overflow-x-auto">
                      
                      {/* String Array (Parts) */}
                      {parts && (
                          <div className="flex flex-col items-center w-full max-w-full">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-2 mb-4"><SplitSquareHorizontal size={14} /> Split Array (parts)</span>
                              
                              <div className="flex gap-2 p-4 bg-slate-100 border border-slate-200 rounded-3xl shadow-inner min-w-max mx-auto overflow-x-auto">
                                  {parts.map((part, idx) => {
                                      let isCurrent = currI === idx && !isSuccess;
                                      let isPast = currI !== null && idx < currI;
                                      
                                      let displayPart = part === "" ? '""' : `"${part}"`;

                                      let boxClass = "relative px-3 md:px-4 h-10 md:h-12 flex items-center justify-center rounded-xl border-2 font-mono font-black text-sm md:text-base transition-all duration-300 shrink-0 ";
                                      let textClass = "text-slate-700";

                                      if (isCurrent) {
                                          if (action === 'push') {
                                              boxClass += "bg-emerald-100 border-emerald-500 scale-110 shadow-lg ring-4 ring-emerald-300/30 z-20";
                                              textClass = "text-emerald-900";
                                          } else if (action === 'pop' || action === 'checkUp') {
                                              boxClass += "bg-rose-100 border-rose-500 scale-110 shadow-lg ring-4 ring-rose-300/30 z-20";
                                              textClass = "text-rose-900";
                                          } else if (action === 'ignore' || action === 'ignoreUp') {
                                              boxClass += "bg-slate-200 border-slate-400 scale-105 shadow-md z-20";
                                              textClass = "text-slate-600 line-through";
                                          } else {
                                              boxClass += "bg-violet-100 border-violet-500 scale-110 shadow-lg ring-4 ring-violet-300/30 z-20";
                                              textClass = "text-violet-900";
                                          }
                                      } else if (isPast) {
                                          boxClass += "bg-white border-slate-200 shadow-sm opacity-50";
                                          textClass = part === "" ? "text-slate-300" : "text-slate-400";
                                      } else {
                                          boxClass += "bg-white border-slate-300 shadow-sm";
                                          textClass = part === "" ? "text-slate-300" : "text-slate-700";
                                      }

                                      return (
                                          <div key={idx} className="flex flex-col items-center relative group">
                                              {/* Pointer Indicator */}
                                              <div className="absolute -top-8 flex flex-col items-center justify-end h-6 w-full z-30">
                                                  {isCurrent && (
                                                      <div className={`flex flex-col items-center animate-in slide-in-from-top-2`}>
                                                          <ArrowDown size={18} className={action.includes('pop') ? 'text-rose-500' : (action === 'push' ? 'text-emerald-500' : 'text-violet-500')} strokeWidth={3}/>
                                                      </div>
                                                  )}
                                              </div>

                                              <div className={boxClass}>
                                                  <span className={textClass}>{displayPart}</span>
                                              </div>
                                              
                                              <div className="text-[10px] text-slate-400 font-mono mt-1">{idx}</div>
                                          </div>
                                      );
                                  })}
                                  {parts.length === 0 && <span className="text-slate-400 italic font-mono text-sm px-4">Empty Array</span>}
                              </div>
                          </div>
                      )}

                      {/* Path Stack Visualization */}
                      {stack !== undefined && (
                          <div className="flex flex-col items-center w-full max-w-lg mt-4 border-t border-slate-200 pt-8">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center mb-6 flex items-center gap-2"><Layers size={14}/> Directory Stack</span>
                              
                              <div className="flex flex-col-reverse items-center justify-start w-48 min-h-[180px] bg-slate-50 border-x-4 border-b-4 border-slate-300 rounded-b-3xl p-3 gap-2 relative shadow-inner">
                                  
                                  {/* Root indicator */}
                                  {stack.length === 0 && action !== 'pop' && (
                                      <div className="text-slate-400 font-mono font-bold italic text-sm my-auto flex items-center gap-2 opacity-60">
                                          <MinusCircle size={16}/> Root (Empty)
                                      </div>
                                  )}

                                  {stack.map((dir, idx) => {
                                      let isTop = idx === stack.length - 1;
                                      
                                      let boxClass = "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono font-black text-sm border-2 transition-all duration-500 shadow-sm shrink-0 ";
                                      
                                      if (isTop && action === 'push') {
                                          boxClass += "bg-emerald-100 border-emerald-400 text-emerald-800 animate-in slide-in-from-top-8 fade-in ring-2 ring-emerald-300/50";
                                      } else {
                                          boxClass += "bg-white border-slate-300 text-slate-700";
                                      }

                                      return (
                                          <div key={`${idx}-${dir}`} className={boxClass}>
                                              <FolderOpen size={16} className="opacity-50" />
                                              <span>{dir}</span>
                                          </div>
                                      );
                                  })}
                                  
                                  {/* Popped Element Ghost */}
                                  {action === 'pop' && popped && (
                                       <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono font-black text-sm border-2 border-dashed border-rose-400 bg-rose-50 text-rose-500 animate-out fade-out slide-out-to-right-8 duration-700 absolute top-3 shrink-0">
                                           <CornerUpLeft size={16} />
                                           <span className="line-through">{popped}</span>
                                       </div>
                                  )}
                                  
                              </div>
                          </div>
                      )}

                      {/* Final Result String Build */}
                      {isSuccess && (
                          <div className="w-full flex flex-col items-center mt-6 animate-in zoom-in fade-in">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center mb-2 flex items-center gap-2"><Check size={14}/> Final String.join</span>
                              <div className="bg-sky-50 border-2 border-sky-300 text-sky-800 px-8 py-4 rounded-2xl font-mono font-black tracking-widest text-2xl shadow-inner min-w-[200px] text-center flex items-center justify-center">
                                  {ans}
                              </div>
                          </div>
                      )}

                   </div>

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
                <FolderOpen className="text-violet-600"/> File System Navigation
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Unix file systems use an absolute path to track exactly where a file resides. To simplify navigation, shortcuts like <code>.</code> (current directory) and <code>..</code> (parent directory) are utilized. To "canonicalize" a path means removing all these relative shortcuts and generating the absolute, simplest direct route from the root.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <SplitSquareHorizontal size={18}/> The Power of Split()
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            You could iterate through the string character by character, building strings and searching for slashes. But this is messy and bug-prone.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            Using <code>path.split("/")</code> instantly separates the path into semantic chunks! <br/><br/>
                            A tricky edge case like <code>"//home///foo/"</code> seamlessly turns into <code>["", "", "home", "", "", "foo"]</code>. We can simply tell our algorithm to ignore empty strings!
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Why a Stack?
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Navigating a file system naturally exhibits a Last-In-First-Out (LIFO) pattern.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>When you enter a folder <code>/a</code>, then <code>/b</code>, then <code>/c</code>, you must exit <code>/c</code> BEFORE you can exit <code>/b</code>.</p>
                            <p>Because the <code>".."</code> command always operates on the most recently entered folder, a Stack perfectly mimics this behavior. Push when entering, Pop when navigating up.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ShieldAlert size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The "Root Pop" Edge Case</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            What happens if the path is <code>"/../"</code> or <code>"/a/../../"</code>?
                            <br/><br/>
                            We attempt to go "up" a directory from the root directory.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-rose-300 space-y-2">
                            <p className="text-white">// The Unix file system explicitly prevents navigating above root.</p>
                            <p>// It acts as a no-op (nothing happens).</p>
                            <br/>
                            <p className="text-amber-400">// DANGEROUS:</p>
                            <p>if (p.equals("..")) stack.pop(); // EmptyStackException!</p>
                            <br/>
                            <p className="text-emerald-400">// SAFE:</p>
                            <p>if (p.equals("..") && !stack.isEmpty()) stack.pop();</p>
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
                        "I solved the 'Simplify Path' problem using a Stack data structure. First, I sanitize the input by splitting it by the slash character, which elegantly handles arbitrary amounts of consecutive slashes by producing empty string components. I iterate through these components. If a component is a single period `.` or an empty string `""`, it requires no path change, so I ignore it. If the component is `..`, it dictates moving up one directory level. Because directory traversal is a LIFO operation, I simply pop the top element from the stack (ensuring the stack is not already empty, effectively handling the edge case of calling `..` at the root). Any other string is a valid directory name, which I push onto the stack. Finally, I reconstruct the absolute path by joining the stack contents with slashes, running in $O(N)$ Time and $O(N)$ Space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Deque vs Stack?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                In modern Java, <code>Stack</code> is considered a legacy class. It is synchronized, making it unnecessarily slow for single-threaded algorithms. It's often recommended to use <code>Deque&lt;String&gt; stack = new ArrayDeque&lt;&gt;();</code> instead. Using <code>ArrayDeque</code> demonstrates deeper knowledge of the Java Collections Framework to an interviewer.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Splitting the string takes $O(N)$ time. Iterating through the parts array takes $O(N)$ time. Pushing and popping from the stack takes $O(1)$ time per operation. Rejoining the string takes $O(N)$ time.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The `parts` array creates a copy of the string tokens occupying up to $O(N)$ memory. The `stack` can hold at most $O(N)$ strings if the path is entirely nested directories.</p>
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

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|simplifyPath|path|stack|parts|split|equals|isEmpty|push|pop|join)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['simplifyPath', 'path'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['stack', 'push', 'pop', 'isEmpty'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['parts', 'p'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['split', 'equals', 'join'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SimplifyPathVisualizer;