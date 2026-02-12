import React from 'react';

const QRadarHeader: React.FC = () => {
    return (
        <header className="qr-header">
            <div className="qr-logo">
                <span className="qr-logo-box">IBM</span>
            </div>
            <span className="qr-product-name">IBM Security QRadar SIEM</span>
            <div className="qr-header-right">
                <a href="#">admin ▾</a>
                <div className="qr-help-btn">?</div>
            </div>
        </header>
    );
};

export default QRadarHeader;
