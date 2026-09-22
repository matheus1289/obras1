/**
 * Table Module — ObraControl
 * Renders the filterable expense list table
 */
const Table = (() => {

  const CAT = {
    'mao-de-obra': { label: 'Mão de Obra',   icon: 'fa-person-digging',     color: '#3b82f6' },
    'material':    { label: 'Material',       icon: 'fa-bricks',             color: '#8b5cf6' },
    'ferramentas': { label: 'Ferramentas',    icon: 'fa-screwdriver-wrench', color: '#f97316' },
    'servicos':    { label: 'Serviços',       icon: 'fa-truck',              color: '#10b981' },
    'outros':      { label: 'Outros',         icon: 'fa-box',                color: '#64748b' }
  };

  // ── Helpers ────────────────────────────────────────
  function escapeHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str || ''));
    return d.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  function formatCurrency(val) {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ── Filters ────────────────────────────────────────
  function getFilters() {
    return {
      category: document.getElementById('filterCategory').value,
      dateFrom: document.getElementById('filterDateFrom').value,
      dateTo:   document.getElementById('filterDateTo').value
    };
  }

  function applyFilters(expenses, f) {
    return expenses.filter(e => {
      if (f.category && e.category !== f.category) return false;
      if (f.dateFrom && e.date < f.dateFrom)       return false;
      if (f.dateTo   && e.date > f.dateTo)         return false;
      return true;
    });
  }

  // ── Render ─────────────────────────────────────────
  function render() {
    const expenses = Storage.getExpenses();
    const filtered = applyFilters(expenses, getFilters());

    const $tbody   = document.getElementById('expenseTableBody');
    const $empty   = document.getElementById('emptyTable');
    const $table   = document.getElementById('expenseTable');
    const $count   = document.getElementById('tableCount');
    const $total   = document.getElementById('tableTotal');

    if (!$tbody) return;

    if (filtered.length === 0) {
      $tbody.innerHTML  = '';
      $table.style.display = 'none';
      $empty.style.display = '';
    } else {
      $table.style.display = '';
      $empty.style.display = 'none';

      $tbody.innerHTML = filtered.map(e => {
        const cat = CAT[e.category] || CAT['outros'];
        return `
          <tr>
            <td class="date-cell">${formatDate(e.date)}</td>
            <td>
              <span class="cat-badge" style="
                --clr:${cat.color};
                background:${cat.color}1a;
                border:1px solid ${cat.color}33">
                <i class="fa-solid ${cat.icon}"></i>
                ${cat.label}
              </span>
            </td>
            <td>${escapeHtml(e.description)}</td>
            <td class="responsible-cell">${escapeHtml(e.responsible) || '—'}</td>
            <td class="value-cell">${formatCurrency(e.value)}</td>
            <td>
              <div class="actions-cell">
                <button class="action-btn action-btn--edit"
                  data-id="${e.id}" title="Editar" aria-label="Editar lançamento">
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="action-btn action-btn--delete"
                  data-id="${e.id}" title="Excluir" aria-label="Excluir lançamento">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>`;
      }).join('');
    }

    // Summary
    const total = filtered.reduce((s, e) => s + e.value, 0);
    if ($count) $count.textContent = `${filtered.length} registro${filtered.length !== 1 ? 's' : ''}`;
    if ($total) $total.textContent = formatCurrency(total);
  }

  // ── Actions ────────────────────────────────────────
  function handleEdit(id) {
    const e = Storage.getExpenses().find(e => e.id === id);
    if (e) Form.open(e);
  }

  function handleDelete(id) {
    App.showConfirm(
      'Excluir Lançamento',
      'Tem certeza? Este lançamento será apagado permanentemente.',
      () => {
        Storage.deleteExpense(id);
        render();
        Dashboard.render();
        App.showToast('Lançamento excluído!', 'error');
      }
    );
  }

  // ── Init ───────────────────────────────────────────
  function init() {
    // Table action buttons (delegated)
    document.getElementById('expenseTableBody').addEventListener('click', e => {
      const editBtn   = e.target.closest('.action-btn--edit');
      const deleteBtn = e.target.closest('.action-btn--delete');
      if (editBtn)   handleEdit(editBtn.dataset.id);
      if (deleteBtn) handleDelete(deleteBtn.dataset.id);
    });

    // Filter change listeners
    ['filterCategory', 'filterDateFrom', 'filterDateTo'].forEach(id => {
      document.getElementById(id).addEventListener('change', render);
    });

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', () => {
      document.getElementById('filterCategory').value = '';
      document.getElementById('filterDateFrom').value = '';
      document.getElementById('filterDateTo').value   = '';
      render();
    });
  }

  return { render, init };
})();
