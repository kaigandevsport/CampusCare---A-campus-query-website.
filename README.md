# CampusCare — Campus Issue Reporting

CampusCare is a static college-campus issue-reporting interface. Students can describe a campus problem, choose its category and urgency, and save a copy of the report in their current browser.

> **Important:** This is a front-end project, not an official reporting channel. Reports are stored only in the browser's `localStorage`; they are not sent to campus staff or LPU. Do not enter sensitive or confidential information. Use the official [LPU UMS student dashboard](https://ums.lpu.in/lpuums/StudentDashboard.aspx) when you need higher assistance.

## Features

- Campus issue form for facilities, cleanliness, safety, IT/connectivity, academic spaces, and other concerns.
- Fields for campus area, location, title, description, urgency, and contact details.
- Browser-native form validation for required fields and input formats.
- Saves, lists, and deletes reports in the current browser using `localStorage`.
- Saves report text only. Optional evidence files are not uploaded or stored.
- Dark dashboard appearance with a royal-purple accent palette.
- Sidebar navigation, reporting guidance, next-step information, and a link to LPU UMS.

## Project files

```text
.
├── index.html   # Page content, navigation, reporting form, and accessible labels
├── styles.css   # Layout, colors, and visual styles
├── app.js       # Form handling and browser-local report storage
└── README.md    # Project and setup documentation
```

## Run locally

No package installation or build step is needed. From the project folder, start a simple local web server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser. You can also open `index.html` directly, but using a local web server is more consistent across browsers.

## How report storage works

1. The browser checks the required form fields using built-in HTML validation.
2. When a valid form is submitted, `app.js` collects the answers into a JavaScript object.
3. The script reads existing reports from `localStorage`, adds the new report, and saves the list as JSON under the key `campuscareReports`.
4. Saved reports are shown on the page and can be deleted individually or cleared together.
5. Reopening the site in the same browser profile loads the saved reports again.

The data stays in that browser profile on that device. It does not sync across devices or reach a campus office. Anyone with access to the same browser profile may be able to view it, and clearing browser data may remove it. The optional evidence-file input is not persisted.

## Publish with GitHub Pages

1. Push these project files to a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing the site (commonly `main`) and the project root (`/`), then save.
5. Open the published URL shown in the Pages settings.

Because this is a static site, GitHub Pages can host the interface without a server. Browser-local report storage still belongs to each visitor's browser; it does not create a shared reporting inbox.

## Technology

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`

There are no external packages or build tools required.
