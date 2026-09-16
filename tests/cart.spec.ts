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

test('drawer supports editing quantity and removing items', async ({ page }) => {
  await page.goto('/order')

  const addButtons = page.getByRole('button', { name: 'Ajouter au panier' })
  await addButtons.nth(0).click()
  await addButtons.nth(1).click()

  await page.getByLabel('Panier').click()

  const drawer = page.getByRole('dialog')
  await expect(drawer.getByText('Mon panier (2)')).toBeVisible()

  const rows = drawer.getByTestId('cart-line-item')
  const firstRowQty = rows.first().getByTestId('cart-line-item-qty')

  await expect(firstRowQty).toHaveText('1')
  await rows.first().getByLabel('Augmenter la quantité').click()
  await expect(firstRowQty).toHaveText('2')
  await expect(drawer.getByText('Mon panier (3)')).toBeVisible()

  await rows.first().getByLabel('Diminuer la quantité').click()
  await rows.first().getByLabel('Diminuer la quantité').click()
  await expect(rows).toHaveCount(1)
  await expect(drawer.getByText('Mon panier (1)')).toBeVisible()

  await rows.first().getByLabel("Retirer l'article").click()
  await expect(drawer.getByText('Votre panier est vide.')).toBeVisible()
  await expect(page.getByTestId('cart-badge')).toBeHidden()
})
