import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Rules from './Rules.tsx';
import BuildingBlocks from './BuildingBlocks.tsx';
import TestRule from './TestRule.tsx';
import '../styles/glassmorphism.css';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Rules', icon: '📋' },
        { path: '/building-blocks', label: 'Building Blocks', icon: '🧱' },
        { path: '/test', label: 'Test Rule', icon: '🧪' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div
                className="glass-container"
                style={{
                    width: '250px',
                    padding: 'var(--spacing-lg)',
                    margin: 'var(--spacing-md)',
                    height: 'calc(100vh - 2rem)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div className="mb-4">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>
                        CLONE SIEM Editor
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Rule Test Stack
                    </p>
                </div>

                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="glass-button"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)',
                                    width: '100%',
                                    marginBottom: 'var(--spacing-sm)',
                                    textDecoration: 'none',
                                    background: isActive ? 'var(--primary)' : 'var(--glass-bg)',
                                    borderColor: isActive ? 'var(--primary-light)' : 'var(--glass-border)',
                                }}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="glass-card p-2">
                    <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)' }}>
                        Logged in as
                    </p>
                    <p style={{ fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
                        {user?.username}
                    </p>
                    <button
                        onClick={logout}
                        className="glass-button w-full"
                        style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--error)' }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: 'var(--spacing-md)', overflow: 'auto' }}>
                <Routes>
                    <Route path="/" element={<Rules />} />
                    <Route path="/building-blocks" element={<BuildingBlocks />} />
                    <Route path="/test" element={<TestRule />} />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;
