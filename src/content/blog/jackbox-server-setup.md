---
title: "Building the Server That Powers bibo"
date: "2026-05-13"
excerpt: "A deep dive into the hardware setup, cost analysis, and design decisions behind my local LLM inference server — the machine that powers bibo."
tags: ["LLM", "Hardware", "bibo", "Local AI"]
featured: true
---

This is the machine that runs bibo. I built it to do local LLM inference without touching any cloud APIs. Here's the full parts list, the reasoning behind each choice, and what I'd do differently.

## Quick Notes

Some general things I learned while putting this together:

### CPU

CPU barely matters for inference unless you're offloading layers to system RAM. X3D chips are good enough for single channel memory setups.

### GPUs

Blower cards are better than open-air for density. They run louder and hotter but you can stack more of them. Consumer RTX cards have big transient power spikes so leave headroom in your PSU budget.

### Motherboard

Slower PCIe lanes (x4, x1) don't really hurt inference performance once the model is loaded. On AM5, only use two RAM slots (A2+B2). Populating all four tanks your memory speed.

### Power supply

Do not cheap out on this. Keep total system draw under 60% of the rated wattage. Get fully modular. Never mix cables between different PSUs. You can use multiple lower wattage PSUs with a splitter if needed, but never plug a component with cables from different PSUs. Gold, Platinum, Titanium are efficiency ratings. Stick with Gold or better.

---

## Current Build

This setup is for inference only, not training. The only metric I optimized for was effective GB of VRAM per dollar.

**Raw cost:** ~$1,700 (not counting shipping, customs, taxes)

**Power at full load:** ~$1.40/day on Pepco

### CPU: AMD Ryzen 5 7500X3D

$299 as part of a Microcenter bundle. 65W TDP, 6 cores, 12 threads, 96MB L3 cache. The bundle comes with single channel RAM but the huge L3 cache on X3D chips makes up for it. The iGPU is useful for debugging when all the discrete GPUs are in headless compute mode.

### RAM: 2x 16GB G.Skill Flare X5 DDR5-6000

$169 each. One came with the CPU bundle, the other bought separately. RAM prices are awful right now.

### GPU 1: NVIDIA RTX 3080 20GB GDDR6X

$599 from eBay, shipped from China. 2U blower card, 320W TDP with transient spikes up to 450-500W. Ampere generation. Solid card for mid-size models.

### GPU 2: NVIDIA Tesla V100 SXM2+PCIe 32GB HBM2

$750 from eBay, also from China. This one's interesting. It's a custom mod where someone took an SXM2 server module and put it on a PCIe board with a blower cooler. Volta architecture from 2017 so it misses some newer software features, but at ~$23/GB of VRAM it's the cheapest high-bandwidth memory you can get. The HBM2 bandwidth actually beats some modern RTX cards.

### Motherboard: MSI B850 Gaming Plus

$150 from Amazon. Can fit three 2U GPUs which leaves room for one more.

### Storage

Two 1TB NVMe SSDs I already had, plus a used 4TB enterprise HDD for ~$65.

### Power Supply: Montech Century II 1200W 80+ Gold

$120, fully modular. Enough headroom for the current setup plus one more GPU.

### Case: Corsair 5000D RS

$100-120. Five preinstalled 140mm fans, eight expansion slots, fits E-ATX. Massive upgrade from the old Q300L.

### Software

Ubuntu 24.04 LTS Server, headless.

---

## Future Upgrades

There's room for one more GPU. Here's what I'm looking at, ordered by how likely I am to actually buy one:

1. **RTX 5000 Blackwell 48GB** ($4-5k) - most modern professional option
2. **RTX 4090 48GB Mod** (~$4.5k) - best $/GB sweet spot, but 450W TDP means I'd need 1500W+ total
3. **Quadro RTX 8000 48GB** ($2-3.5k) - cheapest way to 48GB but Turing is old
4. **Tesla A100 80GB** ($6-7k) - needs custom SXM4 mounting and cooling, technically best $/GB
5. **RTX 6000 Blackwell 96GB** ($8.8-10k) - the dream

For the PSU, I'd go with a Seasonic PRIME PX-1600 ($410, 12 year warranty) or the Noctua Edition TX-1600 ($660) if I want to go all in on silence.

---

## Previous Parts

- **Case:** Cooler Master Q300L ($34). Way too small. Genuinely a fire hazard with two GPUs in it.
- **PSU:** Rosewill 750W 80+ Gold ($70). Fine for one GPU, not enough for two with transient spikes.
