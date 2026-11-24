// utils/formatText.js
// Cleans up whatever a recruiter pastes or types so job / internship content
// is stored (and shown to candidates) in one neat, consistent format.

const SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "nor",
  "of", "on", "or", "the", "to", "vs", "via", "with", "per",
]);

// Words that should always be UPPERCASE in titles / skills / degrees
const ACRONYMS = new Set([
  "it", "hr", "qa", "ui", "ux", "sql", "aws", "api", "grc", "kyc", "aml",
  "bfsi", "erp", "crm", "sap", "vba", "bi", "ai", "ml", "etl", "kri", "kpi",
  "mis", "bcp", "cfa", "frm", "mba", "bba", "bca", "mca", "cpa", "ca",
  "ifrs", "gaap", "sox", "iso", "gdpr", "rbi", "sebi", "nlp", "ceo", "cfo",
  "cto", "coo", "vp", "esg", "tprm", "sla", "seo", "sdlc", "html", "css",
  "xml", "json", "php", "ifrs9", "basel", "csr", "pmo", "sme", "btech",
]);

const ABBREVIATIONS = new Set([
  "e.g", "i.e", "etc", "vs", "approx", "incl", "sr", "jr", "dr", "mr", "mrs", "no",
]);

const capitalize = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w);

/** Collapse extra spaces / line breaks into a single clean line. */
export function cleanLine(str) {
  return String(str ?? "").replace(/\s+/g, " ").trim();
}

function titleWord(word, isEdge, allCapsInput) {
  const m = word.match(/^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/);
  if (!m || !m[2]) return word;
  const [, pre, core, post] = m;

  // hyphen / slash compounds: Full-Time, UI/UX
  if (/[-/]/.test(core) && core.length > 1) {
    const parts = core.split(/([-/])/).map((p) =>
      /[-/]/.test(p) ? p : titleWord(p, true, allCapsInput)
    );
    return pre + parts.join("") + post;
  }

  // dotted forms: b.tech -> B.Tech
  if (core.includes(".")) {
    const parts = core.split(".").map((p) => titleWord(p, true, allCapsInput));
    return pre + parts.join(".") + post;
  }

  const lower = core.toLowerCase();
  const upper = core.toUpperCase();
  const isMixed = core !== lower && core !== upper && core !== capitalize(core);

  if (ACRONYMS.has(lower)) return pre + upper + post;
  if (isMixed) return pre + core + post; // PowerBI, iOS, eBay …
  if (!allCapsInput && core === upper && core.length <= 3 && /[A-Z]/.test(core)) {
    return pre + core + post; // short acronym already typed in caps
  }
  if (!isEdge && SMALL_WORDS.has(lower)) return pre + lower + post;
  return pre + capitalize(core) + post;
}

/** "senior risk analyst" / "SENIOR RISK ANALYST" -> "Senior Risk Analyst" */
export function toTitleCase(str) {
  const t = cleanLine(str);
  if (!t) return "";
  const allCapsInput = !/[a-z]/.test(t);
  const words = t.split(" ");
  return words
    .map((w, i) => titleWord(w, i === 0 || i === words.length - 1, allCapsInput))
    .join(" ");
}

const BULLET_LINE = /^\s*(?:[-*•●▪◦■✓✔➤►–—]+)\s+/;
const NUMBER_LINE = /^\s*(\d+)[.)]\s+/;

/** Clean a pasted paragraph / multi-line description. */
export function cleanText(str) {
  if (!str) return "";
  let t = String(str)
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!t) return "";

  // Shouting (ALL CAPS) -> normal text
  const letters = t.replace(/[^A-Za-z]/g, "");
  const uppers = t.replace(/[^A-Z]/g, "");
  if (letters.length >= 15 && uppers.length / letters.length > 0.7) t = t.toLowerCase();

  // Normalise bullets / numbering at the start of lines
  t = t
    .split("\n")
    .map((line) => {
      if (BULLET_LINE.test(line)) return "• " + line.replace(BULLET_LINE, "");
      const n = line.match(NUMBER_LINE);
      if (n) return `${n[1]}. ` + line.replace(NUMBER_LINE, "");
      return line;
    })
    .join("\n");

  // Spacing around punctuation
  t = t.replace(/ +([,.;:!?])/g, "$1").replace(/,(?=[^\s\d])/g, ", ");

  // Capital letter at the start of every line / bullet
  t = t.replace(/(^|\n)((?:•|\d+\.) )?([a-z][A-Za-z0-9]*)/g, (m, a, b, w) =>
    a + (b || "") + (ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))
  );

  // Capital letter at the start of every sentence (skip e.g. / i.e. / etc.)
  t = t.replace(/([.!?]["')\]]?\s+)([a-z])/g, (m, p, c, offset) => {
    const prev = (t.slice(0, offset).match(/(\S+)$/) || [""])[1].toLowerCase();
    return ABBREVIATIONS.has(prev) ? m : p + c.toUpperCase();
  });

  return t;
}

/**
 * Turn pasted content into a clean array of points.
 * Understands: one point per line, "•" / "-" / "1." bullets, inline bullets,
 * and comma / semicolon separated text.
 */
export function toList(input, { title = false } = {}) {
  if (Array.isArray(input)) input = input.join("\n");
  if (!input) return [];

  let t = String(input).replace(/\r\n?/g, "\n").replace(/\s*[•●▪◦■✓✔➤►]\s*/g, "\n");
  let parts;

  if (/\n/.test(t.trim())) {
    parts = t.split("\n");
  } else if ((t.match(/(?:^|\s)\d+[.)]\s/g) || []).length > 1) {
    parts = t.split(/\s+(?=\d+[.)]\s)/);
  } else if (t.includes(";")) {
    parts = t.split(";");
  } else {
    parts = t.split(",");
  }

  const seen = new Set();
  const out = [];
  parts.forEach((raw) => {
    let item = cleanLine(raw)
      .replace(/^(?:[-*–—]+|\d+[.)])\s+/, "")
      .replace(/[.;,]+$/, "")
      .trim();
    if (!item) return;
    if (title) {
      item = toTitleCase(item);
    } else {
      if (/[A-Z]/.test(item) && !/[a-z]/.test(item) && item.length > 6) item = item.toLowerCase();
      item = item.charAt(0).toUpperCase() + item.slice(1);
    }
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  });
  return out;
}

/**
 * Used on blur so the recruiter immediately sees the cleaned value.
 * rule: "title" | "line" | "text" | "list" | "titlelist"
 */
export function formatByRule(rule, value) {
  switch (rule) {
    case "title":     return toTitleCase(value);
    case "line":      return cleanLine(value);
    case "text":      return cleanText(value);
    case "list":      return toList(value).join("\n");
    case "titlelist": return toList(value, { title: true }).join(", ");
    default:          return value;
  }
}
