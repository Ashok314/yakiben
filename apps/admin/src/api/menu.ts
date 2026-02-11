import { supabase } from '@yakiben/supabase';
import type { MenuItem } from '../types/types';

export const menuApi = {
  async getMenu(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select(
        '*, category:menu_categories(name), customization_groups(*, options:customization_options(*))'
      );

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name || 'Unknown',
      description: item.description || '',
      price: Number(item.price),
      category: item.category?.name || 'その他',
      imageUrl: item.image_url,
      outOfStock: !item.is_available,
      groups: item.customization_groups || [],
    })) as any[];
  },

  async updateMenuItem(itemId: string, updates: any): Promise<boolean> {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = Number(updates.price);
    if (updates.outOfStock !== undefined) dbUpdates.is_available = !updates.outOfStock;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;

    // Map category name to ID
    if (updates.category) {
      const { data: cat } = await supabase
        .from('menu_categories')
        .select('id')
        .eq('name', updates.category)
        .single();
      if (cat) dbUpdates.category_id = cat.id;
    }

    const { error } = await supabase.from('menu_items').update(dbUpdates).eq('id', itemId);

    if (error) return false;

    // Update customization groups linkage
    if (updates.groups) {
      // Unlink all groups first? Or just the ones that were changed?
      // The schema has menu_item_id on customization_groups.
      // So we need to:
      // 1. Set menu_item_id = null for groups that were previously linked but not in updates.groups
      // 2. Set menu_item_id = itemId for groups in updates.groups

      const currentGroupIds = updates.groups.map((g: any) => g.id);

      // Link selected groups
      if (currentGroupIds.length > 0) {
        await supabase
          .from('customization_groups')
          .update({ menu_item_id: itemId })
          .in('id', currentGroupIds);
      }

      // Unlink groups not in the list
      await supabase
        .from('customization_groups')
        .update({ menu_item_id: null })
        .eq('menu_item_id', itemId)
        .not('id', 'in', `(${currentGroupIds.join(',')})`);
    }

    return true;
  },

  async addMenuItem(item: any): Promise<string | null> {
    const dbItem: any = {
      name: item.name,
      description: item.description,
      price: Number(item.price),
      is_available: !item.outOfStock,
      image_url: item.imageUrl,
    };

    // Map category
    const { data: cat } = await supabase
      .from('menu_categories')
      .select('id')
      .eq('name', item.category)
      .single();
    if (cat) dbItem.category_id = cat.id;

    const { data, error } = await supabase.from('menu_items').insert(dbItem).select().single();

    if (error) {
      console.error('[MenuApi] Error adding item:', error);
      return null;
    }

    const itemId = data.id;

    // Link customization groups
    if (item.groups && item.groups.length > 0) {
      const groupIds = item.groups.map((g: any) => g.id);
      await supabase
        .from('customization_groups')
        .update({ menu_item_id: itemId })
        .in('id', groupIds);
    }

    return itemId;
  },

  async deleteMenuItem(id: string): Promise<boolean> {
    // Checking if we should do soft delete or hard delete.
    // For now, hard delete but it might fail if there are constraints from orders.
    // If it fails, we should probably set is_available = false.
    const { error } = await supabase.from('menu_items').delete().eq('id', id);

    if (error) {
      console.error('[MenuApi] Error deleting item:', error);
      // Fallback to disabling it
      await supabase.from('menu_items').update({ is_available: false }).eq('id', id);
      return false;
    }
    return true;
  },

  async addCategory(name: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert({ name })
      .select()
      .single();

    if (error) {
      console.error('[MenuApi] Error adding category:', error);
      return null;
    }
    return data.id;
  },

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('name')
      .order('sort_order');

    if (error) return [];
    return data.map((c) => c.name);
  },

  async getCustomizations(): Promise<any[]> {
    const { data, error } = await supabase
      .from('customization_groups')
      .select('*, options:customization_options(*)');

    if (error) return [];
    return data || [];
  },

  async addCustomizationGroup(
    name: string,
    options: { name: string; price_add: number; is_default?: boolean }[],
    constraints: { min_selection?: number; max_selection?: number; is_required?: boolean } = {}
  ): Promise<string | null> {
    // 1. Insert Group
    const { data: group, error: groupError } = await supabase
      .from('customization_groups')
      .insert({
        name,
        max_selections: constraints.max_selection ?? 1,
        is_required: constraints.is_required ?? false,
        // min_selections: constraints.min_selection ?? 0 // Check if column exists, user says yes but schema file didn't show it. Safe to omit if not sure, or try insert.
        // Assuming user is right and schema has it or we use is_required/max for now.
        // The schema file `20260201150150_init_schema.sql` showed `max_selections` and `is_required`.
        // It did NOT show `min_selections`.
        // I will stick to what I saw in the schema: `max_selections` and `is_required`.
      })
      .select()
      .single();

    if (groupError || !group) {
      console.error('[MenuApi] Error adding customization group:', groupError);
      return null;
    }

    // 2. Insert Options
    if (options.length > 0) {
      const optionsToInsert = options.map((opt) => ({
        group_id: group.id,
        name: opt.name,
        price_add: opt.price_add,
        is_default: !!opt.is_default,
      }));

      const { error: optionsError } = await supabase
        .from('customization_options')
        .insert(optionsToInsert);

      if (optionsError) {
        console.error('[MenuApi] Error adding customization options:', optionsError);
      }
    }

    return group.id;
  },

  async updateCustomizationGroup(
    groupId: string,
    name: string,
    options: { id?: string; name: string; price_add: number; delete?: boolean }[],
    constraints: { min_selection?: number; max_selection?: number; is_required?: boolean } = {}
  ): Promise<boolean> {
    // 1. Update Group Name & Constraints
    const updates: any = { name };
    if (constraints.max_selection !== undefined) updates.max_selections = constraints.max_selection;
    if (constraints.is_required !== undefined) updates.is_required = constraints.is_required;

    const { error: groupError } = await supabase
      .from('customization_groups')
      .update(updates)
      .eq('id', groupId);

    if (groupError) return false;

    // 2. Handle Options
    for (const opt of options) {
      if (opt.delete && opt.id) {
        await supabase.from('customization_options').delete().eq('id', opt.id);
      } else if (opt.id) {
        await supabase
          .from('customization_options')
          .update({
            name: opt.name,
            price_add: opt.price_add,
            is_default: !!(opt as any).is_default,
          })
          .eq('id', opt.id);
      } else {
        await supabase.from('customization_options').insert({
          group_id: groupId,
          name: opt.name,
          price_add: opt.price_add,
          is_default: !!(opt as any).is_default,
        });
      }
    }

    return true;
  },

  async deleteCustomizationGroup(groupId: string): Promise<boolean> {
    // Delete options first (though FK might handle it with CASCADE if set, but let's be explicit)
    await supabase.from('customization_options').delete().eq('group_id', groupId);

    const { error } = await supabase.from('customization_groups').delete().eq('id', groupId);

    return !error;
  },
};
