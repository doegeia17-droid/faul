# Faul — versão 1.0

Aplicação a partir do arquivo `faul.html`, organizada em três arquivos: `index.html` contém a estrutura e as funções existentes; `app.js` organiza as quatro telas e as notas; `styles.css` reúne os estilos visuais e as regras responsivas.

## Executar

Requer Python 3 apenas para servir os arquivos localmente:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra o endereço local na porta 8000 no navegador. Não há instalação de dependências nem etapa de build.

Os dados são armazenados no navegador com `localStorage`. Fontes do Google, previsão do Open-Meteo e alertas do INMET dependem de conexão e disponibilidade dos serviços externos.

Ao publicar ou copiar a aplicação, mantenha `index.html`, `app.js` e `styles.css` na mesma pasta.

## Telas

- Hoje: responsabilidades, consulta de pendentes com acesso à Pauta e quadro de títulos das notas.
- Pauta: inclusão, conclusão e exclusão dos itens do dia.
- Notas: criação, edição e exclusão de notas com título e conteúdo. Anotações antigas são importadas automaticamente no primeiro acesso.
- Calendário: vencimentos das responsabilidades.

Cada tela tem um endereço próprio pelo fragmento da URL e permite voltar e avançar pelo navegador.

## Campos favoritos

Cada campo dos formulários possui uma estrela para favoritar ou desfavoritar. Na tela Hoje, selecione uma responsabilidade para consultar seus campos favoritos e valores logo abaixo dos ícones. O primeiro clique em uma responsabilidade mostra os favoritos; outro clique na mesma responsabilidade abre a tela de formulários, onde é possível criar e editar formulários. Os favoritos são salvos neste navegador e preservados ao editar o formulário.

A exclusão de responsabilidades pede confirmação dentro da própria tela, com opções para cancelar ou confirmar. Ao excluir, os favoritos e vencimentos relacionados são atualizados.

Campos de texto e texto longo permitem adicionar uma data opcional vinculada. Datas preenchidas aparecem no calendário, nos avisos de vencimento e junto aos favoritos. Ao remover a data, ela deixa de aparecer nesses locais.
