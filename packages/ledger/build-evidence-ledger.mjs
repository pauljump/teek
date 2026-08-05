#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const KIND_BY_FIELD = {
  decision_rules: 'decision_rule',
  thesis_evolution: 'thesis_evolution',
  current_attention: 'current_attention',
  founder_signals: 'founder_signal',
}

function usage() {
  console.error('Usage: node build-evidence-ledger.mjs --input packet.json --output evidence.json')
  process.exit(1)
}

function readArgs(argv) {
  const args = Object.fromEntries(argv.slice(2).reduce((pairs, value, index, values) => {
    if (value.startsWith('--')) pairs.push([value.slice(2), values[index + 1]])
    return pairs
  }, []))
  if (!args.input || !args.output) usage()
  return args
}

function buildLedger(packet) {
  const sourceIdByUrl = new Map()
  const sources = packet.sources.map((source, index) => {
    const id = `src-${String(index + 1).padStart(3, '0')}`
    sourceIdByUrl.set(source.url, id)
    return {
      id,
      url: source.url,
      title: source.title,
      published_at: source.published_at,
      retrieved_at: source.retrieved_at,
      first_party: source.first_party,
    }
  })

  // Packets sometimes cite a source in a finding without adding it to their
  // source catalogue. Preserve that evidence as explicitly uncatalogued;
  // dropping it would turn a provenance gap into a false claim of coverage.
  const citedUrls = Object.keys(KIND_BY_FIELD).flatMap((field) =>
    (packet[field] ?? []).flatMap((item) => item.evidence_urls ?? []),
  )
  for (const url of citedUrls) {
    if (sourceIdByUrl.has(url)) continue
    const id = `src-${String(sources.length + 1).padStart(3, '0')}`
    sourceIdByUrl.set(url, id)
    sources.push({
      id,
      url,
      title: 'Uncatalogued evidence source (metadata review required)',
      published_at: 'unknown',
      retrieved_at: packet.snapshot_date,
      first_party: false,
    })
  }

  let claimIndex = 0
  const claims = Object.entries(KIND_BY_FIELD).flatMap(([field, kind]) =>
    (packet[field] ?? []).map((item) => ({
      id: `clm-${String(++claimIndex).padStart(3, '0')}`,
      kind,
      label: item.label,
      statement: item.claim,
      period: item.period,
      status: item.status,
      confidence: item.confidence,
      evidence_source_ids: item.evidence_urls.map((url) => sourceIdByUrl.get(url)).filter(Boolean),
      // v2 packets carry URLs, not retained verbatim excerpts. Keep the gap explicit.
      excerpt_available: false,
      review_after: item.period.includes('present') || item.period.includes('2026') ? '2026-11-01' : '2027-08-01',
    })),
  )

  return {
    version: 2,
    persona: packet.person,
    snapshot_date: packet.snapshot_date,
    readiness: {
      overall: packet.readiness.overall,
      intended_use: packet.readiness.use,
      not_reliable_for: 'Private decision authority, exhaustive conflicts, or realized investment performance.',
    },
    sources,
    claims,
    unknowns: packet.unknowns,
    contradictions: packet.contradictions,
  }
}

const args = readArgs(process.argv)
const packet = JSON.parse(await readFile(resolve(args.input), 'utf8'))
const ledger = buildLedger(packet)
await mkdir(dirname(resolve(args.output)), { recursive: true })
await writeFile(resolve(args.output), `${JSON.stringify(ledger, null, 2)}\n`)
console.log(`Wrote ${ledger.claims.length} claims and ${ledger.sources.length} sources to ${args.output}`)
