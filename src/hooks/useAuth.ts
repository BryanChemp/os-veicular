import { useState } from "react";
import { Alert } from "react-native";
import MD5 from "crypto-js/md5";
import { supabase } from "../services/supabase";
import { TABLE_USERS, useUserStore } from "../store/userStore";

export function useAuth() {
	const [loading, setLoading] = useState(false);
	const setUser = useUserStore((state) => state.setUser);

	const validarCadastro = ({
		nome,
		empresa,
		senha,
		confirmarSenha,
		aceitaTermos,
	}: any) => {
		if (!nome || !empresa) {
			Alert.alert("Atenção", "Preencha os campos obrigatórios.");
			return false;
		}

		if (senha !== confirmarSenha) {
			Alert.alert("Erro", "As senhas não coincidem.");
			return false;
		}

		if (!aceitaTermos) {
			Alert.alert("Atenção", "Você precisa aceitar os termos.");
			return false;
		}

		return true;
	};

	const cadastrar = async ({
		nome,
		empresa,
		email,
		cnpj,
		telefone,
		senha,
	}: any) => {
		setLoading(true);

		try {
			const senhaHash = MD5(senha).toString();

			const { data, error } = await supabase
				.from(TABLE_USERS)
				.insert({
					name: nome,
					company: empresa,
					email,
					cnpj,
					phone: telefone,
					password: senhaHash,
				})
				.select()
				.single();

			if (error) throw new Error(error.message);

			setUser(data);
			return true;
		} catch (err: any) {
            let mensagem = err.message

			if (mensagem?.includes("duplicate key value")) {
				if (mensagem.includes("users_email_key")) {
					mensagem = "Já existe um cadastro com este e-mail.";
				} else if (mensagem.includes("users_cnpj_key")) {
					mensagem = "Já existe um cadastro com este CNPJ.";
				} else {
					mensagem = "Já existe um cadastro com esses dados.";
				}
			}

			Alert.alert("Erro", mensagem);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, senha: string) => {
		setLoading(true);

		try {
			const senhaHash = MD5(senha).toString();

			const { data, error } = await supabase
				.from(TABLE_USERS)
				.select("*")
				.eq("email", email)
				.eq("password", senhaHash)
				.single();

			if (error || !data) {
				throw new Error("E-mail ou senha inválidos");
			}

			setUser(data);
			return true;
		} catch (err: any) {
			let mensagem = err.message;
			Alert.alert("Erro", mensagem);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		validarCadastro,
		cadastrar,
		login,
	};
}
