# LifeMarked — Final Cursor Build Prompt & Technical Specification

You are building the first production-quality validation website for **LifeMarked**, a premium digital memorial product.

This is not a generic MVP landing page.

This is not a SaaS site with memorial branding.

This is not a funeral website.

The site itself is part of the product demonstration and must immediately look more modern, premium and considered than the current QR memorial category.

---

# 1. Mandatory Build Workflow

Use this workflow throughout the task.

1. Use **TasteSkill v2 / design-taste-frontend** as a design-quality framework.
2. Treat this LifeMarked specification as the **source of truth** for brand, tone, layout intent, positioning and functionality.
3. Before implementing the full page, establish the visual system:

   * typography
   * spacing
   * composition
   * imagery treatment
   * motion
   * buttons
   * forms
   * section rhythm
   * mobile behaviour
4. Avoid defaulting to familiar AI-generated landing-page patterns.
5. Build the complete page.
6. Run the site locally.
7. Use **Playwright / Cursor browser tooling** to inspect the finished implementation visually and functionally.
8. Test at minimum:

   * desktop around 1440px
   * laptop around 1280px
   * tablet around 768px
   * mobile around 390px
9. Capture screenshots of the full page and important sections.
10. Critique the result visually, not only technically.
11. Identify and fix:

* generic or templated-looking sections
* repetitive layouts
* weak typography hierarchy
* poor spacing rhythm
* awkward image crops
* oversized or undersized typography
* poor mobile composition
* weak CTA visibility
* contrast/accessibility issues
* horizontal overflow
* runtime errors
* console errors
* broken interactions

12. Repeat the visual QA loop after fixes.
13. Do not consider the task complete simply because the project compiles.

TasteSkill is a **quality framework**, not the creative director.

If TasteSkill guidance conflicts with the restrained, editorial LifeMarked aesthetic described below, **the LifeMarked specification wins**.

---

# 2. Product

## Name

**LifeMarked**

## Working URL

`https://lifemarked.alba-nova.com`

## Tagline

**Every life leaves more than a name.**

## Supporting proposition

LifeMarked connects a physical memorial to the story behind it — photographs, memories, video, voice and the moments that made someone who they were.

## Core idea

Traditional memorials usually preserve:

* a name
* two dates
* a short inscription

LifeMarked helps preserve the **life between them**.

A discreet physical marker connects the memorial to a beautifully designed digital life story.

The QR code is only the bridge.

**The story is the product.**

---

# 3. Current Stage

LifeMarked is currently an early concept being validated with UK memorial businesses.

The website must feel credible and production-quality without pretending that functionality or traction exists where it does not.

Use wording such as:

* being developed
* concept preview
* launch partner
* initial pilot
* designed to
* planned

Do not claim:

* live customer numbers
* existing named commercial partners
* finalised manufacturing
* permanent hosting
* guaranteed lifetime availability
* functionality that is only represented visually

---

# 4. Primary Objective

The website exists primarily to answer one commercial question:

> Will memorial businesses offer LifeMarked as a premium add-on to their existing customers?

The main conversion is:

**Become a launch partner**

Secondary action:

**See how it works**

Do not build:

* checkout
* pricing tables
* user registration
* customer login
* partner login

The site should support direct outbound to:

* stonemasons
* monumental masons
* memorial retailers
* bench manufacturers
* funeral directors
* cemetery operators
* crematoria
* memorial-garden providers

---

# 5. Audience

## Primary

Memorial industry businesses.

The visitor should think:

> “This looks premium enough that I could offer it to my customers.”

## Secondary

Families who encounter the brand organically.

They should immediately understand the emotional value without needing to understand the technology.

---

# 6. Positioning

Do not position LifeMarked as:

**“QR codes for gravestones.”**

Position it as:

**a premium digital memorial experience that connects the physical memorial with the story of the person behind it.**

Technology should feel almost invisible.

The emotional outcome matters more than the mechanism.

---

# 7. Competitive Design Goal

Most competitors in this category feel:

* dated
* utilitarian
* template-driven
* feature-led
* visually unsophisticated

LifeMarked must visibly raise the category standard.

The benchmark is not other QR memorial companies.

Think more like:

* luxury editorial design
* premium architectural brands
* modern museum experiences
* high-end book publishing
* premium hospitality
* beautifully crafted consumer brands

The website must feel intentionally art-directed.

---

# 8. Brand Personality

LifeMarked should feel:

* warm
* calm
* sophisticated
* understated
* premium
* human
* timeless
* thoughtful
* tactile
* trustworthy
* modern

Avoid:

* morbid
* gloomy
* excessively sentimental
* religious
* clinical
* corporate
* startup-like
* overtly technological
* gimmicky

---

# 9. Explicit Anti-AI-Slop Rules

Do not use:

* generic purple gradients
* neon
* floating glass cards
* excessive glassmorphism
* giant rounded rectangles everywhere
* repeated three-column icon grids
* feature-card walls
* fake dashboards
* bento grids merely because they are fashionable
* glowing buttons
* decorative blobs
* arbitrary gradient text
* generic stock icons
* endless pill-shaped labels
* excessive centre alignment
* huge bold SaaS headings
* formulaic “problem / solution / features / testimonials / pricing” layouts

Every section should feel like it belongs specifically to LifeMarked.

Before finalising each major section, ask:

> Could this section belong on any modern SaaS website?

If yes, redesign it.

---

# 10. Visual Language

Physical materials matter.

The design should evoke:

* stone
* engraved metal
* brass
* timber
* paper
* archival photography
* printed books
* physical craftsmanship

Technology should recede into the background.

Use generous whitespace and editorial asymmetry.

Not every section needs to fill the viewport or contain multiple components.

Some sections should simply contain one exceptional image and one strong line of copy.

---

# 11. Colour System

Use warm, restrained tones.

Suggested palette:

## Warm ivory

`#F4F0E8`

Primary page background.

## Charcoal

`#242422`

Main text.

## Warm grey

`#6E6A63`

Secondary text.

## Muted bronze

`#8C7456`

Accent.

Use sparingly.

## Deep charcoal

`#1D1D1B`

Dark editorial sections.

## Border

Use low-contrast warm grey / beige borders.

Avoid pure:

* `#FFFFFF`
* `#000000`

where a softer alternative is appropriate.

Do not overuse the bronze accent.

---

# 12. Typography

Typography is a major part of the visual identity.

## Serif

Use an elegant editorial serif for:

* hero headline
* emotional statements
* memorial names
* quotations
* major section titles where appropriate

Good candidates:

* Instrument Serif
* Cormorant Garamond
* Libre Baskerville

Select the strongest option based on actual rendering.

## Sans Serif

Use a clean modern sans for:

* body text
* nav
* buttons
* forms
* labels

Good candidates:

* Geist
* Inter
* Manrope

Avoid excessive font-weight variation.

Keep typography elegant and readable.

Body copy must never become tiny for aesthetic reasons.

Minimum normal body text:

`16px`

---

# 13. Global Layout

Maximum major content width:

approximately `1200–1320px`

Long-form reading width:

approximately `560–680px`

Use generous vertical spacing.

Do not put content into a box unless the box adds meaning.

Allow individual images and text blocks to breathe.

Use asymmetry intelligently.

---

# 14. Navigation

Minimal sticky navigation.

## Left

LifeMarked wordmark.

Initially text-only is fine.

## Right

* How it works
* Memorials
* For partners
* Contact

Primary CTA:

**Become a partner**

Navigation should be compact.

A subtle blurred background on scroll is acceptable.

Do not make it look like a SaaS navbar.

---

# 15. Hero

This is critical.

Target height:

roughly `85–95vh` desktop.

The hero should communicate:

* emotional value
* physical memorial
* premium positioning
* digital connection

Do not lead with product UI.

## Headline

**Every life leaves more than a name.**

## Supporting text

LifeMarked connects a physical memorial to the story behind it — photographs, memories, video, voice and the moments that made someone who they were.

## Primary CTA

**Become a launch partner**

## Secondary CTA

**See how it works**

Use a text-style secondary action rather than two competing large buttons.

## Visual

Use an exceptional cinematic image showing either:

* an elegant contemporary memorial stone
* a premium memorial bench

in a peaceful British environment.

The memorial should include a very discreet engraved metal QR marker.

The marker should feel integrated into the memorial, not stuck on afterwards.

The QR code must not dominate the composition.

---

# 16. Hero Motion

Motion must be subtle.

Potential implementation:

As the user begins scrolling:

* the physical memorial remains visually dominant
* a subtle phone / digital story element begins to emerge
* this foreshadows the physical-to-digital concept

Do not use scroll-jacking.

Do not delay access to content.

Respect `prefers-reduced-motion`.

---

# 17. Emotional Problem Section

Use substantial whitespace.

## Headline

**A name. Two dates. And an entire life in between.**

## Supporting text

A memorial tells us that someone was here.

LifeMarked helps preserve who they were.

Keep this section visually restrained.

Do not add cards or icons.

---

# 18. How It Works

Explain the concept in three steps.

Avoid generic icon cards.

Prefer one visual narrative.

## 01 — Mark

A discreet, weather-resistant LifeMarked marker is added to the memorial.

## 02 — Scan

Visitors scan it instantly using a phone camera.

No app required.

## 03 — Remember

The person's story opens — photographs, milestones, memories, video, voice and contributions from people who knew them.

Potential layout:

A continuous horizontal journey on desktop that becomes vertical on mobile.

---

# 19. Signature Product Demonstration

This section must be one of the most visually impressive parts of the page.

## Heading

**A memorial can tell a story.**

Use a fictional memorial profile.

## Fictional person

**Margaret Eleanor Campbell**

**1941 — 2025**

The memorial experience should resemble:

* an editorial biography
* a premium digital archive
* a beautifully produced life story

It should not resemble:

* Facebook
* a CRM
* a memorial database
* a profile directory

Label the demo:

**Concept preview**

---

# 20. Margaret Memorial Content

Create a realistic visual prototype.

## Hero

Large portrait.

Name:

**Margaret Eleanor Campbell**

Dates:

**1941 — 2025**

Opening line:

**Margaret made every room feel warmer.**

## Biography

Use concise editorial paragraphs.

## Timeline

Example:

**1941**
Born in Edinburgh.

**1963**
Married James.

**1968**
Moved into their first family home.

**1985**
Opened Campbell Florists.

**1999**
Welcomed her first grandchild.

**2012**
Travelled through Italy.

**2025**
Remembered by three generations.

## Gallery

Show:

* portrait
* wedding
* family
* travel
* candid life moments

## Voice

Display an elegant audio component.

Copy:

**Hear Margaret tell the story of how she met James**

It does not need live audio yet.

## Video

Show a subtle archival video thumbnail.

## Memories

Example:

> Gran never let anyone leave her house hungry.

Include a few short contributions.

## Favourite things

Possible editorial presentation:

**Sunday roast**
**Gardening**
**Florence**
**Ella Fitzgerald**
**Handwritten letters**

This helps the profile feel like a real human being.

---

# 21. Physical-to-Digital Interaction

Create a tasteful interaction demonstrating:

**physical memorial → scan → story**

Potential implementation:

1. Show memorial.
2. Highlight the discreet LifeMarked marker.
3. User selects:
   **Explore Margaret's story**
4. Transition to the digital memorial.
5. Digital story becomes the dominant visual element.

This should feel fluid and premium.

Avoid gimmicky phone rotations or overly animated QR effects.

---

# 22. Product Philosophy

## Headline

**The technology should disappear. The person should remain.**

Supporting copy:

The QR code is simply the bridge.

LifeMarked is designed around the story it reveals — not the technology behind it.

Use this section to reinforce differentiation from commodity QR products.

---

# 23. Memorial Locations

## Headline

**Stories can live wherever memories do.**

Show LifeMarked across:

* headstones
* memorial benches
* plaques
* memorial trees
* cremation memorials
* gardens
* private memorials

Avoid six identical cards.

Use large imagery, editorial cropping and minimal labels.

Possible layout:

a sequence of image-led panels or an asymmetrical photographic grid.

If using a grid, it must feel editorial rather than like a SaaS bento layout.

---

# 24. Physical Product

## Headline

**Designed to belong.**

Supporting copy:

LifeMarked markers are designed to sit quietly within the memorial — not compete with it.

Show concept finishes.

## Stone / Silver

Brushed stainless steel.

## Heritage

Muted brass or bronze.

## Discreet

Small darker engraved marker.

Label them:

**Concept finishes**

Do not imply manufacturing has been finalised.

Avoid generic QR stickers.

The physical product must feel premium enough to sit alongside a £1,000+ memorial.

---

# 25. Digital Memorial Experience

## Heading

**More than a profile. A life remembered beautifully.**

Show the digital experience through large realistic mockups.

Conceptual future capabilities:

* biography
* timeline
* photographs
* audio
* video
* memories
* places
* favourite things
* family contributions

Do not show these as a generic eight-feature icon grid.

Demonstrate them inside the actual memorial experience.

---

# 26. Assisted Story Creation

## Headline

**Every family has the memories. We help shape the story.**

Supporting text:

Families can bring together photographs, memories, recordings and existing documents.

LifeMarked is being designed to help organise them into a beautifully structured life story.

Supporting ideas may include:

* photographs
* eulogies
* family memories
* voice recordings
* documents
* family contributions

Do not lead with the words:

**AI-powered**

AI can ultimately support the workflow, but the user-facing value is preserving and structuring memories.

---

# 27. Trust and Longevity

This section is strategically important.

## Headline

**A memorial should outlive the technology behind it.**

Explain the intended principles of the platform.

Possible points:

* direct memorial URLs
* downloadable archives
* exportable memorial data
* family ownership of content
* portable media
* minimal reliance on proprietary QR redirects

Do not claim:

**hosted forever**

Do not promise permanent service.

Instead demonstrate thoughtful architecture and portability.

---

# 28. Partner Proposition

This is the primary commercial section.

Visually distinguish it using a deep charcoal or similarly premium treatment.

## Headline

**A new memorial service for your customers.**

Supporting copy:

LifeMarked is designed to sit alongside the memorial products families already purchase.

Partners can offer a premium digital memorial without needing to build, host or support the technology themselves.

---

# 29. Partner Benefits

Do not present as generic feature cards unless the design can make them genuinely editorial.

Benefits:

## Additional revenue

Offer LifeMarked as a premium add-on alongside existing memorial sales.

## No technical setup

LifeMarked handles the digital experience.

## Meaningful differentiation

Give families an option beyond the traditional inscription.

## Simple fulfilment

The partner introduces LifeMarked.

LifeMarked handles the customer experience.

---

# 30. Partner Workflow

Communicate the future operating model clearly.

**Offer LifeMarked**

↓

**Family selects it**

↓

**LifeMarked marker is supplied**

↓

**Family builds their story**

↓

**Partner earns from the sale**

Do not publish commission figures yet.

---

# 31. Launch Partner CTA

Copy:

**We're currently speaking with a small number of UK memorial businesses about an initial LifeMarked pilot.**

Supporting line:

Help shape how LifeMarked works for memorial professionals and their customers.

CTA:

**Become a launch partner**

Do not create fake urgency.

---

# 32. Final CTA

Make the final section emotionally strong but restrained.

Preferred headline:

**Their name deserves to be remembered.
Their story deserves to be known.**

CTA:

**Become a launch partner**

Secondary:

**Talk to us**

Do not clutter this section.

---

# 33. Contact Form

Fields:

* Name
* Business name
* Email
* Website
* Optional message

CTA:

**I'm interested**

Success state:

**Thank you. We'll be in touch shortly.**

Keep this extremely simple.

---

# 34. Footer

Minimal.

**LifeMarked**

Small copy:

**An AlbaNova concept**

Links:

* Contact
* Privacy

Do not create a large footer sitemap.

---

# 35. Imagery

Imagery is one of the most important aspects of the site.

Do not use mediocre stock photographs simply to fill space.

Use high-quality generated or bespoke-style photography.

If final assets do not yet exist, build with strong placeholders that can be replaced easily.

Visual direction:

* photorealistic
* premium editorial photography
* soft natural light
* subtle grain
* muted colour palette
* shallow depth of field where appropriate
* believable British environments
* realistic stone / metal / timber textures

Avoid:

* obvious AI faces
* exaggerated sadness
* funeral actors
* stereotypical grieving scenes
* giant QR codes
* cemetery clichés
* generic hands holding phones

---

# 36. Recommended Image Assets

Build around these paths:

```text
/public/images/hero-memorial.webp
/public/images/plaque-closeup.webp
/public/images/bench-memorial.webp
/public/images/headstone-memorial.webp
/public/images/phone-profile.webp

/public/images/margaret/portrait.webp
/public/images/margaret/family-1.webp
/public/images/margaret/wedding.webp
/public/images/margaret/travel.webp
/public/images/margaret/candid.webp
```

Ensure replacement images can be dropped in without redesigning sections.

---

# 37. Tech Stack

Use:

* Next.js
* App Router
* TypeScript
* Tailwind CSS
* Framer Motion
* Vercel

Use modern stable package versions already compatible with the environment.

Avoid unnecessary dependencies.

Do not introduce a component framework unless genuinely needed.

Prefer bespoke components.

---

# 38. Suggested Project Structure

```text
app/
  page.tsx
  api/
    contact/
      route.ts

components/
  Navigation.tsx
  Hero.tsx
  ProblemStatement.tsx
  HowItWorks.tsx
  MemorialDemo.tsx
  ProductPhilosophy.tsx
  MemorialLocations.tsx
  PhysicalProduct.tsx
  DigitalExperience.tsx
  StoryCreation.tsx
  Longevity.tsx
  Partners.tsx
  PartnerWorkflow.tsx
  FinalCTA.tsx
  ContactForm.tsx
  Footer.tsx
```

This structure is guidance, not a requirement.

Do not over-componentise purely to create files.

---

# 39. Contact API

Create:

`POST /api/contact`

Expected body:

```ts
{
  name: string
  business: string
  email: string
  website?: string
  message?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}
```

Server-side route should forward the request to:

```text
LIFEMARKED_WEBHOOK_URL
```

This environment variable will point to an n8n webhook.

Do not expose the webhook URL client-side.

Validate required fields server-side.

Return clear success/error responses.

---

# 40. Analytics

Use Vercel Analytics if available.

Track meaningful conversion events.

Recommended:

```text
hero_partner_cta
nav_partner_cta
see_how_it_works
demo_opened
demo_audio_clicked
partner_section_cta
contact_form_started
contact_form_submitted
final_cta_clicked
```

Capture UTM parameters.

Preserve UTM values through to contact submission.

Do not overengineer analytics.

---

# 41. Metadata and SEO

Set title:

**LifeMarked — Every Life Leaves More Than a Name**

Description:

**LifeMarked connects physical memorials with the stories, photographs, voices and memories behind them.**

Canonical:

`https://lifemarked.alba-nova.com`

Add:

* OpenGraph title
* OpenGraph description
* OpenGraph image
* Twitter metadata
* favicon
* sensible robots metadata

Do not spend significant time writing SEO pages.

This site is primarily an outbound validation asset.

---

# 42. Accessibility

Target WCAG AA.

Requirements:

* semantic HTML
* correct heading order
* labelled inputs
* keyboard accessibility
* visible focus states
* adequate contrast
* useful alt text
* minimum sensible tap-target sizes
* minimum 16px body text
* reduced-motion support
* no interactions dependent solely on hover

The likely end audience includes older users, so accessibility is particularly important.

---

# 43. Mobile

Mobile is a primary experience.

Many outbound prospects will open the site directly from email on a phone.

Test approximately:

`390 x 844`

Requirements:

* no horizontal overflow
* intentional image crops
* readable hero
* primary CTA visible without excessive scrolling
* compact navigation
* no giant heading covering the entire initial viewport
* demo usable via tap
* no hover-only behaviour
* sensible line lengths
* comfortable touch targets

Do not simply stack the desktop layout and consider it done.

Art-direct mobile independently where required.

---

# 44. Motion

Use Framer Motion selectively.

Good uses:

* subtle entrance reveals
* image masking
* very gentle parallax
* physical-to-digital transition
* controlled opacity and scale
* narrative transitions

Avoid:

* bouncing
* springy SaaS interactions
* constant animation
* scroll-jacking
* excessive staggered text animation
* gratuitous motion

Animation should communicate craftsmanship.

---

# 45. Performance

Target Lighthouse:

* Performance 90+
* Accessibility 95+
* Best Practices 95+
* SEO 95+

Use:

* `next/image`
* responsive image sizing
* WebP / AVIF
* lazy loading below fold
* minimal client components
* efficient fonts
* sensible motion
* no unnecessary JS

Avoid layout shifts.

---

# 46. Content Tone

Copy should be:

* concise
* warm
* intelligent
* restrained
* confident
* human

Avoid phrases such as:

* revolutionary
* cutting-edge
* game-changing
* innovative solution
* seamless
* unlock
* leverage
* next generation
* powered by AI
* cherish forever
* redefining remembrance

Do not oversell.

Let the product concept and visual execution create the impact.

---

# 47. No Pricing Yet

Do not publish customer pricing on this validation page.

Do not publish partner commission.

The immediate goal is to start conversations.

---

# 48. No Testimonials

Do not create fake testimonials.

Do not create fake logos.

Do not use placeholder claims such as:

**Trusted by hundreds of families**

unless real evidence exists.

---

# 49. No Fake Product Maturity

The fictional Margaret memorial is an explicit **concept preview**.

Any UI shown as future functionality must be framed accordingly.

Avoid fake:

* profile counts
* usage statistics
* dashboards
* partner metrics

---

# 50. Design Review Criteria

After the first implementation, evaluate the page against these questions.

## Brand

Does this feel like a premium memorial brand rather than a funeral website?

## Category

Does it look noticeably better than the typical digital memorial / QR memorial website?

## Emotion

Does the site create emotional value without becoming sentimental?

## Product

Is it clear that LifeMarked is about preserving someone's story, not selling QR codes?

## Physical integration

Does the marker feel like part of the memorial rather than an accessory?

## Digital experience

Does Margaret's page feel like an editorial life story rather than a profile?

## Partner proposition

Could a stonemason understand the commercial proposition in under 20 seconds?

## Visual originality

Are there any sections that look like generic AI-generated landing-page design?

If yes, rework them.

## Mobile

Would you confidently send the mobile version directly to a prospective partner?

If no, keep iterating.

---

# 51. Playwright / Browser QA

After implementation, run automated and visual QA.

At minimum verify:

## Navigation

* all anchor links work
* sticky navigation behaves correctly
* mobile menu works if used

## CTAs

* CTA buttons navigate or open the intended form
* no dead buttons

## Contact form

Validate:

* empty required fields
* malformed email
* successful submission
* server error state
* loading state

## Responsive testing

Capture screenshots at:

```text
1440x1000
1280x800
768x1024
390x844
```

Inspect each manually.

## Console

Ensure:

* no React errors
* no hydration warnings
* no missing asset errors
* no failed API calls during normal browsing

## Layout

Check:

* no horizontal scrolling
* no text clipping
* no overlapping elements
* no overflow from animations
* no bad image distortion

## Reduced motion

Ensure major animations degrade gracefully.

---

# 52. Visual QA Loop

Do not stop after one screenshot review.

Perform:

**Build → render → screenshot → critique → adjust → rerender**

At least one full iteration should happen after the initial implementation.

Pay particular attention to:

* whether everything feels too symmetrical
* whether too many sections share the same composition
* whether the serif is overused
* whether the page becomes monotonous
* whether photography is carrying enough of the emotional experience
* whether the partner section feels commercially clear
* whether the page is too long
* whether any copy can be removed
* whether sections need more breathing room
* whether mobile feels designed rather than collapsed

---

# 53. Important Creative Principle

Do not optimise for filling the page.

Optimise for impact.

It is better to have:

* one exceptional photograph
* one powerful headline
* one short paragraph

than six mediocre UI elements.

Restraint is part of the design.

---

# 54. MVP Scope

## Build now

* complete landing page
* responsive implementation
* visual design system
* premium memorial concept
* Margaret concept preview
* partner proposition
* launch partner contact form
* webhook integration
* analytics
* metadata
* accessibility
* polished motion
* browser / Playwright QA

## Do not build now

* customer accounts
* authentication
* partner dashboard
* profile editing
* image uploads
* database
* payments
* physical plaque ordering
* family invitation system
* actual audio storage
* AI biography workflow
* content management system
* subscriptions
* admin platform

---

# 55. Definition of Done

The task is complete only when:

1. The page is fully responsive.
2. It deploys cleanly to Vercel.
3. It can be mapped to `lifemarked.alba-nova.com`.
4. The contact form posts through the configured server webhook.
5. Analytics are implemented.
6. There are no runtime or console errors.
7. The mobile experience is polished.
8. The fictional memorial is clearly labelled as a concept.
9. The site avoids unsupported claims.
10. The partner proposition is immediately understandable.
11. The website looks materially more modern and premium than the current QR memorial category.
12. No major section feels like generic AI-generated frontend work.
13. A prospective memorial business should reasonably leave with the impression:

> **“This looks like something premium I could genuinely offer my customers.”**

---

# 56. Final Instruction

The highest priority order is:

**visual quality → emotional storytelling → product clarity → partner conversion → technical completeness**

Do not sacrifice the first three merely to complete the page quickly.

The website is currently one of the most important pieces of evidence that LifeMarked can deliver a better memorial experience than existing providers.

Build accordingly.
