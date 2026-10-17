import { supabase } from './supabase';
import { MenuItem, MenuCategory, Offer, RestaurantInfo } from './mockData';

// ---- Field Mappers (frontend camelCase <-> DB snake_case) ----

/** Map a frontend MenuItem shape to DB column names */
function toDbItem(item: Partial<MenuItem>): Record<string, unknown> {
  const db: Record<string, unknown> = {};
  if (item.name !== undefined)        db.name = item.name;
  if (item.description !== undefined) db.description = item.description;
  if (item.price !== undefined)       db.price = item.price;
  if (item.image !== undefined)       db.image = item.image;
  if (item.category !== undefined)    db.category_id = item.category;   // category -> category_id
  if (item.isVeg !== undefined)       db.is_veg = item.isVeg;           // isVeg -> is_veg
  if (item.isPopular !== undefined)   db.is_popular = item.isPopular;   // isPopular -> is_popular
  if (item.spicyLevel !== undefined)  db.spicy_level = item.spicyLevel; // spicyLevel -> spicy_level
  return db;
}

/** Map a DB row back to the frontend MenuItem shape */
function fromDbItem(row: Record<string, unknown>): MenuItem {
  return {
    id:          row.id as string,
    name:        row.name as string,
    description: (row.description as string) ?? '',
    price:       row.price as number,
    image:       (row.image as string) ?? '',
    category:    (row.category_id as string) ?? '',    // category_id -> category
    isVeg:       (row.is_veg as boolean) ?? true,      // is_veg -> isVeg
    isPopular:   (row.is_popular as boolean) ?? false, // is_popular -> isPopular
    spicyLevel:  row.spicy_level as 1 | 2 | 3 | undefined,
  };
}

// ---- Error helper ----
function throwSupabaseError(error: { message?: string; code?: string; details?: string; hint?: string }): never {
  const msg = error.message || 'Unknown Supabase error';
  const detail = [error.code, error.details, error.hint].filter(Boolean).join(' | ');
  throw new Error(detail ? `${msg} (${detail})` : msg);
}

// ---- Fetch Data ----
export async function getRestaurant(id: string): Promise<RestaurantInfo | null> {
  const { data, error } = await supabase.from('restaurants').select('*').eq('id', id).single();
  if (error) { console.error('Error fetching restaurant:', error); return null; }
  return data;
}

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurantId);
  if (error) { console.error('Error fetching menu items:', error); return []; }
  return (data as Record<string, unknown>[]).map(fromDbItem);
}

export async function getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
  const { data, error } = await supabase.from('menu_categories').select('*').eq('restaurant_id', restaurantId);
  if (error) { console.error('Error fetching categories:', error); return []; }
  return data;
}

export async function getOffers(restaurantId: string): Promise<Offer[]> {
  const { data, error } = await supabase.from('offers').select('*').eq('restaurant_id', restaurantId);
  if (error) { console.error('Error fetching offers:', error); return []; }
  return data;
}

// ---- Image Upload ----
export async function uploadImage(file: File, bucket: 'menu-images' | 'restaurant-images'): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${Math.random()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
  if (uploadError) { console.error('Error uploading image:', uploadError); return null; }
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

// ---- Mutations ----
export async function saveMenuItem(item: Partial<MenuItem>, restaurantId: string) {
  const dbData = toDbItem(item);
  if (item.id && !item.id.toString().startsWith('item-')) {
    // Update existing
    const { error } = await supabase.from('menu_items').update(dbData).eq('id', item.id);
    if (error) throwSupabaseError(error);
  } else {
    // Insert new
    const { error } = await supabase.from('menu_items').insert([{ ...dbData, restaurant_id: restaurantId }]);
    if (error) throwSupabaseError(error);
  }
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throwSupabaseError(error);
}

export async function saveMenuCategory(category: Partial<MenuCategory>, restaurantId: string) {
  if (category.id && !category.id.toString().startsWith('cat-')) {
    // Update — strip id and any extra fields not in schema
    const { id, ...updateData } = category as MenuCategory & { restaurant_id?: string };
    const { restaurant_id: _rid, ...cleanUpdate } = updateData;
    const { error } = await supabase.from('menu_categories').update(cleanUpdate).eq('id', id);
    if (error) throwSupabaseError(error);
  } else {
    const { id, ...insertData } = category;
    const { error } = await supabase.from('menu_categories').insert([{ ...insertData, restaurant_id: restaurantId }]);
    if (error) throwSupabaseError(error);
  }
}

export async function deleteMenuCategory(id: string) {
  const { error } = await supabase.from('menu_categories').delete().eq('id', id);
  if (error) throwSupabaseError(error);
}

export async function saveOffer(offer: Partial<Offer>, restaurantId: string) {
  if (offer.id && !offer.id.toString().startsWith('off-')) {
    const { id, ...updateData } = offer as Offer & { restaurant_id?: string };
    const { restaurant_id: _rid, ...cleanUpdate } = updateData;
    const { error } = await supabase.from('offers').update(cleanUpdate).eq('id', id);
    if (error) throwSupabaseError(error);
  } else {
    const { id, ...insertData } = offer;
    const { error } = await supabase.from('offers').insert([{ ...insertData, restaurant_id: restaurantId }]);
    if (error) throwSupabaseError(error);
  }
}

export async function deleteOffer(id: string) {
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throwSupabaseError(error);
}
