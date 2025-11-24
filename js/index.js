// main.js — funcionalidades do site Detox Digital

// --- Helpers ---
// Atalho para selecionar 1 elemento
const $ = (sel, ctx = document) => ctx.querySelector(sel);
// Atalho para selecionar vários elementos e transformar em array
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
// Função para checar se um valor existe e não é vazio
function hasValue(v) { return v !== null && v !== undefined && String(v).trim() !== ''; }

// --- Menu hamburguer acessível ---
(function menuToggle() {
  // Seleciona o botão do menu e a barra de navegação
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-bar');
  if (!toggle || !nav) return;

  // Abre o menu
  function openNav() {
    nav.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true'); // acessibilidade
    document.body.style.overflow = 'hidden'; // impede scroll atrás do menu
  }

  // Fecha o menu
  function closeNav() {
    nav.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // volta scroll ao normal
  }

  // Alterna abrir/fechar
  function toggleNav() {
    if (nav.classList.contains('show')) closeNav();
    else openNav();
  }

  // Clique no botão abre/fecha
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleNav();
  });

  // Se clicou em um link dentro do menu → fecha
  nav.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'a') closeNav();
  });

  // Pressionar ESC fecha o menu
  document.addEventListener('keydown', (e) => { 
    if (e.key === 'Escape') closeNav(); 
  });

  // Se a tela ficar grande, fecha automaticamente
  window.addEventListener('resize', () => { 
    if (window.innerWidth > 430) closeNav(); 
  });

  // Acessibilidade do botão
  toggle.setAttribute('role', 'button');
  toggle.setAttribute('aria-label', 'Abrir menu');
  toggle.setAttribute('aria-expanded', 'false');
})();

// --- Destacar link ativo no menu ---
(function activeNavLink() {
  const links = $$('.nav-bar a');
  if (!links.length) return;

  // Pega o nome da página atual
  const path = location.pathname.split('/').pop() || 'index.html';

  // Marca o link correspondente
  links.forEach(a => {
    if (a.getAttribute('href') === path) {
      a.style.borderBottom = '2px solid #7181cb';
    }
  });
})();

// --- Smooth scroll (rolagem suave em links âncora) ---
(function smoothAnchors() {
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a'); // pega o link mais próximo
    if (!a) return;

    const href = a.getAttribute('href') || '';

    // Só funciona para links tipo "#alguma-coisa"
    if (href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault(); // evita salto instantâneo
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
})();

// --- Serializar formulário ---
// Transforma um formulário HTML em um objeto JS com os valores
function collectFormData(form) {
  const data = {};
  Array.from(form.elements).forEach(el => {
    if (!el.name) return; // ignora campos sem 'name'

    if (el.type === 'radio') { 
      if (el.checked) data[el.name] = el.value;
    }
    else if (el.type === 'checkbox') {
      if (!data[el.name]) data[el.name] = [];
      if (el.checked) data[el.name].push(el.value);
    }
    else if (el.tagName.toLowerCase() === 'select') {
      data[el.name] = el.value;
    }
    else if (el.type !== 'submit' && el.type !== 'button') {
      data[el.name] = el.value;
    }
  });
  return data;
}

// --- Pop-up bonito ---
function showPopup(title, message) {
  // Verifica se o modal já existe
  let modal = document.getElementById('dd-popup');

  // Se não existir, cria um novo
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dd-popup';

    // Estilo do fundo escuro
    Object.assign(modal.style, {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 10000
    });

    // Caixa branca do pop-up
    const box = document.createElement('div');
    box.id = 'dd-popup-box';
    Object.assign(box.style, {
      background: 'white', padding: '20px', borderRadius: '12px',
      maxWidth: '400px', width: '90%', textAlign: 'center',
      boxShadow: '0 8px 20px rgba(0,0,0,0.3)', transform: 'scale(0.8)',
      transition: 'transform 0.2s ease'
    });

    modal.appendChild(box);
    document.body.appendChild(modal);

    // Se clicar fora da caixa, fecha
    modal.addEventListener('click', (e) => { 
      if (e.target === modal) modal.remove(); 
    });
  }

  // Atualiza conteúdo da caixa
  const box = document.getElementById('dd-popup-box');
  box.innerHTML = `
    <h3 style="color:#7181cb; margin-bottom:12px">${title}</h3>
    <p style="margin-bottom:12px">${message}</p>
    <button id="close-popup" style="
      padding:8px 12px; background:#7181cb; color:white;
      border:none; border-radius:6px; cursor:pointer
    ">Fechar</button>
  `;

  // Animação
  box.style.transform = "scale(1)";

  // Botão fechar
  document.getElementById('close-popup')
    .addEventListener('click', () => modal.remove());
}

// --- Questionário dinâmico ---
(function handleQuestionario() {
  const form = document.getElementById('formulario');
  if (!form) return;

  // Quando o formulário for enviado
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = collectFormData(form);
    let feedback = [];

    // Avaliação do tempo de tela
    if (data.tempo === "mais de 6 horas") {
      feedback.push("⚠️ Você passa bastante tempo em telas. Tente reduzir para evitar cansaço mental.");
    } else if (data.tempo === "3 a 6 horas") {
      feedback.push("Seu tempo em telas é moderado, mas cuidado para não aumentar.");
    } else if (data.tempo) {
      feedback.push("✅ Ótimo! Seu tempo em telas está dentro de um limite saudável.");
    }

    // Impacto no sono
    if (data.impacto === "sim") {
      feedback.push("Evite telas antes de dormir, isso pode melhorar sua qualidade de sono.");
    } else if (data.impacto === "nao") {
      feedback.push("Muito bem! Continue mantendo bons hábitos de sono.");
    }

    // Controle de uso
    if (data.controle === "sim") {
      feedback.push("Parabéns por já controlar seu uso de telas.");
    } else if (data.controle === "nao") {
      feedback.push("Considere usar aplicativos de controle de tempo para ajudar na disciplina.");
    }

    // Mostra resultado
    showPopup("Resultado do Questionário", feedback.join("<br>"));
  });
})();

// --- Formulário de Bem-estar ---
(function handleBemestar() {
  const form = document.getElementById('formulario-bemestar');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = collectFormData(form);
    let feedback = [];

    if (data.pausas === "sim") {
      feedback.push("✅ Muito bom! Fazer pausas ajuda a manter a mente descansada.");
    } else if (data.pausas === "nao") {
      feedback.push("⚠️ Lembre-se de fazer pausas regulares, isso aumenta sua produtividade.");
    }

    if (data.foco === "menos de 30 minutos") {
      feedback.push("Tente usar a técnica Pomodoro para aumentar seu tempo de foco.");
    } else if (data.foco === "30 a 60 minutos") {
      feedback.push("Bom tempo de foco! Você pode tentar aumentar gradualmente.");
    } else if (data.foco === "mais de 1 hora") {
      feedback.push("Excelente foco! Só não esqueça das pausas para evitar sobrecarga.");
    }

    if (Array.isArray(data.atividades) && data.atividades.length > 0) {
      feedback.push("Ótimo que você pratica: " + data.atividades.join(", ") + ".");
    } else {
      feedback.push("⚠️ Considere incluir atividades de relaxamento no seu dia a dia.");
    }

    if (data.sono === "sim") {
      feedback.push("✅ Perfeito! Evitar telas antes de dormir melhora muito o sono.");
    } else if (data.sono === "nao") {
      feedback.push("⚠️ Experimente reduzir o uso de telas antes de dormir para ter noites mais tranquilas.");
    }

    showPopup("Resultado - Bem-estar", feedback.join("<br>"));
  });
})();

// --- Botão Dica Extra ---
(function extraTip() {
  const btn = document.getElementById('btn-dica');
  if (!btn) return;

  const dicas = [
    "Faça pausas de 10 minutos a cada 50 minutos de estudo.",
    "Evite usar telas 1 hora antes de dormir para melhorar seu sono.",
    "Pratique alongamentos curtos para aliviar a tensão.",
    "Use a técnica Pomodoro para manter o foco.",
    "Beba bastante água enquanto estuda."
  ];

  btn.addEventListener('click', () => {
    const dica = dicas[Math.floor(Math.random() * dicas.length)];
    showPopup("💡 Dica Extra", dica);
  });
})();

// --- Pop-ups automáticos (mostram mensagens a cada 1 min) ---
(function autoPopups() {
  const mensagens = [
    "💡 Lembre-se: faça pausas curtas a cada 50 minutos de estudo.",
    "⚠️ Evite telas 1h antes de dormir para melhorar seu sono.",
    "✅ Beba água! Hidratação melhora a concentração.",
    "📴 Experimente um momento offline para descansar a mente.",
    "🧘 Alongue-se! Movimentar o corpo reduz o cansaço mental."
  ];

  let i = 0;

  // Exibe mensagens de 60 em 60 segundos
  setInterval(() => {
    showPopup("Dica Automática", mensagens[i]);
    i = (i + 1) % mensagens.length; // reinicia quando chega no fim
  }, 60000);
})();

// menu.js — alterna o menu quando clicar no botão
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navBar = document.querySelector('.nav-bar');

    if(menuToggle && navBar){
        menuToggle.addEventListener('click', () => {
            navBar.classList.toggle('show');
        });
    }
});




