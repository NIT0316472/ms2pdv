import {FormEvent,useEffect,useState} from 'react';
import {api} from '../services/api';
import {Product} from '../types';
import {useAuth} from '../context/AuthContext';
import {generateRandomCode} from '../utils/codeGenerator';
import { getProductImage } from '../data/productImages';

const genderOptions = ['MASCULINO', 'FEMININO', 'UNISSEX'];
const sizeOptions = ['PP', 'P', 'M', 'G', 'GG', '34', '36', '38', '40', '42', '44', '46', '48', '50', 'Único', 'Personalizado'];
const colorOptions = ['Preto', 'Branco', 'Azul', 'Vermelho', 'Personalizada'];

export default function Products(){
  const { user } = useAuth();
  const [data, setData] = useState<Product[]>([]);
  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    size: '',
    sizeCustom: '',
    color: '',
    colorCustom: '',
    gender: '',
    price: '',
    stockQuantity: '',
  });
  const [msg, setMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ price: '', stockQuantity: '' });

  async function load() {
    setData((await api.get('/products')).data);
  }

  useEffect(() => { load(); }, []);

  async function handleGenerateCode() {
    try {
      const res = await api.get('/products/generate-code');
      if (res.data?.code) {
        setForm(prev => ({ ...prev, code: res.data.code }));
        setMsg(`Código gerado: ${res.data.code}`);
        return;
      }
    } catch {
      // Fallback local se a API estiver em modo offline
    }
    const localCode = generateRandomCode(3, 3);
    setForm(prev => ({ ...prev, code: localCode }));
    setMsg(`Código gerado localmente: ${localCode}`);
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        size: form.size === 'Personalizado' ? form.sizeCustom : form.size || null,
        color: form.color === 'Personalizada' ? form.colorCustom : form.color || null,
        gender: form.gender || null,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
      };

      await api.post('/products', payload);
      setMsg('Produto cadastrado.');
      setForm({
        code: '',
        name: '',
        description: '',
        size: '',
        sizeCustom: '',
        color: '',
        colorCustom: '',
        gender: '',
        price: '',
        stockQuantity: '',
      });
      load();
    } catch (e: any) {
      setMsg(e.response?.data?.message ?? 'Erro');
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditValues({
      price: String(product.price),
      stockQuantity: String(product.stock_quantity),
    });
  }

  async function saveEdit(id: string) {
    try {
      await api.put(`/products/${id}`, {
        price: Number(editValues.price),
        stockQuantity: Number(editValues.stockQuantity),
      });
      setMsg('Preço e estoque atualizados.');
      setEditingId(null);
      load();
    } catch (e: any) {
      setMsg(e.response?.data?.message ?? 'Erro ao atualizar produto.');
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Deseja excluir este produto?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMsg('Produto removido.');
      load();
    } catch (e: any) {
      setMsg(e.response?.data?.message ?? 'Erro ao remover produto.');
    }
  }

  return (
    <section>
      <h2>Produtos</h2>
      <form className="form" onSubmit={add}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
          <input
            placeholder="Código (ex: CAM-001)"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
            style={{ textTransform: 'uppercase', minWidth: '260px' }}
          />
          <button
            type="button"
            onClick={handleGenerateCode}
            title="Gerar código aleatório no formato 3 letras e 3 números (XXX-000)"
            style={{ padding: '10px 16px', fontSize: '0.88rem' }}
          >
            🎲 Gerar Código Aleatório
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            (Padrão XXX-000. Deixe em branco para gerar automaticamente)
          </span>
        </div>
        <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

        <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value, sizeCustom: e.target.value === 'Personalizado' ? form.sizeCustom : '' })}>
          <option value="">Tamanho</option>
          {sizeOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {form.size === 'Personalizado' && (
          <input
            placeholder="Digite o tamanho personalizado"
            value={form.sizeCustom}
            onChange={e => setForm({ ...form, sizeCustom: e.target.value })}
          />
        )}

        <select value={form.color} onChange={e => setForm({ ...form, color: e.target.value, colorCustom: e.target.value === 'Personalizada' ? form.colorCustom : '' })}>
          <option value="">Cor</option>
          {colorOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {form.color === 'Personalizada' && (
          <input
            placeholder="Digite a cor personalizada"
            value={form.colorCustom}
            onChange={e => setForm({ ...form, colorCustom: e.target.value })}
          />
        )}

        <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
          <option value="">Sexo</option>
          {genderOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <input placeholder="Preço" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Estoque" type="number" min="0" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} />

        <button type="submit">Cadastrar</button>
      </form>
      <p>{msg}</p>
      <table>
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Código</th>
            <th>Produto</th>
            <th>Tamanho</th>
            <th>Cor</th>
            <th>Sexo</th>
            <th>Preço</th>
            <th>Estoque</th>
            {user?.role === 'MANAGER' && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p.id}>
              <td>
                <img
                  src={getProductImage(p.code, p.name)}
                  alt={p.name}
                  style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8 }}
                />
              </td>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>{p.size || '-'}</td>
              <td>{p.color || '-'}</td>
              <td>{p.gender || '-'}</td>
              <td>
                {editingId === p.id ? (
                  <input
                    value={editValues.price}
                    onChange={e => setEditValues({ ...editValues, price: e.target.value })}
                  />
                ) : (
                  `R$ ${Number(p.price).toFixed(2)}`
                )}
              </td>
              <td>
                {editingId === p.id ? (
                  <input
                    value={editValues.stockQuantity}
                    onChange={e => setEditValues({ ...editValues, stockQuantity: e.target.value })}
                  />
                ) : (
                  p.stock_quantity
                )}
              </td>
              {user?.role === 'MANAGER' && (
                <td>
                  {editingId === p.id ? (
                    <>
                      <button type="button" onClick={() => saveEdit(p.id)}>Salvar</button>
                      <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => startEdit(p)}>Editar</button>
                      <button type="button" onClick={() => remove(p.id)}>Excluir</button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
