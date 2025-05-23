# Serviço de notificação que integra webhooks do GitLab com Microsoft Teams.

## Pré-requisitos

- Node.js instalado
- Conta GitLab com acesso administrativo ao repositório
- Acesso ao Microsoft Teams

## Instruções de Configuração

### Configuração do Webhook no GitLab

1. Acesse seu repositório no GitLab
2. Vá em Configurações > Webhooks no menu lateral
3. Clique em "Add New Webhook"
4. Preencha os detalhes do webhook:
   - URL: Endpoint do seu aplicativo
   - Token Secreto: Crie um token seguro (guarde para uso posterior)
   - Selecione os eventos que deseja receber notificações
5. Clique em "Save Changes"

### Configuração do Microsoft Teams

1. Abra o Microsoft Teams
2. Clique em "Aplicativos" na barra lateral
3. Pesquise por "Workflows"
4. Selecione "Postar mensagem no chat ao receber webhook"
5. Escolha o chat ou canal de destino
6. Clique em "Avançar" e copie a URL do webhook fornecida

### Configuração da Aplicação

1. Clone o repositório:

```bash
git clone https://github.com/michaelchierici/code-notification
cd notification
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto:

```env
CODE_REVIEW_CHAT_WEBHOOK_URL=https://outlook.office.com/webhook/seu-webhook-do-teams
GITLAB_SECRET_TOKEN=seu-token-secreto-gitlab
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Testes

### Usando Postman/Insomnia

Para testar o endpoint do webhook:

1. Adicione o header:

   - Chave: `x-gitlab-token`
   - Valor: Seu token secreto do GitLab

2. Envie uma requisição POST para a rota `/gitlab-webhook`.

## Variáveis de Ambiente

- `CODE_REVIEW_CHAT_WEBHOOK_URL`: URL do webhook do Microsoft Teams
- `GITLAB_SECRET_TOKEN`: Token secreto configurado no webhook do GitLab

## Formato do Payload do Teams

O webhook utiliza Adaptive Cards para formatar a mensagem no Teams. Exemplo do payload:

```json
{
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "type": "AdaptiveCard",
        "version": "1.4",
        "body": [
          {
            "type": "TextBlock",
            "size": "Large",
            "weight": "Bolder",
            "text": "🚀 Novo pedido de *Code Review*"
          },
          {
            "type": "TextBlock",
            "weight": "bolder",
            "text": "📝 Título da Issue (#123)"
          },
          {
            "type": "TextBlock",
            "color": "default",
            "text": "👤 Nome do Usuário (@username)"
          },
          {
            "type": "TextBlock",
            "color": "accent",
            "text": "[🔗 Abrir issue](https://gitlab.com/...)"
          }
        ],
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
      }
    }
  ]
}
```

## Links Úteis

- [Documentação oficial do Webhook do Teams](https://learn.microsoft.com/en-us/connectors/teams/?tabs=text1%2Cjavascript#microsoft-teams-webhook)
- [Designer de Adaptive Cards](https://adaptivecards.microsoft.com/designer) - Ferramenta para criar e personalizar cards

## Solução de Problemas

- Certifique-se que o token secreto do GitLab corresponde ao do arquivo .env
- Verifique se a URL do webhook do Teams está correta e acessível
- Verifique os logs da aplicação para mensagens de erro
