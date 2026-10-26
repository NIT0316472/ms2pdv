import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('caixa@singularidade.local');
  const [password, setPassword] = useState('Caixa@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      nav('/');
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  }

  function setDemoAccount(type: 'CASHIER' | 'MANAGER') {
    if (type === 'MANAGER') {
      setEmail('gerente@singularidade.local');
      setPassword('Gerente@123');
    } else {
      setEmail('caixa@singularidade.local');
      setPassword('Caixa@123');
    }
  }

  return (
    <div className="login">
      <form onSubmit={submit}>
        <div className="login-brand">
          <span className="brand-mark">S</span>
          <div>
            <h1>Singularidade</h1>
            <p>Sistema de Gestão & PDV</p>
          </div>
        </div>

        <label style={{ display: 'grid', gap: '4px', fontSize: '0.85rem' }}>
          <span>E-mail</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="usuario@singularidade.local"
            required
          />
        </label>

        <label style={{ display: 'grid', gap: '4px', fontSize: '0.85rem' }}>
          <span>Senha</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha de acesso"
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar no Sistema'}
        </button>

        {error && <strong style={{ color: '#ff7ecb', fontSize: '0.85rem' }}>{error}</strong>}

        <div style={{ marginTop: '8px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
          <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
            Atalhos para demonstração técnica (Live Demo):
          </small>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setDemoAccount('CASHIER')}
              style={{
                flex: 1,
                padding: '6px',
                fontSize: '0.75rem',
                background: 'rgba(124, 231, 255, 0.1)',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
              }}
            >
              👤 Caixa (10% desc.)
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('MANAGER')}
              style={{
                flex: 1,
                padding: '6px',
                fontSize: '0.75rem',
                background: 'rgba(141, 125, 255, 0.1)',
                border: '1px solid var(--secondary)',
                color: 'var(--secondary)',
              }}
            >
              🛡️ Gerente (30% desc. + cancelamento)
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
