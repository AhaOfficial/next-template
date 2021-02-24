const nextSeoConfig = {
  title: 'next-template',
  titleTemplate: '%s ㅣ next.js tutorial',
  description: 'next js template for javascript developers',
  openGraph: {
    url: process.env.webUrl,
    type: 'website',
    images: [
      {
        url: `${process.env.webUrl}/meta/meta-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'welcome!'
      }
    ]
  }
}

export default nextSeoConfig
