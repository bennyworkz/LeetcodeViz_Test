
import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Waves, ArrowDown, Droplet, FileText, Database, Scale, BarChart3 } from 'lucide-react';

const APPROACHES = {
  twoPointer: {
    id: 'twoPointer',
    title: '1. Two-Pointer',
    subtitle: 'Optimal O(1) Space',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int totalWater = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else totalWater += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else totalWater += rightMax - height[right];
                right--;
            }
        }
        return totalWater;
    }
}`,
    explanation: "The standard gold-standard solution. We move inward from both ends, tracking the 'peak' seen so far on each side. Since the water trapped is limited by the shorter boundary, we only ever process the side with the smaller current height."
  },
  dp: {
    id: 'dp',
    title: '2. Dynamic Prog',
    subtitle: 'Prefix/Suffix Arrays',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int trap(int[] height) {
        int n = height.length;
        if (n == 0) return 0;
        int[] leftMax = new int[n];
        int[] rightMax = new int[n];
        
        leftMax[0] = height[0];
        for (int i = 1; i < n; i++) 
            leftMax[i] = Math.max(height[i], leftMax[i-1]);
            
        rightMax[n-1] = height[n-1];
        for (int i = n - 2; i >= 0; i--) 
            rightMax[i] = Math.max(height[i], rightMax[i+1]);
            
        int water = 0;
        for (int i = 0; i < n; i++) 
            water += Math.min(leftMax[i], rightMax[i]) - height[i];
            
        return water;
    }
}`,
    explanation: "Trading space for simplicity. We spend O(N) memory to pre-compute the peaks to the left and right of every bar. This turns the O(N) search into a constant time lookup for each index."
  },
  brute: {
    id: 'brute',
    title: '3. Brute Force',
    subtitle: 'N² Peak Search',
    icon: <AlertCircle size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public int trap(int[] height) {
        int total = 0;
        for (int i = 0; i < height.length; i++) {
            int lMax = 0, rMax = 0;
            for (int j = i; j >= 0; j--) lMax = Math.max(lMax, height[j]);
            for (int j = i; j < height.length; j++) rMax = Math.max(rMax, height[j]);
            total += Math.min(lMax, rMax) - height[i];
        }
        return total;
    }
}`,
    explanation: "For every single bar, we scan all elements to its left and right to find the current boundary peaks. This is the most intuitive but slowest method."
  }
};

const TrappingRainWaterVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('twoPointer');
  const [heightsInput, setHeightsInput] = useState("0,1,0,2,1,0,1,3,2,1,2,1");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const heights = useMemo(() => heightsInput.split(',').map(n => parseInt(n.trim()) || 0), [heightsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = heights.length;
    let totalWaterResult = 0;
    
    if (selectedApproach === 'twoPointer') {
      steps.push({
        phase: "Algorithm Design",
        description: "TRAP RULE: For any bar, water height = min(max_left, max_right) - current_height. A naive approach uses O(N) memory to pre-store peaks. We choose the Two-Pointer strategy to solve this with O(1) extra space.",
        line: 3,
        state: { left: 0, right: n - 1, leftMax: 0, rightMax: 0, totalWater: 0, waterArr: new Array(n).fill(0) }
      });

      let left = 0, right = n - 1, leftMax = 0, rightMax = 0, totalWater = 0;
      const waterArr = new Array(n).fill(0);
      while (left < right) {
        const isLeftSmaller = heights[left] < heights[right];
        if (isLeftSmaller) {
          if (heights[left] >= leftMax) {
              leftMax = heights[left];
              steps.push({ phase: "Process Left", description: `H[L] (${heights[left]}) is a new peak on the left side. No water trapped here.`, line: 8, state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr] } });
          } else {
              totalWater += leftMax - heights[left];
              waterArr[left] = leftMax - heights[left];
              steps.push({ phase: "Process Left", description: `H[L] (${heights[left]}) is lower than LeftPeak (${leftMax}). Trapping ${leftMax - heights[left]} units of water.`, line: 9, state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr] } });
          }
          left++;
        } else {
          if (heights[right] >= rightMax) {
              rightMax = heights[right];
              steps.push({ phase: "Process Right", description: `H[R] (${heights[right]}) is a new peak on the right side. No water trapped here.`, line: 11, state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr] } });
          } else {
              totalWater += rightMax - heights[right];
              waterArr[right] = rightMax - heights[right];
              steps.push({ phase: "Process Right", description: `H[R] (${heights[right]}) is lower than RightPeak (${rightMax}). Trapping ${rightMax - heights[right]} units of water.`, line: 12, state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr] } });
          }
          right--;
        }
      }
      totalWaterResult = totalWater;
    } else if (selectedApproach === 'dp') {
        const leftMaxArr = new Array(n).fill(0);
        const rightMaxArr = new Array(n).fill(0);
        const waterArr = new Array(n).fill(0);
        let totalWater = 0;

        steps.push({ phase: "Preprocessing", description: "Calculating LeftMax and RightMax arrays to avoid O(N²) nested scanning.", line: 4, state: { totalWater: 0, leftMaxArr: [...leftMaxArr], rightMaxArr: [...rightMaxArr], waterArr: [...waterArr] } });
        
        leftMaxArr[0] = heights[0];
        for (let i = 1; i < n; i++) {
            leftMaxArr[i] = Math.max(heights[i], leftMaxArr[i-1]);
            steps.push({ phase: "Prefix Pass", description: `leftMax[${i}] = max(height[${i}], leftMax[${i-1}]) = ${leftMaxArr[i]}`, line: 8, state: { idx: i, totalWater: 0, leftMaxArr: [...leftMaxArr], rightMaxArr: [...rightMaxArr], waterArr: [...waterArr] } });
        }
            
        rightMaxArr[n-1] = heights[n-1];
        for (let i = n - 2; i >= 0; i--) {
            rightMaxArr[i] = Math.max(heights[i], rightMaxArr[i+1]);
            steps.push({ phase: "Suffix Pass", description: `rightMax[${i}] = max(height[${i}], rightMax[${i+1}]) = ${rightMaxArr[i]}`, line: 12, state: { idx: i, totalWater: 0, leftMaxArr: [...leftMaxArr], rightMaxArr: [...rightMaxArr], waterArr: [...waterArr] } });
        }
            
        for (let i = 0; i < n; i++) {
            const trapped = Math.min(leftMaxArr[i], rightMaxArr[i]) - heights[i];
            totalWater += trapped;
            waterArr[i] = trapped;
            steps.push({ phase: "Calculate Water", description: `water[${i}] = min(${leftMaxArr[i]}, ${rightMaxArr[i]}) - ${heights[i]} = ${trapped}`, line: 16, state: { idx: i, totalWater, leftMaxArr: [...leftMaxArr], rightMaxArr: [...rightMaxArr], waterArr: [...waterArr] } });
        }
        totalWaterResult = totalWater;
    } else {
        // Brute Force
        let totalWater = 0;
        const waterArr = new Array(n).fill(0);
        steps.push({ phase: "Start Brute Force", description: "Scanning every bar individually to find its left and right peaks.", line: 4, state: { totalWater: 0, waterArr: [...waterArr] } });
        for (let i = 0; i < n; i++) {
            let lMax = 0, rMax = 0;
            for (let j = i; j >= 0; j--) lMax = Math.max(lMax, heights[j]);
            for (let j = i; j < n; j++) rMax = Math.max(rMax, heights[j]);
            const trapped = Math.min(lMax, rMax) - heights[i];
            totalWater += trapped;
            waterArr[i] = trapped;
            steps.push({ phase: "N² Peak Scan", description: `Bar ${i}: Highest to left is ${lMax}, highest to right is ${rMax}. Water = ${trapped}.`, line: 7, state: { idx: i, totalWater, waterArr: [...waterArr], lMax, rMax } });
        }
        totalWaterResult = totalWater;
    }

    steps.push({ phase: "Scan Finished", description: `Calculation complete. Total trapped water volume is ${totalWaterResult} units.`, line: 20, state: { ...steps[steps.length-1]?.state, finished: true } });
    return steps;
  }, [heights, selectedApproach]);

  const currentState = trace[currentStep] || trace[0];
  const { left, right, leftMax, rightMax, totalWater, waterArr, finished, lMax, rMax, leftMaxArr, rightMaxArr, idx: activeIdx } = currentState.state;
  const globalMaxHeight = Math.max(...heights, 1);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <Waves className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Trapping Rain Water</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter font-black">Amazon Hard</span>
                <span>LC 42 • Hard</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<AlignLeft size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 mb-6">42. Trapping Rain Water</h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
              <p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-sm space-y-2 mt-6">
                <p><span className="text-slate-400 font-bold uppercase">Input:</span> height = [0,1,0,2,1,0,1,3,2,1,2,1]</p>
                <p><span className="text-slate-400 font-bold uppercase">Output:</span> 6</p>
                <p className="text-slate-400 italic text-xs mt-2">Constraint: Must handle arrays up to 20,000 elements efficiently.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2">
                {Object.keys(APPROACHES).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key as any); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key as keyof typeof APPROACHES].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key as keyof typeof APPROACHES].complexity}
                    </span>
                  </button>
                ))}
              </div>
              <div className="bg-[#0f172a] rounded-2xl h-[450px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-4 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <span className="font-bold uppercase tracking-tight">TrappingRainWater.java</span>
                  <button onClick={() => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] overflow-auto relative">
                    <div className="absolute left-0 right-0 bg-blue-500/15 border-l-4 border-blue-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-blue-600 uppercase block pl-1 tracking-widest">Terrain Heights</label>
                  <input value={heightsInput} onChange={(e) => { setHeightsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold disabled:opacity-30 hover:bg-slate-200 transition-colors">Prev</button>
                  <button onClick={() => setCurrentStep(prev => Math.min(trace.length - 1, prev + 1))} disabled={currentStep === trace.length - 1} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-30 shadow-lg hover:bg-blue-700 transition-colors">Next Action</button>
                </div>
              </div>

              <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 min-h-[140px]">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">{currentState.phase}</span>
                <p className="text-sm leading-relaxed text-slate-300">{currentState.description}</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-8 h-[380px] relative flex flex-col justify-end overflow-hidden shadow-inner">
                <div className="absolute top-4 right-6 text-center animate-in fade-in">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Water</span>
                  <div className="text-3xl font-black text-blue-600 flex items-center justify-center gap-2">
                    <Droplet size={20} className="fill-blue-500 text-blue-500" /> <span className="tabular-nums">{totalWater ?? 0}</span>
                  </div>
                </div>

                {selectedApproach === 'dp' && leftMaxArr && (
                    <div className="absolute top-4 left-6 space-y-1">
                         <span className="text-[10px] font-black text-slate-400 uppercase block">DP State Precomputed</span>
                         <div className="flex gap-2">
                            <div className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-[10px] font-bold text-blue-600">LeftMax Array</div>
                            <div className="px-2 py-1 bg-purple-50 border border-purple-200 rounded text-[10px] font-bold text-purple-600">RightMax Array</div>
                         </div>
                    </div>
                )}

                <div className="flex items-end justify-center h-[200px] w-full gap-1 border-b-4 border-slate-900 pb-1 relative">
                  {heights.map((h, idx) => {
                    const barH = (h / globalMaxHeight) * 100;
                    const waterH = ((waterArr?.[idx] || 0) / globalMaxHeight) * 100;
                    const isLeft = left === idx;
                    const isRight = right === idx;
                    const isFocused = activeIdx === idx;
                    const isActive = isLeft || isRight || isFocused;

                    return (
                      <div key={idx} className="flex-1 h-full flex flex-col justify-end relative">
                        {isActive && !finished && (
                          <div className={`absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce ${isLeft ? 'text-blue-500' : isRight ? 'text-indigo-500' : 'text-orange-500'}`}>
                            <ArrowDown size={14} />
                          </div>
                        )}
                        <div className="bg-blue-400/80 w-full transition-all duration-700 relative z-0" style={{ height: `${waterH}%` }}></div>
                        <div className={`w-full transition-all duration-300 rounded-t-sm z-10 ${isActive ? 'bg-orange-600 shadow-lg' : 'bg-slate-700'}`} style={{ height: `${barH}%` }}></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm min-h-[500px] animate-in fade-in">
                <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Trap Rule & Efficiency Logic</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-2 shadow-sm">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Droplet size={18}/> The Core Equation</h3>
                            <p className="text-sm text-blue-800 leading-relaxed font-mono bg-white/50 p-3 rounded-lg border border-blue-200">water[i] = min(leftMax, rightMax) - height[i]</p>
                            <p className="text-xs text-blue-600 leading-relaxed italic">"A bar traps water if it's lower than the peaks on both its left and right sides."</p>
                        </div>
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 shadow-sm">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Target size={18}/> Why Two Pointers?</h3>
                            <p className="text-sm text-slate-700 leading-relaxed">Most problems require pre-calculating the peak arrays (O(N) space). Two pointers allow us to calculate peaks on-the-fly. If <code>height[left] &lt; height[right]</code>, we know the left peak is definitely the bottleneck, so we can calculate its water without knowing the true right peak yet.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                         <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center gap-4 text-white">
                             <div className="flex items-center gap-4">
                                <BarChart3 size={32} className="text-blue-400" />
                                <h4 className="font-black uppercase tracking-widest text-xs">Architectural Scaling</h4>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                                    <span className="text-[10px] text-slate-500 block mb-1">Time</span>
                                    <div className="font-mono text-xl font-bold">O(N)</div>
                                </div>
                                <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                                    <span className="text-[10px] text-blue-200 block mb-1">Optimal Space</span>
                                    <div className="font-mono text-xl font-bold">O(1)</div>
                                </div>
                             </div>
                             <p className="text-[11px] text-slate-400 leading-relaxed">"Linear time ensures we handle massive data. Constant space ensures we don't crash mobile devices or cloud instances under heavy load."</p>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Waves size={120} />
                    </div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-orange-400 font-black tracking-tight relative z-10 uppercase">
                        <Trophy size={20} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "Amazon systems handle millions of requests per second. While a O(N) Dynamic Programming approach is correct, the Two-Pointer optimization to O(1) space is the senior choice. It demonstrates an obsession with 'Frugality' and 'Invent and Simplify'. By eliminating auxiliary arrays, we reduce the memory footprint by 50% without sacrificing speed."
                    </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-tighter font-black">
                        <MessageSquare className="text-blue-500" size={18} />
                        Technical Rebuttal
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-sm font-black text-slate-800 mb-1 uppercase tracking-tighter">"What if the input is a data stream?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed italic">"If we receive data in chunks and can't see the 'future' (Right end), I would switch to a <b>Monotonic Stack</b> approach. This allows us to calculate trapped water as we encounter 'valley' structures, keeping state only for the unresolved bars."</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-sm font-black text-slate-800 mb-1 uppercase tracking-tighter">"Is there a faster solution than O(N)?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed italic">"No. To calculate the water, we must know the peak on both sides of every bar. In an unsorted array, we must visit every element at least once, making O(N) the theoretical lower bound for time complexity."</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 uppercase tracking-widest flex items-center gap-2 font-black">
                        <AlertCircle size={20}/> Amazon Leadership Check
                    </h3>
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">1</div>
                            <div>
                              <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Bias for Action</p>
                              <p className="text-xs text-blue-800 leading-relaxed mt-1">If asked to code quickly, start with the DP approach. It's harder to get wrong. Once working, propose the Two-Pointer optimization.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">2</div>
                            <div>
                              <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Dive Deep</p>
                              <p className="text-xs text-blue-800 leading-relaxed mt-1">Understand the edge cases: flat terrain, strictly increasing heights, and empty inputs. Mentioning these proactively shows senior-level rigor.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">3</div>
                            <div>
                              <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Frugality</p>
                              <p className="text-xs text-blue-800 leading-relaxed mt-1">Always frame the move from DP to Two-Pointers as a cost-saving measure for memory-intensive cloud environments.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="bg-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-200">
                    <BarChart3 className="text-slate-400 mb-2" size={40} />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter text-center">Benchmark: N=100,000</p>
                    <div className="mt-4 space-y-2 w-full">
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">Brute Force</span>
                            <span className="text-red-500 font-bold">Timed Out (~10s)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-400 w-full" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] pt-1">
                            <span className="text-slate-400">Two-Pointer</span>
                            <span className="text-emerald-500 font-bold">~15ms</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[2%]" />
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{icon} {label}</button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Math|max|min|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] ${active ? 'font-bold bg-blue-500/5' : ''}`}>
      <span className="w-8 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400">{part}</span>;
          if (['String', 'Math', 'length'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['max', 'min'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default TrappingRainWaterVisualizer;
