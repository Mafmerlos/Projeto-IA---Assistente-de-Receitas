import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SavedRecipes({ listaSalvas, aoSelecionar, aoRemover }) {
  if (!listaSalvas || listaSalvas.length === 0) {
    return (
      <View style={estilos.containerVazio}>
        <Text style={estilos.tituloVazio}>Nenhuma receita salva</Text>
        <Text style={estilos.textoVazio}>
          As receitas que voce salvar durante o uso aparecerao listadas aqui.
        </Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.tituloPrincipal}>Minhas Receitas Salvas</Text>
      {listaSalvas.map((receita, indice) => (
        <View key={indice} style={estilos.itemCard}>
          <View style={estilos.info}>
            <Text style={estilos.nomeReceita}>{receita.titulo}</Text>
            <Text style={estilos.detalhesReceita}>
              Tempo: {receita.tempoPreparo} | Rendimento: {receita.rendimento}
            </Text>
          </View>

          <View style={estilos.botoesAcao}>
            <TouchableOpacity
              style={estilos.botaoAbrir}
              onPress={() => aoSelecionar(receita)}
            >
              <Text style={estilos.textoBotaoAbrir}>Abrir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoExcluir}
              onPress={() => aoRemover(indice)}
            >
              <Text style={estilos.textoBotaoExcluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  tituloPrincipal: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    fontSize: 26,
    color: '#9a3412',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  info: {
    flex: 1,
    minWidth: 180,
  },
  nomeReceita: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    fontSize: 20,
    color: '#7c2d12',
    letterSpacing: 1,
  },
  detalhesReceita: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
    fontWeight: '600',
  },
  botoesAcao: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoAbrir: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  textoBotaoAbrir: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  botaoExcluir: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  textoBotaoExcluir: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    color: '#991b1b',
    fontSize: 12,
    fontWeight: '700',
  },
  containerVazio: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  tituloVazio: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    fontSize: 22,
    color: '#9a3412',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  textoVazio: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '600',
  },
});
