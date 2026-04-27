import { create } from "zustand";
import { supabase } from "../services/supabase";

export type ItemType = "servico" | "peca";

export interface Item {
	id: string;
	description: string;
	price: number;
	type: ItemType;
}

export interface OrcamentoItem {
	descricao: string;
	valor: number;
}

interface ItemStore {
	items: Item[];

	servicos: OrcamentoItem[];
	pecas: OrcamentoItem[];

	loading: boolean;

	setServicos: (items: OrcamentoItem[]) => void;
	setPecas: (items: OrcamentoItem[]) => void;

	addServico: (item: OrcamentoItem) => void;
	addPeca: (item: OrcamentoItem) => void;

	removeServico: (index: number) => void;
	removePeca: (index: number) => void;

	fetchItems: () => Promise<void>;
	addItem: (item: Omit<Item, "id">) => Promise<void>;
	updateItem: (id: string, item: Partial<Omit<Item, "id">>) => Promise<void>;
	deleteItem: (id: string) => Promise<void>;
}

export const useItemStore = create<ItemStore>((set, get) => ({
	items: [],

	servicos: [],
	pecas: [],

	loading: false,

	setServicos: (items) => set({ servicos: items }),

	setPecas: (items) => set({ pecas: items }),

	addServico: (item) =>
		set({ servicos: [...get().servicos, item] }),

	addPeca: (item) =>
		set({ pecas: [...get().pecas, item] }),

	removeServico: (index) =>
		set({
			servicos: get().servicos.filter((_, i) => i !== index),
		}),

	removePeca: (index) =>
		set({
			pecas: get().pecas.filter((_, i) => i !== index),
		}),

	fetchItems: async () => {
		set({ loading: true });

		const { data } = await supabase
			.from("items")
			.select("*")
			.order("created_at", { ascending: false });

		if (data) set({ items: data });

		set({ loading: false });
	},

	addItem: async (item) => {
		const { data } = await supabase
			.from("items")
			.insert(item)
			.select()
			.single();

		if (data) {
			set({ items: [data, ...get().items] });
		}
	},

	updateItem: async (id, item) => {
		const { data } = await supabase
			.from("items")
			.update(item)
			.eq("id", id)
			.select()
			.single();

		if (data) {
			set({
				items: get().items.map((i) =>
					i.id === id ? data : i
				),
			});
		}
	},

	deleteItem: async (id) => {
		await supabase.from("items").delete().eq("id", id);

		set({
			items: get().items.filter((i) => i.id !== id),
		});
	},
}));