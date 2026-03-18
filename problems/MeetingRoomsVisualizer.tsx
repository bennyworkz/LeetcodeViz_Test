import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Chronological (Two Pointers)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    code: `public int minMeetingRooms(int[][] intervals) {
    if (intervals == null || intervals.length == 0) return 0;
    int n = intervals.length;
    
    int[] start = new int[n];
    int[] end = new int[n];
    for (int i = 0; i < n; i++) {
        start[i] = intervals[i][0];
        end[i] = intervals[i][1];
    }
    
    Arrays.sort(start);
    Arrays.sort(end);
    
    int activeRooms = 0;
    int maxRooms = 0;
    int s = 0, e = 0;
    
    while (s < n) {
        // If a meeting starts before the earliest ending meeting finishes
        if (start[s] < end[e]) {
            activeRooms++;
            maxRooms = Math.max(maxRooms, activeRooms);
            s++;
        } 
        // If a meeting finishes before or as the new one starts
        else {
            activeRooms--;
            e++;
        }
    }
    return maxRooms;
}`,
    desc: "The Chronological Two Pointers approach. We extract all start times and end times into separate arrays and sort them independently. We don't care WHICH meeting ends, only THAT a meeting ends. We march through time: if the next event is a 'start', we need a room. If it's an 'end', a room frees up."
  },
  minHeap: {
    id: 'minHeap',
    title: '2. Priority Queue (Min-Heap)',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    code: `public int minMeetingRooms(int[][] intervals) {
    if (intervals == null || intervals.length == 0) return 0;
    
    // Sort intervals by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    
    // Min-Heap stores the end times of active meetings
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    heap.add(intervals[0][1]);
    
    for (int i = 1; i < intervals.length; i++) {
        // If the earliest ending meeting ends before the new one starts,
        // we can reuse that room! Remove it from the heap.
        if (intervals[i][0] >= heap.peek()) {
            heap.poll();
        }
        
        // Add the new meeting's end time to the heap
        heap.add(intervals[i][1]);
    }
    
    // The size of the heap is the number of concurrent rooms needed
    return heap.size();
}`,
    desc: "The Min-Heap approach. We sort meetings by start time. As we process each meeting, we check our Min-Heap (which stores active end times). If the earliest ending meeting in the heap finishes before our current meeting starts, we pop it off (reusing the room). We then push our current meeting's end time. The max size of the heap is our answer."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|char|return|if|else|for|while|continue|break|new|length|String|charAt|substring|Math|max|min|minMeetingRooms|intervals|start|end|Arrays|sort|activeRooms|maxRooms|s|e|PriorityQueue|heap|peek|poll|add|size|Integer|compare)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-sky-500/20`, border: `border-sky-400`, text: `text-sky-300` };

  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? activeStyles.text + ' font-bold' : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'Arrays', 'PriorityQueue'].includes(part);
            const isVar = ['intervals', 'start', 'end', 'activeRooms', 'maxRooms', 's', 'e', 'n', 'i', 'heap', 'a', 'b'].includes(part);
            const isMapCall = ['length', 'max', 'min', 'sort', 'minMeetingRooms', 'peek', 'poll', 'add', 'size', 'compare'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-emerald-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (part.startsWith("'") || part.startsWith('"') || (!isNaN(parseInt(part.trim())) && part.trim() !== '')) className = 'text-emerald-400';

            return <span key={i} className={className}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const PointerLabel = ({ label, color, position }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`}>
            <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

const NodeBlock = ({ val, idx, themeColor = 'slate', isTarget, isDimmed, subtext }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-300', index: 'bg-slate-50 text-slate-300' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    // Render an interval [start, end] nicely if val is an array
    const displayVal = Array.isArray(val) ? `[${val[0]}, ${val[1]}]` : (val === null ? '_' : String(val));
    const fontSize = Array.isArray(val) ? 'text-sm md:text-base px-2' : 'text-2xl px-1';
    const width = Array.isArray(val) ? 'min-w-[64px] md:min-w-[80px]' : 'min-w-[48px] md:min-w-[56px]';

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${width} min-h-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${fontSize} py-1 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter`}>
                    {displayVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full h-4 md:h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">{subtext !== undefined ? subtext : `Idx ${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function MeetingRoomsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('twoPointers');
  
  const [intervalsInput, setIntervalsInput] = useState('[[0, 30], [5, 10], [15, 20]]');
  const [baseIntervals, setBaseIntervals] = useState([[0, 30], [5, 10], [15, 20]]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { setCurrentStep(0); setPan({ x: 0, y: 0 }); setZoom(1); };
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Debounce input parsing for 2D array
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
          // Allow some flexible formatting by making it strictly JSON compatible first
          let cleanStr = intervalsInput.trim();
          if (!cleanStr.startsWith('[')) cleanStr = `[${cleanStr}]`;
          const parsed = JSON.parse(cleanStr);
          
          if (Array.isArray(parsed) && parsed.every(x => Array.isArray(x) && x.length === 2 && typeof x[0] === 'number' && typeof x[1] === 'number')) {
              let limited = parsed.slice(0, 15); // Limit for visualizer clarity
              setBaseIntervals(limited);
              setCurrentStep(0);
              setPan({ x: 0, y: 0 });
          }
      } catch (err) {
          // Silently ignore parse errors while typing
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [intervalsInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps = [];
    if (!baseIntervals || baseIntervals.length === 0) return [{ phase: 'Init', description: 'Enter valid intervals.', line: 1, state: {} }];

    const n = baseIntervals.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { n, original: [...baseIntervals], ...st } 
    });

    if (selectedOpId === 'twoPointers') {
        add("Method Call", `public int minMeetingRooms(int[][] intervals)`, 1, {starts: [], ends: []});
        add("Null/Empty Check", `if (intervals == null || intervals.length == 0)\nChecks if the input array is empty. Length is ${n}.`, 2, {starts: [], ends: []});
        
        if (n === 0) {
            add("Return", `return 0;`, 2, {isSuccess: true, finalAns: 0});
            return steps;
        }
        
        add("Assign 'n'", `int n = intervals.length; // ${n}`, 3, {starts: [], ends: []});
        add("Init Start Array", `int[] start = new int[n];`, 5, {starts: [], ends: []});
        add("Init End Array", `int[] end = new int[n];`, 6, {starts: [], ends: []});
        
        let starts = [];
        let ends = [];
        
        for (let i = 0; i < n; i++) {
            add("Loop Condition", `for (int i = ${i}; i < ${n}; i++)\nLoop to extract start/end pairs.`, 7, {starts: [...starts], ends: [...ends], i});
            starts.push(baseIntervals[i][0]);
            add("Extract Start", `start[${i}] = intervals[${i}][0]; // ${baseIntervals[i][0]}\nExtracted meeting start time.`, 8, {starts: [...starts], ends: [...ends], i});
            ends.push(baseIntervals[i][1]);
            add("Extract End", `end[${i}] = intervals[${i}][1]; // ${baseIntervals[i][1]}\nExtracted meeting end time.`, 9, {starts: [...starts], ends: [...ends], i});
        }
        add("Loop Condition", `for (int i = ${n}; i < ${n}; i++)\nCondition is false. Loop terminates.`, 7, {starts: [...starts], ends: [...ends]});
        
        add("Sort Starts", `Arrays.sort(start);\nSorting all start times chronologically.`, 12, {starts: [...starts].sort((a,b)=>a-b), ends: [...ends]});
        starts.sort((a,b)=>a-b);
        
        add("Sort Ends", `Arrays.sort(end);\nSorting all end times chronologically.`, 13, {starts: [...starts], ends: [...ends].sort((a,b)=>a-b)});
        ends.sort((a,b)=>a-b);
        
        let activeRooms = 0;
        add("Init activeRooms", `int activeRooms = 0;`, 15, {starts: [...starts], ends: [...ends], activeRooms});
        let maxRooms = 0;
        add("Init maxRooms", `int maxRooms = 0;`, 16, {starts: [...starts], ends: [...ends], activeRooms, maxRooms});
        let s = 0, e = 0;
        add("Init Pointers", `int s = 0, e = 0;\ns points to next start. e points to next end.`, 17, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e});

        while (s < n) {
            add("While Condition", `while (s < n)\nIs ${s} < ${n}? (Yes)`, 19, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e, isEvaluating: true});
            
            let sTime = starts[s];
            let eTime = ends[e];
            
            add("Compare Overlap", `if (start[s] < end[e])\nDoes meeting start (${sTime}) BEFORE the earliest end (${eTime})?`, 21, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e, comparing: true});
            
            if (sTime < eTime) {
                add("If True (Overlap)", `Yes, ${sTime} < ${eTime}. A meeting starts and NO room has freed up yet.`, 21, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e, hlStart: true});
                
                activeRooms++;
                add("Increment Active Rooms", `activeRooms++;\nWe need to allocate a room. Active is now ${activeRooms}.`, 22, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e, hlStart: true});
                
                let prevMax = maxRooms;
                maxRooms = Math.max(maxRooms, activeRooms);
                add("Update Max Rooms", `maxRooms = Math.max(maxRooms, activeRooms);\nMax required is now ${maxRooms}.`, 23, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e, hlUpdate: maxRooms > prevMax, hlStart: true});
                
                s++;
                add("Advance Start Pointer", `s++;\nMove 's' pointer forward to ${s}.`, 24, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e});
            } else {
                add("Else (No Overlap)", `else\nNo, ${sTime} >= ${eTime}. A meeting just ended!`, 27, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e, hlEnd: true});
                
                activeRooms--;
                add("Decrement Active Rooms", `activeRooms--;\nA room was just freed. Active is now ${activeRooms}.`, 28, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e, hlEnd: true});
                
                e++;
                add("Advance End Pointer", `e++;\nMove 'e' pointer forward to ${e}.`, 29, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e});
            }
        }
        
        add("While Condition", `while (s < n)\nIs ${s} < ${n}? (No). Loop terminates.`, 19, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e});
        add("Return Result", `return maxRooms;\nProcessed all meetings. Max concurrent rooms needed: ${maxRooms}.`, 32, {starts: [...starts], ends: [...ends], activeRooms, maxRooms, s, e, isSuccess: true, finalAns: maxRooms});

    } else if (selectedOpId === 'minHeap') {
        
        add("Method Call", `public int minMeetingRooms(int[][] intervals)`, 1, {intervals: [...baseIntervals], heap: []});
        add("Null/Empty Check", `if (intervals == null || intervals.length == 0)\nChecks if input is empty. Length is ${n}.`, 2, {intervals: [...baseIntervals], heap: []});
        
        if (n === 0) {
            add("Return", `return 0;`, 2, {intervals: [...baseIntervals], heap: [], isSuccess: true, finalAns: 0});
            return steps;
        }

        let sortedIntervals = [...baseIntervals].sort((a,b) => a[0] - b[0]);
        add("Sort Intervals", `Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\nSort all meetings chronologically by their start times.`, 5, {intervals: [...sortedIntervals], heap: []});
        
        add("Init PriorityQueue", `PriorityQueue<Integer> heap = new PriorityQueue<>();\nMin-Heap will store the end times of active meetings.`, 8, {intervals: [...sortedIntervals], heap: []});
        
        let heap = [];
        heap.push(sortedIntervals[0][1]);
        add("Add First End Time", `heap.add(intervals[0][1]);\nAdd the first meeting's end time: ${sortedIntervals[0][1]}.`, 9, {intervals: [...sortedIntervals], heap: [...heap], i: 0, hlHeapAdd: true});

        for (let i = 1; i < n; i++) {
            add("Loop Condition", `for (int i = ${i}; i < intervals.length; i++)\nProcessing meeting ${i}.`, 11, {intervals: [...sortedIntervals], heap: [...heap], i, isEvaluating: true});
            
            let currStart = sortedIntervals[i][0];
            let earliestEnd = heap[0];
            
            add("Check Earliest End", `if (intervals[i][0] >= heap.peek())\nDoes meeting start (${currStart}) >= earliest active end (${earliestEnd})?`, 14, {intervals: [...sortedIntervals], heap: [...heap], i, comparing: true});
            
            if (currStart >= earliestEnd) {
                add("If True (Room Freed)", `Yes. The earliest ending meeting finished before/as this one started!`, 14, {intervals: [...sortedIntervals], heap: [...heap], i, comparing: true});
                
                let popped = heap.shift(); // simulate poll
                add("Poll Heap", `heap.poll();\nRemoved ${popped}. We can reuse this room!`, 15, {intervals: [...sortedIntervals], heap: [...heap], i, hlHeapPoll: true, popped});
            } else {
                add("If False (No Room)", `No. Earliest end is ${earliestEnd}. We must allocate a NEW room.`, 14, {intervals: [...sortedIntervals], heap: [...heap], i});
            }
            
            let currEnd = sortedIntervals[i][1];
            heap.push(currEnd);
            heap.sort((a,b) => a - b);
            
            add("Add New End Time", `heap.add(intervals[i][1]);\nPush new meeting end time: ${currEnd}`, 19, {intervals: [...sortedIntervals], heap: [...heap], i, hlHeapAdd: true});
        }
        
        add("Loop Condition", `for (int i = ${n}; i < intervals.length; i++)\nCondition is false. Loop terminates.`, 11, {intervals: [...sortedIntervals], heap: [...heap], i: n-1});
        
        add("Return Result", `return heap.size();\nMax concurrent rooms needed corresponds to heap size: ${heap.length}`, 23, {intervals: [...sortedIntervals], heap: [...heap], isSuccess: true, finalAns: heap.length});
    }

    return steps;
  }, [baseIntervals, selectedOpId]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'twoPointers' ? 'emerald' : 'sky';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (!st.n) return <span className="text-slate-400 italic">empty</span>;

      if (selectedOpId === 'twoPointers') {
          return (
              <div className="flex flex-col items-center w-full mt-4 gap-10">
                  {/* Starts Array */}
                  <div className="flex flex-col items-center w-full">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 shadow-sm"><Clock size={12} className="inline mr-1"/> Start Times</span>
                      <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full max-w-4xl min-h-[120px]">
                          {st.starts && st.starts.map((val, idx) => {
                              let isHl = st.s === idx;
                              let color = isHl ? 'emerald' : 'slate';
                              let labels = [];
                              if (isHl) labels.push({ text: 's_ptr', color: 'emerald', pos: 'bottom' });
                              if (st.hlStart && isHl) labels.push({ text: 'Compare', color: 'amber', pos: 'top' });
                              if (st.comparing && isHl) { color = 'amber'; labels.push({ text: 'Compare', color: 'amber', pos: 'top' }); }

                              return (
                                  <div key={`start-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1 animate-in zoom-in duration-300'}`}>
                                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        {labels.filter(l => l.pos === 'top').map((l, j) => (
                                            <React.Fragment key={j}>
                                                <PointerLabel label={l.text} color={l.color} position="top" />
                                            </React.Fragment>
                                        ))}
                                      </div>
                                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                        {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                            <React.Fragment key={j}>
                                                <PointerLabel label={l.text} color={l.color} position="bottom" />
                                            </React.Fragment>
                                        ))}
                                      </div>
                                      <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={undefined} subtext={undefined} />
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* Ends Array */}
                  <div className="flex flex-col items-center w-full">
                      <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 mb-2 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 shadow-sm"><CheckCircle2 size={12} className="inline mr-1"/> End Times</span>
                      <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full max-w-4xl min-h-[120px]">
                          {st.ends && st.ends.map((val, idx) => {
                              let isHl = st.e === idx;
                              let color = isHl ? 'fuchsia' : 'slate';
                              let labels = [];
                              if (isHl) labels.push({ text: 'e_ptr', color: 'fuchsia', pos: 'top' });
                              if (st.hlEnd && isHl) labels.push({ text: 'Compare', color: 'amber', pos: 'bottom' });
                              if (st.comparing && isHl) { color = 'amber'; labels.push({ text: 'Compare', color: 'amber', pos: 'bottom' }); }

                              return (
                                  <div key={`end-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1 animate-in zoom-in duration-300'}`}>
                                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        {labels.filter(l => l.pos === 'top').map((l, j) => (
                                            <React.Fragment key={j}>
                                                <PointerLabel label={l.text} color={l.color} position="top" />
                                            </React.Fragment>
                                        ))}
                                      </div>
                                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                        {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                            <React.Fragment key={j}>
                                                <PointerLabel label={l.text} color={l.color} position="bottom" />
                                            </React.Fragment>
                                        ))}
                                      </div>
                                      <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={undefined} subtext={undefined} />
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              </div>
          );
      } 
      else if (selectedOpId === 'minHeap') {
          return (
              <div className="flex flex-col items-center w-full mt-4 gap-10">
                  {/* Original Sorted Intervals */}
                  <div className="flex flex-col items-center w-full">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 shadow-sm"><Clock size={12} className="inline mr-1"/> Sorted Intervals [Start, End]</span>
                      <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full max-w-4xl min-h-[120px]">
                          {st.intervals && st.intervals.map((val, idx) => {
                              let isHl = st.i === idx;
                              let color = isHl ? 'sky' : 'slate';
                              let labels = [];
                              if (isHl) labels.push({ text: 'Current', color: 'sky', pos: 'top' });

                              return (
                                  <div key={`int-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                        {labels.filter(l => l.pos === 'top').map((l, j) => (
                                            <React.Fragment key={j}>
                                                <PointerLabel label={l.text} color={l.color} position="top" />
                                            </React.Fragment>
                                        ))}
                                      </div>
                                      <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={undefined} subtext={undefined} />
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* Min Heap */}
                  <div className="flex flex-col items-center w-full">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 shadow-sm"><Layers size={12} className="inline mr-1"/> Min-Heap (Active End Times)</span>
                      <div className="flex gap-2 p-4 border-[3px] border-amber-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center w-full max-w-2xl min-h-[120px]">
                          {st.heap && st.heap.length > 0 ? st.heap.map((val, idx) => {
                              // Visually depict the "min" at index 0
                              let isHl = false;
                              let color = 'amber';
                              let labels = [];
                              
                              if (idx === 0) {
                                  labels.push({ text: 'Min (Earliest)', color: 'rose', pos: 'bottom' });
                                  if (st.comparing) { color = 'rose'; isHl = true; }
                              }

                              return (
                                  <div key={`heap-${idx}-${val}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1 animate-in zoom-in slide-in-from-top-2'}`}>
                                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                        {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                            <React.Fragment key={j}>
                                                <PointerLabel label={l.text} color={l.color} position="bottom" />
                                            </React.Fragment>
                                        ))}
                                      </div>
                                      <NodeBlock val={val} subtext="End Time" themeColor={color} isTarget={isHl} idx={undefined} isDimmed={undefined} />
                                  </div>
                              )
                          }) : (
                              <span className="text-slate-400 italic text-sm font-mono">Heap Empty</span>
                          )}
                      </div>
                  </div>
              </div>
          );
      }
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-sky-600'}`}>
                <Focus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Meeting Rooms II</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-sky-600 bg-sky-50'}`}>
                      LC 253 • Arrays / Heaps
                  </span>
                  <span>•</span>
                  <span>O(N log N) Time Constraint</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given an array of meeting time intervals <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code>, return the minimum number of conference rooms required.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> intervals = [[0,30],[5,10],[15,20]]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 2</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: 
- Room 1: [0, 30]
- Room 2: [5, 10]
When the [15, 20] meeting starts, Room 2 is empty, so it can be reused. We need exactly 2 rooms.
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> intervals = [[7,10],[2,4]]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 1</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation:<br/>The meetings do not overlap. A single room can host both consecutively.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= intervals.length &lt;= 10⁴</li>
                        <li>0 &lt;= start_i &lt; end_i &lt;= 10⁶</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                            Trap: If a meeting ends at the exact same time another begins (e.g., `[5, 10]` and `[10, 15]`), they do NOT overlap. Your logic must process the 'end' before the 'start' if they share the exact same timestamp!
                        </li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-sky-600 text-white border-sky-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-sky-200') : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-hidden relative">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                          <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                                <span>Interval Array (JSON Format)</span>
                            </label>
                            <input 
                                type="text"
                                value={intervalsInput} 
                                onChange={(e) => setIntervalsInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} 
                                spellCheck={false}
                                placeholder="[[0, 30], [5, 10], [15, 20]]"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-sky-600 shadow-sky-200 hover:bg-sky-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                <PartyPopper size={20}/> Evaluation Complete
                            </div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-sky-500'}`}><Layout size={14}/> Time Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-sky-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-sky-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-sky-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           {renderVisuals()}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Target size={120}/></div>
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">Chronological Separation</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>A brilliant optimization in the "Two Pointers" approach is divorcing the start times from the end times. We don't actually need to know <strong>which specific meeting</strong> ended to free up a room!</p>
                            <p>Imagine being the manager at the front desk. You only care about two things: "Did someone walk in?" (Start Time) and "Did someone walk out?" (End Time).</p>
                            <p>By extracting all Start times and sorting them, and all End times and sorting them, we simply play out the events in chronological order. If the next event is a Start, we hand out a room key. If it's an End, someone returns a key.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-sky-50 border border-sky-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-sky-700 text-lg uppercase tracking-widest mb-6">The Min-Heap Strategy</h3>
                        <div className="space-y-4 text-sm text-sky-900/80 leading-relaxed font-medium">
                            <p>The Priority Queue (Min-Heap) approach mimics exactly how you would manage rooms physically.</p>
                            <p>You have a list of meetings sorted by when they begin. As a new meeting is about to start, you look at all your currently occupied rooms. Which room should you check first? <strong>The room that will free up the earliest!</strong></p>
                            <p>A Min-Heap perfectly tracks the earliest end time at the top (O(1) peek). If that earliest room finishes before or exactly when the new meeting starts, you pop it from the heap (the room is cleaned) and push the new meeting's end time in.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering the Sweep-Line Concept</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"Meeting Rooms II is the canonical 'Sweep-Line' interval problem. Most candidates will jump to the Priority Queue (Min-Heap) solution. While perfectly acceptable, providing the 'Two Pointers' chronological array sorting approach usually impresses interviewers more, as it demonstrates deep insight into the fact that interval start/end identities don't need to be strictly coupled."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge Brute Force
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "A naive approach would be to iterate through time minute by minute, or check every interval against every other interval to count overlaps. This is heavily inefficient, especially if the timestamp ranges are massive."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Layers size={16}/></div>
                               2. Present the Min-Heap Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The standard optimization is using a Min-Heap. I would sort the meetings by start time, then push their end times into a Priority Queue. Before adding a new meeting, I check if the earliest ending meeting (the root of the heap) finishes before the new one starts. If so, I poll it to simulate reusing the room. The maximum size of the heap is the answer."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ArrowRightLeft size={16}/></div>
                               3. Pivot to the Elegant Two-Pointer
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "However, an even more elegant approach without Priority Queue overhead is chronological separation. We extract all start times and end times into two separate arrays and sort them independently. We use two pointers. If the next chronological event is a start (`starts[s] &lt; ends[e]`), we increment our room count and move the start pointer. Otherwise, a meeting ended, so we decrement our room count and move the end pointer. This achieves O(N log N) time and O(N) space purely through primitive array sorting."
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[650px] 2xl:w-[800px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-sky-500 shadow-sky-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 whitespace-pre-wrap flex flex-col">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-hidden shrink-0">
                        <div className="w-full">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>
                                    <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-sky-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>Interval Array (JSON Format)</label>
                              <input type="text" value={intervalsInput} onChange={(e) => setIntervalsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} />
                          </div>
                      </div>
                  </div>

                  {/* Overlays overlaying the canvas */}
                  {!st.isSuccess && selectedOpId === 'twoPointers' && (
                    <div className="absolute bottom-8 left-8 z-50 flex gap-4 pointer-events-none">
                        <div className="bg-white border-2 border-emerald-400 rounded-2xl p-4 shadow-xl flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Rooms</span>
                            <span className="font-mono text-3xl font-black text-emerald-600">{st.activeRooms !== undefined ? st.activeRooms : 0}</span>
                        </div>
                        <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 shadow-xl flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Max Rooms</span>
                            <span className="font-mono text-3xl font-black text-emerald-400">{st.maxRooms !== undefined ? st.maxRooms : 0}</span>
                        </div>
                    </div>
                  )}

                  {!st.isSuccess && selectedOpId === 'minHeap' && (
                    <div className="absolute bottom-8 left-8 z-50 flex gap-4 pointer-events-none">
                        <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 shadow-xl flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Heap Size (Rooms Used)</span>
                            <span className="font-mono text-3xl font-black text-sky-400">{st.heap ? st.heap.length : 0}</span>
                        </div>
                    </div>
                  )}

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-sky-600 hover:bg-sky-700 border-sky-400 shadow-sky-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           {renderVisuals()}
                      </div>
                  </div>
                  
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${themeColor === 'emerald' ? 'border-emerald-500 shadow-emerald-500/30' : 'border-sky-500 shadow-sky-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-sky-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${themeColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-sky-500/20 text-sky-500 ring-sky-500/10'}`}>
                                    <PartyPopper size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest ${themeColor === 'emerald' ? 'text-emerald-400' : 'text-sky-400'} max-w-lg break-words`}>
                                    Min Rooms Required: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns}</span>
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-900/20'}`}>
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700 shadow-xl shadow-black/20">
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                   )}
              </div>
          </div>
      )}
    </div>
  );
}