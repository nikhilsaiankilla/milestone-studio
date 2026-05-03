export default function Footer() {
  return (
    <footer className="py-12 px-8 border-t border-dashed border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
      <p>© 2026 Milestone Studio. Open Source.</p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <a href="#" className="hover:text-white transition">Twitter</a>
        <a href="#" className="hover:text-white transition">GitHub</a>
      </div>
    </footer>
  )
}