
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



const WORLDS = [
    // ============================================
    // ORIGINAL CORE COURSES (12)
    // ============================================
    {
        name: "Web Kingdom",
        theme: "Frontend Engineering",
        description: "Master the visual layer. HTML, CSS, and Responsive Design.",
        topics: ["HTML Semantics", "CSS Layouts (Flexbox/Grid)", "Responsive Design", "DOM Manipulation", "Modern Frameworks"]
    },
    {
        name: "Data Empire",
        theme: "Backend & Databases",
        description: "Architect scalable systems. SQL, Schema Design, and Node.js.",
        topics: ["Relational Data", "SQL Queries", "Normalization", "Prisma ORM", "API Design"]
    },
    {
        name: "Cyber City",
        theme: "Cybersecurity Fundamentals",
        description: "Defend assets. Encryption, Auth, and Threat Analysis.",
        topics: ["Encryption (AES/RSA)", "OWASP Top 10", "Network Security", "Auth Protocols (JWT)", "Penetration Testing"]
    },
    {
        name: "AI Lab",
        theme: "AI & Machine Learning",
        description: "Build the future. Neural Networks, LLMs, and Python.",
        topics: ["Machine Learning Basics", "Neural Networks", "NLP & LLMs", "Prompt Engineering", "Ethics in AI"]
    },
    {
        name: "Prompt Palace",
        theme: "Prompt Engineering",
        description: "Master the art of talking to AI. Zero-shot, Few-shot, and Chain-of-Thought.",
        topics: ["Zero-shot vs Few-shot", "Chain of Thought", "System Prompts", "Context Windows", "Adversarial Prompts"]
    },
    {
        name: "GenAI Genesis",
        theme: "Generative AI",
        description: "Create content with AI. Image generation, Text-to-Video, and Fine-tuning.",
        topics: ["Diffusion Models", "RAG (Retrieval Augmented Generation)", "Fine-tuning LLMs", "Multi-modal AI", "AI Agents"]
    },
    {
        name: "Python Pit",
        theme: "Python Mastery",
        description: "The language of Data Science and AI. From syntax to advanced scripting.",
        topics: ["Python Syntax", "Data Structures", "OOP in Python", "Pandas & NumPy", "FastAPI"]
    },
    {
        name: "React Realm",
        theme: "React Development",
        description: "Build dynamic UIs. Components, Hooks, and State Management.",
        topics: ["Components & Props", "useState & useEffect", "React Router", "State Management (Redux)", "Next.js Basics"]
    },
    {
        name: "SQL Stronghold",
        theme: "Database Mastery",
        description: "Master the language of data. Queries, Joins, and Stored Procedures.",
        topics: ["SELECT & WHERE", "Joins & Unions", "GROUP BY & HAVING", "Stored Procedures", "Database Normalization"]
    },
    {
        name: "Java Jungle",
        theme: "Enterprise Engineering",
        description: "Build robust systems. OOP, JVM, and Spring Boot.",
        topics: ["Java Syntax", "Object-Oriented Programming", "Collections Framework", "Streams API", "Spring Boot Basics"]
    },
    {
        name: "C++ Citadel",
        theme: "Systems Programming",
        description: "Control the hardware. Pointers, Memory Management, and Game Dev.",
        topics: ["Pointers & References", "Memory Management", "STL (Standard Template Library)", "Multithreading", "Game Physics Basics"]
    },
    {
        name: "PHP Port",
        theme: "Server-Side Scripting",
        description: "The web's workhorse. Dynamic pages, Forms, and MySQL integration.",
        topics: ["PHP Syntax", "Form Handling", "Sessions & Cookies", "MySQL Database", "Laravel Basics"]
    },
    // ============================================
    // EXISTING EXTENDED TRACKS (24)
    // ============================================
    {
        name: "SOC Defense",
        theme: "SOC Analyst Defense",
        description: "Guard the perimeter. SIEM logs, Incident Response, and Blue Team ops.",
        topics: ["SIEM Fundamentals", "Log Analysis", "Incident Response", "Threat Intelligence", "Security Monitoring"]
    },
    {
        name: "Red Offense",
        theme: "Red Team Offense",
        description: "Think like the enemy. Pen-testing, Exploits, and Social Engineering.",
        topics: ["Reconnaissance", "Vulnerability Assessment", "Exploitation Techniques", "Social Engineering", "Report Writing"]
    },
    {
        name: "Marketing Growth",
        theme: "Digital Marketing",
        description: "Go Viral. SEO, Content Strategy, and Growth Hacking.",
        topics: ["SEO Fundamentals", "Content Marketing", "Social Media Strategy", "Analytics & Metrics", "Growth Hacking"]
    },
    {
        name: "Agent Arena",
        theme: "Autonomous Agents",
        description: "Build the next gen of AI. AutoGPT, BabyAGI, and Multi-Agent Systems.",
        topics: ["Agent Architecture", "Tool Use & Function Calling", "Memory Systems", "Multi-Agent Coordination", "ReAct Pattern"]
    },
    {
        name: "Cloud Kingdom",
        theme: "Cloud Architecture",
        description: "Design scalable cloud systems. AWS, Azure, and Microservices.",
        topics: ["Cloud Fundamentals", "Compute Services", "Storage & Databases", "Networking", "Cost Optimization"]
    },
    {
        name: "DevOps Dungeon",
        theme: "DevOps & CI/CD",
        description: "Automate everything. Docker, Kubernetes, and Pipelines.",
        topics: ["CI/CD Pipelines", "Infrastructure as Code", "Monitoring & Logging", "GitOps", "Release Management"]
    },
    {
        name: "Mobile Metropolis",
        theme: "Mobile Development",
        description: "Build for billions. iOS, Android, and Cross-platform.",
        topics: ["Mobile UI/UX", "React Native Basics", "Swift/Kotlin Overview", "App Store Publishing", "Performance Optimization"]
    },
    {
        name: "Game Grid",
        theme: "Game Development",
        description: "Create immersive worlds. Unity, Unreal, and 3D Math.",
        topics: ["Game Engines Overview", "Game Physics", "3D Mathematics", "Shaders & Graphics", "Multiplayer Basics"]
    },
    {
        name: "Chain Citadel",
        theme: "Blockchain & Web3",
        description: "Decentralize the web. Smart Contracts, Solidity, and DeFi.",
        topics: ["Blockchain Fundamentals", "Smart Contracts", "Solidity Programming", "DeFi Concepts", "NFT Development"]
    },
    {
        name: "Design District",
        theme: "UI/UX Design",
        description: "Design human experiences. Figma, Prototyping, and Research.",
        topics: ["Design Principles", "Figma Mastery", "User Research", "Prototyping", "Design Systems"]
    },
    {
        name: "IoT Island",
        theme: "Internet of Things",
        description: "Connect the physical world. Sensors, Embedded C, and MQTT.",
        topics: ["IoT Architecture", "Sensors & Actuators", "MQTT Protocol", "Edge Computing", "IoT Security"]
    },
    {
        name: "Data Eng Dam",
        theme: "Data Engineering",
        description: "Build data pipelines. Hadoop, Spark, and ETL.",
        topics: ["ETL Fundamentals", "Apache Spark", "Data Warehousing", "Stream Processing", "Data Governance"]
    },
    {
        name: "XR Zone",
        theme: "XR Development",
        description: "Build AR/VR experiences. Spatial Computing and 3D UX.",
        topics: ["VR Fundamentals", "AR Development", "Spatial Audio", "Hand Tracking", "WebXR"]
    },
    {
        name: "Quantum Realm",
        theme: "Quantum Computing",
        description: "The future of compute. Qubits, Superposition, and Q#.",
        topics: ["Quantum Basics", "Qubits & Gates", "Quantum Algorithms", "Qiskit/Q#", "Quantum Machine Learning"]
    },
    {
        name: "SRE Site",
        theme: "Site Reliability Eng",
        description: "Keep it running. SLIs, SLOs, and Incident Management.",
        topics: ["SLIs & SLOs", "Error Budgets", "Incident Management", "Capacity Planning", "Chaos Engineering"]
    },
    {
        name: "Product Peak",
        theme: "Product Management",
        description: "Lead the vision. Strategy, Roadmaps, and User Stories.",
        topics: ["Product Strategy", "User Stories", "Roadmap Planning", "Stakeholder Management", "Metrics & KPIs"]
    },
    {
        name: "Rust Ridge",
        theme: "Rust Fundamentals",
        description: "Blazingly fast & safe. Ownership, Borrowing, and Lifetimes.",
        topics: ["Ownership & Borrowing", "Lifetimes", "Error Handling", "Concurrency", "WebAssembly"]
    },
    {
        name: "Go Garrison",
        theme: "Golang Development",
        description: "Simple & Concurrent. Goroutines, Channels, and Microservices.",
        topics: ["Go Syntax", "Goroutines & Channels", "Error Handling", "HTTP Servers", "Testing in Go"]
    },
    {
        name: "Swift Summit",
        theme: "Swift Development",
        description: "Apple ecosystem mastery. SwiftUI, Combine, and iOS.",
        topics: ["Swift Syntax", "SwiftUI", "Combine Framework", "Core Data", "App Store Guidelines"]
    },
    {
        name: "Kotlin Keep",
        theme: "Kotlin Development",
        description: "Modern Android & Backend. Coroutines, Compose, and Ktor.",
        topics: ["Kotlin Syntax", "Coroutines", "Jetpack Compose", "Ktor Server", "Android Architecture"]
    },
    {
        name: "Ruby Ravine",
        theme: "Ruby on Rails",
        description: "Optimize for happiness. MVC, Gems, and Rapid Dev.",
        topics: ["Ruby Basics", "Rails MVC", "ActiveRecord", "Testing with RSpec", "Deployment"]
    },
    {
        name: "Scala Spire",
        theme: "Scala Development",
        description: "FP meets OOP. Akka, Spark, and Type Safety.",
        topics: ["Scala Syntax", "Functional Programming", "Akka Actors", "Apache Spark", "Type System"]
    },
    {
        name: "CRM Canyon",
        theme: "Salesforce Dev",
        description: "CRM mastery. Apex, LWC, and Flow.",
        topics: ["Salesforce Platform", "Apex Programming", "Lightning Web Components", "Flow Builder", "Integration"]
    },
    {
        name: "QA Quarry",
        theme: "QA Automation",
        description: "Break the code. Selenium, Playwright, and Test Strategy.",
        topics: ["Test Strategy", "Selenium WebDriver", "Playwright", "API Testing", "Performance Testing"]
    },
    // ============================================
    // W3SCHOOLS-INSPIRED ADDITIONS (9)
    // ============================================
    {
        name: "Stats Summit",
        theme: "Statistics & Math",
        description: "Foundation of Data Science. Probability, Distributions, and Hypothesis Testing.",
        topics: ["Descriptive Statistics", "Probability", "Distributions", "Hypothesis Testing", "Regression Analysis"]
    },
    {
        name: "WordPress World",
        theme: "WordPress Development",
        description: "Power 40% of the web. Themes, Plugins, and WooCommerce.",
        topics: ["WordPress Setup", "Theme Development", "Plugin Development", "WooCommerce", "Security & Optimization"]
    },
    {
        name: "Git Galaxy",
        theme: "Git & Version Control",
        description: "Essential developer skill. Branching, Merging, and Collaboration.",
        topics: ["Git Basics", "Branching Strategies", "Merge & Rebase", "GitHub/GitLab", "Git Workflows"]
    },
    {
        name: "Excel Empire",
        theme: "Excel & Spreadsheets",
        description: "Business essential. Formulas, Pivot Tables, and Data Analysis.",
        topics: ["Formulas & Functions", "Pivot Tables", "Data Visualization", "VLOOKUP/XLOOKUP", "Macros & VBA"]
    },
    {
        name: "Bootstrap Base",
        theme: "Bootstrap Framework",
        description: "Rapid UI development. Grid System, Components, and Responsive Design.",
        topics: ["Grid System", "Components", "Utilities", "Customization", "Bootstrap 5 Features"]
    },
    {
        name: "Tailwind Tower",
        theme: "Tailwind CSS",
        description: "Utility-first CSS. Custom designs without leaving HTML.",
        topics: ["Utility Classes", "Responsive Design", "Custom Configuration", "Plugins", "Component Patterns"]
    },
    {
        name: "Data Science Lab",
        theme: "NumPy & Pandas",
        description: "Python Data Science stack. Arrays, DataFrames, and Analysis.",
        topics: ["NumPy Arrays", "Pandas DataFrames", "Data Cleaning", "Data Visualization", "Statistical Analysis"]
    },
    {
        name: "A11y Arena",
        theme: "Web Accessibility",
        description: "Build inclusive web. WCAG, ARIA, and Screen Readers.",
        topics: ["WCAG Guidelines", "ARIA Roles", "Screen Reader Testing", "Keyboard Navigation", "Color Contrast"]
    },
    {
        name: "Data Formats Fort",
        theme: "Data Formats",
        description: "Data interchange fundamentals. XML, JSON, and YAML.",
        topics: ["JSON Syntax", "XML Structure", "YAML Configuration", "JSON Schema", "Data Transformation"]
    },
    // ============================================
    // ROADMAP.SH-INSPIRED ADDITIONS (28)
    // ============================================
    {
        name: "Writer Workshop",
        theme: "Technical Writing",
        description: "Document like a pro. API docs, Tutorials, and Style Guides.",
        topics: ["Documentation Types", "API Documentation", "Style Guides", "Markdown & MDX", "Doc-as-Code"]
    },
    {
        name: "Manager Mansion",
        theme: "Engineering Management",
        description: "Lead teams to success. 1:1s, Sprint Planning, and Team Building.",
        topics: ["1:1 Meetings", "Sprint Planning", "Performance Reviews", "Hiring Practices", "Team Culture"]
    },
    {
        name: "DevRel Domain",
        theme: "Developer Relations",
        description: "Bridge code and community. Advocacy, Content, and Events.",
        topics: ["Community Building", "Technical Content", "Public Speaking", "Developer Experience", "Metrics & Impact"]
    },
    {
        name: "BI Bureau",
        theme: "Business Intelligence",
        description: "Turn data into insights. Tableau, Power BI, and Reporting.",
        topics: ["BI Fundamentals", "Tableau", "Power BI", "Dashboard Design", "Data Storytelling"]
    },
    {
        name: "MLOps Ops",
        theme: "MLOps Engineering",
        description: "Deploy ML at scale. Model Serving, Monitoring, and Pipelines.",
        topics: ["ML Pipelines", "Model Serving", "Monitoring & Drift", "Feature Stores", "ML Platforms"]
    },
    {
        name: "Flutter Field",
        theme: "Flutter Development",
        description: "One codebase, all platforms. Dart, Widgets, and Native Feel.",
        topics: ["Dart Language", "Widget Tree", "State Management", "Platform Channels", "Animations"]
    },
    {
        name: "GraphQL Garden",
        theme: "GraphQL Mastery",
        description: "Modern API queries. Schemas, Resolvers, and Subscriptions.",
        topics: ["Schema Design", "Queries & Mutations", "Resolvers", "Subscriptions", "Apollo/Relay"]
    },
    {
        name: "Laravel Land",
        theme: "Laravel Framework",
        description: "PHP's finest. Eloquent ORM, Blade Templates, and Artisan.",
        topics: ["Routing & Controllers", "Eloquent ORM", "Blade Templates", "Artisan CLI", "Laravel Ecosystem"]
    },
    {
        name: "Django Dungeon",
        theme: "Django Framework",
        description: "Python web framework. MVT, Admin Panel, and REST APIs.",
        topics: ["Django MVT", "Admin Panel", "Django REST Framework", "Authentication", "Deployment"]
    },
    {
        name: "Angular Arena",
        theme: "Angular Development",
        description: "Enterprise-grade frontend. TypeScript, RxJS, and NgModules.",
        topics: ["Components & Modules", "RxJS Observables", "Routing", "Forms", "Testing"]
    },
    {
        name: "Vue Valley",
        theme: "Vue.js Development",
        description: "Progressive framework. Composition API, Vuex, and Vue Router.",
        topics: ["Vue Basics", "Composition API", "Pinia/Vuex", "Vue Router", "Nuxt.js"]
    },
    {
        name: "Node Nexus",
        theme: "Node.js Backend",
        description: "JavaScript everywhere. Express, Middleware, and Event Loop.",
        topics: ["Node Fundamentals", "Express.js", "Middleware Pattern", "Event Loop", "Streams"]
    },
    {
        name: "TypeScript Tower",
        theme: "TypeScript Mastery",
        description: "Typed JavaScript. Interfaces, Generics, and Type Guards.",
        topics: ["Type Basics", "Interfaces & Types", "Generics", "Type Guards", "Advanced Patterns"]
    },
    {
        name: "Next.js Nexus",
        theme: "Next.js Framework",
        description: "React production framework. SSR, API Routes, and App Router.",
        topics: ["Pages vs App Router", "SSR & SSG", "API Routes", "Data Fetching", "Deployment"]
    },
    {
        name: ".NET Domain",
        theme: "ASP.NET Core",
        description: "Microsoft's web framework. Razor, Entity Framework, and Azure.",
        topics: ["ASP.NET Basics", "Razor Pages", "Entity Framework", "Web APIs", "Azure Integration"]
    },
    {
        name: "Spring Springs",
        theme: "Spring Boot",
        description: "Enterprise Java simplified. Auto-config, Actuator, and Microservices.",
        topics: ["Spring Boot Basics", "Dependency Injection", "Spring Data", "Security", "Microservices"]
    },
    {
        name: "Elastic Engine",
        theme: "Elasticsearch",
        description: "Search at scale. Indexing, Queries, and Analytics.",
        topics: ["Indexing & Mapping", "Search Queries", "Aggregations", "Kibana", "Performance Tuning"]
    },
    {
        name: "Linux Lair",
        theme: "Linux Administration",
        description: "Master the terminal. Shell scripting, Permissions, and Services.",
        topics: ["File System", "User Management", "Shell Scripting", "Systemd Services", "Networking"]
    },
    {
        name: "Docker Dock",
        theme: "Docker Containerization",
        description: "Package everything. Images, Compose, and Container Orchestration.",
        topics: ["Docker Basics", "Dockerfile", "Docker Compose", "Networking", "Best Practices"]
    },
    {
        name: "K8s Kingdom",
        theme: "Kubernetes Mastery",
        description: "Orchestrate at scale. Pods, Services, and Helm Charts.",
        topics: ["K8s Architecture", "Pods & Deployments", "Services & Ingress", "Helm Charts", "Operators"]
    },
    {
        name: "AWS Arcade",
        theme: "AWS Cloud",
        description: "Amazon's cloud platform. EC2, S3, Lambda, and beyond.",
        topics: ["IAM & Security", "Compute (EC2/Lambda)", "Storage (S3/EBS)", "Databases (RDS/DynamoDB)", "Networking (VPC)"]
    },
    {
        name: "Terraform Territory",
        theme: "Terraform IaC",
        description: "Infrastructure as Code. Providers, Modules, and State Management.",
        topics: ["HCL Syntax", "Providers", "Modules", "State Management", "Terraform Cloud"]
    },
    {
        name: "Redis Realm",
        theme: "Redis Mastery",
        description: "In-memory data store. Caching, Pub/Sub, and Data Structures.",
        topics: ["Data Types", "Caching Patterns", "Pub/Sub", "Persistence", "Redis Cluster"]
    },
    {
        name: "DSA Dojo",
        theme: "Data Structures & Algorithms",
        description: "Interview essential. Arrays, Trees, Graphs, and LeetCode prep.",
        topics: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming", "System Design Basics"]
    },
    // ============================================
    // BEST PRACTICES TRACKS (4)
    // ============================================
    {
        name: "API Security Academy",
        theme: "API Security Best Practices",
        description: "Secure your APIs. OAuth, Rate Limiting, and OWASP API Top 10.",
        topics: ["Authentication (OAuth/JWT)", "Rate Limiting", "Input Validation", "OWASP API Top 10", "Security Headers"]
    },
    {
        name: "Code Review Camp",
        theme: "Code Review Excellence",
        description: "Review like a pro. Best practices, Feedback, and Automation.",
        topics: ["Review Checklist", "Constructive Feedback", "Automated Reviews", "Code Quality Metrics", "Team Practices"]
    },
    {
        name: "System Design Studio",
        theme: "System Design",
        description: "Architect scalable systems. Load Balancing, Caching, and Databases.",
        topics: ["Scalability Patterns", "Load Balancing", "Caching Strategies", "Database Sharding", "Microservices"]
    },
    {
        name: "Performance Peak",
        theme: "Web Performance",
        description: "Make it fast. Core Web Vitals, Optimization, and Profiling.",
        topics: ["Core Web Vitals", "Bundle Optimization", "Lazy Loading", "CDN & Caching", "Profiling Tools"]
    },
    // ============================================
    // ADDITIONAL RECOMMENDED COURSES (13)
    // ============================================
    {
        name: "AI Red Team Arena",
        theme: "AI Red Teaming",
        description: "Adversarial AI testing. Jailbreaks, Prompt Injection, and Safety.",
        topics: ["Prompt Injection", "Jailbreaking LLMs", "Adversarial Inputs", "AI Safety Measures", "Red Team Methodology"]
    },
    {
        name: "PWA Planet",
        theme: "Progressive Web Apps",
        description: "Native-like web apps. Service Workers, Caching, and Offline-first.",
        topics: ["Service Workers", "Cache API", "Web App Manifest", "Push Notifications", "Offline Strategies"]
    },
    {
        name: "CS Core",
        theme: "Computer Science Fundamentals",
        description: "Core CS theory. Operating Systems, Networking, and Compilers.",
        topics: ["Operating Systems", "Computer Networks", "Compilers", "Discrete Math", "Theory of Computation"]
    },
    {
        name: "Sheets Studio",
        theme: "Google Sheets Mastery",
        description: "Cloud spreadsheets. Formulas, Apps Script, and Collaboration.",
        topics: ["Advanced Formulas", "Apps Script", "Data Validation", "Charts & Graphs", "Collaboration Features"]
    },
    {
        name: "DataViz Dome",
        theme: "Data Visualization",
        description: "Tell stories with data. D3.js, Tableau, and Chart Design.",
        topics: ["D3.js Basics", "Chart Types", "Interactive Dashboards", "Color Theory", "Storytelling with Data"]
    },
    {
        name: "Azure Academy",
        theme: "Azure Cloud",
        description: "Microsoft's cloud platform. VMs, Functions, and Azure DevOps.",
        topics: ["Azure Fundamentals", "Virtual Machines", "Azure Functions", "Azure DevOps", "Azure Security"]
    },
    {
        name: "Matplotlib Manor",
        theme: "Matplotlib & Seaborn",
        description: "Python visualization. Plots, Charts, and Statistical Graphics.",
        topics: ["Basic Plots", "Customization", "Subplots", "Seaborn Integration", "Exporting Figures"]
    },
    {
        name: "Compliance Castle",
        theme: "GRC & Compliance",
        description: "Enterprise security frameworks. SOC 2, ISO 27001, and HIPAA.",
        topics: ["SOC 2 Type II", "ISO 27001", "HIPAA Compliance", "GDPR", "Risk Assessment"]
    },
    {
        name: "HTML Hub",
        theme: "HTML Fundamentals",
        description: "The backbone of the web. Semantic markup, Forms, and Media.",
        topics: ["Semantic HTML", "Forms & Inputs", "Multimedia", "Accessibility", "SEO Basics"]
    },
    {
        name: "CSS Citadel",
        theme: "CSS Mastery",
        description: "Style the web. Animations, Grid, and Modern Layouts.",
        topics: ["Flexbox", "CSS Grid", "Animations", "Variables & Custom Properties", "Responsive Design"]
    },
    {
        name: "JS Jungle",
        theme: "JavaScript Essentials",
        description: "The language of the web. ES6+, Async/Await, and the Browser.",
        topics: ["ES6+ Features", "Async/Await", "DOM Manipulation", "Fetch API", "Modules"]
    },
    {
        name: "C# Castle",
        theme: "C# Development",
        description: "Microsoft's flagship language. .NET, LINQ, and Unity.",
        topics: ["C# Syntax", "LINQ", ".NET Core", "Async Programming", "Unity Basics"]
    },
    {
        name: "R Ridge",
        theme: "R Programming",
        description: "Statistical computing. Data analysis, ggplot2, and Tidyverse.",
        topics: ["R Basics", "Data Frames", "ggplot2", "Tidyverse", "Statistical Modeling"]
    }
];

async function main() {
    console.log('Seeding Worlds...');

    // Clear existing worlds to prevent duplicates (optional, or use upsert)
    // For safety in this hackathon context, we'll try to find first or create

    for (const w of WORLDS) {
        // Check if exists
        const existing = await prisma.world.findFirst({ where: { name: w.name } });
        if (existing) {
            console.log(`Skipping existing world: ${w.name}`);
            continue;
        }

        const world = await prisma.world.create({
            data: {
                name: w.name,
                theme: w.theme,
                description: w.description
            }
        });

        console.log(`Created World: ${w.name}`);

        for (let i = 0; i < w.topics.length; i++) {
            await prisma.topic.create({
                data: {
                    worldId: world.id,
                    title: w.topics[i],
                    orderIndex: i + 1
                }
            });
        }
    }

    // Seed Bounties
    console.log('Seeding Bounties...');
    const BOUNTIES = [
        { title: 'Mentor Check-in', description: 'Interact with your AI Coach', reward: 100, type: 'daily' },
        { title: 'Ace the Interview', description: 'Pass a Boss Fight', reward: 500, type: 'epic' }
    ];

    for (const b of BOUNTIES) {
        await prisma.bounty.create({ data: b });
    }

    // Seed Sample User
    console.log('Seeding Demo User...');
    const user = await prisma.user.upsert({
        where: { email: 'demo@leveluped.com' },
        update: {},
        create: {
            email: 'demo@leveluped.com',
            username: 'DemoStudent',
            passwordHash: '$2a$10$SampleHashForDemoOnly12345', // Fake hash
            xp: 1250,
            level: 2,
            focusScore: 88.5
        }
    });

    // Seed Past Sessions (Analytics)
    console.log('Seeding Analytics Data...');
    const topic = await prisma.topic.findFirst();
    if (topic) {
        await prisma.session.create({
            data: {
                userId: user.id,
                topicId: topic.id,
                focusAverage: 92.5,
                endTime: new Date(),
                aiActions: {
                    create: [
                        { actionType: 'INTERVENTION', promptUsed: 'Focus < 70%', response: 'Take a breath.' }
                    ]
                }
            }
        });
    }

    console.log('Seeding Completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
