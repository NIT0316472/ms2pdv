# Instalação no Windows

## 1. Pré-requisitos
- Node.js 20+
- MySQL 8+ ou Docker Desktop
- VS Code
- Git (recomendado)

## 2. Banco com Docker
Abra o PowerShell na raiz:
```powershell
docker compose up -d mysql
```

## 3. Backend
```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run db:init
npm run seed
npm run dev
```

## 4. Frontend
Outro PowerShell:
```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

## 5. Se `npm` não for reconhecido
Instale o Node.js LTS e abra um novo terminal. A apresentação exige Node.js no Sprint 2, portanto essa dependência faz parte do ambiente do projeto.
