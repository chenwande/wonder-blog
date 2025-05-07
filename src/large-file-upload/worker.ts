import { getFileHash } from './utils';

self.onmessage = async function (e: MessageEvent<{ chunks: Blob[] }>) {
  const hash = await getFileHash(e.data.chunks);
  self.postMessage(hash);
};
