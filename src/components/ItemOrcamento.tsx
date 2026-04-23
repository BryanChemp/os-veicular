import React from "react";
import styled from "styled-components/native";

interface ItemOrcamentoProps {
  descricao: string;
  valor: number;
  tipo: "servico" | "peca";
}

export function ItemOrcamento({ descricao, valor, tipo }: ItemOrcamentoProps) {
  return (
    <ContainerLinha>
      <ColunaDescricao>
        <TextoDescricao numberOfLines={1}>{descricao}</TextoDescricao>
        <TagTipo>{tipo === "servico" ? "Serviço" : "Peça"}</TagTipo>
      </ColunaDescricao>

      <ColunaValor>
        <TextoValor>
          R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </TextoValor>
      </ColunaValor>
    </ContainerLinha>
  );
}

const ContainerLinha = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 12px;
  background-color: #ffffff;
  margin-bottom: 8px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #f0f2ff;
  
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
`;

const ColunaDescricao = styled.View`
  flex: 5;
  justify-content: center;
`;

const TextoDescricao = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #2d3142;
  margin-bottom: 4px;
`;

const TagTipo = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: #a0a4b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ColunaValor = styled.View`
  flex: 3;
  align-items: flex-end;
`;

const TextoValor = styled.Text`
  font-size: 15px;
  font-weight: 800;
  color: #5a6bff;
`;