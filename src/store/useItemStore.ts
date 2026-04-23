import { create } from "zustand";
import { supabase } from "../services/supabase";

export type ItemType = "servico" | "peca";

export interface Item {
	id: string;
	description: string;
	price: number;
	type: ItemType;
}

interface ItemStore {
	items: Item[];
	loading: boolean;

	fetchItems: () => Promise<void>;
	addItem: (item: Omit<Item, "id">) => Promise<void>;
	updateItem: (id: string, item: Partial<Omit<Item, "id">>) => Promise<void>;
	deleteItem: (id: string) => Promise<void>;
}

export const useItemStore = create<ItemStore>((set, get) => ({
	items: [],
	loading: false,

	fetchItems: async () => {
		set({ loading: true });

		const { data, error } = await supabase
			.from("items")
			.select("*")
			.order("created_at", { ascending: false });

		if (!error && data) {
			set({ items: data });
		}

		set({ loading: false });
	},

	addItem: async (item) => {
		const { data, error } = await supabase
			.from("items")
			.insert(item)
			.select()
			.single();

		if (!error && data) {
			set({ items: [data, ...get().items] });
		}
	},

	updateItem: async (id, item) => {
		const { data, error } = await supabase
			.from("items")
			.update(item)
			.eq("id", id)
			.select()
			.single();

		if (!error && data) {
			set({
				items: get().items.map((i) => (i.id === id ? data : i)),
			});
		}
	},

	deleteItem: async (id) => {
		const { error } = await supabase
			.from("items")
			.delete()
			.eq("id", id);

		if (!error) {
			set({
				items: get().items.filter((i) => i.id !== id),
			});
		}
	},
}));