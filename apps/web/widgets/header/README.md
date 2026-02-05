# Header Widget - Design Documentation

## 🎨 Design Philosophy

The header for **공시공시 (GongsiGongsi)** embodies **Financial Minimalism with Subtle Tech Sophistication**—a design approach that balances professionalism, trustworthiness, and modern AI-driven aesthetics suitable for a stock news analysis platform.

## ✨ Key Design Features

### 1. **Distinctive Brand Identity**

- **Geometric Logo Icon**: An animated, layered square representing data processing and AI analysis
  - Outer rotating ring (on hover)
  - Inner gradient square that rotates 45° on hover
  - Center pulsing dot symbolizing AI activity
  - Blue-to-purple gradient suggesting technology and trust

- **Brand Typography**:
  - Bold, gradient text for "공시공시"
  - Subtle "AI Analysis" tagline in small caps
  - Smooth color transitions on hover (foreground → blue/purple gradient)

### 2. **Refined Navigation**

- **Clean Menu Items**: Minimal, sophisticated navigation with:
  - 13px font size, wide tracking for readability
  - Smooth color transitions
  - Active state indicated by gradient underline (blue → purple)
  - Subtle background glow on hover

### 3. **Glassmorphism Effect**

- **Backdrop Blur**: Modern glass-like appearance with:
  - `backdrop-blur-xl` for depth
  - `backdrop-saturate-150` for enhanced vibrancy
  - Semi-transparent background allowing content visibility
  - Subtle gradient border at bottom

### 4. **Micro-interactions & Animations**

- **Logo Animations**:
  - Outer ring rotates 90° on hover
  - Inner square rotates 45° on hover
  - Center dot scales and changes shadow
  - Brand text gradient shifts

- **Navigation**:
  - Animated underline for active state
  - Hover background with opacity transition
  - Smooth text color transitions

- **Header-level**:
  - Gradient glow line appears on header hover
  - Flowing gradient animation
  - Smooth fade-in on mount

## 📐 Layout Specifications

### Responsive Padding

As per requirements:

```tsx
// Small screens (< lg): 16px padding (px-4)
// Large screens (≥ lg): 32px padding (px-8)
className = 'px-4 lg:px-8'
```

### Structure

```
Header (full width, sticky, z-50)
├── Gradient Border (bottom)
├── Hover Gradient Glow (animated)
└── Content Container (h-16, responsive padding)
    ├── Logo Section (left)
    │   ├── Geometric Icon (8x8)
    │   └── Brand Text + Tagline
    ├── Navigation (center, flex-1)
    │   └── Menu Items (홈, 기업정보, 통계)
    └── Actions (right)
        ├── Theme Toggle (in bordered container)
        └── Auth Button
```

## 🎨 Color System

### Theme Colors

All colors use the `primary` color from `@gs/tailwind-config`:

- **Logo Inner Square**: `from-primary/80 to-primary/90`
- **Logo Hover**: `from-primary/90 to-primary`
- **Brand Text**: `from-foreground to-foreground/80`
- **Brand Hover**: `from-primary to-primary`
- **Active Nav**: `bg-primary`
- **Bottom Glow**: `from-primary/0 via-primary/40 to-primary/0`

### Opacity Hierarchy

- **Primary Text**: `text-foreground` (100%)
- **Secondary Text**: `text-foreground/60` (60%)
- **Hover State**: `text-foreground/80` (80%)
- **Subtle Elements**: `text-foreground/40` (40%)

## 🔧 Technical Implementation

### File Structure

```
widgets/header/
├── index.ts                    # Public exports
└── ui/
    ├── header.tsx              # Main header component
    ├── desktop-header.tsx      # Desktop header implementation
    ├── desktop-header.css      # Header-specific animations
    └── mobile-header.tsx       # Mobile header (separate)
```

### Key Technologies

- **Next.js 15**: App Router, client component
- **Tailwind CSS v4**: Utility-first styling
- **@gs/ui**: Shared UI components (ThemeToggle)
- **@gs/tailwind-config**: Theme colors

### Custom Animations

Animation defined in `desktop-header.css`:

- `header-animate`: Smooth entrance animation (0.6s cubic-bezier)
  - Fades in from opacity 0 to 1
  - Slides down from -8px translateY

## 🎯 Design Goals Achieved

✅ **Professional & Trustworthy**: Clean, refined aesthetics suitable for financial services
✅ **Modern & Tech-Forward**: AI-inspired animations and gradients
✅ **Memorable Brand Identity**: Distinctive geometric logo with smooth animations
✅ **Excellent UX**: Clear navigation, smooth transitions, proper visual hierarchy
✅ **Performance**: CSS-only animations, no JavaScript for visuals
✅ **Responsive**: Proper padding transitions, mobile-first approach

## 🚀 Usage

```tsx
import { Header } from '@/widgets/header'

// In your layout
;<Header />
```

The header automatically:

- Sticks to the top of the viewport
- Responds to screen size changes
- Animates on mount
- Provides smooth hover interactions

## 📱 Responsive Behavior

- **Mobile** (`< md`): Hidden, uses `MobileHeader` instead
- **Tablet/Small Desktop** (`md ~ lg`): 16px horizontal padding (when visible)
- **Large screens** (`≥ lg`): 32px horizontal padding + full features

## 💡 Future Enhancements

Potential additions:

- Scroll-triggered header compression
- Search bar integration
- User profile dropdown
- Notification badge
- Dark/light theme-specific animations

---

**Design System**: Financial Minimalism with Tech Sophistication
**Target Audience**: Individual investors, stock market enthusiasts
**Brand Values**: Trust, Intelligence, Innovation, Clarity
