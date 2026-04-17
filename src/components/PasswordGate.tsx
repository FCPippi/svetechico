"use client";

import { useState, useRef, useEffect } from "react";
import { Lock } from "lucide-react";

const STORAGE_KEY = "svetechico-auth";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setUnlocked(true);
    }
    setChecking(false);
  }, []);

  async function verifyCode(code: string) {
    setVerifying(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem(STORAGE_KEY, "true");
        setTimeout(() => setUnlocked(true), 300);
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 600);
      }
    } catch {
      setError(true);
    } finally {
      setVerifying(false);
    }
  }

  function handleDigitChange(index: number, value: string) {
    if (!/^\d*$/.test(value) || verifying) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(false);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = newDigits.join("");
    if (code.length === 4) {
      verifyCode(code);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  if (checking) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Corações de fundo */}
      <div className="floating-hearts" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="heart"
            style={{
              left: `${(i * 12.5) % 100}%`,
              animationDelay: `${i * 1.8}s`,
              fontSize: `${1.5 + Math.random()}rem`,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      <div className="animate-fade-in text-center relative z-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl shadow-rose-100/50 max-w-sm w-full">
          <div className="mb-6">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-rose-400" />
            </div>
            <h1 className="font-serif text-2xl text-rose-600 mb-2">
              Nosso Cantinho 💕
            </h1>
            <p className="text-rose-400/70 text-sm leading-relaxed">
              Esse lugar é só nosso<br />
              A senha é a mesma do meu celular 🤭
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-14 h-14 text-center text-2xl font-serif rounded-xl border-2 outline-none transition-all ${
                  error
                    ? "border-red-300 bg-red-50 animate-shake"
                    : digit
                    ? "border-rose-400 bg-rose-50"
                    : "border-rose-200 bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                } text-rose-600`}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm animate-fade-in">
              Hmm, não é essa não... tenta de novo 💔
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
