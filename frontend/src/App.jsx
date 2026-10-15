import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import SavedRecipes from './components/SavedRecipes';
import { checarStatus, requisitarReceita } from './services/api';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('gerador');
  const [receitaAtual, setReceitaAtual] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [receitasSalvas, setReceitasSalvas] = useState([]);
  const [statusServidor, setStatusServidor] = useState(null);

  useEffect(() => {
    checarStatus().then(setStatusServidor);
  }, []);

  useEffect(() => {
    try {
      const salvas = localStorage.getItem('receitas_salvas');
      if (salvas) {
        setReceitasSalvas(JSON.parse(salvas));
      }
    } catch (e) {
      console.warn('Erro ao carregar dados salvos:', e);
    }
  }, []);

  const gerarReceita = async (dados) => {
    setCarregando(true);
    setMensagemErro('');
    try {
      const resposta = await requisitarReceita(dados);
      if (resposta.sucesso && resposta.dados) {
        setReceitaAtual(resposta.dados);
      } else {
        setMensagemErro(resposta.mensagem || 'Nao foi possivel gerar a receita.');
      }
    } catch (erro) {
      setMensagemErro(erro.message || 'Erro ao conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  const salvarReceita = (receita) => {
    const jaExiste = receitasSalvas.some(r => r.titulo === receita.titulo);
    let atualizadas;

    if (jaExiste) {
      atualizadas = receitasSalvas.filter(r => r.titulo !== receita.titulo);
    } else {
      atualizadas = [receita, ...receitasSalvas];
    }

    setReceitasSalvas(atualizadas);
    try {
      localStorage.setItem('receitas_salvas', JSON.stringify(atualizadas));
    } catch (e) {
      console.warn('Erro ao salvar:', e);
    }
  };

  const removerSalva = (indice) => {
    const atualizadas = receitasSalvas.filter((_, idx) => idx !== indice);
    setReceitasSalvas(atualizadas);
    try {
      localStorage.setItem('receitas_salvas', JSON.stringify(atualizadas));
    } catch (e) {
      console.warn('Erro ao salvar:', e);
    }
  };

  const jaSalva = receitaAtual
    ? receitasSalvas.some(r => r.titulo === receitaAtual.titulo)
    : false;

  return (
    <SafeAreaView style={estilos.tela}>
      <Header
        abaAtiva={abaAtiva}
        aoMudarAba={setAbaAtiva}
        statusServidor={statusServidor}
      />

      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.containerCentral}>
          {mensagemErro ? (
            <View style={estilos.alertaErro}>
              <Text style={estilos.textoAlertaErro}>{mensagemErro}</Text>
            </View>
          ) : null}

          {abaAtiva === 'gerador' && (
            <View>
              <IngredientInput aoGerar={gerarReceita} carregando={carregando} />

              {receitaAtual && !carregando && (
                <RecipeCard
                  receita={receitaAtual}
                  aoSalvar={salvarReceita}
                  jaSalva={jaSalva}
                  aoNovaReceita={() => setReceitaAtual(null)}
                />
              )}
            </View>
          )}

          {abaAtiva === 'salvas' && (
            <SavedRecipes
              listaSalvas={receitasSalvas}
              aoSelecionar={(receita) => {
                setReceitaAtual(receita);
                setAbaAtiva('gerador');
              }}
              aoRemover={removerSalva}
            />
          )}
        </View>

        <View style={estilos.rodape}>
          <View style={estilos.rodapeAlunos}>
            <Text style={estilos.nomeAluno}>Matheus Figueira Merlos</Text>
            <Text style={estilos.nomeAluno}>João Pedro Marucci Pagluiso</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#fffaf5',
    minHeight: '100vh',
  },
  conteudo: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 'calc(100vh - 110px)',
  },
  containerCentral: {
    width: '100%',
    maxWidth: 620,
  },
  alertaErro: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textoAlertaErro: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '700',
  },
  rodape: {
    marginTop: 32,
    width: '100%',
    maxWidth: 620,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#fed7aa',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rodapeAlunos: {
    alignItems: 'flex-end',
  },
  nomeAluno: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    fontWeight: '700',
    color: '#7c2d12',
    lineHeight: 18,
  },
});
