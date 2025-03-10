import { gql } from 'apollo-server-express';


const typeDefs = gql`
type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}



