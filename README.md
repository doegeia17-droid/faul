# Faul — versão 1.0

Aplicação a partir do arquivo `faul.html`, organizada em dois arquivos: `index.html` contém a estrutura e o JavaScript; `styles.css` reúne os estilos visuais e as regras responsivas.

## Executar

Requer Python 3 apenas para servir os arquivos localmente:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra o endereço local na porta 8000 no navegador. Não há instalação de dependências nem etapa de build.

Os dados são armazenados no navegador com `localStorage`. Fontes do Google, previsão do Open-Meteo e alertas do INMET dependem de conexão e disponibilidade dos serviços externos.

Ao publicar ou copiar a aplicação, mantenha `index.html` e `styles.css` na mesma pasta.
