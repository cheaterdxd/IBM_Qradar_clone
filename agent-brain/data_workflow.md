# QRadar SIEM Clone - Data Workflow Diagrams

## 1. Rule Creation Flow (Frontend → Backend)

```mermaid
sequenceDiagram
    participant User
    participant Wizard
    participant TestStack
    participant ConfigDialog
    participant API
    participant RuleEngine
    participant DB

    User->>Wizard: Start new rule
    Wizard->>User: Show Step 1 (Introduction)
    User->>Wizard: Click Next
    Wizard->>User: Show Step 2 (Rule Type)
    User->>Wizard: Select "Event Rule", Next
    Wizard->>TestStack: Show Step 3 (Test Editor)
    User->>TestStack: Select test from browser
    User->>TestStack: Click "Add »"
    TestStack->>TestStack: Add condition with empty params
    User->>TestStack: Click parameter link
    TestStack->>ConfigDialog: Open dialog (Type 2)
    User->>ConfigDialog: Configure values, Submit
    ConfigDialog->>TestStack: Update condition values
    User->>Wizard: Click Next
    Wizard->>Wizard: Validate (has conditions?)
    Wizard->>User: Show Step 4 (Response)
    User->>Wizard: Configure responses, Next
    Wizard->>User: Show Step 5 (Name & Notes)
    User->>Wizard: Enter name, click Finish
    Wizard->>API: POST /api/rules
    API->>RuleEngine: Validate rule logic
    RuleEngine->>DB: Save rule to SQLite + YAML
    DB->>API: Success
    API->>Wizard: 201 Created
    Wizard->>User: Redirect to Rules List
```

---

## 2. Rule Evaluation Flow (Runtime)

```mermaid
flowchart TD
    A[Event Received] --> B{Load Active Rules}
    B --> C[For each rule]
    C --> D{Rule Type matches?}
    D -->|No| C
    D -->|Yes| E[Load Rule Conditions]
    E --> F{Check Logic: ALL or ANY?}
    F -->|ALL| G[Evaluate all conditions]
    F -->|ANY| H[Evaluate until one matches]
    G --> I{All conditions true?}
    H --> J{At least one true?}
    I -->|No| C
    J -->|No| C
    I -->|Yes| K[Execute Response Actions]
    J -->|Yes| K
    K --> L{Create Offense?}
    L -->|Yes| M[Create/Update Offense in DB]
    L -->|No| N{Dispatch Event?}
    N -->|Yes| O[Create New Event]
    N -->|No| P{Notify?}
    P -->|Yes| Q[Send Email Notification]
    P -->|No| R{Add to RefSet?}
    R -->|Yes| S[Update Reference Set]
    R -->|No| C
    M --> N
    O --> P
    Q --> R
    S --> C
    C --> T[All rules processed]
```

---

## 3. Condition Evaluation Priority Order

```mermaid
flowchart LR
    A[Evaluate Condition] --> B{Is Building Block ref?}
    B -->|Yes| C[Load BB Rule]
    C --> D[Recursively evaluate BB]
    D --> E{BB matched?}
    E -->|Yes| F[Return TRUE]
    E -->|No| G[Return FALSE]
    B -->|No| H{Has Regex pattern?}
    H -->|Yes| I[Apply regex to payload]
    I --> J{Regex matches?}
    J -->|Yes| F
    J -->|No| G
    H -->|No| K{Has AQL filter?}
    K -->|Yes| L[Parse and execute AQL]
    L --> M{AQL result true?}
    M -->|Yes| F
    M -->|No| G
    K -->|No| N[Evaluate simple field test]
    N --> O{Field value matches?}
    O -->|Yes| F
    O -->|No| G
```

**Priority Order:**
1. **Building Blocks** - Evaluated first, can reference other BBs recursively
2. **Regex Patterns** - Applied to payload/fields
3. **AQL Filters** - Complex queries with WHERE clauses
4. **Simple Field Tests** - Direct comparisons (sourceip, qid, etc.)

---

## 4. Component Interaction Diagram

```mermaid
graph TB
    subgraph Frontend
        A[RuleEditor.tsx]
        B[WizardContainer.tsx]
        C[TestBrowser.tsx]
        D[TestStack.tsx]
        E[ConditionRow.tsx]
        F[ConfigDialog.tsx]
        G[WizardSteps.tsx]
    end
    
    subgraph "Shared State"
        H[Rule State Object]
        I["- name
        - type
        - logic
        - conditions[]
        - response{}
        - enabled"]
    end
    
    subgraph Backend
        J[/api/rules]
        K[rule_engine.py]
        L[evaluator.py]
        M[correlator.py]
        N[aggregator.py]
    end
    
    subgraph Storage
        O[(SQLite DB)]
        P[YAML Files]
        Q[Reference Data]
    end
    
    A --> B
    B --> C
    B --> D
    B --> G
    D --> E
    E --> F
    C --> H
    D --> H
    G --> H
    H --> J
    J --> K
    K --> L
    K --> M
    K --> N
    L --> O
    L --> P
    M --> O
    N --> Q
```

---

## 5. Database Schema

```mermaid
erDiagram
    RULES ||--o{ RULE_CONDITIONS : has
    RULES ||--o{ RULE_RESPONSES : has
    RULES ||--o{ BUILDING_BLOCKS : references
    RULES {
        int id PK
        string name
        string rule_type
        string logic
        boolean enabled
        string group
        datetime created_at
        datetime updated_at
        string created_by
    }
    RULE_CONDITIONS {
        int id PK
        int rule_id FK
        string test_id
        json values
        int order_index
    }
    RULE_RESPONSES {
        int id PK
        int rule_id FK
        boolean create_offense
        string offense_index_by
        string offense_annotation
        boolean dispatch_event
        json notify_emails
        int severity_override
    }
    BUILDING_BLOCKS {
        int id PK
        string name
        json conditions
        datetime created_at
    }
    REFERENCE_SETS {
        int id PK
        string name
        string element_type
        json elements
    }
```

---

## 6. Test Condition Rendering Flow

```mermaid
flowchart TD
    A[User clicks Add button] --> B[testDef from QRADAR_TESTS]
    B --> C[Create Condition object]
    C --> D["condition = {
        id: uuid(),
        testDef: {...},
        values: {}
    }"]
    D --> E[Add to conditions array]
    E --> F[Render ConditionRow]
    F --> G[Parse testDef.text]
    G --> H[For each param in testDef.params]
    H --> I{Is value configured?}
    I -->|No| J["Render link with placeholder text
        e.g. 'these IP addresses'"]
    I -->|Yes| K["Render link with [value]
        e.g. '[192.168.1.0/24]'
        Add blue background box"]
    J --> L[On click: open ConfigDialog]
    K --> L
    L --> M{Dialog type?}
    M -->|text| N[Type 1: Single input]
    M -->|multiselect| O[Type 2: Available → Selected]
    M -->|aql| P[Type 3: AQL builder]
    M -->|select| Q[Type 4: Dropdown]
    M -->|number| R[Type 5: Numeric input]
    N --> S[User enters value, clicks Submit]
    O --> S
    P --> S
    Q --> S
    R --> S
    S --> T[Update condition.values object]
    T --> U[Re-render ConditionRow with new value]
```

---

## 7. Building Block Resolution Example

**Scenario:** Main rule references a Building Block

```
Main Rule: "Detect Suspicious Login Attempts"
- Condition 1: when an event matches BB "BB: Failed Login Events"
- Condition 2: when source IP is NOT in reference set "Known_Good_IPs"
- Logic: ALL
- Response: Create offense indexed by Source IP

Building Block: "BB: Failed Login Events"  
- Condition 1: when event QID is one of [5000001, 5000003, 5000015]
- Condition 2: when event severity > 5
- Logic: ALL
- Response: NONE (Building Blocks have no responses)
```

**Evaluation Flow:**
1. Event arrives: `QID=5000001, severity=7, sourceip=10.1.1.50`
2. Main rule evaluates Condition 1
3. Loads BB "BB: Failed Login Events"
4. Evaluates BB Condition 1: QID in [5000001...] → **TRUE**
5. Evaluates BB Condition 2: severity > 5 → **TRUE**
6. BB logic is ALL, both true → **BB MATCHES**
7. Main rule Condition 1 → **TRUE**
8. Main rule evaluates Condition 2
9. Check if 10.1.1.50 in Known_Good_IPs → **NOT FOUND** → **TRUE**
10. Main rule logic is ALL, both true → **RULE FIRES**
11. Execute response: Create offense indexed by sourceip=10.1.1.50

---

## 8. Time-Based Correlation Tracking

```mermaid
flowchart TD
    A[Event arrives with QID=6001001] --> B[Find rules with time-based conditions]
    B --> C["Rule: 'when this event seen >5 times in 10 min'"]
    C --> D{Check correlation cache}
    D --> E["Key: rule_id + event_key
        event_key = hash(QID, sourceip, etc.)"]
    E --> F{Cache entry exists?}
    F -->|No| G[Create new entry]
    G --> H["entry = {
        timestamps: [now],
        count: 1
    }"]
    F -->|Yes| I[Load entry]
    I --> J[Remove timestamps older than 10 min]
    J --> K[Add current timestamp]
    K --> L["count = len(timestamps)"]
    L --> M{count > 5?}
    M -->|No| N[Save entry, no action]
    M -->|Yes| O[RULE FIRES!]
    O --> P[Execute response actions]
    P --> Q[Clear or reset cache entry]
```

**Cache Structure:**
```python
correlation_cache = {
    "rule_123_evt_6001001_10.1.1.5": {
        "timestamps": [
            "2024-02-13T10:25:10",
            "2024-02-13T10:26:45",
            "2024-02-13T10:28:30",
            "2024-02-13T10:29:15",
            "2024-02-13T10:30:20",
            "2024-02-13T10:31:05"  # 6th event - FIRES!
        ],
        "count": 6,
        "last_updated": "2024-02-13T10:31:05"
    }
}
```

---

## Implementation Notes

### Critical Data Structures

**Frontend State (React):**
```typescript
interface RuleState {
    name: string;
    ruleType: 'event' | 'flow' | 'common' | 'offense' | 'building_block';
    logic: 'ALL' | 'ANY';
    conditions: Condition[];
    response: RuleResponse;
    enabled: boolean;
    group: string;
    notes?: string;
}

interface Condition {
    id: string;  // UUID
    testDef: QRadarTest;  // Reference to test template
    values: Record<string, any>;  // Configured parameter values
}
```

**Backend Models (Python):**
```python
class Rule(BaseModel):
    id: int
    name: str
    rule_type: str
    logic: str
    conditions: List[RuleCondition]
    response: RuleResponse
    enabled: bool = True
    group: str = "Other"
    created_at: datetime
    updated_at: datetime
    created_by: str

class RuleCondition(BaseModel):
    test_id: str  # References QRADAR_TESTS[id]
    values: Dict[str, Any]  # Configured values
    order_index: int
```

### Data Persistence

**Two-layer storage:**
1. **SQLite Database** - Structured data, fast queries
2. **YAML Files** - Human-readable backups, version control friendly

**Sync strategy:**
- All writes go to both DB and YAML
- On startup, DB is source of truth
- YAML acts as backup and export format

This workflow ensures data integrity and provides easy export/import capabilities.
