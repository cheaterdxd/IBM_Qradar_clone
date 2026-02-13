import React from 'react';
import type { QRadarTest, QRadarTestParam } from '../../data/qradar-tests';

interface ConditionRowProps {
    condition: {
        id: string;
        testDef: QRadarTest;
        values: Record<string, string>;
    };
    index: number;
    totalCount: number;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onConfigureParam: (param: QRadarTestParam) => void;
}

const ConditionRow: React.FC<ConditionRowProps> = ({
    condition,
    index,
    totalCount,
    isSelected,
    onSelect,
    onDelete,
    onMoveUp,
    onMoveDown,
    onConfigureParam
}) => {
    const { testDef, values } = condition;
    const isFirst = index === 0;
    const isLast = index === totalCount - 1;

    return (
        <li
            className={`condition-row ${isSelected ? 'selected-row' : ''}`}
            onClick={onSelect}
        >
            {/* Up/Down arrow buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '6px', marginTop: '1px' }}>
                <button
                    className="arrow-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMoveUp();
                    }}
                    disabled={isFirst}
                    title={isFirst ? "Already at top" : "Move condition up"}
                    style={{
                        width: '16px',
                        height: '14px',
                        border: '1px solid #999',
                        background: isFirst ? '#F5F5F5' : '#FFFFFF',
                        color: isFirst ? '#CCCCCC' : '#333333',
                        fontSize: '8px',
                        lineHeight: '1',
                        padding: '0',
                        cursor: isFirst ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ▲
                </button>
                <button
                    className="arrow-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMoveDown();
                    }}
                    disabled={isLast}
                    title={isLast ? "Already at bottom" : "Move condition down"}
                    style={{
                        width: '16px',
                        height: '14px',
                        border: '1px solid #999',
                        background: isLast ? '#F5F5F5' : '#FFFFFF',
                        color: isLast ? '#CCCCCC' : '#333333',
                        fontSize: '8px',
                        lineHeight: '1',
                        padding: '0',
                        cursor: isLast ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ▼
                </button>
            </div>

            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                title="Remove this condition"
            >
                x
            </button>

            <span className="condition-text">
                <span className="and-when">
                    {index === 0 ? 'when ' : 'and when '}
                </span>
                {testDef.text}{' '}
                {testDef.params.map((param, idx) => (
                    <React.Fragment key={param.key}>
                        <a
                            className={`config-link ${values[param.key] ? 'configured' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onConfigureParam(param);
                            }}
                            title={`Click to configure: ${param.label}`}
                        >
                            {values[param.key] ? `[${values[param.key]}]` : `[${param.label}]`}
                        </a>
                        {idx < testDef.params.length - 1 && ' '}
                    </React.Fragment>
                ))}
            </span>
        </li>
    );
};

export default ConditionRow;
