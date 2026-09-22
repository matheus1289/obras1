/**
 * Storage Module — ObraControl
 * Handles all localStorage read/write operations
 */
const Storage = (() => {
  const EXPENSES_KEY = 'obracontrol_expenses';
  const BUDGET_KEY   = 'obracontrol_budget';

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  function getExpenses() {
    try {
      return JSON.parse(localStorage.getItem(EXPENSES_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveExpenses(expenses) {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }

  function addExpense(data) {
    const expenses = getExpenses();
    const expense = {
      id:          generateId(),
      date:        data.date,
      category:    data.category,
      description: data.description,
      value:       parseFloat(data.value),
      responsible: data.responsible || '',
      createdAt:   new Date().toISOString()
    };
    expenses.unshift(expense);
    saveExpenses(expenses);
    return expense;
  }

  function updateExpense(id, data) {
    const expenses = getExpenses();
    const idx = expenses.findIndex(e => e.id === id);
    if (idx === -1) return null;
    expenses[idx] = {
      ...expenses[idx],
      date:        data.date,
      category:    data.category,
      description: data.description,
      value:       parseFloat(data.value),
      responsible: data.responsible || '',
      updatedAt:   new Date().toISOString()
    };
    saveExpenses(expenses);
    return expenses[idx];
  }

  function deleteExpense(id) {
    saveExpenses(getExpenses().filter(e => e.id !== id));
  }

  function getBudget() {
    return parseFloat(localStorage.getItem(BUDGET_KEY)) || 0;
  }

  function setBudget(value) {
    localStorage.setItem(BUDGET_KEY, String(parseFloat(value)));
  }

  function clearAll() {
    localStorage.removeItem(EXPENSES_KEY);
    localStorage.removeItem(BUDGET_KEY);
  }

  return { getExpenses, addExpense, updateExpense, deleteExpense, getBudget, setBudget, clearAll };
})();
