import mongoose, { Document, Schema } from 'mongoose';

// Video processing status enum
export type VideoStatus = 'pending' | 'completed' | 'failed';

export type VideoSource = 'youtube' | 'upload';

// Generated content interface
export interface IGeneratedContent {
  keywords?: string[];
  seoKeywords?: string[];
  youtubeTitles?: string[];
  suggestedTitles?: Array<{
    title: string;
    score: number;
    reasoning: string;
    viralityIncrease: number;
    seoImprovement: number;
  }>;
  suggestedDescriptions?: Array<{
    description: string;
    score: number;
    reasoning: string;
    viralityIncrease: number;
    seoImprovement: number;
  }>;
  suggestedDescription?: string; // Keep for backward compatibility
  tags?: string[];
  analytics?: {
    currentViews: string;
    predictedViews: string;
    viralityScore: number;
    seoScore: number;
    engagementPrediction: string;
    competitorAnalysis: string;
  };
  viralityMetrics?: {
    viralityScore: number;
    seoScore: number;
    engagementPrediction: number;
    shareabilityScore: number;
    trendingPotential: number;
    audienceMatch: number;
    competitorComparison: {
      better: number;
      similar: number;
      worse: number;
    };
    keyFactors: Array<{
      factor: string;
      impact: 'high' | 'medium' | 'low';
      score: number;
      description: string;
    }>;
    predictions: {
      views24h: string;
      views7d: string;
      views30d: string;
      peakTime: string;
      plateauTime: string;
    };
  };
  originalMetrics?: {
    viralityScore: number;
    seoScore: number;
    engagementPrediction: number;
    shareabilityScore: number;
    trendingPotential: number;
    audienceMatch: number;
    competitorComparison: {
      better: number;
      similar: number;
      worse: number;
    };
    keyFactors: Array<{
      factor: string;
      impact: 'high' | 'medium' | 'low';
      score: number;
      description: string;
    }>;
    predictions: {
      views24h: string;
      views7d: string;
      views30d: string;
      peakTime: string;
      plateauTime: string;
    };
  };
}

// Video document interface
export interface IVideo extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  source: VideoSource;

  // Source-specific data
  youtubeUrl?: string;
  youtubeVideoId?: string;
  videoUrl?: string; // S3 URL for uploaded videos

  // Basic metadata
  title?: string;
  description?: string;
  thumbnail?: string;
  originalFilename?: string;

  // Processing status
  status: VideoStatus;
  progress: number; // 0-100

  // Processing results
  transcript?: string;
  generatedContent?: IGeneratedContent;

  // Timestamps and error handling
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  errorMessage?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Generated content schema
const GeneratedContentSchema = new Schema(
  {
    keywords: [
      {
        type: String,
        trim: true
      }
    ],
    seoKeywords: [
      {
        type: String,
        trim: true
      }
    ],
    youtubeTitles: [
      {
        type: String,
        trim: true
      }
    ],
    suggestedTitles: [
      {
        title: { type: String, trim: true },
        score: { type: Number },
        reasoning: { type: String, trim: true },
        viralityIncrease: { type: Number },
        seoImprovement: { type: Number }
      }
    ],
    suggestedDescriptions: [
      {
        description: { type: String, trim: true },
        score: { type: Number },
        reasoning: { type: String, trim: true },
        viralityIncrease: { type: Number },
        seoImprovement: { type: Number }
      }
    ],
    suggestedDescription: {
      type: String,
      trim: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    analytics: {
      currentViews: { type: String },
      predictedViews: { type: String },
      viralityScore: { type: Number },
      seoScore: { type: Number },
      engagementPrediction: { type: String },
      competitorAnalysis: { type: String }
    },
    viralityMetrics: {
      viralityScore: { type: Number },
      seoScore: { type: Number },
      engagementPrediction: { type: Number },
      shareabilityScore: { type: Number },
      trendingPotential: { type: Number },
      audienceMatch: { type: Number },
      competitorComparison: {
        better: { type: Number },
        similar: { type: Number },
        worse: { type: Number }
      },
      keyFactors: [
        {
          factor: { type: String },
          impact: { type: String, enum: ['high', 'medium', 'low'] },
          score: { type: Number },
          description: { type: String }
        }
      ],
      predictions: {
        views24h: { type: String },
        views7d: { type: String },
        views30d: { type: String },
        peakTime: { type: String },
        plateauTime: { type: String }
      }
    },
    originalMetrics: {
      viralityScore: { type: Number },
      seoScore: { type: Number },
      engagementPrediction: { type: Number },
      shareabilityScore: { type: Number },
      trendingPotential: { type: Number },
      audienceMatch: { type: Number },
      competitorComparison: {
        better: { type: Number },
        similar: { type: Number },
        worse: { type: Number }
      },
      keyFactors: [
        {
          factor: { type: String },
          impact: { type: String, enum: ['high', 'medium', 'low'] },
          score: { type: Number },
          description: { type: String }
        }
      ],
      predictions: {
        views24h: { type: String },
        views7d: { type: String },
        views30d: { type: String },
        peakTime: { type: String },
        plateauTime: { type: String }
      }
    }
  },
  { _id: false }
);

// Main Video schema
const VideoSchema = new Schema<IVideo>(
  {
    userId: {
      type: String, // Changed from Schema.Types.ObjectId to String for Clerk integration
      required: [true, 'User ID is required'],
      index: true
    },
    source: {
      type: String,
      enum: ['youtube', 'upload'],
      required: [true, 'Source is required'],
      index: true
    },

    // Source-specific fields
    youtubeUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (this: IVideo, v: string) {
          if (this.source === 'youtube') {
            return !!(v && v.length > 0);
          }
          return true;
        },
        message: 'YouTube URL is required for YouTube videos'
      }
    },
    youtubeVideoId: {
      type: String,
      trim: true
    },
    videoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (this: IVideo, v: string) {
          if (this.source === 'upload') {
            return !!(v && v.length > 0);
          }
          return true;
        },
        message: 'Video URL is required for uploaded videos'
      }
    },

    // Metadata
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true
    },
    thumbnail: {
      type: String,
      trim: true
    },
    originalFilename: {
      type: String,
      trim: true
    },

    // Processing
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    // Results
    transcript: {
      type: String
    },
    generatedContent: GeneratedContentSchema,

    // Timestamps
    processingStartedAt: {
      type: Date
    },
    processingCompletedAt: {
      type: Date
    },
    errorMessage: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
VideoSchema.index({ userId: 1, createdAt: -1 });
VideoSchema.index({ status: 1 });
VideoSchema.index({ source: 1, status: 1 });

// Text search on transcript and title
VideoSchema.index({
  title: 'text',
  transcript: 'text',
  'generatedContent.suggestedDescription': 'text'
});

// Export the model
const Video =
  mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
