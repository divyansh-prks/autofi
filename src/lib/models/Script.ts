import mongoose, { Document, Schema } from 'mongoose';

// Interfaces for nested objects
export interface IKeyword {
  keyword: string;
  relevanceScore: number;
  category?: string;
  trendScore?: number;
}

export interface ITranscript {
  content?: string;
  language: string;
  confidenceScore?: number;
}

export interface IGeneratedContent {
  title?: string;
  description?: string;
  tags: string[];
  seoScore?: number;
}

// Script model for YouTube content automation
export interface IScript extends Document {
  userId: mongoose.Types.ObjectId;
  originalFilename: string;
  cloudinaryVideoUrl: string;
  cloudinaryAudioUrl?: string;
  processingStatus:
    | 'uploading'
    | 'transcribing'
    | 'analyzing'
    | 'generating'
    | 'completed'
    | 'failed';
  transcript?: ITranscript;
  keywords: IKeyword[];
  generatedContent?: IGeneratedContent;
  llmProvider: 'gemini' | 'openai' | 'claude';
  processingTimeSeconds?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Nested schemas
const KeywordSchema = new Schema(
  {
    keyword: {
      type: String,
      required: true,
      trim: true
    },
    relevanceScore: {
      type: Number,
      min: 0,
      max: 1
    },
    category: {
      type: String,
      trim: true
    },
    trendScore: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  { _id: false }
);

const TranscriptSchema = new Schema(
  {
    content: {
      type: String
    },
    language: {
      type: String,
      default: 'en'
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  { _id: false }
);

const GeneratedContentSchema = new Schema(
  {
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    seoScore: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  { _id: false }
);

// Main Script schema
const ScriptSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    originalFilename: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true
    },
    cloudinaryVideoUrl: {
      type: String,
      required: [true, 'Cloudinary video URL is required']
    },
    cloudinaryAudioUrl: {
      type: String
    },
    processingStatus: {
      type: String,
      enum: [
        'uploading',
        'transcribing',
        'analyzing',
        'generating',
        'completed',
        'failed'
      ],
      default: 'uploading'
    },
    transcript: TranscriptSchema,
    keywords: [KeywordSchema],
    generatedContent: GeneratedContentSchema,
    llmProvider: {
      type: String,
      enum: ['gemini', 'openai', 'claude'],
      default: 'gemini'
    },
    processingTimeSeconds: {
      type: Number,
      min: 0
    },
    errorMessage: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
ScriptSchema.index({ userId: 1, createdAt: -1 });
ScriptSchema.index({ processingStatus: 1 });
ScriptSchema.index({ 'keywords.keyword': 1 });

// Enable text search on transcript content and generated content
ScriptSchema.index({
  'transcript.content': 'text',
  'generatedContent.title': 'text',
  'generatedContent.description': 'text'
});

// Export the model (handles existing model issue in development)
const Script =
  mongoose.models.Script || mongoose.model<IScript>('Script', ScriptSchema);

export default Script;
