import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sale, Product, Client } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [salesRes, prodRes, clientRes] = await Promise.all([
        api.get<Sale[]>('/sales'),
        api.get<Product[]>('/products'),
        api.get<Client[]>('/clients'),
      ]);
      setSales(salesRes.data);
      setProductsCount(prodRes.data.length);
      setClientsCount(clientRes.data.length);
    } catch {
      setMsg('Não foi possível carregar os dados recentes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function cancelSale(saleId: string) {
    if (!window.confirm('Tem certeza de que deseja cancelar esta venda? Esta ação é restrita a gerentes.')) {
      return;
    }

    try {
      await api.post(`/sales/${saleId}/cancel`);
      setMsg(`Venda ${saleId.slice(0, 8)}... cancelada com sucesso.`);
      loadDashboard();
    } catch (e: any) {
      setMsg(e.response?.data?.message ?? 'Erro ao cancelar a venda.');
    }
  }

  const completedSales = sales.filter(s => s.status === 'COMPLETED');
  const totalRevenue = completedSales.reduce((acc, s) => acc + Number(s.total), 0);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>
            Olá, {user?.name || (user?.role === 'MANAGER' ? 'Gerente' : 'Caixa')}
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)' }}>
            Perfil ativo: <b style={{ color: 'var(--primary)' }}>{user?.role === 'MANAGER' ? 'Gerente Geral' : 'Operador de Caixa'}</b>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/pdv" style={{ textDecoration: 'none' }}>
            <button type="button">🛒 Abrir PDV</button>
          </Link>
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <button type="button" style={{ background: 'linear-gradient(135deg, var(--secondary), var(--accent))' }}>
              🎲 Cadastrar Produto
            </button>
          </Link>
        </div>
      </div>

      <div className="cards">
        <article>
          <b>Catálogo de Produtos</b>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', margin: '8px 0' }}>
            {productsCount}
          </span>
          <span>Itens ativos cadastrados com código e estoque em tempo real.</span>
        </article>

        <article>
          <b>Base de Clientes</b>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', margin: '8px 0' }}>
            {clientsCount}
          </span>
          <span>Clientes cadastrados com validação de CPF único.</span>
        </article>

        <article>
          <b>Faturamento Realizado</b>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', margin: '8px 0' }}>
            R$ {totalRevenue.toFixed(2)}
          </span>
          <span>{completedSales.length} vendas concluídas registradas no sistema.</span>
        </article>
      </div>

      {msg && (
        <p style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(124, 231, 255, 0.1)', border: '1px solid var(--primary)' }}>
          {msg}
        </p>
      )}

      <div className="panel" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0 }}>Histórico Recente de Vendas</h3>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              Auditoria em tempo real das operações do PDV
            </span>
          </div>
          <button type="button" onClick={loadDashboard} disabled={loading} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            🔄 Atualizar
          </button>
        </div>

        {sales.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
            Nenhuma venda registrada até o momento. Acesse a Frente de Caixa para realizar a primeira venda.
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Cliente</th>
                  <th>Operador</th>
                  <th>Pagamento</th>
                  <th>Desconto</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => {
                  const paymentLabels: Record<string, string> = {
                    PIX: '📱 PIX',
                    DEBIT_CARD: '💳 Débito',
                    CREDIT_CARD: '💳 Crédito',
                  };
                  return (
                    <tr key={sale.id}>
                      <td>{new Date(sale.created_at).toLocaleString('pt-BR')}</td>
                      <td>{sale.client_name || 'Cliente'}</td>
                      <td>{sale.user_name || 'Operador'}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {paymentLabels[sale.payment_method] || sale.payment_method || 'PIX'}
                      </td>
                      <td>{Number(sale.discount_percent)}%</td>
                      <td style={{ fontWeight: 700, color: 'var(--text)' }}>
                        R$ {Number(sale.total).toFixed(2)}
                      </td>
                    <td>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: sale.status === 'COMPLETED' ? 'rgba(126, 247, 196, 0.15)' : 'rgba(255, 126, 126, 0.15)',
                          color: sale.status === 'COMPLETED' ? 'var(--success)' : '#ff7e7e',
                          border: `1px solid ${sale.status === 'COMPLETED' ? 'var(--success)' : '#ff7e7e'}`,
                        }}
                      >
                        {sale.status === 'COMPLETED' ? 'CONCLUÍDA' : 'CANCELADA'}
                      </span>
                    </td>
                    <td>
                      {user?.role === 'MANAGER' ? (
                        sale.status === 'COMPLETED' ? (
                          <button
                            type="button"
                            onClick={() => cancelSale(sale.id)}
                            style={{
                              padding: '5px 10px',
                              fontSize: '0.75rem',
                              background: 'transparent',
                              border: '1px solid #ff7e7e',
                              color: '#ff7e7e',
                            }}
                            title="Ação administrativa: Cancelar venda"
                          >
                            Cancelar Venda
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Cancelada</span>
                        )
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Exige Gerente</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
