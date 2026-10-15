const URL_BASE = 'http://localhost:3001/api';

export async function checarStatus() {
  try {
    const resposta = await fetch(`${URL_BASE}/status`);
    if (!resposta.ok) throw new Error('Erro ao consultar status');
    return await resposta.json();
  } catch (erro) {
    return { status: 'offline', temChaveConfigurada: false };
  }
}

export async function requisitarReceita(dados) {
  const resposta = await fetch(`${URL_BASE}/receitas/gerar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });

  const json = await resposta.json();
  if (!resposta.ok) {
    throw new Error(json.mensagem || 'Erro ao gerar receita.');
  }

  return json;
}
