# IBM QRadar — Rule Test Stack Editor: Mô Tả Giao Diện Chi Tiết

> **Mục đích tài liệu:** Mô tả đầy đủ, chính xác toàn bộ giao diện (UI) của màn hình **Rule Test Stack Editor** trong IBM QRadar SIEM để các AI frontend developer hoặc kỹ sư UI/UX có thể tái tạo hoặc clone lại giao diện này một cách trung thực nhất.

---

## 1. Tổng quan kiến trúc giao diện

### 1.1 Vị trí trong luồng ứng dụng

Rule Test Stack Editor **không phải một trang độc lập**, mà là bước thứ 3 (Step 3) trong một **Rule Wizard** — một trình hướng dẫn nhiều bước, được mở trong toàn bộ viewport (full-page dialog) sau khi người dùng chọn:

> **Offenses tab → Rules → Actions → New Event Rule / New Common Rule / New Flow Rule**

**Các bước trong Wizard:**
```
[Step 1: Introduction] → [Step 2: Rule Type] → [Step 3: Rule Test Stack Editor ← CHÚNG TA Ở ĐÂY] → [Step 4: Rule Response] → [Step 5: Rule Summary / Finish]
```

### 1.2 Kiểu giao diện tổng thể

- **Phong cách:** Enterprise Web Application cổ điển (IBM pre-Carbon Design System, phiên bản QRadar 7.x)
- **Layout:** Multi-panel, single-page wizard không dùng modal popup — chiếm toàn bộ vùng content
- **Framework:** Server-rendered HTML, không phải SPA. Không sử dụng React/Angular
- **Browser target:** Internet Explorer 10+, Firefox ESR, Chrome
- **Responsive:** **Không** — layout cố định (fixed-width ~1280px)

---

## 2. Global Layout — Cấu trúc tổng thể

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [IBM LOGO]  IBM Security QRadar SIEM                    [User: admin ▾] [?] │  ← Header Bar (height: ~40px)
├────────┬────────────┬──────────────┬────────────┬──────────┬─────────────────┤
│Dashboard│  Offenses  │ Log Activity │   Network  │  Assets  │Reports │ Admin  │  ← Tab Navigation (height: ~32px)
├──────────────────────────────────────────────────────────────────────────────┤
│  [Offenses] > [Rules] > Rule Wizard: Rule Test Stack Editor                  │  ← Breadcrumb (height: ~24px)
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [Wizard Step Panel - see section below]                                     │  ← Main Content Area
│                                                                              │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                          [Back]    [Next]    [Cancel]                         │  ← Wizard Navigation Footer (height: ~48px)
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Header Bar

| Property | Value |
|---|---|
| Background color | `#1B3A5C` (dark navy blue) hoặc `#003366` |
| Height | `40px` |
| Padding | `0 16px` |
| Logo | IBM logo màu trắng, căn trái |
| Product name | "IBM Security QRadar SIEM" — màu trắng, font-size: 14px, font-weight: bold |
| Right side | `[Username ▾]` dropdown + `[?]` help icon — màu trắng |
| Font | Arial, Helvetica Neue |

---

## 4. Tab Navigation Bar

| Property | Value |
|---|---|
| Background color | `#2B4F7A` (mid-navy) |
| Height | `32px` |
| Tabs | Dashboard \| Offenses \| Log Activity \| Network Activity \| Assets \| Reports \| Admin |
| Active tab | White text với bottom border màu trắng 2px, background `#3A6EA5` |
| Inactive tab | Màu xám nhạt `#9ABBE0`, hover: màu trắng |
| Font | Arial, 12px |
| Tab separator | Không có đường kẻ, chỉ dùng khoảng cách |
| Current active | **Offenses** |

---

## 5. Wizard Step Progress Indicator

Hiển thị **ngay phía trên nội dung wizard**, dạng breadcrumb/step trail ngang:

```
[1. Introduction] > [2. Type of rule] > [3. Rule Test Stack Editor] > [4. Rule Response] > [5. Summary]
```

| Property | Value |
|---|---|
| Background | `#E8EEF4` (xám nhạt, xanh lạnh) |
| Height | `32px` |
| Current step font | Bold, màu `#003366`, underline |
| Completed step | Màu `#0066CC`, clickable link |
| Future step | Màu `#666666`, không clickable |
| Separator | Ký tự `>` hoặc `»` màu xám |
| Padding | `8px 16px` |

---

## 6. Rule Test Stack Editor — Vùng nội dung chính

Đây là **phần quan trọng nhất**. Toàn bộ nội dung chính được chia thành **2 panel chính** xếp dọc (vertical stacking):

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Rule Name: [______________________________________________]   [Notes ▾]     │  ← Rule Name Bar
├────────────────────────────────┬─────────────────────────────────────────────┤
│                                │                                             │
│   PANEL A: TEST BROWSER        │        PANEL B: TEST STACK (CONDITIONS)     │
│   (Trái - ~40% width)          │        (Phải - ~60% width)                  │
│                                │                                             │
└────────────────────────────────┴─────────────────────────────────────────────┘
```

> **Lưu ý:** Tùy phiên bản QRadar, layout có thể là split ngang (left-right) hoặc stack dọc. Phổ biến nhất là layout **2 cột ngang** với panel trái là Test Browser và panel phải là Test Stack. Một số phiên bản đặt Test Browser phía trên Test Stack theo kiểu full-width.

---

## 7. Rule Name Bar (Thanh tên rule)

Nằm **ở trên cùng** của vùng wizard content, trước 2 panel:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Rule Name:  [_______________________text input_____________________]         │
│              Notes: [________optional description_________]                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Element | Details |
|---|---|
| Label "Rule Name:" | Font: Arial 12px, bold, color: `#333333` |
| Text input | Width: ~400px, height: 22px, border: `1px solid #999999`, background: white, font: Arial 12px |
| Placeholder | Empty (no placeholder text) |
| Label "Notes:" | Font: Arial 12px, color: `#333333` |
| Notes input | Multiline textarea hoặc single-line input ~400px wide |
| Background container | `#F0F4F8` hoặc `#E8EEF4` |
| Padding | `8px 12px` |
| Border bottom | `1px solid #CCCCCC` |

---

## 8. PANEL A — Test Browser (Trình duyệt test)

**Vị trí:** Cột trái, chiếm khoảng 35–40% chiều rộng tổng

### 8.1 Header của Panel A

```
┌──────────────────────────────────┐
│  Rule Tests                      │  ← Tiêu đề panel
├──────────────────────────────────┤
│  Filter: [____________keyword___] │  ← Ô tìm kiếm
│  Test Group: [__Category____  ▾] │  ← Dropdown lọc theo nhóm
├──────────────────────────────────┤
```

| Element | Details |
|---|---|
| Panel title "Rule Tests" | Font: Arial 12px, **bold**, color: `#003366`, background: `#C4D8EB` hoặc `#D0E4F5` |
| Panel title height | 24px, padding: `4px 8px` |
| Filter label | "Filter:" — Arial 11px, color: `#333333` |
| Filter input | Text input, width: 100% - 60px, height: 20px, border: `1px solid #AAAAAA`, background: white |
| Test Group label | "Test Group:" — Arial 11px, color: `#333333` |
| Test Group dropdown | `<select>` element, width: ~200px, border: `1px solid #AAAAAA` |
| Filter row background | `#F5F5F5` |
| Padding filter area | `6px 8px` |

### 8.2 Nội dung dropdown "Test Group"

Danh sách các mục trong dropdown (theo thứ tự xuất hiện):

```
[All Tests]
──────────────────
Event Property Tests
Flow Property Tests
Network Property Tests
IP / Port Tests
Date/Time Tests
Function Tests
Host Profile Tests
Log Source Tests
Reference Data Tests
Custom Property Tests
Offense Tests
```

| Property | Value |
|---|---|
| Option font | Arial 12px |
| Separator | `<optgroup>` hoặc `<option disabled>` với dashes |
| Default selected | "All Tests" hoặc (nếu user đã type keyword, filter tự động) |

### 8.3 Danh sách Rule Tests (Scrollable list)

Phần còn lại của Panel A là một **danh sách cuộn** (scrollable) chứa tất cả rule tests có thể thêm vào.

```
┌──────────────────────────────────────────────────────────┐
│ ▶ when the event matches this search filter              │  ← Mỗi item là 1 dòng
│ ▶ when the event(s) were detected by one or more of...  │
│ ▶ when the source IP is one of these IP addresses       │
│ ▶ when the destination port is one of these ports       │
│   when the payload contains this string                 │  (highlighted / selected)
│ ▶ when the source network is one of these networks      │
│ ▶ when the event category for the event is one of...    │
│ ▶ when the event QID is one of the following QIDs       │
│   ...                                                   │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| List container background | `#FFFFFF` |
| List item height | ~22–24px per line |
| List item font | Arial 11px–12px, color: `#000000` |
| List item padding | `3px 8px` |
| Hover state | background: `#D9EAF7`, cursor: pointer |
| Selected/active state | background: `#3572B0` hoặc `#0066CC`, text color: white |
| Border | `1px solid #CCCCCC` bao quanh list |
| Scrollbar | Native browser scrollbar, hẹp |
| Icon (▶) | Mũi tên nhỏ hoặc bullet, không có trong tất cả phiên bản |
| Max height | Chiếm hết phần còn lại của panel, cuộn dọc |

**Ví dụ danh sách đầy đủ các test (common examples):**

```
Event Property Tests:
  when the event matches this search filter
  when the event QID is one of the following QIDs
  when the event category for the event is one of these high-level categories
  when the event category for the event is one of these low-level categories
  when the event matches this regex filter
  when the severity is greater than X
  when the credibility is greater than X

IP / Port Tests:
  when the source IP is one of these IP addresses
  when the destination IP is one of these IP addresses
  when the source port is one of these ports
  when the destination port is one of these ports
  when the source or destination IP is one of these addresses

Log Source Tests:
  when the event(s) were detected by one or more of these log sources
  when the event(s) were detected by one or more of these log source types
  when the event(s) were detected by one or more of these log source groups

Network Property Tests:
  when the source network is one of these networks
  when the destination network is one of these networks

Reference Data Tests:
  when the source IP is contained in reference set X
  when the event matches an entry in this reference set

Function Tests:
  when an event matches any|all of the following rules
  when this rule is triggered more than X times in Y minutes

Date / Time Tests:
  when the current time is after X and before Y
  when the day of week is one of these days
```

### 8.4 Nút Add (Thêm test vào stack)

Nằm **phía dưới** list hoặc giữa 2 panel:

```
                    [  Add  >>  ]
```

| Property | Value |
|---|---|
| Button text | "Add »" hoặc "Add >" hoặc "Add Test" |
| Button style | IBM classic button: background `#E8E8E8`, border `1px solid #999`, hover: `#DDEEFF` |
| Font | Arial 12px, color: `#333333` |
| Height | 22–24px |
| Position | Dưới list của Panel A hoặc giữa 2 panel |

---

## 9. PANEL B — Test Stack / Active Conditions (Ngăn xếp điều kiện)

**Vị trí:** Cột phải, chiếm khoảng 60–65% chiều rộng tổng

Đây là nơi hiển thị **tất cả các điều kiện đã được thêm vào rule**, xếp thành một "stack" (ngăn xếp) theo thứ tự từ trên xuống.

### 9.1 Header của Panel B

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Tests                                                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Title "Tests" hoặc "Rule Conditions" | Arial 12px, bold, color: `#003366` |
| Background header | `#C4D8EB` hoặc `#D0E4F5` (giống Panel A header) |
| Height | 24px |

### 9.2 Logic Connector Row (Hàng logic AND/ALL)

Ngay dưới header, một hàng mô tả logic kết hợp:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Apply this rule when [ALL ▾] of the following conditions match:             │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Element | Details |
|---|---|
| Text trước dropdown | "Apply this rule when" — Arial 12px, color: `#333333` |
| Dropdown | `<select>` với 2 options: `ALL` và `ANY`. Mặc định: `ALL` |
| Text sau dropdown | "of the following conditions match:" — Arial 12px |
| Background | `#F0F4F8` |
| Padding | `6px 8px` |
| Border bottom | `1px solid #CCCCCC` |

### 9.3 Stack của các Conditions

Mỗi điều kiện được hiển thị như một **dòng văn bản** với các từ có thể cấu hình được highlight dưới dạng **hyperlinks màu xanh** (clickable inline values):

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [x] and when the event(s) were detected by one or more of  [these log source │
│         types]                                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ [x] and when the [source IP] is one of these IP addresses [192.168.1.0/24]  │
├──────────────────────────────────────────────────────────────────────────────┤
│ [x] and when the payload contains this string [SPEEDING]                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ [x] and when the event category for the event is one of these [high level    │
│         categories]                                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Element | Details |
|---|---|
| Container background | `#FFFFFF` |
| Row height | `auto` — tối thiểu 26px, có thể wrap sang dòng 2 |
| Row padding | `5px 8px` |
| Row border bottom | `1px solid #E0E0E0` |
| Row hover | Background `#F5FBFF` |
| Alternate row color | Không có (all white) hoặc nhẹ `#FAFAFA` |
| **Delete button [x]** | Nằm đầu tiên ở bên trái mỗi row, font: Arial 11px, color: `#CC0000` hoặc `#FF0000`, là link có chữ "x" hoặc icon ✕ |
| **"and when" prefix** | Plain text "and when" — Arial 12px, color: `#333333`, không in đậm |
| **Configurable values** | Dạng hyperlink: màu `#0066CC`, underlined, font: Arial 12px, cursor: pointer |
| **Configured values** | Sau khi set giá trị, hyperlink hiển thị giá trị cụ thể (vd: "[SPEEDING]", "[Microsoft Windows Security Event Log]") |
| **Unconfigured values** | Vẫn là hyperlink nhưng hiển thị text mô tả như "these log source types", "this string", "these IP addresses" |
| Row selection | Click để chọn row → background `#D9EAF7`, border-left: `3px solid #0066CC` |

### 9.4 Trạng thái "Empty Stack" (Khi chưa có điều kiện nào)

Khi chưa thêm test nào:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│    No tests have been added to this rule.                                    │
│    Use the filter above to find and add tests.                               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Text | "No tests have been added to this rule." |
| Text style | Arial 12px, italic, color: `#666666` |
| Alignment | Center |
| Background | `#FFFFFF` |

---

## 10. Popup Dialog: Cấu hình giá trị cho một condition

Khi người dùng **click vào một hyperlink** (configurable value) trong một condition của stack, một **popup/dialog nhỏ** xuất hiện để cho phép nhập/chọn giá trị.

### Ví dụ: Dialog "Configure IP Addresses"

```
┌─────────────────────────────────────────────────────────┐
│  [x]  Configure IP Addresses                            │  ← Title bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Search: [_________________________]                    │  ← Search filter
│                                                         │
│  Available Values:              Selected Values:        │
│  ┌─────────────────────────┐   ┌─────────────────────┐  │
│  │ 10.0.0.1                │   │ 192.168.1.0/24       │  │
│  │ 10.0.0.2                │   │                     │  │
│  │ 172.16.0.0/16           │   │                     │  │
│  │ 192.168.1.0/24          │   │                     │  │
│  │ ...                     │   │                     │  │
│  └─────────────────────────┘   └─────────────────────┘  │
│                                                         │
│  Or enter value manually:  [___________________] [Add]  │
│                                                         │
│                        [Submit]  [Cancel]               │
└─────────────────────────────────────────────────────────┘
```

### Ví dụ: Dialog "Configure String" (cho payload)

```
┌─────────────────────────────────────────────────────────┐
│  [x]  Configure String                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Enter string:  [______________________________________] │
│                                                         │
│                        [Submit]  [Cancel]               │
└─────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Dialog background | `#FFFFFF` |
| Dialog border | `1px solid #666666` |
| Dialog shadow | `2px 2px 6px rgba(0,0,0,0.3)` |
| Title bar background | `#3572B0` hoặc `#0066CC` (IBM blue) |
| Title bar text | White, Arial 12px, bold |
| Title bar height | 24px, padding: `4px 8px` |
| Close button [x] | Top-right corner, màu trắng |
| Dialog width | 400–600px tùy loại |
| Button "[Submit]" | Background: `#0066CC`, color: white, border: none, padding: `4px 16px`, Arial 12px |
| Button "[Cancel]" | Background: `#E8E8E8`, color: `#333333`, border: `1px solid #999`, padding: `4px 16px` |
| Input fields | Border `1px solid #999999`, background: white |
| Available/Selected panels | Height: ~120–150px, overflow-y: scroll, border: `1px solid #CCCCCC` |
| List items | Selectable, highlight on hover `#D9EAF7`, selected `#3572B0` white text |

---

## 11. Wizard Navigation Footer (Thanh điều hướng)

Thanh cố định ở **đáy của wizard**, chứa 3 nút điều hướng:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                [< Back]    [Next >]    [Cancel]              │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Element | Details |
|---|---|
| Container background | `#E0E8F0` hoặc `#D5DEE8` |
| Container height | `44–48px` |
| Border top | `2px solid #AAAAAA` |
| **[< Back]** | Background: `#E8E8E8`, border: `1px solid #999`, color: `#333`, padding: `5px 18px`, hover: `#D0D8E0` |
| **[Next >]** | Background: `#0066CC` (IBM blue), border: `none`, color: `white`, padding: `5px 18px`, font-weight: bold, hover: `#004999` |
| **[Cancel]** | Background: transparent, border: `1px solid #999`, color: `#333`, padding: `5px 18px`, hover: background `#FFE0E0` |
| Font tất cả nút | Arial 12px |
| Button alignment | Float right hoặc flex justify-end |
| Spacing giữa nút | 8px gap |

---

## 12. Bảng màu chính (Color Palette)

| Token | Hex | Dùng cho |
|---|---|---|
| IBM Navy (Header) | `#003366` hoặc `#1B3A5C` | Header bar, panel headers |
| IBM Blue (Primary) | `#0066CC` | Buttons chính, hyperlinks, selected states |
| IBM Blue Dark | `#004999` | Hover state của primary buttons |
| IBM Blue Light | `#D9EAF7` | Highlight/selected rows |
| Panel Header Blue | `#C4D8EB` | Panel title bars |
| Tab Active | `#3A6EA5` | Active navigation tab |
| Background Main | `#F0F4F8` | Tổng thể page background |
| Background White | `#FFFFFF` | List containers, inputs |
| Background Gray | `#F5F5F5` | Filter areas, toolbar |
| Text Primary | `#333333` | Body text |
| Text Secondary | `#666666` | Labels, inactive items |
| Border Standard | `#CCCCCC` | Borders của elements |
| Border Dark | `#999999` | Borders of inputs và buttons |
| Danger/Delete | `#CC0000` | Delete [x] buttons |
| Success/Enabled | `#006600` | Active/enabled states |
| Warning | `#CC7700` | Warning icons |

---

## 13. Typography

| Dùng cho | Font | Size | Weight | Color |
|---|---|---|---|---|
| Tất cả UI text | Arial, Helvetica Neue, sans-serif | — | — | — |
| Header product name | Arial | 14px | Bold | `#FFFFFF` |
| Tab labels | Arial | 12px | Normal | `#9ABBE0` / white |
| Panel titles | Arial | 12px | Bold | `#003366` |
| Body text | Arial | 12px | Normal | `#333333` |
| Condition text | Arial | 12px | Normal | `#333333` |
| Hyperlinks trong condition | Arial | 12px | Normal | `#0066CC`, underline |
| Labels | Arial | 11–12px | Normal | `#333333` |
| Buttons | Arial | 12px | Normal / Bold | varies |
| Empty state text | Arial | 12px | Italic | `#666666` |
| Error messages | Arial | 12px | Normal | `#CC0000` |

---

## 14. Icons và Visual Elements

| Element | Kiểu | Màu |
|---|---|---|
| [x] Delete icon | Chữ "x" hoặc ✕ nhỏ | `#CC0000` |
| ▾ Dropdown arrow | HTML entity ▾ | `#333333` |
| > (breadcrumb separator) | HTML text | `#999999` |
| ▶ (list arrow) | Optional bullet/arrow | `#0066CC` |
| [?] Help | Chữ "?" trong circle | `#FFFFFF` trên navy |
| Checkbox | Native HTML checkbox | Default browser |
| Radio | Native HTML radio | Default browser |

---

## 15. Scrolling và Overflow

| Panel | Overflow |
|---|---|
| Test Browser list (Panel A) | `overflow-y: auto`, native scrollbar |
| Test Stack (Panel B) | `overflow-y: auto`, native scrollbar |
| Config dialogs list panels | `overflow-y: scroll` |
| Main page | `overflow-y: auto` nếu wizard content dài |

---

## 16. Interactions và Behaviors

### 16.1 Filter tests
- Khi user gõ vào ô "Filter", danh sách test trong Panel A **ngay lập tức lọc** (trước jQuery/AJAX era: submit form, sau: client-side filtering)
- Thay đổi dropdown "Test Group" cũng lọc danh sách
- Kết hợp cả 2: AND logic (text filter AND group filter)

### 16.2 Thêm test vào stack
- **Click 1 lần** vào test item trong Panel A → highlight (select)
- **Click đôi** hoặc **click nút [Add >>]** → test được thêm vào cuối danh sách trong Panel B
- Test xuất hiện ngay lập tức trong Panel B với text dạng "and when [hyperlink-placeholder]"

### 16.3 Cấu hình giá trị
- **Click vào hyperlink** trong condition text của Panel B → popup dialog mở
- User nhập/chọn giá trị → click [Submit] → dialog đóng, hyperlink text cập nhật thành giá trị đã chọn
- Click [Cancel] → không thay đổi

### 16.4 Xóa condition
- Click **[x]** ở đầu dòng condition trong Panel B → condition bị xóa khỏi stack ngay lập tức (có thể có confirm dialog tùy phiên bản)

### 16.5 Sắp xếp lại conditions (Drag & Drop — optional)
- Một số phiên bản QRadar hỗ trợ kéo thả để sắp xếp lại thứ tự conditions
- Visual indicator: grab cursor, dashed border khi đang kéo

### 16.6 AND/ANY toggle
- Dropdown trong header Panel B cho phép chọn `ALL` (AND logic) hoặc `ANY` (OR logic)
- Thay đổi này ảnh hưởng đến tất cả conditions trong stack (global logic connector)

### 16.7 Next button validation
- Nếu click [Next >] khi stack rỗng → hiển thị error message: "You must add at least one test."
- Error message xuất hiện **trên đầu Panel B**, màu đỏ `#CC0000`, bordered với `#FFCCCC` background

---

## 17. Kích thước tổng thể (Dimensions)

| Element | Kích thước |
|---|---|
| Total page width | 1280px (min), không responsive |
| Header height | 40px |
| Tab bar height | 32px |
| Breadcrumb/step bar height | 30px |
| Rule Name bar height | ~50px |
| Main content area height | Còn lại sau header/footer (~600–700px) |
| Panel A width | ~35–40% of content width (~420–480px) |
| Panel B width | ~60–65% of content width (~760–800px) |
| Panel divider | `2px solid #CCCCCC` hoặc `1px solid #AAAAAA` |
| Footer bar height | 48px |
| Dialog width | 400–600px |
| Dialog height | 300–450px |

---

## 18. Sample HTML Structure (Skeleton)

```html
<div class="qradar-app">
  <!-- Header -->
  <header class="qr-header">
    <img class="qr-logo" src="ibm-logo.svg" alt="IBM" />
    <span class="qr-product-name">IBM Security QRadar SIEM</span>
    <div class="qr-user-menu">admin ▾</div>
    <div class="qr-help">?</div>
  </header>

  <!-- Main Tab Nav -->
  <nav class="qr-tabs">
    <a class="tab">Dashboard</a>
    <a class="tab active">Offenses</a>
    <a class="tab">Log Activity</a>
    <!-- ... -->
  </nav>

  <!-- Wizard Step Indicator -->
  <div class="qr-wizard-steps">
    <a class="step done">1. Introduction</a>
    <span class="sep">›</span>
    <a class="step done">2. Type of Rule</a>
    <span class="sep">›</span>
    <span class="step current">3. Rule Test Stack Editor</span>
    <span class="sep">›</span>
    <span class="step future">4. Rule Response</span>
    <span class="sep">›</span>
    <span class="step future">5. Summary</span>
  </div>

  <!-- Main Wizard Content -->
  <main class="qr-wizard-content">

    <!-- Rule Name Bar -->
    <div class="qr-rule-name-bar">
      <label>Rule Name: <input type="text" class="qr-rule-name-input" /></label>
      <label>Notes: <input type="text" class="qr-notes-input" /></label>
    </div>

    <!-- Two-panel layout -->
    <div class="qr-test-editor">

      <!-- Panel A: Test Browser -->
      <div class="qr-test-browser">
        <div class="panel-header">Rule Tests</div>
        <div class="filter-area">
          <label>Filter: <input type="text" class="test-filter" /></label>
          <label>Test Group:
            <select class="test-group-select">
              <option>All Tests</option>
              <option>Event Property Tests</option>
              <option>IP / Port Tests</option>
              <!-- ... -->
            </select>
          </label>
        </div>
        <ul class="test-list">
          <li class="test-item" data-test-id="event-search-filter">
            when the event matches this search filter
          </li>
          <li class="test-item selected" data-test-id="payload-contains">
            when the payload contains this string
          </li>
          <!-- ... -->
        </ul>
        <div class="add-btn-area">
          <button class="btn-add-test">Add »</button>
        </div>
      </div>

      <!-- Panel B: Test Stack -->
      <div class="qr-test-stack">
        <div class="panel-header">Tests</div>
        <div class="logic-connector">
          Apply this rule when
          <select class="logic-select">
            <option>ALL</option>
            <option>ANY</option>
          </select>
          of the following conditions match:
        </div>
        <ul class="condition-stack">
          <li class="condition-row">
            <button class="delete-btn">x</button>
            <span class="condition-text">
              and when the event(s) were detected by one or more of
              <a href="#" class="config-link">these log source types</a>
            </span>
          </li>
          <li class="condition-row">
            <button class="delete-btn">x</button>
            <span class="condition-text">
              and when the payload contains this string
              <a href="#" class="config-link configured">SPEEDING</a>
            </span>
          </li>
        </ul>
      </div>

    </div>
  </main>

  <!-- Wizard Footer Navigation -->
  <footer class="qr-wizard-footer">
    <button class="btn-back">&#8249; Back</button>
    <button class="btn-next btn-primary">Next &#8250;</button>
    <button class="btn-cancel">Cancel</button>
  </footer>
</div>
```

---

## 19. CSS Variables (Design Tokens)

```css
:root {
  /* Colors */
  --qr-header-bg: #003366;
  --qr-tab-bg: #2B4F7A;
  --qr-tab-active-bg: #3A6EA5;
  --qr-tab-inactive-text: #9ABBE0;
  --qr-panel-header-bg: #C4D8EB;
  --qr-panel-header-text: #003366;
  --qr-primary: #0066CC;
  --qr-primary-hover: #004999;
  --qr-primary-text: #FFFFFF;
  --qr-highlight-bg: #D9EAF7;
  --qr-content-bg: #F0F4F8;
  --qr-white: #FFFFFF;
  --qr-gray-light: #F5F5F5;
  --qr-border: #CCCCCC;
  --qr-border-dark: #999999;
  --qr-text-primary: #333333;
  --qr-text-secondary: #666666;
  --qr-link: #0066CC;
  --qr-danger: #CC0000;
  --qr-footer-bg: #D5DEE8;

  /* Typography */
  --qr-font: Arial, 'Helvetica Neue', Helvetica, sans-serif;
  --qr-font-size-sm: 11px;
  --qr-font-size-base: 12px;
  --qr-font-size-lg: 14px;

  /* Spacing */
  --qr-padding-sm: 4px;
  --qr-padding-md: 8px;
  --qr-padding-lg: 12px;
}
```

---

## 20. Lưu ý quan trọng khi tái tạo

1. **Đây là giao diện cổ điển** (circa 2010–2020). Không nên modernize với các component hiện đại như card shadows, rounded corners lớn, hoặc gradients đẹp.

2. **Fonts phải là Arial** — không dùng Inter, Roboto hay bất kỳ modern font nào.

3. **Không có animation hay transition** (hoặc rất ít, chỉ instant) — enterprise software thời đó không có animation.

4. **Buttons trông "flat but not modern"** — có border và background nhẹ, không phải Material Design flat.

5. **Links trong conditions phải underline** và màu `#0066CC` — đây là UI pattern đặc trưng của QRadar.

6. **Mọi element đều có border rõ ràng** — không có design "borderless" hay neumorphism.

7. **Layout không responsive** — fixed width, designed for 1280px+ monitors.

8. **Select/dropdown dùng native HTML `<select>`** — không custom styled dropdown.

9. **Text rất nhỏ (12px)** để nhét được nhiều thông tin trong không gian nhỏ — đây là đặc trưng enterprise UI.

10. **Rule condition text phải chính xác ngữ nghĩa** — các cụm như "and when", "is one of", "contains" là vocabulary cố định của QRadar.

---

*Tài liệu này được tổng hợp từ documentation chính thức của IBM QRadar, IBM Developer guides, SOC Prime blog, và CyberBigLeague research. Phiên bản tham chiếu: QRadar SIEM 7.3.x – 7.4.x.*
