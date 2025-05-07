import React, { useState } from 'react';
import { createFileChunks, getFileHash, getFileHashByWebWorker } from './utils';

const Demo = () => {
  const [createHashLoading, setCreateHashLoading] = useState(false);
  const [fileChunks, setFileChunks] = useState<Blob[]>([]);
  const [fileHash, setFileHash] = useState<string>();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    if (!event.target.files) return;

    setCreateHashLoading(true);
    const chunks = createFileChunks(event.target.files[0]);
    const fileHash = window.Worker
      ? await getFileHashByWebWorker(chunks).finally(() =>
          setCreateHashLoading(false),
        )
      : await getFileHash(chunks).finally(() => setCreateHashLoading(false));

    setFileChunks(chunks);
    setFileHash(fileHash);
  };
  console.log('fileHash', fileHash);
  console.log('fileChunks', fileChunks);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div>
        {createHashLoading ? '正在计算文件hash' : 'hash：' + (fileHash || '-')}
      </div>
    </div>
  );
};

export default Demo;
