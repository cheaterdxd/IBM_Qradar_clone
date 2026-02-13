import React, { useState, useMemo } from 'react';
import { QRADAR_TESTS, TEST_GROUP_NAMES } from '../../data/qradar-tests';
import type { QRadarTest } from '../../data/qradar-tests';

interface TestBrowserProps {
    selectedTestId: string | null;
    onSelectTest: (testId: string) => void;
    onAddTest: () => void;
}

const TestBrowser: React.FC<TestBrowserProps> = ({
    selectedTestId,
    onSelectTest,
    onAddTest
}) => {
    const [filterKeyword, setFilterKeyword] = useState('');
    const [testGroup, setTestGroup] = useState('');

    const filteredTests = useMemo(() => {
        return QRADAR_TESTS.filter(test => {
            const matchesGroup = !testGroup || test.group === testGroup;
            const matchesKeyword = !filterKeyword ||
                test.text.toLowerCase().includes(filterKeyword.toLowerCase());
            return matchesGroup && matchesKeyword;
        });
    }, [filterKeyword, testGroup]);

    const groupedTests = useMemo(() => {
        const groups: Record<string, QRadarTest[]> = {};
        filteredTests.forEach(test => {
            if (!groups[test.group]) {
                groups[test.group] = [];
            }
            groups[test.group].push(test);
        });
        return groups;
    }, [filteredTests]);

    const handleTestClick = (testId: string) => {
        onSelectTest(testId);
    };

    const handleTestDoubleClick = () => {
        onAddTest();
    };

    return (
        <div className="qr-test-browser">
            <div className="panel-header">Rule Tests</div>

            <div className="filter-area">
                <div className="filter-row">
                    <label>Filter:</label>
                    <input
                        type="text"
                        value={filterKeyword}
                        onChange={(e) => setFilterKeyword(e.target.value)}
                        placeholder="Type to filter tests..."
                    />
                </div>
                <div className="filter-row">
                    <label>Test Group:</label>
                    <select value={testGroup} onChange={(e) => setTestGroup(e.target.value)}>
                        <option value="">All Tests</option>
                        <option disabled>──────────</option>
                        <option value="event">Event Property Tests</option>
                        <option value="ip">IP / Port Tests</option>
                        <option value="logsource">Log Source Tests</option>
                        <option value="network">Network / Zone Tests</option>
                        <option value="datetime">Date / Time Tests</option>
                        <option value="refdata">Reference Data Tests</option>
                        <option value="function">Function Tests</option>
                        <option value="hostprofile">Host Profile Tests</option>
                        <option value="customprop">Custom Property Tests</option>
                        <option value="offense">Offense Tests</option>
                        <option value="flow">Flow Property Tests</option>
                    </select>
                </div>
            </div>

            <ul className="test-list">
                {Object.entries(groupedTests).map(([group, tests]) => (
                    <React.Fragment key={group}>
                        <li className="test-group-label">
                            {TEST_GROUP_NAMES[group] || group}
                        </li>
                        {tests.map(test => (
                            <li
                                key={test.id}
                                className={`test-item ${selectedTestId === test.id ? 'selected' : ''}`}
                                onClick={() => handleTestClick(test.id)}
                                onDoubleClick={handleTestDoubleClick}
                            >
                                {test.text}
                            </li>
                        ))}
                    </React.Fragment>
                ))}
            </ul>

            <div className="add-btn-area">
                <button className="btn-add" onClick={onAddTest}>
                    Add »
                </button>
            </div>
        </div>
    );
};

export default TestBrowser;
