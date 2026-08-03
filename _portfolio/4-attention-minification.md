---
title: "Attention Module Minification by Low-Rank Factorization"
excerpt: "Low-rank factorization of Q/K/V projections cuts attention FLOPs to 14–25% of the baseline while slightly *improving* accuracy.<br/><img src='/images/attn_teaser.png' style='max-width: 350px; width: 100%;'>"
collection: portfolio
---

> **Status:** Published, KMMS Spring 2025 (first author, **Best Paper Award**).

## Research Objectives

- Low-rank factorization of the Q, K, V projection matrices in Transformer attention.
- Minimize FLOPs without accuracy loss.

## Motivation

Transformer attention scales as O(n²) in matmul and its parameter count grows quickly with model width, dominating FLOPs and memory in many architectures. Rather than pruning or distilling, I factorized the Q/K/V projections themselves into low-rank forms — a structural, deploy-friendly change.

## Method and Experimental Results

Each Q, K, V projection **W ∈ ℝ^(n×d)** is replaced by a product of two smaller matrices **W ≈ AB, A ∈ ℝ^(n×f), B ∈ ℝ^(f×d)** with **f ≪ min(n, d)**. Complexity drops from O(nd) to O(nf + fd), and the same rank *f* is used for every attention head to keep the implementation clean.

- Attention FLOPs reduced to **14–25%** of the baseline.
- **92.2–94.2%** parameter savings versus BERT.
- Accuracy **+0.004–0.008** over the baseline — performance *slightly improved*, not merely preserved.

<p style="text-align: center;">
  <img src="/images/attn_teaser.png" alt="Low-rank factorization method and results" style="max-width: 900px; width: 100%;">
</p>

## Achievements

- **Best Paper Award**, KMMS Spring 2025 (first author).
