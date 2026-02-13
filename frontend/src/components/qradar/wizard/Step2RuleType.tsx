import React from 'react';

interface Step2RuleTypeProps {
    value: 'event' | 'flow' | 'common' | 'offense' | 'building_block';
    onChange: (type: 'event' | 'flow' | 'common' | 'offense' | 'building_block') => void;
}

const Step2RuleType: React.FC<Step2RuleTypeProps> = ({ value, onChange }) => {
    const ruleTypes = [
        {
            id: 'event',
            name: 'Event Rule',
            description: 'Tests against incoming log source data processed in real time by the QRadar Event Processor.'
        },
        {
            id: 'flow',
            name: 'Flow Rule',
            description: 'Tests against incoming flow data processed by the QRadar Flow Processor.'
        },
        {
            id: 'common',
            name: 'Common Rule',
            description: 'Tests against both event and flow data simultaneously.'
        },
        {
            id: 'offense',
            name: 'Offense Rule',
            description: 'Tests the parameters of an existing offense to trigger additional responses.'
        },
        {
            id: 'building_block',
            name: 'Building Block',
            description: 'A reusable named set of tests with no associated response actions.'
        }
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#003366',
                marginBottom: '16px',
                fontFamily: 'Arial, sans-serif'
            }}>
                Select Rule Type
            </h2>

            <p style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#333333',
                marginBottom: '20px',
                fontFamily: 'Arial, sans-serif'
            }}>
                Choose the type of rule you want to create. The rule type determines what kind of data the rule will analyze and which test conditions are available.
            </p>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
            }}>
                {ruleTypes.map((ruleType) => (
                    <label
                        key={ruleType.id}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '12px',
                            border: value === ruleType.id ? '2px solid #0066CC' : '1px solid #CCCCCC',
                            background: value === ruleType.id ? '#EBF5FF' : '#FFFFFF',
                            cursor: 'pointer',
                            fontFamily: 'Arial, sans-serif'
                        }}
                    >
                        <input
                            type="radio"
                            name="ruleType"
                            value={ruleType.id}
                            checked={value === ruleType.id}
                            onChange={(e) => onChange(e.target.value as any)}
                            style={{
                                marginRight: '10px',
                                marginTop: '2px',
                                width: '14px',
                                height: '14px',
                                cursor: 'pointer'
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#003366',
                                marginBottom: '4px'
                            }}>
                                {ruleType.name}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                lineHeight: '1.5',
                                color: '#666666'
                            }}>
                                {ruleType.description}
                            </div>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default Step2RuleType;
