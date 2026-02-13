
import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Waves, ArrowDown, Droplet, FileText } from 'lucide-react';

const APPROACHES = {
  twoPointer: {
    id: 'twoPointer',
    title: 'Optimal Two-Pointer',
    subtitle: 'Constant Space O(1)',
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
    explanation: "This is the 'Elite' solution. We use two pointers and track the maximum height seen so far from both ends. Since the water trapped at any bar is limited by the shorter 'max' boundary, we always process the side with the smaller current height."
  }
};

const TrappingRainWaterVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [heightsInput, setHeightsInput] = useState("0,1,0,2,1,0,1,3,2,1,2,1");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const heights = useMemo(() => heightsInput.split(',').map(n => parseInt(n.trim()) || 0), [heightsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = heights.length;
    let left = 0, right = n - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;
    const waterArr = new Array(n).fill(0);

    steps.push({
      phase: "Algorithm Design",
      description: "TRAP RULE: For any bar, water height = min(max_left, max_right) - current_height. A naive approach uses O(N) memory to pre-store peaks. We choose the Two-Pointer strategy to solve this with O(1) extra space.",
      line: 3,
      state: { left: 0, right: n - 1, leftMax: 0, rightMax: 0, totalWater: 0, waterArr: new Array(n).fill(0) }
    });

    steps.push({
      phase: "Defining Boundaries",
      description: "We place pointers at both ends. We move the pointer with the smaller value because that side's 'Peak' is the bottleneck for trapping water. If we move from the shorter side, we can safely calculate volume.",
      line: 3,
      state: { left: 0, right: n - 1, leftMax: 0, rightMax: 0, totalWater: 0, waterArr: new Array(n).fill(0) }
    });

    while (left < right) {
      const isLeftSmaller = heights[left] < heights[right];
      
      if (isLeftSmaller) {
        const curHeight = heights[left];
        steps.push({
            phase: "Focus: Left Wall",
            description: `Left wall (${curHeight}) < Right wall (${heights[right]}). The bottleneck for water at index ${left} MUST be determined by the left-side peaks.`,
            line: 8,
            state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr], side: 'left' }
        });
        if (curHeight >= leftMax) {
          leftMax = curHeight;
          steps.push({
            phase: "Update Left Peak",
            description: `Current height ${curHeight} is a new record peak for the left. No water can be trapped at a peak index.`,
            line: 9,
            state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr], side: 'left' }
          });
        } else {
          const trapped = leftMax - curHeight;
          totalWater += trapped;
          waterArr[left] = trapped;
          steps.push({
            phase: "Trapping Logic",
            description: `Height ${curHeight} is lower than our Left Peak (${leftMax}). We can trap exactly ${trapped} units of water here.`,
            line: 10,
            state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr], side: 'left', trapping: true }
          });
        }
        left++;
      } else {
        const curHeight = heights[right];
        steps.push({
            phase: "Focus: Right Wall",
            description: `Right wall (${curHeight}) <= Left wall (${heights[left]}). Bottleneck for water at index ${right} is on the right-side peaks.`,
            line: 13,
            state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr], side: 'right' }
        });
        if (curHeight >= rightMax) {
          rightMax = curHeight;
          steps.push({
            phase: "Update Right Peak",
            description: `Height ${curHeight} is a new record peak for the right side. Updating memory.`,
            line: 14,
            state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr], side: 'right' }
          });
        } else {
          const trapped = rightMax - curHeight;
          totalWater += trapped;
          waterArr[right] = trapped;
          steps.push({
            phase: "Trapping Logic",
            description: `Height ${curHeight} is lower than Right Peak (${rightMax}). Trapping ${trapped} units of water.`,
            line: 15,
            state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr], side: 'right', trapping: true }
          });
        }
        right--;
      }
    }

    steps.push({ phase: "Scan Finished", description: `Calculation complete. Total trapped water volume across the entire terrain is ${totalWater} units.`, line: 20, state: { left, right, leftMax, rightMax, totalWater, waterArr: [...waterArr], finished: true } });
    return steps;
  }, [heights]);

  const currentState = trace[currentStep] || trace[0];
  const { left, right, leftMax, rightMax, totalWater, waterArr, finished } = currentState.state;
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
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">Amazon Hard</span>
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
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg">
              <p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-sm space-y-2 mt-6">
                <p><span className="text-slate-400 font-bold uppercase">Input:</span> height = [0,1,0,2,1,0,1,3,2,1,2,1]</p>
                <p><span className="text-slate-400 font-bold uppercase">Output:</span> 6</p>
                <p className="text-slate-400 italic text-xs mt-2">Explanation: The elevation map is [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
            <div className="flex flex-col gap-6">
              <div className="bg-[#0f172a] rounded-2xl h-[450px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-4 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <span className="font-bold uppercase tracking-tight">TrappingRainWater.java</span>
                  <button onClick={() => { navigator.clipboard.writeText(APPROACHES.twoPointer.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] overflow-auto">
                    <div className="absolute left-0 right-0 bg-blue-500/15 border-l-4 border-blue-500 pointer-events-none z-0 transition-all duration-300" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES.twoPointer.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                    ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex flex-col items-center">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Boundary Peak (L)</span>
                    <div className="text-2xl font-black text-blue-800 tabular-nums">{leftMax}</div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex flex-col items-center">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Boundary Peak (R)</span>
                    <div className="text-2xl font-black text-indigo-800 tabular-nums">{rightMax}</div>
                  </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-blue-600 uppercase block pl-1 tracking-widest">Terrain Heights</label>
                  <input value={heightsInput} onChange={(e) => { setHeightsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold disabled:opacity-30 hover:bg-slate-200 transition-colors">Prev</button>
                  <button onClick={() => setCurrentStep(prev => Math.min(trace.length - 1, prev + 1))} disabled={currentStep === trace.length - 1} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-30 shadow-lg hover:bg-blue-700 transition-colors">Next Action</button>
                </div>
              </div>

              <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 min-h-[140px]">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">{currentState.phase}</span>
                <p className="text-sm leading-relaxed text-slate-200">{currentState.description}</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-8 h-[380px] relative flex flex-col justify-end overflow-hidden shadow-inner">
                <div className="absolute top-4 right-6 text-center animate-in fade-in">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accumulated Volume</span>
                  <div className="text-3xl font-black text-blue-600 flex items-center justify-center gap-2">
                    <Droplet size={20} className="fill-blue-500 text-blue-500" /> <span className="tabular-nums">{totalWater}</span>
                  </div>
                </div>

                <div className="flex items-end justify-center h-[200px] w-full gap-1 border-b-4 border-slate-900 pb-1 relative">
                  {heights.map((h, idx) => {
                    const barH = (h / globalMaxHeight) * 100;
                    const waterH = (waterArr[idx] / globalMaxHeight) * 100;
                    const isLeft = left === idx;
                    const isRight = right === idx;
                    const isActive = isLeft || isRight;

                    return (
                      <div key={idx} className="flex-1 h-full flex flex-col justify-end relative">
                        {isActive && !finished && (
                          <div className={`absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce ${isLeft ? 'text-blue-500' : 'text-indigo-500'}`}>
                            <div className="text-[8px] font-black uppercase text-center mb-1 tracking-tighter">{isLeft ? 'Left' : 'Right'}</div>
                            <ArrowDown size={14} />
                          </div>
                        )}

                        <div className="bg-blue-400/80 w-full transition-all duration-700 relative z-0" style={{ height: `${waterH}%` }}>
                          {waterArr[idx] > 0 && <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white tabular-nums">{waterArr[idx]}</div>}
                        </div>
                        
                        <div className={`w-full transition-all duration-300 rounded-t-sm z-10 ${isActive ? 'bg-orange-600 shadow-lg' : 'bg-slate-700'}`} style={{ height: `${barH}%` }}>
                          {h > 0 && <div className="text-center text-[8px] text-white font-mono mt-0.5 tabular-nums">{h}</div>}
                        </div>
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
                <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Understanding Fluid Dynamics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-2 shadow-sm">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><Droplet size={18}/> The Water Logic</h3>
                            <p className="text-sm text-blue-800 leading-relaxed">For any bar at index <code>i</code>, the water it can hold is determined by its highest neighbors to the left and right:<br/><br/>
                            <code className="bg-white px-2 py-1 rounded font-bold border border-blue-200">water[i] = min(leftMax, rightMax) - height[i]</code>
                            <br/><br/>
                            The water level is always limited by the <strong>lower</strong> of the two surrounding peak boundaries.</p>
                        </div>
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 shadow-sm">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Target size={18}/> Two-Pointer Advantage</h3>
                            <p className="text-sm text-slate-700 leading-relaxed">Instead of pre-calculating arrays, we move from both ends inward. If <code>height[left] &lt; height[right]</code>, we know the <code>leftMax</code> is the absolute bottleneck for the current index, regardless of how high peaks on the far right might be.</p>
                        </div>
                    </div>
                    <div className="relative">
                         <div className="absolute inset-0 bg-blue-100/30 rounded-3xl border-2 border-dashed border-blue-200 flex items-center justify-center p-8">
                             <div className="text-center space-y-4">
                                <Waves size={48} className="mx-auto text-blue-400" />
                                <h4 className="font-black text-slate-900 uppercase tracking-widest">Memory Optimization</h4>
                                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">By using pointers instead of pre-computed auxiliary arrays, we reduce Space Complexity from <strong>O(N)</strong> to <strong>O(1)</strong>. This is the gold standard for high-performance systems screening.</p>
                             </div>
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
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-orange-400 font-black tracking-tight">
                        <Trophy size={20} /> Amazon Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "When presenting the Two-Pointer approach, I always emphasize the <strong>In-Place</strong> nature of the solution. Amazon evaluates candidates on their ability to write code that scales under extreme memory constraints. While the Dynamic Programming approach is O(N) time, the Two-Pointer optimization to O(1) space represents a significant engineering improvement for high-throughput cloud services."
                    </p>
                </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2 font-black">
                    <MessageSquare className="text-orange-500" size={18}/> Discussion Points
                  </h3>
                  <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tighter mb-1">"Could we use a Monotonic Stack?"</p>
                          <p className="text-xs text-slate-600 leading-relaxed italic mt-1">"Yes. A monotonic decreasing stack is another O(N) solution. It calculates water horizontally (layer by layer) rather than vertically. It's particularly useful if data arrives as a stream and we process it chunk-by-chunk."</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tighter mb-1">"How does this handle negative heights?"</p>
                          <p className="text-xs text-slate-600 leading-relaxed italic mt-1">"The core algorithm assumes non-negative heights (sea level baseline). If negative elevations exist, we would need to shift the entire terrain by the absolute minimum value to re-establish a zero baseline for fluid trapping."</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Math|max|length)\b|\b\d+\b)/g).filter(Boolean);
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
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default TrappingRainWaterVisualizer;
