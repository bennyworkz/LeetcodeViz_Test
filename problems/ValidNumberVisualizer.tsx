import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ListOrdered, ArrowRight, ArrowDown, XSquare, Hash, 
  Terminal, CheckSquare, Square, RotateCcw, Timer
} from 'lucide-react';

const APPROACHES = {
  statemachine: {
    id: 'statemachine',
    title: 'Flag Tracking / State Machine',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <Terminal size={16} />,
    complexity: 'Time: O(N) | Space: O(1)', 
    code: `class Solution {
    public boolean isNumber(String s) {
        boolean seenDigit = false;
        boolean seenExponent = false;
        boolean seenDot = false;
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            
            if (Character.isDigit(c)) {
                // 1. Digits are always valid
                seenDigit = true;
            } else if (c == '+' || c == '-') {
                // 2. Signs only allowed at start or after 'e'/'E'
                if (i > 0 && s.charAt(i - 1) != 'e' && s.charAt(i - 1) != 'E') {
                    return false;
                }
            } else if (c == 'e' || c == 'E') {
                // 3. Exponents only allowed once, and must follow a digit
                if (seenExponent || !seenDigit) {
                    return false;
                }
                seenExponent = true;
                seenDigit = false; // Must have digits AFTER exponent
            } else if (c == '.') {
                // 4. Dots only allowed once, and NOT after an exponent
                if (seenDot || seenExponent) {
                    return false;
                }
                seenDot = true;
            } else {
                // 5. Any other character is invalid
                return false;
            }
        }
        
        // Valid if we actually saw at least one valid trailing digit
        return seenDigit;
    }
}`,
    explanation: "We iterate through the string character by character and maintain three boolean flags: `seenDigit`, `seenExponent`, and `seenDot`. By examining the current character and the current state of our flags, we strictly enforce the rules of a valid number. For instance, an exponent ('e' or 'E') can only appear once and must be preceded by a digit. A dot ('.') can only appear once and cannot appear after an exponent. Signs ('+' or '-') can only appear at the beginning or immediately following an exponent. If we encounter an illegal character or a rule violation, we immediately return `false`. Finally, the string is valid if and only if we have seen at least one valid digit by the end of the string."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">65. Valid Number</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          Given a string <code>s</code>, return <code>true</code><em> if </em><code>s</code><em> is a <strong>valid number</strong></em>.
        </p>
        
        <p className="text-md">A <strong>valid number</strong> can be split up into these components (in order):</p>
        <ol className="list-decimal pl-6 space-y-1 text-sm text-slate-700">
            <li>A <strong>decimal number</strong> or an <strong>integer</strong>.</li>
            <li>(Optional) An <code>'e'</code> or <code>'E'</code>, followed by an <strong>integer</strong>.</li>
        </ol>

        <p className="text-md mt-4">A <strong>decimal number</strong> can be split up into:</p>
        <ol className="list-decimal pl-6 space-y-1 text-sm text-slate-700">
            <li>(Optional) A sign character (either <code>'+'</code> or <code>'-'</code>).</li>
            <li>One of the following formats:
                <ul className="list-disc pl-6 space-y-1 mt-1">
                    <li>One or more digits, followed by a dot <code>'.'</code>.</li>
                    <li>One or more digits, followed by a dot <code>'.'</code>, followed by one or more digits.</li>
                    <li>A dot <code>'.'</code>, followed by one or more digits.</li>
                </ul>
            </li>
        </ol>

        <p className="text-md mt-4">An <strong>integer</strong> can be split up into:</p>
        <ol className="list-decimal pl-6 space-y-1 text-sm text-slate-700">
            <li>(Optional) A sign character (either <code>'+'</code> or <code>'-'</code>).</li>
            <li>One or more digits.</li>
        </ol>

        <div className="space-y-6 mt-8">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Examples:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 font-mono text-xs space-y-2">
                  <p className="text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-2 border-b border-emerald-200 pb-2">Valid Numbers</p>
                  <p><code>"2"</code>, <code>"0089"</code>, <code>"-0.1"</code>,</p>
                  <p><code>"+3.14"</code>, <code>"4."</code>, <code>"-.9"</code>,</p>
                  <p><code>"2e10"</code>, <code>"-90E3"</code>, <code>"3e+7"</code>,</p>
                  <p><code>"+6e-1"</code>, <code>"53.5e93"</code>, <code>"-123.456e789"</code></p>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 font-mono text-xs space-y-2">
                  <p className="text-rose-700 font-bold uppercase tracking-widest text-[10px] mb-2 border-b border-rose-200 pb-2">Invalid Numbers</p>
                  <p><code>"abc"</code>, <code>"1a"</code>, <code>"1e"</code>,</p>
                  <p><code>"e3"</code>, <code>"99e2.5"</code>, <code>"--6"</code>,</p>
                  <p><code>"-+3"</code>, <code>"95a54e53"</code></p>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= s.length &lt;= 20</code></li>
              <li><code>s</code> consists of only English letters (both uppercase and lowercase), digits (<code>0-9</code>), plus <code>'+'</code>, minus <code>'-'</code>, or dot <code>'.'</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ValidNumberVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('statemachine');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Default input string
  const [sInput, setSInput] = useState('-123.45e67');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s = sInput.trim().substring(0, 20); // enforce length constraints roughly
    if (!s) s = "-123.45e67";
    return { s };
  }, [sInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s } = parsedData;
    
    let seenDigit = false;
    let seenExponent = false;
    let seenDot = false;

    steps.push({
        phase: 'Initialization',
        description: `Starting parse for string: "${s}"\nInitializing all tracking flags to false.`,
        line: 4,
        state: { s, i: null, char: null, seenDigit, seenExponent, seenDot, action: 'init' }
    });

    for (let i = 0; i < s.length; i++) {
        let c = s[i];
        
        steps.push({
            phase: `Evaluate Char: '${c}'`,
            description: `Reading character at index ${i}: '${c}'`,
            line: 8,
            state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'eval' }
        });

        if (c >= '0' && c <= '9') {
            seenDigit = true;
            steps.push({
                phase: `Valid Digit`,
                description: `'${c}' is a digit.\nSetting seenDigit = true.`,
                line: 11,
                state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'valid_char' }
            });
        } else if (c === '+' || c === '-') {
            steps.push({
                phase: `Evaluate Sign`,
                description: `'${c}' is a sign character. Checking rules...`,
                line: 12,
                state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'eval' }
            });
            
            if (i > 0 && s[i - 1] !== 'e' && s[i - 1] !== 'E') {
                steps.push({
                    phase: `Invalid Sign Placement`,
                    description: `Sign '${c}' is invalid here. Signs can only appear at the very beginning (index 0) or immediately following an exponent ('e' or 'E').`,
                    line: 14,
                    state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'invalid' }
                });
                return steps;
            }
            
            steps.push({
                phase: `Valid Sign`,
                description: `Sign placement is valid.`,
                line: 12,
                state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'valid_char' }
            });

        } else if (c === 'e' || c === 'E') {
            steps.push({
                phase: `Evaluate Exponent`,
                description: `'${c}' is an exponent character. Checking rules...`,
                line: 16,
                state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'eval' }
            });

            if (seenExponent || !seenDigit) {
                steps.push({
                    phase: `Invalid Exponent Placement`,
                    description: `Exponent '${c}' is invalid. Either we already saw an exponent (seenExponent is true), or we haven't seen a valid digit yet (seenDigit is false).`,
                    line: 18,
                    state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'invalid' }
                });
                return steps;
            }
            
            seenExponent = true;
            seenDigit = false;
            steps.push({
                phase: `Valid Exponent`,
                description: `Exponent placement is valid.\nSetting seenExponent = true.\nResetting seenDigit = false (We MUST have an integer part following the exponent).`,
                line: 21,
                state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'valid_char' }
            });

        } else if (c === '.') {
            steps.push({
                phase: `Evaluate Dot`,
                description: `'.' is a decimal point. Checking rules...`,
                line: 23,
                state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'eval' }
            });

            if (seenDot || seenExponent) {
                steps.push({
                    phase: `Invalid Dot Placement`,
                    description: `Dot '.' is invalid. Either we already saw a dot, or we are in the exponent part (which must strictly be an integer without decimals).`,
                    line: 25,
                    state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'invalid' }
                });
                return steps;
            }
            
            seenDot = true;
            steps.push({
                phase: `Valid Dot`,
                description: `Dot placement is valid.\nSetting seenDot = true.`,
                line: 28,
                state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'valid_char' }
            });

        } else {
            steps.push({
                phase: `Illegal Character`,
                description: `Character '${c}' is completely illegal in a number format. Returning false.`,
                line: 31,
                state: { s, i, char: c, seenDigit, seenExponent, seenDot, action: 'invalid' }
            });
            return steps;
        }
    }

    if (seenDigit) {
        steps.push({
            phase: 'Validation Complete',
            description: `Reached the end of the string. We have seen at least one valid trailing digit (seenDigit is true).\n\n"${s}" is a VALID number!`,
            line: 36,
            state: { s, i: s.length, char: null, seenDigit, seenExponent, seenDot, action: 'complete', isSuccess: true }
        });
    } else {
        steps.push({
            phase: 'Validation Failed',
            description: `Reached the end of the string, but seenDigit is false (e.g., string ends with an 'e', or only contained a '.').\n\n"${s}" is INVALID.`,
            line: 36,
            state: { s, i: s.length, char: null, seenDigit, seenExponent, seenDot, action: 'invalid' }
        });
    }

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

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center">
                <Hash className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Valid Number</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 65</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Strings / Parsing / State Machine</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-blue-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${sState.isSuccess || sState.action === 'complete' ? 'bg-emerald-500/20 border-emerald-500' : (sState.action === 'invalid' ? 'bg-rose-500/20 border-rose-500' : (sState.action === 'valid_char' ? 'bg-teal-500/20 border-teal-500' : 'bg-blue-500/20 border-blue-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={sState.isSuccess || sState.action === 'complete' ? 'emerald' : (sState.action === 'invalid' ? 'rose' : (sState.action === 'valid_char' ? 'teal' : 'blue'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <BooleanFlagCard label="seenDigit" val={sState.seenDigit} color="sky" />
                        <BooleanFlagCard label="seenExponent" val={sState.seenExponent} color="fuchsia" />
                        <BooleanFlagCard label="seenDot" val={sState.seenDot} color="amber" />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-blue-600 uppercase block pl-1 tracking-widest font-mono">Target String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" placeholder="-123.45e67" maxLength={20} />
                        <p className="text-[9px] text-slate-400 pl-1 font-mono">Max length 20. Try complex decimals or invalid strings!</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2.5 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${sState.isSuccess || sState.action === 'complete' ? 'bg-emerald-900 border-emerald-800' : (sState.action === 'invalid' ? 'bg-rose-900 border-rose-800' : (sState.action === 'valid_char' ? 'bg-teal-900 border-teal-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {sState.isSuccess || sState.action === 'complete' ? <Check size={100}/> : (sState.action === 'invalid' ? <XSquare size={100}/> : (sState.action === 'valid_char' ? <CheckSquare size={100}/> : <Activity size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={sState.isSuccess || sState.action === 'complete' ? "text-emerald-400" : (sState.action === 'invalid' ? 'text-rose-400' : (sState.action === 'valid_char' ? 'text-teal-400' : 'text-slate-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${sState.isSuccess || sState.action === 'complete' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (sState.action === 'invalid' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (sState.action === 'valid_char' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-start justify-center pt-8 min-h-[300px] overflow-x-auto">
                   
                   <div className="flex flex-col items-center w-max min-w-full h-full relative z-10 gap-8 py-10 px-10">
                      
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><ListOrdered size={14}/> String Parsing Array</span>
                          
                      <div className="flex gap-1 items-center bg-slate-900 p-4 rounded-2xl shadow-xl w-full justify-center relative overflow-hidden">
                          {sState.s && sState.s.split('').map((char, index) => {
                              // Determine status of this character
                              const isPast = index < sState.i;
                              const isCurrent = index === sState.i;
                              
                              let boxClass = "w-10 h-14 flex items-center justify-center font-mono font-black text-2xl rounded transition-all duration-300 border-2 ";
                              
                              if (isPast && sState.action !== 'invalid') {
                                  boxClass += "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                              } else if (isPast && sState.action === 'invalid') {
                                  boxClass += "bg-rose-500/20 border-rose-500/50 text-rose-400";
                              } else if (isCurrent) {
                                  if (sState.action === 'invalid') {
                                      boxClass += "bg-rose-500/40 border-rose-500 text-rose-400 scale-110 shadow-lg shadow-rose-500/20 z-10";
                                  } else if (sState.action === 'valid_char') {
                                      boxClass += "bg-teal-500/40 border-teal-500 text-teal-400 scale-110 shadow-lg shadow-teal-500/20 z-10 animate-pulse";
                                  } else {
                                      boxClass += "bg-blue-500/40 border-blue-500 text-blue-400 scale-110 shadow-lg shadow-blue-500/20 z-10";
                                  }
                              } else {
                                  boxClass += "bg-slate-800 border-slate-700 text-slate-500 opacity-60";
                              }

                              return (
                                  <div key={`char-${index}`} className="flex flex-col items-center relative">
                                      <div className={boxClass}>
                                          {char === ' ' ? '␣' : char}
                                      </div>
                                      <div className={`mt-2 text-[8px] font-mono font-bold ${isCurrent ? 'text-blue-400' : 'text-slate-500'}`}>
                                          [{index}]
                                      </div>
                                      
                                      {/* Pointer Arrow */}
                                      {isCurrent && (
                                          <div className="absolute -top-6 text-blue-500 animate-bounce">
                                              <ArrowDown size={16} strokeWidth={4} />
                                          </div>
                                      )}
                                  </div>
                              );
                          })}
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {sState.action === 'complete' && sState.isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">VALID NUMBER</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  The string strictly follows all rules
                              </span>
                          </div>
                      </div>
                    </div>
                  )}

                  {sState.action === 'invalid' && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-rose-100 text-rose-600`}>
                              <XSquare size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">INVALID NUMBER</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-rose-600`}>
                                  Rule violation detected
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
                <Terminal className="text-blue-600"/> Deterministic Parsing
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-blue-100 pl-6">
                When validating complex string formats, regular expressions (Regex) are an option, but a single-pass Deterministic Finite Automaton (DFA) or a State Machine using boolean flags is faster and often clearer to interviewers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> The 3 Crucial Flags
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We use three booleans to remember the "state" of what we've already parsed.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p><span className="text-blue-600 bg-blue-100 px-1 rounded">seenDigit</span>: Ensures we have actual numbers. Re-set to false when hitting an 'e' because exponents need their own digits.</p>
                            <p><span className="text-fuchsia-600 bg-fuchsia-100 px-1 rounded">seenExponent</span>: Ensures 'e'/'E' only appears once, and blocks any dots ('.') from appearing later.</p>
                            <p><span className="text-amber-600 bg-amber-100 px-1 rounded">seenDot</span>: Ensures '.' only appears once, and blocks it if we are already inside the exponent part.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Target size={18}/> Validating Characters
                        </h3>
                        <p className="text-xs text-indigo-800 leading-relaxed mb-4">
                            As we iterate, every character must pass a strict gate check based on the current flags.
                        </p>
                        <div className="text-xs text-indigo-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-indigo-200 shadow-inner space-y-2">
                            <p><strong>Signs (+ / -):</strong> Must be at <code>index 0</code> OR immediately after an <code>'e'</code>.</p>
                            <p><strong>Exponent (e / E):</strong> <code>seenExponent</code> must be false AND <code>seenDigit</code> must be true.</p>
                            <p><strong>Dot (.):</strong> <code>seenDot</code> must be false AND <code>seenExponent</code> must be false.</p>
                            <p><strong>Others:</strong> Return false immediately.</p>
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
                        "To validate the number format, I implemented a state-tracking algorithm using three boolean flags: `seenDigit`, `seenExponent`, and `seenDot`. I iterate through the string in a single pass. If I see a digit, I set `seenDigit` to true. If I see a sign, it's only valid at index 0 or immediately after an exponent character. If I see an exponent, it's only valid if I haven't seen one yet AND I have already seen a digit. I then reset `seenDigit` to false to enforce that an integer follows the exponent. If I see a dot, it's only valid if I haven't seen a dot or an exponent yet. Any other character immediately invalidates the string. Finally, I return the value of `seenDigit` to ensure the string doesn't end abruptly on an exponent or sign. The complexity is O(N) time and O(1) space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-blue-500"/> FAQ: Why reset seenDigit after 'e'?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                A string like <code>"123e"</code> is <strong>invalid</strong>. An exponent MUST be followed by an integer.
                                <br/><br/>
                                By setting <code>seenDigit = false</code> immediately after parsing an <code>'e'</code>, we effectively demand that new digits appear before the string ends. If the loop ends without finding new digits, our final return statement <code>return seenDigit;</code> will correctly evaluate to false.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-blue-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We perform exactly one linear pass over the characters of the string. Each character evaluation takes constant O(1) time.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We only allocate a few boolean primitive variables to track the state, which use constant memory independent of string length.</p>
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

const BooleanFlagCard = ({ label, val, color }) => {
    const bgMap = {
        sky: 'bg-sky-50 border-sky-200 text-sky-800',
        fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800',
        amber: 'bg-amber-50 border-amber-200 text-amber-800'
    };
    
    const iconColor = {
        sky: 'text-sky-600',
        fuchsia: 'text-fuchsia-600',
        amber: 'text-amber-600'
    };

    return (
        <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center relative shadow-sm ${bgMap[color]}`}>
             <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2 truncate px-1 text-center">{label}</span>
             <div className={`flex items-center gap-2 font-black font-mono leading-none ${iconColor[color]}`}>
                 {val ? <CheckSquare size={20} /> : <Square size={20} className="opacity-50" />}
                 <span>{val === true ? 'TRUE' : val === false ? 'FALSE' : '-'}</span>
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'blue' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|isNumber|charAt|length|Character|isDigit)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['isNumber', 'charAt', 'length', 'Character', 'isDigit'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['s', 'seenDigit', 'seenExponent', 'seenDot', 'c', 'i'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ValidNumberVisualizer;