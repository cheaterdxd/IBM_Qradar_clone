import React, { useState, useEffect } from 'react';
import { rulesAPI } from '../api/client';

const Rules: React.FC = () => {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-4">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Rules</h1>
                <button className="glass-button primary">
                    + Create Rule
                </button>
            </div>

            {loading ? (
                <div className="glass-card p-4 text-center">
                    <p style={{ color: 'var(--text-secondary)' }}>Loading rules...</p>
                </div>
            ) : rules.length === 0 ? (
                <div className="glass-card p-4 text-center">
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                        No rules found. Create your first rule to get started.
                    </p>
                    <button className="glass-button primary">
                        + Create Your First Rule
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {rules.map((rule) => (
                        <div key={rule.id} className="glass-card p-3">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                                        {rule.name}
                                    </h3>
                                    {rule.description && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            {rule.description}
                                        </p>
                                    )}
                                </div>
                                <span className={`badge ${rule.enabled ? 'success' : 'warning'}`}>
                                    {rule.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button className="glass-button">Edit</button>
                                <button className="glass-button">Test</button>
                                <button className="glass-button" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--error)' }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Rules;
