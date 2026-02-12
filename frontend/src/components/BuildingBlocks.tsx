import React, { useState, useEffect } from 'react';
import { buildingBlocksAPI } from '../api/client';

const BuildingBlocks: React.FC = () => {
    const [buildingBlocks, setBuildingBlocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-4">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Building Blocks</h1>
                <button className="glass-button primary">
                    + Create Building Block
                </button>
            </div>

            {loading ? (
                <div className="glass-card p-4 text-center">
                    <p style={{ color: 'var(--text-secondary)' }}>Loading building blocks...</p>
                </div>
            ) : buildingBlocks.length === 0 ? (
                <div className="glass-card p-4 text-center">
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                        No building blocks found. Create reusable rule components.
                    </p>
                    <button className="glass-button primary">
                        + Create Your First Building Block
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {buildingBlocks.map((bb) => (
                        <div key={bb.id} className="glass-card p-3">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                                        {bb.name}
                                    </h3>
                                    {bb.description && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            {bb.description}
                                        </p>
                                    )}
                                </div>
                                <span className="badge info">{bb.id}</span>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button className="glass-button">Edit</button>
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

export default BuildingBlocks;
