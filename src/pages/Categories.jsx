import React, { useState } from 'react';
import {
  Plus,
  Tags,
  Pencil,
  Trash2,
  Package
} from 'lucide-react';

import { useStore } from '../context/StoreContext';
import Modal from '../components/Modal';

export default function Categories() {
  const {
    categories,
    setCategories,
    products,
    addActivity
  } = useStore();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  const [error, setError] = useState('');

  // Open modal for creating or editing a category
  const open = (c) => {
    setEditing(c || null);

    setForm(
      c
        ? {
            name: c.name,
            description: c.description
          }
        : {
            name: '',
            description: ''
          }
    );

    setError('');
    setModal(true);
  };

  // Save category
  const save = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError('Category name is required.');
      return;
    }

    if (
      categories.some(
        (c) =>
          c.name.toLowerCase() === form.name.trim().toLowerCase() &&
          c.id !== editing?.id
      )
    ) {
      setError('This category already exists.');
      return;
    }

    if (editing) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? { ...c, ...form }
            : c
        )
      );

      addActivity(`${form.name} category updated`, 'category');
    } else {
      setCategories((prev) => [
        ...prev,
        {
          ...form,
          id: Date.now()
        }
      ]);

      addActivity(`${form.name} category created`, 'category');
    }

    setModal(false);
  };

  // Delete category
  const remove = (c) => {
    const count = products.filter(
      (p) => p.category === c.name
    ).length;

    if (count) {
      alert(
        `Cannot delete this category because ${count} product(s) use it. Reassign those products first.`
      );
      return;
    }

    if (confirm(`Delete category "${c.name}"?`)) {
      setCategories((prev) =>
        prev.filter((x) => x.id !== c.id)
      );

      addActivity(`${c.name} category deleted`, 'warning');
    }
  };

  // Category colours
  const palette = [
    '#eeeaff',
    '#e7f3ff',
    '#e5f8ef',
    '#fff3df',
    '#ffeaf0',
    '#e9f5f5'
  ];

  return (
    <div>
      {/* Page heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">ORGANISATION</span>

          <h1>Categories</h1>

          <p>
            Group your products into clear, easy-to-manage collections.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => open()}
        >
          <Plus size={17} />
          Add category
        </button>
      </div>

      {/* Category summary */}
      <div className="category-summary">
        <div className="category-summary-icon">
          <Tags size={21} />
        </div>

        <div>
          <span>All categories</span>
          <strong>{categories.length}</strong>
        </div>

        <div className="category-summary-note">
          Your product catalogue is organised into {categories.length} groups.
        </div>
      </div>

      {/* Category cards */}
      <div className="category-grid">
        {categories.map((c, i) => {
          const count = products.filter(
            (p) => p.category === c.name
          ).length;

          return (
            <article className="category-card" key={c.id}>
              <div className="category-card-top">
                <div
                  className="category-icon"
                  style={{
                    background: palette[i % palette.length]
                  }}
                >
                  <Tags size={21} />
                </div>

                <div className="row-actions">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => open(c)}
                    title="Edit category"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="icon-btn delete-btn"
                    onClick={() => remove(c)}
                    title="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3>{c.name}</h3>

              <p>
                {c.description || 'No description added yet.'}
              </p>

              <div className="category-card-foot">
                <span>
                  <Package size={15} />
                  {count} product{count !== 1 ? 's' : ''}
                </span>

                <span className="category-arrow">↗</span>
              </div>
            </article>
          );
        })}

        {/* Empty state */}
        {categories.length === 0 && (
          <div className="empty-state panel">
            <Tags size={30} />

            <strong>No categories yet</strong>

            <span>
              Create a category to organise your products.
            </span>
          </div>
        )}
      </div>

      {/* Create/Edit category modal */}
      {modal && (
        <Modal
          title={editing ? 'Edit category' : 'Create category'}
          onClose={() => setModal(false)}
        >
          <form
            className="modal-form"
            onSubmit={save}
          >
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <div className="field">
              <label>Category name *</label>

              <input
                autoFocus
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                placeholder="e.g. Electronics"
                required
              />
            </div>

            <div className="field">
              <label>Description</label>

              <textarea
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
                placeholder="What kind of products belong here?"
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>

              <button className="btn btn-primary">
                {editing ? 'Save changes' : 'Create category'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}