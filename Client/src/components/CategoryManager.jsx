import { useState } from 'react';

const ICONS = ['📁', '🏠', '⚡', '🛒', '🍕', '🚗', '🏥', '📚', '👔', '🎉', '🧘', '💼', '💰', '✈️', '📦', '🎓', '💊', '🎬'];
const ITEM_ICONS = ['📦', '🏢', '📋', '🔧', '🧑‍🍳', '👕', '🛡️', '💡', '🚰', '🔥', '🌐', '📱', '🥦', '🍚', '🥛', '🥚', '🧹', '🧴', '🍽️', '🥐', '⛽', '🚕', '🔩', '🩺', '💊', '🩻', '🌿', '🎓', '📖', '👟', '💇', '💄', '🎁', '🥳', '🙏', '💪', '📎', '✈️', '📈', '💳', '📊', '🏦', '🏖️', '🎬', '🗺️', '❓'];

function CategoryManager({ headings, onAddHeading, onAddItem, onDeleteHeading, onDeleteItem, onClose }) {
  const [newHeading, setNewHeading] = useState('');
  const [newHeadingIcon, setNewHeadingIcon] = useState('📁');
  const [addingItemFor, setAddingItemFor] = useState(null);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemIcon, setNewItemIcon] = useState('📦');

  async function handleAddHeading() {
    if (!newHeading.trim()) return;
    await onAddHeading(newHeading.trim(), newHeadingIcon);
    setNewHeading('');
  }

  async function handleAddItem(headingId) {
    if (!newItemLabel.trim()) return;
    await onAddItem(headingId, newItemLabel.trim(), newItemIcon);
    setNewItemLabel('');
    setAddingItemFor(null);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Categories</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="cm-section">
            <h3>Add New Heading</h3>
            <div className="cm-row">
              <input
                className="form-input"
                placeholder="Heading title"
                value={newHeading}
                onChange={(e) => setNewHeading(e.target.value)}
              />
              <select className="form-input cm-icon-picker" value={newHeadingIcon} onChange={(e) => setNewHeadingIcon(e.target.value)}>
                {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <button className="btn btn-primary cm-btn" onClick={handleAddHeading}>Add</button>
            </div>
          </div>

          <div className="cm-section">
            <h3>Existing Headings</h3>
            {headings.length === 0 && <p className="cm-empty">No headings yet.</p>}
            {headings.map((h) => (
              <div key={h.headingId} className="cm-heading">
                <div className="cm-heading-top">
                  <span className="cm-h-icon">{h.icon}</span>
                  <span className="cm-h-title">{h.title}</span>
                  <button className="cm-del" onClick={() => onDeleteHeading(h.headingId)} title="Delete heading">🗑️</button>
                  <button className="cm-add-item-btn" onClick={() => setAddingItemFor(addingItemFor === h.headingId ? null : h.headingId)}>
                    + Item
                  </button>
                </div>
                {h.items.length > 0 && (
                  <div className="cm-items">
                    {h.items.map((item) => (
                      <div key={item.key} className="cm-item">
                        <span className="cm-i-icon">{item.icon}</span>
                        <span className="cm-i-label">{item.label}</span>
                        <button className="cm-del-sm" onClick={() => onDeleteItem(h.headingId, item.key)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {addingItemFor === h.headingId && (
                  <div className="cm-add-item">
                    <input
                      className="form-input"
                      placeholder="Item label"
                      value={newItemLabel}
                      onChange={(e) => setNewItemLabel(e.target.value)}
                      autoFocus
                    />
                    <select className="form-input cm-icon-picker-sm" value={newItemIcon} onChange={(e) => setNewItemIcon(e.target.value)}>
                      {ITEM_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                    <button className="btn btn-primary cm-btn-sm" onClick={() => handleAddItem(h.headingId)}>Add</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;
