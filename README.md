# 🦷 Sorrir Clinic

Site completo de odontologia com painel administrativo, construído com **React + TypeScript + Tailwind CSS + Supabase**.

---

## 🚀 Stack

| Camada      | Tecnologia              |
|-------------|-------------------------|
| Frontend    | React 18 + TypeScript   |
| Estilização | Tailwind CSS v3         |
| Bundler     | Vite                    |
| Backend/DB  | Supabase (PostgreSQL)   |
| Auth        | Supabase Auth           |

---

## 📁 Estrutura do Projeto

```
sorrir-clinic/
├── .env                        # ← suas credenciais (não commitar!)
├── .env.example                # modelo de variáveis de ambiente
├── src/
│   ├── components/
│   │   ├── admin/              # Componentes do painel administrativo
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Appointments.tsx
│   │   │   ├── Patients.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Messages.tsx
│   │   │   └── SettingsPanel.tsx
│   │   ├── public/             # Seções do site público
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── BeforeAfterSlider.tsx   # ← slider arrastável
│   │   │   ├── Team.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LoginModal.tsx
│   │   └── ui/                 # Componentes reutilizáveis
│   │       ├── Badge.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Toast.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useToast.ts
│   ├── lib/
│   │   ├── supabase.ts         # cliente singleton + tipos DB
│   │   ├── queries.ts          # todas as queries Supabase
│   │   └── supabase-schema.sql # ← execute no SQL Editor do Supabase
│   ├── pages/
│   │   ├── PublicSite.tsx
│   │   └── AdminPanel.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

---

## ⚙️ Setup em 5 passos

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **SQL Editor** e execute todo o conteúdo de `src/lib/supabase-schema.sql`
3. Copie as credenciais em **Project Settings → API**

### 3. Crie o arquivo `.env`

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais reais:
```env
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Crie o usuário admin no Supabase

No Supabase, vá em **Authentication → Users → Add user** e crie:
- **Email:** admin@sorrirclinic.com.br (ou qualquer e-mail)
- **Password:** sua senha segura

### 5. Rode o projeto
```bash
npm run dev
```

Acesse `http://localhost:5173`

---

## 🌟 Funcionalidades

### Site Público
- **Hero** com estatísticas animadas
- **Serviços** carregados do banco de dados
- **Antes & Depois** — slider arrastável (mouse e touch) com cases do banco
- **Equipe** de dentistas
- **Depoimentos** aprovados pelo admin
- **Contato** — formulário que salva no Supabase

### Painel Administrativo
Acesso via botão "Área Admin" → login com Supabase Auth

| Seção         | Funcionalidades                              |
|---------------|----------------------------------------------|
| Dashboard     | Métricas do dia, próximas consultas          |
| Agendamentos  | CRUD completo, filtro por status             |
| Pacientes     | CRUD + busca em tempo real                   |
| Serviços      | CRUD, ativar/desativar, ordenação            |
| Galeria       | Gerenciar casos antes/depois com preview     |
| Depoimentos   | Aprovar / Rejeitar / Remover                 |
| Mensagens     | Inbox com leitura, resposta por e-mail/WhatsApp |
| Configurações | Dados da clínica, variáveis de ambiente      |

---

## 🔐 Segurança

- Autenticação via **Supabase Auth** (JWT)
- **Row Level Security (RLS)** ativado em todas as tabelas
- Conteúdo público (serviços, depoimentos aprovados) legível sem auth
- Operações de escrita requerem autenticação
- `.env` listado no `.gitignore` — credenciais nunca vão pro repositório

---

## 🏗️ Build para produção

```bash
npm run build
# Arquivos gerados em /dist
```

Para deploy: **Vercel**, **Netlify** ou qualquer host estático.
Lembre de configurar as variáveis de ambiente no painel do seu host.

---

## 📦 Dependências principais

```json
{
  "@supabase/supabase-js": "^2.39",
  "lucide-react": "^0.383",
  "react": "^18.3",
  "react-router-dom": "^6.23"
}
```
