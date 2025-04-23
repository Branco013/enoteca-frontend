import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    axios.get('https://enoteca-backend.onrender.com/eventos')
      .then(res => setEventos(res.data))
      .catch(() => alert('Erro ao carregar eventos.'));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agenda de Eventos - Enoteca Decanter</h1>
      <Link to="/novo" className="bg-green-600 text-white px-4 py-2 rounded">Novo Evento</Link>

      <div className="mt-6 space-y-4">
        {eventos.length === 0 ? (
          <p className="text-gray-600">Nenhum evento cadastrado ainda.</p>
        ) : (
          eventos.map(evento => (
            <div key={evento.id} className={`border p-4 rounded shadow ${evento.status === 'CANCELADO' ? 'bg-gray-200 line-through' : ''}`}>
              <h2 className="text-lg font-semibold">{evento.cliente}</h2>
              <p><strong>Empresa:</strong> {evento.empresa}</p>
              <p><strong>Data:</strong> {new Date(evento.data_hora).toLocaleString()}</p>
              <p><strong>Local:</strong> {evento.local}</p>
              <p><strong>Status:</strong> {evento.status}</p>
              <p><strong>Menu:</strong> {evento.menu}</p>
              <Link to={`/evento/${evento.id}`} className="text-blue-600 mr-4">Ver Detalhes</Link>
              <Link to={`/evento/${evento.id}/editar`} className="text-yellow-600">Editar</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DetalhesEvento() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    axios.get(`https://enoteca-backend.onrender.com/eventos/${id}`)
      .then(res => setEvento(res.data))
      .catch(() => alert('Erro ao carregar detalhes.'));
  }, [id]);

  if (!evento) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Detalhes do Evento</h2>
      <p><strong>Cliente:</strong> {evento.cliente}</p>
      <p><strong>Empresa:</strong> {evento.empresa}</p>
      <p><strong>Data:</strong> {new Date(evento.data_hora).toLocaleString()}</p>
      <p><strong>Local:</strong> {evento.local}</p>
      <p><strong>Status:</strong> {evento.status}</p>
      <p><strong>Menu:</strong> {evento.menu}</p>
      <p><strong>Pacote de Bebidas:</strong> {evento.bebidas ? 'Sim' : 'Não'}</p>
      <p><strong>Valor por Pessoa:</strong> R$ {evento.valor_por_pessoa}</p>
      <p><strong>Nº de Pessoas:</strong> {evento.pessoas}</p>
      <p><strong>Observações:</strong> {evento.observacoes}</p>
      <div className="mt-6 flex gap-4">
        <Link to="/" className="text-blue-600 underline">← Voltar para Agenda</Link>
        <Link to={`/evento/${evento.id}/editar`} className="text-yellow-600 underline">Editar Evento</Link>
      </div>
    </div>
  );
}

function EditarEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    axios.get(`https://enoteca-backend.onrender.com/eventos/${id}`)
      .then(res => setForm(res.data))
      .catch(() => alert('Erro ao carregar evento.'));
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  }

  function handleMenuChange(e) {
    const menu = e.target.value;
    let precoBase = '';
    if (menu === 'MENU 1') precoBase = 199.90;
    else if (menu === 'MENU 2') precoBase = 229.90;
    else if (menu === 'MENU 3') precoBase = 255.90;
    else if (menu === 'MENU 4') precoBase = 299.90;
    else if (menu === 'MENU A DEFINIR') precoBase = '';
    setForm({ ...form, menu, valor_por_pessoa: precoBase });
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios.put(`https://enoteca-backend.onrender.com/eventos/${id}`, form)
      .then(() => {
        alert('Evento atualizado com sucesso!');
        navigate(`/evento/${id}`);
      })
      .catch(() => alert('Erro ao atualizar evento.'));
  }

  if (!form) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Editar Evento</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
        <input name="cliente" type="text" placeholder="Nome do Cliente" value={form.cliente} onChange={handleChange} className="border p-2 rounded" required />
        <input name="empresa" type="text" placeholder="Empresa" value={form.empresa} onChange={handleChange} className="border p-2 rounded" />
        <input name="data_hora" type="datetime-local" value={form.data_hora?.slice(0, 16)} onChange={handleChange} className="border p-2 rounded" required />
        <input name="pessoas" type="number" placeholder="Nº de Pessoas" value={form.pessoas} onChange={handleChange} className="border p-2 rounded" />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
          <option value="">Status</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="EM ANÁLISE">Em Análise</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <select name="local" value={form.local} onChange={handleChange} className="border p-2 rounded">
          <option value="">Local</option>
          <option value="SALA DE EVENTOS">Sala de Eventos</option>
          <option value="RESTAURANTE">Restaurante</option>
        </select>
        <select name="menu" value={form.menu} onChange={handleMenuChange} className="border p-2 rounded">
          <option value="">Menu</option>
          <option value="MENU 1">Menu 1</option>
          <option value="MENU 2">Menu 2</option>
          <option value="MENU 3">Menu 3</option>
          <option value="MENU 4">Menu 4</option>
          <option value="MENU A DEFINIR">Menu a Definir</option>
        </select>
        <input name="valor_por_pessoa" type="number" step="0.01" placeholder="Valor por Pessoa" value={form.valor_por_pessoa} onChange={handleChange} className="border p-2 rounded" />
        <label className="inline-flex items-center">
          <input type="checkbox" name="bebidas" checked={form.bebidas} onChange={handleChange} className="mr-2" />
          Incluir pacote de bebidas (+R$ 35,00 por pessoa)
        </label>
        <textarea name="observacoes" placeholder="Observações" value={form.observacoes} onChange={handleChange} className="border p-2 rounded"></textarea>
        <div className="flex gap-2">
          <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">Salvar Alterações</button>
          <Link to={`/evento/${id}`} className="bg-gray-300 text-black px-4 py-2 rounded">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novo" element={<NovoEvento />} />
        <Route path="/evento/:id" element={<DetalhesEvento />} />
        <Route path="/evento/:id/editar" element={<EditarEvento />} />
      </Routes>
    </Router>
  );
}
