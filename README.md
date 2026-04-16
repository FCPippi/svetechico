# Natasha ❤️ — Nosso Cantinho

Web app do casal com contador de tempo juntos, galeria de fotos e mural de cartas.

## Setup

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase-setup.sql`
3. Copie a **URL** e a **anon key** do projeto (em Settings → API)

### 2. Variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 3. Rodar localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Deploy na Vercel

1. Suba o projeto no GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy automático!

## Funcionalidades

- ⏱️ Contador ao vivo desde 06/10/2024
- 📸 Galeria de fotos com upload via Supabase Storage
- 💌 Mural de cartas com cores personalizáveis
- 📱 Design responsivo e tema romântico
