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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({
    adapter,
    log: ['error'],
});
const STORIES_DATA = [
    {
        id: 'the-brave-little-squirrel',
        title: 'The Brave Little Squirrel',
        titleBn: 'সাহসী ছোট্ট কাঠবিড়ালি',
        learningPath: 'KIDS',
        level: 1,
        illustrationUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600',
        tags: ['animals', 'bravery', 'forest'],
        enStory: `High up in an old pine tree lived a little squirrel named Sammy. Sammy had a small tail and giant eyes. Unlike the other squirrels, he was afraid of climbing high branches. One day, a baby bird fell from its nest on the highest branch. The baby bird cried for help. The other animals were too big or too slow to climb. Sammy knew he had to do something. He breathed deeply, ignored his fear, and climbed up the tall trunk. His tiny paws held the rough bark tightly. Sammy reached the highest branch and gently picked up the baby bird. He placed it safely back in its nest. The mother bird thanked him happily. Sammy climbed down, and all the animals cheered. He was no longer afraid of heights.`,
        bnStory: `একটি পুরনো পাইন গাছের মগডালে স্যামি নামের এক ছোট্ট কাঠবিড়ালি বাস করত। স্যামির একটি ছোট লেজ এবং বিশালাকার চোখ ছিল। অন্যান্য কাঠবিড়ালির মতো সে উঁচু ডালে চড়তে ভয় পেত। একদিন সবচেয়ে উঁচু ডালের বাসা থেকে একটি পাখির ছানা পড়ে গেল। পাখির ছানাটি সাহায্যের জন্য চিৎকার করতে লাগল। অন্যান্য পশুরা চড়ার জন্য অনেক বড় বা ধীরগতির ছিল। স্যামি জানত তাকে কিছু করতে হবে। সে একটি গভীর শ্বাস নিল, ভয়কে উপেক্ষা করল এবং লম্বা কাণ্ড বেয়ে ওপরে চড়ল। তার ছোট থাবাগুলো খসখসে বাকল শক্ত করে ধরেছিল। স্যামি সবচেয়ে উঁচু ডালে পৌঁছাল এবং আলতো করে পাখির ছানাটিকে তুলে নিল। সে এটিকে নিরাপদে বাসায় ফেরত রাখল। মা পাখিটি তাকে আনন্দের সাথে ধন্যবাদ জানাল। স্যামি নিচে নেমে এলো এবং সমস্ত পশুরা তাকে সাধুবাদ জানাল। সে আর উচ্চতা ভয় পেত না।`
    },
    {
        id: 'the-magic-paintbrush',
        title: 'The Magic Paintbrush',
        titleBn: 'যাদুকরী তুলি',
        learningPath: 'KIDS',
        level: 2,
        illustrationUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
        tags: ['magic', 'art', 'sharing'],
        enStory: `A poor boy named Liang loved to draw. He did not have money to buy brushes or paint, so he used charcoal and dirt. One night, an old man appeared in his dream and handed him a golden paintbrush. Use this to help the poor, the old man instructed. When Liang woke up, the brush was on his desk. He drew a butterfly on the wall, and it instantly turned real and flew away. Liang was amazed. He started drawing food for hungry families and toys for poor children. A greedy king heard about the paintbrush and ordered his soldiers to capture Liang. The king forced Liang to draw a mountain of gold. Instead, Liang drew a vast sea and a large ship. The king sailed to find the gold, but Liang drew a giant storm that sank the ship. Liang returned to his village, using his magic paintbrush to bring happiness to everyone.`,
        bnStory: `লিয়াং নামের এক দরিদ্র ছেলে ছবি আঁকতে ভালোবাসত। ব্রাশ বা রঙ কেনার মতো টাকা তার কাছে ছিল না, তাই সে কাঠকয়লা এবং মাটি ব্যবহার করত। এক রাতে, তার স্বপ্নে এক বৃদ্ধ আবির্ভূত হলেন এবং তাকে একটি সোনার তুলি দিলেন। এটি দরিদ্রদের সাহায্য করার জন্য ব্যবহার করো, বৃদ্ধ নির্দেশ দিলেন। লিয়াং যখন জেগে উঠল, ব্রাশটি তার ডেস্কে ছিল। সে দেয়ালে একটি প্রজাপতি আঁকল এবং তা সাথে সাথে বাস্তবে পরিণত হয়ে উড়ে গেল। লিয়াং অবাক হয়ে গেল। সে ক্ষুধার্ত পরিবারের জন্য খাবার এবং দরিদ্র শিশুদের জন্য খেলনা আঁকতে শুরু করল। এক লোভী রাজা যাদুকরী তুলির কথা শুনে লিয়াংকে বন্দী করার জন্য তার সৈন্যদের নির্দেশ দিল। রাজা লিয়াংকে সোনার পাহাড় আঁকতে বাধ্য করল। বদলে লিয়াং একটি বিশাল সমুদ্র এবং একটি বড় জাহাজ আঁকল। রাজা সোনার খোঁজে যাত্রা করল, কিন্তু লিয়াং একটি বিশাল ঝড় আঁকল যা জাহাজটিকে ডুবিয়ে দিল। লিয়াং তার গ্রামে ফিরে এলো এবং সবার মুখে হাসি ফোটাতে তার যাদুকরী তুলি ব্যবহার করতে লাগল।`
    },
    {
        id: 'the-mirror-of-truth',
        title: 'The Mirror of Truth',
        titleBn: 'সত্যের আয়না',
        learningPath: 'IELTS',
        level: 3,
        illustrationUrl: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600',
        tags: ['wisdom', 'truth', 'kingdom'],
        enStory: `In an ancient castle, there was a legend about a mirror that showed a person's true character. The mirror did not reflect physical beauty, but the purity of the soul. A young traveler named Clara went to inspect the mirror. She had traveled across many oceans and seen many wonders. Clara entered the dark room where the mirror was kept. The king and his advisors stood beside her. When the greedy prime minister looked into the mirror, he saw a scary snake. He turned away in fear. When the honest farm girl looked, she saw a glowing white flower. Finally, Clara stepped forward. She looked closely at her reflection. She saw a vast ocean with a small boat sailing under a bright star. The king smiled and said: You possess a heart of adventure and hope. Clara realized that truth is the greatest beauty of all.`,
        bnStory: `একটি প্রাচীন দুর্গে এমন এক আয়না নিয়ে রূপকথা ছিল যা একজন মানুষের প্রকৃত চরিত্র দেখাত। আয়নাটি শারীরিক সৌন্দর্য প্রতিফলন করত না, বরং আত্মার পবিত্রতা দেখাত। ক্লারা নামের এক তরুণ পর্যটক আয়নাটি পরীক্ষা করতে গিয়েছিলেন। তিনি অনেক সমুদ্র পাড়ি দিয়েছিলেন এবং অনেক বিস্ময় দেখেছিলেন। ক্লারা অন্ধকার ঘরে প্রবেশ করলেন যেখানে আয়নাটি রাখা ছিল। রাজা এবং তাঁর উপদেষ্টারা তাঁর পাশে দাঁড়িয়ে ছিলেন। লোভী প্রধানমন্ত্রী যখন আয়নায় তাকালেন, তিনি একটি ভীতিজনক সাপ দেখলেন। সে ভয়ে মুখ ফিরিয়ে নিল। যখন সৎ খামারের মেয়েটি তাকাল, সে একটি জ্বলজ্বলে সাদা ফুল দেখল। অবশেষে ক্লারা এগিয়ে গেলেন। তিনি নিজের প্রতিফলনের দিকে মনোযোগ দিয়ে তাকালেন। তিনি একটি উজ্জ্বল তারার নিচে ভেসে চলা একটি ছোট নৌকাসহ এক বিশাল সমুদ্র দেখতে পেলেন। রাজা হাসলেন এবং বললেন: তোমার হৃদয়ে রোমাঞ্চ ও আশা রয়েছে। ক্লারা বুঝতে পারলেন যে সত্যই সবচেয়ে বড় সৌন্দর্য।`
    },
    {
        id: 'the-lost-compass',
        title: 'The Lost Compass',
        titleBn: 'হারিয়ে যাওয়া কম্পাস',
        learningPath: 'SPOKEN',
        level: 2,
        illustrationUrl: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?w=600',
        tags: ['travel', 'compass', 'survival'],
        enStory: `A young hiker named Ryan climbed the misty peaks of the Blue Mountains. Ryan was experienced, but a sudden snowstorm covered the trail. He looked in his bag for his compass, but it was missing. Ryan was lost in the cold wind. He remembered his father's advice: Nature always provides clues. Ryan looked at the trees. He noticed that moss grew mostly on the north side of the trunks. He also watched the direction of the wind and the slope of the land. Ryan followed the downward slope, keeping the mossy side of the trees to his right. After walking for three hours, he saw the warm lights of a mountain cabin. The cabin owner welcomed him with hot tea and a dry blanket. Ryan had survived using his knowledge of nature.`,
        bnStory: `রায়ান নামের এক তরুণ হাইকার ব্লু মাউন্টেনসের কুয়াশাচ্ছন্ন চূড়ায় আরোহণ করছিল। রায়ান অভিজ্ঞ ছিল, কিন্তু হঠাৎ তুষারঝড় পথটি ঢেকে দিল। সে তার কম্পাসের জন্য তার ব্যাগে খুঁজল, কিন্তু সেটি হারিয়ে গিয়েছিল। রায়ান ঠান্ডা বাতাসে হারিয়ে গেল। সে তার বাবার উপদেশ মনে করল: প্রকৃতি সর্বদা সূত্র সরবরাহ করে। রায়ান গাছের দিকে তাকাল। সে লক্ষ্য করল যে শ্যাওলা বেশিরভাগ কাণ্ডের উত্তর দিকে গজায়। সে বাতাসের দিক এবং ভূমির ঢালও পর্যবেক্ষণ করল। রায়ান গাছগুলোর শ্যাওলাযুক্ত অংশকে তার ডানে রেখে ঢাল বেয়ে নিচের দিকে হাঁটতে লাগল। তিন ঘণ্টা হাঁটার পর সে একটি পাহাড়ি কেবিনের উষ্ণ আলো দেখতে পেল। কেবিনের মালিক তাকে গরম চা এবং একটি শুকনো কম্বল দিয়ে স্বাগত জানালেন। প্রকৃতির জ্ঞান ব্যবহার করে রায়ান বেঁচে ফিরেছিল।`
    },
    {
        id: 'the-gift-of-the-wind',
        title: 'The Gift of the Wind',
        titleBn: 'বাতাসের উপহার',
        learningPath: 'KIDS',
        level: 1,
        illustrationUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
        tags: ['wind', 'kids', 'nature'],
        enStory: `On a windy autumn day, a little girl named Lily went to fly her kite in the meadow. The kite was yellow and shaped like a sun. The wind blew strongly, lifting the kite high into the blue sky. Suddenly, the wind blew harder and broke the string. The yellow kite floated away over the hills. Lily was sad and followed the wind. She walked past farms and rivers. In the next village, she saw a farmer standing near a wind-powered pump. The pump was spinning quickly, drawing water for the thirsty crops. The farmer smiled and thanked the wind. Nearby, Lily found her kite caught in a bush. She realized the wind did not steal her kite to be mean. The wind had a job to do, helping the farmers. Lily took her kite home, feeling happy for the wind.`,
        bnStory: `এক ঝড়ো শরতের দিনে, লিলি নামের এক ছোট মেয়ে তৃণভূমিতে তার ঘুড়ি ওড়াতে গেল। ঘুড়িটি ছিল হলুদ এবং সূর্যের মতো দেখতে। বাতাস জোরে বইছিল, ঘুড়িটিকে নীল আকাশে উঁচুতে তুলে নিল। হঠাৎ বাতাস আরও জোরে বইল এবং সুতোটি ছিঁড়ে গেল। হলুদ ঘুড়িটি পাহাড়ের ওপর দিয়ে ভেসে গেল। লিলি দুঃখ পেয়ে বাতাসের পিছু পিছু গেল। সে খামার এবং নদীর পাশ দিয়ে হেঁটে গেল। পরের গ্রামে, সে একজন কৃষককে বায়ুচালিত পাম্পের কাছে দাঁড়িয়ে থাকতে দেখল। পাম্পটি দ্রুত ঘুরছিল এবং তৃষ্ণার্ত ফসলের জন্য জল তুলছিল। কৃষক হাসলেন এবং বাতাসকে ধন্যবাদ জানালেন। কাছেই লিলি একটি ঝোপের মধ্যে তার ঘুড়িটি আটকে থাকতে দেখল। সে বুঝতে পারল বাতাস দুষ্টুমি করে তার ঘুড়ি চুরি করেনি। বাতাসের কাজ ছিল কৃষকদের সাহায্য করা। লিলি বাতাসের জন্য খুশি হয়ে তার ঘুড়িটি বাড়িতে নিয়ে গেল।`
    },
    {
        id: 'the-music-of-the-waves',
        title: 'The Music of the Waves',
        titleBn: 'ঢেউয়ের সুর',
        learningPath: 'SPOKEN',
        level: 3,
        illustrationUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600',
        tags: ['ocean', 'music', 'peace'],
        enStory: `An old sailor named Tomas lived in a cottage on a sandy beach. Tomas loved listening to the sound of the ocean waves. He believed the waves sang a different song every night. One night, during a full moon, the water sparkled like silver. Tomas walked to the shore and sat on a rock. He heard a soft, melodious song coming from the water. A beautiful dolphin leaped in the air, leaving a trail of glowing foam. The dolphin swam close to the rock and chirped in harmony with the waves. Tomas took out his flute and played a gentle tune. The dolphin and the waves seemed to answer him. Tomas felt a deep sense of peace. He realized that the ocean was a vast orchestra, and humans were invited to play along.`,
        bnStory: `টমাস নামের এক বৃদ্ধ নাবিক বালুকাময় সৈকতে একটি কুটিরে বাস করতেন। টমাস সমুদ্রের ঢেউয়ের শব্দ শুনতে ভালোবাসতেন। তিনি বিশ্বাস করতেন যে ঢেউ প্রতি রাতে একটি ভিন্ন গান গায়। এক রাতে, পূর্ণিমার সময়, জল রূপোর মতো জ্বলজ্বল করছিল। টমাস তীরের দিকে হেঁটে গেলেন এবং একটি পাথরের ওপর বসলেন। তিনি জল থেকে একটি মৃদু, সুমধুর গান শুনতে পেলেন। একটি সুন্দর ডলফিন বাতাসে লাফিয়ে উঠল এবং জ্বলজ্বলে ফেনা রেখে গেল। ডলফিনটি পাথরের কাছাকাছি সাঁতার কেটে ঢেউয়ের সাথে তাল মিলিয়ে কিচিরমিচির শব্দ করল। টমাস তার বাঁশি বের করে একটি মৃদু সুর বাজালেন। ডলফিন এবং ঢেউ তার উত্তর দিল বলে মনে হলো। টমাস গভীর শান্তি অনুভব করলেন। তিনি বুঝতে পারলেন যে মহাসাগর একটি বিশাল অর্কেস্ট্রা, এবং মানুষও সেখানে অংশ নিতে আমন্ত্রিত।`
    },
    {
        id: 'the-clockmakers-secret',
        title: "The Clockmaker's Secret",
        titleBn: 'ঘড়ি প্রস্তুতকারকের রহস্য',
        learningPath: 'VOCAB',
        level: 3,
        illustrationUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600',
        tags: ['mystery', 'time', 'gears'],
        enStory: `In a quiet alley of London, there was an old clock shop owned by Mr. Benjamin. The shop was filled with hundreds of ticking clocks. The loud ticking sounded like a mechanical heartbeat. A young girl named Emma visited the shop often. She loved watching Mr. Benjamin assemble the gears. One evening, Mr. Benjamin showed Emma a small silver pocket watch. This watch is special, he whispered. It does not measure hours, but moments of happiness. He opened the back lid, revealing intricate gears turning smoothly. Emma noticed the watch ticked only when she smiled. Mr. Benjamin smiled and said: Time is not just numbers on a dial. It is the joy we share with others. Emma understood the clockmaker's secret. She went home, promising to spend her time making others happy.`,
        bnStory: `লন্ডনের এক শান্ত গলিতে মিস্টার বেঞ্জামিনের একটি পুরনো ঘড়ির দোকান ছিল। দোকানটি শত শত টিকটিক করা ঘড়িতে পূর্ণ ছিল। সেই জোরে টিকটিক শব্দ একটি যান্ত্রিক হার্টবিটের মতো শোনাত। এমা নামের এক তরুণী প্রায়ই দোকানে আসত। সে মিস্টার বেঞ্জামিনকে গিয়ারগুলো ফিট করতে দেখতে ভালোবাসত। এক সন্ধ্যায়, মিস্টার বেঞ্জামিন এমাকে একটি ছোট রুপোর পকেট ঘড়ি দেখালেন। এই ঘড়িটি বিশেষ, তিনি ফিসফিস করে বললেন। এটি সময় পরিমাপ করে না, বরং আনন্দের মুহূর্তগুলো মাপে। তিনি পেছনের ঢাকনাটি খুললেন, যাতে জটিল গিয়ারগুলো মসৃণভাবে ঘুরতে দেখা গেল। এমা লক্ষ্য করল ঘড়িটি কেবল তখনই টিকটিক করছিল যখন সে হাসছিল। মিস্টার বেঞ্জামিন হাসলেন এবং বললেন: সময় কেবল একটি ডায়ালের সংখ্যা নয়। এটি সেই আনন্দ যা আমরা অন্যদের সাথে ভাগ করি। এমা ঘড়ি প্রস্তুতকারকের রহস্য বুঝতে পারল। সে অন্যদের সুখী করার প্রতিশ্রুতি দিয়ে বাড়ি ফিরে গেল।`
    },
    {
        id: 'the-star-that-fell',
        title: 'The Star That Fell',
        titleBn: 'যে তারাটি ঝরে পড়েছিল',
        learningPath: 'KIDS',
        level: 2,
        illustrationUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600',
        tags: ['star', 'kids', 'sky'],
        enStory: `One clear summer night, a little boy named Toby saw a shooting star fall into the nearby meadow. Toby ran outside with a flashlight. He walked through the tall grass, searching for the fallen star. In the center of the field, he found a tiny glowing baby star. The star was shivering and looked very dim. Toby wrapped it in his warm wool scarf. The star blinked softly, thanking him. Toby knew the star belonged in the sky. He placed the star on a high hill. He stood on his tiptoes and threw the star gently toward the dark sky. The star floated up, growing brighter and brighter. It took its place in the sky, shining down on Toby's house. Toby smiled, knowing he had a friend in the universe.`,
        bnStory: `এক পরিষ্কার গ্রীষ্মের রাতে, টোবি নামের এক ছোট ছেলে একটি খসে পড়া তারা পাশের তৃণভূমিতে পড়তে দেখল। টোবি একটি টর্চলাইট নিয়ে বাইরে দৌড়াল। সে পতিত তারার সন্ধানে লম্বা ঘাসের মধ্য দিয়ে হেঁটে গেল। মাঠের মাঝখানে সে একটি ছোট জ্বলজ্বলে শিশু তারা দেখতে পেল। তারাটি কাঁপছিল এবং তাকে খুব ম্লান দেখাচ্ছিল। টোবি এটিকে তার উষ্ণ পশমি স্কার্ফে জড়িয়ে নিল। তারাটি মৃদুভাবে পিটপিট করল এবং তাকে ধন্যবাদ জানাল। টোবি জানত তারাটির স্থান আকাশে। সে তারাটিকে একটি উঁচু পাহাড়ে নিয়ে গেল। সে পায়ের আঙুলের ওপর ভর দিয়ে দাঁড়াল এবং আলতো করে তারাটিকে অন্ধকার আকাশের দিকে ছুঁড়ে দিল। তারাটি ওপরে ভেসে উঠল এবং আরও উজ্জ্বল হতে লাগল। এটি আকাশে নিজের স্থান নিল এবং টোবির বাড়ির ওপর আলো ছড়াতে লাগল। টোবি হাসল, এটা জেনে যে মহাবিশ্বে তার একজন বন্ধু আছে।`
    },
    {
        id: 'the-merchant-of-venice-lesson',
        title: 'The Merchant of Venice Lesson',
        titleBn: 'ভেনিসের বণিকের শিক্ষা',
        learningPath: 'JOB',
        level: 4,
        illustrationUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        tags: ['justice', 'wit', 'literature'],
        enStory: `In the famous port of Venice, merchants traded goods from all over the world. A young lawyer named Portia had to defend a friend named Antonio in a difficult court case. Antonio had borrowed money from a greedy merchant and signed a dangerous contract. The contract stated that if Antonio could not pay the debt, the merchant could take a pound of his flesh. Antonio lost his ships and could not pay the money. The merchant demanded his flesh in court. Portia dressed as a male judge and entered the courtroom. She examined the contract closely. Portia turned to the merchant and said: The contract allows you a pound of flesh, but not a single drop of blood. If you shed his blood, you will violate the law. The merchant realized he had been defeated by Portia's wit. The court dismissed the case, saving Antonio's life.`,
        bnStory: `ভেনিসের বিখ্যাত বন্দরে বণিকরা সারা বিশ্ব থেকে পণ্য ব্যবসা করত। পোর্শিয়া নামের এক তরুণী আইনজীবীকে একটি কঠিন আদালতের মামলায় আন্তোনিও নামের এক বন্ধুকে রক্ষা করতে হয়েছিল। আন্তোনিও এক লোভী বণিকের কাছ থেকে টাকা ধার করেছিল এবং একটি বিপজ্জনক চুক্তিতে স্বাক্ষর করেছিল। চুক্তিতে বলা ছিল যে আন্তোনিও যদি ঋণ পরিশোধ করতে না পারে তবে বণিক তার শরীরের এক পাউন্ড মাংস নিতে পারবে। আন্তোনিও তার জাহাজগুলো হারিয়েছিল এবং টাকা দিতে পারেনি। বণিক আদালতে তার মাংস দাবি করল। পোর্শিয়া পুরুষ বিচারকের পোশাক পরে আদালতে প্রবেশ করলেন। তিনি চুক্তিটি মনোযোগ দিয়ে পরীক্ষা করলেন। পোর্শিয়া বণিকের দিকে ফিরে বললেন: চুক্তিটি তোমাকে এক পাউন্ড মাংসের অনুমতি দেয়, কিন্তু এক ফোঁটা রক্তের নয়। তুমি যদি তার রক্ত ঝরাও তবে তুমি আইন লঙ্ঘন করবে। বণিক বুঝতে পারল সে পোর্শিয়ার বুদ্ধির কাছে হেরে গেছে। আদালত মামলাটি খারিজ করে দিল এবং আন্তোনিও-র জীবন বেঁচে গেল।`
    },
    {
        id: 'the-emperors-new-clothes',
        title: "The Emperor's New Clothes",
        titleBn: 'সম্রাটের নতুন পোশাক',
        learningPath: 'ADMISSION',
        level: 3,
        illustrationUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
        tags: ['honesty', 'pride', 'folklore'],
        enStory: `An emperor who loved fine clothes hired two weavers who promised to make him a magical suit. The weavers claimed the suit was invisible to anyone who was stupid or incompetent. In reality, the weavers were swindlers who set up empty looms. The emperor sent his ministers to inspect the work. The ministers saw nothing on the looms, but they did not want to appear stupid. They praised the invisible fabric. Finally, the emperor put on the invisible suit and marched through the city in a grand parade. The citizens cheered, not wanting to admit they saw nothing. Suddenly, a little boy shouted: The emperor has no clothes! The crowd began to whisper, realizing the truth. The emperor felt embarrassed but continued the parade. The story teaches us to speak the truth even when others are afraid.`,
        bnStory: `সুন্দর পোশাক ভালোবাসতেন এমন এক সম্রাট দুজন তাঁতিকে ভাড়া করলেন যারা তাকে একটি যাদুকরী স্যুট তৈরি করে দেওয়ার প্রতিশ্রুতি দিয়েছিল। তাঁতিরা দাবি করল যে এই স্যুটটি এমন যে কারও কাছে অদৃশ্য থাকবে যে বোকা বা অযোগ্য। বাস্তবে তাঁতিরা ছিল প্রতারক যারা খালি তাঁত বসিয়েছিল। সম্রাট তার মন্ত্রীদের কাজ পরীক্ষা করতে পাঠালেন। মন্ত্রীরা তাঁতে কিছুই দেখতে পেলেন না, কিন্তু তারা নিজেদের বোকা দেখাতে চাননি। তারা অদৃশ্য কাপড়ের প্রশংসা করলেন। অবশেষে সম্রাট অদৃশ্য স্যুটটি পরে একটি বড় প্যারেডে শহরের মধ্য দিয়ে মার্চ করলেন। নাগরিকরা উল্লাস করল, কেউ স্বীকার করতে চাইল না যে তারা কিছুই দেখতে পাচ্ছে না। হঠাৎ এক ছোট ছেলে চিৎকার করে বলল: সম্রাটের গায়ে কোনো কাপড় নেই! জনতা ফিসফিস করতে শুরু করল এবং সত্যটি বুঝতে পারল। সম্রাট লজ্জিত বোধ করলেন কিন্তু প্যারেড চালিয়ে গেলেন। এই গল্প আমাদের শেখায় যে অন্যেরা ভয় পেলেও সত্য বলা উচিত।`
    },
    {
        id: 'the-golden-touch-of-midas',
        title: 'The Golden Touch of Midas',
        titleBn: 'মিডাসের সোনার স্পর্শ',
        learningPath: 'VOCAB',
        level: 2,
        illustrationUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
        tags: ['greed', 'myth', 'family'],
        enStory: `King Midas was a wealthy king who loved gold more than anything. A mysterious visitor granted him a single wish. Midas wished that everything he touched would turn to gold. The visitor agreed. The next morning, Midas was excited. He touched his bed, and it instantly turned to gold. He touched a rose in the garden, and it became a solid gold flower. Midas felt very powerful. However, when he tried to eat breakfast, the food turned to gold in his mouth. He could not drink water. Suddenly, his young daughter ran into the room. Midas hugged her, and she turned into a golden statue. Midas wept in despair. He realized his greed had destroyed his happiness. He prayed for the touch to be removed. The visitor returned and told him to wash his hands in the river. Midas did so, and his daughter returned to life. He lived happily, valuing family over gold.`,
        bnStory: `রাজা মিডাস ছিলেন এক ধনী রাজা যিনি সোনাকে অন্য যেকোনো কিছুর চেয়ে বেশি ভালোবাসতেন। এক রহস্যময় দর্শনার্থী তাকে একটি ইচ্ছা পূরণের সুযোগ দিলেন। মিডাস চাইলেন যে তিনি যা স্পর্শ করবেন তাই সোনায় পরিণত হবে। দর্শনার্থী রাজি হলেন। পরদিন সকালে মিডাস উত্তেজিত ছিলেন। তিনি তার বিছানা স্পর্শ করলেন এবং তা তাৎক্ষণিকভাবে সোনায় পরিণত হলো। তিনি বাগানের একটি গোলাপ স্পর্শ করলেন এবং তা একটি নিরেট সোনার ফুলে পরিণত হলো। মিডাস নিজেকে খুব শক্তিশালী মনে করলেন। তবে তিনি যখন সকালের খাবার খেতে গেলেন, খাবারটি তার মুখে সোনায় পরিণত হলো। তিনি জল পান করতে পারলেন না। হঠাৎ তার ছোট মেয়ে ঘরে দৌড়ে এলো। মিডাস তাকে জড়িয়ে ধরলেন এবং সে একটি সোনার মূর্তিতে পরিণত হলো। মিডাস হতাশায় কাঁদলেন। তিনি বুঝতে পারলেন তার লোভ তার সুখ ধ্বংস করেছে। তিনি তার এই স্পর্শ দূর করার জন্য প্রার্থনা করলেন। দর্শনার্থী ফিরে এসে তাকে নদীর জলে হাত ধুতে বললেন। মিডাস তাই করলেন এবং তার মেয়ে আবার জীবিত ফিরে পেল। সে সোনার চেয়ে পরিবারকে মূল্য দিয়ে সুখে বাস করতে লাগল।`
    },
    {
        id: 'the-wishing-well',
        title: 'The Wishing Well',
        titleBn: 'ইচ্ছে পূরণ কূপ',
        learningPath: 'KIDS',
        level: 1,
        illustrationUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
        tags: ['wishes', 'kids', 'magic'],
        enStory: `In the middle of a beautiful forest, there was an old stone wishing well. The well was surrounded by wildflowers. A little boy named Leo visited the well. He held a small silver coin in his hand. Leo sat on the edge of the well and closed his eyes. He thought about what he wanted. He did not wish for toys or candy. Instead, he wished for his sick mother to recover quickly. Leo dropped the coin into the deep water. A tiny green frog hopped onto a lily pad and croaked softly. The next day, Leo's mother woke up feeling strong and healthy. Leo returned to the well and left a handful of fresh daisies as a thank you. He learned that selfless wishes are the most powerful of all.`,
        bnStory: `একটি সুন্দর বনের মাঝখানে একটি পুরনো পাথরের ইচ্ছে পূরণ কূপ ছিল। কূপটি বুনো ফুলে ঘেরা ছিল। লিও নামের এক ছোট ছেলে কূপটি দেখতে গেল। তার হাতে একটি ছোট রুপোর মুদ্রা ছিল। লিও কূপের ধারে বসল এবং চোখ বন্ধ করল। সে চিন্তা করল সে কী চায়। সে খেলনা বা ক্যান্ডির জন্য ইচ্ছা প্রকাশ করেনি। বদলে সে চাইল তার অসুস্থ মা যেন দ্রুত সুস্থ হয়ে ওঠেন। লিও মুদ্রাটি গভীর জলে ফেলে দিল। একটি ছোট সবুজ ব্যাঙ শাপলা পাতার ওপর লাফিয়ে উঠল এবং মৃদু ডাকল। পরদিন লিওর মা সুস্থ ও সবল হয়ে জেগে উঠলেন। লিও কূপে ফিরে গেল এবং ধন্যবাদ হিসেবে এক মুঠো তাজা ডেইজি ফুল রেখে গেল। সে শিখল যে নিঃস্বার্থ ইচ্ছাগুলোই সবচেয়ে বেশি শক্তিশালী।`
    },
    {
        id: 'the-lighthouse-keeper',
        title: 'The Lighthouse Keeper',
        titleBn: 'বাতিঘরের রক্ষক',
        learningPath: 'SPOKEN',
        level: 2,
        illustrationUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
        tags: ['lighthouse', 'sea', 'resilience'],
        enStory: `An old man named John lived on a rocky island. He was the keeper of the Hillside Lighthouse. Every evening, he climbed the spiral stairs to light the giant lamp. The bright beam guided ships safely through the dangerous rocky waters. One autumn night, a powerful storm struck the island. The wind blew fiercely, and giant waves crashed against the stone tower. Suddenly, the power failed, and the lamp went out. John had to act quickly. He used his matches to light the backup oil lamp. His hands were shaking from the cold, but he managed to keep the light burning. A large cargo ship was heading toward the rocks, but the captain saw the oil lamp just in time and turned away. The captain blew the ship horn in gratitude. John smiled, knowing his duty had saved lives.`,
        bnStory: `জন নামের এক বৃদ্ধ একটি পাথুরে দ্বীপে বাস করতেন। তিনি ছিলেন হিলসাইড বাতিঘরের রক্ষক। প্রতিদিন সন্ধ্যায় তিনি বিশাল বাতিটি জ্বালানোর জন্য সর্পিল সিঁড়ি বেয়ে ওপরে উঠতেন। উজ্জ্বল আলোটি জাহাজগুলোকে বিপজ্জনক পাথুরে জলের মধ্য দিয়ে নিরাপদে পথ দেখাত। এক শরতের রাতে দ্বীপে একটি শক্তিশালী ঝড় আঘাত হেনেছিল। বাতাস তীব্রভাবে বইছিল এবং বিশাল ঢেউ পাথরের টাওয়ারে আছড়ে পড়ছিল। হঠাৎ বিদ্যুৎ চলে গেল এবং বাতিটি নিভে গেল। জনকে দ্রুত কাজ করতে হয়েছিল। সে তার দেশলাই ব্যবহার করে ব্যাকআপ তেল প্রদীপটি জ্বালাল। ঠাণ্ডায় তার হাত কাঁপছিল, কিন্তু সে আলো জ্বালিয়ে রাখতে সক্ষম হলো। একটি বড় মালবাহী জাহাজ পাথরের দিকে এগিয়ে আসছিল, কিন্তু ক্যাপ্টেন ঠিক সময়ে তেল প্রদীপটি দেখতে পেয়ে জাহাজটি ঘুরিয়ে নিলেন। ক্যাপ্টেন কৃতজ্ঞতায় জাহাজের হর্ন বাজালেন। জন হাসলেন, এটা জেনে যে তার কর্তব্য জীবন বাঁচিয়েছে।`
    },
    {
        id: 'the-ancient-library',
        title: 'The Ancient Library',
        titleBn: 'প্রাচীন লাইব্রেরি',
        learningPath: 'IELTS',
        level: 4,
        illustrationUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600',
        tags: ['history', 'books', 'research'],
        enStory: `In the city of Alexandria, there was a vast library containing millions of ancient scrolls and books. Researchers from all over the world went there to study history and science. A young archivist named Elena worked there, preserving the old manuscripts. One day, while organizing a dusty room in the cellar, she found a hidden wooden box. Inside the box was a scroll written in a lost language. Elena spent months researching and comparing characters. She realized the scroll described an ancient irrigation system that could bring water to dry fields. Elena shared her discovery with the city engineers. They rebuilt the system, transforming the dry valley into fertile farmland. Elena realized that the library was not just a house of books, but a source of life.`,
        bnStory: `আলেকজান্দ্রিয়া শহরে একটি বিশাল লাইব্রেরি ছিল যাতে লক্ষ লক্ষ প্রাচীন স্ক্রোল এবং বই ছিল। বিশ্বজুড়ে গবেষকরা সেখানে ইতিহাস এবং বিজ্ঞান অধ্যয়ন করতে যেতেন। এলেনা নামের এক তরুণ সংরক্ষণাগার কর্মী সেখানে কাজ করতেন, যিনি পুরনো পাণ্ডুলিপিগুলো সংরক্ষণ করতেন। একদিন, ভাঁড়ার ঘরের একটি ধূলিময় ঘর গোছানোর সময়, তিনি একটি লুকানো কাঠের বাক্স দেখতে পেলেন। বাক্সের ভেতরে একটি হারিয়ে যাওয়া ভাষায় লেখা স্ক্রোল ছিল। এলেনা চরিত্রগুলো তুলনা করতে এবং গবেষণা করতে কয়েক মাস ব্যয় করলেন। তিনি বুঝতে পারলেন স্ক্রোলটিতে একটি প্রাচীন সেচ ব্যবস্থার বিবরণ দেওয়া হয়েছে যা শুকনো মাঠে জল নিয়ে আসতে পারে। এলেনা তার আবিষ্কার শহরের প্রকৌশলীদের সাথে শেয়ার করলেন। তারা ব্যবস্থাটি পুনর্নির্মাণ করল, যার ফলে শুষ্ক উপত্যকা উর্বর কৃষিজমিতে পরিণত হলো। এলেনা বুঝতে পারলেন যে লাইব্রেরিটি কেবল বইয়ের ঘর ছিল না, বরং জীবনের উৎস ছিল।`
    },
    {
        id: 'the-dream-catcher',
        title: 'The Dream Catcher',
        titleBn: 'স্বপ্ন জালক',
        learningPath: 'KIDS',
        level: 2,
        illustrationUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600',
        tags: ['dreams', 'kids', 'magic'],
        enStory: `A little girl named Maya had bad dreams every night. She was afraid of sleeping in the dark. Her grandmother noticed her fear and decided to help. She sat with Maya and wove a hoop using willow branches and colorful threads. She added a soft white feather at the bottom. This is a dream catcher, the grandmother explained. It catches bad dreams in the web, while good dreams slide down the feather to you. Maya hung the dream catcher over her bed. That night, she slept peacefully and dreamed of flying on a friendly cloud. She was no longer afraid of the dark. Maya thanked her grandmother, realizing that love can catch any nightmare.`,
        bnStory: `মায়া নামের এক ছোট মেয়ে প্রতি রাতে খারাপ স্বপ্ন দেখত। সে অন্ধকারে ঘুমাতে ভয় পেত। তার ঠাকুমা তার ভয় লক্ষ্য করলেন এবং সাহায্য করার সিদ্ধান্ত নিলেন। তিনি মায়ার সাথে বসলেন এবং উইলো গাছের ডাল এবং রঙিন সুতো ব্যবহার করে একটি রিং বুনলেন। তিনি নিচে একটি নরম সাদা পালক যুক্ত করলেন। এটি একটি স্বপ্ন জালক (Dream Catcher), ঠাকুমা ব্যাখ্যা করলেন। এটি জালে খারাপ স্বপ্নগুলোকে আটকে রাখে, আর ভালো স্বপ্নগুলো পালক বেয়ে তোমার কাছে নেমে আসে। মায়া তার বিছানার ওপর স্বপ্ন জালকটি ঝুলিয়ে দিল। সেদিন রাতে সে শান্তিতে ঘুমাল এবং একটি বন্ধুত্বপূর্ণ মেঘে চড়ে ওড়ার স্বপ্ন দেখল। সে আর অন্ধকারকে ভয় পেত না। মায়া তার ঠাকুমাকে ধন্যবাদ জানাল, এটা বুঝতে পেরে যে ভালবাসা যেকোনো দুঃস্বপ্নকে আটকে দিতে পারে।`
    }
];
async function seedMoreStories() {
    console.log('🌱 Seeding 15 additional high-quality stories...');
    for (const data of STORIES_DATA) {
        const wordCount = data.enStory.split(/\s+/).length;
        console.log(`[Seed] Story: "${data.title}" (${wordCount} words)`);
        await prisma.storyPage.deleteMany({ where: { storyId: data.id } });
        await prisma.quiz.deleteMany({ where: { storyId: data.id } });
        await prisma.story.upsert({
            where: { id: data.id },
            update: {
                title: data.title,
                titleBn: data.titleBn,
                description: data.enStory,
                descriptionBn: data.bnStory,
                level: data.level,
                learningPath: data.learningPath,
                illustrationUrl: data.illustrationUrl,
                audioUrl: '',
                durationSeconds: Math.ceil(wordCount * 0.75),
                wordCount: wordCount,
                tags: data.tags,
                isPremium: false,
                isPublished: true,
            },
            create: {
                id: data.id,
                title: data.title,
                titleBn: data.titleBn,
                description: data.enStory,
                descriptionBn: data.bnStory,
                level: data.level,
                learningPath: data.learningPath,
                illustrationUrl: data.illustrationUrl,
                audioUrl: '',
                durationSeconds: Math.ceil(wordCount * 0.75),
                wordCount: wordCount,
                tags: data.tags,
                isPremium: false,
                isPublished: true,
            }
        });
        const enSentences = data.enStory
            .split(/(?<=[.!?])\s+/)
            .map(s => s.trim())
            .filter(Boolean);
        const bnSentences = data.bnStory
            .split(/(?<=[।!?])\s+/)
            .map(s => s.trim())
            .filter(Boolean);
        const SENTENCES_PER_PAGE = 4;
        const pagesCount = Math.ceil(enSentences.length / SENTENCES_PER_PAGE);
        const vocabDict = {
            squirrel: { bn: 'কাঠবিড়ালি', ipa: 'ˈskwɪrəl' },
            highest: { bn: 'সর্বোচ্চ', ipa: 'ˈhaɪɪst' },
            ignored: { bn: 'উপেক্ষা করেছে', ipa: 'ɪɡˈnɔːd' },
            heights: { bn: 'উচ্চতা', ipa: 'haɪts' },
            paintbrush: { bn: 'তুলি', ipa: 'ˈpeɪntbrʌʃ' },
            butterfly: { bn: 'প্রজাপতি', ipa: 'ˈbʌtəflaɪ' },
            hungry: { bn: 'ক্ষুধার্ত', ipa: 'ˈhʌŋɡri' },
            greedy: { bn: 'লোভী', ipa: 'ˈɡriːdi' },
            mirror: { bn: 'আয়না', ipa: 'ˈmɪrər' },
            purity: { bn: 'পবিত্রতা', ipa: 'ˈpjʊərəti' },
            reflection: { bn: 'প্রতিফলন', ipa: 'rɪˈflɛkʃən' },
            compass: { bn: 'কম্পাস', ipa: 'ˈkʌmpəs' },
            hiker: { bn: 'হাইকার', ipa: 'ˈhaɪkər' },
            windy: { bn: 'ঝড়ো', ipa: 'ˈwɪndi' },
            pump: { bn: 'পাম্প', ipa: 'pʌmp' },
            sailor: { bn: 'নাবিক', ipa: 'ˈseɪlər' },
            flute: { bn: 'বাঁশি', ipa: 'fluːt' },
            clockmaker: { bn: 'ঘড়ি প্রস্তুতকারক', ipa: 'ˈklɒkˌmeɪkər' },
            gears: { bn: 'গিয়ারসমূহ', ipa: 'ɡɪəz' },
            shooting: { bn: 'খসে পড়া', ipa: 'ˈʃuːtɪŋ' },
            universe: { bn: 'মহাবিশ্ব', ipa: 'ˈjuːnɪvɜːs' },
            merchant: { bn: 'বণিক', ipa: 'ˈmɜːtʃənt' },
            lawyer: { bn: 'আইনজীবী', ipa: 'ˈlɔːjər' },
            flesh: { bn: 'মাংস', ipa: 'flɛʃ' },
            emperor: { bn: 'সম্রাট', ipa: 'ˈɛmpərə' },
            invisible: { bn: 'অদৃশ্য', ipa: 'ɪnˈvɪzəbl' },
            embarrassed: { bn: 'লজ্জিত', ipa: 'ɪmˈbærəst' },
            golden: { bn: 'সোনার', ipa: 'ˈɡəʊldən' },
            touch: { bn: 'স্পর্শ', ipa: 'tʌtʃ' },
            statue: { bn: 'মূর্তি', ipa: 'ˈstætʃuː' },
            wishing: { bn: 'ইচ্ছে', ipa: 'wɪʃɪŋ' },
            selfless: { bn: 'নিঃস্বার্থ', ipa: 'ˈsɛlflɪs' },
            lighthouse: { bn: 'বাতিঘর', ipa: 'ˈlaɪthaʊs' },
            spiral: { bn: 'সর্পিল', ipa: 'ˈspaɪərəl' },
            ancient: { bn: 'প্রাচীন', ipa: 'ˈeɪnʃənt' },
            irrigation: { bn: 'সেচ', ipa: 'ˌɪrɪˈɡeɪʃən' },
            dream: { bn: 'স্বপ্ন', ipa: 'driːm' },
            nightmare: { bn: 'দুঃস্বপ্ন', ipa: 'ˈnaɪtmɛər' }
        };
        const stopWords = new Set([
            'the', 'and', 'was', 'with', 'one', 'got', 'him', 'but', 'his', 'her',
            'there', 'about', 'where', 'some', 'they', 'that', 'this', 'have', 'been',
            'from', 'into', 'also', 'not', 'for', 'are', 'had', 'has', 'very', 'then',
            'when', 'what', 'which', 'who', 'she', 'its', 'our', 'all', 'each', 'out',
        ]);
        let globalSentenceIdx = 0;
        for (let pIdx = 0; pIdx < pagesCount; pIdx++) {
            const page = await prisma.storyPage.create({
                data: {
                    storyId: data.id,
                    pageIndex: pIdx,
                    imageUrl: data.illustrationUrl,
                },
            });
            const startIdx = pIdx * SENTENCES_PER_PAGE;
            const pageEnSentences = enSentences.slice(startIdx, startIdx + SENTENCES_PER_PAGE);
            const pageBnSentences = bnSentences.slice(startIdx, startIdx + SENTENCES_PER_PAGE);
            for (let sIdx = 0; sIdx < pageEnSentences.length; sIdx++) {
                const enText = pageEnSentences[sIdx];
                const bnText = pageBnSentences[sIdx] || enText;
                const timeBase = globalSentenceIdx * 4.5;
                const sentence = await prisma.sentence.create({
                    data: {
                        pageId: page.id,
                        sentenceIdx: sIdx,
                        englishText: enText,
                        banglaText: bnText,
                        startTime: timeBase,
                        endTime: timeBase + 4.5,
                    },
                });
                const words = enText
                    .toLowerCase()
                    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '')
                    .split(/\s+/)
                    .filter(w => w.length > 2 && !stopWords.has(w));
                const uniqueWords = [...new Set(words)].slice(0, 4);
                for (const rawWord of uniqueWords) {
                    const cleanWord = rawWord.trim();
                    if (!cleanWord)
                        continue;
                    const dictEntry = vocabDict[cleanWord] ||
                        vocabDict[cleanWord.replace(/s$/, '')] ||
                        vocabDict[cleanWord.replace(/(?:ing|ed)$/, '')] ||
                        vocabDict[cleanWord.replace(/(?:ing|ed)$/, 'e')];
                    if (dictEntry) {
                        await prisma.wordToken.create({
                            data: {
                                sentenceId: sentence.id,
                                english: cleanWord,
                                bangla: dictEntry.bn,
                                sentenceContext: enText.length > 60 ? enText.slice(0, 57) + '...' : enText,
                                pronunciationG: dictEntry.ipa,
                            },
                        });
                    }
                }
                globalSentenceIdx++;
            }
        }
        const quiz = await prisma.quiz.create({
            data: { storyId: data.id },
        });
        await prisma.quizQuestion.create({
            data: {
                quizId: quiz.id,
                questionText: `What lesson did you learn from the story "${data.title}"?`,
                questionTextBn: `"${data.titleBn}" গল্পটি থেকে কী শিক্ষা পাওয়া যায়?`,
                options: [
                    'Values of honesty, courage, and kindness are important',
                    'We should ignore our friends and help no one',
                    'It is best to sleep all day and not study',
                    'Always be greedy and gather gold coins',
                ],
                correctIndex: 0,
                explanation: 'The story narrates positive human values.',
                xpReward: 10,
            },
        });
        console.log(`✅ Seeded pages and quiz for: "${data.title}"`);
    }
    console.log('🎉 15 additional stories seeded successfully!');
}
seedMoreStories()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    pool.end();
});
//# sourceMappingURL=seed-more-stories.js.map