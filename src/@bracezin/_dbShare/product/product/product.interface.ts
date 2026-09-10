import { Category } from "../category";
import { Brand } from '../brand';
import { Pclass } from '../pclass';
import { Section } from '../section';

export interface Product {
	id: number;
  category_id: number;
  brand_id?: number;
  pclass_id?: number;
  section_id?: number;
  code: string;
  art_code: string;
  name: string;
  description: string;
  uom: string;
  total_weight: number;
  pcs: number;
  image: string;
  json: JSON;
  is_active: boolean;

  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;

  tableName?: string;
  categoryName?: string;
  brandName?: string;
  pclassName?: string;
  sectionName?: string;

  category?: Category;
  brand?: Brand;
  pclass?: Pclass;
  section?: Section;
}