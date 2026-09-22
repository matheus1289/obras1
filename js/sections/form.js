/**
 * Form Module — ObraControl
 * Handles the add/edit expense modal form
 */
const Form = (() => {
  let editingId = null;

  // ── Open ───────────────────────────────────────────
  function open(expense = null) {
    editingId = expense ? expense.id : null;

    const $overlay = document.getElementById('modalOverlay');
    const $title   = document.getElementById('modalTitle');
    const $form    = document.getElementById('expenseForm');

    if (expense) {
      $title.textContent = 'Editar Gasto';
      document.getElementById('expenseDate').value        = expense.date;
      document.getElementById('expenseCategory').value    = expense.category;
      document.getElementById('expenseDescription').value = expense.description;
      document.getElementById('expenseValue').value       = expense.value;
      document.getElementById('expenseResponsible').value = expense.responsible || '';
    } else {
      $title.textContent = 'Novo Gasto';
      $form.reset();
      // Default to today
      document.getElementById('expenseDate').value =
        new Date().toISOString().split('T')[0];
    }

    // Clear validation errors
    $form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

    $overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      const focus = expense
        ? document.getElementById('expenseDescription')
        : document.getElementById('expenseCategory');
      if (focus) focus.focus();
    }, 320);
  }

  // ── Close ──────────────────────────────────────────
  function close() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    editingId = null;
  }

  // ── Validate ───────────────────────────────────────
  function validate() {
    const rules = [
      { id: 'expenseDate',        ok: v => v !== '' },
      { id: 'expenseCategory',    ok: v => v !== '' },
      { id: 'expenseDescription', ok: v => v.trim() !== '' },
      { id: 'expenseValue',       ok: v => v !== '' && parseFloat(v) > 0 }
    ];

    let valid = true;
    rules.forEach(r => {
      const el = document.getElementById(r.id);
      const passes = r.ok(el.value);
      el.classList.toggle('error', !passes);
      if (!passes) valid = false;
    });
    return valid;
  }

  // ── Submit ─────────────────────────────────────────
  function submit(e) {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      date:        document.getElementById('expenseDate').value,
      category:    document.getElementById('expenseCategory').value,
      description: document.getElementById('expenseDescription').value.trim(),
      value:       document.getElementById('expenseValue').value,
      responsible: document.getElementById('expenseResponsible').value.trim()
    };

    if (editingId) {
      Storage.updateExpense(editingId, data);
      App.showToast('Gasto atualizado com sucesso!', 'success');
    } else {
      Storage.addExpense(data);
      App.showToast('Gasto adicionado com sucesso!', 'success');
    }

    close();
    Dashboard.render();
    Table.render();
  }

  // ── Init ───────────────────────────────────────────
  function init() {
    document.getElementById('expenseForm').addEventListener('submit', submit);
    document.getElementById('modalClose').addEventListener('click', close);
    document.getElementById('cancelBtn').addEventListener('click', close);

    // Close on backdrop click
    document.getElementById('modalOverlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) close();
    });

    // Clear error on input
    document.querySelectorAll('#expenseForm .form-input').forEach(el => {
      el.addEventListener('input', () => el.classList.remove('error'));
      el.addEventListener('change', () => el.classList.remove('error'));
    });
  }

  return { open, close, init };
})();
