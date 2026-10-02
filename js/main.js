/**
 * App — ObraControl
 * Main orchestrator: navigation, toast, confirm, config, CSV export
 */
const App = (() => {

  let toastTimer    = null;
  let confirmAction = null;

  // ── Navigation ─────────────────────────────────────
  function navigateTo(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + sectionId).classList.add('active');

    // Desktop nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.section === sectionId)
    );

    // Mobile bottom nav buttons
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      if (btn.dataset.section) {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
      }
    });

    // Close mobile nav menu if open
    const $mainNav = document.getElementById('mainNav');
    if ($mainNav) $mainNav.classList.remove('open');

    // Refresh data for section
    if (sectionId === 'dashboard')      Dashboard.render();
    if (sectionId === 'lancamentos')    Table.render();
    if (sectionId === 'configuracoes')  syncConfig();

    // Entrance animation
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('#section-' + sectionId,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }
      );
    }
  }

  function syncConfig() {
    const budget = Storage.getBudget();
    const $input = document.getElementById('budgetInput');
    if (budget > 0 && $input) $input.value = budget;
    Dashboard.render(); // refresh stats
  }

  // ── Toast ──────────────────────────────────────────
  function showToast(message, type = 'success') {
    const $toast = document.getElementById('toast');
    const $icon  = document.getElementById('toastIcon');
    const $msg   = document.getElementById('toastMessage');

    const icons = {
      success: 'fa-circle-check',
      error:   'fa-circle-xmark',
      info:    'fa-circle-info'
    };

    $toast.className       = 'toast toast--' + type;
    $msg.textContent       = message;
    $icon.className        = 'fa-solid ' + (icons[type] || icons.success);

    $toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $toast.classList.remove('show'), 3200);
  }

  // ── Confirm dialog ─────────────────────────────────
  function showConfirm(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent   = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    confirmAction = onConfirm;
  }

  function closeConfirm() {
    document.getElementById('confirmOverlay').classList.remove('open');
    document.body.style.overflow = '';
    confirmAction = null;
  }

  // ── CSV Export ─────────────────────────────────────
  function exportCsv() {
    const expenses = Storage.getExpenses();
    if (!expenses.length) { showToast('Nenhum dado para exportar', 'info'); return; }

    const catMap = {
      'mao-de-obra': 'Mão de Obra',
      'material':    'Material de Construção',
      'ferramentas': 'Ferramentas / Equipamentos',
      'servicos':    'Serviços',
      'outros':      'Outros'
    };

    const headers = ['Data', 'Categoria', 'Descrição', 'Responsável', 'Valor (R$)'];
    const rows    = expenses.map(e => [
      e.date,
      catMap[e.category] || e.category,
      '"' + (e.description || '').replace(/"/g, '""') + '"',
      '"' + (e.responsible || '').replace(/"/g, '""') + '"',
      e.value.toFixed(2).replace('.', ',')
    ]);

    const csv  = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: 'obracontrol_' + new Date().toISOString().split('T')[0] + '.csv'
    });
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exportado com sucesso!', 'success');
  }

  // ── Init helpers ───────────────────────────────────
  function initNav() {
    document.querySelectorAll('.nav-btn, .mobile-nav-btn[data-section]').forEach(btn =>
      btn.addEventListener('click', () => navigateTo(btn.dataset.section))
    );
    const $toggle = document.getElementById('menuToggle');
    if ($toggle) {
      $toggle.addEventListener('click', () => {
        const $nav = document.getElementById('mainNav');
        if ($nav) $nav.classList.toggle('open');
      });
    }
    const $seeAll = document.getElementById('seeAllBtn');
    if ($seeAll) {
      $seeAll.addEventListener('click', () => navigateTo('lancamentos'));
    }
  }

  function initFAB() {
    const $fab = document.getElementById('fabBtn');
    if ($fab) $fab.addEventListener('click', () => Form.open());

    document.querySelectorAll('.open-form-btn').forEach(btn => {
      btn.addEventListener('click', () => Form.open());
    });
  }

  function initConfig() {
    document.getElementById('saveBudgetBtn').addEventListener('click', () => {
      const val = parseFloat(document.getElementById('budgetInput').value);
      if (!val || val <= 0) { showToast('Informe um valor válido!', 'error'); return; }
      Storage.setBudget(val);
      Dashboard.render();
      showToast('Orçamento salvo!', 'success');
    });

    document.getElementById('exportCsvBtn').addEventListener('click', exportCsv);

    document.getElementById('clearDataBtn').addEventListener('click', () =>
      showConfirm(
        'Limpar Todos os Dados',
        'Todos os lançamentos e configurações serão apagados permanentemente. Esta ação não pode ser desfeita!',
        () => {
          Storage.clearAll();
          Dashboard.render();
          Table.render();
          const $inp = document.getElementById('budgetInput');
          if ($inp) $inp.value = '';
          showToast('Todos os dados foram apagados.', 'error');
        }
      )
    );
  }

  function initConfirm() {
    document.getElementById('confirmOk').addEventListener('click', () => {
      if (confirmAction) confirmAction();
      closeConfirm();
    });
    document.getElementById('confirmCancel').addEventListener('click', closeConfirm);
    document.getElementById('confirmOverlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) closeConfirm();
    });
  }

  function initAnimations() {
    if (typeof gsap !== 'undefined') {
      // Header entrance
      gsap.from('.header', { y: -80, opacity: 0, duration: 0.65, ease: 'power3.out' });

      // FAB entrance
      gsap.from('.fab', { scale: 0, opacity: 0, duration: 0.55, delay: 0.5, ease: 'back.out(2.5)' });
    }

    // Dashboard elements via ScrollReveal
    if (typeof ScrollReveal !== 'undefined') {
      const sr = ScrollReveal({ distance: '20px', duration: 550, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', reset: false });
      sr.reveal('.budget-card',             { origin: 'top',    delay: 80  });
      sr.reveal('.cards-carousel-wrapper', { origin: 'bottom', delay: 120 });
      sr.reveal('.chart-card',              { origin: 'bottom', delay: 160 });
      sr.reveal('.recent-card',             { origin: 'bottom', delay: 200 });
    }
  }

  // ── Boot ───────────────────────────────────────────
  function init() {
    Form.init();
    Table.init();
    initNav();
    initFAB();
    initConfig();
    initConfirm();
    Dashboard.render();
    initAnimations();
  }

  return { init, showToast, showConfirm, navigateTo };
})();

// ── Start ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', App.init);
