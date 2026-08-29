# Catálogo — Cris Cosméticos

Site estático pronto para publicar no GitHub Pages.

## Como atualizar produtos

Abra `produtos.js` e altere:
- `nome`: nome que aparece no site
- `categoria`: categoria do produto
- `preco`: coloque, por exemplo, `99.90` para aparecer como R$ 99,90. Deixe `''` para aparecer "Consultar preço".
- `imagem`: nome do arquivo dentro da pasta `images`

Para adicionar um produto, copie uma linha existente e troque os dados.

## Publicar no GitHub Pages

1. Crie/abra o repositório no GitHub.
2. Envie `index.html`, `style.css`, `script.js`, `produtos.js` e a pasta `images`.
3. No repositório, entre em **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)` e salve.
6. Aguarde o GitHub gerar o endereço do site.

Não renomeie a pasta `images` nem os arquivos de imagem sem atualizar `produtos.js`.
