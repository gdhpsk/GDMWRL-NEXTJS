import type { AppProps } from 'next/app'
import Head from "next/head"
import "@/styles/globals.css"
import Nav from '@/components/Nav'
import "@sweetalert2/themes/dark/dark.css"
import "../../firebase"

import { Lato } from '@next/font/google'

const inter = Lato({ weight: ['400'], subsets: ['latin-ext'] })

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
            "Main List": '/main',
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