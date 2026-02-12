import React from 'react';

interface WizardStepsProps {
    currentStep?: number;
}

const WizardSteps: React.FC<WizardStepsProps> = ({ currentStep = 3 }) => {
    const steps = [
        { num: 1, label: 'Introduction' },
        { num: 2, label: 'Type of Rule' },
        { num: 3, label: 'Rule Test Stack Editor' },
        { num: 4, label: 'Rule Response' },
        { num: 5, label: 'Rule Name / Summary' }
    ];

    const getStepClass = (stepNum: number) => {
        if (stepNum < currentStep) return 'qr-step done';
        if (stepNum === currentStep) return 'qr-step current';
        return 'qr-step';
    };

    return (
        <div className="qr-wizard-steps">
            {steps.map((step, index) => (
                <React.Fragment key={step.num}>
                    {index > 0 && <span className="qr-step-sep">›</span>}
                    <span className={getStepClass(step.num)}>
                        {step.num}. {step.label}
                    </span>
                </React.Fragment>
            ))}
        </div>
    );
};

export default WizardSteps;
