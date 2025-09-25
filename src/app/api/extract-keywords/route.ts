import { NextRequest, NextResponse } from 'next/server';

// Enhanced stopwords for better YouTube SEO
const STOPWORDS = new Set(
  (
    'a,about,above,after,again,against,all,am,an,and,any,are,as,at,be,because,been,before,being,below,between,' +
    'both,but,by,could,did,do,does,doing,down,during,each,few,for,from,further,had,has,have,having,he,her,here,' +
    'hers,him,himself,his,how,i,if,in,into,is,it,its,itself,let,me,more,most,my,myself,no,nor,not,of,off,on,once,only,' +
    'or,other,ought,our,ours,ourselves,out,over,own,same,she,should,so,some,such,than,that,the,their,theirs,them,themselves,' +
    'then,there,these,they,this,those,through,to,too,under,until,up,very,was,we,were,what,when,where,which,while,who,whom,why,' +
    'with,would,you,your,yours,yourself,yourselves,gonna,wanna,yeah,like,really,just,kinda,sorta,well,now,then,here,there'
  ).split(',')
);

// Context-based keyword categories for audience targeting
const CONTEXT_CATEGORIES = {
  educational: {
    keywords: [
      'learn',
      'tutorial',
      'how to',
      'guide',
      'explain',
      'teach',
      'course',
      'lesson',
      'study',
      'education',
      'training',
      'beginner',
      'advanced',
      'step by step',
      'basics',
      'fundamentals'
    ],
    multiplier: 1.8,
    audience: 'learners'
  },
  entertainment: {
    keywords: [
      'funny',
      'hilarious',
      'comedy',
      'reaction',
      'challenge',
      'viral',
      'trending',
      'epic',
      'amazing',
      'crazy',
      'shocking',
      'unbelievable',
      'must watch'
    ],
    multiplier: 1.6,
    audience: 'general entertainment'
  },
  tech: {
    keywords: [
      'technology',
      'tech',
      'gadget',
      'device',
      'software',
      'app',
      'digital',
      'innovation',
      'AI',
      'machine learning',
      'coding',
      'programming',
      'development'
    ],
    multiplier: 1.7,
    audience: 'tech enthusiasts'
  },
  lifestyle: {
    keywords: [
      'lifestyle',
      'daily',
      'routine',
      'vlog',
      'life',
      'personal',
      'experience',
      'story',
      'journey',
      'motivation',
      'inspiration',
      'wellness',
      'health'
    ],
    multiplier: 1.5,
    audience: 'lifestyle viewers'
  },
  gaming: {
    keywords: [
      'game',
      'gaming',
      'play',
      'gameplay',
      'walkthrough',
      'stream',
      'gamer',
      'esports',
      'strategy',
      'tips',
      'tricks',
      'build',
      'character'
    ],
    multiplier: 1.9,
    audience: 'gamers'
  },
  business: {
    keywords: [
      'business',
      'entrepreneur',
      'startup',
      'marketing',
      'sales',
      'finance',
      'investment',
      'strategy',
      'growth',
      'success',
      'money',
      'profit'
    ],
    multiplier: 1.6,
    audience: 'business professionals'
  },
  review: {
    keywords: [
      'review',
      'unboxing',
      'comparison',
      'vs',
      'test',
      'analysis',
      'opinion',
      'verdict',
      'recommendation',
      'worth it',
      'buy',
      'purchase'
    ],
    multiplier: 1.7,
    audience: 'potential buyers'
  }
};

// High-value YouTube keywords that drive engagement
const ENGAGEMENT_KEYWORDS = [
  'secrets',
  'hidden',
  'revealed',
  'exposed',
  'truth',
  'real',
  'honest',
  'shocking',
  'nobody tells you',
  'insider',
  'exclusive',
  'behind the scenes',
  'rare',
  'unique',
  'first time',
  'never seen',
  'breakthrough',
  'game changer',
  'revolutionary'
];

function normalizeWord(w: string): string {
  return w
    .replace(/[^\w\s'-]/g, '')
    .replace(/^[-']+|[-']+$/g, '')
    .toLowerCase();
}

function tokenize(text: string): string[] {
  return text.split(/\s+/).map(normalizeWord).filter(Boolean);
}

function detectContentContext(text: string): {
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

  for (const [category, config] of Object.entries(CONTEXT_CATEGORIES)) {
    let matches = 0;
    let totalWords = 0;

    for (const keyword of config.keywords) {
      totalWords++;
      if (lowerText.includes(keyword)) {
        matches++;
      }
    }

    const confidence = matches / totalWords;
    if (confidence > bestMatch.confidence) {
      bestMatch = {
        category,
        confidence,
        audience: config.audience
      };
    }
  }

  return bestMatch;
}

function extractContextualKeywords(
  text: string,
  context: any,
  topK: number = 20
) {
  const tokens = tokenize(text);
  const freq = new Map<string, number>();
  const lowerText = text.toLowerCase();

  // Extract words and phrases
  for (let i = 0; i < tokens.length; i++) {
    const w = tokens[i];
    if (STOPWORDS.has(w) || w.length < 3 || /^\d+$/.test(w)) continue;

    let baseScore = 1;

    // Boost based on context category
    if (context.category !== 'general') {
      const categoryConfig =
        CONTEXT_CATEGORIES[context.category as keyof typeof CONTEXT_CATEGORIES];
      if (categoryConfig) {
        for (const contextKeyword of categoryConfig.keywords) {
          if (w.includes(contextKeyword) || contextKeyword.includes(w)) {
            baseScore *= categoryConfig.multiplier;
          }
        }
      }
    }

    // Boost engagement keywords
    for (const engagementKeyword of ENGAGEMENT_KEYWORDS) {
      if (w.includes(engagementKeyword) || engagementKeyword.includes(w)) {
        baseScore *= 2.0;
      }
    }

    freq.set(w, (freq.get(w) || 0) + baseScore);

    // Bigrams with contextual boost
    if (i + 1 < tokens.length) {
      const w2 = tokens[i + 1];
      if (!STOPWORDS.has(w2) && w2.length >= 3 && !/^\d+$/.test(w2)) {
        const bigram = `${w} ${w2}`;
        let bigramScore = 1.5;

        // Check if bigram matches context or engagement patterns
        for (const engagementKeyword of ENGAGEMENT_KEYWORDS) {
          if (bigram.includes(engagementKeyword)) {
            bigramScore *= 2.5;
          }
        }

        freq.set(bigram, (freq.get(bigram) || 0) + bigramScore);
      }
    }

    // Trigrams with high contextual relevance
    if (i + 2 < tokens.length) {
      const w2 = tokens[i + 1];
      const w3 = tokens[i + 2];
      if (
        !STOPWORDS.has(w2) &&
        !STOPWORDS.has(w3) &&
        w2.length >= 3 &&
        w3.length >= 3
      ) {
        const trigram = `${w} ${w2} ${w3}`;
        let trigramScore = 2.0;

        // Boost common YouTube phrase patterns
        if (
          trigram.includes('how to') ||
          trigram.includes('step by') ||
          trigram.includes('best way') ||
          trigram.includes('pro tips')
        ) {
          trigramScore *= 3.0;
        }

        freq.set(trigram, (freq.get(trigram) || 0) + trigramScore);
      }
    }
  }

  // Extract important noun phrases and technical terms
  const importantPatterns = [
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Proper nouns
    /\b\w+(?:ing|tion|sion|ment|ness|ity|ous|ful|less)\b/g, // Complex words
    /\b\d+\w*\b/g // Numbers with units
  ];

  for (const pattern of importantPatterns) {
    const matches = text.match(pattern) || [];
    for (const match of matches) {
      const normalized = match.toLowerCase();
      if (!STOPWORDS.has(normalized) && normalized.length > 3) {
        freq.set(normalized, (freq.get(normalized) || 0) + 1.3);
      }
    }
  }

  const entries = Array.from(freq.entries());
  if (entries.length === 0) return [];

  const max = Math.max(...entries.map(([, v]) => v));
  const normalized = entries.map(([k, v]) => ({
    keyword: k,
    score: +(v / max).toFixed(4),
    source: 'contextual',
    relevance: v > max * 0.7 ? 'high' : v > max * 0.4 ? 'medium' : 'low'
  }));

  return normalized.sort((a, b) => b.score - a.score).slice(0, topK);
}

export async function POST(req: NextRequest) {
  try {
    const { text, topK = 20 } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide text in the request body.' },
        { status: 400 }
      );
    }

    let keywords: any[] = [];
    let meta = { context: null, audience: null } as {
      context: string | null;
      audience: string | null;
    };

    // Detect content context for audience targeting
    const contentContext = detectContentContext(text);
    meta.context = contentContext.category;
    meta.audience = contentContext.audience;

    // Generate contextual keywords only (Amazon Comprehend removed)
    const contextualKeywords = extractContextualKeywords(
      text,
      contentContext,
      topK
    );
    keywords = contextualKeywords;

    // Deduplicate and prioritize high-relevance keywords
    const seen = new Set<string>();
    const deduped = [];

    // First pass: high relevance keywords
    for (const k of keywords) {
      const key = k.keyword.toLowerCase();
      if (seen.has(key)) continue;
      if (k.relevance === 'high') {
        seen.add(key);
        deduped.push(k);
      }
    }

    // Second pass: medium and low relevance
    for (const k of keywords) {
      const key = k.keyword.toLowerCase();
      if (seen.has(key) || deduped.length >= topK) continue;
      seen.add(key);
      deduped.push(k);
    }

    return NextResponse.json({
      keywords: deduped.slice(0, topK),
      meta: {
        ...meta,
        contextConfidence: contentContext.confidence,
        totalProcessed: keywords.length,
        targetAudience: contentContext.audience
      }
    });
  } catch (error) {
    console.error('Error in keyword extraction:', error);
    return NextResponse.json(
      {
        error: 'Failed to extract keywords',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
