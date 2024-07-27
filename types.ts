export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
}

export interface Product {
  id: string;
  name: string;
  categoryId: never;
  categoryName: string | null;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string | null;
  sizes: never;
  colors: never;
  images: never;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Image {
  url: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}
