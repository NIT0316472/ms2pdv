import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <aside>
        <div className="brand">
          <span className="brand-mark">S</span>
          <div>
            <h1>Singularidade</h1>
            <p>Sistema de Gestão & PDV</p>
          </div>
        </div>

        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/pdv">Frente de Caixa</Link>
          <Link to="/clients">Clientes</Link>
          <Link to="/products">Produtos</Link>
        </nav>

        <div className="user">
          {user?.name}
          <br />
          <small>Perfil: {user?.role === 'MANAGER' ? 'Gerente' : 'Caixa'}</small>
          <button onClick={logout}>Sair</button>
        </div>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
