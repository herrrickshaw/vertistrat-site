export const SITE_NAME = "VertiStrat Solutions LLP";
export const CONTACT_EMAIL = "contact@vertistratsolution.com";
export const CONTACT_PHONE_DISPLAY = "+91 70222 59460";
export const CONTACT_PHONE_TEL = "+917022259460";
export const OFFICE_ADDRESS_LINES = [
  "Plot No. 141, Gurusamy Road",
  "Near Queen Street & VGN Monte Carlo",
  "Nolambur, Chennai 600095",
  "Tamil Nadu, India",
];
export const OFFICE_MAP_URL = "https://maps.app.goo.gl/GJttKbejiqa7yPgR6";
export const OFFICE_MAP_EMBED_URL = "https://www.google.com/maps?q=13.0698439,80.1638938&z=16&output=embed";

// Contact form delivery: our Google Form (owned by contact@vertistratsolution.com).
// GOOGLE_FORM_URL opens it full-page; GOOGLE_FORM_EMBED_URL is the same form sized for the iframe.
export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd--m9-cFuThNg9y9phKTJzgTD4BqaaFy_8GApDB9zJwswPXw/viewform";
export const GOOGLE_FORM_EMBED_URL = `${GOOGLE_FORM_URL}?embedded=true`;

// Public blog address (custom domain). Feeds are read from the custom domain over HTTPS.
export const BLOG_URL = "https://blog.vertistratsolution.com";
export const BLOG_HOST = "blog.vertistratsolution.com";
export const BLOG_SOURCE_URL = "https://blog.vertistratsolution.com";
export const BLOG_POST_FEED_BASE = `${BLOG_SOURCE_URL}/feeds/posts/default`;
export const BLOG_FEED_URL = `${BLOG_SOURCE_URL}/feeds/posts/default?alt=json&max-results=12`;
export const MAX_FEATURED = 3;

export const GITHUB_USER = "herrrickshaw";
export const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`;

// PLACEHOLDER: replace REPLACE_REPO with the repository that hosts trade_ideas.json
export const TRADE_IDEAS_URL =
  "https://raw.githubusercontent.com/herrrickshaw/REPLACE_REPO/main/trade_ideas.json";
export const TRADE_STALE_DAYS = 7;

export const DISCLAIMER =
  "Information only. Not investment advice. Not a recommendation to buy or sell any security. Replace with the firm's regulatory registration details and risk disclosures before publishing.";
