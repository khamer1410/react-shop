import withApollo from "next-with-apollo";
import ApolloClient from "apollo-boost";
import { ENDPOINT_FE } from "../config";
import { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION } from "../components/Cart";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? ENDPOINT_FE : ENDPOINT_FE,
    request: (operation) => {
      operation.setContext({
        fetchOptions: {
          credentials: "include",
        },
        headers,
      });
    },
    // local data
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            const {cartOpen} = cache.readQuery({
              query: LOCAL_STATE_QUERY
            })

            const data = {
              data: { cartOpen: !cartOpen}
            }

            cache.writeData(data);
            return data;
          },
        },
      },
      defaults: {
        cartOpen: true,
      },
    },
  });
}

export default withApollo(createClient);
