import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/glassmorphism.css';

const Login: React.FC = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
            <div className="glass-container fade-in" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="text-center mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    QRadar Rule Editor
                </h1>
                <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Sign in to continue
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', color: 'var(--text-secondary)' }}>
                            Username
                        </label>
                        <input
                            type="text"
                            className="glass-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', color: 'var(--text-secondary)' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            className="glass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="badge error mb-2 w-full text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="glass-button primary w-full"
                        disabled={loading}
                        style={{ padding: 'var(--spacing-md)' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Don't have an account? Contact your administrator.
                </p>
            </div>
        </div>
    );
};

export default Login;
