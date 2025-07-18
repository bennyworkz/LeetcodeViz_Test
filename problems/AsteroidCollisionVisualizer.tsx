import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, TrendingUp, Clock, Layers, Calculator, Combine, SquareSquare, Mountain, Hash, Network, Grid3X3, Star, Eraser
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  optimalStack: {
    id: 'optimalStack',
    title: '1. Stack (Optimal)',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public int[] asteroidCollision(int[] asteroids) {
    Stack<Integer> stack = new Stack<>();
    for (int i = 0; i < asteroids.length; i++) {
        int ast = asteroids[i];
        boolean destroyed = false;
        while (!stack.isEmpty() && ast < 0 && stack.peek() > 0) {
            if (stack.peek() < -ast) {
                stack.pop();
                continue;
            } else if (stack.peek() == -ast) {
                stack.pop();
            }
            destroyed = true;
            break;
        }
        if (!destroyed) {
            stack.push(ast);
        }
    }
    int[] res = new int[stack.size()];
    for (int i = res.length - 1; i >= 0; i--) {
        res[i] = stack.pop();
    }
    return res;
}`,
    desc: "The Optimal Stack approach. We use a Stack to simulate the state of the universe. Asteroids moving right (positive) are pushed to the stack. When an asteroid moves left (negative), we check if it collides with right-moving asteroids on the top of the stack. We pop smaller ones. Because each asteroid is pushed and popped at most once, the entire process runs in exactly O(N) time."
  },
  naiveSimulation: {
    id: 'naiveSimulation',
    title: '2. Array Simulation (Naive)',
    icon: <ShieldAlert size={16} />,
    complexity: 'Time: O(N²) | Space: O(N)',
    code: `public int[] asteroidCollision(int[] asteroids) {
    List<Integer> list = new ArrayList<>();
    for (int ast : asteroids) list.add(ast);
    
    boolean collision = true;
    while (collision) {
        collision = false;
        for (int i = 0; i < list.size() - 1; i++) {
            if (list.get(i) > 0 && list.get(i + 1) < 0) {
                int left = list.get(i);
                int right = -list.get(i + 1);
                
                if (left > right) {
                    list.remove(i + 1);
                } else if (left < right) {
                    list.remove(i);
                } else {
                    list.remove(i + 1);
                    list.remove(i);
                }
                
                collision = true;
                break;
            }
        }
    }
    
    int[] res = new int[list.size()];
    for (int i = 0; i < list.size(); i++) res[i] = list.get(i);
    return res;
}`,
    desc: "The Naive Array Simulation approach. We repeatedly scan the list of asteroids from left to right looking for adjacent opposing pairs (positive followed by negative). If we find a collision, we destroy the smaller one, flag that a collision happened, and start scanning all over again. In the worst case (e.g. all positive then one huge negative), this takes O(N²) time."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active = false, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|double|int|char|return|if|else|for|while|continue|break|new|length|Math|max|min|asteroidCollision|asteroids|Stack|stack|ast|destroyed|isEmpty|peek|pop|push|res|size|List|ArrayList|list|collision|add|get|remove|left|right)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
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
            const isKeyword = ['public', 'private', 'boolean', 'double', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'Stack', 'List', 'ArrayList'].includes(part);
            const isVar = ['asteroids', 'stack', 'ast', 'destroyed', 'res', 'list', 'collision', 'left', 'right', 'i'].includes(part);
            const isMapCall = ['length', 'max', 'min', 'asteroidCollision', 'isEmpty', 'peek', 'pop', 'push', 'size', 'add', 'get', 'remove'].includes(part);
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
    if (isDeleted) activeTheme = themes['disabled'];

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null || val === "" ? '\u00A0' : String(val);

    const dims = compact 
        ? "min-w-[40px] md:min-w-[48px] min-h-[40px] md:min-h-[48px]" 
        : "min-w-[48px] md:min-w-[56px] min-h-[48px] md:min-h-[56px]";
    const textSz = compact ? "text-lg md:text-xl" : "text-xl md:text-2xl";
    const subTextSz = compact ? "text-[8px]" : "text-[9px] md:text-[10px]";

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center ${dims} border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black ${textSz} py-1 ${isDeleted ? 'bg-rose-50 text-rose-300 line-through' : 'bg-white/60 ' + activeTheme.text} ${isDimmed && !isDeleted ? 'opacity-50' : 'opacity-100'} whitespace-nowrap tracking-tighter relative`}>
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

export default function AsteroidCollisionVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('optimalStack');
  
  const [arrInput, setArrInput] = useState('5, 10, -5');
  const [baseArr, setBaseArr] = useState([5, 10, -5]);
  
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
      let parsed = arrInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n !== 0);
      if (parsed.length === 0) parsed = [5, 10, -5];
      if (parsed.length > 20) parsed = parsed.slice(0, 20); // Restrict to avoid overload
      setBaseArr(parsed);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [arrInput, selectedOpId]);

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
    if (!baseArr || baseArr.length === 0) return [{ phase: 'Init', description: 'Enter valid non-zero integers.', line: 1, state: {} }];

    const arr = [...baseArr];
    const n = arr.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { arr: [...arr], n, ...st } 
    });

    if (selectedOpId === 'optimalStack') {
        let stack = [];
        
        add("Function Call", `public int[] asteroidCollision(int[] asteroids)`, 1, { stack: [...stack] });
        add("Init Stack", `Stack<Integer> stack = new Stack<>();\nStack to hold surviving asteroids.`, 2, { stack: [...stack] });
        
        for (let i = 0; i < n; i++) {
            add("Loop Eval", `for (int i = ${i}; i < asteroids.length; i++)\nIterating through asteroids.`, 3, { stack: [...stack], iter: i, isEvalFor: true });
            
            let ast = arr[i];
            add("Extract Asteroid", `int ast = asteroids[${i}];\nCurrent asteroid is ${ast}.`, 4, { stack: [...stack], iter: i, ast, hlArr: i });
            
            let destroyed = false;
            add("Init Destroyed Flag", `boolean destroyed = false;`, 5, { stack: [...stack], iter: i, ast, destroyed });
            
            while (true) {
                let hasStack = stack.length > 0;
                let isLeft = ast < 0;
                let topRight = hasStack ? stack[stack.length - 1] > 0 : false;
                let whileCond = hasStack && isLeft && topRight;
                
                add("While Eval", `while (!stack.isEmpty() && ast < 0 && stack.peek() > 0)\nDoes a collision happen? (${whileCond ? 'Yes' : 'No'})`, 6, { stack: [...stack], iter: i, ast, destroyed, isCheckingWhile: true, hlStackTop: hasStack, hlAstTarget: true });
                
                if (!whileCond) break;
                
                let top = stack[stack.length - 1];
                let astAbs = -ast;
                
                add("Compare Sizes (<)", `if (stack.peek() < -ast)\nIs Top (${top}) smaller than Current (${astAbs})?`, 7, { stack: [...stack], iter: i, ast, destroyed, hlStackTop: true, hlAstTarget: true, isComparingTop: true });
                
                if (top < astAbs) {
                    add("Pop Stack (Top Explodes)", `stack.pop();\nTop (${top}) explodes. Current asteroid (${ast}) continues moving.`, 8, { stack: [...stack], iter: i, ast, destroyed, hlStackPop: true });
                    stack.pop();
                    add("Continue Loop", `continue;\nRe-evaluating with the new top of stack.`, 9, { stack: [...stack], iter: i, ast, destroyed });
                    continue;
                } else {
                    add("Compare Sizes (==)", `else if (stack.peek() == -ast)\nAre Top (${top}) and Current (${astAbs}) the exact same size?`, 10, { stack: [...stack], iter: i, ast, destroyed, hlStackTop: true, hlAstTarget: true, isComparingTopEq: true });
                    
                    if (top === astAbs) {
                        add("Pop Stack (Both Explode)", `stack.pop();\nBoth asteroids are the same size. Both explode!`, 11, { stack: [...stack], iter: i, ast, destroyed, hlStackPop: true });
                        stack.pop();
                    } else {
                        add("Top is Larger", `(Implicit else: Top is larger. Current asteroid explodes.)`, 10, { stack: [...stack], iter: i, ast, destroyed });
                    }
                    
                    destroyed = true;
                    add("Set Destroyed Flag", `destroyed = true;`, 13, { stack: [...stack], iter: i, ast, destroyed });
                    add("Break Loop", `break;`, 14, { stack: [...stack], iter: i, ast, destroyed });
                    break;
                }
            }
            
            add("Check Destroyed", `if (!destroyed)\nDid the current asteroid survive? (${!destroyed ? 'Yes' : 'No'})`, 16, { stack: [...stack], iter: i, ast, destroyed, isCheckingDestroyed: true });
            
            if (!destroyed) {
                add("Push Stack", `stack.push(ast);\nAsteroid survived and is pushed to the universe stack.`, 17, { stack: [...stack], iter: i, ast, destroyed, hlStackPush: true });
                stack.push(ast);
            }
        }
        
        add("Loop End", `for (int i = ${n}; i < asteroids.length; i++)\nCondition is false. Finished processing.`, 3, { stack: [...stack], isEvalFor: true });
        
        let res = new Array(stack.length).fill(0);
        add("Init Result Array", `int[] res = new int[stack.size()];\nPreparing output array of size ${stack.length}.`, 20, { stack: [...stack], res: [...res] });
        
        for (let i = res.length - 1; i >= 0; i--) {
            add("Result Loop Eval", `for (int i = ${i}; i >= 0; i--)\nPopping stack to fill result backwards.`, 21, { stack: [...stack], res: [...res], resIter: i, isEvalResLoop: true });
            
            let val = stack.pop();
            res[i] = val;
            add("Pop to Result", `res[i] = stack.pop();\nPopped ${val} into res[${i}].`, 22, { stack: [...stack], res: [...res], resIter: i, hlRes: i });
        }
        
        add("Result Loop End", `for (int i = -1; i >= 0; i--)\nCondition is false.`, 21, { stack: [...stack], res: [...res], isEvalResLoop: true });
        add("Return Result", `return res;`, 24, { stack: [...stack], res: [...res], isSuccess: true, finalAns: `[${res.join(', ')}]` });

    } else if (selectedOpId === 'naiveSimulation') {
        let list = [...arr];
        
        add("Function Call", `public int[] asteroidCollision(int[] asteroids)`, 1, { list: [...list] });
        add("Init List", `List<Integer> list = new ArrayList<>();\nConverting array to a mutable list for easy deletions.`, 2, { list: [...list] });
        
        let collision = true;
        add("Init Collision Flag", `boolean collision = true;`, 5, { list: [...list], collision });
        
        while (collision) {
            add("While Eval", `while (collision)\nDoes a potential collision exist?`, 6, { list: [...list], collision, isEvalWhile: true });
            
            collision = false;
            add("Reset Collision Flag", `collision = false;`, 7, { list: [...list], collision });
            
            let broken = false;
            for (let i = 0; i < list.length - 1; i++) {
                add("For Loop Eval", `for (int i = ${i}; i < list.size() - 1; i++)\nScanning adjacent pairs.`, 8, { list: [...list], collision, iter: i, isEvalFor: true });
                
                let c1 = list[i];
                let c2 = list[i + 1];
                let colliding = c1 > 0 && c2 < 0;
                
                add("Check Collision Pair", `if (list.get(${i}) > 0 && list.get(${i + 1}) < 0)\nAre they colliding? (${colliding ? 'Yes' : 'No'})`, 9, { list: [...list], collision, iter: i, hlPair: [i, i+1], isCheckingPair: true });
                
                if (colliding) {
                    let left = c1;
                    let right = -c2;
                    add("Extract Sizes", `int left = ${left};\nint right = ${right};`, 11, { list: [...list], collision, iter: i, hlPair: [i, i+1], left, right });
                    
                    add("Compare Sizes (>)", `if (left > right)\nIs Left > Right?`, 13, { list: [...list], collision, iter: i, hlPair: [i, i+1], left, right, isComparing: true });
                    if (left > right) {
                        list.splice(i+1, 1);
                        add("Remove Right", `list.remove(i + 1);\nRight asteroid destroyed.`, 14, { list: [...list], collision, iter: i, hlRemove: i+1 });
                    } else {
                        add("Compare Sizes (<)", `else if (left < right)\nIs Left < Right?`, 15, { list: [...list], collision, iter: i, hlPair: [i, i+1], left, right, isComparing: true });
                        if (left < right) {
                            list.splice(i, 1);
                            add("Remove Left", `list.remove(i);\nLeft asteroid destroyed.`, 16, { list: [...list], collision, iter: i, hlRemove: i });
                        } else {
                            add("Compare Sizes (==)", `else\nBoth are equal size.`, 17, { list: [...list], collision, iter: i, hlPair: [i, i+1], left, right, isComparing: true });
                            list.splice(i, 2);
                            add("Remove Both", `list.remove(i + 1);\nlist.remove(i);\nBoth destroyed.`, 19, { list: [...list], collision, iter: i, hlRemoveBoth: true });
                        }
                    }
                    
                    collision = true;
                    add("Set Collision True", `collision = true;\nA collision occurred, so we must rescan from the beginning!`, 22, { list: [...list], collision, iter: i });
                    add("Break For Loop", `break;`, 23, { list: [...list], collision, iter: i });
                    broken = true;
                    break;
                }
            }
            if (!broken) {
                add("For Loop End", `for (...)\nFinished scanning list. No collisions found.`, 8, { list: [...list], collision, isEvalFor: true });
            }
        }
        
        add("While Eval End", `while (collision)\nNo more collisions detected. Terminating loop.`, 6, { list: [...list], collision, isEvalWhile: true });
        
        add("Return Result", `return res;\nConverting list back to array and returning.`, 29, { list: [...list], isSuccess: true, finalAns: `[${list.join(', ')}]` });
    }

    return steps;
  }, [baseArr, selectedOpId]);

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

  const themeColor = selectedOpId === 'optimalStack' ? 'emerald' : 'amber';

  // --- Rendering Helpers ---

  const getDirectionData = (val) => {
      if (val > 0) return { color: 'emerald', text: 'RIGHT →' };
      if (val < 0) return { color: 'rose', text: '← LEFT' };
      return { color: 'slate', text: 'NONE' };
  };

  const renderVisuals = () => {
      if (st.arr === undefined && st.list === undefined) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-2 gap-8 w-full">
              
              {/* OPTIMAL APPROACH VISUALS */}
              {selectedOpId === 'optimalStack' && st.arr !== undefined && (
                  <div className="flex flex-col items-center w-full max-w-5xl gap-8 animate-in slide-in-from-bottom-4">
                      {/* Original Asteroids Array */}
                      <div className="flex flex-col items-start w-full">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-sky-50 text-sky-600 border-sky-200 flex items-center gap-2`}><Layout size={12}/> Original Array 'asteroids'</span>
                          
                          <div className="flex gap-1.5 p-4 border-[3px] border-sky-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[90px]">
                              {st.arr.map((val, idx) => {
                                  let isHl = false;
                                  let { color, text } = getDirectionData(val);
                                  let isDimmed = false;
                                  let labels = [];

                                  if (st.iter === idx) {
                                      isHl = true;
                                      labels.push({ text: 'i', color: 'sky', pos: 'bottom' });
                                  }
                                  
                                  if (st.iter !== undefined && idx > st.iter) {
                                      isDimmed = true;
                                  }

                                  if (st.isSuccess || st.resIter !== undefined) {
                                      isDimmed = true;
                                      isHl = false;
                                  }

                                  return (
                                      <React.Fragment key={`orig-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'}`}>
                                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                {labels.map((l, j) => (
                                                    <React.Fragment key={j}>
                                                        <PointerLabel label={l.text} color={l.color} position="bottom" />
                                                    </React.Fragment>
                                                ))}
                                              </div>
                                              <NodeBlock val={val} subtext={text} themeColor={color} isTarget={isHl} isDimmed={isDimmed} compact={true}/>
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                          </div>
                      </div>

                      {/* State Variables Overlay */}
                      {!st.isSuccess && st.resIter === undefined && (
                          <div className="flex w-full gap-4 mt-2">
                              <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all ${st.hlAst || st.hlAstTarget ? 'border-sky-400 bg-sky-50 ring-4 ring-sky-200 scale-105' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.hlAst || st.hlAstTarget ? 'text-sky-600' : 'text-slate-400'}`}>Current 'ast'</span>
                                  <span className={`font-mono text-4xl font-black ${st.ast > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{st.ast !== undefined ? st.ast : '-'}</span>
                              </div>

                              <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center flex-1 transition-all ${st.destroyed ? 'border-rose-400 bg-rose-50 ring-4 ring-rose-200 scale-105' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.destroyed ? 'text-rose-600' : 'text-slate-400'}`}>Is Destroyed?</span>
                                  <span className={`font-mono text-4xl font-black ${st.destroyed ? 'text-rose-600' : 'text-slate-700'}`}>{st.destroyed ? 'TRUE' : (st.ast !== undefined ? 'FALSE' : '-')}</span>
                              </div>
                          </div>
                      )}

                      {/* Stack / Res Array Container */}
                      <div className="flex flex-col items-start w-full">
                          {st.resIter !== undefined ? (
                              <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 flex items-center gap-2`}><Layout size={12}/> Output Array 'res'</span>
                          ) : (
                              <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-2`}><Layers size={12}/> Universe 'stack'</span>
                          )}
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[90px] transition-colors duration-300 ${st.hlStackPush ? 'border-emerald-400 bg-emerald-50/50' : (st.hlStackPop ? 'border-rose-400 bg-rose-50/50' : 'border-indigo-200')}`}>
                              {/* Render Stack normally, or Res if iterating res */}
                              {st.resIter === undefined ? (
                                  <>
                                      {st.stack && st.stack.map((val, idx) => {
                                          let isHl = false;
                                          let { color, text } = getDirectionData(val);
                                          let isDeleted = false;
                                          let labels = [];

                                          if (st.hlStackPush && idx === st.stack.length - 1) {
                                              isHl = true;
                                          }
                                          if (st.hlStackTop && idx === st.stack.length - 1) {
                                              isHl = true;
                                              labels.push({ text: 'top', color: 'indigo', pos: 'top' });
                                          }
                                          if (st.hlStackPop && idx === st.stack.length) {
                                              // This happens if the pop hasn't committed visually but we want to show it.
                                              // Given our trace commits stack immediately, let's just let it vanish.
                                              // If we wanted to animate deletion, we'd need to keep it in state temporarily.
                                          }

                                          return (
                                              <React.Fragment key={`stk-${idx}`}>
                                                  <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'} ${st.hlStackPush && idx === st.stack.length - 1 ? 'animate-in zoom-in slide-in-from-left-4' : ''}`}>
                                                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                                        {labels.map((l, j) => (
                                                            <React.Fragment key={j}>
                                                                <PointerLabel label={l.text} color={l.color} position="top" />
                                                            </React.Fragment>
                                                        ))}
                                                      </div>
                                                      <NodeBlock val={val} subtext={text} themeColor={color} isTarget={isHl} compact={true}/>
                                                  </div>
                                              </React.Fragment>
                                          )
                                      })}
                                      {(!st.stack || st.stack.length === 0) && <span className="text-slate-400 italic text-sm font-mono px-4">empty universe</span>}
                                  </>
                              ) : (
                                  <>
                                      {st.res && st.res.map((val, idx) => {
                                          let isHl = false;
                                          let { color, text } = getDirectionData(val);
                                          let isDimmed = val === 0; // assuming 0 is default fill
                                          let labels = [];

                                          if (st.hlRes === idx) {
                                              isHl = true;
                                          }
                                          if (st.resIter === idx) {
                                              labels.push({ text: 'i', color: 'fuchsia', pos: 'bottom' });
                                          }
                                          if (st.isSuccess) {
                                              isHl = false;
                                              isDimmed = false;
                                              labels = [];
                                          }

                                          return (
                                              <React.Fragment key={`res-${idx}`}>
                                                  <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2 animate-in zoom-in slide-in-from-top-4' : 'scale-100 z-10 m-0.5'}`}>
                                                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                        {labels.map((l, j) => (
                                                            <React.Fragment key={j}>
                                                                <PointerLabel label={l.text} color={l.color} position="bottom" />
                                                            </React.Fragment>
                                                        ))}
                                                      </div>
                                                      <NodeBlock val={val !== 0 || isHl || st.isSuccess ? val : ""} subtext={val !== 0 || isHl || st.isSuccess ? text : undefined} themeColor={val !== 0 || isHl || st.isSuccess ? color : 'slate'} isTarget={isHl} isDimmed={isDimmed} compact={true}/>
                                                  </div>
                                              </React.Fragment>
                                          )
                                      })}
                                  </>
                              )}
                          </div>
                      </div>
                  </div>
              )}

              {/* NAIVE APPROACH VISUALS */}
              {selectedOpId === 'naiveSimulation' && st.list !== undefined && (
                  <div className="flex flex-col items-center w-full max-w-5xl gap-8 animate-in slide-in-from-bottom-4">
                      
                      <div className="flex flex-col items-start w-full">
                          <span className={`text-[10px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-lg border shadow-sm bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-2`}><ShieldAlert size={12}/> Mutated List 'list'</span>
                          
                          <div className={`flex gap-1.5 p-4 border-[3px] bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-start items-center w-full min-h-[90px] transition-colors duration-300 ${st.hlRemove !== undefined || st.hlRemoveBoth ? 'border-rose-400 bg-rose-50/50 ring-4 ring-rose-200' : 'border-amber-200'}`}>
                              {st.list.map((val, idx) => {
                                  let isHl = false;
                                  let { color, text } = getDirectionData(val);
                                  let labels = [];

                                  if (st.hlPair && (idx === st.hlPair[0] || idx === st.hlPair[1])) {
                                      isHl = true;
                                      if (st.hlRemove === idx) {
                                          color = 'rose';
                                      }
                                      if (st.hlRemoveBoth) {
                                          color = 'rose';
                                      }
                                  }

                                  if (st.iter === idx) {
                                      labels.push({ text: 'i', color: 'amber', pos: 'bottom' });
                                  }

                                  return (
                                      <React.Fragment key={`list-${val}-${idx}`}>
                                          <div className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-0.5'}`}>
                                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                                {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                                    <React.Fragment key={j}>
                                                        <PointerLabel label={l.text} color={l.color} position="bottom" />
                                                    </React.Fragment>
                                                ))}
                                              </div>
                                              <NodeBlock val={val} subtext={text} themeColor={color} isTarget={isHl} compact={true}/>
                                          </div>
                                      </React.Fragment>
                                  )
                              })}
                              {st.list.length === 0 && <span className="text-slate-400 italic text-sm font-mono px-4">empty list</span>}
                          </div>
                      </div>

                      {/* State Variables Overlay */}
                      {!st.isSuccess && (
                          <div className="flex w-full gap-4 mt-2 max-w-sm mx-auto">
                              <div className={`bg-white border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center w-full transition-all ${st.isEvalWhile ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200 scale-105' : 'border-slate-200'}`}>
                                  <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${st.isEvalWhile ? 'text-amber-600' : 'text-slate-400'}`}>Collision Flag</span>
                                  <span className={`font-mono text-4xl font-black ${st.collision ? 'text-amber-600' : 'text-slate-500'}`}>{st.collision !== undefined ? (st.collision ? 'TRUE' : 'FALSE') : '-'}</span>
                              </div>
                          </div>
                      )}

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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                <ShieldAlert className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Asteroid Collision</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      LC 735 • Stack / Array
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
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <div className="text-base leading-relaxed">
                  We are given an array <code>asteroids</code> of integers representing asteroids in a row.<br/><br/>
                  For each asteroid, the absolute value represents its size, and the sign represents its direction (<strong>positive meaning right</strong>, <strong>negative meaning left</strong>). Each asteroid moves at the same speed.<br/><br/>
                  Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> asteroids = [5,10,-5]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [5,10]</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
The 10 and -5 collide resulting in 10.
The 5 and 10 never collide.
                        </div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> asteroids = [10,2,-5]</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> [10]</div>
                        <div className="text-slate-500 mt-2 flex-1 whitespace-pre-wrap">
Explanation:
The 2 and -5 collide resulting in -5.
The 10 and -5 collide resulting in 10.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>2 &lt;= asteroids.length &lt;= 10⁴</li>
                        <li>-1000 &lt;= asteroids[i] &lt;= 1000</li>
                        <li><code>asteroids[i] != 0</code></li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            Trap: Negative followed by Positive (e.g. [-5, 5]) NEVER collide because they are moving away from each other. Collisions ONLY happen when a Positive is followed by a Negative (e.g. [5, -5]).
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
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-amber-600 text-white border-amber-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-amber-200') : 'text-slate-400'}`}>{op.complexity}</div>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                <span>Asteroids Array (Comma separated)</span>
                            </label>
                            <input 
                                type="text"
                                value={arrInput} 
                                onChange={(e) => setArrInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} 
                                spellCheck={false}
                                placeholder="5, 10, -5"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-amber-600 shadow-amber-200 hover:bg-amber-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`}><Layout size={14}/> Memory Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}><Maximize2 size={16}/></button>
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The Collision Rule</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Asteroids only collide when one moves <strong>Right (Positive)</strong> and the asteroid strictly after it moves <strong>Left (Negative)</strong>.</p>
                            <p>If a Negative is followed by a Positive (e.g. <code>-5, 5</code>), they are moving away from each other and will never meet.</p>
                            <p>Because multiple right-moving asteroids can stack up before a single large left-moving asteroid wipes them all out, we need a way to process them backwards.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-emerald-700 text-lg uppercase tracking-widest mb-6">The Stack Solution</h3>
                        <div className="space-y-4 text-sm text-emerald-900/80 leading-relaxed font-medium">
                            <p>We use a <strong>Stack</strong> to represent the surviving universe of asteroids.</p>
                            <p>We iterate left to right. When we see a right-moving asteroid, we push it safely to the stack.</p>
                            <p>When we see a left-moving asteroid, we enter a <code>while</code> loop to battle it against the top of the stack. If the stack's top is a smaller right-moving asteroid, we pop (destroy) it and check the next top. If it survives the whole loop, we push it to the stack.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Mastering Condition Flow</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"This is an incredibly common interview question. The logic inside the while loop is tricky to get right without messy nested if/else statements. Clearly articulating your `while (!stack.isEmpty() &amp;&amp; ast &lt; 0 &amp;&amp; stack.peek() &gt; 0)` loop condition shows the interviewer you can write clean, professional code."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ShieldAlert size={16}/></div>
                               1. Acknowledge the Naive Simulation
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The naive way to simulate this is to continually scan the array for adjacent `+` then `-` pairs, resolve the collision, modify the array, and start scanning again. In a case like `[1, 2, 3, 4, 5, -10]`, it takes O(N²) time because we rescan repeatedly."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Layers size={16}/></div>
                               2. Pivot to Stack Optimization
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "Since collisions happen sequentially and a single left-moving asteroid can retroactively destroy multiple recently seen right-moving asteroids, this is a perfect use case for a Stack. This allows us to process the entire array in a single O(N) pass."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><Code2 size={16}/></div>
                               3. Detail the Execution
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "I'll push right-moving asteroids to the stack. If I see a left-moving one, I'll use a `while` loop to repeatedly compare it to the stack's top. If the top is smaller, I `pop()` and continue. If the top is equal, I `pop()` and mark the current as destroyed. If the top is larger, the current is destroyed. If the left-moving asteroid survives the loop, I push it. Finally, I pop everything into a result array."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-amber-500 shadow-amber-900/50'}`}><Code2 size={20}/></div>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-amber-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>Asteroids Array</label>
                              <input type="text" value={arrInput} onChange={(e) => setArrInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-amber-50 hover:text-amber-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-amber-600 hover:bg-amber-700 border-amber-400 shadow-amber-900/30'}`}>NEXT <ChevronRight size={32}/></button>
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