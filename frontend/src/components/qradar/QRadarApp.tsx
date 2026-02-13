import React, { useState } from 'react';
import QRadarHeader from './QRadarHeader';
import QRadarTabs from './QRadarTabs';
import WizardSteps from './WizardSteps';
import RuleNameBar from './RuleNameBar';
import TestBrowser from './TestBrowser';
import TestStack from './TestStack';
import type { Condition } from './TestStack';
import WizardFooter from './WizardFooter';
import ConfigDialog from './ConfigDialog';
import Step1Introduction from './wizard/Step1Introduction';
import Step2RuleType from './wizard/Step2RuleType';
import Step4RuleResponse from './wizard/Step4RuleResponse';
import Step5NameNotes from './wizard/Step5NameNotes';
import { QRADAR_TESTS } from '../../data/qradar-tests';
import type { QRadarTestParam } from '../../data/qradar-tests';
import { rulesAPI } from '../../api/client';
import '../../styles/qradar-base.css';
import '../../styles/qradar-panels.css';
import '../../styles/qradar-modal.css';

const QRadarApp: React.FC = () => {
    // Wizard navigation
    const [currentStep, setCurrentStep] = useState(1);

    // Step 2: Rule type
    const [ruleType, setRuleType] = useState<'event' | 'flow' | 'common' | 'offense' | 'building_block'>('event');

    // Step 3: Test Stack (existing)
    const [ruleName, setRuleName] = useState('My Custom Event Rule');
    const [notes, setNotes] = useState('');
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [logic, setLogic] = useState<'ALL' | 'ANY'>('ALL');
    const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Step 5: Name/Notes (wizard version)
    const [ruleGroup, setRuleGroup] = useState('Other');
    const [ruleEnabled, setRuleEnabled] = useState(true);

    // Step 4: Rule Response
    const [responseConfig, setResponseConfig] = useState({
        offense: { enabled: true, indexOn: 'Source IP', annotation: '', replaceName: false },
        dispatchEvent: { enabled: false, name: '', description: '', highLevelCategory: 'Security', lowLevelCategory: '', offenseNaming: 'append' as 'append' | 'replace' | 'none' },
        referenceSet: { enabled: false, field: 'sourceip', setName: '' },
        severity: 5,
        credibility: 5,
        relevance: 5,
        preventAggregation: false
    });

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

    const handleMoveConditionUp = (id: string) => {
        const index = conditions.findIndex(c => c.id === id);
        if (index <= 0) return; // Already at top or not found

        const newConditions = [...conditions];
        [newConditions[index - 1], newConditions[index]] = [newConditions[index], newConditions[index - 1]];
        setConditions(newConditions);
    };

    const handleMoveConditionDown = (id: string) => {
        const index = conditions.findIndex(c => c.id === id);
        if (index < 0 || index >= conditions.length - 1) return; // Already at bottom or not found

        const newConditions = [...conditions];
        [newConditions[index], newConditions[index + 1]] = [newConditions[index + 1], newConditions[index]];
        setConditions(newConditions);
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

    const validateRule = (): boolean => {
        const errors: string[] = [];

        // Rule name validation
        if (!ruleName.trim()) {
            errors.push('Rule name is required');
        } else if (ruleName.trim().length < 3) {
            errors.push('Rule name must be at least 3 characters');
        }

        // Condition validation
        if (conditions.length === 0) {
            errors.push('You must add at least one test condition to the rule');
        }

        // Check if all conditions have configured parameters
        for (const condition of conditions) {
            for (const param of condition.testDef.params) {
                if (!condition.values[param.key]) {
                    errors.push(`Parameter "${param.label}" in condition is not configured`);
                    break;
                }
            }
        }

        setValidationErrors(errors);
        setShowError(errors.length > 0);
        return errors.length === 0;
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            // Step 1: No validation, just proceed
            setCurrentStep(2);
            return;
        }

        if (currentStep === 2) {
            // Step 2: Ensure rule type is selected (always valid since we have default)
            setCurrentStep(3);
            return;
        }

        if (currentStep === 3) {
            // Step 3: Validate test stack
            if (!validateRule()) {
                return;
            }
            setCurrentStep(4);
            return;
        }

        if (currentStep === 4) {
            // Step 4: Rule response validation (placeholder)
            setCurrentStep(5);
            return;
        }

        if (currentStep === 5) {
            // Step 5: Final validation and save
            const errors: string[] = [];

            if (!ruleName.trim()) {
                errors.push('Rule name is required');
            } else if (ruleName.trim().length < 3) {
                errors.push('Rule name must be at least 3 characters');
            }

            if (errors.length > 0) {
                setValidationErrors(errors);
                setShowError(true);
                return;
            }

            // Save the rule
            const aqlParts = conditions.map(cond => {
                let aql = cond.testDef.text;
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
                    enabled: ruleEnabled,
                    aql: finalAQL,
                    conditions: { type: 'comparison', field: 'eventName', operator: '=', value: 'test' },
                    building_blocks: []
                });

                alert('Rule created successfully!');
                // Reset wizard
                setCurrentStep(1);
                setConditions([]);
                setRuleName('My Custom Event Rule');
                setNotes('');
                setRuleGroup('Other');
                setRuleEnabled(true);
                setShowError(false);
                setValidationErrors([]);
            } catch (error) {
                console.error('Failed to create rule:', error);
                alert('Failed to create rule');
            }
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
            <WizardSteps currentStep={currentStep} />

            <div className="qr-wizard-content">
                {/* Step 1: Introduction */}
                {currentStep === 1 && <Step1Introduction />}

                {/* Step 2: Rule Type */}
                {currentStep === 2 && (
                    <Step2RuleType
                        value={ruleType}
                        onChange={setRuleType}
                    />
                )}

                {/* Step 3: Rule Test Stack Editor (existing) */}
                {currentStep === 3 && (
                    <>
                        <RuleNameBar
                            ruleName={ruleName}
                            notes={notes}
                            onRuleNameChange={setRuleName}
                            onNotesChange={setNotes}
                        />

                        {showError && validationErrors.length > 0 && (
                            <div className="error-msg show">
                                ⚠ Validation Errors:
                                <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
                                    {validationErrors.map((error, idx) => (
                                        <li key={idx}>{error}</li>
                                    ))}
                                </ul>
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
                                onMoveConditionUp={handleMoveConditionUp}
                                onMoveConditionDown={handleMoveConditionDown}
                                onConfigureParam={handleConfigureParam}
                            />
                        </div>
                    </>
                )}

                {/* Step 4: Rule Response */}
                {currentStep === 4 && (
                    <Step4RuleResponse
                        config={responseConfig}
                        onChange={setResponseConfig}
                    />
                )}

                {/* Step 5: Rule Name and Notes */}
                {currentStep === 5 && (
                    <Step5NameNotes
                        ruleName={ruleName}
                        notes={notes}
                        group={ruleGroup}
                        enabled={ruleEnabled}
                        onRuleNameChange={setRuleName}
                        onNotesChange={setNotes}
                        onGroupChange={setRuleGroup}
                        onEnabledChange={setRuleEnabled}
                    />
                )}
            </div>

            <WizardFooter
                onBack={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                onNext={handleNext}
                onCancel={() => {
                    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
                        window.location.reload();
                    }
                }}
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
