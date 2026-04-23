import styled from "styled-components/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
	faHome,
	faList,
	faPlus,
	faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "../store/userStore";
import logoApp from "../assets/logo_app.png";

export function CustomDrawer(props: any) {
	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);

	return (
		<Container>
			<Header>
				<Logo source={logoApp} resizeMode="contain" />
				<UserName>{user?.name}</UserName>
			</Header>

			<MenuItem
				onPress={() =>
					props.navigation.navigate("HomeStack", {
						screen: "Home",
					})
				}
				style={{
					marginTop: 32,
				}}
			>
				<Icon icon={faHome} />
				<MenuText>Início</MenuText>
			</MenuItem>

			<MenuItem onPress={() => props.navigation.navigate("")}>
				<Icon icon={faList} />
				<MenuText>Lista de orçamentos</MenuText>
			</MenuItem>

			<MenuItem
				onPress={() => props.navigation.navigate("CadastrarItens")}
			>
				<Icon icon={faPlus} />
				<MenuText>Cadastrar itens</MenuText>
			</MenuItem>

			<MenuItem
				onPress={() => setUser(null)}
				style={{
					marginTop: 64,
				}}
			>
				<Icon icon={faRightFromBracket} color="red" />
				<MenuText danger>Sair</MenuText>
			</MenuItem>
		</Container>
	);
}

const Container = styled.View`
	flex: 1;
	padding-top: 40px;
	background-color: #fff;
`;

const Header = styled.View`
	align-items: center;
	margin-bottom: 30px;
`;

const Logo = styled.Image`
	width: 100px;
	height: 80px;
`;

const UserName = styled.Text`
	margin-top: 10px;
	font-weight: bold;
	font-size: 16px;
	color: #2d3142;
`;

const MenuItem = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	padding: 16px 24px;
`;

const MenuText = styled.Text<{ danger?: boolean }>`
	margin-left: 12px;
	font-size: 15px;
	color: ${({ danger }) => (danger ? "red" : "#2d3142")};
`;

const Icon = styled(FontAwesomeIcon).attrs((props: any) => ({
	size: 18,
	color: props.color || "#2d3142",
}))``;

const Spacer = styled.View`
	flex: 1;
`;
