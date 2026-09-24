---
title: "RAPID: Robust Adaptive Prior Integration for Diffusion"
short_title: "RAPID — Few-Step Diffusion via Adaptive Prior"
number: "01"
category: "Master's Thesis"
topic: "Few-Step Diffusion via Adaptive Prior"
period: "2025.06 – 2026.06"
teaser: /images/rapid_teaser.jpg
teaser_alt: "Sampling trajectories from t = 0 to t = 1: naive diffusion needs 250 steps, RAPID reaches the same image in 40"
teaser_caption: "Naïve diffusion: 250 steps, 0.63 img/s. RAPID: 40 steps, 3.99 img/s — same target, 84% fewer steps."
summary: "Data-aware GMM prior + step-adaptive noise → 84% fewer sampling steps, 6.3× faster. No extra networks, no distillation."
badges:
  - { text: "Under review · Pattern Recognition", kind: review }
  - { text: "2× Best Paper Award", kind: award }
  - { text: "Outstanding Thesis nominee", kind: first }
featured: true
date: 2026-06-30
excerpt: "RAPID replaces the zero-information Gaussian prior of diffusion models with a data-aware, step-adaptive prior — 84% fewer sampling steps and 6.3× faster generation with no extra networks."
collection: portfolio
---

{% include project-header.html %}

## Objectives

<ul class="keys">
  <li><strong>Few-step generation</strong> for diffusion models — no architectural change, no distillation.</li>
  <li><strong>Adaptive prior</strong> — <em>data</em>-adaptive (structure of the target dataset) and <em>step</em>-adaptive (fades over the noise schedule).</li>
</ul>

## Motivation

<div class="duo">
  <div class="panel">
    <p class="panel__title">Problem</p>
    <ul>
      <li>Sampling is too slow.</li>
      <li>Model capacity is wasted in early time steps.</li>
    </ul>
  </div>
  <div class="panel">
    <p class="panel__title">Core cause</p>
    <ul>
      <li>The Gaussian prior carries <strong>zero information</strong>.</li>
      <li>→ structure learned from scratch → curved, entangled velocity trajectory → many sampling steps.</li>
    </ul>
  </div>
</div>

<div class="callout">
  <span class="callout__icon"><i class="fas fa-lightbulb" aria-hidden="true"></i></span>
  <p><strong>Gap.</strong> Prior work optimizes the <em>trajectory</em> (solvers, velocity, distillation) — not the inefficient <em>prior</em> that causes it. RAPID fixes the source.</p>
</div>

## Method

<div class="duo">
  <div class="panel">
    <p class="panel__title">Data-aware prior</p>
    <ul>
      <li>GMM (Gaussian mixture model) clustering of VAE latents → structural modes already in the dataset.</li>
      <li>Low-pass-filtered cluster mean → coarse layout only.</li>
      <li>Covariance normalization → diversity kept for diffusion's stochasticity.</li>
    </ul>
  </div>
  <div class="panel">
    <p class="panel__title">Step-adaptive noise</p>
    <ul>
      <li>Coarse-to-fine: the prior's role fades over time.</li>
      <li>SNR-aware (signal-to-noise ratio) blend ω(t) controls the decay.</li>
      <li>High ω(t) early = global structure · low ω(t) late = fine detail.</li>
    </ul>
  </div>
</div>

<figure class="fig fig--narrow">
  <img src="/images/rapid_architecture.png" alt="RAPID architecture: VAE encoder, GMM clustering with low-pass-filtered means and scaled covariances, step-adaptive noise schedule ω(t), flow-matching path, diffusion model and VAE decoder" loading="lazy">
  <figcaption>(a) Overall architecture · (b) data-aware prior · (c) step-adaptive noise schedule ω(t).</figcaption>
</figure>

## Results

<ul class="stats">
  <li class="stat"><span class="stat__num">5.40</span><span class="stat__label">FID at 40 NFE (lower is better)<br>ImageNet-1K, 50 epochs</span></li>
  <li class="stat"><span class="stat__num">84%</span><span class="stat__label">fewer NFEs (sampling steps)<br>than baseline</span></li>
  <li class="stat"><span class="stat__num">6.3×</span><span class="stat__label">faster<br>sampling</span></li>
  <li class="stat"><span class="stat__num">20–40</span><span class="stat__label">NFE range with<br>strong quality</span></li>
</ul>

<figure class="fig fig--wide">
  <img src="/images/rapid_quant.png" alt="FID and Precision versus NFE for RAPID and baselines" loading="lazy">
  <figcaption>FID (Fréchet Inception Distance, left) and Precision (right) vs. NFE (number of function evaluations = sampling steps). RAPID stays strong in the few-step region (shaded).</figcaption>
</figure>

<div class="fig-grid">
  <figure class="fig">
    <img src="/images/rapid_qual.jpg" alt="RAPID samples on ImageNet-1K" loading="lazy">
    <figcaption>ImageNet-1K samples.</figcaption>
  </figure>
  <figure class="fig">
    <img src="/images/rapid_lsun.jpg" alt="RAPID samples on LSUN-Church Outdoor" loading="lazy">
    <figcaption>LSUN-Church Outdoor samples — Adaptive Prior Diffusion (KMMS Spring 2026): Precision 0.730 at 40 steps vs. 0.640 for LDM-8 at 200 steps.</figcaption>
  </figure>
</div>

## Achievements

<ul class="keys">
  <li><span class="badge badge--review">Under review</span> Thesis work submitted to <em>Pattern Recognition</em>.</li>
  <li><span class="badge badge--award">Best Paper Award</span> <em>Adaptive Prior Diffusion: Dataset-Aware GMM Prior for High-Fidelity Image Generation</em> — KMMS Spring 2026 (first author).</li>
  <li><span class="badge badge--award">Best Paper Award</span> <em>An Optimized Diffusion Model Based on Adaptive Prior Distribution</em> — KMMS Autumn 2025 (first author).</li>
  <li><span class="badge badge--first">Thesis</span> Nominated for the Outstanding Thesis Award, Sookmyung Women's University.</li>
</ul>

<div class="btn-row btn-row--left">
  <a class="btn-pill" href="/files/rapid_slides.pdf"><i class="fas fa-file-pdf" aria-hidden="true"></i> Slides (PDF)</a>
  <a class="btn-pill" href="/publications/"><i class="fas fa-book" aria-hidden="true"></i> Publications</a>
</div>

<p class="muted">Full manuscript available upon request.</p>
