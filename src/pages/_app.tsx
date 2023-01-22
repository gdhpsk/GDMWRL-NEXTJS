import type { AppProps } from 'next/app'
import Head from "next/head"
import "@/styles/globals.css"
import Nav from '@/components/Nav'

function App({ Component, pageProps }: AppProps | any) {
  return <>
  <Head>
  <title>Mobile World Records List</title>
  </Head>
  <Nav 
          name='Mobile World Records'
          mainRoutes={{
            "Guidelines": '/guidelines',
            "Main List": '/',
            "Extended List": '/extended',
            "Extra List": '/legacy',
            "Discord Server": 'https://discord.gg/9dgpqqhhc2',
          }}
          active={pageProps.active}
        />
        <Component {...pageProps} />
  </>
}

export default App