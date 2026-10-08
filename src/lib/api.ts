import { supabase } from './supabase';
import { MenuItem, MenuCategory, Offer, RestaurantInfo } from './mockData';

// ---- Fetch Data ----
export async function getRestaurant(id: string): Promise<RestaurantInfo | null> {
  const { data, error } = await supabase.from('restaurants').select('*').eq('id', id).single();
  if (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
  return data;
}

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurantId);
  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
  return data;
}

export async function getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
  const { data, error } = await supabase.from('menu_categories').select('*').eq('restaurant_id', restaurantId);
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

export async function getOffers(restaurantId: string): Promise<Offer[]> {
  const { data, error } = await supabase.from('offers').select('*').eq('restaurant_id', restaurantId);
  if (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
  return data;
}

// ---- Image Upload ----
export async function uploadImage(file: File, bucket: 'menu-images' | 'restaurant-images'): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

// ---- Mutations ----
export async function saveMenuItem(item: Partial<MenuItem>, restaurantId: string) {
  if (item.id && !item.id.toString().startsWith('item-')) {
    // Update existing (assuming valid UUID)
    const { error } = await supabase.from('menu_items').update(item).eq('id', item.id);
    if (error) throw error;
  } else {
    // Insert new
    const { id, ...insertData } = item;
    const { error } = await supabase.from('menu_items').insert([{ ...insertData, restaurant_id: restaurantId }]);
    if (error) throw error;
  }
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
}

export async function saveMenuCategory(category: Partial<MenuCategory>, restaurantId: string) {
  if (category.id && !category.id.toString().startsWith('cat-')) {
    const { error } = await supabase.from('menu_categories').update(category).eq('id', category.id);
    if (error) throw error;
  } else {
    const { id, ...insertData } = category;
    const { error } = await supabase.from('menu_categories').insert([{ ...insertData, restaurant_id: restaurantId }]);
    if (error) throw error;
  }
}

export async function deleteMenuCategory(id: string) {
  const { error } = await supabase.from('menu_categories').delete().eq('id', id);
  if (error) throw error;
}

export async function saveOffer(offer: Partial<Offer>, restaurantId: string) {
  if (offer.id && !offer.id.toString().startsWith('off-')) {
    const { error } = await supabase.from('offers').update(offer).eq('id', offer.id);
    if (error) throw error;
  } else {
    const { id, ...insertData } = offer;
    const { error } = await supabase.from('offers').insert([{ ...insertData, restaurant_id: restaurantId }]);
    if (error) throw error;
  }
}

export async function deleteOffer(id: string) {
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throw error;
}
