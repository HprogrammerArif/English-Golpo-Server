import { PrismaClient, LearningPath } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ['info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Seeding English Golpo database...');

  // ─── Admin User ──────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin123', 12);
  
  const userByPhone = await prisma.user.findUnique({ where: { phone: '01700000000' } });
  const userByEmail = await prisma.user.findUnique({ where: { email: 'admin@englishgolpo.com' } });
  
  if (userByPhone && userByEmail && userByPhone.id !== userByEmail.id) {
    await prisma.user.delete({ where: { id: userByEmail.id } });
  }

  let adminUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'admin@englishgolpo.com' },
        { phone: '01700000000' }
      ]
    }
  });

  if (adminUser) {
    adminUser = await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        email: 'admin@englishgolpo.com',
        phone: '01700000000',
        passwordHash: adminHash,
        role: 'ADMIN',
        gems: 9999,
        xpTotal: 5000,
        league: 'DIAMOND',
      }
    });
  } else {
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@englishgolpo.com',
        phone: '01700000000',
        passwordHash: adminHash,
        role: 'ADMIN',
        gems: 9999,
        xpTotal: 5000,
        league: 'DIAMOND',
        streak: { create: { currentStreak: 30, longestStreak: 30 } },
      },
    });
  }
  console.log(`✅ Admin user: ${adminUser.email} (Phone: ${adminUser.phone})`);

  // ─── Sample Stories ───────────────────────────────────────────────────────

  const stories = [
    {
      title: 'The Red Hen',
      titleBn: 'লাল মুরগি',
      description: 'A classic story about hard work and sharing.',
      descriptionBn: 'পরিশ্রম ও ভাগাভাগি সম্পর্কে একটি ক্লাসিক গল্প।',
      level: 1,
      learningPath: 'KIDS' as LearningPath,
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
      learningPath: 'KIDS' as LearningPath,
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
      learningPath: 'KIDS' as LearningPath,
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
      learningPath: 'JOB' as LearningPath,
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
      learningPath: 'IELTS' as LearningPath,
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

  // ─── Spoken English Sentence Patterns ────────────────────────────
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

  // ─── Video Lessons ───────────────────────────────────────────────────────
  const videoLessons = [
    {
      id: 'kids-colors-english',
      title: 'Colors in English for Kids',
      titleBn: 'বাচ্চাদের জন্য রঙের ইংরেজি',
      description: 'Learn all the colors in English through a fun and interactive song! Perfect for young learners.',
      descriptionBn: 'মজার গানের মাধ্যমে ইংরেজিতে সব রং শিখুন! ছোটদের জন্য একদম মজার।',
      youtubeId: 'MvNVXsEOJtw',
      thumbnailUrl: 'https://img.youtube.com/vi/MvNVXsEOJtw/hqdefault.jpg',
      durationSeconds: 240,
      learningPath: 'KIDS' as LearningPath,
      level: 1,
      tags: ['colors', 'kids', 'song', 'beginner'],
      isPremium: false,
      isPublished: true,
    },
    {
      id: 'kids-animals-english',
      title: 'Animals in English — Fun Learning!',
      titleBn: 'প্রাণীদের ইংরেজি নাম শিখি',
      description: 'Discover animal names in English with pictures and pronunciation. Great for class 1–3 students.',
      descriptionBn: 'ছবি ও উচ্চারণ সহ প্রাণীদের ইংরেজি নাম শিখুন। ক্লাস ১-৩ এর জন্য আদর্শ।',
      youtubeId: 'RiANcg9MOBE',
      thumbnailUrl: 'https://img.youtube.com/vi/RiANcg9MOBE/hqdefault.jpg',
      durationSeconds: 320,
      learningPath: 'KIDS' as LearningPath,
      level: 1,
      tags: ['animals', 'kids', 'vocabulary', 'pronunciation'],
      isPremium: false,
      isPublished: true,
    },
    {
      id: 'spoken-english-daily',
      title: 'Daily Life English Conversations',
      titleBn: 'দৈনন্দিন জীবনে ইংরেজি কথোপকথন',
      description: 'Master common English phrases used in daily life — greetings, shopping, asking directions and more.',
      descriptionBn: 'দৈনন্দিন জীবনে ব্যবহৃত সাধারণ ইংরেজি বাক্যাংশ আয়ত্ত করুন — শুভেচ্ছা, কেনাকাটা, দিক নির্দেশ এবং আরও অনেক কিছু।',
      youtubeId: 'MqRWm2jNVzE',
      thumbnailUrl: 'https://img.youtube.com/vi/MqRWm2jNVzE/hqdefault.jpg',
      durationSeconds: 720,
      learningPath: 'SPOKEN' as LearningPath,
      level: 2,
      tags: ['spoken', 'daily', 'conversation', 'intermediate'],
      isPremium: false,
      isPublished: true,
    },
    {
      id: 'spoken-confidence-tips',
      title: 'Speak English Confidently — 10 Tips',
      titleBn: 'আত্মবিশ্বাসের সাথে ইংরেজি বলার ১০টি টিপস',
      description: 'Stop being afraid of speaking English. These 10 proven tips will help you become fluent faster.',
      descriptionBn: 'ইংরেজি বলতে ভয় পাওয়া বন্ধ করুন। এই ১০টি প্রমাণিত টিপস আপনাকে দ্রুত ফ্লুয়েন্ট হতে সাহায্য করবে।',
      youtubeId: 'pMKGOE7qkCU',
      thumbnailUrl: 'https://img.youtube.com/vi/pMKGOE7qkCU/hqdefault.jpg',
      durationSeconds: 540,
      learningPath: 'SPOKEN' as LearningPath,
      level: 2,
      tags: ['spoken', 'confidence', 'fluency', 'tips'],
      isPremium: false,
      isPublished: true,
    },
    {
      id: 'ielts-band-7-writing',
      title: 'IELTS Writing Task 2 — Band 7+ Strategy',
      titleBn: 'IELTS রাইটিং টাস্ক ২ — ব্যান্ড ৭+ কৌশল',
      description: 'Learn the exact structure and vocabulary to score Band 7 or higher in IELTS Academic Writing Task 2.',
      descriptionBn: 'IELTS একাডেমিক রাইটিং টাস্ক ২ তে ব্যান্ড ৭ বা তার বেশি পেতে সঠিক কাঠামো এবং শব্দভাণ্ডার শিখুন।',
      youtubeId: 'h9Dw6ANtFtg',
      thumbnailUrl: 'https://img.youtube.com/vi/h9Dw6ANtFtg/hqdefault.jpg',
      durationSeconds: 1200,
      learningPath: 'IELTS' as LearningPath,
      level: 4,
      tags: ['ielts', 'writing', 'band7', 'academic'],
      isPremium: true,
      isPublished: true,
    },
    {
      id: 'vocab-word-power',
      title: '50 Advanced English Words You Must Know',
      titleBn: '৫০টি উন্নত ইংরেজি শব্দ যা আপনাকে জানতেই হবে',
      description: 'Expand your vocabulary with 50 power words used in business, academia and everyday conversation.',
      descriptionBn: 'ব্যবসা, একাডেমিয়া এবং দৈনন্দিন কথোপকথনে ব্যবহৃত ৫০টি শক্তিশালী শব্দ দিয়ে আপনার শব্দভাণ্ডার প্রসারিত করুন।',
      youtubeId: 'IxsWzXpV2F8',
      thumbnailUrl: 'https://img.youtube.com/vi/IxsWzXpV2F8/hqdefault.jpg',
      durationSeconds: 900,
      learningPath: 'VOCAB' as LearningPath,
      level: 3,
      tags: ['vocabulary', 'advanced', 'words', 'power'],
      isPremium: false,
      isPublished: true,
    },
  ];

  for (const video of videoLessons) {
    await prisma.videoLesson.upsert({
      where: { id: video.id },
      update: video,
      create: video,
    });
  }
  console.log('✅ Seeded video lessons');

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
