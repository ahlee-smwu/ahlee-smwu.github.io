---
permalink: /
title: "Ahhyeon Lee"
layout: home
author_profile: false
excerpt: "Ahhyeon Lee — AI researcher in efficient diffusion generative models and multimodal empathy. M.S. in IT Engineering, Sookmyung Women's University. Ph.D. applicant for 2027."
redirect_from:
  - /about/
  - /about.html
---

<div class="hero">
  <img class="hero__photo" src="/images/profile.png" alt="Portrait of Ahhyeon Lee">
  <div class="hero__body">
    <p class="hero__kicker">이아현 · publishes as Ah-Hyeon Lee (A. H. Lee)</p>
    <h1 class="hero__name">Ahhyeon Lee</h1>
    <p class="hero__role">M.S. in IT Engineering · Sookmyung Women's University · <a href="http://ivpl.sm.ac.kr/">IVPL</a></p>
    <ul class="hashtags">
      <li># AI Scientist</li>
      <li># Efficient Vision Generative Model</li>
      <li># Multimodal Empathy Model</li>
    </ul>
    <div class="badges">
      <span class="badge badge--accent">Ph.D. applicant · 2027</span>
      <span class="badge badge--first">Nominated · Outstanding Thesis Award</span>
    </div>
    <div class="btn-row">
      <a class="btn-pill btn-pill--primary" href="/files/cv.pdf"><i class="fas fa-file-pdf" aria-hidden="true"></i> CV</a>
      <a class="btn-pill" href="/files/full_portfolio.pdf"><i class="fas fa-images" aria-hidden="true"></i> Portfolio</a>
      <a class="btn-pill" href="mailto:ah.lee@ivpl.sm.ac.kr"><i class="fas fa-envelope" aria-hidden="true"></i> Email</a>
      <a class="btn-pill" href="https://github.com/ahlee-smwu"><i class="fab fa-github" aria-hidden="true"></i> GitHub</a>
      <a class="btn-pill" href="https://www.linkedin.com/in/ahhyeon-lee-5b8a50397/"><i class="fab fa-linkedin" aria-hidden="true"></i> LinkedIn</a>
    </div>
  </div>
</div>

## At a Glance

<ul class="keys">
  <li>🎓 <strong>M.S. in IT Engineering</strong>, Sookmyung Women's University (Aug 2026) · GPA 4.15 / 4.3 · <strong>Nominated for Outstanding Thesis Award</strong></li>
  <li>🔬 <strong>Graduate Researcher</strong>, Intelligent Vision Processing Lab (<a href="http://ivpl.sm.ac.kr/">IVPL</a>) · Advisor: Prof. Byung-Gyu Kim</li>
  <li>🎯 <strong>Seeking Ph.D. positions</strong> starting 2027 — efficient generative models · multimodal affective AI</li>
</ul>

<ul class="stats">
  <li class="stat"><span class="stat__num">84%</span><span class="stat__label">fewer sampling steps<br>(RAPID)</span></li>
  <li class="stat"><span class="stat__num">6.3×</span><span class="stat__label">faster generation<br>(RAPID)</span></li>
  <li class="stat"><span class="stat__num">5</span><span class="stat__label">Best Paper Awards<br>(3 as first author)</span></li>
  <li class="stat"><span class="stat__num">2</span><span class="stat__label">grants as<br>Principal Investigator</span></li>
</ul>

## Research Interests

<ul class="keys">
  <li><strong>Efficient diffusion</strong> — data- &amp; step-adaptive priors → few-step sampling. No extra networks, no distillation.</li>
  <li><strong>Multimodal empathy</strong> — vision + audio + text cross-attention → listener responses grounded in the speaker's emotion.</li>
  <li><strong>Deployable AI</strong> — keep accuracy, cut compute: few-step diffusion · low-rank attention · GPU training infrastructure.</li>
</ul>

<ul class="chips">
  <li><span class="chip">Diffusion Models</span></li>
  <li><span class="chip">Flow Matching</span></li>
  <li><span class="chip">Few-Step Sampling</span></li>
  <li><span class="chip">Adaptive Priors</span></li>
  <li><span class="chip">Multimodal Fusion</span></li>
  <li><span class="chip">Affective Computing</span></li>
  <li><span class="chip">Efficient Attention</span></li>
  <li><span class="chip">GPU Infrastructure</span></li>
</ul>

## Featured Research

{% assign featured = site.portfolio | where: "featured", true | sort: "number" %}
<ul class="cards">
{% for p in featured %}{% include project-card.html project=p %}{% endfor %}
</ul>

<div class="btn-row btn-row--left">
  <a class="btn-pill" href="/portfolio/"><i class="fas fa-flask" aria-hidden="true"></i> All research projects</a>
</div>

## Selected Publications

{% include pub-list.html selected=true %}

<div class="btn-row btn-row--left">
  <a class="btn-pill" href="/publications/"><i class="fas fa-book" aria-hidden="true"></i> All publications</a>
</div>

## News

{% include news-list.html limit=6 %}

## Contact

<ul class="contact">
  <li><i class="fas fa-envelope" aria-hidden="true"></i><span><a href="mailto:ah.lee@ivpl.sm.ac.kr">ah.lee@ivpl.sm.ac.kr</a> · <a href="mailto:ahlee.sep@gmail.com">ahlee.sep@gmail.com</a></span></li>
  <li><i class="fas fa-phone" aria-hidden="true"></i><span>+82 10-9109-6271</span></li>
  <li><i class="fas fa-location-dot" aria-hidden="true"></i><span>IVPL, Sookmyung Women's University, Seoul, Republic of Korea</span></li>
  <li><i class="fab fa-github" aria-hidden="true"></i><span><a href="https://github.com/ahlee-smwu">github.com/ahlee-smwu</a></span></li>
  <li><i class="fab fa-linkedin" aria-hidden="true"></i><span><a href="https://www.linkedin.com/in/ahhyeon-lee-5b8a50397/">linkedin.com/in/ahhyeon-lee-5b8a50397</a></span></li>
</ul>

<div class="btn-row btn-row--left">
  <a class="btn-pill" href="/files/cv.pdf"><i class="fas fa-file-pdf" aria-hidden="true"></i> CV (PDF)</a>
  <a class="btn-pill" href="/files/full_portfolio.pdf"><i class="fas fa-file-pdf" aria-hidden="true"></i> Portfolio (PDF)</a>
  <a class="btn-pill" href="/files/research_achievement.pdf"><i class="fas fa-file-pdf" aria-hidden="true"></i> Research Achievements (PDF)</a>
</div>
