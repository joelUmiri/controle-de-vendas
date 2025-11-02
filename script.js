const form = document.getElementById('entradaForm');
const tabelaBody = document.getElementById('tabelaBody');
const totalGeralEl = document.getElementById('totalGeral');
const mostrarBtn = document.getElementById('mostrarTabelaBtn');
const ocultarBtn = document.getElementById('ocultarTabelaBtn');
const tabelaContainer = document.getElementById('tabelaContainer');

let totalGeral = 0;
const registros = [];

// Carregar dados salvos com data real
if (localStorage.getItem('registros')) {
  const saved = JSON.parse(localStorage.getItem('registros'));
  saved.forEach(r => {
    const data = new Date(r.data); // Reconstrói a data real
    adicionarLinha(r.qtd, r.tipo, r.valor, r.observacao, data);
  });
}

// Mostrar/Ocultar tabela
mostrarBtn.addEventListener('click', () => {
  tabelaContainer.classList.add('visible');
  mostrarBtn.style.display = 'none';
});

ocultarBtn.addEventListener('click', () => {
  tabelaContainer.classList.remove('visible');
  setTimeout(() => {
    mostrarBtn.style.display = 'block';
  }, 300);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const qtd = parseInt(document.getElementById('quantidade').value);
  const tipo = document.getElementById('tipo').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const observacao = document.getElementById('observacao').value.trim();
  const data = new Date(); // DATA E HORA REAIS

  if (qtd < 1 || isNaN(valor) || valor < 0) {
    alert('Verifique quantidade e valor unitário.');
    return;
  }

  adicionarLinha(qtd, tipo, valor, observacao, data);

  // Salvar com data em ISO
  registros.push({ qtd, tipo, valor, observacao, data: data.toISOString() });
  localStorage.setItem('registros', JSON.stringify(registros));

  form.reset();
});

function adicionarLinha(qtd, tipo, valor, observacao, data) {
  const subtotal = qtd * valor;
  totalGeral += subtotal;

  const tr = document.createElement('tr');
  tr.dataset.subtotal = subtotal;

  const tipoFormatado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
  const subtotalFmt = subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  
  // Formatar data/hora
  const dataFmt = data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  tr.innerHTML = `
    <td style="text-align:center">${qtd}</td>
    <td>${tipoFormatado}</td>
    <td>${observacao || '—'}</td>
    <td>R$ ${subtotalFmt}</td>
    <td style="font-size:0.85rem; color:#aaa">${dataFmt}</td>
    <td class="acao">
      <button class="btn-excluir" onclick="excluirLinha(this, ${subtotal})">X</button>
    </td>
  `;

  tabelaBody.appendChild(tr);
  atualizarTotalGeral();
}

// Função global para excluir
function excluirLinha(botao, subtotal) {
  const tr = botao.closest('tr');
  const index = Array.from(tabelaBody.children).indexOf(tr);

  tr.style.transition = 'all 0.3s';
  tr.style.opacity = '0';
  tr.style.transform = 'translateX(-20px)';

  setTimeout(() => {
    tabelaBody.removeChild(tr);
    totalGeral -= subtotal;
    atualizarTotalGeral();

    // Remove do array e localStorage
    registros.splice(index, 1);
    localStorage.setItem('registros', JSON.stringify(registros));
  }, 300);
}

function atualizarTotalGeral() {
  totalGeralEl.textContent = `Total Geral: R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}