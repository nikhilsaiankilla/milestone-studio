export default function Featured() {
  return (
    <section className="py-16 text-center">
       <p className="text-xs font-mono text-gray-600 mb-8">FEATURED ON</p>
       <div className="flex flex-wrap justify-center gap-12 grayscale opacity-30 hover:opacity-100 transition-opacity">
          <span className="font-bold text-xl">Product Hunt</span>
          <span className="font-bold text-xl">Hacker News</span>
          <span className="font-bold text-xl">Indie Hackers</span>
       </div>
    </section>
  )
}