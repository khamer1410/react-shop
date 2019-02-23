import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;
// FIXME: why view is not updating?
export default class DeleteItem extends Component {
  update = (cache, payload) => {
    const data = cache.readQuery({query: ALL_ITEMS_QUERY});
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    cache.writeQuery({query: ALL_ITEMS_QUERY, data});
  }

  render() {
    const { children, id } = this.props;
    return (
      <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id: this.props.id }} update={this.update}>
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (confirm("Are You sure You want to delete this item?"))
                deleteItem();
            }}
          >
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}
