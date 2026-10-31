# Stella Stuane

Página do workshop com três aberturas e conteúdo compartilhado, construída com HTML, CSS e JavaScript. As fontes são locais. Nenhuma dependência de execução externa é necessária.

## Desenvolvimento

Requer Node.js 22 ou posterior.

```sh
npm run build
npm start
```

O servidor local abre em `http://127.0.0.1:4182`.

## Verificação

```sh
npm run check
npm run build
```

## Rotas

- `/` redireciona para `/a1`, abertura do Mapa do Padrão Afetivo.
- `/a2`: sinais de disponibilidade emocional.
- `/a3`: critérios de reciprocidade.
- `/obrigado`: página neutra de retorno.

O conteúdo fica em `src/content.json`; a composição é compartilhada em `src/render.mjs`. Os estilos e comportamentos ficam em `src/site.css` e `src/site.js`.

O build produz somente `dist`. Os materiais de campanha são servidos por endereços específicos e não participam da navegação das páginas de aquisição.
