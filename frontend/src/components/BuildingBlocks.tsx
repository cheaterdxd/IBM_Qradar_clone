import React, { useState, useEffect } from 'react';
import { buildingBlocksAPI } from '../api/client';
import RuleEditor from './RuleEditor';
import '../styles/rule-editor.css';

const BuildingBlocks: React.FC = () => {
    const [buildingBlocks, setBuildingBlocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingBBId, setEditingBBId] = useState<string | undefined>();

    useEffect(() => {
        fetchBuildingBlocks();
    }, []);

    const fetchBuildingBlocks = async () => {
        try {
            const response = await buildingBlocksAPI.list();
            setBuildingBlocks(response.data);
        } catch (error) {
            console.error('Failed to fetch building blocks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingBBId(undefined);
        setShowEditor(true);
    };

    const handleEdit = (bbId: string) => {
        setEditingBBId(bbId);
        setShowEditor(true);
    };

    const handleDelete = async (bbId: string, bbName: string) => {
        if (!window.confirm(`Are you sure you want to delete "${bbName}"?`)) {
            return;
        }

        try {
            await buildingBlocksAPI.delete(bbId);
            fetchBuildingBlocks();
        } catch (error) {
            console.error('Failed to delete building block:', error);
            alert('Failed to delete building block');
        }
    };

    const handleSave = () => {
        fetchBuildingBlocks();
    };

    if (loading) {
        return <div className="loading">Loading building blocks...</div>;
    }

    return (
        <div className="content-section">
            <div className="section-header">
                <div>
                    <h2>🧩 Building Blocks</h2>
                    <p>Reusable detection components</p>
                </div>
                <button className="btn-create" onClick={handleCreate}>
                    + Create Building Block
                </button>
            </div>

            {buildingBlocks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🧩</div>
                    <h3>No Building Blocks Yet</h3>
                    <p>Create reusable detection components to use in your rules</p>
                    <button className="btn-primary" onClick={handleCreate}>
                        ✨ Create Your First Building Block
                    </button>
                </div>
            ) : (
                <div className="rules-grid">
                    {buildingBlocks.map((bb) => (
                        <div key={bb.id} className="rule-card">
                            <div className="rule-header">
                                <div className="rule-title">
                                    <h3>{bb.name}</h3>
                                </div>
                                <div className="rule-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleEdit(bb.id)}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(bb.id, bb.name)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {bb.description && (
                                <p className="rule-description">{bb.description}</p>
                            )}

                            <div className="rule-aql">
                                <code>{bb.aql}</code>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showEditor && (
                <BuildingBlockEditor
                    bbId={editingBBId}
                    onClose={() => setShowEditor(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

// Simplified Building Block Editor (similar to RuleEditor but without BB selection)
const BuildingBlockEditor: React.FC<{ bbId?: string; onClose: () => void; onSave: () => void }> = ({ bbId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        aql: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (bbId) {
            fetchBB();
        }
    }, [bbId]);

    const fetchBB = async () => {
        if (!bbId) return;
        try {
            setLoading(true);
            const response = await buildingBlocksAPI.get(bbId);
            setFormData({
                name: response.data.name,
                description: response.data.description || '',
                aql: response.data.aql
            });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load building block');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                ...formData,
                conditions: { type: 'comparison', field: 'eventName', operator: '=', value: 'test' }
            };

            if (bbId) {
                await buildingBlocksAPI.update(bbId, payload);
            } else {
                await buildingBlocksAPI.create(payload);
            }
            onSave();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save building block');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content rule-editor" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{bbId ? 'Edit Building Block' : 'Create Building Block'}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {error && <div className="error-banner">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="tab-content">
                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Failed Login Detection"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe this building block..."
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label>AQL Query *</label>
                            <textarea
                                value={formData.aql}
                                onChange={(e) => setFormData({ ...formData, aql: e.target.value })}
                                placeholder="Enter AQL query..."
                                rows={6}
                                className="aql-editor"
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? '⏳ Saving...' : bbId ? '💾 Update' : '✨ Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BuildingBlocks;
