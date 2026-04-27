import { Image } from "react-native";

export const getLogoBase64 = async () => {
	const asset = Image.resolveAssetSource(require("../assets/logo_app.png"));

	const response = await fetch(asset.uri);
	const blob = await response.blob();

	return await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
};