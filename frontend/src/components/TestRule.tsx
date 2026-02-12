import React, { useState } from 'react';
import { testAPI } from '../api/client';

const TestRule: React.FC = () => {
    const [aql, setAql] = useState('');
    const [events, setEvents] = useState('[]');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleTest = async () => {
        setLoading(true);
        setResult(null);

        try {
            const eventsData = JSON.parse(events);
            const response = await testAPI.testRule({
                rule: {
                    name: 'Test Rule',
                    aql,
                    enabled: true,
                    severity: 'medium',
                    conditions: {},
                },
                events: eventsData,
                building_blocks: [],
            });
            setResult(response.data);
        } catch (error: any) {
            setResult({
                alert: false,
                error: error.response?.data?.detail || error.message || 'Test failed',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--spacing-lg)' }}>
                Test Rule
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                {/* Input Section */}
                <div>
                    <div className="glass-card p-3 mb-3">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
                            AQL Query
                        </h3>
                        <textarea
                            className="glass-input"
                            value={aql}
                            onChange={(e) => setAql(e.target.value)}
                            placeholder="sourceIP = '192.168.1.1' AND eventName = 'Login'"
                            rows={5}
                            style={{ fontFamily: 'monospace', resize: 'vertical' }}
                        />
                    </div>

                    <div className="glass-card p-3">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
                            Test Events (JSON)
                        </h3>
                        <textarea
                            className="glass-input"
                            value={events}
                            onChange={(e) => setEvents(e.target.value)}
                            placeholder='[{"eventId": "1", "sourceIP": "192.168.1.1", "eventName": "Login"}]'
                            rows={10}
                            style={{ fontFamily: 'monospace', resize: 'vertical' }}
                        />
                    </div>

                    <button
                        onClick={handleTest}
                        className="glass-button primary w-full mt-3"
                        disabled={loading || !aql || !events}
                        style={{ padding: 'var(--spacing-md)' }}
                    >
                        {loading ? 'Testing...' : 'Run Test'}
                    </button>
                </div>

                {/* Results Section */}
                <div>
                    <div className="glass-card p-3">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
                            Test Results
                        </h3>

                        {!result ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                                Run a test to see results
                            </p>
                        ) : (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`badge ${result.alert ? 'success' : result.error ? 'error' : 'warning'}`}>
                                        {result.alert ? 'ALERT' : result.error ? 'ERROR' : 'NO ALERT'}
                                    </span>
                                </div>

                                {result.error && (
                                    <div className="glass-card p-2 mb-3" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                                        <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{result.error}</p>
                                    </div>
                                )}

                                {result.trigger_details && (
                                    <div className="mb-3">
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)' }}>
                                            Trigger Details:
                                        </p>
                                        <p style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                            {result.trigger_details}
                                        </p>
                                    </div>
                                )}

                                {result.matched_events && result.matched_events.length > 0 && (
                                    <div className="mb-3">
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)' }}>
                                            Matched Events: {result.matched_events.length}
                                        </p>
                                    </div>
                                )}

                                {result.evaluation_phases && (
                                    <div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                                            Evaluation Phases:
                                        </p>
                                        <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
                                            {Object.entries(result.evaluation_phases).map(([phase, status]: [string, any]) => (
                                                <div key={phase} className="flex justify-between items-center">
                                                    <span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>
                                                        {phase.replace(/_/g, ' ')}:
                                                    </span>
                                                    <span className={`badge ${status === 'passed' ? 'success' :
                                                            status === 'failed' ? 'error' :
                                                                'info'
                                                        }`} style={{ fontSize: '0.75rem' }}>
                                                        {status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestRule;
