export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="text-6xl mb-4">💔</p>
        <h1 className="text-2xl font-serif text-rose-500 mb-2">Página não encontrada</h1>
        <a href="/" className="text-rose-400 hover:text-rose-600 underline">
          Voltar pro nosso cantinho
        </a>
      </div>
    </div>
  );
}
