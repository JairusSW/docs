---
layout: home

hero:
  name: Jairus' Docs
  text: Docs for all my projects
  tagline: One hub for fast JSON, testing, exceptions, and WebAssembly IPC.
  actions:
    - theme: brand
      text: Explore json-as
      link: /json-as/
    - theme: alt
      text: Browse as-test
      link: /as-test/
    - theme: alt
      text: Read my blog
      link: https://blog.jairus.dev/

features:
  - title: json-as
    details: High-performance JSON for AssemblyScript with transform-driven codegen, SWAR, SIMD, and typed runtime support.
    link: /json-as/
    linkText: Read the docs
  - title: as-test
    details: Runtime-aware AssemblyScript testing with snapshots, fuzzing, mocking, coverage, and multi-runtime workflows.
    link: /as-test/
    linkText: Read the docs
  - title: try-as
    details: Exception-style control flow for AssemblyScript with transform-backed try/catch ergonomics and explicit runtime tradeoffs.
    link: /try-as/
    linkText: Read the docs
  - title: as-labs
    details: Experimental AssemblyScript APIs and transforms, starting with WebAssembly branch hinting helpers and metadata emission.
    link: /as-labs/
    linkText: Read the docs
  - title: wipc
    details: Structured communication between hosts and WebAssembly guests with typed messages, framing, and low-overhead transport.
    link: /wipc/
    linkText: Read the docs
---
<!--
<div class="hub-section" id="projects">
  <div class="hub-section-head">
    <p class="hub-kicker">Projects</p>
    <h2>Pick a tool and get straight to the useful parts.</h2>
    <p>
      This hub is organized around real AssemblyScript workflows: serializing data, testing modules,
      modeling exceptions, and moving structured messages across a host boundary.
    </p>
  </div>

  <div class="hub-grid">
    <a class="hub-card" href="/json-as/">
      <span class="hub-card-label">json-as</span>
      <strong>Fast JSON for AssemblyScript</strong>
      <p>Guides for transform-backed parsing, custom serializers, built-in types, dynamic values, and performance.</p>
      <span class="hub-card-cta">Open json-as</span>
    </a>
    <a class="hub-card" href="/as-test/">
      <span class="hub-card-label">as-test</span>
      <strong>Testing across real runtimes</strong>
      <p>Assertions, snapshots, reporters, fuzzing, coverage, and test orchestration for AssemblyScript projects.</p>
      <span class="hub-card-cta">Open as-test</span>
    </a>
    <a class="hub-card" href="/try-as/">
      <span class="hub-card-label">try-as</span>
      <strong>Exception-style ergonomics</strong>
      <p>How the transform works, where it is useful, where it is expensive, and how to debug generated behavior.</p>
      <span class="hub-card-cta">Open try-as</span>
    </a>
    <a class="hub-card" href="/wipc/">
      <span class="hub-card-label">wipc</span>
      <strong>Host ↔ guest messaging</strong>
      <p>Wire format, API shape, architecture, and performance notes for structured WebAssembly IPC.</p>
      <span class="hub-card-cta">Open wipc</span>
    </a>
  </div>
</div>

<div class="hub-section hub-section-alt">
  <div class="hub-section-head">
    <p class="hub-kicker">What this site is for</p>
    <h2>Less README sprawl, more direct paths to answers.</h2>
  </div>

  <div class="hub-columns">
    <div>
      <h3>Guides first</h3>
      <p>Use the project sections when you want setup instructions, examples, or the shortest path to working code.</p>
    </div>
    <div>
      <h3>Reference when needed</h3>
      <p>Each section also keeps API-level details close to the guides so you do not need to jump between repos for basic questions.</p>
    </div>
    <div>
      <h3>Shared navigation</h3>
      <p>Switch between projects without losing context. The goal is one docs surface for the AssemblyScript tools that fit together.</p>
    </div>
  </div>
</div>-->

<div class="hub-section hub-footer-links">
  <a href="https://github.com/JairusSW/">Check out my GitHub</a>
</div>

<style>
.hub-section {
  margin: 3.5rem 0;
}

.hub-section-head {
  max-width: 46rem;
  margin-bottom: 1.5rem;
}

.hub-section-head h2 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.15;
}

.hub-section-head p {
  margin-top: 0.85rem;
  font-size: 1.05rem;
}

.hub-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.hub-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.hub-card {
  display: block;
  padding: 1.15rem 1.2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--vp-c-bg-soft) 55%, transparent), color-mix(in srgb, var(--vp-c-bg-alt) 92%, transparent));
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.hub-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 18px 40px -24px color-mix(in srgb, var(--vp-c-brand-1) 38%, transparent);
}

.hub-card strong {
  display: block;
  margin: 0.2rem 0 0.55rem;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.hub-card p {
  margin: 0;
  color: var(--vp-c-text-2);
}

.hub-card-label,
.hub-card-cta {
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hub-card-label {
  color: var(--vp-c-brand-1);
}

.hub-card-cta {
  margin-top: 0.9rem;
  color: var(--vp-c-text-1);
}

.hub-section-alt {
  padding: 1.6rem 1.4rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 22px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 38%, transparent);
}

.hub-columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.hub-columns h3 {
  margin-bottom: 0.45rem;
}

.hub-columns p {
  margin: 0;
}

.hub-footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.25rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

@media (max-width: 900px) {
  .hub-grid,
  .hub-columns {
    grid-template-columns: 1fr;
  }

  .hub-section-head h2 {
    font-size: 1.65rem;
  }
}
</style>
