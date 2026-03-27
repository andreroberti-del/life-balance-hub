# Life Balance - Figma Design Guide
## Wellness Intelligence App - Comprehensive UI/UX Specification

**Version:** 1.0
**Date:** March 2026
**Purpose:** Instruct a Figma designer to create a world-class prototype for Life Balance, a wellness intelligence app focused on anti-inflammatory protocols (Omega-3).

**Target Audience:** Brazilians in Florida, Americans, Hispanics
**Competitor Gap:** No app connects food -> inflammation -> real blood data -> community

---

## Table of Contents

1. [Brand Foundation & Color System](#1-brand-foundation--color-system)
2. [Design System Specifications](#2-design-system-specifications)
3. [Onboarding Flow](#3-onboarding-flow)
4. [Core Navigation & Architecture](#4-core-navigation--architecture)
5. [Home Dashboard](#5-home-dashboard)
6. [Food Scanner](#6-food-scanner)
7. [Protocol 120 Days](#7-protocol-120-days)
8. [Data Visualization & Health Metrics](#8-data-visualization--health-metrics)
9. [AI Coach (ZENO)](#9-ai-coach-zeno)
10. [Community & Social](#10-community--social)
11. [Gamification System](#11-gamification-system)
12. [Unique Differentiators](#12-unique-differentiators)
13. [Micro-Interactions & Animations](#13-micro-interactions--animations)
14. [Screen-by-Screen Specification](#14-screen-by-screen-specification)
15. [Accessibility & Localization](#15-accessibility--localization)

---

## 1. Brand Foundation & Color System

### Primary Palette

| Token | Hex | Usage | Psychology |
|-------|-----|-------|------------|
| `brand-neon` | `#D4FF00` | Primary CTA, highlights, progress indicators, active states | Energy, vitality, optimism, motivation. Green leads health apps with 31% higher retention. |
| `brand-dark` | `#1A1A1A` | Primary background (dark mode default) | Sophistication, focus, premium feel. 70%+ of mobile users prefer dark mode. |
| `brand-light` | `#FAFAFA` | Text on dark, light mode background | Clarity, cleanliness, breathability |

### Extended Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `surface-elevated` | `#242424` | Cards, bottom sheets, modals on dark background |
| `surface-subtle` | `#2A2A2A` | Secondary cards, input fields |
| `text-primary` | `#FAFAFA` | Primary text on dark |
| `text-secondary` | `#A0A0A0` | Secondary text, labels, captions |
| `text-muted` | `#666666` | Disabled text, placeholders |
| `success` | `#4ADE80` | Positive states, good scores |
| `warning` | `#FBBF24` | Moderate states, caution |
| `danger` | `#F87171` | Bad scores, alerts, inflammation high |
| `info` | `#60A5FA` | Informational, links, neutral data |
| `neon-glow` | `#D4FF00` at 20% opacity | Glow effects behind CTAs and active elements |
| `gradient-primary` | `#D4FF00 -> #A0E000` | Progress bars, achievement rings |

### Color Usage Rules

- **Dark mode is DEFAULT.** Design every screen in dark mode first. Light mode is secondary.
- **Neon green (#D4FF00) is ACCENT ONLY.** Never use it as background for large areas. Use it for: CTAs, progress rings, active tab indicators, score highlights, streak flames.
- **Avoid pure black (#000000).** Use `#1A1A1A` for backgrounds to reduce eye strain (following WHOOP and Oura patterns).
- **Color-coded health scores:** Green (excellent, 75-100), Yellow (moderate, 50-74), Orange (needs attention, 25-49), Red (poor, 0-24). Reference Yuka's 4-tier color system.
- **Neon green on dark creates the "tech wellness" aesthetic** -- similar to WHOOP's dark theme with colored accents. This signals both data-driven precision and health vitality.

### Gradient Strategy

- Use subtle gradients sparingly for premium feel
- Primary gradient: `#D4FF00` to `#A0E000` (for progress elements)
- Background gradient: `#1A1A1A` to `#0D0D0D` (subtle depth on scroll)
- Never use gradient text -- keep text solid for readability

---

## 2. Design System Specifications

### Typography

| Level | Font | Size | Weight | Line Height | Usage |
|-------|------|------|--------|-------------|-------|
| Display | SF Pro Display / Inter | 32px | Bold (700) | 40px | Hero numbers, main scores |
| H1 | SF Pro Display / Inter | 28px | Bold (700) | 36px | Screen titles |
| H2 | SF Pro Display / Inter | 22px | Semibold (600) | 28px | Section headers |
| H3 | SF Pro Display / Inter | 18px | Semibold (600) | 24px | Card titles |
| Body | SF Pro Text / Inter | 16px | Regular (400) | 24px | Main content |
| Body Small | SF Pro Text / Inter | 14px | Regular (400) | 20px | Descriptions, secondary info |
| Caption | SF Pro Text / Inter | 12px | Medium (500) | 16px | Labels, timestamps, metadata |
| Overline | SF Pro Text / Inter | 10px | Semibold (600) | 14px | Tags, badges, category labels |

**Typography Rules:**
- Use **SF Pro** for iOS, **Inter** for Android/web
- Numbers in scores and metrics use **tabular figures** (monospaced numerals) for alignment
- Large score numbers (Display size) should use the neon green color when showing positive results
- Use variable font weights for smooth transitions in animations

### Spacing System (8px grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Tight spacing within compact elements |
| `space-sm` | 8px | Between closely related elements |
| `space-md` | 16px | Standard padding inside cards |
| `space-lg` | 24px | Between sections |
| `space-xl` | 32px | Major section separators |
| `space-2xl` | 48px | Top/bottom screen padding |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 8px | Small buttons, tags, badges |
| `radius-md` | 12px | Input fields, small cards |
| `radius-lg` | 16px | Standard cards, modals |
| `radius-xl` | 24px | Large cards, bottom sheets |
| `radius-full` | 9999px | Pills, circular avatars, score rings |

### Iconography

- **Style:** Outlined icons (2px stroke) as default state, filled icons for active/selected state
- **Size:** 24px standard, 20px in compact contexts, 28px for tab bar
- **Source:** Phosphor Icons or Lucide (consistent, modern, wellness-appropriate)
- **Custom icons needed for:** Anti-inflammatory score flame, Omega-3 fish/capsule, inflammation meter, ZENO avatar
- **Avoid sharp geometric icons.** Follow Headspace's principle: rounded, organic shapes convey wellness and calm

### Shadows & Elevation

| Level | Shadow | Usage |
|-------|--------|-------|
| Level 0 | None | Flat content on surface |
| Level 1 | `0 2px 8px rgba(0,0,0,0.3)` | Cards on dark background |
| Level 2 | `0 4px 16px rgba(0,0,0,0.4)` | Bottom sheet, floating elements |
| Level 3 | `0 8px 32px rgba(0,0,0,0.5)` | Modals, dialogs |
| Neon glow | `0 0 20px rgba(212,255,0,0.3)` | Active CTA, primary buttons |

### Component Library (build these in Figma)

1. **Button - Primary:** Dark background, neon green fill, dark text, 48px height, `radius-full`
2. **Button - Secondary:** Dark background, 1px neon green border, neon green text, 48px height
3. **Button - Ghost:** No border, neon green text, 48px height
4. **Card - Metric:** `surface-elevated` background, 16px padding, `radius-lg`, contains icon + label + value
5. **Card - Food Item:** Image left, title + score right, color-coded score indicator
6. **Score Ring:** Circular progress indicator with percentage center, color-coded (reference Apple Health rings)
7. **Score Bar:** Horizontal progress bar with gradient fill, rounded ends
8. **Input Field:** `surface-subtle` background, 48px height, `radius-md`, white text, muted placeholder
9. **Bottom Sheet:** `surface-elevated`, `radius-xl` top corners, drag indicator pill at top
10. **Badge/Tag:** Small pill shape, `radius-sm`, various colors for categories
11. **Avatar:** Circular, 40px default, 56px large, optional green ring for active protocol
12. **Toast/Notification:** Bottom-floating, `surface-elevated`, icon + message, auto-dismiss

---

## 3. Onboarding Flow

### Design Philosophy

Reference Noom's psychology-based onboarding: their 77-step quiz achieves high conversion by making users feel deeply understood before showing a paywall. Life Balance should use a similar approach but shorter (20-25 steps).

Key insight: 87% of users abandon onboarding when it is unclear. Use progressive disclosure -- reveal complexity gradually.

### Flow Structure (20-25 screens)

#### Phase 1: Welcome & Hook (3 screens)

**Screen 1 - Splash/Welcome**
- Full-screen dark background
- Life Balance logo centered with subtle neon glow animation
- Tagline: "Your body. Your data. Your transformation."
- Two buttons: "Get Started" (primary neon) and "I have an account" (ghost)
- No skip option -- this IS the funnel

**Screen 2 - The Problem**
- Bold headline: "Inflammation is the silent enemy"
- Simple animated graphic: body silhouette showing inflammation points glowing red, then calming to green
- Brief stat: "87% of chronic diseases are linked to inflammation"
- Single CTA: "Discover your path" (neon)

**Screen 3 - The Promise**
- Headline: "In 120 days, see the difference"
- Split-screen Before/After body silhouette (the Future Mirror concept, teased here)
- Three bullet points with icons: "Scan foods for inflammation", "Track your Omega-3 impact", "See your transformation"
- CTA: "Let's personalize your plan"

#### Phase 2: Personalization Quiz (12-15 screens)

Each screen = ONE question. Full screen, large text, big tap targets. Use progress bar at top (neon green, thin line).

**Screen 4 - Name**
- "What should we call you?"
- Single text input, auto-focused keyboard
- Warm tone: ZENO's first greeting appears as small text: "Nice to meet you, {name}!"

**Screen 5 - Goal Selection**
- "What brought you here?"
- Large tappable cards (not radio buttons):
  - "Reduce inflammation" (flame icon)
  - "Improve Omega-3 levels" (capsule icon)
  - "Lose weight healthily" (scale icon)
  - "Feel more energy" (lightning icon)
  - "All of the above" (star icon)
- Multi-select allowed, neon border on selected

**Screen 6 - Age Range**
- "How old are you?"
- Scroll wheel picker (iOS style) or large number input
- Note below: "This helps us calibrate your protocol"

**Screen 7 - Gender**
- "How do you identify?"
- 3-4 large cards: Male, Female, Non-binary, Prefer not to say
- Clean, non-judgmental design

**Screen 8 - Current Diet**
- "How would you describe your diet?"
- Cards with illustrations:
  - "Standard American Diet" (burger icon)
  - "Mostly healthy" (salad icon)
  - "Mediterranean" (olive icon)
  - "Plant-based" (leaf icon)
  - "Keto/Low-carb" (avocado icon)
  - "Not sure" (question mark icon)

**Screen 9 - Supplements**
- "Do you take Omega-3 supplements?"
- Cards: "Yes, daily" / "Sometimes" / "No" / "I don't know what that is"
- If "Yes": follow-up asking brand (this feeds the Omega Database)

**Screen 10 - Health Concerns**
- "Any of these concern you?" (multi-select)
- Scrollable grid of tags/pills:
  - Joint pain, Fatigue, Brain fog, Skin issues, Digestive problems, High cholesterol, Weight gain, Sleep issues, Stress/anxiety, None of these
- Tappable pills that turn neon on selection

**Screen 11 - Wearable**
- "Do you use a wearable device?"
- Cards with brand logos: Garmin, Apple Watch, Oura, WHOOP, Fitbit, None
- If Garmin selected: show subtle "Perfect -- we'll sync your data" confirmation

**Screen 12 - Blood Work**
- "Have you done blood work recently?"
- Cards: "Yes, in the last 6 months" / "Yes, but over 6 months ago" / "No" / "What should I test?"
- If "What should I test?": brief info card about Omega-3 Index test (education moment)

**Screen 13 - Activity Level**
- "How active are you?"
- Visual scale with body illustrations:
  - Sedentary (sitting figure)
  - Lightly active (walking)
  - Moderately active (jogging)
  - Very active (running)

**Screen 14 - Motivation Style**
- "What motivates you most?"
- Cards: "Seeing data & numbers" / "Community & challenges" / "Personal coaching" / "Visual transformation"
- This personalizes the dashboard layout

**Screen 15 - Commitment**
- "Can you commit 5 minutes a day?"
- (Reference Noom: setting expectations upfront increases retention)
- Simple Yes/No with the note: "That's all it takes to scan, track, and improve"

#### Phase 3: Plan Reveal (3-4 screens)

**Screen 16 - Processing**
- Animated loading screen (2-3 seconds)
- ZENO avatar assembling the plan with animated elements
- Text cycling: "Analyzing your profile...", "Building your protocol...", "Personalizing ZENO..."

**Screen 17 - Your Personal Plan**
- Headline: "{Name}, here's your 120-day protocol"
- Card showing: Start date, target date, personalized focus areas
- Three metric previews (empty rings waiting to fill):
  - Anti-Inflammatory Score
  - Omega-3 Index Estimate
  - Protocol Progress
- Subtle confetti or particle animation

**Screen 18 - Meet ZENO**
- ZENO AI coach introduction
- Friendly avatar/illustration (NOT a chatbot bubble -- a character)
- Speech card: "Hey {name}! I'm ZENO, your wellness intelligence coach. I'll help you reduce inflammation, optimize your Omega-3, and track your transformation. Let's do this."
- CTA: "Let's go!" (neon)

**Screen 19 - Permissions & Setup**
- Grouped permission requests (not one-by-one to reduce fatigue):
  - Camera (for food scanner)
  - Notifications (for daily reminders)
  - Health data (for Garmin/Apple Health sync)
- Each with a brief reason: "Camera: Scan food labels instantly"
- "Allow All" primary CTA + "Customize" secondary

**Screen 20 - First Action**
- "Start with your first scan!"
- Large camera button centered
- OR "Skip for now -- explore the app"
- This is the "time to value" moment. Get them doing something immediately.

### Onboarding Design Rules

- **Progress indicator:** Thin neon green line at top showing completion percentage
- **Back navigation:** Always available, left arrow
- **Skip:** Only available on non-critical screens (never on name, goal, age)
- **Animations:** Each screen slides in from right; selected options scale up with a bounce
- **Dark background throughout.** Consistent with the rest of the app.
- **One question per screen.** Never overwhelm. (Reference Ada Health's 91% completion rate with conversational single-question flow.)

---

## 4. Core Navigation & Architecture

### Bottom Tab Bar (5 tabs)

Research shows bottom navigation is the gold standard for mobile apps. 49% of users navigate with one thumb. The most accessible area is the bottom third of the screen.

| Tab | Icon (outline/filled) | Label | Description |
|-----|-----------------------|-------|-------------|
| 1 | Home/Dashboard | Home | Main dashboard with scores and daily summary |
| 2 | Scanner | Scan | Food scanner with camera |
| 3 | Protocol (center, prominent) | Protocol | 120-day protocol progress, the hero feature |
| 4 | Community | Community | Leaderboards, challenges, social feed |
| 5 | ZENO | ZENO | AI coach interface |

**Tab Bar Specifications:**
- Height: 83px (includes safe area on modern iPhones)
- Background: `#1A1A1A` with subtle top border `rgba(255,255,255,0.05)`
- Active state: Filled icon + neon green color + label
- Inactive state: Outlined icon + `#666666` + label
- Center tab (Protocol): Slightly elevated, neon green circular background behind icon (like a floating action indicator)
- Touch target: minimum 48x48px per tab, with 32px spacing

### Navigation Patterns

- **Primary navigation:** Bottom tabs (always visible)
- **Secondary navigation:** Top segmented controls within each tab (e.g., "Today" / "Week" / "Month" on dashboard)
- **Tertiary navigation:** Cards that push to detail screens
- **Bottom sheets:** For quick actions (scan result, quick log, ZENO tip)
- **Full-screen modals:** For focused flows (onboarding, food scanner camera, blood work entry)
- **Swipe gestures:** Left/right to switch between time periods (Today/Yesterday), swipe down to dismiss bottom sheets

---

## 5. Home Dashboard

### Design Reference
Combine the best of: WHOOP's recovery overview (clear scores at top), Oura's readiness system (color-coded states), and Apple Health's activity rings (circular progress).

### Layout (top to bottom, scrollable)

#### Section 1: Header Bar (sticky)
- Left: User avatar (32px, with green ring if active today) + "Good morning, {name}"
- Right: Notification bell (with dot indicator if unread) + Settings gear
- Height: 56px

#### Section 2: Daily Score Card (hero)
- Full-width card, `surface-elevated` background
- Center: Large circular ring (120px diameter) showing **Life Balance Score** (0-100)
  - Ring color: Green/Yellow/Orange/Red based on score
  - Center: Score number in Display typography (32px, bold)
  - Below ring: "Your Wellness Score" label + date
- Below ring: 3 mini-metric pills in a row:
  - **Inflammation:** Small ring + score + "Low/Med/High" label
  - **Omega-3:** Small ring + estimated index
  - **Protocol Day:** "Day 23/120" with linear progress bar
- Reference: Like WHOOP's three dials (Sleep/Recovery/Strain) but adapted to Life Balance's metrics

#### Section 3: ZENO Insight Card
- Compact card with ZENO avatar (24px) on left
- AI-generated daily insight: "Your inflammation markers improved 12% this week. Keep scanning your meals!"
- Tap to expand or go to ZENO chat
- Subtle neon green left border accent

#### Section 4: Today's Actions (horizontal scroll)
- Row of action cards (compact, 120px wide):
  - "Scan a meal" (camera icon)
  - "Log Omega-3" (capsule icon)
  - "Check Garmin data" (watch icon)
  - "Daily lesson" (book icon)
- Each card: icon + short label, tappable, neon accent on incomplete

#### Section 5: Weekly Trend Chart
- Line chart or area chart showing Life Balance Score over 7 days
- X-axis: Mon-Sun
- Y-axis: 0-100
- Filled area under line with gradient (neon green to transparent)
- Tap on any day to see breakdown
- Reference: WHOOP's weekly strain vs recovery trend graph

#### Section 6: Food Log Summary
- "Today's Meals" header with "See All" link
- Horizontal scroll of scanned food cards:
  - Food image (thumbnail)
  - Food name
  - Anti-inflammatory score (color-coded pill: Excellent/Good/Poor/Bad)
- If no meals scanned: empty state with camera icon and "Scan your first meal"

#### Section 7: Community Highlights
- "Your Cohort" header
- Mini leaderboard (top 3 from user's group)
- Active challenge card with progress
- "See community" link

#### Section 8: Garmin Sync Banner (conditional)
- Shows only if Garmin is connected
- Compact banner: "Last sync: 2h ago | Steps: 8,432 | HR: 68bpm | Sleep: 7.2h"
- Tap to see full Garmin data breakdown

---

## 6. Food Scanner

### Design Reference
Study Yuka's scanner: 80M+ users, chosen for speed and simplicity. Yuka scans 50M+ products with sub-second recognition. Key lesson: speed is everything when scanning in a store.

### Camera Screen

**Layout:**
- Full-screen camera viewfinder
- Top: Back arrow (left) + Flash toggle (right) + "Scan Food" title (center)
- Center: Scanning frame overlay (rounded rectangle, neon green corners, subtle pulse animation)
- Below frame: Instruction text: "Point at barcode or food label" (white, semi-transparent background pill)
- Bottom: Large circular capture button (for manual photo), with "Manual Entry" text link below
- Switch mode tabs at bottom: "Barcode" | "Label" | "Photo" (for whole foods without barcode)

**Scanning States:**
1. **Idle:** Neon green corner guides, steady
2. **Detecting:** Corner guides pulse/animate, haptic feedback
3. **Scanned:** Brief green flash overlay, success haptic, auto-transition to results

### Results Screen (Bottom Sheet rising over camera)

**Layout (scrollable bottom sheet, 85% screen height):**

**Header:**
- Product image (if available from database) or captured photo
- Product name (H2)
- Brand name (caption, muted)

**Score Section (hero):**
- Large circular score: **Anti-Inflammatory Score** (0-100)
  - Color coded: Excellent (#4ADE80, 75-100), Good (#D4FF00, 50-74), Poor (#FBBF24, 25-49), Bad (#F87171, 0-24)
  - Inside circle: Score number + verdict text (e.g., "Good")
- Below score: One-line explanation: "Moderate anti-inflammatory properties. Omega-6 to Omega-3 ratio: 3:1"

**Breakdown Cards (vertical stack):**

1. **Inflammation Impact Card**
   - Bar visualization: Anti-inflammatory <---> Pro-inflammatory
   - Marker showing where this food falls
   - Key factors listed: "Contains Omega-3 (good), High sugar (bad), Turmeric extract (excellent)"

2. **Omega-3 Content Card**
   - If relevant: EPA/DHA content in mg
   - Comparison: "This has 2x more Omega-3 than {alternative product}"
   - Omega-6:Omega-3 ratio visualization (horizontal bar, green zone marked)

3. **Ingredients Analysis Card**
   - Expandable list of ingredients
   - Each ingredient tagged: green (anti-inflammatory), yellow (neutral), red (pro-inflammatory)
   - Unknown ingredients flagged with info icon

4. **Better Alternatives Card**
   - Horizontal scroll of 3-4 alternative products with higher scores
   - Each showing: thumbnail, name, score badge
   - "In the same category" label

**Action Bar (sticky bottom):**
- "Add to Today's Log" (primary button, neon)
- "Save to Favorites" (heart icon, secondary)
- "Share" (share icon, secondary)

### Food Scanner Design Rules

- **Speed is critical.** Result screen must appear within 1 second of scan. Use skeleton loading if data is fetching.
- **Score is ALWAYS visible first.** Users need the verdict instantly (reference Yuka: score out of 100 with color verdict is the first thing you see).
- **Short ingredient explanations.** Keep notes to 1-2 lines per ingredient. Long descriptions reduce engagement in-store (Yuka research).
- **Anti-inflammatory focus, NOT calorie focus.** This is what differentiates Life Balance. Calories are secondary information, shown only on expansion.

---

## 7. Protocol 120 Days

### Design Reference
This is Life Balance's signature feature. No other app offers a structured 120-day anti-inflammatory protocol with visual transformation tracking. Design it as the emotional center of the app.

### Protocol Overview Screen (Tab 3 main view)

**Header:**
- "Your 120-Day Protocol" (H1)
- Current phase badge: "Phase 1: Foundation" (pill, neon green)

**Hero Progress Ring:**
- Large ring (160px), showing day progress (e.g., Day 34/120)
- Inner content: Day number (Display typography) + "days completed"
- Ring fill: Gradient from start color to neon green
- Below ring: Start date and projected end date

**Phase Timeline (horizontal):**
- 4 phases visualized as connected nodes:
  - Phase 1: Foundation (Days 1-30) -- establishing baseline
  - Phase 2: Optimization (Days 31-60) -- adjusting protocol
  - Phase 3: Acceleration (Days 61-90) -- deepening impact
  - Phase 4: Transformation (Days 91-120) -- visible results
- Current phase highlighted in neon, completed phases in success green, future phases in muted
- Connecting line between phases (like a journey map)

**Daily Checklist Card:**
- Today's tasks with checkboxes:
  - [ ] Take Omega-3 supplement
  - [ ] Scan at least 2 meals
  - [ ] Log water intake
  - [ ] 10-minute movement
  - [ ] Read today's lesson
- Progress: "3/5 completed today"
- Completing all 5 = "Perfect Day" badge

**Weekly Summary Cards (horizontal scroll):**
- Week 1, Week 2, etc.
- Each card: Week number, completion %, key metric change
- Current week card is enlarged and neon-bordered

**Protocol Milestones (vertical timeline):**
- Key milestones with icons:
  - Day 7: "First Week Complete"
  - Day 14: "Blood marker improvement window"
  - Day 30: "Phase 1 Complete -- Baseline Set"
  - Day 60: "Halfway -- First Visible Changes"
  - Day 90: "Inflammation markers shift"
  - Day 120: "Transformation Complete"
- Completed milestones: green check + earned badge
- Upcoming milestones: muted with lock icon

### Daily Protocol Detail Screen

**Accessed by tapping a day in the protocol**

- Day number and date at top
- Checklist with expanded instructions for each item
- Educational content: "Why this matters" expandable section
- ZENO tip of the day
- Food recommendations for this phase
- "Mark Day Complete" CTA at bottom

---

## 8. Data Visualization & Health Metrics

### Design Reference
Study these visualization approaches:
- **Apple Health:** Activity rings (three concentric circles for Move/Exercise/Stand) -- iconic, glanceable
- **Oura:** Readiness score with contributing factors (Sleep, Activity, Body readiness) -- single number with drill-down
- **WHOOP:** Recovery score (0-100%) with color coding (Green/Yellow/Red) and Strain on 0-21 scale

### Score System Design

Life Balance uses a **single hero score (Life Balance Score, 0-100)** composed of sub-scores:

```
Life Balance Score (0-100)
  |-- Anti-Inflammatory Index (0-100) -- based on food scanning
  |-- Omega-3 Estimate (0-100) -- based on supplement tracking + blood data
  |-- Protocol Adherence (0-100) -- based on daily checklist completion
  |-- Activity Score (0-100) -- from Garmin sync
  |-- Recovery Score (0-100) -- from sleep + HRV data
```

### Visualization Components

**1. Life Balance Ring (Primary)**
- Single large ring (similar to Apple Health but one ring, not three)
- 160px diameter on dashboard, 200px on detail screen
- Fill: gradient from `#D4FF00` to `#4ADE80`
- Center: Score number + "Life Balance" label
- Tap to explode into 5 sub-score rings (animated expansion)

**2. Sub-Score Mini Rings**
- 5 smaller rings (48px each) in a row below main ring
- Each with its own color accent:
  - Anti-Inflammatory: Orange to Green gradient
  - Omega-3: Blue to Cyan gradient
  - Protocol: Neon green
  - Activity: Purple to Pink gradient
  - Recovery: Teal gradient
- Tap any to see detail breakdown

**3. Trend Line Charts**
- Time periods: 7D / 30D / 90D / 120D (segmented control at top)
- Smooth bezier curves, NOT jagged lines
- Filled area under curve with gradient (main color to transparent)
- Interactive: drag finger across to see daily values (tooltip follows finger)
- Reference line at 75 (the "healthy zone" threshold) in dashed neon green
- X-axis: dates. Y-axis: 0-100.

**4. Inflammation Heatmap**
- Weekly grid (7 columns for days, rows for weeks)
- Each cell color-coded from red (high inflammation) to green (low)
- Similar to GitHub contribution graph but for health
- Gives quick visual of inflammation trends over months

**5. Before/After Comparison Cards**
- Side-by-side panels
- Left: "Day 1" metrics snapshot
- Right: "Today" metrics snapshot
- Delta indicators: green arrows up for improvements, red for declines
- Animated number counting from old value to new value

**6. Omega-3 Index Gauge**
- Semi-circular gauge (like a speedometer)
- Zones marked: <4% (deficient, red), 4-8% (suboptimal, yellow), 8-12% (optimal, green)
- Needle pointing to current estimated level
- "Your level: 6.2% (Suboptimal)" text below
- "Target: 8%+" with projected date based on current protocol

**7. Garmin Data Integration Panel**
- Card with Garmin logo
- Key synced metrics in a 2x2 grid:
  - Resting HR (with trend arrow)
  - HRV (with trend arrow)
  - Sleep hours (with quality bar)
  - Steps (with daily goal progress bar)
- "Last synced: 15 min ago" timestamp
- Pull-to-refresh functionality

### Chart Design Rules

- **Always show context.** A number alone means nothing. Show: current value, trend direction, comparison to baseline, and what "good" looks like.
- **Use animation.** Rings should animate filling on load. Charts should draw in. Numbers should count up. This makes data feel alive.
- **Limit data points visible.** Show summary first, details on tap. Do not overwhelm the dashboard with 15 charts.
- **Consistent color mapping.** Green is always good. Red is always concerning. Yellow is moderate. Never mix meanings.

---

## 9. AI Coach (ZENO)

### Design Reference
Study these AI UI patterns:
- **Woebot Health:** Mental health chatbot with progressive disclosure and guided exercises
- **Ada Health:** Conversational AI with 91% completion rate using calm, chat-like flow
- **Modern trend:** AI Assistant Cards (structured responses in cards) are replacing pure chat bubbles for complex outputs

### ZENO Personality

- **Name:** ZENO
- **Role:** Wellness Intelligence Coach
- **Tone:** Knowledgeable but warm. Data-driven but empathetic. Think "the smartest friend who also happens to be a nutritionist."
- **Visual identity:** Custom avatar/mascot. Suggestions: Abstract leaf/flame hybrid icon, or a stylized "Z" with organic curves. NOT a human face (avoids uncanny valley). NOT a generic robot.

### ZENO Interface Design

**Tab 5 Main View -- Hybrid Interface (NOT pure chatbot)**

The ZENO screen uses a hybrid approach: proactive insight cards on top, chat interface below.

**Top Section: ZENO's Insights (scrollable cards)**
- Cards that ZENO proactively generates based on user data
- Each card is a self-contained insight:
  - Card type 1: **Daily Insight** -- "Your inflammation score dropped 8% this week. Your increased Omega-3 intake is working!"
  - Card type 2: **Action Recommendation** -- "Try adding salmon to dinner tonight. It would boost your Omega-3 by 500mg." [CTA: "Show me recipes"]
  - Card type 3: **Alert** -- "Your Garmin shows poor sleep quality last night. Consider avoiding inflammatory foods today."
  - Card type 4: **Education** -- "Did you know? EPA and DHA reduce inflammation by blocking COX-2 enzymes." [CTA: "Learn more"]
- Cards are swipeable (dismiss or save)
- Each card has: ZENO avatar (16px), category tag, content, optional CTA button

**Bottom Section: Chat Interface**
- Standard chat layout but with enhancements:
- Input bar at bottom: Text field + voice input button + quick action chips
- Quick action chips above input: "Scan food", "Log supplement", "How am I doing?", "What should I eat?"
- ZENO messages: Left-aligned, `surface-elevated` background, rounded corners (no sharp speech bubble tails)
- User messages: Right-aligned, neon green background, dark text
- ZENO can send rich responses:
  - Text + chart (inline mini chart)
  - Text + food recommendation cards
  - Text + action buttons
- Typing indicator: Three pulsing dots with ZENO avatar

### ZENO Proactive Notifications

- **Morning:** "Good morning, {name}! Your recovery score is 82 (green). Great day for a workout!"
- **Post-scan:** "Nice choice! That avocado scores 89 on anti-inflammatory index."
- **Evening:** "You scanned 3 meals today. Your daily Omega-3 intake: 1,800mg (on track!)"
- **Milestone:** "Congratulations! Day 30 complete. Your inflammation markers improved 15%."

### ZENO Design Rules

- **Cards first, chat second.** Most users want quick insights, not conversations. The card interface is faster.
- **Never make ZENO annoying.** Max 3 proactive notifications per day. All dismissable.
- **Always cite data.** ZENO should reference the user's actual metrics, not generic advice.
- **Rich responses.** Use cards, charts, and buttons in ZENO's responses -- not walls of text.
- **Personality consistency.** ZENO uses first person, addresses user by name, uses encouraging language.

---

## 10. Community & Social

### Design Reference
- **Strava:** Segment leaderboards, kudos, activity feed, clubs, challenges. Strava's social features drive 15% more daily engagement.
- **Peloton:** Real-time leaderboards during classes, milestone celebrations, community challenges
- **Noom:** Group coaching with cohorts of 15-20 people, peer accountability

### Community Tab Layout

**Tab 4 Main View**

**Top: Active Challenge Banner**
- Full-width card showing current group challenge
- Challenge name: "30-Day Inflammation Crusher"
- Progress bar: Your progress vs group average
- Days remaining
- Participant count and avatars (overlapping circles)
- CTA: "View Challenge"

**Section: Your Cohort**
- "Your Group" header (groups of 15-20 people, similar to Noom)
- Cohort name (auto-generated or custom)
- Mini leaderboard showing top 5 members:
  - Rank number
  - Avatar
  - Name
  - Life Balance Score
  - Streak flame + day count
- "See Full Leaderboard" link
- Your position highlighted with neon border if not in top 5

**Section: Activity Feed**
- Scrollable feed of cohort activity:
  - "{Name} completed Day 45 of their protocol!" -- [High Five] button
  - "{Name} scanned 5 meals today!" -- [High Five] button
  - "{Name} reached an Omega-3 score of 85!" -- [High Five] button
- High Five = Strava's "Kudos" equivalent. Tap to send encouragement. Counter shows total.
- Each post: Avatar, name, timestamp, achievement text, High Five button + count

**Section: Challenges**
- "Available Challenges" header
- Horizontal scroll of challenge cards:
  - Challenge image/illustration
  - Title: "Omega-3 Sprint: 7 Days"
  - Participants: "234 joined"
  - Reward: "Earn the Omega Warrior badge"
  - "Join" CTA button
- Challenge types:
  - **Protocol challenges:** Complete X days without missing
  - **Scan challenges:** Scan X anti-inflammatory foods in a week
  - **Score challenges:** Reach a Life Balance Score of X
  - **Team challenges:** Cohort vs cohort competitions

**Section: Sharing**
- "Share Your Progress" card
- Generates shareable image card:
  - Dark background with neon accents
  - User's Life Balance Score ring
  - Protocol day count
  - Key stat of the week
  - Life Balance branding
- Share to: Instagram Stories, WhatsApp, iMessage, general share sheet
- Pre-formatted for Instagram Story dimensions (1080x1920)

### Social Design Rules

- **Positivity only.** No way to comment negatively. Only High Fives (positive reactions).
- **Relative ranking.** Show user's percentile in their cohort, not absolute rank in the whole app (avoids discouragement).
- **Privacy first.** Users choose what to share. Default: only protocol progress is visible. Scores, food logs, and blood work are private by default.
- **Small groups.** Cohorts of 15-20 create accountability (Noom's proven model). Not 10,000-person anonymous leaderboards.

---

## 11. Gamification System

### Design Reference
- Headspace saw 35% increase in weekly active users through gamified streaks and progress milestones
- Users are 2.3x more likely to engage daily once they build a 7+ day streak
- Fitbit leaderboards drive 15% increase in daily steps

### Streak System

**Visual: Flame Icon**
- Active streak: Neon green flame icon with day count
- Sizes: Small (in tab bar, 16px), Medium (in profile, 24px), Large (in celebration modal, 64px)
- Flame animation: Gentle flicker when active, grows larger at milestone streaks (7, 14, 30, 60, 90, 120 days)
- Broken streak: Gray flame with "Restart" prompt (not punitive -- encouraging)

**Streak Criteria:**
- Complete at least 3 of 5 daily protocol tasks = streak maintained
- Must scan at least 1 meal per day
- Grace period: 1 skip day per 30-day period (reduces anxiety)

### Badge System

**Categories:**

| Badge | Trigger | Visual Style |
|-------|---------|-------------|
| **First Scan** | Scan first food | Camera with sparkle |
| **Week Warrior** | 7-day streak | Shield with "7" |
| **Omega Starter** | Log Omega-3 for 7 days | Blue capsule |
| **Inflammation Fighter** | Reduce inflammation score by 10% | Flame turning green |
| **Protocol Pioneer** | Complete Phase 1 (30 days) | Bronze medal |
| **Halfway Hero** | Complete 60 days | Silver medal |
| **Data Driven** | Connect Garmin and sync 30 days | Watch icon |
| **Blood Warrior** | Upload first blood work result | Red drop |
| **Community Champion** | Give 50 High Fives | Hands icon |
| **Omega Master** | Reach 8%+ Omega-3 Index | Gold capsule |
| **Transformation Complete** | Complete 120-day protocol | Gold trophy |
| **Perfect Week** | 7/7 perfect days | Star with "7" |
| **Scan Master** | Scan 100 foods | Camera with "100" |

**Badge Visual Design:**
- Circular badges, 64px diameter
- Earned: Full color with subtle glow
- Locked: Grayscale with lock icon overlay
- Displayed in a grid (3 columns) on Profile screen
- Earning animation: Badge flies in from bottom, bounces, and glows briefly

### Points System (XP)

- Scan a meal: +10 XP
- Complete daily checklist: +50 XP
- Perfect day (5/5): +100 XP
- Maintain streak: +streak_days x 5 XP per day
- Upload blood work: +200 XP
- Complete a phase: +500 XP
- Win a challenge: +300 XP

**Levels:**
- Noom Novice (0-999 XP) -> Protocol Explorer (1000-4999) -> Wellness Warrior (5000-14999) -> Health Champion (15000-29999) -> Life Balance Master (30000+)
- Level displayed as badge next to name in community

### Daily Rewards

- Login reward: Small XP bonus for opening the app
- Bonus multiplier: 2x XP on streak days
- Weekly bonus: Complete all 7 days = bonus badge + XP

---

## 12. Unique Differentiators

These features exist in NO other wellness app. Design them as premium, showcase experiences.

### 12.1 Dual Future Mirror (Before/After Body Projection)

**Concept:** AI-generated visualization showing the user's projected body transformation based on their protocol adherence. Research shows vivid mental imagery boosts adherence to health plans.

**Screen Design:**

- Full-screen immersive experience, accessed from Protocol tab or Profile
- Split screen: Left = "Day 1 You" / Right = "Day 120 You (Projected)"
- Slider control at bottom to drag between timepoints (Day 1 -> Day 30 -> Day 60 -> Day 90 -> Day 120)
- As slider moves, the right image morphs smoothly
- NOT a real photo manipulation. Use stylized body silhouette/avatar that changes:
  - Body shape (subtle slimming/toning based on protocol type)
  - Skin glow (from dull to radiant)
  - Energy visualization (aura/glow around figure increases)
  - Inflammation points (red dots that fade from "before" to "after")
- CTA: "Stay on protocol to reach this"
- Share button to create motivational before/after card

**Design Notes:**
- Use abstract/artistic body representations to avoid body image issues
- Focus on HEALTH visualization (inflammation reduction, energy glow), not just weight
- Show metrics alongside: "Day 1: Inflammation High, Omega-3: 4%" vs "Day 120: Inflammation Low, Omega-3: 9%"
- Regenerates every 30 days based on actual progress

### 12.2 Anti-Inflammatory Food Scoring (NOT just calories)

**This is the core differentiator of the food scanner.**

**Score Components (visible on food detail):**
- **Anti-Inflammatory Index** (primary, 0-100): Proprietary score based on food's inflammatory properties
- **Omega-6:Omega-3 Ratio:** Visual bar showing ratio with optimal zone marked
- **Inflammatory Ingredients Flag:** Red flags for known inflammatory compounds (refined sugar, trans fats, processed seed oils)
- **Anti-Inflammatory Ingredients Highlight:** Green highlights for turmeric, omega-3 rich fish, leafy greens, berries, etc.

**Visual Design:**
- The score ring is the FIRST thing users see (not calories, not macros)
- Calorie and macro information is available but secondary (in an expandable section)
- Comparison feature: "This food vs your average meal score"
- Daily accumulation: "Your day's total anti-inflammatory score: 72 (Good)"

### 12.3 Omega Database by Brand (Collective Data)

**Concept:** Crowd-sourced database where users contribute Omega-3 supplement data by brand, creating the world's largest brand-specific Omega-3 quality database.

**Screen: Omega Database (accessible from Scan tab or ZENO)**

- Search bar at top: "Search by brand or product"
- Trending supplements (horizontal scroll)
- Each product card shows:
  - Brand logo/image
  - Product name
  - EPA + DHA content (mg)
  - Community rating (1-5 stars)
  - Number of users tracking this brand
  - "Effectiveness Score" based on aggregated blood work data from users of that brand
  - Price per mg of Omega-3 (value score)
- "Add Your Brand" CTA for new supplements
- Filter options: By type (Fish Oil, Krill Oil, Algae), By EPA content, By price, By community rating

**This is unique because:** No app aggregates real user outcome data (blood work + protocol adherence) by supplement brand. This creates a valuable dataset and community trust.

### 12.4 Peer Benchmark (Real People, Not Generic)

**Concept:** Compare your metrics to real, anonymized peers with similar profiles -- not generic population averages.

**Screen: "How You Compare" (accessible from Dashboard or Profile)**

- "People like you" definition: Same age range, similar goals, same protocol phase
- Comparison cards:
  - "Your Life Balance Score vs peers: You're in the top 35%"
  - "Your Omega-3 intake vs peers: 20% above average"
  - "Your protocol adherence vs peers: Top 10%"
- Visualization: Bell curve with user's position marked (neon green dot on the curve)
- Anonymized peer data: "234 people in your peer group"
- Trends: "You moved from bottom 50% to top 35% in 30 days"

**Design Notes:**
- Never show other users' names or identifiable info
- Frame comparisons positively: "You're making progress" not "You're below average"
- Show only when enough peers exist (minimum 50 in peer group)

### 12.5 Protocol 120 Days with Visual Transformation

**The transformation timeline is the emotional backbone of the app.**

**Transformation Timeline Screen:**

- Vertical scrollable timeline from Day 1 to Day 120
- Each significant day shows:
  - Photo (if user uploaded one)
  - Key metrics snapshot
  - Milestone badge (if earned)
  - ZENO note about changes observed
- "Add Photo" prompts at Day 1, 30, 60, 90, 120 (for user's personal before/after)
- Parallax scrolling effect: background changes from warm red tones (inflammation) to cool green tones (health) as user scrolls from Day 1 to Day 120
- "Export My Journey" button: Generates a shareable transformation collage

---

## 13. Micro-Interactions & Animations

### Principle
Every interaction should feel alive and responsive. Micro-interactions provide instant feedback and emotional connection.

### Specific Animations to Implement

| Trigger | Animation | Duration | Details |
|---------|-----------|----------|---------|
| App open | Score ring fills | 800ms | Ring animates from 0 to current score, numbers count up |
| Food scan success | Green flash + checkmark | 400ms | Camera viewfinder flashes green, checkmark bounces in |
| Score change | Number morphs | 600ms | Old number morphs to new with color transition |
| Streak increment | Flame grows | 500ms | Flame icon scales up 120%, neon glow pulses, settles back |
| Badge earned | Badge fly-in | 1000ms | Badge enters from bottom, bounces, particles emit, glow |
| High Five sent | Hand animation | 300ms | Hand icon pops with small particle burst |
| Checklist complete | Checkbox fill | 200ms | Smooth fill with slight bounce, line-through on text |
| Pull to refresh | Neon ring spin | Variable | Small ring at top spins while loading |
| Tab switch | Crossfade | 250ms | Content crossfades, no jarring cuts |
| Bottom sheet open | Spring up | 350ms | Sheet springs up with slight overshoot and settle |
| ZENO thinking | Dot pulse | Loop | Three dots pulse sequentially (typing indicator) |
| Protocol day complete | Confetti burst | 1500ms | Small confetti burst on "Perfect Day" completion |
| Phase complete | Full celebration | 3000ms | Full-screen confetti + badge + congratulation text overlay |

### Haptic Feedback (iOS/Android)

| Action | Haptic Type |
|--------|-------------|
| Scan detected | Light impact |
| Score revealed | Medium impact |
| Badge earned | Success notification |
| Streak broken | Warning notification |
| Button tap | Selection tap |
| Pull to refresh | Soft impact |

### Transition Rules

- **Duration:** 200-400ms for most transitions. Never exceed 1000ms except celebrations.
- **Easing:** Use spring/bounce easing for playful interactions, ease-out for navigation
- **Reduce motion:** Always provide a reduced-motion alternative (static transitions) for accessibility
- **Performance:** Animations must run at 60fps. Use hardware-accelerated properties (transform, opacity)

---

## 14. Screen-by-Screen Specification

### Complete Screen List for Figma Prototype

**Onboarding (20 screens)**
1. Splash/Welcome
2. Problem Statement
3. Promise/Value Prop
4. Name Input
5. Goal Selection
6. Age Input
7. Gender Selection
8. Current Diet
9. Supplements Question
10. Health Concerns
11. Wearable Device
12. Blood Work Status
13. Activity Level
14. Motivation Style
15. Commitment Ask
16. Plan Processing Animation
17. Personal Plan Reveal
18. Meet ZENO
19. Permissions
20. First Action Prompt

**Main App (25+ screens)**
21. Home Dashboard (scrollable, all sections)
22. Score Detail (expanded sub-scores + trends)
23. Food Scanner - Camera Active
24. Food Scanner - Scanning State
25. Food Scanner - Results (bottom sheet)
26. Food Detail - Full Screen (with all breakdown cards)
27. Manual Food Entry
28. Omega Database - Search/Browse
29. Omega Database - Product Detail
30. Protocol Overview (120-day view)
31. Protocol Daily Detail
32. Protocol Phase Complete Celebration
33. Transformation Timeline
34. Future Mirror (Before/After projection)
35. Community - Main Feed
36. Community - Leaderboard (full)
37. Community - Challenge Detail
38. Community - Challenge Joined + Progress
39. Community - Shareable Progress Card
40. ZENO - Main (cards + chat)
41. ZENO - Full Chat Thread
42. ZENO - Rich Response (with chart/recommendation)
43. Profile Screen
44. Profile - Badges Collection
45. Profile - Settings
46. Profile - Garmin Connection
47. Profile - Blood Work Entry
48. Notification Center
49. Peer Benchmark Screen

**Secondary/Modal Screens**
50. Daily Checklist Completion Modal
51. Badge Earned Modal
52. Streak Milestone Modal
53. Phase Complete Modal
54. Supplement Logging Modal
55. Share to Social Preview
56. Garmin Sync Detail

### Prototype Flow Connections

**Critical user journeys to wire in Figma prototype:**

1. **Onboarding -> First Scan:** Screen 1-20, then direct to camera (Screen 23)
2. **Daily Usage:** Open app -> Dashboard (21) -> Scan food (23-26) -> Check protocol (30-31) -> Mark checklist complete (50)
3. **Community Engagement:** Dashboard (21) -> Community tab (35) -> Join challenge (37-38) -> Check leaderboard (36)
4. **ZENO Interaction:** Dashboard (21) -> ZENO tab (40) -> Tap insight card -> Action (scan/log/learn)
5. **Progress Review:** Dashboard (21) -> Score detail (22) -> Transformation timeline (33) -> Future Mirror (34) -> Share (55)
6. **Supplement Research:** Scan tab -> Omega Database (28-29) -> Log supplement (54)

---

## 15. Accessibility & Localization

### Accessibility Requirements

- **Contrast ratios:** All text must meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text). Test neon green (#D4FF00) on dark (#1A1A1A) -- this combination provides approximately 12:1 contrast, which is excellent.
- **Touch targets:** Minimum 44x44px (iOS HIG) / 48x48dp (Material Design)
- **Font scaling:** Support Dynamic Type (iOS) / Font Size settings (Android) up to 200%
- **Screen readers:** All images need alt text. All charts need text descriptions. Score rings need accessible labels.
- **Reduced motion:** Honor system "reduce motion" setting. Replace animations with instant transitions.
- **Color blindness:** Never use color alone to convey information. Always pair with: icons, labels, patterns, or text. Score rings should show numeric value + text verdict, not just color.
- **Dark mode is default** -- which is already better for eye strain and low-light usage

### Localization

**Priority Languages:**
1. English (US) -- primary
2. Portuguese (Brazilian) -- primary (target: Brazilians in Florida)
3. Spanish (US/Latin) -- secondary (target: Hispanic community)

**Design for localization:**
- Leave 30-40% extra space for text expansion (Portuguese and Spanish texts are ~20-30% longer than English)
- Use icons alongside text labels (icons are universal)
- Date formats: Support both MM/DD/YYYY (US) and DD/MM/YYYY (BR/LATAM)
- Number formats: Support both period (1,234.56 US) and comma (1.234,56 BR) decimals
- Units: Support both lbs/feet and kg/cm
- Currency: USD for supplement pricing
- Avoid text in images -- keep all text as live text for translation

### Bi-cultural Design Considerations

- **Brazilians in Florida** are often health-conscious, community-oriented, and respond well to warm, personal communication (ZENO's tone matters)
- **Hispanic community** values family and group experiences -- emphasize cohort and community features
- **Americans** tend to be data-driven -- emphasize metrics, charts, and quantified results
- The design should feel **premium and universal** -- not culturally specific in visual language. The localization is in text/content, not in visual design.

---

## Appendix: Competitor Quick Reference

### What to Learn From Each Competitor

| App | Key Lesson for Life Balance |
|-----|---------------------------|
| **WHOOP** | Dark theme with colored score system. Three-metric home screen. Recovery score color coding (green/yellow/red). Clean data visualization. |
| **Oura** | Single readiness score that synthesizes multiple factors. Redesigned app with quick-glance vitals. Color system for body states. Personal baselines. |
| **Noom** | Psychology-based onboarding (77-step quiz). Group cohorts of 15-20. Daily bite-sized lessons. Identity progression (Novice to Master). Setting expectations upfront. |
| **Yuka** | Instant scan results. Color-coded score (0-100). Better alternatives suggestion. Short ingredient explanations. 80M users prove the UX works. |
| **Strava** | Kudos system (positive-only social). Segment leaderboards. Activity feed. Challenges that drive engagement. Share cards for Instagram. |
| **Peloton** | Real-time competition. Milestone celebrations. Community challenges. Streak motivation. |
| **Apple Health** | Activity rings as iconic visualization. Data aggregation from multiple sources. Clean metric cards. |
| **Headspace** | Rounded, organic visual language. Illustration-driven brand. Streaks with 35% more weekly active users. Progress milestones. |
| **Calm** | Nature-inspired visuals. Soothing animations. Minimalist navigation. Immersive full-screen experiences. |
| **Garmin Connect** | Wearable data sync. Comprehensive health metrics. Training effect visualization. |
| **MyFitnessPal** | Food logging simplicity. Barcode scanning speed. Nutritional breakdowns. |

### What NO Competitor Does (Life Balance Exclusives)

1. **Food -> Inflammation -> Blood Data pipeline.** No app connects what you eat to inflammation markers to actual blood work results in a unified experience.
2. **Anti-inflammatory food scoring.** Every food scanner focuses on calories/macros. Life Balance scores for inflammation impact.
3. **Omega-3 brand database with outcome data.** No app tracks which supplement brands actually work based on aggregated user blood results.
4. **120-day structured anti-inflammatory protocol.** No app offers a phased, guided protocol specifically for inflammation reduction with daily checklists and phase transitions.
5. **Future Mirror body projection.** AI-powered transformation visualization tied to protocol adherence, not just generic weight simulators.
6. **Peer benchmark against real, similar people.** Not population averages -- comparisons against people with the same goals, age, and protocol phase.

---

## Designer Checklist

Before delivering the Figma prototype, verify:

- [ ] All screens designed in dark mode (primary) with light mode variant
- [ ] Neon green (#D4FF00) used as accent only, never as large background areas
- [ ] Bottom navigation with 5 tabs, center tab (Protocol) visually prominent
- [ ] Onboarding flow: 20 screens with progressive disclosure
- [ ] Food scanner: camera view + results bottom sheet with anti-inflammatory score as hero
- [ ] Protocol 120 days: ring progress + phase timeline + daily checklist
- [ ] ZENO AI coach: hybrid card + chat interface
- [ ] Community: cohort leaderboard + challenges + activity feed + share cards
- [ ] Score system: main Life Balance Ring that expands into 5 sub-scores
- [ ] Gamification: streaks (flame), badges (grid), XP levels
- [ ] Future Mirror: before/after visualization screen
- [ ] All interactive states designed: default, hover/press, active, disabled, loading, empty, error
- [ ] Skeleton loading states for all data-heavy screens
- [ ] Touch targets minimum 44x44px
- [ ] Text contrast meets WCAG AA on dark background
- [ ] Prototype flows connected for 6 critical user journeys
- [ ] Component library with all reusable elements documented
- [ ] Reduced motion alternatives noted for key animations
- [ ] Space reserved for Portuguese/Spanish text expansion (30-40%)

---

*End of Design Guide*
