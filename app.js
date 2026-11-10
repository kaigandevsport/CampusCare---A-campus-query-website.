/* CampusCare: save report text in this browser with localStorage. */
(() => {
  "use strict";

  // 1. Connect JavaScript to the form and saved-report area in index.html.
  const form = document.getElementById("campus-report-form");
  const formStatus = document.getElementById("form-status");
  const reportList = document.getElementById("saved-reports-list");
  const storageStatus = document.getElementById("storage-status");
  const clearButton = document.getElementById("clear-saved-reports");
  const STORAGE_KEY = "campuscareReports";

  if (!form || !reportList) return;

  // 2. Read and write the reports as JSON text in localStorage.
  function getReports() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  function saveReports(reports) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }

  function showMessage(element, text, state = "") {
    if (!element) return;
    element.textContent = text;
    element.dataset.state = state;
  }

  function readField(selector) {
    return (form.querySelector(selector)?.value || "").trim();
  }

  // Collect the form answers into one plain JavaScript object.
  function makeReport() {
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      submittedAt: new Date().toISOString(),
      category: form.querySelector('#issue-category input[type="radio"]:checked')?.value || "",
      urgency: form.querySelector('#issue-urgency input[type="radio"]:checked')?.value || "",
      campusArea: readField("#campus-area"),
      location: readField("#campus-location"),
      title: readField("#report-title-input"),
      description: readField("#report-description"),
      email: readField("#contact-email"),
      phone: readField("#contact-phone"),
    };
  }

  // Create text elements safely so a report is never treated as HTML code.
  function textElement(tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function addDetail(list, label, value) {
    list.append(textElement("dt", label), textElement("dd", value || "Not provided"));
  }

  function categoryName(code) {
    const names = {
      facilities: "Facilities",
      cleanliness: "Cleanliness",
      safety: "Safety",
      it: "IT & connectivity",
      academics: "Academic spaces",
      other: "Something else",
    };
    return names[code] || code || "Not provided";
  }

  // Turn one saved report into a card with details and a Delete button.
  function makeReportCard(report) {
    const card = document.createElement("article");
    card.className = "saved-report";

    const header = document.createElement("div");
    header.className = "saved-report-header";
    const heading = document.createElement("div");
    heading.append(
      textElement(
        "p",
        `${categoryName(report.category)} · ${report.urgency || "Urgency not provided"}`,
        "saved-report-category",
      ),
      textElement("h3", report.title || "Untitled report"),
    );

    const date = new Date(report.submittedAt);
    const dateText = Number.isNaN(date.getTime()) ? "Saved report" : date.toLocaleString();
    const time = textElement("time", dateText, "saved-report-date");
    time.dateTime = report.submittedAt;
    heading.append(time);

    const deleteButton = textElement("button", "Delete", "saved-report-delete");
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `Delete saved report: ${report.title || "Untitled report"}`);
    deleteButton.addEventListener("click", () => deleteReport(report.id));
    header.append(heading, deleteButton);

    const details = document.createElement("details");
    details.className = "saved-report-details";
    details.append(textElement("summary", "View saved response"));
    const fields = document.createElement("dl");
    fields.className = "saved-report-fields";

    [
      ["Category", categoryName(report.category)],
      ["Urgency", report.urgency],
      ["Campus area", report.campusArea],
      ["Building / room", report.location],
      ["Description", report.description],
      ["Contact email", report.email],
      ["Contact phone", report.phone],
    ].forEach(([label, value]) => addDetail(fields, label, value));

    details.append(fields);
    card.append(header, details);
    return card;
  }

  // Load saved reports and refresh the list shown on the page.
  function showSavedReports() {
    const reports = getReports();
    reports.sort((first, second) => new Date(second.submittedAt) - new Date(first.submittedAt));
    reportList.replaceChildren();

    if (reports.length === 0) {
      reportList.append(textElement("p", "No reports are saved in this browser yet.", "saved-reports-empty"));
    } else {
      reports.forEach((report) => reportList.append(makeReportCard(report)));
    }

    if (clearButton) clearButton.disabled = reports.length === 0;
    const word = reports.length === 1 ? "report" : "reports";
    showMessage(storageStatus, `${reports.length} ${word} saved in this browser.`, "success");
  }

  // 3. Save a valid form locally instead of submitting it to a server.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fileSelected = Boolean(document.getElementById("evidence-file")?.files?.length);
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    try {
      const reports = getReports();
      reports.unshift(makeReport());
      saveReports(reports);
      form.reset();
      showSavedReports();

      const message = fileSelected
        ? "Report text saved. The selected evidence file was not saved."
        : "Report saved in this browser only; it was not sent to campus staff.";
      showMessage(formStatus, message, "success");
      document.getElementById("saved-reports")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      showMessage(formStatus, `Could not save this report: ${error.message}`, "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  // Remove one saved report by its unique ID.
  function deleteReport(id) {
    try {
      saveReports(getReports().filter((report) => report.id !== id));
      showSavedReports();
      showMessage(formStatus, "Saved report deleted from this browser.", "success");
    } catch (error) {
      showMessage(storageStatus, `Could not delete this report: ${error.message}`, "error");
    }
  }

  // Clear every report after the user confirms.
  clearButton?.addEventListener("click", () => {
    if (!window.confirm("Delete every report saved in this browser?")) return;

    try {
      saveReports([]);
      showSavedReports();
      showMessage(formStatus, "All saved reports were deleted.", "success");
    } catch (error) {
      showMessage(storageStatus, `Could not clear reports: ${error.message}`, "error");
    }
  });

  // Display reports saved during an earlier visit.
  try {
    showSavedReports();
  } catch (error) {
    showMessage(storageStatus, `Browser storage is unavailable: ${error.message}`, "error");
    if (clearButton) clearButton.disabled = true;
  }
})();
