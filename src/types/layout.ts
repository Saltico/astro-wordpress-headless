// src/types/layout.ts

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  columns: FooterColumn[];
  legal: FooterLink[];
  brand: string;
  description?: string;
  phone?: string;
  email?: string;
}

export interface BaseLayoutProps {
  title: string;
  description: string;
  canonical?: string;
  showTopBar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}
