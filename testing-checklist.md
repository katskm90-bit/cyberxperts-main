# Testing Checklist

Manual QA checklist. No automated test suite exists for this project —
everything below is intended to be run by hand against the live deployment.
If automated testing becomes a priority, that's a separate, well-scoped
piece of work (component/integration tests would need to be added from
scratch).

## Core pages

- [ ] Homepage: hero, trust strip, stats counters animate on scroll, services grid, "Why Cyberxperts" section, regional footprint map, partner logos all render
- [ ] About, Contact, Products, Resources, Careers all load without errors
- [ ] All 8 service pages load, each with Overview/Problems/Benefits/Process/FAQ sections populated
- [ ] All 6 industry pages load
- [ ] 404 page displays correctly for an invalid URL

## Forms and conversion paths

- [ ] Contact form: submit with valid data → success message appears → email arrives at the configured company address
- [ ] Contact form: submit with missing required fields → validation blocks submission, no server error shown
- [ ] Careers: submit an application with a valid PDF → success → CV appears in admin Applications tab → notification email arrives with CV attached
- [ ] Careers: attempt to submit a non-PDF file → rejected client-side with a clear message, never reaches the server
- [ ] Careers: attempt to submit an oversized file (>5MB) → rejected with a clear message
- [ ] Free Pre-Assessment: complete the full question flow → results show maturity score
- [ ] Free Pre-Assessment: results include the written narrative (Security Overview, Areas of Concern, Recommended Next Steps) — if only the score appears, check `ANTHROPIC_API_KEY` per the deployment checklist
- [ ] Free Pre-Assessment: enter an email and request the PDF report → email arrives → PDF contains the Cyberxperts wordmark, company name, score, narrative, and the vulnerability-assessment recommendation
- [ ] "Book a Consultation" and "Under Attack" buttons link/dial correctly

## Admin panel

- [ ] Login with correct password succeeds; incorrect password is rejected with a clear message
- [ ] Accessing `/admin/dashboard` while logged out redirects to `/admin/login`
- [ ] Each tab (Homepage, Navigation, Services, Industries, Products, Job Listings, Applications, Other Pages, Company & Footer, Branding, Settings) loads without error
- [ ] Edit a field in any tab → **Publish Changes** → succeeds → change is visible on the live site after the resulting redeploy completes
- [ ] Navigation tab: reordering links with the arrows actually changes the live nav order after publish
- [ ] Products tab: add, edit, and delete a partner; add, edit, and delete a product within a partner; add and delete a category — all persist after publish
- [ ] Job Listings tab: add, edit, and delete a listing — persists after publish, listing appears/disappears on the live Careers page accordingly
- [ ] Applications tab: download a CV → correct file opens; delete an application → it's removed from the list and from Blob storage
- [ ] Branding tab: upload a new logo → appears in the header/footer after publish; upload a new favicon → appears in the browser tab after publish
- [ ] Settings tab: save a new Anthropic key → status updates to "set"; the Free Pre-Assessment picks up the new key after the triggered redeploy completes
- [ ] Log Out actually ends the session (dashboard becomes inaccessible until logging in again)

## Cross-cutting checks

- [ ] No raw technical error text (stack traces, "BLOB_READ_WRITE_TOKEN is not set", etc.) is ever visible on a public-facing page or form — only on the authenticated admin dashboard, where it's appropriate
- [ ] Every animated element (hero visualisation, background, stat counters) respects the operating system's reduced-motion setting
- [ ] Site remains usable and readable with the browser window resized from full desktop width down to a narrow phone width, with no horizontal scrollbars or overlapping content
- [ ] Keyboard-only navigation (Tab key) can reach and activate the nav menu, all form fields, and all buttons
