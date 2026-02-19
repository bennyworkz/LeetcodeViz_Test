
import React, { useState, useMemo } from 'react';
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
  SortAsc,
  Search,
  Maximize2,
  Table as TableIcon,
  MousePointer2,
  ListFilter,
  RefreshCw,
  MoreHorizontal,
  Type
} from 'lucide-react';

const APPROACHES = {
  vertical: {
    id: 'vertical',
    title: '1. Vertical Scanning',
    subtitle: 'Optimal Worst-Case O(S)',
    icon: <ArrowDown size={16} />,
    complexity: 'Time: O(S) | Space: O(1)',
    code: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        for (int i = 0; i < strs[0].length(); i++) {
            char c = strs[0].charAt(i);
            for (int j = 1; j < strs.length; j++) {
                if (i == strs[j].length() || strs[j].charAt(i) != c) {
                    return strs[0].substring(0, i);
                }
            }
        }
        return strs[0];
    }
}`,
    explanation: "Compare characters column by column. The moment any character differs or we reach the end of any string, the prefix found so far is the longest possible."
  },
  sorting: {
    id: 'sorting',
    title: '2. Sorting Strategy',
    subtitle: 'Lexicographical Bounds',
    icon: <SortAsc size={16} />,
    complexity: 'Time: O(N*L log N) | Space: O(1)',
    code: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        Arrays.sort(strs);
        String first = strs[0];
        String last = strs[strs.length - 1];
        int i = 0;
        while (i < first.length() && i < last.length()) {
            if (first.charAt(i) == last.charAt(i)) {
                i++;
            } else {
                break;
            }
        }
        return first.substring(0, i);
    }
}`,
    explanation: "By sorting, the most different strings are pushed to the ends of the array. The LCP of the entire array must be the LCP of just these two boundary strings."
  }
};

const LongestCommonPrefixVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('vertical');
  const [strsInput, setStrsInput] = useState("flower,flow,flight");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const rawStrs = useMemo(() => strsInput.split(',').map(s => s.trim()).filter(s => s.length >= 0), [strsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const strs = [...rawStrs];
    const n = strs.length;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          strs: [...strs],
          i: -1,
          j: -1,
          ...state 
        } 
      });
    };

    if (n === 0) {
      addStep("Empty Check", "Input array is empty.", 3, { finished: true, result: "" });
      return steps;
    }

    if (selectedApproach === 'vertical') {
      addStep("Init Check", "Checking if the input array is null or empty.", 3, { i: -1, j: -1 });
      
      for (let i = 0; i < strs[0].length; i++) {
        addStep("Column Loop", `Scanning column index i = ${i}.`, 4, { i });
        const char = strs[0][i];
        addStep("Reference Char", `Pick character from first string: '${char}'.`, 5, { i, c: char });

        for (let j = 1; j < n; j++) {
          addStep("Row Loop", `Comparing reference '${char}' with string at index j = ${j} ("${strs[j]}").`, 6, { i, j, c: char });
          
          // Inside IF evaluation breakdown
          const lengthExceeded = i === strs[j].length;
          addStep("Evaluate IF (Part 1)", `Checking if index ${i} reached end of strs[${j}]: ${lengthExceeded ? 'YES' : 'NO'}.`, 7, { i, j, c: char, submatch: !lengthExceeded });
          
          if (lengthExceeded) {
            addStep("Return Result", `End of string reached. Returning common prefix from index 0 to ${i}: "${strs[0].substring(0, i)}".`, 8, { i, j, c: char, finished: true, result: strs[0].substring(0, i) });
            return steps;
          }

          const charMismatch = strs[j][i] !== char;
          addStep("Evaluate IF (Part 2)", `Checking if strs[${j}].charAt(${i}) ('${strs[j][i]}') differs from reference '${char}': ${charMismatch ? 'YES' : 'NO'}.`, 7, { i, j, c: char, submatch: !charMismatch });

          if (charMismatch) {
            addStep("Return Result", `Mismatch found! Returning common prefix from index 0 to ${i}: "${strs[0].substring(0, i)}".`, 8, { i, j, c: char, finished: true, result: strs[0].substring(0, i) });
            return steps;
          }
          addStep("Row Match", `Match confirmed in strs[${j}]. Moving to next row.`, 6, { i, j, c: char, match: true });
        }
      }
      addStep("Loop Finish", "First string fully matched across all others.", 12, { i: strs[0].length, finished: true, result: strs[0] });

    } else {
      // Sorting Approach
      addStep("Sorting", "Lexicographically sort the strings. This minimizes the search to the extreme boundary cases.", 3, {});
      const sortedStrs = [...strs].sort();
      const first = sortedStrs[0];
      const last = sortedStrs[sortedStrs.length - 1];

      addStep("Get Boundaries", `Sorted! Comparing first string "${first}" and last string "${last}".`, 4, { sortedStrs, first, last });
      addStep("Get Boundaries", "Stored 'last' pointer.", 5, { sortedStrs, first, last });
      
      let i = 0;
      addStep("Init Pointer", "Initialize character index i = 0.", 6, { sortedStrs, first, last, i: 0 });

      while (i < first.length && i < last.length) {
        addStep("Loop Check", `Boundaries check: i(${i}) < length of first and last strings.`, 7, { sortedStrs, first, last, i });
        
        const charsMatch = first[i] === last[i];
        addStep("Evaluate IF", `Comparing character at index ${i}: '${first[i]}' vs '${last[i]}'. Match: ${charsMatch ? 'YES' : 'NO'}.`, 8, { sortedStrs, first, last, i, submatch: charsMatch });
        
        if (charsMatch) {
          addStep("Increment", "Characters match! Moving to next index.", 9, { sortedStrs, first, last, i, match: true });
          i++;
        } else {
          addStep("Break Loop", "Characters differ. Terminating search.", 11, { sortedStrs, first, last, i, match: false });
          break;
        }
      }
      addStep("Return", `Returning prefix of length ${i}: "${first.substring(0, i)}".`, 14, { sortedStrs, first, last, i, finished: true, result: first.substring(0, i) });
    }

    return steps;
  }, [rawStrs, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { i, j, c, finished, result, submatch, sortedStrs, first, last, match } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header section with LC metadata */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center">
                <Search className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Longest Common Prefix</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-2 font-mono">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-tighter uppercase font-black tracking-widest">String Matching</span>
                <span>LC 14 • Easy</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
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
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter text-blue-600">14. Longest Common Prefix</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>Write a function to find the longest common prefix string amongst an array of strings.</p>
                  <p>If there is no common prefix, return an empty string <code className="bg-slate-100 px-1.5 rounded text-pink-600 font-bold">""</code>.</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Hash size={16}/> Examples:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Input:</span> strs = ["flower","flow","flight"]</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Output:</span> "fl"</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Input:</span> strs = ["dog","racecar","car"]</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Output:</span> ""</p>
                    <p className="text-xs text-slate-400 italic pt-2">Explanation: There is no common prefix among the input strings.</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold">1 {'<='} strs.length {'<='} 200</code></li>
                  <li><code>0 {'<='} strs[i].length {'<='} 200</code></li>
                  <li><code>strs[i]</code> consists of only lowercase English letters.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key].complexity}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-blue-400" />
                    <span className="font-bold uppercase tracking-tight">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-blue-500/15 border-l-4 border-blue-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 font-mono">
                <div className="flex items-center gap-2 text-blue-600">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Input Strings (csv)</label>
                    <input value={strsInput} onChange={(e) => { setStrsInput(e.target.value.toLowerCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    Next Step <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Database size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Target size={14} className="text-blue-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Flow</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono flex items-center gap-3">
                    {submatch === false && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">MISMATCH</span>}
                    {match && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">MATCH</span>}
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[480px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* Visual Tracker */}
                {!finished && (
                  <div className="w-full grid grid-cols-2 gap-4 z-10 mb-8">
                     <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest font-mono">Scanning Index</span>
                        <div className="text-4xl font-black text-indigo-600 font-mono">{i === -1 ? '-' : i}</div>
                        {selectedApproach === 'vertical' && c && (
                          <div className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1 uppercase tracking-tighter">
                            Reference Char: <span className="text-blue-600 font-black">'{c}'</span>
                          </div>
                        )}
                     </div>
                     <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest font-mono">Current Result</span>
                        <div className="text-2xl font-black text-slate-800 font-mono truncate max-w-full">
                            "{rawStrs[0].substring(0, i < 0 ? 0 : i)}"
                        </div>
                     </div>
                  </div>
                )}

                {/* Grid Visuals */}
                <div className="flex-1 flex flex-col items-center justify-center gap-6 overflow-auto py-10 scrollbar-thin">
                   {(sortedStrs || rawStrs).map((word, rowIdx) => {
                      const isActiveRow = selectedApproach === 'vertical' ? j === rowIdx : (rowIdx === 0 || rowIdx === (sortedStrs?.length - 1));
                      const rowChars = word.split('');
                      
                      return (
                        <div key={rowIdx} className={`flex items-center gap-2 transition-opacity duration-300 ${isActiveRow || finished ? 'opacity-100' : 'opacity-40'}`}>
                           <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 font-mono">{rowIdx}</div>
                           <div className="flex gap-1">
                              {rowChars.map((char, colIdx) => {
                                 const isScanningCol = i === colIdx;
                                 const isMatched = colIdx < i;
                                 const isPointer = isScanningCol && isActiveRow;
                                 const isCurrentMismatch = isPointer && submatch === false;

                                 let cellClass = "w-10 h-12 border-2 rounded-xl flex items-center justify-center font-mono font-black text-lg transition-all duration-300";
                                 let themeClass = "bg-white border-slate-100 text-slate-300";

                                 if (isCurrentMismatch) {
                                   themeClass = "bg-rose-500 border-rose-600 text-white scale-125 z-20 animate-pulse";
                                 } else if (isPointer) {
                                   themeClass = "bg-indigo-600 border-indigo-700 text-white scale-110 shadow-lg z-10";
                                 } else if (isMatched) {
                                   themeClass = "bg-emerald-50 border-emerald-200 text-emerald-700";
                                 }

                                 return (
                                   <div key={colIdx} className={`${cellClass} ${themeClass}`}>
                                      {char}
                                      {isPointer && !finished && (
                                        <div className="absolute -top-7 text-indigo-500 animate-bounce">
                                          <MousePointer2 size={16} className="rotate-[-45deg]"/>
                                        </div>
                                      )}
                                   </div>
                                 );
                              })}
                              {/* Empty string handling */}
                              {word.length === 0 && <div className="text-[10px] text-slate-300 italic font-mono uppercase tracking-widest pl-2">Empty</div>}
                           </div>
                        </div>
                      );
                   })}
                </div>

                {/* Completion UI */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-blue-100 px-12 py-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono tracking-tighter">Algorithm Result</span>
                        <div className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm font-mono italic underline decoration-blue-200 decoration-8 underline-offset-8">
                           "{result || " "}"
                        </div>
                        <div className="mt-8 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                           Length: {result.length} • Verified Optimal
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
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 font-mono leading-tight">
                <BookOpen className="text-indigo-600"/> The Prefix Search Space
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-mono tracking-tight">
                A common prefix is the <strong>intersection</strong> of characters at the start of all strings. Finding the LCP requires identifying the first index where the strings "diverge".
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Type size={18}/> Early Mismatch Principle</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4 font-black">
                          "One failure terminates the whole search."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed font-mono">
                          Vertical scanning is particularly efficient when strings have different characters early on. Instead of looking at entire strings, we look at columns. If column 0 differs, we return O(N) instead of O(S).
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><SortAsc size={18}/> Lexicographical Bounds</h3>
                        <p className="text-sm text-amber-700 leading-relaxed font-mono">
                          In a sorted list, the strings at index 0 and index N-1 are the <strong>most different</strong> strings in the entire array. If they share a prefix, every string sandwiched between them <i>must</i> also share that prefix.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Calculator size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-mono">Efficiency Profile</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono tracking-tighter">Time Complexity</span>
                          <div className="font-mono text-2xl font-black text-indigo-400">O(S)</div>
                          <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-tighter">Sum of all characters</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono tracking-tighter">Space Complexity</span>
                          <div className="font-mono text-2xl font-black">O(1)</div>
                          <p className="text-[9px] text-indigo-200 mt-2 font-mono uppercase tracking-tighter">In-place comparison</p>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase mb-1 flex items-center gap-2 font-mono"><Zap size={12}/> Pro: Binary Search on Length</h4>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                        Another strategy is to binary search for the length <code>L</code>. Check if <code>strs[0...n-1].substring(0, L)</code> are all identical. This is O(S log L).
                      </p>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight font-mono">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 font-mono">
                        "For a dataset where mismatches likely occur near the start of the strings, I implemented a Vertical Scanning approach to minimize character comparisons. While the worst-case complexity remains O(S)—where S is the total number of characters—Vertical Scanning allows for an early return as soon as any discrepancy is found, unlike Horizontal Scanning which would fully process earlier pairs. This strategy ensures peak performance with O(1) auxiliary space, making it a robust solution for large-scale string processing pipelines."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-mono font-black tracking-tight">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"What are the edge cases for LCP?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "1. Empty input array (return empty string).<br/>
                                 2. Array with one string (return that string).<br/>
                                 3. Strings with no common prefix (return empty string).<br/>
                                 4. Strings of varying lengths, where one is a prefix of all others."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"How would you optimize for a billion strings?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "If the target dataset is massive, I'd use a <b>Trie</b> (prefix tree). Inserting all strings into a Trie allows you to find the LCP by following the path from the root until you hit a node with multiple children or the end of a word."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-mono">
                        <AlertCircle size={20}/> Leadership Strategy
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Invent and Simplify</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">The Sorting approach is the 'Simplified' solution. It trades sorting time for a very clean, 2-string comparison loop, showing you can think beyond standard iterations.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Deliver Results</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Explain that in languages with immutable strings (Java/JS), using <code>substring()</code> creates new objects. For extremely tight memory, you'd use pointers only until the final return.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Calculator className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter font-black">Complexity Breakdown</p>
                    <div className="space-y-4 w-full font-mono">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Horizontal O(S)</span>
                                <span className="text-rose-500 font-black tracking-tighter">Potential Redundancy</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Vertical O(S)</span>
                                <span className="text-indigo-500 font-black tracking-tighter">Fast Early Mismatch</span>
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

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Arrays|Math|charAt|length|substring|sort)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[10px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['Arrays', 'Math', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['charAt', 'length', 'substring', 'sort'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default LongestCommonPrefixVisualizer;
