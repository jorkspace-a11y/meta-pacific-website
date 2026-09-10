async (page) => {
  let formspreeStatus = 200;
  let hubspotStatus = 200;
  const requests = [];
  await page.route("**/formspree.io/f/mqpkgvzw", async route => {
    requests.push("formspree");
    await route.fulfill({ status: formspreeStatus, contentType: "application/json", body: formspreeStatus === 200 ? "{}" : '{"error":"test"}' });
  });
  await page.route("**/api.hsforms.com/**", async route => {
    requests.push("hubspot");
    await route.fulfill({ status: hubspotStatus, contentType: "application/json", body: hubspotStatus === 200 ? "{}" : '{"error":"test"}' });
  });
  await page.route("**/google-analytics.com/**", async route => {
    requests.push(new URL(route.request().url()).searchParams.get("en") || "analytics");
    await route.fulfill({ status: 204, body: "" });
  });

  async function openAndFill(marker) {
    await page.goto("http://127.0.0.1:4173/");
    const form = page.locator('form[data-form-name="homepage"]');
    await form.locator('[name="name"]').fill("QA Failure Test");
    await form.locator('[name="email"]').fill("jerio.workspace@gmail.com");
    await form.locator('[name="message"]').fill(marker);
    return form;
  }

  await page.goto("http://127.0.0.1:4173/");
  const beforeInvalid = requests.length;
  await page.locator('form[data-form-name="homepage"] button[type="submit"]').click();
  const invalid = {
    activeId: await page.evaluate(() => document.activeElement && document.activeElement.id),
    networkRequests: requests.length - beforeInvalid
  };

  formspreeStatus = 200; hubspotStatus = 200;
  let form = await openAndFill("mock success");
  const beforeSuccess = requests.length;
  await form.locator('button[type="submit"]').dblclick();
  await form.locator(".form-status").getByText("Thanks. Your project inquiry has been received.").waitFor();
  const successRequests = requests.slice(beforeSuccess);

  formspreeStatus = 500; hubspotStatus = 200;
  form = await openAndFill("mock Formspree failure");
  const beforeFormspreeFailure = requests.length;
  await form.locator('button[type="submit"]').click();
  await form.locator(".form-status.is-error").waitFor();
  const formspreeFailureRequests = requests.slice(beforeFormspreeFailure);

  formspreeStatus = 200; hubspotStatus = 500;
  form = await openAndFill("mock HubSpot failure");
  const beforeHubspotFailure = requests.length;
  await form.locator('button[type="submit"]').click();
  await form.locator(".form-status.is-error").waitFor();
  const hubspotFailureRequests = requests.slice(beforeHubspotFailure);

  return { invalid, successRequests, formspreeFailureRequests, hubspotFailureRequests };
}
