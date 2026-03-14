import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Calculator, 
  Lightbulb, Zap, Target, Layers, Eye, EyeOff, 
  MapPin, Clock, Navigation, CheckCircle2, 
  Activity, Ship, Milestone, Sigma, Compass
} from 'lucide-react';

// --- UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap min-w-0 ${
      active 
        ? 'bg-slate-900 text-orange-400 shadow-lg shadow-orange-900/20 scale-105' 
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
    }`}
  >
    {icon} 
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden text-[10px]">{label.split(' ')[0]}</span>
  </button>
);

const SectionTitle = ({ icon, title, colorClass }) => (
  <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter mb-8 ${colorClass}`}>
    {icon} {title}
  </div>
);

const QuestionCard = ({ qNum, badge = "Practice", question, options = [], solution, ans = "" }) => {
  const [showSol, setShowSol] = useState(false);
  
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col h-full">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500"></div>
      <h4 className="font-black text-slate-800 text-lg mb-3 flex justify-between">
        <span>{qNum}</span>
        <span className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
          {badge}
        </span>
      </h4>
      <div className="text-slate-700 font-medium mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1 overflow-x-auto whitespace-pre-wrap">
        {question}
      </div>
      
      {options.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((opt, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-xl border font-mono text-sm font-bold flex items-center gap-2 ${
                showSol && ans && opt.startsWith(ans) 
                  ? 'bg-red-50 border-red-300 text-red-700' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                showSol && ans && opt.startsWith(ans) ? 'bg-red-200' : 'bg-slate-100'
              }`}>
                {opt.charAt(0)}
              </span>
              {opt.slice(2)}
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t border-slate-100 pt-4 mt-auto">
        <button 
          onClick={() => setShowSol(!showSol)} 
          className="flex items-center gap-2 text-sm font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest transition-colors outline-none"
        >
          {showSol ? (
            <><EyeOff size={16}/> Hide Solution</>
          ) : (
            <><Eye size={16}/> Show Solution</>
          )}
        </button>
        
        {showSol && (
          <div className="mt-5 bg-[#0f172a] text-white p-5 rounded-2xl text-sm leading-relaxed animate-in slide-in-from-top-2 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 text-orange-400 font-bold mb-4 uppercase tracking-widest text-[10px] border-b border-slate-700/80 pb-2">
              <BookOpen size={14} /> Step-by-Step Notebook
            </div>
            
            <div className="font-mono text-slate-300 leading-relaxed overflow-x-auto flex flex-col gap-2">
              {typeof solution === 'string' ? solution.split('\n').map((line, idx) => {
                const trimmedLine = line.trim();
                
                if (!trimmedLine) return <div key={idx} className="h-3"></div>;
                
                const isEquation = trimmedLine.startsWith('=') || trimmedLine.startsWith('=>') || trimmedLine.startsWith('➔');
                const isFinalLine = idx === solution.split('\n').length - 1;

                let lineClass = "text-slate-300";
                let prefix = null;

                if (isEquation) {
                   lineClass = "text-red-300 font-bold ml-4";
                   prefix = <span className="mr-3 text-red-500/70 select-none">↳</span>;
                } else if (isFinalLine && !trimmedLine.endsWith('?')) {
                   lineClass = "text-orange-300 font-bold bg-orange-500/10 px-3 py-1.5 rounded-lg inline-block w-max border border-orange-500/20";
                }

                return (
                  <div key={idx} className={`flex items-start ${lineClass}`}>
                    {prefix}
                    <span className="flex-1">{line}</span>
                  </div>
                );
              }) : solution}
            </div>
            
            {ans && (
              <div className="mt-5 pt-4 border-t border-slate-700/50 flex items-center gap-2">
                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={16} /> Correct Option: {ans}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---
export default function SpeedTimeDistanceNotes() {
  const [activeTab, setActiveTab] = useState('concepts');
  
  return (
    <div className="bg-[#fff7ed] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
              <Activity className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Speed, Time & Distance
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-orange-800 bg-orange-100 border border-orange-200">
                  Master Notes
                </span>
                <span>•</span>
                <span>Quantitative Aptitude</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-hide">
            <TabButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={<BookOpen size={16}/>} label="Core Concepts" />
            <TabButton active={activeTab === 'formulas'} onClick={() => setActiveTab('formulas')} icon={<Sigma size={16}/>} label="Formulas & Extra" />
            <TabButton active={activeTab === 'patterns'} onClick={() => setActiveTab('patterns')} icon={<Zap size={16}/>} label="Exam Patterns" />
            <TabButton active={activeTab === 'mcq'} onClick={() => setActiveTab('mcq')} icon={<BrainCircuit size={16}/>} label="MCQ Vault" />
            <TabButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={<Target size={16}/>} label="Practice Vault" />
          </div>
        </div>

        {/* --- TAB 1: CORE CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<BookOpen size={28}/>} title="Core Definitions & Triangles" colorClass="text-orange-600" />
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Distance */}
              <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5"><MapPin size={100}/></div>
                <h3 className="font-black text-xl text-orange-800 mb-3 relative z-10">Distance (D)</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  Refers to the spatial separation or physical gap between two objects, locations, or points. It is a scalar quantity.
                </p>
                <div className="bg-white px-3 py-2 rounded-lg font-mono text-sm border border-orange-100 text-orange-700 font-bold inline-block">
                  Units: m, km, miles
                </div>
              </div>

              {/* Time */}
              <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5"><Clock size={100}/></div>
                <h3 className="font-black text-xl text-rose-800 mb-3 relative z-10">Time (T)</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  Defined as the continuous and irreversible progression of events or the interval separating two events.
                </p>
                <div className="bg-white px-3 py-2 rounded-lg font-mono text-sm border border-rose-100 text-rose-700 font-bold inline-block">
                  Units: sec, mins, hr
                </div>
              </div>

              {/* Speed */}
              <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5"><Activity size={100}/></div>
                <h3 className="font-black text-xl text-red-800 mb-3 relative z-10">Speed (S)</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  The rate at which an object covers distance or the rate of change of its position with respect to time.
                </p>
                <div className="bg-white px-3 py-2 rounded-lg font-mono text-sm border border-red-100 text-red-700 font-bold inline-block">
                  Units: m/s, km/hr
                </div>
              </div>
            </div>

            {/* DST Magic Triangle */}
            <div className="bg-slate-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10"><Compass size={200}/></div>
                <h3 className="font-black text-orange-400 text-xl uppercase tracking-widest mb-6 border-b border-slate-700 pb-2 relative z-10">The D-S-T Magic Formulas</h3>
                
                <div className="grid md:grid-cols-3 gap-6 relative z-10 text-center font-mono">
                    <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600">
                        <div className="text-3xl font-black text-emerald-400 mb-2">D = S &times; T</div>
                        <p className="text-xs text-slate-300">Distance is directly proportional to speed and time.</p>
                    </div>
                    <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600">
                        <div className="text-3xl font-black text-sky-400 mb-2">T = D / S</div>
                        <p className="text-xs text-slate-300">As speed increases, time decreases (Inversely proportional).</p>
                    </div>
                    <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600">
                        <div className="text-3xl font-black text-rose-400 mb-2">S = D / T</div>
                        <p className="text-xs text-slate-300">Speed is Distance covered divided by time taken.</p>
                    </div>
                </div>
            </div>

            {/* Unit Conversions */}
            <div>
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                <Navigation size={20} className="text-orange-500"/> Crucial Unit Conversions
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-white p-6 rounded-2xl border-2 border-orange-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                     <div className="bg-orange-100 text-orange-700 p-3 rounded-xl font-black text-lg">km/hr ➔ m/s</div>
                     <div className="flex-1 font-mono text-sm text-slate-600">Multiply the speed value by <strong className="text-orange-600 text-lg block">5 / 18</strong></div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl border-2 border-red-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                     <div className="bg-red-100 text-red-700 p-3 rounded-xl font-black text-lg">m/s ➔ km/hr</div>
                     <div className="flex-1 font-mono text-sm text-slate-600">Multiply the speed value by <strong className="text-red-600 text-lg block">18 / 5</strong></div>
                 </div>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: FORMULAS & EXTRA CONCEPTS --- */}
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<Sigma size={28}/>} title="Advanced Formulas & Bonus Concepts" colorClass="text-red-600" />

            {/* Average Speed */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-3xl shadow-sm">
                <h4 className="font-black text-red-800 uppercase tracking-widest text-lg mb-6 text-center border-b border-red-200 pb-3">Average Speed Shortcuts</h4>
                
                <div className="grid md:grid-cols-2 gap-6 font-mono text-sm">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
                        <div className="absolute right-0 top-0 bg-red-500 text-white px-3 py-1 rounded-bl-xl font-bold text-[10px]">CASE 1</div>
                        <div className="text-xs text-red-500 font-bold mb-3 uppercase tracking-widest">When DISTANCE is Same</div>
                        <p className="text-xs text-slate-500 mb-3 font-sans">Going from A to B at speed X, and returning from B to A at speed Y.</p>
                        <div className="text-2xl font-black text-slate-800 text-center my-4">2xy / (x + y)</div>
                        <div className="bg-red-50 p-3 rounded-lg text-xs text-red-800 font-bold text-center">Sa = 2 * S1 * S2 / (S1 + S2)</div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
                        <div className="absolute right-0 top-0 bg-orange-500 text-white px-3 py-1 rounded-bl-xl font-bold text-[10px]">CASE 2</div>
                        <div className="text-xs text-orange-500 font-bold mb-3 uppercase tracking-widest">When TIME is Same</div>
                        <p className="text-xs text-slate-500 mb-3 font-sans">Traveling for T hours at speed X, and another T hours at speed Y.</p>
                        <div className="text-2xl font-black text-slate-800 text-center my-4">(x + y) / 2</div>
                        <div className="bg-orange-50 p-3 rounded-lg text-xs text-orange-800 font-bold text-center">Sa = (S1 + S2) / 2</div>
                    </div>
                </div>
            </div>

            {/* Train Problems */}
            <div>
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                <Milestone size={20} className="text-orange-500"/> Formulas for Train Problems
              </h3>
              <div className="space-y-4 font-mono text-sm">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <strong className="text-orange-600 block mb-1">1. Crossing Each Other (Opposite Direction)</strong>
                    Lengths L₁ & L₂, Speeds X & Y. <br/>
                    <span className="text-lg font-black block mt-2 text-slate-800">Time = (L₁ + L₂) / (X + Y)</span>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <strong className="text-orange-600 block mb-1">2. Crossing Each Other (Same Direction)</strong>
                    Lengths L₁ & L₂, Speeds X & Y (where X &gt; Y). <br/>
                    <span className="text-lg font-black block mt-2 text-slate-800">Time = (L₁ + L₂) / (X - Y)</span>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <strong className="text-orange-600 block mb-1">3. Meeting Point Distance (Delayed Start)</strong>
                    Leave A & B at t₁ & t₂, Speeds X & Y. Distance from starting point where they meet: <br/>
                    <span className="text-lg font-black block mt-2 text-slate-800">D = [ (t₂ - t₁) &times; (X &times; Y) ] / (X - Y)</span>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <strong className="text-orange-600 block mb-1">4. Reaching Destinations after Crossing</strong>
                    Start at same time. After crossing, they take T₁ & T₂ to reach destinations. <br/>
                    <span className="text-lg font-black block mt-2 text-slate-800">Speed Ratio (S₁ / S₂) = &#8730;(T₂ / T₁)</span>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <strong className="text-orange-600 block mb-1">5. Stoppage Time per Hour</strong>
                    Avg Speed without stoppage = X. Avg Speed with stoppage = Y. <br/>
                    <span className="text-lg font-black block mt-2 text-slate-800">Rest Time/hr = (X - Y) / X</span>
                 </div>
              </div>
            </div>

            {/* BONUS: Extra Concepts Suggested by AI */}
            <div className="bg-slate-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10"><Ship size={160}/></div>
                <h4 className="font-black text-amber-400 uppercase tracking-widest text-lg mb-6 flex items-center gap-2 relative z-10">
                   <Lightbulb size={24}/> Bonus Training Concepts
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                   <div>
                       <strong className="text-orange-300 block mb-2 uppercase text-xs tracking-widest">A. Relative Speed (Thief & Police)</strong>
                       <p className="text-sm text-slate-300 mb-2">Crucial for catching problems.</p>
                       <ul className="font-mono text-sm bg-black/40 p-3 rounded-lg border border-slate-600 space-y-2">
                           <li><span className="text-slate-400">Same Dir:</span> RS = |S₁ - S₂|</li>
                           <li><span className="text-slate-400">Opposite Dir:</span> RS = S₁ + S₂</li>
                           <li><span className="text-slate-400">Catch Time:</span> Initial Gap / RS</li>
                       </ul>
                   </div>
                   
                   <div>
                       <strong className="text-orange-300 block mb-2 uppercase text-xs tracking-widest">B. Early / Late Shortcut</strong>
                       <p className="text-sm text-slate-300 mb-2">When a person changes speed and is early/late by some time &Delta;T.</p>
                       <div className="font-mono text-sm bg-black/40 p-3 rounded-lg border border-slate-600 text-emerald-300 font-bold text-center h-full flex items-center justify-center">
                           Distance = [ (S₁ &times; S₂) / |S₁ - S₂| ] &times; &Delta;T
                       </div>
                   </div>

                   <div className="md:col-span-2">
                       <strong className="text-orange-300 block mb-2 uppercase text-xs tracking-widest">C. Boats & Streams</strong>
                       <p className="text-sm text-slate-300 mb-2">Let Boat speed in still water = B, Stream speed = S.</p>
                       <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                           <div className="bg-black/40 p-3 rounded-lg border border-slate-600">
                               Downstream (D) = B + S <br/>
                               Upstream (U) = B - S
                           </div>
                           <div className="bg-black/40 p-3 rounded-lg border border-slate-600 text-emerald-300">
                               Boat (B) = (D + U) / 2 <br/>
                               Stream (S) = (D - U) / 2
                           </div>
                       </div>
                   </div>
                </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: EXAM PATTERNS --- */}
        {activeTab === 'patterns' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle icon={<Zap size={28}/>} title="Common Exam Archetypes" colorClass="text-orange-600" />
            
            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 text-orange-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-orange-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Mastering the Core Patterns</h3>
                <p className="text-sm font-medium mt-1">
                  Learn to spot these exact structures. Once you know the pattern, you can deploy the direct shortcut.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Pattern 1: Same Distance Average */}
                <QuestionCard 
                    qNum="Pattern 1" badge="Average Speed"
                    question={`Musk travels 600 km at 50 kmph. He then travels another 700 km at 50 kmph. What is the average speed?`}
                    solution={`Avg Speed = Total Distance / Total Time
Total Distance = 600 + 700 = 1300 km.

Time for 600 km = 600 / 50 = 12 hours.
Time for 700 km = 700 / 50 = 14 hours.
Total Time = 12 + 14 = 26 hours.

Avg Speed = 1300 / 26 = 50 kmph.

Shortcut: Since speed is 50 in both parts, the average speed is naturally 50 kmph.`}
                />

                <QuestionCard 
                    qNum="Pattern 1B" badge="Round Trip Avg"
                    question={`Suraj Ranjhas travels from his house to the park at a speed of 70 kmph. He suddenly returns home at a speed of 80 kmph. What is his average speed?`}
                    options={["A. 75 kmph", "B. 74.67 kmph", "C. 76 kmph", "D. 70 kmph"]}
                    ans="B"
                    solution={`Since the distance (House to Park, Park to House) is exactly the same, use the 'Same Distance' Average Speed shortcut.
S1 = 70, S2 = 80.

Sa = 2 * S1 * S2 / (S1 + S2)
= 2 * (70 * 80) / (70 + 80)
= 11200 / 150
= 74.67 kmph`}
                />

                {/* Pattern 2: Meeting Point */}
                <QuestionCard 
                    qNum="Pattern 2" badge="Relative Speed"
                    question={`The distance between Kanpur and Allahabad is 560 Km. A train starts from Kanpur at 8 a.m. and travels towards Allahabad at 120 km/hr. Another starts from Allahabad at 9 a.m towards Kanpur at 100 Km/hr. At what time do they meet?`}
                    solution={`Train A starts at 8 a.m. Train B starts at 9 a.m.
By 9 a.m., Train A has traveled for 1 hour.
Distance covered by A = 120 km.

Remaining distance at 9 a.m. = 560 - 120 = 440 km.
Now both are moving towards each other (Opposite direction).
Relative Speed = 120 + 100 = 220 km/hr.

Time to meet = Remaining Distance / Relative Speed
= 440 / 220 = 2 hours.

They meet 2 hours after 9 a.m.
Meeting time = 9 a.m. + 2 hours = 11 a.m.`}
                />

                {/* Pattern 3: Fractional Speed / Late */}
                <QuestionCard 
                    qNum="Pattern 3" badge="Fractional Speed"
                    question={`Walking 6/7th of his usual speed, a man is 12 minutes late. What is the usual time taken by him to cover the distance?`}
                    options={["A. 2 hrs", "B. 1 hr 30 min", "C. 1 hr 12 min", "D. 39 min"]}
                    ans="C"
                    solution={`New Speed = 6/7 of Usual Speed.
Speed and Time are inversely proportional.
Hence, New Time = 7/6 of Usual Time.

Difference in time = New Time - Usual Time = 12 mins.
(7/6)T - T = 12
(1/6)T = 12
T = 12 * 6 = 72 minutes.

72 minutes = 1 hour 12 minutes.`}
                />

                {/* Pattern 4: Walk & Ride */}
                <QuestionCard 
                    qNum="Pattern 4" badge="Walk / Ride"
                    question={`Walking barefoot Shanti takes 6 hours to a certain place and coming back. She would have taken 2 hours less by riding both ways. What will be the time required to walk both ways?`}
                    options={["A. 6 hrs", "B. 1 hr", "C. 3 hrs", "D. 8 hrs"]}
                    ans="D"
                    solution={`Time(Walk) + Time(Ride) = 6 hours.
Riding both ways takes 2 hours less: 6 - 2 = 4 hours.
Time(Ride) + Time(Ride) = 4
2 * Ride = 4 ➔ Ride = 2 hours.

Substitute Ride time back into first equation:
Time(Walk) + 2 = 6
Time(Walk) = 4 hours (One way).

Time to walk both ways:
4 + 4 = 8 hours.`}
                />

                {/* Pattern 5: Circular Track */}
                <QuestionCard 
                    qNum="Pattern 5" badge="Circular Track"
                    question={`Three persons Ram, Rahul and Rajat run on a circular track of length 600m. They run at speeds of 2 m/s, 4 m/s and 5 m/s respectively. How long will they take to meet at the starting point for the first time?`}
                    solution={`Find the time taken by each to complete one full circle (T = D/S).
Ram (T1) = 600 / 2 = 300 seconds.
Rahul (T2) = 600 / 4 = 150 seconds.
Rajat (T3) = 600 / 5 = 120 seconds.

Time to meet at starting point = LCM of individual times.
LCM(300, 150, 120)

Multiples of 300: 300, 600...
600 is divisible by 150 (600/150 = 4) and 120 (600/120 = 5).
LCM = 600 seconds.`}
                />

            </div>
          </div>
        )}

        {/* --- TAB 4: MCQ VAULT --- */}
        {activeTab === 'mcq' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<BrainCircuit size={28}/>} 
              title="MCQ Solved Vault" 
              colorClass="text-red-600" 
            />
            
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-800 flex gap-4 items-center shadow-sm">
              <Target size={40} className="shrink-0 text-red-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Standard Exam MCQs</h3>
                <p className="text-sm font-medium mt-1">
                  These problems require applying the core D-S-T formulas with proper unit conversions.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Q1" badge="Basic DST"
                    question={`Yamini runs across a 100-meter road to save herself from a dog. She takes 25 seconds to cross. What is her speed?`}
                    options={["A. 2 m/s", "B. 3.5 m/s", "C. 5.1 m/s", "D. 4 m/s"]}
                    ans="D"
                    solution={`Speed = Distance / Time
Distance = 100 meters
Time = 25 seconds

Speed = 100 / 25
= 4 meters/second.`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Relative Walk"
                    question={`X and Y work together. X takes 30 mins and Y takes 20 mins to walk from apartment to office. X starts at 10:00 AM, Y at 10:05 AM. When will they meet?`}
                    options={["A. 10:40 AM", "B. 10:15 AM", "C. 10:00 AM", "D. 10:05 AM"]}
                    ans="B"
                    solution={`Let total distance = LCM(30, 20) = 60 units.
Speed of X = 60/30 = 2 units/min.
Speed of Y = 60/20 = 3 units/min.

X walks alone for 5 mins (10:00 to 10:05).
Distance covered by X in 5 mins = 5 * 2 = 10 units.

Now Y starts. They are moving in same direction.
Relative Speed = Speed Y - Speed X = 3 - 2 = 1 unit/min.

Time for Y to catch X = Gap / Relative Speed
Time = 10 units / 1 unit/min = 10 minutes.

Y catches X 10 minutes after 10:05 AM.
Meeting Time = 10:15 AM.`}
                />

                <QuestionCard 
                    qNum="Q3" badge="Equation Mod"
                    question={`A freight train takes 5 hours to travel distance d. If speed is reduced by 10 km/h, it takes 6 hours to cover the same distance. Find original speed and distance.`}
                    options={["A. 60km/h, 300km", "B. 23km/h, 1km", "C. 45km/h, 30km", "D. 18km/h, 1km"]}
                    ans="A"
                    solution={`Let original speed = v km/h.
Distance d = v * 5.  --- (Eq 1)

Reduced speed = (v - 10) km/h.
Distance d = (v - 10) * 6. --- (Eq 2)

Equate the distances:
5v = 6(v - 10)
5v = 6v - 60
v = 60 km/h.

Distance d = 60 * 5 = 300 km.`}
                />

                <QuestionCard 
                    qNum="Q4" badge="Basic DST"
                    question={`A car covers a distance of 150 km in 3 hours. What is the speed of the car?`}
                    solution={`Speed = Distance / Time
Distance = 150 km.
Time = 3 hours.

Speed = 150 / 3
= 50 km/h.`}
                />

                <QuestionCard 
                    qNum="Q5" badge="Basic DST"
                    question={`A train travels at a speed of 80 km/h for 4 hours. What distance will it cover?`}
                    solution={`Distance = Speed * Time
Speed = 80 km/h.
Time = 4 hours.

Distance = 80 * 4
= 320 km.`}
                />

                <QuestionCard 
                    qNum="Q6" badge="Basic DST"
                    question={`A cyclist travels at a speed of 20 km/h. How much time will he take to cover 60 km?`}
                    solution={`Time = Distance / Speed
Distance = 60 km.
Speed = 20 km/h.

Time = 60 / 20
= 3 hours.`}
                />

            </div>
          </div>
        )}

        {/* --- TAB 5: PRACTICE VAULT --- */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<Target size={28}/>} 
              title="Practice Vault" 
              colorClass="text-orange-600" 
            />
            
            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 text-orange-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-orange-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Ultimate Exam Drill</h3>
                <p className="text-sm font-medium mt-1">
                  Master the Bonus AI concepts along with 30 real-world exam questions spanning relative speed, trains, and boats.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* Custom 1: Boats and Streams */}
                <QuestionCard 
                    qNum="Bonus 1" badge="Boats & Streams"
                    question="A boat can travel 20 km downstream in 2 hours and 10 km upstream in 2 hours. Find the speed of the boat in still water and the speed of the stream."
                    solution={`Calculate Downstream speed (D):
D = Distance / Time = 20 / 2 = 10 km/hr.

Calculate Upstream speed (U):
U = Distance / Time = 10 / 2 = 5 km/hr.

Speed of Boat (B) = (D + U) / 2
B = (10 + 5) / 2 = 15 / 2 = 7.5 km/hr.

Speed of Stream (S) = (D - U) / 2
S = (10 - 5) / 2 = 5 / 2 = 2.5 km/hr.`}
                />

                {/* Custom 2: Thief and Police */}
                <QuestionCard 
                    qNum="Bonus 2" badge="Relative Speed"
                    question="A thief is spotted by a policeman from a distance of 400 meters. When the policeman starts the chase, the thief also starts running. If the speed of the thief is 10 km/hr and that of the policeman is 15 km/hr, how far will the thief have run before he is overtaken?"
                    solution={`Initial Gap = 400 meters = 0.4 km.
Both are running in the SAME direction.
Relative Speed (RS) = 15 - 10 = 5 km/hr.

Time to catch = Gap / RS
Time = 0.4 / 5 = 0.08 hours.

Distance thief ran in this time:
D = Speed of thief * Time
D = 10 km/hr * 0.08 hr
D = 0.8 km = 800 meters.`}
                />

                {/* Custom 3: Early/Late Shortcut */}
                <QuestionCard 
                    qNum="Bonus 3" badge="Early / Late Formula"
                    question="If a boy walks from his house to school at 4 km/hr, he reaches 10 minutes early. If he walks at 3 km/hr, he reaches 10 minutes late. Find the distance from his house to the school."
                    solution={`Use the shortcut formula:
Distance = [ (S1 * S2) / |S1 - S2| ] * ΔT

S1 = 4 km/hr, S2 = 3 km/hr.
Difference in time (ΔT): From 10 min early to 10 min late is a gap of 20 minutes.
Convert to hours: ΔT = 20/60 = 1/3 hour.

Distance = [ (4 * 3) / (4 - 3) ] * (1/3)
= [ 12 / 1 ] * (1/3)
= 12 * 1/3
= 4 km.`}
                />

                <QuestionCard 
                    qNum="Q1" badge="Relative Speed"
                    question="A Van of robbers is noticed by a Cop from a distance of 200 m. The robbers leave the van and start running and the cop chases them. The robbers and the cop run at the rate of 10 km and 11 km per hour respectively. After 6 minutes what will be the distance between them?"
                    options={["A. 50 meter", "B. 100 meter", "C. 110 meter", "D. None of the above"]}
                    ans="B"
                    solution={`Relative speed of cop with respect to robbers = (11 - 10) = 1 km/hr.

Distance covered in 6 min (relative to robbers):
Distance = Speed * Time 
= 1 * (6 / 60) hr
= 1/10 km = 100 meters.

The distance between the Cop and Robbers after 6 min = Initial Gap - Distance Closed
= 200 - 100 = 100 meters.`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Equations"
                    question="Aakash travels some part of his journey on foot at 4 km/hr and some part on cycle at 9 km/hr to his office covering a total distance of 66 km in 9 hours. What is the distance travelled on foot?"
                    options={["A. 16.25 km", "B. 25 km", "C. 12 km", "D. 57 km"]}
                    ans="C"
                    solution={`Let the time travelled on foot = x hours.
Time travelled on cycle = (9 - x) hours.

Total distance = Distance on foot + Distance on cycle
4x + 9(9 - x) = 66
4x + 81 - 9x = 66
-5x = 66 - 81
-5x = -15
x = 3 hours.

Distance travelled on foot = Speed * Time
= 4 * 3 = 12 km.`}
                />

                <QuestionCard 
                    qNum="Q3" badge="Geometry"
                    question="An Airbus A350 flying north at 500 kmph passes over a city at 12 noon. A Spice jet Airbus flying east at the same altitude passes over the same city at 12:30 PM at 400 kmph. How far apart are the two planes at 2 PM to the nearest 100 km?"
                    options={["A. 600 km", "B. 1000 km", "C. 1100 km", "D. 1200 km"]}
                    ans="D"
                    solution={`Airbus A350 (North):
Flies from 12:00 to 2:00 PM (2 hours).
Distance = 500 * 2 = 1000 km.

Spice Jet (East):
Flies from 12:30 PM to 2:00 PM (1.5 hours).
Distance = 400 * 1.5 = 600 km.

They are flying at right angles (North and East).
Shortest distance = √(1000² + 600²)
= √(1000000 + 360000)
= √1360000 ≈ 1166.19 km.

Rounding to the nearest 100 km gives 1200 km.`}
                />

                <QuestionCard 
                    qNum="Q4" badge="Time Gap"
                    question="Two cyclists start together to travel to a certain destination, one at the rate of 4 kmph and the other at the rate of 5 kmph. Find the distance if the first cyclist arrives half an hour after the second cyclist."
                    options={["A. 2 km", "B. 10 m", "C. 10000 m", "D. 1000 m"]}
                    ans="C"
                    solution={`Let the distance be D km.
Time taken by first cyclist = D / 4 hours.
Time taken by second cyclist = D / 5 hours.

Difference in time = 1/2 hour (30 minutes).
D/4 - D/5 = 1/2
(5D - 4D) / 20 = 1/2
D / 20 = 1/2
D = 10 km.

Convert to meters: 10 km = 10,000 m.`}
                />

                <QuestionCard 
                    qNum="Q5" badge="Boats/Streams"
                    question="The speed of a motorboat in still water is 20 km/h. It travels 150 km downstream and then returns to the starting point. If the round trip takes a total of 16 hours, what is the speed (in km/h) of the flow of the river?"
                    options={["A. 5 km/h", "B. 8 km/h", "C. 6 km/h", "D. 2 km/h"]}
                    ans="A"
                    solution={`Let the speed of the river = R.
Downstream speed = (20 + R)
Upstream speed = (20 - R)

Total time = Time downstream + Time upstream
150/(20 + R) + 150/(20 - R) = 16

Divide by 2:
75/(20 + R) + 75/(20 - R) = 8
Testing options: Try R = 5.
75/25 + 75/15 = 3 + 5 = 8.
Matches perfectly!

River flow = 5 km/h.`}
                />

                <QuestionCard 
                    qNum="Q6" badge="Avg Speed"
                    question="Simran walks to a town at 3.5 kmph, rests there for 45 minutes and rides back at 7.5 kmph. If the total time spent is 6 hrs 37 min, find the distance to the town."
                    options={["A. 14 km", "B. 7 km", "C. 17 km", "D. 4 km"]}
                    ans="A"
                    solution={`Total time = 6 hr 37 min.
Rest time = 45 min.
Actual travel time = 6 hr 37 min - 45 min = 5 hr 52 min.
Convert to hours: 5 + 52/60 = 5 + 13/15 = 88/15 hours.

Average speed for the round trip (same distance):
Sa = (2 * S1 * S2) / (S1 + S2)
= (2 * 3.5 * 7.5) / (3.5 + 7.5)
= 52.5 / 11 km/hr.

Total Distance (To and Fro) = Speed * Time
= (52.5 / 11) * (88 / 15)
= 52.5 * 8 / 15 = 28 km.

Distance to town (One way) = 28 / 2 = 14 km.`}
                />

                <QuestionCard 
                    qNum="Q7" badge="Stoppages"
                    question="A bus travels at 54 km/h while moving, but after accounting for stopping time, it averages 45 km/h. How many minutes does the bus stop for each hour?"
                    options={["A. 1 min", "B. 10 min", "C. 3 min", "D. 9 min"]}
                    ans="B"
                    solution={`Use the direct shortcut:
Rest Time per hour = (Difference in speed) / (Speed without stoppage)
= (54 - 45) / 54
= 9 / 54
= 1 / 6 hours.

Convert to minutes:
(1/6) * 60 = 10 minutes.`}
                />

                <QuestionCard 
                    qNum="Q8" badge="Boats/Streams"
                    question="Jack owns a yacht which can cover a distance in 1 hour downstream, while it returns in 2 hours upstream. If the speed of the stream is 4 km/h, what will be yacht's speed in still water?"
                    options={["A. 30 km/h", "B. 12 km/h", "C. 16 km/h", "D. 40 km/h"]}
                    ans="B"
                    solution={`Let yacht's speed in still water = S.
Stream speed = 4 km/h.

Downstream distance = 1 * (S + 4)
Upstream distance = 2 * (S - 4)

Since distance is the same:
S + 4 = 2(S - 4)
S + 4 = 2S - 8
S = 12 km/h.`}
                />

                <QuestionCard 
                    qNum="Q9" badge="Equations"
                    question="To get to a business meeting, John drove m miles in h hours, and arrived 1/2 hour early. At what speed should he have driven to arrive on exact time?"
                    options={["A. m/2h", "B. 2m/(2h+1)", "C. 2m/(2h-1)", "D. 2m-h/2h"]}
                    ans="B"
                    solution={`John covered m miles in h hours.
He arrived 1/2 hour early.
This means the scheduled time to reach exactly on time was:
T = h + 1/2 = (2h + 1) / 2 hours.

Required Speed to arrive on time:
Speed = Distance / Scheduled Time
= m / [ (2h + 1) / 2 ]
= 2m / (2h + 1)`}
                />

                <QuestionCard 
                    qNum="Q10" badge="Meeting Point"
                    question="Romita and Supriya start to ride from Mewar to Chittorgarh (80 km). Romita travels 6 kmph slower than Supriya. Supriya reaches Chittorgarh, turns back and meets Romita 20km from Chittorgarh. Find Romita's speed?"
                    options={["A. 2.1 km/h", "B. 9 km/h", "C. 6 km/h", "D. 15 km/h"]}
                    ans="B"
                    solution={`Let Romita's speed = r.
Supriya's speed = r + 6.

Distance covered by Romita = 80 - 20 = 60 km.
Distance covered by Supriya = 80 + 20 = 100 km.
Since they started at the same time, time taken is equal:
60 / r = 100 / (r + 6)

Cross-multiply:
60(r + 6) = 100r
60r + 360 = 100r
40r = 360
r = 9 km/h.`}
                />

                <QuestionCard 
                    qNum="Q11" badge="Trains"
                    question="Japan's express train travelling at 72 km/h crosses a newly built platform in 30 seconds. Determine the length of the platform in m? (Assume train acts as a point object or platform length includes train)."
                    options={["A. 600 m", "B. 360 m", "C. 420 m", "D. None"]}
                    ans="A"
                    solution={`Speed of train = 72 km/h.
Convert to m/s: 72 * (5/18) = 20 m/s.

Distance covered = Speed * Time
= 20 m/s * 30 s
= 600 meters.

(Assuming negligible train length or total distance covered is the platform's length).`}
                />

                <QuestionCard 
                    qNum="Q12" badge="Races"
                    question="Aria runs 25% faster than Briana. Briana is allowed a lead of 7 meters to finish the race simultaneously. How long is the race (in meters)?"
                    options={["A. 10", "B. 20", "C. 35", "D. 45"]}
                    ans="C"
                    solution={`Aria's speed = 125% of Briana's speed.
Ratio of speeds (Aria : Briana) = 125 : 100 = 5 : 4.

For every 5m Aria runs, Briana runs 4m.
Aria gains 1m on Briana for every 5m of the race.

To cover a lead (start) of 7 meters:
Length of race = 7 * 5 = 35 meters.`}
                />

                <QuestionCard 
                    qNum="Q13" badge="Equations"
                    question="Kane covered a distance of 340 km between two cities taking a total of 5 hours. Part of the distance was at 60 km/h and the remaining at 80 km/h. How many hours did he travel at 60 km/h?"
                    options={["A. 2 hr 30 min", "B. 3 hours", "C. 2 hours", "D. 45 minutes"]}
                    ans="B"
                    solution={`Let time travelled at 60 km/h = x hours.
Time at 80 km/h = (5 - x) hours.

Total Distance = D1 + D2
60x + 80(5 - x) = 340
60x + 400 - 80x = 340
-20x = 340 - 400
-20x = -60
x = 3 hours.`}
                />

                <QuestionCard 
                    qNum="Q14" badge="Speed"
                    question="Raghuveer fired a gun at a distance of 6.64 km away from Ram. Ram hears the sound 20 seconds later. What is the speed of the sound?"
                    options={["A. 664 m/s", "B. 634 m/s", "C. 332 m/s", "D. 432 m/s"]}
                    ans="C"
                    solution={`Distance = 6.64 km = 6640 meters.
Time = 20 seconds.

Speed of sound = Distance / Time
= 6640 / 20
= 332 m/s.`}
                />

                <QuestionCard 
                    qNum="Q15" badge="Ratios"
                    question="The ratio between the speeds of two buses is 11:9. If the second bus runs 270 km in 15 hours, then the speed of the first bus is?"
                    options={["A. 23 km/h", "B. 11 km/h", "C. 2 km/h", "D. 22 km/h"]}
                    ans="D"
                    solution={`Speed of 2nd bus = Distance / Time
= 270 / 15 = 18 km/h.

Ratio of speeds = 11:9.
Let speeds be 11x and 9x.
9x = 18 ➔ x = 2.

Speed of 1st bus = 11x = 11(2) = 22 km/h.`}
                />

                <QuestionCard 
                    qNum="Q16" badge="Poles"
                    question="Rajan notices he can count 24 lamp posts in one minute while travelling in a metro. At what speed is the metro travelling if the posts are 50 meters apart?"
                    options={["A. 75 km/h", "B. 77 km/h", "C. 69 km/h", "D. 70 km/h"]}
                    ans="C"
                    solution={`Number of lamp posts = 24.
Number of gaps between them = 24 - 1 = 23 gaps.

Total distance = 23 * 50 = 1150 meters.
Time = 1 minute = 60 seconds.

Speed = 1150 / 60 m/s.
Convert to km/h:
(1150 / 60) * (18 / 5)
= 23 * 3 = 69 km/h.`}
                />

                <QuestionCard 
                    qNum="Q17" badge="Ratios"
                    question="A bus covers 660 metres in 1 minute, whereas a car covers 44 kms in 50 minutes. The ratio of their speeds is:"
                    options={["A. 3:4", "B. 4:3", "C. 5:4", "D. 3:5"]}
                    ans="A"
                    solution={`Speed of Bus = 660 m / 60 s = 11 m/s.

Speed of Car = 44 km / 50 min
Convert to m/s:
Distance = 44,000 m
Time = 50 * 60 = 3000 s
Speed = 44000 / 3000 = 44/3 m/s.

Ratio (Bus : Car) = 11 : (44/3)
Multiply by 3:
= 33 : 44
= 3 : 4.`}
                />

                <QuestionCard 
                    qNum="Q18" badge="Quadratic"
                    question="A rickshaw travels 715 km. If the speed had been 10 km/hr more, it would have taken 2 hours less. What is the initial speed?"
                    options={["A. 45 km/h", "B. 50 km/h", "C. 65 km/h", "D. 55 km/h"]}
                    ans="D"
                    solution={`Let original speed = x.
Time taken = 715 / x.
New speed = x + 10.
New time = 715 / (x + 10).

Equation:
715/x - 715/(x+10) = 2
715(x + 10 - x) / [x(x+10)] = 2
7150 = 2x(x + 10)
x(x + 10) = 3575

Check options:
55 * 65 = 3575.
So, initial speed = 55 km/h.`}
                />

                <QuestionCard 
                    qNum="Q19" badge="Relative Speed"
                    question="A and B begin from a point in North and South directions. Velocity of A is 80 km/hr and B is 65 km/hr. What is the separation between them after 12 minutes?"
                    options={["A. 14.5 km", "B. 29 km", "C. 36.2 km", "D. 39 km"]}
                    ans="B"
                    solution={`Since they move in opposite directions (North and South), their relative speed is the sum:
RS = 80 + 65 = 145 km/hr.

Time = 12 minutes = 12 / 60 hours = 1/5 hour.

Separation Distance = RS * Time
= 145 * (1/5)
= 29 km.`}
                />

                <QuestionCard 
                    qNum="Q20" badge="Ratios"
                    question="The ratio of speeds of Arash and Bunty is 2:3. Arash takes 10 mins more than Bunty to reach the destination. If Arash walked at double speed, he would cover it in:"
                    options={["A. 30 min", "B. 20 min", "C. 15 min", "D. 40 min"]}
                    ans="C"
                    solution={`Speed ratio (Arash : Bunty) = 2:3
Time ratio is inversely proportional = 3:2

Let times be 3x and 2x.
Difference = 3x - 2x = x
Given difference = 10 mins ➔ x = 10.

Arash's normal time = 3x = 30 mins.
If Arash doubles his speed, his time is halved:
New time = 30 / 2 = 15 mins.`}
                />

                <QuestionCard 
                    qNum="Q21" badge="Distance"
                    question="Raghuveer is pacing at a speed of 6 km/hr and crosses a bridge in 18 mins. What is the length of the bridge (in meters)?"
                    options={["A. 1800 m", "B. 1500 m", "C. 1200 m", "D. 1900 m"]}
                    ans="A"
                    solution={`Speed = 6 km/hr
Convert to m/s: 6 * (5/18) = 5/3 m/s.

Time = 18 minutes
Convert to seconds: 18 * 60 = 1080 s.

Distance (Bridge Length) = Speed * Time
= (5/3) * 1080
= 5 * 360 = 1800 meters.`}
                />

                <QuestionCard 
                    qNum="Q22" badge="Travel"
                    question="Sarita left for Jamnagar at 6 AM. For 2 hours, she travelled at 100 km/hr. After that, she declined her speed to 60 km/hr. Determine the time she reaches Jamnagar if distance is 680 km?"
                    options={["A. 11:30 am", "B. 11:55 am", "C. 4:00 pm", "D. 12:30 am"]}
                    ans="C"
                    solution={`Distance covered in first 2 hours = 100 * 2 = 200 km.
Remaining distance = 680 - 200 = 480 km.

Time to cover remaining distance at 60 km/h:
480 / 60 = 8 hours.

Total travel time = 2 + 8 = 10 hours.
Start time = 6:00 AM.
Reaching time = 6:00 AM + 10 hours = 4:00 PM.`}
                />

                <QuestionCard 
                    qNum="Q23" badge="Circular"
                    question="Saroj runs around a circular field at 6 rounds/hour. Arita walks at 1 round/hour. If they start in same direction from same point at 7:30 AM, when will they first cross each other?"
                    options={["A. 8:15 am", "B. 7:50 am", "C. 8:00 am", "D. 7:42 am"]}
                    ans="D"
                    solution={`Same direction ➔ Relative speed = 6 - 1 = 5 rounds/hour.
This means Saroj gains 5 laps over Arita every hour.

Time to gain 1 lap (meet for the first time) = 1/5 hour.
Convert to minutes: (1/5) * 60 = 12 minutes.

Start time = 7:30 AM.
Meeting time = 7:30 + 12 mins = 7:42 AM.`}
                />

                <QuestionCard 
                    qNum="Q24" badge="Equations"
                    question="Ramu travels 80km in 12 hours. Part of the journey was on bus at 6 km/hr and the rest on rickshaw at 12 km/hr. What is the distance travelled on bus?"
                    options={["A. 22 km", "B. 85 km", "C. 64 km", "D. 96 km"]}
                    ans="C"
                    solution={`Let distance on bus = x km.
Distance on rickshaw = (80 - x) km.

Total time = 12 hours.
(x / 6) + (80 - x) / 12 = 12

Multiply by 12:
2x + 80 - x = 144
x + 80 = 144
x = 64 km.`}
                />

                <QuestionCard 
                    qNum="Q25" badge="Speed Change"
                    question="An electric car travels at 40 km/hr. How long will it take to cover 330 km if the speed is increased by 50%?"
                    options={["A. 5h 30m", "B. 6h 20m", "C. 5h 29m", "D. 4h 12m"]}
                    ans="A"
                    solution={`Original speed = 40 km/h.
Increased by 50% = 40 + 20 = 60 km/h.

Distance = 330 km.
Time = 330 / 60
= 33/6 = 5.5 hours.

5.5 hours = 5 hours 30 minutes.`}
                />

                <QuestionCard 
                    qNum="Q26" badge="Avg Speed"
                    question="Seema travels 100km at 50 km/h, 800km at 40 km/h, 600km at 80 km/h, and 500km at 400 km/h. Find average speed for the entire journey?"
                    options={["A. 65.04 km/h", "B. 60 km/h", "C. 62.6 km/h", "D. 61.2 km/h"]}
                    ans="A"
                    solution={`Avg Speed = Total Distance / Total Time
Total Distance = 100 + 800 + 600 + 500 = 2000 km.

Total Time = (100/50) + (800/40) + (600/80) + (500/400)
= 2 + 20 + 7.5 + 1.25
= 30.75 hours.

Avg Speed = 2000 / 30.75 ≈ 65.04 km/h.`}
                />

                <QuestionCard 
                    qNum="Q27" badge="Ratios"
                    question="An electric bike goes 50 km/h unmodified and 60 km/h modified. Modified, it covers a distance in 6h. How much time will it take unmodified?"
                    options={["A. 8.2h", "B. 6.5h", "C. 7.2h", "D. 2.5h"]}
                    ans="C"
                    solution={`Distance = Speed (modified) * Time (modified)
D = 60 * 6 = 360 km.

Time (unmodified) = Distance / Speed (unmodified)
T = 360 / 50
T = 7.2 hours.`}
                />

                <QuestionCard 
                    qNum="Q28" badge="Progression"
                    question="After every 1 hour a bike increases speed by 2km. If distance in first hour was 45 km, total distance in 12 hours?"
                    options={["A. 600 km", "B. 643 km", "C. 633 km", "D. 672 km"]}
                    ans="D"
                    solution={`Distance per hour forms an Arithmetic Progression: 45, 47, 49...
First term (a) = 45.
Common diff (d) = 2.
Terms (n) = 12.

Sum = (n/2) * [2a + (n-1)d]
= (12/2) * [2(45) + (11)(2)]
= 6 * [90 + 22]
= 6 * 112 = 672 km.`}
                />

                <QuestionCard 
                    qNum="Q29" badge="Boats"
                    question="A boat has speed 65 km/h, river is 5 km/h. Covered 140km downstream. How much distance upstream in same time?"
                    options={["A. 120", "B. 180", "C. 60", "D. 100"]}
                    ans="A"
                    solution={`Downstream speed = 65 + 5 = 70 km/h.
Time taken = 140 / 70 = 2 hours.

Upstream speed = 65 - 5 = 60 km/h.
Distance upstream in 2 hours:
D = 60 * 2 = 120 km.`}
                />

                <QuestionCard 
                    qNum="Q30" badge="Relative Speed"
                    question="Hirendra & wife are 81 km apart and move towards each other. Hirendra goes 6 km/h, wife 3 km/h. How far will his wife commute when they meet?"
                    options={["A. 27 km", "B. 36 km", "C. 45 km", "D. 55 km"]}
                    ans="A"
                    solution={`Moving towards each other (Opposite direction).
Relative speed = 6 + 3 = 9 km/h.

Time to meet = Distance / Relative Speed
T = 81 / 9 = 9 hours.

Distance travelled by wife in 9 hours:
D = 3 * 9 = 27 km.`}
                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}