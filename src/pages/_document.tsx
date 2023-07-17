import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'


export default function Document(ctx: any) {
  console.log(ctx.__NEXT_DATA__.props.active)
  return (
    <Html lang="en">
      <Head>
    <meta property="og:title" content="Mobile World Records List"/>
    <meta property="og:description" content="A Demon List with the objective of showcasing Mobile World Records in Geometry Dash Extreme Demons."/>
    <meta property="og:image" content="https://cdn.discordapp.com/attachments/530041360443506700/848723657328820224/eternalmoment.png"/>
    <meta name="author" content="venfy, hpsk, frostfoxyn, samosa"/>
    <meta name="keywords" content="mobile world records list, Mobile World Records List, mobile world records, Mobile World Records, GD Mobile Records, gd mobile records, Demon List, demon list, demonlist, DemonList, GD Demon List, gd demon list, MWRL, mwrl, venfy, Venfy, hpsk, gdhpsk, Gdhpsk, frostfoxyn, Frostfoxyn, FrostFoxyn, samosa, Samosa, Mobile Records, mobile records, world record, World Record, Geometry Dash, geometry dash"/>
    <meta name="description" content="A Demon List with objective of showcasing Mobile World Records in Geometry Dash Extreme Demons."/>
    <meta property="image" content="https://cdn.discordapp.com/attachments/530041360443506700/848723657328820224/eternalmoment.png"/>
      <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
         {["/guidelines", "/main", "/extended", "/legacy", "/leaderboard"].includes(ctx?.__NEXT_DATA__?.props?.active) ? <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4543250064393866"
     crossOrigin="anonymous"></script> : ""}
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}