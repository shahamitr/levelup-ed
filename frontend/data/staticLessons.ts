
export const STATIC_LESSONS: Record<string, string> = {
    // Web Development Track
    "react": `## 🛑 CONNECTION INTERRUPTED - SWITCHING TO ARCHIVE DATABASE [OFFLINE MODE]

### 1. Mission Briefing: The Component Crisis
**Location:** Neo-Tokyo Server Farm
**Status:** Critical
**Objective:** The UI is fragmenting. You must stabilize the rendering core using **React Components**. The system cannot handle monolithic code structures anymore. Modularize or face total shutdown.

---

### 2. Technical Download: React Components
A **Component** is a self-contained, reusable piece of UI logic. Instead of writing one giant HTML file, you break the interface into independent LEGO blocks.

**Key Concepts:**
- **Props**: Data passed *down* to a component (immutable).
- **State**: Data managed *inside* a component (mutable).
- **JSX**: A syntax extension that looks like HTML but is JavaScript.

---

### 3. Holographic Schematic
<holodeck type="mermaid">
graph TD
    A[App Component] --> B[Header]
    A --> C[Dashboard]
    C --> D[UserCard]
    C --> E[StatsGraph]
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style D fill:#ff6b6b,stroke:#333
</holodeck>

---

### 4. Code Schematics
\`\`\`jsx
function UserCard({ name, rank }) {
  return (
    <div className="card">
      <h2>Agent: {name}</h2>
      <p>Rank: {rank}</p>
    </div>
  );
}

// Usage
<UserCard name="Cipher" rank="Elite" />
\`\`\`

---

### 5. Mission Objectives
- [ ] Refactor the Header into its own file.
- [ ] Pass 'userData' props to the Dashboard.
- [ ] Render the UserCard three times for the squad list.
`,

    "cybersecurity": `## 🛑 AI OFFLINE - ACCESSING SECURE VAULT [MANUAL OVERRIDE]

### 1. Mission Briefing: The Phishing Breach
**Sector:** Corporate Finance Grid
**Threat Level:** High
**Objective:** A tailored phishing campaign has targeted our C-Suite. You must analyze the email headers and quarantine the payload before it executes a reverse shell.

---

### 2. Technical Download: Email Header Analysis
Email headers contain the digital footprint of a message's journey. Use them to verify the sender's authenticity using **SPF**, **DKIM**, and **DMARC**.

**Core Indicators:**
- **Return-Path**: Where bounces go (often reveals the true sender).
- **Received**: The chain of servers the email passed through.
- **X-Mailer**: The software used to send the mail (e.g., PHP script vs Outlook).

---

### 3. Holographic Schematic
<holodeck type="mermaid">
sequenceDiagram
    Attacker->>SMTP_Server: Spoofed Email
    SMTP_Server->>Target_Gateway: Forward Email
    Target_Gateway->>DNS: Query SPF Record
    DNS-->>Target_Gateway: SPF Fail (IP mismatch)
    Target_Gateway->>Quarantine: Block Email
</holodeck>

---

### 4. Code Schematics
\`\`\`python
# Simple Header Parser (Python)
import email

def analyze_headers(raw_email):
    msg = email.message_from_string(raw_email)
    if msg['SPF-Result'] != 'pass':
        print("⚠️ POTENTIAL SPOOF DETECTED")
        return "QUARANTINE"
    return "CLEAN"
\`\`\`

---

### 5. Mission Objectives
- [ ] Extract the 'Received' IP addresses.
- [ ] Verify the SPF record against the sender domain.
- [ ] Sandbox the attachment in a VM.
`,

    "python": `## 🛑 SYSTEM OFFLINE - LOADING BACKUP PROTOCOLS

### 1. Mission Briefing: The Data Serpent
**Zone:** Data Lake Sector 7
**Objective:** A massive dataset needs to be processed, but our current loops are too slow. You must unleash the power of **List Comprehensions** to optimize the data pipeline before the buffer overflows.

---

### 2. Technical Download: List Comprehensions
List comprehensions provide a concise way to create lists. It consists of brackets containing an expression followed by a `for` clause, then zero or more `for` or `if` clauses. It is faster and more readable than standard for-loops.

**Syntax:** \`[expression for item in list if condition]\`

---

### 3. Holographic Schematic
<holodeck type="mermaid">
flowchart LR
    A[Input List: 1, 2, 3, 4] --> B{Is Even?}
    B -- Yes --> C[Square it]
    B -- No --> D[Discard]
    C --> E[Output List: 4, 16]
</holodeck>

---

### 4. Code Schematics
\`\`\`python
# Old Way (Slow)
squares = []
for x in range(10):
    if x % 2 == 0:
        squares.append(x**2)

# The Pythonic Way (Fast)
squares = [x**2 for x in range(10) if x % 2 == 0]
\`\`\`

---

### 5. Mission Objectives
- [ ] Convert the legacy for-loop to a list comprehension.
- [ ] Filter out all null values from the data stream.
- [ ] Normalize the user inputs to lowercase in one line.
`
};

export const getStaticLesson = (topic: string): string => {
    // Simple partial match logic
    const normalizedTopic = topic.toLowerCase();
    if (normalizedTopic.includes('react') || normalizedTopic.includes('web') || normalizedTopic.includes('frontend')) return STATIC_LESSONS['react'];
    if (normalizedTopic.includes('security') || normalizedTopic.includes('cyber') || normalizedTopic.includes('soc') || normalizedTopic.includes('hack')) return STATIC_LESSONS['cybersecurity'];
    if (normalizedTopic.includes('python') || normalizedTopic.includes('data') || normalizedTopic.includes('ai')) return STATIC_LESSONS['python'];

    // Default fallback if no match
    return STATIC_LESSONS['react']; // Default to React as it's the most common demo
};
