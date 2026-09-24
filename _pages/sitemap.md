---
layout: single
title: "Sitemap"
permalink: /sitemap/
author_profile: true
---

{% include base_path %}

<p class="muted">All pages on this site. An <a href="{{ base_path }}/sitemap.xml">XML version</a> is available for robots.</p>

## Pages

<ul class="keys keys--tight">
  <li><a href="{{ base_path }}/">Home</a></li>
  <li><a href="{{ base_path }}/portfolio/">Research</a></li>
  <li><a href="{{ base_path }}/publications/">Publications</a></li>
  <li><a href="{{ base_path }}/awards/">Awards &amp; Grants</a></li>
  <li><a href="{{ base_path }}/cv/">Curriculum Vitae</a></li>
</ul>

## Research Projects

<ul class="keys keys--tight">
{% assign projects = site.portfolio | sort: "number" %}
{% for p in projects %}
  <li><a href="{{ base_path }}{{ p.url }}">{{ p.number }} · {{ p.title }}</a></li>
{% endfor %}
</ul>

## Documents

<ul class="keys keys--tight">
  <li><a href="{{ base_path }}/files/cv.pdf">CV (PDF)</a></li>
  <li><a href="{{ base_path }}/files/full_portfolio.pdf">Portfolio (PDF)</a></li>
  <li><a href="{{ base_path }}/files/research_achievement.pdf">Research Achievements (PDF)</a></li>
</ul>
