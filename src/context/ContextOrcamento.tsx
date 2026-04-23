import React, { createContext, ReactNode, useState } from "react";

export interface Cliente {
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  cpf: string;
}

export interface Veiculo {
  marca: string;
  modelo: string;
  placa: string;
  cor: string;
  ano: string;
}

interface Servico {
  descricao: string;
  valor: number;
}

interface Pecas {
  descricao: string;
  valor: number;
}

interface OrcamentoContextDados {
  cliente: Cliente;
  veiculo: Veiculo;
  servicos: Servico[];
  pecas: Pecas[];
  setCliente: (cliente: Cliente) => void;
  setVeiculo: (veiculo: Veiculo) => void;
  setServicos: (servico: Servico[]) => void;
  setPecas: (pecas: Pecas[]) => void;
  resetarDados: () => void;
}

export const OrcamentoContext = createContext<OrcamentoContextDados | null>(
  null
);

interface OrcamentoContextProps {
  children: ReactNode;
}

export const OrcamentoProvider: React.FC<OrcamentoContextProps> = ({
  children,
}) => {
  const [cliente, setCliente] = useState<Cliente>({
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
    cpf: "",
  });

  const [veiculo, setVeiculo] = useState<Veiculo>({
    marca: "",
    modelo: "",
    placa: "",
    cor: "",
    ano: "",
  });

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [pecas, setPecas] = useState<Pecas[]>([]);

  const resetarDados = () => {
    setCliente({
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
      cpf: "",
    });
    setVeiculo({
      marca: "",
      modelo: "",
      placa: "",
      cor: "",
      ano: "",
    });
    setServicos([]);
    setPecas([]);
  };

  return (
    <OrcamentoContext.Provider
      value={{
        cliente,
        veiculo,
        servicos,
        pecas,
        setCliente,
        setVeiculo,
        setServicos,
        setPecas,
        resetarDados,
      }}
    >
      {children}
    </OrcamentoContext.Provider>
  );
};
