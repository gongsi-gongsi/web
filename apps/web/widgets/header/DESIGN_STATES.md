# Header Design States & Interactions

This document illustrates the various states and interactions of the GongsiGongsi header.

## 🎭 Visual States

### 1. Default State (Rest)

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──┐                                                            │
│  │░░│ 공시공시          홈  기업정보  통계          [☾] [Login] │
│  └──┘ AI ANALYSIS                                                │
└─────────────────────────────────────────────────────────────────┘
  ↑                       ↑                             ↑
  Logo                    Navigation                    Actions
  (geometric icon         (subtle gray text)            (theme + auth)
   + brand text)
```

**Characteristics:**

- Logo: Static geometric square with outer ring
- Navigation: Gray text (60% opacity)
- Active nav item: Full opacity + gradient underline
- Background: Semi-transparent with blur
- Bottom border: Subtle gradient line

### 2. Logo Hover State

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──┐                                                            │
│  │◆◆│ 공시공시          홈  기업정보  통계          [☾] [Login] │
│  └──┘ AI ANALYSIS                                                │
└─────────────────────────────────────────────────────────────────┘
  ↑
  Animations:
  - Outer ring: rotates 90°
  - Inner square: rotates 45° + shifts gradient
  - Center dot: scales up + glows purple
  - Brand text: shifts to blue-purple gradient
  - Entire logo: scales to 102%
```

**Visual Changes:**

- Outer ring rotates and changes to blue tint
- Inner square becomes diamond (45° rotation)
- Gradient flows from blue→purple to purple→blue
- Center dot enlarges and pulses
- Brand text becomes gradient colored
- Smooth 300-500ms transitions

### 3. Navigation Hover State

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──┐                                                            │
│  │░░│ 공시공시         ┌──────┐                    [☾] [Login]  │
│  └──┘ AI ANALYSIS      │기업정보│  통계                          │
│                        └──────┘                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↑
                        Hover effects:
                        - Background: light glow (5% opacity)
                        - Text: increases to 90% opacity
                        - Smooth background fade-in
```

### 4. Active Navigation Item

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──┐                                                            │
│  │░░│ 공시공시          홈  기업정보  통계          [☾] [Login] │
│  └──┘ AI ANALYSIS          ━━━                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                          Active indicator:
                          - 2px gradient line (blue→purple)
                          - Full opacity text
                          - Subtle shadow beneath line
                          - Animates in with width transition
```

### 5. Header Hover State (Entire Header)

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──┐                                                            │
│  │░░│ 공시공시          홈  기업정보  통계          [☾] [Login] │
│  └──┘ AI ANALYSIS                                                │
└══ Gradient Glow ══════════════════════════════════════════════╛
  ↑
  Bottom gradient line appears:
  - Flowing animation (blue→purple)
  - 2px height
  - Smooth opacity fade-in
  - Background animation 3s infinite
```

### 6. Theme Toggle Hover

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──┐                                                    ┌───┐   │
│  │░░│ 공시공시          홈  기업정보  통계              │[☾]│ [Login]│
│  └──┘ AI ANALYSIS                                       └───┘   │
└─────────────────────────────────────────────────────────────────┘
                                                            ↑
                                                        Bordered container:
                                                        - Border brightens
                                                        - Background opacity increases
                                                        - Smooth transitions
```

## 📱 Responsive Behavior

### Desktop (≥ lg breakpoint, e.g., 1024px+)

```
├─ 32px ─┤ Content ├─ 32px ─┤
┌─────────────────────────────┐
│  Logo  Nav  Actions         │
└─────────────────────────────┘
```

### Small Desktop (md to lg, e.g., 768px - 1023px)

```
├─ 16px ─┤ Content ├─ 16px ─┤
┌─────────────────────────────┐
│  Logo  Nav  Actions         │
└─────────────────────────────┘
```

### Mobile (< md, e.g., < 768px)

```
Header is hidden
Uses MobileHeader component instead
```

## 🎬 Animation Timings

| Element             | Property            | Duration | Easing                        |
| ------------------- | ------------------- | -------- | ----------------------------- |
| Logo outer ring     | transform (rotate)  | 500ms    | ease                          |
| Logo inner square   | transform (rotate)  | 500ms    | ease                          |
| Logo center dot     | scale, shadow       | 500ms    | ease                          |
| Logo scale          | transform (scale)   | 300ms    | ease                          |
| Brand text gradient | background          | 300ms    | ease                          |
| Nav item hover      | background, color   | 300ms    | ease                          |
| Active indicator    | width, opacity      | 300ms    | cubic-bezier                  |
| Bottom glow         | opacity             | 500ms    | ease                          |
| Gradient flow       | background-position | 3s       | ease-in-out infinite          |
| Header fade-in      | opacity, translateY | 600ms    | cubic-bezier(0.16, 1, 0.3, 1) |

## 🎨 Color Values

### Light Mode

| Element            | Color                | Opacity |
| ------------------ | -------------------- | ------- |
| Logo inner (base)  | Blue-Purple gradient | 80%     |
| Logo inner (hover) | Purple-Blue gradient | 90%     |
| Logo center dot    | White                | 100%    |
| Active nav         | Blue-Purple gradient | 100%    |
| Nav text           | Foreground           | 60%     |
| Nav text (hover)   | Foreground           | 90%     |
| Nav text (active)  | Foreground           | 100%    |

### Dark Mode

Same gradient system, but:

- Foreground automatically adjusts to light color
- Gradients maintain blue-purple scheme
- Shadows appear more prominent
- Border glows more visible

## 💡 Design Rationale

### Why These Choices?

1. **Blue-Purple Gradient**:
   - Blue: Trust, stability, finance
   - Purple: Innovation, AI, technology
   - Combined: Modern financial tech

2. **Geometric Logo**:
   - Square/Diamond: Data blocks, structure
   - Rotating elements: Processing, analysis
   - Center dot: AI core, focus point

3. **Minimal Typography**:
   - Clean sans-serif: Professional
   - Wide tracking: Readability, sophistication
   - Subtle tagline: Context without noise

4. **Glassmorphism**:
   - Modern aesthetic
   - Depth perception
   - Content visibility
   - Premium feel

5. **Smooth Animations**:
   - Professional (not playful)
   - Informative (shows interactivity)
   - Performant (CSS-only)
   - Delightful (enhances UX)

## 🔍 Interaction Details

### Logo Click

- Navigates to home page
- Subtle scale feedback (102%)
- No page reload (Next.js Link)

### Navigation Click

- Updates active indicator
- Smooth page transition
- Maintains scroll position (configurable)

### Theme Toggle Click

- Instant theme switch
- No flash of unstyled content
- Persists preference

### Auth Button Click

- Opens authentication modal/page
- Context-aware (login vs profile)
- Smooth transition

## 🎯 Accessibility

- **Keyboard Navigation**: All interactive elements focusable
- **Focus Indicators**: Clear visual feedback
- **Semantic HTML**: Proper header, nav, button elements
- **ARIA Labels**: Where appropriate
- **Color Contrast**: Meets WCAG AA standards
- **Motion**: Respects `prefers-reduced-motion`

---

**Last Updated**: 2026-02-05
**Design System**: Financial Minimalism with Tech Sophistication
