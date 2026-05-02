$(document).ready(function() {
    // Remove the affiliations column from Distill bylines.
    document.querySelectorAll("d-byline").forEach(function(byline) {
        const root = byline.shadowRoot;
        if (!root) return;

        const headings = root.querySelectorAll("h3");
        headings.forEach(function(heading) {
            if (heading.textContent.trim().toLowerCase() === "affiliations") {
                heading.remove();
            }
        });

        root.querySelectorAll("p.affiliation").forEach(function(affiliation) {
            affiliation.remove();
        });

        const authors = root.querySelector(".authors-affiliations");
        if (authors) {
            authors.style.gridTemplateColumns = "1fr";
        }
    });

    // Override styles of the footnotes.
    document.querySelectorAll("d-footnote").forEach(function(footnote) {
        footnote.shadowRoot.querySelector("sup > span")
            .setAttribute("style", "color: var(--global-theme-color);");
        footnote.shadowRoot.querySelector("d-hover-box").shadowRoot.querySelector("style").sheet
            .insertRule(".panel {background-color: var(--global-bg-color) !important;}");
        footnote.shadowRoot.querySelector("d-hover-box").shadowRoot.querySelector("style").sheet
            .insertRule(".panel {border-color: var(--global-divider-color) !important;}");
    });
    // Override styles of the citations.
    document.querySelectorAll("d-cite").forEach(function(cite) {
        cite.shadowRoot.querySelector("div > span")
            .setAttribute("style", "color: var(--global-theme-color);");
        cite.shadowRoot.querySelector("style").sheet
            .insertRule("ul li a {color: var(--global-text-color) !important; text-decoration: none;}");
        cite.shadowRoot.querySelector("style").sheet
            .insertRule("ul li a:hover {color: var(--global-theme-color) !important;}");
        cite.shadowRoot.querySelector("d-hover-box").shadowRoot.querySelector("style").sheet
            .insertRule(".panel {background-color: var(--global-bg-color) !important;}");
        cite.shadowRoot.querySelector("d-hover-box").shadowRoot.querySelector("style").sheet
            .insertRule(".panel {border-color: var(--global-divider-color) !important;}");
    });
})
