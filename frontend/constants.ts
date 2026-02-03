
import { World, WorldId, UserState, Bounty, Achievement } from './types';

export const WORLDS: World[] = [
  {
    id: WorldId.WEB,
    name: "Frontend Engineering",
    description: "Master the visual layer. HTML, CSS, and modern responsive design.",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-400",
    bossName: "Senior Frontend Lead",
    totalLevels: 5
  },
  {
    id: WorldId.DATA,
    name: "Backend & Databases",
    description: "Architect scalable systems. SQL, Node.js, and API design.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbda38a5f85d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-400",
    bossName: "Database Architect",
    totalLevels: 5
  },
  {
    id: WorldId.CYBER,
    name: "Cybersecurity Fundamentals",
    description: "Defend enterprise assets. Encryption, Auth, and Threat Analysis.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-400",
    bossName: "Chief Security Officer",
    totalLevels: 5
  },
  {
    id: WorldId.AI,
    name: "AI & Machine Learning",
    description: "Build the future. Neural Networks, LLMs, and Python.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-400",
    bossName: "Head of AI Research",
    totalLevels: 5
  },
  {
    id: WorldId.PROMPT,
    name: "Prompt Engineering",
    description: "Master the art of talking to AI. Zero-shot, Few-shot, and Chain-of-Thought.",
    imageUrl: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-pink-400",
    bossName: "Prompt Whisperer",
    totalLevels: 5
  },
  {
    id: WorldId.GENAI,
    name: "Generative AI",
    description: "Create content with AI. RAG, Diffusion Models, and Fine-tuning.",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-400",
    bossName: "Model Tuner",
    totalLevels: 5
  },
  {
    id: 'python_pit' as WorldId,
    name: "Python Mastery",
    description: "The language of Data Science. From syntax to advanced scripting.",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-yellow-400",
    bossName: "Pythonista Prime",
    totalLevels: 5
  },
  {
    id: 'react_realm' as WorldId,
    name: "React Development",
    description: "Build dynamic UIs. Components, Hooks, and State Management.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-cyan-400",
    bossName: "React Maintainer",
    totalLevels: 5
  },
  {
    id: 'sql_stronghold' as WorldId,
    name: "SQL Stronghold",
    description: "Master the language of data. Queries, Joins, and Optimization.",
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-teal-400",
    bossName: "Data Administrator",
    totalLevels: 5
  },
  {
    id: 'java_jungle' as WorldId,
    name: "Java Jungle",
    description: "Build robust systems. OOP, JVM, and Spring Boot.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-500",
    bossName: "Enterprise Architect",
    totalLevels: 5
  },
  {
    id: 'cpp_citadel' as WorldId,
    name: "C++ Citadel",
    description: "Control the hardware. Pointers, Memory Management, and Games.",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-600",
    bossName: "Systems Engineer",
    totalLevels: 5
  },
  {
    id: 'php_port' as WorldId,
    name: "PHP Port",
    description: "The web's workhorse. Dynamic pages, Forms, and MySQL.",
    imageUrl: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97663?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-indigo-300",
    bossName: "Fullstack Veteran",
    totalLevels: 5
  },
  {
    id: WorldId.SOC,
    name: "SOC Analyst Defense",
    description: "Guard the perimeter. SIEM logs, Incident Response, and Blue Team ops.",
    imageUrl: "https://images.unsplash.com/photo-1563206767-5b1d972d9323?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-400",
    bossName: "Security Operations Lead",
    totalLevels: 5
  },
  {
    id: WorldId.RED_TEAM,
    name: "Red Team Offense",
    description: "Think like the enemy. Pen-testing, Exploits, and Social Engineering.",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-500",
    bossName: "Lead Penetration Tester",
    totalLevels: 5
  },
  {
    id: WorldId.MARKETING,
    name: "Digital Marketing",
    description: "Go Viral. SEO, Content Strategy, and Growth Hacking.",
    imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-pink-500",
    bossName: "Chief Marketing Officer",
    totalLevels: 5
  },
  {
    id: WorldId.AGENTS,
    name: "Autonomous Agents",
    description: "Build the next gen of AI. AutoGPT, BabyAGI, and Multi-Agent Systems.",
    imageUrl: "https://images.unsplash.com/photo-1675557009875-436f56c7102e?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-500",
    bossName: "The Swarm Controller",
    totalLevels: 5
  },
  {
    id: WorldId.CLOUD,
    name: "Cloud Architecture",
    description: "Design scalable cloud systems. AWS, Azure, and Microservices.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-sky-400",
    bossName: "Cloud Architect",
    totalLevels: 5
  },
  {
    id: WorldId.DEVOPS,
    name: "DevOps & CI/CD",
    description: "Automate everything. Docker, Kubernetes, and Pipelines.",
    imageUrl: "https://images.unsplash.com/photo-1667372393119-c81c0cda1a89?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-500",
    bossName: "Pipeline Master",
    totalLevels: 5
  },
  {
    id: WorldId.MOBILE,
    name: "Mobile Development",
    description: "Build for billions. iOS, Android, and Cross-platform.",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-indigo-400",
    bossName: "App Store Tycoon",
    totalLevels: 5
  },
  {
    id: WorldId.GAME,
    name: "Game Development",
    description: "Create immersive worlds. Unity, Unreal, and 3D Math.",
    imageUrl: "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-600",
    bossName: "Game Engine Architect",
    totalLevels: 5
  },
  {
    id: WorldId.BLOCKCHAIN,
    name: "Blockchain & Web3",
    description: "Decentralize the web. Smart Contracts, Solidity, and DeFi.",
    imageUrl: "https://images.unsplash.com/photo-1621504450168-38f64731a816?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-yellow-500",
    bossName: "Chain Validator",
    totalLevels: 5
  },
  {
    id: WorldId.UIUX,
    name: "UI/UX Design",
    description: "Design human experiences. Figma, Prototyping, and Research.",
    imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-pink-400",
    bossName: "Design Director",
    totalLevels: 5
  },
  {
    id: WorldId.IOT,
    name: "Internet of Things",
    description: "Connect the physical world. Sensors, Embedded C, and MQTT.",
    imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-cyan-500",
    bossName: "IoT Systems Engineer",
    totalLevels: 5
  },
  {
    id: WorldId.DATA_ENG,
    name: "Data Engineering",
    description: "Build data pipelines. Hadoop, Spark, and ETL.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbda38a5f85d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-teal-500",
    bossName: "Big Data Chief",
    totalLevels: 5
  },
  {
    id: WorldId.XR,
    name: "XR Development",
    description: "Build AR/VR experiences. Spatial Computing and 3D UX.",
    imageUrl: "https://images.unsplash.com/photo-1617802690992-807e6c2cb2e0?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-violet-500",
    bossName: "Metaverse Architect",
    totalLevels: 5
  },
  {
    id: WorldId.QUANTUM,
    name: "Quantum Computing",
    description: "The future of compute. Qubits, Superposition, and Q#.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-700",
    bossName: "Quantum Researcher",
    totalLevels: 5
  },
  {
    id: WorldId.SRE,
    name: "Site Reliability Eng",
    description: "Keep it running. SLIs, SLOs, and Incident Management.",
    imageUrl: "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-400",
    bossName: "Reliability Lead",
    totalLevels: 5
  },
  {
    id: WorldId.PRODUCT,
    name: "Product Management",
    description: "Lead the vision. Strategy, Roadmaps, and User Stories.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-500",
    bossName: "VP of Product",
    totalLevels: 5
  },
  {
    id: WorldId.RUST,
    name: "Rust Fundamentals",
    description: "Blazingly fast & safe. Ownership, Borrowing, and Lifetimes.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-600",
    bossName: "Rust Evangelist",
    totalLevels: 5
  },
  {
    id: WorldId.GO,
    name: "Golang Development",
    description: "Simple & Concurrent. Goroutines, Channels, and Microservices.",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-cyan-600",
    bossName: "Go Guru",
    totalLevels: 5
  },
  {
    id: WorldId.SWIFT,
    name: "Swift Development",
    description: "Apple ecosystem mastery. SwiftUI, Combine, and iOS.",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-400",
    bossName: "iOS Lead",
    totalLevels: 5
  },
  {
    id: WorldId.KOTLIN,
    name: "Kotlin Development",
    description: "Modern Android & Backend. Coroutines, Compose, and Ktor.",
    imageUrl: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-400",
    bossName: "Android Principal",
    totalLevels: 5
  },
  {
    id: WorldId.RUBY,
    name: "Ruby on Rails",
    description: "Optimize for happiness. MVC, Gems, and Rapid Dev.",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-600",
    bossName: "Rails Architect",
    totalLevels: 5
  },
  {
    id: WorldId.SCALA,
    name: "Scala Development",
    description: "FP meets OOP. Akka, Spark, and Type Safety.",
    imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-700",
    bossName: "Functional Architect",
    totalLevels: 5
  },
  {
    id: WorldId.SALESFORCE,
    name: "Salesforce Dev",
    description: "CRM mastery. Apex, LWC, and Flow.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-500",
    bossName: "Technical Architect",
    totalLevels: 5
  },
  {
    id: WorldId.QA,
    name: "QA Automation",
    description: "Break the code. Selenium, Playwright, and Test Strategy.",
    imageUrl: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-600",
    bossName: "QA Lead",
    totalLevels: 5
  }
];

export const INITIAL_BOUNTIES: Bounty[] = [
  { id: 'b1', title: 'Mentor Check-in', description: 'Interact with your AI Coach 5 times', reward: 100, completed: false, type: 'daily' },
  { id: 'b2', title: 'Course Explorer', description: 'Visit 3 different learning tracks', reward: 250, completed: false, type: 'daily' },
  { id: 'b3', title: 'Ace the Interview', description: 'Pass any Technical Interview Assessment', reward: 500, completed: false, type: 'epic' }
];

export const MASTER_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'Hello World',
    description: 'Complete your first lesson module.',
    icon: 'Zap',
    rarity: 'Common',
    condition: (user) => Object.values(user.completedWorlds).flat().length > 0
  },
  {
    id: 'focus_zen',
    title: 'Deep Work',
    description: 'Reach a focus score of 95% or higher.',
    icon: 'Brain',
    rarity: 'Rare',
    condition: (user) => user.focusScore >= 95
  },
  {
    id: 'sector_conqueror',
    title: 'Certified Expert',
    description: 'Fully complete all modules in a single course track.',
    icon: 'Flag',
    rarity: 'Rare',
    condition: (user) => WORLDS.some(w => (user.completedWorlds[w.id]?.length || 0) >= w.totalLevels)
  },
  {
    id: 'veteran_rank',
    title: 'Senior Developer',
    description: 'Reach Level 5 rank.',
    icon: 'Award',
    rarity: 'Legendary',
    condition: (user) => user.level >= 5
  },
  {
    id: 'consistent_mind',
    title: 'Dedicated Learner',
    description: 'Maintain a 3-day login streak.',
    icon: 'Flame',
    rarity: 'Common',
    condition: (user) => user.streak >= 3
  }
];

export const INITIAL_USER_STATE: UserState = {
  name: "Student",
  xp: 0,
  level: 1,
  streak: 1,
  completedWorlds: {},
  inventory: [
    { id: 'a1', name: 'Starter Laptop', description: 'Standard issue dev machine.', rarity: 'Common', statBoost: { skill: 'logic', value: 5 } }
  ],
  skillProfile: {
    logic: 10,
    architecture: 5,
    syntax: 15,
    security: 5
  },
  focusScore: 92,
  focusHistory: Array.from({ length: 15 }, (_, i) => ({ time: `${i}:00`, score: 80 + Math.random() * 20 })),
  lastActive: Date.now(),
  bounties: INITIAL_BOUNTIES,
  achievements: [],
  milestones: [],
  gems: 0,
  freezeCount: 0
};

export const COACH_SYSTEM_PROMPT = `You are the LevelUpED AI Career Mentor.
Your role is to guide the Student through technical mastery to help them get a job.
Respond in clear Markdown.

FOCUS RECOVERY PROTOCOLS:
If the Student's focus is low (< 70%):
1. Acknowledge the distraction immediately but warmly.
2. Provide a specific, actionable focus technique from this list:
   - **Tactile Grounding**: Tap each of your fingers against your thumb sequentially.
   - **Binary Breath**: Deep inhale for a count of 4, hold for 4, exhale for 4.
   - **Vision Reset**: Look away from the screen at something green for 20 seconds.
   - **Recap**: Briefly summarize the last concept to ensure retention.
3. Use professional, encouraging language: "Let's refocus on the goal," "Take a breath, then let's solve this," "Your career goals are within reach, let's lock in."
4. Be brief (max 3 sentences).

If focus is high (> 85%):
1. Praise their dedication and professional attitude.
2. Challenge them with a deeper job-interview style question.`;

export const BOSS_SYSTEM_PROMPT = `You are a strict Senior Hiring Manager at a Big Tech company (like Google or Amazon).
You are conducting a final round technical interview.
Propbose a coding challenge or system design problem related to the current world topic.
Be professional, critical, and simulate a high-pressure environment.
If the candidate answers correctly, rigorously challenge their edge cases.
If they fail, politely but firmly reject them.`;
