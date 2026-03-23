import React, { useState } from 'react';

// Reusable CodeBlock component with simple syntax highlighting and copy functionality
const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Updated regex to include Scanner, import, and java utilities for syntax highlighting
  const highlightCode = (text) => {
    const parts = text.split(/(\/\/.*|\".*?\"|\b(?:public|private|static|void|int|double|float|boolean|char|return|if|else|while|for|class|String|Math|System|out|println|print|printf|import|java|util|Scanner|new)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
    
    return parts.map((part, idx) => {
      if (part.startsWith('//')) return <span key={idx} className="tcs-syn-comment">{part}</span>;
      if (part.startsWith('"')) return <span key={idx} className="tcs-syn-string">{part}</span>;
      if (['public','private','static','void','return','if','else','while','for','class','import','new'].includes(part)) return <span key={idx} className="tcs-syn-keyword">{part}</span>;
      if (['int','double','float','boolean','char','String','Scanner','Math','System'].includes(part)) return <span key={idx} className="tcs-syn-type">{part}</span>;
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
          <div className="tcs-editor-header">
            <span className="tcs-editor-lang">TCS NQT Java Environment (MyClass)</span>
            <button className="tcs-copy-btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy to IDE'}
            </button>
          </div>
          <pre className="tcs-editor-content">
            <code>{highlightCode(code.trim())}</code>
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

        .tcs-notebook::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 70px;
            width: 2px;
            background-color: var(--margin-line);
            z-index: 1;
        }

        .tcs-notebook::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 76px;
            width: 2px;
            background-color: var(--margin-line);
            z-index: 1;
        }

        .tcs-content {
            position: relative;
            z-index: 2;
        }

        .tcs-notebook h1 {
            font-family: 'Kalam', cursive;
            font-size: 3rem;
            color: var(--ink-blue);
            text-align: center;
            margin-top: 0;
            margin-bottom: 10px;
            text-decoration: underline wavy var(--ink-red);
            line-height: 1.2;
        }

        .tcs-subtitle {
            text-align: center;
            font-size: 1.4rem;
            color: var(--ink-black);
            margin-bottom: 50px;
            font-weight: bold;
        }

        .tcs-notebook h2 {
            font-family: 'Caveat', cursive;
            font-size: 2.5rem;
            color: var(--ink-red);
            border-bottom: 2px dashed var(--ink-red);
            padding-bottom: 5px;
            margin-top: 50px;
            margin-bottom: 20px;
            line-height: 1.1;
        }

        .tcs-notebook h3 {
            font-family: 'Kalam', cursive;
            font-size: 1.8rem;
            color: var(--ink-blue);
            margin-top: 40px;
            margin-bottom: 10px;
            line-height: 1.2;
        }

        .tcs-notebook p {
            font-size: 1.35rem;
            margin: 5px 0;
            word-wrap: break-word;
        }

        .tcs-notebook ul {
            margin-top: 0;
            margin-bottom: 10px;
            padding-left: 25px;
            list-style-type: square;
            font-size: 1.35rem;
        }

        .tcs-notebook li {
            margin-bottom: 5px;
        }

        .tcs-label-statement, .tcs-label-math, .tcs-label-test, .tcs-label-solution { 
            font-weight: bold; 
            font-family: 'Caveat', cursive; 
            font-size: 1.6rem;
        }
        .tcs-label-statement { color: var(--ink-black); }
        .tcs-label-math { color: var(--ink-purple); }
        .tcs-label-test { color: var(--ink-red); }
        .tcs-label-solution { display: none !important; }
        
        .tcs-code-snippet {
            background-color: rgba(0,0,0,0.05);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 1.1rem;
            color: var(--ink-green);
            font-weight: bold;
        }

        .tcs-test-case-box {
            background-color: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(0,0,0,0.1);
            padding: 10px 15px;
            border-radius: 8px;
            margin-top: 5px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
        }

        .tcs-highlight-in { color: #d35400; font-weight: bold; }
        .tcs-highlight-out { color: #27ae60; font-weight: bold; }

        /* Editor Styles */
        .tcs-editor-container {
            background: #1e1e1e;
            border-radius: 8px;
            margin-top: 10px;
            margin-bottom: 25px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            font-family: 'Courier New', monospace;
            line-height: 1.4;
        }
        .tcs-editor-header {
            background: #2d2d2d;
            padding: 8px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #444;
        }
        .tcs-editor-lang {
            color: #d4d4d4;
            font-size: 0.9rem;
            font-weight: bold;
            font-family: sans-serif;
        }
        .tcs-copy-btn {
            background: #4a4a4a;
            border: none;
            color: white;
            padding: 5px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background 0.2s;
            font-family: sans-serif;
        }
        .tcs-copy-btn:hover { background: #5a5a5a; }
        .tcs-editor-content {
            padding: 15px;
            margin: 0;
            color: #d4d4d4;
            font-size: 1.05rem;
            overflow-x: auto;
            white-space: pre;
            tab-size: 4;
        }
        .tcs-syn-comment { color: #6a9955; font-style: italic; }
        .tcs-syn-keyword { color: #c586c0; font-weight: bold; }
        .tcs-syn-string { color: #ce9178; }
        .tcs-syn-number { color: #b5cea8; }
        .tcs-syn-type { color: #4ec9b0; }

        /* Toggle Button Styles */
        .tcs-solution-wrapper {
            margin-top: 15px;
        }
        .tcs-toggle-btn {
            background-color: transparent;
            color: var(--ink-blue);
            border: 2px dashed var(--ink-blue);
            padding: 8px 16px;
            border-radius: 8px;
            font-family: 'Kalam', cursive;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            margin-bottom: 15px;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .tcs-toggle-btn:hover {
            background-color: rgba(0, 48, 143, 0.05);
            transform: translateY(-2px);
            box-shadow: 2px 4px 8px rgba(0,0,0,0.1);
        }
        .tcs-fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
            .tcs-notebook {
                padding: 30px 20px 50px 50px;
            }
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
                  <p><span className="tcs-highlight-in">Input:</span> H = 3, M = 0 | <span className="tcs-highlight-out">Output:</span> ANGLE: 90.0</p>
                  <p><span className="tcs-highlight-in">Input:</span> H = 12, M = 15 | <span className="tcs-highlight-out">Output:</span> ANGLE: 82.5</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        int m = sc.nextInt();
        
        // Input validation
        if (h < 1 || h > 12 || m < 0 || m > 59) {
            System.out.println("INVALID TIME");
            return;
        }
        
        // Handle 12 o'clock edge case
        if (h == 12) h = 0;
        
        // Hour hand moves 30 deg/hr + 0.5 deg/min
        double hAngle = (h * 30) + (m * 0.5);
        // Minute hand moves 6 deg/min
        double mAngle = m * 6;
        
        // Absolute difference
        double angle = Math.abs(hAngle - mAngle);
        
        // Shortest angle cannot be more than 180
        angle = Math.min(angle, 360 - angle);
        
        System.out.println("ANGLE: " + angle);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>2. The Vending Machine Change (Greedy Math)</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> A vending machine accepts high-denomination bills but must return exact change using the minimum number of coins. The machine has coins of ₹10, ₹5, ₹2, and ₹1.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Take Item Price and Amount Paid as input. If Amount Paid &lt; Item Price, print <span className="tcs-code-snippet">INSUFFICIENT FUNDS</span>. Otherwise, calculate the exact number of each coin needed for the change using <span className="tcs-code-snippet">/</span> (division) and <span className="tcs-code-snippet">%</span> (modulo) operators.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Price = 35, Paid = 100 | <span className="tcs-highlight-out">Output:</span> CHANGE: 65 | 10s: 6, 5s: 1, 2s: 0, 1s: 0</p>
                  <p><span className="tcs-highlight-in">Input:</span> Price = 42, Paid = 50 | <span className="tcs-highlight-out">Output:</span> CHANGE: 8 | 10s: 0, 5s: 1, 2s: 1, 1s: 1</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int paid = sc.nextInt();
        
        if (paid < price) {
            System.out.println("INSUFFICIENT FUNDS");
            return;
        }
        
        int change = paid - price;
        System.out.print("CHANGE: " + change + " | ");
        
        // Greedy approach using integer division and modulo
        int tens = change / 10;
        change %= 10;
        
        int fives = change / 5;
        change %= 5;
        
        int twos = change / 2;
        change %= 2;
        
        int ones = change; // Remaining is 1s
        
        System.out.printf("10s: %d, 5s: %d, 2s: %d, 1s: %d\\n", tens, fives, twos, ones);
    }
}`} />
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
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int code = sc.nextInt();
        
        if (code < 100 || code > 999) {
            System.out.println("INVALID FORMAT");
            return;
        }
        
        // Extract digits mathematically without loops
        int hundreds = code / 100;
        int tens = (code / 10) % 10;
        int units = code % 10;
        
        // Cube and sum
        int sum = (hundreds * hundreds * hundreds) + 
                  (tens * tens * tens) + 
                  (units * units * units);
                  
        if (sum == code) {
            System.out.println("VAULT OPEN");
        } else {
            System.out.println("VAULT CLOSED");
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> R = 5, X = 3, Y = 4 | <span className="tcs-highlight-out">Output:</span> BOUNDARY HIT</p>
                  <p><span className="tcs-highlight-in">Input:</span> R = 10, X = 2, Y = 2 | <span className="tcs-highlight-out">Output:</span> BULLSEYE</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int x = sc.nextInt();
        int y = sc.nextInt();
        
        // Calculate squared distance to avoid floating point precision issues with Math.sqrt
        int distanceSquared = (x * x) + (y * y);
        int radiusSquared = r * r;
        
        if (distanceSquared < radiusSquared) {
            System.out.println("BULLSEYE");
        } else if (distanceSquared == radiusSquared) {
            System.out.println("BOUNDARY HIT");
        } else {
            System.out.println("MISSED");
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> L = 10, W = 10, H = 10 | <span className="tcs-highlight-out">Output:</span> TOTAL COST: 5325</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int l = sc.nextInt();
        int w = sc.nextInt();
        int h = sc.nextInt();
        
        // Formula: 2 * Height * (Length + Width)
        int totalWallArea = 2 * h * (l + w);
        
        // Deduct exclusions
        int doorArea = 21;
        int windowArea = 12 * 2;
        int paintableArea = totalWallArea - doorArea - windowArea;
        
        if (paintableArea <= 0 || l <= 0 || w <= 0 || h <= 0) {
            System.out.println("INVALID DIMENSIONS");
        } else {
            int cost = paintableArea * 15;
            System.out.println("TOTAL COST: " + cost);
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> Weight = 70, Height = 175 | <span className="tcs-highlight-out">Output:</span> BMI: 22.8 NORMAL WEIGHT</p>
                  <p><span className="tcs-highlight-in">Input:</span> Weight = 90, Height = 160 | <span className="tcs-highlight-out">Output:</span> BMI: 35.1 OBESE</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double weight = sc.nextDouble();
        double heightCm = sc.nextDouble();
        
        // Convert to meters
        double heightM = heightCm / 100.0;
        double bmi = weight / (heightM * heightM);
        
        // Format to 1 decimal place
        System.out.printf("BMI: %.1f ", bmi);
        
        if (bmi < 18.5) {
            System.out.println("UNDERWEIGHT");
        } else if (bmi < 25.0) {
            System.out.println("NORMAL WEIGHT");
        } else if (bmi < 30.0) {
            System.out.println("OVERWEIGHT");
        } else {
            System.out.println("OBESE");
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> a = 3, b = 4, c = 5 | <span className="tcs-highlight-out">Output:</span> SCALENE</p>
                  <p><span className="tcs-highlight-in">Input:</span> a = 1, b = 2, c = 5 | <span className="tcs-highlight-out">Output:</span> NOT A TRIANGLE</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        
        // Triangle Inequality Theorem
        if ((a + b > c) && (a + c > b) && (b + c > a)) {
            // Valid triangle, check type
            if (a == b && b == c) {
                System.out.println("EQUILATERAL");
            } else if (a == b || b == c || a == c) {
                System.out.println("ISOSCELES");
            } else {
                System.out.println("SCALENE");
            }
        } else {
            System.out.println("NOT A TRIANGLE");
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> Price = 6000, Type = Electronics | <span className="tcs-highlight-out">Output:</span> FINAL AMOUNT: 5782.0</p>
                  <p><span className="tcs-highlight-in">Input:</span> Price = 1000, Type = Clothing | <span className="tcs-highlight-out">Output:</span> FINAL AMOUNT: 944.0</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double price = sc.nextDouble();
        String type = sc.next();
        
        // 1. Apply category discount
        if (type.equals("Clothing")) {
            price = price * 0.80; // 20% off
        } else if (type.equals("Electronics")) {
            price = price * 0.90; // 10% off
        }
        
        // 2. Apply VIP discount if subtotal > 5000
        if (price > 5000) {
            price -= 500;
        }
        
        // 3. Add 18% GST
        double finalAmount = price * 1.18;
        
        System.out.println("FINAL AMOUNT: " + finalAmount);
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> H1=4, M1=45, H2=3, M2=30 | <span className="tcs-highlight-out">Output:</span> STANDARD SHIFT: 8 HRS 15 MINS</p>
                  <p><span className="tcs-highlight-in">Input:</span> H1=5, M1=50, H2=4, M2=20 | <span className="tcs-highlight-out">Output:</span> OVERTIME LOGGED: 10 HRS 10 MINS</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h1 = sc.nextInt();
        int m1 = sc.nextInt();
        int h2 = sc.nextInt();
        int m2 = sc.nextInt();
        
        // Sum total minutes to handle rollover
        int totalMinutes = m1 + m2;
        int extraHours = totalMinutes / 60;
        int finalMinutes = totalMinutes % 60;
        
        int finalHours = h1 + h2 + extraHours;
        
        if (finalHours > 8) {
            System.out.printf("OVERTIME LOGGED: %d HRS %d MINS\\n", finalHours, finalMinutes);
        } else {
            System.out.printf("STANDARD SHIFT: %d HRS %d MINS\\n", finalHours, finalMinutes);
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> Temp = 212, Scale = F | <span className="tcs-highlight-out">Output:</span> BOILING ALARM</p>
                  <p><span className="tcs-highlight-in">Input:</span> Temp = -5, Scale = C | <span className="tcs-highlight-out">Output:</span> FREEZING ALARM</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double temp = sc.nextDouble();
        char scale = sc.next().charAt(0);
        
        // Normalize to Celsius
        double celsius = temp;
        if (scale == 'F') {
            celsius = (temp - 32) * 5.0 / 9.0;
        }
        
        // Check thresholds
        if (celsius < 0) {
            System.out.println("FREEZING ALARM");
        } else if (celsius > 100) {
            System.out.println("BOILING ALARM");
        } else {
            System.out.println("NORMAL OPERATION");
        }
    }
}`} />
          </div>

          {/* PART 2 */}
          <h2>Part 2: System & Enterprise Logic</h2>

          <div className="tcs-question">
              <h3>11. Data Grid Pagination Engine</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate the starting record index for a requested page in a data grid component. First page is Page 1 (index 0).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Calculate total pages required. If requested page is &lt; 1 or &gt; total pages, print <span className="tcs-code-snippet">OUT OF BOUNDS</span>. Otherwise, print <span className="tcs-code-snippet">INDEX: &lt;value&gt;</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Total = 55, Size = 10, Page = 6 | <span className="tcs-highlight-out">Output:</span> INDEX: 50</p>
                  <p><span className="tcs-highlight-in">Input:</span> Total = 50, Size = 10, Page = 6 | <span className="tcs-highlight-out">Output:</span> OUT OF BOUNDS</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int size = sc.nextInt();
        int page = sc.nextInt();
        
        // Calculate total pages using integer math (ceil equivalent)
        // (total + size - 1) / size guarantees rounding up
        int totalPages = (total + size - 1) / size;
        
        if (page < 1 || page > totalPages) {
            System.out.println("OUT OF BOUNDS");
        } else {
            // Arrays and DB offsets are 0-indexed
            int startIndex = (page - 1) * size;
            System.out.println("INDEX: " + startIndex);
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> Dist = 500, Speed = 200, Proc = 45 | <span className="tcs-highlight-out">Output:</span> ACCEPTABLE: 50ms</p>
                  <p><span className="tcs-highlight-in">Input:</span> Dist = 1000, Speed = 100, Proc = 10 | <span className="tcs-highlight-out">Output:</span> EXCELLENT: 30ms</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int dist = sc.nextInt();
        int speed = sc.nextInt();
        int proc = sc.nextInt();
        
        // Latency = Round trip time + processing time
        // Note: Make sure division uses double to avoid integer truncation
        int travelTime = (int)((2.0 * dist / speed)); 
        int latency = travelTime + proc;
        
        if (latency < 50) {
            System.out.println("EXCELLENT: " + latency + "ms");
        } else if (latency <= 150) {
            System.out.println("ACCEPTABLE: " + latency + "ms");
        } else {
            System.out.println("POOR ROUTING: " + latency + "ms");
        }
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>13. Server Memory Allocation</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate the maximum number of identical containers a server can host, and the leftover RAM.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Given TotalRAM and ContainerSize. If leftover RAM &lt; 100 MB, prefix output with <span className="tcs-code-snippet">WARNING: LOW OVERHEAD |</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Total = 4000, Size = 1024 | <span className="tcs-highlight-out">Output:</span> WARNING: LOW OVERHEAD | COUNT: 3, LEFT: 928</p>
                  <p><span className="tcs-highlight-in">Input:</span> Total = 8192, Size = 2000 | <span className="tcs-highlight-out">Output:</span> COUNT: 4, LEFT: 192</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalRam = sc.nextInt();
        int containerSize = sc.nextInt();
        
        int maxContainers = totalRam / containerSize;
        int leftoverRam = totalRam % containerSize;
        
        String prefix = "";
        // Less than 100MB is dangerous overhead for OS
        if (leftoverRam < 100) {
            prefix = "WARNING: LOW OVERHEAD | ";
        }
        
        System.out.println(prefix + "COUNT: " + maxContainers + ", LEFT: " + leftoverRam);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>14. Keyboard Shortcut Combinatorics</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate total unique 2-key combinations from N available keys. Order does not matter.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Formula: (N * (N - 1)) / 2. If total &lt; 50, output <span className="tcs-code-snippet">NEED MORE KEYS</span>. Otherwise, print <span className="tcs-code-snippet">TOTAL COMBINATIONS: &lt;value&gt;</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> N = 10 | <span className="tcs-highlight-out">Output:</span> NEED MORE KEYS</p>
                  <p><span className="tcs-highlight-in">Input:</span> N = 15 | <span className="tcs-highlight-out">Output:</span> TOTAL COMBINATIONS: 105</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // Selecting 2 items from N where order doesn't matter is N choose 2
        // Formula: nCr = n! / (r! * (n-r)!) -> For r=2: N * (N - 1) / 2
        int combinations = (n * (n - 1)) / 2;
        
        if (combinations < 50) {
            System.out.println("NEED MORE KEYS");
        } else {
            System.out.println("TOTAL COMBINATIONS: " + combinations);
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> a=1, b=-4, c=4 | <span className="tcs-highlight-out">Output:</span> STABLE</p>
                  <p><span className="tcs-highlight-in">Input:</span> a=2, b=3, c=5 | <span className="tcs-highlight-out">Output:</span> SCALE DOWN</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        
        // Discriminant dictates nature of roots
        int discriminant = (b * b) - (4 * a * c);
        
        if (discriminant > 0) {
            System.out.println("SCALE UP");
        } else if (discriminant == 0) {
            System.out.println("STABLE");
        } else {
            System.out.println("SCALE DOWN");
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> x1=2, y1=4, x2=6, y2=1 | <span className="tcs-highlight-out">Output:</span> REMOTE RACK: 7</p>
                  <p><span className="tcs-highlight-in">Input:</span> x1=5, y1=5, x2=6, y2=6 | <span className="tcs-highlight-out">Output:</span> SAME RACK: 2</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x1 = sc.nextInt();
        int y1 = sc.nextInt();
        int x2 = sc.nextInt();
        int y2 = sc.nextInt();
        
        // Manhattan Distance is sum of absolute differences 
        // (moving only horizontally and vertically on a grid)
        int distance = Math.abs(x2 - x1) + Math.abs(y2 - y1);
        
        if (distance <= 3) {
            System.out.println("SAME RACK: " + distance);
        } else {
            System.out.println("REMOTE RACK: " + distance);
        }
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>17. UI Image Aspect Ratio Preserver</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate a new target height for an image to fit a mobile screen while strictly preserving the aspect ratio.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Truncate decimals. If calculated height &gt; 1080, print <span className="tcs-code-snippet">EXCEEDS MAX RESOLUTION</span>. Otherwise, <span className="tcs-code-snippet">NEW DIMENSIONS: &lt;W&gt;x&lt;H&gt;</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> OrigW=1920, OrigH=1080, NewW=800 | <span className="tcs-highlight-out">Output:</span> NEW DIMENSIONS: 800x450</p>
                  <p><span className="tcs-highlight-in">Input:</span> OrigW=800, OrigH=1200, NewW=1000 | <span className="tcs-highlight-out">Output:</span> EXCEEDS MAX RESOLUTION</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int origW = sc.nextInt();
        int origH = sc.nextInt();
        int newW = sc.nextInt();
        
        // Ratio = OrigH / OrigW
        // Cast to double to prevent integer truncation during division
        int newH = (int)(origH * ((double)newW / origW));
        
        if (newH > 1080) {
            System.out.println("EXCEEDS MAX RESOLUTION");
        } else {
            System.out.println("NEW DIMENSIONS: " + newW + "x" + newH);
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> Base=500, Attempt=4 | <span className="tcs-highlight-out">Output:</span> DELAY: 4000ms</p>
                  <p><span className="tcs-highlight-in">Input:</span> Base=500, Attempt=5 | <span className="tcs-highlight-out">Output:</span> MAX TIMEOUT CAPPED AT 5000</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int baseDelay = sc.nextInt();
        int attempt = sc.nextInt();
        
        // Math.pow returns double, cast to int
        int delay = (int)(baseDelay * Math.pow(2, attempt - 1));
        
        if (delay > 5000) {
            System.out.println("MAX TIMEOUT CAPPED AT 5000");
        } else {
            System.out.println("DELAY: " + delay + "ms");
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> Records=4500, Time=30 | <span className="tcs-highlight-out">Output:</span> THROUGHPUT NORMAL: 150/sec</p>
                  <p><span className="tcs-highlight-in">Input:</span> Records=150, Time=2 | <span className="tcs-highlight-out">Output:</span> OPTIMIZE QUERY: 75/sec</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int records = sc.nextInt();
        int timeSec = sc.nextInt();
        
        // Integer division truncates decimal, which is expected here
        int throughput = records / timeSec;
        
        if (throughput < 100) {
            System.out.println("OPTIMIZE QUERY: " + throughput + "/sec");
        } else {
            System.out.println("THROUGHPUT NORMAL: " + throughput + "/sec");
        }
    }
}`} />
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
                  <p><span className="tcs-highlight-in">Input:</span> Total=500, Success=380 | <span className="tcs-highlight-out">Output:</span> IP LIKELY BLOCKED: 76%</p>
                  <p><span className="tcs-highlight-in">Input:</span> Total=100, Success=100 | <span className="tcs-highlight-out">Output:</span> PERFECT RUN</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int success = sc.nextInt();
        
        // Multiply by 100.0 before dividing to ensure floating point math
        // Then cast back to int to get integer percentage
        int rate = (int)((success * 100.0) / total);
        
        if (rate == 100) {
            System.out.println("PERFECT RUN");
        } else if (rate >= 80) {
            System.out.println("PARTIAL SUCCESS: " + rate + "%");
        } else {
            System.out.println("IP LIKELY BLOCKED: " + rate + "%");
        }
    }
}`} />
          </div>

          {/* PART 3 */}
          <h2>Part 3: Everyday Business Scenarios</h2>

          <div className="tcs-question">
              <h3>21. The Cinema Ticket Counter</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate multiplex ticket price.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Class 1 (Rs. 150), Class 2 (Rs. 250). Weekend adds flat Rs. 50. VIP card gives 10% discount on final total.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Class=2, Weekend=1, VIP=1 | <span className="tcs-highlight-out">Output:</span> 270</p>
                  <p><span className="tcs-highlight-in">Input:</span> Class=1, Weekend=0, VIP=0 | <span className="tcs-highlight-out">Output:</span> 150</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int tClass = sc.nextInt();
        int isWeekend = sc.nextInt();
        int isVip = sc.nextInt();
        
        int basePrice = (tClass == 1) ? 150 : 250;
        
        if (isWeekend == 1) {
            basePrice += 50;
        }
        
        // 10% discount means 90% of base price
        if (isVip == 1) {
            basePrice = (int)(basePrice * 0.90);
        }
        
        System.out.println(basePrice);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>22. Train Ticket Cancellation Refund</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate train cancellation refund based on days left.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> &gt; 10 days (90%), 5-10 days (75%), &lt; 5 days (50%), 0 days (0%).</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Fare=1000, Days=7 | <span className="tcs-highlight-out">Output:</span> 750</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int fare = sc.nextInt();
        int days = sc.nextInt();
        int refund = 0;
        
        // Cascade downwards catching the ranges
        if (days > 10) {
            refund = (int)(fare * 0.90);
        } else if (days >= 5) {
            // >= 5 covers the 5 to 10 range due to previous if statement
            refund = (int)(fare * 0.75);
        } else if (days > 0) {
            refund = (int)(fare * 0.50);
        } else {
            refund = 0;
        }
        
        System.out.println(refund);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>23. The Paint Bucket Calculator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate total whole buckets of paint required for a rectangular wall. 1 bucket = 40 sq ft.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> You cannot buy half a bucket (round up).</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Length=10, Height=10 | <span className="tcs-highlight-out">Output:</span> 3</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int length = sc.nextInt();
        int height = sc.nextInt();
        int area = length * height;
        
        // Math.ceil rounds up to next whole number
        // Division by 40.0 ensures decimal result before rounding
        int buckets = (int)Math.ceil(area / 40.0);
        
        System.out.println(buckets);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>24. The Pizza Ordering System</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate pizza bill. Sizes: 1 (200), 2 (300), 3 (400). Extra cheese = Rs. 50 flat per order. Delivery = Rs. 40, but free if food bill ≥ 500.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Size=2, Qty=2, Cheese=1 | <span className="tcs-highlight-out">Output:</span> 650</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int size = sc.nextInt();
        int qty = sc.nextInt();
        int cheese = sc.nextInt();
        
        // Determine base price using math formulation mapping
        int unitPrice = 100 + (size * 100); 
        int foodBill = unitPrice * qty;
        
        if (cheese == 1) {
            foodBill += 50;
        }
        
        int totalBill = foodBill;
        // Delivery fee applied if foodBill < 500
        if (foodBill < 500) {
            totalBill += 40;
        }
        
        System.out.println(totalBill);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>25. ATM Withdrawal Validator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Validate an ATM request.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Must be a multiple of 100. Max limit = 10,000. Must have sufficient balance.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Bal=15000, Req=4550 | <span className="tcs-highlight-out">Output:</span> INVALID AMOUNT</p>
                  <p><span className="tcs-highlight-in">Input:</span> Bal=5000, Req=2000 | <span className="tcs-highlight-out">Output:</span> TRANSACTION SUCCESSFUL: 3000</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int balance = sc.nextInt();
        int request = sc.nextInt();
        
        // Validation Checks: Divisible by 100, max limit, sufficient balance
        if (request % 100 != 0 || request > 10000 || request > balance) {
            System.out.println("INVALID AMOUNT");
        } else {
            balance -= request;
            System.out.println("TRANSACTION SUCCESSFUL: " + balance);
        }
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>26. Ride-Sharing Fare Calculator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate cab fare. Base: Rs. 50. First 5km: Rs. 10/km. Beyond 5km: Rs. 8/km. Night multiplier: 1.5x.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Dist=8, Night=1 | <span className="tcs-highlight-out">Output:</span> 186</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int dist = sc.nextInt();
        int night = sc.nextInt();
        
        double fare = 50.0; // Base fare
        
        if (dist <= 5) {
            fare += (dist * 10);
        } else {
            fare += (5 * 10) + ((dist - 5) * 8);
        }
        
        if (night == 1) {
            fare *= 1.5;
        }
        
        System.out.println((int)fare);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>27. Courier Box Fitting</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Determine if an upright cylinder fits inside a rectangular box.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> Cylinder diameter ≤ minimum of Box Length and Box Width. Cylinder Height ≤ Box Height.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Cyl_R=5, Cyl_H=10, Box_L=12, Box_W=12, Box_H=15 | <span className="tcs-highlight-out">Output:</span> FITS</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int ch = sc.nextInt();
        int bl = sc.nextInt();
        int bw = sc.nextInt();
        int bh = sc.nextInt();
        
        int diameter = r * 2;
        
        // Diameter must fit within BOTH length and width bounds of box
        // Cylinder height must be less than box height
        if (diameter <= bl && diameter <= bw && ch <= bh) {
            System.out.println("FITS");
        } else {
            System.out.println("DOES NOT FIT");
        }
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>28. The Book Store Bulk Discount</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Notebooks cost Rs. 50. Quantities 10-19 get 10% off. Quantities ≥ 20 get 20% off.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Qty=12 | <span className="tcs-highlight-out">Output:</span> 540</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int qty = sc.nextInt();
        
        int unitPrice = 50;
        double total = qty * unitPrice;
        
        if (qty >= 20) {
            total *= 0.80; // 20% off
        } else if (qty >= 10) {
            total *= 0.90; // 10% off
        }
        
        System.out.println((int)total);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>29. Solar Net Metering Electricity Bill</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Bill based on Net Units (Consumed - Generated).</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> ≤ 0 units = Rs. 0. First 100 net units = Rs. 3/unit. Remaining = Rs. 5/unit.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Consumed=350, Generated=120 | <span className="tcs-highlight-out">Output:</span> 950</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int consumed = sc.nextInt();
        int generated = sc.nextInt();
        
        int netUnits = consumed - generated;
        int bill = 0;
        
        if (netUnits > 0) {
            if (netUnits <= 100) {
                bill = netUnits * 3;
            } else {
                // First 100 at Rs 3, remaining at Rs 5
                bill = (100 * 3) + ((netUnits - 100) * 5);
            }
        }
        // If netUnits <= 0, bill remains 0
        
        System.out.println(bill);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>30. The BMI Health Categorizer (Decimal Variation)</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate precise BMI and return category.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> BMI = Weight / (Height²).</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Weight=70, Height=1.75 | <span className="tcs-highlight-out">Output:</span> 22.8 NORMAL</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double w = sc.nextDouble();
        double h = sc.nextDouble(); // h is already in meters
        
        double bmi = w / (h * h);
        
        // Extract 1 decimal precision format
        String formatBmi = String.format("%.1f ", bmi);
        
        if (bmi < 18.5) System.out.println(formatBmi + "UNDERWEIGHT");
        else if (bmi < 25.0) System.out.println(formatBmi + "NORMAL");
        else if (bmi < 30.0) System.out.println(formatBmi + "OVERWEIGHT");
        else System.out.println(formatBmi + "OBESE");
    }
}`} />
          </div>

          {/* PART 4 */}
          <h2>Part 4: Advanced Scenarios & Penalty Systems</h2>

          <div className="tcs-question">
              <h3>31. Freelance Platform Payout</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate platform service fee tiers. First 10,000 (20%), 10,001-50,000 (10%), &gt;50,000 (0%). Return take-home pay.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Amount=15000 | <span className="tcs-highlight-out">Output:</span> 12500</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int amt = sc.nextInt();
        int fee = 0;
        
        // Evaluate slab by slab
        if (amt > 50000) {
            fee += (10000 * 0.20) + (40000 * 0.10);
        } else if (amt > 10000) {
            fee += (10000 * 0.20) + ((amt - 10000) * 0.10);
        } else {
            fee += (amt * 0.20);
        }
        
        int takeHome = amt - fee;
        System.out.println(takeHome);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>32. The Hotel Room Billing</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate hotel bill. &gt; 3 nights gets 10% room discount. Extra bed = Rs. 500/night (no discount). 12% GST applied to final sum.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Rate=2000, Nights=4, Bed=1 | <span className="tcs-highlight-out">Output:</span> 10304</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rate = sc.nextInt();
        int nights = sc.nextInt();
        int bed = sc.nextInt();
        
        double roomTotal = rate * nights;
        if (nights > 3) {
            roomTotal *= 0.90; // Apply 10% discount to room only
        }
        
        double bedTotal = (bed == 1) ? 500 * nights : 0;
        
        double subtotal = roomTotal + bedTotal;
        int finalBill = (int)(subtotal * 1.12); // Add 12% GST
        
        System.out.println(finalBill);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>33. Traffic Speeding Ticket</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate speeding fines based on threshold limits.</p>
              <p><span className="tcs-label-math">Math & Conditions:</span> 1-15 over (500), 16-30 over (1000), &gt; 30 over (2000 + <span className="tcs-code-snippet">LICENSE SUSPENDED</span>).</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Limit=60, Speed=95 | <span className="tcs-highlight-out">Output:</span> 2000 LICENSE SUSPENDED</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int limit = sc.nextInt();
        int speed = sc.nextInt();
        
        int over = speed - limit;
        if (over <= 0) {
            System.out.println("0 NO FINE");
        } else if (over <= 15) {
            System.out.println("500");
        } else if (over <= 30) {
            System.out.println("1000");
        } else {
            System.out.println("2000 LICENSE SUSPENDED");
        }
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>34. Mobile Postpaid Bill Calculator</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate bill with extra data usage penalties. Extra data = Rs. 20/GB. Flat 18% tax on the sum.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Base=399, Limit=50, Used=55 | <span className="tcs-highlight-out">Output:</span> 588</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int base = sc.nextInt();
        int limit = sc.nextInt();
        int used = sc.nextInt();
        
        // Math.max ensures we don't calculate negative overage if used < limit
        int extraData = Math.max(0, used - limit);
        int subtotal = base + (extraData * 20);
        
        int finalBill = (int)(subtotal * 1.18);
        System.out.println(finalBill);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>35. Bank Fixed Deposit (FD) Maturity</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Calculate Simple Interest maturity. &lt;2 years (5%), 2-5 years (6%), &gt;5 years (7%). Senior citizens get +0.5%.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Prin=10000, Yrs=3, Senior=1 | <span className="tcs-highlight-out">Output:</span> 11950.0</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double p = sc.nextDouble();
        int yrs = sc.nextInt();
        int senior = sc.nextInt();
        
        double rate;
        if (yrs < 2) rate = 5.0;
        else if (yrs <= 5) rate = 6.0;
        else rate = 7.0;
        
        if (senior == 1) {
            rate += 0.5;
        }
        
        // Simple interest: PRT / 100
        double interest = (p * rate * yrs) / 100.0;
        double maturity = p + interest;
        
        System.out.println(maturity);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>36. Grocery Store Loyalty Points</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> 1 point = Rs. 1. Max redemption capped at 20% of bill. Return points used and final bill.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Bill=2000, Pts=500 | <span className="tcs-highlight-out">Output:</span> 400 1600</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int bill = sc.nextInt();
        int pts = sc.nextInt();
        
        int maxRedeemable = (int)(bill * 0.20);
        
        // We can only use the minimum between available pts and max redeemable
        int pointsUsed = Math.min(pts, maxRedeemable);
        
        int finalBill = bill - pointsUsed;
        
        System.out.println(pointsUsed + " " + finalBill);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>37. Airport Baggage Allowance</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Free limit: Checked 15kg, Cabin 7kg. Excess fees: Checked 300/kg, Cabin 500/kg. Total weight &gt; 32kg is <span className="tcs-code-snippet">NOT ALLOWED</span>.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Checked=18, Cabin=9 | <span className="tcs-highlight-out">Output:</span> 1900</p>
                  <p><span className="tcs-highlight-in">Input:</span> Checked=25, Cabin=10 | <span className="tcs-highlight-out">Output:</span> NOT ALLOWED</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int checked = sc.nextInt();
        int cabin = sc.nextInt();
        
        if (checked + cabin > 32) {
            System.out.println("NOT ALLOWED");
            return;
        }
        
        int excessChecked = Math.max(0, checked - 15);
        int excessCabin = Math.max(0, cabin - 7);
        
        int fees = (excessChecked * 300) + (excessCabin * 500);
        System.out.println(fees);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>38. Car Rental Agency</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Base daily rate by type. 100km/day free limit. Extra distance = Rs. 10/km.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Type=2, Days=3, Dist=350 | <span className="tcs-highlight-out">Output:</span> 5000</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int type = sc.nextInt();
        int days = sc.nextInt();
        int dist = sc.nextInt();
        
        // Assume Type 1: 1000, Type 2: 1500 per day
        int dailyRate = (type == 1) ? 1000 : 1500;
        int baseCost = dailyRate * days;
        
        int freeLimit = days * 100;
        int extraDist = Math.max(0, dist - freeLimit);
        
        int totalBill = baseCost + (extraDist * 10);
        System.out.println(totalBill);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>39. Online Food Delivery Weather Surge</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Base delivery varies by distance. Bill ≥ 500 waives base delivery. Weather 2 (Rain) adds Rs. 20 surge regardless of waivers.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Bill=600, Dist=8, Weather=2 | <span className="tcs-highlight-out">Output:</span> 620</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int bill = sc.nextInt();
        int dist = sc.nextInt();
        int weather = sc.nextInt();
        int delivery = 0;
        
        if (bill < 500) {
            // Sample base delivery logic
            delivery = (dist <= 5) ? 30 : 50; 
        }
        
        // Surge is independent of base delivery waivers
        if (weather == 2) {
            delivery += 20; 
        }
        
        System.out.println(bill + delivery);
    }
}`} />
          </div>

          <div className="tcs-question">
              <h3>40. Event Ticket Early Bird</h3>
              <p><span className="tcs-label-statement">Problem Statement:</span> Dynamic event pricing. &gt;30 days (20% off), 15-30 days (10% off). Day 0 (10% penalty markup). Flat 5% platform fee calculated on the base price.</p>
              <p><span className="tcs-label-test">Test Cases:</span></p>
              <div className="tcs-test-case-box">
                  <p><span className="tcs-highlight-in">Input:</span> Base=1000, Days=40 | <span className="tcs-highlight-out">Output:</span> 850</p>
              </div>
              <span className="tcs-label-solution">Optimal Solution:</span>
              <CodeBlock code={`import java.util.Scanner;

public class MyClass {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int base = sc.nextInt();
        int days = sc.nextInt();
        double price = base;
        
        if (days > 30) {
            price *= 0.80;
        } else if (days >= 15) {
            price *= 0.90;
        } else if (days == 0) {
            price *= 1.10; // Last min markup
        }
        
        // Platform fee calculated purely on base, not discounted price
        double platformFee = base * 0.05;
        
        int finalPrice = (int)(price + platformFee);
        System.out.println(finalPrice);
    }
}`} />
          </div>

        </div>
      </div>
    </div>
  );
}