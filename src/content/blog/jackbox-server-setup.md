---
title: "Jackbox: A $1,700 Local LLM Inference Server"
date: "2026-05-13"
excerpt: "Building a cheap 52GB VRAM dual-GPU inference server/"
tags: ["LLM", "Hardware", "bibo", "Local AI"]
featured: true
---

I built Jackbox to run large language models locally. No cloud APIs, no per-token pricing. Just raw compute in my apartment.

$1,700 total. 84GB of combined memory (52GB VRAM + 32GB RAM) in this hell of a time to build a PC. 

![Front view of Jackbox](https://cdn.statically.io/gh/meng-jack/me-pictures-bucket@main/blog/server-build/img3.jpeg)

## What It Runs

Jackbox currently serves **Qwen3.6-35B-A3B**, a 35 billion parameter MoE model quantized to Q8_K_XL via llama.cpp. With 52GB of combined VRAM (20GB RTX 3080 + 32GB V100) and 32GB of system RAM available for overflow layers and KV cache:

- **Generation speed:** ~80–100 tokens/second at batch size 8192
- **Context window:** up to 180K tokens with q8_0 KV cache quantization
- **Layer split:** roughly 60% on GPU 0 (RTX 3080), 40% on GPU 1 (V100)
- **Biggest bottleneck:** prompt processing / prefill speed. Generation itself is fast once the context is loaded

Here's the exact startup command:

```
sudo sysctl -w vm.nr_hugepages=4096

llama-server \
    -m ~/Models/Qwen3.6-35B-A3B-UD-Q8_K_XL.gguf \
    --port 6969 --host 0.0.0.0 \
    -ngl 80 \
    --ctx-size 180224 \
    --split-mode layer \
    --main-gpu 0 \
    --tensor-split "60,40" \
    --mmap \
    --numa distribute \
    --cache-type-k q8_0 \
    --cache-type-v q8_0 \
    -ub 8192 \
    -b 8192\
    --temp 0.6 \
    --top-p 0.95 \
    --top-k 20 \
    --min-p 0.0 \
    --repeat-penalty 1.0 
```

Huge pages (`vm.nr_hugepages=4096`) reduce TLB misses during inference. The `tensor-split` distributes model layers across both GPUs proportionally to their VRAM capacity.

## Design Constraints

Before buying anything, I set some ground rules:

**Inference only.** This machine doesn't train models. Training needs stability guarantees and ECC memory that would have doubled the budget for marginal benefit in my use case.

**Maximize VRAM per dollar.** The single most important metric. More VRAM means bigger models and larger context windows. CPU speed, RAM bandwidth, storage IOPS — none of that matters as much as VRAM.

**Leave room to grow.** Whatever platform I chose needed at least one empty slot for a future GPU upgrade without rebuilding from scratch.

## The Build

> **Total cost:** ~$1,700 (excluding shipping and taxes)
>
> **Power draw at full load:** ~$1.40/day on Pepco

### CPU

**AMD Ryzen 5 7500X3D** · $299 ([Microcenter bundle](https://www.microcenter.com/product/5007290/amd-ryzen-5-7500x3d,-msi-b850m-vc-pro-wifi-am5,-gskill-flare-x5-series-16gb-ddr5-6000,-computer-build-bundle))

65W TDP · 6 cores / 12 threads · 96MB L3 cache

For pure inference workloads the CPU barely matters unless you're offloading layers to system RAM, which you shouldn't be doing if you planned your VRAM budget correctly. I picked this chip because Microcenter bundles it with a motherboard at a steep discount, and the massive L3 cache helps compensate for the single-channel RAM configuration that comes with the bundle.

The integrated GPU turned out to be genuinely useful: when both discrete GPUs are in headless compute mode, having an iGPU makes physical debugging much less painful.

### RAM

**2x 16GB G.Skill Flare X5 DDR5-6000** · $169 each

One stick came with the CPU bundle; bought the second separately. On AM5 platforms you want exactly two sticks in slots A2+B2. Populating all four tanks your memory clock speeds significantly.

### GPU 1: RTX 3080 (20GB)

**NVIDIA RTX 3080 20GB GDDR6X** · $599 ([eBay](https://ebay.us/m/3dkNgJ))

320W TDP with transient spikes up to **450–500W**

Chinese-market blower card pulled from a server chassis and resold on eBay. Blower cards are louder and run hotter than open-air designs, but they exhaust heat out the back of the case instead of recirculating it inside. Critical when you're stacking multiple GPUs inches apart.

Ampere generation means solid software support across every inference framework worth using today.

> **NOTE:** The RTX 3080's backplate where the extra memory chips are soldered gets extremely hot.

### GPU 2: Tesla V100 (32GB)

**NVIDIA Tesla V100 SXM2+PCIe 32GB HBM2** · $750 ([eBay](https://ebay.us/m/WXVkux))

300W TDP

I originally ordered two of these. Both shipped from China. One made it through customs. The other did not. Luckily, eBay's MoneyBack gurantee got me my money back.

This one is a custom mod where someone took an SXM2 server module and mounted it onto a PCIe board with a blower cooler. Volta architecture from 2017 means it misses some newer software features like FlashAttention-2, but at **~$23/GB of VRAM** it's the cheapest high-bandwidth memory you can get your hands on.

The HBM2 memory bandwidth actually beats some modern RTX cards in raw throughput. For batched inference workloads that are memory-bandwidth-bound rather than compute-bound, this card punches well above its price point.

![Both GPUs laid out before assembly](https://cdn.statically.io/gh/meng-jack/me-pictures-bucket@main/blog/server-build/img1.jpg)

> Note: Even though this is a blower card, the custom modded cooling doesn't seem to expose fan controls.

### Motherboard

**MSI B850 Gaming Plus** · $150 ([Amazon](https://www.amazon.com/B850-Gaming-Plus-V1-Motherboard/dp/B0FBT9DYSB))

Can fit three 2U GPUs, which leaves room for one more. Slower PCIe lanes (x4, x1) don't meaningfully hurt inference performance once the model is loaded into VRAM: the bottleneck is memory bandwidth, not bus speed.

### Storage

1. 2x 1TB NVME SSDs (Already had)
2. 1x 4TB HDD $65

### Power Supply

**Montech Century II 1200W 80+ Gold** · $120 ([Amazon](https://www.amazon.com/MONTECH-Century-II-High-End-Cybenetics/dp/B0F3XV451X?s=electronics))

Fully modular. Enough headroom for the current setup plus one more GPU. A few rules I follow with PSUs: keep total system draw under 60% of rated wattage to handle transient spikes from consumer RTX cards, never mix cables between different PSUs (they're not standardized across brands), and if you need more wattage than a single unit can provide, use multiple lower-wattage PSUs with a [splitter](https://www.amazon.com/Qaoquda-Power-Supply-Adapter-Motherboard/dp/B08XP78NCR?s=electronics) rather than daisy-chaining.

### Case

**Corsair 5000D RS** · $100–120 ([Amazon](https://www.amazon.com/CORSAIR-Frame-Modular-Airflow-Mid-Tower/dp/B0F3XMTVLV?s=electronics))

Five preinstalled 140mm fans, eight expansion slots, fits E-ATX. Massive upgrade from the old Q300L. That thing was genuinely a fire hazard with two GPUs crammed inside.

> There were also several other fans I had used from my old case for more positive pressure within the case.

### Software

Ubuntu 24.04 LTS Server, headless. 

![Jackbox through tempered glass](https://cdn.statically.io/gh/meng-jack/me-pictures-bucket@main/blog/server-build/img2.jpg)

## What's Next

There's room for one more GPU. Here's what I'm looking at, ordered by how likely I am to actually pull the trigger:

1. **RTX 5000 Blackwell 48GB** ($4-5k): most modern professional option with full software support
2. **RTX 4090 48GB Mod** (~$4.5k): best $/GB sweet spot, but 450W TDP means I'd need to upgrade to a 1500W+ PSU
3. **Quadro RTX 8000 48GB** ($2-3.5k): cheapest path to 48GB but Turing is getting old
4. **Tesla A100 SXM4 80GB** ($6-7k): technically best $/GB of VRAM, but requires custom mounting and cooling
5. **RTX 6000 Blackwell 96GB** ($8.8-10k): the dream card, probably not happening anytime soon

When I do add that third GPU, the PSU will need an upgrade too. Top contenders are the [Seasonic PRIME PX-1600](https://www.amazon.com/Seasonic-PX-1600-Platinum-Warranty-SSR-1600PD2/dp/B0C57132H5) ($410, backed by a ridiculous 12-year warranty) or the [Noctua Edition TX-1600](https://www.amazon.com/Seasonic-TX-1600-Noctua-Ultra-Quiet-Efficiency/dp/B0DMW5F3GG/) ($660) if silence becomes a priority.

## Lessons Learned

Some things I'd tell my past self before starting this build:

- **Blower cards over open-air.** For multi-GPU density it's not even close.
- **Don't cheap out on the power supply.** Consumer RTX cards have transient spikes that can trip OCP on underspecced units.
- **Two RAM sticks max on AM5.** Populating all four slots drops your memory clock significantly.
- **The Q300L is too small for two GPUs.** It was genuinely a fire hazard and I should have upgraded the case first.

### Previous Parts (Retired)

- Cooler Master Q300L case ($34) - Way too small for dual GPUs
- Rosewill Gold PSU 70$ - Not enough wattage overhead for 2 GPUs
