import type { StructureResolver } from 'sanity/structure';

/**
 * Studio desk structure. siteSettings and author are singletons (one document each);
 * posts and videos are regular lists.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
      S.listItem()
        .title('Author')
        .id('author')
        .child(S.document().schemaType('author').documentId('author')),
      S.divider(),
      S.documentTypeListItem('post').title('Blog Posts (Keys)'),
      S.documentTypeListItem('video').title('Videos'),
    ]);
