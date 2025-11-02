
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LOGO_BASE64 } from '../constants';

type FormState = 'login' | 'register';

const LoginPage: React.FC = () => {
  const [formState, setFormState] = useState<FormState>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formState === 'login') {
      if (!login(email, password)) {
        setError('Email ou password incorretos.');
      }
    } else {
      if(!name || !email || !password) {
        setError('Por favor, preencha todos os campos.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As passwords não coincidem.');
        return;
      }
      if (!register(name, email, password)) {
        setError('Um utilizador com este email já existe.');
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-surface/80 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-surface-light animate-fade-in">
      <img src={LOGO_BASE64} alt="Digital Revolution Logo" className="w-48 mx-auto mb-6" />
      <h2 className="text-3xl font-extrabold text-center mb-2 text-highlight">
        Bem-vindo Treinador
      </h2>
      <p className="text-center text-gray-300 mb-6">Aceda à sua conta para começar a treinar.</p>
      
      <div className="flex justify-center mb-6 border-b border-surface-light">
        <button 
            onClick={() => { setFormState('login'); setError('')}} 
            className={`px-6 py-2 font-semibold transition-colors duration-200 ${formState === 'login' ? 'text-highlight border-b-2 border-highlight' : 'text-gray-400'}`}
        >
            Entrar
        </button>
        <button 
            onClick={() => { setFormState('register'); setError('')}}
            className={`px-6 py-2 font-semibold transition-colors duration-200 ${formState === 'register' ? 'text-highlight border-b-2 border-highlight' : 'text-gray-400'}`}
        >
            Registar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formState === 'register' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full bg-surface-light border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-main focus:outline-none focus:ring-highlight focus:border-highlight"
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full bg-surface-light border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-main focus:outline-none focus:ring-highlight focus:border-highlight"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            autoComplete={formState === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full bg-surface-light border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-main focus:outline-none focus:ring-highlight focus:border-highlight"
            required
          />
        </div>

        {formState === 'register' && (
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">Confirmar Password</label>
            <input
              type="password"
              id="confirm-password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full bg-surface-light border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-main focus:outline-none focus:ring-highlight focus:border-highlight"
              required
            />
          </div>
        )}
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-highlight hover:bg-highlight-dark text-background font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out mt-4"
        >
          {formState === 'login' ? 'Entrar' : 'Criar Conta'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;