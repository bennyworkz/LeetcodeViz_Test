import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, Coins, Network, Grid, CheckCircle2, GitBranch,
  Goal, Workflow, CheckSquare, ShieldAlert, ArrowUp, DollarSign, UserCheck, UserX, User,
  X
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  greedyChange: {
    id: 'greedyChange',
    title: '1. Greedy Cashier',
    icon: <DollarSign size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    theme: 'amber',
    code: `class Solution {
    public boolean lemonadeChange(int[] bills) {
        int five = 0, ten = 0;
        
        for (int bill : bills) {
            if (bill == 5) {
                five++;
            } else if (bill == 10) {
                if (five == 0) return false;
                five--;
                ten++;
            } else {
                // bill == 20
                if (five > 0 && ten > 0) {
                    five--;
                    ten--;
                } else if (five >= 3) {
                    five -= 3;
                } else {
                    return false;
                }
            }
        }
        
        return true;
    }
}`,
    desc: "The standard Greedy algorithm. We only need to keep track of the number of $5 and $10 bills we have (we don't need to track $20s because they can never be used as change). For every customer, we take their bill. If it's a $5, we just keep it. If it's a $10, we give back one $5. If it's a $20, we use our Greedy Strategy: we prefer to give back one $10 and one $5 first (saving our versatile $5 bills). If we don't have a $10, we are forced to give back three $5 bills."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  themeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, themeColor }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-600 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
  idPrefix?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'amber', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|lemonadeChange|bills|bill|five|ten|Solution|true|false)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`${idPrefix}code-line-${num}`} className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const trimmed = part.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                return <span key={`code-${num}-${idx}`} className="text-slate-500 italic">{part}</span>;
            }
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'true', 'false'].includes(part);
            const isObject = ['Solution'].includes(part);
            const isPointer = ['bills', 'bill', 'five', 'ten'].includes(part);
            const isMapCall = ['lemonadeChange'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}', '(', ')'].includes(trimmed);
            
            return (
              <span 
                key={`code-${num}-${idx}`} 
                className={
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) ? (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : '') : 'text-emerald-400'
                }
              >
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

// --- Main Application ---

export default function LemonadeChangeVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('greedyChange');
  
  const [billsInput, setBillsInput] = useState('5, 5, 5, 10, 20');
  const [billsArr, setBillsArr] = useState<number[]>([5, 5, 5, 10, 20]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseArrayInput = (inputStr: string, fallback: number[]) => {
      let rawTokens = inputStr.split(',');
      let parsedArr: number[] = [];
      for (let token of rawTokens) {
          let t = token.trim();
          let num = parseInt(t, 10);
          if (!isNaN(num) && (num === 5 || num === 10 || num === 20)) {
              parsedArr.push(num);
          }
      }
      if (parsedArr.length === 0) parsedArr = fallback;
      if (parsedArr.length > 25) parsedArr = parsedArr.slice(0, 25); // Cap for visualization
      return parsedArr;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBillsArr(parseArrayInput(billsInput, [5, 5, 5, 10, 20]));
      setCurrentStep(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [billsInput, selectedOpId]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    
    let bills = [...billsArr];
    let five = 0;
    let ten = 0;
    let twenty = 0; // tracked visually for fun, even though code doesn't strictly need it

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            bills: [...bills], five, ten, twenty, ...st 
        } 
    });

    add("Init Function", `public boolean lemonadeChange(int[] bills)`, 2, { hlPhase: 'init' });
    add("Init Registers", `int five = 0, ten = 0;\nStarting with empty cash register.`, 3, { hlPhase: 'init' });

    let isSuccess = true;

    for (let i = 0; i < bills.length; i++) {
        let bill = bills[i];
        
        add("Next Customer", `for (int bill : bills)\nServing customer ${i + 1}. Received $${bill} bill.`, 5, { hlPhase: 'loop', idx: i, curBill: bill });

        if (bill === 5) {
            add("Process $5 Bill", `if (bill == 5)\nCustomer paid with $5. No change required!`, 6, { hlPhase: 'check5', idx: i, curBill: bill, changeReq: 0 });
            five++;
            twenty = twenty; // noop
            add("Update Register", `five++;\nAdded $5 to the register.`, 7, { hlPhase: 'add5', idx: i, curBill: bill, changeReq: 0 });
        } 
        else if (bill === 10) {
            add("Process $10 Bill", `else if (bill == 10)\nCustomer paid with $10. Change required: $5.`, 8, { hlPhase: 'check10', idx: i, curBill: bill, changeReq: 5 });
            add("Check $5 Availability", `if (five == 0) return false;\nDo we have at least one $5 bill? (${five > 0 ? 'Yes' : 'No'})`, 9, { hlPhase: 'checkAvail', idx: i, curBill: bill, changeReq: 5 });
            
            if (five === 0) {
                isSuccess = false;
                add("Failed to give change", `return false;\nWe don't have a $5 bill to give as change. Transaction fails!`, 9, { hlPhase: 'fail', idx: i, curBill: bill, isSuccess: false });
                break;
            }
            
            five--;
            add("Give $5 Change", `five--;\nHanded back one $5 bill as change.`, 10, { hlPhase: 'give5', idx: i, curBill: bill, changeReq: 5 });
            
            ten++;
            add("Keep $10 Bill", `ten++;\nAdded the customer's $10 bill to our register.`, 11, { hlPhase: 'add10', idx: i, curBill: bill, changeReq: 5 });
        } 
        else {
            // bill == 20
            add("Process $20 Bill", `else { // bill == 20\nCustomer paid with $20. Change required: $15.`, 12, { hlPhase: 'check20', idx: i, curBill: bill, changeReq: 15 });
            
            add("Greedy Choice 1", `if (five > 0 && ten > 0)\nDo we have one $10 and one $5? (Ten: ${ten}, Five: ${five})`, 14, { hlPhase: 'checkGreedy1', idx: i, curBill: bill, changeReq: 15 });
            
            if (five > 0 && ten > 0) {
                five--;
                ten--;
                twenty++;
                add("Execute Greedy 1", `five--; ten--;\nHanded back one $10 and one $5 as change. Kept the $20.`, 15, { hlPhase: 'give15_mixed', idx: i, curBill: bill, changeReq: 15 });
            } else {
                add("Greedy Choice 2", `else if (five >= 3)\nWe don't have a $10. Do we have at least three $5 bills? (Five: ${five})`, 17, { hlPhase: 'checkGreedy2', idx: i, curBill: bill, changeReq: 15 });
                
                if (five >= 3) {
                    five -= 3;
                    twenty++;
                    add("Execute Greedy 2", `five -= 3;\nHanded back three $5 bills as change. Kept the $20.`, 18, { hlPhase: 'give15_fives', idx: i, curBill: bill, changeReq: 15 });
                } else {
                    isSuccess = false;
                    add("Failed to give change", `return false;\nCannot make $15 change with current bills. Transaction fails!`, 20, { hlPhase: 'fail', idx: i, curBill: bill, isSuccess: false });
                    break;
                }
            }
        }
    }

    if (isSuccess) {
        add("Success", `return true;\nAll customers received correct change!`, 25, { hlPhase: 'success', isSuccess: true });
    }

    return steps;
  }, [billsArr, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Auto-scroll code view to active line
  useEffect(() => {
    const prefix = isFullscreen ? 'fs-' : 'main-';
    const container = isFullscreen ? codeContainerFullscreenRef.current : codeContainerMainRef.current;
    
    if (!container) return;
    
    const activeLineEl = document.getElementById(`${prefix}code-line-${curStepData.line}`);
    if (activeLineEl) {
        const offsetTop = activeLineEl.offsetTop;
        container.scrollTo({ top: offsetTop - 60, behavior: 'smooth' });
    }
  }, [currentStep, curStepData.line, isFullscreen]);

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

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

  const renderActiveDashboard = () => {
      if (!st.bills) return null;

      let isSuccessEnd = st.hlPhase === 'success';
      let isFailEnd = st.hlPhase === 'fail';

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isSuccessEnd ? 'border-emerald-400 ring-4 ring-emerald-100' : (isFailEnd ? 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200')} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Transaction State</span>
              
              {isSuccessEnd || isFailEnd ? (
                  <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                      <div className={`flex items-center gap-4 ${isSuccessEnd ? 'text-emerald-600 bg-emerald-50 border-emerald-300' : 'text-rose-600 bg-rose-50 border-rose-300'} font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                          <span>{isSuccessEnd ? "All Customers Served" : "Failed to provide change"}</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border ${isSuccessEnd ? 'border-emerald-200' : 'border-rose-200'}`}>Return {isSuccessEnd ? "true" : "false"}</span>
                      </div>
                  </div>
              ) : st.curBill !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                      <div className="flex flex-col items-center w-[110px] animate-in zoom-in">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-500`}>Customer {st.idx + 1}</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 w-full text-center rounded-xl bg-slate-100 border-slate-400 text-slate-800 shadow-inner flex items-center justify-center gap-1`}>
                              <User size={18}/> ${st.curBill}
                          </div>
                      </div>
                      <div className="flex flex-col items-center justify-center text-slate-400 font-black text-xl">
                          <ArrowRight size={20} />
                      </div>
                      <div className="flex flex-col items-center w-[110px] animate-in zoom-in">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Change Req.</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 w-full text-center rounded-xl transition-colors duration-300 ${st.changeReq > 0 ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              ${st.changeReq}
                          </div>
                      </div>
                      <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                      <div className="flex flex-col items-center min-w-[160px]">
                          <span className={`text-[9px] font-bold uppercase text-slate-400 mb-1`}>Cashier Action</span>
                          {st.hlPhase.includes('give') || st.hlPhase.includes('add') ? (
                              <div className={`flex flex-col items-center justify-center h-full w-full bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-800 font-bold text-[10px] uppercase tracking-widest shadow-sm animate-pulse px-4 py-2 text-center`}>
                                  {st.hlPhase === 'add5' ? "Kept $5" : 
                                   st.hlPhase === 'add10' ? "Kept $10" :
                                   st.hlPhase === 'give5' ? "Gave 1x $5" :
                                   st.hlPhase === 'give15_mixed' ? "Gave 1x $10 + 1x $5" :
                                   st.hlPhase === 'give15_fives' ? "Gave 3x $5" : "Processing"}
                              </div>
                          ) : (
                              <div className="flex items-center justify-center h-full w-full bg-slate-100 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest px-4 py-2 text-center">
                                  Evaluating...
                              </div>
                          )}
                      </div>
                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Waiting for customers...</span>
                  </div>
              )}
          </div>
      );
  };

  const renderVisuals = () => {
      if (!st.bills) return <span className="text-slate-400 italic mt-10">Initializing Queue...</span>;

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-auto relative pt-4 px-4 pb-12 overflow-x-hidden">
              
              {/* Dynamic State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Register and Queue */}
              <div className="flex flex-col xl:flex-row items-stretch justify-center w-full max-w-6xl mt-4 gap-8 px-4">
                  
                  {/* Left: Cash Register */}
                  <div className="bg-slate-50 border border-slate-200 shadow-inner rounded-[3rem] p-8 flex flex-col items-center w-full xl:w-72 shrink-0">
                      <span className="text-amber-500 font-black font-mono tracking-widest uppercase text-sm mb-6 flex items-center gap-2"><DollarSign size={18}/> Cash Register</span>
                      
                      <div className="flex flex-col gap-4 w-full">
                          {/* $5 Bill Counter */}
                          <div className={`flex items-center justify-between bg-white border-2 rounded-2xl p-4 shadow-sm transition-all duration-300 ${st.hlPhase.includes('5') || st.hlPhase === 'checkAvail' || st.hlPhase === 'checkGreedy1' || st.hlPhase === 'checkGreedy2' ? 'border-emerald-400 ring-4 ring-emerald-100 scale-105' : 'border-slate-200'}`}>
                              <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bills</span>
                                  <span className="text-2xl font-black font-mono text-emerald-600">$5</span>
                              </div>
                              <div className="text-4xl font-black font-mono text-slate-800">
                                  &times;{st.five !== undefined ? st.five : 0}
                              </div>
                          </div>

                          {/* $10 Bill Counter */}
                          <div className={`flex items-center justify-between bg-white border-2 rounded-2xl p-4 shadow-sm transition-all duration-300 ${st.hlPhase.includes('10') || st.hlPhase === 'checkGreedy1' ? 'border-sky-400 ring-4 ring-sky-100 scale-105' : 'border-slate-200'}`}>
                              <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bills</span>
                                  <span className="text-2xl font-black font-mono text-sky-600">$10</span>
                              </div>
                              <div className="text-4xl font-black font-mono text-slate-800">
                                  &times;{st.ten !== undefined ? st.ten : 0}
                              </div>
                          </div>

                          {/* $20 Bill Counter (Optional Tracking) */}
                          <div className={`flex items-center justify-between bg-white border-2 rounded-2xl p-4 shadow-sm transition-all duration-300 ${st.hlPhase.includes('20') ? 'border-indigo-400 ring-4 ring-indigo-100 scale-105' : 'border-slate-200'}`}>
                              <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bills</span>
                                  <span className="text-2xl font-black font-mono text-indigo-600">$20</span>
                              </div>
                              <div className="text-4xl font-black font-mono text-slate-800">
                                  &times;{st.twenty !== undefined ? st.twenty : 0}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Right: Customer Queue */}
                  <div className="bg-white border-2 border-slate-200 shadow-xl rounded-[3rem] p-8 flex-1 flex flex-col overflow-hidden relative">
                      <span className="text-sky-500 font-black font-mono tracking-widest uppercase text-sm mb-6 flex items-center gap-2"><UserCheck size={18}/> Customer Queue</span>
                      
                      <div className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200 flex-1 px-4">
                          {st.bills.map((bill: number, idx: number) => {
                              let isActive = st.idx === idx;
                              let isPast = st.idx > idx || st.isSuccess;
                              let isFailed = st.idx === idx && st.hlPhase === 'fail';
                              let isFuture = st.idx < idx;

                              let bgClass = "bg-slate-50 border-slate-200 text-slate-400";
                              let iconColor = "text-slate-300";
                              let scaleClass = "scale-100 opacity-60";

                              if (isActive) {
                                  bgClass = isFailed ? "bg-rose-100 border-rose-500 text-rose-900 shadow-xl ring-4 ring-rose-200" : "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200";
                                  iconColor = isFailed ? "text-rose-500" : "text-amber-500";
                                  scaleClass = "scale-110 z-10 opacity-100";
                              } else if (isPast) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm";
                                  iconColor = "text-emerald-500";
                                  scaleClass = "scale-95 opacity-80";
                              } else if (isFuture) {
                                  bgClass = "bg-white border-slate-300 text-slate-600 shadow-sm";
                                  iconColor = "text-slate-400";
                                  scaleClass = "scale-100 opacity-100";
                              }

                              return (
                                  <div key={`customer-${idx}`} className={`shrink-0 flex flex-col items-center transition-all duration-500 ${scaleClass}`}>
                                      {isActive && !isFailed && (
                                          <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-3 animate-bounce">Active</span>
                                      )}
                                      {isFailed && (
                                          <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest mb-3 animate-bounce">Failed</span>
                                      )}
                                      {isPast && !st.isSuccess && (
                                          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-3 opacity-0">Done</span>
                                      )}
                                      {isFuture && !st.isSuccess && (
                                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 opacity-0">Wait</span>
                                      )}
                                      
                                      <div className={`w-20 h-24 border-[3px] rounded-2xl flex flex-col items-center justify-center p-2 relative ${bgClass}`}>
                                          <User size={24} className={`mb-2 ${iconColor}`}/>
                                          <span className="font-mono font-black text-xl">${bill}</span>
                                          
                                          {isPast && !isFailed && (
                                              <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-0.5 border-2 border-white shadow-sm">
                                                  <Check size={12} className="text-white"/>
                                              </div>
                                          )}
                                          {isFailed && (
                                              <div className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-0.5 border-2 border-white shadow-sm">
                                                  <X size={12} className="text-white"/>
                                              </div>
                                          )}
                                      </div>
                                      <span className="text-[9px] font-mono text-slate-400 mt-2 font-bold">IDX: {idx}</span>
                                  </div>
                              )
                          })}
                          {st.bills.length === 0 && (
                              <span className="text-slate-400 italic text-sm font-mono w-full text-center">No customers in queue.</span>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Coins className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Lemonade Change</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Greedy Algorithm
                  </span>
                  <span>•</span>
                  <span>LeetCode 860</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none w-full xl:w-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><FileText size={28}/> Problem Statement</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>At a lemonade stand, each lemonade costs <code>$5</code>. Customers are standing in a queue to buy from you and order one at a time (in the order specified by bills). Each customer will only buy one lemonade and pay with either a <code>$5</code>, <code>$10</code>, or <code>$20</code> bill.</p>
                        <p>You must provide the correct change to each customer so that the net transaction is that the customer pays <code>$5</code>.</p>
                        <p>Note that you do not have any change in hand at first. Return <code>true</code> if and only if you can provide every customer with the correct change.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1: Success</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> bills = [5,5,5,10,20]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">true</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                - From the first 3 customers, we collect three $5 bills in order.<br/>
                                - From the fourth customer, we collect a $10 bill and give back a $5.<br/>
                                - From the fifth customer, we give a $10 bill and a $5 bill.<br/>
                                Since all customers got correct change, we return true.
                            </span>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2: Failure</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> bills = [5,5,10,10,20]</span>
                            <span className="text-rose-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">false</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs leading-relaxed block">
                                - From the first two customers, we collect two $5 bills.<br/>
                                - For the next two customers, we collect a $10 bill and give back a $5 bill.<br/>
                                - For the last customer, we can not give the change of $15 back because we only have two $10 bills.<br/>
                                Since not every customer received the correct change, the answer is false.
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>1 &le; bills.length &le; 10^5</code></li>
                            <li><code>bills[i]</code> is either <code>5</code>, <code>10</code>, or <code>20</code>.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className="text-amber-500"/> The Greedy Concept</h5>
                        <p className="text-sm leading-relaxed text-slate-600">This is a pure simulation problem that requires a greedy choice. When a customer hands us a $20 bill, we need to return $15 in change. We have two options: give one $10 and one $5, or give three $5s. The greedy choice is to <strong>always prefer giving the $10 bill first</strong> because $5 bills are strictly more versatile (they are needed to make change for $10 bills, whereas $10 bills cannot be broken down).</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Workflow size={16} className={`text-sky-500`}/> The Implementation</h5>
                        <p className="text-sm leading-relaxed text-slate-600">We simply maintain two counters: <code>five</code> and <code>ten</code>. We iterate through the array of bills once. For each bill, we apply the logic to update our counters. If at any point we cannot provide the required change using the bills we currently have in our counters, we immediately return <code>false</code>.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth" ref={codeContainerMainRef}>
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={`code-line-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Customer Bills Queue (5, 10, or 20)</label>
                            <input type="text" value={billsInput} onChange={(e) => setBillsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-slate-900`} placeholder="5, 5, 5, 10, 20" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true || st.isSuccess === false} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess === true ? 'bg-emerald-900 border-emerald-800' : (st.isSuccess === false ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess === true ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SUCCESS!</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully provided correct change to all customers.</p>
                         </div>
                    ) : st.isSuccess === false ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><XCircle size={24}/> FAILED!</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Unable to provide change for Customer {st.idx + 1} (${st.curBill}). Transaction halted.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('give') || st.hlPhase?.includes('add') ? 'text-emerald-400' : (st.hlPhase?.includes('fail') ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 relative flex flex-col shadow-inner overflow-hidden flex-1 min-h-[400px]">
                   {renderVisuals()}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className={`inline-flex items-center justify-center p-4 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl mb-2`}>
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory & Complexity Analysis</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Greedy Strategies and Counter Arrays.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Goal size={24} className={`text-amber-500`}/> 1. Why Greedy Works Here</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A greedy algorithm works when making the locally optimal choice at each step leads to a globally optimal solution. In this problem, when a customer gives a $20 bill, we must return $15 in change.</p>
                        <p className="text-slate-600 leading-relaxed">We have two ways to make $15: one $10 + one $5, OR three $5 bills. The greedy choice is to ALWAYS use the $10 bill if we have it. Why? Because a $5 bill is strictly more valuable to us—it can be used to make change for both a $10 bill and a $20 bill, whereas a $10 bill can ONLY be used to make change for a $20 bill. Preserving $5 bills is always the globally optimal choice.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-sky-500"/> 2. Avoiding an Array for the Register</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">You might be tempted to use an array or a Hash Map to store the bills you've collected, like <code>register[5] = count</code>. However, because there are only exactly three possible inputs (5, 10, 20), and we never actually need to give a 20 back as change, we only need two primitive integer counters: <code>five</code> and <code>ten</code>.</p>
                        <p className="text-slate-600 leading-relaxed">Using primitive integers instead of a map or array avoids hashing overhead and memory allocation, resulting in the absolute fastest execution time.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We iterate through the <code>bills</code> array exactly once. At each bill, we perform constant time $O(1)$ arithmetic checks to update our counters. Thus, the algorithm scales linearly with the number of customers.</li>
                            <li><strong>Space Complexity: O(1).</strong> We only use two integer variables (<code>five</code> and <code>ten</code>) to store our state, regardless of whether there are 5 customers or 100,000 customers. The auxiliary space required is strictly constant.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Lemonade Change is a very common warm-up problem. It checks if you over-engineer simple state tracking, or if you can elegantly spot the greedy mathematical property."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this by making change based on percentages, or giving random bills back?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, that would fail."</p>
                            <p>If you don't enforce the Greedy rule of using $10 bills first whenever possible, you will prematurely deplete your $5 bills. Because $5 bills are the only denomination that can act as change for both a $10 payment and a $20 payment, they are the bottleneck. You must hoard them.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "What if a customer hands us a $100 bill?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The current code would fail, as it hardcodes the 5, 10, 20 logic."</p>
                            <p>If arbitrary denominations are allowed, the problem transforms into the 'Coin Change' problem, which requires an array or Map to hold arbitrary register values, and a recursive/iterative search to find valid change combinations. The O(N) Greedy strategy only works because 5, 10, and 20 are perfect multiples of each other, guaranteeing no overlapping mathematical blind spots.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Cpu size={24}/></span>
                            <span>Q3: "Why don't we keep a variable `twenty = 0` and increment it when we receive a $20 bill?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because it's dead code."</p>
                            <p>The maximum bill we receive is $20, meaning the maximum change we ever have to give is $15. We can never, ever use a $20 bill to give change. Tracking it is a waste of a variable and CPU cycles, though a compiler might optimize it out. In an interview, explicitly mentioning that you omit it to save state demonstrates sharp logical deduction.</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div ref={codeContainerFullscreenRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10 relative scroll-smooth">
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess === true ? 'bg-emerald-900/40 border-emerald-800' : (st.isSuccess === false ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700')}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase?.includes('give') || st.hlPhase?.includes('add') ? 'text-emerald-400' : (st.hlPhase?.includes('fail') ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={`fs-code-${idx}`} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>

                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px] flex flex-col">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex w-64 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600 block`}>Customer Bills</label>
                              <input type="text" value={billsInput} onChange={(e) => setBillsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-slate-900`} placeholder="5, 5, 10, 20" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-lg transition-colors`}><Minimize size={24}/></button>
                        </div>
                  </div>

                  {!st.isSuccess && st.isSuccess !== false && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess === true || st.isSuccess === false} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div className="flex-1 w-full h-full flex flex-col pt-32 pb-10 px-10 overflow-y-auto">
                       {renderVisuals()}
                  </div>

                  {(st.isSuccess === true || st.isSuccess === false) && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSuccess ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isSuccess ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.isSuccess ? <PartyPopper size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">{st.isSuccess ? "SUCCESS!" : "FAILED"}</h2>
                                <p className={`font-mono text-xs uppercase mb-8 tracking-widest opacity-60 ${st.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>{st.isSuccess ? "All customers received correct change." : `Failed on customer ${st.idx + 1}`}</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.isSuccess ? 'text-emerald-500' : 'text-rose-500'}`}>Final Result</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.isSuccess ? 'true' : 'false'}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-600 hover:bg-${themeColor}-700 shadow-${themeColor}-900/20`}>
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