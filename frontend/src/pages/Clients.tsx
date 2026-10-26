import { FormEvent, useEffect, useState } from 'react';
import { api } from '../services/api';
import { Client } from '../types';

export default function Clients() {
  const [data, setData] = useState<Client[]>([]);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  async function load() {
    try {
      const res = await api.get('/clients');
      setData(res.data);
    } catch {
      setMsg('Erro ao listar clientes.');
      setIsError(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function formatCpf(val: string) {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
  }

  function generateRandomCpf() {
    const randomDigits = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('');
    setCpf(formatCpf(randomDigits));
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    setIsError(false);
    const cleanedCpf = cpf.replace(/\D/g, '');

    if (cleanedCpf.length !== 11) {
      setIsError(true);
      setMsg('O CPF deve conter exatamente 11 dígitos numéricos.');
      return;
    }

    try {
      await api.post('/clients', {
        name,
        cpf: cleanedCpf,
        phone: phone || null,
        email: email || null,
      });
      setMsg(`✓ Cliente "${name}" cadastrado com sucesso.`);
      setName('');
      setCpf('');
      setPhone('');
      setEmail('');
      load();
    } catch (e: any) {
      setIsError(true);
      setMsg(e.response?.data?.message ?? 'Erro ao cadastrar cliente.');
    }
  }

  return (
    <section>
      <h2>Base de Clientes</h2>
      <form className="form" onSubmit={add}>
        <input
          placeholder="Nome completo do cliente"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ flex: 1, minWidth: '220px' }}
        />

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            placeholder="CPF (11 dígitos)"
            value={cpf}
            onChange={e => setCpf(formatCpf(e.target.value))}
            required
            maxLength={14}
            style={{ width: '170px' }}
          />
          <button
            type="button"
            onClick={generateRandomCpf}
            title="Gerar CPF fictício para teste na Live Demo"
            style={{ padding: '10px 14px', fontSize: '0.8rem' }}
          >
            🎲 Gerar CPF
          </button>
        </div>

        <input
          placeholder="Telefone (opcional)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ width: '160px' }}
        />

        <input
          placeholder="E-mail (opcional)"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />

        <button type="submit">Cadastrar Cliente</button>
      </form>

      {msg && (
        <p
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            background: isError ? 'rgba(255, 126, 126, 0.15)' : 'rgba(126, 247, 196, 0.15)',
            border: `1px solid ${isError ? '#ff7e7e' : 'var(--success)'}`,
            color: isError ? '#ff9999' : 'var(--success)',
          }}
        >
          {msg}
        </p>
      )}

      <div className="table-wrapper" style={{ marginTop: '20px' }}>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Data de Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{formatCpf(c.cpf)}</td>
                <td>{c.phone || '-'}</td>
                <td>{c.email || '-'}</td>
                <td>{new Date().toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
