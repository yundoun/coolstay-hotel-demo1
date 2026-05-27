import type { SiteContent } from "@/domain/content/types";

import { siteContent as gyeongjuContent } from "./gyeongju-palace/content";
import { siteContent as daeguContent } from "./daegu-february/content";

const profile = process.env.NEXT_PUBLIC_HOTEL_PROFILE ?? "gyeongju-palace";

const contents: Record<string, SiteContent> = {
  "gyeongju-palace": gyeongjuContent,
  "daegu-february": daeguContent,
};

export const siteContent = contents[profile] ?? contents["gyeongju-palace"];
