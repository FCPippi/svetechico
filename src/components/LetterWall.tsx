"use client";

import { useState, useEffect } from "react";
import { PenLine, X, Plus, Loader2, Heart } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Letter {
  id: string;
  title: string;
  content: string;
  written_by: string;
  color: string;
  created_at: string;
}

const COLORS = [
  "#fecdd3", // rose-200
  "#fbcfe8", // pink-200
  "#f5d0fe", // fuchsia-200
  "#ddd6fe", // violet-200
  "#fde68a", // amber-200
  "#a7f3d0", // emerald-200
  "#bae6fd", // sky-200
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function LetterWall() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [showWrite, setShowWrite] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writtenBy, setWrittenBy] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    fetchLetters();
  }, []);

  async function fetchLetters() {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from("letters")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setLetters(data);
  }

  async function handleSave() {
    if (!title.trim() || !content.trim() || !writtenBy.trim() || !isSupabaseConfigured) return;
    setSaving(true);

    const { error } = await supabase.from("letters").insert({
      title: title.trim(),
      content: content.trim(),
      written_by: writtenBy.trim(),
      color,
    });

    if (error) {
      alert("Erro ao salvar carta: " + error.message);
      setSaving(false);
      return;
    }

    setShowWrite(false);
    setTitle("");
    setContent("");
    setWrittenBy("");
    setColor(COLORS[0]);
    setSaving(false);
    fetchLetters();
  }

  return (
    <section id="cartas" className="py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-rose-600">
            💌 Nosso Mural
          </h2>
          <p className="text-rose-400/60 text-sm mt-1">
            Cartas e mensagens de amor
          </p>
        </div>
        <button
          onClick={() => setShowWrite(true)}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-full transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 text-sm font-medium"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Escrever</span>
        </button>
      </div>

      {letters.length === 0 ? (
        <div className="text-center py-16 text-rose-300">
          <PenLine size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-serif">Nenhuma carta ainda...</p>
          <p className="text-sm mt-1">Escreva a primeira! 💕</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {letters.map((letter, i) => (
            <div
              key={letter.id}
              className="letter-card rounded-2xl p-5 cursor-pointer shadow-md"
              style={{
                backgroundColor: letter.color,
                animationDelay: `${i * 0.05}s`,
                transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (Math.random() * 1.5)}deg)`,
              }}
              onClick={() => setSelectedLetter(letter)}
            >
              <h3 className="font-serif text-lg text-gray-800 mb-2 line-clamp-1">
                {letter.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {letter.content}
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                <span className="text-gray-500 text-xs">
                  {formatDate(letter.created_at)}
                </span>
                <span className="text-gray-600 text-xs font-medium flex items-center gap-1">
                  <Heart size={12} fill="currentColor" />
                  {letter.written_by}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de leitura */}
      {selectedLetter && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLetter(null)}
        >
          <div
            className="max-w-lg w-full animate-slide-up rounded-3xl p-6 md:p-8 shadow-2xl"
            style={{ backgroundColor: selectedLetter.color }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-serif text-2xl text-gray-800">
                {selectedLetter.title}
              </h3>
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4 flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif italic text-base">
                {selectedLetter.content}
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5">
              <span className="text-gray-500 text-sm">
                {formatDate(selectedLetter.created_at)}
              </span>
              <span className="text-gray-600 font-medium flex items-center gap-1">
                <Heart size={14} fill="currentColor" className="text-rose-400" />
                {selectedLetter.written_by}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de escrita */}
      {showWrite && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
          onClick={() => !saving && setShowWrite(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif text-rose-600">Nova Carta</h3>
              <button
                onClick={() => !saving && setShowWrite(false)}
                className="text-rose-300 hover:text-rose-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Seu nome ❤️"
              value={writtenBy}
              onChange={(e) => setWrittenBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-gray-700 placeholder:text-rose-300 mb-3"
              maxLength={50}
            />

            <input
              type="text"
              placeholder="Título da carta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-gray-700 placeholder:text-rose-300 mb-3"
              maxLength={100}
            />

            <textarea
              placeholder="Escreva aqui o que o seu coração quer dizer..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-gray-700 placeholder:text-rose-300 mb-4 resize-none leading-relaxed"
              maxLength={2000}
            />

            <div className="mb-5">
              <p className="text-rose-400 text-sm mb-2">Cor da carta:</p>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      color === c
                        ? "ring-2 ring-rose-500 ring-offset-2 scale-110"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={
                !title.trim() || !content.trim() || !writtenBy.trim() || saving
              }
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <PenLine size={18} />
                  Enviar Carta
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
