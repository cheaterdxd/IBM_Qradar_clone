import React, { useState, useEffect } from 'react';
import type { QRadarTestParam } from '../../data/qradar-tests';

interface ConfigDialogProps {
    isOpen: boolean;
    param: QRadarTestParam | null;
    currentValue: string;
    onSubmit: (value: string) => void;
    onClose: () => void;
}

const ConfigDialog: React.FC<ConfigDialogProps> = ({
    isOpen,
    param,
    currentValue,
    onSubmit,
    onClose
}) => {
    const [textValue, setTextValue] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [manualInput, setManualInput] = useState('');
    const [aqlValue, setAqlValue] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [numberValue, setNumberValue] = useState('');

    useEffect(() => {
        if (isOpen && param) {
            if (param.type === 'text') {
                setTextValue(currentValue || '');
            } else if (param.type === 'multiselect') {
                setSelectedItems(currentValue ? currentValue.split(', ') : []);
            } else if (param.type === 'aql') {
                setAqlValue(currentValue || '');
            } else if (param.type === 'select') {
                setSelectValue(currentValue || '');
            } else if (param.type === 'number') {
                setNumberValue(currentValue || '');
            }
        }
    }, [isOpen, param, currentValue]);

    if (!isOpen || !param) return null;

    const handleSubmit = () => {
        if (param.type === 'text') {
            onSubmit(textValue);
        } else if (param.type === 'multiselect') {
            onSubmit(selectedItems.join(', '));
        } else if (param.type === 'aql') {
            onSubmit(aqlValue);
        } else if (param.type === 'select') {
            onSubmit(selectValue);
        } else if (param.type === 'number') {
            onSubmit(numberValue);
        }
        onClose();
    };

    const toggleItem = (item: string) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const addManualItem = () => {
        if (manualInput && !selectedItems.includes(manualInput)) {
            setSelectedItems([...selectedItems, manualInput]);
            setManualInput('');
        }
    };

    const filteredOptions = param.options?.filter(opt =>
        opt.toLowerCase().includes(searchKeyword.toLowerCase())
    ) || [];

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-title">
                    <span>Configure: {param.label}</span>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {param.type === 'text' ? (
                        <>
                            <div className="modal-field">
                                <label>{param.label}:</label>
                                <input
                                    type="text"
                                    value={textValue}
                                    onChange={(e) => setTextValue(e.target.value)}
                                    placeholder={param.placeholder || ''}
                                    autoFocus
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn-submit" onClick={handleSubmit}>
                                    Submit
                                </button>
                                <button className="btn-dialog-cancel" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : param.type === 'aql' ? (
                        <>
                            <div className="modal-field">
                                <label>{param.label}:</label>
                                <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                                    Example: <code>sourceip = '192.168.1.1' AND category = 5004</code>
                                </div>
                                <textarea
                                    value={aqlValue}
                                    onChange={(e) => setAqlValue(e.target.value)}
                                    placeholder={param.placeholder || 'Enter AQL WHERE clause...'}
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        height: '60px',
                                        fontFamily: 'Courier New, monospace',
                                        fontSize: '12px'
                                    }}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn-submit" onClick={handleSubmit}>
                                    Submit
                                </button>
                                <button className="btn-dialog-cancel" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : param.type === 'select' ? (
                        <>
                            <div className="modal-field">
                                <label>{param.label}:</label>
                                <select
                                    value={selectValue}
                                    onChange={(e) => setSelectValue(e.target.value)}
                                    autoFocus
                                    style={{ width: '100%' }}
                                >
                                    <option value="">-- Select --</option>
                                    {(param.options || []).map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-submit" onClick={handleSubmit}>
                                    Submit
                                </button>
                                <button className="btn-dialog-cancel" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : param.type === 'number' ? (
                        <>
                            <div className="modal-field">
                                <label>{param.label}:</label>
                                <input
                                    type="number"
                                    value={numberValue}
                                    onChange={(e) => setNumberValue(e.target.value)}
                                    placeholder={param.placeholder || ''}
                                    min={param.min}
                                    max={param.max}
                                    autoFocus
                                    style={{ width: '100%' }}
                                />
                                {(param.min !== undefined || param.max !== undefined) && (
                                    <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                                        {param.min !== undefined && `Min: ${param.min}`}
                                        {param.min !== undefined && param.max !== undefined && ' | '}
                                        {param.max !== undefined && `Max: ${param.max}`}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn-submit" onClick={handleSubmit}>
                                    Submit
                                </button>
                                <button className="btn-dialog-cancel" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: '8px' }}>
                                <label style={{ fontSize: '11px' }}>
                                    Search:{' '}
                                    <input
                                        type="text"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        style={{
                                            border: '1px solid #999',
                                            height: '20px',
                                            padding: '1px 4px',
                                            fontSize: '11px',
                                            width: '200px'
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="modal-list-wrapper">
                                <div className="modal-list-pane">
                                    <label>Available:</label>
                                    <div className="modal-list-box">
                                        {filteredOptions.map(opt => (
                                            <div
                                                key={opt}
                                                className={`mlist-item ${selectedItems.includes(opt) ? '' : 'avail'}`}
                                                onClick={() => toggleItem(opt)}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-list-pane">
                                    <label>Selected:</label>
                                    <div className="modal-list-box">
                                        {selectedItems.map(item => (
                                            <div
                                                key={item}
                                                className="mlist-item sel"
                                                onClick={() => toggleItem(item)}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-manual">
                                <label>Or enter manually:</label>
                                <input
                                    type="text"
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder="Type value..."
                                    onKeyPress={(e) => e.key === 'Enter' && addManualItem()}
                                />
                                <button className="btn-sm" onClick={addManualItem}>
                                    Add
                                </button>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-submit" onClick={handleSubmit}>
                                    Submit
                                </button>
                                <button className="btn-dialog-cancel" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfigDialog;
