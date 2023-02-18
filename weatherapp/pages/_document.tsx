import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-neutral-800 border-4 border-gray-900 rounded-lg h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
