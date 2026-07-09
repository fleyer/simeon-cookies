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
    title: string
    cta: string
  }
}
