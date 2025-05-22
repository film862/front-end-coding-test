import Head from 'next/head';
import { Button } from '@mui/material';

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js + MUI + Tailwind</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-700">Welcome to the MUI + TailwindCSS + Next.js Template!</h1>
        <Button variant="contained" color="primary" className="mt-4">
          MUI Button
        </Button>
      </main>
    </>
  );
}
