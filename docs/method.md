# Method

What Teek measures, how, and what it refuses to claim.

> **Disclosure.** Paul Jump has no training in psychology or psychometrics. The research behind this document was performed by an AI research agent, the method was designed with an AI, and the coding is performed by an AI. That is disclosed at the top rather than buried, because the alternative is implying an expertise that is not there. The source dossier is `docs/research/2026-08-04-at-a-distance-assessment.md`, with citations. Every methodological claim below should be checked against it.

## The Tradition Teek Belongs To

Teek is not a new idea. Building decision profiles of real people from their public verbal output, without ever meeting them, is a documented practice with about sixty years of literature behind it. It is called **at-a-distance assessment**, and it has been used operationally: Jerrold Post ran the CIA's profiling unit for 21 years and produced the Begin and Sadat profiles that briefed Carter before Camp David.

That tradition matters here for one reason. It supplies **published coding manuals with reported inter-rater reliability**. A method with a manual and a reliability figure can be implemented, audited, and argued with. A persona prompt cannot.

The literature also supplies the field's own best criticisms of itself, which are more useful than its claims. They are in the Limits section, and they are not softened.

## What Teek Implements

Four coding schemes, chosen for mechanical specificity and for having a public manual to anchor against. Each produces a score, a trajectory over time, and a set of cited text spans.

### 1. Operational code, VICS-style verb coding

**Source:** Leites to George to Walker, Schafer & Young's Verbs In Context System.

**What it measures:** the subject's working beliefs about how their world operates and how to act in it. Is the competitive environment fundamentally cooperative or hostile? How much control do you have over outcomes? What role does chance play? Which tactics do you reach for?

**How it codes:** extract every clause where the subject is the acting party, reduce to subject-verb-object, then classify each verb on two axes, direction (cooperative or conflictual) and intensity (1 to 3). Aggregate into a P-index (direction of own tactics) and I-index (intensity). Do the same for verbs the subject attributes to others, which yields the belief about whether the environment is friendly.

**Why this one first:** it is the most mechanically specified method available. It reduces to clause extraction plus verb classification, which is close to what a language model already does well. It also has the single best answer to the obvious objection about public material: Renshon (2009) compared operational codes derived from public speeches against codes derived from declassified private material for the same leaders and found they converge.

**What it does not do:** predict decisions. Practitioners in the field concede this directly. Teek reports it as a belief-system snapshot, not a forecast.

### 2. Integrative complexity

**Source:** Suedfeld & Tetlock; the Baker-Brown et al. 1992 scoring manual.

**What it measures:** not what someone thinks but how many dimensions they hold at once and whether they integrate them. Scored 1 to 7 per paragraph. A 1 sees one correct answer. A 3 acknowledges legitimate competing perspectives without reconciling them. A 5 reconciles them under an explicit higher-order principle. A 7 operates on the reconciliation itself.

**Why it is in:** the highest reported inter-coder reliability of any method surveyed, frequently above .80, and there is already a validated automated implementation (AutoIC, Conway et al. 2020) to benchmark against. It also produces the most interesting artifact in the system: **complexity trajectory**. How a person's reasoning complexity moves over years, and how it differs by topic, is hard to fake and genuinely revealing.

**The trap:** models conflate elaborate vocabulary with integrative complexity. A dense paragraph can be dogmatic (IC-1) and a plain one can be genuinely integrative (IC-5). The anchoring examples exist specifically to break this confusion, and the scorer is tested against paragraphs chosen to be syntactically complex but structurally simple.

### 3. Values tradeoff detection

**Source:** Moral Foundations Theory and the extended Moral Foundations Dictionary (eMFD), plus an extension that the published methods cannot do.

**What it measures:** which value wins when two the subject holds come into direct conflict.

**How it codes:** two layers. The dictionary layer scores moral-foundation emphasis (care, fairness, loyalty, authority, sanctity) using eMFD, which was built from crowd-sourced annotation rather than researcher intuition and has documented construct validity. The second layer is the one that matters: **scan the corpus for moments where the subject explicitly describes a conflict between two goods and resolves it**, then record which pole won and cite the passage.

**Why this is the most valuable layer:** dictionary counting cannot distinguish "talks about fairness constantly because that is the news cycle" from "sacrifices growth for fairness when forced to choose." The second is what anyone actually wants to know, and finding argumentative structure across a large corpus is a genuine language-model strength. This is the one place where the pipeline can **exceed** the published baseline method rather than approximate it.

### 4. Motive imagery, descriptive only

**Source:** David Winter's running-text adaptation of TAT scoring.

**What it measures:** density of power, achievement, and affiliation imagery per 1,000 words.

**The explicit carve-out:** Winter's headline claim, that leader power motivation predicts subsequent war involvement, is credibly contested. A published critique argues the crisis case-matching pairs cases from the same conflict at different phases and codes as "peacefully resolved" episodes (Munich 1938, the Compromise of 1850) that history regards as failures. **Teek implements the coding and refuses the downstream predictive claim**, and says so in the output rather than in a footnote.

## What Teek Deliberately Does Not Implement

Refusals are load-bearing. Each of these was available, is respectable in the literature, and was left out for a stated reason.

**Leadership Trait Analysis (Hermann's seven traits).** Not because the traits are uninteresting, but because LTA scores are *inherently relative*: a trait is reported as high or low against a published norming group. Those norming distributions are proprietary and not obtainable. Implementing LTA without them means inventing a norm group and quietly breaking the comparability that makes the method useful. Teek would be borrowing Hermann's validated reputation while not running her method.

**Big Five or HEXACO scores from text.** The 2023 meta-analysis (31 samples, n=85,724) found LIWC categories explain **5.1% of variance** in self-reported personality. Against observer-reported personality it reaches 38.5%, better but still not diagnostic. Publishing a "Big Five profile" of a named person off a corpus overstates what the literature supports by a wide margin. This is the single most common thing AI persona products do, and the number above is why Teek does not do it.

**Repertory grid as George Kelly specified it.** Kelly's method is a live interview: you present elements in triads and the subject supplies the distinguishing dimension. The elicitation *is* the validity mechanism, because it guarantees the constructs are the subject's rather than the analyst's projection. There is no published corpus-only equivalent. Teek does mine the corpus for explicit contrasts ("X, unlike Y, actually...") because that is genuinely useful, but it is labeled **construct mining, adapted from PCT**, and carries none of the repertory grid's validity claims.

**Psychobiography as a module.** It is a genre and a discipline, not a coding scheme. Its lesson, the difference between Post's source triangulation and Langer's reliance on secondhand rumor, is absorbed into the citation requirements everywhere rather than built as a feature.

## The Three Requirements That Make It Real

Any of these missing and Teek is an uncalibrated approximation wearing the literature's credibility.

### Requirement 1: Anchoring

Every scheme above earned its reliability figures through **example-anchored coding against a public manual**. A prompt that says "assess the integrative complexity of this paragraph" is not implementing Suedfeld & Tetlock. It is asking a model what it thinks that phrase means, and none of the published validity transfers.

Every Teek coder is built with few-shot examples drawn from the actual published manual, and its prompts live in version control next to the manual excerpts they were anchored on. Changing an anchor set invalidates prior coding runs and forces a re-score. This is treated like changing a measuring instrument, because it is.

### Requirement 2: Span citation

Every coded judgment cites the exact span of text that produced it. Not the document. The span.

This is the mechanism that makes stereotype-matching visible. A model that scored a passage "high power motive" because it already knows the person is described that way cannot produce the span, because the span does not support it. **A judgment without a span is not low-confidence, it is unsupported by construction, and it is dropped.**

### Requirement 3: The blind-coding delta

This is the most important measurement in the system and, as far as the landscape research found, nobody else in the category runs anything like it.

The specific failure mode when coding a famous person is that the model has read enormous amounts of commentary and caricature about them during training. Asked to code a passage, it may pattern-match its stored impression of the person rather than read the text in front of it. Every score would look plausible. Many would be circular.

The test: **code the same passages twice, once with the speaker identified and once with all identifying details masked, then measure the gap.**

- A small delta means the coder is reading the text.
- A large delta means the coder is retrieving a stereotype, and the scores are contaminated.

The delta is computed per person, per scheme, and published in the profile as a first-class number. A profile with a high blind-coding delta is not shipped, it is flagged. Famous subjects should be expected to have larger deltas than obscure ones, and that expectation is itself testable.

This single measurement does more to distinguish Teek from a persona prompt than everything else in this document.

## Source Typing Is Not Optional

Hermann built the spontaneous-versus-prepared distinction into her coding rules in the 1980s for a reason: staff and speechwriters contaminate prepared text. Ghostwritten books and staff-run social accounts make this worse now, not better.

Every corpus document carries a `source_type`, and it is a required field:

| Type | Example | Coding weight |
|---|---|---|
| `spontaneous` | Live interview answer, unscripted Q&A, podcast | Highest. Closest to the subject's own cognition |
| `authored` | Personal blog, essay, signed letter | High, if authorship is credible |
| `prepared` | Keynote, scripted talk, shareholder letter | Reduced. Likely staff involvement |
| `ghostwritten_suspected` | Trade book, corporate comms | Excluded from trait coding; usable for stated positions |
| `secondhand` | Journalist's characterization, third-party profile | Never used for trait coding. Attributed claims only |

Coding runs record which source types they included. A trait score computed over ghostwritten material is not a trait score.

## What Teek Reports About Itself

Every profile carries these numbers, alongside its content:

- **Blind-coding delta** per scheme. The stereotype-contamination measure.
- **Corpus window.** The date range coded, which is what makes held-out evaluation possible.
- **Source-type mix.** What fraction was spontaneous versus prepared.
- **Span coverage.** What fraction of claims carry a citable span. Anything below 100% is a defect.
- **Discrimination.** For each claim, would it be false of a comparison set of similar figures? A claim true of everyone in the cohort is a Barnum statement and carries no information, however accurate it sounds.
- **Held-out score.** See `docs/evaluation.md`.

## Limits, Stated Plainly

**These methods are mostly descriptive, not predictive.** Only integrative complexity has a well-documented specific predictive claim, and its own originator published a self-critique about topic-difficulty confounds. Operational code practitioners concede it adds little to predicting consequential decisions. Anyone claiming a validated forecasting instrument here is overselling, and Teek's own predictive claims rest on its evaluation harness, not on borrowed authority from these methods.

**The corpus is biased by construction.** What survives and gets digitized is formal, public, and filtered. The private, spontaneous, and unflattering material is systematically missing. No coding scheme repairs this.

**LLM coders inherit construct ambiguity.** Where human coders disagree, models disagree with humans by about as much. A model is not a fix for a fuzzy construct.

**Effect sizes inflate.** Replication work found LLM agents reproduce the direction of published findings often but at effect sizes two to three times larger than the human studies. Expect Teek's scores to be more extreme than reality and calibrate accordingly.

**Barnum risk is permanent.** Forer showed people rate a generic horoscope as highly accurate about themselves personally. A profile that sounds right is weak evidence. This is why discrimination is a reported metric rather than an aspiration.

**No clinical claims, ever.** These methods measure decision style, belief structure, and value ordering. They do not measure mental health, and Teek will not output diagnostic language about any real person. See `docs/ethics.md`.
