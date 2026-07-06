// Minimal, safe markdown-to-HTML conversion for admin-authored article
// bodies. Deliberately not a full markdown library — supports exactly
// what the Resources CMS needs (paragraphs, bold, italic, links), nothing
// more, to keep this small and predictable.
//
// Safety: raw HTML is escaped BEFORE any formatting is applied, so even if
// an admin pastes something that looks like a tag, it renders as visible
// text rather than executing. This matters even for trusted admin input —
// defence in depth costs nothing here.

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderArticleBody(markdown: string): string {
  const escaped = escapeHtml(markdown);

  const paragraphs = escaped.split(/\n\s*\n/).map((block) => {
    let html = block.trim();
    if (!html) return "";

    // Links: [text](https://...) — only allow http(s) URLs, never javascript: etc.
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Bold and italic
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Single newlines within a paragraph become line breaks
    html = html.replace(/\n/g, "<br/>");

    return `<p>${html}</p>`;
  });

  return paragraphs.filter(Boolean).join("\n");
}
