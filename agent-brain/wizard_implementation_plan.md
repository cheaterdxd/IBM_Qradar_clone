# Wizard Steps Implementation Plan

## Overview
Implement Steps 1, 2, 4, and 5 of the QRadar Rule Creation Wizard. Step 3 (Rule Test Stack Editor) is already complete.

---

## Step 1: Introduction (Static Info Page)

### Requirements (Spec §9.4)
- Static informational text explaining what rules are
- Lists available rule types
- No form elements
- Only "Next ›" button active

### Component Structure
**File:** `frontend/src/components/qradar/wizard/Step1Introduction.tsx`

**Content:**
- Title: "Rule Wizard - Introduction"
- Paragraph explaining QRadar rules
- Bullet list of rule types (Event, Flow, Common, Offense, Building Block)
- Professional IBM styling (no fancy graphics)

**Validation:** None (always can proceed)

---

## Step 2: Type of Rule

### Requirements (Spec §9.5)
- Radio button group (vertical layout)
- 5 options: Event Rule, Flow Rule, Common Rule, Offense Rule, Building Block
- Each option has bold name + description paragraph
- Selected type determines available tests in Step 3

### Component Structure
**File:** `frontend/src/components/qradar/wizard/Step2RuleType.tsx`

**State:**
```typescript
ruleType: 'event' | 'flow' | 'common' | 'offense' | 'building_block'
```

**Content:**
- Radio options with labels + descriptions
- Colors: label `#003366` bold, description `#666666`

**Validation:** 
- Must select a rule type before proceeding
- Error message: "You must select a rule type to continue"

---

## Step 4: Rule Response

### Requirements (Spec §9.7)
Complex form with multiple checkbox-controlled sections:

1. **Ensure event is part of offense** (default checked)
   - Index offense based on: [select dropdown]
   - Annotate offense: [text input]
   - Checkbox: "Replace offense name"

2. **Dispatch New Event**
   - Event Name: [text]
   - Event Description: [text]
   - High Level Category: [select]
   - Low Level Category: [select - dependent]
   - Offense Naming: [select: Append/Replace/Do Not]

3. **Notify**
   - Email to: [text - comma-separated]

4. **Add event field to reference set**
   - Field: [select]
   - Reference Set: [select]

5. **Severity/Credibility/Relevance sliders** (1-10)

6. **Ensure offense is not part of existing offense** (checkbox)

### Component Structure
**File:** `frontend/src/components/qradar/wizard/Step4RuleResponse.tsx`

**State:**
```typescript
{
  offense: {
    enabled: boolean;
    indexOn: string;
    annotation: string;
    replaceName: boolean;
  },
  dispatchEvent: {
    enabled: boolean;
    name: string;
    description: string;
    highLevelCategory: string;
    lowLevelCategory: string;
    offenseNaming: 'append' | 'replace' | 'none';
  },
  notify: {
    enabled: boolean;
    emailTo: string;
  },
  referenceSet: {
    enabled: boolean;
    field: string;
    setName: string;
  },
  severity: number; // 1-10
  credibility: number;
  relevance: number;
  preventAggregation: boolean;
}
```

**Validation:**
- If "Dispatch Event" checked: event name required
- If "Notify" checked: valid email format
- Severity/Credibility/Relevance: must be 1-10

---

## Step 5: Rule Name and Notes

### Requirements (Spec §9.8)
Simple final step:

1. **Rule Name** [text input] - REQUIRED
2. **Notes** [textarea] - optional
3. **Assign to group** [select] - default "Other"
4. **Enable Rule** [checkbox] - default checked

Footer button changes from "Next ›" to "Finish"

### Component Structure
**File:** `frontend/src/components/qradar/wizard/Step5NameNotes.tsx`

**State:**
```typescript
{
  ruleName: string;
  notes: string;
  group: string; // default "Other"
  enabled: boolean; // default true
}
```

**Validation:**
- Rule name is required
- Min length: 3 characters
- Error: "Rule name is required"

---

## Wizard Shell Changes

### Required Updates to `QRadarApp.tsx`

**Add wizard state:**
```typescript
const [currentStep, setCurrentStep] = useState(1);
const [wizardData, setWizardData] = useState({
  // Step 2
  ruleType: 'event',
  // Step 3 (existing)
  conditions: [],
  logic: 'ALL',
  // Step 4
  response: { /* ... */ },
  // Step 5
  ruleName: 'My Custom Event Rule',
  notes: '',
  group: 'Other',
  enabled: true
});
```

**Update WizardSteps component:**
```typescript
<WizardSteps
  currentStep={currentStep}
  completedSteps={[1, 2]} // track completed
  onNavigateToStep={(step) => setCurrentStep(step)}
/>
```

**Update WizardFooter:**
```typescript
<WizardFooter
  currentStep={currentStep}
  onBack={() => setCurrentStep(currentStep - 1)}
  onNext={handleNext}
  onCancel={handleCancel}
  isLastStep={currentStep === 5}
/>
```

**Render appropriate step content:**
```typescript
{currentStep === 1 && <Step1Introduction />}
{currentStep === 2 && <Step2RuleType value={wizardData.ruleType} onChange={...} />}
{currentStep === 3 && <Step3RuleTestStackEditor ... />}
{currentStep === 4 && <Step4RuleResponse ... />}
{currentStep === 5 && <Step5NameNotes ... />}
```

---

## Validation Strategy

**Client-side validation per step:**
- Step 1: Always valid (info only)
- Step 2: Must select rule type
- Step 3: Must have ≥1 condition (already implemented)
- Step 4: Conditional based on enabled sections
- Step 5: Rule name required, min 3 chars

**Error display:**
- Use existing `.error-msg.show` styling
- Display above step content
- Clear errors on value change

---

## Navigation Rules

1. **Back button:** Always returns to previous step, preserves all data
2. **Next button:** Validates current step, then advances
3. **Step links in progress bar:** Only clickable for completed steps
4. **Cancel button:** Shows confirmation dialog, resets wizard on confirm

---

## Component Files Summary

**New files to create:**
```
frontend/src/components/qradar/wizard/
├── Step1Introduction.tsx
├── Step2RuleType.tsx
├── Step4RuleResponse.tsx
└── Step5NameNotes.tsx
```

**Files to update:**
```
frontend/src/components/qradar/
├── QRadarApp.tsx (wizard orchestration)
├── WizardSteps.tsx (add navigation logic)
└── WizardFooter.tsx (conditional button rendering)
```

---

## Estimated Complexity

- **Step 1:** Low (1 hour) - Static content
- **Step 2:** Low (1-2 hours) - Simple radio form
- **Step 4:** High (4-5 hours) - Complex conditional form
- **Step 5:** Low (1-2 hours) - Simple form
- **Wizard Shell:** Medium (2-3 hours) - State orchestration

**Total:** ~10-13 hours of development

---

## Implementation Order

1. ✅ Update wizard shell (state, navigation)
2. ✅ Step 1 (easiest, validates setup)
3. ✅ Step 2 (simple, completes early flow)
4. ✅ Step 5 (simple, completes final flow)
5. ✅ Step 4 (most complex, saved for last)
6. ✅ Integration testing
7. ✅ Update walkthrough.md
