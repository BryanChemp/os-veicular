import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cliente, ItemOrcamento, Veiculo } from "./useOrcamentoStore";

export type OrcamentoFinalizado = {
	id: string;
	cliente: Cliente;
	veiculo: Veiculo;
	servicos: ItemOrcamento[];
	pecas: ItemOrcamento[];
	total: number;
	pdfUri: string;
	createdAt: number;
};

type Store = {
	orcamentos: OrcamentoFinalizado[];
	adicionar: (data: OrcamentoFinalizado) => void;
	remover: (id: string) => void;
	limpar: () => void;
};

export const useOrcamentosFinalizadosStore = create<Store>()(
	persist(
		(set, get) => ({
			orcamentos: [],

			adicionar: (data) =>
				set({
					orcamentos: [data, ...get().orcamentos],
				}),

			remover: (id) =>
				set({
					orcamentos: get().orcamentos.filter((o) => o.id !== id),
				}),

			limpar: () =>
				set({
					orcamentos: [],
				}),
		}),
		{
			name: "orcamentos-finalizados",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);