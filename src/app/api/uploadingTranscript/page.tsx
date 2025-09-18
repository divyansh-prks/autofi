'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tags,
  Copy,
  Loader2,
  Upload,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

// Enhanced context-based keyword generation
const CONTENT_CONTEXTS = {
  academic: {
    keywords: [
      'study',
      'exam',
      'academic',
      'grade',
      'college',
      'university',
      'student',
      'education',
      'learn',
      'school'
    ],
    phrases: [
      'academic comeback',
      'study motivation',
      'exam preparation tips',
      'how to study better',
      'improve grades fast',
      'study efficiency',
      'procrastination solutions',
      'academic success tips',
      'time management for students',
      'how to pass exams',
      'study plan for success',
      'focus while studying',
      'best study techniques',
      'how to get good grades',
      'dealing with exam stress',
      'study smarter not harder',
      'how to improve CGPA',
      'how to stop procrastinating',
      'student productivity hacks',
      'study schedule ideas',
      'goal setting for students',
      'exam mindset tips',
      'study habits of successful students',
      'motivation after failure',
      'academic recovery story',
      'overcoming academic failure',
      'how to prioritize study topics',
      'study techniques for exam success',
      'how to improve concentration',
      'study without distractions',
      'how to stay motivated in college',
      'tips for consistent studying',
      'study hacks for students',
      'how to balance study and self-care',
      'build confidence for exams',
      'how to handle academic pressure',
      'success after academic failure',
      'steps to academic improvement'
    ],
    audience: 'students and learners'
  },
  fitness: {
    keywords: [
      'workout',
      'fitness',
      'exercise',
      'gym',
      'health',
      'training',
      'muscle',
      'weight',
      'diet',
      'nutrition'
    ],
    phrases: [
      'fitness transformation',
      'workout routine',
      'how to lose weight',
      'muscle building tips',
      'home workout',
      'gym beginner guide',
      'nutrition tips',
      'weight loss journey',
      'how to build muscle',
      'cardio workout',
      'strength training',
      'healthy eating habits',
      'workout motivation',
      'fitness goals',
      'exercise for beginners',
      'diet plan for weight loss',
      'how to stay fit',
      'bodybuilding tips',
      'fat burning workout',
      'protein intake guide'
    ],
    audience: 'fitness enthusiasts'
  },
  technology: {
    keywords: [
      'tech',
      'technology',
      'software',
      'app',
      'coding',
      'programming',
      'digital',
      'AI',
      'computer'
    ],
    phrases: [
      'tech review',
      'latest technology',
      'programming tutorial',
      'coding tips',
      'software development',
      'tech news',
      'gadget review',
      'app development',
      'AI explained',
      'machine learning',
      'web development',
      'mobile app tutorial',
      'tech trends',
      'cybersecurity tips',
      'cloud computing',
      'data science basics',
      'how to code',
      'programming languages',
      'tech career advice',
      'startup tech'
    ],
    audience: 'tech enthusiasts and developers'
  },
  business: {
    keywords: [
      'business',
      'entrepreneur',
      'startup',
      'marketing',
      'sales',
      'finance',
      'money',
      'success'
    ],
    phrases: [
      'business tips',
      'entrepreneurship guide',
      'startup advice',
      'marketing strategies',
      'how to start a business',
      'sales techniques',
      'business success',
      'financial planning',
      'investment tips',
      'business growth',
      'digital marketing',
      'social media marketing',
      'business mindset',
      'passive income ideas',
      'online business',
      'e-commerce tips',
      'leadership skills',
      'business plan',
      'market research',
      'customer acquisition'
    ],
    audience: 'entrepreneurs and business professionals'
  },
  lifestyle: {
    keywords: [
      'lifestyle',
      'life',
      'daily',
      'routine',
      'vlog',
      'personal',
      'motivation',
      'inspiration'
    ],
    phrases: [
      'lifestyle tips',
      'daily routine',
      'morning routine',
      'life hacks',
      'self improvement',
      'personal development',
      'life motivation',
      'productivity tips',
      'healthy lifestyle',
      'work life balance',
      'mindfulness tips',
      'stress management',
      'goal setting',
      'habit formation',
      'life advice',
      'positive mindset',
      'self care routine',
      'time management',
      'life organization',
      'personal growth'
    ],
    audience: 'lifestyle and self-improvement seekers'
  },
  cooking: {
    keywords: [
      'recipe',
      'cooking',
      'food',
      'kitchen',
      'meal',
      'chef',
      'baking',
      'cuisine'
    ],
    phrases: [
      'easy recipes',
      'cooking tips',
      'healthy recipes',
      'quick meals',
      'cooking tutorial',
      'baking guide',
      'meal prep',
      'cooking hacks',
      'comfort food recipes',
      'cooking techniques',
      'kitchen tips',
      'food review',
      'cooking for beginners',
      'homemade recipes',
      'cooking skills',
      'meal planning'
    ],
    audience: 'cooking enthusiasts and food lovers'
  }
};

// High-engagement YouTube keywords
const ENGAGEMENT_BOOSTERS = [
  'secrets',
  'hidden tips',
  'nobody tells you',
  'revealed',
  'exposed',
  'truth about',
  'shocking',
  'amazing',
  'incredible',
  'mind-blowing',
  'game changer',
  'life changing',
  'ultimate guide',
  'complete guide',
  'step by step',
  'beginner friendly',
  'advanced tips',
  'pro tips',
  'insider secrets',
  'expert advice',
  'proven method',
  'guaranteed results',
  'must know',
  'essential',
  'breakthrough',
  'revolutionary',
  'cutting edge'
];

interface KeywordResult {
  keyword: string;
  score: number;
  source: string;
  relevance: string;
  category?: string;
}

function detectContentCategory(text: string): {
  category: string;
  confidence: number;
  audience: string;
} {
  const lowerText = text.toLowerCase();
  let bestMatch = {
    category: 'general',
    confidence: 0,
    audience: 'general audience'
  };

  for (const [category, config] of Object.entries(CONTENT_CONTEXTS)) {
    let matches = 0;
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword)) {
        matches++;
      }
    }
    const confidence = matches / config.keywords.length;
    if (confidence > bestMatch.confidence) {
      bestMatch = { category, confidence, audience: config.audience };
    }
  }

  return bestMatch;
}

function generateContextualKeywords(
  text: string,
  topK: number = 30
): KeywordResult[] {
  const context = detectContentCategory(text);
  const keywords: KeywordResult[] = [];
  const lowerText = text.toLowerCase();

  // Get context-specific phrases
  if (
    context.category !== 'general' &&
    CONTENT_CONTEXTS[context.category as keyof typeof CONTENT_CONTEXTS]
  ) {
    const categoryData =
      CONTENT_CONTEXTS[context.category as keyof typeof CONTENT_CONTEXTS];

    // Add all relevant phrases from the category
    categoryData.phrases.forEach((phrase, index) => {
      let score = 0.9 - index * 0.02; // Slightly decrease score for later phrases

      // Boost if phrase keywords appear in text
      const phraseWords = phrase.split(' ');
      let matchCount = 0;
      phraseWords.forEach((word) => {
        if (lowerText.includes(word.toLowerCase())) {
          matchCount++;
        }
      });

      if (matchCount > 0) {
        score += (matchCount / phraseWords.length) * 0.3;
      }

      keywords.push({
        keyword: phrase,
        score: Math.min(score, 1),
        source: 'contextual',
        relevance: score > 0.8 ? 'high' : score > 0.6 ? 'medium' : 'low',
        category: context.category
      });
    });
  }

  // Add engagement boosters that match content
  ENGAGEMENT_BOOSTERS.forEach((booster, index) => {
    if (context.category !== 'general') {
      const categoryData =
        CONTENT_CONTEXTS[context.category as keyof typeof CONTENT_CONTEXTS];
      const mainKeyword = categoryData.keywords[0];

      keywords.push({
        keyword: `${booster} ${mainKeyword}`,
        score: 0.85 - index * 0.01,
        source: 'engagement',
        relevance: 'high',
        category: context.category
      });
    }
  });

  // Extract keywords from the actual text
  const words = text.toLowerCase().match(/\b\w{3,}\b/g) || [];
  const wordFreq = new Map<string, number>();

  words.forEach((word) => {
    if (word.length >= 3) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });

  // Add frequent words as keywords
  Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([word, freq]) => {
      keywords.push({
        keyword: word,
        score: Math.min(freq / 10, 0.8),
        source: 'extracted',
        relevance: freq > 3 ? 'medium' : 'low'
      });
    });

  // Sort by score and return top results
  return keywords.sort((a, b) => b.score - a.score).slice(0, topK);
}

export default function UploadingTranscript() {
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState<KeywordResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentCategory, setContentCategory] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');

  const generateTags = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    if (text.length < 50) {
      setError(
        'Please provide more text for better keyword extraction (minimum 50 characters)'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Detect content category
      const context = detectContentCategory(text);
      setContentCategory(context.category);
      setTargetAudience(context.audience);

      // Generate contextual keywords
      const generatedKeywords = generateContextualKeywords(text, 30);
      setKeywords(generatedKeywords);
    } catch (err) {
      setError('Failed to generate tags. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyKeywords = () => {
    const keywordString = keywords.map((k) => k.keyword).join('\n');
    navigator.clipboard.writeText(keywordString);
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
  };

  return (
    <div className='min-h-screen overflow-y-auto bg-gradient-to-br from-purple-50 to-blue-100 px-4 py-6'>
      <div className='mx-auto max-w-7xl'>
        <Card className='mb-6 w-full rounded-2xl border border-gray-200 bg-white shadow-2xl'>
          <CardHeader className='rounded-t-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
            <CardTitle className='text-center text-3xl font-bold'>
              <Zap className='mr-2 inline h-8 w-8' />
              AI-Powered YouTube SEO Keyword Generator
            </CardTitle>
            <p className='mt-2 text-center text-purple-100'>
              Generate 30+ contextual keywords to boost your video ranking and
              reach the right audience
            </p>
          </CardHeader>

          <CardContent className='space-y-6 p-8'>
            {/* Text Input Area */}
            <div className='space-y-3'>
              <label className='flex items-center text-lg font-semibold text-gray-700'>
                <Tags className='mr-2 h-5 w-5' />
                Paste your video transcript, description, or content:
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Paste your video transcript, script, description, or any content here. The AI will analyze it and generate 30+ contextual keywords specifically tailored to boost your video for the right audience...'
                rows={12}
                className='w-full resize-none rounded-xl border-2 border-gray-300 p-4 text-sm text-black transition-all duration-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none'
              />
              <div className='flex justify-between text-sm text-gray-500'>
                <span>{text.length} characters</span>
                <span className='text-purple-600'>
                  {text.length >= 50
                    ? '✓ Ready for analysis'
                    : 'Need at least 50 characters'}
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateTags}
              disabled={loading || !text.trim() || text.length < 50}
              className='w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50'
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-6 w-6 animate-spin' />
                  Generating 30+ Contextual Keywords...
                </>
              ) : (
                <>
                  <Target className='mr-2 h-6 w-6' />
                  Generate SEO Keywords
                </>
              )}
            </Button>

            {/* Content Analysis */}
            {keywords.length > 0 && (
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                  <h4 className='mb-2 flex items-center font-semibold text-green-800'>
                    <Target className='mr-2 h-4 w-4' />
                    Content Category
                  </h4>
                  <p className='text-green-700 capitalize'>{contentCategory}</p>
                </div>
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <h4 className='mb-2 flex items-center font-semibold text-blue-800'>
                    <TrendingUp className='mr-2 h-4 w-4' />
                    Target Audience
                  </h4>
                  <p className='text-blue-700'>{targetAudience}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center font-medium text-red-700'
              >
                {error}
              </motion.div>
            )}

            {/* Generated Keywords */}
            {keywords.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='space-y-6'
              >
                <div className='flex items-center justify-between'>
                  <h3 className='flex items-center text-2xl font-bold text-gray-800'>
                    <Tags className='mr-2 h-6 w-6 text-purple-600' />
                    {keywords.length} SEO Keywords for Your {contentCategory}{' '}
                    Video
                  </h3>
                  <Button
                    onClick={copyKeywords}
                    variant='outline'
                    className='flex items-center gap-2 border-purple-300 hover:bg-purple-50'
                  >
                    <Copy className='h-4 w-4' />
                    Copy All Keywords
                  </Button>
                </div>

                <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
                  <h4 className='mb-4 flex items-center font-semibold text-gray-700'>
                    <Copy className='mr-2 h-5 w-5' />
                    Copy-ready keywords (one per line):
                  </h4>
                  <div className='max-h-80 overflow-y-auto rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 font-mono text-sm leading-relaxed text-gray-700'>
                    {keywords.map((k, index) => (
                      <div key={index} className='mb-1'>
                        {k.keyword}
                      </div>
                    ))}
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
                  {keywords.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={`group cursor-pointer rounded-lg border px-4 py-3 transition-all hover:shadow-md ${
                        item.relevance === 'high'
                          ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
                          : item.relevance === 'medium'
                            ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50'
                            : 'border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50'
                      }`}
                      onClick={() => copyKeyword(item.keyword)}
                    >
                      <div className='flex flex-col'>
                        <div className='mb-1 flex items-center justify-between'>
                          <span
                            className={`text-xs font-medium ${
                              item.relevance === 'high'
                                ? 'text-green-600'
                                : item.relevance === 'medium'
                                  ? 'text-blue-600'
                                  : 'text-gray-600'
                            }`}
                          >
                            {item.source === 'contextual'
                              ? '🎯 Contextual'
                              : item.source === 'engagement'
                                ? '🚀 Engagement'
                                : '📊 Extracted'}
                          </span>
                          <Copy className='h-3 w-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100' />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            item.relevance === 'high'
                              ? 'text-green-800'
                              : item.relevance === 'medium'
                                ? 'text-blue-800'
                                : 'text-gray-800'
                          }`}
                        >
                          {item.keyword}
                        </span>
                        <span
                          className={`mt-1 text-xs ${
                            item.relevance === 'high'
                              ? 'text-green-600'
                              : item.relevance === 'medium'
                                ? 'text-blue-600'
                                : 'text-gray-600'
                          }`}
                        >
                          {item.relevance} relevance •{' '}
                          {(item.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className='grid gap-6 md:grid-cols-3'>
                  <div className='rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6'>
                    <h4 className='mb-3 font-semibold text-purple-800'>
                      🎯 Usage Tips:
                    </h4>
                    <ul className='space-y-1 text-sm text-purple-700'>
                      <li>• Use 10-15 keywords in description</li>
                      <li>• Include 3-5 in your title</li>
                      <li>• Add as tags in YouTube Studio</li>
                    </ul>
                  </div>

                  <div className='rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6'>
                    <h4 className='mb-3 font-semibold text-green-800'>
                      📈 Optimization:
                    </h4>
                    <ul className='space-y-1 text-sm text-green-700'>
                      <li>• Focus on high-relevance keywords</li>
                      <li>• Use in thumbnail text</li>
                      <li>• Mention in video chapters</li>
                    </ul>
                  </div>

                  <div className='rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-6'>
                    <h4 className='mb-3 font-semibold text-orange-800'>
                      🚀 Engagement:
                    </h4>
                    <ul className='space-y-1 text-sm text-orange-700'>
                      <li>• Include engagement keywords</li>
                      <li>• Create compelling titles</li>
                      <li>• Target specific audience</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
