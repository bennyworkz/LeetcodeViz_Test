import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, ArrowRight, CornerDownRight, Zap, RefreshCw, Timer,
  AlignLeft, Type, Hash, ShieldCheck
} from 'lucide-react';

const APPROACHES = {
  rowSimulation: {
    id: 'rowSimulation',
    title: '1. Row Simulation',
    subtitle: 'Intuitive: O(N) Time, O(N) Space.',
    icon: <AlignLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public String convert(String s, int numRows) {
        if (numRows == 1 || numRows >= s.length()) {
            return s;
        }
        
        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) {
            rows[i] = new StringBuilder();
        }
        
        int currRow = 0;
        boolean goingDown = false;
        
        for (char c : s.toCharArray()) {
            rows[currRow].append(c);
            
            if (currRow == 0 || currRow == numRows - 1) {
                goingDown = !goingDown;
            }
            
            currRow += goingDown ? 1 : -1;
        }
        
        StringBuilder ret = new StringBuilder();
        for (StringBuilder row : rows) {
            ret.append(row);
        }
        
        return ret.toString();
    }
}`,
    explanation: "This approach simulates the Zigzag process. Instead of allocating a massive 2D matrix (which wastes a ton of memory on empty spaces), we use an array of StringBuilders, one for each row. We iterate through the characters of the string one by one. We maintain a 'currRow' pointer and a 'goingDown' boolean flag. We append the current character to rows[currRow]. Then, if we are at the very top row (0) or the very bottom row (numRows - 1), we flip our 'goingDown' direction. Finally, we update 'currRow' by +1 or -1 based on the current direction. At the end, we concatenate all the StringBuilders."
  },
  mathJumps: {
    id: 'mathJumps',
    title: '2. Mathematical Jumps',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <Hash size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public String convert(String s, int numRows) {
        if (numRows == 1 || numRows >= s.length()) {
            return s;
        }
        
        StringBuilder ret = new StringBuilder();
        int cycleLen = 2 * numRows - 2;
        
        for (int i = 0; i < numRows; i++) {
            for (int j = 0; j + i < s.length(); j += cycleLen) {
                // Character in the vertical pillar
                ret.append(s.charAt(j + i));
                
                // Character in the diagonal (if not top/bottom row)
                if (i != 0 && i != numRows - 1 && j + cycleLen - i < s.length()) {
                    ret.append(s.charAt(j + cycleLen - i));
                }
            }
        }
        
        return ret.toString();
    }
}`,
    explanation: "We can build the final string directly row by row mathematically, avoiding the O(N) space needed for an array of StringBuilders. Notice that characters in Row 0 jump exactly by a full 'cycle' each time. The cycle length is (2 * numRows - 2). For the top and bottom rows, we only take one character per cycle. For the inner rows, we take two characters per cycle: one on the downward vertical pillar, and one on the upward diagonal. We can calculate their exact original indices using 'j + i' and 'j + cycleLen - i'."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">6. Zigzag Conversion</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          The string <code>"PAYPALISHIRING"</code> is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)
        </p>

        <pre className="bg-slate-800 text-emerald-400 p-4 rounded-xl font-mono text-sm leading-relaxed overflow-x-auto shadow-inner">
P   A   H   N
A P L S I I G
Y   I   R</pre>

        <p className="text-lg leading-relaxed">
          And then read line by line: <code>"PAHNAPLSIIGYIR"</code>
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Write the code that will take a string and make this conversion given a number of rows:
          <br/>
          <code>string convert(string s, int numRows);</code>
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "PAYPALISHIRING", numRows = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "PAHNAPLSIIGYIR"</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "PAYPALISHIRING", numRows = 4</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "PINALSIGYAHRPI"</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation:</p>
                 <pre className="bg-slate-100 p-2 rounded mt-1 border border-slate-200">
P     I    N
A   L S  I G
Y A   H R
P     I</pre>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "A", numRows = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "A"</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= s.length &lt;= 1000</code></li>
              <li><code>s</code> consists of English letters (lower-case and upper-case), <code>','</code> and <code>'.'</code>.</li>
              <li><code>1 &lt;= numRows &lt;= 1000</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ZigzagVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('rowSimulation');
  const [sInput, setSInput] = useState('PAYPALISHIRING');
  const [nInput, setNInput] = useState('4');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s = sInput.trim();
    if (!s) s = "PAYPALISHIRING";
    
    let numRows = parseInt(nInput.trim());
    if (isNaN(numRows) || numRows < 1) numRows = 3;
    
    // UI Safeguards to prevent massive layouts freezing browser
    if (s.length > 25) s = s.slice(0, 25);
    if (numRows > 10) numRows = 10;

    return { s, numRows };
  }, [sInput, nInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s, numRows } = parsedData;
    
    const cloneRows = (r) => [...r];

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return;
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'rowSimulation') {
        
        addStep(
            "Evaluate Base Case", 
            `Line 3: if (numRows == 1 || numRows >= s.length())\n\nWe check if numRows (${numRows}) is 1, or if it is greater than/equal to the string length (${s.length}). If either is true, zigzagging is impossible or irrelevant.`, 
            3, 
            { action: 'init', rows: [], currRow: null, goingDown: null, s, numRows, c: null, i: null }
        );

        if (numRows === 1 || numRows >= s.length) {
            addStep(
                "Return Base Case", 
                `Line 4: return s;\n\nThe base case condition was met. The pattern is simply a straight horizontal or vertical line, so the original string itself is the answer. We return it immediately.`, 
                4, 
                { action: 'success', rows: [], currRow: null, goingDown: null, s, numRows, c: null, i: null, ans: s }
            );
            return steps;
        }

        let rows = Array(numRows).fill("");
        addStep(
            "Initialize Row Array", 
            `Line 7: StringBuilder[] rows = new StringBuilder[numRows];\n\nCreate an empty array of size ${numRows}. Each slot will hold a StringBuilder corresponding to a horizontal row in our conceptual zigzag grid.`, 
            7, 
            { action: 'initArray', rows: cloneRows(rows), currRow: null, goingDown: null, s, numRows, c: null, i: null }
        );

        for (let i = 0; i < numRows; i++) {
            addStep(
                "Evaluate Row Init Loop", 
                `Line 8: for (int i = ${i}; i < ${numRows}; i++)\n\nThe condition i < numRows is true. We enter the loop to initialize the StringBuilder for row ${i}.`, 
                8, 
                { action: 'initArray', rows: cloneRows(rows), currRow: null, goingDown: null, s, numRows, c: null, i: null }
            );
            
            addStep(
                "Instantiate StringBuilder", 
                `Line 9: rows[${i}] = new StringBuilder();\n\nWe allocate memory for a new StringBuilder and assign it to rows[${i}].`, 
                9, 
                { action: 'initArray', rows: cloneRows(rows), currRow: null, goingDown: null, s, numRows, c: null, i: null }
            );
        }

        let currRow = 0;
        let goingDown = false;
        
        addStep(
            "Setup Pointers & Direction", 
            `Line 12-13: int currRow = 0; boolean goingDown = false;\n\nWe establish our state trackers.\n• 'currRow' = 0 (We always start dropping characters at the top row).\n• 'goingDown' = false (It acts as a directional switch. We initialize it to false because it will immediately flip to true on the very first character).`, 
            12, 
            { action: 'setupPtrs', rows: cloneRows(rows), currRow, goingDown, s, numRows, c: null, i: null }
        );

        let currCol = 0; // Visual tracker
        let gridLocations = [];

        for (let i = 0; i < s.length; i++) {
            let c = s[i];
            
            addStep(
                "Evaluate String Iteration", 
                `Line 15: for (char c : s.toCharArray())\n\nWe pull the next character from the string at index ${i}: '${c}'. We will now drop this character into the correct row bucket.`, 
                15, 
                { action: 'loopStart', rows: cloneRows(rows), currRow, goingDown, s, numRows, c, i, gridLocations: [...gridLocations] }
            );

            rows[currRow] += c;
            gridLocations.push({ char: c, x: currCol, y: currRow, idx: i });

            addStep(
                "Append to Current Row", 
                `Line 16: rows[currRow].append('${c}');\n\nWe append '${c}' to the StringBuilder located at rows[${currRow}].`, 
                16, 
                { action: 'append', rows: cloneRows(rows), currRow, goingDown, s, numRows, c, i, gridLocations: [...gridLocations] }
            );

            addStep(
                "Check Direction Boundary", 
                `Line 18: if (currRow == 0 || currRow == numRows - 1)\n\nAre we at the absolute top wall (0) or bottom wall (${numRows - 1})?\ncurrRow is ${currRow}. ${currRow === 0 || currRow === numRows - 1 ? 'Yes! We must reverse our trajectory.' : 'No, we maintain our current trajectory.'}`, 
                18, 
                { action: 'evalSwitch', rows: cloneRows(rows), currRow, goingDown, s, numRows, c, i, gridLocations: [...gridLocations] }
            );

            if (currRow === 0 || currRow === numRows - 1) {
                goingDown = !goingDown;
                addStep(
                    "Flip Direction", 
                    `Line 19: goingDown = !goingDown;\n\nWe hit a wall! We flip the boolean switch. 'goingDown' is now ${goingDown ? 'TRUE (We will move Down)' : 'FALSE (We will move Diagonally Up)'}.`, 
                    19, 
                    { action: 'flip', rows: cloneRows(rows), currRow, goingDown, s, numRows, c, i, gridLocations: [...gridLocations] }
                );
            }

            let oldRow = currRow;
            currRow += goingDown ? 1 : -1;
            
            if (!goingDown) currCol++; // Diagonals move over a column in visual space

            addStep(
                "Update Row Pointer", 
                `Line 22: currRow += goingDown ? 1 : -1;\n\nBecause 'goingDown' is ${goingDown}, we mathematically add ${goingDown ? '1' : '-1'} to our current row pointer.\n'currRow' shifts from ${oldRow} to ${currRow} for the NEXT character.`, 
                22, 
                { action: 'move', rows: cloneRows(rows), currRow, goingDown, s, numRows, c, i, gridLocations: [...gridLocations] }
            );
        }

        addStep(
            "String Iteration Complete", 
            `Line 15: The string iteration loop terminates.\n\nThere are no more characters left in "${s}". All characters have been perfectly distributed into their respective horizontal rows.`, 
            15, 
            { action: 'loopEnd', rows: cloneRows(rows), currRow, goingDown, s, numRows, c: null, i: null, gridLocations: [...gridLocations] }
        );

        addStep(
            "Initialize Output Builder", 
            `Line 25: StringBuilder ret = new StringBuilder();\n\nWe create the final master StringBuilder 'ret'. This will hold our concatenated final answer.`, 
            25, 
            { action: 'concat', rows: cloneRows(rows), currRow, goingDown, s, numRows, c: null, i: null, gridLocations: [...gridLocations], retStr: "" }
        );
        
        let finalRes = "";
        for(let rIdx = 0; rIdx < rows.length; rIdx++) {
            addStep(
                "Evaluate Concatenation Loop", 
                `Line 26: for (StringBuilder row : rows)\n\nWe are iterating through our array of rows. Currently looking at row ${rIdx}.`, 
                26, 
                { action: 'concat', rows: cloneRows(rows), currRow, goingDown, s, numRows, c: null, i: null, gridLocations: [...gridLocations], retStr: finalRes }
            );
            
            finalRes += rows[rIdx];
            
            addStep(
                "Append Row to Output", 
                `Line 27: ret.append(row);\n\nWe append the entire contents of row ${rIdx} ("${rows[rIdx]}") to our master string 'ret'.\n'ret' is now: "${finalRes}"`, 
                27, 
                { action: 'concat', rows: cloneRows(rows), currRow, goingDown, s, numRows, c: null, i: null, gridLocations: [...gridLocations], retStr: finalRes }
            );
        }

        addStep(
            "Algorithm Complete", 
            `Line 30: return ret.toString();\n\nThe loop is finished, and we return the final constructed string.\nConversion completely successful!`, 
            30, 
            { action: 'success', isSuccess: true, ans: finalRes, rows: cloneRows(rows), currRow, goingDown, s, numRows, c: null, i: null, gridLocations: [...gridLocations], retStr: finalRes }
        );
    
    } else if (selectedApproachId === 'mathJumps') {
        
        addStep(
            "Evaluate Base Case", 
            `Line 3: if (numRows == 1 || numRows >= s.length())\n\nWe check if numRows (${numRows}) is 1, or if it is greater than/equal to the string length (${s.length}). If so, zigzagging is geometrically impossible.`, 
            3, 
            { action: 'init', s, numRows, cycleLen: null, i: null, j: null, retStr: "" }
        );

        if (numRows === 1 || numRows >= s.length) {
            addStep(
                "Return Base Case", 
                `Line 4: return s;\n\nBase case condition is met. The string is already in its final configuration. Return immediately.`, 
                4, 
                { action: 'success', s, numRows, cycleLen: null, i: null, j: null, ans: s, retStr: s }
            );
            return steps;
        }

        addStep(
            "Initialize Output Builder", 
            `Line 7: StringBuilder ret = new StringBuilder();\n\nWe create a 'ret' StringBuilder. We will build the final answer directly character-by-character, skipping the O(N) array overhead completely.`, 
            7, 
            { action: 'init', s, numRows, cycleLen: null, i: null, j: null, retStr: "" }
        );

        let cycleLen = 2 * numRows - 2;
        addStep(
            "Calculate Cycle Length", 
            `Line 8: int cycleLen = 2 * numRows - 2;\n\nThis is the core mathematical insight. The zigzag pattern perfectly repeats every 'cycleLen' characters.\ncycleLen = 2 * ${numRows} - 2 = ${cycleLen}.`, 
            8, 
            { action: 'calcCycle', s, numRows, cycleLen, i: null, j: null, retStr: "" }
        );

        let retStr = "";

        for (let i = 0; i < numRows; i++) {
            addStep(
                "Evaluate Row Loop", 
                `Line 10: for (int i = ${i}; i < ${numRows}; i++)\n\nThe condition i < numRows is true. We are now attempting to gather all characters that mathematically belong in conceptual row ${i}.`, 
                10, 
                { action: 'rowLoop', s, numRows, cycleLen, i, j: null, retStr }
            );

            for (let j = 0; j + i < s.length; j += cycleLen) {
                addStep(
                    "Evaluate Cycle Loop", 
                    `Line 11: for (int j = ${j}; j + i < ${s.length}; j += cycleLen)\n\n'j' represents the start index of the current cycle block. We ensure the first character in this cycle for this row (j + i = ${j + i}) is within string bounds.`, 
                    11, 
                    { action: 'cycleLoop', s, numRows, cycleLen, i, j, retStr }
                );
                
                let idx1 = j + i;
                retStr += s[idx1];
                addStep(
                    "Append Vertical Pillar Character", 
                    `Line 13: ret.append(s.charAt(j + i));\n\nEvery row has at least one character per cycle, located on the vertical downward pillar.\nIts mathematical index is j + i = ${j} + ${i} = ${idx1}.\nCharacter is '${s[idx1]}'. We append it.`, 
                    13, 
                    { action: 'append1', s, numRows, cycleLen, i, j, idx1, retStr }
                );

                addStep(
                    "Evaluate Diagonal Condition", 
                    `Line 16: if (i != 0 && i != numRows - 1 && j + cycleLen - i < s.length())\n\nDoes this row contain a second character (on the upward diagonal) during this cycle?\nInner rows DO have a diagonal character. Top and bottom rows DO NOT. We must also check if the calculated diagonal index exists within bounds.`, 
                    16, 
                    { action: 'checkDiag', s, numRows, cycleLen, i, j, retStr }
                );

                if (i !== 0 && i !== numRows - 1) {
                    let idx2 = j + cycleLen - i;
                    addStep(
                        "Evaluate Diagonal Bounds", 
                        `Line 16 Cont: We are on an inner row. We calculate the theoretical diagonal index: j + cycleLen - i = ${j} + ${cycleLen} - ${i} = ${idx2}.\nIs ${idx2} < ${s.length}? ${idx2 < s.length ? 'Yes!' : 'No, it falls out of bounds.'}`, 
                        16, 
                        { action: 'checkDiagBound', s, numRows, cycleLen, i, j, idx2, retStr }
                    );
                    
                    if (idx2 < s.length) {
                        retStr += s[idx2];
                        addStep(
                            "Append Diagonal Character", 
                            `Line 17: ret.append(s.charAt(j + cycleLen - i));\n\nSince index ${idx2} is valid, we extract character '${s[idx2]}' and append it.`, 
                            17, 
                            { action: 'append2', s, numRows, cycleLen, i, j, idx2, retStr }
                        );
                    }
                }
                
                addStep(
                    "End of Cycle Block", 
                    `Line 11: End of cycle block. We will now increment 'j' by cycleLen (${cycleLen}) to jump to the next repeating segment of the zigzag.`, 
                    11, 
                    { action: 'cycleLoopEnd', s, numRows, cycleLen, i, j, retStr }
                );
            }
        }

        addStep(
            "Algorithm Complete", 
            `Line 22: return ret.toString();\n\nWe have completely iterated through all theoretical rows and cycles. The string is fully constructed in O(1) auxiliary space!`, 
            22, 
            { action: 'success', isSuccess: true, ans: retStr, s, numRows, cycleLen, i: null, j: null, retStr }
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
  const { isSuccess, ans, rows, currRow, goingDown, c: activeChar, i: charIndex, action, gridLocations, retStr, cycleLen, i: mathI, j: mathJ, idx1, idx2 } = state;
  const { s, numRows } = parsedData;

  // Grid Extents (for Row Sim)
  const maxCols = gridLocations && gridLocations.length > 0 ? Math.max(...gridLocations.map(g => g.x)) + 1 : 1;
  const showGrid = gridLocations !== undefined && numRows > 1 && selectedApproachId === 'rowSimulation';

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <CornerDownRight className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Zigzag Conversion</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 6</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="violet" />
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
                    
                    {selectedApproachId === 'rowSimulation' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Curr Char" val={activeChar !== null && activeChar !== undefined ? `'${activeChar}'` : "null"} color="sky" active={activeChar !== null && activeChar !== undefined} />
                            <VariableCard label="Target Row" val={currRow !== null && currRow !== undefined ? currRow : "null"} color="violet" active={currRow !== null && currRow !== undefined} />
                            <VariableCard label="Direction" val={goingDown !== null && goingDown !== undefined ? (goingDown ? "DOWN (+1)" : "UP (-1)") : "null"} color={goingDown ? "emerald" : "rose"} active={goingDown !== null && goingDown !== undefined} />
                            <VariableCard label="Remaining" val={charIndex !== null && charIndex !== undefined ? Math.max(0, s.length - 1 - charIndex) : "0"} color="slate" active={charIndex !== null && charIndex !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Cycle Len" val={cycleLen !== null ? cycleLen : "-"} color="purple" active={cycleLen !== null} />
                            <VariableCard label="Row (i)" val={mathI !== null ? mathI : "-"} color="sky" active={mathI !== null} />
                            <VariableCard label="Cycle Start (j)" val={mathJ !== null ? mathJ : "-"} color="amber" active={mathJ !== null} />
                            <VariableCard label="Target Idx" val={idx1 !== undefined ? (idx2 !== undefined ? `${idx1}, ${idx2}` : idx1) : "-"} color="emerald" active={idx1 !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="PAYPALISHIRING" />
                    </div>
                    
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Rows (numRows)</label>
                        <input type="number" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} min="1" max="10" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="4" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <CornerDownRight size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px]">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-8 overflow-y-auto">
                      
                      {/* String Array Source Indicator */}
                      <div className="flex flex-col items-center w-full max-w-full overflow-x-auto pb-4">
                          <span className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest font-mono flex items-center gap-2"><Type size={12}/> Input String Iteration</span>
                          <div className="flex gap-1">
                              {s.split('').map((char, i) => {
                                  let isCurrent = false;
                                  let isPast = false;
                                  
                                  if (selectedApproachId === 'rowSimulation') {
                                      isCurrent = charIndex === i && !isSuccess;
                                      isPast = charIndex !== null && i < charIndex;
                                  } else {
                                      // Math approach
                                      isCurrent = (!isSuccess && (idx1 === i || idx2 === i));
                                      isPast = isSuccess || (retStr && retStr.includes(char)); // simplistic past check for math
                                  }
                                  
                                  let cls = "w-6 h-8 sm:w-8 sm:h-10 flex items-center justify-center rounded border-2 font-mono font-black text-sm sm:text-base transition-all duration-300 ";
                                  
                                  if (isCurrent) cls += "bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-md ring-2 ring-sky-300/50 z-20 animate-pulse";
                                  else if (isSuccess) cls += "bg-emerald-50 border-emerald-200 text-emerald-600";
                                  else if (isPast) cls += "bg-slate-100 border-slate-300 text-slate-400 opacity-60";
                                  else cls += "bg-white border-slate-200 text-slate-700";

                                  return (
                                      <div key={i} className="flex flex-col items-center gap-1">
                                          <div className={cls}>{char}</div>
                                          <span className="text-[8px] font-mono text-slate-300">{i}</span>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Visualizing Rows Array (Row Simulation Only) */}
                      {selectedApproachId === 'rowSimulation' && rows && rows.length > 0 && (
                          <div className="w-full flex flex-col md:flex-row items-stretch md:items-start justify-center gap-8 border-t border-slate-200 pt-8 mt-2">
                              
                              {/* 1. Array of StringBuilders */}
                              <div className="flex flex-col gap-2 shrink-0">
                                  <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest font-mono text-center">StringBuilder[] rows</span>
                                  {rows.map((rStr, i) => {
                                      let isTargetRow = currRow === i && !isSuccess;
                                      
                                      let rowClass = "flex items-center h-10 border-2 rounded-xl transition-all duration-300 px-3 relative w-[140px] sm:w-[180px] ";
                                      if (isSuccess) rowClass += "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm";
                                      else if (isTargetRow) {
                                          if (action === 'append') rowClass += "bg-sky-50 border-sky-400 text-sky-900 scale-105 shadow-md ring-2 ring-sky-200 z-10";
                                          else rowClass += "bg-violet-50 border-violet-300 text-violet-800 z-10";
                                      } else rowClass += "bg-white border-slate-200 text-slate-600";

                                      return (
                                          <div key={i} className={rowClass}>
                                              <span className={`absolute -left-6 text-[10px] font-black font-mono ${isTargetRow ? 'text-violet-600' : 'text-slate-400'}`}>{i}</span>
                                              <div className="font-mono font-bold tracking-[0.2em] truncate w-full">
                                                  {rStr || <span className="text-slate-300 opacity-50 tracking-normal">""</span>}
                                              </div>
                                              {isTargetRow && action === 'append' && activeChar && (
                                                  <span className="absolute right-3 text-sky-500 animate-in zoom-in font-mono font-black drop-shadow-md">+{activeChar}</span>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>

                              {/* 2. Physical Zigzag Grid Render */}
                              {showGrid && (
                                  <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner overflow-x-auto max-w-full">
                                      <span className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest font-mono flex items-center gap-1"><ShieldCheck size={14}/> Conceptual Zigzag Grid</span>
                                      
                                      <div 
                                          className="relative"
                                          style={{
                                              width: `${maxCols * 32}px`,
                                              height: `${numRows * 32}px`
                                          }}
                                      >
                                          {/* Draw lines linking characters to show the path */}
                                          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                                              {gridLocations.map((loc, idx) => {
                                                  if (idx === 0) return null;
                                                  let prevLoc = gridLocations[idx - 1];
                                                  // Center coords (each box is 32x32, center is 16)
                                                  let x1 = prevLoc.x * 32 + 16;
                                                  let y1 = prevLoc.y * 32 + 16;
                                                  let x2 = loc.x * 32 + 16;
                                                  let y2 = loc.y * 32 + 16;
                                                  return (
                                                      <line 
                                                          key={`line-${idx}`} 
                                                          x1={x1} y1={y1} x2={x2} y2={y2} 
                                                          stroke="#8b5cf6" 
                                                          strokeWidth="2" 
                                                      />
                                                  )
                                              })}
                                          </svg>

                                          {/* Draw physical chars */}
                                          {gridLocations.map((loc, idx) => {
                                              let isLatest = idx === gridLocations.length - 1 && !isSuccess;
                                              
                                              return (
                                                  <div 
                                                      key={`grid-${idx}`}
                                                      className={`absolute w-8 h-8 flex items-center justify-center font-mono font-black rounded-lg border-2 transition-all duration-500 ${isLatest ? 'bg-sky-100 border-sky-400 text-sky-800 scale-125 z-20 shadow-md' : 'bg-white border-slate-300 text-slate-700 z-10'}`}
                                                      style={{
                                                          left: `${loc.x * 32}px`,
                                                          top: `${loc.y * 32}px`
                                                      }}
                                                  >
                                                      {loc.char}
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Return String Visualization (Math Approach) */}
                      {selectedApproachId === 'mathJumps' && retStr !== undefined && (
                          <div className="w-full flex flex-col items-center border-t border-slate-200 pt-8 mt-4 gap-4">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center">Final String Built (ret)</span>
                              <div className="bg-sky-50 border-2 border-sky-300 text-sky-900 px-6 py-4 rounded-2xl font-mono font-black tracking-[0.3em] text-2xl shadow-inner min-w-[200px] min-h-[64px] text-center flex items-center justify-center relative overflow-hidden break-all">
                                  {retStr}
                                  {!isSuccess && action.startsWith('append') && (
                                     <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-sky-200 animate-pulse"></div>
                                  )}
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">CONVERSION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Final String: "{ans}"
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
                <AlignLeft className="text-violet-600"/> Sorting by Simulation
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                When faced with string grid problems, the naive approach is to create an actual 2D character matrix. However, matrices waste a ton of memory on empty spaces (the gaps between the zigzag lines). Simulation using an array of StringBuilders is vastly superior.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> The Row Tracker
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We don't care about the <em>column</em> index of a character in the final output string. We only care about which <strong>row</strong> it lands in.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            If we know exactly which row a character belongs to, we can just throw it into a "bucket" (StringBuilder) for that row. <br/><br/>
                            Once we process the entire string, reading line-by-line is as simple as combining Bucket 0 + Bucket 1 + Bucket 2...
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <RefreshCw size={18}/> The Direction Toggle
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            How do we update our row pointer? We imagine a ball bouncing between two walls (Row 0 and Row N-1).
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We maintain a boolean <code>goingDown</code>.</p>
                            <p>If we are at Row 0, we MUST start going down. We flip the switch to <code>true</code> (+1).</p>
                            <p>If we hit Row N-1 (the bottom), we MUST start going diagonally up. We flip the switch to <code>false</code> (-1).</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Hash size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Alternative: The Pure Math Approach</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            Instead of simulating the traversal, you can mathematically jump through the original string and construct the output directly. <br/><br/>
                            The zigzag pattern repeats every <strong>cycle</strong>. <br/>
                            <code>Cycle Length = 2 * numRows - 2</code>.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-amber-300">
                            // Characters in Row 0 jump by a full cycle.<br/>
                            // Characters in Row N-1 jump by a full cycle.<br/>
                            // Characters in middle rows jump twice per cycle:<br/>
                            // Jump 1: j + cycleLen<br/>
                            // Jump 2: j + cycleLen - 2 * currentRow
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
                        "I chose the Row Simulation approach. It's incredibly intuitive and robust against off-by-one math errors during high-pressure interviews. Rather than using an actual 2D matrix which is inefficient for memory, I used an array of `numRows` StringBuilders to represent each horizontal line. By iterating through the string, I track the current row and a boolean flag indicating direction (`goingDown`). When I hit the top or bottom row boundaries, I flip the direction. At the end, concatenating the StringBuilders yields the exact answer in $O(N)$ time and $O(N)$ space. While a pure mathematical index-jumping solution exists, this simulation is equally optimal in Big-O complexity and much easier to read and maintain."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why not use a 2D Array?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                A 2D array (e.g., <code>char[][] matrix</code>) requires $O(numRows \times N)$ space. Because of the diagonal upward gaps in the zigzag pattern, nearly half of the matrix will be entirely empty (null bytes). By using an array of StringBuilders, we only allocate memory for exactly the characters that exist in the string, strictly maintaining $O(N)$ space.
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
                                <p className="text-[10px] text-slate-500 mt-1">Where $N$ is the length of string `s`. We iterate through the string exactly once to append characters. We iterate through the StringBuilder array exactly once to combine the result.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate $numRows$ StringBuilders, but the total number of characters held across all of them combined is exactly $N$. The final returned string also requires $O(N)$ space.</p>
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

const VariableCard = ({ label, val, color, active }: { label: string; val: any; color: string; active: boolean }) => {
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

const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|rows|numRows|currRow|goingDown|ret|append|toCharArray|length|cycleLen)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['rows', 'ret'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['numRows'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['currRow', 'goingDown'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['append', 'toCharArray', 'length', 'cycleLen'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ZigzagVisualizer;