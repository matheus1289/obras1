/**
 * Dashboard Module — ObraControl
 * Renders budget bar, stat cards, chart and recent list
 */
const Dashboard = (() => {

  const CATEGORIES = {
    'mao-de-obra': { label: 'Mão de Obra',   icon: 'fa-person-digging',     color: '#3b82f6' },
    'material':    { label: 'Material',       icon: 'fa-bricks',             color: '#8b5cf6' },
    'ferramentas': { label: 'Ferramentas',    icon: 'fa-screwdriver-wrench', color: '#f97316' },
    'servicos':    { label: 'Serviços',       icon: 'fa-truck',              color: '#10b981' },
    'outros':      { label: 'Outros',         icon: 'fa-box',                color: '#64748b' }
  };

  // ── Helpers ────────────────────────────────────────
  function formatCurrency(value) {
    return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function formatShort(value) {
    if (value >= 1_000_000) return 'R$' + (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000)     return 'R$' + (value / 1_000).toFixed(1) + 'k';
    return 'R$' + value.toFixed(0);
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str || ''));
    return d.innerHTML;
  }

  function getCategoryTotals(expenses) {
    const totals = {};
    Object.keys(CATEGORIES).forEach(k => totals[k] = 0);
    expenses.forEach(e => {
      if (totals[e.category] !== undefined) totals[e.category] += e.value;
      else totals['outros'] += e.value;
    });
    return totals;
  }

  // ── Budget Bar ─────────────────────────────────────
  function renderBudget(total, budget) {
    const $total     = document.getElementById('budgetTotal');
    const $spent     = document.getElementById('budgetSpent');
    const $remaining = document.getElementById('budgetRemaining');
    const $bar       = document.getElementById('budgetBar');
    const $pct       = document.getElementById('budgetPercent');

    if (!$total) return;

    if (budget > 0) {
      const pct = Math.min((total / budget) * 100, 100);
      $total.textContent     = formatCurrency(budget);
      $spent.textContent     = 'Gasto: ' + formatCurrency(total);
      $remaining.textContent = 'Restante: ' + formatCurrency(Math.max(budget - total, 0));
      $pct.textContent       = pct.toFixed(1) + '%';

      // Animate bar (defer so CSS transition triggers)
      requestAnimationFrame(() => {
        $bar.style.width = pct + '%';
        $bar.classList.toggle('danger', pct >= 90);
      });
    } else {
      $total.textContent     = 'Não definido';
      $spent.textContent     = 'Gasto: ' + formatCurrency(total);
      $remaining.textContent = '';
      $bar.style.width       = '0%';
      $pct.textContent       = '—';
    }
  }

  // ── Stat Cards ─────────────────────────────────────
  function renderCards(total, totals) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = formatCurrency(val);
    };
    set('totalGasto',       total);
    set('totalMaoDeObra',   totals['mao-de-obra']);
    set('totalMaterial',    totals['material']);
    set('totalFerramentas', totals['ferramentas']);
    set('totalServicos',    totals['servicos']);
    set('totalOutros',      totals['outros']);

    const cats = [
      { key: 'mao-de-obra', pctId: 'pctMaoDeObra', barId: 'barMaoDeObra' },
      { key: 'material',    pctId: 'pctMaterial',    barId: 'barMaterial' },
      { key: 'ferramentas', pctId: 'pctFerramentas', barId: 'barFerramentas' },
      { key: 'servicos',    pctId: 'pctServicos',    barId: 'barServicos' },
      { key: 'outros',      pctId: 'pctOutros',      barId: 'barOutros' }
    ];

    cats.forEach(c => {
      const val = totals[c.key] || 0;
      const pct = total > 0 ? (val / total) * 100 : 0;
      const pctStr = pct > 0 && pct < 1 ? '<1%' : `${Math.round(pct)}%`;
      const $pct = document.getElementById(c.pctId);
      const $bar = document.getElementById(c.barId);
      if ($pct) $pct.textContent = pctStr;
      if ($bar) {
        requestAnimationFrame(() => {
          $bar.style.width = `${Math.min(pct, 100)}%`;
        });
      }
    });
  }

  // ── Mobile Carousel Dots Sync ──────────────────────
  let initializedCarousel = false;
  function initCarousel() {
    if (initializedCarousel) return;
    const grid = document.getElementById('cardsGrid');
    const dotsContainer = document.getElementById('carouselDots');
    if (!grid || !dotsContainer) return;

    const dots  = dotsContainer.querySelectorAll('.dot');
    const cards = grid.querySelectorAll('.stat-card');

    grid.addEventListener('scroll', () => {
      const scrollPos = grid.scrollLeft;
      const cardWidth = cards[0] ? cards[0].offsetWidth + 14 : 200;
      const index = Math.round(scrollPos / cardWidth);

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === Math.min(index, dots.length - 1));
      });
    }, { passive: true });

    dots.forEach((dot, i) => {
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => {
        if (cards[i]) {
          cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    });

    initializedCarousel = true;
  }

  // ── Chart ──────────────────────────────────────────
  function drawChart(canvas, totals) {
    const data = Object.keys(CATEGORIES).map(k => ({
      label: CATEGORIES[k].label,
      color: CATEGORIES[k].color,
      value: totals[k] || 0
    }));

    const ctx  = canvas.getContext('2d');
    const W    = canvas.parentElement.clientWidth || 520;
    const H    = 240;
    canvas.width  = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const pL = 70, pR = 16, pT = 30, pB = 52;
    const cW  = W - pL - pR;
    const cH  = H - pT - pB;
    const n   = data.length;
    const slotW = cW / n;
    const barW  = slotW * 0.52;

    // Grid lines + Y labels
    for (let i = 0; i <= 4; i++) {
      const y   = pT + (cH / 4) * i;
      const val = maxVal * (1 - i / 4);

      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(pL, y);
      ctx.lineTo(W - pR, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148,163,184,0.6)';
      ctx.font      = '10px "DM Sans",system-ui,sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatShort(val), pL - 6, y + 4);
    }

    // Bars
    data.forEach((cat, i) => {
      const barH = cat.value > 0 ? (cat.value / maxVal) * cH : 0;
      const x    = pL + slotW * i + (slotW - barW) / 2;
      const y    = pT + cH - barH;
      const cx   = x + barW / 2;

      if (barH > 1) {
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, cat.color);
        grad.addColorStop(1, cat.color + '44');
        ctx.fillStyle = grad;

        // Rounded top
        const r = Math.min(5, barH);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, y + barH);
        ctx.lineTo(x, y + barH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();

        // Value above bar
        ctx.fillStyle  = 'rgba(226,232,240,0.92)';
        ctx.font       = 'bold 10px "DM Sans",system-ui,sans-serif';
        ctx.textAlign  = 'center';
        ctx.fillText(formatShort(cat.value), cx, Math.max(y - 7, pT + 12));
      }

      // X label
      const shortLabel = cat.label.split(' ')[0];
      ctx.fillStyle = 'rgba(148,163,184,0.75)';
      ctx.font      = '11px "DM Sans",system-ui,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(shortLabel, cx, H - pB + 18);
    });
  }

  // ── Recent Expenses ────────────────────────────────
  function renderRecent(expenses) {
    const list  = document.getElementById('recentList');
    const empty = document.getElementById('emptyDashboard');
    if (!list) return;

    const recent = expenses.slice(0, 5);

    if (!recent.length) {
      if (empty) empty.style.display = '';
      list.querySelectorAll('.recent-item').forEach(el => el.remove());
      return;
    }

    if (empty) empty.style.display = 'none';

    list.innerHTML = recent.map(e => {
      const cat  = CATEGORIES[e.category] || CATEGORIES['outros'];
      const date = new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR');
      return `
        <div class="recent-item">
          <div class="recent-item__icon" style="
            --clr:${cat.color};
            background:${cat.color}1a;
            border:1px solid ${cat.color}33">
            <i class="fa-solid ${cat.icon}"></i>
          </div>
          <div class="recent-item__info">
            <div class="recent-item__desc">${escapeHtml(e.description)}</div>
            <div class="recent-item__meta">
              ${cat.label} · ${date}${e.responsible ? ' · ' + escapeHtml(e.responsible) : ''}
            </div>
          </div>
          <div class="recent-item__value">${formatCurrency(e.value)}</div>
        </div>`;
    }).join('');
  }

  // ── Config Stats ───────────────────────────────────
  function renderStats(expenses, total) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('statsCount', expenses.length);
    set('statsTotal', formatCurrency(total));
    if (expenses.length > 0) {
      set('statsMax', formatCurrency(Math.max(...expenses.map(e => e.value))));
      set('statsAvg', formatCurrency(total / expenses.length));
    } else {
      set('statsMax', formatCurrency(0));
      set('statsAvg', formatCurrency(0));
    }
  }

  // ── Date Label ─────────────────────────────────────
  function renderDate() {
    const el = document.getElementById('dashboardDate');
    if (!el) return;
    const str = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    el.textContent = str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ── Public: render ─────────────────────────────────
  function render() {
    const expenses = Storage.getExpenses();
    const budget   = Storage.getBudget();
    const totals   = getCategoryTotals(expenses);
    const total    = expenses.reduce((s, e) => s + e.value, 0);

    renderDate();
    renderBudget(total, budget);
    renderCards(total, totals);
    initCarousel();

    const canvas = document.getElementById('categoryChart');
    if (canvas) drawChart(canvas, totals);

    renderRecent(expenses);
    renderStats(expenses, total);
  }

  return { render, CATEGORIES, formatCurrency };
})();
