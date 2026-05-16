# Deploy — Cloudflare Pages

## Pré-requisitos
- Conta no [Cloudflare](https://dash.cloudflare.com) (gratuita)
- Repositório GitHub com o projeto
- Node.js 18+ instalado

---

## Passo a passo completo

### 1. Subir o projeto no GitHub

```bash
# Na pasta do projeto
cd c:/Projetos/Dreams/projetos/alerta-vermelho

# Inicializar git (se ainda não feito)
git init
git add .
git commit -m "feat: projeto inicial alerta-vermelho"

# Criar repositório no GitHub (via GitHub CLI ou manualmente)
# Depois:
git remote add origin https://github.com/SEU_USUARIO/alerta-vermelho.git
git push -u origin main
```

### 2. Criar projeto no Cloudflare Pages

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. No menu lateral: **Workers & Pages**
3. Clique em **Create application** → **Pages**
4. Escolha **Connect to Git**
5. Autorize o Cloudflare a acessar sua conta GitHub
6. Selecione o repositório `alerta-vermelho`
7. Clique em **Begin setup**

### 3. Configurar o build

Na tela de configuração de build, preencha:

| Campo | Valor |
|---|---|
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory** | `/` (deixar em branco) |

Em **Environment variables**, adicione:
```
NODE_VERSION = 18
```

Clique em **Save and Deploy**.

### 4. Aguardar o deploy

- O Cloudflare vai clonar o repositório, rodar `npm run build` e publicar a pasta `out`
- O processo leva ~2 minutos
- Ao terminar, você recebe uma URL como: `https://alerta-vermelho.pages.dev`

### 5. Domínio personalizado (opcional)

Se quiser um domínio como `meuciclo.com.br`:
1. Em **Custom domains** → **Set up a custom domain**
2. Digite o domínio e siga as instruções de DNS

---

## Deploy automático nos próximos commits

Após configurado, qualquer `git push` para a branch `main` dispara automaticamente um novo deploy.

```bash
# Para atualizar o site:
git add .
git commit -m "fix: corrige X"
git push origin main
# → Cloudflare detecta o push e faz deploy em ~1-2 min
```

---

## Testar localmente antes do deploy

```bash
# Instalar dependências
npm install

# Build de produção
npm run build

# Servir a pasta out localmente (precisa do serve)
npx serve out
# Acesse: http://localhost:3000
```

---

## Verificar se o build está OK

```bash
npm run build
# Deve mostrar:
# ✓ Compiled successfully
# ✓ Generating static pages (6/6)
```

---

## Checklist pré-deploy

- [ ] `npm run build` roda sem erros
- [ ] Todos os contatos e funcionalidades testados
- [ ] App testado em celular (iOS Safari + Android Chrome)
- [ ] Verificar permissão de microfone no HTTPS (obrigatório em produção)
- [ ] Verificar permissão de geolocalização no HTTPS
- [ ] `git push` feito com todas as alterações

---

## Atenção: HTTPS obrigatório para microfone e geolocalização

O MediaRecorder API e a Geolocation API **só funcionam em HTTPS** (ou localhost para testes).  
O Cloudflare Pages já serve tudo em HTTPS automaticamente — nenhuma configuração extra necessária.

Para testar localmente no celular:
```bash
# Instalar mkcert (Windows)
choco install mkcert

# Criar certificado
mkcert localhost

# Servir com HTTPS
npx serve out -l 443 --ssl-cert localhost.pem --ssl-key localhost-key.pem
```
