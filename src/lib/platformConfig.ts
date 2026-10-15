import { SocialPlatform } from '../types/post';

export const PLATFORM_CONFIG = {
  facebook: {
    label: "Facebook",
    characterLimit: 5000,
    color: "#1877F2",
    hoverBg: "hover:border-blue-400 hover:bg-blue-50/50",
    activeBg: "bg-blue-50 border-blue-500 text-blue-700",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  instagram: {
    label: "Instagram",
    characterLimit: 2200,
    color: "#E4405F",
    hoverBg: "hover:border-pink-400 hover:bg-pink-50/50",
    activeBg: "bg-pink-50 border-pink-500 text-pink-700",
    badgeBg: "bg-pink-50 text-pink-700 border-pink-200",
  },
  x: {
    label: "X",
    characterLimit: 280,
    color: "#0F1419",
    hoverBg: "hover:border-slate-500 hover:bg-slate-50/50",
    activeBg: "bg-slate-100 border-slate-900 text-slate-900",
    badgeBg: "bg-slate-100 text-slate-800 border-slate-300",
  },
  tiktok: {
    label: "TikTok",
    characterLimit: 2200,
    color: "#000000",
    hoverBg: "hover:border-cyan-400 hover:bg-cyan-50/50",
    activeBg: "bg-slate-900 border-slate-900 text-white",
    badgeBg: "bg-slate-100 text-slate-900 border-slate-200",
  },
} as const;

export const ALL_PLATFORMS: SocialPlatform[] = ["facebook", "instagram", "x", "tiktok"];
