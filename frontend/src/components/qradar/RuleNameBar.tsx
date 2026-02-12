import React from 'react';

interface RuleNameBarProps {
    ruleName: string;
    notes: string;
    onRuleNameChange: (value: string) => void;
    onNotesChange: (value: string) => void;
}

const RuleNameBar: React.FC<RuleNameBarProps> = ({
    ruleName,
    notes,
    onRuleNameChange,
    onNotesChange
}) => {
    return (
        <div className="qr-rule-name-bar">
            <label>
                Rule Name:{' '}
                <input
                    type="text"
                    className="qr-rule-name-input"
                    value={ruleName}
                    onChange={(e) => onRuleNameChange(e.target.value)}
                />
            </label>
            <label className="notes-label">
                Notes:{' '}
                <input
                    type="text"
                    className="qr-notes-input"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Optional description..."
                />
            </label>
        </div>
    );
};

export default RuleNameBar;
