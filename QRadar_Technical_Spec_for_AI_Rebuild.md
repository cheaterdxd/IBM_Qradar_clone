# IBM QRadar SIEM — Complete Technical UI Specification
## For AI Agent Code Reconstruction

**Version reference:** QRadar SIEM 7.3 – 7.5  
**Purpose:** Full technical description of every screen, component, button, and interaction.  
**Audience:** AI agents tasked with rebuilding this interface in code.  
**Format:** Text-only specification. No visual assets required.

---

## PART 1 — GLOBAL APPLICATION STRUCTURE

### 1.1 Application Type and Layout Model

The application is a **server-rendered, fixed-width enterprise web console**. It is not a Single Page Application. Navigation between tabs triggers full page reloads. The minimum supported viewport is 1280px wide. The layout does not reflow or respond to smaller viewports. All widths are fixed in pixels.

The application is divided into four persistent layers that appear on every screen, stacked vertically from top to bottom:

1. **Header Bar** — always visible, height 40px.
2. **Tab Navigation Bar** — always visible, height 32px.
3. **Content Area** — variable height, fills remaining vertical space, scrollable.
4. **No persistent footer** — some individual wizard screens render a navigation footer inside the content area.

### 1.2 Header Bar

Height: 40px. Background color: `#003366` (dark navy blue). Horizontal padding: 16px. All child elements are vertically centered using absolute positioning or line-height matching.

**Left region:**  
An IBM logo rendered as white-on-transparent SVG or a styled text block reading "IBM" in a white box. Immediately to the right of the logo is the product name string "IBM Security QRadar SIEM" rendered in white, font-size 14px, font-weight bold, font-family Arial.

**Right region (floated right or flex-end):**  
Two elements separated by 16px horizontal gap:
- A dropdown trigger showing the currently logged-in username followed by a downward-pointing triangle character (`▾`). Font-size 12px, color `#9ABBE0`. On click, renders a dropdown menu with items: "User Preferences" (opens a full-page preferences form) and "Log Out" (performs session termination and redirects to login page).
- A circular help button, 18px diameter, border `1px solid #9ABBE0`, color white, containing the character "?" at font-size 11px. On click, opens context-sensitive IBM Knowledge Center documentation in a new browser tab.

### 1.3 Tab Navigation Bar

Height: 32px. Background color: `#2B4F7A`. Horizontal padding: 8px on left. Tabs are inline-block or flex children, no gap between them.

**Tab list (left to right):** Dashboard, Offenses, Log Activity, Network Activity, Assets, Reports, Admin.

**Tab anatomy:** Each tab is an anchor element. Horizontal padding: 14px. Vertical padding: 0 (height is set by line-height equal to parent height). Font: Arial, 12px. Default color: `#9ABBE0`. Hover color: `#FFFFFF`. Active tab color: `#FFFFFF`, background `#3A6EA5`, bottom border `2px solid #FFFFFF`. No border-radius. No box-shadow.

The "Admin" tab is hidden from users who do not have the Administrator role.

### 1.4 Breadcrumb Trail

Appears directly below the Tab Navigation Bar on all inner pages. Height: 28px. Background: `#E8EEF4`. Padding: 8px 16px. Font: Arial, 11px. Border-bottom: `1px solid #CCCCCC`.

Format: `[Tab Name] > [Sub-section] > [Current Page Name]`

Completed ancestors are rendered as clickable links, color `#0066CC`, underlined. The current page is plain bold text, color `#003366`, not a link. Separator character is `>` or `›`, color `#999999`, with 6px horizontal margin on each side.

### 1.5 Global Color Palette

All colors in this application:

- Navy header/primary brand: `#003366`
- Primary interactive blue: `#0066CC`
- Hover on primary blue: `#004999`
- Selected row / highlight: `#D9EAF7`
- Tab bar background: `#2B4F7A`
- Active tab background: `#3A6EA5`
- Panel header background: `#C4D8EB`
- Breadcrumb / toolbar background: `#E8EEF4`
- Page/form background: `#F0F4F8`
- White content areas: `#FFFFFF`
- Light gray backgrounds: `#F5F5F5`
- Standard border color: `#CCCCCC`
- Dark border / input border: `#999999`
- Primary body text: `#333333`
- Secondary / label text: `#666666`
- Danger / delete: `#CC0000`
- Error background: `#FFEEEE`
- Error border: `#CC0000`
- Success / enabled: `#006600`
- Warning: `#CC7700`
- Wizard footer background: `#D5DEE8`

### 1.6 Global Typography

Single font family throughout: `Arial, 'Helvetica Neue', Helvetica, sans-serif`. No web fonts are loaded. No Google Fonts. No icon fonts.

Font sizes used:
- 14px — product name in header
- 12px — standard body text, buttons, condition text, most UI copy
- 11px — labels, small list items, filter controls
- 10px — metadata, timestamps, badge counts
- 9px — tooltip text, keyboard shortcut labels

Font weights: normal (400) for body text, bold (700) for panel headers and primary labels. No medium weight (500) is used.

### 1.7 Standard Button Styles

Three button variants used throughout:

**Primary button (e.g., "Next", "Submit", "Deploy"):**  
Background `#0066CC`. Border: none. Color: `#FFFFFF`. Font: Arial 12px, font-weight bold. Padding: 5px 18px. Hover background: `#004999`. Cursor: pointer. No border-radius. No box-shadow.

**Secondary button (e.g., "Back", "Cancel", "Add"):**  
Background `#E8E8E8`. Border: `1px solid #999999`. Color: `#333333`. Font: Arial 12px, font-weight normal. Padding: 5px 18px. Hover background: `#D0D8E0`. Cursor: pointer.

**Danger button (e.g., "Delete", "SIM Reset"):**  
Background `#FFFFFF`. Border: `1px solid #CC0000`. Color: `#CC0000`. Hover: background `#FFEEEE`. Font: Arial 12px. Padding: 5px 18px.

All buttons use `cursor: pointer`. No animations or transitions on hover state — state change is instant.

### 1.8 Standard Form Input Styles

All `<input type="text">`, `<textarea>`, and `<select>` elements share these properties:
- Background: `#FFFFFF`
- Border: `1px solid #999999`
- Font: Arial 12px, color `#333333`
- Height for single-line inputs: 22px
- Padding: 2px 6px
- No border-radius
- Focus state: outline `1px solid #0066CC`, no box-shadow

`<select>` elements use native browser rendering. No custom dropdown replacements. The browser default arrow indicator is shown on the right.

---

## PART 2 — DASHBOARD TAB

### 2.1 Purpose

The Dashboard is the default landing page after login. It displays a configurable collection of widgets (called "Dashboard Items") that summarize system activity in near-real-time. Each user has their own set of dashboards and each dashboard persists per user across sessions.

### 2.2 Dashboard Toolbar

Located at the top of the Content Area, below the breadcrumb. Height approximately 40px. Background `#E8EEF4`. Border-bottom `1px solid #CCCCCC`. Padding: 8px 12px. All elements are horizontally arranged, left-aligned.

**Elements in the toolbar (left to right):**

`[Add Item ▾]` — Secondary button with dropdown arrow. On click, renders a dropdown menu (see section 2.4). Positioned leftmost.

`[New Dashboard]` — Secondary button. On click, shows an inline text input and a "Create" confirmation button to name and create a new empty dashboard tab.

`[Rename Dashboard]` — Secondary button. On click, replaces the current dashboard tab label with an editable `<input type="text">` pre-filled with the current name. On blur or Enter, saves the new name.

`[Delete Dashboard]` — Secondary button, danger style. On click, shows a confirm dialog: "Are you sure you want to delete this dashboard? This action cannot be undone." Buttons in confirm: `[OK]` (primary) and `[Cancel]` (secondary).

`[Share ▾]` — Secondary button with dropdown (available from QRadar 7.4 onward). Dropdown options: "Share with all users" and "Remove sharing".

Dashboard name selector: If multiple dashboards exist, they are shown as sub-tabs below the main toolbar. These sub-tabs use the same styling as the main tab navigation bar but in a lighter style — background `#E0EAF4`, active sub-tab background `#C4D8EB`, font Arial 12px.

**Timer/Refresh control** (top-right of toolbar): A small circular icon with a play/pause symbol. When dashboards are auto-refreshing, shows a countdown spinner or digit. Click to pause all widgets. Click again to resume. When paused, a red indicator is shown.

### 2.3 Widget (Dashboard Item) Structure

The content area below the toolbar is a freeform grid. Each widget is a rectangular container.

**Widget title bar** (top of each widget):
- Height: 24px. Background: `#C4D8EB`. Padding: 4px 8px.
- Widget title text: Arial 12px, bold, color `#003366`, left-aligned.
- Right side of title bar contains three small controls:
  - A pause/play icon (font-size 12px): toggles auto-refresh for this widget individually.
  - An expand/maximize icon: opens a full-page view of this widget's data.
  - A close icon (`✕`): removes the widget from the dashboard without confirmation.

**Widget body**: White background (`#FFFFFF`). Contains rendered chart (bar, line, pie), table, or summary text depending on widget type. Charts are rendered via the server as static images or via a basic client-side charting library. No SVG animations.

**Widget resize handle** (bottom-right corner): A drag handle allowing the widget to be resized. Cursor changes to `se-resize` on hover.

**Widget drag handle** (title bar): The entire title bar is also a drag handle. Cursor changes to `move` when hovering over the title bar (but not over the control icons). Dragging repositions the widget on a grid.

### 2.4 "Add Item" Dropdown Content

The dropdown renders as an absolute-positioned `<div>` below the button, width ~250px, background `#FFFFFF`, border `1px solid #CCCCCC`, z-index high.

Structure: grouped optionlist. Each group has a bold group label (Arial 11px, color `#003366`, padding 6px 12px, background `#EBF0F6`) followed by clickable items (Arial 12px, padding 6px 14px, hover background `#D9EAF7`).

Groups and items:
- **Offenses**: "Offense Summary", "Most Recent Offenses", "Most Severe Offenses", "Top Sources by Magnitude", "Top Categories by Event Count"
- **Log Activity**: "Event Searches" (sub-menu listing saved searches), "Log Activity Overview", "Top Log Sources by Events"
- **Network Activity**: "Flow Searches" (sub-menu listing saved flow searches), "Top Talkers", "Top Applications by Bytes"
- **Assets**: "Vulnerability Counts", "Most Vulnerable Assets"
- **System**: "System Summary", "Risk Summary"

Clicking any item adds a corresponding widget to the dashboard and closes the dropdown.

---

## PART 3 — OFFENSES TAB

### 3.1 Purpose

The Offenses tab is the primary incident management interface for SOC analysts. An "offense" is a security incident automatically created by the correlation rules engine when rule conditions are satisfied. Each offense aggregates related events, source IPs, network activity, and rule triggers under a single case record.

### 3.2 Left Navigation Panel (Sub-navigation)

The Offenses tab contains a left sidebar, approximately 200px wide, border-right `1px solid #CCCCCC`, background `#F5F5F5`. Contains a list of navigation links:

- **My Offenses** — filters offense list to only those assigned to the current user
- **All Offenses** — shows all active non-hidden offenses in the system (default view)
- **By Source IP** — groups offenses by their top source IP address
- **By Destination IP** — groups offenses by their top destination IP
- **By Network** — groups offenses by the network segment of their source
- **By Category** — groups offenses by their high-level event category

Each item is a plain text link, Arial 12px, color `#0066CC`, padding 6px 12px. Active selection: background `#D9EAF7`, color `#003366`, left border `3px solid #0066CC`, not underlined.

Below the navigation links, a section titled "Rules" (bold label) contains sub-items:
- **Rules** — navigates to the full rules list view

### 3.3 Main Offense List — Toolbar

Located at the top of the main content pane (right of the sidebar). Height approximately 40px. Background `#E8EEF4`. Border-bottom `1px solid #CCCCCC`. Padding: 8px 12px. Horizontal arrangement.

**Elements:**

`[Actions ▾]` — Secondary button with dropdown. Enabled only when one or more rows are checked in the offense list. Dropdown items:
- "Assign" — opens a modal dialog to assign selected offenses to a user
- "Close Offense" — opens a modal dialog requiring a close reason and a mandatory comment
- "Protect Offense" — toggles protection flag; protected offenses are not auto-deleted by retention policy
- "Follow Up" — toggles a follow-up flag; adds a yellow flag icon to the offense row
- "Hide Offense" — hides selected offenses from the default list view; they remain in the database and can be revealed via filter
- "Manage Offense" — navigates to the detail page of the first selected offense

`[Rules ▾]` — Secondary button with dropdown. Always enabled. Dropdown items:
- "New Event Rule" — launches the 5-step Rule Wizard for event rules
- "New Flow Rule" — launches the 5-step Rule Wizard for flow rules
- "New Common Rule" — launches the 5-step Rule Wizard for common rules (events + flows)
- "New Offense Rule" — launches the 5-step Rule Wizard for offense-based rules
- "New Building Block" — launches a simplified Wizard to create a Building Block (a named collection of tests with no response actions, used as a reusable component inside other rules)
- "View Rules" — navigates to the Rules List page

`[Search ▾]` — Secondary button with dropdown. Dropdown items:
- "New Search" — opens the Offense Search form
- "Edit Search" — opens the current search for modification
- "Manage Saved Searches" — navigates to a list of all saved offense searches

`[Refresh ↺]` — Secondary button. On click, reloads the offense list from the server. The offense list does NOT auto-refresh; the analyst must click this button.

### 3.4 Offense List Table

A standard HTML table with sortable columns. Each column header is clickable to sort ascending; click again for descending. Sort direction is indicated by a small triangle icon (▲ or ▼) rendered after the column header text.

**Columns (left to right):**
1. Checkbox column (16px wide) — checkbox to select row for batch actions
2. ID — offense ID number (integer, auto-incremented), link to offense detail page
3. Description — offense name string, link to offense detail page
4. Offense Type — e.g., "Source IP", "Username", "Destination IP"
5. Source IP / Offense Source — the primary source identifier
6. Destination IP — destination network
7. Assigned To — username of assigned analyst (blank if unassigned)
8. Start Time — datetime string in console timezone
9. Last Updated — datetime string
10. Event/Flow Count — number of contributing events
11. Magnitude — integer 1–10 rendered as a filled bar (10 segments, colored proportional to value: low=blue, high=red)
12. Credibility — integer 1–10
13. Severity — integer 1–10
14. Relevance — integer 1–10
15. Status — text: "Active", "Hidden", "Closed"
16. Flag icons — small icons for "Follow Up" (yellow flag), "Protected" (padlock)

**Row styling:**
- Default: white background
- Alternate rows: no alternating color (all white in classic QRadar)
- Hover: background `#F5FBFF`
- Selected (checkbox checked): background `#D9EAF7`
- High-magnitude offenses (magnitude ≥ 8): bold font on description

**Pagination:** Below the table. Shows "Page X of Y | Showing Z–W of N". Navigation links: `|<` (first), `<` (previous), individual page numbers (up to 5 shown), `>` (next), `>|` (last). Items-per-page selector: `<select>` with options 25, 50, 100, 250. Font: Arial 11px.

### 3.5 Offense Detail Page

Navigated to by clicking an offense ID or description. Replaces the list view in the main content area.

**Top section — Offense Header:**  
Full-width. Background `#EBF0F6`. Border-bottom `1px solid #CCCCCC`. Padding 12px 16px. Displays: offense ID, offense name (large, bold), magnitude bar, source IP, start time, event count, assigned user.

**Action buttons in header (right-aligned):**  
`[Assign]`, `[Close Offense]`, `[Protect]`, `[Follow Up]`, `[Hide]` — all secondary buttons. Behavior same as batch actions described above but applied to this single offense.

**Tab sub-navigation inside the detail page:**  
Horizontal tabs below the header. Each is a text link. Active tab has an underline or contrasting background. Tabs are:
- **Events** — lists all events that contributed to this offense. Columns: Start Time, Event Name, Log Source, Source IP, Destination IP, Category, Count.
- **Flows** — lists network flows related to this offense.
- **Source IPs** — lists all source IP addresses. Each IP is a clickable link to that IP's Asset Profile.
- **Destination IPs** — similar to Source IPs.
- **Log Sources** — lists the log sources that generated contributing events.
- **Rules** — lists all correlation rules that fired and contributed to this offense.
- **Annotations** — timeline of analyst comments and automatic system annotations. Each entry shows: timestamp, author username, and comment text.

**Add Comment control (within Annotations tab):**  
A `<textarea>` field (width: 100% of container, height: 60px) with a label "Add Comment:" above it. Below the textarea: a `[Save]` primary button and a `[Cancel]` secondary button.

---

## PART 4 — LOG ACTIVITY TAB

### 4.1 Purpose

Log Activity is the event search and analysis interface. It queries the Ariel database (QRadar's internal columnar store) for structured event records using AQL (Ariel Query Language). Two modes exist: real-time streaming (no database query) and time-bounded searches.

### 4.2 Top Toolbar

Same structural pattern as Offenses toolbar: height ~40px, background `#E8EEF4`, border-bottom `1px solid #CCCCCC`, padding 8px 12px.

**Elements:**

`[Search ▾]` — Dropdown with items:
- "New Search" — opens the Event Search form (full AQL builder)
- "Edit Search" — re-opens the last search form for modification
- "Save Search Criteria" — saves the current search parameters (not results) with a name
- "Save Search Results" — saves a snapshot of the current result set with a name
- "Manage Search Results" — navigates to a list of all saved result snapshots
- "Load Saved Search" — opens a sub-menu or dialog listing named saved searches

`[Add Filter]` — Secondary button. Opens a filter dialog with three fields:
1. "Parameter" — a `<select>` listing all searchable event properties (Source IP, Destination IP, Username, Event Name, Category, Log Source, QID, Source Port, Destination Port, Custom Properties, etc.)
2. "Operator" — a `<select>` that updates based on the selected parameter. For IP fields: "Is", "Is Not", "Is One Of", "Is Not One Of". For string fields: "Contains", "Does Not Contain", "Is", "Is Not". For numeric fields: "=", "!=", ">", "<", ">=", "<=".
3. "Value" — a `<input type="text">` or multi-select depending on operator.
Dialog buttons: `[Add Filter]` (primary) and `[Cancel]`.

`[Quick Filter]` — An inline `<input type="text">` in the toolbar itself, width approximately 200px. Accepts simplified filter syntax such as `sourceip=192.168.1.1` or `username=admin`. Submitting (pressing Enter) applies the filter to the current results.

`[⏸ Pause]` / `[▸ Resume]` — Toggle button. Only visible when the view mode is "Real Time" or "Last Minute". Toggles whether the display is actively receiving new events. When paused, the button label changes to "▸ Resume" and a red indicator text "Paused" appears.

`[Export ▾]` — Dropdown with items: "CSV (Visible Columns Only)", "CSV (All Columns)", "XML". Triggers a browser file download.

`[Columns ▾]` — Dropdown allowing checkboxes to show or hide specific columns in the results table. Also contains a "Save Layout" option.

### 4.3 Time Range / View Mode Selector

Located directly below the toolbar, or as part of the toolbar right side. Implemented as a row of radio buttons or a `<select>`.

Options (rendered as clickable text links or radio buttons):
- **Real Time (streaming)** — connects a push stream; new events appear prepended to the table without page reload. No time filter.
- **Last Minute** — queries the last 60 seconds, auto-refreshes every 60 seconds.
- **Last 5 Minutes**
- **Last Hour**
- **Last 6 Hours**
- **Last 24 Hours**
- **Today** — midnight to now
- **Last 7 Days**
- **Custom** — reveals two datetime inputs: "Start Time" and "End Time", each with format `YYYY-MM-DD HH:MM:SS` or a calendar picker widget.

Selecting any option immediately triggers a new query and replaces current results.

### 4.4 Advanced Search / AQL Editor

Accessed via `[Search] → New Search`. Opens a full-width editor panel above the results table.

**AQL input area:** A `<textarea>` (width 100%, height ~60px, font-family monospace, font-size 12px) for writing raw AQL queries. Example:
```
SELECT sourceip, username, eventname, category, count(*) AS EventCount
FROM events
WHERE category = 5004
GROUP BY sourceip, username, eventname, category
LAST 24 HOURS
```

Below the AQL textarea, two buttons:
- `[Search]` — primary button. Executes the query. While running, shows a spinner/loading indicator and the button changes to `[Cancel Search]`.
- `[Cancel Search]` — secondary/danger button, only visible while a query is in progress. Cancels the running query. Partial results are displayed if available.

**Field reference panel** (collapsible, right of AQL editor): Lists all available AQL fields with their data types. Clicking a field name inserts it at the cursor position in the textarea.

### 4.5 Results Table

Standard HTML table. Columns are context-dependent based on the search type.

**Default columns for event searches:**
Current Time, Log Source, Event Name, Source IP, Source Port, Destination IP, Destination Port, Category, Username, Protocol, QID, Magnitude

**Row interaction:**
- Single click on a row — highlights the row (background `#D9EAF7`) and shows a row-detail panel at the bottom of the content area (or in a resizable split view).
- Right-click on a row — shows a context menu.
- Double-click — opens the full Event Details dialog (modal).

### 4.6 Right-Click Context Menu (on event row)

An absolutely-positioned `<div>`, background `#FFFFFF`, border `1px solid #CCCCCC`, box-shadow `2px 2px 6px rgba(0,0,0,0.2)`, z-index high. Disappears on click-outside.

Menu items:
- "View Event Details" — opens a modal dialog (see 4.7)
- "View Associated Offense" — navigates to the Offenses tab filtered to the offense containing this event
- "Filter on Source IP" — adds a filter `sourceip = [value]` to current search
- "Filter on Destination IP" — adds a filter `destinationip = [value]`
- "Filter on Username" — adds a filter `username = [value]`
- "Tune False Positive" — opens a wizard to create a false positive exception rule
- "Extract Property" — opens the Custom Property wizard, pre-populated with the selected event's payload, for defining a regex-based custom event property
- "Add to Reference Set" — opens a dialog: select a Reference Set name from `<select>`, then select which field value to add. Submitting writes the value to the reference set.
- "Map Event" — opens the QID mapping dialog: displays a searchable list of all QIDs. Selecting a QID and confirming re-maps this event's identifier.

### 4.7 Event Details Modal Dialog

A modal overlay. Background overlay: `rgba(0,0,0,0.4)`. Dialog box: `position: absolute`, centered, width 680px, max-height 80vh, overflow-y auto, background `#FFFFFF`, border `1px solid #666666`, box-shadow `3px 3px 8px rgba(0,0,0,0.3)`.

**Dialog title bar:** Height 24px, background `#0066CC`, color `#FFFFFF`, font Arial 12px bold, padding 4px 10px. Contains the dialog title "Event Information" left-aligned, and a close button (`✕`) right-aligned.

**Dialog body:** Padding 16px. Renders a two-column key-value table:

Each row contains: left cell = field name (Arial 12px, bold, color `#333333`, min-width 180px), right cell = field value (Arial 12px, color `#333333`).

Fields displayed: Log Source, Time, QID, Event Name, Low Level Category, High Level Category, Relevance, Severity, Credibility, Username, Source IP, Source Port, Source MAC, Destination IP, Destination Port, Protocol, Bytes, Payload (full raw log string in a `<pre>` or fixed-width font block).

Below the key-value section: Full Payload section. Label "Raw Payload:" in bold. Below it, a `<textarea>` or `<pre>` element, read-only, font-family monospace, font-size 11px, background `#F5F5F5`, border `1px solid #CCCCCC`, width 100%, height 120px, overflow-y auto.

Dialog footer buttons (right-aligned): `[Close]` secondary button.

---

## PART 5 — NETWORK ACTIVITY TAB

### 5.1 Purpose

Near-identical in structure to the Log Activity tab. Queries flow records (NetFlow, sFlow, IPFIX) instead of log events. All toolbar elements, time range selector, and table behaviors are identical to Log Activity with the differences noted below.

### 5.2 Structural Differences from Log Activity

**Default columns for flow results:**
Start Time, Source IP, Source Port, Destination IP, Destination Port, Protocol, Application, Source Bytes, Destination Bytes, Source Packets, Destination Packets, Direction (Inbound/Outbound/Internal), First Packet Time, Last Packet Time

**Additional toolbar button:**
`[View OverFlow Records]` — Secondary button. Navigates to a sub-page showing flow records that exceeded bandwidth capture limits (truncated or aggregated flows).

**No "Extract Property" in context menu** — this option is absent for flows.

**"Tune False Positive" context menu item** — present and functional for flows.

---

## PART 6 — ASSETS TAB

### 6.1 Purpose

Displays "asset profiles" — automatically discovered records for hosts observed communicating on the network. Asset data is aggregated from log sources (login events, authentication), network scans, and vulnerability assessment data. Each asset has a profile page.

### 6.2 Toolbar

`[Search Assets]` — Primary or secondary button. Opens the Asset Search form (a full-page form with multiple filter criteria fields).

`[Save Search]` — Secondary button. Saves current search criteria.

`[Import Assets]` — Secondary button. Opens a file-upload dialog accepting CSV or XML files from external scanners (Nessus, Qualys, etc.). File size limit noted in dialog.

`[Delete Selected]` — Danger-style secondary button. Only enabled when rows are checked. Shows confirm dialog before deletion.

`[Columns ▾]` — Same behavior as Log Activity.

### 6.3 Asset Search Form

A full-page form (not a modal) rendered in the content area. Multiple rows of search criteria, each row consisting of:
- A `<select>` for the field name (IP Address, Hostname, MAC Address, OS Name, Vulnerability Count, Port Number, etc.)
- A `<select>` for the operator ("Is", "Contains", "Greater Than", etc.)
- A `<input type="text">` for the value

A `[+]` button at the end of the last row adds another criteria row. A `[-]` button removes a row (not shown on the first row).

Buttons below the criteria rows: `[Search]` (primary), `[Clear]` (secondary), `[Save Criteria]` (secondary).

### 6.4 Asset Profile Page

Navigated to by clicking an asset's IP or hostname. Top section shows: IP Address (bold large), MAC Address, Hostname, Domain, OS Name (detected), OS Confidence percentage, Weight (asset risk weight), Net BIOS Name, DNS Name.

Below top section, a sub-tab navigation with tabs:
- **Ports** — table of open ports with columns: Port, Protocol, Application.
- **Vulnerabilities** — table of detected CVEs with columns: CVE ID, CVSS Score, Vulnerability Name, Description link.
- **Users** — table of usernames observed logging into this asset.
- **Services** — network services observed on this asset.

**Action buttons on profile page:**
`[View Events]` — secondary button. Navigates to Log Activity with filter `sourceip = [asset IP]`.
`[View Offenses]` — secondary button. Navigates to Offenses filtered to this asset.
`[Edit Asset]` — secondary button. Opens the asset editing form where a user can manually override: hostname, weight, OS name, owner name, description, criticality, and tags.
`[Research Vulnerabilities]` — secondary button. Opens IBM QRadar Vulnerability Manager (if licensed) filtered to this asset.

---

## PART 7 — REPORTS TAB

### 7.1 Toolbar

`[Create Report]` — primary button. Launches the Report Wizard (a separate wizard flow with steps: Layout Selection → Container Configuration → Data Source Configuration → Schedule and Distribution → Summary).

`[Generate Now]` — secondary button. Enabled when a report template row is selected. Triggers immediate generation of the selected report template. A spinner/loading indicator replaces the button text during generation.

`[Schedule ▾]` — secondary button with dropdown. Items: "Enable Schedule", "Disable Schedule", "Configure Schedule" (opens a schedule configuration dialog).

`[Duplicate]` — secondary button. Creates a copy of the selected report template with " - Copy" appended to the name.

`[Delete]` — danger secondary button. Deletes the selected report template with confirmation.

`[View Generated Reports]` — secondary button. Navigates to a list of previously generated report files. Each file can be downloaded as PDF or HTML.

`[Assign to Group]` — secondary button. Opens a dialog with a `<select>` listing available report groups. Selecting one moves the report template into that group for organization.

### 7.2 Report Templates List

Table with columns: Name, Group, Schedule, Last Generated, Format, Size. Rows are selectable. Clicking a name navigates to the Report Wizard in edit mode for that template.

---

## PART 8 — ADMIN TAB

### 8.1 Layout

The Admin tab renders as a category-based icon grid rather than a table. The main content area is divided into sections. Each section has a bold section header (Arial 13px, bold, color `#003366`, border-bottom `1px solid #CCCCCC`, padding 8px 0). Below each header are icon-link tiles in a horizontal or wrapping grid.

Each tile contains: a small icon (16×16px) and a text label (Arial 12px, color `#0066CC`, underlined). Clicking a tile navigates to the configuration page for that item.

### 8.2 Section: System Configuration

Tiles: "System Settings", "Console Settings", "License Management", "Authorized Services", "Backup and Recovery", "SIM Reset", "Syslog Forwarding", "IF-MAP Configuration"

**SIM Reset tile:** When clicked, shows a confirmation dialog with the text: "Warning: This action will remove all offense, source, destination, network, category, and annotation data from the Console. This action cannot be undone." Two buttons: `[OK]` (primary, danger intent) and `[Cancel]`.

**Deploy Changes button:** A persistent button rendered in a yellow/orange alert bar at the top of the Admin content area whenever there are uncommitted configuration changes. Text: "Deploy Changes". Background: `#CC7700` or similar warning color. Clicking it begins the deployment process. During deployment, an animated progress indicator is shown. Deployment takes 30–120 seconds depending on the scale of changes. The console remains operational during deployment.

### 8.3 Section: Data Sources

Tiles: "Log Sources", "Log Source Extensions", "Log Source Groups", "Log Source Protocols", "Protocols Configuration", "DSM Editor", "Auto Discovery"

**Log Sources page** (when clicked): A table listing all configured log sources. Columns: Name, Type, Enabled (checkbox), IP Address, Last Event, Events/Second. Toolbar has buttons: `[Add]`, `[Edit]`, `[Delete]`, `[Enable]`, `[Disable]`, `[Bulk Edit]`.

**DSM Editor** (when clicked): A specialized editor for creating and modifying Device Support Modules. Contains: a log source type selector, a log sample input area, a property mapping grid, and test buttons for regex patterns.

### 8.4 Section: User Management

Tiles: "Users", "User Roles", "Security Profiles", "Authentication", "User Management Settings"

**Users page:** Table of all user accounts. Columns: Username, Email, Role, Security Profile, Enabled. Toolbar: `[Add User]`, `[Edit]`, `[Delete]`, `[Enable]`, `[Disable]`.

**User Roles page:** Lists roles with permission checkboxes. Columns: Role Name, Description. Editing a role shows a full-page form with permission checkboxes grouped by area (Offenses, Log Activity, Reports, Admin, etc.).

### 8.5 Section: Network Hierarchy

Tiles: "Network Views", "Remote Networks", "Remote Services"

**Network Views** (when clicked): A tree structure showing the organization's network hierarchy. Each node represents a network range (CIDR notation). Operations: `[Add Network]`, `[Edit]`, `[Delete]`, drag-and-drop reordering.

### 8.6 Section: Reference Data

Tiles: "Reference Sets", "Reference Maps", "Reference Map of Sets", "Reference Map of Maps", "Reference Tables"

Each reference data page is a table listing existing collections. Each row has: Name, Type, Element Count, Last Updated, TTL (Time to Live setting). Operations: `[Create]`, `[Edit]`, `[Delete]`, `[Bulk Load from CSV]`, `[Export to CSV]`.

---

## PART 9 — RULE WIZARD (5-STEP FLOW)

### 9.1 Wizard Container Layout

The Rule Wizard replaces the standard content area entirely. No left sidebar is shown. The wizard occupies the full width of the content area. At the top is the Step Progress Indicator. Below it is the step-specific content form. At the bottom is the Wizard Navigation Footer.

### 9.2 Step Progress Indicator

A horizontal bar, height 30px, background `#E8EEF4`, border-bottom `1px solid #CCCCCC`, padding 8px 16px, font-size 11px.

Content: Five step labels connected by the separator character `›` with 6px margin on each side.

**Step labels:** "1. Introduction", "2. Type of Rule", "3. Rule Test Stack Editor", "4. Rule Response", "5. Rule Name / Notes"

**Rendering rules:** Steps already completed are rendered as clickable links (color `#0066CC`, underlined), allowing navigation backward. The current step is rendered as bold text (color `#003366`, not a link, not underlined). Future steps are plain text (color `#666666`, not links).

### 9.3 Wizard Navigation Footer

A bar at the bottom of the wizard. Height: 48px. Background: `#D5DEE8`. Border-top: `2px solid #AAAAAA`. Padding: 0 16px. Buttons are right-aligned.

**Buttons (right to left):**
1. `[Cancel]` — secondary button. Opens confirm dialog "Are you sure you want to cancel? All changes will be lost." Buttons: `[Yes, Cancel]` (primary), `[Continue Editing]` (secondary).
2. `[Next ›]` — primary button. Advances to the next step. Triggers client-side validation before proceeding. If validation fails, shows inline error messages and does not navigate.
3. `[‹ Back]` — secondary button (not shown on Step 1). Returns to the previous step. Preserves all data entered in the current step.

### 9.4 Step 1 — Introduction

Displays a static informational text block explaining what a rule is and listing the rule types. No interactive form elements. Only the `[Next ›]` button is active.

### 9.5 Step 2 — Type of Rule

Content: A radio button group, vertically arranged. Each option is a `<label>` containing a `<input type="radio">` followed by the option name in bold, followed by a description paragraph in `#666666`.

Options:
- **Event Rule** — "Tests against incoming log source data processed in real time by the QRadar Event Processor."
- **Flow Rule** — "Tests against incoming flow data processed by the QRadar Flow Processor."
- **Common Rule** — "Tests against both event and flow data simultaneously."
- **Offense Rule** — "Tests the parameters of an existing offense to trigger additional responses."
- **Building Block** — (visible only when accessed via "New Building Block") "A reusable named set of tests with no associated response actions."

The selected rule type determines which test categories are available in Step 3.

### 9.6 Step 3 — Rule Test Stack Editor

This is the primary subject of the interface specification. Described in full detail in PART 10.

### 9.7 Step 4 — Rule Response

**Form area:** A vertical list of response configurations, each controlled by a checkbox that enables or disables that response type.

**Response options:**

**"Ensure the detected event is part of an offense"** — Checkbox (default: checked for event rules). When enabled, reveals two sub-fields:
- "Index offense based on:" — A `<select>` with options: Source IP, Destination IP, Username, Hostname, QID, Source MAC, Log Source, Event Name. Determines how events are grouped into offenses.
- "Annotate this offense:" — A `<input type="text">`, value is the string that will appear as the offense name.
- A second checkbox: "This information should set or replace the name of the associated offense(s)." When checked, the annotation overwrites existing offense names.

**"Dispatch New Event"** — Checkbox. When enabled, reveals:
- "Event Name:" — `<input type="text">`
- "Event Description:" — `<input type="text">`
- "High Level Category:" — `<select>` with values from the QRadar taxonomy
- "Low Level Category:" — `<select>` dependent on High Level selection
- "Offense Naming:" — `<select>` with options: "Append", "Replace", "Do Not Annotate"

**"Notify"** — Checkbox. When enabled, reveals:
- "Email to:" — `<input type="text">` (comma-separated email addresses)

**"Add event field to a reference set"** — Checkbox. When enabled, reveals:
- "Field:" — `<select>` listing all event properties
- "Reference Set:" — `<select>` listing all existing reference sets

**Severity / Credibility / Relevance controls:** Three horizontal slider inputs or numeric `<input>` fields, each accepting values 1–10. Labels above each. These override the source event's values for the purpose of magnitude calculation.

**"Ensure the offense is not part of an existing offense"** — Checkbox that changes the offense creation to always generate a new offense rather than aggregating with existing ones.

### 9.8 Step 5 — Rule Name and Notes

**Form fields:**

"Rule Name:" — `<input type="text">`, width ~400px. Required field. If empty and user clicks `[Finish]`, shows inline error "Rule name is required."

"Notes:" — `<textarea>`, width ~400px, height 80px. Optional. Stores descriptive text visible in the rules list.

"Assign to group:" — `<select>` listing available rule groups. Default: "Other".

"Enable Rule:" — A checkbox, default checked. Unchecking creates the rule in a disabled state.

**Button:** `[Finish]` — Primary button in the wizard footer replaces `[Next ›]`. Submitting the form saves the rule, navigates to the Rules List, and shows a success notification banner.

---

## PART 10 — RULE TEST STACK EDITOR (STEP 3 IN DETAIL)

### 10.1 Rule Name Bar

A horizontal bar rendered at the top of the wizard content area, directly below the Step Progress Indicator. Height approximately 50px. Background `#EBF0F6`. Border-bottom `1px solid #CCCCCC`. Padding: 8px 12px.

Contains two fields horizontally arranged:

**Rule Name field:** `<label>` text "Rule Name:" (Arial 12px, bold, color `#333333`), followed by `<input type="text">` (width 320px, height 22px, border `1px solid #999999`, font Arial 12px). Pre-populated with a default string like "Custom Event Rule" which the user should replace.

**Notes field:** `<label>` text "Notes:" (Arial 12px, normal weight, color `#333333`), followed by `<input type="text">` (width 260px, height 22px, same styling). Optional.

### 10.2 Two-Panel Split Layout

Below the Rule Name Bar, the remaining content area is divided into two vertical columns by a 2px solid `#AAAAAA` divider line. Both panels have the same height, determined by the available viewport height. Both panels are independently scrollable (overflow-y: auto).

**Left panel (Panel A):** Width approximately 38% of the total content width (fixed pixel value around 380–420px). This is the Test Browser.

**Right panel (Panel B):** Width is the remaining space (flex: 1). This is the Test Stack.

### 10.3 Panel A — Test Browser

**Panel header:**  
Height 24px. Background `#C4D8EB`. Border-bottom `1px solid #AAAAAA`. Padding: 4px 10px. Text "Rule Tests" — Arial 12px, bold, color `#003366`.

**Filter area:**  
Below the panel header. Background `#F5F5F5`. Border-bottom `1px solid #CCCCCC`. Padding: 7px 8px. Vertical arrangement of two rows.

Row 1:
- `<label>` text "Filter:" — Arial 11px, color `#333333`, display inline, min-width 68px.
- `<input type="text">` — Remaining width of the panel. Height 20px. Border `1px solid #AAAAAA`. On `input` event (keystroke), immediately filters the list below without server request (client-side filtering against the pre-loaded test list).

Row 2:
- `<label>` text "Test Group:" — Arial 11px, color `#333333`, display inline, min-width 68px.
- `<select>` — Remaining width. Height 20px. Border `1px solid #AAAAAA`. Font Arial 11px.

Options in the "Test Group" `<select>` (in this order):
1. All Tests (default, value "")
2. ──────── (disabled option used as visual separator)
3. Event Property Tests (value "event")
4. IP / Port Tests (value "ip")
5. Log Source Tests (value "logsource")
6. Network / Zone Tests (value "network")
7. Date and Time Tests (value "datetime")
8. Reference Data Tests (value "refdata")
9. Function Tests (value "function")
10. Host Profile Tests (value "hostprofile")
11. Custom Property Tests (value "customprop")
12. Offense Tests (value "offense")
13. Flow Property Tests (value "flow") — only shown for Flow and Common rule types

Changing this `<select>` immediately re-filters the list below. Both filters (text keyword AND selected group) are applied simultaneously with AND logic.

**Test list:**  
A `<ul>` or `<div>` with `overflow-y: auto`, height fills remaining Panel A space. No padding. No outer margin.

Each test is rendered as an `<li>` element:
- Padding: 4px 10px. Height: auto (minimum ~22px), text may wrap.
- Font: Arial 11px. Color `#333333`.
- Border-bottom: `1px solid #EEEEEE`.
- Cursor: pointer.
- Hover state: background `#D9EAF7`.
- Selected state (single click to select): background `#0066CC`, color `#FFFFFF`.
- Double-click: same as clicking `[Add »]`.

Group header rows (non-selectable) are interspersed in the list above their group's tests:
- Background `#E8EEF4`. Color `#003366`. Font-weight bold. Font-size 10px. Letter-spacing 0.5px. Text is uppercase. Padding: 3px 10px. Not selectable, cursor default.

The full canonical list of test template strings, grouped, is as follows. Each string uses placeholder text in the position of configurable values, which are later turned into hyperlinks in Panel B:

**Event Property Tests:**
- `when the event matches this search filter`
- `when the event QID is one of the following QIDs`
- `when the event category for the event is one of these high level categories`
- `when the event category for the event is one of these low level categories`
- `when the event matches this regex filter`
- `when the event severity is greater than this value`
- `when the event credibility is greater than this value`
- `when the event relevance is greater than this value`
- `when the payload contains this string`
- `when the payload does not contain this string`
- `when the event name is one of these event names`
- `when the username is one of these usernames`
- `when the event matches this custom property filter`

**IP / Port Tests:**
- `when the source IP is one of these IP addresses`
- `when the destination IP is one of these IP addresses`
- `when the source or destination IP is one of these IP addresses`
- `when the source IP is NOT one of these IP addresses`
- `when the destination IP is NOT one of these IP addresses`
- `when the source port is one of these ports`
- `when the destination port is one of these ports`
- `when the source port is NOT one of these ports`
- `when the destination port is NOT one of these ports`
- `when the protocol is one of these protocols`

**Log Source Tests:**
- `when the event(s) were detected by one or more of these log sources`
- `when the event(s) were detected by one or more of these log source types`
- `when the event(s) were detected by one or more of these log source groups`
- `when the event(s) were NOT detected by any of these log source types`

**Network / Zone Tests:**
- `when the source network is one of these networks`
- `when the destination network is one of these networks`
- `when the source or destination network is one of these networks`
- `when the source IP is in the local network`
- `when the destination IP is in the local network`

**Date and Time Tests:**
- `when the current time is after this time of day`
- `when the current time is before this time of day`
- `when the current time is between these hours`
- `when the day of week is one of these days`
- `when the date is one of these dates`

**Reference Data Tests:**
- `when the source IP is contained in this reference set`
- `when the destination IP is contained in this reference set`
- `when the username is contained in this reference set`
- `when the event field is contained in this reference set`
- `when the source IP is NOT contained in this reference set`
- `when the (source/destination) IP is in this reference map's key`
- `when the (source/destination) IP is in this reference map's value`

**Function Tests:**
- `when an event matches any of the following rules`
- `when an event matches all of the following rules`
- `when this event is seen more than this many times in this many minutes`
- `when this sequence of events is seen in this many minutes`
- `when this event has not been seen in this many minutes`

**Host Profile Tests:**
- `when the source IP has a vulnerability with a CVSS score greater than this value`
- `when the destination IP belongs to this network`
- `when the source IP has this OS`

**Custom Property Tests:**
- `when the event matches this AQL filter`

**Offense Tests (only for Offense rule type):**
- `when the offense magnitude is greater than this value`
- `when the offense is assigned to this user`
- `when the offense was created by one of these rules`
- `when the offense source network is one of these networks`

**Add button:**  
Below the test list, within Panel A, a right-aligned secondary button `[Add »]`. Height 22–24px. On click, adds the currently highlighted test to the bottom of Panel B's condition stack. If no test is selected, this button has no effect (or shows a tooltip "Please select a test first").

### 10.4 Panel B — Test Stack

**Panel header:**  
Same styling as Panel A header. Text "Tests" — Arial 12px, bold, color `#003366`. Background `#C4D8EB`. Height 24px.

**Logic connector row:**  
Directly below the panel header. Height approximately 32px. Background `#F0F4F8`. Border-bottom `1px solid #CCCCCC`. Padding: 6px 10px. Vertical center alignment.

Content is inline text with an embedded `<select>`:
- Text before select: "Apply this rule when " — Arial 12px, color `#333333`.
- `<select>` element: width approximately 55px, height 20px, border `1px solid #999999`, font Arial 12px bold, color `#003366`. Options: "ALL" (default, representing AND logic) and "ANY" (representing OR logic).
- Text after select: " of the following conditions match:" — Arial 12px, color `#333333`.

**Condition list (the stack):**  
A `<ul>` with `overflow-y: auto`. Height fills remaining Panel B space. No outer padding.

**Empty state (when no conditions have been added):**  
A single `<li>` or `<div>` with: background `#FFFFFF`, padding 30px 20px, text aligned center, font Arial 12px, font-style italic, color `#666666`. Text: "No tests have been added to this rule. Use the filter and list above to find and add tests."

**Each condition row (when conditions exist):**  
Each row is an `<li>` element with:
- Padding: 5px 10px 5px 6px. Min-height 26px. Height auto.
- Border-bottom: `1px solid #EEEEEE`.
- Display: flex (or equivalent), align-items flex-start.
- Hover background: `#F5FBFF`.
- When clicked (row selected): background `#D9EAF7`, border-left `3px solid #0066CC`.
- Cursor: default.

Each row contains two children:

**Child 1 — Delete button:**  
A `<button>` or `<a>` element. Width 16px, height 16px. Border `1px solid #CC0000`. Color `#CC0000`. Background none. Font-size 10px. Margin-right 8px. Margin-top 1px (to align with text baseline). Display flex, align-items center, justify-content center. Content: character `x` or `✕`. On hover: background `#CC0000`, color `#FFFFFF`. On click: immediately removes this condition row from the stack (no confirmation dialog).

**Child 2 — Condition text:**  
A `<span>` with flex: 1. Font: Arial 12px. Color `#333333`. Line-height 1.5.

The text content is a natural-language sentence assembled from:
1. A prefix: "when " for the first condition row, "and when " for all subsequent rows. This prefix is plain text, color `#555555`.
2. The static text portion of the test template (same words as in the Panel A list item).
3. One or more configurable value placeholders, rendered as `<a>` hyperlinks.

**Hyperlink rendering rules for configurable values:**
- Color: `#0066CC`. Text-decoration: underline. Cursor: pointer. Font: Arial 12px (same as surrounding text, not bold).
- When a value has NOT yet been configured: The hyperlink text is the placeholder description phrase from the template, e.g., "these IP addresses", "this string", "these log source types", "these QIDs". This text is the identifier that communicates to the user that configuration is needed.
- When a value HAS been configured: The hyperlink text changes to the actual configured value in brackets, e.g., "[192.168.1.0/24]", "[SPEEDING]", "[Microsoft Windows Security Event Log]". The hyperlink gets an additional CSS style: background `#EBF5FF`, border `1px solid #99CCFF`, padding `0 3px`, border-radius 2px (inline box style).
- On click: Opens a configuration dialog (see 10.5).

**Drag handle (optional, present in some QRadar versions):**  
A small handle icon (`⠿` or `≡`) at the far left of each row (before the delete button). Cursor `grab`. Allows drag-and-drop reordering of conditions within the stack. During drag, the dragged row shows `opacity: 0.6` and a dashed border appears at the drop target position.

### 10.5 Configuration Dialogs for Condition Values

These dialogs are triggered by clicking a hyperlink within a condition row. They are modal overlays following the same modal structure as the Event Details dialog (section 4.7):
- Overlay: `rgba(0,0,0,0.4)`
- Dialog box: `position: absolute`, centered, background `#FFFFFF`, border `1px solid #666666`, box-shadow `3px 3px 8px rgba(0,0,0,0.3)`, no border-radius.
- Title bar: height 24px, background `#0066CC`, color white, Arial 12px bold. Left-aligned title text. Right-aligned close `[✕]` button.
- Dialog body: padding 14px.
- Dialog footer: right-aligned buttons `[Submit]` (primary) and `[Cancel]` (secondary).

**Dialog types by parameter type:**

**Type 1 — Single text string input:**  
Used for: "this string" (payload contains), "this value" (severity threshold).  
Body contains: A `<label>` and a single `<input type="text">` (width 100%, height 22px). On focus, cursor is placed in the input. Pressing Enter submits.

**Type 2 — Multi-select (Available → Selected two-panel):**  
Used for: IP addresses, ports, log source types, log source groups, QIDs, categories, networks, reference sets, days.  
Body layout: Vertically stacked sections.
- Section 1 (optional): A search filter row: `<label>` "Search:" and `<input type="text">` (width ~200px). On input event, filters the Available list below in real time (client-side).
- Section 2: Two side-by-side `<div>` panels, each occupying 50% width with 8px gap:
  - Left panel label: "Available:" (Arial 11px, bold). Below it: a `<div>` with `border: 1px solid #CCCCCC`, height 120px, `overflow-y: scroll`, background white. Populated with all valid option values, each as a clickable row: padding 3px 8px, font Arial 11px, cursor pointer, hover background `#D9EAF7`. Clicking an item in Available adds it to Selected (moves or copies it to the right panel and highlights it).
  - Right panel label: "Selected:" (Arial 11px, bold). Below it: same `<div>` structure. Clicking an item in Selected removes it back to Available.
- Section 3 (optional): A manual entry row: `<label>` "Or enter value:" and `<input type="text">` and a small `[Add]` secondary button. Submitting adds the typed value to the Selected panel.

**Type 3 — AQL / search filter builder:**  
Used for: "this search filter", "this AQL filter".  
Body contains: A `<textarea>` (width 100%, height 60px, monospace font) for entering AQL WHERE clause conditions. Example hint text may be shown above: "Example: sourceip = '192.168.1.1' AND category = 5004".  
Below the textarea, a `[Validate]` secondary button that checks AQL syntax and shows inline errors.

**Type 4 — Single select from list:**  
Used for: protocol, offense type, category, username.  
Body contains a single `<select>` element populated with all valid options.

**Type 5 — Numeric input:**  
Used for: CVSS threshold, severity threshold, event count, time window (minutes).  
Body contains one or two `<input type="number">` elements with labels. Minimum and maximum values are enforced.

**On Submit:**  
The dialog closes. The hyperlink text in the condition row is updated to reflect the configured value. If the value was previously empty and is now configured, the link gets the "configured" visual style (background box). If the user submits with no value (clears the field), the link reverts to its unconfigured placeholder text.

**On Cancel:**  
Dialog closes with no changes to the condition row.

### 10.6 Validation on "Next ›" Click

Before advancing from Step 3 to Step 4:
1. If the condition stack is empty: An error message is displayed immediately below the Rule Name Bar. The message is a `<div>` with background `#FFEEEE`, border `1px solid #CC0000`, color `#CC0000`, padding 6px 10px, font Arial 12px. Text: "You must add at least one test condition before proceeding." The page does NOT navigate.
2. If the Rule Name field is empty: Same error styling. Text: "Rule name is required."

---

## PART 11 — RULES LIST PAGE

### 11.1 Navigation

Accessed via Offenses → Rules menu → "View Rules".

### 11.2 Page Layout

The page has the same breadcrumb as other offenses sub-pages. The content area is a full-width table.

### 11.3 Toolbar

`[Actions ▾]` — Secondary button with dropdown. Items depend on selected rows:
- "Edit Rule" — opens the selected rule in the Rule Wizard at Step 3
- "Enable Rule" — toggles enabled state
- "Disable Rule" — toggles enabled state
- "Delete Rule" — deletes with confirmation
- "Assign to Group" — moves to a group
- "Export Rule" — downloads the rule as an XML file

`[Groups ▾]` — Secondary button with dropdown. Lists all rule groups for filtering the table. Selecting a group filters the list to only rules in that group.

`[Add Group]` — Secondary button. Opens an inline input to create a new rule group.

`[Search ▾]` — Secondary button with dropdown. "New Search" opens a search form with filter fields for rule name, enabled state, group, and rule type.

### 11.4 Rules Table

Columns: Checkbox, Rule Name (link to edit), Type (Event/Flow/Common/Offense/BB), Group, Enabled (checkbox), Creation Date, Modified Date, Origin (System/Custom).

Enabled checkbox in each row: clicking directly toggles the enabled/disabled state of that rule with a brief visual confirmation (color change on the checkbox or a toast notification).

---

## PART 12 — GLOBAL INTERACTION PATTERNS

### 12.1 Column Sorting

Any column header in any data table is clickable to sort. First click: sorts ascending. Second click: sorts descending. Third click: removes sort (returns to default order). Current sort state is indicated by a triangle character after the column header text: `▲` for ascending, `▼` for descending. Font-size of triangle: 10px. Color: `#333333`.

### 12.2 Column Resizing

Column boundaries in tables are draggable. Hovering over the border between two column headers shows `cursor: col-resize`. Dragging resizes the two adjacent columns proportionally.

### 12.3 Pagination

Below all paginated tables. Layout (left to right): "Page:" text, `<input type="text">` (width 30px) containing current page number (editable, pressing Enter navigates to that page), "of N" text, separator, `[|<]` (first page), `[<]` (previous), individual page number links for pages near current (up to 5), `[>]` (next), `[>|]` (last), separator, "View:" text, `<select>` with options 25, 50, 100, 250 (items per page). Changing items per page reloads with page 1.

All pagination elements: Arial 11px, color `#0066CC`, underlined for clickable items.

### 12.4 Inline Error Messages

Appear directly below the input field or form section that triggered the error. `<div>` element. Font: Arial 12px. Color `#CC0000`. No background color on inline errors (only the block-level errors described in 10.6 use the colored background box).

### 12.5 Notification/Toast Messages

In the bottom-right corner of the viewport. `position: fixed`. Width ~300px. Background `#FFFFFF`. Border-left `4px solid #0066CC` (for info/success) or `4px solid #CC0000` (for errors). Box-shadow `2px 2px 8px rgba(0,0,0,0.2)`. Padding 10px 14px. Font Arial 12px. Auto-dismisses after 5 seconds, or can be manually closed via a `[✕]` in the top-right corner of the toast. Toasts stack vertically.

### 12.6 Tooltip Behavior

Certain UI elements have tooltips. Implemented via the native HTML `title` attribute. No custom tooltip library. Tooltip appearance is determined by the browser.

### 12.7 Loading States

When a server request is in progress:
- A spinner is shown in the content area. The spinner is a small animated GIF or CSS animation, centered in the panel that is loading.
- Buttons that triggered the request are disabled (attribute `disabled`, appearance grayed out) for the duration.
- No full-page overlay is used for most actions; only the specific panel or table area shows the loading state.

---

## PART 13 — USER PREFERENCES DIALOG

Accessed via the username dropdown in the header → "User Preferences". Opens as a full-page form (not a modal) replacing the current content area.

**Fields:**
- "Email Address:" — `<input type="text">`, required
- "Language:" — `<select>` with locale options
- "Time Zone:" — `<select>` with timezone list
- "Default Time Range:" — `<select>` for default search time range
- "Enable Popup Notifications:" — checkbox
- "Items Per Page:" — `<select>` with 25, 50, 100, 250
- "Change Password:" — section with three fields: Current Password, New Password, Confirm New Password

**Save button:** `[Save]` primary button. `[Cancel]` secondary button.

---

*End of specification.*  
*All measurements are in pixels unless otherwise noted. All color values are hexadecimal. All font values assume the IBM QRadar 7.3–7.5 console as the reference implementation.*
