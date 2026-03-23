import React, { useState } from 'react';

// Reusable Multi-Language CodeBlock component
const CodeBlock = ({ solutions }) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lang, setLang] = useState('java');

  const handleCopy = () => {
    navigator.clipboard.writeText(solutions[lang].trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax highlighter supporting Java, Python, C++, and C with proper comment tracking
  const highlightCode = (text) => {
    const parts = text.split(/(\/\/.*|#.*|\".*?\"|'.*?'|\b(?:public|private|static|void|int|double|float|boolean|char|return|if|else|elif|while|for|class|String|Math|System|out|println|print|printf|import|java|util|Scanner|new|def|in|map|split|input|std|cout|cin|endl|using|namespace|abs|min|max)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
    
    return parts.map((part, idx) => {
      // Handle Python comments (#) and Java/C/C++ comments (//)
      if (part.startsWith('//') || (part.startsWith('#') && !part.startsWith('#include'))) return <span key={idx} className="tcs-syn-comment">{part}</span>;
      if (part.startsWith('#include')) return <span key={idx} className="tcs-syn-keyword">{part}</span>;
      if (part.startsWith('"') || part.startsWith("'")) return <span key={idx} className="tcs-syn-string">{part}</span>;
      if (['public','private','static','void','return','if','else','elif','while','for','class','import','new','def','in','using','namespace'].includes(part)) return <span key={idx} className="tcs-syn-keyword">{part}</span>;
      if (['int','double','float','boolean','char','String','Scanner','Math','System','map','split','input','std','cout','cin','endl'].includes(part)) return <span key={idx} className="tcs-syn-type">{part}</span>;
      if (!isNaN(parseFloat(part)) && isFinite(part)) return <span key={idx} className="tcs-syn-number">{part}</span>;
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="tcs-solution-wrapper">
      <button 
        className="tcs-toggle-btn" 
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide Solution 🙈' : 'View Optimal Solution 👁️'}
      </button>
      
      {isVisible && (
        <div className="tcs-editor-container tcs-fade-in">
          <div className="tcs-lang-tabs">
            <button className={`tcs-lang-btn ${lang === 'java' ? 'active' : ''}`} onClick={() => setLang('java')}>Java</button>
            <button className={`tcs-lang-btn ${lang === 'python' ? 'active' : ''}`} onClick={() => setLang('python')}>Python 3</button>
            <button className={`tcs-lang-btn ${lang === 'cpp' ? 'active' : ''}`} onClick={() => setLang('cpp')}>C++</button>
            <button className={`tcs-lang-btn ${lang === 'c' ? 'active' : ''}`} onClick={() => setLang('c')}>C</button>
          </div>
          <div className="tcs-editor-header">
            <span className="tcs-editor-env">TCS NQT Environment IDE</span>
            <button className="tcs-copy-btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="tcs-editor-content">
            <code>{highlightCode(solutions[lang].trim())}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default function TCSNQTPracticeNotebook() {
  return (
    <div className="tcs-notebook-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');

        .tcs-notebook-wrapper {
            --bg-desk: #6b705c;
            --paper-color: #fdf8e4;
            --margin-line: rgba(255, 115, 115, 0.6);
            --ink-black: #212529;
            --ink-blue: #00308F;
            --ink-red: #B22222;
            --ink-purple: #4A0E4E;
            --ink-green: #004d00;

            background-color: var(--bg-desk);
            background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png');
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            font-family: 'Patrick Hand', cursive;
            color: var(--ink-black);
            min-height: 100vh;
            box-sizing: border-box;
        }

        .tcs-notebook-wrapper * {
            box-sizing: border-box;
        }

        .tcs-notebook {
            background-color: var(--paper-color);
            width: 100%;
            max-width: 900px;
            box-shadow: 5px 15px 35px rgba(0,0,0,0.4);
            border-radius: 4px 15px 15px 4px;
            position: relative;
            padding: 50px 60px 80px 100px;
            background-image: repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.04) 31px, rgba(0,0,0,0.04) 32px);
            line-height: 32px;
            overflow: hidden;
            height: fit-content;
        }

        .tcs-notebook::before { content: ''; position: absolute; top: 0; bottom: 0; left: 70px; width: 2px; background-color: var(--margin-line); z-index: 1; }
        .tcs-notebook::after { content: ''; position: absolute; top: 0; bottom: 0; left: 76px; width: 2px; background-color: var(--margin-line); z-index: 1; }
        .tcs-content { position: relative; z-index: 2; }

        .tcs-notebook h1 { font-family: 'Kalam', cursive; font-size: 3rem; color: var(--ink-blue); text-align: center; margin-top: 0; margin-bottom: 10px; text-decoration: underline wavy var(--ink-red); line-height: 1.2; }
        .tcs-subtitle { text-align: center; font-size: 1.4rem; color: var(--ink-black); margin-bottom: 50px; font-weight: bold; }
        .tcs-notebook h2 { font-family: 'Caveat', cursive; font-size: 2.5rem; color: var(--ink-red); border-bottom: 2px dashed var(--ink-red); padding-bottom: 5px; margin-top: 50px; margin-bottom: 20px; line-height: 1.1; }
        .tcs-notebook h3 { font-family: 'Kalam', cursive; font-size: 1.8rem; color: var(--ink-blue); margin-top: 40px; margin-bottom: 10px; line-height: 1.2; }
        .tcs-notebook p { font-size: 1.35rem; margin: 5px 0; word-wrap: break-word; }
        .tcs-notebook ul { margin-top: 0; margin-bottom: 10px; padding-left: 25px; list-style-type: square; font-size: 1.35rem; }
        .tcs-notebook li { margin-bottom: 5px; }

        .tcs-label-statement, .tcs-label-math, .tcs-label-test { font-weight: bold; font-family: 'Caveat', cursive; font-size: 1.6rem; }
        .tcs-label-statement { color: var(--ink-black); }
        .tcs-label-math { color: var(--ink-purple); }
        .tcs-label-test { color: var(--ink-red); }
        
        .tcs-code-snippet { background-color: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', Courier, monospace; font-size: 1.1rem; color: var(--ink-green); font-weight: bold; }
        .tcs-test-case-box { background-color: rgba(255, 255, 255, 0.5); border: 1px solid rgba(0,0,0,0.1); padding: 10px 15px; border-radius: 8px; margin-top: 5px; box-shadow: 2px 2px 5px rgba(0,0,0,0.05); }
        .tcs-highlight-in { color: #d35400; font-weight: bold; }
        .tcs-highlight-out { color: #27ae60; font-weight: bold; }

        /* Multi-Language Editor Styles */
        .tcs-editor-container { background: #1e1e1e; border-radius: 8px; margin-top: 5px; margin-bottom: 25px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-family: 'Courier New', monospace; line-height: 1.4; }
        
        .tcs-lang-tabs { display: flex; gap: 4px; background: #2d2d2d; padding: 8px 15px 0 15px; border-bottom: 1px solid #444; }
        .tcs-lang-btn { background: #3a3a3a; border: none; color: #999; padding: 6px 14px; border-radius: 6px 6px 0 0; cursor: pointer; font-family: sans-serif; font-weight: bold; font-size: 0.8rem; transition: all 0.2s; }
        .tcs-lang-btn.active { background: #1e1e1e; color: #4ec9b0; border-bottom: 2px solid #4ec9b0; }
        .tcs-lang-btn:hover:not(.active) { color: #ccc; background: #444; }
        
        .tcs-editor-header { background: #1e1e1e; padding: 8px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; }
        .tcs-editor-env { color: #6a9955; font-size: 0.8rem; font-weight: bold; font-family: sans-serif; font-style: italic; }
        .tcs-copy-btn { background: #4a4a4a; border: none; color: white; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; transition: background 0.2s; font-family: sans-serif; }
        .tcs-copy-btn:hover { background: #5a5a5a; }
        
        .tcs-editor-content { padding: 15px; margin: 0; color: #d4d4d4; font-size: 1.05rem; overflow-x: auto; white-space: pre; tab-size: 4; }
        .tcs-syn-comment { color: #6a9955; font-style: italic; }
        .tcs-syn-keyword { color: #c586c0; font-weight: bold; }
        .tcs-syn-string { color: #ce9178; }
        .tcs-syn-number { color: #b5cea8; }
        .tcs-syn-type { color: #4ec9b0; }

        /* Toggle Button */
        .tcs-solution-wrapper { margin-top: 15px; }
        .tcs-toggle-btn { background-color: transparent; color: var(--ink-blue); border: 2px dashed var(--ink-blue); padding: 8px 16px; border-radius: 8px; font-family: 'Kalam', cursive; font-size: 1.2rem; font-weight: bold; cursor: pointer; margin-bottom: 5px; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px; }
        .tcs-toggle-btn:hover { background-color: rgba(0, 48, 143, 0.05); transform: translateY(-2px); box-shadow: 2px 4px 8px rgba(0,0,0,0.1); }
        
        .tcs-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
            .tcs-notebook { padding: 30px 20px 50px 50px; }
            .tcs-notebook::before { left: 30px; }
            .tcs-notebook::after { left: 36px; }
            .tcs-notebook h1 { font-size: 2.2rem; }
            .tcs-notebook h2 { font-size: 2rem; }
            .tcs-notebook h3 { font-size: 1.5rem; }
            .tcs-notebook p, .tcs-notebook ul { font-size: 1.2rem; }
            .tcs-editor-content { font-size: 0.9rem; }
        }
      `}} />

      <div className="tcs-notebook">
        <div className="tcs-content">
          
          <h1>TCS NQT Style Practice Problem Set</h1>
          <p className="tcs-subtitle">Focus: Mathematical Logic, Conditional Statements, and Loop-Free Execution</p>

          {/* PART 1 */}
          <h2>Part 1: Core Mathematical Logic</h2>

          <div className="tcs-question">
              <h3>1. The Analog Clock Angle</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> A wall clock has an hour hand and a minute hand. Write a program that calculates the shortest angle between the two hands given the current hour (1-12) and minute (0-59).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span></p>
              <ul>
                  <li>Hour Hand Angle = (Hour * 30) + (Minute * 0.5)</li>
                  <li>Minute Hand Angle = Minute * 6</li>
                  <li>Difference = Absolute value of (Hour Angle - Minute Angle)</li>
                  <li>The shortest angle can never be more than 180 degrees. If the difference is &gt; 180, subtract it from 360.</li>
                  <li>If the input is out of bounds, print <span className="tcs-code-snippet">INVALID TIME</span>.</li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 3 0 | <span className="tcs-highlight-out">Output:</span> ANGLE: 90.0</p>
                  <p><span className="tcs-highlight-in">Input:</span> 12 15 | <span className="tcs-highlight-out">Output:</span> ANGLE: 82.5</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt(), m = sc.nextInt(); // Read hour and minute
        
        // Validate 1-12 hours and 0-59 minutes
        if (h < 1 || h > 12 || m < 0 || m > 59) { 
            System.out.println("INVALID TIME"); 
            return; 
        }
        
        if (h == 12) h = 0; // 12 o'clock acts as 0 degrees
        
        // Hour hand: moves 30 deg/hr + 0.5 deg/min. Minute hand: moves 6 deg/min
        double hAngle = (h * 30) + (m * 0.5), mAngle = m * 6; 
        
        // Calculate absolute difference
        double angle = Math.abs(hAngle - mAngle);
        
        // Output shortest angle (min of angle or 360-angle)
        System.out.println("ANGLE: " + Math.min(angle, 360 - angle)); 
    }
}`,
python: `# Read space-separated hour and minute
h, m = map(int, input().split())

# Validate 1-12 hours and 0-59 minutes
if h < 1 or h > 12 or m < 0 or m > 59:
    print("INVALID TIME")
else:
    if h == 12: h = 0 # 12 acts as 0 degrees
    
    # H moves 30/hr + 0.5/min, M moves 6/min. Find absolute difference
    angle = abs((h * 30 + m * 0.5) - (m * 6)) 
    
    # Print shortest angle
    print(f"ANGLE: {min(angle, 360 - angle)}")`,
cpp: `#include <iostream>
#include <cmath>
using namespace std;
int main() {
    int h, m; cin >> h >> m; // Read input
    
    // Validate bounds
    if (h<1 || h>12 || m<0 || m>59) { cout << "INVALID TIME\\n"; return 0; } 
    
    if (h == 12) h = 0; // 12 is 0 deg
    
    // Calculate absolute difference between hands
    double angle = abs((h * 30 + m * 0.5) - (m * 6)); 
    
    // Shortest angle
    cout << "ANGLE: " << min(angle, 360.0 - angle) << "\\n"; 
    return 0;
}`,
c: `#include <stdio.h>
#include <math.h>
int main() {
    int h, m; scanf("%d %d", &h, &m); // Read input
    
    // Validate bounds
    if (h<1 || h>12 || m<0 || m>59) { printf("INVALID TIME\\n"); return 0; } 
    if (h == 12) h = 0; 
    
    // Calculate absolute difference (fabs for floats in C)
    double angle = fabs((h * 30 + m * 0.5) - (m * 6)); 
    
    // Ternary operator to find the shortest angle
    double shortest = angle < 360 - angle ? angle : 360 - angle;
    printf("ANGLE: %.1f\\n", shortest);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>2. The Vending Machine Change (Greedy Math)</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> A vending machine accepts high-denomination bills but must return exact change using the minimum number of coins. The machine has coins of ₹10, ₹5, ₹2, and ₹1.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Take Item Price and Amount Paid as input. If Amount Paid &lt; Item Price, print <span className="tcs-code-snippet">INSUFFICIENT FUNDS</span>. Otherwise, calculate the exact number of each coin needed for the change using <span className="tcs-code-snippet">/</span> (division) and <span className="tcs-code-snippet">%</span> (modulo) operators.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 35 100 | <span className="tcs-highlight-out">Output:</span> CHANGE: 65 | 10s: 6, 5s: 1, 2s: 0, 1s: 0</p>
                  <p><span className="tcs-highlight-in">Input:</span> 42 50 | <span className="tcs-highlight-out">Output:</span> CHANGE: 8 | 10s: 0, 5s: 1, 2s: 1, 1s: 1</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt(), paid = sc.nextInt();
        
        if (paid < price) { 
            System.out.println("INSUFFICIENT FUNDS"); 
            return; 
        }
        
        int change = paid - price;
        System.out.print("CHANGE: " + change + " | ");
        
        // Greedy approach: Divide by largest coin, use modulo for remainder
        int tens = change / 10; change %= 10;
        int fives = change / 5; change %= 5;
        int twos = change / 2; change %= 2;
        
        // Remaining change is exactly the number of 1s
        System.out.printf("10s: %d, 5s: %d, 2s: %d, 1s: %d\\n", tens, fives, twos, change);
    }
}`,
python: `price, paid = map(int, input().split())
if paid < price:
    print("INSUFFICIENT FUNDS")
else:
    c = paid - price
    print(f"CHANGE: {c} | ", end="")
    
    # Floor division (//) gets count, modulo (%) gets remainder
    t, c = c // 10, c % 10
    f, c = c // 5, c % 5
    tw, c = c // 2, c % 2
    
    print(f"10s: {t}, 5s: {f}, 2s: {tw}, 1s: {c}")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int price, paid; cin >> price >> paid;
    if (paid < price) { cout << "INSUFFICIENT FUNDS\\n"; return 0; }
    
    int c = paid - price;
    cout << "CHANGE: " << c << " | ";
    
    // Greedy logic
    int t = c / 10; c %= 10;
    int f = c / 5; c %= 5;
    int tw = c / 2; c %= 2;
    
    cout << "10s: "<<t<<", 5s: "<<f<<", 2s: "<<tw<<", 1s: "<<c<<"\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int price, paid; scanf("%d %d", &price, &paid);
    if (paid < price) { printf("INSUFFICIENT FUNDS\\n"); return 0; }
    
    int c = paid - price;
    printf("CHANGE: %d | ", c);
    
    // Greedy logic
    int t = c / 10; c %= 10;
    int f = c / 5; c %= 5;
    int tw = c / 2; c %= 2;
    
    printf("10s: %d, 5s: %d, 2s: %d, 1s: %d\\n", t, f, tw, c);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>3. The 3-Digit Vault Code</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> A bank vault opens only if the 3-digit code is an "Armstrong Number" (the sum of the cubes of its digits equals the number itself).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Take an integer input. Check if it is between 100 and 999; if not, print <span className="tcs-code-snippet">INVALID FORMAT</span>. Mathematically extract the hundreds, tens, and units digits, cube each, sum them, and check against the original number.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 153 | <span className="tcs-highlight-out">Output:</span> VAULT OPEN</p>
                  <p><span className="tcs-highlight-in">Input:</span> 125 | <span className="tcs-highlight-out">Output:</span> VAULT CLOSED</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int code = sc.nextInt();
        if (code < 100 || code > 999) { System.out.println("INVALID FORMAT"); return; }
        
        // Extract digits mathematically without loops
        int h = code / 100;
        int t = (code / 10) % 10;
        int u = code % 10;
        
        // Cube and sum
        int sum = (h*h*h) + (t*t*t) + (u*u*u);
        System.out.println(sum == code ? "VAULT OPEN" : "VAULT CLOSED");
    }
}`,
python: `code = int(input())
if code < 100 or code > 999:
    print("INVALID FORMAT")
else:
    # Extract digits mathematically without loops
    h = code // 100
    t = (code // 10) % 10
    u = code % 10
    
    # Cube and sum
    sum_cubes = (h**3) + (t**3) + (u**3)
    print("VAULT OPEN" if sum_cubes == code else "VAULT CLOSED")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int code; cin >> code;
    if (code < 100 || code > 999) { cout << "INVALID FORMAT\\n"; return 0; }
    
    // Extract digits mathematically without loops
    int h = code / 100, t = (code / 10) % 10, u = code % 10;
    int sum = (h*h*h) + (t*t*t) + (u*u*u);
    
    cout << (sum == code ? "VAULT OPEN\\n" : "VAULT CLOSED\\n");
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int code; scanf("%d", &code);
    if (code < 100 || code > 999) { printf("INVALID FORMAT\\n"); return 0; }
    
    // Extract digits mathematically without loops
    int h = code / 100, t = (code / 10) % 10, u = code % 10;
    int sum = (h*h*h) + (t*t*t) + (u*u*u);
    
    printf("%s\\n", sum == code ? "VAULT OPEN" : "VAULT CLOSED");
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>4. The Target Shooter (Coordinate Geometry)</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> A laser fires at a 2D plane with a circular target of radius R centered at the origin (0,0). You are given the X and Y hit coordinates.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Find the distance from the origin using d = √(x² + y²).</p>
              <ul>
                  <li>distance &lt; R: <span className="tcs-code-snippet">BULLSEYE</span></li>
                  <li>distance == R: <span className="tcs-code-snippet">BOUNDARY HIT</span></li>
                  <li>distance &gt; R: <span className="tcs-code-snippet">MISSED</span></li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 5 3 4 | <span className="tcs-highlight-out">Output:</span> BOUNDARY HIT</p>
                  <p><span className="tcs-highlight-in">Input:</span> 10 2 2 | <span className="tcs-highlight-out">Output:</span> BULLSEYE</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt(), x = sc.nextInt(), y = sc.nextInt();
        
        // Use squared distance to avoid floating point precision issues with Math.sqrt
        int distSq = (x * x) + (y * y);
        int rSq = r * r;
        
        if (distSq < rSq) System.out.println("BULLSEYE");
        else if (distSq == rSq) System.out.println("BOUNDARY HIT");
        else System.out.println("MISSED");
    }
}`,
python: `r, x, y = map(int, input().split())

# Use squared distance to avoid floating point precision issues
dist_sq, r_sq = (x*x) + (y*y), r*r

if dist_sq < r_sq: print("BULLSEYE")
elif dist_sq == r_sq: print("BOUNDARY HIT")
else: print("MISSED")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int r, x, y; cin >> r >> x >> y;
    
    // Use squared distance to avoid floating point issues
    int distSq = (x * x) + (y * y), rSq = r * r;
    
    if (distSq < rSq) cout << "BULLSEYE\\n";
    else if (distSq == rSq) cout << "BOUNDARY HIT\\n";
    else cout << "MISSED\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int r, x, y; scanf("%d %d %d", &r, &x, &y);
    
    // Use squared distance to avoid floating point issues
    int distSq = (x * x) + (y * y), rSq = r * r;
    
    if (distSq < rSq) printf("BULLSEYE\\n");
    else if (distSq == rSq) printf("BOUNDARY HIT\\n");
    else printf("MISSED\\n");
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>5. The Room Paint Estimator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate the cost to paint the 4 walls of a rectangular room given Length, Width, and Height in feet. The room has 1 door (21 sq ft) and 2 windows (12 sq ft each) that will not be painted.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span></p>
              <ul>
                  <li>Area of 4 walls = 2 * Height * (Length + Width)</li>
                  <li>Paintable Area = Total Area - Door Area - Window Areas</li>
                  <li>If Paintable Area ≤ 0, print <span className="tcs-code-snippet">INVALID DIMENSIONS</span>. Otherwise, calculate cost at ₹15 per sq ft.</li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 10 10 10 | <span className="tcs-highlight-out">Output:</span> TOTAL COST: 5325</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int l = sc.nextInt(), w = sc.nextInt(), h = sc.nextInt();
        
        // Paintable Area = Total Wall Area - 1 Door (21) - 2 Windows (24)
        int paintableArea = (2 * h * (l + w)) - 21 - 24;
        
        if (paintableArea <= 0 || l <= 0 || w <= 0 || h <= 0) {
            System.out.println("INVALID DIMENSIONS");
        } else {
            System.out.println("TOTAL COST: " + (paintableArea * 15));
        }
    }
}`,
python: `l, w, h = map(int, input().split())

# Paintable Area = Total Wall Area - 1 Door (21) - 2 Windows (24)
p_area = (2 * h * (l + w)) - 21 - 24

if p_area <= 0 or l <= 0 or w <= 0 or h <= 0:
    print("INVALID DIMENSIONS")
else:
    print(f"TOTAL COST: {p_area * 15}")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int l, w, h; cin >> l >> w >> h;
    
    // Paintable Area = Total Wall Area - 1 Door (21) - 2 Windows (24)
    int pArea = (2 * h * (l + w)) - 21 - 24;
    
    if (pArea <= 0 || l <= 0 || w <= 0 || h <= 0) cout << "INVALID DIMENSIONS\\n";
    else cout << "TOTAL COST: " << (pArea * 15) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int l, w, h; scanf("%d %d %d", &l, &w, &h);
    
    // Paintable Area = Total Wall Area - 1 Door (21) - 2 Windows (24)
    int pArea = (2 * h * (l + w)) - 21 - 24;
    
    if (pArea <= 0 || l <= 0 || w <= 0 || h <= 0) printf("INVALID DIMENSIONS\\n");
    else printf("TOTAL COST: %d\\n", pArea * 15);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>6. Body Mass Index (BMI) Categorization</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate BMI given weight (kg) and height (cm).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Convert height to meters. Calculate BMI = Weight / (Height * Height).</p>
              <ul>
                  <li>BMI &lt; 18.5: <span className="tcs-code-snippet">UNDERWEIGHT</span></li>
                  <li>18.5 ≤ BMI &lt; 24.9: <span className="tcs-code-snippet">NORMAL WEIGHT</span></li>
                  <li>25.0 ≤ BMI &lt; 29.9: <span className="tcs-code-snippet">OVERWEIGHT</span></li>
                  <li>BMI ≥ 30: <span className="tcs-code-snippet">OBESE</span></li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 70 175 | <span className="tcs-highlight-out">Output:</span> BMI: 22.8 NORMAL WEIGHT</p>
                  <p><span className="tcs-highlight-in">Input:</span> 90 160 | <span className="tcs-highlight-out">Output:</span> BMI: 35.1 OBESE</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double w = sc.nextDouble(), h = sc.nextDouble() / 100.0; // cm to meters
        
        // Calculate BMI
        double bmi = w / (h * h);
        
        // Print with exactly 1 decimal point
        System.out.printf("BMI: %.1f ", bmi);
        if (bmi < 18.5) System.out.println("UNDERWEIGHT");
        else if (bmi < 25.0) System.out.println("NORMAL WEIGHT");
        else if (bmi < 30.0) System.out.println("OVERWEIGHT");
        else System.out.println("OBESE");
    }
}`,
python: `w, h_cm = map(float, input().split())
# cm to meters and calculate BMI
bmi = w / ((h_cm / 100.0) ** 2)

# Print with exactly 1 decimal point
print(f"BMI: {bmi:.1f} ", end="")
if bmi < 18.5: print("UNDERWEIGHT")
elif bmi < 25.0: print("NORMAL WEIGHT")
elif bmi < 30.0: print("OVERWEIGHT")
else: print("OBESE")`,
cpp: `#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double w, hCm; cin >> w >> hCm;
    double bmi = w / ((hCm / 100.0) * (hCm / 100.0));
    
    // Print with exactly 1 decimal point
    cout << "BMI: " << fixed << setprecision(1) << bmi << " ";
    if (bmi < 18.5) cout << "UNDERWEIGHT\\n";
    else if (bmi < 25.0) cout << "NORMAL WEIGHT\\n";
    else if (bmi < 30.0) cout << "OVERWEIGHT\\n";
    else cout << "OBESE\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    double w, hCm; scanf("%lf %lf", &w, &hCm);
    double bmi = w / ((hCm / 100.0) * (hCm / 100.0));
    
    // Print with exactly 1 decimal point
    printf("BMI: %.1f ", bmi);
    if (bmi < 18.5) printf("UNDERWEIGHT\\n");
    else if (bmi < 25.0) printf("NORMAL WEIGHT\\n");
    else if (bmi < 30.0) printf("OVERWEIGHT\\n");
    else printf("OBESE\\n");
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>7. Triangle Validity and Type</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Given three integer side lengths (a, b, c), determine if a valid triangle can be formed and identify its type.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> A valid triangle requires: a+b&gt;c AND a+c&gt;b AND b+c&gt;a.</p>
              <ul>
                  <li>If invalid: <span className="tcs-code-snippet">NOT A TRIANGLE</span>.</li>
                  <li>If valid: <span className="tcs-code-snippet">EQUILATERAL</span> (all equal), <span className="tcs-code-snippet">ISOSCELES</span> (two equal), or <span className="tcs-code-snippet">SCALENE</span> (none equal).</li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 3 4 5 | <span className="tcs-highlight-out">Output:</span> SCALENE</p>
                  <p><span className="tcs-highlight-in">Input:</span> 1 2 5 | <span className="tcs-highlight-out">Output:</span> NOT A TRIANGLE</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
        
        // Triangle Inequality Theorem checks validity
        if (a+b>c && a+c>b && b+c>a) {
            if (a==b && b==c) System.out.println("EQUILATERAL");
            else if (a==b || b==c || a==c) System.out.println("ISOSCELES");
            else System.out.println("SCALENE");
        } else {
            System.out.println("NOT A TRIANGLE");
        }
    }
}`,
python: `a, b, c = map(int, input().split())

# Triangle Inequality Theorem checks validity
if a+b>c and a+c>b and b+c>a:
    if a==b==c: print("EQUILATERAL")
    elif a==b or b==c or a==c: print("ISOSCELES")
    else: print("SCALENE")
else:
    print("NOT A TRIANGLE")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int a, b, c; cin >> a >> b >> c;
    
    // Triangle Inequality Theorem checks validity
    if (a+b>c && a+c>b && b+c>a) {
        if (a==b && b==c) cout << "EQUILATERAL\\n";
        else if (a==b || b==c || a==c) cout << "ISOSCELES\\n";
        else cout << "SCALENE\\n";
    } else cout << "NOT A TRIANGLE\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int a, b, c; scanf("%d %d %d", &a, &b, &c);
    
    // Triangle Inequality Theorem checks validity
    if (a+b>c && a+c>b && b+c>a) {
        if (a==b && b==c) printf("EQUILATERAL\\n");
        else if (a==b || b==c || a==c) printf("ISOSCELES\\n");
        else printf("SCALENE\\n");
    } else printf("NOT A TRIANGLE\\n");
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>8. The E-commerce Checkout Logic</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate the checkout price given Base Price and Item Type.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span></p>
              <ul>
                  <li>Clothing: 20% discount. Electronics: 10% discount.</li>
                  <li>If the new subtotal &gt; 5000, apply a flat ₹500 VIP discount.</li>
                  <li>Add 18% GST to the final amount.</li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 6000 Electronics | <span className="tcs-highlight-out">Output:</span> FINAL AMOUNT: 5782.0</p>
                  <p><span className="tcs-highlight-in">Input:</span> 1000 Clothing | <span className="tcs-highlight-out">Output:</span> FINAL AMOUNT: 944.0</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double p = sc.nextDouble();
        String t = sc.next();
        
        // 1. Category Discount
        if (t.equals("Clothing")) p *= 0.80; // 20% off
        else if (t.equals("Electronics")) p *= 0.90; // 10% off
        
        // 2. VIP Discount
        if (p > 5000) p -= 500; 
        
        // 3. Apply 18% GST
        System.out.println("FINAL AMOUNT: " + (p * 1.18));
    }
}`,
python: `data = input().split()
p, t = float(data[0]), data[1]

# 1. Category Discount
if t == "Clothing": p *= 0.80 # 20% off
elif t == "Electronics": p *= 0.90 # 10% off

# 2. VIP Discount
if p > 5000: p -= 500

# 3. Apply 18% GST
print(f"FINAL AMOUNT: {p * 1.18}")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    double p; string t; cin >> p >> t;
    
    if (t == "Clothing") p *= 0.80;
    else if (t == "Electronics") p *= 0.90;
    
    if (p > 5000) p -= 500;
    cout << "FINAL AMOUNT: " << (p * 1.18) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
#include <string.h>
int main() {
    double p; char t[20]; scanf("%lf %s", &p, t);
    
    if (strcmp(t, "Clothing") == 0) p *= 0.80;
    else if (strcmp(t, "Electronics") == 0) p *= 0.90;
    
    if (p > 5000) p -= 500;
    printf("FINAL AMOUNT: %.1f\\n", p * 1.18);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>9. Time Addition (Shift Logger)</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate total hours and minutes worked across two sessions (H1, M1) and (H2, M2).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span></p>
              <ul>
                  <li>Total Minutes = (M1 + M2) % 60</li>
                  <li>Extra Hours = (M1 + M2) / 60</li>
                  <li>Total Hours = H1 + H2 + Extra Hours</li>
                  <li>Total Hours &gt; 8: <span className="tcs-code-snippet">OVERTIME LOGGED: [H] HRS [M] MINS</span>. Otherwise: <span className="tcs-code-snippet">STANDARD SHIFT</span>.</li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 4 45 3 30 | <span className="tcs-highlight-out">Output:</span> STANDARD SHIFT: 8 HRS 15 MINS</p>
                  <p><span className="tcs-highlight-in">Input:</span> 5 50 4 20 | <span className="tcs-highlight-out">Output:</span> OVERTIME LOGGED: 10 HRS 10 MINS</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h1 = sc.nextInt(), m1 = sc.nextInt(), h2 = sc.nextInt(), m2 = sc.nextInt();
        
        // Sum total minutes, divide to get rollover hours, modulo to get remaining minutes
        int fh = h1 + h2 + ((m1 + m2) / 60);
        int fm = (m1 + m2) % 60;
        
        if (fh > 8) System.out.printf("OVERTIME LOGGED: %d HRS %d MINS\\n", fh, fm);
        else System.out.printf("STANDARD SHIFT: %d HRS %d MINS\\n", fh, fm);
    }
}`,
python: `h1, m1, h2, m2 = map(int, input().split())

# Sum total minutes, divide to get rollover hours, modulo to get remaining minutes
fh = h1 + h2 + ((m1 + m2) // 60)
fm = (m1 + m2) % 60

if fh > 8: print(f"OVERTIME LOGGED: {fh} HRS {fm} MINS")
else: print(f"STANDARD SHIFT: {fh} HRS {fm} MINS")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int h1, m1, h2, m2; cin >> h1 >> m1 >> h2 >> m2;
    int fh = h1 + h2 + ((m1 + m2) / 60);
    int fm = (m1 + m2) % 60;
    
    if (fh > 8) cout << "OVERTIME LOGGED: " << fh << " HRS " << fm << " MINS\\n";
    else cout << "STANDARD SHIFT: " << fh << " HRS " << fm << " MINS\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int h1, m1, h2, m2; scanf("%d %d %d %d", &h1, &m1, &h2, &m2);
    int fh = h1 + h2 + ((m1 + m2) / 60);
    int fm = (m1 + m2) % 60;
    
    if (fh > 8) printf("OVERTIME LOGGED: %d HRS %d MINS\\n", fh, fm);
    else printf("STANDARD SHIFT: %d HRS %d MINS\\n", fh, fm);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>10. The Temperature Sensor Alarm</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Evaluate an industrial machine's temperature given the value and scale (C or F).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> If F, convert: C = (F - 32) * 5/9.</p>
              <ul>
                  <li>Celsius &lt; 0: <span className="tcs-code-snippet">FREEZING ALARM</span></li>
                  <li>Celsius &gt; 100: <span className="tcs-code-snippet">BOILING ALARM</span></li>
                  <li>Otherwise: <span className="tcs-code-snippet">NORMAL OPERATION</span></li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 212 F | <span className="tcs-highlight-out">Output:</span> BOILING ALARM</p>
                  <p><span className="tcs-highlight-in">Input:</span> -5 C | <span className="tcs-highlight-out">Output:</span> FREEZING ALARM</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double t = sc.nextDouble(); char s = sc.next().charAt(0);
        
        // Normalize to Celsius for universal evaluation
        if (s == 'F') t = (t - 32) * 5.0 / 9.0;
        
        if (t < 0) System.out.println("FREEZING ALARM");
        else if (t > 100) System.out.println("BOILING ALARM");
        else System.out.println("NORMAL OPERATION");
    }
}`,
python: `data = input().split()
t, s = float(data[0]), data[1]

# Normalize to Celsius
if s == 'F': t = (t - 32) * 5.0 / 9.0

if t < 0: print("FREEZING ALARM")
elif t > 100: print("BOILING ALARM")
else: print("NORMAL OPERATION")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    double t; char s; cin >> t >> s;
    if (s == 'F') t = (t - 32) * 5.0 / 9.0;
    
    if (t < 0) cout << "FREEZING ALARM\\n";
    else if (t > 100) cout << "BOILING ALARM\\n";
    else cout << "NORMAL OPERATION\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    double t; char s; scanf("%lf %c", &t, &s);
    if (s == 'F') t = (t - 32) * 5.0 / 9.0;
    
    if (t < 0) printf("FREEZING ALARM\\n");
    else if (t > 100) printf("BOILING ALARM\\n");
    else printf("NORMAL OPERATION\\n");
    return 0;
}`
              }} />
          </div>

          {/* PART 2 */}
          <h2>Part 2: System & Enterprise Logic</h2>

          <div className="tcs-question">
              <h3>11. Data Grid Pagination Engine</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate the starting record index for a requested page in a data grid component. First page is Page 1 (index 0).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Calculate total pages required. If requested page is &lt; 1 or &gt; total pages, print <span className="tcs-code-snippet">OUT OF BOUNDS</span>. Otherwise, print <span className="tcs-code-snippet">INDEX: &lt;value&gt;</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 55 10 6 | <span className="tcs-highlight-out">Output:</span> INDEX: 50</p>
                  <p><span className="tcs-highlight-in">Input:</span> 50 10 6 | <span className="tcs-highlight-out">Output:</span> OUT OF BOUNDS</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int tot = sc.nextInt(), sz = sc.nextInt(), pg = sc.nextInt();
        
        // Math Trick: (total + size - 1) / size simulates Math.ceil for integers
        int maxPg = (tot + sz - 1) / sz;
        
        if (pg < 1 || pg > maxPg) System.out.println("OUT OF BOUNDS");
        else System.out.println("INDEX: " + ((pg - 1) * sz)); // 0-based DB offsets
    }
}`,
python: `tot, sz, pg = map(int, input().split())

# Floor division equivalent of ceiling math trick
max_pg = (tot + sz - 1) // sz

if pg < 1 or pg > max_pg: print("OUT OF BOUNDS")
else: print(f"INDEX: {(pg - 1) * sz}")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int tot, sz, pg; cin >> tot >> sz >> pg;
    int maxPg = (tot + sz - 1) / sz;
    if (pg < 1 || pg > maxPg) cout << "OUT OF BOUNDS\\n";
    else cout << "INDEX: " << ((pg - 1) * sz) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int tot, sz, pg; scanf("%d %d %d", &tot, &sz, &pg);
    int maxPg = (tot + sz - 1) / sz;
    if (pg < 1 || pg > maxPg) printf("OUT OF BOUNDS\\n");
    else printf("INDEX: %d\\n", (pg - 1) * sz);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>12. Microservice Network Latency Calculator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Estimate round-trip latency between data centers: time to travel there and back, plus server processing time.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Distance (km), Speed (km/ms), Processing Time (ms). Latency = (2 * Distance / Speed) + Processing Time.</p>
              <ul>
                  <li>&lt; 50ms: <span className="tcs-code-snippet">EXCELLENT</span></li>
                  <li>50ms - 150ms: <span className="tcs-code-snippet">ACCEPTABLE</span></li>
                  <li>&gt; 150ms: <span className="tcs-code-snippet">POOR ROUTING</span></li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 500 200 45 | <span className="tcs-highlight-out">Output:</span> ACCEPTABLE: 50ms</p>
                  <p><span className="tcs-highlight-in">Input:</span> 1000 100 10 | <span className="tcs-highlight-out">Output:</span> EXCELLENT: 30ms</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int d = sc.nextInt(), s = sc.nextInt(), p = sc.nextInt();
        
        // Latency = Round trip time (distance * 2 / speed) + processing time
        int lat = (int)((2.0 * d / s)) + p;
        
        if (lat < 50) System.out.println("EXCELLENT: " + lat + "ms");
        else if (lat <= 150) System.out.println("ACCEPTABLE: " + lat + "ms");
        else System.out.println("POOR ROUTING: " + lat + "ms");
    }
}`,
python: `d, s, p = map(int, input().split())

# Latency calculation
lat = int(2.0 * d / s) + p

if lat < 50: print(f"EXCELLENT: {lat}ms")
elif lat <= 150: print(f"ACCEPTABLE: {lat}ms")
else: print(f"POOR ROUTING: {lat}ms")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int d, s, p; cin >> d >> s >> p;
    int lat = (2.0 * d / s) + p;
    
    if (lat < 50) cout << "EXCELLENT: " << lat << "ms\\n";
    else if (lat <= 150) cout << "ACCEPTABLE: " << lat << "ms\\n";
    else cout << "POOR ROUTING: " << lat << "ms\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int d, s, p; scanf("%d %d %d", &d, &s, &p);
    int lat = (2.0 * d / s) + p;
    
    if (lat < 50) printf("EXCELLENT: %dms\\n", lat);
    else if (lat <= 150) printf("ACCEPTABLE: %dms\\n", lat);
    else printf("POOR ROUTING: %dms\\n", lat);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>13. Server Memory Allocation</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate the maximum number of identical containers a server can host, and the leftover RAM.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Given TotalRAM and ContainerSize. If leftover RAM &lt; 100 MB, prefix output with <span className="tcs-code-snippet">WARNING: LOW OVERHEAD |</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 4000 1024 | <span className="tcs-highlight-out">Output:</span> WARNING: LOW OVERHEAD | COUNT: 3, LEFT: 928</p>
                  <p><span className="tcs-highlight-in">Input:</span> 8192 2000 | <span className="tcs-highlight-out">Output:</span> COUNT: 4, LEFT: 192</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int tot = sc.nextInt(), sz = sc.nextInt();
        
        // Integer division gets the container count, modulo gets leftover RAM
        int count = tot / sz, left = tot % sz;
        
        // Less than 100MB is dangerous overhead for OS
        String pfx = (left < 100) ? "WARNING: LOW OVERHEAD | " : "";
        System.out.println(pfx + "COUNT: " + count + ", LEFT: " + left);
    }
}`,
python: `tot, sz = map(int, input().split())

# Floor division and modulo
cnt, left = tot // sz, tot % sz
pfx = "WARNING: LOW OVERHEAD | " if left < 100 else ""

print(f"{pfx}COUNT: {cnt}, LEFT: {left}")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int tot, sz; cin >> tot >> sz;
    int cnt = tot / sz, left = tot % sz;
    
    if (left < 100) cout << "WARNING: LOW OVERHEAD | ";
    cout << "COUNT: " << cnt << ", LEFT: " << left << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int tot, sz; scanf("%d %d", &tot, &sz);
    int cnt = tot / sz, left = tot % sz;
    
    if (left < 100) printf("WARNING: LOW OVERHEAD | ");
    printf("COUNT: %d, LEFT: %d\\n", cnt, left);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>14. Keyboard Shortcut Combinatorics</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate total unique 2-key combinations from N available keys. Order does not matter.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Formula: (N * (N - 1)) / 2. If total &lt; 50, output <span className="tcs-code-snippet">NEED MORE KEYS</span>. Otherwise, print <span className="tcs-code-snippet">TOTAL COMBINATIONS: &lt;value&gt;</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 10 | <span className="tcs-highlight-out">Output:</span> NEED MORE KEYS</p>
                  <p><span className="tcs-highlight-in">Input:</span> 15 | <span className="tcs-highlight-out">Output:</span> TOTAL COMBINATIONS: 105</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // N choose 2 formula: Selecting 2 items where order doesn't matter
        int c = (n * (n - 1)) / 2;
        
        if (c < 50) System.out.println("NEED MORE KEYS");
        else System.out.println("TOTAL COMBINATIONS: " + c);
    }
}`,
python: `n = int(input())

# N choose 2 formula
c = (n * (n - 1)) // 2

print("NEED MORE KEYS" if c < 50 else f"TOTAL COMBINATIONS: {c}")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int n; cin >> n;
    int c = (n * (n - 1)) / 2;
    if (c < 50) cout << "NEED MORE KEYS\\n";
    else cout << "TOTAL COMBINATIONS: " << c << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int n; scanf("%d", &n);
    int c = (n * (n - 1)) / 2;
    if (c < 50) printf("NEED MORE KEYS\\n");
    else printf("TOTAL COMBINATIONS: %d\\n", c);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>15. System Load Analyzer (Quadratic Evaluation)</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Evaluate server stability using the discriminant (D = b² - 4ac) of a load spike equation ax² + bx + c = 0.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span></p>
              <ul>
                  <li>D &gt; 0: <span className="tcs-code-snippet">SCALE UP</span></li>
                  <li>D == 0: <span className="tcs-code-snippet">STABLE</span></li>
                  <li>D &lt; 0: <span className="tcs-code-snippet">SCALE DOWN</span></li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 1 -4 4 | <span className="tcs-highlight-out">Output:</span> STABLE</p>
                  <p><span className="tcs-highlight-in">Input:</span> 2 3 5 | <span className="tcs-highlight-out">Output:</span> SCALE DOWN</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
        
        // Discriminant dictates nature of roots
        int d = (b * b) - (4 * a * c);
        
        if (d > 0) System.out.println("SCALE UP");
        else if (d == 0) System.out.println("STABLE");
        else System.out.println("SCALE DOWN");
    }
}`,
python: `a, b, c = map(int, input().split())
d = (b * b) - (4 * a * c)

if d > 0: print("SCALE UP")
elif d == 0: print("STABLE")
else: print("SCALE DOWN")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int a, b, c; cin >> a >> b >> c;
    int d = (b * b) - (4 * a * c);
    
    if (d > 0) cout << "SCALE UP\\n";
    else if (d == 0) cout << "STABLE\\n";
    else cout << "SCALE DOWN\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int a, b, c; scanf("%d %d %d", &a, &b, &c);
    int d = (b * b) - (4 * a * c);
    
    if (d > 0) printf("SCALE UP\\n");
    else if (d == 0) printf("STABLE\\n");
    else printf("SCALE DOWN\\n");
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>16. Distributed Node Distance (Manhattan Geometry)</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate the physical grid distance between two database shards.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Manhattan Distance = |x2 - x1| + |y2 - y1|.</p>
              <ul>
                  <li>Distance ≤ 3: <span className="tcs-code-snippet">SAME RACK: &lt;Distance&gt;</span></li>
                  <li>Distance &gt; 3: <span className="tcs-code-snippet">REMOTE RACK: &lt;Distance&gt;</span></li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 2 4 6 1 | <span className="tcs-highlight-out">Output:</span> REMOTE RACK: 7</p>
                  <p><span className="tcs-highlight-in">Input:</span> 5 5 6 6 | <span className="tcs-highlight-out">Output:</span> SAME RACK: 2</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x1=sc.nextInt(), y1=sc.nextInt(), x2=sc.nextInt(), y2=sc.nextInt();
        
        // Manhattan Distance is sum of absolute vertical and horizontal differences
        int dist = Math.abs(x2 - x1) + Math.abs(y2 - y1);
        
        if (dist <= 3) System.out.println("SAME RACK: " + dist);
        else System.out.println("REMOTE RACK: " + dist);
    }
}`,
python: `x1, y1, x2, y2 = map(int, input().split())

# Manhattan Distance formula
dist = abs(x2 - x1) + abs(y2 - y1)

print(f"SAME RACK: {dist}" if dist <= 3 else f"REMOTE RACK: {dist}")`,
cpp: `#include <iostream>
#include <cmath>
using namespace std;
int main() {
    int x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
    int dist = abs(x2 - x1) + abs(y2 - y1);
    
    if (dist <= 3) cout << "SAME RACK: " << dist << "\\n";
    else cout << "REMOTE RACK: " << dist << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
#include <stdlib.h>
int main() {
    int x1, y1, x2, y2; scanf("%d %d %d %d", &x1, &y1, &x2, &y2);
    int dist = abs(x2 - x1) + abs(y2 - y1);
    
    if (dist <= 3) printf("SAME RACK: %d\\n", dist);
    else printf("REMOTE RACK: %d\\n", dist);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>17. UI Image Aspect Ratio Preserver</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate a new target height for an image to fit a mobile screen while strictly preserving the aspect ratio.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Truncate decimals. If calculated height &gt; 1080, print <span className="tcs-code-snippet">EXCEEDS MAX RESOLUTION</span>. Otherwise, <span className="tcs-code-snippet">NEW DIMENSIONS: &lt;W&gt;x&lt;H&gt;</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 1920 1080 800 | <span className="tcs-highlight-out">Output:</span> NEW DIMENSIONS: 800x450</p>
                  <p><span className="tcs-highlight-in">Input:</span> 800 1200 1000 | <span className="tcs-highlight-out">Output:</span> EXCEEDS MAX RESOLUTION</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int ow = sc.nextInt(), oh = sc.nextInt(), nw = sc.nextInt();
        
        // Ratio = OrigH / OrigW. Multiply with double to avoid early integer truncation
        int nh = (int)(oh * ((double)nw / ow));
        
        if (nh > 1080) System.out.println("EXCEEDS MAX RESOLUTION");
        else System.out.println("NEW DIMENSIONS: " + nw + "x" + nh);
    }
}`,
python: `ow, oh, nw = map(int, input().split())

# Aspect ratio math
nh = int(oh * (nw / ow))

if nh > 1080: print("EXCEEDS MAX RESOLUTION")
else: print(f"NEW DIMENSIONS: {nw}x{nh}")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int ow, oh, nw; cin >> ow >> oh >> nw;
    int nh = (oh * ((double)nw / ow));
    
    if (nh > 1080) cout << "EXCEEDS MAX RESOLUTION\\n";
    else cout << "NEW DIMENSIONS: " << nw << "x" << nh << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int ow, oh, nw; scanf("%d %d %d", &ow, &oh, &nw);
    int nh = (oh * ((double)nw / ow));
    
    if (nh > 1080) printf("EXCEEDS MAX RESOLUTION\\n");
    else printf("NEW DIMENSIONS: %dx%d\\n", nw, nh);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>18. API Exponential Backoff Strategy</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate retry wait time using BaseDelay * 2^(AttemptNumber - 1).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Cap the absolute maximum delay at 5000ms.</p>
              <ul>
                  <li>Delay &gt; 5000: <span className="tcs-code-snippet">MAX TIMEOUT CAPPED AT 5000</span></li>
                  <li>Otherwise: <span className="tcs-code-snippet">DELAY: &lt;value&gt;ms</span></li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 500 4 | <span className="tcs-highlight-out">Output:</span> DELAY: 4000ms</p>
                  <p><span className="tcs-highlight-in">Input:</span> 500 5 | <span className="tcs-highlight-out">Output:</span> MAX TIMEOUT CAPPED AT 5000</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int b = sc.nextInt(), a = sc.nextInt();
        
        // Math.pow returns double, cast back to int
        int delay = (int)(b * Math.pow(2, a - 1));
        
        if (delay > 5000) System.out.println("MAX TIMEOUT CAPPED AT 5000");
        else System.out.println("DELAY: " + delay + "ms");
    }
}`,
python: `b, a = map(int, input().split())

# Exponential retry logic
delay = int(b * (2 ** (a - 1)))

if delay > 5000: print("MAX TIMEOUT CAPPED AT 5000")
else: print(f"DELAY: {delay}ms")`,
cpp: `#include <iostream>
#include <cmath>
using namespace std;
int main() {
    int b, a; cin >> b >> a;
    int delay = b * pow(2, a - 1);
    
    if (delay > 5000) cout << "MAX TIMEOUT CAPPED AT 5000\\n";
    else cout << "DELAY: " << delay << "ms\\n";
    return 0;
}`,
c: `#include <stdio.h>
#include <math.h>
int main() {
    int b, a; scanf("%d %d", &b, &a);
    int delay = b * pow(2, a - 1);
    
    if (delay > 5000) printf("MAX TIMEOUT CAPPED AT 5000\\n");
    else printf("DELAY: %dms\\n", delay);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>19. Batch Processing Throughput Monitor</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate processing throughput as Total Records / Time (seconds).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Use integer division.</p>
              <ul>
                  <li>Throughput &lt; 100: <span className="tcs-code-snippet">OPTIMIZE QUERY: &lt;value&gt;/sec</span></li>
                  <li>Otherwise: <span className="tcs-code-snippet">THROUGHPUT NORMAL: &lt;value&gt;/sec</span></li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 4500 30 | <span className="tcs-highlight-out">Output:</span> THROUGHPUT NORMAL: 150/sec</p>
                  <p><span className="tcs-highlight-in">Input:</span> 150 2 | <span className="tcs-highlight-out">Output:</span> OPTIMIZE QUERY: 75/sec</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rec = sc.nextInt(), t = sc.nextInt();
        
        // Integer division truncates decimal, as requested
        int thru = rec / t;
        
        if (thru < 100) System.out.println("OPTIMIZE QUERY: " + thru + "/sec");
        else System.out.println("THROUGHPUT NORMAL: " + thru + "/sec");
    }
}`,
python: `rec, t = map(int, input().split())

# Floor division
thru = rec // t

if thru < 100: print(f"OPTIMIZE QUERY: {thru}/sec")
else: print(f"THROUGHPUT NORMAL: {thru}/sec")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int rec, t; cin >> rec >> t;
    int thru = rec / t;
    if (thru < 100) cout << "OPTIMIZE QUERY: " << thru << "/sec\\n";
    else cout << "THROUGHPUT NORMAL: " << thru << "/sec\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int rec, t; scanf("%d %d", &rec, &t);
    int thru = rec / t;
    if (thru < 100) printf("OPTIMIZE QUERY: %d/sec\\n", thru);
    else printf("THROUGHPUT NORMAL: %d/sec\\n", thru);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>20. Web Crawler Success Rate</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate the integer percentage success rate of scraped URLs.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span></p>
              <ul>
                  <li>Exactly 100%: <span className="tcs-code-snippet">PERFECT RUN</span></li>
                  <li>80% to 99%: <span className="tcs-code-snippet">PARTIAL SUCCESS: &lt;Rate&gt;%</span></li>
                  <li>&lt; 80%: <span className="tcs-code-snippet">IP LIKELY BLOCKED: &lt;Rate&gt;%</span></li>
              </ul>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 500 380 | <span className="tcs-highlight-out">Output:</span> IP LIKELY BLOCKED: 76%</p>
                  <p><span className="tcs-highlight-in">Input:</span> 100 100 | <span className="tcs-highlight-out">Output:</span> PERFECT RUN</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int tot = sc.nextInt(), suc = sc.nextInt();
        
        // Multiply by 100.0 before dividing to ensure floating point math before truncating
        int rate = (int)((suc * 100.0) / tot);
        
        if (rate == 100) System.out.println("PERFECT RUN");
        else if (rate >= 80) System.out.println("PARTIAL SUCCESS: " + rate + "%");
        else System.out.println("IP LIKELY BLOCKED: " + rate + "%");
    }
}`,
python: `tot, suc = map(int, input().split())

# Percentage logic
rate = int((suc * 100.0) / tot)

if rate == 100: print("PERFECT RUN")
elif rate >= 80: print(f"PARTIAL SUCCESS: {rate}%")
else: print(f"IP LIKELY BLOCKED: {rate}%")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int tot, suc; cin >> tot >> suc;
    int rate = (suc * 100.0) / tot;
    
    if (rate == 100) cout << "PERFECT RUN\\n";
    else if (rate >= 80) cout << "PARTIAL SUCCESS: " << rate << "%\\n";
    else cout << "IP LIKELY BLOCKED: " << rate << "%\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int tot, suc; scanf("%d %d", &tot, &suc);
    int rate = (suc * 100.0) / tot;
    
    if (rate == 100) printf("PERFECT RUN\\n");
    else if (rate >= 80) printf("PARTIAL SUCCESS: %d%%\\n", rate);
    else printf("IP LIKELY BLOCKED: %d%%\\n", rate);
    return 0;
}`
              }} />
          </div>

          {/* PART 3 */}
          <h2>Part 3: Everyday Business Scenarios</h2>

          <div className="tcs-question">
              <h3>21. The Cinema Ticket Counter</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate multiplex ticket price.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Class 1 (Rs. 150), Class 2 (Rs. 250). Weekend adds flat Rs. 50. VIP card gives 10% discount on final total.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 2 1 1 | <span className="tcs-highlight-out">Output:</span> 270</p>
                  <p><span className="tcs-highlight-in">Input:</span> 1 0 0 | <span className="tcs-highlight-out">Output:</span> 150</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cls = sc.nextInt(), wk = sc.nextInt(), vip = sc.nextInt();
        
        int base = (cls == 1) ? 150 : 250;
        if (wk == 1) base += 50; // Weekend surcharge
        if (vip == 1) base = (int)(base * 0.90); // 10% off
        
        System.out.println(base);
    }
}`,
python: `cls, wk, vip = map(int, input().split())
base = 150 if cls == 1 else 250

if wk == 1: base += 50 # Weekend surcharge
if vip == 1: base = int(base * 0.90) # 10% VIP off

print(base)`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int cls, wk, vip; cin >> cls >> wk >> vip;
    int base = (cls == 1) ? 150 : 250;
    if (wk == 1) base += 50;
    if (vip == 1) base *= 0.90;
    cout << base << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int cls, wk, vip; scanf("%d %d %d", &cls, &wk, &vip);
    int base = (cls == 1) ? 150 : 250;
    if (wk == 1) base += 50;
    if (vip == 1) base *= 0.90;
    printf("%d\\n", base);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>22. Train Ticket Cancellation Refund</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate train cancellation refund based on days left.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> &gt; 10 days (90%), 5-10 days (75%), &lt; 5 days (50%), 0 days (0%).</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 1000 7 | <span className="tcs-highlight-out">Output:</span> 750</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int f = sc.nextInt(), d = sc.nextInt();
        
        // Cascade downwards catching the proper ranges
        if (d > 10) System.out.println((int)(f * 0.90));
        else if (d >= 5) System.out.println((int)(f * 0.75));
        else if (d > 0) System.out.println((int)(f * 0.50));
        else System.out.println(0);
    }
}`,
python: `f, d = map(int, input().split())

# Cascade ranges
if d > 10: print(int(f * 0.90))
elif d >= 5: print(int(f * 0.75))
elif d > 0: print(int(f * 0.50))
else: print(0)`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int f, d; cin >> f >> d;
    if (d > 10) cout << int(f * 0.90) << "\\n";
    else if (d >= 5) cout << int(f * 0.75) << "\\n";
    else if (d > 0) cout << int(f * 0.50) << "\\n";
    else cout << 0 << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int f, d; scanf("%d %d", &f, &d);
    if (d > 10) printf("%d\\n", (int)(f * 0.90));
    else if (d >= 5) printf("%d\\n", (int)(f * 0.75));
    else if (d > 0) printf("%d\\n", (int)(f * 0.50));
    else printf("0\\n");
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>23. The Paint Bucket Calculator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate total whole buckets of paint required for a rectangular wall. 1 bucket = 40 sq ft.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> You cannot buy half a bucket (round up).</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 10 10 | <span className="tcs-highlight-out">Output:</span> 3</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int l = sc.nextInt(), h = sc.nextInt();
        
        // Math.ceil rounds up to next whole bucket
        System.out.println((int)Math.ceil((l * h) / 40.0));
    }
}`,
python: `import math
l, h = map(int, input().split())

# Math.ceil rounds up to next whole bucket
print(math.ceil((l * h) / 40.0))`,
cpp: `#include <iostream>
#include <cmath>
using namespace std;
int main() {
    int l, h; cin >> l >> h;
    cout << ceil((l * h) / 40.0) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
#include <math.h>
int main() {
    int l, h; scanf("%d %d", &l, &h);
    printf("%.0f\\n", ceil((l * h) / 40.0));
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>24. The Pizza Ordering System</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate pizza bill. Sizes: 1 (200), 2 (300), 3 (400). Extra cheese = Rs. 50 flat per order. Delivery = Rs. 40, but free if food bill ≥ 500.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 2 2 1 | <span className="tcs-highlight-out">Output:</span> 650</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int sz = sc.nextInt(), qty = sc.nextInt(), chz = sc.nextInt();
        
        // Determine base price mathematically
        int food = (100 + (sz * 100)) * qty;
        if (chz == 1) food += 50; // Extra cheese
        
        // Delivery fee of 40 applied if food < 500
        System.out.println(food + (food < 500 ? 40 : 0));
    }
}`,
python: `sz, qty, chz = map(int, input().split())

# Determine base price mathematically
food = (100 + (sz * 100)) * qty
if chz == 1: food += 50 # Extra cheese

# Delivery fee
print(food + (40 if food < 500 else 0))`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int sz, qty, chz; cin >> sz >> qty >> chz;
    int food = (100 + (sz * 100)) * qty;
    if (chz == 1) food += 50;
    cout << food + (food < 500 ? 40 : 0) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int sz, qty, chz; scanf("%d %d %d", &sz, &qty, &chz);
    int food = (100 + (sz * 100)) * qty;
    if (chz == 1) food += 50;
    printf("%d\\n", food + (food < 500 ? 40 : 0));
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>25. ATM Withdrawal Validator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Validate an ATM request.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Must be a multiple of 100. Max limit = 10,000. Must have sufficient balance.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 15000 4550 | <span className="tcs-highlight-out">Output:</span> INVALID AMOUNT</p>
                  <p><span className="tcs-highlight-in">Input:</span> 5000 2000 | <span className="tcs-highlight-out">Output:</span> TRANSACTION SUCCESSFUL: 3000</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int bal = sc.nextInt(), req = sc.nextInt();
        
        // Conditions: Divisible by 100, under limit, sufficient balance
        if (req % 100 != 0 || req > 10000 || req > bal) {
            System.out.println("INVALID AMOUNT");
        } else {
            System.out.println("TRANSACTION SUCCESSFUL: " + (bal - req));
        }
    }
}`,
python: `bal, req = map(int, input().split())

# Evaluate conditions
if req % 100 != 0 or req > 10000 or req > bal:
    print("INVALID AMOUNT")
else:
    print(f"TRANSACTION SUCCESSFUL: {bal - req}")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int bal, req; cin >> bal >> req;
    if (req % 100 != 0 || req > 10000 || req > bal) cout << "INVALID AMOUNT\\n";
    else cout << "TRANSACTION SUCCESSFUL: " << (bal - req) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int bal, req; scanf("%d %d", &bal, &req);
    if (req % 100 != 0 || req > 10000 || req > bal) printf("INVALID AMOUNT\\n");
    else printf("TRANSACTION SUCCESSFUL: %d\\n", bal - req);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>26. Ride-Sharing Fare Calculator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate cab fare. Base: Rs. 50. First 5km: Rs. 10/km. Beyond 5km: Rs. 8/km. Night multiplier: 1.5x.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 8 1 | <span className="tcs-highlight-out">Output:</span> 186</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int dist = sc.nextInt(), night = sc.nextInt();
        
        // Base 50 + tier logic
        double fare = 50.0 + (dist <= 5 ? dist * 10 : (50 + (dist - 5) * 8));
        
        // Multiplier if night == 1
        System.out.println((int)(night == 1 ? fare * 1.5 : fare));
    }
}`,
python: `dist, night = map(int, input().split())

# Base 50 + tier logic
fare = 50.0 + (dist * 10 if dist <= 5 else 50 + (dist - 5) * 8)

# Output with night multiplier
print(int(fare * 1.5 if night == 1 else fare))`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int dist, night; cin >> dist >> night;
    double fare = 50.0 + (dist <= 5 ? dist * 10 : (50 + (dist - 5) * 8));
    cout << (int)(night == 1 ? fare * 1.5 : fare) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int dist, night; scanf("%d %d", &dist, &night);
    double fare = 50.0 + (dist <= 5 ? dist * 10 : (50 + (dist - 5) * 8));
    printf("%d\\n", (int)(night == 1 ? fare * 1.5 : fare));
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>27. Courier Box Fitting</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Determine if an upright cylinder fits inside a rectangular box.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Cylinder diameter ≤ minimum of Box Length and Box Width. Cylinder Height ≤ Box Height.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 5 10 12 12 15 | <span className="tcs-highlight-out">Output:</span> FITS</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r=sc.nextInt(), ch=sc.nextInt(), bl=sc.nextInt(), bw=sc.nextInt(), bh=sc.nextInt();
        
        // Cylinder diameter (r*2) must be less than both box length and width
        if (r * 2 <= bl && r * 2 <= bw && ch <= bh) System.out.println("FITS");
        else System.out.println("DOES NOT FIT");
    }
}`,
python: `r, ch, bl, bw, bh = map(int, input().split())

# Cylinder diameter (r*2) must be <= both box length and width
if r * 2 <= bl and r * 2 <= bw and ch <= bh:
    print("FITS")
else:
    print("DOES NOT FIT")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int r, ch, bl, bw, bh; cin >> r >> ch >> bl >> bw >> bh;
    if (r * 2 <= bl && r * 2 <= bw && ch <= bh) cout << "FITS\\n";
    else cout << "DOES NOT FIT\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int r, ch, bl, bw, bh; scanf("%d %d %d %d %d", &r, &ch, &bl, &bw, &bh);
    if (r * 2 <= bl && r * 2 <= bw && ch <= bh) printf("FITS\\n");
    else printf("DOES NOT FIT\\n");
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>28. The Book Store Bulk Discount</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Notebooks cost Rs. 50. Quantities 10-19 get 10% off. Quantities ≥ 20 get 20% off.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 12 | <span className="tcs-highlight-out">Output:</span> 540</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int qty = sc.nextInt();
        double total = qty * 50;
        
        // Cascading discount application
        if (qty >= 20) total *= 0.80; // 20% off
        else if (qty >= 10) total *= 0.90; // 10% off
        
        System.out.println((int)total);
    }
}`,
python: `qty = int(input())
total = qty * 50

# Cascading discount
if qty >= 20: total *= 0.80
elif qty >= 10: total *= 0.90

print(int(total))`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int qty; cin >> qty;
    double total = qty * 50;
    if (qty >= 20) total *= 0.80;
    else if (qty >= 10) total *= 0.90;
    cout << (int)total << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int qty; scanf("%d", &qty);
    double total = qty * 50;
    if (qty >= 20) total *= 0.80;
    else if (qty >= 10) total *= 0.90;
    printf("%d\\n", (int)total);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>29. Solar Net Metering Electricity Bill</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Bill based on Net Units (Consumed - Generated).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> ≤ 0 units = Rs. 0. First 100 net units = Rs. 3/unit. Remaining = Rs. 5/unit.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 350 120 | <span className="tcs-highlight-out">Output:</span> 950</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int net = sc.nextInt() - sc.nextInt();
        
        // Tiered pricing
        if (net <= 0) System.out.println(0);
        else System.out.println(net <= 100 ? net * 3 : 300 + (net - 100) * 5);
    }
}`,
python: `c, g = map(int, input().split())
net = c - g

# Tiered pricing logic
if net <= 0: print(0)
else: print(net * 3 if net <= 100 else 300 + (net - 100) * 5)`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int c, g; cin >> c >> g;
    int net = c - g;
    if (net <= 0) cout << 0 << "\\n";
    else cout << (net <= 100 ? net * 3 : 300 + (net - 100) * 5) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int c, g; scanf("%d %d", &c, &g);
    int net = c - g;
    if (net <= 0) printf("0\\n");
    else printf("%d\\n", net <= 100 ? net * 3 : 300 + (net - 100) * 5);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>30. The BMI Health Categorizer (Decimal Variation)</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate precise BMI and return category.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> BMI = Weight / (Height²).</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 70 1.75 | <span className="tcs-highlight-out">Output:</span> 22.8 NORMAL</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double bmi = sc.nextDouble() / Math.pow(sc.nextDouble(), 2);
        
        // Exact formatting string for 1 decimal
        String fmt = String.format("%.1f ", bmi);
        
        if (bmi < 18.5) System.out.println(fmt + "UNDERWEIGHT");
        else if (bmi < 25.0) System.out.println(fmt + "NORMAL");
        else if (bmi < 30.0) System.out.println(fmt + "OVERWEIGHT");
        else System.out.println(fmt + "OBESE");
    }
}`,
python: `w, h = map(float, input().split())
bmi = w / (h * h)

# Categorize and format
res = "UNDERWEIGHT" if bmi < 18.5 else "NORMAL" if bmi < 25.0 else "OVERWEIGHT" if bmi < 30.0 else "OBESE"
print(f"{bmi:.1f} {res}")`,
cpp: `#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double w, h; cin >> w >> h;
    double bmi = w / (h * h);
    cout << fixed << setprecision(1) << bmi << " ";
    if (bmi < 18.5) cout << "UNDERWEIGHT\\n";
    else if (bmi < 25.0) cout << "NORMAL\\n";
    else if (bmi < 30.0) cout << "OVERWEIGHT\\n";
    else cout << "OBESE\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    double w, h; scanf("%lf %lf", &w, &h);
    double bmi = w / (h * h);
    printf("%.1f ", bmi);
    if (bmi < 18.5) printf("UNDERWEIGHT\\n");
    else if (bmi < 25.0) printf("NORMAL\\n");
    else if (bmi < 30.0) printf("OVERWEIGHT\\n");
    else printf("OBESE\\n");
    return 0;
}`
              }} />
          </div>

          {/* PART 4 */}
          <h2>Part 4: Advanced Scenarios & Penalty Systems</h2>

          <div className="tcs-question">
              <h3>31. Freelance Platform Payout</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate platform service fee tiers. First 10,000 (20%), 10,001-50,000 (10%), &gt;50,000 (0%). Return take-home pay.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 15000 | <span className="tcs-highlight-out">Output:</span> 12500</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), fee = 0;
        
        // Evaluate slab by slab, breaking down the chunk values
        if (a > 50000) fee = 2000 + 4000;
        else if (a > 10000) fee = 2000 + (int)((a - 10000) * 0.10);
        else fee = (int)(a * 0.20);
        
        System.out.println(a - fee);
    }
}`,
python: `a = int(input())

# Evaluate tier slabs
fee = (2000 + 4000) if a > 50000 else (2000 + int((a-10000)*0.1)) if a > 10000 else int(a * 0.2)

print(a - fee)`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int a; cin >> a;
    int fee = (a > 50000) ? 6000 : (a > 10000) ? 2000 + ((a - 10000) * 0.10) : a * 0.20;
    cout << a - fee << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int a; scanf("%d", &a);
    int fee = (a > 50000) ? 6000 : (a > 10000) ? 2000 + ((a - 10000) * 0.10) : a * 0.20;
    printf("%d\\n", a - fee);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>32. The Hotel Room Billing</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate hotel bill. &gt; 3 nights gets 10% room discount. Extra bed = Rs. 500/night (no discount). 12% GST applied to final sum.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 2000 4 1 | <span className="tcs-highlight-out">Output:</span> 10304</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt(), n = sc.nextInt(), b = sc.nextInt();
        
        // 10% discount on rooms only if > 3 nights
        double rmTotal = (n > 3) ? (r * n * 0.9) : (r * n);
        
        // Bed surcharge (no discount) + 12% GST
        System.out.println((int)((rmTotal + (b == 1 ? 500 * n : 0)) * 1.12));
    }
}`,
python: `r, n, b = map(int, input().split())

# Apply 10% room discount
rm = (r * n * 0.9) if n > 3 else (r * n)

# 12% GST on Room + Extra Bed total
print(int((rm + (500 * n if b == 1 else 0)) * 1.12))`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int r, n, b; cin >> r >> n >> b;
    double rm = (n > 3) ? (r * n * 0.9) : (r * n);
    cout << (int)((rm + (b == 1 ? 500 * n : 0)) * 1.12) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int r, n, b; scanf("%d %d %d", &r, &n, &b);
    double rm = (n > 3) ? (r * n * 0.9) : (r * n);
    printf("%d\\n", (int)((rm + (b == 1 ? 500 * n : 0)) * 1.12));
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>33. Traffic Speeding Ticket</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate speeding fines based on threshold limits.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> 1-15 over (500), 16-30 over (1000), &gt; 30 over (2000 + <span className="tcs-code-snippet">LICENSE SUSPENDED</span>).</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 60 95 | <span className="tcs-highlight-out">Output:</span> 2000 LICENSE SUSPENDED</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // over = speed - limit
        int over = sc.nextInt() * -1 + sc.nextInt(); 
        
        if (over <= 0) System.out.println("0 NO FINE");
        else if (over <= 15) System.out.println("500");
        else if (over <= 30) System.out.println("1000");
        else System.out.println("2000 LICENSE SUSPENDED");
    }
}`,
python: `l, s = map(int, input().split())
over = s - l

if over <= 0: print("0 NO FINE")
elif over <= 15: print("500")
elif over <= 30: print("1000")
else: print("2000 LICENSE SUSPENDED")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int l, s; cin >> l >> s;
    int over = s - l;
    if (over <= 0) cout << "0 NO FINE\\n";
    else if (over <= 15) cout << "500\\n";
    else if (over <= 30) cout << "1000\\n";
    else cout << "2000 LICENSE SUSPENDED\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int l, s; scanf("%d %d", &l, &s);
    int over = s - l;
    if (over <= 0) printf("0 NO FINE\\n");
    else if (over <= 15) printf("500\\n");
    else if (over <= 30) printf("1000\\n");
    else printf("2000 LICENSE SUSPENDED\\n");
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>34. Mobile Postpaid Bill Calculator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate bill with extra data usage penalties. Extra data = Rs. 20/GB. Flat 18% tax on the sum.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 399 50 55 | <span className="tcs-highlight-out">Output:</span> 588</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int b = sc.nextInt(), l = sc.nextInt(), u = sc.nextInt();
        
        // Math.max avoids negative billing if under limit
        System.out.println((int)((b + Math.max(0, u - l) * 20) * 1.18));
    }
}`,
python: `b, l, u = map(int, input().split())

# Max function prevents negative extra data cost
print(int((b + max(0, u - l) * 20) * 1.18))`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int b, l, u; cin >> b >> l >> u;
    cout << (int)((b + max(0, u - l) * 20) * 1.18) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int b, l, u; scanf("%d %d %d", &b, &l, &u);
    int extra = (u > l) ? u - l : 0;
    printf("%d\\n", (int)((b + extra * 20) * 1.18));
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>35. Bank Fixed Deposit (FD) Maturity</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate Simple Interest maturity. &lt;2 years (5%), 2-5 years (6%), &gt;5 years (7%). Senior citizens get +0.5%.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 10000 3 1 | <span className="tcs-highlight-out">Output:</span> 11950.0</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double p = sc.nextDouble(); int y = sc.nextInt(), s = sc.nextInt();
        
        // Select interest tier
        double r = (y < 2) ? 5.0 : (y <= 5) ? 6.0 : 7.0;
        
        // P + Simple Interest (P*R*T/100). Include senior bonus.
        System.out.println(p + (p * (r + (s == 1 ? 0.5 : 0)) * y) / 100.0);
    }
}`,
python: `p, y, s = map(float, input().split())

# Interest tier selection
r = 5.0 if y < 2 else 6.0 if y <= 5 else 7.0

# Formula: P + (P * R * T) / 100
print(p + (p * (r + (0.5 if s == 1 else 0)) * y) / 100.0)`,
cpp: `#include <iostream>
using namespace std;
int main() {
    double p; int y, s; cin >> p >> y >> s;
    double r = (y < 2) ? 5.0 : (y <= 5) ? 6.0 : 7.0;
    cout << p + (p * (r + (s == 1 ? 0.5 : 0)) * y) / 100.0 << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    double p; int y, s; scanf("%lf %d %d", &p, &y, &s);
    double r = (y < 2) ? 5.0 : (y <= 5) ? 6.0 : 7.0;
    printf("%.1f\\n", p + (p * (r + (s == 1 ? 0.5 : 0)) * y) / 100.0);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>36. Grocery Store Loyalty Points</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> 1 point = Rs. 1. Max redemption capped at 20% of bill. Return points used and final bill.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 2000 500 | <span className="tcs-highlight-out">Output:</span> 400 1600</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int bill = sc.nextInt(), pts = sc.nextInt();
        
        // We can only use min between pts available vs 20% cap
        int used = Math.min(pts, (int)(bill * 0.20));
        
        System.out.println(used + " " + (bill - used));
    }
}`,
python: `bill, pts = map(int, input().split())

# We can only use min between pts available vs 20% cap
used = min(pts, int(bill * 0.20))

print(f"{used} {bill - used}")`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int bill, pts; cin >> bill >> pts;
    int used = min(pts, (int)(bill * 0.20));
    cout << used << " " << (bill - used) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int bill, pts; scanf("%d %d", &bill, &pts);
    int maxP = bill * 0.20, used = pts < maxP ? pts : maxP;
    printf("%d %d\\n", used, bill - used);
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>37. Airport Baggage Allowance</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Free limit: Checked 15kg, Cabin 7kg. Excess fees: Checked 300/kg, Cabin 500/kg. Total weight &gt; 32kg is <span className="tcs-code-snippet">NOT ALLOWED</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 18 9 | <span className="tcs-highlight-out">Output:</span> 1900</p>
                  <p><span className="tcs-highlight-in">Input:</span> 25 10 | <span className="tcs-highlight-out">Output:</span> NOT ALLOWED</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int c = sc.nextInt(), b = sc.nextInt();
        
        if (c + b > 32) System.out.println("NOT ALLOWED"); // Blocked sum
        else System.out.println((Math.max(0, c - 15) * 300) + (Math.max(0, b - 7) * 500));
    }
}`,
python: `c, b = map(int, input().split())

if c + b > 32:
    print("NOT ALLOWED") # Blocked sum
else:
    # Use max to zero out negative excess amounts
    print((max(0, c - 15) * 300) + (max(0, b - 7) * 500))`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int c, b; cin >> c >> b;
    if (c + b > 32) cout << "NOT ALLOWED\\n";
    else cout << (max(0, c - 15) * 300) + (max(0, b - 7) * 500) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int c, b; scanf("%d %d", &c, &b);
    if (c + b > 32) printf("NOT ALLOWED\\n");
    else {
        int eC = c > 15 ? c - 15 : 0, eB = b > 7 ? b - 7 : 0;
        printf("%d\\n", (eC * 300) + (eB * 500));
    }
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>38. Car Rental Agency</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Base daily rate by type. 100km/day free limit. Extra distance = Rs. 10/km.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 2 3 350 | <span className="tcs-highlight-out">Output:</span> 5000</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt(), d = sc.nextInt(), dist = sc.nextInt();
        
        // Base rate * days + Excess distance cost
        System.out.println(((t == 1 ? 1000 : 1500) * d) + (Math.max(0, dist - (d * 100)) * 10));
    }
}`,
python: `t, d, dist = map(int, input().split())

# Base rate * days + Excess distance cost
print(((1000 if t == 1 else 1500) * d) + (max(0, dist - (d * 100)) * 10))`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int t, d, dist; cin >> t >> d >> dist;
    cout << (((t == 1 ? 1000 : 1500) * d) + (max(0, dist - (d * 100)) * 10)) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int t, d, dist; scanf("%d %d %d", &t, &d, &dist);
    int extra = dist - (d * 100);
    printf("%d\\n", ((t == 1 ? 1000 : 1500) * d) + ((extra > 0 ? extra : 0) * 10));
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>39. Online Food Delivery Weather Surge</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Base delivery varies by distance. Bill ≥ 500 waives base delivery. Weather 2 (Rain) adds Rs. 20 surge regardless of waivers.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 600 8 2 | <span className="tcs-highlight-out">Output:</span> 620</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int bill = sc.nextInt(), dist = sc.nextInt(), w = sc.nextInt();
        
        // Base Delivery Waived if >= 500. Weather surge (w==2) applied unconditionally
        System.out.println(bill + (bill < 500 ? (dist <= 5 ? 30 : 50) : 0) + (w == 2 ? 20 : 0));
    }
}`,
python: `bill, dist, w = map(int, input().split())

# Base Delivery Waived if >= 500. Weather surge (w==2) applied unconditionally
print(bill + (0 if bill >= 500 else (30 if dist <= 5 else 50)) + (20 if w == 2 else 0))`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int bill, dist, w; cin >> bill >> dist >> w;
    cout << bill + (bill < 500 ? (dist <= 5 ? 30 : 50) : 0) + (w == 2 ? 20 : 0) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int bill, dist, w; scanf("%d %d %d", &bill, &dist, &w);
    printf("%d\\n", bill + (bill < 500 ? (dist <= 5 ? 30 : 50) : 0) + (w == 2 ? 20 : 0));
    return 0;
}`
              }} />
          </div>

          <div className="tcs-question">
              <h3>40. Event Ticket Early Bird</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Dynamic event pricing. &gt;30 days (20% off), 15-30 days (10% off). Day 0 (10% penalty markup). Flat 5% platform fee calculated on the base price.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> 1000 40 | <span className="tcs-highlight-out">Output:</span> 850</p>
              </div>
              <CodeBlock solutions={{
java: `import java.util.Scanner;
public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int b = sc.nextInt(), d = sc.nextInt();
        
        // Discount/Penalty logic structure
        double p = (d > 30) ? b * 0.8 : (d >= 15) ? b * 0.9 : (d == 0) ? b * 1.1 : b;
        
        // Fee is always 5% of base
        System.out.println((int)(p + (b * 0.05)));
    }
}`,
python: `b, d = map(int, input().split())

# Discount/Penalty logic structure
p = b * 0.8 if d > 30 else b * 0.9 if d >= 15 else b * 1.1 if d == 0 else b

# Fee is always 5% of base
print(int(p + (b * 0.05)))`,
cpp: `#include <iostream>
using namespace std;
int main() {
    int b, d; cin >> b >> d;
    double p = (d > 30) ? b * 0.8 : (d >= 15) ? b * 0.9 : (d == 0) ? b * 1.1 : b;
    cout << (int)(p + (b * 0.05)) << "\\n";
    return 0;
}`,
c: `#include <stdio.h>
int main() {
    int b, d; scanf("%d %d", &b, &d);
    double p = (d > 30) ? b * 0.8 : (d >= 15) ? b * 0.9 : (d == 0) ? b * 1.1 : b;
    printf("%d\\n", (int)(p + (b * 0.05)));
    return 0;
}`
              }} />
          </div>

        </div>
      </div>
    </div>
  );
}