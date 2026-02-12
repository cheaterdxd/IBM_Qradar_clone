import React, { useState } from 'react';
import QRadarHeader from './QRadarHeader';
import QRadarTabs from './QRadarTabs';
import WizardSteps from './WizardSteps';
import RuleNameBar from './RuleNameBar';
import TestBrowser from './TestBrowser';
import TestStack, { Condition } from './TestStack';
import WizardFooter from './WizardFooter';
import ConfigDialog from './ConfigDialog';
import { QRADAR_TESTS, QRadarTestParam } from '../../data/qradar-tests';
import { rulesAPI } from '../../api/client';
import '../../styles/qradar-base.css';
import '../../styles/qradar-panels.css';
import '../../styles/qradar-modal.css';

const QRadarApp: React.FC = () => {
    const [ruleName, setRuleName] = useState('My Custom Event Rule');
    const [notes, setNotes] = useState('');
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [logic, setLogic] = useState<'ALL' | 'ANY'>('ALL');
    const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    // Config dialog state
    const [configDialogOpen, setConfigDialogOpen] = useState(false);
    const [currentConfigConditionId, setCurrentConfigConditionId] = useState<string | null>(null);
    const [currentConfigParam, setCurrentConfigParam] = useState<QRadarTestParam | null>(null);

    let conditionCounter = 0;

    const handleAddTest = () => {
        if (!selectedTestId) {
            alert('Please select a test from the list first.');
            return;
        }

        const testDef = QRADAR_TESTS.find(t => t.id === selectedTestId);
        if (!testDef) return;

        const newCondition: Condition = {
            id: `cond_${++conditionCounter}_${Date.now()}`,
            testDef,
            values: {}
        };

        setConditions([...conditions, newCondition]);
        setShowError(false);
    };

    const handleDeleteCondition = (id: string) => {
        setConditions(conditions.filter(c => c.id !== id));
    };

    const handleConfigureParam = (conditionId: string, param: QRadarTestParam) => {
        const condition = conditions.find(c => c.id === conditionId);
        if (!condition) return;

        setCurrentConfigConditionId(conditionId);
        setCurrentConfigParam(param);
        setConfigDialogOpen(true);
    };

    const handleConfigSubmit = (value: string) => {
        if (!currentConfigConditionId || !currentConfigParam) return;

        setConditions(conditions.map(c => {
            if (c.id === currentConfigConditionId) {
                return {
                    ...c,
                    values: {
                        ...c.values,
                        [currentConfigParam.key]: value
                    }
                };
            }
            return c;
        }));

        setConfigDialogOpen(false);
        setCurrentConfigConditionId(null);
        setCurrentConfigParam(null);
    };

    const handleNext = async () => {
        if (conditions.length === 0) {
            setShowError(true);
            return;
        }

        // Generate AQL from conditions
        const aqlParts = conditions.map(cond => {
            let aql = cond.testDef.text;
            // Simple AQL generation - can be improved
            cond.testDef.params.forEach(param => {
                const value = cond.values[param.key];
                if (value) {
                    aql += ` [${value}]`;
                }
            });
            return aql;
        });

        const finalAQL = aqlParts.join(logic === 'ALL' ? ' AND ' : ' OR ');

        try {
            await rulesAPI.create({
                name: ruleName,
                description: notes,
                severity: 'medium',
                enabled: true,
                aql: finalAQL,
                conditions: { type: 'comparison', field: 'eventName', operator: '=', value: 'test' },
                building_blocks: []
            });

            alert('Rule created successfully!');
            // Reset form
            setConditions([]);
            setRuleName('');
            setNotes('');
        } catch (error) {
            console.error('Failed to create rule:', error);
            alert('Failed to create rule');
        }
    };

    const getCurrentConfigValue = () => {
        if (!currentConfigConditionId || !currentConfigParam) return '';
        const condition = conditions.find(c => c.id === currentConfigConditionId);
        return condition?.values[currentConfigParam.key] || '';
    };

    return (
        <div className="qr-app">
            <QRadarHeader />
            <QRadarTabs activeTab="Offenses" />
            <WizardSteps currentStep={3} />

            <div className="qr-wizard-content">
                <RuleNameBar
                    ruleName={ruleName}
                    notes={notes}
                    onRuleNameChange={setRuleName}
                    onNotesChange={setNotes}
                />

                {showError && (
                    <div className="error-msg show">
                        ⚠ You must add at least one test condition to the rule before proceeding.
                    </div>
                )}

                <div className="qr-test-editor">
                    <TestBrowser
                        selectedTestId={selectedTestId}
                        onSelectTest={setSelectedTestId}
                        onAddTest={handleAddTest}
                    />

                    <TestStack
                        conditions={conditions}
                        logic={logic}
                        selectedConditionId={selectedConditionId}
                        onLogicChange={setLogic}
                        onSelectCondition={setSelectedConditionId}
                        onDeleteCondition={handleDeleteCondition}
                        onConfigureParam={handleConfigureParam}
                    />
                </div>
            </div>

            <WizardFooter
                onBack={() => alert('Back to previous step')}
                onNext={handleNext}
                onCancel={() => alert('Cancel wizard')}
            />

            <ConfigDialog
                isOpen={configDialogOpen}
                param={currentConfigParam}
                currentValue={getCurrentConfigValue()}
                onSubmit={handleConfigSubmit}
                onClose={() => setConfigDialogOpen(false)}
            />
        </div>
    );
};

export default QRadarApp;
