export interface ProductSpec {
  id: number;
  name: string;
  description: string;
  price: string;
  slug: string;
}

export interface ProductSnapshot {
  name: string;
  description: string;
  price: string;
  imageSrc: string;
}

export interface FilterCriteria {
  label: string;
  value: 'az' | 'za' | 'lo' | 'hi';
}

export interface InventoryStatus {
  expectedCount: number;
  nameAscFirst: string;
  nameDescFirst: string;
  priceAscFirst: string;
  priceDescFirst: string;
}
