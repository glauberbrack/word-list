import { cleanup } from '@testing-library/react-native';

import { clearQueryClients } from './render-with-providers';

afterEach(async () => {
  await cleanup();
  await clearQueryClients();
});
