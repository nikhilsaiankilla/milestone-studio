import { PlatformType } from "@/types";
import { ICONS } from "./icons";

export const PLATFORMS: PlatformType[] = [
    { label: "X (Twitter)", value: "x", placeholder: "@your_handle", icon: ICONS.x },
    { label: "Instagram", value: "instagram", placeholder: "@username", icon: ICONS.instagram },
    { label: "LinkedIn", value: "linkedin", placeholder: "linkedin.com/in/username", icon: ICONS.linkedin },
    { label: "YouTube", value: "youtube", placeholder: "@channel", icon: ICONS.youtube },
    { label: "Product Hunt", value: "producthunt", placeholder: "@username", icon: ICONS.producthunt },
    { label: "GitHub", value: "github", placeholder: "@username", icon: ICONS.github },
    { label: "Medium", value: "medium", placeholder: "@username", icon: ICONS.medium },
]