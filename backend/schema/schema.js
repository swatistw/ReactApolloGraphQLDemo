const userschema =  `
type User {
  _id: String!
  email: String!
  password: String!
}
type Query {
  allUsers: [User!]!
}
type Mutation {
  createUser(email: String!, password: String!): User!
  login(email: String!, password: String!): String!
}
`;
module.exports = userschema;
