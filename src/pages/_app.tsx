import type { AppProps } from 'next/app'
import Head from "next/head"
import "@/styles/globals.css"
import Nav from '@/components/Nav'

function App({ Component, pageProps, active }: AppProps | any) {
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
          active={active}
        />
        <Component {...pageProps} />
  </>
}

App.getInitialProps  = async ({ctx}: any) => {
  // Your code
  let {req} = ctx
  // Passing data to the Page using props
  return {
         active: new URL(req?.protocol + '://' + req?.get?.('host') + req?.url)?.pathname
  }
}

export default App