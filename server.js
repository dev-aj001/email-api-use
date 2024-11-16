require("dotenv").config();

const sgMail = require("@sendgrid/mail");
const { ApolloServer } = require('apollo-server');
const { gql } = require('apollo-server');

// Usa la variable de entorno correctamente
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Función para enviar el correo
const sendEmail = async (msg) => {
    try {
        msg.from = "mianahumadade@ittepic.edu.mx";
        const response = await sgMail.send(msg);
        console.log(response[0].statusCode);
        console.log(response[0].headers);
        // Retorna un objeto con el mensaje de éxito
        return { msj: `Correo enviado correctamente a ${msg.to}` };
    } catch (error) {
        console.error(error);
        // Retorna un objeto con el mensaje de error
        return { msj: 'El correo no se envió correctamente' };
    }
};

// Definición de tipos de GraphQL
const typeDefs = gql`
    type Response {
        msj: String
    }

    input ReqEmailInput {
        to: String!
        subject: String!
        text: String!
        html: String!
    }

    type Query {
        reqEmail(msg: ReqEmailInput!): Response
    }
`;

// Resolvers de GraphQL
const resolvers = {
    Query: {
        reqEmail: async (_, { msg }) => {
            try {
                // Esperamos que sendEmail retorne el objeto con el mensaje
                const result = await sendEmail(msg);
                console.log("Resultado de sendEmail:", result); // Verifica el resultado
                return result; // Retorna el resultado
            } catch (error) {
                console.error("Error en resolver reqEmail:", error);
                return { msj: 'Hubo un error en el envío del correo.' }; // Si hay error, retornamos un mensaje de error
            }
        },
    },
};

// Iniciar el servidor Apollo
const startConnection = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });

    server.listen().then(({ url }) => {
        console.log(`Servidor corriendo en ${url}`);
    });
};

startConnection();
