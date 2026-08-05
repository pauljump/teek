# Teek

**How to build a model of someone's mind from their public writing, and prove it works.**

Start here: **[How To Build A Model Of Someone's Mind, And Prove It Works](docs/how-to-build-a-mind-model.md)**

---

## The short version

Anyone can write "act like Warren Buffett" into a prompt box and get something Buffett-flavored back. It will feel right. Feeling right is worthless.

In 1949, Bertram Forer handed students personality assessments they rated 4.26 out of 5 for accuracy. Every student got the identical text, copied from an astrology column. Every persona prompt has this problem: it sounds like the person because it sounds like almost anyone, and the reader supplies the specificity.

Teek is a method for doing it so that it can be wrong, and then checking.

```
Cut the corpus at a date.
Build the profile using only what came before.
Make it predict specific decisions from after.
Check. Publish the score, including when it is bad.
```

## What is actually in here

| | |
|---|---|
| [`docs/how-to-build-a-mind-model.md`](docs/how-to-build-a-mind-model.md) | The teaching document. Read this first. |
| [`docs/method.md`](docs/method.md) | What Teek codes, and the four methods it deliberately refuses to use. |
| [`docs/evaluation.md`](docs/evaluation.md) | The before/predict/after protocol, and the blind-coding delta. |
| [`docs/ethics.md`](docs/ethics.md) | Public figures only, every claim cited, no clinical language. |
| [`docs/research/`](docs/research/) | The two AI-generated research dossiers this is built on, with citations. |

Working profiles (29, built from 1,015 sourced corpus documents) are not in this repo yet. Most have not been coded to the evidence bar the method requires; they ship once they clear it, not before.

## The two ideas worth stealing

**1. Refusals are the architecture.** Teek implements four coding schemes from the at-a-distance assessment literature and refuses four others, each with a stated reason. It will not report Big Five traits, because a meta-analysis across 85,724 people found linguistic methods explain 5.1% of the variance in self-reported personality. It will not implement Leadership Trait Analysis, because that method's scores are only meaningful against proprietary norming distributions. Subtracting capabilities on principle is the part that requires having understood the material.

**2. The blind-coding delta.** When a model codes a passage by a famous person, it may be reading the text or it may be retrieving what it absorbed about that person during training. Both produce identical-looking output. So: code every passage twice, once with the speaker named and once with all identifiers stripped, and measure the gap. Small gap means it is reading. Large gap means it is reciting a stereotype and the profile is circular.

As far as the landscape research found, nobody else measures this. It generalizes past this project: any time you ask an AI to analyze something it has strong prior opinions about, you can mask the identifiers and check whether the analysis survives.

## Honest disclosure

The author has no training in psychology or psychometrics. The research behind this method was performed by an AI, the method was designed with an AI, and the coding is done by an AI. That is stated at the top of every document rather than buried, because the alternative is implying an expertise that is not there.

The dossier in [`docs/research/`](docs/research/) is the raw material, with sources. Read it before trusting anything here.

## Status

Early. The documents are ahead of the code: the method is specified and the corpus is in place. The coding pipeline (the four coding schemes) and the blind-coding delta harness are next.

## Not for

Speaking as a real person in public. Diagnosing anyone. Building a product on the simulated judgment of someone who has not agreed to it. See [`docs/ethics.md`](docs/ethics.md).

MIT licensed.
