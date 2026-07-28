---
title: "Jackbox: A 'budget' 84GB Inference Server"
date: "2026-05-13"
excerpt: "Building a local inference server in the DRAM Shortage"
tags: ["LLM", "Hardware", "bibo", "Local AI"]
featured: true
cover_image: "/og-jackbox.jpg"
---

Jackbox is a $1,700 local inference server I built to run large language models without cloud APIs or per-token pricing. It pairs an AMD Ryzen 5 7500X3D with an RTX 3080 20GB and a Tesla V100 32GB for 84GB of combined memory (52GB VRAM + 32GB RAM), and currently serves a 35B-parameter Qwen3.6 MoE model at 80-100 tokens/second with context windows up to 180K tokens — all for about $1.40/day in power.

The build prioritized VRAM per dollar over raw speed: a blower-cooled 3080 and a modded SXM2-to-PCIe V100, both picked up secondhand, paired with a motherboard that leaves room for a third GPU down the line. It runs Ubuntu 24.04 LTS headless, with llama.cpp splitting model layers across both GPUs by VRAM capacity.

![Front view of Jackbox](https://cdn.statically.io/gh/meng-jack/me-pictures-bucket@main/blog/server-build/img3.jpeg)

![Both GPUs laid out before assembly](https://cdn.statically.io/gh/meng-jack/me-pictures-bucket@main/blog/server-build/img1.jpg)

![Back panel with signatures](https://cdn.statically.io/gh/meng-jack/me-pictures-bucket@main/blog/server-build/img4.jpeg)

![Jackbox through tempered glass](https://cdn.statically.io/gh/meng-jack/me-pictures-bucket@main/blog/server-build/img2.jpg)
