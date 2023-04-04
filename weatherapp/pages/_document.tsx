import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
      <meta name="theme-color" content="rgb(219 234 254 / 0)" />
      <meta name="color-scheme" content="dark light"/>
        </Head>
      <body className="bg-blue-100 bg-gradient-to-b from-blue-100  to-blue-300 h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
