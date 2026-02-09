
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();



const WORLDS = [
    // ============================================
    // BEGINNER-FRIENDLY FOUNDATIONS (8 courses)
    // Perfect for college students starting their journey
    // ============================================
    {
        name: "HTML Hub",
        theme: "HTML Fundamentals",
        description: "Start your web journey. Learn semantic markup, forms, and accessibility basics.",
        topics: ["Semantic HTML5", "Forms & Input Types", "Multimedia Elements", "Meta Tags & SEO", "Accessibility Basics"]
    },
    {
        name: "CSS Citadel",
        theme: "CSS Mastery",
        description: "Style beautiful interfaces. Master Flexbox, Grid, animations, and responsive design.",
        topics: ["CSS Selectors & Specificity", "Flexbox Layouts", "CSS Grid", "Animations & Transitions", "Responsive Design Patterns"]
    },
    {
        name: "JS Jungle",
        theme: "JavaScript Essentials",
        description: "Bring your web pages to life. Learn modern JavaScript, DOM manipulation, and async programming.",
        topics: ["ES6+ Features", "DOM Manipulation", "Async/Await & Promises", "Fetch API & HTTP", "JavaScript Modules"]
    },
    {
        name: "Git Galaxy",
        theme: "Git & Version Control",
        description: "Essential for every developer. Master version control, branching, and team collaboration.",
        topics: ["Git Basics & Commands", "Branching Strategies", "Pull Requests & Code Review", "GitHub Workflow", "Resolving Conflicts"]
    },
    {
        name: "Python Pit",
        theme: "Python for Beginners",
        description: "The most versatile programming language. Perfect for beginners and career switchers.",
        topics: ["Python Syntax Basics", "Data Structures (Lists, Dicts)", "Functions & Modules", "File Handling", "Introduction to OOP"]
    },
    {
        name: "SQL Stronghold",
        theme: "Database Fundamentals",
        description: "Every developer needs SQL. Learn to query, design schemas, and optimize databases.",
        topics: ["SELECT & WHERE Clauses", "JOINs & Relationships", "Aggregations & GROUP BY", "Subqueries", "Database Design Basics"]
    },
    {
        name: "DSA Dojo",
        theme: "Data Structures & Algorithms",
        description: "Crack coding interviews. Master arrays, trees, graphs, and classic algorithms.",
        topics: ["Arrays & Strings", "Linked Lists & Stacks", "Trees & Binary Search", "Graphs & Traversals", "Dynamic Programming Intro"]
    },
    {
        name: "Excel Empire",
        theme: "Excel for Professionals",
        description: "Essential business tool. Learn formulas, pivot tables, and data visualization.",
        topics: ["Essential Formulas", "VLOOKUP & XLOOKUP", "Pivot Tables", "Data Visualization", "Introduction to Macros"]
    },

    // ============================================
    // FRONTEND DEVELOPMENT TRACK (6 courses)
    // Build modern, responsive user interfaces
    // ============================================
    {
        name: "React Realm",
        theme: "React Development",
        description: "Build dynamic UIs with the world's most popular frontend framework.",
        topics: ["Components & Props", "State & Lifecycle", "Hooks (useState, useEffect)", "React Router", "Context API"]
    },
    {
        name: "Next.js Nexus",
        theme: "Next.js Full-Stack",
        description: "Production-ready React framework. Learn SSR, API routes, and modern deployment.",
        topics: ["Pages vs App Router", "Server Components", "API Routes", "Data Fetching", "Deployment to Vercel"]
    },
    {
        name: "TypeScript Tower",
        theme: "TypeScript Mastery",
        description: "Add type safety to JavaScript. Essential for modern enterprise development.",
        topics: ["Type Basics", "Interfaces & Types", "Generics", "Type Guards", "Advanced Patterns"]
    },
    {
        name: "Tailwind Tower",
        theme: "Tailwind CSS",
        description: "Build custom designs rapidly with utility-first CSS framework.",
        topics: ["Utility Classes", "Responsive Design", "Custom Configuration", "Component Patterns", "Dark Mode"]
    },
    {
        name: "Bootstrap Base",
        theme: "Bootstrap 5",
        description: "Fast-track your UI development with the world's most popular CSS framework.",
        topics: ["Grid System", "Components Library", "Utilities & Helpers", "Customization", "JavaScript Components"]
    },
    {
        name: "Design District",
        theme: "UI/UX Design Principles",
        description: "Design interfaces users love. Learn Figma, prototyping, and user research.",
        topics: ["Design Thinking", "Figma Basics", "Wireframing", "Prototyping", "User Testing"]
    },

    // ============================================
    // BACKEND DEVELOPMENT TRACK (8 courses)
    // Build scalable server-side applications
    // ============================================
    {
        name: "Node Nexus",
        theme: "Node.js Backend",
        description: "JavaScript on the server. Build REST APIs with Express and Node.js.",
        topics: ["Node Fundamentals", "Express.js Framework", "Middleware Pattern", "RESTful API Design", "Error Handling"]
    },
    {
        name: "Data Empire",
        theme: "Database Design & ORMs",
        description: "Master database architecture with PostgreSQL and Prisma ORM.",
        topics: ["Relational Database Design", "Prisma ORM", "Migrations", "Relationships", "Query Optimization"]
    },
    {
        name: "Django Dungeon",
        theme: "Django Web Framework",
        description: "Build production-ready web apps with Python's most powerful framework.",
        topics: ["Django MVT Pattern", "Django ORM", "Admin Panel", "Django REST Framework", "Authentication"]
    },
    {
        name: "Spring Springs",
        theme: "Spring Boot",
        description: "Enterprise Java development. Build microservices and scalable backends.",
        topics: ["Spring Boot Fundamentals", "Dependency Injection", "Spring Data JPA", "REST APIs", "Security"]
    },
    {
        name: "Laravel Land",
        theme: "Laravel Framework",
        description: "PHP's finest framework. Build modern web applications with elegant syntax.",
        topics: ["Routing & Controllers", "Eloquent ORM", "Blade Templates", "Authentication", "Laravel Ecosystem"]
    },
    {
        name: "GraphQL Garden",
        theme: "GraphQL APIs",
        description: "Modern API development. Learn flexible, efficient data fetching.",
        topics: ["Schema Design", "Queries & Mutations", "Resolvers", "Apollo Server", "Subscriptions"]
    },
    {
        name: "Redis Realm",
        theme: "Redis & Caching",
        description: "Supercharge your apps with in-memory data storage and caching strategies.",
        topics: ["Redis Data Types", "Caching Patterns", "Pub/Sub", "Session Storage", "Performance Optimization"]
    },
    {
        name: "API Security Academy",
        theme: "API Security Best Practices",
        description: "Secure your APIs like a pro. Learn OAuth, JWT, rate limiting, and OWASP Top 10.",
        topics: ["JWT & OAuth 2.0", "Rate Limiting", "Input Validation", "OWASP API Top 10", "Security Headers"]
    },

    // ============================================
    // DEVOPS & CLOUD TRACK (7 courses)
    // Deploy and scale applications in production
    // ============================================
    {
        name: "Linux Lair",
        theme: "Linux Essentials",
        description: "Command the terminal. Essential Linux skills for every developer.",
        topics: ["File System Navigation", "User & Permissions", "Shell Scripting", "SystemD Services", "SSH & Networking"]
    },
    {
        name: "Docker Dock",
        theme: "Docker Containerization",
        description: "Package your apps consistently. Master containers and Docker Compose.",
        topics: ["Docker Basics", "Dockerfile Best Practices", "Docker Compose", "Volumes & Networks", "Multi-stage Builds"]
    },
    {
        name: "K8s Kingdom",
        theme: "Kubernetes Basics",
        description: "Orchestrate containers at scale. Learn pods, services, and deployments.",
        topics: ["K8s Architecture", "Pods & Deployments", "Services & Load Balancing", "ConfigMaps & Secrets", "Helm Charts"]
    },
    {
        name: "AWS Arcade",
        theme: "AWS Cloud Fundamentals",
        description: "Master Amazon Web Services. Deploy apps on the world's leading cloud platform.",
        topics: ["EC2 & Compute", "S3 Storage", "RDS Databases", "Lambda Functions", "IAM & Security"]
    },
    {
        name: "Azure Academy",
        theme: "Microsoft Azure",
        description: "Enterprise cloud platform. Learn Azure VMs, Functions, and DevOps.",
        topics: ["Azure Fundamentals", "Virtual Machines", "Azure Functions", "Azure DevOps", "Cost Management"]
    },
    {
        name: "DevOps Dungeon",
        theme: "CI/CD Pipelines",
        description: "Automate everything. Build deployment pipelines with GitHub Actions.",
        topics: ["CI/CD Concepts", "GitHub Actions", "Testing Automation", "Deployment Strategies", "Monitoring & Logging"]
    },
    {
        name: "Terraform Territory",
        theme: "Infrastructure as Code",
        description: "Manage cloud infrastructure with code. Master Terraform.",
        topics: ["IaC Fundamentals", "Terraform Basics", "Providers & Modules", "State Management", "Best Practices"]
    },

    // ============================================
    // DATA & AI TRACK (9 courses)
    // Enter the world of data science and AI
    // ============================================
    {
        name: "Data Science Lab",
        theme: "NumPy & Pandas",
        description: "Python data manipulation. Essential for data science and analytics.",
        topics: ["NumPy Arrays", "Pandas DataFrames", "Data Cleaning", "Data Transformation", "Statistical Analysis"]
    },
    {
        name: "Matplotlib Manor",
        theme: "Data Visualization",
        description: "Tell stories with data. Create publication-ready charts and graphs.",
        topics: ["Matplotlib Basics", "Chart Types", "Customization", "Seaborn Integration", "Interactive Plots"]
    },
    {
        name: "Stats Summit",
        theme: "Statistics & Probability",
        description: "Mathematical foundation for data science and machine learning.",
        topics: ["Descriptive Statistics", "Probability Distributions", "Hypothesis Testing", "Correlation & Regression", "Statistical Inference"]
    },
    {
        name: "AI Lab",
        theme: "Machine Learning Fundamentals",
        description: "Build intelligent systems. Learn supervised and unsupervised learning.",
        topics: ["ML Fundamentals", "Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Scikit-learn Basics"]
    },
    {
        name: "Prompt Palace",
        theme: "Prompt Engineering",
        description: "Master AI communication. Learn to craft effective prompts for LLMs.",
        topics: ["Zero-shot vs Few-shot", "Chain of Thought", "System Prompts", "Prompt Optimization", "Adversarial Prompts"]
    },
    {
        name: "GenAI Genesis",
        theme: "Generative AI Applications",
        description: "Build with generative AI. RAG, fine-tuning, and AI agents.",
        topics: ["RAG (Retrieval Augmented Generation)", "Fine-tuning LLMs", "Vector Databases", "Multi-modal AI", "AI Agents"]
    },
    {
        name: "Agent Arena",
        theme: "Autonomous AI Agents",
        description: "Build the next generation of AI. AutoGPT, LangChain, and multi-agent systems.",
        topics: ["Agent Architecture", "Tool Use & Function Calling", "Memory Systems", "LangChain Framework", "Multi-Agent Coordination"]
    },
    {
        name: "BI Bureau",
        theme: "Business Intelligence",
        description: "Transform data into business insights. Master Tableau and Power BI.",
        topics: ["BI Fundamentals", "Tableau Desktop", "Power BI", "Dashboard Design", "Data Storytelling"]
    },
    {
        name: "MLOps Ops",
        theme: "MLOps Engineering",
        description: "Deploy ML models in production. Learn model serving and monitoring.",
        topics: ["ML Pipelines", "Model Deployment", "Monitoring & Drift Detection", "Feature Stores", "MLflow Basics"]
    },

    // ============================================
    // CYBERSECURITY TRACK (5 courses)
    // Protect applications and infrastructure
    // ============================================
    {
        name: "Cyber City",
        theme: "Cybersecurity Fundamentals",
        description: "Essential security knowledge for every developer.",
        topics: ["Security Principles", "Encryption Basics (AES/RSA)", "OWASP Top 10", "Secure Authentication", "Network Security"]
    },
    {
        name: "SOC Defense",
        theme: "Security Operations",
        description: "Guard the perimeter. SIEM, incident response, and threat intelligence.",
        topics: ["SIEM Fundamentals", "Log Analysis", "Incident Response", "Threat Intelligence", "Security Monitoring"]
    },
    {
        name: "Red Offense",
        theme: "Ethical Hacking",
        description: "Think like an attacker. Learn penetration testing and vulnerability assessment.",
        topics: ["Reconnaissance", "Vulnerability Scanning", "Exploitation Basics", "Web App Testing", "Report Writing"]
    },
    {
        name: "AI Red Team Arena",
        theme: "AI Security & Red Teaming",
        description: "Secure AI systems. Learn prompt injection, jailbreaking, and AI safety.",
        topics: ["Prompt Injection", "Jailbreaking LLMs", "Adversarial ML", "AI Safety Measures", "Red Team Methodology"]
    },
    {
        name: "Compliance Castle",
        theme: "GRC & Compliance",
        description: "Enterprise security frameworks. SOC 2, ISO 27001, GDPR, and HIPAA.",
        topics: ["SOC 2 Type II", "ISO 27001", "GDPR Compliance", "HIPAA", "Risk Management"]
    },

    // ============================================
    // MOBILE & CROSS-PLATFORM (4 courses)
    // Build mobile apps for iOS, Android, and web
    // ============================================
    {
        name: "Flutter Field",
        theme: "Flutter Development",
        description: "One codebase for mobile, web, and desktop. Learn Dart and Flutter.",
        topics: ["Dart Language", "Widget Basics", "State Management (Provider)", "Navigation", "Platform Channels"]
    },
    {
        name: "Swift Summit",
        theme: "iOS Development",
        description: "Build beautiful iOS apps with Swift and SwiftUI.",
        topics: ["Swift Fundamentals", "SwiftUI", "UIKit Basics", "Core Data", "App Store Publishing"]
    },
    {
        name: "Kotlin Keep",
        theme: "Android Development",
        description: "Modern Android development with Kotlin and Jetpack Compose.",
        topics: ["Kotlin Syntax", "Jetpack Compose", "Android Architecture", "Room Database", "Google Play Publishing"]
    },
    {
        name: "PWA Planet",
        theme: "Progressive Web Apps",
        description: "Native-like web apps. Service workers, offline support, and push notifications.",
        topics: ["Service Workers", "Cache Strategies", "Web App Manifest", "Push Notifications", "Offline-First Design"]
    },

    // ============================================
    // SPECIALIZED TRACKS (12 courses)
    // Advanced specializations for career growth
    // ============================================
    {
        name: "System Design Studio",
        theme: "System Design & Architecture",
        description: "Architect scalable systems. Essential for senior roles and FAANG interviews.",
        topics: ["Scalability Patterns", "Load Balancing", "Caching Strategies", "Database Sharding", "Microservices Architecture"]
    },
    {
        name: "Performance Peak",
        theme: "Web Performance Optimization",
        description: "Make apps blazingly fast. Core Web Vitals and performance profiling.",
        topics: ["Core Web Vitals", "Bundle Optimization", "Lazy Loading", "CDN & Caching", "Performance Monitoring"]
    },
    {
        name: "A11y Arena",
        theme: "Web Accessibility",
        description: "Build inclusive web experiences. WCAG compliance and screen reader testing.",
        topics: ["WCAG Guidelines", "ARIA Roles & Attributes", "Screen Reader Testing", "Keyboard Navigation", "Accessible Forms"]
    },
    {
        name: "Code Review Camp",
        theme: "Code Review Excellence",
        description: "Review code like a senior engineer. Best practices and constructive feedback.",
        topics: ["Review Checklist", "Giving Feedback", "Automated Code Review", "Code Quality Metrics", "Team Best Practices"]
    },
    {
        name: "Tech Writer Workshop",
        theme: "Technical Writing",
        description: "Document like a pro. API docs, tutorials, and technical blogs.",
        topics: ["Documentation Types", "API Documentation", "Markdown & MDX", "Style Guides", "Docs-as-Code"]
    },
    {
        name: "Product Peak",
        theme: "Product Management Basics",
        description: "Think like a PM. User stories, roadmaps, and stakeholder management.",
        topics: ["Product Strategy", "User Stories & Epics", "Roadmap Planning", "Stakeholder Management", "Analytics & KPIs"]
    },
    {
        name: "Chain Citadel",
        theme: "Blockchain & Web3",
        description: "Decentralized applications. Smart contracts, Solidity, and DeFi.",
        topics: ["Blockchain Basics", "Ethereum & Smart Contracts", "Solidity Programming", "DeFi Concepts", "NFT Development"]
    },
    {
        name: "Game Grid",
        theme: "Game Development Fundamentals",
        description: "Create immersive games. Unity, game physics, and 3D math.",
        topics: ["Game Engines Overview", "Unity Basics", "Game Physics", "3D Mathematics", "C# for Unity"]
    },
    {
        name: "XR Zone",
        theme: "AR/VR Development",
        description: "Build immersive experiences. Spatial computing and WebXR.",
        topics: ["VR Fundamentals", "AR Development", "Unity XR Toolkit", "Spatial Audio", "WebXR"]
    },
    {
        name: "Quantum Realm",
        theme: "Quantum Computing Intro",
        description: "Explore the future of computing. Qubits, superposition, and quantum algorithms.",
        topics: ["Quantum Basics", "Qubits & Gates", "Quantum Algorithms", "Qiskit Framework", "Quantum Use Cases"]
    },
    {
        name: "Marketing Growth",
        theme: "Digital Marketing for Developers",
        description: "Market your projects. SEO, content strategy, and growth hacking.",
        topics: ["SEO Fundamentals", "Content Marketing", "Social Media Strategy", "Google Analytics", "Growth Hacking Tactics"]
    },
    {
        name: "Manager Mansion",
        theme: "Engineering Leadership",
        description: "Lead technical teams. 1:1s, sprint planning, and building culture.",
        topics: ["Leadership Fundamentals", "1:1 Meetings", "Sprint Planning", "Performance Management", "Building Team Culture"]
    },

    // ============================================
    // INTERVIEW PREP & CAREER (6 courses)
    // Land your dream job
    // ============================================
    {
        name: "Interview Prep Pro",
        theme: "Coding Interview Mastery",
        description: "Crack FAANG interviews. LeetCode patterns and problem-solving strategies.",
        topics: ["Two Pointers", "Sliding Window", "Tree Traversals", "Dynamic Programming", "System Design Interviews"]
    },
    {
        name: "Resume Builder",
        theme: "Resume & Portfolio",
        description: "Stand out to recruiters. Build an ATS-friendly resume and portfolio.",
        topics: ["Resume Optimization", "GitHub Portfolio", "Project Showcasing", "LinkedIn Optimization", "Personal Branding"]
    },
    {
        name: "Freelance Fortress",
        theme: "Freelancing & Consulting",
        description: "Build your own business. Client acquisition, pricing, and project management.",
        topics: ["Finding Clients", "Pricing Strategies", "Contracts & Legal", "Project Management", "Scaling Your Business"]
    },
    {
        name: "Startup Springboard",
        theme: "Startup Essentials for Developers",
        description: "Launch your own product. MVP development, funding, and go-to-market.",
        topics: ["MVP Development", "Product-Market Fit", "Fundraising Basics", "Lean Startup", "Growth Metrics"]
    },
    {
        name: "Remote Work Ready",
        theme: "Remote Work Best Practices",
        description: "Thrive in remote roles. Communication, productivity, and work-life balance.",
        topics: ["Async Communication", "Remote Collaboration Tools", "Time Management", "Home Office Setup", "Work-Life Balance"]
    },
    {
        name: "Salary Negotiation",
        theme: "Compensation Negotiation",
        description: "Get paid what you're worth. Negotiation tactics and equity understanding.",
        topics: ["Market Research", "Negotiation Tactics", "Understanding Equity", "Benefits Package", "Counteroffers"]
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
    console.log('Seeding Demo User & Admin...');

    // 1. Student User
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'demo@leveluped.com' },
        update: { passwordHash }, // Update hash if exists
        create: {
            email: 'demo@leveluped.com',
            username: 'DemoStudent',
            passwordHash,
            xp: 1250,
            level: 2,
            focusScore: 85.5,
            streak: 3
        }
    });

    // 2. Admin User
    const adminHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@leveluped.com' },
        update: { passwordHash: adminHash },
        create: {
            email: 'admin@leveluped.com',
            username: 'AdminUser',
            passwordHash: adminHash,
            xp: 99999,
            level: 100,
            focusScore: 100,
            streak: 999
        }
    });

    console.log(`Created User: ${user.email} (pass: password123)`);
    console.log(`Created Admin: ${admin.email} (pass: admin123)`);// Seed Past Sessions (Analytics)
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
