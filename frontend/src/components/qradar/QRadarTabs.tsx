import React from 'react';

interface QRadarTabsProps {
    activeTab?: string;
}

const QRadarTabs: React.FC<QRadarTabsProps> = ({ activeTab = 'Offenses' }) => {
    const tabs = ['Dashboard', 'Offenses', 'Log Activity', 'Network Activity', 'Assets', 'Reports', 'Admin'];

    return (
        <nav className="qr-tabs">
            {tabs.map((tab) => (
                <a
                    key={tab}
                    className={`qr-tab ${activeTab === tab ? 'active' : ''}`}
                    href="#"
                >
                    {tab}
                </a>
            ))}
        </nav>
    );
};

export default QRadarTabs;
