---
title: "RAPID: Robust Adaptive Prior Integration for Diffusion"
excerpt: "Data- and step-adaptive priors for few-step diffusion. **84% fewer sampling steps, 6.3× faster generation** — no extra networks, no distillation.<br/><img src='/images/rapid_teaser.png' style='max-width: 500px; width: 100%;'>"
collection: portfolio
---

> **Status:** Manuscript in preparation, to be submitted to *Pattern Recognition* (2026).  
> **Full manuscript available upon request.**  
> **Preceding studies:** Best Paper Award, KMMS Autumn 2025 & KMMS Spring 2026 (first author).

## Research Objectives

- Few-step generation for diffusion models without architectural changes or distillation.
- A prior distribution that is jointly **data-adaptive** (structure of the target dataset) and **step-adaptive** (fades over the noise schedule).

## Motivation

Diffusion models must traverse the full trajectory from a *zero-information* Gaussian prior to the complex data distribution, which forces many sampling steps and wastes model capacity in the early stages. Existing few-step methods optimize the **trajectory** (velocity, ODE solvers, distillation) but leave the **inefficient prior** — the true root cause — untouched.

<p style="text-align: center;">
  <img src="/images/rapid_teaser.png" alt="RAPID vs Naive Diffusion" style="max-width: 700px; width: 100%;">
</p>

## Method

**Data-Aware Prior.** I fit a GMM in the VAE latent space and treat each cluster as a structural mode of the target dataset. The centroid is low-pass filtered so it carries only the *coarse layout*, and the per-cluster covariance is normalized so that diffusion's stochastic dynamics survive centroid averaging.

**Step-Adaptive Noise.** An SNR-aware blending weight ω(t) mixes the GMM prior with the standard Gaussian noise. Early steps rely on the informative prior for global structure; late steps hand control back to the standard diffusion dynamics for fine-grained texture. This yields a geometrically straighter noise-to-data path and a lower-complexity velocity field.

<p style="text-align: center;">
  <img src="/images/rapid_architecture.png" alt="RAPID architecture" style="max-width: 600px; width: 100%;">
</p>

## Experimental Results

- **40 NFE, FID 5.40** on ImageNet-1K (LDM-8 backbone, 50-epoch training)
- **84% fewer sampling steps** and **6.3× faster generation** than the baseline
- Strong Precision preserved down to 20 NFE — surpassing SOTA LDM-8 at 200 NFE

<p style="text-align: center;">
  <img src="/images/rapid_results1.png" alt="RAPID qualitative results on ImageNet-1K" style="max-width: 700px; width: 100%;">
</p>
<p style="text-align: center;">
  <img src="/images/rapid_results2.png" alt="RAPID qualitative results on LSUN-Church Outdoor" style="max-width: 700px; width: 100%;">
</p>
<p style="text-align: center;">
  <img src="/images/rapid_results3.png" alt="RAPID qualitative results on FFHQ" style="max-width: 700px; width: 100%;">
</p>

## Achievements

- *Adaptive Prior Diffusion: Dataset-Aware GMM Prior for High-Fidelity Image Generation.* Best Paper Award, KMMS Spring 2026.
- *An Optimized Diffusion Model Based on Adaptive Prior Distribution.* Best Paper Award, KMMS Autumn 2025.
- Full manuscript in preparation for submission to *Pattern Recognition*.

📊 [View slides (PDF)](/files/rapid_slides.pdf)
