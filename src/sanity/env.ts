export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// Project id is public (not a secret). Defaulting it here means the app and the
// `sanity` CLI both target the real project without requiring env wiring; the env
// var still overrides for forks/other datasets.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7exdt97n';

/** True once a Sanity project id is configured. Pages fall back to seed content when empty. */
export const sanityConfigured = Boolean(projectId);
