from flask import Blueprint, request
from models import receita_model
from views import resposta_view

receita_bp = Blueprint("receitas", __name__)

MENSAGENS_ERRO_IA = {
    "cota": ("A cota de uso do Gemini foi esgotada. Aguarde alguns minutos para a cota recarregar ou aguarde a renovacao diaria para usar novamente.", 429),
    "sobrecarga": ("O Gemini esta sobrecarregado no momento. Tente novamente em alguns segundos.", 503),
    "outro": ("Nao foi possivel gerar a receita no momento. Por favor, aguarde um instante e tente novamente.", 500),
}


@receita_bp.route("/", methods=["GET"])
def inicio():
    return resposta_view.inicio([receita_model.modelo_principal, receita_model.modelo_reserva])


@receita_bp.route("/api/status", methods=["GET"])
def status():
    return resposta_view.status(bool(receita_model.chave_gemini))


@receita_bp.route("/api/receitas/gerar", methods=["POST"])
def gerar_receita():
    try:
        dados = request.get_json(silent=True) or {}
        ingredientes = dados.get("ingredientes")
        tipo_refeicao = dados.get("tipoRefeicao", "Almoco ou Jantar")

        if not ingredientes or (isinstance(ingredientes, list) and len(ingredientes) == 0):
            return resposta_view.erro("Informe pelo menos um ingrediente.", 400)

        lista_validada, erro_formato = receita_model.validar_formato_ingredientes(ingredientes)
        if erro_formato:
            return resposta_view.erro(erro_formato, 400)

        receita, tipo_erro = receita_model.gerar_receita(lista_validada, tipo_refeicao)
        if tipo_erro:
            mensagem, codigo = MENSAGENS_ERRO_IA[tipo_erro]
            return resposta_view.erro(mensagem, codigo)

        if receita.get("ingredientesValidos") is False:
            itens = receita.get("itensInvalidos") or []
            detalhe = f": {', '.join(map(str, itens))}" if itens else ""
            return resposta_view.erro(f"Alguns itens informados nao sao ingredientes culinarios{detalhe}. Remova-os e tente novamente.", 422)

        receita.pop("ingredientesValidos", None)
        receita = receita_model.separar_ingredientes_extras(receita, lista_validada)
        return resposta_view.sucesso(receita)

    except Exception as e_geral:
        print(f"Erro geral: {e_geral}", flush=True)
        return resposta_view.erro("Erro interno no servidor ao processar a receita.", 500)
