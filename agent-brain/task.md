# QRadar SIEM Clone - Comprehensive Enhancement Plan

## Phase 1: Core UI/UX Compliance with QRadar Spec
- [ ] Implement proper QRadar styling and color palette
  - [ ] Create qradar-colors.css with exact color values from spec
  - [ ] Update all components to use QRadar color scheme
  - [ ] Replace Tailwind glassmorphism with QRadar classic styling
- [ ] Fix button styles and interactions
  - [ ] Implement Primary/Secondary/Danger button variants
  - [ ] Remove animations, use instant state changes
  - [ ] Add proper hover and active states
- [ ] Standardize form inputs across application
  - [ ] Single text inputs with proper borders
  - [ ] Select dropdowns with native rendering
  - [ ] No border-radius, proper focus states

## Phase 2: Rule Test Stack Editor (Critical Component)
- [x] Fix Test Browser functionality
  - [x] Implement proper test grouping and filtering
  - [x] Add "Add »" button with proper behavior
  - [x] Fix test template rendering from spec
- [x] Fix Test Stack panel
  - [x] Implement proper condition row display
  - [x] Add delete buttons on each condition
  - [x] Fix hyperlink rendering for configurable values
  - [x] Implement condition reordering (up/down buttons)
- [x] Implement Configuration Dialogs
  - [x] Type 1: Single text string input
  - [x] Type 2: Multi-select (Available → Selected)
  - [x] Type 3: AQL/search filter builder
  - [x] Type 4: Single select from list
  - [x] Type 5: Numeric input
- [x] Add validation logic
  - [x] Rule name validation
  - [x] At least one test condition required
  - [x] Show proper error messages

## Phase 3: Data Workflow & Backend Integration
- [/] Event Testing Engine
  - [ ] Implement proper rule evaluation logic
  - [ ] Add support for Building Block references
  - [ ] Fix time-based correlation (N events in X minutes)
  - [ ] Implement priority validation (BB → Logic → Regex → AQL)
- [ ] Rule Storage & Retrieval
  - [ ] Fix database schema for complete rule data
  - [ ] Implement proper YAML export/import
  - [ ] Add audit trail for rule modifications
- [ ] API Endpoints Improvement
  - [ ] Complete REST API for all rule operations
  - [ ] Add proper error handling and validation
  - [ ] Implement batch operations support

## Phase 4: Wizard Steps Implementation ✅
- [x] Step 1: Introduction (static info)
- [x] Step 2: Rule Type selection
- [x] Step 3: Rule Test Stack (already complete)
- [x] Step 4: Rule Response configuration
  - [x] Offense creation settings
  - [x] Dispatch new event
  - [x] Reference set updates
  - [x] Severity/Credibility/Relevance controls
- [x] Step 5: Rule Name/Notes/Group/Enable

## Phase 5: Testing & Documentation ✅
- [x] Dev server running
- [x] Walkthrough documentation created
- [x] All features documented

## Next: Backend Integration & Production
- [ ] Building Blocks Management
  - [ ] Fix Building Block editor
  - [ ] Implement BB import within rules
  - [ ] Add BB validation and testing
- [ ] Reference Data Support
  - [ ] Implement Reference Sets management
  - [ ] Add Reference Maps support
  - [ ] Enable reference data in rule conditions

## Phase 5: Navigation & Layout Structure
- [ ] Global Application Structure
  - [ ] Implement fixed header bar (40px)
  - [ ] Add tab navigation bar (32px)
  - [ ] Implement breadcrumb trail
  - [ ] Fix content area scrolling
- [ ] Tab System Implementation
  - [ ] Dashboard tab (widget-based)
  - [ ] Offenses tab (list and detail views)
  - [ ] Log Activity tab (event search)
  - [ ] Network Activity tab (flow search)
  - [ ] Assets tab (asset profiles)
  - [ ] Reports tab
  - [ ] Admin tab (configuration grid)

## Phase 6: Advanced Features
- [ ] Search & Filter System
  - [ ] Quick filter implementation
  - [ ] Advanced AQL editor with syntax validation
  - [ ] Saved searches management
- [ ] Time Range Selectors
  - [ ] Real-time streaming mode
  - [ ] Predefined ranges (Last Minute, Hour, etc.)
  - [ ] Custom datetime picker
- [ ] Context Menus
  - [ ] Right-click on event rows
  - [ ] Proper menu positioning
  - [ ] Action handlers for all menu items

## Phase 7: Testing & Validation
- [ ] Unit Tests
  - [ ] Rule engine tests
  - [ ] Parser tests (AQL, regex)
  - [ ] Validation logic tests
- [ ] Integration Tests
  - [ ] API endpoint tests
  - [ ] Database operation tests
  - [ ] Rule execution flow tests
- [ ] UI/UX Tests
  - [ ] Component rendering tests
  - [ ] User interaction flows
  - [ ] Browser compatibility checks

## Phase 8: Performance & Optimization
- [ ] Frontend Optimization
  - [ ] Code splitting for large components
  - [ ] Lazy loading for wizard steps
  - [ ] Virtual scrolling for large lists
- [ ] Backend Optimization
  - [ ] Database query optimization
  - [ ] Caching for reference data
  - [ ] Async processing for rule evaluation
- [ ] Documentation
  - [ ] API documentation (complete OpenAPI spec)
  - [ ] User guide for rule creation
  - [ ] Developer documentation for extensions
