import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Type, ArrowLeft, 
  CornerDownLeft, AlignRight, SplitSquareHorizontal
} from 'lucide-react';

const APPROACHES = {
  backward: {
    id: 'backward',
    title: '1. Backward Traversal',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <ArrowLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int lengthOfLastWord(String s) {
        int length = 0;
        int i = s.length() - 1;
        
        // 1. Skip any trailing spaces at the end of the string
        while (i >= 0 && s.charAt(i) == ' ') {
            i--;
        }
        
        // 2. Count the characters of the last word
        while (i >= 0 && s.charAt(i) != ' ') {
            length++;
            i--;
        }
        
        return length;
    }
}`,
    explanation: "The most efficient way to find the length of the LAST word is to start looking from the END of the string. We initialize a pointer `i` at the last index. First, we use a `while` loop to decrement `i` and skip over any trailing spaces. Once we hit the first non-space character, we've found the end of the last word! We then use a second `while` loop to count the characters, stopping as soon as we hit another space (or the beginning of the string). This runs in O(N) time in the worst case (if the string is one giant word), but in practice, it often runs in O(1) time if the last word is short, making it heavily optimized. It requires exactly O(1) auxiliary space."
  },
  builtin: {
    id: 'builtin',
    title: '2. Built-in Methods',
    subtitle: 'Short: O(N) Time, O(N) Space.',
    icon: <SplitSquareHorizontal size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int lengthOfLastWord(String s) {
        // Trim removes leading and trailing whitespace
        String trimmed = s.trim();
        
        // Find the index of the last space in the trimmed string
        int lastSpaceIndex = trimmed.lastIndexOf(' ');
        
        // The length is the total length minus the index of the space minus 1
        return trimmed.length() - lastSpaceIndex - 1;
    }
}`,
    explanation: "This approach leverages the standard library functions of the language. First, we call `s.trim()` to create a new string with all leading and trailing spaces removed. Then, we use `lastIndexOf(' ')` to find where the final word begins. Subtracting this index from the total length gives us the length of the last word. Note: If there are no spaces left (it's a single word), `lastIndexOf` returns `-1`, which mathematically still works perfectly! While this is very fast to write, it's often slightly frowned upon in interviews because `trim()` allocates an entirely new String in memory, resulting in an O(N) space complexity."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">58. Length of Last Word</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a string <code>s</code> consisting of words and spaces, return <em>the length of the <strong>last</strong> word in the string.</em>
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          A <strong>word</strong> is a maximal substring consisting of non-space characters only.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "Hello World"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 5</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The last word is "World" with length 5.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "&nbsp;&nbsp;fly me&nbsp;&nbsp; to&nbsp;&nbsp; the moon&nbsp;&nbsp;"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 4</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The last word is "moon" with length 4.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "luffy is still joyboy"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 6</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The last word is "joyboy" with length 6.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>
              <li><code>s</code> consists of only English letters and spaces <code>' '</code>.</li>
              <li>There will be at least one word in <code>s</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const LengthOfLastWordVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('backward');
  const [sInput, setSInput] = useState('  fly to   moon  ');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let str = sInput;
    // Fallback if empty or purely invalid
    if (!str || str.length === 0) str = "Hello World";
    
    // UI Safety cap to fit in screen
    if (str.length > 25) str = str.substring(0, 25);

    return { s: str };
  }, [sInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'backward') {
        
        let length = 0;
        let i = s.length - 1;

        addStep(
            "Initialization", 
            `Line 2-3: int length = 0; int i = s.length() - 1;\n\nWe initialize 'length' to 0 and start our pointer 'i' at the very last character of the string (index ${i}).`, 
            3, 
            { s, i, length, action: 'init' }
        );

        let iter = 0;
        // Phase 1: Skip trailing spaces
        addStep(
            "Phase 1: Trailing Spaces", 
            `Line 6: while (i >= 0 && s.charAt(i) == ' ')\n\nWe loop backwards to skip any spaces at the end of the string.`, 
            6, 
            { s, i, length, action: 'evalSkip' }
        );

        while (i >= 0 && s.charAt(i) === ' ') {
            if (iter++ > 100) break;
            
            addStep(
                "Skip Space", 
                `Line 7: i--;\n\nCharacter at index ${i} is a space (' '). We decrement 'i' to skip it.`, 
                7, 
                { s, i, length, action: 'skipSpace' }
            );
            i--;
        }

        if (i >= 0) {
            addStep(
                "First Letter Found", 
                `Line 6: Condition s.charAt(${i}) == ' ' is FALSE.\n\nWe hit the character '${s.charAt(i)}'. The trailing spaces have been skipped. We found the end of the last word!`, 
                6, 
                { s, i, length, action: 'endSkip' }
            );
        }

        // Phase 2: Count characters
        addStep(
            "Phase 2: Count Characters", 
            `Line 11: while (i >= 0 && s.charAt(i) != ' ')\n\nWe now count characters backwards until we hit a space (which marks the beginning of the word).`, 
            11, 
            { s, i, length, action: 'evalCount' }
        );

        while (i >= 0 && s.charAt(i) !== ' ') {
            if (iter++ > 100) break;
            
            length++;
            
            addStep(
                "Count Character", 
                `Line 12-13: length++; i--;\n\nCharacter '${s.charAt(i)}' is part of the word. We increment 'length' to ${length} and decrement 'i' to ${i - 1}.`, 
                13, 
                { s, i, length, action: 'countChar' }
            );
            i--;
        }

        addStep(
            "Word Completed", 
            `Line 11: Condition s.charAt(${i}) != ' ' is FALSE (or we reached start).\n\nWe hit a space (or the start of string). The last word is fully counted!`, 
            11, 
            { s, i, length, action: 'endCount' }
        );

        addStep(
            "Return Result", 
            `Line 17: return length;\n\nThe total length of the last word is ${length}.`, 
            17, 
            { s, i, length, action: 'success', isSuccess: true, ans: length }
        );

    } else if (selectedApproachId === 'builtin') {
        
        addStep(
            "Initial State", 
            `Starting with string: "${s}"`, 
            2, 
            { s, action: 'init' }
        );

        let trimmed = s.trim();
        addStep(
            "Trim String", 
            `Line 3: String trimmed = s.trim();\n\nCreates a new string removing all leading and trailing whitespaces.\nOriginal: "${s}"\nTrimmed: "${trimmed}"`, 
            3, 
            { s, trimmed, action: 'trim' }
        );

        let lastSpaceIndex = trimmed.lastIndexOf(' ');
        addStep(
            "Find Last Space", 
            `Line 6: int lastSpaceIndex = trimmed.lastIndexOf(' ');\n\nFinds the index of the final space in the trimmed string. Index = ${lastSpaceIndex}.`, 
            6, 
            { s, trimmed, lastSpaceIndex, action: 'findSpace' }
        );

        let length = trimmed.length - lastSpaceIndex - 1;
        
        let explanation = lastSpaceIndex === -1 
             ? `Since there are no spaces, lastSpaceIndex is -1.\nLength = ${trimmed.length} - (-1) - 1 = ${length}.`
             : `Length = Total Length (${trimmed.length}) - Space Index (${lastSpaceIndex}) - 1 = ${length}.`;

        addStep(
            "Calculate and Return", 
            `Line 9: return trimmed.length() - lastSpaceIndex - 1;\n\n${explanation}`, 
            9, 
            { s, trimmed, lastSpaceIndex, length, action: 'success', isSuccess: true, ans: length }
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
  const { isSuccess, ans, action, s, i: currI, length: currLength, trimmed, lastSpaceIndex } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Type className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Length of Last Word</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 58</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Strings / Pointers</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('skip') || action.includes('Skip') ? 'bg-rose-500/20 border-rose-500' : (action.includes('count') || action.includes('Count') ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('skip') || action.includes('Skip') ? 'rose' : (action.includes('count') || action.includes('Count') ? 'amber' : 'violet')} />
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
                    
                    {selectedApproachId === 'backward' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Pointer (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                            <VariableCard label="Length Counter" val={currLength !== null && currLength !== undefined ? currLength : "-"} color="emerald" active={currLength !== null && currLength !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <VariableCard label="Total Len" val={s ? s.length : "-"} color="slate" active={true} />
                            <VariableCard label="Last Space Idx" val={lastSpaceIndex !== undefined ? lastSpaceIndex : "-"} color="amber" active={lastSpaceIndex !== undefined} />
                            <VariableCard label="Word Length" val={currLength !== undefined ? currLength : "-"} color="emerald" active={currLength !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Input String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="  fly to   moon  " />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-1">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action.includes('skip') || action.includes('Skip') ? 'bg-rose-900 border-rose-800' : (action.includes('count') || action.includes('Count') ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action.includes('skip') ? <CornerDownLeft size={100}/> : <Type size={100}/>)}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action.includes('skip') || action.includes('Skip') ? 'text-rose-400' : (action.includes('count') || action.includes('Count') ? 'text-amber-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('skip') || action.includes('Skip') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action.includes('count') || action.includes('Count') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[360px] items-center justify-center">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-12 gap-8 overflow-y-auto overflow-x-auto">
                      
                      {/* String Visualization */}
                      {s !== undefined && (
                          <div className="flex flex-col items-center w-full max-w-full">
                              
                              <div className="flex gap-1 md:gap-2 p-6 bg-slate-50 border border-slate-200 min-w-max mx-auto overflow-x-auto mt-4 shadow-sm rounded-3xl pb-16">
                                  {s.split('').map((char, idx) => {
                                      let isCurrentI = selectedApproachId === 'backward' && currI === idx && !isSuccess;
                                      
                                      // Determine if this character is part of the counted word
                                      // In backward approach, if we have passed the count phase and are returning,
                                      // the valid word sits between currI + 1 and currI + currLength
                                      let isCountedWord = false;
                                      if (selectedApproachId === 'backward' && currLength > 0 && currI !== undefined) {
                                           // we know we counted if idx > currI AND idx <= currI + currLength
                                           if (idx > currI && idx <= currI + currLength) {
                                               isCountedWord = true;
                                           }
                                      } else if (selectedApproachId === 'builtin' && trimmed !== undefined && lastSpaceIndex !== undefined) {
                                           // For builtin, the last word is at the end of the trimmed string
                                           // Finding the exact mapping back to the un-trimmed string visually is complex,
                                           // but we can just highlight the last 'length' non-space characters
                                           if (isSuccess && char !== ' ') {
                                               // simplistic mapping for visual completion
                                               let wordStart = s.trimEnd().lastIndexOf(' ') + 1;
                                               if (idx >= wordStart && idx < wordStart + currLength) {
                                                   isCountedWord = true;
                                               }
                                           }
                                      }

                                      let boxClass = "relative w-8 h-10 md:w-10 md:h-12 flex items-center justify-center rounded border-2 font-mono font-black text-lg md:text-xl transition-all duration-300 shrink-0 ";
                                      let textClass = "text-slate-700";

                                      if (char === ' ') {
                                          boxClass += "bg-slate-200/50 border-dashed border-slate-300";
                                          textClass = "text-slate-400 opacity-50";
                                      } else {
                                          boxClass += "bg-white border-slate-300 shadow-sm";
                                      }

                                      if (isCountedWord) {
                                          boxClass = boxClass.replace('bg-white', 'bg-emerald-100').replace('border-slate-300', 'border-emerald-500');
                                          textClass = "text-emerald-800";
                                      }

                                      if (isCurrentI) {
                                          if (action.includes('skip')) {
                                              boxClass = "relative w-8 h-10 md:w-10 md:h-12 flex items-center justify-center rounded border-2 font-mono font-black text-lg md:text-xl transition-all duration-300 shrink-0 bg-rose-100 border-rose-500 scale-110 shadow-md ring-2 ring-rose-300/50 z-20";
                                              textClass = "text-rose-800";
                                          } else if (action.includes('count')) {
                                              boxClass = "relative w-8 h-10 md:w-10 md:h-12 flex items-center justify-center rounded border-2 font-mono font-black text-lg md:text-xl transition-all duration-300 shrink-0 bg-amber-100 border-amber-500 scale-110 shadow-md ring-2 ring-amber-300/50 z-20";
                                              textClass = "text-amber-800";
                                          } else {
                                              boxClass = "relative w-8 h-10 md:w-10 md:h-12 flex items-center justify-center rounded border-2 font-mono font-black text-lg md:text-xl transition-all duration-300 shrink-0 bg-sky-100 border-sky-500 scale-110 shadow-md z-20";
                                              textClass = "text-sky-800";
                                          }
                                      }

                                      return (
                                          <div key={`cell-${idx}`} className="flex flex-col items-center relative group">
                                              
                                              <div className={boxClass}>
                                                  <span className={textClass}>{char === ' ' ? '␣' : char}</span>
                                              </div>
                                              
                                              {/* Index label */}
                                              <div className="text-[8px] text-slate-300 font-mono mt-1 font-bold absolute -bottom-4">
                                                  {idx}
                                              </div>

                                              {/* Read Pointer (Bottom) */}
                                              <div className="absolute -bottom-14 flex flex-col items-center h-10 w-full z-30">
                                                  {isCurrentI && (
                                                      <div className={`flex flex-col items-center animate-in slide-in-from-bottom-2`}>
                                                          <ArrowUp size={20} className={action.includes('skip') ? 'text-rose-500' : (action.includes('count') ? 'text-amber-500' : 'text-sky-500')} strokeWidth={3}/>
                                                          <span className={`text-[10px] font-black font-mono tracking-widest px-1 py-0.5 rounded border shadow-sm mt-1 ${action.includes('skip') ? 'text-rose-800 bg-rose-100 border-rose-300' : (action.includes('count') ? 'text-amber-800 bg-amber-100 border-amber-300' : 'text-sky-800 bg-sky-100 border-sky-300')}`}>i</span>
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      );
                                  })}
                                  {s.length === 0 && <span className="text-slate-400 italic font-mono text-sm px-4">Empty String</span>}
                              </div>
                          </div>
                      )}

                      {/* Builtin Approach Specific UI */}
                      {selectedApproachId === 'builtin' && action !== 'init' && trimmed !== undefined && (
                           <div className="w-full max-w-lg mt-4 flex flex-col gap-4">
                               
                               <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-mono mb-2 block">1. s.trim()</span>
                                    <div className="font-mono text-lg font-black text-sky-800 bg-sky-50 px-3 py-2 rounded-xl border border-sky-200 tracking-widest text-center truncate">
                                        "{trimmed}"
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono mt-2 text-right w-full">Length: {trimmed.length}</div>
                               </div>

                               {lastSpaceIndex !== undefined && (
                                   <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 delay-150">
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-mono mb-2 block">2. lastIndexOf(' ')</span>
                                        <div className="font-mono text-lg font-black text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 tracking-widest text-center">
                                            Index: {lastSpaceIndex}
                                        </div>
                                   </div>
                               )}

                               {isSuccess && currLength !== undefined && (
                                   <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 shadow-md relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 delay-300 bg-emerald-50">
                                        <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest font-mono mb-2 block">3. Result</span>
                                        <div className="font-mono text-2xl font-black text-emerald-800 tracking-widest text-center">
                                            {trimmed.length} - {lastSpaceIndex} - 1 = <span className="text-emerald-600 underline decoration-4 underline-offset-4">{currLength}</span>
                                        </div>
                                   </div>
                               )}

                           </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && selectedApproachId === 'backward' && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">TRAVERSAL COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Last Word Length = {ans}
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
                <AlignRight className="text-violet-600"/> Backward String Parsing
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                When searching for the "last" occurrence of a pattern or word in a string or array, starting from the end and moving backward is almost always the most optimal strategy. It prevents scanning data that isn't relevant to the final answer.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeft size={18}/> Why traverse backwards?
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            If the string is 10,000 characters long, and the last word is 5 characters long at the very end...
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p><strong>Forward Traversal:</strong> You must read 10,000 characters, constantly resetting your counter every time you hit a space, just to find the final word.</p>
                            <p><strong>Backward Traversal:</strong> You skip trailing spaces, read the 5 characters of the final word, hit a space, and return. You only executed ~5 loop iterations instead of 10,000!</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <SplitSquareHorizontal size={18}/> The Problem with s.split()
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Many beginners write <code>s.split(" ")</code> and grab the last element.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>While valid in Python or JavaScript for quick scripts, <code>split()</code> generates a massive new Array in memory containing every single word in the string.</p>
                            <p>This transforms an $O(1)$ space problem into an $O(N)$ space problem. In a technical interview, solving string parsing manually using pointers demonstrates deeper algorithmic competence.</p>
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
                        "While we could use built-in library functions like `trim()` or `split()` to isolate the final word, those methods inherently allocate new Strings or String Arrays, resulting in an unnecessary $O(N)$ space overhead. To achieve the optimal $O(1)$ auxiliary space, I used a backward pointer traversal. I initialize a pointer at the very end of the string. First, I loop backward to skip any trailing spaces. Once I hit a non-space character, I begin a second loop that counts the characters of the last word, terminating as soon as it hits another space or the beginning of the string. This guarantees an optimal $O(N)$ worst-case time complexity, but significantly outperforms forward-traversal in average scenarios by stopping as soon as the final word is processed."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Single word edge case?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                What if the string is just <code>"Hello"</code> with no spaces at all? The backward traversal handles this gracefully. The trailing space loop is skipped. The counting loop runs until <code>i</code> drops below 0 (<code>i &gt;= 0</code> condition fails). The function returns the full length of the word correctly.
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
                                <p className="text-[10px] text-slate-500 mt-1">In the absolute worst case (a string consisting of one single massive word), we iterate through all $N$ characters. Average case is heavily bound by the size of the final word.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We utilize no auxiliary arrays or new strings. We only maintain two primitive integers (`i` and `length`), keeping space perfectly constant regardless of input string size.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|Queue|LinkedList|lengthOfLastWord|length|charAt|trim|lastIndexOf)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder', 'Queue', 'LinkedList'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['lengthOfLastWord', 'length', 'charAt', 'trim', 'lastIndexOf'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['s', 'trimmed', 'lastSpaceIndex'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default LengthOfLastWordVisualizer;