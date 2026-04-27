import { create } from "zustand";

export type Cliente = {
	nome: string;
	telefone: string;
	email: string;
	endereco: string;
};

export type Veiculo = {
	marca: string;
	modelo: string;
	placa: string;
	cor: string;
	ano: string;
};

export type ItemOrcamento = {
	descricao: string;
	valor: number;
};

type OrcamentoAtualStore = {
	cliente: Cliente;
	veiculo: Veiculo;
	servicos: ItemOrcamento[];
	pecas: ItemOrcamento[];

	setCliente: (data: Cliente) => void;
	setVeiculo: (data: Veiculo) => void;

	addServico: (item: ItemOrcamento) => void;
	addPeca: (item: ItemOrcamento) => void;

	removeServico: (index: number) => void;
	removePeca: (index: number) => void;

	setServicos: (data: ItemOrcamento[]) => void;
	setPecas: (data: ItemOrcamento[]) => void;

	resetar: () => void;
};

const clienteInicial: Cliente = {
	nome: "",
	telefone: "",
	email: "",
	endereco: "",
};

const veiculoInicial: Veiculo = {
	marca: "",
	modelo: "",
	placa: "",
	cor: "",
	ano: "",
};

export const useOrcamentoAtualStore = create<OrcamentoAtualStore>((set) => ({
	cliente: clienteInicial,
	veiculo: veiculoInicial,
	servicos: [],
	pecas: [],

	setCliente: (cliente) => set({ cliente }),
	setVeiculo: (veiculo) => set({ veiculo }),

	addServico: (item) =>
		set((state) => ({
			servicos: [...state.servicos, item],
		})),

	addPeca: (item) =>
		set((state) => ({
			pecas: [...state.pecas, item],
		})),

	removeServico: (index) =>
		set((state) => ({
			servicos: state.servicos.filter((_, i) => i !== index),
		})),

	removePeca: (index) =>
		set((state) => ({
			pecas: state.pecas.filter((_, i) => i !== index),
		})),

	setServicos: (servicos) => set({ servicos }),
	setPecas: (pecas) => set({ pecas }),

	resetar: () =>
		set({
			cliente: clienteInicial,
			veiculo: veiculoInicial,
			servicos: [],
			pecas: [],
		}),
}));