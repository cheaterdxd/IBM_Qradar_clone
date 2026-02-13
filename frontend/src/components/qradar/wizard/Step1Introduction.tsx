import React from 'react';

const Step1Introduction: React.FC = () => {
    return (
        <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#003366',
                marginBottom: '16px',
                fontFamily: 'Arial, sans-serif'
            }}>
                Welcome to the Rule Wizard
            </h2>

            <p style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#333333',
                marginBottom: '16px',
                fontFamily: 'Arial, sans-serif'
            }}>
                Rules in QRadar SIEM are used to automatically detect security events and incidents by analyzing incoming log source and flow data in real-time. When a rule's conditions are met, QRadar can trigger various response actions such as creating offenses, sending notifications, or updating reference data.
            </p>

            <p style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#333333',
                marginBottom: '12px',
                fontFamily: 'Arial, sans-serif'
            }}>
                This wizard will guide you through creating a new rule in five steps:
            </p>

            <ol style={{
                fontSize: '12px',
                lineHeight: '1.8',
                color: '#333333',
                marginLeft: '24px',
                marginBottom: '20px',
                fontFamily: 'Arial, sans-serif'
            }}>
                <li><strong>Introduction</strong> — Overview of the rule creation process</li>
                <li><strong>Type of Rule</strong> — Select which data type the rule will analyze</li>
                <li><strong>Rule Test Stack</strong> — Define the conditions that must be met</li>
                <li><strong>Rule Response</strong> — Configure actions when the rule triggers</li>
                <li><strong>Rule Name / Notes</strong> — Finalize and save your rule</li>
            </ol>

            <h3 style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#003366',
                marginBottom: '10px',
                marginTop: '20px',
                fontFamily: 'Arial, sans-serif'
            }}>
                Available Rule Types
            </h3>

            <ul style={{
                fontSize: '12px',
                lineHeight: '1.8',
                color: '#333333',
                marginLeft: '24px',
                fontFamily: 'Arial, sans-serif',
                listStyleType: 'disc'
            }}>
                <li><strong>Event Rule</strong> — Tests against incoming log source data processed in real-time by the QRadar Event Processor</li>
                <li><strong>Flow Rule</strong> — Tests against incoming flow data processed by the QRadar Flow Processor</li>
                <li><strong>Common Rule</strong> — Tests against both event and flow data simultaneously</li>
                <li><strong>Offense Rule</strong> — Tests the parameters of an existing offense to trigger additional responses</li>
                <li><strong>Building Block</strong> — A reusable named set of tests with no associated response actions</li>
            </ul>

            <p style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#666666',
                marginTop: '20px',
                fontStyle: 'italic',
                fontFamily: 'Arial, sans-serif'
            }}>
                Click <strong>Next</strong> to begin creating your rule.
            </p>
        </div>
    );
};

export default Step1Introduction;
