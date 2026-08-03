---
title: "CAUSE: Cross-modal Attention for Utterance-level Speaker–Listener Empathy"
excerpt: "Multimodal (text/audio/vision) empathetic response generation, driven by cross-attention between speaker and listener at the utterance level.<br/><img src='/images/cause_teaser.png'>"
collection: portfolio
---

> **Status:** Submitted to **AAAI 2027** (under double-blind review).  
> Method summary shown below. **Full manuscript available upon request.**

## Research Objectives

- Multimodal (text + audio + video) empathetic response generation.
- Cross-attention that binds the **speaker's emotional cues** to the **listener's response cues** at the utterance level.
- Emotion-driven, adaptive empathy — beyond text-centric LLM approaches.

## Motivation

Existing empathetic-response research is dominated by text-based LLMs that ignore non-verbal cues, or by "talking head" generators that reflect facial motion without emotional grounding. Human empathy depends on the speaker's tone and expression, so the listener's reaction should vary with those signals. This calls for a model that fuses the speaker's audio, visual, and textual signals *and* conditions the listener's generation on that fused representation.

## Method (high-level)

An utterance-level Listener Bank uses cross-attention over the speaker's audio, textual, and visual features to produce pose and expression coefficients for the listener. These coefficients drive a face generator to synthesize a video response whose affect is consistent with the speaker's emotional state.

![CAUSE architecture](/images/cause_architecture.png)

## Selected Qualitative Results

Speaker → Listener pairs demonstrate emotion-adaptive empathy (e.g. *sad → surprised*, *disgust → angry*, *happy → happy*), whereas the model without CAUSE collapses to a neutral talking head.

![CAUSE qualitative results](/images/cause_results.png)

## Related Work in the Same Line

- **REACT 2026 Challenge (ACM Multimedia)** — participating; contributed a 70K-sample multimodal empathy dataset and a diffusion-based empathetic-reaction model that injects multimodal cues as noise conditions (LLM-free).
- **Multi-Signal-Based User Emotion Recognition and Cognitive Empathy Modeling** — KMMS Autumn 2024 (first author). See [project page](/portfolio/3-team-research-ii/).

## Achievements

- Submitted to AAAI 2027 (under review).
- Two NRF / Sookmyung SW Principal Investigator grants supporting this line.
