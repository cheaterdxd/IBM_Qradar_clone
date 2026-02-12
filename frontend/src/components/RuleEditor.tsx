import React, { useState, useEffect } from 'react';
import { rulesAPI, buildingBlocksAPI } from '../api/client';

interface RuleEditorProps {
    ruleId?: string;
    onClose: () => void;
    onSave: () => void;
}

const RuleEditor: React.FC<RuleEditorProps> = ({ ruleId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        severity: 'medium',
        enabled: true,
        aql: '',
        building_blocks: [] as string[]
    });
    const [availableBBs, setAvailableBBs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'basic' | 'conditions' | 'advanced'>('basic');

    useEffect(() => {
        fetchBuildingBlocks();
        if (ruleId) {
            fetchRule();
        }
    }, [ruleId]);

    const fetchBuildingBlocks = async () => {
        try {
            const response = await buildingBlocksAPI.list();
            setAvailableBBs(response.data);
        } catch (err) {
            console.error('Failed to fetch building blocks:', err);
        }
    };

    const fetchRule = async () => {
        if (!ruleId) return;
        try {
            setLoading(true);
            const response = await rulesAPI.get(ruleId);
            setFormData({
                name: response.data.name,
                description: response.data.description || '',
                severity: response.data.severity,
                enabled: response.data.enabled,
                aql: response.data.aql,
                building_blocks: response.data.building_blocks || []
            });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load rule');
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
                conditions: { type: 'comparison', field: 'eventName', operator: '=', value: 'test' } // Placeholder
            };

            if (ruleId) {
                await rulesAPI.update(ruleId, payload);
            } else {
                await rulesAPI.create(payload);
            }
            onSave();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save rule');
        } finally {
            setLoading(false);
        }
    };

    const insertAQLTemplate = (template: string) => {
        setFormData({ ...formData, aql: template });
    };

    const toggleBuildingBlock = (bbId: string) => {
        const newBBs = formData.building_blocks.includes(bbId)
            ? formData.building_blocks.filter(id => id !== bbId)
            : [...formData.building_blocks, bbId];
        setFormData({ ...formData, building_blocks: newBBs });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content rule-editor" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{ruleId ? 'Edit Rule' : 'Create New Rule'}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {error && (
                    <div className="error-banner">
                        ⚠️ {error}
                    </div>
                )}

                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('basic')}
                    >
                        📋 Basic Info
                    </button>
                    <button
                        className={`tab ${activeTab === 'conditions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('conditions')}
                    >
                        🔍 Conditions
                    </button>
                    <button
                        className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
                        onClick={() => setActiveTab('advanced')}
                    >
                        ⚙️ Advanced
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {activeTab === 'basic' && (
                        <div className="tab-content">
                            <div className="form-group">
                                <label>Rule Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Detect Failed Login Attempts"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe what this rule detects..."
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Severity</label>
                                    <select
                                        value={formData.severity}
                                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                    >
                                        <option value="low">🟢 Low</option>
                                        <option value="medium">🟡 Medium</option>
                                        <option value="high">🟠 High</option>
                                        <option value="critical">🔴 Critical</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.enabled ? 'enabled' : 'disabled'}
                                        onChange={(e) => setFormData({ ...formData, enabled: e.target.value === 'enabled' })}
                                    >
                                        <option value="enabled">✅ Enabled</option>
                                        <option value="disabled">⏸️ Disabled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'conditions' && (
                        <div className="tab-content">
                            <div className="form-group">
                                <label>AQL Query *</label>
                                <div className="aql-templates">
                                    <button type="button" onClick={() => insertAQLTemplate("sourceIP = '192.168.1.1'")}>
                                        IP Match
                                    </button>
                                    <button type="button" onClick={() => insertAQLTemplate("eventName CONTAINS 'failed'")}>
                                        Event Contains
                                    </button>
                                    <button type="button" onClick={() => insertAQLTemplate("COUNT(eventId) > 5 WITHIN 10 minutes")}>
                                        Count Threshold
                                    </button>
                                    <button type="button" onClick={() => insertAQLTemplate("severity >= 7 AND protocol = 'TCP'")}>
                                        Multiple Conditions
                                    </button>
                                </div>
                                <textarea
                                    value={formData.aql}
                                    onChange={(e) => setFormData({ ...formData, aql: e.target.value })}
                                    placeholder="Enter AQL query (e.g., sourceIP = '192.168.1.1' AND severity > 5)"
                                    rows={6}
                                    className="aql-editor"
                                    required
                                />
                                <div className="help-text">
                                    💡 Examples: <code>sourceIP = '10.0.0.1'</code>, <code>eventName CONTAINS 'login'</code>,
                                    <code>COUNT(eventId) &gt; 10 WITHIN 5 minutes</code>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Building Blocks</label>
                                <div className="building-blocks-list">
                                    {availableBBs.length === 0 ? (
                                        <p className="empty-state">No building blocks available</p>
                                    ) : (
                                        availableBBs.map(bb => (
                                            <div key={bb.id} className="bb-item">
                                                <input
                                                    type="checkbox"
                                                    id={`bb-${bb.id}`}
                                                    checked={formData.building_blocks.includes(bb.id)}
                                                    onChange={() => toggleBuildingBlock(bb.id)}
                                                />
                                                <label htmlFor={`bb-${bb.id}`}>
                                                    <strong>{bb.name}</strong>
                                                    {bb.description && <span className="bb-desc">{bb.description}</span>}
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'advanced' && (
                        <div className="tab-content">
                            <div className="info-box">
                                <h3>📊 Advanced Settings</h3>
                                <p>Additional configuration options for this rule.</p>
                            </div>

                            <div className="form-group">
                                <label>Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    placeholder="e.g., authentication, network, critical"
                                />
                            </div>

                            <div className="form-group">
                                <label>Response Actions</label>
                                <select>
                                    <option value="none">None</option>
                                    <option value="alert">Send Alert</option>
                                    <option value="block">Block IP</option>
                                    <option value="quarantine">Quarantine User</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Alert Threshold</label>
                                <input type="number" placeholder="Number of matches before alert" />
                            </div>
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? '⏳ Saving...' : ruleId ? '💾 Update Rule' : '✨ Create Rule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RuleEditor;
