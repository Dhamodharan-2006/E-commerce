import { useTheme } from './ThemeContext';

export function useDarkStyle() {
  const { darkMode } = useTheme();

  const card = {
    background: darkMode ? '#1e293b' : 'white',
    border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
    color: darkMode ? '#f1f5f9' : '#1f2937',
  };

  const page = {
    background: darkMode ? '#0f172a' : '#f9fafb',
    color: darkMode ? '#f1f5f9' : '#1f2937',
    minHeight: '100vh',
    padding: 24,
  };

  const input = {
    background: darkMode ? '#1e293b' : 'white',
    border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
    color: darkMode ? '#f1f5f9' : '#1f2937',
    padding: 10,
    borderRadius: 6,
    width: '100%',
  };

  const label = {
    fontSize: 13,
    color: darkMode ? '#94a3b8' : '#6b7280',
  };

  const text = {
    color: darkMode ? '#f1f5f9' : '#1f2937',
  };

  const subText = {
    color: darkMode ? '#94a3b8' : '#6b7280',
  };

  const tableHead = {
    background: darkMode ? '#1e293b' : '#f9fafb',
    color: darkMode ? '#f1f5f9' : '#1f2937',
  };

  const tableRow = {
    borderBottom: `1px solid ${darkMode ? '#334155' : '#f3f4f6'}`,
    color: darkMode ? '#f1f5f9' : '#1f2937',
  };

  return { darkMode, card, page, input, label, text, subText, tableHead, tableRow };
}