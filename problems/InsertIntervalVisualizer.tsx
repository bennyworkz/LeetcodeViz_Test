import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, GitMerge, ListPlus, 
  ArrowRight, PlusSquare, Replace, Baseline
} from 'lucide-react';

const APPROACHES = {
  linearScan: {
    id: 'linearScan',
    title: '1. Linear Scan (3 Phases)',
    subtitle: 'Optimal: O(N) Time, O(N) Space.',
    icon: <FastForwardIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0;
        int n = intervals.length;
        
        // Phase 1: Add all intervals that end BEFORE the new interval starts
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i]);
            i++;
        }
        
        // Phase 2: Merge all intervals that overlap with the new interval
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval); // Add the finalized merged interval
        
        // Phase 3: Add all remaining intervals that start AFTER the new interval ends
        while (i < n) {
            result.add(intervals[i]);
            i++;
        }
        
        return result.toArray(new int[result.size()][]);
    }
}`,
    explanation: "Because the intervals are already sorted by start time, we can optimally solve this in a single pass O(N) by breaking the problem into exactly 3 phases. \n\nPhase 1: We scan from left to right, adding any intervals that end entirely before our new interval even begins. \nPhase 2: As soon as an interval doesn't end before our new one starts, and it starts before our new one ends, it overlaps! We dynamically expand our new interval's boundaries (`min` start, `max` end) to swallow these overlapping intervals. We add this single massive merged interval to our result. \nPhase 3: We simply append the remaining intervals, as they are guaranteed to sit safely to the right of our merged interval."
  },
  appendSort: {
    id: 'appendSort',
    title: '2. Append & Sort',
    subtitle: 'Naive: O(N log N) Time.',
    icon: <ListPlus size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    code: `class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        // 1. Append the new interval to the list
        List<int[]> all = new ArrayList<>(Arrays.asList(intervals));
        all.add(newInterval);
        
        // 2. Re-sort the entire list by start time
        all.sort((a, b) -> Integer.compare(a[0], b[0]));
        
        // 3. Merge standard overlapping intervals
        List<int[]> result = new ArrayList<>();
        result.add(all.get(0));
        
        for (int i = 1; i < all.size(); i++) {
            int[] last = result.get(result.size() - 1);
            int[] curr = all.get(i);
            
            if (curr[0] <= last[1]) {
                // Overlap found, extend the end boundary
                last[1] = Math.max(last[1], curr[1]);
            } else {
                // No overlap, add as a distinct interval
                result.add(curr);
            }
        }
        
        return result.toArray(new int[result.size()][]);
    }
}`,
    explanation: "This is the 'brute-force' logical approach to merging. We ignore the fact that the initial list is already sorted. We simply throw the `newInterval` into the list, call a full O(N log N) sorting algorithm on everything, and then run a standard sweep to merge overlapping adjacent intervals. While it produces the correct answer and is very easy to conceptualize, sorting data that is mostly already sorted wastes a lot of computational time."
  }
};

interface FastForwardIconProps {
  size: number;
  className?: string;
}

function FastForwardIcon({ size, className }: FastForwardIconProps) {
    return <Zap size={size} className={className} />;
}

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">57. Insert Interval</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          You are given an array of non-overlapping intervals <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code> represent the start and the end of the <code>i<sup>th</sup></code> interval and <code>intervals</code> is sorted in ascending order by <code>start<sub>i</sub></code>.
        </p>
        
        <p className="text-lg leading-relaxed">
            You are also given an interval <code>newInterval = [start, end]</code> that represents the start and end of another interval.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Insert <code>newInterval</code> into <code>intervals</code> such that <code>intervals</code> is still sorted in ascending order by <code>start<sub>i</sub></code> and <code>intervals</code> still does not have any overlapping intervals (merge overlapping intervals if necessary).
          <br/><br/>
          Return <code>intervals</code> after the insertion.
        </p>

        <p className="text-sm italic text-slate-500">
            <strong>Note:</strong> You don't need to modify <code>intervals</code> in-place. You can make a new array and return it.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> intervals = [[1,3],[6,9]], newInterval = [2,5]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1,5],[6,9]]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1,2],[3,10],[12,16]]</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>0 &lt;= intervals.length &lt;= 10<sup>4</sup></code></li>
              <li><code>intervals[i].length == 2</code></li>
              <li><code>0 &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10<sup>5</sup></code></li>
              <li><code>intervals</code> is sorted by <code>start<sub>i</sub></code> in <strong>ascending</strong> order.</li>
              <li><code>newInterval.length == 2</code></li>
              <li><code>0 &lt;= start &lt;= end &lt;= 10<sup>5</sup></code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const InsertIntervalVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('linearScan');
  
  // Format: "start,end | start,end"
  const [intervalsInput, setIntervalsInput] = useState('1,2 | 3,5 | 6,7 | 8,10 | 12,16');
  const [newIntervalInput, setNewIntervalInput] = useState('4,8');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let rawIntervals = intervalsInput.split('|').map(s => {
        let parts = s.trim().split(',').map(n => parseInt(n.trim(), 10));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return [parts[0], parts[1]];
        }
        return null;
    }).filter(x => x !== null);

    // Ensure valid non-overlapping base state for visualizer stability
    rawIntervals.sort((a, b) => a[0] - b[0]);
    let cleanedIntervals = [];
    if (rawIntervals.length > 0) {
        cleanedIntervals.push(rawIntervals[0]);
        for (let i = 1; i < rawIntervals.length; i++) {
            let last = cleanedIntervals[cleanedIntervals.length - 1];
            if (rawIntervals[i][0] > last[1]) {
                cleanedIntervals.push(rawIntervals[i]);
            }
        }
    }

    let newParts = newIntervalInput.split(',').map(n => parseInt(n.trim(), 10));
    let newInt = [4, 8];
    if (newParts.length === 2 && !isNaN(newParts[0]) && !isNaN(newParts[1])) {
        newInt = [Math.min(newParts[0], newParts[1]), Math.max(newParts[0], newParts[1])];
    }

    // Safety Cap
    if (cleanedIntervals.length > 10) cleanedIntervals = cleanedIntervals.slice(0, 10);

    return { intervals: cleanedIntervals, newInterval: newInt };
  }, [intervalsInput, newIntervalInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { intervals, newInterval } = parsedData;
    const n = intervals.length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'linearScan') {
        
        let result = [];
        let i = 0;
        let merged = [...newInterval];

        addStep(
            "Initialization", 
            `Line 3-5: Initialize result list, pointer i = 0.\n\nWe start preparing to insert [${newInterval[0]}, ${newInterval[1]}].`, 
            5, 
            { intervals, newInterval, result: [...result], i, merged: [...merged], action: 'init', activePhase: 0 }
        );

        // Phase 1
        addStep(
            "Phase 1: Left Intervals", 
            `Line 8: while (i < n && intervals[i][1] < newInterval[0])\n\nWe scan for intervals that strictly end BEFORE our new interval begins (${merged[0]}). These safely sit to the left.`, 
            8, 
            { intervals, newInterval, result: [...result], i, merged: [...merged], action: 'phase1_start', activePhase: 1 }
        );

        while (i < n && intervals[i][1] < merged[0]) {
            result.push([...intervals[i]]);
            addStep(
                "Append Left Interval", 
                `Line 9-10: result.add(intervals[i]); i++;\n\nInterval [${intervals[i][0]}, ${intervals[i][1]}] ends at ${intervals[i][1]}, which is < ${merged[0]}. No overlap! Appending.`, 
                10, 
                { intervals, newInterval, result: [...result], i, merged: [...merged], action: 'phase1_add', activePhase: 1 }
            );
            i++;
        }

        // Phase 2
        addStep(
            "Phase 2: Overlapping Intervals", 
            `Line 14: while (i < n && intervals[i][0] <= newInterval[1])\n\nWe found an interval that doesn't end early! Now, as long as the current interval starts BEFORE or AT our new interval's end (${merged[1]}), it overlaps!`, 
            14, 
            { intervals, newInterval, result: [...result], i, merged: [...merged], action: 'phase2_start', activePhase: 2 }
        );

        while (i < n && intervals[i][0] <= merged[1]) {
            let prevMerged = [...merged];
            merged[0] = Math.min(merged[0], intervals[i][0]);
            merged[1] = Math.max(merged[1], intervals[i][1]);
            
            addStep(
                "Merge Overlap", 
                `Line 15-17: newInterval = [Math.min(), Math.max()]\n\nOverlap with [${intervals[i][0]}, ${intervals[i][1]}] detected!\nStart: min(${prevMerged[0]}, ${intervals[i][0]}) = ${merged[0]}\nEnd: max(${prevMerged[1]}, ${intervals[i][1]}) = ${merged[1]}\nWe consume it and expand!`, 
                17, 
                { intervals, newInterval, result: [...result], i, merged: [...merged], action: 'phase2_merge', activePhase: 2, prevMerged }
            );
            i++;
        }

        result.push([...merged]);
        addStep(
            "Insert Merged Interval", 
            `Line 19: result.add(newInterval);\n\nWe have successfully swallowed all overlapping intervals. We now add our final merged behemoth [${merged[0]}, ${merged[1]}] to the result.`, 
            19, 
            { intervals, newInterval, result: [...result], i, merged: [...merged], action: 'phase2_insert', activePhase: 2 }
        );

        // Phase 3
        addStep(
            "Phase 3: Right Intervals", 
            `Line 22: while (i < n)\n\nThe merged interval is placed. Because the list was sorted, any remaining intervals are guaranteed to sit safely to the right.`, 
            22, 
            { intervals, newInterval, result: [...result], i, merged: [...merged], action: 'phase3_start', activePhase: 3 }
        );

        while (i < n) {
            result.push([...intervals[i]]);
            addStep(
                "Append Right Interval", 
                `Line 23-24: result.add(intervals[i]); i++;\n\nAppending [${intervals[i][0]}, ${intervals[i][1]}] to the result.`, 
                24, 
                { intervals, newInterval, result: [...result], i, merged: [...merged], action: 'phase3_add', activePhase: 3 }
            );
            i++;
        }

        addStep(
            "Return Result", 
            `Line 28: return result.toArray();\n\nLinear scan complete in O(N) time!`, 
            28, 
            { intervals, newInterval, result: [...result], i, merged: [...merged], action: 'success', isSuccess: true, ans: result, activePhase: 4 }
        );

    } else if (selectedApproachId === 'appendSort') {
        
        let all = [...intervals];
        
        addStep(
            "Initialization", 
            `Line 4: List<int[]> all = new ArrayList<>(Arrays.asList(intervals));\n\nCopy original intervals to a mutable list.`, 
            4, 
            { intervals, newInterval, all: [...all], result: [], i: null, merged: null, action: 'init' }
        );

        all.push([...newInterval]);
        addStep(
            "Append Unconditionally", 
            `Line 5: all.add(newInterval);\n\nWe naively throw the new interval [${newInterval[0]}, ${newInterval[1]}] at the end of the list, breaking the sorted order.`, 
            5, 
            { intervals, newInterval, all: [...all], result: [], i: null, merged: null, action: 'append' }
        );

        all.sort((a, b) => a[0] - b[0]);
        addStep(
            "Sort O(N log N)", 
            `Line 8: all.sort(...);\n\nWe execute a full O(N log N) sort to fix the order. Note: This wastes time because 99% of the list was already sorted!`, 
            8, 
            { intervals, newInterval, all: [...all], result: [], i: null, merged: null, action: 'sort' }
        );

        let result = [];
        if (all.length > 0) {
            result.push([...all[0]]);
        }
        
        addStep(
            "Initialize Result & Seed", 
            `Line 11-12: result.add(all.get(0));\n\nWe start sweeping. Add the very first interval [${all[0][0]}, ${all[0][1]}] to the result.`, 
            12, 
            { intervals, newInterval, all: [...all], result: [...result], i: null, merged: null, action: 'seed' }
        );

        for (let i = 1; i < all.length; i++) {
            let last = result[result.length - 1];
            let curr = all[i];

            addStep(
                "Evaluate Overlap", 
                `Line 18: if (curr[0] <= last[1])\n\nLooking at [${curr[0]}, ${curr[1]}]. Does it overlap with our last processed interval [${last[0]}, ${last[1]}]?`, 
                18, 
                { intervals, newInterval, all: [...all], result: [...result].map(r => [...r]), i, merged: null, action: 'evalOverlap' }
            );

            if (curr[0] <= last[1]) {
                let prevLast = [...last];
                last[1] = Math.max(last[1], curr[1]);
                addStep(
                    "Merge Found Overlap", 
                    `Line 20: last[1] = Math.max(last[1], curr[1]);\n\nOverlap! We extend the boundary. New end is max(${prevLast[1]}, ${curr[1]}) = ${last[1]}.`, 
                    20, 
                    { intervals, newInterval, all: [...all], result: [...result].map(r => [...r]), i, merged: null, action: 'merge' }
                );
            } else {
                result.push([...curr]);
                addStep(
                    "Push Distinct Interval", 
                    `Line 23: result.add(curr);\n\nNo overlap. We push [${curr[0]}, ${curr[1]}] to the result as a new distinct interval.`, 
                    23, 
                    { intervals, newInterval, all: [...all], result: [...result].map(r => [...r]), i, merged: null, action: 'push' }
                );
            }
        }

        addStep(
            "Return Result", 
            `Line 28: return result.toArray();\n\nSweeping complete.`, 
            28, 
            { intervals, newInterval, all: [...all], result: [...result], i: null, merged: null, action: 'success', isSuccess: true, ans: result }
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
  const { isSuccess, ans, action, intervals, newInterval, result, i: currI, merged, activePhase, all } = state;

  // Visual Arena Calculations
  // Find absolute Min and Max across everything to establish an X-Axis Scale
  const { minX, maxX, totalRange } = useMemo(() => {
      let min = Infinity;
      let max = -Infinity;
      
      let elements = [];
      if (intervals) elements = [...elements, ...intervals];
      if (newInterval) elements.push(newInterval);
      if (all) elements = [...elements, ...all];
      if (result) elements = [...elements, ...result];

      for (let el of elements) {
          if (el[0] < min) min = el[0];
          if (el[1] > max) max = el[1];
      }

      if (min === Infinity) { min = 0; max = 10; }
      
      // Add 10% padding
      let range = max - min;
      if (range === 0) range = 10; // Fallback for [5,5]
      
      let padding = Math.max(2, Math.floor(range * 0.1));
      
      return { 
          minX: min - padding, 
          maxX: max + padding, 
          totalRange: (max + padding) - (min - padding) 
      };
  }, [intervals, newInterval, all, result]);

  // Positioning helper
  const getStyle = (interval) => {
      if (!interval) return {};
      let leftPct = ((interval[0] - minX) / totalRange) * 100;
      let widthPct = ((interval[1] - interval[0]) / totalRange) * 100;
      return {
          left: `${leftPct}%`,
          width: `max(${widthPct}%, 1.5rem)` // Minimum width for single point intervals [2,2]
      };
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Replace className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Insert Interval</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 57</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Arrays / Sorting / Linear Scan</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('merge') || action.includes('phase2') ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('merge') || action.includes('phase2') ? 'amber' : 'violet'} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Execution State</h4>
                      </div>
                    </div>
                    
                    {selectedApproachId === 'linearScan' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Pointer (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                            <VariableCard label="Phase" val={activePhase ? activePhase : "-"} color="slate" active={activePhase > 0} />
                            <VariableCard label="merged[start]" val={merged ? merged[0] : "-"} color="amber" active={merged !== null && merged !== undefined} />
                            <VariableCard label="merged[end]" val={merged ? merged[1] : "-"} color="amber" active={merged !== null && merged !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <VariableCard label="Pointer (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                            <VariableCard label="all Size" val={all ? all.length : "-"} color="purple" active={all !== null && all !== undefined} />
                            <VariableCard label="Result Size" val={result ? result.length : "-"} color="emerald" active={result !== null && result !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Original Intervals (sorted)</label>
                        <input type="text" value={intervalsInput} onChange={(e) => { setIntervalsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="1,2 | 3,5 | 6,7 | 8,10 | 12,16" />
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">New Interval</label>
                        <input type="text" value={newIntervalInput} onChange={(e) => { setNewIntervalInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-emerald-700" placeholder="4,8" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action.includes('merge') || action.includes('phase2') ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action.includes('merge') || action.includes('phase2') ? <GitMerge size={100}/> : <Baseline size={100}/>)}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action.includes('merge') || action.includes('phase2') ? 'text-amber-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('merge') || action.includes('phase2') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-start justify-start pt-16">
                   
                   {/* X-Axis Number Line */}
                   <div className="w-full absolute top-10 left-0 px-12 z-0 opacity-40">
                       <div className="h-px bg-slate-400 w-full relative">
                           {Array.from({length: totalRange + 1}).map((_, i) => {
                               let val = minX + i;
                               if (val % 2 !== 0 && totalRange > 15) return null; // reduce clutter
                               return (
                                   <div key={i} className="absolute top-0 flex flex-col items-center -translate-x-1/2" style={{left: `${(i / totalRange) * 100}%`}}>
                                       <div className="w-px h-2 bg-slate-400"></div>
                                       <span className="text-[8px] mt-1 font-mono">{val}</span>
                                   </div>
                               )
                           })}
                       </div>
                   </div>

                   <div className="flex flex-col w-full relative z-10 gap-10 mt-8 px-4 h-full">
                      
                      {/* Layer 1: Result Building */}
                      <div className="w-full relative h-12 flex items-center">
                          <span className="absolute -left-2 -top-6 text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Result Layer</span>
                          {result && result.map((inv, idx) => (
                              <div 
                                key={`res-${idx}`} 
                                className="absolute h-10 bg-emerald-100 border-2 border-emerald-500 rounded-lg shadow-sm flex items-center justify-center font-mono font-bold text-emerald-800 text-xs truncate transition-all duration-500 animate-in zoom-in"
                                style={getStyle(inv)}
                              >
                                  [{inv[0]},{inv[1]}]
                              </div>
                          ))}
                      </div>

                      {/* Layer 2: Merge / New Interval Action Zone */}
                      <div className="w-full relative h-16 flex items-center border-y-2 border-dashed border-slate-200 bg-slate-50/50 -mx-4 px-4">
                          <span className="absolute left-2 top-2 text-[10px] font-black uppercase text-amber-500 tracking-widest font-mono flex items-center gap-1"><GitMerge size={12}/> Merge Engine</span>
                          
                          {/* Merging Indicator */}
                          {selectedApproachId === 'linearScan' && merged && !isSuccess && (
                              <div 
                                className={`absolute h-12 rounded-lg shadow-md flex items-center justify-center font-mono font-black text-sm truncate transition-all duration-700 ease-in-out border-4 z-20 ${action.includes('phase2') ? 'bg-amber-100 border-amber-500 text-amber-900 ring-4 ring-amber-300/30 shadow-amber-200' : 'bg-emerald-100 border-emerald-500 text-emerald-800'}`}
                                style={getStyle(merged)}
                              >
                                  [{merged[0]},{merged[1]}]
                              </div>
                          )}

                          {/* AppendSort newInterval Indicator */}
                          {selectedApproachId === 'appendSort' && newInterval && action !== 'init' && action !== 'success' && (
                              <div 
                                className="absolute h-12 rounded-lg shadow-md flex items-center justify-center font-mono font-black text-sm truncate transition-all duration-700 ease-in-out border-4 z-20 bg-emerald-100 border-emerald-500 text-emerald-800"
                                style={getStyle(newInterval)}
                              >
                                  [{newInterval[0]},{newInterval[1]}]
                              </div>
                          )}
                      </div>

                      {/* Layer 3: Original Intervals Stream */}
                      <div className="w-full relative h-12 flex items-center mt-2">
                          <span className="absolute -left-2 -top-6 text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Input Stream (intervals)</span>
                          
                          {(selectedApproachId === 'linearScan' ? intervals : (all ? all : intervals)).map((inv, idx) => {
                              
                              let isActive = false;
                              let isProcessed = false;

                              if (selectedApproachId === 'linearScan') {
                                  isActive = currI === idx && !isSuccess;
                                  isProcessed = idx < currI || isSuccess;
                              } else if (selectedApproachId === 'appendSort') {
                                  isActive = currI === idx && !isSuccess;
                                  isProcessed = idx < currI || isSuccess;
                              }

                              let cls = "absolute h-10 border-2 rounded-lg flex items-center justify-center font-mono font-bold text-xs truncate transition-all duration-300 shadow-sm ";
                              
                              if (isActive) {
                                  if (action.includes('merge')) {
                                      cls += "bg-amber-200 border-amber-600 text-amber-900 scale-110 z-30 animate-pulse";
                                  } else {
                                      cls += "bg-purple-100 border-purple-500 text-purple-900 scale-105 z-30 ring-2 ring-purple-300";
                                  }
                              } else if (isProcessed) {
                                  cls += "bg-slate-100 border-slate-300 text-slate-400 opacity-40 z-10";
                              } else {
                                  cls += "bg-white border-slate-400 text-slate-700 z-20";
                              }

                              return (
                                  <div key={`orig-${idx}`} className={cls} style={getStyle(inv)}>
                                      [{inv[0]},{inv[1]}]

                                      {isActive && (
                                          <div className="absolute -bottom-8 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded font-black flex items-center gap-1 animate-in slide-in-from-bottom-2">
                                              <ArrowUp size={12}/> i
                                          </div>
                                      )}
                                  </div>
                              )
                          })}
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">INSERTION COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Merged Array Verified
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
                <FastForwardIcon size={28} className="text-violet-600"/> Exploiting Sorted Data
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Whenever a problem states that an input array is <strong>already sorted</strong>, you should immediately rule out any algorithm that takes <code>O(N log N)</code> time. You never need to sort data that is already sorted! You can solve it linearly <code>O(N)</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> The 3 Distinct Phases
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Because the intervals flow from left to right strictly, inserting a new interval cleanly divides the existing array into three distinct zones:
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p><strong>Phase 1: Left Unaffected</strong><br/>Intervals that end entirely before the new interval begins. Just copy them.</p>
                            <p><strong>Phase 2: The Blast Radius</strong><br/>Intervals that intersect with the new interval. We don't copy them; we merge them by expanding the new interval's boundaries.</p>
                            <p><strong>Phase 3: Right Unaffected</strong><br/>Intervals that begin entirely after the newly merged interval. Just copy them.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <GitMerge size={18}/> The Merge Mathematics
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            How do we actually merge two intervals <code>A</code> and <code>B</code> if we know they overlap?
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>The new merged block must encompass the absolute earliest start time and the absolute latest end time.</p>
                            <p><code>newStart = min(A.start, B.start)</code></p>
                            <p><code>newEnd = max(A.end, B.end)</code></p>
                            <p>Since we mutate <code>newInterval</code> dynamically, it can swallow multiple adjacent intervals in a chain!</p>
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
                        "Since the input array of intervals is guaranteed to be sorted by start time, using a full sorting algorithm like `Collections.sort()` would be inefficient $O(N \log N)$. Instead, I used a linear scan $O(N)$ approach that processes the array in three distinct phases. In Phase 1, I bypass and add all intervals that end strictly before the `newInterval` starts. In Phase 2, I identify overlapping intervals. While overlaps exist, I continuously mutate the boundaries of the `newInterval` by taking the `min` of the start times and `max` of the end times, effectively swallowing the overlaps, and then I add this finalized merged interval. Finally, in Phase 3, I add the remaining untouched intervals on the right side. This guarantees exactly one pass over the data, requiring $O(N)$ auxiliary space for the result array."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we use Binary Search?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Technically, yes. You could use Binary Search to find the exact insertion point in $O(\log N)$ time. However, to return the final merged array, you still have to shift elements and construct the result array, which dominates the time complexity at $O(N)$. Therefore, Binary Search adds code complexity without changing the actual asymptotic runtime.
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
                                <p className="text-[10px] text-slate-500 mt-1">We utilize three consecutive `while` loops, but the global pointer `i` only iterates from 0 to N exactly once. Thus, the total iterations equal the length of the array.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We allocate a new dynamic `List` to hold the resulting intervals. In the worst case (no overlaps), we store all $N$ original intervals plus the new one, yielding $O(N)$ space.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|insert|intervals|newInterval|result|length|add|min|max|toArray|size|all|asList|sort|compare|get|last|curr)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['insert', 'length', 'size', 'add', 'min', 'max', 'toArray', 'asList', 'sort', 'compare', 'get'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['intervals', 'newInterval', 'all', 'result', 'last', 'curr'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default InsertIntervalVisualizer;