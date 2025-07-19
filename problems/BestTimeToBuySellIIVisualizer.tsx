import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  greedy: {
    id: 'greedy',
    title: '1. Greedy (Optimal)',
    icon: <TrendingUp size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int maxProfit(int[] prices) {
    int maxProfit = 0;
    
    // We can make unlimited transactions
    for (int i = 1; i < prices.length; i++) {
        // If today's price is higher than yesterday's, 
        // we capture the difference!
        if (prices[i] > prices[i - 1]) {
            maxProfit += prices[i] - prices[i - 1];
        }
    }
    
    return maxProfit;
}`,
    desc: "The Greedy approach. Because we can make unlimited transactions, we capture every single upward price movement. Instead of finding the absolute min and absolute max of a trend, adding the differences of every consecutive positive day yields the exact same total profit!"
  },
  stateMachine: {
    id: 'stateMachine',
    title: '2. State Machine (DP)',
    icon: <Activity size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int maxProfit(int[] prices) {
    if (prices == null || prices.length == 0) return 0;
    
    int cash = 0;          // Max profit if we end day holding 0 stock
    int hold = -prices[0]; // Max profit if we end day holding 1 stock
    
    for (int i = 1; i < prices.length; i++) {
        // To have 0 stock today: either we rested, or we sold today
        int nextCash = Math.max(cash, hold + prices[i]);
        
        // To have 1 stock today: either we rested, or we bought today
        int nextHold = Math.max(hold, cash - prices[i]);
        
        cash = nextCash;
        hold = nextHold;
    }
    
    return cash;
}`,
    desc: "The Dynamic Programming State Machine approach. On any given day, we are in one of two states: holding cash (0 stock) or holding 1 stock. We calculate the optimal decision for each state daily. This pattern is incredibly powerful as it scales easily to handle transaction fees or cooldown periods."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|char|return|if|else|for|while|continue|break|new|length|String|charAt|substring|Math|max|min|maxProfit|prices|cash|hold|nextCash|nextHold)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-fuchsia-500/20`, border: `border-fuchsia-400`, text: `text-fuchsia-300` };

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
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isVar = ['prices', 'maxProfit', 'cash', 'hold', 'nextCash', 'nextHold'].includes(part);
            const isMapCall = ['length', 'max', 'min'].includes(part);
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

const NodeBlock = ({ val, idx, themeColor = 'slate', isTarget, isDimmed }) => {
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
    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[48px] min-h-[56px] md:min-w-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl px-1 py-1 bg-white/60 ${activeTheme.text} ${isDimmed ? 'opacity-50' : 'opacity-100'}`}>
                    ${displayVal}
                </div>
                {idx !== undefined && (
                    <div className={`flex w-full h-4 md:h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">Day {idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function BestTimeToBuySellIIVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('greedy');
  
  const [pricesInput, setPricesInput] = useState('7,1,5,3,6,4');
  const [basePrices, setBasePrices] = useState([7, 1, 5, 3, 6, 4]);
  
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

  // Debounce input to safely parse arrays
  useEffect(() => {
    const timer = setTimeout(() => {
      let parsedArr = pricesInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x) && x >= 0);
      if (parsedArr.length === 0) parsedArr = [7, 1, 5, 3, 6, 4];
      if (parsedArr.length > 25) parsedArr = parsedArr.slice(0, 25);

      setBasePrices(parsedArr);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [pricesInput, selectedOpId]);

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
    if (!basePrices || basePrices.length === 0) return [{ phase: 'Init', description: 'Enter valid array.', line: 1, state: { arr: [] } }];

    let arr = [...basePrices];
    let n = arr.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { arr: [...arr], n, ...st } 
    });

    if (selectedOpId === 'greedy') {
        let maxProfit = 0;
        
        add("Function Call", `public int maxProfit(int[] prices)`, 1, { maxProfit });
        add("Init", `int maxProfit = 0;`, 2, { maxProfit });
        
        for (let i = 1; i < n; i++) {
            add("Advance Day", `for (int i = 1...)\nCompare Day ${i} ($${arr[i]}) with Day ${i-1} ($${arr[i-1]})`, 5, { maxProfit, i, isEvaluating: true });
            
            let diff = arr[i] - arr[i-1];
            add("Check Profit", `if (prices[i] > prices[i - 1])\nIs $${arr[i]} > $${arr[i-1]}? (Difference: $${diff})`, 8, { maxProfit, i, diff, comparing: true });
            
            if (diff > 0) {
                let prevMax = maxProfit;
                maxProfit += diff;
                add("Accumulate Profit", `maxProfit += prices[i] - prices[i - 1];\nAdd $${diff} to total profit. Total is now $${maxProfit}.`, 9, { maxProfit, i, diff, hlAdd: true, prevMax });
            } else {
                add("No Profit", `Price decreased or stayed same. Do nothing.`, 8, { maxProfit, i, diff, hlSkip: true });
            }
        }
        
        add("Return Result", `return maxProfit;\nAlgorithm complete. Total accumulated profit: $${maxProfit}`, 13, { maxProfit, isSuccess: true, finalAns: maxProfit });

    } else if (selectedOpId === 'stateMachine') {
        if (n === 0) return steps;
        
        let cash = 0;
        let hold = -arr[0];
        
        add("Function Call", `public int maxProfit(int[] prices)`, 1, { cash: 0, hold: 0 });
        add("Init States", `int cash = 0;\nint hold = -prices[0]; // -$${arr[0]}`, 4, { cash, hold, hlInit: 0 });

        for (let i = 1; i < n; i++) {
            add("Advance Day", `for (int i = 1...)\nProcess Day ${i} ($${arr[i]})`, 7, { cash, hold, i, isEvaluating: true });
            
            let nextCash = Math.max(cash, hold + arr[i]);
            add("Evaluate Cash State", `int nextCash = Math.max(cash, hold + prices[i]);\nMax of resting ($${cash}) or selling ($${hold} + $${arr[i]} = $${hold + arr[i]}) -> $${nextCash}`, 9, { cash, hold, i, nextCash, hlCash: true });
            
            let nextHold = Math.max(hold, cash - arr[i]);
            add("Evaluate Hold State", `int nextHold = Math.max(hold, cash - prices[i]);\nMax of resting (-$${Math.abs(hold)}) or buying ($${cash} - $${arr[i]} = -$${Math.abs(cash - arr[i])}) -> -$${Math.abs(nextHold)}`, 12, { cash, hold, i, nextCash, nextHold, hlHold: true });
            
            cash = nextCash;
            hold = nextHold;
            add("Update States", `cash = nextCash;\nhold = nextHold;`, 14, { cash, hold, i, isUpdated: true });
        }
        
        add("Return Result", `return cash;\nEnd of array. Best to end in 'cash' state. Max Profit: $${cash}`, 18, { cash, hold, isSuccess: true, finalAns: cash });
    }

    return steps;
  }, [basePrices, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { arr: [] } };
  const st = curStepData.state || { arr: [] };
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'greedy' ? 'emerald' : 'fuchsia';

  // --- Rendering Helpers ---

  const renderArray = () => {
      if (!st.arr || st.arr.length === 0) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-4">
              <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center">
                  
                  {st.arr.map((val, idx) => {
                      let color = 'slate';
                      let isHl = false;
                      let isDimmed = false;
                      let labels = [];

                      // --- Greedy Visuals ---
                      if (selectedOpId === 'greedy') {
                          if (st.i !== undefined) {
                              if (idx === st.i) {
                                  labels.push({ text: 'Today', color: 'sky', pos: 'top' });
                                  color = st.hlAdd ? 'emerald' : (st.hlSkip ? 'rose' : 'sky');
                                  isHl = true;
                              }
                              if (idx === st.i - 1) {
                                  labels.push({ text: 'Yesterday', color: 'fuchsia', pos: 'bottom' });
                                  color = st.hlAdd ? 'emerald' : (st.hlSkip ? 'rose' : 'fuchsia');
                                  isHl = true;
                              }
                          }
                          if (st.isSuccess) {
                              color = 'emerald';
                          }
                      } 
                      // --- State Machine DP Visuals ---
                      else if (selectedOpId === 'stateMachine') {
                          if (st.hlInit === idx) {
                              labels.push({ text: 'Start', color: 'emerald', pos: 'top' });
                              color = 'emerald';
                              isHl = true;
                          }
                          if (st.i === idx) {
                              labels.push({ text: 'Today (i)', color: 'sky', pos: 'bottom' });
                              color = 'sky';
                              isHl = true;
                          }
                          if (st.isSuccess) {
                              color = 'emerald';
                          }
                      }

                      return (
                          <div key={`char-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 md:mx-2' : 'scale-100 z-10 m-0.5 md:m-1'}`}>
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
                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} isDimmed={isDimmed} />
                          </div>
                      )
                  })}
              </div>

              {/* Data Overlay */}
              {!st.isSuccess && selectedOpId === 'greedy' && (
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                    <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center transition-all ${st.comparing ? 'border-sky-400 bg-sky-50 ring-4 ring-sky-200' : 'border-slate-200'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Activity size={14}/> Price Difference</span>
                        <div className="flex items-center gap-2 font-mono text-3xl font-bold">
                            <span className={st.diff > 0 ? 'text-emerald-600' : (st.diff <= 0 ? 'text-rose-600' : 'text-slate-700')}>
                                {st.diff !== undefined ? (st.diff > 0 ? `+$${st.diff}` : `-$${Math.abs(st.diff)}`) : '-'}
                            </span>
                        </div>
                        <span className="text-[9px] mt-2 font-mono text-slate-400 text-center">Prices[i] - Prices[i-1]</span>
                    </div>

                    <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center transition-all ${st.hlAdd ? 'border-emerald-400 bg-emerald-50 ring-4 ring-emerald-200' : (st.hlSkip ? 'border-rose-400 bg-rose-50 ring-4 ring-rose-200' : 'border-slate-200')}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Focus size={14}/> Action Taken</span>
                        <div className="flex items-center gap-2 font-mono text-2xl font-bold">
                            <span className={st.hlAdd ? 'text-emerald-600' : (st.hlSkip ? 'text-rose-600' : 'text-slate-700')}>
                                {st.hlAdd ? 'ACCUMULATE' : (st.hlSkip ? 'SKIP' : '-')}
                            </span>
                        </div>
                        <span className="text-[9px] mt-2 font-mono text-slate-400 text-center">Greedily take all positive slopes.</span>
                    </div>

                    <div className={`bg-slate-800 border-2 rounded-2xl p-4 shadow-md flex flex-col items-center transition-all ${st.hlAdd ? 'border-emerald-400 ring-4 ring-emerald-500 scale-105' : 'border-slate-700'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Trophy size={14}/> Total Profit</span>
                        <div className="flex items-center gap-2 font-mono text-4xl font-bold mt-2">
                            <span className="text-emerald-400">
                                {st.maxProfit !== undefined ? `$${st.maxProfit}` : '-'}
                            </span>
                        </div>
                    </div>
                </div>
              )}

              {!st.isSuccess && selectedOpId === 'stateMachine' && (
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
                    <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center transition-all ${st.hlCash || st.isUpdated ? 'border-sky-400 bg-sky-50' : 'border-slate-200'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">CASH (0 Stock)</span>
                        <div className="flex items-center gap-2 font-mono text-4xl font-bold">
                            <span className={st.hlCash || st.isUpdated ? 'text-sky-600' : 'text-slate-700'}>
                                {st.nextCash !== undefined ? `$${st.nextCash}` : (st.cash !== undefined ? `$${st.cash}` : '-')}
                            </span>
                        </div>
                        <span className="text-[9px] mt-2 font-mono text-slate-400 text-center">Max(Resting in Cash, Selling Stock today)</span>
                    </div>

                    <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center transition-all ${st.hlHold || st.isUpdated ? 'border-fuchsia-400 bg-fuchsia-50' : 'border-slate-200'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">HOLD (1 Stock)</span>
                        <div className="flex items-center gap-2 font-mono text-4xl font-bold">
                            <span className={st.hlHold || st.isUpdated ? 'text-fuchsia-600' : 'text-slate-700'}>
                                {st.nextHold !== undefined ? `-$${Math.abs(st.nextHold)}` : (st.hold !== undefined ? `-$${Math.abs(st.hold)}` : '-')}
                            </span>
                        </div>
                        <span className="text-[9px] mt-2 font-mono text-slate-400 text-center">Max(Resting with Stock, Buying Stock today)</span>
                    </div>
                </div>
              )}
          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-fuchsia-600'}`}>
                <Focus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Buy and Sell Stock II</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-fuchsia-600 bg-fuchsia-50'}`}>
                      LC 122 • Greedy / DP
                  </span>
                  <span>•</span>
                  <span>O(N) Time Constraint</span>
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
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  You are given an integer array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i</code>-th day.<br/><br/>
                  On each day, you may decide to buy and/or sell the stock. You can only hold <strong>at most one</strong> share of the stock at any time. However, you can buy it then immediately sell it on the <strong>same day</strong>.<br/><br/>
                  Find and return the <strong>maximum profit</strong> you can achieve.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> prices = [7,1,5,3,6,4]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 7</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation: 
Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
Total profit is 4 + 3 = 7.
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> prices = [1,2,3,4,5]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 4</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation:<br/>Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.<br/>Note: You can't buy multiple times before selling.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= prices.length &lt;= 3 * 10⁴</li>
                        <li>0 &lt;= prices[i] &lt;= 10⁴</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>
                            Trap: Because you can transact unlimited times, you do NOT need to wait to find the absolute minimum and maximum values. Treating this like the first "Buy and Sell Stock" problem will lead to failing answers.
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
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-fuchsia-600 text-white border-fuchsia-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-fuchsia-200') : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>
                                <span>Array 'prices' (Comma separated)</span>
                            </label>
                            <input 
                                type="text"
                                value={pricesInput} 
                                onChange={(e) => setPricesInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-fuchsia-500'}`} 
                                spellCheck={false}
                                placeholder="7,1,5,3,6,4"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-fuchsia-600 shadow-fuchsia-200 hover:bg-fuchsia-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Evaluation Complete</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-fuchsia-500'}`}><Layout size={14}/> Array Elements Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-fuchsia-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-fuchsia-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-fuchsia-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           {renderArray()}
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Infinite Transactions</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Because you can buy and sell multiple times, you want to capture EVERY upward trend.</p>
                            <p>Imagine a stock's price goes <code>$1 &rarr; $3 &rarr; $5</code>.<br/>If you buy at $1 and sell at $5, you make <strong>$4</strong>.</p>
                            <p>Interestingly, if you buy at $1, sell at $3 (profit $2), then buy again at $3, and sell at $5 (profit $2), your total profit is <strong>$2 + $2 = $4</strong>!</p>
                            <p>It's mathematically identical. Therefore, we don't need to search for complex local minima and maxima. We can simply greedily add the positive difference between EVERY consecutive day.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-fuchsia-50 border border-fuchsia-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-fuchsia-700 text-lg uppercase tracking-widest mb-6">The DP State Machine</h3>
                        <div className="space-y-4 text-sm text-fuchsia-900/80 leading-relaxed font-medium">
                            <p>The State Machine maps the problem into generic states: "Cash" and "Hold".</p>
                            <p>On any given day <code>i</code>:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>To be in "Cash" state (0 stock):</strong> You could either have rested (stayed in Cash from yesterday) or you just sold the stock you were holding yesterday. You take the Max.</li>
                                <li><strong>To be in "Hold" state (1 stock):</strong> You could either have rested (stayed in Hold from yesterday) or you just bought the stock today using your cash. You take the Max.</li>
                            </ul>
                            <p>This explicitly maps every single decision branch dynamically.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Flexing the State Machine</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"While the Greedy approach is perfectly optimal and very fast to code, explaining the Dynamic Programming State Machine will instantly mark you as a Senior candidate. Why? Because the exact same 'Cash / Hold' State Machine framework is used to solve the much harder variations of this problem (e.g., adding a Transaction Fee, adding a Cooldown period, or limiting to K transactions)."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge Peak/Valley logic
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The intuitive approach is to find a local minimum to buy, and the subsequent local maximum to sell, iterating this across the entire graph. However, writing nested while loops to find peaks and valleys is prone to bounds errors."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><TrendingUp size={16}/></div>
                               2. Pivot to the Greedy One-Pass
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Because `A + B = C`, the sum of consecutive daily positive differences equals the difference between the minimum and the maximum of that trend. I can achieve O(N) time and O(1) space simply by accumulating `prices[i] - prices[i-1]` whenever it is strictly positive."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ShieldAlert size={16}/></div>
                               3. Mention the DP Framework Extensibility
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Alternatively, I could model this as a DP State Machine with `cash` and `hold` states. The `nextCash` is the max of resting or selling (`hold + price`), and `nextHold` is the max of resting or buying (`cash - price`). While slightly more verbose than Greedy, this exact DP framework seamlessly scales if the requirements later change to introduce cooldown days or transaction fees."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-fuchsia-500 shadow-fuchsia-900/50'}`}><Code2 size={20}/></div>
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
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (themeColor === 'emerald' ? 'bg-emerald-900/40 border-emerald-800' : 'bg-fuchsia-900/40 border-fuchsia-800') : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-fuchsia-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-60 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>Array 'prices' (Comma separated)</label>
                              <input type="text" value={pricesInput} onChange={(e) => setPricesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-fuchsia-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-fuchsia-50 hover:text-fuchsia-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-fuchsia-50 hover:text-fuchsia-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-fuchsia-50 hover:text-fuchsia-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-fuchsia-600 hover:bg-fuchsia-700 border-fuchsia-400 shadow-fuchsia-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           {renderArray()}
                      </div>
                  </div>
                  
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${themeColor === 'emerald' ? 'border-emerald-500 shadow-emerald-500/30' : 'border-fuchsia-500 shadow-fuchsia-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-fuchsia-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${themeColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-fuchsia-500/20 text-fuchsia-500 ring-fuchsia-500/10'}`}>
                                    <PartyPopper size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest ${themeColor === 'emerald' ? 'text-emerald-400' : 'text-fuchsia-400'} max-w-lg break-words`}>
                                    Max Profit: <span className="font-black text-3xl text-white ml-2 block mt-2">${st.finalAns}</span>
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-900/20'}`}>
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