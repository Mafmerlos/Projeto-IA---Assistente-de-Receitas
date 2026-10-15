import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Header({ abaAtiva, aoMudarAba, statusServidor }) {
  let textoStatus = 'Verificando servidor...';
  let corStatus = '#6b7280';

  if (statusServidor) {
    if (statusServidor.status !== 'online') {
      textoStatus = 'Servidor offline';
      corStatus = '#b91c1c';
    } else if (!statusServidor.temChaveConfigurada) {
      textoStatus = 'Servidor online, sem chave do Gemini';
      corStatus = '#b45309';
    } else {
      textoStatus = 'Servidor online';
      corStatus = '#15803d';
    }
  }

  return (
    <View style={estilos.cabecalho}>
      <View style={estilos.containerTitulo}>
        <Text style={estilos.titulo}>Assistente de Receitas</Text>
        <Text style={[estilos.textoStatus, { color: corStatus }]}>{textoStatus}</Text>
      </View>

      <View style={estilos.navegacao}>
        <TouchableOpacity
          style={[estilos.botaoAba, abaAtiva === 'gerador' && estilos.botaoAbaAtiva]}
          onPress={() => aoMudarAba('gerador')}
        >
          <Text style={[estilos.textoAba, abaAtiva === 'gerador' && estilos.textoAbaAtiva]}>
            Gerar Receita
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botaoAba, abaAtiva === 'salvas' && estilos.botaoAbaAtiva]}
          onPress={() => aoMudarAba('salvas')}
        >
          <Text style={[estilos.textoAba, abaAtiva === 'salvas' && estilos.textoAbaAtiva]}>
            Receitas Salvas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 6,
  },
  containerTitulo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    fontSize: 38,
    color: '#ea580c',
    textAlign: 'center',
    letterSpacing: 2,
  },
  textoStatus: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  navegacao: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  botaoAba: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  botaoAbaAtiva: {
    borderBottomColor: '#ea580c',
  },
  textoAba: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '700',
  },
  textoAbaAtiva: {
    color: '#ea580c',
    fontWeight: '700',
  },
});
