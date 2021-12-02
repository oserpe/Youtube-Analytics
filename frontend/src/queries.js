import LikeDislikeQuery from "./pages/LikeDislikeQuery";
import PoliticianPairsQuery from "./pages/PoliticianPairsQuery";
import PoliticianTimePerChannelQuery from "./pages/PoliticianTimePerChannelQuery";
import QueryPage from "./pages/QueryPage";
import WordCountQuery from "./pages/WordCountQuery";
import WordEvolutionQuery from "./pages/WordEvolutionQuery";

const queries = [
	{
		title: "Pares de políticos por canal",
		description:
			"Sunt aliquip qui pariatur culpa elit sit eu aliqua exercitation. Laboris ipsum enim est nisi ad esse proident do aute.",
		path: "/query1",
		component: PoliticianPairsQuery,
	},
	{
		title: "Tiempo total por político",
		description:
			"Est ea deserunt anim dolore. Laboris sit est qui tempor mollit quis mollit ut. Culpa do elit quis cupidatat commodo incididunt velit consequat amet id voluptate.",
		path: "/query2",
		component: PoliticianTimePerChannelQuery,
	},
	{
		title: "Número de menciones de una palabra en un período",
		description:
			"Cillum commodo esse commodo est aliqua dolor nostrud fugiat. Esse esse cupidatat ipsum amet.",
		path: "/query3",
		component: WordCountQuery,
	},
	{
		title: "Evolución de menciones de una palabra en un período para un canal",
		description:
			"Cupidatat duis esse officia enim adipisicing amet. Tempor adipisicing magna ad elit voluptate eiusmod.",
		path: "/query4",
		component: WordEvolutionQuery,
	},
	{
		title: "Recepción de videos en canales ante la mención de un político",
		description:
			"Cupidatat duis esse officia enim adipisicing amet. Tempor adipisicing magna ad elit voluptate eiusmod.",
		path: "/query5",
		component: LikeDislikeQuery,
	},
];

export default queries;
