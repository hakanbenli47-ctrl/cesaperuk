import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.naturelperuk.com/',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },

    // Örnek sayfalar (varsa aç)
    {
      url: 'https://www.naturelperuk.com/hakkimizda',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://www.naturelperuk.com/iletisim',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://www.naturelperuk.com/peruk-modelleri',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}