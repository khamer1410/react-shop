import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";

const SINGOUT_MUTATION = gql`
  mutation SINGOUT_MUTATION {
    singout {
      message
    }
  }
`;

const Singout = () => (
  <Mutation mutation={SINGOUT_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
    {singout => <button onClick={singout}>Singout</button>}
  </Mutation>
);

export default Singout;
