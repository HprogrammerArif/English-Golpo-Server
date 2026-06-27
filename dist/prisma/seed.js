"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({
    adapter,
    log: ['info', 'warn', 'error'],
});
async function main() {
    console.log('🌱 Seeding English Golpo database...');
    const adminHash = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@englishgolpo.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@englishgolpo.com',
            passwordHash: adminHash,
            role: 'ADMIN',
            gems: 9999,
            xpTotal: 5000,
            league: 'DIAMOND',
            streak: { create: { currentStreak: 30, longestStreak: 30 } },
        },
    });
    console.log(`✅ Admin user: ${admin.email}`);
    const stories = [
        {
            title: 'The Red Hen',
            titleBn: 'লাল মুরগি',
            description: 'A classic story about hard work and sharing.',
            descriptionBn: 'পরিশ্রম ও ভাগাভাগি সম্পর্কে একটি ক্লাসিক গল্প।',
            level: 1,
            learningPath: 'KIDS',
            illustrationUrl: 'https://placehold.co/800x400/10B981/white?text=The+Red+Hen',
            audioUrl: 'https://example.com/audio/red-hen.mp3',
            durationSeconds: 120,
            wordCount: 80,
            tags: ['animals', 'kids', 'phonics'],
            isPremium: false,
            isPublished: true,
        },
        {
            title: 'The Clever Crow',
            titleBn: 'চালাক কাক',
            description: 'The crow uses his intelligence to quench his thirst.',
            descriptionBn: 'কাক বুদ্ধি দিয়ে তার পিপাসা মেটায়।',
            level: 1,
            learningPath: 'KIDS',
            illustrationUrl: 'https://placehold.co/800x400/3B82F6/white?text=The+Clever+Crow',
            audioUrl: 'https://example.com/audio/clever-crow.mp3',
            durationSeconds: 90,
            wordCount: 60,
            tags: ['animals', 'kids', 'thinking'],
            isPremium: false,
            isPublished: true,
        },
        {
            title: 'My First Day at School',
            titleBn: 'স্কুলের প্রথম দিন',
            description: 'Rina goes to school for the first time and makes new friends.',
            descriptionBn: 'রিনা প্রথমবার স্কুলে যায় এবং নতুন বন্ধু তৈরি করে।',
            level: 2,
            learningPath: 'KIDS',
            nctbClass: 6,
            nctbUnit: 'Unit 1',
            illustrationUrl: 'https://placehold.co/800x400/F59E0B/white?text=First+Day+at+School',
            audioUrl: 'https://example.com/audio/school-day.mp3',
            durationSeconds: 180,
            wordCount: 120,
            tags: ['school', 'nctb', 'class6', 'ssc'],
            isPremium: false,
            isPublished: true,
        },
        {
            title: 'Job Interview in English',
            titleBn: 'ইংরেজিতে চাকরির ইন্টারভিউ',
            description: 'Learn the key phrases and vocabulary for a successful job interview.',
            descriptionBn: 'সফল চাকরির ইন্টারভিউয়ের জন্য মূল বাক্য ও শব্দ শিখুন।',
            level: 3,
            learningPath: 'JOB',
            illustrationUrl: 'https://placehold.co/800x400/EF4444/white?text=Job+Interview',
            audioUrl: 'https://example.com/audio/job-interview.mp3',
            durationSeconds: 240,
            wordCount: 200,
            tags: ['job', 'interview', 'professional', 'bpo'],
            isPremium: true,
            isPublished: true,
        },
        {
            title: 'IELTS Academic Writing Task 2',
            titleBn: 'IELTS একাডেমিক রাইটিং টাস্ক ২',
            description: 'Master the structure and vocabulary for high-band IELTS essays.',
            descriptionBn: 'উচ্চ ব্যান্ড IELTS রচনার জন্য কাঠামো ও শব্দ শিখুন।',
            level: 4,
            learningPath: 'IELTS',
            illustrationUrl: 'https://placehold.co/800x400/8B5CF6/white?text=IELTS+Writing',
            audioUrl: 'https://example.com/audio/ielts-writing.mp3',
            durationSeconds: 300,
            wordCount: 350,
            tags: ['ielts', 'writing', 'essay', 'academic'],
            isPremium: true,
            isPublished: true,
        },
    ];
    for (const storyData of stories) {
        const story = await prisma.story.upsert({
            where: { id: storyData.title.toLowerCase().replace(/ /g, '-') },
            update: {},
            create: {
                id: storyData.title.toLowerCase().replace(/ /g, '-'),
                ...storyData,
                pages: {
                    create: [
                        {
                            pageIndex: 0,
                            imageUrl: storyData.illustrationUrl,
                            sentences: {
                                create: [
                                    {
                                        sentenceIdx: 0,
                                        englishText: 'Once upon a time, there was a little red hen.',
                                        banglaText: 'একসময় একটি ছোট্ট লাল মুরগি ছিল।',
                                        startTime: 0,
                                        endTime: 3.5,
                                        tokens: {
                                            create: [
                                                { english: 'Once', bangla: 'একসময়', sentenceContext: 'Once upon a time', pronunciationG: 'wʌns' },
                                                { english: 'hen', bangla: 'মুরগি', sentenceContext: 'little red hen', pronunciationG: 'hɛn' },
                                            ],
                                        },
                                    },
                                    {
                                        sentenceIdx: 1,
                                        englishText: 'She worked very hard every day.',
                                        banglaText: 'সে প্রতিদিন অনেক কঠোর পরিশ্রম করত।',
                                        startTime: 3.5,
                                        endTime: 7.0,
                                        tokens: {
                                            create: [
                                                { english: 'worked', bangla: 'কাজ করত', sentenceContext: 'worked hard', pronunciationG: 'wɜːrkt' },
                                                { english: 'hard', bangla: 'কঠোর', sentenceContext: 'very hard', pronunciationG: 'hɑːrd' },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                quizzes: {
                    create: {
                        questions: {
                            create: [
                                {
                                    questionText: 'What color was the hen?',
                                    questionTextBn: 'মুরগিটির রঙ কেমন ছিল?',
                                    options: ['Blue', 'Red', 'Green', 'Yellow'],
                                    correctIndex: 1,
                                    explanation: 'The story says "little red hen".',
                                    xpReward: 10,
                                },
                                {
                                    questionText: 'What did the hen do every day?',
                                    questionTextBn: 'মুরগিটি প্রতিদিন কী করত?',
                                    options: ['Slept', 'Played', 'Worked hard', 'Sang songs'],
                                    correctIndex: 2,
                                    explanation: '"She worked very hard every day."',
                                    xpReward: 10,
                                },
                            ],
                        },
                    },
                },
            },
        });
        console.log(`✅ Story: ${story.title}`);
    }
    console.log('🌱 Seeding Sentence Patterns...');
    const patterns = [
        {
            pattern: 'I want to + [verb]',
            patternBn: 'আমি [কিছু] করতে চাই',
            exampleEn: 'I want to learn English.',
            exampleBn: 'আমি ইংরেজি শিখতে চাই।',
            category: 'Desires (ইচ্ছা)',
        },
        {
            pattern: 'It is time to + [verb]',
            patternBn: 'এখন [কিছু] করার সময়',
            exampleEn: 'It is time to study.',
            exampleBn: 'এখন পড়াশোনা করার সময়।',
            category: 'Daily Routine (দৈনন্দিন)',
        },
        {
            pattern: 'How about + [verb-ing]?',
            patternBn: '[কিছু] করলে কেমন হয়?',
            exampleEn: 'How about playing football?',
            exampleBn: 'ফুটবল খেললে কেমন হয়?',
            category: 'Suggestions (পরামর্শ)',
        },
        {
            pattern: 'I am looking forward to + [verb-ing]',
            patternBn: 'আমি আগ্রহের সাথে [কিছুর] অপেক্ষা করছি',
            exampleEn: 'I am looking forward to meeting you.',
            exampleBn: 'আমি আপনার সাথে দেখা করার জন্য আগ্রহের সাথে অপেক্ষা করছি।',
            category: 'Expectation (প্রত্যাশা)',
        },
        {
            pattern: 'Would you mind + [verb-ing]?',
            patternBn: 'আপনি কি দয়া করে [কিছু] করবেন?',
            exampleEn: 'Would you mind opening the door?',
            exampleBn: 'আপনি কি দয়া করে দরজাটা খুলে দেবেন?',
            category: 'Polite Request (ভদ্র অনুরোধ)',
        },
    ];
    for (const p of patterns) {
        await prisma.sentencePattern.create({
            data: p,
        });
    }
    console.log('✅ Seeded spoken English sentence patterns');
    console.log('🎉 Seeding complete!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=seed.js.map