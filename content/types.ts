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
  badges: Record<'new' | 'featured' | 'soldout', string>
  ratingLabel: (rating: string) => string
}

export interface OrderContent {
  heading: string
}

export interface HeroContent {
  left: {
    title: string
    cta: string
  }
  right: {
    title: string
    cta: string
  }
}
