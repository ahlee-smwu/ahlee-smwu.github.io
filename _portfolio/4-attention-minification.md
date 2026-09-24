---
title: "Attention Module Minification by Low-rank Factorization"
short_title: "Transformer Attention Minification"
number: "04"
category: "Personal Research"
topic: "Transformer Attention Minification"
period: "2024.09 – 2025.05"
teaser: /images/attn_method.png
teaser_caption: "Each Q/K/V projection (n×d) becomes two thin matrices (n×f, f×d) with f ≪ min(n, d)."
summary: "Low-rank Q/K/V projections cut attention cost to 14–25% of the baseline — with accuracy slightly up."
badges:
  - { text: "Best Paper Award · KMMS Spring 2025", kind: award }
  - { text: "First author", kind: first }
featured: false
excerpt: "Low-rank factorization of the Q, K, V projection matrices in Transformer attention — 14–25% of baseline cost, 92.2–94.2% fewer parameters than BERT, and slightly higher accuracy. Best Paper Award, KMMS Spring 2025."
collection: portfolio
---

{% include project-header.html %}

## Objectives

<ul class="keys">
  <li><strong>Low-rank factorization</strong> of the Q, K, V projection matrices.</li>
  <li><strong>Fewer FLOPs</strong>, no accuracy loss.</li>
</ul>

## Motivation

<div class="duo">
  <div class="panel">
    <p class="panel__title">Problem</p>
    <ul>
      <li>Massive parameters and O(n²) matmul complexity.</li>
      <li>High computational overhead in Transformers.</li>
    </ul>
  </div>
  <div class="panel">
    <p class="panel__title">Idea</p>
    <ul>
      <li>Structural efficiency instead of pruning or distillation.</li>
      <li>Keep performance with fewer calculations.</li>
    </ul>
  </div>
</div>

## Method

<ul class="keys">
  <li><strong>W ≈ A · B</strong> — W ∈ ℝ<sup>n×d</sup>, A ∈ ℝ<sup>n×f</sup>, B ∈ ℝ<sup>f×d</sup>, f ≪ min(n, d).</li>
  <li><strong>Complexity</strong> — n·d → n·f + f·d.</li>
  <li>Same rank <em>f</em> for every attention head — a clean, deploy-friendly change.</li>
</ul>

## Results

<ul class="stats">
  <li class="stat"><span class="stat__num">14–25%</span><span class="stat__label">attention cost<br>vs. baseline</span></li>
  <li class="stat"><span class="stat__num">92–94%</span><span class="stat__label">parameter savings<br>vs. BERT</span></li>
  <li class="stat"><span class="stat__num stat__num--sm">+0.004 – 0.008</span><span class="stat__label">accuracy<br>over baseline</span></li>
</ul>

<ul class="keys">
  <li>Performance <strong>slightly improved</strong>, not merely preserved.</li>
</ul>

## Achievements

<ul class="keys">
  <li><span class="badge badge--award">Best Paper</span> KMMS Spring 2025 (first author).</li>
</ul>
