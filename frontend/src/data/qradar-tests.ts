// CLONE SIEM Test Definitions
export interface QRadarTestParam {
    key: string;
    label: string;
    type: 'text' | 'multiselect';
    options?: string[];
    placeholder?: string;
}

export interface QRadarTest {
    id: string;
    group: 'event' | 'ip' | 'logsource' | 'network' | 'refdata' | 'function' | 'datetime';
    text: string;
    params: QRadarTestParam[];
}

export const QRADAR_TESTS: QRadarTest[] = [
    // Event Property Tests
    {
        id: 'evt-search',
        group: 'event',
        text: 'when the event matches this search filter',
        params: [{
            key: 'filter',
            label: 'Search Filter',
            type: 'text',
            placeholder: 'e.g. severity > 5'
        }]
    },
    {
        id: 'evt-qid',
        group: 'event',
        text: 'when the event QID is one of the following QIDs',
        params: [{
            key: 'qids',
            label: 'QIDs',
            type: 'multiselect',
            options: [
                '5000001 (Authentication Failure)',
                '5000002 (Login Success)',
                '3250008 (Firewall Permit)',
                '4000100 (Malware Detection)',
                '6001001 (Port Scan)'
            ]
        }]
    },
    {
        id: 'evt-highcat',
        group: 'event',
        text: 'when the event category is one of these high-level categories',
        params: [{
            key: 'cats',
            label: 'Categories',
            type: 'multiselect',
            options: [
                'Authentication',
                'Firewall',
                'Network Device',
                'Malware',
                'Suspicious Activity',
                'Policy Violation'
            ]
        }]
    },
    {
        id: 'evt-severity',
        group: 'event',
        text: 'when the event severity is greater than X',
        params: [{
            key: 'sev',
            label: 'Severity Threshold (1-10)',
            type: 'text',
            placeholder: 'e.g. 7'
        }]
    },
    {
        id: 'evt-payload',
        group: 'event',
        text: 'when the payload contains this string',
        params: [{
            key: 'str',
            label: 'String',
            type: 'text',
            placeholder: 'e.g. SPEEDING'
        }]
    },

    // IP / Port Tests
    {
        id: 'ip-src',
        group: 'ip',
        text: 'when the source IP is one of these IP addresses',
        params: [{
            key: 'srcip',
            label: 'IP Addresses / CIDR',
            type: 'multiselect',
            options: [
                '10.0.0.0/8',
                '172.16.0.0/12',
                '192.168.0.0/16',
                '10.10.1.0/24',
                'Any Local'
            ]
        }]
    },
    {
        id: 'ip-dst',
        group: 'ip',
        text: 'when the destination IP is one of these IP addresses',
        params: [{
            key: 'dstip',
            label: 'IP Addresses / CIDR',
            type: 'multiselect',
            options: [
                '10.0.0.0/8',
                '172.16.0.0/12',
                '192.168.0.0/16',
                '8.8.8.8',
                '1.1.1.1'
            ]
        }]
    },
    {
        id: 'port-src',
        group: 'ip',
        text: 'when the source port is one of these ports',
        params: [{
            key: 'sport',
            label: 'Ports',
            type: 'multiselect',
            options: [
                '22 (SSH)',
                '80 (HTTP)',
                '443 (HTTPS)',
                '3389 (RDP)',
                '445 (SMB)',
                '53 (DNS)'
            ]
        }]
    },
    {
        id: 'port-dst',
        group: 'ip',
        text: 'when the destination port is one of these ports',
        params: [{
            key: 'dport',
            label: 'Ports',
            type: 'multiselect',
            options: [
                '22 (SSH)',
                '80 (HTTP)',
                '443 (HTTPS)',
                '3389 (RDP)',
                '445 (SMB)',
                '53 (DNS)',
                '21 (FTP)'
            ]
        }]
    },

    // Log Source Tests
    {
        id: 'ls-src',
        group: 'logsource',
        text: 'when the event(s) were detected by one or more of these log sources',
        params: [{
            key: 'ls',
            label: 'Log Sources',
            type: 'multiselect',
            options: [
                'SRV-WIN-001',
                'SRV-WIN-002',
                'Firewall-MAIN',
                'IDS-Sensor-01',
                'WebProxy-01'
            ]
        }]
    },
    {
        id: 'ls-type',
        group: 'logsource',
        text: 'when the event(s) were detected by one or more of these log source types',
        params: [{
            key: 'lst',
            label: 'Log Source Types',
            type: 'multiselect',
            options: [
                'Microsoft Windows Security Event Log',
                'Cisco ASA',
                'Palo Alto Networks Firewall',
                'Linux OS syslog',
                'IBM DB2',
                'Apache HTTP Server'
            ]
        }]
    },

    // Network Property Tests
    {
        id: 'net-src',
        group: 'network',
        text: 'when the source network is one of these networks',
        params: [{
            key: 'srcnet',
            label: 'Networks',
            type: 'multiselect',
            options: ['DMZ', 'Internal', 'Trusted', 'Untrusted', 'Guest']
        }]
    },
    {
        id: 'net-dst',
        group: 'network',
        text: 'when the destination network is one of these networks',
        params: [{
            key: 'dstnet',
            label: 'Networks',
            type: 'multiselect',
            options: ['DMZ', 'Internal', 'Trusted', 'Untrusted', 'Internet']
        }]
    },

    // Reference Data Tests
    {
        id: 'ref-srcip',
        group: 'refdata',
        text: 'when the source IP is contained in this reference set',
        params: [{
            key: 'refset',
            label: 'Reference Set',
            type: 'text',
            placeholder: 'Reference Set name...'
        }]
    },

    // Function Tests
    {
        id: 'fn-rules',
        group: 'function',
        text: 'when an event matches any of the following rules',
        params: [{
            key: 'rules',
            label: 'Rule Names',
            type: 'multiselect',
            options: [
                'BB: Source IP on Watch List',
                'BB: High Severity Events',
                'BB: Known Malware IPs',
                'BB: Privileged Users'
            ]
        }]
    },
    {
        id: 'fn-count',
        group: 'function',
        text: 'when this event is seen more than X times in Y minutes',
        params: [
            {
                key: 'count',
                label: 'Number of Times',
                type: 'text',
                placeholder: 'e.g. 5'
            },
            {
                key: 'mins',
                label: 'Within (minutes)',
                type: 'text',
                placeholder: 'e.g. 10'
            }
        ]
    },

    // Date / Time Tests
    {
        id: 'dt-time',
        group: 'datetime',
        text: 'when the current time is between these hours',
        params: [
            {
                key: 'start',
                label: 'Start Time (HH:MM)',
                type: 'text',
                placeholder: 'e.g. 08:00'
            },
            {
                key: 'end',
                label: 'End Time (HH:MM)',
                type: 'text',
                placeholder: 'e.g. 18:00'
            }
        ]
    },
    {
        id: 'dt-day',
        group: 'datetime',
        text: 'when the day of week is one of these days',
        params: [{
            key: 'days',
            label: 'Days',
            type: 'multiselect',
            options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }]
    }
];

export const TEST_GROUP_NAMES: Record<string, string> = {
    event: 'Event Property Tests',
    ip: 'IP / Port Tests',
    logsource: 'Log Source Tests',
    network: 'Network Property Tests',
    refdata: 'Reference Data Tests',
    function: 'Function Tests',
    datetime: 'Date / Time Tests'
};
