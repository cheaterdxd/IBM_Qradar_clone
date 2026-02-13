# Implementation Plan: QRadar SIEM Clone Enhancement

## Goal

Transform the current QRadar SIEM clone from a modern glassmorphism design to a specification-compliant IBM QRadar interface. Focus on making the Rule Test Stack Editor fully functional, fixing button behaviors, improving data workflow, and ensuring all features match the comprehensive 975-line technical specification.

## User Review Required

> [!IMPORTANT]
> **Breaking Changes**
> - Complete UI redesign from modern glassmorphism to QRadar classic styling
> - CSS framework shift from Tailwind utilities to QRadar-specific styles
> - Button and form styling changes across the entire application

> [!WARNING]
> **Scope Confirmation Needed**
> - Should we implement ALL 7 tabs (Dashboard, Offenses, Log Activity, Network Activity, Assets, Reports, Admin)?
> - Or focus only on the Rule Editor and wizard flow for now?
> - Recommended: Phase 1 focuses on Rule Test Stack Editor + Wizard, Phase 2 adds other tabs

## Proposed Changes

### Phase 1A: Core Styling & Layout Foundation

#### [MODIFY] [qradar-base.css](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/styles/qradar-base.css)
- Add complete QRadar color palette variables
- Define all button variants (Primary, Secondary, Danger)
- Standardize form input styles (no border-radius, proper borders)
- Remove all glassmorphism effects
- Set proper font definitions (Arial throughout)

#### [NEW] [qradar-layout.css](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/styles/qradar-layout.css)
- Header bar (40px, #003366)
- Tab navigation bar (32px, #2B4F7A)
- Breadcrumb trail styling
- Two-panel split layout for Rule Editor

---

### Phase 1B: Rule Test Stack Editor - Critical Fixes

#### [MODIFY] [TestBrowser.tsx](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/components/qradar/TestBrowser.tsx)
**Current Issues:**
- Missing visual separator in Test Group dropdown
- Group headers not styled per spec
- Double-click behavior may not be clear

**Changes:**
- Add disabled separator option: `<option disabled>──────────</option>`
- Style group headers with uppercase, #E8EEF4 background
- Ensure double-click properly triggers `onAddTest`
- Fix hover states (#D9EAF7 background)
- Fix selected state (#0066CC background, white text)

#### [MODIFY] [TestStack.tsx](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/components/qradar/TestStack.tsx)
**Changes:**
- Ensure empty state shows proper italic styling
- Fix logic connector dropdown styling
- Make condition list scrollable with proper overflow

#### [MODIFY] [ConditionRow.tsx](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/components/qradar/ConditionRow.tsx)
**Current Issues:**
- Delete button may not match spec styling
- Hyperlinks for parameters need proper rendering
- Missing "configured" vs "unconfigured" value styling
- Prefix text ("when", "and when") needs proper coloring

**Changes:**
- Delete button: 16px square, #CC0000 border, red X character
- Prefix text: "when" for index 0, "and when" for index > 0, color #555555
- Unconfigured params: show placeholder text in blue link
- Configured params: show `[value]` with background #EBF5FF, border #99CCFF
- Add click handlers to open ConfigDialog

#### [NEW] [ConfigDialog.tsx](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/components/qradar/ConfigDialog.tsx)
**5 Dialog Types:**
1. **Type 1 - Single Text Input**: Simple text field for strings, numbers
2. **Type 2 - Multi-Select**: Available → Selected two-panel layout with search
3. **Type 3 - AQL Builder**: Textarea with syntax validation
4. **Type 4 - Single Select**: Dropdown for single choice
5. **Type 5 - Numeric Input**: Number field with min/max validation

**Common Features:**
- Modal overlay (#00000066)
- Dialog box centered, white background
- Title bar (#0066CC blue, white text, close X)
- Submit / Cancel buttons in footer

---

### Phase 1C: 5-Step Wizard Flow

#### [NEW] [WizardContainer.tsx](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/components/qradar/WizardContainer.tsx)
- Manages wizard state (current step, navigation)
- Renders Step Progress Indicator
- Renders Wizard Navigation Footer
- Handles validation before step transitions

#### [MODIFY] [WizardSteps.tsx](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/components/qradar/WizardSteps.tsx)
**Add all 5 steps:**
1. **Step 1 - Introduction**: Static informational text
2. **Step 2 - Rule Type Selection**: Radio buttons (Event, Flow, Common, Offense, BB)
3. **Step 3 - Test Stack Editor**: (Already implemented in Phase 1B)
4. **Step 4 - Rule Response**: Checkboxes for response types, sub-forms
5. **Step 5 - Rule Name & Notes**: Final form with enable checkbox

#### [MODIFY] [WizardFooter.tsx](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/components/qradar/WizardFooter.tsx)
- Background #D5DEE8, border-top 2px #AAAAAA
- Buttons: Cancel (with confirm dialog), Back, Next/Finish
- Disable Next if validation fails
- Change "Next" to "Finish" on Step 5

---

### Phase 1D: Data Types & Backend

#### [MODIFY] [qradar-tests.ts](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/data/qradar-tests.ts)
- Expand test definitions to match ALL tests from spec (60+ tests)
- Add all missing test groups (customprop, hostprofile, offense, flow)
- Add proper parameter types for each test
- Include AQL filter type, numeric types

#### [MODIFY] [schemas.py](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/backend/app/models/schemas.py)
**Add complete schemas:**
```python
class RuleCondition(BaseModel):
    test_id: str
    values: Dict[str, Any]

class RuleResponse(BaseModel):
    create_offense: bool = False
    offense_index_by: Optional[str] = None
    offense_annotation: Optional[str] = None
    dispatch_new_event: bool = False
    notify_email: Optional[List[str]] = None
    reference_set_actions: Optional[List[dict]] = None
    severity_override: Optional[int] = None
    credibility_override: Optional[int] = None
    relevance_override: Optional[int] = None

class RuleCreate(BaseModel):
    name: str
    rule_type: str  # event, flow, common, offense, building_block
    logic: str = "ALL"  # ALL or ANY
    conditions: List[RuleCondition]
    response: RuleResponse
    notes: Optional[str] = None
    enabled: bool = True
    group: str = "Other"
```

#### [MODIFY] [rule_engine.py](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/backend/app/core/engine/rule_engine.py)
- Implement all test evaluations from spec
- Add Building Block reference resolution
- Time-based correlation tracking
- Priority order: BB → Regex → AQL

#### [MODIFY] [rules.py](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/backend/app/api/routes/rules.py)
- Add proper validation for rule create/update
- Support for all response types
- Rule enable/disable toggle endpoint
- Export rule as XML endpoint

---

### Phase 1E: Styling Components

#### [MODIFY] [rule-editor.css](file:///c:/Users/ANM-TUANLT26/code/qradar_siem_editor/frontend/src/styles/rule-editor.css)
- Two-panel layout with 38% / 62% split
- 2px solid divider (#AAAAAA)
- Panel headers (#C4D8EB background)
- Filter area (#F5F5F5 background)
- Test list hover and selected states
- Condition rows with proper spacing
- Delete button styling

## Verification Plan

### Automated Tests

**Backend Tests:**
```bash
# Run from backend directory
python -m pytest tests/test_rule_engine.py -v
python -m pytest tests/test_api_rules.py -v
```

Tests to verify:
- [ ] Rule creation with all condition types
- [ ] Building Block reference resolution
- [ ] Time-based correlation (N events in X minutes)
- [ ] Rule evaluation with ALL and ANY logic
- [ ] Response actions execution

**Frontend Tests:**
```bash
# Run from frontend directory
npm test -- TestBrowser.test.tsx
npm test -- TestStack.test.tsx
npm test -- ConfigDialog.test.tsx
```

### Browser Testing

**Test Scenario 1: Add Test Conditions**
1. Start dev servers: `npm run dev` (frontend), `uvicorn app.main:app --reload` (backend)
2. Navigate to Rule Editor
3. Verify Test Browser displays all test groups
4. Select a test from "Event Property Tests"
5. Click "Add »" button
6. **Expected:** Condition appears in Test Stack with unconfigured parameter links
7. **Verify:** Delete button shows red X, hover shows #CC0000 background

**Test Scenario 2: Configure Parameters**
1. Click an unconfigured parameter link (e.g., "these IP addresses")
2. **Expected:** ConfigDialog opens (Type 2 - Multi-select)
3. Use search filter to find IP addresses
4. Move IPs from Available → Selected
5. Click Submit
6. **Expected:** Link text changes to `[192.168.1.0/24]` with blue background box
7. **Verify:** Configured value persists when reopening dialog

**Test Scenario 3: Wizard Navigation**
1. Start new rule creation
2. **Verify:** Step Progress Indicator shows all 5 steps
3. Complete Step 1 (Introduction) - click Next
4. Select "Event Rule" in Step 2 - click Next
5. Add at least one condition in Step 3 - click Next
6. **Expected:** Validation passes, advances to Step 4
7. Try clicking Next without condition: **Expected:** Error message shown
8. Complete Steps 4 and 5
9. **Verify:** "Next" button changes to "Finish" on Step 5
10. Click Finish
11. **Expected:** Rule saved, redirected to Rules List

**Test Scenario 4: Visual Styling**
1. Inspect Rule Test Stack Editor
2. **Verify measurements:**
   - Header bar: 40px height, #003366 background
   - Panel headers: 24px height, #C4D8EB background
   - Buttons: Arial 12px, no border-radius
   - Primary button: #0066CC background, white text
   - Hover on Primary: #004999 background (instant, no animation)
3. **Verify fonts:** All text uses Arial/Helvetica family
4. **Verify colors:** No gradients, no glassmorphism, flat colors only

### Manual Testing

**Building Block Integration:**
1. Create a Building Block rule (no response actions)
2. Save as "BB: High Severity Events"
3. Create new Event Rule
4. Add test: "when an event matches any of the following rules"
5. Configure parameter, select the BB rule
6. **Expected:** BB reference saved correctly
7. Test with JSON event that matches BB criteria
8. **Expected:** Main rule fires because BB matched

**Time-Based Correlation:**
1. Create rule: "when this event is seen more than 5 times in 10 minutes"
2. Configure with event QID and thresholds
3. Submit 6 matching events within 10 min (via Test Rule)
4. **Expected:** Rule fires on 6th event
5. Submit 6 events over 15 min span
6. **Expected:** Rule does NOT fire

**Response Actions:**
1. Create rule in Step 4 with:
   - "Create offense" enabled
   - Index by: Source IP
   - Annotation: "Detected suspicious activity from {sourceip}"
   - Notify email: test@example.com
2. Save rule and execute test
3. **Expected:** Check logs/database for offense creation intent
4. **Expected:** Email notification logged (if email service configured)

## Notes

- Priority 1 (Critical): Phase 1B (Test Stack Editor fixes) - This is the core functionality
- Priority 2 (High): Phase 1C (Wizard Flow) - Required for complete user experience  
- Priority 3 (Medium): Phase 1A (Styling) - Makes UI spec-compliant
- Priority 4 (Low-Medium): Phase 1D (Backend) - Improves functionality but not blocking UI

**Recommended Execution Order:**
1. Start with 1B (Test Stack Editor) - get functionality working
2. Then 1C (Wizard) - complete the flow
3. Then 1A (Styling) - make it look correct
4. Finally 1D (Backend) - enhance data layer

This allows incremental testing and user feedback at each stage.
