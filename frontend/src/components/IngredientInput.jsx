import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const TIPOS_REFEICAO = ['Almoco/Jantar', 'Cafe da Manha', 'Lanche', 'Sobremesa'];

export default function IngredientInput({ aoGerar, carregando }) {
  const [ingredienteDigitado, setIngredienteDigitado] = useState('');
  const [listaIngredientes, setListaIngredientes] = useState(['Ovos', 'Tomate', 'Queijo']);
  const [tipoRefeicao, setTipoRefeicao] = useState('Almoco/Jantar');
  const [erro, setErro] = useState('');

  const adicionar = (nome) => {
    const textoLimpo = nome.trim();
    if (!textoLimpo) return;

    if (listaIngredientes.some(item => item.toLowerCase() === textoLimpo.toLowerCase())) {
      setErro(`"${textoLimpo}" ja foi adicionado.`);
      setTimeout(() => setErro(''), 2500);
      return;
    }

    setListaIngredientes([...listaIngredientes, textoLimpo]);
    setIngredienteDigitado('');
    setErro('');
  };

  const remover = (indice) => {
    setListaIngredientes(listaIngredientes.filter((_, idx) => idx !== indice));
  };

  const submeter = () => {
    if (listaIngredientes.length === 0) {
      setErro('Adicione ao menos um ingrediente.');
      return;
    }

    setErro('');
    aoGerar({
      ingredientes: listaIngredientes,
      tipoRefeicao,
    });
  };

  return (
    <View style={estilos.formulario}>
      <Text style={estilos.titulo}>Ingredientes Disponiveis</Text>
      <Text style={estilos.instrucao}>
        Digite os itens que voce tem na cozinha para gerar uma receita:
      </Text>

      <View style={estilos.linhaInput}>
        <TextInput
          style={estilos.campoTexto}
          placeholder="Ex: frango, arroz, cebola..."
          value={ingredienteDigitado}
          onChangeText={setIngredienteDigitado}
          onSubmitEditing={() => adicionar(ingredienteDigitado)}
        />
        <TouchableOpacity
          style={estilos.botaoAdicionar}
          onPress={() => adicionar(ingredienteDigitado)}
        >
          <Text style={estilos.textoBotaoAdicionar}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.blocoTags}>
        {listaIngredientes.length === 0 ? (
          <Text style={estilos.textoVazio}>Nenhum item adicionado.</Text>
        ) : (
          listaIngredientes.map((item, index) => (
            <View key={index} style={estilos.tag}>
              <Text style={estilos.textoTag}>{item}</Text>
              <TouchableOpacity onPress={() => remover(index)} style={estilos.botaoRemoverTag}>
                <Text style={estilos.textoRemoverTag}>x</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={estilos.divisor} />

      <Text style={estilos.rotuloSecao}>Tipo de Refeicao:</Text>
      <View style={estilos.linhaOpcoes}>
        {TIPOS_REFEICAO.map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[estilos.opcaoItem, tipoRefeicao === tipo && estilos.opcaoItemAtivo]}
            onPress={() => setTipoRefeicao(tipo)}
          >
            <Text style={[estilos.textoOpcao, tipoRefeicao === tipo && estilos.textoOpcaoAtiva]}>
              {tipo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {erro ? (
        <View style={estilos.caixaErro}>
          <Text style={estilos.textoErro}>{erro}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[estilos.botaoPrincipal, carregando && estilos.botaoDesativado]}
        onPress={submeter}
        disabled={carregando}
      >
        <Text style={estilos.textoBotaoPrincipal}>
          {carregando ? 'Gerando receita...' : 'Criar Receita'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  formulario: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 20,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  titulo: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    fontSize: 26,
    color: '#9a3412',
    letterSpacing: 1.5,
  },
  instrucao: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
    marginBottom: 14,
    fontWeight: '600',
  },
  linhaInput: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  campoTexto: {
    flex: 1,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 14,
    color: '#111827',
    outlineStyle: 'none',
  },
  botaoAdicionar: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  textoBotaoAdicionar: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  blocoTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    minHeight: 28,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffedd5',
    borderWidth: 1,
    borderColor: '#fed7aa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  textoTag: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    color: '#9a3412',
    fontWeight: '700',
  },
  botaoRemoverTag: {
    paddingHorizontal: 2,
  },
  textoRemoverTag: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 12,
    color: '#c2410c',
    fontWeight: '700',
  },
  textoVazio: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  divisor: {
    height: 1,
    backgroundColor: '#ffedd5',
    marginVertical: 14,
  },
  rotuloSecao: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 14,
    fontWeight: '700',
    color: '#7c2d12',
    marginBottom: 6,
  },
  linhaOpcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  opcaoItem: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  opcaoItemAtivo: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  textoOpcao: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    color: '#7c2d12',
    fontWeight: '600',
  },
  textoOpcaoAtiva: {
    color: '#ffffff',
    fontWeight: '700',
  },
  caixaErro: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginTop: 10,
  },
  textoErro: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    color: '#b91c1c',
    fontSize: 13,
  },
  botaoPrincipal: {
    backgroundColor: '#ea580c',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  botaoDesativado: {
    backgroundColor: '#fdba74',
  },
  textoBotaoPrincipal: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    color: '#ffffff',
    fontSize: 22,
    letterSpacing: 1.5,
  },
});
