export interface Category {
  id: number;
  name: string;
  slug: string;
  /** Backend category image URL (from API `photo` field) */
  photo?: string | null;
  image?: { url: string; alt?: string } | null;
  isActive?: boolean;
  parent?: Category | null;
  children?: Category[] | null;
}

