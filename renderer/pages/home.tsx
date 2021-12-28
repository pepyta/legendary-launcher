import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppBar from '@components/misc/AppBar';
import { Button } from '@mui/material';
import DownloadManager from '@lib/legendary/DownloadManager';

function Home() { 
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <AppBar />
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/next">
            <a>Go to next page</a>
          </Link>
          <Button onClick={() => DownloadManager.test()}>
            asd
          </Button>
        </p>
        <img src="/images/logo.png" />

      </div>
    </React.Fragment>
  );
};

export default Home;
