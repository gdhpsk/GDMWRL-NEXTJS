import { Html, Head, Main, NextScript } from 'next/document'
import {useEffect, useState} from "react"
import Nav from "../components/Nav"


export default function Document() {
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
        </Head>
      <body>
        <Nav 
          name='Mobile World Records'
          mainRoutes={{
            "Main List": '/',
            "Extended List": '/extended',
            "Extra List": '/legacy'
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
