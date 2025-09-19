// YouTube Transcript API Response Types

export interface TranscriptSegment {
  start: number;
  dur: number;
  text: string;
}

export interface LanguageInfo {
  label: string;
  languageCode: string;
}

export interface PlayabilityStatus {
  status: string;
  reason: string;
}

export interface PlayerMicroformatRenderer {
  category: string;
  description: {
    simpleText: string;
  };
  externalChannelId: string;
  lengthSeconds: string;
  ownerChannelName: string;
  publishDate: string;
  title: {
    simpleText: string;
  };
}

export interface Microformat {
  playerMicroformatRenderer: PlayerMicroformatRenderer;
}

export interface TrackTranscript {
  language: string;
  transcript: TranscriptSegment[];
}

export interface Track {
  language: string;
  transcript: TranscriptSegment[];
}

export interface YouTubeTranscriptItem {
  id: string;
  microformat: Microformat;
  isLive: boolean;
  isLoginRequired: boolean;
  languages: LanguageInfo[];
  playabilityStatus: PlayabilityStatus;
  title: string;
  tracks: Track[];
}

export type YouTubeTranscriptResponse = YouTubeTranscriptItem[];

// For the API response from youtube-transcript.io
export interface TranscriptAPISegment {
  start: number;
  duration: number;
  text: string;
}

// Processed transcript format
export interface ProcessedTranscriptSegment {
  start: number;
  dur: number;
  text: string;
}

// Type guards
export function hasTranscript(item: YouTubeTranscriptItem): boolean {
  return (
    item.tracks &&
    item.tracks.length > 0 &&
    item.tracks[0].transcript &&
    item.tracks[0].transcript.length > 0
  );
}

export function isTranscriptAvailable(item: YouTubeTranscriptItem): boolean {
  return (
    item.playabilityStatus.status === 'OK' &&
    item.playabilityStatus.reason !== 'Transcript not available' &&
    hasTranscript(item)
  );
}
