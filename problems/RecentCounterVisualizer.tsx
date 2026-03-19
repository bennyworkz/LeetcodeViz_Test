import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, SquareSquare, Mountain, Hash, Network, Grid3X3, Star, Eraser, Brackets, ListTree
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalQueue: {
    id: 'optimalQueue',
    title: '1. Queue (Optimal)',
    icon: <ListTree size={16} />,
    complexity: 'Time: O(1) amortized | Space: O(N)',
    code: `class RecentCounter {
    Queue<Integer> q;
    
    public RecentCounter() {
        q = new LinkedList<>();
    }
    
    public int ping(int t) {
        q.add(t);
        while (q.peek() < t - 3000) {
            q.poll();
        }
        return q.size();
    }
}`,
    desc: "The Optimal Queue approach. We use a Queue to store the timestamps of pings. Since time strictly increases, the oldest pings are naturally at the front of the queue. When a new ping 't' arrives, we push it to the back. Then, we look at the front of the queue. If the oldest ping is outside the 3000ms window (i.e., less than t - 3000), we poll (remove) it. We repeat this until the front ping is within the window. The size of the queue is our answer."
  },
  naiveArray: {
    id: 'naiveArray',
    title: '2. ArrayList (Naive)',
    icon: <Layout size={16} />,
    complexity: 'Time: O(N) per ping | Space: O(P)',
    code: `class RecentCounter {
    List<Integer> list;
    
    public RecentCounter() {
        list = new ArrayList<>();
    }
    
    public int ping(int t) {
        list.add(t);
        int count = 0;
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i) >= t - 3000) {
                count++;
            }
        }
        return count;
    }
}`,
    desc: "The Naive ArrayList approach. We store every single ping we ever receive in a dynamically growing list. Every time a new ping arrives, we add it to the list, then we run a loop from the very beginning of the list to count how many pings fall within the valid window. This causes us to repeatedly iterate over ancient pings that will never be valid again, leading to O(N) time per ping."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:class|public|private|boolean|double|int|char|return|if|else|for|while|continue|break|new|length|Math|max|min|RecentCounter|Queue|LinkedList|List|ArrayList|q|t|ping|add|peek|poll|size|list|get|count|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-amber-500/20`, border: `border-amber-400`, text: `text-amber-300` };

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
        {parts.map((part, idx) => {
            const isKeyword = ['class', 'public', 'private', 'boolean', 'double', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'Queue', 'LinkedList', 'List', 'ArrayList', 'RecentCounter'].includes(part);
            const isVar = ['q', 't', 'list', 'count', 'i'].includes(part);
            const isMapCall = ['length', 'ping', 'add', 'peek', 'poll', 'size', 'get'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-emerald-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (part === 'true' || part === 'false') className = 'text-orange-400 font-bold';
            else if (part.startsWith("'") || part.startsWith('"') || (!isNaN(parseInt(part.trim())) && part.trim() !== '')) className = 'text-emerald-400';

            return <span key={idx} className={className}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const PointerLabel = ({ label, color = 'slate', position = 'top' }) => {
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

const NodeBlock = ({ val, idx = undefined, themeColor = 'slate', isTarget = false, isDimmed = false, subtext = undefined, isDeleted = false, compact = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', index: 'bg-indigo-100 text-indigo-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
        disabled: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-300', index: 'bg-slate-50 text-slate-300' }
    };
    
    let activeTheme = isDimmed ? themes['disabled'] : (themes[themeColor] || themes['slate']);
    if (isDeleted) activeTheme = themes['rose'];

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    const dims = compact 
        ? "min-w-[40px] md:min-w-[48px] min-h-[40px] md:min-h-[48px] px-2" 
        : "min-w-[56px] md:min-w-[64px] min-h-[48px] md:min-h-[56px] px-3";
    
    const textSz = compact ? "text-lg md:text-xl" : "text-xl md:text-2xl";
    const subTextSz = compact ? "text-[8px]" : "text-[9px] md:text-[10px]";

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-1 ${isDeleted ? 'bg-rose-100 text-rose-500 line-through opacity-60' : 'bg-white/60 ' + activeTheme.text} ${isDimmed && !isDeleted ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
                    {displayVal}
                </div>
                {(idx !== undefined || subtext !== undefined) && (
                    <div className={`flex w-full ${compact ? 'h-3' : 'h-4 md:h-5'} border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className={`${subTextSz} font-black tracking-widest uppercase leading-none`}>{subtext !== undefined ? subtext : `${idx}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function RecentCounterVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalQueue');
  
  const [pingsInput, setPingsInput] = useState('1, 100, 3001, 3002');
  const [basePings, setBasePings] = useState([1, 100, 3001, 3002]);
  
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

  // Debounce input parsing
  useEffect(() => {
    const timer = setTimeout(() => {
      let parsed = pingsInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      // Pings must be strictly increasing per problem constraints
      parsed.sort((a,b)=>a-b); 

      if (parsed.length === 0) parsed = [1, 100, 3001, 3002];
      if (parsed.length > 15) parsed = parsed.slice(0, 15); 

      setBasePings(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [pingsInput, selectedOpId]);

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
    if (!basePings || basePings.length === 0) return [{ phase: 'Init', description: 'Enter valid ping timestamps.', line: 1, state: {} }];

    const pings = [...basePings];

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { pings, totalPings: pings.length, ...st } 
    });

    if (selectedOpId === 'optimalQueue') {
        let q = [];
        let resLog = [];
        
        add("Init Class", `public RecentCounter() {\n    q = new LinkedList<>();\n}`, 4, { q: [...q], resLog: [...resLog] });
        
        for (let p = 0; p < pings.length; p++) {
            let t = pings[p];
            
            add("Method Call", `public int ping(int t) // t = ${t}`, 8, { q: [...q], resLog: [...resLog], t, p });
            
            q.push(t);
            add("Add to Queue", `q.add(${t});\nPushing new ping to the back of the queue.`, 9, { q: [...q], resLog: [...resLog], t, p, hlQueueAdd: true });
            
            while (true) {
                let threshold = t - 3000;
                let peekVal = q[0];
                let isOld = peekVal < threshold;
                
                add("While Eval", `while (q.peek() < t - 3000)\nIs oldest ping (${peekVal}) < ${t} - 3000 (${threshold})? (${isOld ? 'Yes' : 'No'})`, 10, { q: [...q], resLog: [...resLog], t, p, threshold, isEvalWhile: true });
                
                if (!isOld) break;
                
                let polled = q.shift();
                add("Poll Queue", `q.poll();\nPing ${polled} is older than 3000ms. Removing it.`, 11, { q: [...q], resLog: [...resLog], t, p, threshold, hlQueuePoll: true, polledVal: polled });
            }
            
            let size = q.length;
            resLog.push(size);
            add("Return Size", `return q.size();\nRemaining queue size is ${size}.`, 13, { q: [...q], resLog: [...resLog], t, p, threshold: t - 3000, size, hlReturn: true });
        }
        
        add("Sequence End", `Finished processing all test pings.`, 15, { q: [...q], resLog: [...resLog], isSuccess: true, finalAns: `[${resLog.join(', ')}]` });

    } else if (selectedOpId === 'naiveArray') {
        let list = [];
        let resLog = [];
        
        add("Init Class", `public RecentCounter() {\n    list = new ArrayList<>();\n}`, 4, { list: [...list], resLog: [...resLog] });
        
        for (let p = 0; p < pings.length; p++) {
            let t = pings[p];
            
            add("Method Call", `public int ping(int t) // t = ${t}`, 8, { list: [...list], resLog: [...resLog], t, p });
            
            list.push(t);
            add("Add to List", `list.add(${t});\nAppending new ping to our historical list.`, 9, { list: [...list], resLog: [...resLog], t, p, hlListAdd: true });
            
            let count = 0;
            add("Init Count", `int count = 0;`, 10, { list: [...list], resLog: [...resLog], t, p, count });
            
            let threshold = t - 3000;
            for (let i = 0; i < list.length; i++) {
                add("Loop Eval", `for (int i = ${i}; i < list.size(); i++)\nIterating through all historical pings.`, 11, { list: [...list], resLog: [...resLog], t, p, count, threshold, iter: i, isEvalFor: true });
                
                let val = list[i];
                let isValid = val >= threshold;
                
                add("Check Threshold", `if (list.get(${i}) >= t - 3000)\nIs ${val} >= ${threshold}? (${isValid ? 'Yes' : 'No'})`, 12, { list: [...list], resLog: [...resLog], t, p, count, threshold, iter: i, isCheckingThreshold: true, isValid });
                
                if (isValid) {
                    count++;
                    add("Increment Count", `count++;\nPing is within the 3000ms window.`, 13, { list: [...list], resLog: [...resLog], t, p, count, threshold, iter: i, hlCountInc: true, isValid });
                }
            }
            
            add("Loop End", `for (int i = ${list.length}; i < list.size(); i++)\nFinished scanning list.`, 11, { list: [...list], resLog: [...resLog], t, p, count, threshold, isEvalFor: true });
            
            resLog.push(count);
            add("Return Count", `return count;\nTotal valid pings found: ${count}.`, 16, { list: [...list], resLog: [...resLog], t, p, count, threshold, hlReturn: true });
        }
        
        add("Sequence End", `Finished processing all test pings.`, 18, { list: [...list], resLog: [...resLog], isSuccess: true, finalAns: `[${resLog.join(', ')}]` });
    }

    return steps;
  }, [basePings, selectedOpId]);

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

  const themeColor = selectedOpId === 'optimalQueue' ? 'emerald' : 'sky';

  // --- Rendering Helpers ---

  const renderVisuals = () => {
      if (st.pings === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-8 w-full">
              
              {/* Input Pings Sequence Display */}
              <div className="flex flex-col items-center w-full max-w-5xl animate-in slide-in-from-top-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-2`}><Clock size={12}/> Incoming pings sequence</span>
                  
                  <div className="flex gap-1 p-2 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-sm flex-wrap justify-center items-center w-full min-h-[60px]">
                      {st.pings.map((pingTime, idx) => {
                          let isHl = false;
                          let isDimmed = false;

                          if (st.p === idx) {
                              isHl = true;
                          } else if (st.p !== undefined && idx > st.p) {
                              isDimmed = true;
                          } else if (st.isSuccess) {
                              isDimmed = true;
                          }

                          return (
                              <React.Fragment key={`pingin-${idx}`}>
                                  <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'}`}>
                                      <NodeBlock val={pingTime} themeColor={isHl ? "fuchsia" : "slate"} isTarget={isHl} isDimmed={isDimmed} compact={true}/>
                                      {isHl && (
                                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-30">
                                              <PointerLabel label="t" color="fuchsia" position="bottom" />
                                          </div>
                                      )}
                                  </div>
                              </React.Fragment>
                          )
                      })}
                  </div>
              </div>

              {/* OPTIMAL APPROACH VISUALS */}
              {selectedOpId === 'optimalQueue' && st.q !== undefined && (
                  <div className="flex flex-col items-center w-full max-w-6xl gap-8 animate-in slide-in-from-bottom-4">
                      
                      {/* State Variables Overlay */}
                      {!st.isSuccess && (
                          <div className="flex w-full gap-4 max-w-3xl mx-auto">
                              <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all duration-300 ${st.hlQueueAdd ? 'border-fuchsia-400 bg-fuchsia-50 ring-4 ring-fuchsia-200 scale-105' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.hlQueueAdd ? 'text-fuchsia-600' : 'text-slate-400'}`}>Current Time 't'</span>
                                  <span className={`font-mono text-3xl font-black ${st.hlQueueAdd ? 'text-fuchsia-600' : 'text-slate-700'}`}>{st.t !== undefined ? st.t : '-'}</span>
                              </div>

                              <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all duration-300 ${st.isEvalWhile ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200 scale-105' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.isEvalWhile ? 'text-amber-600' : 'text-slate-400'}`}>Threshold (t - 3000)</span>
                                  <span className={`font-mono text-3xl font-black ${st.isEvalWhile ? 'text-amber-600' : 'text-slate-700'}`}>{st.threshold !== undefined ? st.threshold : '-'}</span>
                              </div>
                          </div>
                      )}

                      {/* Queue Visualization */}
                      <div className="flex flex-col items-start w-full mt-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-2`}><ListTree size={12}/> 'q' Queue (FIFO)</span>
                          
                          <div className={`flex gap-2 p-6 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[120px] transition-colors duration-300 ${st.hlQueuePoll ? 'border-rose-400 bg-rose-50/50' : 'border-emerald-200'}`}>
                              
                              <div className="w-16 h-16 border-r-4 border-dashed border-emerald-300 mr-2 flex items-center justify-center shrink-0">
                                  <span className="text-[10px] font-black text-emerald-400 uppercase rotate-[-90deg] tracking-widest whitespace-nowrap block ml-4">FRONT<br/>(Oldest)</span>
                              </div>

                              {st.q && st.q.map((val, idx) => {
                                  let isHl = false;
                                  let color = 'emerald';
                                  let isDeleted = false;

                                  if (st.hlQueueAdd && idx === st.q.length - 1) {
                                      isHl = true;
                                      color = 'fuchsia';
                                  }

                                  if (st.isEvalWhile && idx === 0) {
                                      isHl = true;
                                      color = 'amber';
                                  }

                                  return (
                                      <React.Fragment key={`q-${idx}-${val}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'} ${st.hlQueueAdd && idx === st.q.length - 1 ? 'animate-in zoom-in slide-in-from-right-8' : ''}`}>
                                              <NodeBlock val={val} themeColor={color} isTarget={isHl} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              
                              {/* Pseudo-element for polling animation */}
                              {st.hlQueuePoll && st.polledVal !== undefined && (
                                  <div className={`relative transition-all duration-500 scale-110 z-20 mx-2 animate-out zoom-out slide-out-to-left-8 opacity-0`}>
                                      <NodeBlock val={st.polledVal} themeColor={'rose'} isTarget={true} isDeleted={true} />
                                  </div>
                              )}

                              {(!st.q || st.q.length === 0) && !st.hlQueuePoll && <span className="text-slate-400 italic text-sm font-mono px-4">queue is empty</span>}
                          </div>
                      </div>

                      {/* Result Tracker */}
                      {!st.isSuccess && (
                          <div className={`bg-slate-800 border-2 rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center w-full max-w-sm transition-all duration-300 ${st.hlReturn ? 'border-emerald-400 ring-4 ring-emerald-500 scale-105' : 'border-slate-700'}`}>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-center leading-tight">q.size() Returned</span>
                              <span className={`font-mono font-black text-5xl w-full text-center text-emerald-400`}>
                                  {st.size !== undefined ? st.size : '-'}
                              </span>
                          </div>
                      )}
                  </div>
              )}

              {/* NAIVE APPROACH VISUALS */}
              {selectedOpId === 'naiveArray' && st.list !== undefined && (
                  <div className="flex flex-col items-center w-full max-w-6xl gap-8 animate-in slide-in-from-bottom-4">
                      
                      {/* State Variables Overlay */}
                      {!st.isSuccess && (
                          <div className="flex w-full gap-4 max-w-3xl mx-auto">
                              <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all duration-300 ${st.hlListAdd ? 'border-fuchsia-400 bg-fuchsia-50 ring-4 ring-fuchsia-200 scale-105' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.hlListAdd ? 'text-fuchsia-600' : 'text-slate-400'}`}>Current Time 't'</span>
                                  <span className={`font-mono text-3xl font-black ${st.hlListAdd ? 'text-fuchsia-600' : 'text-slate-700'}`}>{st.t !== undefined ? st.t : '-'}</span>
                              </div>

                              <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all duration-300 ${st.isCheckingThreshold || st.isEvalFor ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200 scale-105' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.isCheckingThreshold || st.isEvalFor ? 'text-amber-600' : 'text-slate-400'}`}>Threshold (t - 3000)</span>
                                  <span className={`font-mono text-3xl font-black ${st.isCheckingThreshold || st.isEvalFor ? 'text-amber-600' : 'text-slate-700'}`}>{st.threshold !== undefined ? st.threshold : '-'}</span>
                              </div>
                          </div>
                      )}

                      <div className="flex flex-col items-start w-full mt-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><Layout size={12}/> 'list' ArrayList (Historical Pings)</span>
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[120px] transition-colors duration-300 border-sky-200`}>
                              {st.list.map((val, idx) => {
                                  let isHl = false;
                                  let color = 'slate';
                                  let labels = [];

                                  if (st.iter === idx) {
                                      isHl = true;
                                      color = 'sky';
                                      labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                                  }

                                  if (st.hlListAdd && idx === st.list.length - 1) {
                                      isHl = true;
                                      color = 'fuchsia';
                                  }

                                  if (st.isCheckingThreshold && st.iter === idx) {
                                      color = st.isValid ? 'emerald' : 'rose';
                                      isHl = true;
                                  }

                                  return (
                                      <React.Fragment key={`list-${idx}-${val}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'} ${st.hlListAdd && idx === st.list.length - 1 ? 'animate-in zoom-in slide-in-from-right-8' : ''}`}>
                                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                {labels.map((l, j) => (
                                                    <React.Fragment key={j}>
                                                        <PointerLabel label={l.text} color={l.color} position="bottom" />
                                                    </React.Fragment>
                                                ))}
                                              </div>
                                              <NodeBlock val={val} themeColor={color} isTarget={isHl} />
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {st.list.length === 0 && <span className="text-slate-400 italic text-sm font-mono px-4">empty list</span>}
                          </div>
                      </div>

                      {/* Result Tracker */}
                      {!st.isSuccess && (
                          <div className={`bg-slate-800 border-2 rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center w-full max-w-sm transition-all duration-300 ${st.hlCountInc || st.hlReturn ? 'border-emerald-400 ring-4 ring-emerald-500 scale-105' : 'border-slate-700'}`}>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-center leading-tight">count Variable</span>
                              <span className={`font-mono font-black text-5xl w-full text-center text-emerald-400`}>
                                  {st.count !== undefined ? st.count : '-'}
                              </span>
                          </div>
                      )}

                  </div>
              )}

              {/* Output Log */}
              <div className="flex flex-col items-center w-full max-w-2xl mt-4 animate-in slide-in-from-bottom-8">
                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-lg w-full flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Activity size={14}/> Output Array Log</span>
                      <span className="font-mono text-lg font-bold text-emerald-400 tracking-widest">[{st.resLog ? st.resLog.join(', ') : ''}]</span>
                  </div>
              </div>

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-sky-600'}`}>
                <Clock className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Number of Recent Calls</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-sky-600 bg-sky-50'}`}>
                      LC 933 • Queue / Simulation
                  </span>
                  <span>•</span>
                  <span>O(1) Amortized Time Constraint</span>
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
                
                <div className="text-base leading-relaxed">
                  You have a <code>RecentCounter</code> class which counts the number of recent requests within a certain time frame.<br/><br/>
                  Implement the <code>RecentCounter</code> class:
                  <ul className="list-disc pl-8 mt-2 space-y-1">
                      <li><code>RecentCounter()</code> Initializes the counter with zero recent requests.</li>
                      <li><code>int ping(int t)</code> Adds a new request at time <code>t</code>, where <code>t</code> represents some time in milliseconds, and returns the number of requests that have happened in the past <code>3000</code> milliseconds (including the new request).</li>
                  </ul>
                  <br/>
                  Specifically, return the number of requests that have happened in the inclusive range <code>[t - 3000, t]</code>.
                  It is guaranteed that every call to ping uses a strictly larger value of <code>t</code> than the previous call.
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example Walkthrough</span>
                        <div><span className="text-white font-bold">Input:</span><br/>["RecentCounter", "ping", "ping", "ping", "ping"]<br/>[[], [1], [100], [3001], [3002]]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [null, 1, 2, 3, 3]</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
RecentCounter recentCounter = new RecentCounter();
recentCounter.ping(1);     // requests = [1], range is [-2999,1], return 1
recentCounter.ping(100);   // requests = [1, 100], range is [-2900,100], return 2
recentCounter.ping(3001);  // requests = [1, 100, 3001], range is [1,3001], return 3
recentCounter.ping(3002);  // requests = [1, 100, 3001, 3002], range is [2,3002], return 3 (1 is removed)
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= t &lt;= 10⁹</li>
                        <li>Each test case will call <code>ping</code> with strictly increasing values of <code>t</code>.</li>
                        <li>At most 10⁴ calls will be made to <code>ping</code>.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                            Trap: Using an ArrayList and iterating backwards (or forwards) over ALL historical pings takes O(N) time per ping. Over 10,000 calls, this causes Time Limit Exceeded. You MUST discard old data.
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
                                <span>Sequence of 'ping(t)' calls (Comma separated)</span>
                            </label>
                            <input 
                                type="text"
                                value={pingsInput} 
                                onChange={(e) => setPingsInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} 
                                spellCheck={false}
                                placeholder="1, 100, 3001, 3002"
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-sky-500'}`}><Layout size={14}/> Memory Tracker</span></div>
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Sliding Time Window</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>This problem asks us to maintain a "Sliding Window" of time that is exactly 3000 milliseconds wide.</p>
                            <p>Because the problem guarantees that time <code>t</code> is strictly increasing, we don't need to sort the data. The data naturally comes in chronologically.</p>
                            <p>This strictly chronological ordering makes a <strong>Queue (FIFO - First In, First Out)</strong> the absolute perfect data structure to manage our sliding window.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">Amortized O(1) Complexity</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>In our optimal solution, the <code>while</code> loop might pop multiple elements in a single <code>ping()</code> call if a lot of time has passed since the last ping.</p>
                            <p>Because there's a <code>while</code> loop inside our function, you might think the time complexity is O(N). However, we must analyze the <strong>Amortized</strong> complexity.</p>
                            <p>Every single ping that enters the system is added to the Queue exactly once, and it can be removed from the Queue at most once. Therefore, across thousands of pings, the average time spent per ping mathematically averages out to a constant <strong>O(1)</strong>.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering Amortized Analysis</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"This is a fundamental Queue problem. Writing the code is easy, but interviewers will heavily scrutinize your explanation of the Time Complexity. If you say it's O(N) because of the while loop, you will lose points. You must use the keyword 'Amortized O(1)' and explain that elements are processed at most twice (enqueue and dequeue)."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Layout size={16}/></div>
                               1. Acknowledge the Naive Array Approach
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The naive approach would be to store every ping in an ArrayList. When a new ping comes, we loop over the entire list to count how many are `&gt;= t - 3000`. This requires O(N) time for every single ping. Over 10,000 pings, this evaluates the same old, expired pings repeatedly, leading to an O(N²) overall runtime."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ListTree size={16}/></div>
                               2. Pivot to Queue Optimization
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Since time is strictly increasing, the data is naturally sorted. The oldest pings are always at the start. Therefore, we can use a FIFO Queue. When a new ping arrives, we can simply discard data from the front of the queue if it's too old."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Detail Execution & Complexity
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "In the `ping` method, I'll add `t` to the queue. Then I use a `while` loop: `while (q.peek() &lt; t - 3000)`, I `q.poll()` to remove the expired pings. Finally, I return `q.size()`. Although there is a `while` loop, the time complexity is Amortized O(1). This is because each ping is enqueued exactly once and dequeued at most once, meaning the operations scale strictly linearly with the number of inputs."
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
              <div className="w-[400px] xl:w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
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
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>Sequence of 'ping(t)' calls (Comma separated)</label>
                              <input type="text" value={pingsInput} onChange={(e) => setPingsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner lowercase ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-sky-500'}`} />
                          </div>
                      </div>
                  </div>

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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-emerald-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest text-emerald-400 max-w-lg break-words`}>
                                    Result: <span className="font-black text-3xl text-white ml-2 block mt-2">{st.finalAns}</span>
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20`}>
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