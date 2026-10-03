# Project plan: Attribution Lab

## Brief

**Type:** Marketing and SEO tool

**Problem:** Different attribution rules tell different stories about the same customer journey.

**Audience:** A marketer explaining model trade-offs with a small campaign dataset.

## Experience flow

1. Arrive at a direct, descriptive introduction.
2. Review the sample interface and its scope before interacting.
3. Try the core control: Compare three rule-based attribution models.
4. See a local result or demonstration state without sending a request to a service.

## Interaction

First-touch, last-touch and linear models allocate the illustrative conversion value; a CSV can replace the sample.

## Key design decision

Put the model rule beside results and avoid claiming that any one model reveals causal impact.

## Boundaries

A simple rule-based model; no identity resolution, incrementality experiment or causal inference.

The tool is intentionally transparent about its input, assumptions and limits. It is a front-end educational prototype, not a substitute for platform data, professional review or controlled measurement.

## Next iteration

Add data-quality checks and side-by-side cohort exports while preserving the distinction from causal measurement.

## Learning goals

- Structure a complete page with meaningful headings, landmarks and labelled controls.
- Separate visual rules in CSS from interaction logic in JavaScript.
- Make states understandable with keyboard controls and live status text.
- Document assumptions and the boundary between a helpful prototype and a production service.
