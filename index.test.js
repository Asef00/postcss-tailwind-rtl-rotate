const postcss = require('postcss')
const { equal } = require('node:assert')
const { test } = require('node:test')

const plugin = require('./')

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  equal(result.css, output)
  equal(result.warnings().length, 0)
}

// Test basic rotation with degrees
test('handles basic rotation with degrees', async () => {
  await run(
    '.rotate-45 { --tw-rotate: 45deg; }',
    '[dir="rtl"] .rotate-45 { --tw-rotate: -45deg; }\n[dir="ltr"] .rotate-45 { --tw-rotate: 45deg; }'
  )
})

// Test negative rotation values
test('handles negative rotation values', async () => {
  await run(
    '.rotate-45 { --tw-rotate: -45deg; }',
    '[dir="rtl"] .rotate-45 { --tw-rotate: 45deg; }\n[dir="ltr"] .rotate-45 { --tw-rotate: -45deg; }'
  )
})

// Test rotation with turn units
test('handles rotation with turn units', async () => {
  await run(
    '.rotate-45 { --tw-rotate: 0.25turn; }',
    '[dir="rtl"] .rotate-45 { --tw-rotate: -0.25turn; }\n[dir="ltr"] .rotate-45 { --tw-rotate: 0.25turn; }'
  )
})

// Test rotation with radian units
test('handles rotation with radian units', async () => {
  await run(
    '.rotate-45 { --tw-rotate: 1.57rad; }',
    '[dir="rtl"] .rotate-45 { --tw-rotate: -1.57rad; }\n[dir="ltr"] .rotate-45 { --tw-rotate: 1.57rad; }'
  )
})

// Test rotation with numeric values (no units)
test('handles rotation with numeric values', async () => {
  await run(
    '.rotate-45 { --tw-rotate: 45; }',
    '[dir="rtl"] .rotate-45 { --tw-rotate: -45; }\n[dir="ltr"] .rotate-45 { --tw-rotate: 45; }'
  )
})

// Test multiple selectors
test('handles multiple selectors', async () => {
  await run(
    '.rotate-45, .rotate-90 { --tw-rotate: 45deg; }',
    '[dir="rtl"] .rotate-45, [dir="rtl"] .rotate-90 { --tw-rotate: -45deg; }\n[dir="ltr"] .rotate-45, [dir="ltr"] .rotate-90 { --tw-rotate: 45deg; }'
  )
})

// Test rules without rotate- in selector (should be ignored)
test('ignores rules without rotate- in selector', async () => {
  await run(
    '.not-rotate { --tw-rotate: 45deg; }',
    '.not-rotate { --tw-rotate: 45deg; }'
  )
})

// Test rules without --tw-rotate declaration (should be ignored)
test('ignores rules without --tw-rotate declaration', async () => {
  await run(
    '.rotate-45 { color: red; }',
    '.rotate-45 { color: red; }'
  )
})

// Test complex selectors
test('handles complex selectors', async () => {
  await run(
    '.hover\\:rotate-45:hover { --tw-rotate: 45deg; }',
    '[dir="rtl"] .hover\\:rotate-45:hover { --tw-rotate: -45deg; }\n[dir="ltr"] .hover\\:rotate-45:hover { --tw-rotate: 45deg; }'
  )
})

// Test rules with other CSS properties
test('handles rules with other CSS properties', async () => {
  await run(
    '.rotate-45 { --tw-rotate: 45deg; color: red; background: blue; }',
    '[dir="rtl"] .rotate-45 { --tw-rotate: -45deg; }\n[dir="ltr"] .rotate-45 { --tw-rotate: 45deg; }\n.rotate-45 { color: red; background: blue; }'
  )
})

// Test decimal values
test('handles decimal rotation values', async () => {
  await run(
    '.rotate-45 { --tw-rotate: 45.5deg; }',
    '[dir="rtl"] .rotate-45 { --tw-rotate: -45.5deg; }\n[dir="ltr"] .rotate-45 { --tw-rotate: 45.5deg; }'
  )
})

// Test zero rotation values
test('handles zero rotation values', async () => {
  await run(
    '.rotate-0 { --tw-rotate: 0deg; }',
    '[dir="rtl"] .rotate-0 { --tw-rotate: 0deg; }\n[dir="ltr"] .rotate-0 { --tw-rotate: 0deg; }'
  )
})

// Test multiple rules
test('handles multiple rules', async () => {
  await run(
    '.rotate-45 { --tw-rotate: 45deg; }\n.rotate-90 { --tw-rotate: 90deg; }',
    '[dir="rtl"] .rotate-45 { --tw-rotate: -45deg; }\n[dir="ltr"] .rotate-45 { --tw-rotate: 45deg; }\n[dir="rtl"] .rotate-90 { --tw-rotate: -90deg; }\n[dir="ltr"] .rotate-90 { --tw-rotate: 90deg; }'
  )
})

// Test invalid rotation values (should be preserved as-is)
test('preserves invalid rotation values', async () => {
  await run(
    '.rotate-45 { --tw-rotate: invalid-value; }',
    '[dir="rtl"] .rotate-45 { --tw-rotate: invalid-value; }\n[dir="ltr"] .rotate-45 { --tw-rotate: invalid-value; }'
  )
})

// Test empty CSS
test('handles empty CSS', async () => {
  await run('', '')
})

// Test CSS without any rotate rules
test('handles CSS without rotate rules', async () => {
  await run(
    '.some-class { color: red; }',
    '.some-class { color: red; }'
  )
})
