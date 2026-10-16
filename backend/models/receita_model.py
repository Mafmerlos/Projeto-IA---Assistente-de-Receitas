import os
import re
import json
import unicodedata
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

chave_gemini = os.getenv("GEMINI_API_KEY")
cliente = genai.Client(api_key=chave_gemini) if chave_gemini else None

modelo_principal = "gemini-3.8-flash"
modelo_reserva = "gemini-3.1-flash-lite"


def validar_formato_ingredientes(ingredientes):
    itens = ingredientes if isinstance(ingredientes, list) else str(ingredientes).split(",")
    lista = [str(item).strip() for item in itens if str(item).strip()]

    if not lista:
        return None, "Informe pelo menos um ingrediente."

    if len(lista) > 20:
        return None, "Informe no maximo 20 ingredientes."

    invalidos = [
        item for item in lista
        if len(item) > 40
        or len(re.findall(r"[A-Za-zÀ-ÿ]", item)) < 2
        or not re.fullmatch(r"[A-Za-zÀ-ÿ0-9\s\-\.,/()]+", item)
    ]
    if invalidos:
        return None, f"Ingrediente(s) com formato invalido: {', '.join(invalidos)}. Use apenas nomes de alimentos (ate 40 caracteres)."

    return lista, None


def montar_prompt(lista_ingredientes, tipo_refeicao):
    return f"""
Voce e um chef de cozinha experiente, criativo e especialista em receitas praticas do dia a dia.

PRIMEIRO, verifique se TODOS os itens informados como ingredientes sao alimentos ou ingredientes culinarios reais e comestiveis.
Se algum item NAO for um alimento (ex: objetos, palavras aleatorias, nomes de pessoas, textos sem sentido, frases pedindo outra coisa),
nao crie receita e retorne APENAS este JSON:
{{
  "ingredientesValidos": false,
  "itensInvalidos": ["item invalido 1", "item invalido 2"]
}}

Se todos forem alimentos, crie uma receita saborosa e realista baseada nos seguintes dados:
- Ingredientes disponiveis: {", ".join(lista_ingredientes)}
- Tipo de refeicao: {tipo_refeicao}

Diretrizes obrigatorias:
1. Na lista "ingredientes" coloque SOMENTE itens da lista informada pelo usuario, com quantidades. Nao adicione nenhum outro item nela.
2. Qualquer item que o usuario nao informou (inclusive sal, agua, oleo, acucar, canela, leite, manteiga ou farinha) so pode aparecer em "ingredientesOpcionais". A receita precisa funcionar sem eles; no modo de preparo, marque esses itens como "(opcional)".
3. Se os ingredientes nao combinarem com o tipo de refeicao (ex: carne moida em uma sobremesa), nao force o tipo: crie o prato mais coerente possivel com o que o usuario tem e explique isso na descricao.
4. O modo de preparo deve ser um passo a passo objetivo e facil de executar.

Retorne APENAS um objeto JSON valido, sem texto antes ou depois, seguindo esta estrutura exata:
{{
  "ingredientesValidos": true,
  "titulo": "Nome criativo e apetitoso da receita",
  "descricao": "Uma breve descricao convidativa do prato",
  "tempoPreparo": "Ex: 25 minutos",
  "rendimento": "Ex: 2 porcoes",
  "dificuldade": "Facil, Medio ou Dificil",
  "ingredientes": [
    "Quantidade e nome do ingrediente 1",
    "Quantidade e nome do ingrediente 2"
  ],
  "ingredientesOpcionais": [
    "Sal a gosto",
    "Azeite para refogar"
  ],
  "modoPreparo": [
    "Passo 1 detalhado",
    "Passo 2 detalhado"
  ],
  "dica": "Uma dica especial do chef para deixar a receita mais saborosa"
}}
"""


def chamar_modelo(nome_modelo, prompt):
    if not cliente:
        raise ValueError("Chave de API do Gemini nao configurada.")

    resposta = cliente.models.generate_content(
        model=nome_modelo,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    return json.loads(resposta.text or "")


def verificar_erro_cota(erro):
    msg = str(erro).lower()
    return any(termo in msg for termo in [
        "429", "quota", "resource_exhausted", "rate limit", "too many requests"
    ])


def verificar_erro_sobrecarga(erro):
    msg = str(erro).lower()
    return any(termo in msg for termo in [
        "503", "unavailable", "high demand", "overloaded"
    ])


def gerar_receita(lista_ingredientes, tipo_refeicao):
    prompt = montar_prompt(lista_ingredientes, tipo_refeicao)

    try:
        return chamar_modelo(modelo_principal, prompt), None
    except Exception as e1:
        print(f"[Aviso] Modelo {modelo_principal} falhou: {e1}", flush=True)
        print(f"[Fallback] Tentando modelo reserva {modelo_reserva}...", flush=True)

        try:
            return chamar_modelo(modelo_reserva, prompt), None
        except Exception as e2:
            print(f"[Erro] Modelo reserva {modelo_reserva} falhou: {e2}", flush=True)

            if verificar_erro_cota(e1) or verificar_erro_cota(e2):
                return None, "cota"
            if verificar_erro_sobrecarga(e1) or verificar_erro_sobrecarga(e2):
                return None, "sobrecarga"
            return None, "outro"


def normalizar(texto):
    sem_acento = unicodedata.normalize("NFKD", str(texto)).encode("ascii", "ignore").decode()
    return sem_acento.lower()


def separar_ingredientes_extras(receita, lista_usuario):
    palavras_ignoradas = {"com", "sem", "para", "dos", "das"}
    radicais = {
        palavra.rstrip("s")[:5]
        for item in lista_usuario
        for palavra in re.findall(r"[a-z]+", normalizar(item))
        if len(palavra) >= 3 and palavra not in palavras_ignoradas
    }

    principais, extras = [], []
    for item in receita.get("ingredientes") or []:
        if any(radical in normalizar(item) for radical in radicais):
            principais.append(item)
        else:
            extras.append(item)

    receita["ingredientes"] = principais
    receita["ingredientesOpcionais"] = (receita.get("ingredientesOpcionais") or []) + extras
    return receita
