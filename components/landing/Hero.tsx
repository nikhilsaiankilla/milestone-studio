export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 text-center border-b border-dashed border-white/10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Open Source & Free
      </div>
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 italic">
        PUBLIC <br /> <span className="text-gray-500">MILESTONES.</span>
      </h1>
      <p className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
        Beautiful milestone cards for builders. Generate visuals to celebrate your wins without opening Figma.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <button className="bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition">Get Started</button>
        <button className="border border-white/10 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/5 transition">Star on GitHub</button>
      </div>
    </section>
  )
}