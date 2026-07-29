import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as https from 'https';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // ─── Dashboard Stats ───────────────────────────────────────────────────────
  async getDashboardStats() {
    const [
      totalUsers,
      freeUsers,
      premiumUsers,
      adminUsers,
      totalStories,
      publishedStories,
      totalVideos,
      publishedVideos,
      totalSubscriptions,
      activeSubscriptions,
      transactions,
      b2bCount,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'FREE' } }),
      this.prisma.user.count({ where: { role: 'PREMIUM' } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.story.count(),
      this.prisma.story.count({ where: { isPublished: true } }),
      this.prisma.videoLesson.count(),
      this.prisma.videoLesson.count({ where: { isPublished: true } }),
      this.prisma.subscription.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.paymentTransaction.findMany({
        where: { status: 'SUCCESS' },
        select: { amount: true },
      }),
      this.prisma.b2BOrganization.count(),
    ]);

    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      users: { total: totalUsers, free: freeUsers, premium: premiumUsers, admin: adminUsers },
      stories: { total: totalStories, published: publishedStories, draft: totalStories - publishedStories },
      videos: { total: totalVideos, published: publishedVideos, draft: totalVideos - publishedVideos },
      subscriptions: { total: totalSubscriptions, active: activeSubscriptions },
      finance: { totalSuccessfulTransactions: transactions.length, totalRevenueBDT: totalRevenue },
      b2bOrganizations: b2bCount,
    };
  }

  // ─── User Management ────────────────────────────────────────────────────────
  async getUsers(query: { search?: string; role?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.role) where.role = query.role;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          learningPath: true,
          xpTotal: true,
          gems: true,
          lives: true,
          league: true,
          createdAt: true,
          subscriptions: {
            where: { status: 'ACTIVE' },
            take: 1,
            select: { planType: true, expiryDate: true, gateway: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateUserRole(userId: string, role: 'FREE' | 'PREMIUM' | 'ADMIN') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async updateUserStats(userId: string, data: { gems?: number; lives?: number; xpTotal?: number }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.gems !== undefined && { gems: Number(data.gems) }),
        ...(data.lives !== undefined && { lives: Number(data.lives) }),
        ...(data.xpTotal !== undefined && { xpTotal: Number(data.xpTotal) }),
      },
    });
  }

  // ─── Story CMS ─────────────────────────────────────────────────────────────
  async getAdminStories(query: { search?: string; path?: string; isPublished?: boolean | string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.path) where.learningPath = query.path;
    if (query.isPublished !== undefined) {
      where.isPublished = query.isPublished === 'true' || query.isPublished === true;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { titleBn: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [stories, total] = await this.prisma.$transaction([
      this.prisma.story.findMany({
        where,
        include: {
          pages: {
            orderBy: { pageIndex: 'asc' },
            include: {
              sentences: true,
            },
          },
          quizzes: {
            include: { questions: true },
          },
          _count: { select: { pages: true, quizzes: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.story.count({ where }),
    ]);

    return {
      stories,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createStory(data: any) {
    const story = await this.prisma.story.create({
      data: {
        title: data.title,
        titleBn: data.titleBn,
        description: data.description || '',
        descriptionBn: data.descriptionBn || '',
        level: Number(data.level) || 1,
        learningPath: data.learningPath,
        isPremium: Boolean(data.isPremium),
        nctbClass: data.nctbClass ? Number(data.nctbClass) : null,
        nctbUnit: data.nctbUnit || null,
        illustrationUrl: data.illustrationUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        audioUrl: data.audioUrl || '',
        durationSeconds: Number(data.durationSeconds) || 0,
        wordCount: Number(data.wordCount) || 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
        isPublished: Boolean(data.isPublished),
      },
    });

    await this.autoGenerateContent(story.id);
    return this.prisma.story.findUnique({
      where: { id: story.id },
      include: {
        pages: {
          include: {
            sentences: {
              include: { tokens: true }
            }
          }
        },
        quizzes: {
          include: { questions: true }
        }
      }
    });
  }

  async getStoryDetail(storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        pages: {
          orderBy: { pageIndex: 'asc' },
          include: {
            sentences: {
              orderBy: { sentenceIdx: 'asc' },
              include: { tokens: true },
            },
          },
        },
        quizzes: { include: { questions: true } },
        _count: { select: { pages: true, quizzes: true } },
      },
    });
    if (!story) throw new NotFoundException('Story not found');
    return story;
  }

  async autoGenerateContent(storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: { pages: true, quizzes: true }
    });
    if (!story) return;

    // Only auto-generate if pages are empty
    if (story.pages.length > 0) return;

    await this._generatePagesAndTokens(story);
  }

  // Force regenerate: delete existing pages/sentences/tokens then recreate
  async regenerateStoryContent(storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: { pages: true, quizzes: true }
    });
    if (!story) throw new NotFoundException('Story not found');

    // Delete all existing pages (cascades to sentences and tokens)
    await this.prisma.storyPage.deleteMany({ where: { storyId } });
    // Delete all quizzes
    await this.prisma.quiz.deleteMany({ where: { storyId } });

    await this._generatePagesAndTokens(story as any);

    return this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        pages: {
          orderBy: { pageIndex: 'asc' },
          include: { sentences: { orderBy: { sentenceIdx: 'asc' }, include: { tokens: true } } }
        },
        quizzes: { include: { questions: true } },
        _count: { select: { pages: true, quizzes: true } },
      }
    });
  }

  // ─── Smart Sentence Splitter ───────────────────────────────────────────────
  private splitRawSentences(text: string, pattern: RegExp): string[] {
    return text.split(pattern).map(s => s.trim()).filter(Boolean);
  }

  private splitIntoSentences(text: string): string[] {
    if (!text || !text.trim()) return [];
    const normalized = text.replace(/\r?\n/g, ' ').trim();

    // Try standard punctuation split first
    const bySentence = this.splitRawSentences(normalized, /(?<=[.!?।])\s+/);
    if (bySentence.length > 1) return bySentence;

    // Try colon/semicolon split
    const byColon = normalized
      .split(/:\s+|;\s+/)
      .map(s => s.trim())
      .filter(Boolean);
    if (byColon.length > 1) return byColon;

    // Try comma-separated chunks (group into pairs)
    const byComma = normalized
      .split(/,\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
    if (byComma.length > 2) {
      const grouped: string[] = [];
      for (let i = 0; i < byComma.length; i += 2) {
        grouped.push(byComma.slice(i, i + 2).join(', '));
      }
      return grouped;
    }

    return [normalized];
  }

  // ─── Extract Bilingual Pairs ───────────────────────────────────────────────
  // Handles "Bangla sentences: English sentences" mixed content format
  private extractBilingualSentences(
    description: string,
    descriptionBn: string,
  ): { enSentences: string[]; bnSentences: string[] } {
    // Pattern: Bangla text ending with ।/.!? followed by colon
    const bilingualPattern = /[।.!?]\s*:\s*/;

    // Check description field first
    const descToCheck = description || descriptionBn;
    if (bilingualPattern.test(descToCheck)) {
      const match = descToCheck.match(bilingualPattern);
      if (match && match.index !== undefined) {
        const matchEnd = match.index + match[0].length;
        const bnPart = descToCheck.slice(0, match.index + 1).trim();
        const enPart = descToCheck.slice(matchEnd).trim();
        const enSentences = this.splitRawSentences(enPart, /(?<=[.!?])\s+/);
        const bnSentences = this.splitRawSentences(bnPart, /(?<=[।!?])\s+/);
        if (enSentences.length > 0) {
          return { enSentences, bnSentences: bnSentences.length > 0 ? bnSentences : [bnPart] };
        }
      }
    }

    // Also check descriptionBn if different
    if (descriptionBn && descriptionBn !== description && bilingualPattern.test(descriptionBn)) {
      const match = descriptionBn.match(bilingualPattern);
      if (match && match.index !== undefined) {
        const matchEnd = match.index + match[0].length;
        const bnPart = descriptionBn.slice(0, match.index + 1).trim();
        const enPart = descriptionBn.slice(matchEnd).trim();
        const enSentences = this.splitRawSentences(enPart, /(?<=[.!?])\s+/);
        const bnSentences = this.splitRawSentences(bnPart, /(?<=[।!?])\s+/);
        if (enSentences.length > 0) {
          return { enSentences, bnSentences: bnSentences.length > 0 ? bnSentences : [bnPart] };
        }
      }
    }

    // Standard: English from description, Bangla from descriptionBn
    const enSentences = this.splitIntoSentences(description);
    const bnSentences = this.splitIntoSentences(descriptionBn);
    return { enSentences, bnSentences };
  }

  // ─── OpenAI Vocabulary Extraction ─────────────────────────────────────────
  private async extractVocabWithAI(
    sentences: string[],
  ): Promise<Record<string, { bn: string; ipa: string | null }>> {
    const openaiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!openaiKey) return {};

    const combinedText = sentences.join(' ');
    const prompt = `You are an English-Bangla vocabulary assistant for a children's story learning app.
Given this English text, extract up to 15 important vocabulary words (nouns, verbs, adjectives only — skip articles, prepositions, conjunctions like "the", "and", "was", "with").
For each word, provide:
1. The base/root form (lowercase)
2. Its Bangla meaning in Bengali Unicode script
3. Its IPA pronunciation guide

Return ONLY valid JSON in this exact format with no extra text or markdown:
{"words": [{"english": "tiger", "bangla": "বাঘ", "ipa": "ˈtaɪɡər"}]}

Text: ${combinedText.slice(0, 1000)}`;

    try {
      const result = await this.callOpenAI(openaiKey, prompt);
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return {};
      const parsed = JSON.parse(jsonMatch[0]);
      const vocab: Record<string, { bn: string; ipa: string | null }> = {};
      if (Array.isArray(parsed.words)) {
        for (const w of parsed.words) {
          if (w.english && w.bangla) {
            vocab[w.english.toLowerCase()] = { bn: w.bangla, ipa: w.ipa || null };
          }
        }
      }
      return vocab;
    } catch (e) {
      console.error('[OpenAI vocab extraction failed]', e);
      return {};
    }
  }

  private callOpenAI(apiKey: string, prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 700,
        temperature: 0.2,
      });

      const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(body),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.message?.content;
            if (content) resolve(content);
            else reject(new Error(`OpenAI error: ${data}`));
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(20000, () => { req.destroy(); reject(new Error('OpenAI timeout')); });
      req.write(body);
      req.end();
    });
  }

  // ─── Built-in Fallback Vocabulary Dictionary ───────────────────────────────
  private readonly vocabDict: Record<string, { bn: string; ipa: string }> = {
    tiger: { bn: 'বাঘ', ipa: 'ˈtaɪɡər' },
    tigers: { bn: 'বাঘগুলো', ipa: 'ˈtaɪɡərz' },
    brave: { bn: 'সাহসী', ipa: 'breɪv' },
    little: { bn: 'ছোট্ট', ipa: 'ˈlɪtl' },
    lost: { bn: 'হারিয়ে গেছে', ipa: 'lɔːst' },
    village: { bn: 'গ্রাম', ipa: 'ˈvɪlɪdʒ' },
    mother: { bn: 'মা', ipa: 'ˈmʌðər' },
    worried: { bn: 'চিন্তিত', ipa: 'ˈwɜːrid' },
    family: { bn: 'পরিবার', ipa: 'ˈfæməli' },
    playing: { bn: 'খেলছে', ipa: 'ˈpleɪ.ɪŋ' },
    play: { bn: 'খেলা', ipa: 'pleɪ' },
    played: { bn: 'খেলেছিল', ipa: 'pleɪd' },
    human: { bn: 'মানব', ipa: 'ˈhjuːmən' },
    baby: { bn: 'শিশু', ipa: 'ˈbeɪbi' },
    boy: { bn: 'বালক', ipa: 'bɔɪ' },
    once: { bn: 'একদা', ipa: 'wʌns' },
    day: { bn: 'দিন', ipa: 'deɪ' },
    crow: { bn: 'কাক', ipa: 'kroʊ' },
    thirsty: { bn: 'তৃষ্ণার্ত', ipa: 'ˈθɜːrsti' },
    pitcher: { bn: 'কলস', ipa: 'ˈpɪtʃər' },
    water: { bn: 'জল', ipa: 'ˈwɔːtər' },
    pebbles: { bn: 'পাথরের টুকরো', ipa: 'ˈpeblz' },
    hen: { bn: 'মুরগি', ipa: 'hɛn' },
    worked: { bn: 'কাজ করেছিল', ipa: 'wɜːrkt' },
    hard: { bn: 'কঠোর', ipa: 'hɑːrd' },
    early: { bn: 'তাড়াতাড়ি', ipa: 'ˈɜːrli' },
    friend: { bn: 'বন্ধু', ipa: 'frɛnd' },
    school: { bn: 'বিদ্যালয়', ipa: 'skuːl' },
    forest: { bn: 'বন', ipa: 'ˈfɒrɪst' },
    home: { bn: 'বাড়ি', ipa: 'hoʊm' },
    heart: { bn: 'হৃদয়', ipa: 'hɑːrt' },
    kind: { bn: 'দয়ালু', ipa: 'kaɪnd' },
    help: { bn: 'সাহায্য', ipa: 'hɛlp' },
    helped: { bn: 'সাহায্য করেছিল', ipa: 'hɛlpt' },
    helping: { bn: 'সাহায্য করছে', ipa: 'ˈhɛlpɪŋ' },
    love: { bn: 'ভালোবাসা', ipa: 'lʌv' },
    happy: { bn: 'সুখী', ipa: 'ˈhæpi' },
    sad: { bn: 'দুঃখী', ipa: 'sæd' },
    found: { bn: 'খুঁজে পেল', ipa: 'faʊnd' },
    went: { bn: 'গেল', ipa: 'wɛnt' },
    came: { bn: 'এলো', ipa: 'keɪm' },
    said: { bn: 'বলল', ipa: 'sɛd' },
    asked: { bn: 'জিজ্ঞেস করল', ipa: 'æskt' },
    looked: { bn: 'তাকাল', ipa: 'lʊkt' },
    walked: { bn: 'হাঁটল', ipa: 'wɔːkt' },
    ran: { bn: 'দৌড়াল', ipa: 'ræn' },
    tree: { bn: 'গাছ', ipa: 'triː' },
    bird: { bn: 'পাখি', ipa: 'bɜːrd' },
    fish: { bn: 'মাছ', ipa: 'fɪʃ' },
    dog: { bn: 'কুকুর', ipa: 'dɒɡ' },
    cat: { bn: 'বিড়াল', ipa: 'kæt' },
    lion: { bn: 'সিংহ', ipa: 'ˈlaɪən' },
    elephant: { bn: 'হাতি', ipa: 'ˈɛlɪfənt' },
    rabbit: { bn: 'খরগোশ', ipa: 'ˈræbɪt' },
    king: { bn: 'রাজা', ipa: 'kɪŋ' },
    queen: { bn: 'রানী', ipa: 'kwiːn' },
    sun: { bn: 'সূর্য', ipa: 'sʌn' },
    moon: { bn: 'চাঁদ', ipa: 'muːn' },
    star: { bn: 'তারা', ipa: 'stɑːr' },
    river: { bn: 'নদী', ipa: 'ˈrɪvər' },
    mountain: { bn: 'পাহাড়', ipa: 'ˈmaʊntɪn' },
    sky: { bn: 'আকাশ', ipa: 'skaɪ' },
    garden: { bn: 'বাগান', ipa: 'ˈɡɑːrdən' },
    flower: { bn: 'ফুল', ipa: 'ˈflaʊər' },
    beautiful: { bn: 'সুন্দর', ipa: 'ˈbjuːtɪfl' },
    small: { bn: 'ছোট', ipa: 'smɔːl' },
    big: { bn: 'বড়', ipa: 'bɪɡ' },
    strong: { bn: 'শক্তিশালী', ipa: 'strɒŋ' },
    fast: { bn: 'দ্রুত', ipa: 'fæst' },
    slow: { bn: 'ধীর', ipa: 'sloʊ' },
    deep: { bn: 'গভীর', ipa: 'diːp' },
    dark: { bn: 'অন্ধকার', ipa: 'dɑːrk' },
    light: { bn: 'আলো', ipa: 'laɪt' },
    food: { bn: 'খাবার', ipa: 'fuːd' },
    dream: { bn: 'স্বপ্ন', ipa: 'driːm' },
    learn: { bn: 'শেখা', ipa: 'lɜːrn' },
    teach: { bn: 'শেখানো', ipa: 'tiːtʃ' },
    read: { bn: 'পড়া', ipa: 'riːd' },
    write: { bn: 'লেখা', ipa: 'raɪt' },
  };

  // ─── Core Content Generator ────────────────────────────────────────────────
  private async _generatePagesAndTokens(story: {
    id: string;
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
    illustrationUrl: string;
    quizzes: any[];
  }) {
    const { enSentences, bnSentences } = this.extractBilingualSentences(
      story.description,
      story.descriptionBn,
    );

    console.log(`[ContentGen] Story "${story.title}": found ${enSentences.length} EN sentences, ${bnSentences.length} BN sentences`);

    if (enSentences.length === 0) return;

    // Fetch AI vocab for all sentences at once (non-blocking fallback on error)
    const aiVocab = await this.extractVocabWithAI(enSentences).catch(() => ({}));

    const SENTENCES_PER_PAGE = 4;
    const pagesCount = Math.ceil(enSentences.length / SENTENCES_PER_PAGE);
    const stopWords = new Set([
      'the', 'and', 'was', 'with', 'one', 'got', 'him', 'but', 'his', 'her',
      'there', 'about', 'where', 'some', 'they', 'that', 'this', 'have', 'been',
      'from', 'into', 'also', 'not', 'for', 'are', 'had', 'has', 'very', 'then',
      'when', 'what', 'which', 'who', 'she', 'its', 'our', 'all', 'each', 'out',
      'day', 'got', 'did', 'could', 'would', 'should', 'may', 'might', 'will',
    ]);

    let globalSentenceIdx = 0;

    for (let pIdx = 0; pIdx < pagesCount; pIdx++) {
      const page = await this.prisma.storyPage.create({
        data: {
          storyId: story.id,
          pageIndex: pIdx,
          imageUrl: story.illustrationUrl,
        },
      });

      const startIdx = pIdx * SENTENCES_PER_PAGE;
      const pageEnSentences = enSentences.slice(startIdx, startIdx + SENTENCES_PER_PAGE);
      const pageBnSentences = bnSentences.slice(startIdx, startIdx + SENTENCES_PER_PAGE);

      for (let sIdx = 0; sIdx < pageEnSentences.length; sIdx++) {
        const enText = pageEnSentences[sIdx];
        const bnText = pageBnSentences[sIdx] || enText;
        const timeBase = globalSentenceIdx * 4.5;

        const sentence = await this.prisma.sentence.create({
          data: {
            pageId: page.id,
            sentenceIdx: sIdx,
            englishText: enText,
            banglaText: bnText,
            startTime: timeBase,
            endTime: timeBase + 4.5,
          },
        });

        // Extract vocabulary tokens
        const words = enText
          .toLowerCase()
          .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '')
          .split(/\s+/)
          .filter(w => w.length > 2 && !stopWords.has(w));

        const uniqueWords = [...new Set(words)].slice(0, 4);

        for (const rawWord of uniqueWords) {
          const cleanWord = rawWord.trim();
          if (!cleanWord) continue;

          // AI vocab takes priority, then built-in dict, then raw word
          const stemmed = cleanWord.replace(/(?:ing|ed|s|er|est)$/, '') || cleanWord.replace(/s$/, '');
          const aiEntry = aiVocab[cleanWord] || aiVocab[stemmed];
          const dictEntry =
            this.vocabDict[cleanWord] ||
            this.vocabDict[cleanWord.replace(/s$/, '')] ||
            this.vocabDict[cleanWord.replace(/(?:ing|ed)$/, '')] ||
            this.vocabDict[cleanWord.replace(/(?:ing|ed)$/, 'e')];

          const bangla = aiEntry?.bn ?? dictEntry?.bn ?? cleanWord;
          const ipa = aiEntry?.ipa ?? dictEntry?.ipa ?? null;

          await this.prisma.wordToken.create({
            data: {
              sentenceId: sentence.id,
              english: cleanWord,
              bangla,
              sentenceContext: enText.length > 60 ? enText.slice(0, 57) + '...' : enText,
              pronunciationG: ipa,
            },
          });
        }

        globalSentenceIdx++;
      }
    }

    // Auto-generate quiz if none exist
    if (story.quizzes.length === 0) {
      const quiz = await this.prisma.quiz.create({
        data: { storyId: story.id },
      });

      await this.prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          questionText: `What is a main highlight of the story "${story.title}"?`,
          questionTextBn: `"${story.titleBn}" গল্পের মূল বিষয়বস্তু কী?`,
          options: [
            'Getting lost and being helped by a friendly family',
            'Fighting a big scary monster in the dark forest',
            'Searching for treasure inside a hidden cave',
            'Sleeping all day without doing anything',
          ],
          correctIndex: 0,
          explanation: 'The story narrates a character facing a situation and learning from it.',
          xpReward: 10,
        },
      });

      const tokens = await this.prisma.wordToken.findMany({
        where: { sentence: { page: { storyId: story.id } } },
        take: 1,
      });
      const testWord = tokens[0]?.english || 'tiger';
      const testWordBn = tokens[0]?.bangla || 'বাঘ';

      await this.prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          questionText: `What does the word "${testWord}" mean in Bengali?`,
          questionTextBn: `"${testWord}" শব্দটির বাংলা অর্থ কী?`,
          options: [testWordBn, 'অজানা শব্দ', 'মিথ্যা কথা', 'অন্য কিছু'],
          correctIndex: 0,
          explanation: `"${testWord}" translates directly to "${testWordBn}".`,
          xpReward: 10,
        },
      });
    }
  }

  async updateStory(id: string, data: any) {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) throw new NotFoundException('Story not found');

    const updateData: any = { ...data };
    if (data.level !== undefined) updateData.level = Number(data.level);
    if (data.nctbClass !== undefined) updateData.nctbClass = data.nctbClass ? Number(data.nctbClass) : null;
    if (data.durationSeconds !== undefined) updateData.durationSeconds = Number(data.durationSeconds);
    if (data.wordCount !== undefined) updateData.wordCount = Number(data.wordCount);
    if (data.isPremium !== undefined) updateData.isPremium = Boolean(data.isPremium);
    if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);

    const updated = await this.prisma.story.update({
      where: { id },
      data: updateData,
    });

    await this.autoGenerateContent(id);
    return updated;
  }

  async deleteStory(id: string) {
    const story = await this.prisma.story.findUnique({ where: { id } });
    if (!story) throw new NotFoundException('Story not found');

    return this.prisma.story.delete({ where: { id } });
  }

  async addPageToStory(storyId: string, pageIndex: number, imageUrl: string) {
    return this.prisma.storyPage.create({
      data: {
        storyId,
        pageIndex: Number(pageIndex),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      },
    });
  }

  async addSentenceToPage(pageId: string, data: { sentenceIdx: number; englishText: string; banglaText: string; startTime: number; endTime: number }) {
    return this.prisma.sentence.create({
      data: {
        pageId,
        sentenceIdx: Number(data.sentenceIdx),
        englishText: data.englishText,
        banglaText: data.banglaText,
        startTime: Number(data.startTime) || 0,
        endTime: Number(data.endTime) || 0,
      },
    });
  }

  // ─── Video Lesson CMS ─────────────────────────────────────────────────────
  async getAdminVideos(query: { search?: string; isPublished?: boolean | string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.isPublished !== undefined) {
      where.isPublished = query.isPublished === 'true' || query.isPublished === true;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { titleBn: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [videos, total] = await this.prisma.$transaction([
      this.prisma.videoLesson.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.videoLesson.count({ where }),
    ]);

    return {
      videos,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createVideo(data: any) {
    return this.prisma.videoLesson.create({
      data: {
        title: data.title,
        titleBn: data.titleBn,
        description: data.description || '',
        descriptionBn: data.descriptionBn || '',
        youtubeId: data.youtubeId,
        thumbnailUrl: data.thumbnailUrl || `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`,
        durationSeconds: Number(data.durationSeconds) || 0,
        learningPath: data.learningPath,
        level: Number(data.level) || 1,
        nctbClass: data.nctbClass ? Number(data.nctbClass) : null,
        tags: Array.isArray(data.tags) ? data.tags : [],
        isPremium: Boolean(data.isPremium),
        isPublished: Boolean(data.isPublished),
      },
    });
  }

  async updateVideo(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.level !== undefined) updateData.level = Number(data.level);
    if (data.nctbClass !== undefined) updateData.nctbClass = data.nctbClass ? Number(data.nctbClass) : null;
    if (data.durationSeconds !== undefined) updateData.durationSeconds = Number(data.durationSeconds);
    if (data.isPremium !== undefined) updateData.isPremium = Boolean(data.isPremium);
    if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);

    return this.prisma.videoLesson.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteVideo(id: string) {
    return this.prisma.videoLesson.delete({ where: { id } });
  }

  // ─── Subscription & Payment Management ─────────────────────────────────────
  async getSubscriptions(query: { status?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status as any;

    const [subscriptions, total] = await this.prisma.$transaction([
      this.prisma.subscription.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return { subscriptions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async grantSubscription(userId: string, planType: string, days = 30) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Number(days));

    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'PREMIUM' },
    });

    return this.prisma.subscription.create({
      data: {
        userId,
        gateway: 'BKASH',
        status: 'ACTIVE',
        planType: planType || 'MONTHLY',
        expiryDate,
        autoRenew: false,
      },
    });
  }

  async getTransactions(query: { status?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;

    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.paymentTransaction.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.paymentTransaction.count({ where }),
    ]);

    return { transactions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // ─── B2B Organizations ──────────────────────────────────────────────────────
  async getB2BOrganizations() {
    return this.prisma.b2BOrganization.findMany({
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Contributions ──────────────────────────────────────────────────────────
  async getContributions(query: { status?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;

    const [contributions, total] = await this.prisma.$transaction([
      this.prisma.contribution.findMany({
        where,
        include: {
          contributor: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.contribution.count({ where }),
    ]);

    return {
      contributions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async approveContribution(id: string, body: { payoutAmount?: number }) {
    const contribution = await this.prisma.contribution.findUnique({
      where: { id },
    });
    if (!contribution) throw new NotFoundException('Contribution not found');

    const payoutAmount = Number(body.payoutAmount) || 0;
    const isPrivateParent = contribution.contentType === 'VIDEO' && contribution.targetChildId != null;
    const payoutStatus = isPrivateParent ? 'NOT_APPLICABLE' : 'UNPAID';

    // Update contribution status
    const updated = await this.prisma.contribution.update({
      where: { id },
      data: {
        status: 'APPROVED',
        payoutAmount,
        payoutStatus,
      },
    });

    // If it's a VIDEO contribution, automatically provision/create a VideoLesson
    if (contribution.contentType === 'VIDEO') {
      await this.prisma.videoLesson.create({
        data: {
          title: contribution.title,
          titleBn: contribution.title,
          description: contribution.description || 'Contributed Video',
          descriptionBn: contribution.description || 'অবদানকৃত ভিডিও',
          youtubeId: null, // direct MP4 player used
          thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', // default cover
          videoType: isPrivateParent ? 'PARENT' : 'PUBLIC',
          videoUrl: contribution.fileUrl,
          learningPath: 'KIDS',
          level: 1,
          isPremium: false,
          isPublished: true,
          approved: true,
          contributorId: contribution.contributorId,
          targetChildId: contribution.targetChildId,
          payoutAmount,
          payoutStatus,
        },
      });
    }

    return updated;
  }

  async rejectContribution(id: string) {
    const contribution = await this.prisma.contribution.findUnique({ where: { id } });
    if (!contribution) throw new NotFoundException('Contribution not found');

    return this.prisma.contribution.update({
      where: { id },
      data: {
        status: 'REJECTED',
        payoutStatus: 'NOT_APPLICABLE',
      },
    });
  }

  async markContributionPayoutPaid(id: string) {
    const contribution = await this.prisma.contribution.findUnique({ where: { id } });
    if (!contribution) throw new NotFoundException('Contribution not found');

    // Update the contribution payout
    const updated = await this.prisma.contribution.update({
      where: { id },
      data: { payoutStatus: 'PAID' },
    });

    // Also update the linked VideoLesson payout if it was a Video contribution
    if (contribution.contentType === 'VIDEO') {
      await this.prisma.videoLesson.updateMany({
        where: { contributorId: contribution.contributorId, videoUrl: contribution.fileUrl },
        data: { payoutStatus: 'PAID' },
      });
    }

    return updated;
  }
}
