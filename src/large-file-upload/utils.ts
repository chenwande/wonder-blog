import SparkMd5 from 'spark-md5';

export const createFileChunks = (file: File, chunkSize = 10 * 1024 * 1024) => {
  const chunks: Blob[] = [];
  for (let i = 0; i < file.size; i += chunkSize) {
    chunks.push(file.slice(i, i + chunkSize));
  }
  return chunks;
};

export const getFileHash = (chunks: Blob[]): Promise<string> =>
  new Promise((resolve) => {
    const spark = new SparkMd5();

    const _read = (chunkIndex: number) => {
      if (chunkIndex >= chunks.length) {
        resolve(spark.end());
        return;
      }
      const blob = chunks[chunkIndex];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        const bytes = e.target.result;
        spark.append(bytes);
        _read(chunkIndex + 1);
      };
      reader.readAsArrayBuffer(blob);
    };

    _read(0);
  });

export const getFileHashByWebWorker = (chunks: Blob[]): Promise<string> => {
  return new Promise((resolve) => {
    // @ts-ignore
    const worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.postMessage({ chunks });
    worker.onmessage = function (e) {
      resolve(e.data);
    };
  });
};


/* 
./worker.ts文件

import { getFileHash } from './utils';

self.onmessage = async function (e: MessageEvent<{ chunks: Blob[] }>) {
  const hash = await getFileHash(e.data.chunks);
  self.postMessage(hash);
};

*/