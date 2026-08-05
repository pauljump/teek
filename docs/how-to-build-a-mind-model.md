# How To Build A Model Of Someone's Mind, And Prove It Works

I have no training in psychology. I have never taken a psychometrics course. I could not have told you six months ago that there is an entire academic field devoted to building decision profiles of real people from their public writing without ever meeting them.

There is. It is called at-a-distance assessment. It has sixty years of literature, published coding manuals, reported reliability figures, and a documented operational history: Jerrold Post ran the CIA unit that did this for 21 years, and produced the profiles of Begin and Sadat that briefed Carter before Camp David.

I found this out by training an AI to be the expert I am not, and then asking it to teach me. What follows is everything it taught me, everything I built with it, and the specific test I invented along the way to find out whether the AI was doing science or just doing an impression.

That test is the interesting part. Skip to Part 3 if you want it.

This document is a recipe. You can run it yourself, on anyone, with tools you already have.

---

## Part 0: The Claim

Anyone can write "act like Warren Buffett" into a prompt box. You will get something Buffett-flavored back. It will feel right.

Feeling right is worthless, and this is the whole problem. In 1949 a psychologist named Bertram Forer handed his students what he said were personalized personality assessments. They rated the accuracy at 4.26 out of 5. Every student had received the identical text, lifted from a newsstand astrology column. "You have a great need for other people to like and admire you." "You have a tendency to be critical of yourself." True of everyone, felt specific to each.

Every persona prompt you have ever seen is a Forer statement with extra steps. It sounds like the person because it sounds like a lot of people, and you supplied the specificity yourself when you read it.

So the claim I want to make is narrower and harder:

> A model of someone's mind is worth something only if it makes a prediction that could turn out wrong, and you check.

Everything below is in service of that one sentence. The profile is not the deliverable. The profile is the hypothesis. The deliverable is the score.

---

## Part 1: How I Invented It (And What "Invented" Honestly Means)

I did not invent at-a-distance assessment. It was fully formed before I was born. Nathan Leites was doing it on the Soviet Politburo in 1951.

What I did was more specific and, I think, more interesting: **I used an AI to acquire a field's expertise, then pointed that expertise back at the AI to find out where it was lying to me.**

That loop is the actual invention, and it is repeatable by anyone. Here is how it went.

### Step 1: I asked for the science, not the answer

The naive move is to ask an AI to build you a personality profile. It will do it. The output will be fluent, confident, and epistemically worthless, because you have asked it to produce a conclusion with no method underneath.

The move that works is to ask for the **methods literature** instead. Not "profile this person" but "what is the established academic practice for assessing someone's decision-making from their public writing, what are the published coding manuals, what reliability has been reported, and what do the field's own critics say."

That question returns something very different. It returned operational code analysis, integrative complexity coding, motive imagery scoring, the moral foundations dictionaries. It returned inter-rater reliability figures. It returned, crucially, the field arguing with itself.

### Step 2: I made it argue against itself

The second pass is the one people skip. I asked specifically for the strongest published criticisms, the failure modes, the negative results, the effect sizes that did not replicate.

This is where the real information was. A few examples of what came back:

- The most common technique in commercial AI persona products, inferring Big Five traits from someone's word choice, has a meta-analytic ceiling. Across 31 samples and 85,724 people, linguistic categories explained **5.1% of the variance** in self-reported personality. Not 51%. Five.
- Leadership Trait Analysis, a genuinely respected method with seven traits and decades of published use, reports every score relative to a norming group. Those norming distributions are proprietary. Which means you can implement the coding perfectly and still be producing meaningless output, because "high need for power" only means anything against a baseline you do not have.
- LLM agents reproducing published psychology experiments got the direction right most of the time but produced effect sizes **two to three times larger** than the human studies. They overreact.

None of this was in the first answer. All of it changed what I built.

### Step 3: I let the criticism design the tool

Here is the part I would most want someone to copy. **The refusals became the architecture.**

I did not implement Leadership Trait Analysis, because I cannot get the norms, and implementing it without them would mean inventing a baseline while borrowing the method's reputation. I do not output Big Five scores, because of that 5.1%. I do not use George Kelly's repertory grid, because the live interview is not a delivery mechanism for that method, it *is* the method, and there is no validated way to run it on a corpus.

Four methods in, four methods out, each refusal with a stated reason. A tool defined as much by what it will not claim as what it will.

This is what made it real instead of impressive. Anyone can add capabilities. Subtracting them on principle is the part that requires having actually understood the material.

### Step 4: I found the place where the AI would fool me

Deep in the failure-modes research was a sentence about LLM annotation reliability that stopped me.

When you ask a model to code a passage written by a famous person, the model has already read enormous amounts of commentary, analysis, and caricature *about* that person during training. So when it scores a paragraph of Buffett as "high patience, low risk appetite," there are two completely different things that could be happening:

1. It read the paragraph and coded what was in it.
2. It recognized Buffett and retrieved what everyone says about Buffett.

**Both produce identical-looking output.** Both look like analysis. One is analysis and one is a very expensive stereotype.

Every AI-generated profile of a famous person you have ever seen has this problem, and nobody measures it.

I built the measurement. It is in Part 3, and it is the thing I would most like to be copied.

---

## Part 2: How To Build It

The build has four stages. Corpus, coding, claims, profile. In that order, and the order matters, because each stage constrains the next.

### Stage 1: The corpus

Collect what the person actually said, with dates attached.

Rules that turned out to be load-bearing:

**Date everything.** A profile without dates cannot be tested, because the entire proof in Part 3 depends on being able to cut the corpus at a moment in time. An undated corpus is an untestable profile.

**Tag how it was produced.** This is the rule I would have skipped and would have been wrong to skip. Margaret Hermann built it into her coding scheme in the 1980s: prepared remarks are contaminated by staff and speechwriters. It is worse now, with ghostwritten books and managed social accounts.

Every document gets a type:

| Type | What it is | How much it counts |
|---|---|---|
| spontaneous | Live interview, unscripted Q&A, podcast | Most. Closest to their actual cognition |
| authored | Personal blog, signed essay, letter | High, if you believe they wrote it |
| prepared | Keynote, scripted talk, shareholder letter | Reduced. Staff involved |
| ghostwritten (suspected) | Trade book, corporate comms | Excluded from trait coding entirely |
| secondhand | A journalist's description of them | Never used for traits. Attributed claims only |

A trait score computed over a ghostwritten book is a trait score of the ghostwriter.

**Public sources, public figures, no exceptions.** Published writing, on-record interviews, sanctioned archives. Never a logged-in scrape, never private material, never someone who did not choose to be public. This is an ethical line and also a practical one, because material obtained badly taints everything downstream of it.

### Stage 2: The coding

Now score the corpus using published methods. Four that survived my filter:

**Operational code (VICS).** What does this person believe about how their world works? Extract every clause where they are the actor, reduce it to subject-verb-object, classify each verb on two axes: direction (cooperative or hostile) and intensity (1 to 3). Aggregate. You get a number for how cooperative their own tactics are, and separately, for whether they see the environment as friendly or threatening.

This is first because it is the most mechanical. It reduces to verb classification, which machines do well. And it survived the obvious objection: Renshon (2009) compared operational codes built from public speeches against codes built from declassified private material for the same people, and they converged. Public material works.

**Integrative complexity.** Not what they think, but how many things they hold at once. Score each paragraph 1 to 7. A 1 sees one right answer. A 3 acknowledges competing legitimate views without reconciling them. A 5 reconciles them under a stated higher principle. A 7 operates on the reconciliation itself.

This has the highest reported reliability of anything I found, above .80 between human coders. And it produces the single most interesting output in the whole system, which is **complexity over time**. Watching someone's reasoning get more or less dimensional across twenty years is hard to fake and genuinely tells you something.

The trap: models confuse big vocabulary with complexity. A dense paragraph can be totally dogmatic. A plain one can be genuinely integrative. Your anchoring examples have to break this explicitly or you will just be scoring verbosity.

**Values tradeoffs.** This is the one that answers the question people actually have.

Two layers. The dictionary layer counts moral-foundation language (care, fairness, loyalty, authority, sanctity) using the extended Moral Foundations Dictionary, which was built from crowd annotation rather than a researcher's intuitions. Fine, cheap, limited.

The layer that matters: **search the corpus for moments where they describe two goods in direct conflict and choose one.** Record which won. Cite the passage.

Counting how often someone says "fairness" tells you what they talk about. Finding the paragraph where they gave up growth to be fair tells you who they are. Dictionaries structurally cannot do this. Finding argumentative structure across a large corpus is exactly what language models are good at. This is the one place the machine beats the published method rather than approximating it.

**Motive imagery.** Density of power, achievement, and affiliation language per thousand words. Implement the coding, refuse the famous downstream claim. Winter's headline result, that leaders' power motivation predicts going to war, has a credible published critique: the matched crisis pairs are drawn from the same conflicts at different phases, and some cases coded as "peacefully resolved" include Munich 1938. Code the imagery, do not sell the prophecy.

### Stage 3: The claims

Now convert scores and passages into claims. Every claim carries:

- **The statement.** Specific enough to be wrong.
- **The span.** The exact stretch of text it came from. Not the document, the span.
- **A status.** Documented (they said it), attributed (a credible source says it about them), inferred (you concluded it from several sources), contradicted (evidence conflicts), outdated (was true, is not now).
- **A confidence.**
- **An expiry.** A review date after which it is stale by default.

Two tests before a claim survives:

**The span test.** If the model cannot point at the text, the claim does not exist. Not "low confidence." Does not exist. This is what makes the failure in Part 3 visible, because a stereotype cannot produce a span.

**The discrimination test.** Would this claim be *false* about comparable people? "Values persistence." "Trusts people who have built something." True of essentially every investor alive. It is a Forer statement in professional clothing. Cut it. If a claim does not distinguish this person from their peer group, it carries no information no matter how accurate it is.

Discrimination is the single highest-leverage filter in the whole build, and it will delete most of what you generate. That is the point.

### Stage 4: The profile

Only now write the profile, and write it as a *derivation*. Every sentence traces to claim IDs. A sentence with nothing behind it is decoration, and it gets cut.

This inverts how everyone does it. The normal way is to write a compelling profile and cite it afterward. That produces good prose and bad epistemics, because the writing pulls toward whatever sounds coherent, and coherence is exactly what Forer exploited.

Build the claims first. Let the profile be whatever the claims can support, including boring, including full of holes. **The holes are information.** A profile that admits it cannot tell you how this person handles betrayal is more useful than one that smoothly invents it.

---

## Part 3: How To Prove It

This is the part I care about most, and both halves are things you can run today.

### The proof structure: before, predict, after

Here is the whole thing in one line: **build the profile from the before, make it predict the after, then check the after.**

Concretely:

1. Pick a cutoff date.
2. Build the entire profile using only material from before that date. Nothing after. No exceptions, and this is harder than it sounds, because you know things.
3. Ask the profile to predict specific decisions the person made after the cutoff.
4. Check.

That is it. That is the whole scientific content of this exercise, and everything in Parts 1 and 2 exists to make this step meaningful.

Critically, **the predictions have to be the kind that can fail.** "He would approach this thoughtfully" cannot fail. These can:

- Did he invest in this company, yes or no, with a confidence number?
- Rank these five factors by how much weight he gives them.
- What is the first objection he raises to this pitch?
- Which of his stated positions did he later reverse?

Score them properly. Use Brier scores for the yes/no predictions with confidence, so that being confidently wrong costs more than being uncertainly wrong. Rank correlation for the rankings. Blind human rating for the open ones, where the rater does not know which answer came from the model.

**Dead people are better subjects, and this surprised me.** I assumed the interesting targets were living. They are not, for three reasons. Their corpus is closed, so there is no contamination from new material. Their later life is fully documented, so you have complete ground truth. And they cannot be harmed by being wrong about them, which removes the entire ethical problem.

Benjamin Franklin is my first real test. Build him from everything before 1750. Then ask what he does about slavery, about independence, about Britain. Franklin's actual answers to all three changed dramatically after 1750, in ways the early material does not obviously telegraph. If a profile built from young Franklin predicts old Franklin, that is a real result. If it does not, that is also a real result, and more useful than another persona that sounds convincing.

### The blind-coding delta

The second test is the one I have not seen anywhere else, and it exists because of the problem in Part 1: a model coding a famous person may be retrieving a stereotype rather than reading the text.

The test is almost embarrassingly simple.

**Code every passage twice. Once with the speaker identified. Once with every identifying detail stripped out. Measure the gap.**

- Small gap: the coder is reading the text. The scores mean something.
- Large gap: the coder is recognizing the person and retrieving what it already believed. The scores are circular, and the profile is an elaborate restatement of the model's priors.

Call it the blind-coding delta. Report it as a number, per person, per method, right at the top of the profile.

A few things make this better than it first appears.

It is a *measurement*, not a mitigation. It does not fix contamination, it makes contamination visible and quantified, which is strictly more useful because now you know which profiles to distrust.

It is predictive in an interesting way. Famous subjects should show larger deltas than obscure ones. That is a testable claim about the test itself, which means the instrument can be validated rather than just asserted.

And it generalizes far past this project. Any time you use an AI to analyze something it has extensive opinions about, from a public company to a famous novel to a well-known codebase, you can mask the identifiers and measure whether the analysis survives. I would like this to be a normal thing people do.

---

## Part 4: How To Use It

Uses this is good for:

**Rehearsal.** Prepare for a real conversation with a real person by running your argument past a model of how they decide. This is the strongest use, because it is checkable: you find out afterward whether the objection you rehearsed was the objection you got.

**Reading your own corpus.** Point it at yourself. What did the coding find that you did not know? People are worst at seeing their own recurring patterns, and the discrimination test is brutal about which of your self-descriptions are Forer statements.

**Comparison across a group.** The scores are the same shape for every person, so you can ask structural questions. Which of these people gets more complex under pressure, and which gets more certain? Where does disagreement come from values versus from causal beliefs?

**Watching drift.** Profiles have expiry dates and coding runs record their window. Re-run over a later window and diff. What changed about this person, and when, is a genuinely novel artifact. A persona card is a photograph. This has a changelog.

Uses this is not good for, and I want to be direct:

**Not for speaking as them.** Output stays private, for research and rehearsal. Nothing gets published in a real person's voice.

**Not for diagnosis.** These methods measure decision style, belief structure, and values. They do not measure mental health, and no output of this system should ever contain clinical language about a real person. Psychiatry's own rule against diagnosing public figures at a distance exists because it is invalid and because it is defamatory when wrong.

**Not as a product about people who have not agreed.** Worth knowing if you are tempted: no funded company in this space simulates a named third party without consent. They are all self-clones or licensed likeness. That is not squeamishness, it is right-of-publicity and defamation law, and several statutes tightened in the last two years. Analysis and commentary about public figures is well-protected. A commercial product built on a named person's simulated judgment is not the same thing.

---

## Part 5: What This Cannot Do

Stated plainly, because a method that will not say where it fails is not a method.

**These techniques are mostly descriptive, not predictive.** Only integrative complexity has a well-documented specific predictive claim, and Tetlock, who co-created it, later published a self-critique about confounds. Operational code practitioners concede directly that it adds little to predicting consequential decisions. Any predictive claim I make rests on the before/predict/after test, not on borrowed authority from the literature.

**The corpus is biased by construction.** What survives and gets digitized is formal, public, and filtered. The private, spontaneous, and unflattering material is systematically missing. No coding scheme repairs a corpus.

**The machine inherits ambiguity.** Where human coders disagree with each other, models disagree with humans by about the same amount. An LLM is not a fix for a fuzzy construct.

**Everything comes out too strong.** Effect sizes run two to three times the human studies. Expect the scores to be more extreme than reality.

**Forer never goes away.** A profile that sounds right is weak evidence, permanently. That is why discrimination is a reported number rather than a good intention.

---

## The Recursion, Said Directly

I do not know this science. I trained an AI to know it, and then used what it taught me to build a test for whether it was actually doing the science or merely performing it.

That is a strange loop and I want to be honest about how far it goes. The AI that researched the methods is the same kind of system that does the coding. It could be wrong in correlated ways I cannot see, and my not knowing the field means I would not catch it. The blind-coding delta is a real check on one specific failure, but it is one check, not a guarantee.

Which is exactly why the before/predict/after test has to exist. It is the only step in this entire process that does not depend on trusting either me or the model. Franklin either wrote what the profile predicted or he did not. The archive does not care what any of us believe.

Build the profile. Make it predict. Go check.

---

*The working implementation, the research dossiers with citations, and the profiles are at [this repo]. The methods dossier in `docs/research/` is the raw material behind Part 1, with sources, and is worth reading before you trust anything here.*
