import Counter from "@/components/Counter";
import PhotoGallery from "@/components/PhotoGallery";
import LetterWall from "@/components/LetterWall";
import PasswordGate from "@/components/PasswordGate";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <PasswordGate>
      {/* Corações flutuantes de fundo */}
      <div className="floating-hearts" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="heart"
            style={{
              left: `${(i * 8.3) % 100}%`,
              animationDelay: `${i * 1.2}s`,
              fontSize: `${1 + Math.random() * 1.5}rem`,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Navegação */}
      <nav className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-serif text-xl text-rose-500 font-semibold">
            Natasha ❤️
          </span>
          <div className="flex gap-4 text-sm">
            <a
              href="#fotos"
              className="text-rose-400 hover:text-rose-600 transition-colors"
            >
              Fotos
            </a>
            <a
              href="#cartas"
              className="text-rose-400 hover:text-rose-600 transition-colors"
            >
              Mural
            </a>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <main className="relative z-10 max-w-4xl mx-auto px-4">
        <Counter />

        <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent my-4" />

        <PhotoGallery />

        <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent my-4" />

        <LetterWall />

        {/* Footer */}
        <footer className="text-center py-12 text-rose-300 text-sm">
          <p>feito com ❤️ pra nós dois</p>
        </footer>
      </main>
    </PasswordGate>
  );
}
