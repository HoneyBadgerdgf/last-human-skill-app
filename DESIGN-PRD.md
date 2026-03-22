# Last Human Skill App — Design PRD

## Design System v1.0

---

## Design Philosophy

**Core Principle:** Calm Design — Less on screen. More in focus.

> "The best SaaS products are hiding everything non-essential by default."
> — 2026 SaaS UI Design Trends

This app should feel like **Linear meets Notion** — fast, minimal, keyboard-first, with personality in the right moments.

---

## 2026 Design Trends Applied

### 1. CALM DESIGN
**Inspired by:** Linear, Notion, Craft

- Default views show only what's needed for the current task
- Advanced settings hidden behind progressive disclosure
- Generous whitespace as a functional tool
- Typography does the heavy lifting — minimal icon clutter
- No visual noise competing for attention

**Application:**
- Dashboard shows current newsletter + one CTA
- Swipe file defaults to clean grid, filters hidden until needed
- Newsletter editor is distraction-free (like iA Writer)

---

### 2. COMMAND PALETTE (Cmd+K)
**Inspired by:** Linear, Raycast, Arc Browser

Every action accessible via Cmd+K:
- Create new newsletter
- Add to swipe file
- Run content breakdown
- Search everything
- Navigate anywhere
- Quick capture idea

**Features:**
- Global keyboard shortcut (Cmd+K / Ctrl+K)
- Fuzzy search that forgives typos
- Recent items surfaced by default
- Actions AND navigation in one
- Keyboard-navigable results

---

### 3. AI AS INFRASTRUCTURE, NOT FEATURE
**Inspired by:** Notion AI, Superhuman

AI is invisible — no "✨ AI" badges everywhere.

- Content Breakdown just works (no "Ask AI" button)
- Writing suggestions appear inline, not in a sidebar
- Social post extraction happens automatically
- The intelligence is felt, not seen

---

### 4. PROGRESSIVE DISCLOSURE
**Inspired by:** Figma, Linear

Show complexity only when ready:

| User State | What They See |
|------------|---------------|
| First week | Dashboard + Swipe File + Simple editor |
| Month 2 | Content Breakdown + Repurpose tools |
| Power user | Keyboard shortcuts, automations, analytics |

**Empty states teach one action, not ten.**

---

### 5. EMOTIONAL DESIGN (Subtle)
**Inspired by:** Notion, Slack, Asana

B2B can have personality:

- Celebration micro-animation when newsletter published
- Human-voiced empty states ("Nothing here yet. Your first newsletter starts with one idea.")
- Writing streak celebrations
- Contextual loading messages, not spinners

---

## Visual Design System

### Color Palette

**Dark Mode Primary (Default)**
```css
--bg-primary: #0a0a0b        /* Deep black */
--bg-secondary: #141416      /* Card backgrounds */
--bg-tertiary: #1c1c1f       /* Hover states */

--text-primary: #fafafa      /* Main text */
--text-secondary: #a1a1aa    /* Muted text */
--text-tertiary: #52525b     /* Disabled/hint */

--accent: #10b981            /* Emerald green - action, success */
--accent-hover: #059669      /* Darker emerald */

--border: #27272a            /* Subtle borders */
--border-focus: #3f3f46      /* Focus states */
```

**Light Mode (Optional)**
```css
--bg-primary: #ffffff
--bg-secondary: #fafafa
--text-primary: #18181b
--accent: #059669
```

---

### Typography

**Font Stack:**
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Scale:**
```css
--text-xs: 0.75rem     /* 12px - labels */
--text-sm: 0.875rem    /* 14px - body small */
--text-base: 1rem      /* 16px - body */
--text-lg: 1.125rem    /* 18px - lead */
--text-xl: 1.25rem     /* 20px - h4 */
--text-2xl: 1.5rem     /* 24px - h3 */
--text-3xl: 1.875rem   /* 30px - h2 */
--text-4xl: 2.25rem    /* 36px - h1 */
```

**Weights:**
- Regular (400) — Body text
- Medium (500) — Labels, buttons
- Semibold (600) — Headings
- Bold (700) — Page titles only

---

### Spacing System

```css
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
```

---

### Border Radius

```css
--radius-sm: 0.375rem   /* 6px - buttons, inputs */
--radius-md: 0.5rem     /* 8px - cards */
--radius-lg: 0.75rem    /* 12px - modals */
--radius-xl: 1rem       /* 16px - large containers */
--radius-full: 9999px   /* Pills, avatars */
```

---

## Component Library

### Buttons

**Primary (Accent)**
```
Background: var(--accent)
Text: white
Hover: var(--accent-hover)
Border-radius: var(--radius-sm)
Padding: 8px 16px
```

**Secondary (Ghost)**
```
Background: transparent
Text: var(--text-primary)
Border: 1px solid var(--border)
Hover: var(--bg-tertiary)
```

**Sizes:**
- sm: 28px height
- md: 36px height (default)
- lg: 44px height

---

### Cards

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.card:hover {
  border-color: var(--border-focus);
}
```

---

### Inputs

```css
.input {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  color: var(--text-primary);
}

.input:focus {
  border-color: var(--accent);
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
```

---

### Command Palette

```css
.command-palette {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 560px;
  max-height: 400px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
```

---

## Page Layouts

### 1. Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]                                    [Cmd+K] [👤] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Good morning, David.                                  │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │  CURRENT NEWSLETTER                             │   │
│   │  "The Last Human Skill: Judgment"               │   │
│   │  ████████████░░░░░░░░ 60% complete              │   │
│   │                                                 │   │
│   │  [Continue Writing →]                           │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │ 🔥 12-day    │  │ 📚 47        │  │ 📰 8         │  │
│   │ streak       │  │ swipe items  │  │ newsletters  │  │
│   └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│   RECENT IDEAS                                          │
│   • "AI replacing taste is impossible"                  │
│   • Thread on why Linear's UX matters                   │
│   • [+ Quick capture]                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 2. Swipe File

```
┌─────────────────────────────────────────────────────────┐
│  ← Back    Swipe File                      [+ Add] [⌘K] │
├─────────────────────────────────────────────────────────┤
│  [Search...]                    [Filters ▼] [View ▼]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ 🎬      │ │ 🐦      │ │ 📄      │ │ 💡      │       │
│  │ YouTube │ │ Thread  │ │ Article │ │ Idea    │       │
│  │ Dan Koe │ │ @naval  │ │ Paul G. │ │ AI +    │       │
│  │ video...│ │ on wea..│ │ essay...│ │ taste...│       │
│  │         │ │         │ │         │ │         │       │
│  │ [Break- │ │ [Break- │ │ [Break- │ │         │       │
│  │  down]  │ │  down]  │ │  down]  │ │         │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ ...     │ │ ...     │ │ ...     │ │ ...     │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3. Newsletter Editor

```
┌─────────────────────────────────────────────────────────┐
│  ← Newsletters    "The Last Human Skill"    [Preview]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │ OUTLINE         │  │                             │   │
│  │                 │  │  # The Last Human Skill     │   │
│  │ ☑ Audience      │  │                             │   │
│  │ ☑ Hook          │  │  [Write your content here.  │   │
│  │ ◻ Pain Point    │  │   The editor is minimal,    │   │
│  │ ◻ Perspective   │  │   distraction-free, focused │   │
│  │ ◻ Mechanism     │  │   on your words.]           │   │
│  │ ◻ Takeaway      │  │                             │   │
│  │                 │  │                             │   │
│  │ ─────────────── │  │                             │   │
│  │ Word count: 847 │  │                             │   │
│  │ Target: 2000    │  │                             │   │
│  │                 │  │                             │   │
│  │ [Link Swipe →]  │  │                             │   │
│  └─────────────────┘  └─────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ ⏱ Writing session: 32:14    [Start Timer] [Finish] ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

### 4. Content Breakdown View

```
┌─────────────────────────────────────────────────────────┐
│  ← Swipe File    Content Breakdown                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ 🎬 "How I Write 1 Week of Content in 2 Hours"      ││
│  │ Dan Koe • YouTube • Saved Mar 15                   ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  CONTENT TYPE                                           │
│  ┌─────────────────────────────────────────────────────┐│
│  │ "Process Reveal" — Step-by-step behind-the-scenes  ││
│  │ showing a desirable outcome and the path to it.    ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  MACRO ANALYSIS                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Structure: Hook → Problem → Process → Payoff       ││
│  │ • Opens with result (social proof)                 ││
│  │ • Establishes pain point most creators face        ││
│  │ • Reveals system step-by-step                      ││
│  │ • Closes with invitation to deeper content         ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  PSYCHOLOGICAL TACTICS                                  │
│  ┌─────────────────────────────────────────────────────┐│
│  │ 🏷 Curiosity Gap  🏷 Social Proof  🏷 Pattern Int. ││
│  │                                                     ││
│  │ • Title creates curiosity gap (1 week in 2 hours?) ││
│  │ • Opens with results = instant credibility         ││
│  │ • "Most people do X, I do Y" = pattern interrupt   ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  REPLICATION GUIDE                                      │
│  ┌─────────────────────────────────────────────────────┐│
│  │ 1. Lead with the desirable outcome                 ││
│  │ 2. Name the common approach (then contrast it)     ││
│  │ 3. Reveal your process in concrete steps           ││
│  │ 4. End with one clear next action                  ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  [Use for Newsletter] [Save Tactics] [Edit Breakdown]   │
└─────────────────────────────────────────────────────────┘
```

---

## Interaction Patterns

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open command palette |
| `Cmd+N` | New newsletter |
| `Cmd+S` | Save |
| `Cmd+Enter` | Publish / Submit |
| `Cmd+/` | Show all shortcuts |
| `Esc` | Close modal / Go back |
| `Cmd+I` | Quick capture idea |
| `Cmd+B` | Run content breakdown |

---

### Animations

**Principles:**
- Fast (150-200ms max)
- Purposeful (guides attention)
- Subtle (no bounce, no overshoot)

**Transitions:**
```css
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-out;
--transition-slow: 300ms ease-out;
```

**Micro-interactions:**
- Button press: subtle scale (0.98)
- Card hover: border color shift
- Success: green pulse + checkmark
- Publishing: confetti burst (once)

---

## Mobile Considerations

**Primary use case:** Desktop (writing happens on laptop)

**Mobile optimized for:**
- Quick idea capture
- Swipe file browsing
- Reading breakdowns
- Checking dashboard

**Not optimized for mobile:**
- Newsletter writing
- Complex editing

---

## Design References

### Primary Inspiration
1. **Linear** — Calm design, command palette, keyboard-first
2. **Notion** — Progressive disclosure, AI integration
3. **Craft** — Beautiful writing experience, card-based
4. **iA Writer** — Distraction-free editor

### Secondary Inspiration
5. **Superhuman** — Speed, keyboard shortcuts
6. **Arc Browser** — Command bar, spaces
7. **Raycast** — Command palette UX
8. **Figma** — Progressive feature reveal

---

## Implementation Notes

**Tech recommendations:**
- **shadcn/ui** — Pre-built accessible components
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Subtle animations
- **cmdk** — Command palette library
- **Tiptap** — Rich text editor

---

*This design system ensures the Last Human Skill app feels fast, focused, and distinctly modern — a tool David actually wants to use every day.*
