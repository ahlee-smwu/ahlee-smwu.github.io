---
title: "CAUSE: Sequential Empathetic Listener Reaction Generation from Response Speech"
short_title: "CAUSE — Multimodal Empathetic Response Generation"
number: "02"
category: "Team Research Project I"
topic: "Multimodal Empathetic Response Generation"
period: "2026.01 – 2026.06"
teaser: /images/cause_results.jpg
teaser_caption: "Listener reactions follow the speaker's emotion — happy → happy, disgust → angry, sad → surprised. Without CAUSE the listener stays neutral."
summary: "Speaker audio + video + text fused by cross-attention → listener reactions that track the speaker's emotion."
badges:
  - { text: "Under review · AAAI 2027", kind: review }
  - { text: "First author", kind: first }
featured: true
excerpt: "CAUSE generates empathetic listener reactions by cross-attending the speaker's audio, visual and textual cues at the utterance level — emotion-adaptive empathy beyond text-centric models."
collection: portfolio
---

{% include project-header.html %}

## Objectives

<ul class="keys">
  <li><strong>Multimodal</strong> (text / audio / video) empathetic response generation.</li>
  <li><strong>Cross-attention</strong> binding the speaker's emotional cues to the listener's reaction cues.</li>
  <li><strong>Emotion-driven</strong>, adaptive empathy — beyond text-centric LLM approaches.</li>
</ul>

## Motivation

<div class="duo">
  <div class="panel">
    <p class="panel__title">Problem</p>
    <ul>
      <li>Empathy research is dominated by text-centric models.</li>
      <li>Non-verbal cues are ignored.</li>
    </ul>
  </div>
  <div class="panel">
    <p class="panel__title">Why multimodal</p>
    <ul>
      <li>Empathy varies with facial and vocal tone.</li>
      <li>The listener needs the speaker's <strong>fused</strong> multimodal signal.</li>
    </ul>
  </div>
</div>

## Method

<ul class="keys">
  <li><strong>Speaker Bank</strong> (frozen) — encodes the speaker's video and text.</li>
  <li><strong>Listener Bank</strong> (trained) — cross-attention over audio features → pose &amp; expression coefficients.</li>
  <li><strong>Pose VAE + Expression VAE + MLPs</strong> → motion coefficients.</li>
  <li><strong>Frozen face generator</strong> → the listener video, sequentially aligned with the speaker.</li>
</ul>

<figure class="fig">
  <img src="/images/cause_method.png" alt="CAUSE architecture: Speaker Bank, Listener Bank with cross-attention, Pose VAE, Expression VAE, MLP heads and a frozen generator" loading="lazy">
  <figcaption>CAUSE overview — the Listener Bank cross-attends speaker cues to produce pose and expression coefficients for the generator.</figcaption>
</figure>

## Results

<ul class="keys">
  <li><strong>Emotion-adaptive.</strong> Speaker <em>happy</em> → listener <em>happy</em> · <em>disgust</em> → <em>angry</em> · <em>sad</em> → <em>surprised</em>.</li>
  <li><strong>Without CAUSE</strong> the model collapses to a neutral talking head.</li>
</ul>

<figure class="fig">
  <img src="/images/cause_compare.jpg" alt="Listener reactions across happy, angry and surprised: baseline without CAUSE, CAUSE, and ground truth" loading="lazy">
  <figcaption>Across <em>happy / angry / surprised</em>, CAUSE (middle row) tracks the ground-truth listener (bottom) more closely than the no-CAUSE baseline (top).</figcaption>
</figure>

## Achievements

<ul class="keys">
  <li><span class="badge badge--review">Under review</span> Submitted to <em>AAAI 2027</em> (first author).</li>
  <li><span class="badge">Related project</span> NRF — <em>Probabilistic Empathy Response Generation via Multimodal Fusion</em> (2026.03 – 2026.05, participant).</li>
  <li><span class="badge">Builds on</span> <a href="/portfolio/3-team-research-ii/">Multi-Signal-Based User Emotion Recognition and Cognitive Empathy Modeling</a> (KMMS Autumn 2024).</li>
</ul>

<p class="muted">Full manuscript available upon request.</p>
