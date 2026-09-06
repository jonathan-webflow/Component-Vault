# Component Vault

Galeria de efeitos GSAP (Made With GSAP) prontos para preview e reutilização em projetos Webflow e web.

## Demo

**https://component-vault-lemon.vercel.app**

A galeria cataloga **65 componentes** com busca, thumbnails e links para demos em tela cheia.

## Estrutura

Cada componente segue o mesmo padrão:

```
mwg_XXX/
├── index.html
└── assets/
    ├── script.js
    ├── style.css
    └── medias/   (opcional)
```

## Desenvolvimento local

```bash
npm run build   # gera index.html + components.json
npm run dev     # build + servidor local
```

Abra `http://localhost:3000` (ou a porta indicada pelo `serve`) para ver a galeria.

## Adicionar um componente

1. Crie uma pasta `mwg_XXX/` na raiz do repositório
2. Adicione `index.html`, `assets/script.js` e `assets/style.css`
3. Rode `npm run build` para regenerar a galeria
4. Commit e push — o deploy na Vercel roda automaticamente

## Deploy

O projeto é estático. A Vercel executa `npm run build` e publica a raiz do repositório.

## Licenciamento GSAP

Vários efeitos usam plugins GSAP premium (SplitText, MorphSVG, InertiaPlugin, etc.). Confirme que sua licença Club GreenSock cobre uso e hosting público antes de publicar em produção.
