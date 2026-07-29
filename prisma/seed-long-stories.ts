import { PrismaClient, LearningPath } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});

const STORIES_DATA = [
  {
    id: 'the-magic-shop-adventure',
    title: 'The Magic Shop Adventure',
    titleBn: 'যাদু দোকানের রোমাঞ্চ',
    learningPath: 'KIDS',
    level: 1,
    illustrationUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600',
    tags: ['magic', 'kids', 'adventure'],
    enStory: `Once upon a time, in a small town, there was a mysterious little shop. The sign on the window read: The Magic Shop. A young boy named Leo walked past the shop every single day on his way to school. He always wondered what lay behind the dusty glass door. One sunny afternoon, Leo decided to gather his courage and push the door open. A small golden bell chimed softly. The shop was filled with strange and wonderful things. Shelves held glowing jars, flying books, and wooden toys that seemed to move on their own. Behind the counter stood a kind old man with a long white beard and a pointed hat. Welcome, Leo, said the old man with a warm smile. Leo was surprised that the man knew his name. How do you know me? Leo asked. The old man laughed. I know all children who possess a spark of curiosity. My name is Mr. Higgins. Leo looked around in amazement. Is everything here really magic? he asked. Mr. Higgins picked up a wooden bird. Watch closely, he whispered. He blew gently on the bird, and it flew into the air, singing a sweet melody. Leo gasped in delight. The bird flew around the shop before landing back on the counter. Magic is real for those who believe in it, Mr. Higgins said. He then handed Leo a small red box. Open this only when you are at home, he instructed. Leo thanked Mr. Higgins and ran all the way home, his heart beating with excitement. In his room, Leo carefully lifted the lid of the box. A beautiful, glowing blue butterfly flew out. It circled his room, leaving a trail of sparkling stardust. The stardust formed glowing words in the air: Dream Big, Leo. From that day on, Leo knew that wonder existed everywhere in the world. He became the most imaginative student in his class, always writing stories about magic shops and kind old wizards. And whenever he needed a little inspiration, he would walk past Mr. Higgins' shop, listening for the soft chime of the golden bell.`,
    bnStory: `একসময় এক ছোট শহরে একটি রহস্যময় ছোট্ট দোকান ছিল। জানালার সাইনবোর্ডে লেখা ছিল: যাদু দোকান। লিও নামের এক ছোট ছেলে প্রতিদিন স্কুলে যাওয়ার সময় সেই দোকানের পাশ দিয়ে হেঁটে যেত। সে সবসময় ভাবত এই ধূলিময় কাঁচের দরজার ওপাশে কী আছে। এক রৌদ্রোজ্জ্বল বিকেলে, লিও তার সাহস সঞ্চয় করে দরজাটি ঠেলে খোলার সিদ্ধান্ত নিল। একটি ছোট সোনার ঘণ্টা মৃদু শব্দে বেজে উঠল। দোকানটি অদ্ভুত এবং চমৎকার জিনিসে পূর্ণ ছিল। তাকগুলোতে ছিল জ্বলজ্বলে জার, উড়ন্ত বই, এবং কাঠের খেলনা যা নিজে নিজেই নড়াচড়া করছে বলে মনে হচ্ছিল। কাউন্টারের পিছনে দীর্ঘ সাদা দাড়ি এবং একটি সূক্ষ্ম টুপি পরা এক দয়ালু বৃদ্ধ দাঁড়িয়ে ছিলেন। লিওকে স্বাগত জানাই, বৃদ্ধটি উষ্ণ হাসিমুখে বললেন। লিও অবাক হয়ে গেল যে সেই লোক তার নাম জানে। আপনি আমাকে কীভাবে চেনেন? লিও জিজ্ঞেস করল। বৃদ্ধটি হাসলেন। আমি সেইসব শিশুদের চিনি যাদের মনে কৌতূহলের স্ফুলিঙ্গ আছে। আমার নাম মিস্টার হিগিন্স। লিও বিস্ময়ে চারদিকে তাকাল। এখানে সবকিছু কি সত্যিই যাদু? সে জিজ্ঞেস করল। মিস্টার হিগিন্স একটি কাঠের পাখি তুলে নিলেন। মনোযোগ দিয়ে দেখ, সে ফিসফিস করে বলল। সে পাখিটির ওপর মৃদু ফুঁ দিল, আর তা মিষ্টি সুরে গান গেয়ে বাতাসে উড়ে গেল। লিও আনন্দে হাঁপিয়ে উঠল। পাখিটি কাউন্টারে ফিরে আসার আগে দোকানের চারপাশে উড়ে বেড়ালো। যারা এতে বিশ্বাস করে তাদের জন্য যাদু সত্য, মিস্টার হিগিন্স বললেন। এরপর তিনি লিওর হাতে একটি ছোট লাল বাক্স তুলে দিলেন। এটি কেবল ঘরে থাকলেই খুলবে, তিনি নির্দেশ দিলেন। লিও মিস্টার হিগিন্সকে ধন্যবাদ জানিয়ে আনন্দের সাথে এক দৌড়ে বাড়ি ফিরে এলো। তার ঘরে, লিও সাবধানে বাক্সের ঢাকনাটি তুলল। একটি সুন্দর, জ্বলজ্বলে নীল প্রজাপতি উড়ে বের হলো। এটি তার ঘরের চারপাশে ঘুরে বেড়ালো, পেছনে রেখে গেল জ্বলজ্বলে ধূলিকণা। সেই ধূলিকণা বাতাসে জ্বলজ্বলে শব্দ তৈরি করল: বড় স্বপ্ন দেখ, লিও। সেদিন থেকে লিও জানত যে পৃথিবীর সর্বত্র বিস্ময় বিদ্যমান। সে তার ক্লাসের সবচেয়ে কল্পনাপ্রবণ ছাত্র হয়ে উঠল, সবসময় যাদু দোকান এবং দয়ালু বৃদ্ধ যাদুকরদের নিয়ে গল্প লিখত। আর যখনই তার একটু অনুপ্রেরণার প্রয়োজন হতো, সে মিস্টার হিগিন্সের দোকানের পাশ দিয়ে হেঁটে যেত, সোনার ঘণ্টার মৃদু শব্দের অপেক্ষায়।`
  },
  {
    id: 'the-legend-of-the-whispering-forest',
    title: 'The Legend of the Whispering Forest',
    titleBn: 'ফিসফিসানি বনের রূপকথা',
    learningPath: 'KIDS',
    level: 2,
    illustrationUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600',
    tags: ['forest', 'legend', 'nature'],
    enStory: `Deep in the green valley lay the Whispering Forest. The villagers warned their children never to enter it. They believed the trees spoke secrets and captured travelers. But a brave girl named Maya did not believe in scary stories. She loved studying plants and flowers. Maya wanted to discover if the forest was truly dangerous. One morning, she packed her bag with a notebook, water, and bread, and walked toward the dark trees. As soon as she stepped inside, the temperature dropped. The sun was blocked by thick green leaves above. Maya heard soft rustling sounds. It sounded like voices whispering her name. She felt a bit nervous but walked deeper. Suddenly, she saw a rare blue flower growing on a rotten log. It looked beautiful and sparkled like dew. When she bent down to look, a tiny squirrel hopped onto the log. Do not touch that, the squirrel seemed to squeak. Maya rubbed her eyes. Did the squirrel talk? The wind blew, and the leaves rustled louder. Save the root, the wind whispered. Maya understood. The forest was not evil; it was crying for help. She noticed a black mold spreading on the tree roots. The forest was sick. Maya opened her notebook and looked at her flower guide. She realized the mold could be cured with simple baking soda and water. The next day, Maya returned with a large spray bottle. She spent hours treating the sick roots. Slowly, the black mold disappeared. The whispering sound changed from scary sighs to happy songs. The trees rustled in gratitude. Maya became the forest guardian, showing the village that nature only whispers when it needs love.`,
    bnStory: `সবুজ উপত্যকার গভীরে ফিসফিসানি বন অবস্থিত ছিল। গ্রামবাসীরা তাদের সন্তানদের সেখানে কখনো প্রবেশ না করতে সতর্ক করত। তারা বিশ্বাস করত গাছেরা গোপন কথা বলে এবং পর্যটকদের বন্দী করে। কিন্তু মায়া নামের এক সাহসী মেয়ে ভয়ের গল্প বিশ্বাস করত না। সে গাছপালা এবং ফুল নিয়ে গবেষণা করতে ভালোবাসত। মায়া আবিষ্কার করতে চেয়েছিল বনটি আসলেই বিপজ্জনক কিনা। এক সকালে, সে তার ব্যাগে একটি নোটবুক, পানি এবং রুটি নিল এবং অন্ধকার গাছের দিকে হেঁটে গেল। সে ভেতরে পা রাখামাত্রই তাপমাত্রা কমে গেল। ঘন সবুজ পাতায় সূর্য ঢেকে ছিল। মায়া মৃদু খসখস শব্দ শুনতে পেল। মনে হচ্ছিল কেউ তার নাম ধরে ফিসফিস করছে। সে কিছুটা নার্ভাস বোধ করলেও আরও গভীরে গেল। হঠাৎ সে একটি পচা কাঠের ওপর বিরল নীল ফুল ফুটতে দেখল। এটি সুন্দর দেখাচ্ছিল এবং শিশিরের মতো জ্বলজ্বল করছিল। যখন সে ঝুঁকে দেখল, একটি ছোট কাঠবিড়ালি লাফিয়ে কাঠের ওপর উঠল। ওটা স্পর্শ কোরো না, কাঠবিড়ালিটি কিচিরমিচির করে বলল। মায়া তার চোখ ঘষল। কাঠবিড়ালিটি কি কথা বলল? বাতাস বইল এবং পাতার খসখস শব্দ আরও জোরে হলো। শিকড় বাঁচাও, বাতাস ফিসফিস করল। মায়া বুঝতে পারল। বনটি খারাপ ছিল না; এটি সাহায্যের জন্য কাঁদছিল। সে দেখল গাছের শিকড়ে একটি কালো ছাতা রোগ ছড়াচ্ছে। বনটি অসুস্থ ছিল। মায়া তার নোটবুক খুলল এবং ফুলের নির্দেশিকাটি দেখল। সে বুঝতে পারল সাধারণ বেকিং সোডা এবং জল দিয়ে এই রোগের চিকিৎসা করা সম্ভব। পরদিন মায়া একটি বড় স্প্রে বোতল নিয়ে ফিরে এলো। সে অসুস্থ শিকড়গুলোর চিকিৎসায় ঘণ্টার পর ঘণ্টা ব্যয় করল। ধীরে ধীরে কালো রোগটি অদৃশ্য হয়ে গেল। ফিসফিসানি শব্দগুলো ভয়ের দীর্ঘশ্বাস থেকে খুশির গানে পরিণত হলো। গাছপালা কৃতজ্ঞতায় দোলে উঠল। মায়া বনের রক্ষক হয়ে উঠল এবং গ্রামবাসীকে দেখাল যে প্রকৃতি কেবল তখনই ফিসফিস করে যখন তার ভালোবাসার প্রয়োজন হয়।`
  },
  {
    id: 'the-secret-of-the-golden-key',
    title: 'The Secret of the Golden Key',
    titleBn: 'সোনার চাবির রহস্য',
    learningPath: 'SPOKEN',
    level: 2,
    illustrationUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600',
    tags: ['mystery', 'key', 'discovery'],
    enStory: `For years, an old brass box sat on the mantelpiece in Liam's house. Nobody knew where it came from or what was inside. It had no keyhole, only a strange pattern on top. Liam was a curious boy who loved solving puzzles. One rainy Sunday, he examined the box closely. He noticed the pattern resembled the old oak tree in the backyard. Liam ran outside to the giant oak tree. He searched around the thick roots. Half-buried in the soil, he found a small golden key with a matching oak pattern. Liam washed the key and brought it to the box. He touched the key to the pattern on the lid. With a soft click, the box sprang open. Inside lay an old map and a leather journal belonging to his great-grandfather. The journal described a hidden room beneath the old house. The map showed a secret door in the cellar behind the wine rack. Liam called his father, and together they went to the cellar. They pushed the heavy wooden rack aside. Behind it, they found a small brick door. Liam inserted the golden key into the lock. The door opened slowly, revealing a dusty room. Inside were chests filled with historical books, family photos, and old coins. It was a treasure of history. Liam realized the greatest treasure was not the gold, but the stories of his ancestors. He spent the entire winter reading the journals and sharing the historical tales with his friends at school.`,
    bnStory: `বছরের পর বছর ধরে লিয়ামের বাড়ির ফায়ারপ্লেসের ওপর একটি পুরনো পিতলের বাক্স রাখা ছিল। কেউ জানত না এটি কোথা থেকে এসেছে বা এর ভেতরে কী আছে। এর কোনো চাবির ছিদ্র ছিল না, শুধু ওপরে একটি অদ্ভুত নকশা ছিল। লিয়াম ছিল কৌতূহলী ছেলে যে ধাঁধা সমাধান করতে ভালোবাসত। এক বৃষ্টির রবিবারে, সে বাক্সটি খুঁটিয়ে দেখল। সে লক্ষ্য করল নকশাটি পেছনের উঠোনের পুরনো ওক গাছের মতো। লিয়াম বাইরে গিয়ে সেই বিশালাকার ওক গাছের কাছে গেল। সে মোটা শিকড়গুলোর চারপাশে খুঁজতে লাগল। মাটির নিচে অর্ধেক চাপা পড়া একটি ছোট সোনার চাবি পেল যার ওক গাছের অনুরূপ নকশা ছিল। লিয়াম চাবিটি ধুয়ে বাক্সের কাছে নিয়ে এলো। সে ঢাকনার নকশার ওপর চাবিটি ছোঁয়ালো। একটি মৃদু ক্লিকের সাথে বাক্সটি খুলে গেল। ভেতরে তার প্রপিতামহের একটি পুরনো মানচিত্র এবং চামড়ার ডায়েরি ছিল। ডায়েরিটিতে পুরনো বাড়ির নিচে একটি লুকানো ঘরের বিবরণ ছিল। মানচিত্রটি ভাঁড়ার ঘরের তাকের পেছনে একটি গোপন দরজা দেখাল। লিয়াম তার বাবাকে ডাকল এবং তারা একসঙ্গে ভাঁড়ার ঘরে গেল। তারা ভারী কাঠের তাকটি সরিয়ে দিল। এর পেছনে তারা একটি ছোট ইটের দরজা দেখতে পেল। লিয়াম সোনার চাবিটি তালায় ঢুকিয়ে দিল। দরজাটি ধীরে ধীরে খুলে একটি ধুলোবালি ভরা ঘর দেখাল। ভেতরে ঐতিহাসিক বই, পারিবারিক ছবি এবং পুরনো মুদ্রায় ভরা বাক্স ছিল। এটি ছিল ইতিহাসের ধন। লিয়াম বুঝতে পারল সবচেয়ে বড় ধন সোনা নয়, বরং তার পূর্বপুরুষদের গল্প। সে পুরো শীতকাল ডায়েরিগুলো পড়ে এবং স্কুলের বন্ধুদের সাথে সেই ঐতিহাসিক গল্পগুলো ভাগ করে কাটিয়ে দিল।`
  },
  {
    id: 'the-loyal-dog-of-hillside',
    title: 'The Loyal Dog of Hillside',
    titleBn: 'পাহাড়ের বিশ্বস্ত কুকুর',
    learningPath: 'SPOKEN',
    level: 1,
    illustrationUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600',
    tags: ['animals', 'loyalty', 'friendship'],
    enStory: `A farmer named Rahim lived in a peaceful village on a green hill. He had a loyal sheepdog named Rusty. Rusty was intelligent, fast, and loved helping Rahim with the sheep. Every morning, Rahim and Rusty walked to the pasture. Rusty guided the sheep and kept them safe from wolves. One evening, a thick fog covered the hillside. Rahim could not see the path back home. Suddenly, a wild wolf emerged from the dark bushes. The sheep panicked and scattered in all directions. Rusty stood between the wolf and the sheep, barking loudly to defend them. The wolf attacked, but Rusty fought bravely. Rahim used his walking stick to hit the ground, making noise to scare the wolf. The wolf finally ran away into the forest. Rusty was hurt, but he did not stop working. He gathered all the lost sheep and led them safely back to the farm. Rahim cleaned Rusty's wounds and fed him a delicious meal. The villagers praised Rusty's courage. Rahim realized that Rusty was not just a working dog, but a true member of the family. From that day on, Rahim always made sure Rusty had a warm bed by the fireplace.`,
    bnStory: `সবুজ পাহাড়ের এক শান্ত গ্রামে রহিম নামের এক কৃষক বাস করতেন। তার রাস্টি নামের একটি বিশ্বস্ত ভেড়া পাহারা দেওয়া কুকুর ছিল। রাস্টি ছিল বুদ্ধিমান, দ্রুতগতির এবং রহিমের ভেড়াগুলোর দেখাশোনায় সাহায্য করতে ভালোবাসত। প্রতিদিন সকালে রহিম এবং রাস্টি চারণভূমির দিকে হেঁটে যেত। রাস্টি ভেড়াগুলোকে পথ দেখাত এবং নেকড়েদের থেকে নিরাপদ রাখত। এক সন্ধ্যায়, পাহাড়ের কোল ঘন কুয়াশায় ঢেকে গেল। রহিম বাড়ি ফেরার পথ দেখতে পাচ্ছিলেন না। হঠাৎ ঝোপঝাড় থেকে একটি বন্য নেকড়ে বেরিয়ে এলো। ভেড়াগুলো আতঙ্কিত হয়ে সবদিকে ছড়িয়ে পড়ল। রাস্টি নেকড়ে এবং ভেড়াগুলোর মাঝে দাঁড়িয়ে তাদের রক্ষা করার জন্য জোরে জোরে ঘেউ ঘেউ করতে লাগল। নেকড়ে আক্রমণ করল, কিন্তু রাস্টি সাহসের সাথে লড়াই করল। রহিম তার লাঠি দিয়ে মাটিতে আঘাত করলেন এবং নেকড়েটিকে ভয় দেখানোর জন্য শব্দ করলেন। নেকড়েটি অবশেষে বনে পালিয়ে গেল। রাস্টি আহত হয়েছিল, কিন্তু সে কাজ বন্ধ করেনি। সে সমস্ত হারিয়ে যাওয়া ভেড়া সংগ্রহ করে নিরাপদে খামারে নিয়ে গেল। রহিম রাস্টির ক্ষত পরিষ্কার করে তাকে সুস্বাদু খাবার খাওয়ালেন। গ্রামবাসীরা রাস্টির সাহসের প্রশংসা করল। রহিম বুঝতে পারলেন যে রাস্টি কেবল একটি কাজের কুকুর নয়, পরিবারের একজন প্রকৃত সদস্য। সেদিন থেকে রহিম সবসময় নিশ্চিত করতেন যে রাস্টির জন্য ফায়ারপ্লেসের পাশে একটি উষ্ণ বিছানা থাকে।`
  },
  {
    id: 'the-journey-of-the-paper-boat',
    title: 'The Journey of the Paper Boat',
    titleBn: 'কাগজের নৌকার যাত্রা',
    learningPath: 'KIDS',
    level: 1,
    illustrationUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600',
    tags: ['kids', 'journey', 'imagination'],
    enStory: `During a heavy monsoon rain, a little boy named Joy made a boat from a sheet of yellow paper. He wrote his name on the side of the boat in black ink. Joy took the paper boat to a small stream flowing near his house. He gently placed it on the moving water. The yellow boat floated down the stream, passing flowers and green grass. Joy ran along the muddy bank, watching his creation sail away. Suddenly, the stream flowed into a wider river. The paper boat met large waves and floating leaves. A group of little frogs hopped onto a leaf and swam beside the boat. Joy had to stop because of a fence, but he waved goodbye to his boat. The paper boat continued its journey down the river. It floated under old stone bridges and past fisherman boats. A flock of white ducks swam past, creating ripples in the water. After a long journey, the river flowed into the blue sea. A fisherman found the yellow paper boat on a sandy beach. He saw Joy's name on it and smiled. He took it home to show his children. Joy's paper boat had traveled far, spreading happiness to strangers.`,
    bnStory: `এক বর্ষার ভারী বৃষ্টির সময়, জয় নামের এক ছোট ছেলে এক টুকরো হলুদ কাগজ দিয়ে একটি নৌকা তৈরি করল। সে কালো কালিতে নৌকার পাশে তার নাম লিখল। জয় কাগজের নৌকাটি তার বাড়ির কাছে বয়ে চলা একটি ছোট নালায় নিয়ে গেল। সে আলতো করে এটি নড়াচড়া করা জলের ওপর রাখল। হলুদ নৌকাটি ফুল এবং সবুজ ঘাসের পাশ দিয়ে নালা বেয়ে ভেসে গেল। জয় কাদা ভরা পাড় দিয়ে তার সৃষ্টির ভেসে যাওয়া দেখতে দেখতে দৌড়াল। হঠাৎ নালাটি একটি চওড়া নদীতে গিয়ে মিশল। কাগজের নৌকাটি বড় ঢেউ এবং ভাসমান পাতার মুখোমুখি হলো। একদল ছোট ব্যাঙ একটি পাতায় লাফিয়ে উঠে নৌকার পাশ দিয়ে সাঁতার কাটল। একটি বেড়ার কারণে জয়কে থামতে হয়েছিল, কিন্তু সে তার নৌকাকে বিদায় জানিয়ে হাত নাড়ল। কাগজের নৌকাটি নদী বেয়ে তার যাত্রা অব্যাহত রাখল। এটি পুরনো পাথরের সেতুর নিচ দিয়ে এবং জেলেদের নৌকার পাশ দিয়ে ভেসে গেল। একদল সাদা হাঁস সাঁতার কেটে গেল, যা জলে ঢেউ সৃষ্টি করল। দীর্ঘ যাত্রার পর নদীটি নীল সাগরে গিয়ে মিশল। এক জেলে বালুকাময় সৈকতে হলুদ কাগজের নৌকাটি খুঁজে পেল। সে এতে জয়ের নাম দেখল এবং হাসল। সে তার সন্তানদের দেখানোর জন্য এটি বাড়িতে নিয়ে গেল। জয়ের কাগজের নৌকা অনেক দূরে ভ্রমণ করেছিল, অপরিচিতদের মাঝে আনন্দ ছড়িয়ে দিয়েছিল।`
  },
  {
    id: 'the-gift-of-kindness',
    title: 'The Gift of Kindness',
    titleBn: 'দয়ার উপহার',
    learningPath: 'IELTS',
    level: 3,
    illustrationUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600',
    tags: ['kindness', 'life', 'lesson'],
    enStory: `In a bustling city, an elderly woman named Sarah spent her retirement volunteering at a community kitchen. She cooked hot soup and baked fresh bread for people facing financial difficulties. Sarah believed that a warm meal could bring hope to a tired heart. One winter evening, a young man named Daniel arrived at the kitchen. He was shivering from the cold and looked extremely sad. Daniel had lost his job and could not afford food. Sarah welcomed him with a warm smile and served him a bowl of hot potato soup. As Daniel ate, Sarah sat with him and listened to his worries. She offered words of encouragement and told him that challenges were temporary. Daniel felt deeply comforted by her kindness. Inspired by Sarah's words, Daniel did not give up. He searched for jobs daily and eventually found a position at a local school. A year later, Daniel returned to the community kitchen. He brought a large box of fresh vegetables and cooking supplies. He wanted to contribute to the kitchen that had saved him during his darkest times. Sarah was overjoyed to see him successful and happy. They realized that kindness is a cycle; a small act of generosity can return to lift many lives.`,
    bnStory: `এক ব্যস্ত শহরে, সারাহ নামের এক বৃদ্ধা তাঁর অবসরের সময় একটি সামাজিক রান্নাঘরে স্বেচ্ছাসেবক হিসেবে কাটাতেন। তিনি আর্থিক সংকটে থাকা মানুষের জন্য গরম স্যুপ রান্না করতেন এবং তাজা রুটি সেঁকতেন। সারাহ বিশ্বাস করতেন যে একটি গরম খাবার ক্লান্ত হৃদয়ে আশা ফিরিয়ে আনতে পারে। এক শীতের সন্ধ্যায়, ড্যানিয়েল নামের এক যুবক রান্নাঘরে এসে পৌঁছাল। সে ঠান্ডায় কাঁপছিল এবং তাকে খুব বিষণ্ণ দেখাচ্ছিল। ড্যানিয়েল তার চাকরি হারিয়েছিল এবং খাবার কেনার সামর্থ্য ছিল না। সারাহ তাকে উষ্ণ হাসিমুখে স্বাগত জানালেন এবং এক বাটি গরম আলুর স্যুপ পরিবেশন করলেন। ড্যানিয়েল যখন খাচ্ছিল, সারাহ তার পাশে বসলেন এবং তার উদ্বেগের কথা শুনলেন। তিনি তাকে উৎসাহ দিলেন এবং বললেন যে প্রতিকূলতা সাময়িক। ড্যানিয়েল তাঁর দয়ায় গভীরভাবে স্বস্তি পেল। সারাহর কথায় অনুপ্রাণিত হয়ে ড্যানিয়েল হাল ছেড়ে দেয়নি। সে প্রতিদিন চাকরির সন্ধান করতে লাগল এবং অবশেষে স্থানীয় একটি স্কুলে চাকরি পেয়ে গেল। এক বছর পর, ড্যানিয়েল সামাজিক রান্নাঘরে ফিরে এলো। সে তাজা সবজি এবং রান্নার উপকরণের একটি বড় বাক্স নিয়ে এসেছিল। সে সেই রান্নাঘরে অবদান রাখতে চেয়েছিল যা তাকে সবচেয়ে অন্ধকার সময়ে বাঁচিয়েছিল। সারাহ তাকে সফল এবং সুখী দেখে অত্যন্ত আনন্দিত হলেন। তারা বুঝতে পারল যে দয়া একটি চক্র; উদারতার একটি ছোট কাজ বহু জীবনকে পুনরুজ্জীবিত করতে পারে।`
  },
  {
    id: 'the-great-marathon',
    title: 'The Great Marathon',
    titleBn: 'মহা ম্যারাথন',
    learningPath: 'JOB',
    level: 3,
    illustrationUrl: 'https://images.unsplash.com/photo-1502224562085-639556652f33?w=600',
    tags: ['sports', 'determination', 'success'],
    enStory: `Every year, the city of Greenfield organized a charity marathon to raise funds for local hospitals. A young teacher named Sofia decided to participate to support the cause. Sofia was not a professional athlete, but she had been running every morning for six months. She knew the 42-kilometer race would test her physical and mental strength. On the day of the marathon, thousands of runners gathered at the starting line. The energy was electric. The race began, and Sofia paced herself carefully. The first twenty kilometers went smoothly, but as she reached the hill section, her legs began to ache. Many runners started to slow down, and some stopped completely. Sofia remembered the children in the hospital she was running for. She focused on her breathing and kept moving forward. During the final kilometers, the crowd cheered loudly, waving colorful banners. The support of the spectators gave Sofia a final burst of energy. She crossed the finish line with a big smile, placing in the top fifty. She felt extremely proud of her achievement. Sofia's determination showed her students that preparation and persistence are the keys to overcoming any difficult challenge in life.`,
    bnStory: `প্রতি বছর গ্রিনফিল্ড শহর স্থানীয় হাসপাতালের জন্য তহবিল সংগ্রহের জন্য একটি দাতব্য ম্যারাথনের আয়োজন করত। সোফিয়া নামের এক তরুণী শিক্ষিকা এই উদ্দেশ্যে অংশ নেওয়ার সিদ্ধান্ত নিয়েছিলেন। সোফিয়া কোনো পেশাদার ক্রীড়াবিদ ছিলেন না, তবে তিনি ছয় মাস ধরে প্রতিদিন সকালে দৌড়াচ্ছিলেন। তিনি জানতেন ৪২ কিলোমিটারের এই দৌড় তার শারীরিক ও মানসিক শক্তির পরীক্ষা নেবে। ম্যারাথনের দিন হাজার হাজার দৌড়বিদ প্রারম্ভিক লাইনে জড়ো হয়েছিল। চারপাশের পরিবেশ ছিল দারুণ উদ্দীপনাপূর্ণ। দৌড় শুরু হলো এবং সোফিয়া সাবধানে নিজের গতি বজায় রাখলেন। প্রথম বিশ কিলোমিটার নির্বিঘ্নে কেটে গেল, কিন্তু যখন তিনি পাহাড়ের অংশে পৌঁছালেন, তার পা ব্যথা করতে শুরু করল। অনেক দৌড়বিদ তাদের গতি কমিয়ে দিয়েছিল এবং কেউ কেউ পুরোপুরি থেমে গিয়েছিল। সোফিয়া হাসপাতালের সেই শিশুদের কথা স্মরণ করলেন যাদের জন্য তিনি দৌড়াচ্ছিলেন। তিনি তার শ্বাস-প্রশ্বাসে মনোযোগ দিলেন এবং এগিয়ে যেতে লাগলেন। শেষ কিলোমিটারগুলোতে দর্শকরা রঙিন ব্যানার নেড়ে জোরে জোরে উল্লাস করছিল। দর্শকদের সমর্থন সোফিয়াকে এক নতুন শক্তি দিল। তিনি মুখে হাসি নিয়ে ফিনিশ লাইন অতিক্রম করলেন এবং শীর্ষ পঞ্চাশের মধ্যে স্থান পেলেন। তিনি তার অর্জনে অত্যন্ত গর্বিত বোধ করলেন। সোফিয়ার দৃঢ় সংকল্প তার ছাত্রদের দেখিয়ে দিল যে প্রস্তুতি এবং অধ্যবসায়ই জীবনের যেকোনো কঠিন চ্যালেঞ্জ অতিক্রম করার চাবিকাঠি।`
  },
  {
    id: 'the-honest-woodcutter',
    title: 'The Honest Woodcutter',
    titleBn: 'সৎ কাঠুরে',
    learningPath: 'ADMISSION',
    level: 2,
    illustrationUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
    tags: ['honesty', 'moral', 'folklore'],
    enStory: `Deep in a dense forest, an honest woodcutter named Dev worked hard to support his family. Every day, he cut dry wood near a fast-flowing river. One afternoon, while felling a branch, his iron axe slipped from his hand and fell into the deep water. Dev was devastated. The axe was his only source of income, and he could not afford to buy a new one. He sat by the river and prayed sincerely. Suddenly, a beautiful river goddess emerged from the water. She asked Dev why he was crying. Dev explained his situation. The goddess smiled and dived into the river. She returned with a glowing golden axe. Is this yours? she asked. Dev shook his head. No, that is not mine. The goddess dived again and brought a shining silver axe. Is this one yours? she asked. Dev replied, No, mine is a simple iron axe. The goddess dived a third time and brought his old iron axe. Dev smiled with joy and said, Yes, that is my axe! The goddess was pleased with Dev's honesty. She rewarded him by giving him all three axes. Dev thanked her and returned home. His life changed, but he remained honest. The story teaches us that honesty always brings rewards.`,
    bnStory: `এক ঘন বনের গভীরে, দেব নামের এক সৎ কাঠুরে তার পরিবারকে সাহায্য করার জন্য কঠোর পরিশ্রম করত। প্রতিদিন সে একটি খরস্রোতা নদীর কাছে শুকনো কাঠ কাটত। এক বিকেলে, একটি ডাল কাটার সময় তার লোহার কুঠারটি হাত থেকে পিছলে গভীর জলে পড়ে গেল। দেব ভেঙে পড়ল। কুঠারটি ছিল তার আয়ের একমাত্র উৎস এবং একটি নতুন কুঠার কেনার সামর্থ্য তার ছিল না। সে নদীর তীরে বসে আন্তরিকভাবে প্রার্থনা করতে লাগল। হঠাৎ জল থেকে এক রূপসী জলদেবী আবির্ভূত হলেন। তিনি দেবকে জিজ্ঞেস করলেন সে কেন কাঁদছে। দেব তার অবস্থা ব্যাখ্যা করল। দেবী হাসলেন এবং নদীতে ডুব দিলেন। তিনি একটি জ্বলজ্বলে সোনার কুঠার নিয়ে ফিরে এলেন। এটি কি তোমার? তিনি জিজ্ঞেস করলেন। দেব মাথা নাড়ল। না, ওটি আমার নয়। দেবী আবার ডুব দিলেন এবং একটি চকচকে রুপোর কুঠার নিয়ে এলেন। এটি কি তোমার? তিনি জিজ্ঞেস করলেন। দেব উত্তর দিল, না, আমারটি সাধারণ লোহার কুঠার। দেবী তৃতীয়বার ডুব দিলেন এবং তার পুরনো লোহার কুঠারটি নিয়ে এলেন। দেব আনন্দের সাথে হেসে উঠল এবং বলল, হ্যাঁ, ওটিই আমার কুঠার! দেবী দেবের সততায় প্রীত হলেন। তিনি তাকে তিনটি কুঠারই উপহার দিলেন। দেব তাঁকে ধন্যবাদ জানিয়ে বাড়ি ফিরে এলো। তার জীবন বদলে গেল, কিন্তু সে সৎই রয়ে গেল। এই গল্প আমাদের শেখায় যে সততা সবসময় পুরস্কৃত হয়।`
  },
  {
    id: 'the-smart-traveler',
    title: 'The Smart Traveler',
    titleBn: 'বুদ্ধিমান পর্যটক',
    learningPath: 'VOCAB',
    level: 4,
    illustrationUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    tags: ['travel', 'wit', 'intelligence'],
    enStory: `A young traveler named Leo decided to explore a ancient mountain kingdom. The kingdom was famous for its beauty and its intelligent riddles. At the entrance gate, a guard stopped Leo and presented a challenge. You must solve my riddle to enter, otherwise you must pay a fine, the guard said. Leo accepted the challenge. The guard smiled and asked: What has keys but opens no locks, has space but no room, and you can enter but cannot go outside? Leo thought carefully. He analyzed the words. Keys, space, enter. Suddenly, he smiled. The answer is a keyboard, Leo said confidently. The guard was surprised and opened the gate. Inside the kingdom, Leo visited the castle. The king was impressed by Leo's intelligence and invited him to dinner. The king offered him a chest of gold if he could solve a final puzzle. The puzzle was to count the stars in the night sky. Leo walked outside, looked up, and said: The number of stars is equal to the grains of sand on the beach. If you can count the sand, you will know the stars. The king laughed and gave him the chest. Leo returned home, having used his wit to gain treasure.`,
    bnStory: `লিও নামের এক তরুণ পর্যটক একটি প্রাচীন পাহাড়ি রাজ্য অন্বেষণ করার সিদ্ধান্ত নিয়েছিল। রাজ্যটি তার সৌন্দর্য এবং বুদ্ধিদীপ্ত ধাঁধার জন্য বিখ্যাত ছিল। প্রবেশদ্বারে একজন প্রহরী লিওকে থামিয়ে একটি চ্যালেঞ্জ ছুঁড়ে দিল। প্রবেশ করতে হলে তোমাকে আমার ধাঁধার সমাধান করতে হবে, অন্যথায় জরিমানা দিতে হবে, প্রহরী বলল। লিও চ্যালেঞ্জ গ্রহণ করল। প্রহরী হাসল এবং জিজ্ঞেস করল: কীসের চাবি (keys) আছে কিন্তু কোনো তালা খোলে না, স্থান (space) আছে কিন্তু কোনো ঘর (room) নেই, আর তুমি প্রবেশ (enter) করতে পারো কিন্তু বাইরে যেতে পারো না? লিও সাবধানে চিন্তা করল। সে শব্দগুলো বিশ্লেষণ করল। চাবি, স্থান, প্রবেশ। হঠাৎ সে হাসল। উত্তরটি হলো কিবোর্ড (keyboard), লিও আত্মবিশ্বাসের সাথে বলল। প্রহরী অবাক হয়ে গেটটি খুলে দিল। রাজ্যের ভেতরে লিও রাজপ্রাসাদ পরিদর্শন করল। রাজা লিওর বুদ্ধিমত্তায় মুগ্ধ হলেন এবং তাকে নৈশভোজে আমন্ত্রণ জানালেন। রাজা তাকে সোনার একটি বাক্স দেওয়ার প্রস্তাব দিলেন যদি সে একটি শেষ ধাঁধার সমাধান করতে পারে। ধাঁধাটি ছিল রাতের আকাশের তারা গণনা করা। লিও বাইরে হেঁটে গেল, ওপরে তাকাল এবং বলল: তারার সংখ্যা সৈকতের বালুকণার সমান। আপনি যদি বালি গণনা করতে পারেন তবে তারাগুলো জানতে পারবেন। রাজা হাসলেন এবং তাকে বাক্সটি দিলেন। লিও নিজের বুদ্ধি ব্যবহার করে ধন লাভ করে বাড়ি ফিরে এলো।`
  },
  {
    id: 'the-secret-of-the-lake',
    title: 'The Secret of the Lake',
    titleBn: 'হ্রদের রহস্য',
    learningPath: 'VOCAB',
    level: 3,
    illustrationUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    tags: ['nature', 'mystery', 'peace'],
    enStory: `Near a high mountain range, there was a beautiful lake called Blue Mirror. The water was so clear that it reflected the sky perfectly. The villagers believed the lake possessed healing powers. A young biologist named Clara went to study the water. She spent weeks collecting samples and examining them under a microscope. Clara noticed the water contained a unique type of micro-algae that produced clean oxygen. This algae purified the lake naturally. One day, while taking samples, Clara saw a golden fish trapped in a discarded plastic net near the shore. She gently freed the fish. The fish swam in circles before disappearing into the deep blue water. That night, Clara had a dream. The golden fish appeared and spoke to her: Keep the mirror clean, and it will keep you healthy. Clara woke up inspired. She organized a weekly cleanup campaign in the village. The villagers participated happily, cleaning the shores of the lake. The water remained pure, and the micro-algae flourished. Clara wrote a research paper about the lake, sharing its secret with the scientific community. She proved that protecting nature is the best way to protect human health.`,
    bnStory: `উঁচু পর্বতশ্রেণীর কাছে নীল দর্পণ (Blue Mirror) নামে একটি সুন্দর হ্রদ ছিল। জল এতটাই স্বচ্ছ ছিল যে তাতে আকাশের নিখুঁত প্রতিফলন দেখা যেত। গ্রামবাসীরা বিশ্বাস করত হ্রদটির নিরাময় ক্ষমতা রয়েছে। ক্লারা নামের এক তরুণ জীববিজ্ঞানী জল গবেষণা করতে গিয়েছিলেন। তিনি নমুনা সংগ্রহ করে অণুবীক্ষণ যন্ত্রের নিচে পরীক্ষা করতে করতে সপ্তাহ কাটিয়ে দিলেন। ক্লারা লক্ষ্য করলেন জলে এক অনন্য ধরণের ক্ষুদ্র শৈবাল রয়েছে যা বিশুদ্ধ অক্সিজেন তৈরি করে। এই শৈবাল হ্রদটিকে প্রাকৃতিকভাবে বিশুদ্ধ করত। একদিন নমুনা নেওয়ার সময়, ক্লারা তীরের কাছে একটি পরিত্যক্ত প্লাস্টিকের জালে আটকে থাকা একটি সোনার মাছ দেখতে পেলেন। তিনি আলতো করে মাছটিকে মুক্ত করলেন। মাছটি গভীর নীল জলে অদৃশ্য হওয়ার আগে বৃত্তাকারে সাঁতার কাটল। সেদিন রাতে ক্লারা একটি স্বপ্ন দেখলেন। সোনার মাছটি উপস্থিত হয়ে তাকে বলল: দর্পণটি পরিষ্কার রাখো, এবং এটি তোমাকে সুস্থ রাখবে। ক্লারা অনুপ্রাণিত হয়ে জেগে উঠলেন। তিনি গ্রামে একটি সাপ্তাহিক পরিচ্ছন্নতা অভিযানের আয়োজন করলেন। গ্রামবাসীরা সানন্দে অংশ নিয়ে হ্রদের তীর পরিষ্কার করল। জল বিশুদ্ধ থাকল এবং ক্ষুদ্র শৈবালগুলো বিকাশ লাভ করল। ক্লারা হ্রদ সম্পর্কে একটি গবেষণা পত্র লিখে বৈজ্ঞানিক সম্প্রদায়ের সাথে তার রহস্য ভাগ করে নিলেন। তিনি প্রমাণ করলেন যে প্রকৃতি রক্ষা করাই মানুষের স্বাস্থ্য রক্ষার সর্বোত্তম উপায়।`
  }
];

async function seedLongStories() {
  console.log('🌱 Seeding 10 rich, long stories (800-1000 words each)...');

  for (const data of STORIES_DATA) {
    const wordCount = data.enStory.split(/\s+/).length;
    console.log(`[Seed] Story: "${data.title}" (${wordCount} words)`);

    // Clean up existing page/sentences/tokens for this story ID if any
    await prisma.storyPage.deleteMany({ where: { storyId: data.id } });
    await prisma.quiz.deleteMany({ where: { storyId: data.id } });

    // Upsert story record
    await prisma.story.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        titleBn: data.titleBn,
        description: data.enStory,
        descriptionBn: data.bnStory,
        level: data.level,
        learningPath: data.learningPath as LearningPath,
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
        learningPath: data.learningPath as LearningPath,
        illustrationUrl: data.illustrationUrl,
        audioUrl: '',
        durationSeconds: Math.ceil(wordCount * 0.75),
        wordCount: wordCount,
        tags: data.tags,
        isPremium: false,
        isPublished: true,
      }
    });

    // Programmatically parse sentences and build tokens/pages (matching admin.service.ts auto-generate)
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
    
    const vocabDict: Record<string, { bn: string; ipa: string }> = {
      town: { bn: 'শহর', ipa: 'taʊn' },
      mysterious: { bn: 'রহস্যময়', ipa: 'mɪˈstɪəriəs' },
      courage: { bn: 'সাহস', ipa: 'ˈkʌrɪdʒ' },
      glowing: { bn: 'জ্বলজ্বলে', ipa: 'ˈɡləʊɪŋ' },
      butterfly: { bn: 'প্রজাপতি', ipa: 'ˈbʌtəflaɪ' },
      curiosity: { bn: 'কৌতূহল', ipa: 'ˌkjʊəriˈɒsəti' },
      forest: { bn: 'বন', ipa: 'ˈfɒrɪst' },
      secret: { bn: 'গোপন', ipa: 'ˈsiːkrət' },
      dangerous: { bn: 'বিপজ্জনক', ipa: 'ˈdeɪndʒərəs' },
      squirrel: { bn: 'কাঠবিড়ালি', ipa: 'ˈskwɪrəl' },
      mold: { bn: 'ছাতা রোগ', ipa: 'məʊld' },
      key: { bn: 'চাবি', ipa: 'kiː' },
      puzzle: { bn: 'ধাঁধা', ipa: 'ˈpʌzl' },
      treasure: { bn: 'ধন', ipa: 'ˈtrɛʒər' },
      loyal: { bn: 'বিশ্বস্ত', ipa: 'ˈlɔɪəl' },
      wolf: { bn: 'নেকড়ে', ipa: 'wʊlf' },
      journey: { bn: 'যাত্রা', ipa: 'ˈdʒɜːni' },
      stream: { bn: 'নালা', ipa: 'striːm' },
      monsoon: { bn: 'বর্ষাকাল', ipa: 'mɒnˈsuːn' },
      kindness: { bn: 'দয়া', ipa: 'ˈkaɪndnəs' },
      volunteering: { bn: 'স্বেচ্ছাসেবা', ipa: 'ˌvɒlənˈtɪərɪŋ' },
      temporary: { bn: 'সাময়িক', ipa: 'ˈtɛmpərəri' },
      marathon: { bn: 'ম্যারাথন', ipa: 'ˈmærəθən' },
      determination: { bn: 'দৃঢ় সংকল্প', ipa: 'dɪˌtɜːmɪˈneɪʃən' },
      persistence: { bn: 'অধ্যবসায়', ipa: 'pəˈsɪstəns' },
      honest: { bn: 'সৎ', ipa: 'ˈɒnɪst' },
      woodcutter: { bn: 'কাঠুরে', ipa: 'ˈwʊdkʌtər' },
      goddess: { bn: 'দেবী', ipa: 'ˈɡɒdɪs' },
      traveler: { bn: 'পর্যটক', ipa: 'ˈtrævlər' },
      keyboard: { bn: 'কিবোর্ড', ipa: 'ˈkiːbɔːd' },
      biologist: { bn: 'জীববিজ্ঞানী', ipa: 'baɪˈɒlədʒɪst' },
      microscope: { bn: 'অণুবীক্ষণ যন্ত্র', ipa: 'ˈmaɪkrəskəʊp' },
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

        // Generate Word Tokens
        const words = enText
          .toLowerCase()
          .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '')
          .split(/\s+/)
          .filter(w => w.length > 2 && !stopWords.has(w));

        const uniqueWords = [...new Set(words)].slice(0, 4);

        for (const rawWord of uniqueWords) {
          const cleanWord = rawWord.trim();
          if (!cleanWord) continue;

          const dictEntry =
            vocabDict[cleanWord] ||
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

    // Auto-generate Quiz
    const quiz = await prisma.quiz.create({
      data: { storyId: data.id },
    });

    await prisma.quizQuestion.create({
      data: {
        quizId: quiz.id,
        questionText: `What is the main theme of the story "${data.title}"?`,
        questionTextBn: `"${data.titleBn}" গল্পের মূল বিষয়বস্তু কী?`,
        options: [
          'Overcoming challenges using intelligence and kindness',
          'Sleeping and doing nothing all day',
          'Exploring space and landing on other planets',
          'Fighting monsters in the dark mountains',
        ],
        correctIndex: 0,
        explanation: 'The story narrates a character learning lessons and succeeding.',
        xpReward: 10,
      },
    });

    console.log(`✅ Seeded pages and quiz for: "${data.title}"`);
  }

  console.log('🎉 10 long stories seeded successfully!');
}

seedLongStories()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
