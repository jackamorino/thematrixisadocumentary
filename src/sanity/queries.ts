import { groq } from 'next-sanity';

const postFields = groq`
  _id,
  title,
  "slug": slug.current,
  cycle,
  excerpt,
  coverImage,
  body,
  featured,
  publishedAt,
  seo
`;

export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${postFields}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields}
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

export const relatedPostsQuery = groq`
  *[_type == "post" && slug.current != $slug && defined(slug.current)]
    | order(publishedAt desc)[0...3] {
    ${postFields}
  }
`;

export const allVideosQuery = groq`
  *[_type == "video"] | order(featured desc, publishedAt desc) {
    _id, title, youtubeId, cycle, featured, publishedAt
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    showVideos,
    signupHeadline,
    signupBlurb,
    buyLinks,
    socialLinks
  }
`;

export const authorQuery = groq`
  *[_type == "author"][0] {
    name,
    bio,
    quote,
    photo
  }
`;
