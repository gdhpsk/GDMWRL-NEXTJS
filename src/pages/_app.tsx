import type { AppProps } from 'next/app'
import Head from "next/head"
import "@/styles/globals.css"
import Nav from '@/components/Nav'
import "@sweetalert2/themes/dark/dark.css"

import { Lato } from '@next/font/google'

const inter = Lato({ weight: ['400'], subsets: ['latin-ext'] })

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjMVk_yFoTBrIjARo9DuOi3xr_3qDC5Ss",
  authDomain: "mwrl-7b27f.firebaseapp.com",
  projectId: "mwrl-7b27f",
  storageBucket: "mwrl-7b27f.appspot.com",
  messagingSenderId: "859550591453",
  appId: "1:859550591453:web:014b6fadcea5e733f9ee34",
  measurementId: "G-53JQLS585T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App({ Component, pageProps, active }: AppProps | any) {
  return <>
  <Head>
  <title>Mobile World Records List</title>
  </Head>
  <main className={inter.className}>
  <Nav 
          name='Mobile World Records'
          mainRoutes={{
            "Guidelines": '/guidelines',
            "Main List": '/',
            "Extended List": '/extended',
            "Extra List": '/legacy',
            "Leaderboard": '/leaderboard',
            "Discord Server": 'https://discord.gg/9dgpqqhhc2',
          }}
          active={active}
        />
        <Component {...pageProps} />
        </main>
  </>
}

App.getInitialProps  = async ({ctx}: any) => {
  // Your code
  let {req} = ctx
  // Passing data to the Page using props
  return {
         active: ctx.pathname
  }
}

export default App