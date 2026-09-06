'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/app/admin/components/sidebar';
import TopNav from '@/app/admin/components/topnav';
import ProductTable, { ProductoTabla } from '@/app/admin/components/product-table';
import ProductModal from '@/app/admin/components/product-modal';
import { Plus } from 'lucide-react';

export default function AdminProductos() {
  const [products, setProducts] = useState<ProductoTabla[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductoTabla | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products?all=true');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: ProductoTabla) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.ID !== id));
      } else {
        alert('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error de conexión');
    }
  };

  const handleSave = async (data: Partial<ProductoTabla>) => {
    setIsSaving(true);
    try {
      if (editingProduct) {
        // Update
        const response = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProduct.ID, ...data }),
        });
        
        if (response.ok) {
          await loadData();
          setIsModalOpen(false);
        } else {
          alert('Error al actualizar producto');
        }
      } else {
        // Create
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          await loadData();
          setIsModalOpen(false);
        } else {
          alert('Error al crear producto');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error de conexión');
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
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Catálogo de Productos</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestiona el inventario, precios y detalles de tus productos.</p>
              </div>
              <button 
                onClick={handleOpenNew}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                Añadir Producto
              </button>
            </div>

            {/* Content Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-1">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm">Cargando productos...</p>
                </div>
              ) : (
                <ProductTable 
                  products={products} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>

          </div>
        </main>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
        isLoading={isSaving}
      />
    </div>
  );
}
