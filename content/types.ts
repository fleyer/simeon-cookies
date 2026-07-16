export interface HeaderContent {
  nav: {
    cookies: string
    resellers: string
    about: string
  }
  cart: {
    ariaLabel: string
  }
  menu: {
    openAriaLabel: string
  }
}

export interface TriptychContent {
  desktop: {
    title: string
    cta: string
  }
  mobile: {
    items: Array<{
      title: string
      ctaLabel: string
      link?: string
    }>
    
  }
}

export interface ProductCardContent {
  badges: Record<'new' | 'featured' | 'soldout' | 'popular' | 'available', string>
  ratingLabel: (rating: string) => string
}

export type ProductStatus = "featured" | "soldout" | "new" | "popular" | "available";

export interface Product {
  title: string,
  subtitle: string,
  price?: number,
  rating?: number,
  image?: string,
  imageAlt: string,
  status?: ProductStatus,
  category?: string,
  description: string,
  link: string
}

export interface OrderContent {
  heading: string,
  currency: "euros" | undefined,
  product: {
    orderButton: string
  }
  catalog: Product[]
}

interface ImagePanel {
  title: string,
  cta: string,
  imageSrc: string
}

export interface HeroContent {
  left: ImagePanel
  right: ImagePanel
}
