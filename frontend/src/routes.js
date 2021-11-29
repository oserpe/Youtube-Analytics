import PoliticianPairsQuery from "./pages/PoliticianPairsQuery";
import QueryPage from "./pages/QueryPage";

const routes = [
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
		component: QueryPage,
	},
	{
		title: "Número de menciones de una palabra en un período",
		description:
			"Cillum commodo esse commodo est aliqua dolor nostrud fugiat. Esse esse cupidatat ipsum amet.",
		path: "/query3",
		component: QueryPage,
	},
	{
		title: "Evolución de menciones de una palabra en un período para un canal",
		description:
			"Cupidatat duis esse officia enim adipisicing amet. Tempor adipisicing magna ad elit voluptate eiusmod.",
		path: "/query4",
		component: QueryPage,
	},
	{
		title: "Recepción de video ante la mención de un político",
		description:
			"Cupidatat duis esse officia enim adipisicing amet. Tempor adipisicing magna ad elit voluptate eiusmod.",
		path: "/query5",
		component: QueryPage,
	},
];

export default routes;
