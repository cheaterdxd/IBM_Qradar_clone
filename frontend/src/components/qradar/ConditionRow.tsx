import React from 'react';
import { QRadarTest, QRadarTestParam } from '../../data/qradar-tests';

interface ConditionRowProps {
    condition: {
        id: string;
        testDef: QRadarTest;
        values: Record<string, string>;
    };
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onConfigureParam: (param: QRadarTestParam) => void;
}

const ConditionRow: React.FC<ConditionRowProps> = ({
    condition,
    index,
    isSelected,
    onSelect,
    onDelete,
    onConfigureParam
}) => {
    const { testDef, values } = condition;

    return (
        <li
            className={`condition-row ${isSelected ? 'selected-row' : ''}`}
            onClick={onSelect}
        >
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
