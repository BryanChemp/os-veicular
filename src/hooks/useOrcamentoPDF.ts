import { useOrcamentoAtualStore } from "../store/useOrcamentoStore";
import { useUserStore } from "../store/userStore";
import { formatCnpj, formatTelefone } from "../utils/mascaras";

export function useOrcamentoPDF() {
	const { cliente, veiculo, servicos, pecas } = useOrcamentoAtualStore();
	const { user } = useUserStore();

	const safeNumber = (value: any) => {
		if (typeof value === "number") return value;
		if (typeof value === "string")
			return parseFloat(value.replace(",", ".")) || 0;
		return 0;
	};

	const calcularTotalServicos = () =>
		servicos.reduce((acc, item) => acc + safeNumber(item.valor), 0);

	const calcularTotalPecas = () =>
		pecas.reduce((acc, item) => acc + safeNumber(item.valor), 0);

	const calcularTotalGeral = () =>
		calcularTotalServicos() + calcularTotalPecas();

	const formatarValor = (value: any) =>
		safeNumber(value).toFixed(2).replace(".", ",");

	const gerarHTML = async (logoBase: string | null) => {
		const totalServicos = calcularTotalServicos();
		const totalPecas = calcularTotalPecas();
		const totalGeral = calcularTotalGeral();

		return `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; margin: 40px; color: #333; }
            .header { display: flex; align-items: center; border-bottom: 2px solid #5A6BFF; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { max-width: 100px; margin-right: 20px; border-radius: 8px; }
            .company-info h1 { font-size: 22px; margin: 0; color: #2D3142; }
            .company-info p { margin: 2px 0; font-size: 13px; color: #666; }
            .section { margin-bottom: 30px; }
            .section h2 { font-size: 18px; color: #5A6BFF; border-bottom: 1px solid #E2E4EF; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { font-size: 14px; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #F8F9FF; color: #5A6BFF; text-align: left; padding: 12px; font-size: 13px; border-bottom: 2px solid #E2E4EF; }
            td { padding: 12px; border-bottom: 1px solid #EEE; font-size: 14px; }
            .total-geral { margin-top: 40px; padding: 25px; background-color: #F8F9FF; border-radius: 12px; border: 2px solid #5A6BFF; text-align: right; }
            .total-geral p { margin: 0; font-size: 22px; font-weight: 800; color: #2D3142; }
          </style>
        </head>

        <body>
          <div class="header">
            ${logoBase ? `<img src="${logoBase}" class="logo" />` : ""}
            <div class="company-info">
              <h1>${user?.name || ""}</h1>
              <p>CNPJ: ${formatCnpj(String(user?.cnpj || ""))}</p>
              <p>${formatTelefone(String(user?.phone || ""))} / ${user?.email || ""}</p>
            </div>
          </div>

          <div class="section">
            <h2>Dados do Cliente</h2>
            <div class="info-grid">
              <div class="info-item"><strong>Nome:</strong> ${cliente.nome || ""}</div>
              <div class="info-item"><strong>Telefone:</strong> ${cliente.telefone || ""}</div>
              <div class="info-item"><strong>Email:</strong> ${cliente.email || ""}</div>
              <div class="info-item"><strong>Endereço:</strong> ${cliente.endereco || ""}</div>
            </div>
          </div>

          <div class="section">
            <h2>Veículo</h2>
            <div class="info-grid">
              <div class="info-item"><strong>Marca:</strong> ${veiculo.marca || ""}</div>
              <div class="info-item"><strong>Modelo:</strong> ${veiculo.modelo || ""}</div>
              <div class="info-item"><strong>Placa:</strong> ${veiculo.placa || ""}</div>
              <div class="info-item"><strong>Cor:</strong> ${veiculo.cor || ""}</div>
              <div class="info-item"><strong>Ano:</strong> ${veiculo.ano || ""}</div>
            </div>
          </div>

          <div class="section">
            <h2>Itens do Orçamento</h2>
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th style="text-align: right;">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${servicos
					.map(
						(s) => `
                  <tr>
                    <td>${s.descricao || ""} (Serviço)</td>
                    <td style="text-align: right;">
                      R$ ${formatarValor(s.valor)}
                    </td>
                  </tr>
                `,
					)
					.join("")}

                ${pecas
					.map(
						(p) => `
                  <tr>
                    <td>${p.descricao || ""} (Peça)</td>
                    <td style="text-align: right;">
                      R$ ${formatarValor(p.valor)}
                    </td>
                  </tr>
                `,
					)
					.join("")}
              </tbody>
            </table>
          </div>

          <div class="total-geral">
            <p>TOTAL GERAL: R$ ${formatarValor(totalGeral)}</p>
          </div>
        </body>
      </html>
    `;
	};

	return {
		gerarHTML,
		calcularTotalServicos,
		calcularTotalPecas,
		calcularTotalGeral,
	};
}
