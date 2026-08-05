#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'

function usage() {
  console.error('Usage: node attach-corpus-evidence.mjs --ledger evidence.json --corpus /path/to/sources --excerpts excerpts.json')
  process.exit(1)
}

function argsFrom(argv) {
  const args = Object.fromEntries(argv.slice(2).reduce((pairs, value, index, values) => {
    if (value.startsWith('--')) pairs.push([value.slice(2), values[index + 1]])
    return pairs
  }, []))
  if (!args.ledger || !args.corpus || !args.excerpts) usage()
  return args
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map((entry) => {
    const path = resolve(directory, entry.name)
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith('.md') ? [path] : []
  }))
  return nested.flat()
}

async function documentsByUrl(corpus) {
  const index = new Map()
  for (const document of await markdownFiles(corpus)) {
    const content = await readFile(document, 'utf8')
    const url = content.match(/^url:\s*(.+)$/m)?.[1]?.trim()
    if (url) index.set(url.replace(/\/$/, ''), document)
  }
  return index
}

const args = argsFrom(process.argv)
const ledgerPath = resolve(args.ledger)
const ledger = JSON.parse(await readFile(ledgerPath, 'utf8'))
const excerpts = JSON.parse(await readFile(resolve(args.excerpts), 'utf8'))
const documentIndex = await documentsByUrl(resolve(args.corpus))
const ledgerDirectory = dirname(ledgerPath)
const sourceById = new Map(ledger.sources.map((source) => [source.id, source]))

for (const source of ledger.sources) {
  const document = documentIndex.get(source.url.replace(/\/$/, ''))
  if (document) source.local_document = relative(ledgerDirectory, document)
}

for (const [claimId, entries] of Object.entries(excerpts)) {
  const claim = ledger.claims.find((item) => item.id === claimId)
  if (!claim) throw new Error(`Excerpt map references missing claim ${claimId}`)
  claim.evidence = entries.map((entry) => {
    const source = sourceById.get(entry.source_id)
    if (!source?.local_document) throw new Error(`${claimId} needs a retained local document for ${entry.source_id}`)
    return { source_id: entry.source_id, excerpt: entry.excerpt, local_document: source.local_document }
  })
  claim.excerpt_available = claim.evidence.length > 0
}

await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`)
const linkedSources = ledger.sources.filter((source) => source.local_document).length
const excerptedClaims = ledger.claims.filter((claim) => claim.excerpt_available).length
console.log(`Linked ${linkedSources} retained source documents and ${excerptedClaims} claim excerpts.`)
