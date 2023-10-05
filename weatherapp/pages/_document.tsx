import { Html, Head, Main, NextScript } from 'next/document'
import img from "./../public/favicon.png"

export default function Document() {
  return (
    <Html lang="en">
      <Head >
      <meta name="theme-color" content="rgb(219 234 254)" />
      <link rel='shortcut icon' href='/favicon.ico' />

        </Head>
      <body className="bg-blue-100 bg-gradient-to-b from-blue-100  to-blue-400 min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
