MG3 Unit 4 — Third Secondary Class 3-4
Teacher: Ghaliah Al-Shamrani

Files: index.html, style.css, app.js, questions.json.

1. Create a NEW GitHub repository, e.g. mg3-unit4-interactive. Upload these four website files to the repository root. Enable GitHub Pages from main / root.
2. In the EXISTING Google Sheets file, create a new tab named exactly: MG3 Results.
3. IMPORTANT: The Google Apps Script must be modified to route incoming JSON with workbook="MG3" to the MG3 Results tab, while preserving the existing MG2 logic and duplicate prevention. Add a unique submission ID check. Deploy the revised Apps Script as a new version. Do not overwrite the MG2 sheet or replace its current logic without testing.
4. AFTER the Apps Script change, paste the verified deployed web-app URL into RESULTS_ENDPOINT at the top of app.js, replacing the empty string.
5. Test submission from a new name, verify its row appears in MG3 Results, then test MG2 again and confirm it still reaches its original tab.

NOTE: This package is not yet connected to Google Sheets. The submit button intentionally blocks sending until the endpoint is configured. GitHub Pages serves static files; results require the separate Google Apps Script.

Content follows the six-page PDF provided. The image-matching exercise uses descriptive emoji in place of the PDF's original illustrations. For the movie-genre classification, some titles can fit multiple genres; the configured keys follow a best-fit classroom interpretation and should be reviewed before publishing. The PDF itself does not provide an answer key. The written questions remain teacher-reviewed. The Reading diagram has five blank slots as in the PDF.
