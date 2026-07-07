#  V2 — Emotional Support Flow Redesign

**Product Development Specification (PDS)**

This document acts as a design direction, UX checklist, feature scope, development roadmap, and pre-implementation validation guide. It is a mini PRD that both designers and developers can work from - intended to be built before a single Figma screen or React component is created.

---

## Goal

Transform Calm Space from a chatbot-first application into an emotion-regulation-first experience.

**Current Flow:**

```
Open App
   ↓
Select Emotion
   ↓
Chat
```

**Target Flow:**

```
Open App
   ↓
Emotion Check-in
   ↓
Recommended Regulation Exercise
   ↓
60 Second Exercise
   ↓
Reflection Checkpoint
   ↓
Chat OR Another Exercise
```

---

## Core Product Principle

**Current product asks users:**
> "Tell us what's wrong."

**New product should say:**
> "Let's help you feel slightly better first."

The user should feel supported before being asked to explain themselves.

---

## Information Architecture

### Support — Primary Product Area
Contains:
- Check In
- Conversations

Purpose:
- Emotional support
- Exercises
- AI Companion

### Reflect — Secondary Product Area
Contains:
- Journal
- Community

Purpose:
- Self reflection
- Sharing experiences

> Community is not a core feature. Journal remains higher priority.

### You — Utility Section
Contains:
- Dashboard
- Settings

Purpose:
- Progress tracking
- Preferences
- Personal insights

---

## Landing Page Redesign

### Problems With Current Design

**Problem 1 — Feels clinical.**
User immediately sees: Angry, Sad, Panic, Depression — without context.

**Problem 2 — Large empty space.**
No emotional warmth. No onboarding guidance.

**Problem 3 — No visible value proposition.**
User does not know what happens next, how long it takes, or why they should continue.

### Landing Page Requirements

**Welcome Section** — Must include:
- Greeting
- Supportive message
- Current time context

Example:
> Good Evening
>
> Let's take a moment to check in. We'll help you find support in under a minute.

**Emotion Selection**

Replace diagnosis-style labels with experience-based emotions.

Examples:
- Overwhelmed
- Sad
- Frustrated
- Anxious
- Lonely
- Exhausted

**Emotion Card Requirements**

Each card must contain:
- Icon
- Emotion Name
- Short Description

Example:
>  Sad
>
> Feeling emotionally drained or carrying something heavy

### Visual Goals

Landing page should feel:
- Safe
- Warm
- Soft
- Non-clinical
- Minimal

Avoid:
- Hospital feeling
- Medical dashboard feeling
- Corporate dashboard feeling

---

## Exercise Recommendation Screen

### Purpose
- Validate emotion
- Provide immediate support
- Prevent direct jump into AI chat

### Required Components

**Acknowledgement** — System recognizes emotion.
> It's okay to feel this way.

**Support Message** — Explain purpose.
> Let's spend one minute helping your mind and body settle first.

**Exercise Suggestions** — Show 3–4 exercises.

### Exercise Mapping

**Anxiety / Panic**
- Box Breathing
- 5-4-3-2-1 Grounding
- Body Scan
- Breathing Timer

**Sadness**
- Positive Reflection
- Gratitude Prompt
- Gentle Breathing
- Memory Recall

**Anger**
- Tension Release
- Pause Exercise
- Reframing Prompt
- Breathing Cycle

---

## Exercise Session Screen

### Purpose
- Single task focus
- Reduce cognitive load

### Required Elements
- **Exercise Title** (e.g. "Box Breathing")
- **Timer** — 60 seconds, visible at all times
- **Progress Indicator** — 0 → 60, must be visible
- **Animation** — Visual breathing aid (expanding circle, growing shape, pulsing orb)

---

## Post Exercise Reflection Screen

### Purpose
- Measure effectiveness
- Guide next action

### Question
> How are you feeling now?

### Options
- Better
- About The Same
- Still Struggling

### Decision Tree

**Better**
> Would you like to talk about it or continue your day?

Options: Talk About It / Finish Session

**Same**
> Would another exercise help?

Options: Try Another Exercise / Start Chat

**Worse**
> Let's talk through it together.

Action: Open Chat

---

## Chat Screen Redesign

### Problem
Current chat likely feels like generic AI. No context. No emotional continuity.

### Chat Requirements

Before first message show:
- Selected Emotion
- Completed Exercise
- Reflection Result

Example:
> Feeling: Anxious
>
> Exercise: 5-4-3-2-1 Grounding
>
> Status: Feeling Slightly Better

### Conversation Goal

AI should continue from session context.

Avoid: "How are you feeling?" — already answered.

Instead: "What do you think triggered these feelings today?"

---

## Dashboard Rework

Dashboard should track:

**Emotional History**
- Mood Frequency
- Weekly Trends
- Common Emotions

**Regulation Success**
- Exercises Completed
- Most Effective Exercises
- Average Improvement Score

**Journal Insights**
- Most Logged Emotions
- Reflection Activity

---

## Community Rework

**Current Priority:** LOW

**Version 2 Goal:**
- Anonymous support
- Success stories
- Shared coping methods

No heavy development initially.

---

## UI Design Checklist

### Landing
- [ ] Warm greeting
- [ ] Reduce empty space
- [ ] Better emotion labels
- [ ] Emotion descriptions
- [ ] Clear value proposition

### Exercise Recommendation
- [ ] Acknowledgement message
- [ ] Emotion-specific exercises
- [ ] Clear next step

### Exercise Screen
- [ ] Timer
- [ ] Progress indicator
- [ ] Animation
- [ ] Minimal distractions

### Reflection Screen
- [ ] Better / Same / Worse options
- [ ] Branching flow
- [ ] Session completion path

### Chat
- [ ] Emotion context visible
- [ ] Exercise history visible
- [ ] AI aware of previous steps
- [ ] Non-generic opening message

### Navigation
- [ ] Support section
- [ ] Reflect section
- [ ] You section
- [ ] Reduce top-level clutter

---

## Risks To Validate

**Risk 1** — Users may want immediate chat.
Solution: Skip Exercise option.

**Risk 2** — 60 seconds may feel long.
Test: 30s / 45s / 60s.

**Risk 3** — Users may repeatedly select same emotion.
Need: Personalized recommendations (later).

**Risk 4** — Exercises may feel repetitive.
Need: Exercise rotation system (future version).

---

## Success Metric

A successful redesign should achieve:
- User feels calmer before chatting.
- User completes at least one exercise.
- User reaches chat with emotional context.
- User feels supported rather than interrogated.

---

*File location: `docs/CALM_SPACE_V2_PRODUCT_SPEC.md`*
