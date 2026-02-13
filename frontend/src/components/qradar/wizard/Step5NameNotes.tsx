import React from 'react';

interface Step5NameNotesProps {
    ruleName: string;
    notes: string;
    group: string;
    enabled: boolean;
    onRuleNameChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onGroupChange: (value: string) => void;
    onEnabledChange: (value: boolean) => void;
}

const Step5NameNotes: React.FC<Step5NameNotesProps> = ({
    ruleName,
    notes,
    group,
    enabled,
    onRuleNameChange,
    onNotesChange,
    onGroupChange,
    onEnabledChange
}) => {
    const groups = ['Other', 'Network Security', 'Application Security', 'Compliance', 'Threat Intelligence', 'User Activity'];

    return (
        <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#003366',
                marginBottom: '16px',
                fontFamily: 'Arial, sans-serif'
            }}>
                Rule Name and Notes
            </h2>

            <p style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#333333',
                marginBottom: '20px',
                fontFamily: 'Arial, sans-serif'
            }}>
                Provide a descriptive name for your rule and add any notes that will help you identify its purpose.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Rule Name */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#333333',
                        marginBottom: '6px',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        Rule Name: <span style={{ color: '#CC0000' }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={ruleName}
                        onChange={(e) => onRuleNameChange(e.target.value)}
                        placeholder="Enter a descriptive name for this rule"
                        style={{
                            width: '400px',
                            height: '22px',
                            border: '1px solid #999999',
                            padding: '2px 6px',
                            fontSize: '12px',
                            fontFamily: 'Arial, sans-serif',
                            color: '#333333'
                        }}
                    />
                    <div style={{
                        fontSize: '11px',
                        color: '#666666',
                        marginTop: '4px',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        Required. Minimum 3 characters.
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#333333',
                        marginBottom: '6px',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        Notes:
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        placeholder="Optional notes about this rule's purpose or configuration"
                        style={{
                            width: '400px',
                            height: '80px',
                            border: '1px solid #999999',
                            padding: '4px 6px',
                            fontSize: '12px',
                            fontFamily: 'Arial, sans-serif',
                            color: '#333333',
                            resize: 'vertical'
                        }}
                    />
                </div>

                {/* Assign to Group */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#333333',
                        marginBottom: '6px',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        Assign to Group:
                    </label>
                    <select
                        value={group}
                        onChange={(e) => onGroupChange(e.target.value)}
                        style={{
                            width: '300px',
                            height: '22px',
                            border: '1px solid #999999',
                            fontSize: '12px',
                            fontFamily: 'Arial, sans-serif',
                            color: '#333333',
                            padding: '0 4px'
                        }}
                    >
                        {groups.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                {/* Enable Rule Checkbox */}
                <div style={{ marginTop: '8px' }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => onEnabledChange(e.target.checked)}
                            style={{
                                width: '14px',
                                height: '14px',
                                marginRight: '8px',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{
                            fontSize: '12px',
                            color: '#333333',
                            fontWeight: 'bold'
                        }}>
                            Enable Rule
                        </span>
                    </label>
                    <div style={{
                        fontSize: '11px',
                        color: '#666666',
                        marginLeft: '22px',
                        marginTop: '2px',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        If unchecked, the rule will be saved in a disabled state and will not process events.
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '24px',
                padding: '12px',
                background: '#F5F9FF',
                border: '1px solid #AAAAAA',
                fontSize: '11px',
                color: '#333333',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.6'
            }}>
                <strong>Note:</strong> Click <strong>Finish</strong> to save your rule. The rule will be added to the Rules list and can be edited or deployed from there.
            </div>
        </div>
    );
};

export default Step5NameNotes;
