import React, { useState, useEffect } from 'react';
import { X, Save, UploadCloud } from 'lucide-react';
import { ProductoTabla } from './product-table';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProductoTabla>) => void;
  product?: ProductoTabla | null;
  isLoading?: boolean;
}

export default function ProductModal({ isOpen, onClose, onSave, product, isLoading }: ProductModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductoTabla>>({
    Nombre: '',
    Descripcion: '',
    Precio_USD: 0,
    Imagen_URL: '',
    Categoria: '',
    Stock: 0,
    Alerta_Stock: 5,
    Estado: 'Activo'
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        Nombre: '',
        Descripcion: '',
        Precio_USD: 0,
        Imagen_URL: '',
        Categoria: '',
        Stock: 0,
        Alerta_Stock: 5,
        Estado: 'Activo'
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, Imagen_URL: data.url }));
      } else {
        alert('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error de conexión al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {product ? 'Editar Producto' : 'Añadir Nuevo Producto'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input 
                  type="text" 
                  name="Nombre" 
                  required
                  value={formData.Nombre || ''} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                  placeholder="Ej: Camiseta Básica"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                <input 
                  type="text" 
                  name="Categoria" 
                  value={formData.Categoria || ''} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                  placeholder="Ej: Ropa"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
              <textarea 
                name="Descripcion" 
                rows={3}
                value={formData.Descripcion || ''} 
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white resize-none"
                placeholder="Breve descripción del producto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Precio (USD)</label>
                <input 
                  type="number" 
                  name="Precio_USD" 
                  step="0.01"
                  required
                  value={formData.Precio_USD || ''} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-2 text-xs text-gray-500">Actual</span>
                    <input 
                      type="number" 
                      name="Stock" 
                      required
                      value={formData.Stock || ''} 
                      onChange={handleChange}
                      className="w-full pl-3 pr-3 pt-6 pb-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white leading-tight"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-2 text-xs text-orange-500">Alerta (Mín)</span>
                    <input 
                      type="number" 
                      name="Alerta_Stock" 
                      value={formData.Alerta_Stock || ''} 
                      onChange={handleChange}
                      className="w-full pl-3 pr-3 pt-6 pb-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:text-white leading-tight"
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Imagen del Producto</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="Imagen_URL" 
                  value={formData.Imagen_URL || ''} 
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shrink-0">
                  {isUploading ? (
                    <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <UploadCloud className="w-5 h-5" />
                  )}
                  <span className="hidden sm:inline text-sm font-medium">Subir</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
              {formData.Imagen_URL && (
                <div className="mt-2 relative inline-block">
                  <img src={formData.Imagen_URL} alt="Preview" className="h-16 rounded-md object-cover border border-gray-200 dark:border-gray-700" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
              <select 
                name="Estado" 
                value={formData.Estado || 'Activo'} 
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="productForm"
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {product ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>

      </div>
    </div>
  );
}
