import React from 'react';

interface ResponseConfig {
    offense: {
        enabled: boolean;
        indexOn: string;
        annotation: string;
        replaceName: boolean;
    };
    dispatchEvent: {
        enabled: boolean;
        name: string;
        description: string;
        highLevelCategory: string;
        lowLevelCategory: string;
        offenseNaming: 'append' | 'replace' | 'none';
    };
    referenceSet: {
        enabled: boolean;
        field: string;
        setName: string;
    };
    severity: number;
    credibility: number;
    relevance: number;
    preventAggregation: boolean;
}

interface Step4RuleResponseProps {
    config: ResponseConfig;
    onChange: (config: ResponseConfig) => void;
}

const Step4RuleResponse: React.FC<Step4RuleResponseProps> = ({ config, onChange }) => {
    const updateConfig = (updates: Partial<ResponseConfig>) => {
        onChange({ ...config, ...updates });
    };

    const indexOptions = ['Source IP', 'Destination IP', 'Username', 'Hostname', 'QID', 'Source MAC', 'Log Source', 'Event Name'];
    const highLevelCategories = ['Security', 'Application', 'Network', 'System', 'Audit', 'Policy'];
    const eventFields = ['sourceip', 'destinationip', 'username', 'hostname', 'eventname', 'category'];

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#003366', marginBottom: '16px' }}>
                Rule Response Configuration
            </h2>

            <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#333333', marginBottom: '20px' }}>
                Configure the actions that QRadar will take when this rule's conditions are met.
            </p>

            {/* Offense Configuration */}
            <div style={{ marginBottom: '24px', padding: '12px', border: '1px solid #CCCCCC', background: '#FAFAFA' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                    <input
                        type="checkbox"
                        checked={config.offense.enabled}
                        onChange={(e) => updateConfig({
                            offense: { ...config.offense, enabled: e.target.checked }
                        })}
                        style={{ width: '14px', height: '14px', marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#003366' }}>
                        Ensure the detected event is part of an offense
                    </span>
                </label>

                {config.offense.enabled && (
                    <div style={{ marginLeft: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '11px', color: '#333', display: 'block', marginBottom: '4px' }}>
                                Index offense based on:
                            </label>
                            <select
                                value={config.offense.indexOn}
                                onChange={(e) => updateConfig({
                                    offense: { ...config.offense, indexOn: e.target.value }
                                })}
                                style={{ height: '22px', fontSize: '12px', border: '1px solid #999', padding: '0 4px', width: '200px' }}
                            >
                                {indexOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '11px', color: '#333', display: 'block', marginBottom: '4px' }}>
                                Annotate this offense:
                            </label>
                            <input
                                type="text"
                                value={config.offense.annotation}
                                onChange={(e) => updateConfig({
                                    offense: { ...config.offense, annotation: e.target.value }
                                })}
                                placeholder="Enter offense description"
                                style={{ height: '22px', fontSize: '12px', border: '1px solid #999', padding: '2px 6px', width: '400px' }}
                            />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={config.offense.replaceName}
                                onChange={(e) => updateConfig({
                                    offense: { ...config.offense, replaceName: e.target.checked }
                                })}
                                style={{ width: '14px', height: '14px', marginRight: '6px' }}
                            />
                            <span style={{ fontSize: '11px', color: '#333' }}>
                                This information should set or replace the name of the associated offense(s)
                            </span>
                        </label>
                    </div>
                )}
            </div>

            {/* Dispatch New Event */}
            <div style={{ marginBottom: '24px', padding: '12px', border: '1px solid #CCCCCC', background: '#FAFAFA' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                    <input
                        type="checkbox"
                        checked={config.dispatchEvent.enabled}
                        onChange={(e) => updateConfig({
                            dispatchEvent: { ...config.dispatchEvent, enabled: e.target.checked }
                        })}
                        style={{ width: '14px', height: '14px', marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#003366' }}>
                        Dispatch New Event
                    </span>
                </label>

                {config.dispatchEvent.enabled && (
                    <div style={{ marginLeft: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '11px', color: '#333', display: 'block', marginBottom: '4px' }}>Event Name:</label>
                            <input
                                type="text"
                                value={config.dispatchEvent.name}
                                onChange={(e) => updateConfig({
                                    dispatchEvent: { ...config.dispatchEvent, name: e.target.value }
                                })}
                                style={{ height: '22px', fontSize: '12px', border: '1px solid #999', padding: '2px 6px', width: '300px' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '11px', color: '#333', display: 'block', marginBottom: '4px' }}>Event Description:</label>
                            <input
                                type="text"
                                value={config.dispatchEvent.description}
                                onChange={(e) => updateConfig({
                                    dispatchEvent: { ...config.dispatchEvent, description: e.target.value }
                                })}
                                style={{ height: '22px', fontSize: '12px', border: '1px solid #999', padding: '2px 6px', width: '400px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '11px', color: '#333', display: 'block', marginBottom: '4px' }}>High Level Category:</label>
                                <select
                                    value={config.dispatchEvent.highLevelCategory}
                                    onChange={(e) => updateConfig({
                                        dispatchEvent: { ...config.dispatchEvent, highLevelCategory: e.target.value }
                                    })}
                                    style={{ height: '22px', fontSize: '12px', border: '1px solid #999', padding: '0 4px', width: '150px' }}
                                >
                                    {highLevelCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '11px', color: '#333', display: 'block', marginBottom: '4px' }}>Offense Naming:</label>
                                <select
                                    value={config.dispatchEvent.offenseNaming}
                                    onChange={(e) => updateConfig({
                                        dispatchEvent: { ...config.dispatchEvent, offenseNaming: e.target.value as any }
                                    })}
                                    style={{ height: '22px', fontSize: '12px', border: '1px solid #999', padding: '0 4px', width: '150px' }}
                                >
                                    <option value="append">Append</option>
                                    <option value="replace">Replace</option>
                                    <option value="none">Do Not Annotate</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* Reference Set */}
            <div style={{ marginBottom: '24px', padding: '12px', border: '1px solid #CCCCCC', background: '#FAFAFA' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                    <input
                        type="checkbox"
                        checked={config.referenceSet.enabled}
                        onChange={(e) => updateConfig({
                            referenceSet: { ...config.referenceSet, enabled: e.target.checked }
                        })}
                        style={{ width: '14px', height: '14px', marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#003366' }}>
                        Add event field to a reference set
                    </span>
                </label>

                {config.referenceSet.enabled && (
                    <div style={{ marginLeft: '22px', display: 'flex', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '11px', color: '#333', display: 'block', marginBottom: '4px' }}>Field:</label>
                            <select
                                value={config.referenceSet.field}
                                onChange={(e) => updateConfig({
                                    referenceSet: { ...config.referenceSet, field: e.target.value }
                                })}
                                style={{ height: '22px', fontSize: '12px', border: '1px solid #999', padding: '0 4px', width: '150px' }}
                            >
                                {eventFields.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '11px', color: '#333', display: 'block', marginBottom: '4px' }}>Reference Set:</label>
                            <input
                                type="text"
                                value={config.referenceSet.setName}
                                onChange={(e) => updateConfig({
                                    referenceSet: { ...config.referenceSet, setName: e.target.value }
                                })}
                                placeholder="Enter reference set name"
                                style={{ height: '22px', fontSize: '12px', border: '1px solid #999', padding: '2px 6px', width: '200px' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Severity/Credibility/Relevance */}
            <div style={{ marginBottom: '24px', padding: '12px', border: '1px solid #CCCCCC', background: '#FAFAFA' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#003366', marginBottom: '12px' }}>
                    Override Event Magnitude Values
                </h3>

                <div style={{ display: 'flex', gap: '20px' }}>
                    {(['severity', 'credibility', 'relevance'] as const).map((field) => (
                        <div key={field}>
                            <label style={{ fontSize: '11px', color: '#333', display: 'block', marginBottom: '4px', textTransform: 'capitalize' }}>
                                {field}:
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={config[field]}
                                onChange={(e) => updateConfig({ [field]: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) })}
                                style={{ height: '22px', fontSize: '12px', border: '1px solid #999', padding: '2px 6px', width: '60px' }}
                            />
                            <span style={{ fontSize: '10px', color: '#666', marginLeft: '4px' }}>(1-10)</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prevent Aggregation */}
            <div style={{ padding: '12px', border: '1px solid #CCCCCC', background: '#FAFAFA' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={config.preventAggregation}
                        onChange={(e) => updateConfig({ preventAggregation: e.target.checked })}
                        style={{ width: '14px', height: '14px', marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#003366' }}>
                        Ensure the offense is not part of an existing offense
                    </span>
                </label>
                <p style={{ fontSize: '11px', color: '#666', marginLeft: '22px', marginTop: '4px' }}>
                    When enabled, matching events will always create a new offense rather than being grouped with existing ones.
                </p>
            </div>
        </div>
    );
};

export default Step4RuleResponse;
