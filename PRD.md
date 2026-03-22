# Last Human Skill — Content Workflow App

## PRD v1.0

---

## Overview

A personal web app to manage the complete Dan Koe content workflow — from inspiration capture to newsletter publication to content repurposing.

**For:** David Despain (personal use)
**Purpose:** Systematize weekly newsletter creation and content generation

---

## Core Philosophy

> 30-60 min/day writing + 1 recording day/week = content for all platforms

The newsletter is the SINGLE TASK. Everything else flows from it.

---

## The Workflow (Built Into App)

### Weekly Rhythm

| Day | Activity | App Support |
|-----|----------|-------------|
| Daily | 30-60 min writing | Writing interface with timer |
| Mon | Pick topic, start outline | Topic selector from swipe file |
| Tue-Thu | Build sections | Section-by-section editor |
| Fri | Edit, finalize, schedule | Preview + schedule |
| Sat | Recording day | Script view for recording |
| Sun | Newsletter drops | Auto-publish integration |

### Content Flow

```
SWIPE FILE (Inspiration)
    ↓
NEWSLETTER (Weekly cornerstone)
    ↓
CONTENT BANK (Archive of all newsletters)
    ↓
REPURPOSE (Pull from any newsletter, anytime)
    → Social posts
    → YouTube scripts
    → Carousels
    → Short-form videos
```

---

## Core Features

### 1. SWIPE FILE (Inspiration Portfolio)

**Purpose:** Capture and organize inspiration from anywhere

**Capture Types:**
- YouTube videos (URL + notes)
- Social posts (screenshot or link)
- Articles (URL + highlights)
- Quotes (text + source)
- Images/thumbnails
- Voice memos / ideas

**Organization:**
- Tags (theme, format, emotion, tactic)
- Folders/Collections
- Search
- "Random inspiration" shuffle

**For each item, capture:**
- Source URL
- Screenshot/thumbnail
- Why it's good (notes)
- What to emulate
- Tags
- Content Breakdown (AI-generated analysis)

---

### 2. CONTENT BREAKDOWN (Hugh-Powered Analysis)

**Purpose:** Reverse-engineer what makes great content work

**Workflow:**
1. Paste content (or URL) into the breakdown tool
2. Hugh analyzes using structured prompt + David's context
3. Breakdown saved alongside swipe file item
4. Use insights to inform your own content

**Why Hugh, not generic AI:**
- Hugh knows the "Last Human Skill" brand and audience
- Hugh can connect tactics to David's past successful content
- Hugh suggests how David specifically could apply the tactic
- Hugh remembers what's already in the swipe file (no duplicates)

**The Breakdown Prompt:**

```
Analyze this piece of content from macro to micro like a strategist 
reverse-engineering what makes it work.

MACRO ANALYSIS:
- Identify and name the content "type" or format 
  (e.g., "contrarian hot take," "story-to-lesson," "curiosity loop thread")
- Break down the overall structure—what sections exist, how they're 
  sequenced, and why that sequence is effective
- Explain why this structure works for the audience and goal

MICRO ANALYSIS:
- Examine the structure within sections—key moments, transitions, 
  and turning points
- Highlight specific lines or phrases that do heavy lifting and explain why

PSYCHOLOGICAL TACTICS:
- Identify both named frameworks (e.g., curiosity gap, pattern interrupt, 
  social proof) and intuitive explanations for why readers engage, 
  keep reading, and take action
- Explain what emotional or cognitive triggers are being pulled and when

REPLICATION GUIDE:
- Provide principles I can apply to my own ideas (not rigid steps)
- Frame each principle around *why* it works, so I can adapt it to 
  different topics
- Include quick bullet points with examples pulled from the content

Be thorough and detailed. Prioritize insight over brevity. 
Organize flexibly based on what's most interesting or instructive 
about this specific piece.
```

**Output Structure:**

| Section | What It Captures |
|---------|------------------|
| Content Type | Format name + why it fits |
| Macro Structure | Sections, sequence, effectiveness |
| Micro Moments | Key lines, transitions, turning points |
| Psychological Tactics | Frameworks used, triggers pulled |
| Replication Principles | Adaptable principles with examples |

**Features:**
- One-click breakdown from any swipe file item
- Edit/annotate the AI output
- Tag breakdowns by tactic (curiosity gap, story arc, etc.)
- Search breakdowns for specific tactics
- "Show me all content using [tactic]" filter

---

### 3. NEWSLETTER BUILDER

**Purpose:** Build one newsletter per week using the Dan Koe framework

**Newsletter Outline Framework (Built-in Structure):**

```
1. AUDIENCE
   - Who am I writing to?
   - What's their situation?
   
2. HYPERBOLIC TRUTH
   - What extreme-but-true statement can I make?
   - The hook
   
3. PAIN POINT (Section 1 — 400-800 words)
   - Personal experience or observed struggle
   - The intro that hooks
   
4. NOVEL PERSPECTIVE (Section 2 — 400-800 words)
   - The unique frame or insight
   - What most people miss
   
5. UNIQUE MECHANISM (Section 3 — 400-800 words)
   - Actionable steps
   - What should they DO?
   
6. CORE TAKEAWAY
   - One thing to remember
   - The CTA
```

**Features:**
- Section-by-section editor
- Word count per section (target: 400-800)
- Total word count
- Writing timer (30-60 min sessions)
- Save drafts automatically
- Link to inspiration from swipe file
- Preview as email
- Export to Beehiiv

**Statuses:**
- Idea
- Outlining
- Drafting
- Editing
- Scheduled
- Published

**Hugh's Writing Support (Assist, Not Replace):**
- Suggest hooks based on swipe file patterns
- "This section is weak because..." feedback
- Recommend swipe file items relevant to current topic
- Flag when word count is off target
- Suggest subject line options

**Important:** Hugh assists David's writing. Hugh does NOT write for David. The voice must be David's.

---

### 4. CONTENT BANK (Newsletter Archive)

**Purpose:** Every published newsletter becomes a content source

**For each newsletter, track:**
- Full content
- Publication date
- Beehiiv URL
- Performance (open rate, CTR)
- Repurposed content linked
- Key quotes extracted
- Social posts generated

**Views:**
- Timeline (chronological)
- By theme
- By performance
- Search

---

### 5. REPURPOSE ENGINE (Hugh-Assisted)

**Purpose:** Extract content from any newsletter, anytime

**Repurpose Types:**

| Type | Description |
|------|-------------|
| Social Post | 280 char standalone idea |
| Thread | Multi-part breakdown |
| Carousel | Visual slides |
| YouTube Script | Full video script |
| Short-form Script | 30-60 sec video |
| Podcast Notes | Talking points |

**Features:**
- Select newsletter → Hugh suggests best extraction opportunities
- Hugh rewrites sections as standalone social posts (in David's voice)
- Track what's been repurposed
- Schedule to platforms (or export)
- Link back to source newsletter

**Hugh's Repurpose Intelligence:**
- Identifies the "quotable" moments in each newsletter
- Rewrites for platform (Twitter brevity vs LinkedIn depth)
- Maintains David's voice — not generic AI tone
- Avoids suggesting content that's already been posted
- Flags high-potential ideas: "This could be a thread"

---

### 6. IDEA CAPTURE (Inbox)

**Purpose:** Quick capture of fleeting ideas

**Capture methods:**
- Quick text input
- Voice memo (transcribed)
- Photo/screenshot

**Workflow:**
- Ideas land in inbox
- Weekly review: promote to swipe file or newsletter outline
- Or discard

---

### 7. DAILY DASHBOARD

**Purpose:** Show what to focus on today

**Shows:**
- Current newsletter status + progress
- Today's writing goal (30-60 min)
- Writing streak
- Quick capture button
- Recent swipe file additions
- Upcoming deadlines

---

## Data Models

### SwipeItem (Inspiration)
```
- id
- type: youtube | post | article | quote | image | idea
- url
- title
- thumbnail
- content (full text if available)
- notes (why it's good)
- whatToEmulate
- tags[]
- createdAt

# Content Breakdown (AI-generated)
- breakdown: {
    contentType: string
    macroAnalysis: string
    microAnalysis: string  
    psychologicalTactics: string
    replicationGuide: string
    tacticsUsed: string[] (e.g., ["curiosity gap", "pattern interrupt"])
  }
- breakdownGeneratedAt
```

### Newsletter
```
- id
- title
- slug
- weekOf (Sunday date)
- status: idea | outlining | drafting | editing | scheduled | published

- audience
- hyperbolicTruth
- painPoint (section 1)
- novelPerspective (section 2)  
- uniqueMechanism (section 3)
- coreTakeaway

- subjectLine
- previewText
- bodyContent (full compiled)

- publishDate
- publishedAt
- beehiivUrl
- openRate
- clickRate

- swipeItemIds[] (inspiration used)
- createdAt
- updatedAt
```

### RepurposedContent
```
- id
- newsletterId
- type: post | thread | carousel | youtube | short | podcast
- platform: twitter | linkedin | threads | instagram | tiktok | youtube
- content
- status: draft | scheduled | published
- publishedUrl
- publishedAt
- performance
- createdAt
```

### Idea (Inbox)
```
- id
- content
- type: text | voice | image
- processed: boolean
- promotedTo: swipe | newsletter | discarded
- createdAt
```

### WritingSession
```
- id
- newsletterId
- date
- durationMinutes
- wordCountStart
- wordCountEnd
- notes
```

---

## UI/UX

### Navigation
- Dashboard (home)
- Swipe File
- Newsletters
- Content Bank
- Repurpose
- Inbox

### Design Principles
- Dark mode (matches David's aesthetic)
- Minimal, focused
- Fast capture
- Clear status at all times
- Mobile-friendly for capture

---

## Integrations

### Beehiiv
- Export newsletter to Beehiiv
- Pull back performance metrics
- Or: API integration for direct publish

### YouTube (optional)
- Paste URL → auto-extract title, thumbnail
- Save to swipe file

### Social (optional)
- Cross-post to platforms
- Or: export for manual posting

---

## MVP Scope

**Phase 1 — Core Loop:**
1. ✅ Swipe File (capture + organize inspiration)
2. ✅ Content Breakdown (AI analysis of saved content)
3. ✅ Newsletter Builder (outline framework + editor)
4. ✅ Content Bank (archive)
5. ✅ Dashboard

**Phase 2 — Repurpose:**
6. Repurpose Engine
7. Social post extraction
8. Platform scheduling

**Phase 3 — Polish:**
9. Performance tracking
10. Mobile optimization

---

## Tech Stack

**Recommended:**
- Frontend: Next.js (React)
- Backend: Convex (already set up for Mission Control)
- Auth: Clerk or none (personal use)
- Hosting: Vercel
- Styling: Tailwind CSS
- **AI Engine: Hugh (via Clawdbot API)**

---

## AI Integration: Hugh as the Engine

**Hugh is the AI behind all intelligent features.**

Unlike generic AI, Hugh:
- Knows David's voice, brand, and thesis
- Understands "Last Human Skill" positioning
- Has context on the Dan Koe workflow
- Can reference past newsletters and swipe file
- Learns David's preferences over time

### Hugh-Powered Features

| Feature | How Hugh Helps |
|---------|----------------|
| **Content Breakdown** | Hugh analyzes content using the breakdown prompt, but with context on what David cares about |
| **Writing Suggestions** | Hugh can suggest hooks, reframes, or angles based on David's voice |
| **Social Post Extraction** | Hugh pulls the best standalone ideas from newsletters |
| **Topic Ideation** | Hugh suggests newsletter topics based on swipe file patterns |
| **Replication Guidance** | Hugh explains tactics in ways David can apply to his own content |

### Integration Method

**Option A: Direct API (Recommended)**
- App calls Clawdbot Gateway API
- Hugh responds with context-aware suggestions
- Conversation history maintained for continuity

**Option B: Webhook Trigger**
- App sends content to Hugh via webhook
- Hugh processes and stores result in Convex
- App polls for completion

### Hugh's Context Access

Hugh can see:
- All swipe file items
- All past newsletters
- Content breakdowns generated
- David's writing patterns
- Performance data (what worked)

This makes Hugh's suggestions genuinely personalized — not generic AI slop.

---

## Success Metrics

- 1 newsletter published every week
- Writing streak maintained
- Swipe file growing with quality inspiration
- Content bank growing
- Repurpose rate increasing

---

## Open Questions

1. Beehiiv integration: API or manual export?
2. Mobile app needed, or responsive web enough?
3. AI assistance level: suggestions only, or drafting help?
4. Social scheduling: built-in or use Buffer/etc?

---

*This is David's personal content operating system for the Last Human Skill newsletter.*
