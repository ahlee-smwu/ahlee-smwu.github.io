---
title: "Multi-Signal-Based User Emotion Recognition and Cognitive Empathy Modeling"
short_title: "Multimodal Emotion Recognition & Empathy Modeling"
number: "03"
category: "Team Research Project II"
topic: "Multimodal Emotion Recognition and Empathy Modeling"
period: "2024.09 – 2025.10"
teaser: /images/team2_results.jpg
teaser_caption: "Speaker neutral → listener happy / worry / furious — a listener that reacts, not just a talking head."
summary: "Vision + audio fused and aligned in dyadic interactions → listener reactions beyond the talking head."
badges:
  - { text: "Published · KMMS Autumn 2024", kind: neutral }
  - { text: "First author", kind: first }
  - { text: "2× Principal Investigator", kind: pi }
featured: false
excerpt: "Vision and audio integration with multimodal alignment for cognitive empathy modeling in dyadic speaker–listener interactions. First-author paper at KMMS Autumn 2024; Principal Investigator on two supporting grants."
collection: portfolio
---

{% include project-header.html %}

## Objectives

<ul class="keys">
  <li><strong>Multimodal emotion model</strong> learned from dyadic (speaker–listener) datasets.</li>
  <li><strong>Vision + audio integration</strong> for high-dimensional cognitive empathy.</li>
  <li><strong>Multimodal alignment</strong> for temporally consistent responses.</li>
</ul>

## Motivation

<div class="duo">
  <div class="panel">
    <p class="panel__title">Problem</p>
    <ul>
      <li>Avatars limited to a simple "talking head".</li>
      <li>No high-dimensional cognitive empathy.</li>
    </ul>
  </div>
  <div class="panel">
    <p class="panel__title">Idea</p>
    <ul>
      <li>Learn empathy correlations directly from dyadic interactions.</li>
      <li>Keep video and audio dynamically synchronized.</li>
    </ul>
  </div>
</div>

## Method

<ul class="keys">
  <li><strong>Video</strong> → ViCo → listener video.</li>
  <li><strong>Audio</strong> → AnyGPT → listener audio.</li>
  <li><strong>Alignment</strong> with wav2lip · <strong>enhancement</strong> with ESRGAN.</li>
</ul>

<figure class="fig">
  <img src="/images/team2_method.png" alt="Pipeline: video and audio through ViCo and AnyGPT, aligned with wav2lip and enhanced with ESRGAN" loading="lazy">
  <figcaption>Vision &amp; audio integration (left) and multimodal alignment (right).</figcaption>
</figure>

## Results

<ul class="keys">
  <li>Listener stays synchronized with the speaker while showing the intended reaction — <em>happy / worry / furious</em>.</li>
</ul>

## Achievements

<ul class="keys">
  <li><span class="badge">Published</span> KMMS Autumn 2024 (first author).</li>
  <li><span class="badge badge--pi">Principal Investigator</span> WISET — <em>Vision-based Emotion Recognition &amp; Empathy Modeling</em> (2025.04 – 2025.10).</li>
  <li><span class="badge badge--pi">Principal Investigator</span> IITP / Sookmyung SW-Centered University — <em>Visual Signal Analysis and Empathy Modeling for User Emotion Recognition</em> (2024.09 – 2024.11).</li>
  <li><span class="badge">Continued in</span> <a href="/portfolio/2-cause/">CAUSE</a> — multimodal empathetic response generation (AAAI 2027, under review).</li>
</ul>
