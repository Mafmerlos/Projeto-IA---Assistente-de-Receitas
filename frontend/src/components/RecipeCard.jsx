import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RecipeCard({ receita, aoSalvar, jaSalva, aoNovaReceita }) {
  const [copiado, setCopiado] = useState(false);

  if (!receita) return null;

  const copiarTexto = () => {
    const texto = `${receita.titulo}\n\n${receita.descricao}\n\nTempo: ${receita.tempoPreparo} | Rendimento: ${receita.rendimento}\n\nIngredientes:\n${(receita.ingredientes || []).map(i => `- ${i}`).join('\n')}\n\nModo de Preparo:\n${(receita.modoPreparo || []).map((p, idx) => `${idx + 1}. ${p}`).join('\n')}\n\nDica: ${receita.dica || ''}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <View style={estilos.card}>
      <View style={estilos.cabecalhoCard}>
        <Text style={estilos.titulo}>{receita.titulo}</Text>
        <View style={estilos.acoesTopo}>
          <TouchableOpacity
            style={[estilos.botaoSalvar, jaSalva && estilos.botaoJaSalvo]}
            onPress={() => aoSalvar(receita)}
          >
            <Text style={[estilos.textoBotaoSalvar, jaSalva && estilos.textoBotaoJaSalvo]}>
              {jaSalva ? 'Salva' : 'Salvar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botaoCopiar} onPress={copiarTexto}>
            <Text style={estilos.textoBotaoCopiar}>
              {copiado ? 'Copiado' : 'Copiar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={estilos.descricao}>{receita.descricao}</Text>

      <View style={estilos.linhaInfo}>
        <View style={estilos.itemInfo}>
          <Text style={estilos.rotuloInfo}>Tempo:</Text>
          <Text style={estilos.valorInfo}>{receita.tempoPreparo || '20 min'}</Text>
        </View>

        <View style={estilos.itemInfo}>
          <Text style={estilos.rotuloInfo}>Rendimento:</Text>
          <Text style={estilos.valorInfo}>{receita.rendimento || '2 porcoes'}</Text>
        </View>

        <View style={estilos.itemInfo}>
          <Text style={estilos.rotuloInfo}>Dificuldade:</Text>
          <Text style={estilos.valorInfo}>{receita.dificuldade || 'Facil'}</Text>
        </View>
      </View>

      <View style={estilos.bloco}>
        <Text style={estilos.tituloSecao}>Ingredientes Utilizados</Text>
        {(receita.ingredientes || []).map((ing, idx) => (
          <Text key={idx} style={estilos.itemIngrediente}>
            • {ing}
          </Text>
        ))}

        {receita.ingredientesOpcionais && receita.ingredientesOpcionais.length > 0 && (
          <Text style={estilos.textoOpcionais}>
            Opcionais (voce nao informou): {receita.ingredientesOpcionais.join(', ')}
          </Text>
        )}
      </View>

      <View style={estilos.bloco}>
        <Text style={estilos.tituloSecao}>Modo de Preparo</Text>
        {(receita.modoPreparo || []).map((passo, idx) => (
          <View key={idx} style={estilos.linhaPasso}>
            <Text style={estilos.numeroPasso}>{idx + 1}.</Text>
            <Text style={estilos.textoPasso}>{passo}</Text>
          </View>
        ))}
      </View>

      {receita.dica ? (
        <View style={estilos.caixaDica}>
          <Text style={estilos.tituloDica}>Dica do Chef:</Text>
          <Text style={estilos.textoDica}>{receita.dica}</Text>
        </View>
      ) : null}

      {aoNovaReceita && (
        <TouchableOpacity style={estilos.botaoNova} onPress={aoNovaReceita}>
          <Text style={estilos.textoBotaoNova}>Voltar para o formulario</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
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
  cabecalhoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  titulo: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    fontSize: 28,
    color: '#9a3412',
    letterSpacing: 1.5,
    flex: 1,
  },
  acoesTopo: {
    flexDirection: 'row',
    gap: 6,
  },
  botaoSalvar: {
    borderWidth: 1,
    borderColor: '#fed7aa',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#fff7ed',
  },
  botaoJaSalvo: {
    backgroundColor: '#ffedd5',
    borderColor: '#f97316',
  },
  textoBotaoSalvar: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    fontWeight: '700',
    color: '#9a3412',
  },
  textoBotaoJaSalvo: {
    color: '#ea580c',
    fontWeight: '700',
  },
  botaoCopiar: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
  },
  textoBotaoCopiar: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '600',
  },
  descricao: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 14,
    fontWeight: '600',
  },
  linhaInfo: {
    flexDirection: 'row',
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  itemInfo: {
    alignItems: 'center',
    flex: 1,
  },
  rotuloInfo: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 12,
    color: '#9a3412',
    fontWeight: '600',
  },
  valorInfo: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 14,
    fontWeight: '700',
    color: '#7c2d12',
    marginTop: 2,
  },
  bloco: {
    marginBottom: 16,
  },
  tituloSecao: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    fontSize: 22,
    color: '#9a3412',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  itemIngrediente: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '600',
  },
  textoOpcionais: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  linhaPasso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  numeroPasso: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    fontSize: 18,
    color: '#ea580c',
  },
  textoPasso: {
    flex: 1,
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
    fontWeight: '600',
  },
  caixaDica: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  tituloDica: {
    fontFamily: "'Bebas Neue', cursive, sans-serif",
    fontSize: 18,
    color: '#92400e',
    letterSpacing: 1,
    marginBottom: 2,
  },
  textoDica: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
    fontWeight: '600',
  },
  botaoNova: {
    backgroundColor: '#ffedd5',
    borderWidth: 1,
    borderColor: '#fed7aa',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoNova: {
    fontFamily: "'Caviar Dreams', 'Century Gothic', sans-serif",
    fontSize: 14,
    color: '#9a3412',
    fontWeight: '700',
  },
});
