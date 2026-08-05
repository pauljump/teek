#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const input = process.argv[2]
if (!input) {
  console.error('Usage: node validate-evidence-ledger.mjs evidence.json')
  process.exit(1)
}

const ledger = JSON.parse(await readFile(resolve(input), 'utf8'))
const errors = []
const sourceIds = new Set((ledger.sources ?? []).map((source) => source.id))

if (ledger.version !== 2) errors.push('version must be 2')
if (!/^\d{4}-\d{2}-\d{2}$/.test(ledger.snapshot_date ?? '')) errors.push('snapshot_date must be ISO date')
if (!Number.isFinite(ledger.readiness?.overall) || ledger.readiness.overall < 0 || ledger.readiness.overall > 1) errors.push('readiness.overall must be between 0 and 1')
if (!ledger.sources?.length) errors.push('at least one source is required')
if (!ledger.claims?.length) errors.push('at least one claim is required')

for (const claim of ledger.claims ?? []) {
  if (!claim.id || !claim.label || !claim.statement) errors.push(`${claim.id ?? 'claim'} is missing identity fields`)
  if (!Number.isFinite(claim.confidence) || claim.confidence < 0 || claim.confidence > 1) errors.push(`${claim.id} has invalid confidence`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(claim.review_after ?? '')) errors.push(`${claim.id} needs review_after date`)
  if (!claim.evidence_source_ids?.length) errors.push(`${claim.id} has no evidence`)
  for (const sourceId of claim.evidence_source_ids ?? []) {
    if (!sourceIds.has(sourceId)) errors.push(`${claim.id} references missing source ${sourceId}`)
  }
  if (claim.excerpt_available && !claim.evidence?.length) errors.push(`${claim.id} marks an excerpt available without retained evidence`)
  for (const evidence of claim.evidence ?? []) {
    if (!sourceIds.has(evidence.source_id)) errors.push(`${claim.id} excerpt references missing source ${evidence.source_id}`)
    if (!evidence.excerpt || !evidence.local_document) errors.push(`${claim.id} has malformed retained evidence`)
  }
}

if (errors.length) {
  console.error(`Invalid Teek v2 ledger:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

const directClaims = ledger.claims.filter((claim) => claim.status === 'documented').length
const excerptedClaims = ledger.claims.filter((claim) => claim.excerpt_available).length
console.log(`Valid Teek v2 ledger: ${ledger.persona}; ${ledger.claims.length} claims (${directClaims} documented), ${ledger.sources.length} sources, ${excerptedClaims} claims with retained excerpts.`)
