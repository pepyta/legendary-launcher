import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@mui/material';
import CommandHandler from '@lib/CommandHandler';
import LegendaryUser from '@lib/legendary/LegendaryUser';
import AppBar from '@components/misc/AppBar';
import SideNav from '@components/misc/SideNav';

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
        </p>
        <img src="/images/logo.png" />

      </div>
    </React.Fragment>
  );
};

export default Home;
