import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, ArrowRight, 
  ArrowDown, BarChart3, X, GitBranch, Split, Binary, 
  MousePointer2, Timer, Network, Undo2, ArrowUp, History, 
  Calculator, Type, ArrowLeftRight, Hash, Scaling
} from 'lucide-react';

const APPROACHES = {
  stringConversion: {
    id: 'stringConversion',
    title: '1. String Conversion',
    subtitle: 'Convert to string and use two pointers.',
    icon: <Type size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public boolean isPalindrome(int x) {
        String s = String.valueOf(x);
        int left = 0;
        int right = s.length() - 1;
        
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
}`,
    explanation: "The most intuitive approach. Convert the integer to a string, then use two pointers (one at the start, one at the end) to check if the characters match as they move towards the center. Requires extra space for the string."
  },
  mathFull: {
    id: 'mathFull',
    title: '2. Reverse Entire Number',
    subtitle: 'Mathematically reverse the whole integer.',
    icon: <RotateCcw size={16} />,
    complexity: 'Time: O(log₁₀(X)) | Space: O(1)',
    code: `class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0) return false;
        
        long reversed = 0;
        int original = x;
        
        while (x != 0) {
            int digit = x % 10;
            reversed = reversed * 10 + digit;
            x /= 10;
        }
        
        return reversed == original;
    }
}`,
    explanation: "Avoids string conversion. We use modulo 10 to extract the last digit, append it to a new 'reversed' variable, and divide the original number by 10. We use a 'long' to prevent integer overflow during the reversal."
  },
  mathHalf: {
    id: 'mathHalf',
    title: '3. Reverse Half Number',
    subtitle: 'Optimal: Reverse only half to prevent overflow.',
    icon: <Split size={16} />,
    complexity: 'Time: O(log₁₀(X)) | Space: O(1)',
    code: `class Solution {
    public boolean isPalindrome(int x) {
        // Edge cases: Negative numbers or ends in 0 (but not 0)
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }
        
        int revertedNumber = 0;
        
        // Loop until we reach the middle
        while (x > revertedNumber) {
            int digit = x % 10;
            revertedNumber = revertedNumber * 10 + digit;
            x /= 10;
        }
        
        // Even length: x == revertedNumber
        // Odd length: x == revertedNumber / 10
        return x == revertedNumber || x == revertedNumber / 10;
    }
}`,
    explanation: "The most optimal approach. We reverse only the second half of the number. We know we've reached the middle when the remaining original number 'x' is less than or equal to the 'revertedNumber'. This completely avoids integer overflow."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">9. Palindrome Number</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an integer <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600 font-mono font-bold">x</code>, return <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600 font-mono font-bold">true</code> <em>if </em><code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600 font-mono font-bold">x</code><em> is a </em><span className="font-bold text-slate-800 underline decoration-violet-300 decoration-2 underline-offset-4 cursor-help" title="An integer is a palindrome when it reads the same forward and backward."><em>palindrome</em></span><em>, and </em><code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600 font-mono font-bold">false</code><em> otherwise</em>.
        </p>

        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = 121</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> 121 reads as 121 from left to right and from right to left.</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = -121</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> x = 10</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
              <p className="text-slate-500 text-xs mt-2 border-t border-slate-200 pt-2"><span className="text-slate-400 font-bold">Explanation:</span> Reads 01 from right to left. Therefore it is not a palindrome.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-violet-50 rounded-xl border border-violet-100 text-sm text-violet-800 flex items-start gap-3">
           <Trophy className="shrink-0 mt-0.5 text-violet-500" size={18} />
           <div>
               <strong>Follow up:</strong> Could you solve it without converting the integer to a string?
           </div>
        </div>
      </div>
    </div>
  </div>
);

const PalindromeVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState<keyof typeof APPROACHES>('mathHalf');
  const [xInput, setXInput] = useState('1221');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const xNum = useMemo(() => {
    const val = parseInt(xInput);
    return isNaN(val) ? 0 : val;
  }, [xInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    
    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({
        phase,
        description: desc,
        line,
        state: { x: xNum, ...state }
      });
    };

    if (selectedApproachId === 'stringConversion') {
        const s = xNum.toString();
        let l = 0;
        let r = s.length - 1;
        
        addStep("Convert to String", `x is converted to string "${s}". Initializing pointers.`, 3, { s, l, r });
        
        let isPal = true;
        while (l < r) {
             addStep("Loop Condition", `Checking if left (${l}) < right (${r}).`, 7, { s, l, r });
             addStep("Compare Characters", `Comparing s[${l}] ('${s[l]}') with s[${r}] ('${s[r]}').`, 8, { s, l, r, comparing: true });
             
             if (s[l] !== s[r]) {
                 isPal = false;
                 addStep("Mismatch Found", `Characters do not match! The number is not a palindrome.`, 9, { s, l, r, isFailed: true });
                 break;
             }
             
             l++;
             r--;
             addStep("Move Pointers", `Characters match. Moving left pointer to ${l}, right pointer to ${r}.`, 11, { s, l, r });
        }
        
        if (isPal) {
             addStep("Loop Ends", `left (${l}) is no longer less than right (${r}). Loop terminates.`, 7, { s, l, r, isSuccess: true });
             addStep("Valid Palindrome", `All checked characters matched. Return true.`, 15, { s, l, r, isSuccess: true });
        }
    } 
    else if (selectedApproachId === 'mathFull') {
        let currentX = xNum;
        let reversed = 0;
        let original = xNum;
        
        addStep("Initial Check", "Checking if number is negative.", 3, { currentX, reversed, original });
        if (currentX < 0) {
            addStep("Negative Number", "Negative numbers cannot be palindromes due to the minus sign. Return false.", 3, { currentX, reversed, original, isFailed: true });
        } else {
            addStep("Initialize Variables", `reversed = 0, original = ${original}`, 5, { currentX, reversed, original });
            
            while (currentX !== 0) {
                addStep("Loop Condition", `x (${currentX}) is not 0. Entering loop.`, 8, { currentX, reversed, original });
                
                let digit = currentX % 10;
                addStep("Extract Digit", `digit = ${currentX} % 10 = ${digit}. (Extracts the last digit)`, 9, { currentX, reversed, original, digit });
                
                reversed = reversed * 10 + digit;
                addStep("Build Reversed Number", `reversed = (${reversed - digit} / 10) * 10 + ${digit} = ${reversed}.`, 10, { currentX, reversed, original, digit });
                
                currentX = Math.trunc(currentX / 10);
                addStep("Reduce Original", `x = x / 10 = ${currentX}. (Removes the last digit)`, 11, { currentX, reversed, original, digit: null });
            }
            
            addStep("Loop Ends", `x is now 0. Loop terminates.`, 8, { currentX, reversed, original });
            addStep("Compare Results", `Check if reversed (${reversed}) == original (${original}).`, 14, { currentX, reversed, original });
            
            if (reversed === original) {
                addStep("Valid Palindrome", `They match! Return true.`, 14, { currentX, reversed, original, isSuccess: true });
            } else {
                addStep("Not a Palindrome", `They do not match. Return false.`, 14, { currentX, reversed, original, isFailed: true });
            }
        }
    }
    else {
        // mathHalf
        let currentX = xNum;
        let revertedNumber = 0;
        
        addStep("Edge Case Check", "Check if negative or if ends in 0 (but isn't 0).", 4, { currentX, revertedNumber });
        if (currentX < 0 || (currentX % 10 === 0 && currentX !== 0)) {
            addStep("Invalid Palindrome", "Fails edge case conditions. Negative numbers or multiples of 10 cannot be palindromes. Return false.", 5, { currentX, revertedNumber, isFailed: true });
        } else {
            addStep("Initialize", `revertedNumber = 0. Begin halving process.`, 8, { currentX, revertedNumber });
            
            while (currentX > revertedNumber) {
                addStep("Loop Condition", `Is x (${currentX}) > revertedNumber (${revertedNumber})? Yes, haven't reached middle.`, 11, { currentX, revertedNumber });
                
                let digit = currentX % 10;
                addStep("Extract Digit", `digit = ${currentX} % 10 = ${digit}.`, 12, { currentX, revertedNumber, digit });
                
                revertedNumber = revertedNumber * 10 + digit;
                addStep("Build Reverted Half", `revertedNumber = (${revertedNumber - digit} / 10) * 10 + ${digit} = ${revertedNumber}.`, 13, { currentX, revertedNumber, digit });
                
                currentX = Math.trunc(currentX / 10);
                addStep("Reduce Original", `x = x / 10 = ${currentX}.`, 14, { currentX, revertedNumber, digit: null });
            }
            
            addStep("Loop Ends", `x (${currentX}) is no longer greater than revertedNumber (${revertedNumber}). Reached middle!`, 11, { currentX, revertedNumber });
            
            addStep("Final Validation", `Check if x (${currentX}) == revertedNumber (${revertedNumber}) [Even length] OR x == revertedNumber / 10 (${Math.trunc(revertedNumber / 10)}) [Odd length].`, 19, { currentX, revertedNumber });
            
            if (currentX === revertedNumber || currentX === Math.trunc(revertedNumber / 10)) {
                addStep("Valid Palindrome", `Condition met! It is a palindrome.`, 19, { currentX, revertedNumber, isSuccess: true });
            } else {
                addStep("Not a Palindrome", `Condition failed. It is not a palindrome.`, 19, { currentX, revertedNumber, isFailed: true });
            }
        }
    }

    return steps;
  }, [xNum, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const state = cur.state || {};
  const { isSuccess, isFailed } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <ArrowLeftRight className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Palindrome Number</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 9</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Math / Pointers</span>
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
                <div className="grid grid-cols-3 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id as keyof typeof APPROACHES); setCurrentStep(0); }}
                               className={`px-2 py-3.5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 shadow-sm ${isSelected ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:bg-slate-50'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-tight leading-none truncate w-full px-1">
                                    {app.title}
                                </span>
                                <div className={`flex flex-col items-center text-[8px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-violet-50' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-violet-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {/* Highlighter Bar */}
                      <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/10 border-emerald-500' : isFailed ? 'bg-rose-500/10 border-rose-500' : 'bg-violet-500/15 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="violet" />
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Current Variables</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'stringConversion' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="LEFT PTR" val={state.l ?? null} color="blue" active={state.l !== undefined} char={state.s ? state.s[state.l] : null} />
                            <VariableCard label="RIGHT PTR" val={state.r ?? null} color="purple" active={state.r !== undefined} char={state.s ? state.s[state.r] : null} />
                        </div>
                    ) : selectedApproachId === 'mathFull' ? (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="x" val={state.currentX ?? null} color="blue" active={state.currentX !== undefined} />
                            <VariableCard label="digit" val={state.digit ?? null} color="amber" active={state.digit !== null && state.digit !== undefined} />
                            <VariableCard label="reversed" val={state.reversed ?? null} color="emerald" active={state.reversed !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="x (shrinking)" val={state.currentX ?? null} color="blue" active={state.currentX !== undefined} />
                            <VariableCard label="digit" val={state.digit ?? null} color="amber" active={state.digit !== null && state.digit !== undefined} />
                            <VariableCard label="reverted (growing)" val={state.revertedNumber ?? null} color="emerald" active={state.revertedNumber !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Input Number 'x'</label>
                        <input type="number" value={xInput} onChange={(e) => { setXInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="e.g. 1221" />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/> Prev
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-40 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next Step <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group ${isFailed ? 'bg-rose-900 border-rose-800' : isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {selectedApproachId === 'stringConversion' ? <Type size={100} /> : <Calculator size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isFailed ? "text-rose-400" : isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isFailed ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                      {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line">{cur.description}</p>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[350px] relative flex flex-col justify-center items-center overflow-hidden shadow-inner">
                  
                  {/* String Approach Visual */}
                  {selectedApproachId === 'stringConversion' && state.s !== undefined && (
                     <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-8">String Characters</span>
                        <div className="flex gap-2 relative">
                            {state.s.split('').map((char: string, idx: number) => {
                                const isLeft = idx === state.l;
                                const isRight = idx === state.r;
                                const isComparing = state.comparing && (isLeft || isRight);
                                
                                let bgClass = "bg-white";
                                let borderClass = "border-slate-200";

                                if (isFailed && isComparing) {
                                    bgClass = "bg-rose-100 text-rose-700 shadow-rose-200 shadow-md scale-110 z-10";
                                    borderClass = "border-rose-400";
                                } else if (isSuccess) {
                                    bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700";
                                } else if (idx < (state.l ?? 0) || idx > (state.r ?? state.s.length)) {
                                    bgClass = "bg-slate-50 text-slate-300 opacity-60";
                                } else if (isComparing) {
                                    bgClass = "bg-amber-100 border-amber-400 scale-105 z-10 text-amber-800";
                                }

                                return (
                                    <div key={idx} className="flex flex-col items-center relative transition-all duration-300">
                                        {/* Top Pointers */}
                                        <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full gap-1">
                                            {isLeft && (
                                                <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                    <span className="text-[9px] font-black text-blue-600 font-mono">L</span>
                                                    <ArrowDown size={14} className="text-blue-500" strokeWidth={3}/>
                                                </div>
                                            )}
                                            {isRight && idx !== state.l && (
                                                <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                    <span className="text-[9px] font-black text-purple-600 font-mono">R</span>
                                                    <ArrowDown size={14} className="text-purple-500" strokeWidth={3}/>
                                                </div>
                                            )}
                                        </div>

                                        {/* Main Box */}
                                        <div className={`w-12 h-16 md:w-16 md:h-20 border-2 rounded-2xl flex items-center justify-center font-mono font-black text-xl md:text-3xl transition-all duration-500 ${bgClass} ${borderClass}`}>
                                            {char}
                                        </div>
                                        
                                        {/* Index */}
                                        <div className="mt-3 text-[10px] font-mono font-black text-slate-400">
                                            {idx}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                     </div>
                  )}

                  {/* Math Approaches Visual */}
                  {(selectedApproachId === 'mathFull' || selectedApproachId === 'mathHalf') && state.currentX !== undefined && (
                      <div className="w-full max-w-lg flex flex-col gap-10 relative">
                          <div className="flex items-center justify-around relative">
                              
                              {/* X (Original Shrinking) */}
                              <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest font-mono">x (Remaining)</span>
                                  <div className="px-8 py-6 bg-blue-50 border-2 border-blue-200 rounded-3xl shadow-inner min-w-[120px] flex justify-center items-center">
                                      <span className="text-4xl font-black font-mono text-blue-800">{state.currentX}</span>
                                  </div>
                              </div>

                              {/* Digit Transfer Animation Indicator */}
                              {state.digit !== null && state.digit !== undefined && (
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-in zoom-in slide-in-from-left-8 duration-500 z-10">
                                      <div className="w-12 h-12 bg-amber-100 border-2 border-amber-400 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                                          <span className="text-2xl font-black font-mono text-amber-700">{state.digit}</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-[8px] font-black text-amber-600 mt-2 uppercase tracking-widest">
                                          <ArrowRight size={10}/> Modulo 10
                                      </div>
                                  </div>
                              )}

                              {/* Reverted (Growing) */}
                              <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono">{selectedApproachId === 'mathFull' ? 'reversed' : 'revertedNumber'}</span>
                                  <div className="px-8 py-6 bg-emerald-50 border-2 border-emerald-200 rounded-3xl shadow-inner min-w-[120px] flex justify-center items-center">
                                      <span className="text-4xl font-black font-mono text-emerald-800">{selectedApproachId === 'mathFull' ? state.reversed : state.revertedNumber}</span>
                                  </div>
                              </div>
                          </div>

                          {/* Equation visualizer */}
                          {cur.phase === "Final Validation" || cur.phase === "Compare Results" ? (
                              <div className="mt-8 bg-slate-100 border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-mono text-sm animate-in slide-in-from-bottom-4">
                                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Final Check</span>
                                  <div className="flex items-center gap-3 text-lg">
                                      {selectedApproachId === 'mathFull' ? (
                                           <>
                                              <span className="font-bold text-emerald-700">{state.reversed}</span>
                                              <span className="text-slate-400">==</span>
                                              <span className="font-bold text-slate-800">{state.original}</span>
                                           </>
                                      ) : (
                                          <div className="flex flex-col items-center gap-2">
                                              <div className="flex gap-2">
                                                 <span className="text-xs text-slate-500 pt-1">Even Len:</span>
                                                 <span className="font-bold text-blue-700">{state.currentX}</span>
                                                 <span className="text-slate-400">==</span>
                                                 <span className="font-bold text-emerald-700">{state.revertedNumber}</span>
                                              </div>
                                              <div className="text-[10px] font-bold text-slate-400">OR</div>
                                              <div className="flex gap-2">
                                                 <span className="text-xs text-slate-500 pt-1">Odd Len:</span>
                                                 <span className="font-bold text-blue-700">{state.currentX}</span>
                                                 <span className="text-slate-400">==</span>
                                                 <span className="font-bold text-emerald-700">{Math.trunc(state.revertedNumber / 10)}</span>
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          ) : null}
                      </div>
                  )}

                  {/* Final State Overlays */}
                  {isFailed && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-rose-900/10 backdrop-blur-sm animate-in fade-in duration-500">
                      <div className="bg-white border-2 border-rose-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform rotate-2">
                          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shadow-lg">
                              <X size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">NOT A PALINDROME</span>
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Returned false</span>
                          </div>
                      </div>
                    </div>
                  )}
                  {isSuccess && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/10 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-emerald-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">VALID PALINDROME</span>
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Returned true</span>
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
                <Scaling className="text-violet-600"/> Reversing Half the Number
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                To avoid integer overflow entirely, we can mathematically reverse just the second half of the integer. If the number is a palindrome, the first half and the reversed second half will match perfectly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-violet-50 border border-violet-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-violet-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Calculator size={18}/> The Math Logic
                        </h3>
                        <p className="text-sm text-violet-800 leading-relaxed italic font-bold">
                            "Extract, Append, Reduce."
                        </p>
                        <ul className="space-y-4 text-xs text-violet-800 leading-relaxed list-none p-0 m-0 mt-4">
                            <li className="flex gap-3">
                                <div className="bg-violet-200 text-violet-700 px-2 py-1 rounded font-black mt-1 h-fit">% 10</div>
                                <div><strong>Extracts the last digit.</strong> Example: 1221 % 10 = 1.</div>
                            </li>
                            <li className="flex gap-3">
                                <div className="bg-violet-200 text-violet-700 px-2 py-1 rounded font-black mt-1 h-fit">* 10 +</div>
                                <div><strong>Builds the reversed number.</strong> Multiply the current reversed number by 10 (shifts digits left) and add the new digit.</div>
                            </li>
                            <li className="flex gap-3">
                                <div className="bg-violet-200 text-violet-700 px-2 py-1 rounded font-black mt-1 h-fit">/ 10</div>
                                <div><strong>Removes the last digit.</strong> Example: 1221 / 10 = 122.</div>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Split size={18}/> Stopping at the Middle
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            How do we know we've reached the middle of the number? Since we divide <code className="font-bold">x</code> by 10 and multiply <code className="font-bold">revertedNumber</code> by 10 at every step, we simply stop when <code className="font-bold">x &lt;= revertedNumber</code>.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Hash size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-violet-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Handling Odd Lengths</h4>
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                            <span className="text-[10px] text-slate-400 block mb-2 uppercase font-black font-mono">Example: 12321 (Odd length)</span>
                            <div className="space-y-2 mt-4 text-xs font-mono">
                                <div className="flex justify-between border-b border-slate-700 pb-1">
                                    <span className="text-slate-400">Start:</span>
                                    <span>x = 12321, rev = 0</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-700 pb-1">
                                    <span className="text-slate-400">Step 1:</span>
                                    <span>x = 1232, rev = 1</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-700 pb-1">
                                    <span className="text-slate-400">Step 2:</span>
                                    <span>x = 123, rev = 12</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-700 pb-1 text-emerald-400">
                                    <span className="text-emerald-500 font-bold">Step 3:</span>
                                    <span>x = 12, rev = 123</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-300 mt-4 leading-relaxed">
                                Loop stops because x (12) is no longer greater than rev (123).<br/><br/>
                                Since the middle digit '3' doesn't matter for palindrome checks (it always equals itself), we simply divide rev by 10 to discard it: <br/>
                                <code className="text-violet-300 bg-violet-900/50 px-1 py-0.5 rounded">12 == Math.trunc(123 / 10) // 12 == 12</code>
                            </p>
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
                        "While converting the number to a string is an O(N) solution in both time and space, we can optimize space to O(1) by mathematically reversing the number. To prevent the risk of integer overflow that could occur if we reverse the entire integer, the most robust approach is to only reverse the second half of the number. We know we've reached the middle when the remaining original number is less than or equal to the reversed half."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Edge Cases
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">Negative Numbers:</strong> Automatically false. A negative sign at the front will never match the digit at the end.
                            </div>
                            <div className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">Ending in Zero:</strong> If a number ends in 0, the only way it can be a palindrome is if it also starts with 0. But no integer starts with 0 except the number 0 itself. Therefore, numbers like 10, 20, 100 are automatically false.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(log₁₀(X))</span>
                                <p className="text-[10px] text-slate-500 mt-1">We divide the input by 10 at every step, so the time complexity depends on the number of digits in x.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only use a few integer variables (x, revertedNumber, digit) regardless of the size of the input.</p>
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

const VariableCard = ({ label, val, color, active, char }: { label: string, val: number | null, color: 'blue' | 'purple' | 'amber' | 'emerald', active: boolean, char?: string | null }) => {
    const bgMap = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
             <div className="text-xl font-black font-mono leading-none">
                 {val !== null ? val : '-'}
             </div>
             {active && char !== undefined && char !== null && (
                 <div className="absolute bottom-0 w-full text-center bg-black/5 text-[10px] font-black py-0.5 mt-2">
                     '{char}'
                 </div>
             )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean, theme?: 'cyan' | 'violet' }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break)\b|\b\d+\b)/g).filter(Boolean);
  
  const bgActive = theme === 'violet' ? 'bg-violet-500/10' : 'bg-cyan-500/10';
  const borderActive = theme === 'violet' ? 'bg-violet-500' : 'bg-cyan-500';
  const textActive = theme === 'violet' ? 'text-violet-400' : 'text-cyan-400';

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? bgActive : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderActive}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? `${textActive} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for', 'break'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-amber-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default PalindromeVisualizer;