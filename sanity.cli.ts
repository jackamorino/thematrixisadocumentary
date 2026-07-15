import { defineCliConfig } from 'sanity/cli';

/**
 * Sanity CLI config — used by `sanity deploy` / `sanity dataset` etc.
 * studioHost sets the hosted Studio URL: https://thematrixisadocumentary.sanity.studio
 */
export default defineCliConfig({
  api: {
    projectId: '7exdt97n',
    dataset: 'production',
  },
  studioHost: 'thematrixisadocumentary',
  deployment: {
    appId: 'cbujt7q983mv94pes2o4gfiw',
    autoUpdates: true,
  },
});
