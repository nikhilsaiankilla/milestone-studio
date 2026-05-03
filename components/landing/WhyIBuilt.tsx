export default function WhyIBuilt() {
  return (
    <section className="py-24 px-8 border-y border-dashed border-white/10 bg-zinc-950/50">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold mb-6">Why I build this?</h3>
        <p className="text-gray-400 leading-relaxed mb-4">
          Celebrating in public is a superpower for builders, but creating a clean graphic every time you hit a milestone is a chore. 
        </p>
        <p className="text-gray-400 leading-relaxed">
          I built this to give the community a 1-click way to share their progress with the world. No fluff, just clean design and pure data.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10" />
          <div>
            <p className="font-bold text-sm">Your Name</p>
            <p className="text-xs text-gray-500">Founder, Milestone Studio</p>
          </div>
        </div>
      </div>
    </section>
  )
}