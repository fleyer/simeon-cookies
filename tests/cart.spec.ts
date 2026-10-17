import { expect, test } from '@playwright/test'
import { mockCatalog } from './fixtures/catalog'

test.beforeEach(async ({ page }) => {
  await mockCatalog(page)
})

test('adding a product updates the header badge and survives a reload', async ({ page }) => {
  await page.goto('/order')

  const addButtons = page.getByRole('button', { name: 'Ajouter au panier' })
  await expect(addButtons.first()).toBeEnabled()

  const badge = page.getByTestId('cart-badge')
  await expect(badge).toBeHidden()

  await addButtons.first().click()
  await expect(badge).toHaveText('1')

  await addButtons.first().click()
  await expect(badge).toHaveText('2')

  await page.reload()
  await expect(badge).toHaveText('2')
})

test('cart page supports editing quantity and removing items', async ({ page }) => {
  await page.goto('/order')

  const addButtons = page.getByRole('button', { name: 'Ajouter au panier' })
  await addButtons.nth(0).click()
  await addButtons.nth(1).click()

  await page.getByLabel('Panier').click()
  await expect(page).toHaveURL(/\/cart$/)

  const main = page.getByRole('main')
  await expect(main.getByRole('heading', { name: 'Mon panier (2)' })).toBeVisible()

  const rows = main.getByTestId('cart-line-item')
  const firstRowQty = rows.first().getByTestId('cart-line-item-qty')

  await expect(firstRowQty).toHaveText('1')
  await rows.first().getByLabel('Augmenter la quantité').click()
  await expect(firstRowQty).toHaveText('2')
  await expect(main.getByRole('heading', { name: 'Mon panier (3)' })).toBeVisible()
  await expect(page.getByTestId('cart-badge')).toHaveText('3')

  await rows.first().getByLabel('Diminuer la quantité').click()
  await rows.first().getByLabel('Diminuer la quantité').click()
  await expect(rows).toHaveCount(1)
  await expect(main.getByRole('heading', { name: 'Mon panier (1)' })).toBeVisible()

  await rows.first().getByLabel("Retirer l'article").click()
  await expect(main.getByText('Votre panier est vide.')).toBeVisible()
  await expect(main.getByTestId('cart-summary')).toBeHidden()
  await expect(page.getByTestId('cart-badge')).toBeHidden()
})

test('hard load of /cart restores a seeded cart', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cart', JSON.stringify([{
      id: 'gid://shopify/Product/1',
      handle: 'cookie-one',
      title: 'Cookie One',
      image: 'https://example.com/one.png',
      imageAlt: 'Cookie One',
      price: '3,50 €',
      unitPrice: 3.5,
      quantity: 2,
      variantId: 'gid://shopify/ProductVariant/1',
    }]))
  })

  await page.goto('/cart')

  const main = page.getByRole('main')
  await expect(main.getByRole('heading', { name: 'Mon panier (2)' })).toBeVisible()
  await expect(main.getByTestId('cart-line-item')).toHaveCount(1)
  await expect(main.getByText('Votre panier est vide.')).toBeHidden()
})

test('"Continuer mes achats" and "Voir nos cookies" go to /order', async ({ page }) => {
  await page.goto('/cart')
  await page.getByRole('link', { name: 'Voir nos cookies' }).click()
  await expect(page).toHaveURL(/\/order$/)

  await page.getByRole('button', { name: 'Ajouter au panier' }).first().click()
  await page.getByLabel('Panier').click()
  await page.getByRole('link', { name: 'Continuer mes achats' }).click()
  await expect(page).toHaveURL(/\/order$/)
})

test('mobile: summary sits below the list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/order')
  await page.getByRole('button', { name: 'Ajouter au panier' }).first().click()
  await page.getByLabel('Panier').click()

  const row = page.getByTestId('cart-line-item').first()
  const summary = page.getByTestId('cart-summary')
  await expect(summary).toBeVisible()
  const rowBox = await row.boundingBox()
  const summaryBox = await summary.boundingBox()
  expect(summaryBox!.y).toBeGreaterThan(rowBox!.y + rowBox!.height - 1)
})
