import mongoose, { Document, Schema } from 'mongoose';

// Video processing status enum
export type VideoStatus =
  | 'pending'
  | 'transcribing'
  | 'generating_keywords'
  | 'researching_titles'
  | 'optimizing_content'
  | 'completed'
  | 'failed';

export type VideoSource = 'youtube' | 'upload';

// Generated content interface
export interface IGeneratedContent {
  keywords?: string[];
  seoKeywords?: string[];
  youtubeTitles?: string[];
  suggestedTitles?: string[];
  suggestedDescription?: string;
  tags?: string[];
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
        type: String,
        trim: true
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
    ]
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
      enum: [
        'pending',
        'transcribing',
        'generating_keywords',
        'researching_titles',
        'optimizing_content',
        'completed',
        'failed'
      ],
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
