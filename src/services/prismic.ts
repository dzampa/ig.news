import * as Prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'

export function linkResolver(doc) {
  switch (doc.type) {
    case 'homepage':
      return '/'
    case 'page':
      return `/${doc.uid}`
    default:
      return null
  }
}

export function getPrismicClient(config? ) {
  const client = Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
        ...config,
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        fetch
    }
  )

  
  enableAutoPreviews({
    client,
  })

  return client;
}