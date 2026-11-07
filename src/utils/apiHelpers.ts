import { Page } from '@playwright/test';
import { OrderSummary } from '../types/checkout.types';

/**
 * SauceDemo does not expose a public provisioning API.
 * Session setup is done through the UI; these helpers only inspect
 * the browser session that a successful login leaves behind and
 * normalize the currency labels rendered in checkout.
 */
export async function readSessionUsername(page: Page): Promise<string | undefined> {
  const cookies = await page.context().cookies();
  return cookies.find((cookie) => cookie.name === 'session-username')?.value;
}

export async function clearBrowserSession(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

export function parseCurrency(label: string): number {
  const match = label.match(/([0-9]+(?:\.[0-9]{1,2})?)/);
  if (!match) {
    throw new Error(`No currency amount found in "${label}"`);
  }
  return Number(match[1]);
}

export function summarizeOrder(subtotalLabel: string, taxLabel: string, totalLabel: string): OrderSummary {
  return {
    subtotal: parseCurrency(subtotalLabel),
    tax: parseCurrency(taxLabel),
    total: parseCurrency(totalLabel),
  };
}
