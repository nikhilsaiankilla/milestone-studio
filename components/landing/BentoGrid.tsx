const cards = [
  { src: '/cards/card.png' },
  { src: '/cards/card2.png' },
  { src: '/cards/card3.png' },
  { src: '/cards/card4.png' },
  { src: '/cards/card5.png', forceSquare: true }, // The special 5th one
  { src: '/cards/card6.png' },
  { src: '/cards/card7.png' },
  { src: '/cards/card8.png' },
  { src: '/cards/card9.png' },

  { src: '/cards/card.png' },
  { src: '/cards/card2.png' },
  { src: '/cards/card3.png' },
  { src: '/cards/card4.png' },
  { src: '/cards/card5.png', forceSquare: true }, // The special 5th one
  { src: '/cards/card6.png' },
  { src: '/cards/card7.png' },
  { src: '/cards/card8.png' },
  { src: '/cards/card9.png' },
]

export default function BentoGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 mask-b-from-5%">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`
              break-inside-avoid relative overflow-hidden rounded-2xl border border-white/10 
              bg-zinc-900 group transition-all duration-300 hover:border-white/20
              ${card.forceSquare ? 'aspect-square' : 'h-auto'}
            `}
          >
            <img 
              src={card.src} 
              alt={`Gallery item ${index + 1}`} 
              className={`
                w-full transition-transform duration-700 group-hover:scale-105
                ${card.forceSquare ? 'h-full object-cover' : 'h-auto block'}
              `}
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  )
}