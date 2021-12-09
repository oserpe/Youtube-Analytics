import LikeDislikeQuery from "./pages/LikeDislikeQuery";
import PartyMentionsQuery from "./pages/PartyMentionsQuery";
import PoliticianPairsQuery from "./pages/PoliticianPairsQuery";
import PoliticianTimePerChannelQuery from "./pages/PoliticianTimePerChannelQuery";
import WordCountQuery from "./pages/WordCountQuery";
import WordEvolutionQuery from "./pages/WordEvolutionQuery";

const queries = [
	{
		title: "Tiempo total por canal para un político",
		description:
			"Seleccione un político y la query obtendrá la suma de las duraciones de cada video en donde el político fue mencionado en el título y/o descripción para cada canal.",
		usedDatabases: ["Neo4J", "MongoDB"],
		path: "/query1",
		component: PoliticianTimePerChannelQuery,
	},
	{
		title: "Número de menciones de una frase en un período",
		description:
			"Ingrese una frase y elija un período de tiempo, y la query obtendrá la cantidad de menciones de la misma para cada canal dentro del lapso de tiempo especificado.",
		usedDatabases: ["MongoDB", "ElasticSearch"],
		path: "/query2",
		component: WordCountQuery,
	},
	{
		title: "Evolución de menciones de una frase en un período para un canal",
		description:
			"Ingrese una frase, uno o más canales y un período de tiempo, y la query obtendrá un gráfico con la evolución de la cantidad de menciones de la frase dentro del lapso de tiempo especificado para cada canal.",
		usedDatabases: ["MongoDB", "ElasticSearch"],
		path: "/query3",
		component: WordEvolutionQuery,
	},
	{
		title: "Recepción de videos en canales ante la mención de un político",
		description:
			"Seleccione un político y la query obtendrá la cantidad de likes, dislikes, comentarios y views totales para el mismo por cada canal.",
		usedDatabases: ["Neo4J", "MongoDB"],
		path: "/query4",
		component: LikeDislikeQuery,
	},
	{
		title: "Cantidad de menciones por partido político para un canal",
		description:
			"Seleccione un canal y la query obtendrá la cantidad total de menciones para cada partido político dentro del mismo canal.",
		usedDatabases: ["Neo4J"],
		path: "/query5",
		component: PartyMentionsQuery,
	},
	{
		title: "Menciones de pares de políticos por canal",
		description:
			"Seleccione un canal de noticias y la query obtendrá la cantidad de menciones para todos los pares de políticos encontrados dentro de los mismos videos.",
		usedDatabases: ["Neo4J"],
		path: "/query6",
		component: PoliticianPairsQuery,
	},
];

export default queries;
