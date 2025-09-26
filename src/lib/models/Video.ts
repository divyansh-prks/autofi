import mongoose, { Document, Schema } from 'mongoose';

export type VideoStatus = 'pending' | 'completed' | 'failed';

export type VideoSource = 'youtube' | 'upload';

export interface SuggestedTitle {
  title: string;
  score: number;
  reasoning: string;
  viralityIncrease: number;
  seoImprovement: number;
}

export interface SuggestedDescription {
  description: string;
  score: number;
  reasoning: string;
  viralityIncrease: number;
  seoImprovement: number;
}

export interface YoutubeAnalytics {
  predictedViews?: number;
  viralityScore?: number;
  seoScore?: number;
  engagementPrediction?: number;
  shareabilityScore?: number;
  trendingPotential?: number;
  keyFactors?: {
    factor: string;
    impact: 'high' | 'medium' | 'low';
    score: number;
    description: string;
  }[];
  predictions?: {
    views24h?: number;
    views7d?: number;
    views30d?: number;
  };
}

export interface IVideo extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  source: VideoSource;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  youtubeCurrentViews?: string;
  youtubeTitle?: string;
  youtubeDescription?: string;
  youtubeThumbnail?: string;
  uploadVideoKey?: string;
  uploadFilename?: string;
  status: VideoStatus;
  transcript?: string;
  keywords: string[];
  seoKeywords: string[];
  suggestedTitles: SuggestedTitle[];
  suggestedDescriptions: SuggestedDescription[];
  suggestedTags: string[];
  youtubeAnalytics?: YoutubeAnalytics;
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true
    },
    source: {
      type: String,
      enum: ['youtube', 'upload'],
      required: [true, 'Source is required'],
      index: true
    },
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
    youtubeCurrentViews: { type: String },
    youtubeTitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    youtubeDescription: {
      type: String,
      trim: true
    },
    youtubeThumbnail: {
      type: String,
      trim: true
    },
    uploadVideoKey: {
      type: String,
      trim: true,
      validate: {
        validator: function (this: IVideo, v: string) {
          if (this.source === 'upload') {
            return !!(v && v.length > 0);
          }
          return true;
        },
        message: 'Video Key is required for uploaded videos'
      }
    },
    uploadFilename: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transcript: {
      type: String
    },
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
    suggestedTags: [
      {
        type: String,
        trim: true
      }
    ],
    youtubeAnalytics: {
      predictedViews: { type: Number },
      viralityScore: { type: Number },
      seoScore: { type: Number },
      engagementPrediction: { type: Number },
      shareabilityScore: { type: Number },
      trendingPotential: { type: Number },
      keyFactors: [
        {
          factor: { type: String },
          impact: { type: String, enum: ['high', 'medium', 'low'] },
          score: { type: Number },
          description: { type: String }
        }
      ],
      predictions: {
        views24h: { type: Number },
        views7d: { type: Number },
        views30d: { type: Number }
      }
    },
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

// Export the model
const Video =
  mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
