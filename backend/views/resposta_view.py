from flask import jsonify


def inicio(modelos):
    return jsonify({
        "servico": "API Assistente de Receitas",
        "status": "online",
        "modelos": modelos
    })


def status(tem_chave):
    return jsonify({
        "status": "online",
        "servico": "API Assistente de Receitas",
        "temChaveConfigurada": tem_chave
    })


def sucesso(dados):
    return jsonify({
        "sucesso": True,
        "dados": dados
    }), 200


def erro(mensagem, codigo):
    return jsonify({
        "sucesso": False,
        "mensagem": mensagem
    }), codigo
