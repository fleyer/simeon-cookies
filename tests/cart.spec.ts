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
