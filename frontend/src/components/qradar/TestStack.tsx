import React from 'react';
import ConditionRow from './ConditionRow';
import type { QRadarTest, QRadarTestParam } from '../../data/qradar-tests';

export interface Condition {
    id: string;
    testDef: QRadarTest;
    values: Record<string, string>;
}

interface TestStackProps {
    conditions: Condition[];
    logic: 'ALL' | 'ANY';
    selectedConditionId: string | null;
    onLogicChange: (logic: 'ALL' | 'ANY') => void;
    onSelectCondition: (id: string) => void;
    onDeleteCondition: (id: string) => void;
    onMoveConditionUp: (id: string) => void;
    onMoveConditionDown: (id: string) => void;
    onConfigureParam: (conditionId: string, param: QRadarTestParam) => void;
}

const TestStack: React.FC<TestStackProps> = ({
    conditions,
    logic,
    selectedConditionId,
    onLogicChange,
    onSelectCondition,
    onDeleteCondition,
    onMoveConditionUp,
    onMoveConditionDown,
    onConfigureParam
}) => {
    return (
        <div className="qr-test-stack">
            <div className="panel-header">Tests</div>

            <div className="logic-connector">
                Apply this rule when{' '}
                <select value={logic} onChange={(e) => onLogicChange(e.target.value as 'ALL' | 'ANY')}>
                    <option value="ALL">ALL</option>
                    <option value="ANY">ANY</option>
                </select>
                {' '}of the following conditions match:
            </div>

            <ul className="condition-stack">
                {conditions.length === 0 ? (
                    <li className="stack-empty">
                        No tests have been added to this rule.<br />
                        Select a test from the left panel and click <em>Add »</em> to begin.
                    </li>
                ) : (
                    conditions.map((condition, index) => (
                        <ConditionRow
                            key={condition.id}
                            condition={condition}
                            index={index}
                            totalCount={conditions.length}
                            isSelected={selectedConditionId === condition.id}
                            onSelect={() => onSelectCondition(condition.id)}
                            onDelete={() => onDeleteCondition(condition.id)}
                            onMoveUp={() => onMoveConditionUp(condition.id)}
                            onMoveDown={() => onMoveConditionDown(condition.id)}
                            onConfigureParam={(param) => onConfigureParam(condition.id, param)}
                        />
                    ))
                )}
            </ul>
        </div>
    );
};

export default TestStack;
