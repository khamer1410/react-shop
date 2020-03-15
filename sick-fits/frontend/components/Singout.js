import React from 'react';
import gql from "graphql-tag";
import { Mutation } from 'react-apollo';

const SINGOUT_MUTATION = gql`
mutation SINGOUT_MUTATION(
  $id: String!
) {
  singout(id: $id)
}
`;

class Singout extends Component {

  render () {
    return (
      <Mutation
        mutation={SINGOUT_MUTATION}
      >
        {(singout) => (
          <button>Singout</button>
        )}
      </Mutation>
    )

  }

}

export default Singout