
import { World, WorldId, UserState, Bounty, Achievement, LearningPath } from './types';

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
    id: WorldId.REACT,
    name: "React Development",
    description: "Component-based UI. Hooks, Redux, and Context API.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-400",
    bossName: "React Rockstar",
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
  },
  // ============================================
  // W3SCHOOLS-INSPIRED ADDITIONS
  // ============================================
  {
    id: WorldId.STATISTICS,
    name: "Statistics & Math",
    description: "Foundation of Data Science. Probability, Distributions, and Hypothesis Testing.",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-500",
    bossName: "Chief Statistician",
    totalLevels: 5
  },
  {
    id: WorldId.WORDPRESS,
    name: "WordPress Development",
    description: "Power 40% of the web. Themes, Plugins, and WooCommerce.",
    imageUrl: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-600",
    bossName: "WordPress Wizard",
    totalLevels: 5
  },
  {
    id: WorldId.GIT,
    name: "Git & Version Control",
    description: "Essential developer skill. Branching, Merging, and Collaboration.",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-400",
    bossName: "Git Guardian",
    totalLevels: 5
  },
  {
    id: WorldId.EXCEL,
    name: "Excel & Spreadsheets",
    description: "Business essential. Formulas, Pivot Tables, and Data Analysis.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-500",
    bossName: "Spreadsheet Sage",
    totalLevels: 5
  },
  {
    id: WorldId.BOOTSTRAP,
    name: "Bootstrap Framework",
    description: "Rapid UI development. Grid System, Components, and Responsive Design.",
    imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-500",
    bossName: "Bootstrap Boss",
    totalLevels: 5
  },
  {
    id: WorldId.TAILWIND,
    name: "Tailwind CSS",
    description: "Utility-first CSS. Custom designs without leaving HTML.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-cyan-400",
    bossName: "Tailwind Titan",
    totalLevels: 5
  },
  {
    id: WorldId.NUMPY_PANDAS,
    name: "NumPy & Pandas",
    description: "Python Data Science stack. Arrays, DataFrames, and Analysis.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbda38a5f85d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-yellow-500",
    bossName: "Data Wrangler",
    totalLevels: 5
  },
  {
    id: WorldId.ACCESSIBILITY,
    name: "Web Accessibility",
    description: "Build inclusive web. WCAG, ARIA, and Screen Readers.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-indigo-500",
    bossName: "A11y Advocate",
    totalLevels: 5
  },
  {
    id: WorldId.XML_JSON,
    name: "Data Formats",
    description: "Data interchange fundamentals. XML, JSON, and YAML.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-gray-400",
    bossName: "Format Master",
    totalLevels: 5
  },
  // ============================================
  // ROADMAP.SH-INSPIRED ADDITIONS
  // ============================================
  {
    id: WorldId.TECH_WRITER,
    name: "Technical Writing",
    description: "Document like a pro. API docs, Tutorials, and Style Guides.",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-amber-500",
    bossName: "Documentation Lead",
    totalLevels: 5
  },
  {
    id: WorldId.ENG_MANAGER,
    name: "Engineering Management",
    description: "Lead teams to success. 1:1s, Sprint Planning, and Team Building.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-600",
    bossName: "VP of Engineering",
    totalLevels: 5
  },
  {
    id: WorldId.DEVREL,
    name: "Developer Relations",
    description: "Bridge code and community. Advocacy, Content, and Events.",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-pink-500",
    bossName: "DevRel Director",
    totalLevels: 5
  },
  {
    id: WorldId.BI_ANALYST,
    name: "Business Intelligence",
    description: "Turn data into insights. Tableau, Power BI, and Reporting.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbda38a5f85d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-500",
    bossName: "BI Director",
    totalLevels: 5
  },
  {
    id: WorldId.MLOPS,
    name: "MLOps Engineering",
    description: "Deploy ML at scale. Model Serving, Monitoring, and Pipelines.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-500",
    bossName: "MLOps Architect",
    totalLevels: 5
  },
  {
    id: WorldId.FLUTTER,
    name: "Flutter Development",
    description: "One codebase, all platforms. Dart, Widgets, and Native Feel.",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-sky-400",
    bossName: "Flutter Lead",
    totalLevels: 5
  },
  {
    id: WorldId.GRAPHQL,
    name: "GraphQL Mastery",
    description: "Modern API queries. Schemas, Resolvers, and Subscriptions.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-pink-400",
    bossName: "GraphQL Guru",
    totalLevels: 5
  },
  {
    id: WorldId.LARAVEL,
    name: "Laravel Framework",
    description: "PHP's finest. Eloquent ORM, Blade Templates, and Artisan.",
    imageUrl: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97663?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-500",
    bossName: "Laravel Artisan",
    totalLevels: 5
  },
  {
    id: WorldId.DJANGO,
    name: "Django Framework",
    description: "Python web framework. MVT, Admin Panel, and REST APIs.",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-600",
    bossName: "Django Master",
    totalLevels: 5
  },
  {
    id: WorldId.ANGULAR,
    name: "Angular Development",
    description: "Enterprise-grade frontend. TypeScript, RxJS, and NgModules.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-400",
    bossName: "Angular Architect",
    totalLevels: 5
  },
  {
    id: WorldId.VUE,
    name: "Vue.js Development",
    description: "Progressive framework. Composition API, Vuex, and Vue Router.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-400",
    bossName: "Vue Virtuoso",
    totalLevels: 5
  },
  {
    id: WorldId.NODEJS,
    name: "Node.js Backend",
    description: "JavaScript everywhere. Express, Middleware, and Event Loop.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-500",
    bossName: "Node Ninja",
    totalLevels: 5
  },
  {
    id: WorldId.TYPESCRIPT,
    name: "TypeScript Mastery",
    description: "Typed JavaScript. Interfaces, Generics, and Type Guards.",
    imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-500",
    bossName: "Type Guardian",
    totalLevels: 5
  },
  {
    id: WorldId.NEXTJS,
    name: "Next.js Framework",
    description: "React production framework. SSR, API Routes, and App Router.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-gray-100",
    bossName: "Next.js Master",
    totalLevels: 5
  },
  {
    id: WorldId.ASPNET,
    name: "ASP.NET Core",
    description: "Microsoft's web framework. Razor, Entity Framework, and Azure.",
    imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-600",
    bossName: ".NET Architect",
    totalLevels: 5
  },
  {
    id: WorldId.SPRING_BOOT,
    name: "Spring Boot",
    description: "Enterprise Java simplified. Auto-config, Actuator, and Microservices.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-500",
    bossName: "Spring Sensei",
    totalLevels: 5
  },
  {
    id: WorldId.ELASTICSEARCH,
    name: "Elasticsearch",
    description: "Search at scale. Indexing, Queries, and Analytics.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-yellow-400",
    bossName: "Search Architect",
    totalLevels: 5
  },
  {
    id: WorldId.LINUX,
    name: "Linux Administration",
    description: "Master the terminal. Shell scripting, Permissions, and Services.",
    imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-400",
    bossName: "Sysadmin Supreme",
    totalLevels: 5
  },
  {
    id: WorldId.DOCKER,
    name: "Docker Containerization",
    description: "Package everything. Images, Compose, and Container Orchestration.",
    imageUrl: "https://images.unsplash.com/photo-1667372393119-c81c0cda1a89?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-400",
    bossName: "Container Captain",
    totalLevels: 5
  },
  {
    id: WorldId.KUBERNETES,
    name: "Kubernetes Mastery",
    description: "Orchestrate at scale. Pods, Services, and Helm Charts.",
    imageUrl: "https://images.unsplash.com/photo-1667372393119-c81c0cda1a89?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-500",
    bossName: "K8s Commander",
    totalLevels: 5
  },
  {
    id: WorldId.AWS,
    name: "AWS Cloud",
    description: "Amazon's cloud platform. EC2, S3, Lambda, and beyond.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-500",
    bossName: "AWS Architect",
    totalLevels: 5
  },
  {
    id: WorldId.TERRAFORM,
    name: "Terraform IaC",
    description: "Infrastructure as Code. Providers, Modules, and State Management.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-400",
    bossName: "IaC Guru",
    totalLevels: 5
  },
  {
    id: WorldId.REDIS,
    name: "Redis Mastery",
    description: "In-memory data store. Caching, Pub/Sub, and Data Structures.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-500",
    bossName: "Cache King",
    totalLevels: 5
  },
  {
    id: WorldId.DSA,
    name: "Data Structures & Algorithms",
    description: "Interview essential. Arrays, Trees, Graphs, and LeetCode prep.",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-emerald-500",
    bossName: "Algorithm Ace",
    totalLevels: 5
  },
  // ============================================
  // BEST PRACTICES TRACKS
  // ============================================
  {
    id: WorldId.API_SECURITY,
    name: "API Security Best Practices",
    description: "Secure your APIs. OAuth, Rate Limiting, and OWASP API Top 10.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-400",
    bossName: "API Security Lead",
    totalLevels: 5
  },
  {
    id: WorldId.CODE_REVIEW,
    name: "Code Review Excellence",
    description: "Review like a pro. Best practices, Feedback, and Automation.",
    imageUrl: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-400",
    bossName: "Review Guru",
    totalLevels: 5
  },
  {
    id: WorldId.SYSTEM_DESIGN,
    name: "System Design",
    description: "Architect scalable systems. Load Balancing, Caching, and Databases.",
    imageUrl: "https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-indigo-400",
    bossName: "Principal Architect",
    totalLevels: 5
  },
  {
    id: WorldId.PERFORMANCE,
    name: "Web Performance",
    description: "Make it fast. Core Web Vitals, Optimization, and Profiling.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbda38a5f85d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-yellow-400",
    bossName: "Performance Engineer",
    totalLevels: 5
  },
  // ============================================
  // ADDITIONAL RECOMMENDED COURSES
  // ============================================
  {
    id: WorldId.AI_RED_TEAM,
    name: "AI Red Teaming",
    description: "Adversarial AI testing. Jailbreaks, Prompt Injection, and Safety.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-red-500",
    bossName: "AI Safety Lead",
    totalLevels: 5
  },
  {
    id: WorldId.PWA,
    name: "Progressive Web Apps",
    description: "Native-like web apps. Service Workers, Caching, and Offline-first.",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-400",
    bossName: "PWA Architect",
    totalLevels: 5
  },
  {
    id: WorldId.COMPUTER_SCIENCE,
    name: "Computer Science Fundamentals",
    description: "Core CS theory. Operating Systems, Networking, and Compilers.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-500",
    bossName: "CS Professor",
    totalLevels: 5
  },
  {
    id: WorldId.GOOGLE_SHEETS,
    name: "Google Sheets Mastery",
    description: "Cloud spreadsheets. Formulas, Apps Script, and Collaboration.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-500",
    bossName: "Sheets Specialist",
    totalLevels: 5
  },
  {
    id: WorldId.DATA_VIZ,
    name: "Data Visualization",
    description: "Tell stories with data. D3.js, Tableau, and Chart Design.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbda38a5f85d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-400",
    bossName: "Viz Virtuoso",
    totalLevels: 5
  },
  {
    id: WorldId.AZURE,
    name: "Azure Cloud",
    description: "Microsoft's cloud platform. VMs, Functions, and Azure DevOps.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-400",
    bossName: "Azure Architect",
    totalLevels: 5
  },
  {
    id: WorldId.MATPLOTLIB,
    name: "Matplotlib & Seaborn",
    description: "Python visualization. Plots, Charts, and Statistical Graphics.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbda38a5f85d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-300",
    bossName: "Plot Master",
    totalLevels: 5,
    projectIdeas: ["Stock Market Dashboard", "Weather Data Analysis", "COVID-19 Tracker"]
  },
  {
    id: WorldId.GRC_COMPLIANCE,
    name: "GRC & Compliance",
    description: "Enterprise security frameworks. SOC 2, ISO 27001, and HIPAA.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-green-600",
    bossName: "Compliance Officer",
    totalLevels: 5
  },
  {
    id: WorldId.HTML,
    name: "HTML Fundamentals",
    description: "The backbone of the web. Semantic markup, Forms, and Media.",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-orange-500",
    bossName: "HTML Historian",
    totalLevels: 5
  },
  {
    id: WorldId.CSS,
    name: "CSS Mastery",
    description: "Style the web. Animations, Grid, and Modern Layouts.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-500",
    bossName: "CSS Wizard",
    totalLevels: 5
  },
  {
    id: WorldId.JAVASCRIPT,
    name: "JavaScript Essentials",
    description: "The language of the web. ES6+, Async/Await, and the Browser.",
    imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-yellow-400",
    bossName: "JS Guru",
    totalLevels: 5
  },
  {
    id: WorldId.CSHARP,
    name: "C# Development",
    description: "Microsoft's flagship language. .NET, LINQ, and Unity.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-purple-600",
    bossName: ".NET Champion",
    totalLevels: 5
  },
  {
    id: WorldId.R_LANG,
    name: "R Programming",
    description: "Statistical computing. Data analysis, ggplot2, and Tidyverse.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bbda38a5f85d?q=80&w=600&auto=format&fit=crop",
    primaryColor: "text-blue-400",
    bossName: "R Statistician",
    totalLevels: 5
  }
];

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'fullstack_web',
    title: 'Full Stack Web Developer',
    description: 'Master the entire web stack from frontend to backend.',
    worldIds: [WorldId.HTML, WorldId.CSS, WorldId.JAVASCRIPT, WorldId.WEB, WorldId.NODEJS, WorldId.DATA],
    careerOutcome: 'Senior Full Stack Engineer'
  },
  {
    id: 'ai_engineer',
    title: 'AI & Data Engineer',
    description: 'Build the future with AI, Machine Learning, and Data Science.',
    worldIds: [WorldId.STATISTICS, WorldId.NUMPY_PANDAS, WorldId.MATPLOTLIB, WorldId.DATA, WorldId.AI, WorldId.GENAI, WorldId.AGENTS],
    careerOutcome: 'AI Architect'
  },
  {
    id: 'devops_specialist',
    title: 'DevOps & Cloud Specialist',
    description: 'Master infrastructure, CI/CD, and Cloud platforms.',
    worldIds: [WorldId.LINUX, WorldId.GIT, WorldId.DOCKER, WorldId.KUBERNETES, WorldId.AWS, WorldId.DEVOPS],
    careerOutcome: 'Senior SRE / DevOps Engineer'
  },
  {
    id: 'frontend_master',
    title: 'Frontend Master',
    description: 'Create beautiful, responsive, and performant user interfaces.',
    worldIds: [WorldId.HTML, WorldId.CSS, WorldId.JAVASCRIPT, WorldId.WEB, WorldId.REACT, WorldId.UIUX, WorldId.ACCESSIBILITY, WorldId.PERFORMANCE],
    careerOutcome: 'Frontend Architect'
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
  xp: 2750,
  level: 3,
  streak: 5,
  completedWorlds: {
    [WorldId.WEB]: [1, 2, 3],
    [WorldId.DATA]: [1],
  },
  inventory: [
    { id: 'a1', name: 'Starter Laptop', description: 'Standard issue dev machine.', rarity: 'Common', statBoost: { skill: 'logic', value: 5 } },
    { id: 'a2', name: 'Debug Goggles', description: 'See through bugs instantly.', rarity: 'Rare', statBoost: { skill: 'syntax', value: 10 } }
  ],
  skillProfile: {
    logic: 45,
    architecture: 25,
    syntax: 55,
    security: 15
  },
  focusScore: 92,
  focusHistory: Array.from({ length: 15 }, (_, i) => ({ time: `${i}:00`, score: 80 + Math.random() * 20 })),
  lastActive: Date.now(),
  bounties: INITIAL_BOUNTIES,
  achievements: ['first_lesson', 'streak_3'],
  milestones: [],
  gems: 120,
  freezeCount: 0,
  hearts: 5,
  maxHearts: 5
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
