# Assistente de Receitas

Aplicação web que gera receitas a partir dos ingredientes que o usuário tem em casa, usando a IA do Google Gemini. O frontend em React Native Web conversa com uma API própria em Python (Flask), que valida os dados, aplica as regras de negócio e é a única parte do sistema que fala com o Gemini.

Projeto da disciplina de Inteligência Artificial.

**Integrantes:** Matheus Figueira Merlos e João Pedro Marucci Pagluiso

---

## Funcionalidades

- Gera uma receita completa (título, descrição, tempo, rendimento, dificuldade, ingredientes, opcionais, passo a passo e dica do chef) a partir dos ingredientes informados.
- Quatro tipos de refeição: Almoço/Jantar, Café da Manhã, Lanche e Sobremesa.
- Recusa entradas que não são comida: formato inválido (erro 400) e itens que não são alimentos, como "cadeira" (erro 422).
- A lista principal da receita só tem o que o usuário informou; açúcar, sal, canela e outros extras aparecem como opcionais.
- Se os ingredientes não combinam com o tipo escolhido (ex.: carne moída em sobremesa), a IA cria o prato mais coerente e explica na descrição.
- Modelo reserva: se o Gemini principal falhar, um segundo modelo assume automaticamente.
- Mensagens de erro claras, separando cota esgotada (429) de Gemini sobrecarregado (503).
- Receitas salvas no navegador (localStorage), com opção de abrir, excluir e copiar o texto.
- Indicador de status do servidor no topo da tela: online, offline ou online sem chave do Gemini.

## Tecnologias

| Camada | Tecnologia | Uso |
| --- | --- | --- |
| Backend | Python 3 + Flask 3 | Servidor HTTP e rotas da API |
| Backend | Flask-CORS 4 | Libera o acesso do frontend (porta 5173) à API (porta 3001) |
| Backend | python-dotenv 1 | Lê a `GEMINI_API_KEY` do arquivo `.env` |
| Backend | google-genai 2 | SDK oficial do Gemini |
| Frontend | React 18 + React Native Web 0.19 | Interface com componentes React Native no navegador |
| Frontend | Vite 5 | Servidor de desenvolvimento e build |
| IA | `gemini-3.8-flash` | Modelo principal |
| IA | `gemini-3.1-flash-lite` | Modelo reserva |

## Arquitetura

```
[ Frontend: React Native Web (localhost:5173) ]
                 |  POST /api/receitas/gerar (JSON, via fetch)
                 v
[ Backend: Flask - app.py (localhost:3001) ]
   rotas -> validação -> prompt -> chamar_modelo -> trava de extras
                 |  generate_content (SDK google-genai, resposta em JSON)
                 v
[ Google Gemini: gemini-3.8-flash, reserva gemini-3.1-flash-lite ]
```

O frontend nunca chama o Gemini diretamente. A chave de API fica só no `.env` do servidor.

## Estrutura de pastas

```
Projeto IA/
├── backend/
│   ├── app.py              # API completa (245 linhas)
│   ├── requirements.txt    # Dependências Python
│   ├── .env.example        # Modelo do .env
│   └── .env                # GEMINI_API_KEY e PORT (não vai para o GitHub)
├── frontend/
│   ├── index.html          # HTML e fontes (Bebas Neue e Caviar Dreams)
│   ├── vite.config.js      # Alias react-native -> react-native-web, porta 5173
│   ├── package.json
│   └── src/
│       ├── main.jsx        # Ponto de entrada do React
│       ├── App.jsx         # Estado global, abas, erros e receitas salvas
│       ├── services/api.js # Chamadas HTTP: checarStatus e requisitarReceita
│       └── components/
│           ├── Header.jsx          # Título e abas (Gerar Receita / Receitas Salvas)
│           ├── IngredientInput.jsx # Ingredientes em chips e tipo de refeição
│           ├── RecipeCard.jsx      # Receita gerada: salvar, copiar, voltar
│           └── SavedRecipes.jsx    # Lista de receitas salvas: abrir e excluir
├── Apresentacao_Backend_Assistente_Receitas.pptx
├── Documentação Projeto.pdf
└── Mostrando Sistema Funcionando.mp4
```

## Como rodar

**Pré-requisitos:** Python 3, Node.js e uma chave do Gemini (Google AI Studio).

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
```

Copie `backend/.env.example` para `backend/.env` e coloque a sua chave:

```
GEMINI_API_KEY=sua_chave_aqui
PORT=3001
```

Inicie o servidor:

```bash
python app.py
```

A API sobe em `http://localhost:3001`.

### 2. Frontend (em outro terminal)

```bash
cd frontend
npm install
npm start
```

Acesse `http://localhost:5173`.

## Rotas da API

| Método | Rota | Chama a IA? | O que faz |
| --- | --- | --- | --- |
| GET | `/` | Não | Identifica o serviço e lista os modelos |
| GET | `/api/status` | Não | Informa se o servidor está online e se a chave existe (sem revelá-la) |
| POST | `/api/receitas/gerar` | Sim | Gera a receita |

### Exemplo: `POST /api/receitas/gerar`

Requisição:

```json
{
  "ingredientes": ["frango", "arroz", "tomate"],
  "tipoRefeicao": "Almoco/Jantar"
}
```

- `ingredientes` (obrigatório): lista de textos ou texto separado por vírgulas. Até 20 itens, cada um com até 40 caracteres, pelo menos 2 letras e sem símbolos estranhos.
- `tipoRefeicao` (opcional): padrão `"Almoco ou Jantar"`.

Resposta de sucesso (200):

```json
{
  "sucesso": true,
  "dados": {
    "titulo": "Arroz de Frango ao Tomate",
    "descricao": "...",
    "tempoPreparo": "25 minutos",
    "rendimento": "2 porções",
    "dificuldade": "Facil",
    "ingredientes": ["300 g de frango", "1 xícara de arroz", "2 tomates"],
    "ingredientesOpcionais": ["Sal a gosto", "Azeite para refogar"],
    "modoPreparo": ["...", "..."],
    "dica": "..."
  }
}
```

Toda resposta de erro segue o formato `{"sucesso": false, "mensagem": "..."}`.

| Código | Quando acontece |
| --- | --- |
| 200 | Receita gerada (pelo modelo principal ou pelo reserva) |
| 400 | Nenhum ingrediente, formato inválido ou corpo da requisição inválido |
| 422 | A IA identificou itens que não são alimentos (a mensagem lista quais) |
| 429 | Os dois modelos falharam e a cota do Gemini está esgotada |
| 503 | Os dois modelos falharam porque o Gemini está sobrecarregado |
| 500 | Outra falha (ex.: chave ausente, JSON inválido) ou erro inesperado |

## Regras de negócio

| # | Regra | Onde |
| --- | --- | --- |
| RN01 | Pelo menos um ingrediente é obrigatório (senão 400) | Código |
| RN02 | Corpo JSON malformado não derruba a API (vira 400) | Código |
| RN03 | Sem `GEMINI_API_KEY` não há geração | Código |
| RN04 | Tipo de refeição padrão: "Almoco ou Jantar" | Código |
| RN05 | Ingredientes aceitos como lista ou texto; itens vazios são descartados | Código |
| RN06 | A lista principal só tem o que o usuário informou | Prompt + trava no código |
| RN07 | Qualquer extra (sal, açúcar, canela...) só como opcional | Prompt |
| RN08 | Resposta sempre em JSON com 9 campos fixos | Prompt + modo JSON |
| RN09 | Até 20 itens, até 40 caracteres, pelo menos 2 letras, sem símbolos | Código |
| RN10 | Só alimentos reais; senão 422 com a lista dos itens | Prompt |
| RN11 | O tipo de refeição não é forçado se os ingredientes não combinam | Prompt |

O tempo de preparo não é informado pelo usuário: a IA estima o tempo de cada receita.

## Integração com o Gemini

1. O prompt tem cinco partes: persona (chef experiente), verificação prévia (os itens são alimentos?), dados do usuário, diretrizes (RN06, RN07 e RN11) e o molde JSON da resposta.
2. A chamada usa `response_mime_type="application/json"`, então o Gemini responde em JSON puro, que vai direto para `json.loads`.
3. Se o modelo principal lançar qualquer erro, o backend tenta o modelo reserva.
4. Se os dois falharem, `verificar_erro_cota` e `verificar_erro_sobrecarga` analisam os erros para responder 429, 503 ou 500.
5. Depois da resposta, `separar_ingredientes_extras` move para os opcionais qualquer item que o usuário não informou.

**Acompanhar a cota:** a API do Gemini não informa quanto de cota resta. O uso por modelo e os limites do plano aparecem no Google AI Studio, na conta dona da chave. No terminal do backend, os avisos `[Aviso]`, `[Fallback]` e `[Erro]` mostram a causa de cada falha.
