"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'

const Nav = () => {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/nikhilsaiankilla/milestone-studio')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setStars(d.stargazers_count))
      .catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-dashed border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src="/logo.png"
              alt="Milestone Studio Logo"
              width={28}
              height={28}
              className="transition-transform duration-200 group-hover:scale-110"
            />
          </div>

          <span className="text-sm sm:text-base font-semibold tracking-tight text-white/90">
            Milestone Studio
          </span>
        </Link>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-3">
          
          {/* GitHub (Primary) */}
          <Link href="https://github.com/nikhilsaiankilla/milestone-studio" target="_blank">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border-white/10"
            >
              <GithubIcon />
              <span>GitHub</span>

              {stars !== null && (
                <span className="ml-1 flex items-center gap-1 text-xs text-white/60">
                  <StarIcon />
                  {stars}
                </span>
              )}
            </Button>
          </Link>

          {/* Secondary (icon only) */}
          <Link href="https://twitter.com/itzznikhilsai" target="_blank">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <TwitterIcon />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

/* Extract icons (cleaner + reusable) */
const GithubIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
)

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
)

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                                    <path d="M12 1.7L14.6 9h7.7l-6.2 4.5 2.4 7.3L12 16.3l-6.5 4.5 2.4-7.3L1.7 9h7.7L12 1.7z" />
                                </svg>
)

export default Nav