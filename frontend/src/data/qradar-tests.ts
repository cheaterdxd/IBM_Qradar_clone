// CLONE SIEM Test Definitions
export interface QRadarTestParam {
    key: string;
    label: string;
    type: 'text' | 'multiselect' | 'aql' | 'select' | 'number';
    options?: string[];
    placeholder?: string;
    min?: number;
    max?: number;
}

export interface QRadarTest {
    id: string;
    group: 'event' | 'ip' | 'logsource' | 'network' | 'refdata' | 'function' | 'datetime' | 'hostprofile' | 'customprop' | 'offense' | 'flow';
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
    },

    // Host Profile Tests
    {
        id: 'hp-vuln-cvss',
        group: 'hostprofile',
        text: 'when the source IP has a vulnerability with a CVSS score greater than X',
        params: [{
            key: 'cvss',
            label: 'CVSS Score Threshold',
            type: 'number',
            placeholder: 'e.g. 7.0',
            min: 0,
            max: 10
        }]
    },
    {
        id: 'hp-src-os',
        group: 'hostprofile',
        text: 'when the source IP has this OS',
        params: [{
            key: 'os',
            label: 'Operating System',
            type: 'multiselect',
            options: [
                'Windows Server 2019',
                'Windows Server 2016',
                'Windows 10',
                'Ubuntu Linux',
                'Red Hat Enterprise Linux',
                'CentOS',
                'macOS'
            ]
        }]
    },
    {
        id: 'hp-dst-network',
        group: 'hostprofile',
        text: 'when the destination IP belongs to this network',
        params: [{
            key: 'network',
            label: 'Network',
            type: 'multiselect',
            options: ['DMZ', 'Internal', 'Trusted', 'Untrusted', 'Guest', 'Management']
        }]
    },

    // Custom Property Tests
    {
        id: 'cp-aql-filter',
        group: 'customprop',
        text: 'when the event matches this AQL filter',
        params: [{
            key: 'aql',
            label: 'AQL Filter',
            type: 'aql',
            placeholder: 'e.g. customProperty = "value"'
        }]
    },
    {
        id: 'cp-regex',
        group: 'customprop',
        text: 'when the payload matches this regex pattern',
        params: [{
            key: 'pattern',
            label: 'Regex Pattern',
            type: 'text',
            placeholder: 'e.g. \\d{3}-\\d{2}-\\d{4}'
        }]
    },

    // Offense Tests (for Offense rule type)
    {
        id: 'off-magnitude',
        group: 'offense',
        text: 'when the offense magnitude is greater than X',
        params: [{
            key: 'mag',
            label: 'Magnitude Threshold (1-10)',
            type: 'number',
            min: 1,
            max: 10
        }]
    },
    {
        id: 'off-assigned',
        group: 'offense',
        text: 'when the offense is assigned to this user',
        params: [{
            key: 'user',
            label: 'Username',
            type: 'text',
            placeholder: 'e.g. admin'
        }]
    },
    {
        id: 'off-created-by',
        group: 'offense',
        text: 'when the offense was created by one of these rules',
        params: [{
            key: 'rules',
            label: 'Rule Names',
            type: 'multiselect',
            options: [
                'Rule 1: Suspicious Login',
                'Rule 2: Port Scan Detected',
                'Rule 3: Malware Activity',
                'Rule 4: Data Exfiltration'
            ]
        }]
    },
    {
        id: 'off-src-network',
        group: 'offense',
        text: 'when the offense source network is one of these networks',
        params: [{
            key: 'networks',
            label: 'Networks',
            type: 'multiselect',
            options: ['DMZ', 'Internal', 'External', 'Guest', 'VPN']
        }]
    },
    {
        id: 'off-category',
        group: 'offense',
        text: 'when the offense category is one of these categories',
        params: [{
            key: 'cats',
            label: 'Categories',
            type: 'multiselect',
            options: [
                'Authentication',
                'Firewall',
                'Malware',
                'Policy Violation',
                'Suspicious Activity',
                'Data Loss'
            ]
        }]
    },

    // Flow Property Tests (for Flow and Common rule types)
    {
        id: 'flow-src-ip',
        group: 'flow',
        text: 'when the flow source IP is one of these IP addresses',
        params: [{
            key: 'srcip',
            label: 'Source IP Addresses',
            type: 'multiselect',
            options: [
                '10.0.0.0/8',
                '172.16.0.0/12',
                '192.168.0.0/16',
                'Any Local'
            ]
        }]
    },
    {
        id: 'flow-dst-ip',
        group: 'flow',
        text: 'when the flow destination IP is one of these IP addresses',
        params: [{
            key: 'dstip',
            label: 'Destination IP Addresses',
            type: 'multiselect',
            options: [
                '8.8.8.8',
                '1.1.1.1',
                '10.0.0.0/8',
                'Any External'
            ]
        }]
    },
    {
        id: 'flow-protocol',
        group: 'flow',
        text: 'when the protocol is one of these protocols',
        params: [{
            key: 'proto',
            label: 'Protocol',
            type: 'multiselect',
            options: ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'FTP']
        }]
    },
    {
        id: 'flow-bytes',
        group: 'flow',
        text: 'when the total bytes transferred is greater than X',
        params: [{
            key: 'bytes',
            label: 'Bytes Threshold',
            type: 'number',
            placeholder: 'e.g. 1048576 (1 MB)',
            min: 0
        }]
    },
    {
        id: 'flow-duration',
        group: 'flow',
        text: 'when the flow duration is greater than X seconds',
        params: [{
            key: 'duration',
            label: 'Duration (seconds)',
            type: 'number',
            placeholder: 'e.g. 300',
            min: 0
        }]
    },
    {
        id: 'flow-application',
        group: 'flow',
        text: 'when the application is one of these applications',
        params: [{
            key: 'apps',
            label: 'Applications',
            type: 'multiselect',
            options: [
                'HTTP',
                'HTTPS',
                'SSH',
                'FTP',
                'SMTP',
                'DNS',
                'BitTorrent',
                'Unknown'
            ]
        }]
    },

    // Additional Event Tests (to reach 60+ total)
    {
        id: 'evt-lowcat',
        group: 'event',
        text: 'when the event category for the event is one of these low level categories',
        params: [{
            key: 'lowcats',
            label: 'Low Level Categories',
            type: 'multiselect',
            options: [
                'Authentication Failed',
                'Authentication Success',
                'File Created',
                'File Deleted',
                'Network Connection',
                'Process Started'
            ]
        }]
    },
    {
        id: 'evt-username',
        group: 'event',
        text: 'when the username is one of these usernames',
        params: [{
            key: 'users',
            label: 'Usernames',
            type: 'multiselect',
            options: [
                'admin',
                'root',
                'administrator',
                'sysadmin',
                'guest'
            ]
        }]
    },
    {
        id: 'evt-credibility',
        group: 'event',
        text: 'when the event credibility is greater than X',
        params: [{
            key: 'cred',
            label: 'Credibility Threshold (1-10)',
            type: 'number',
            min: 1,
            max: 10
        }]
    },
    {
        id: 'evt-relevance',
        group: 'event',
        text: 'when the event relevance is greater than X',
        params: [{
            key: 'rel',
            label: 'Relevance Threshold (1-10)',
            type: 'number',
            min: 1,
            max: 10
        }]
    },
    {
        id: 'evt-payload-not',
        group: 'event',
        text: 'when the payload does not contain this string',
        params: [{
            key: 'str',
            label: 'String',
            type: 'text',
            placeholder: 'e.g. SUCCESS'
        }]
    },

    // Additional IP / Port Tests
    {
        id: 'ip-src-or-dst',
        group: 'ip',
        text: 'when the source or destination IP is one of these IP addresses',
        params: [{
            key: 'ips',
            label: 'IP Addresses',
            type: 'multiselect',
            options: [
                '10.0.0.0/8',
                '172.16.0.0/12',
                '192.168.0.0/16'
            ]
        }]
    },
    {
        id: 'ip-src-not',
        group: 'ip',
        text: 'when the source IP is NOT one of these IP addresses',
        params: [{
            key: 'ips',
            label: 'IP Addresses to Exclude',
            type: 'multiselect',
            options: [
                '10.10.1.100',
                '192.168.1.1',
                'Trusted IPs'
            ]
        }]
    },
    {
        id: 'ip-dst-not',
        group: 'ip',
        text: 'when the destination IP is NOT one of these IP addresses',
        params: [{
            key: 'ips',
            label: 'IP Addresses to Exclude',
            type: 'multiselect',
            options: [
                '8.8.8.8',
                '1.1.1.1',
                'Known Good IPs'
            ]
        }]
    },
    {
        id: 'port-src-not',
        group: 'ip',
        text: 'when the source port is NOT one of these ports',
        params: [{
            key: 'ports',
            label: 'Ports to Exclude',
            type: 'multiselect',
            options: [
                '80 (HTTP)',
                '443 (HTTPS)',
                '53 (DNS)'
            ]
        }]
    },
    {
        id: 'port-dst-not',
        group: 'ip',
        text: 'when the destination port is NOT one of these ports',
        params: [{
            key: 'ports',
            label: 'Ports to Exclude',
            type: 'multiselect',
            options: [
                '22 (SSH)',
                '25 (SMTP)',
                '110 (POP3)'
            ]
        }]
    },

    // Additional Log Source Tests
    {
        id: 'ls-group',
        group: 'logsource',
        text: 'when the event(s) were detected by one or more of these log source groups',
        params: [{
            key: 'groups',
            label: 'Log Source Groups',
            type: 'multiselect',
            options: [
                'Windows Servers',
                'Linux Servers',
                'Firewalls',
                'IDS/IPS',
                'Web Proxies'
            ]
        }]
    },
    {
        id: 'ls-not-type',
        group: 'logsource',
        text: 'when the event(s) were NOT detected by any of these log source types',
        params: [{
            key: 'types',
            label: 'Log Source Types to Exclude',
            type: 'multiselect',
            options: [
                'Test Systems',
                'Development Servers',
                'Sandbox'
            ]
        }]
    },

    // Additional Network Tests
    {
        id: 'net-src-or-dst',
        group: 'network',
        text: 'when the source or destination network is one of these networks',
        params: [{
            key: 'networks',
            label: 'Networks',
            type: 'multiselect',
            options: ['DMZ', 'Internal', 'External', 'VPN']
        }]
    },
    {
        id: 'net-src-local',
        group: 'network',
        text: 'when the source IP is in the local network',
        params: []
    },
    {
        id: 'net-dst-local',
        group: 'network',
        text: 'when the destination IP is in the local network',
        params: []
    },

    // Additional Reference Data Tests
    {
        id: 'ref-dst-ip',
        group: 'refdata',
        text: 'when the destination IP is contained in this reference set',
        params: [{
            key: 'refset',
            label: 'Reference Set',
            type: 'text',
            placeholder: 'Reference Set name...'
        }]
    },
    {
        id: 'ref-username',
        group: 'refdata',
        text: 'when the username is contained in this reference set',
        params: [{
            key: 'refset',
            label: 'Reference Set',
            type: 'text',
            placeholder: 'Reference Set name...'
        }]
    },
    {
        id: 'ref-field',
        group: 'refdata',
        text: 'when the event field is contained in this reference set',
        params: [
            {
                key: 'field',
                label: 'Field Name',
                type: 'text',
                placeholder: 'e.g. sourceip'
            },
            {
                key: 'refset',
                label: 'Reference Set',
                type: 'text',
                placeholder: 'Reference Set name...'
            }
        ]
    },
    {
        id: 'ref-srcip-not',
        group: 'refdata',
        text: 'when the source IP is NOT contained in this reference set',
        params: [{
            key: 'refset',
            label: 'Reference Set',
            type: 'text',
            placeholder: 'Reference Set name...'
        }]
    },

    // Additional Function Tests
    {
        id: 'fn-all-rules',
        group: 'function',
        text: 'when an event matches all of the following rules',
        params: [{
            key: 'rules',
            label: 'Rule Names (must match ALL)',
            type: 'multiselect',
            options: [
                'BB: High Severity',
                'BB: Suspicious Source',
                'BB: Known Malware IP'
            ]
        }]
    },
    {
        id: 'fn-sequence',
        group: 'function',
        text: 'when this sequence of events is seen in X minutes',
        params: [
            {
                key: 'sequence',
                label: 'Event Sequence',
                type: 'text',
                placeholder: 'e.g. Login Failed, Login Success'
            },
            {
                key: 'mins',
                label: 'Within (minutes)',
                type: 'number',
                min: 1,
                placeholder: 'e.g. 5'
            }
        ]
    },
    {
        id: 'fn-not-seen',
        group: 'function',
        text: 'when this event has not been seen in X minutes',
        params: [
            {
                key: 'event',
                label: 'Event Identifier',
                type: 'text',
                placeholder: 'e.g. QID or Event Name'
            },
            {
                key: 'mins',
                label: 'Not Seen For (minutes)',
                type: 'number',
                min: 1,
                placeholder: 'e.g. 60'
            }
        ]
    },

    // Additional Date/Time Tests
    {
        id: 'dt-after',
        group: 'datetime',
        text: 'when the current time is after this time of day',
        params: [{
            key: 'time',
            label: 'Time (HH:MM)',
            type: 'text',
            placeholder: 'e.g. 18:00'
        }]
    },
    {
        id: 'dt-before',
        group: 'datetime',
        text: 'when the current time is before this time of day',
        params: [{
            key: 'time',
            label: 'Time (HH:MM)',
            type: 'text',
            placeholder: 'e.g. 08:00'
        }]
    },
    {
        id: 'dt-date',
        group: 'datetime',
        text: 'when the date is one of these dates',
        params: [{
            key: 'dates',
            label: 'Dates',
            type: 'multiselect',
            options: [
                '2024-01-01 (New Year)',
                '2024-07-04 (Independence Day)',
                '2024-12-25 (Christmas)',
                'Custom Date'
            ]
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
    datetime: 'Date / Time Tests',
    hostprofile: 'Host Profile Tests',
    customprop: 'Custom Property Tests',
    offense: 'Offense Tests',
    flow: 'Flow Property Tests'
};
