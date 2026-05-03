export const TEMPLATES = [
    {
        id: "metrics",
        label: "Metrics",
        isPro: false,
        skeleton: (
            <div className="flex flex-col items-center gap-1.5" >
                <div className="w-6 h-1.5 rounded-full bg-current" />
                < div className="w-4 h-1 rounded-full bg-current opacity-40" />
            </div>
        )
    },
    {
        id: "milestone",
        label: "Milestone",
        isPro: true,
        skeleton: (
            <div className="flex flex-col items-center gap-1.5" >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                <div className="w-5 h-1.5 rounded-full bg-current opacity-40" />
            </div>
        )
    },
    {
        id: "progress",
        label: "Progress",
        isPro: true,
        skeleton: (
            <div className="w-12 h-1.5 rounded-full bg-current/20 relative overflow-hidden" >
                <div className="absolute left-0 top-0 h-full w-2/3 bg-current" />
            </div>
        )
    },
    {
        id: "list",
        label: "List",
        isPro: true,
        skeleton: (
            <div className="flex flex-col items-start gap-1" >
                <div className="w-8 h-1 rounded-full bg-current" />
                <div className="w-8 h-1 rounded-full bg-current" />
                <div className="w-8 h-1 rounded-full bg-current" />
            </div>
        )
    },
];