import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="theme-color" content="#05081a" />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<link rel="alternate icon" href="/favicon.ico" sizes="any" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
