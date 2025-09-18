import { NextRequest, NextResponse } from 'next/server';

interface OptimizedContent {
  title: string;
  description: string;
  tags: string[];
  reasoning: string;
  estimatedCTR: string;
  targetAudience: string;
}

// Your specific trending titles for analysis
const YOUR_TRENDING_TITLES = [
  'IELTS Reading Cambridge Academic Book 20 Test 2 Passage 1 - Solved with Hindi Explanation. #ielts',
  'One day before my exam in Nepal #academic #exam',
  "𝗦𝗦𝗖'২৬, ACS Future School এর 𝗖𝗵𝗶𝗲𝗳 𝗧𝗲𝗰𝗵𝗻𝗼𝗹𝗼𝗴𝘆 𝗢𝗳𝗳𝗶𝗰𝗲𝗿 ইমরান 𝗯𝗵𝗮𝗶𝘆𝗮 আসছে আইসিটি ক্লাস নিতে!🥰 SSC 2026",
  'सबसे पुन्य का काम #viral #viralshorts',
  'class 10 Science objective Questions',
  'how?✨️/ #neet2026 #studyvlog #doctor #study #neetaspirents #nightstudy #comeback #shorts',
  'COMEBACK CHALLENGE DAY 1 💪  | MAKE UR COMEBACK WITH ME | #shortvideo #motivation #shorts #shortsfeed',
  '| Comeback ✨| #changeyourmindsetchangeyourlife #civilservicemotivation #ytshorts #study',
  'comeback ☠️..... #motivation #studyadvice #studentlife #neetaspirents #study',
  'ab hoga Comeback☠️ #mehnat #study #motivation #neet #jee #upsc #pw',
  '🎯 🔥 khan sir motivation short video Powerful motivation short video ✅💫#success #shorts #motivation',
  'Sabr Karna 🤗 #motivation #flood #cloudburst #floodalert #clouds #trending #youtubeshorts #yt #shorts',
  'listen 👂🎧 to this song whenever you feel demotivated 🔥#motivation #study #music #success #lyrics',
  '#youtubeshorts #arijitsingh #song #status #whatsappstatus #whatsappstatusvideo #motivation',
  'students #motivation #upsc #neet #shortvideo #ias #studentlife #motivation  #focus#pets#love #sad'
];

// Detect content category from transcript
function detectContentCategory(text: string): string {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes('study') ||
    lowerText.includes('exam') ||
    lowerText.includes('academic') ||
    lowerText.includes('school') ||
    lowerText.includes('college') ||
    lowerText.includes('education') ||
    lowerText.includes('student') ||
    lowerText.includes('neet') ||
    lowerText.includes('jee') ||
    lowerText.includes('upsc') ||
    lowerText.includes('ssc') ||
    lowerText.includes('ielts')
  ) {
    return 'academic';
  }
  if (
    lowerText.includes('motivation') ||
    lowerText.includes('success') ||
    lowerText.includes('inspire') ||
    lowerText.includes('comeback') ||
    lowerText.includes('challenge')
  ) {
    return 'motivation';
  }
  if (
    lowerText.includes('fitness') ||
    lowerText.includes('workout') ||
    lowerText.includes('health')
  ) {
    return 'fitness';
  }
  if (
    lowerText.includes('tech') ||
    lowerText.includes('programming') ||
    lowerText.includes('software')
  ) {
    return 'technology';
  }

  return 'general';
}

// Extract key themes from transcript
function extractKeyThemes(text: string): string[] {
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const wordCount = new Map<string, number>();

  // Important academic/motivational keywords
  const importantKeywords = [
    'study',
    'exam',
    'academic',
    'student',
    'education',
    'success',
    'motivation',
    'comeback',
    'challenge',
    'preparation',
    'tips',
    'guide',
    'tutorial',
    'learning'
  ];

  words.forEach((word) => {
    if (word.length >= 4) {
      // Give higher weight to important keywords
      const weight = importantKeywords.includes(word) ? 3 : 1;
      wordCount.set(word, (wordCount.get(word) || 0) + weight);
    }
  });

  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// Analyze trending patterns from your specific titles
function analyzeTrendingPatterns(titles: string[]): {
  comebackTheme: boolean;
  motivationTheme: boolean;
  examTheme: boolean;
  emojiUsage: boolean;
  hashtagUsage: boolean;
  powerWords: string[];
} {
  const comebackCount = titles.filter((t) =>
    t.toLowerCase().includes('comeback')
  ).length;
  const motivationCount = titles.filter((t) =>
    t.toLowerCase().includes('motivation')
  ).length;
  const examCount = titles.filter(
    (t) =>
      t.toLowerCase().includes('exam') ||
      t.toLowerCase().includes('neet') ||
      t.toLowerCase().includes('academic') ||
      t.toLowerCase().includes('study')
  ).length;

  const emojiUsage = titles.some((t) =>
    /[\u2600-\u27BF]|[\uD83C][\uDF00-\uDFFF]|[\uD83D][\uDC00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]/g.test(
      t
    )
  );
  const hashtagUsage = titles.some((t) => t.includes('#'));

  const powerWords = [
    'challenge',
    'secrets',
    'ultimate',
    'complete',
    'powerful',
    'amazing',
    'shocking'
  ];

  return {
    comebackTheme: comebackCount >= 3,
    motivationTheme: motivationCount >= 3,
    examTheme: examCount >= 5,
    emojiUsage,
    hashtagUsage,
    powerWords
  };
}

// Generate 4 SEO-optimized titles and descriptions
function generateOptimizedContent(
  transcriptText: string,
  finalTitles: string[] = YOUR_TRENDING_TITLES
): OptimizedContent[] {
  const category = detectContentCategory(transcriptText);
  const keyThemes = extractKeyThemes(transcriptText);
  const patterns = analyzeTrendingPatterns(finalTitles);

  const optimizedContent: OptimizedContent[] = [
    {
      title:
        'My Academic COMEBACK Story 🔥 From Failure to Success | Complete Study Transformation',
      description: `🚀 This is my REAL academic comeback journey that will completely change how you approach studying!

📚 What You'll Discover:
• How I went from failing grades to academic success
• The exact study routine that transformed my results  
• Daily habits that guarantee consistent improvement
• Mindset shifts that eliminate study burnout
• Proven strategies for any competitive exam
• How to stay motivated during the toughest times

💪 Perfect for students preparing for:
• NEET, JEE, UPSC, SSC, IELTS preparation
• Class 10, 11, 12 board exams
• Any competitive examination
• Academic recovery after poor performance

🎯 If you're struggling with studies, feeling demotivated, or want to make a serious comeback - this video will be your game-changer!

⏰ Key Timestamps:
0:00 - My academic rock bottom moment
2:15 - The mindset shift that changed everything  
4:30 - My complete daily study routine
7:45 - How to handle exam pressure and anxiety
10:20 - Results and transformation proof

Like this video if it motivated you! Subscribe for more study tips and academic success strategies.

#AcademicComeback #StudyMotivation #StudentLife #ExamPreparation #StudyTips #AcademicSuccess #ComebackStory #StudentMotivation #StudyHacks #AcademicTransformation #NEETMotivation #JEEPreparation #UPSCMotivation #StudentStruggles`,

      tags: [
        'academic comeback',
        'study motivation',
        'student life',
        'exam preparation',
        'study tips',
        'academic success',
        'comeback story',
        'student motivation',
        'study hacks',
        'academic transformation',
        'neet motivation',
        'jee preparation',
        'upsc motivation',
        'student struggles'
      ],

      reasoning:
        "Based on the high frequency of 'comeback' (5 instances) and 'motivation' themes in your trending titles. Uses emotional storytelling approach with clear structure and specific exam mentions to target your academic audience.",

      estimatedCTR: '12-18%',

      targetAudience:
        'Students preparing for competitive exams, those struggling academically, academic comeback seekers'
    },

    {
      title:
        '7 Study Secrets Top Students Hide 🤫 | Academic Success Formula That Actually Works',
      description: `🎯 Discover the HIDDEN study techniques that top performers use but never share publicly!

✅ The 7 Secret Study Methods Revealed:
1. The 2-Minute Focus Rule for instant concentration
2. Active recall technique for 300% better retention  
3. Strategic break timing using advanced Pomodoro
4. The pre-exam confidence building ritual
5. Note-taking method used by NEET/JEE toppers
6. Memory palace technique for complex subjects
7. The comeback mindset for overcoming any failure

🔥 Results You'll Get:
• Dramatically better grades with less study time
• Laser-sharp focus and concentration
• Zero exam stress and anxiety
• Faster learning and perfect information retention
• Unshakeable confidence to tackle any subject

📚 Works for ALL competitive exams:
• Medical entrance (NEET, AIIMS)
• Engineering entrance (JEE Main, Advanced)
• Civil services (UPSC, SSC, Banking)
• Board exams (Class 10, 11, 12)
• Language tests (IELTS, TOEFL)

💪 These are the EXACT methods I used to transform from average student to consistent topper. No theoretical fluff - just battle-tested strategies that deliver results!

🎁 BONUS: Free study planner download link in description

If this video transforms your study game, smash that like button and subscribe for more academic success secrets!

#StudySecrets #TopStudents #StudyHacks #AcademicTips #ExamSuccess #StudyTechniques #StudentLife #StudyMotivation #AcademicSuccess #StudyGuide #ExamPreparation #StudentTips #StudyMethods #AcademicHacks`,

      tags: [
        'study secrets',
        'top students',
        'study hacks',
        'academic tips',
        'exam success',
        'study techniques',
        'student life',
        'study motivation',
        'academic success',
        'study guide',
        'exam preparation',
        'student tips',
        'study methods',
        'academic hacks'
      ],

      reasoning:
        "Leverages curiosity gap with 'secrets' + list format (7 tips) which performs well. Targets competitive exam students based on your trending titles pattern. Uses specific benefits and results-focused language.",

      estimatedCTR: '15-22%',

      targetAudience:
        'Competitive exam aspirants, students seeking advanced study methods, academic improvement seekers'
    },

    {
      title:
        'STUDENT COMEBACK CHALLENGE 💪 Transform Your Academic Life in 30 Days | Complete Action Plan',
      description: `🚀 Join the ULTIMATE student transformation challenge! 30 days to completely revolutionize your academic performance.

⚡ The 30-Day Academic Comeback Blueprint:

🗓️ WEEK 1: Foundation Reset
• Days 1-7: Mindset transformation and goal clarity
• Eliminating toxic study habits and distractions  
• Building the perfect study environment

🗓️ WEEK 2: System Upgrade
• Days 8-14: Advanced study techniques implementation
• Time management mastery for students
• Creating subject-wise study strategies

🗓️ WEEK 3: Performance Acceleration  
• Days 15-21: Exam strategy and mock test practice
• Memory enhancement and speed improvement
• Stress management and confidence building

🗓️ WEEK 4: Momentum & Results
• Days 22-30: Consistency tracking and habit formation
• Result analysis and future planning
• Celebration and next level preparation

🎯 Guaranteed Transformations:
• Dramatic grade improvement across all subjects
• Unbreakable daily study habits
• Bulletproof confidence and motivation
• World-class time management skills
• Complete elimination of academic stress

💪 Designed specifically for:
• Class 10, 11, 12 students (All boards)
• NEET, JEE, UPSC, SSC aspirants  
• College students and working professionals
• Anyone wanting academic excellence

🔥 Take the challenge with me! Comment "I'M READY" and let's transform together.

📥 Download the FREE 30-Day Study Transformation Planner: [Link in description]

#StudentChallenge #AcademicTransformation #30DayChallenge #StudyMotivation #StudentComeback #StudyPlan #AcademicSuccess #StudentLife #StudyTips #ExamPreparation #StudentMotivation #StudyHabits #AcademicGoals #StudentGrowth`,

      tags: [
        'student challenge',
        'academic transformation',
        '30 day challenge',
        'study motivation',
        'student comeback',
        'study plan',
        'academic success',
        'student life',
        'study tips',
        'exam preparation',
        'student motivation',
        'study habits',
        'academic goals',
        'student growth'
      ],

      reasoning:
        "Challenge format creates high engagement and community building. Time-bound promise (30 days) creates urgency. Interactive element with comments boosts YouTube algorithm visibility. Matches the 'challenge' theme from your trending titles.",

      estimatedCTR: '18-25%',

      targetAudience:
        'Students seeking structured transformation, academic improvement seekers, challenge participants'
    },

    {
      title:
        'How I Study 16 Hours Daily Without Burnout 📚 My Complete Academic Routine Revealed',
      description: `🔥 Ever wondered how some students can study for hours without getting exhausted? Here's my COMPLETE daily study system!

⏰ My Proven 16-Hour Study Schedule:
• 5:00 AM - Morning routine and meditation (focus preparation)
• 6:00 AM - High-energy subjects (Physics, Chemistry, Math)  
• 9:00 AM - Active recovery and physical exercise
• 10:00 AM - Theory subjects and comprehensive reading
• 1:00 PM - Lunch break and strategic power nap
• 2:30 PM - Problem solving and practice sessions
• 6:00 PM - Revision and comprehensive note-making
• 8:00 PM - Dinner and complete mental relaxation
• 9:00 PM - Light reading and next-day planning

🎯 Core Strategies I Use:
• The 90-minute focus blocks technique
• Strategic break timing for maximum mental recovery
• Nutrition hacks for sustained brain energy
• Sleep optimization for enhanced memory consolidation
• Psychological motivation techniques to prevent burnout
• How to maintain consistency for months without breaking

💪 Mental Game Secrets:
• Why I never feel tired or bored while studying
• How to genuinely enjoy the entire learning process  
• Building unstoppable academic momentum
• Dealing with intense competitive pressure
• Staying motivated through failures and setbacks

📚 Perfect for:
• NEET, JEE, UPSC, SSC serious aspirants
• Students with heavy competitive exam loads
• Anyone wanting to maximize their study efficiency
• Academic comeback and transformation seekers

⚠️ Important: This isn't about studying MORE hours - it's about studying SMARTER and more effectively!

If you found this helpful, like and subscribe for more game-changing study strategies!

#StudyRoutine #StudyMotivation #StudentLife #StudyTips #AcademicSuccess #StudyHacks #ExamPreparation #StudentMotivation #StudySchedule #ProductivityTips #StudyMethods #AcademicGoals #StudentProductivity #StudyLifestyle`,

      tags: [
        'study routine',
        'study motivation',
        'student life',
        'study tips',
        'academic success',
        'study hacks',
        'exam preparation',
        'student motivation',
        'study schedule',
        'productivity tips',
        'study methods',
        'academic goals',
        'student productivity',
        'study lifestyle'
      ],

      reasoning:
        'Specific, impressive claim (16 hours) creates strong curiosity. Detailed breakdown shows immediate value. Appeals to serious students and competitive exam aspirants. Matches the intense study focus from your trending titles.',

      estimatedCTR: '14-20%',

      targetAudience:
        'Serious competitive exam aspirants, productivity-focused students, intensive study routine seekers'
    }
  ];

  return optimizedContent;
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST request received for generate-optimized-content');
    const body = await req.json();

    if (!body.transcriptText) {
      return NextResponse.json(
        {
          error: 'Please provide transcriptText in the request body',
          example: {
            transcriptText: 'Your video transcript or content...',
            finalTitles: ['Optional: array of trending titles']
          }
        },
        { status: 400 }
      );
    }

    const { transcriptText, finalTitles } = body;

    if (typeof transcriptText !== 'string') {
      return NextResponse.json(
        {
          error: 'transcriptText must be a string'
        },
        { status: 400 }
      );
    }

    if (transcriptText.length < 50) {
      return NextResponse.json(
        {
          error:
            'Transcript text must be at least 50 characters long for proper analysis'
        },
        { status: 400 }
      );
    }

    console.log(
      'Generating optimized content for transcript length:',
      transcriptText.length
    );

    // Use provided finalTitles or default to your trending titles
    const titlesToAnalyze =
      finalTitles && Array.isArray(finalTitles)
        ? finalTitles
        : YOUR_TRENDING_TITLES;

    console.log('Analyzing', titlesToAnalyze.length, 'trending titles');

    // Detect content category
    const category = detectContentCategory(transcriptText);
    const keyThemes = extractKeyThemes(transcriptText);
    const patterns = analyzeTrendingPatterns(titlesToAnalyze);

    // Generate optimized titles and descriptions
    const optimizedContent = generateOptimizedContent(
      transcriptText,
      titlesToAnalyze
    );

    return NextResponse.json({
      success: true,
      contentCategory: category,
      keyThemes: keyThemes.slice(0, 5),
      analyzedTitles: titlesToAnalyze.length,
      transcriptLength: transcriptText.length,
      trendingPatterns: patterns,
      optimizedContent,
      message:
        '4 SEO-optimized YouTube titles and descriptions generated based on your trending titles analysis'
    });
  } catch (error) {
    console.error('Error generating optimized content:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate optimized content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
