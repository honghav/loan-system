// ~/data/prCards.ts
import image1 from '~/assets/images/public_relations/image1.png'
import image2 from '~/assets/images/public_relations/image2.png'
import image3 from '~/assets/images/public_relations/image3.png'
import image4 from '~/assets/images/public_relations/image4.png'
import detailImage1 from '~/assets/images/public_relations/detail_image1.png'

export interface PrCard {
  id: number
  image: string
  detail_image?: string
  title: string
  desc: string
  long_desc?: string
  published_at?: string
  source_url?: string
}

export const prCards: PrCard[] = [
  {
    id: 1,
    image: detailImage1,
    detail_image: detailImage1,
    title: "pr_card1",
    desc: "pr_card1_desc",
    published_at: "2024-01-15",
    long_desc: "<p>Katta Orn, Secretary of State and Spokesperson of the Ministry of Labour and Vocational Training, posted on his official Facebook page on June 4, 2024, outlining eight mechanisms to protect Cambodian migrant workers. The eight mechanisms include:<br/> 1. The Royal Government has been continuing to sign a memorandum of understanding with the host country to ensure the responsibility and protection of the rights of workers working abroad.<br> 2. The pre-departure task of the workers is to connect to the online database by activating the labour requirements certificate and the list of workers in order to shorten the working time. At the same time, train workers on the lifestyle, culture, traditions, rights, and laws of the host country.<br/> 3. Promote the mobility of the social security system for workers working abroad and return time so that workers can maintain the social security system. 4. Continue to guide private recruitment agencies to complete enterprise procedures and be responsible for workers. Take strict legal action against recruitment companies that violate the law and violate workers’ rights. 5. Provide protection and legal assistance to workers through the Cambodian Embassy, Consulate, and Sub-Labour Affairs in case of problems with workers. Workers can contact the Hotline 1297 or 1286, Telegram “For Migrant Workers, Department of Employment and Labour”, or call 011 898 912, 097 920 2023, 087 215 215, or 089 957 789, Department of Labour and Vocational Training Capitals-Provinces. 6. Cooperate with stakeholders to exchange information and support workers. 7. Continue to provide education and guidance to workers about the benefits and legalisation of going abroad to avoid going abroad illegally. 8. Provide skills training and job searches for workers when they return home. According to Katta Orn, the introduction of these measures is to promote the rights and protections of Cambodian workers working abroad. Cambodia currently has more than 1.3 million workers in Thailand, Japan, South Korea, Malaysia, Singapore, the Hong Kong Special Administrative Region, and Saudi Arabia. Migrant workers send nearly $3 billion to their families every year, which will help improve their families’ livelihoods and the national economy.</p>",
  },
  {
    id: 2,
    image: image2,
    title: "pr_card2",
    detail_image: detailImage1,
    desc: "pr_card2_desc",
    long_desc: "An estimated 250,000 Cambodian migrant workers fled from Thailand as a result of the military coup in 2014. Many of these workers faced exploitation and harsh conditions while trying to return home.",
    published_at: "2024-01-10",
  },
  {
    id: 3,
    image: image3,
    title: "pr_card3",
    desc: "pr_card3_desc",
    detail_image: detailImage1,
    long_desc: "The Ministry of Labour and Vocational Training has implemented several initiatives to ensure the safety and rights of Cambodian migrant workers abroad, including bilateral agreements with host countries.",
    published_at: "2024-01-05",
  },
  {
    id: 4,
    image: image4,
    title: "pr_card4",
    desc: "pr_card4_desc",
    detail_image: detailImage1,
    long_desc: "Efforts are being made to provide better training and resources for Cambodian migrant workers to help them navigate challenges in foreign countries and ensure their well-being.",
    published_at: "2024-01-01",
  },
  {
    id: 5,
    image: image1,
    detail_image: detailImage1,
    title: "pr_card1",
    desc: "pr_card1_desc",
    published_at: "2024-01-15",
    long_desc: "<p>Katta Orn, Secretary of State and Spokesperson of the Ministry of Labour and Vocational Training, posted on his official Facebook page on June 4, 2024, outlining eight mechanisms to protect Cambodian migrant workers. The eight mechanisms include:<br/> 1. The Royal Government has been continuing to sign a memorandum of understanding with the host country to ensure the responsibility and protection of the rights of workers working abroad.<br> 2. The pre-departure task of the workers is to connect to the online database by activating the labour requirements certificate and the list of workers in order to shorten the working time. At the same time, train workers on the lifestyle, culture, traditions, rights, and laws of the host country.<br/> 3. Promote the mobility of the social security system for workers working abroad and return time so that workers can maintain the social security system. 4. Continue to guide private recruitment agencies to complete enterprise procedures and be responsible for workers. Take strict legal action against recruitment companies that violate the law and violate workers’ rights. 5. Provide protection and legal assistance to workers through the Cambodian Embassy, Consulate, and Sub-Labour Affairs in case of problems with workers. Workers can contact the Hotline 1297 or 1286, Telegram “For Migrant Workers, Department of Employment and Labour”, or call 011 898 912, 097 920 2023, 087 215 215, or 089 957 789, Department of Labour and Vocational Training Capitals-Provinces. 6. Cooperate with stakeholders to exchange information and support workers. 7. Continue to provide education and guidance to workers about the benefits and legalisation of going abroad to avoid going abroad illegally. 8. Provide skills training and job searches for workers when they return home. According to Katta Orn, the introduction of these measures is to promote the rights and protections of Cambodian workers working abroad. Cambodia currently has more than 1.3 million workers in Thailand, Japan, South Korea, Malaysia, Singapore, the Hong Kong Special Administrative Region, and Saudi Arabia. Migrant workers send nearly $3 billion to their families every year, which will help improve their families’ livelihoods and the national economy.</p>",
  },
  {
    id: 6,
    image: image3,
    title: "pr_card3",
    desc: "pr_card3_desc",
    detail_image: detailImage1,
    long_desc: "The Ministry of Labour and Vocational Training has implemented several initiatives to ensure the safety and rights of Cambodian migrant workers abroad, including bilateral agreements with host countries.",
    published_at: "2024-01-05",
  },
  {
    id: 7,
    image: image3,
    title: "pr_card3",
    desc: "pr_card3_desc",
    detail_image: detailImage1,
    long_desc: "The Ministry of Labour and Vocational Training has implemented several initiatives to ensure the safety and rights of Cambodian migrant workers abroad, including bilateral agreements with host countries.",
    published_at: "2024-01-05",
  },
  {
    id: 8,
    image: image4,
    title: "pr_card4",
    desc: "pr_card4_desc",
    detail_image: detailImage1,
    long_desc: "Efforts are being made to provide better training and resources for Cambodian migrant workers to help them navigate challenges in foreign countries and ensure their well-being.",
    published_at: "2024-01-01",
  },
]