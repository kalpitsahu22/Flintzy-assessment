import { SocialPost } from '../types/post';

/**
 * Generates dynamic initial seed posts relative to current time.
 * This ensures that scheduled posts are always in the future (today, tomorrow, future days)
 * and never expire or become stale.
 */
export function generateSeedPosts(): SocialPost[] {
  const now = new Date();

  // Helper to create ISO string offset by hours/days
  const offsetTime = (hours: number): string => {
    return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
  };

  const seed: SocialPost[] = [
    // --- TODAY (Scheduled) ---
    {
      id: "post-101",
      content: "🚀 We are thrilled to announce Flintzy 2.0! Schedule posts across all your social platforms in seconds with precision timezone handling. What feature are you most excited to try? #socialmedia #productivity #buildinpublic",
      platforms: ["x", "facebook", "instagram"],
      mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(2), // 2 hours from now
      status: "scheduled",
      createdAt: offsetTime(-5),
    },
    {
      id: "post-102",
      content: "Quick design tip: High visual contrast and generous white space can boost engagement on your carousels by over 40%. Keep it clean, keep it readable.",
      platforms: ["x"],
      scheduledAt: offsetTime(4.5), // 4.5 hours from now
      status: "scheduled",
      createdAt: offsetTime(-8),
    },
    {
      id: "post-103",
      content: "Behind the scenes with our engineering team today! Polishing up dark mode accents and optimizing sub-second load times. 💻✨ Drop your favorite VS Code theme below!",
      platforms: ["instagram", "tiktok"],
      mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(7), // 7 hours from now
      status: "scheduled",
      createdAt: offsetTime(-10),
    },
    {
      id: "post-104",
      content: "Friday product drop preview! Watch our quick 15-second teaser of the new analytics widget. Who wants early beta access? 🔥",
      platforms: ["tiktok"],
      mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(9), // 9 hours from now
      status: "scheduled",
      createdAt: offsetTime(-12),
    },

    // --- TOMORROW (Scheduled) ---
    {
      id: "post-201",
      content: "Consistency beats sporadic brilliance every single time. Here are 3 scheduling habits that top creators use to maintain a 30-day streak without burnout 🧵👇",
      platforms: ["x"],
      scheduledAt: offsetTime(24 + 3), // Tomorrow morning
      status: "scheduled",
      createdAt: offsetTime(-15),
    },
    {
      id: "post-202",
      content: "A beautiful workspace is more than aesthetic—it creates mental clarity. Here is how our team sets up for remote deep work sprint sessions. Swipe through for desk gear recommendations! 🌿🖥️",
      platforms: ["instagram", "facebook"],
      mediaUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(24 + 6), // Tomorrow midday
      status: "scheduled",
      createdAt: offsetTime(-16),
    },
    {
      id: "post-203",
      content: "Weekend AMA starting tomorrow at 2 PM PST! Bring your questions about scaling your social media presence, automating content queues, and growing an authentic audience.",
      platforms: ["facebook", "x", "instagram", "tiktok"],
      scheduledAt: offsetTime(24 + 10), // Tomorrow evening
      status: "scheduled",
      createdAt: offsetTime(-18),
    },
    {
      id: "post-204",
      content: "3 micro-hooks you can test in your TikTok video intros today to increase retention past the 3-second mark 📈 Save this for your next recording session!",
      platforms: ["tiktok"],
      mediaUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(24 + 14),
      status: "scheduled",
      createdAt: offsetTime(-20),
    },

    // --- DAY 3 (Future) ---
    {
      id: "post-301",
      content: "Case study: How Acme Studio cut their weekly scheduling time from 8 hours down to 45 minutes using automated queue templates and multi-platform sync.",
      platforms: ["facebook", "x"],
      mediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(48 + 4),
      status: "scheduled",
      createdAt: offsetTime(-24),
    },
    {
      id: "post-302",
      content: "Good typography doesn't shout; it guides. Exploring custom font pairings for our upcoming marketing landing pages.",
      platforms: ["instagram"],
      mediaUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(48 + 8),
      status: "scheduled",
      createdAt: offsetTime(-25),
    },
    {
      id: "post-303",
      content: "Never underestimate the power of engaging in the comments section within the first 30 minutes of posting. Community building is a two-way street.",
      platforms: ["x", "tiktok"],
      scheduledAt: offsetTime(48 + 12),
      status: "scheduled",
      createdAt: offsetTime(-26),
    },

    // --- DAY 4 (Future) ---
    {
      id: "post-401",
      content: "We asked 500 digital marketers what their #1 biggest headache is with multi-channel scheduling. The unanimous winner: managing character limits and aspect ratios per network! Flintzy fixes that.",
      platforms: ["x", "facebook", "instagram"],
      scheduledAt: offsetTime(72 + 5),
      status: "scheduled",
      createdAt: offsetTime(-30),
    },
    {
      id: "post-402",
      content: "Morning meditation on product quality: software should feel like a well-crafted physical object. Heavy, responsive, tactile, and reliable.",
      platforms: ["x"],
      scheduledAt: offsetTime(72 + 9),
      status: "scheduled",
      createdAt: offsetTime(-32),
    },
    {
      id: "post-403",
      content: "Creator spotlight! Meet @alexandra_creates, who grew her visual design channel from 2k to 150k followers in 6 months using batch-recorded short form videos. 🎨✨",
      platforms: ["instagram", "tiktok"],
      mediaUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(72 + 13),
      status: "scheduled",
      createdAt: offsetTime(-34),
    },

    // --- DAY 5 (Future) ---
    {
      id: "post-501",
      content: "Join our live webinar on 'Mastering Social Queues in 2026: Timezones, Algorithms, and Multi-Channel Reach'. Limited seats available, link in bio to register for free!",
      platforms: ["facebook", "x"],
      mediaUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(96 + 6),
      status: "scheduled",
      createdAt: offsetTime(-40),
    },
    {
      id: "post-502",
      content: "Batch producing your social content on Mondays lets you stay strategic the rest of the week instead of scrambling daily.",
      platforms: ["x", "instagram"],
      scheduledAt: offsetTime(96 + 11),
      status: "scheduled",
      createdAt: offsetTime(-42),
    },

    // --- NEXT WEEK (Future) ---
    {
      id: "post-601",
      content: "Quarterly review time: what were your top 3 performing social media posts this quarter? Reviewing analytics and setting new targets for next month.",
      platforms: ["facebook", "instagram", "x", "tiktok"],
      mediaUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(168 + 4), // 7 days ahead
      status: "scheduled",
      createdAt: offsetTime(-50),
    },
    {
      id: "post-602",
      content: "Simple reminder: You don't need to be on every platform. Be exceptional on the two where your target audience spends real time.",
      platforms: ["x"],
      scheduledAt: offsetTime(192 + 8), // 8 days ahead
      status: "scheduled",
      createdAt: offsetTime(-52),
    },

    // --- FAILED POSTS (For retry testing with realistic error messages) ---
    {
      id: "post-701",
      content: "Special promo code 'FLINTZY50' valid for the next 24 hours only! Unlock lifetime pro scheduling for your entire team.",
      platforms: ["x"],
      mediaUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(-2), // 2 hours ago
      status: "failed",
      errorMessage: "X API: OAuth token expired or permissions revoked (HTTP 401)",
      createdAt: offsetTime(-10),
    },
    {
      id: "post-702",
      content: "Check out this visual breakdown of our latest user retention experiments. High resolution infographic attached!",
      platforms: ["instagram"],
      mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(-6), // 6 hours ago
      status: "failed",
      errorMessage: "Instagram Graph API: Rate limit exceeded for media container upload (Error Code 32)",
      createdAt: offsetTime(-14),
    },
    {
      id: "post-703",
      content: "New TikTok sound trending! Quick transition edit featuring our engineering sprint retrospective.",
      platforms: ["tiktok"],
      scheduledAt: offsetTime(-16), // 16 hours ago
      status: "failed",
      errorMessage: "TikTok Content API: Audio copyright licensing mismatch for selected commercial category",
      createdAt: offsetTime(-20),
    },
    {
      id: "post-704",
      content: "Announcing our new community forum on Facebook Groups! Connect with over 10,000 creators, share tips, and attend weekly live office hours.",
      platforms: ["facebook"],
      mediaUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(-26), // Yesterday
      status: "failed",
      errorMessage: "Facebook Page API: Temporary publishing service gateway timeout (HTTP 504)",
      createdAt: offsetTime(-36),
    },
    {
      id: "post-705",
      content: "Flash sale alert! 30% off all annual subscriptions during our developer week sprint. Don't miss out!",
      platforms: ["x", "facebook"],
      scheduledAt: offsetTime(-48), // 2 days ago
      status: "failed",
      errorMessage: "Publishing queue worker encountered unhandled socket reset during transmission",
      createdAt: offsetTime(-55),
    },
    {
      id: "post-706",
      content: "Behind the design system: How we built our high-contrast accessible color tokens using Tailwind CSS and Radix primitives.",
      platforms: ["instagram", "tiktok"],
      mediaUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(-70), // 3 days ago
      status: "failed",
      errorMessage: "Remote image CDN: File resolution exceeds maximum allowed boundary (10MB limit)",
      createdAt: offsetTime(-80),
    },

    // --- PUBLISHED POSTS (Past Successful) ---
    {
      id: "post-801",
      content: "Welcome to our brand new dashboard! We've listened to your feedback and made scheduling 3x faster with intuitive day grouping.",
      platforms: ["x", "facebook"],
      mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(-12), // 12 hours ago
      status: "published",
      createdAt: offsetTime(-24),
    },
    {
      id: "post-802",
      content: "The secret to growing on X in 2026 isn't posting 10 times a day—it's high quality insights backed by real data. Quality > Quantity always.",
      platforms: ["x"],
      scheduledAt: offsetTime(-20),
      status: "published",
      createdAt: offsetTime(-28),
    },
    {
      id: "post-803",
      content: "Sunset from our downtown studio terrace after an inspiring design critique. Reminding everyone to step away from screens and recharge this evening 🌅",
      platforms: ["instagram"],
      mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(-30),
      status: "published",
      createdAt: offsetTime(-36),
    },
    {
      id: "post-804",
      content: "Day in the life of a frontend engineer building micro-animations with React and Tailwind! Check out the smooth hover transitions. 🚀",
      platforms: ["tiktok"],
      mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(-44),
      status: "published",
      createdAt: offsetTime(-50),
    },
    {
      id: "post-805",
      content: "Community Q&A Recap: How we handle UTC date synchronization and local browser timezones without headaches. Read the full engineering breakdown on our engineering blog.",
      platforms: ["facebook", "x"],
      scheduledAt: offsetTime(-54),
      status: "published",
      createdAt: offsetTime(-60),
    },
    {
      id: "post-806",
      content: "Milestone unlocked: Over 50,000 posts scheduled through Flintzy this month! Thank you to all our early adopters and creators. Here's to 100k! 🎉🍾",
      platforms: ["x", "instagram", "facebook", "tiktok"],
      mediaUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(-78),
      status: "published",
      createdAt: offsetTime(-90),
    },
    {
      id: "post-807",
      content: "Pro-tip: Schedule your social content at least 48 hours ahead. It gives you buffer time to edit creative assets and prevents last minute scrambles.",
      platforms: ["facebook"],
      scheduledAt: offsetTime(-90),
      status: "published",
      createdAt: offsetTime(-100),
    },
    {
      id: "post-808",
      content: "Design sprint complete: Sleek, distraction-free composer with real-time character counters per platform. Built for speed and high productivity.",
      platforms: ["x", "instagram"],
      mediaUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      scheduledAt: offsetTime(-110),
      status: "published",
      createdAt: offsetTime(-120),
    },
  ];

  return seed;
}
