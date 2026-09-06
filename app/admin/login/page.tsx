"use client";

import React from 'react';

export default function AdminLogin() {
  const [credentials, setCredentials] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    
    if (response.ok) {
      window.location.href = '/admin/dashboard';
    } else {
      setError(data.error || 'Credenciales inválidas');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 sm:py-24">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 sm:p-12 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Panel de Administración</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-1">Usuario</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white"
              required
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}