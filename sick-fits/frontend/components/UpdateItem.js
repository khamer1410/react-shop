import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import PriceTag from "./styles/PriceTag";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      price
      description
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log('Updating Item!!');
    console.log(this.state);

    const response = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      }
    })
  };

  render() {
    const { title, description, image, price } = this.state;
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data = {}, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No data found for ID {this.props.id}</p>;

          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={event => this.updateItem(event, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter A Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">
                      {loading ? "Saving ..." : "Save changes"}
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
