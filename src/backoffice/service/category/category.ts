import { Attributes, Filter, Service, Tracking } from 'onecore';

export interface CategoryFilter extends Filter {
  categoryId?: string;
  categoryName?: string;
  status: string[] | string;
}
export interface Category extends Tracking {
  categoryId: string;
  categoryName: string;
  status: string;
}

export interface CategoryService extends Service<Category, string, CategoryFilter> {
  getAllCategories(): Promise<Category[]>;
}

export const categoryModel: Attributes = {
  categoryId: {
    length: 40,
    key: true,
  },
  categoryName: {
    type: 'string',
    length: 300
  },
  status: {
    length: 1
  },
  createdBy: {
    length: 40
  },
  createdAt: {
    type: 'datetime'
  },
  updatedBy: {
    length: 40
  },
  updatedAt: {
    type: 'datetime'
  }
};
