import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { Client, Product } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Pdv() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clientId, setClientId] = useState('');
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [discount, setDiscount] = useState('0');
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  async function loadData() {
    try {
      const [c, p] = await Promise.all([api.get('/clients'), api.get('/products')]);
      setClients(c.data);
      setProducts(p.data);
    } catch {
      setMsg('Erro ao carregar dados de clientes e produtos.');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      p =>
        p.code.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
    );
  }, [products, search]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = products.find(x => x.id === item.productId);
        return sum + (product ? Number(product.price) * item.quantity : 0);
      }, 0),
    [items, products]
  );

  const discountPercent = Number(discount) || 0;
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const total = Number((subtotal - discountAmount).toFixed(2));
  const hasSaleData = !!clientId && items.length > 0;
  const maxDiscountAllowed = user?.role === 'MANAGER' ? 30 : 10;

  function add(id: string) {
    const p = products.find(x => x.id === id);
    if (!p || p.stock_quantity <= 0) return;

    setItems(prev => {
      const exists = prev.find(item => item.productId === id);
      if (exists) {
        if (exists.quantity >= p.stock_quantity) {
          setMsg(`Estoque máximo atingido para ${p.name} (${p.stock_quantity} un).`);
          return prev;
        }
        return prev.map(item => (item.productId === id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { productId: id, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(item => item.productId !== id));
  }

  async function checkout() {
    if (!clientId || items.length === 0) {
      setMsg('Selecione um cliente e pelo menos um produto antes de finalizar.');
      return;
    }

    try {
      const response = await api.post('/sales', {
        clientId,
        items,
        discountPercent: Number(discount),
      });
      setMsg(`✓ Venda registrada com sucesso! ID: ${response.data.sale.id.slice(0, 8)}... | Total: R$ ${Number(response.data.sale.total).toFixed(2)}`);
      setItems([]);
      setDiscount('0');
      // Recarrega produtos para refletir a baixa de estoque em tempo real
      loadData();
    } catch (e: any) {
      setMsg(e.response?.data?.message ?? 'Erro no checkout');
    }
  }

  return (
    <section>
      <h2>Frente de Caixa (PDV)</h2>
      <div className="pdv">
        <div>
          <label>
            Cliente
            <select value={clientId} onChange={e => setClientId(e.target.value)}>
              <option value="">Selecione o Cliente</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — CPF: {c.cpf}
                </option>
              ))}
            </select>
          </label>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 8px' }}>
            <h3 style={{ margin: 0 }}>Catálogo de Produtos</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {filteredProducts.length} itens encontrados
            </span>
          </div>

          <input
            placeholder="🔍 Buscar produto por código (ex: SG001), nome ou descrição..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', marginBottom: '14px' }}
          />

          <div className="product-grid">
            {filteredProducts.map(p => (
              <button
                type="button"
                key={p.id}
                disabled={!p.stock_quantity}
                onClick={() => add(p.id)}
                title={`Clique para adicionar ${p.name}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800 }}>
                    [{p.code}]
                  </span>
                  <span style={{ fontSize: '0.75rem', color: p.stock_quantity > 0 ? 'var(--success)' : '#ff6b6b' }}>
                    {p.stock_quantity > 0 ? `${p.stock_quantity} em estoque` : 'Esgotado'}
                  </span>
                </div>
                <span>{p.name}</span>
                <small>
                  R$ {Number(p.price).toFixed(2)} {p.size ? `· Tam: ${p.size}` : ''} {p.color ? `· ${p.color}` : ''}
                </small>
              </button>
            ))}
          </div>
        </div>

        <div className="cart">
          <h3>Carrinho da Venda</h3>
          {items.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
              Nenhum produto adicionado. Clique nos produtos ao lado para incluir na venda.
            </p>
          ) : (
            items.map(i => {
              const p = products.find(x => x.id === i.productId);
              if (!p) return null;
              return (
                <div className="line" key={i.productId} style={{ alignItems: 'center' }}>
                  <div>
                    <span style={{ display: 'block', fontWeight: 600 }}>
                      <span style={{ color: 'var(--primary)', fontSize: '0.8rem', marginRight: '4px' }}>[{p.code}]</span>
                      {p.name}
                    </span>
                    <small style={{ color: 'var(--muted)' }}>
                      {i.quantity} x R$ {Number(p.price).toFixed(2)}
                    </small>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <b>R$ {(Number(p.price) * i.quantity).toFixed(2)}</b>
                    <button
                      type="button"
                      onClick={() => removeItem(i.productId)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.75rem',
                        background: 'transparent',
                        border: '1px solid #ff7ecb',
                        color: '#ff7ecb',
                      }}
                      title="Remover item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <hr style={{ borderColor: 'var(--line)', margin: '14px 0' }} />

          <label>
            Desconto (%)
            <input
              type="number"
              min="0"
              max={maxDiscountAllowed}
              value={discount}
              onChange={e => setDiscount(e.target.value)}
            />
          </label>
          <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
            Alçada máxima autorizada para seu perfil ({user?.role === 'MANAGER' ? 'Gerente' : 'Caixa'}):{' '}
            <strong style={{ color: 'var(--primary)' }}>{maxDiscountAllowed}%</strong>
          </small>

          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0' }}>
            <span>Subtotal:</span>
            <b>R$ {subtotal.toFixed(2)}</b>
          </p>
          {discountPercent > 0 && (
            <p style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0', color: 'var(--accent)' }}>
              <span>Desconto ({discountPercent}%):</span>
              <b>- R$ {discountAmount.toFixed(2)}</b>
            </p>
          )}
          <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', margin: '12px 0' }}>
            <span>Total:</span>
            <b style={{ color: 'var(--success)' }}>R$ {total.toFixed(2)}</b>
          </p>

          <button
            type="button"
            className="checkout-button"
            onClick={checkout}
            disabled={!hasSaleData}
          >
            Finalizar Venda
          </button>
        </div>
      </div>
      {msg && (
        <p style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(124, 231, 255, 0.1)', border: '1px solid var(--primary)' }}>
          {msg}
        </p>
      )}
    </section>
  );
}
