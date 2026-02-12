import React from 'react';

interface WizardFooterProps {
    onBack?: () => void;
    onNext?: () => void;
    onCancel?: () => void;
}

const WizardFooter: React.FC<WizardFooterProps> = ({ onBack, onNext, onCancel }) => {
    return (
        <footer className="qr-wizard-footer">
            <button className="btn-back" onClick={onBack}>
                ‹ Back
            </button>
            <button className="btn-next" onClick={onNext}>
                Next ›
            </button>
            <button className="btn-cancel" onClick={onCancel}>
                Cancel
            </button>
        </footer>
    );
};

export default WizardFooter;
