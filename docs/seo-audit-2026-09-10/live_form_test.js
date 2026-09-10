async (page) => {
  const responses = [];
  page.on("response", response => {
    const url = response.url();
    if (url.includes("formspree.io") || url.includes("hsforms.com") || url.includes("google-analytics.com")) {
      responses.push({ url, status: response.status() });
    }
  });

  await page.setViewportSize({ width: 360, height: 844 });
  await page.goto("https://metapacific.co/?utm_source=e2e_test&utm_medium=qa&utm_campaign=challenge_acceptance");
  const form = page.locator('form[data-form-name="homepage"]');
  await form.getByRole("button", { name: "Send" }).click();
  const invalid = await page.evaluate(() => ({
    path: location.pathname,
    activeId: document.activeElement && document.activeElement.id,
    invalidNames: Array.from(document.querySelectorAll('form[data-form-name="homepage"] :invalid')).map(el => el.name)
  }));

  async function submit(marker) {
    await page.goto("https://metapacific.co/?utm_source=e2e_test&utm_medium=qa&utm_campaign=challenge_acceptance");
    const current = page.locator('form[data-form-name="homepage"]');
    await current.locator('[name="name"]').fill("Jerio QA E2E");
    await current.locator('[name="email"]').fill("jerio.workspace@gmail.com");
    await current.locator('[name="message"]').fill(marker + ": internal acceptance test. No sales follow-up needed.");
    await current.getByRole("button", { name: "Send" }).click();
    await page.waitForTimeout(4000);
    return { marker, finalUrl: page.url(), title: await page.title() };
  }

  const first = await submit("MP-E2E-20260910-A");
  const second = await submit("MP-E2E-20260910-B-DUPLICATE");
  return { invalid, first, second, responses };
}
