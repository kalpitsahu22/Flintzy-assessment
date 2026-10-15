export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "x"
  | "tiktok";

export type PostStatus =
  | "scheduled"
  | "published"
  | "failed";

export interface SocialPost {
  id: string;
  content: string;
  platforms: SocialPlatform[];
  mediaUrl?: string;
  scheduledAt: string; // ISO 8601 UTC timestamp ending in Z
  status: PostStatus;
  errorMessage?: string;
  createdAt: string;
}

export type PlatformFilter = "all" | SocialPlatform;
export type StatusFilter = "all" | PostStatus;

export interface PostFilterState {
  platform: PlatformFilter;
  status: StatusFilter;
  search: string;
}

export interface CreatePostInput {
  content: string;
  platforms: SocialPlatform[];
  mediaUrl?: string;
  scheduledAt: string; // ISO UTC string
}

export interface UpdatePostInput {
  content: string;
  platforms: SocialPlatform[];
  mediaUrl?: string;
  scheduledAt: string; // ISO UTC string
}

export interface PlatformConfigItem {
  label: string;
  characterLimit: number;
  iconColor: string;
  bgLight: string;
  borderColor: string;
}

export type RetryStatus = "idle" | "retrying" | "success" | "error";

export interface PostDayGroup {
  id: string;
  label: string;
  dateStr: string;
  posts: SocialPost[];
}

export interface DashboardMetrics {
  total: number;
  scheduled: number;
  published: number;
  failed: number;
}
