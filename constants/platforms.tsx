import { PlatformType } from "@/types";
import { ICONS } from "./icons";

export const PLATFORMS: PlatformType[] = [
    { label: "X (Twitter)", value: "x", placeholder: "@your_handle", icon: <ICONS.x size={14} /> },
    { label: "Instagram", value: "instagram", placeholder: "@username", icon: <ICONS.instagram size={14} /> },
    { label: "LinkedIn", value: "linkedin", placeholder: "linkedin.com/in/username", icon: <ICONS.linkedin size={14} /> },
    { label: "YouTube", value: "youtube", placeholder: "@channel", icon: <ICONS.youtube size={14} /> },
    { label: "Product Hunt", value: "producthunt", placeholder: "@username", icon: <ICONS.producthunt size={14} /> },
    { label: "GitHub", value: "github", placeholder: "@username", icon: <ICONS.github size={14} /> },
    { label: "Medium", value: "medium", placeholder: "@username", icon: <ICONS.medium size={14} /> },
]