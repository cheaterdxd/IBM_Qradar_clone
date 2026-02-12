import React, { useState, useEffect } from 'react';
import { rulesAPI } from '../api/client';
import RuleEditor from './RuleEditor';
import '../styles/rule-editor.css';

const Rules: React.FC = () => {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingRuleId, setEditingRuleId] = useState<string | undefined>();

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await rulesAPI.list();
            setRules(response.data);
        } catch (error) {
            console.error('Failed to fetch rules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingRuleId(undefined);
        setShowEditor(true);
    };

    const handleEdit = (ruleId: string) => {
        setEditingRuleId(ruleId);
        setShowEditor(true);
    };

    const handleDelete = async (ruleId: string, ruleName: string) => {
        if (!window.confirm(`Are you sure you want to delete "${ruleName}"?`)) {
            return;
        }

        try {
            await rulesAPI.delete(ruleId);
            fetchRules();
        } catch (error) {
            console.error('Failed to delete rule:', error);
            alert('Failed to delete rule');
        }
    };

    const handleSave = () => {
        fetchRules();
    };

    const getSeverityColor = (severity: string) => {
        const colors: any = {
            low: '#34c759',
            medium: '#ffcc00',
            high: '#ff9500',
            critical: '#ff3b30'
        };
        return colors[severity] || '#888';
    };

    if (loading) {
        return <div className="loading">Loading rules...</div>;
    }

    return (
        <div className="content-section">
            <div className="section-header">
                <div>
                    <h2>📋 Rules</h2>
                    <p>Manage security detection rules</p>
                </div>
                <button className="btn-create" onClick={handleCreate}>
                    + Create Rule
                </button>
            </div>

            {rules.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No Rules Yet</h3>
                    <p>Create your first security detection rule to get started</p>
                    <button className="btn-primary" onClick={handleCreate}>
                        ✨ Create Your First Rule
                    </button>
                </div>
            ) : (
                <div className="rules-grid">
                    {rules.map((rule) => (
                        <div key={rule.id} className="rule-card">
                            <div className="rule-header">
                                <div className="rule-title">
                                    <h3>{rule.name}</h3>
                                    <span
                                        className="severity-badge"
                                        style={{ background: getSeverityColor(rule.severity) }}
                                    >
                                        {rule.severity}
                                    </span>
                                </div>
                                <div className="rule-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleEdit(rule.id)}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(rule.id, rule.name)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {rule.description && (
                                <p className="rule-description">{rule.description}</p>
                            )}

                            <div className="rule-aql">
                                <code>{rule.aql}</code>
                            </div>

                            <div className="rule-footer">
                                <span className={`status-badge ${rule.enabled ? 'enabled' : 'disabled'}`}>
                                    {rule.enabled ? '✅ Enabled' : '⏸️ Disabled'}
                                </span>
                                {rule.building_blocks && rule.building_blocks.length > 0 && (
                                    <span className="bb-count">
                                        🧩 {rule.building_blocks.length} Building Block{rule.building_blocks.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showEditor && (
                <RuleEditor
                    ruleId={editingRuleId}
                    onClose={() => setShowEditor(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Rules;
