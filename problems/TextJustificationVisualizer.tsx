import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, AlignJustify, AlignLeft, 
  ArrowRight, XSquare, CheckSquare, FastForward, Maximize2, SplitSquareHorizontal
} from 'lucide-react';

const APPROACHES = {
  greedy: {
    id: 'greedy',
    title: 'Greedy Line Packing',
    subtitle: 'Optimal: O(N) Time, O(N) Space.',
    icon: <AlignJustify size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public List<String> fullJustify(String[] words, int maxWidth) {
        List<String> res = new ArrayList<>();
        int i = 0, n = words.length;
        
        while (i < n) {
            int j = i + 1;
            int lineLen = words[i].length();
            
            // Phase 1: Greedily pack words into the current line
            while (j < n && lineLen + 1 + words[j].length() <= maxWidth) {
                lineLen += 1 + words[j].length();
                j++;
            }
            
            int numOfWords = j - i;
            int numOfGaps = numOfWords - 1;
            StringBuilder sb = new StringBuilder();
            
            // Phase 2: Justify the line
            // If it's the LAST line, or the line has only ONE word -> Left Justify
            if (numOfWords == 1 || j == n) {
                for (int k = i; k < j; k++) {
                    sb.append(words[k]);
                    if (k < j - 1) sb.append(" ");
                }
                while (sb.length() < maxWidth) {
                    sb.append(" "); // Pad remaining space at the end
                }
            } else {
                // Standard Full Justification
                int totalSpaces = maxWidth - lineLen + numOfGaps;
                int spacesPerGap = totalSpaces / numOfGaps;
                int extraSpaces = totalSpaces % numOfGaps;
                
                for (int k = i; k < j; k++) {
                    sb.append(words[k]);
                    if (k < j - 1) {
                        int spacesToApply = spacesPerGap + (k - i < extraSpaces ? 1 : 0);
                        for (int s = 0; s < spacesToApply; s++) sb.append(" ");
                    }
                }
            }
            res.add(sb.toString());
            i = j; // Move to the start of the next line
        }
        
        return res;
    }
}`,
    explanation: "This problem is a pure implementation and simulation challenge. We solve it greedily in two phases per line. \n\nPhase 1 (Packing): We maintain a pointer `i` for the first word of the line. We look ahead with pointer `j`, keeping a running sum of word lengths plus the minimum 1 space between them (`lineLen`). As soon as adding `words[j]` exceeds `maxWidth`, we know the line is 'full'.\n\nPhase 2 (Justification): We calculate the exact number of spaces we need to distribute. If the line has only 1 word, or if it is the very last line in the text, the rules state it must be strictly Left-Justified (words separated by 1 space, padded with spaces at the end). Otherwise, it must be Fully-Justified. We divide the total spaces by the number of gaps to get `spacesPerGap`. Any remainder (`extraSpaces`) is distributed one-by-one to the leftmost gaps. We build the string and repeat!"
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">68. Text Justification</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an array of strings <code>words</code> and a width <code>maxWidth</code>, format the text such that each line has exactly <code>maxWidth</code> characters and is fully (left and right) justified.
        </p>

        <p className="text-base leading-relaxed">
          You should pack your words in a greedy approach; that is, pack as many words as you can in each line. Pad extra spaces <code>' '</code> when necessary so that each line has exactly <code>maxWidth</code> characters.
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium bg-slate-50 p-4 rounded-xl border border-slate-200 w-max">
            <li>Extra spaces between words should be distributed as evenly as possible.</li>
            <li>If the number of spaces on a line does not divide evenly between words, the empty slots on the left will be assigned more spaces than the slots on the right.</li>
            <li>For the <strong>last line</strong> of text, it should be left-justified, and no extra space is inserted between words.</li>
        </ul>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16</p>
              <p><span className="text-slate-400 font-bold">Output:</span> <br/>[<br/>&nbsp;&nbsp;"This&nbsp;&nbsp;&nbsp;&nbsp;is&nbsp;&nbsp;&nbsp;&nbsp;an",<br/>&nbsp;&nbsp;"example&nbsp;&nbsp;of&nbsp;&nbsp;text",<br/>&nbsp;&nbsp;"justification.&nbsp;&nbsp;"<br/>]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> words = ["What","must","be","acknowledgment","shall","be"], maxWidth = 16</p>
              <p><span className="text-slate-400 font-bold">Output:</span> <br/>[<br/>&nbsp;&nbsp;"What&nbsp;&nbsp;&nbsp;must&nbsp;&nbsp;&nbsp;be",<br/>&nbsp;&nbsp;"acknowledgment&nbsp;&nbsp;",<br/>&nbsp;&nbsp;"shall&nbsp;be&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"<br/>]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: Note that the last line is "shall be    " instead of "shall     be", because the last line must be left-justified.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= words.length &lt;= 300</code></li>
              <li><code>1 &lt;= words[i].length &lt;= 20</code></li>
              <li><code>words[i]</code> consists of only English letters and symbols.</li>
              <li><code>1 &lt;= maxWidth &lt;= 100</code></li>
              <li><code>words[i].length &lt;= maxWidth</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const TextJustificationVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('greedy');
  
  const [wordsInput, setWordsInput] = useState('This, is, an, example, of, text, justification.');
  const [maxWidthInput, setMaxWidthInput] = useState('16');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    // Parse words, allowing commas or spaces as delimiters for ease of input
    let wArr = wordsInput.split(/[, ]+/).map(s => s.trim()).filter(s => s.length > 0);
    let mw = parseInt(maxWidthInput.trim(), 10);
    
    if (isNaN(mw) || mw < 1) mw = 16;
    if (wArr.length === 0) wArr = ["This", "is", "an", "example"];
    
    // Safety checks
    if (mw > 30) mw = 30; // UI limit to fit on screen
    wArr = wArr.map(w => w.length > mw ? w.substring(0, mw) : w); // Ensure no word exceeds maxWidth

    // UI Length cap
    if (wArr.length > 20) wArr = wArr.slice(0, 20);

    return { words: wArr, maxWidth: mw };
  }, [wordsInput, maxWidthInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { words, maxWidth } = parsedData;
    const n = words.length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    let res = [];
    let i = 0;

    addStep(
        "Initialization", 
        `Line 2-3: List<String> res = new ArrayList<>();\nint i = 0, n = ${n};\n\nWe start processing words to build our justified lines. Max width is ${maxWidth}.`, 
        3, 
        { words, maxWidth, res: [...res], i, j: null, lineLen: null, action: 'init', activeLine: [] }
    );

    let loopSafety = 0;
    while (i < n) {
        if (loopSafety++ > 100) break;

        let j = i + 1;
        let lineLen = words[i].length;
        let activeLine = [words[i]];

        addStep(
            "Start New Line", 
            `Line 6-7: int j = i + 1; int lineLen = words[${i}].length();\n\nStarting a new line with the word "${words[i]}". Current packed length is ${lineLen}.`, 
            7, 
            { words, maxWidth, res: [...res], i, j, lineLen, action: 'startLine', activeLine: [...activeLine] }
        );

        // Phase 1: Packing
        while (j < n) {
            let nextWordLen = words[j].length;
            let projectedLen = lineLen + 1 + nextWordLen; // +1 for the mandatory space
            
            addStep(
                "Evaluate Next Word", 
                `Line 10: while (j < n && lineLen + 1 + words[j].length() <= maxWidth)\n\nCan we fit "${words[j]}"? \nProjected length: ${lineLen} (current) + 1 (space) + ${nextWordLen} (word) = ${projectedLen}.\nIs ${projectedLen} <= ${maxWidth}?`, 
                10, 
                { words, maxWidth, res: [...res], i, j, lineLen, projectedLen, action: 'evalWord', activeLine: [...activeLine] }
            );

            if (projectedLen <= maxWidth) {
                lineLen += 1 + nextWordLen;
                activeLine.push(words[j]);
                
                addStep(
                    "Pack Word", 
                    `Line 11-12: lineLen += 1 + words[j].length(); j++;\n\nYes! "${words[j]}" fits perfectly. We add it to our tentative line and update our packed length to ${lineLen}.`, 
                    12, 
                    { words, maxWidth, res: [...res], i, j, lineLen, action: 'packWord', activeLine: [...activeLine] }
                );
                j++;
            } else {
                addStep(
                    "Word Overflow", 
                    `Line 10: Projected length ${projectedLen} > ${maxWidth}.\n\n"${words[j]}" DOES NOT fit. We must stop packing and proceed to justify the current line.`, 
                    10, 
                    { words, maxWidth, res: [...res], i, j, lineLen, action: 'wordOverflow', activeLine: [...activeLine] }
                );
                break;
            }
        }

        // Phase 2: Justification
        let numOfWords = j - i;
        let numOfGaps = numOfWords - 1;
        let isLastLine = j === n;

        addStep(
            "Prepare Justification", 
            `Line 15-16: int numOfWords = ${numOfWords}; int numOfGaps = ${numOfGaps};\n\nWe packed ${numOfWords} words. We now calculate how to distribute spaces.`, 
            16, 
            { words, maxWidth, res: [...res], i, j, lineLen, numOfWords, numOfGaps, action: 'prepJustify', activeLine: [...activeLine] }
        );

        let justifiedString = "";

        if (numOfWords === 1 || isLastLine) {
            addStep(
                "Left Justify Rule", 
                `Line 21: if (numOfWords == 1 || j == n)\n\nThis is a special case! ${isLastLine ? "It's the LAST line." : "The line has only ONE word."} \nThe rule dictates we strictly Left-Justify.`, 
                21, 
                { words, maxWidth, res: [...res], i, j, lineLen, numOfWords, numOfGaps, isLastLine, action: 'leftJustifyEval', activeLine: [...activeLine] }
            );

            let sb = "";
            for (let k = i; k < j; k++) {
                sb += words[k];
                if (k < j - 1) sb += " ";
            }
            
            let spacesToPad = maxWidth - sb.length;
            let paddedSpaces = " ".repeat(spacesToPad);
            justifiedString = sb + paddedSpaces;

            addStep(
                "Build Left Justified Line", 
                `Line 22-28: Append words with 1 space, then pad the end.\n\nLine built: "${justifiedString}" (${spacesToPad} trailing spaces added).`, 
                28, 
                { words, maxWidth, res: [...res], i, j, lineLen, justifiedString, action: 'buildLeftJustified', activeLine: [...activeLine] }
            );
        } else {
            let totalSpaces = maxWidth - lineLen + numOfGaps; 
            // lineLen included the base 1 space per gap. 
            // To find TOTAL absolute spaces available to place:
            // total spaces = maxWidth - sum of word lengths
            // Or: total spaces = maxWidth - lineLen + existing base gaps (numOfGaps)
            let spacesPerGap = Math.floor(totalSpaces / numOfGaps);
            let extraSpaces = totalSpaces % numOfGaps;

            addStep(
                "Full Justify Calculations", 
                `Line 31-33: int totalSpaces = ${totalSpaces};\nint spacesPerGap = ${spacesPerGap};\nint extraSpaces = ${extraSpaces};\n\nWe must distribute ${totalSpaces} total spaces across ${numOfGaps} gaps.\nBase spaces per gap: ${spacesPerGap}.\nLeftmost gaps getting 1 extra space: ${extraSpaces}.`, 
                33, 
                { words, maxWidth, res: [...res], i, j, lineLen, totalSpaces, spacesPerGap, extraSpaces, numOfGaps, action: 'calcFullJustify', activeLine: [...activeLine] }
            );

            let sb = "";
            for (let k = i; k < j; k++) {
                sb += words[k];
                if (k < j - 1) {
                    let gapIdx = k - i;
                    let spacesToApply = spacesPerGap + (gapIdx < extraSpaces ? 1 : 0);
                    sb += " ".repeat(spacesToApply);
                }
            }
            justifiedString = sb;

            addStep(
                "Build Fully Justified Line", 
                `Line 35-41: Loop through words and apply dynamic spacing.\n\nLine built: "${justifiedString}"`, 
                41, 
                { words, maxWidth, res: [...res], i, j, lineLen, justifiedString, action: 'buildFullJustified', activeLine: [...activeLine] }
            );
        }

        res.push(justifiedString);
        i = j;

        addStep(
            "Store Line and Advance", 
            `Line 43-44: res.add(sb.toString()); i = j;\n\nAdded the formatted line to results. Moving pointer 'i' to index ${i} for the next line.`, 
            44, 
            { words, maxWidth, res: [...res], i, j: null, lineLen: null, action: 'storeLine', activeLine: [] }
        );
    }

    addStep(
        "Algorithm Complete", 
        `Line 47: return res;\n\nAll words have been packed and justified successfully!`, 
        47, 
        { words, maxWidth, res: [...res], i: null, j: null, lineLen: null, action: 'success', isSuccess: true, ans: res, activeLine: [] }
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
  const { isSuccess, ans, action, words, maxWidth, res, i: currI, j: currJ, lineLen, projectedLen, activeLine, justifiedString, totalSpaces, spacesPerGap, extraSpaces, isLastLine } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <AlignJustify className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Text Justification</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 68</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Strings / Simulation</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'wordOverflow' ? 'bg-rose-500/20 border-rose-500' : (action.includes('build') || action === 'packWord' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'wordOverflow' ? 'rose' : (action.includes('build') || action === 'packWord' ? 'emerald' : 'violet')} />
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
                        <VariableCard label="Line Start (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Explore (j)" val={currJ !== null && currJ !== undefined ? currJ : "-"} color="purple" active={currJ !== null && currJ !== undefined} />
                        <VariableCard label="lineLen" val={lineLen !== null && lineLen !== undefined ? lineLen : "-"} color="amber" active={lineLen !== null && lineLen !== undefined} />
                        <VariableCard label="maxWidth" val={maxWidth ? maxWidth : "-"} color="slate" active={maxWidth !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start shrink-0">
                    <div className="flex-[3] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Words Array</label>
                        <textarea 
                            value={wordsInput} 
                            onChange={(e) => { setWordsInput(e.target.value); setCurrentStep(0); }} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner font-bold text-slate-700 min-h-[60px] resize-none" 
                            placeholder="This, is, an, example..."
                            rows={2}
                        />
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">maxWidth</label>
                        <input type="number" min="1" max="30" value={maxWidthInput} onChange={(e) => { setMaxWidthInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-amber-700" placeholder="16" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto self-end pb-1">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'wordOverflow' ? 'bg-rose-900 border-rose-800' : (action.includes('build') || action === 'packWord' ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'wordOverflow' ? <XSquare size={100}/> : (action.includes('Left') ? <AlignLeft size={100}/> : (action.includes('Full') ? <AlignJustify size={100}/> : <Maximize2 size={100}/>)))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'wordOverflow' ? 'text-rose-400' : (action.includes('build') || action === 'packWord' ? 'text-emerald-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'wordOverflow' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action.includes('build') || action === 'packWord' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-start justify-start pt-12">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-8 overflow-y-auto overflow-x-hidden">
                      
                      {/* Active Words Queue */}
                      {words && (
                          <div className="w-full flex flex-col mb-4">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-2 mb-2"><ArrowRight size={14}/> Word Queue</span>
                              <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner w-full max-h-[140px] overflow-y-auto">
                                  {words.map((w, idx) => {
                                      let isCurrentI = currI === idx && !isSuccess;
                                      let isCurrentJ = currJ === idx && !isSuccess;
                                      let isPacked = activeLine && activeLine.includes(w) && !isSuccess;
                                      let isProcessed = idx < currI || isSuccess;

                                      let boxClass = "px-3 py-1.5 rounded-lg border-2 font-mono font-bold text-sm transition-all duration-300 flex flex-col items-center relative ";
                                      
                                      if (isProcessed) {
                                          boxClass += "bg-slate-200 border-slate-300 text-slate-400 opacity-60";
                                      } else if (isCurrentJ && action === 'wordOverflow') {
                                          boxClass += "bg-rose-100 border-rose-500 text-rose-900 scale-105 shadow-md ring-2 ring-rose-300/50 z-20 animate-shake";
                                      } else if (isCurrentJ) {
                                          boxClass += "bg-purple-100 border-purple-500 text-purple-900 scale-110 shadow-lg ring-2 ring-purple-300/50 z-20";
                                      } else if (isPacked || isCurrentI) {
                                          boxClass += "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm z-10";
                                      } else {
                                          boxClass += "bg-white border-slate-300 text-slate-600 shadow-sm";
                                      }

                                      return (
                                          <div key={`wq-${idx}`} className={boxClass}>
                                              <span>{w}</span>
                                              <span className="text-[8px] text-slate-400 absolute -bottom-4">{w.length}</span>
                                              
                                              {/* Pointer Tags */}
                                              <div className="absolute -top-6 flex gap-1 z-30">
                                                  {isCurrentI && <span className="bg-sky-100 text-sky-800 border border-sky-300 text-[9px] px-1 rounded shadow-sm">i</span>}
                                                  {isCurrentJ && <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[9px] px-1 rounded shadow-sm">j</span>}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      )}

                      {/* Active Line Builder (Grid of chars) */}
                      {!isSuccess && maxWidth && (
                          <div className="w-full flex flex-col mb-4 border-b border-slate-200 pb-8">
                              <div className="flex justify-between items-end mb-2">
                                  <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest font-mono flex items-center gap-2"><Target size={14}/> Line Construction Builder</span>
                                  <span className="text-[10px] font-black font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-sm">Max: {maxWidth}</span>
                              </div>
                              
                              <div className="w-full bg-slate-800 p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-0.5 overflow-x-auto relative">
                                  
                                  {/* Render exact grid of maxWidth cells */}
                                  {Array.from({length: maxWidth}).map((_, idx) => {
                                      
                                      let char = "";
                                      let cellClass = "w-6 h-8 md:w-8 md:h-10 flex items-center justify-center font-mono font-bold text-sm md:text-base border transition-all duration-500 shrink-0 ";
                                      
                                      // Determine what goes in this cell based on the action
                                      if (action.includes('build') && justifiedString) {
                                          // Final string is built, render characters exactly
                                          char = justifiedString[idx] || "";
                                          if (char === " ") {
                                              cellClass += "bg-sky-900/30 border-dashed border-sky-700/50 text-sky-500 opacity-60";
                                              char = "·"; // visual indicator for space
                                          } else if (char !== "") {
                                              cellClass += "bg-emerald-100 border-emerald-400 text-emerald-900";
                                          } else {
                                              cellClass += "bg-slate-900 border-slate-700 text-slate-500";
                                          }
                                      } else if (activeLine && activeLine.length > 0) {
                                          // During packing phase, show words packed with exactly 1 space
                                          let rawPackedStr = activeLine.join(" ");
                                          char = rawPackedStr[idx] || "";
                                          
                                          if (char === " ") {
                                              cellClass += "bg-slate-700 border-dashed border-slate-600 text-slate-400 opacity-60";
                                              char = "·";
                                          } else if (char !== "") {
                                              cellClass += "bg-white border-slate-400 text-slate-800";
                                          } else {
                                              // Tentative overflow highlight
                                              if (action === 'evalWord' && projectedLen !== null && idx >= rawPackedStr.length && idx < projectedLen) {
                                                  // Visualizing the attempted word fitting in
                                                  cellClass += "bg-purple-900/40 border-purple-700/50 border-dashed text-purple-400 animate-pulse";
                                                  // Try to overlay the attempted word string characters
                                                  let attemptWord = " " + words[currJ];
                                                  let localIdx = idx - rawPackedStr.length;
                                                  char = attemptWord[localIdx] || "";
                                              } else if (action === 'wordOverflow' && projectedLen !== null && idx >= rawPackedStr.length && idx < projectedLen) {
                                                  // Overflowing visually! Note: it goes out of bounds of the loop if projectedLen > maxWidth, handled by outer container overflow
                                                  cellClass += "bg-rose-900/40 border-rose-700/50 border-dashed text-rose-400";
                                                  let attemptWord = " " + words[currJ];
                                                  let localIdx = idx - rawPackedStr.length;
                                                  char = attemptWord[localIdx] || "";
                                              } else {
                                                  cellClass += "bg-slate-900 border-slate-700 text-slate-500";
                                              }
                                          }
                                      } else {
                                          cellClass += "bg-slate-900 border-slate-700 text-slate-500";
                                      }

                                      return (
                                          <div key={`cell-${idx}`} className={cellClass}>
                                              {char}
                                          </div>
                                      );
                                  })}

                                  {/* Render Overflow Ghost Cells outside maxWidth if necessary */}
                                  {!isSuccess && action === 'wordOverflow' && projectedLen > maxWidth && Array.from({length: projectedLen - maxWidth}).map((_, idx) => {
                                       let realIdx = maxWidth + idx;
                                       let rawPackedStr = activeLine.join(" ");
                                       let attemptWord = " " + words[currJ];
                                       let localIdx = realIdx - rawPackedStr.length;
                                       let char = attemptWord[localIdx] || "";

                                       return (
                                           <div key={`overflow-${idx}`} className="w-6 h-8 md:w-8 md:h-10 flex items-center justify-center font-mono font-bold text-sm md:text-base border border-dashed transition-all duration-500 shrink-0 bg-rose-900/40 border-rose-700/50 text-rose-400 animate-shake">
                                               {char}
                                           </div>
                                       )
                                  })}

                              </div>

                              {/* Math Breakdown Box for Phase 2 */}
                              {action.includes('calcFull') && totalSpaces !== undefined && (
                                  <div className="w-full grid grid-cols-3 gap-4 mt-6 animate-in slide-in-from-top-4 font-mono text-sm">
                                      <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl flex flex-col items-center shadow-sm">
                                          <span className="text-[10px] text-slate-400 uppercase font-black">Total Spaces</span>
                                          <span className="text-xl font-black text-sky-700">{totalSpaces}</span>
                                          <span className="text-[9px] text-slate-500">MaxWidth - Chars</span>
                                      </div>
                                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl flex flex-col items-center shadow-sm">
                                          <span className="text-[10px] text-slate-400 uppercase font-black">Base per Gap</span>
                                          <span className="text-xl font-black text-purple-700">{spacesPerGap}</span>
                                          <span className="text-[9px] text-slate-500">total / gaps</span>
                                      </div>
                                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex flex-col items-center shadow-sm">
                                          <span className="text-[10px] text-slate-400 uppercase font-black">Extra (Left)</span>
                                          <span className="text-xl font-black text-amber-700">{extraSpaces}</span>
                                          <span className="text-[9px] text-slate-500">total % gaps</span>
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Final Result Array */}
                      <div className="w-full flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-2 mb-2"><FileText size={14}/> Result Output (res)</span>
                          <div className="flex flex-col gap-2 p-4 bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-xl w-full min-h-[120px]">
                              {res && res.map((line, idx) => {
                                  let isNew = !isSuccess && action === 'storeLine' && idx === res.length - 1;
                                  return (
                                      <div key={`res-line-${idx}`} className={`font-mono font-bold text-sm tracking-widest px-4 py-2 rounded-xl transition-all duration-500 whitespace-pre flex border ${isNew ? 'bg-emerald-900/50 text-emerald-400 border-emerald-700 scale-[1.02] shadow-lg animate-in slide-in-from-top-4' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                          <span className="text-slate-500 mr-4 select-none">{idx}:</span>
                                          <span>{line.replace(/ /g, '·')}</span>
                                      </div>
                                  )
                              })}
                              {(!res || res.length === 0) && <span className="text-slate-600 italic font-mono text-sm px-4 my-auto">Waiting for lines...</span>}
                          </div>
                          <p className="text-[9px] text-slate-400 text-center mt-2 italic">Spaces rendered as '·' for visibility.</p>
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">TEXT JUSTIFIED</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Formatted {ans.length} lines perfectly
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
                <AlignJustify className="text-violet-600"/> Two-Phase Processing
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Text Justification is not a clever trick algorithm; it is a strict <strong>simulation</strong> problem. You must explicitly follow the rules laid out in the prompt by breaking the logic into two distinct phases for every line: <em>Packing</em> and <em>Justifying</em>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowRight size={18}/> Phase 1: Packing
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            How do we know when a line is full? We use a greedy lookahead.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>We track <code>lineLen</code>, starting with the length of the first word.</p>
                            <p>For every subsequent word, we calculate a projected length: <code>lineLen + 1 + nextWord.length()</code>. The <code>+1</code> represents the minimum required space between words.</p>
                            <p>If this projection exceeds <code>maxWidth</code>, we immediately stop. The line is sealed.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <SplitSquareHorizontal size={18}/> Phase 2: Space Math
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Once the words are picked, distributing spaces requires simple division and modulo math.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p><code>totalSpaces = maxWidth - sumOfWordLengths</code></p>
                            <p><code>spacesPerGap = totalSpaces / (numOfWords - 1)</code></p>
                            <p><code>extraSpaces = totalSpaces % (numOfWords - 1)</code></p>
                            <p>We loop through the words. Every gap gets <code>spacesPerGap</code>. The first <code>extraSpaces</code> gaps get exactly +1 additional space. This satisfies the "left-biased" rule!</p>
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
                        "Text Justification is a simulation and string manipulation problem. I solved it using a greedy line-packing algorithm. I maintain an outer `while` loop that dictates the start of a new line (`i`). I then use an inner `while` loop with a lookahead pointer (`j`) to pack as many words into the current line as possible, keeping a running tally of character counts plus minimum spaces. Once a word overflows the `maxWidth`, I transition to the justification phase. I handle the two edge cases immediately: if it's the last line, or a line with only one word, I strictly left-justify and pad the remainder with spaces. For standard lines, I calculate `totalSpaces`, divide by `numOfGaps` to find the base spaces per gap, and use modulo to find the `extraSpaces` which I distribute to the leftmost gaps. This processes every word exactly once, resulting in an optimal $O(N)$ time complexity."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not use String.join()?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                While languages like Python or JavaScript have powerful <code>join()</code> methods, they often don't support uneven delimiter injection natively (e.g., 3 spaces here, 2 spaces there). Using a <code>StringBuilder</code> and manually appending spaces via a loop guarantees $O(1)$ memory allocation overhead per line and gives you perfect character-level control for the uneven "extra space" distribution.
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
                                <p className="text-[10px] text-slate-500 mt-1">Where N is the total number of characters across all words (or total length of the final output). We touch every word to pack it, and then touch every character again to build the `StringBuilder` output.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate space for the resulting List of Strings. The total number of characters in the result is bounded by the original words plus the spacing paddings.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|fullJustify|words|maxWidth|res|length|lineLen|numOfWords|numOfGaps|sb|append|totalSpaces|spacesPerGap|extraSpaces|toString)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['fullJustify', 'length', 'append', 'toString'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['words', 'maxWidth', 'res', 'lineLen', 'numOfWords', 'numOfGaps', 'sb', 'totalSpaces', 'spacesPerGap', 'extraSpaces'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default TextJustificationVisualizer;