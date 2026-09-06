'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/app/admin/components/sidebar';
import TopNav from '@/app/admin/components/topnav';
import { Save, UploadCloud } from 'lucide-react';

export default function AdminConfig() {
  const [config, setConfig] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const configData = await fetch('/api/config');
        setConfig(await configData.json());
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'LogoURL' | 'FaviconURL') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fieldName === 'LogoURL') setIsUploadingLogo(true);
    if (fieldName === 'FaviconURL') setIsUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setConfig((prev: any) => ({ ...prev, [fieldName]: data.url }));
      } else {
        alert('Error al subir el archivo');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error de conexión al subir el archivo');
    } finally {
      if (fieldName === 'LogoURL') setIsUploadingLogo(false);
      if (fieldName === 'FaviconURL') setIsUploadingFavicon(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        alert('Configuración guardada exitosamente.');
      } else {
        alert('Error al guardar la configuración.');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error de conexión.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Configuración del Sistema (CMS)</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Administra la apariencia y datos globales de tu tienda.</p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">Cargando configuración...</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* General Settings */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">General y SEO</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Tienda</label>
                      <input 
                        type="text" 
                        name="StoreName"
                        value={config.StoreName || ''}
                        onChange={handleChange}
                        placeholder="Ej: Mi Tienda Online"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción (Meta Description)</label>
                      <input 
                        type="text" 
                        name="StoreDescription"
                        value={config.StoreDescription || ''}
                        onChange={handleChange}
                        placeholder="La mejor tienda de ropa del país..."
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Section Texts */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">Textos Principales (Hero)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título Principal (Línea 1)</label>
                      <input 
                        type="text" 
                        name="HeroTitle1"
                        value={config.HeroTitle1 || ''}
                        onChange={handleChange}
                        placeholder="Explora el nuevo"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título Resaltado (Línea 2)</label>
                      <input 
                        type="text" 
                        name="HeroTitle2"
                        value={config.HeroTitle2 || ''}
                        onChange={handleChange}
                        placeholder="Catálogo Premium"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtítulo (Descripción)</label>
                    <textarea 
                      name="HeroSubtitle"
                      value={config.HeroSubtitle || ''}
                      onChange={handleChange}
                      placeholder="Descubre nuestra selección de artículos..."
                      rows={2}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white resize-none"
                    />
                  </div>
                </div>

                {/* Appearance */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">Apariencia</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          name="LogoURL"
                          value={config.LogoURL || ''}
                          onChange={handleChange}
                          placeholder="/storage/logo.png"
                          className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                        />
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                          {isUploadingLogo ? (
                            <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <UploadCloud className="w-5 h-5" />
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'LogoURL')} disabled={isUploadingLogo} />
                        </label>
                      </div>
                      {config.LogoURL && <img src={config.LogoURL} alt="Logo preview" className="h-10 mt-2 object-contain bg-gray-100 dark:bg-gray-800 rounded-md p-1" />}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Favicon</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          name="FaviconURL"
                          value={config.FaviconURL || ''}
                          onChange={handleChange}
                          placeholder="/storage/favicon.ico"
                          className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                        />
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                          {isUploadingFavicon ? (
                            <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <UploadCloud className="w-5 h-5" />
                          )}
                          <input type="file" accept="image/x-icon,image/png" className="hidden" onChange={(e) => handleFileUpload(e, 'FaviconURL')} disabled={isUploadingFavicon} />
                        </label>
                      </div>
                      {config.FaviconURL && <img src={config.FaviconURL} alt="Favicon preview" className="h-6 mt-2 object-contain bg-gray-100 dark:bg-gray-800 rounded-md p-1" />}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Primario (HEX)</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          name="PrimaryColor"
                          value={config.PrimaryColor || '#4f46e5'}
                          onChange={handleChange}
                          className="h-10 w-16 p-1 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={config.PrimaryColor || '#4f46e5'}
                          readOnly
                          className="w-28 px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-mono dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Texto del Footer</label>
                    <textarea 
                      name="FooterText"
                      value={config.FooterText || ''}
                      onChange={handleChange}
                      placeholder="© 2026 Mi Tienda Online. Todos los derechos reservados."
                      rows={2}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white resize-none"
                    />
                  </div>
                </div>

                {/* Finance */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">Finanzas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        Tasa Dólar (Bs.) 
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Actualización automática</span>
                      </label>
                      <input 
                        type="number" 
                        step="0.0001"
                        name="TasaDolar"
                        value={config.TasaDolar || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                      <p className="text-xs text-gray-500">Puedes sobreescribir este valor manualmente, aunque se actualiza con la API oficial.</p>
                    </div>
                  </div>
                </div>

                {/* Contact & WhatsApp */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3">Contacto y WhatsApp</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Número de WhatsApp
                      </label>
                      <input 
                        type="text" 
                        name="WhatsAppNumber"
                        value={config.WhatsAppNumber || ''}
                        onChange={handleChange}
                        placeholder="Ej: 584121234567"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all dark:text-white"
                      />
                      <p className="text-xs text-gray-500">Formato internacional sin el signo +, ej: 58 (código país) + número.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje por Defecto</label>
                      <textarea 
                        name="WhatsAppMessage"
                        value={config.WhatsAppMessage || ''}
                        onChange={handleChange}
                        placeholder="Hola, quiero hacer el siguiente pedido:"
                        rows={2}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all dark:text-white resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow shadow-blue-600/20 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Guardar Configuración
                  </button>
                </div>

              </form>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
