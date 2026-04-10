export interface MenuItem {
  name: string;
  price: number;
  desc?: string;
  allergens?: string;
  popular?: boolean;
}

export interface Brand {
  brand: string;
  items: MenuItem[];
}

export interface Category {
  category: string;
  items: MenuItem[];
}

export interface NavMeta {
  icon: string;
  label: string;
  group: string;
}

interface BrandSection {
  title: string;
  description: string;
  type: 'brands';
  nav: NavMeta;
  brands: Brand[];
  extras?: MenuItem[];
}

interface CategorySection {
  title: string;
  description: string;
  type: 'categories';
  nav: NavMeta;
  categories: Category[];
}

interface ItemSection {
  title: string;
  description: string;
  type: 'items';
  nav: NavMeta;
  items: MenuItem[];
}

export type MenuSection = BrandSection | CategorySection | ItemSection;

export type MenuData = Record<string, MenuSection>;

export const ALLERGENS: Record<string, string> = {
  '1': 'Gluten',
  '7': 'Milch / Laktose',
  '8': 'Schalenfrüchte',
  '12': 'Sulfite',
};
