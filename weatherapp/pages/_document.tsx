import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
