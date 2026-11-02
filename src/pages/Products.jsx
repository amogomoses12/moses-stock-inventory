import React, { useEffect, useMemo, useState } from 'react';

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  ImagePlus,
  X,
  Filter
} from 'lucide-react';

import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Modal from '../components/Modal';

// Default Product Form
const blank = {
  name: '',
  sku: '',
  category: 'Electronics',
  price: '',
  cost: '',
  quantity: '',
  image: ''
};

// Currency Formatter
const money = n => `₦${Number(n || 0).toLocaleString('en-NG')}`;

// Products Component
export default function Products() {

  // Store and Navigation
  const {
    products,
    setProducts,
    categories,
    settings,
    addActivity
  } = useStore();

  const [params, setParams] = useSearchParams();

  // State Management
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');

  // Open New Product Modal from URL
  useEffect(() => {
    if (params.get('new') === '1') {
      openNew();
      setParams({});
    }
  }, [params]);

  // Filter Products
  const filtered = useMemo(
    () =>
      products.filter(
        p =>
          (
            filter === 'All' ||
            (
              filter === 'Low stock'
                ? p.quantity <= settings.lowStock
                : p.category === filter
            )
          ) &&
          `${p.name} ${p.sku} ${p.category}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [products, filter, query, settings.lowStock]
  );

  // Open New Product Form
  function openNew() {
    setEditing(null);

    setForm({
      ...blank,
      category: categories[0]?.name || 'Uncategorised'
    });

    setError('');
    setModal(true);
  }

  // Open Existing Product for Editing
  function openEdit(p) {
    setEditing(p);
    setForm({ ...p });
    setError('');
    setModal(true);
  }

  // Save Product
  function save(e) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.sku.trim() ||
      Number(form.price) < 0 ||
      Number(form.quantity) < 0
    ) {
      setError(
        'Complete the required fields with valid numbers.'
      );
      return;
    }

    // Update Existing Product
    if (editing) {
      setProducts(prev =>
        prev.map(p =>
          p.id === editing.id
            ? {
                ...form,
                price: Number(form.price),
                cost: Number(form.cost),
                quantity: Number(form.quantity)
              }
            : p
        )
      );

      addActivity(`${form.name} product details updated`);
    }

    // Add New Product
    else {
      setProducts(prev => [
        {
          ...form,
          id: Date.now(),
          price: Number(form.price),
          cost: Number(form.cost),
          quantity: Number(form.quantity),
          image:
            form.image ||
            `https://placehold.co/100x100/ece9ff/6958e8?text=${encodeURIComponent(
              form.name.slice(0, 1)
            )}`
        },
        ...prev
      ]);

      addActivity(`${form.name} added to products`);
    }

    setModal(false);
  }

  // Delete Product
  function remove(p) {
    if (
      window.confirm(
        `Delete "${p.name}"? This action cannot be undone.`
      )
    ) {
      setProducts(prev =>
        prev.filter(x => x.id !== p.id)
      );

      addActivity(`${p.name} deleted`, 'warning');
    }
  }

  return (
    <div>

      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">INVENTORY</span>

          <h1>Products</h1>

          <p>
            Manage, track and organise all the products in your store.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openNew}
        >
          <Plus size={17} />
          Add product
        </button>
      </div>

      {/* Products Summary */}
      <div className="products-summary">
        <div>
          <span>Total products</span>
          <strong>{products.length}</strong>
        </div>

        <div>
          <span>Low stock items</span>

          <strong className="text-warning">
            {
              products.filter(
                p => p.quantity <= settings.lowStock
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Total units</span>

          <strong>
            {
              products
                .reduce(
                  (s, p) => s + Number(p.quantity),
                  0
                )
                .toLocaleString()
            }
          </strong>
        </div>
      </div>

      {/* Products Table */}
      <section className="panel table-panel">

        {/* Table Toolbar */}
        <div className="table-toolbar">

          {/* Search Input */}
          <div className="table-search">
            <Search size={17} />

            <input
              placeholder="Search products or SKU..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="toolbar-filters">
            <Filter size={16} />

            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Low stock</option>

              {categories.map(c => (
                <option key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-scroll">
          <table className="data-table">

            {/* Table Header */}
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>

                  {/* Product Details */}
                  <td>
                    <div className="product-cell">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={e => {
                          e.currentTarget.src =
                            'https://placehold.co/80x80?text=Item';
                        }}
                      />

                      <strong>{p.name}</strong>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="sku-cell">
                    {p.sku}
                  </td>

                  {/* Category */}
                  <td>{p.category}</td>

                  {/* Price */}
                  <td className="price-cell">
                    {money(p.price)}
                  </td>

                  {/* Quantity */}
                  <td>{p.quantity}</td>

                  {/* Stock Status */}
                  <td>
                    <span
                      className={`status-badge ${
                        p.quantity <= settings.lowStock
                          ? 'status-low'
                          : 'status-good'
                      }`}
                    >
                      <i />

                      {
                        p.quantity <= settings.lowStock
                          ? 'Low stock'
                          : 'In stock'
                      }
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td>
                    <div className="row-actions">

                      {/* Edit Product */}
                      <button
                        className="icon-btn edit-btn"
                        title="Edit product"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete Product */}
                      <button
                        className="icon-btn delete-btn"
                        title="Delete product"
                        onClick={() => remove(p)}
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <Package size={30} />

                      <strong>No products found</strong>

                      <span>
                        Try another search or add a new product.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="table-footer">
          Showing <strong>{filtered.length}</strong> of{' '}
          <strong>{products.length}</strong> products
        </div>
      </section>

      {/* Add / Edit Product Modal */}
      {modal && (
        <Modal
          title={editing ? 'Edit product' : 'Add new product'}
          onClose={() => setModal(false)}
        >
          <form
            className="modal-form"
            onSubmit={save}
          >

            {/* Error Message */}
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {/* Product Form Fields */}
            <div className="form-grid">

              {/* Product Name */}
              <div className="field full">
                <label>Product name *</label>

                <input
                  value={form.name}
                  onChange={e =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                  required
                  placeholder="e.g. Wireless headphones"
                />
              </div>

              {/* SKU */}
              <div className="field">
                <label>SKU *</label>

                <input
                  value={form.sku}
                  onChange={e =>
                    setForm({
                      ...form,
                      sku: e.target.value
                    })
                  }
                  required
                  placeholder="e.g. ELEC-004"
                />
              </div>

              {/* Category */}
              <div className="field">
                <label>Category</label>

                <select
                  value={form.category}
                  onChange={e =>
                    setForm({
                      ...form,
                      category: e.target.value
                    })
                  }
                >
                  {categories.map(c => (
                    <option key={c.id}>
                      {c.name}
                    </option>
                  ))}

                  {categories.length === 0 && (
                    <option>Uncategorised</option>
                  )}
                </select>
              </div>

              {/* Selling Price */}
              <div className="field">
                <label>Selling price (₦) *</label>

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={e =>
                    setForm({
                      ...form,
                      price: e.target.value
                    })
                  }
                  required
                />
              </div>

              {/* Cost Price */}
              <div className="field">
                <label>Cost price (₦)</label>

                <input
                  type="number"
                  min="0"
                  value={form.cost}
                  onChange={e =>
                    setForm({
                      ...form,
                      cost: e.target.value
                    })
                  }
                />
              </div>

              {/* Quantity */}
              <div className="field">
                <label>Quantity *</label>

                <input
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={e =>
                    setForm({
                      ...form,
                      quantity: e.target.value
                    })
                  }
                  required
                />
              </div>

              {/* Image URL */}
              <div className="field">
                <label>Image URL</label>

                <input
                  value={form.image}
                  onChange={e =>
                    setForm({
                      ...form,
                      image: e.target.value
                    })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                {editing ? 'Save changes' : 'Add product'}
              </button>
            </div>

          </form>
        </Modal>
      )}
    </div>
  );
}