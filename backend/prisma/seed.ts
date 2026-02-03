
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const WORLDS = [
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
        theme: "Cybersecurity Fundamentals", // Renamed for clarity
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
