# Evaluation: Before, Predict, After

The only step in Teek that does not depend on trusting the author or the model.

Everything else in this repo produces a hypothesis. This produces a score.

## The Protocol

1. **Cut.** Pick a date. Split the corpus into `before` and `after`.
2. **Build.** Construct the profile using only `before`. Nothing from `after` touches it.
3. **Predict.** Ask the profile specific, falsifiable questions about decisions the person made in `after`.
4. **Score.** Check the predictions against `after`. Record the number, including when it is bad.

Four steps. The difficulty is entirely in doing them honestly.

## Step 1: Cut

The cut date is chosen **before** looking at what happened after it. Choosing a cutoff after noticing an interesting subsequent event is how you accidentally select for questions you already know the answer to.

Good cut points:

- Halfway through the available corpus by document count.
- Immediately before a known role change (joined the fund, took the job, published the book), which gives the `after` period natural decision density.
- A round date far enough back that `after` contains at least 30 documents.

Record the cut in `evaluation.json` as `cutoff_date`, along with the document counts on each side. A cut that leaves fewer than 30 documents in `after` produces too few resolvable questions to score.

## Step 2: Build Clean

This is the step that fails silently, and it fails in three ways.

**Corpus leakage.** A document dated after the cutoff ends up in the build set. Mechanically preventable: the builder filters by date and records the exact document IDs it used. Those IDs go in the ledger. Anyone can re-run the filter and check.

**Model leakage.** This is the hard one and it cannot be fully solved. The model coding Franklin's 1740s letters already knows how the American Revolution went. It knows Franklin signed the Declaration. Nothing removes that.

What can be done:

- Mask identity during coding (see the blind-coding delta below). A model that does not know it is reading Franklin cannot apply what it knows about Franklin.
- Prefer subjects and questions where the outcome is not famous. Franklin's position on independence is common knowledge. His position on paper currency in Pennsylvania is not, and it is a better test.
- Report the delta alongside the score. A held-out score from a coder with a large blind-coding delta is not a clean result and should not be presented as one.

**Author leakage.** The person writing the prediction questions knows the answers. Mitigation: generate candidate questions from the `after` corpus mechanically, before reading it closely, and commit the question set to git *before* running any predictions. The commit timestamp is the evidence.

## Step 3: Predict

A prediction that cannot fail is not a prediction. "He would approach this thoughtfully" scores nothing. Four question types that can fail:

### Binary with confidence

> Given this company as it appeared at {date}, using only pre-cutoff information, did this person invest? Yes or no, with a confidence from 0 to 1.

Scored with **Brier**: `(confidence − outcome)²`, where outcome is 1 or 0. Lower is better. 0.25 is what you get by answering 0.5 to everything, so **any score above 0.25 means the profile is worse than useless** and that fact should be reported loudly rather than buried.

Confident and wrong is punished harder than uncertain and wrong. This is correct and it is the main reason to use Brier rather than accuracy.

### Ranking

> Rank these five factors by how much weight this person gives them.

Scored with Spearman rank correlation against their own later published ranking or explicit statements. Range −1 to 1.

### Open response, blind-rated

> What is the first objection this person raises to this pitch?

A human rater compares the predicted answer against the documented actual answer, without knowing which is which, and without knowing which model or profile version produced it. Scored 0 to 3: wrong, adjacent, substantially right, right including the reasoning.

Blind rating matters more than it sounds. An un-blinded rater who wrote the profile will find their own prediction convincing.

### Reversal detection

> Which position held before {cutoff} did this person later abandon?

The hardest question type and the most valuable, because it tests whether the profile captured something dynamic rather than a snapshot. Scored on precision and recall against documented reversals.

## Step 4: Score And Publish The Bad Ones

Results go in `profiles/<slug>/evaluation.json`:

```json
{
  "cutoff_date": "1750-01-01",
  "corpus_before": 8,
  "corpus_after": 5,
  "question_set_committed": "git sha of the commit that fixed the questions",
  "blind_coding_delta": { "operational_code": 0.14, "integrative_complexity": 0.09 },
  "scores": {
    "binary_brier": 0.31,
    "ranking_spearman": 0.42,
    "open_blind_rated": 1.8,
    "reversal_precision": 0.5,
    "reversal_recall": 0.33
  },
  "n_questions": 24,
  "verdict": "Worse than chance on binary prediction. Profile does not support decision forecasting for this subject. Ranking and open response show weak signal.",
  "notes": "Corpus after cutoff is thin (5 documents). Franklin's pre-1750 corpus is heavily 'authored' with almost no spontaneous material, which the method predicts should degrade trait coding."
}
```

**A bad score is a result, not a failure.** The Brier example above (0.31) is worse than guessing, and it is written into the record rather than quietly re-run with a different cutoff until the number improves.

Re-running with different cutoffs until the score looks good is the single easiest way to make this whole exercise fraudulent. The question set is committed before predictions are run precisely so that this is detectable in the git history.

## The Blind-Coding Delta

A separate measurement, run per person per scheme, reported alongside every evaluation.

**Procedure:**

1. Sample N passages from the corpus (N ≥ 30).
2. Code each one with the speaker identified.
3. Strip every identifying detail: names, company names, distinctive events, book titles, signature phrases. Re-code the same passages.
4. Delta = mean absolute difference between the two score sets, normalized to the scheme's scale.

**Interpretation:**

| Delta | Reading |
|---|---|
| < 0.10 | The coder is reading the text. Scores are usable. |
| 0.10 – 0.25 | Some contamination. Report it; treat scores as indicative. |
| > 0.25 | The coder is retrieving a stereotype. Scores are circular. Do not ship the profile. |

Thresholds are provisional and should be calibrated as data accumulates across subjects. They are stated anyway, because an unstated threshold is a threshold chosen after seeing the result.

**A testable prediction about the test:** famous subjects should show larger deltas than obscure ones. If that does not hold across enough subjects, the delta is measuring something other than what it claims to, and it needs rethinking. This is written down here so it can be checked later.

## Why Historical Subjects Are The Better Test

Three structural advantages, none of which any living subject offers:

**Closed corpus.** Nothing new arrives to contaminate the `after` set.

**Complete ground truth.** The whole later life is documented. Living subjects have an `after` that is still being written, which means many questions cannot resolve.

**No ethical problem.** No consent question, no right of publicity, no possibility of harming the subject with a wrong answer.

Franklin is the first target: a public-domain corpus already in this repo, and a documented later life that diverges sharply from the early material on slavery, on independence, and on Britain. Those divergences are exactly what a profile built from young Franklin should fail to predict, which makes it a real test rather than a demonstration.

## Running It

```bash
teek eval cut benfranklin --date 1750-01-01
teek eval questions benfranklin        # generates and commits the question set
teek eval predict benfranklin          # runs predictions against the before-profile
teek eval score benfranklin            # scores against after, writes evaluation.json
teek eval blind benfranklin            # blind-coding delta
```

*Not yet implemented. This is the interface being built toward, recorded here so the harness is designed before the results exist, rather than after.*
