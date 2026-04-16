"use client";

import { useState, useEffect } from "react";

const START_DATE = new Date("2024-10-06T00:00:00");

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateElapsed(): TimeElapsed {
  const now = new Date();
  let years = now.getFullYear() - START_DATE.getFullYear();
  let months = now.getMonth() - START_DATE.getMonth();
  let days = now.getDate() - START_DATE.getDate();
  let hours = now.getHours() - START_DATE.getHours();
  let minutes = now.getMinutes() - START_DATE.getMinutes();
  let seconds = now.getSeconds() - START_DATE.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  return { years, months, days, hours, minutes, seconds };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-500 font-serif tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-rose-400/70 mt-1 tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Counter() {
  const [elapsed, setElapsed] = useState<TimeElapsed | null>(null);

  useEffect(() => {
    setElapsed(calculateElapsed());
    const interval = setInterval(() => {
      setElapsed(calculateElapsed());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!elapsed) {
    return (
      <section className="text-center py-16">
        <div className="h-32 flex items-center justify-center">
          <div className="animate-pulse-slow text-4xl">❤️</div>
        </div>
      </section>
    );
  }

  return (
    <section className="text-center py-12 md:py-20 relative">
      <div className="animate-fade-in">
        <p className="text-rose-400/60 text-sm tracking-[0.3em] uppercase mb-4">
          Juntos há
        </p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8">
          {elapsed.years > 0 && (
            <TimeUnit value={elapsed.years} label={elapsed.years === 1 ? "ano" : "anos"} />
          )}
          <TimeUnit value={elapsed.months} label={elapsed.months === 1 ? "mês" : "meses"} />
          <TimeUnit value={elapsed.days} label={elapsed.days === 1 ? "dia" : "dias"} />
          <TimeUnit value={elapsed.hours} label={elapsed.hours === 1 ? "hora" : "horas"} />
          <TimeUnit value={elapsed.minutes} label={elapsed.minutes === 1 ? "min" : "mins"} />
          <TimeUnit value={elapsed.seconds} label="seg" />
        </div>

        <div className="flex items-center justify-center gap-3 text-rose-300">
          <div className="h-px w-12 bg-rose-200" />
          <span className="text-2xl animate-pulse-slow">❤️</span>
          <div className="h-px w-12 bg-rose-200" />
        </div>

        <p className="text-rose-400/50 text-sm mt-4 italic font-serif">
          desde 6 de outubro de 2024
        </p>
      </div>
    </section>
  );
}
