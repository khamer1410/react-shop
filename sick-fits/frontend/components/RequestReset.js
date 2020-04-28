import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import ErrorMessage from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
  ) {
    requestReset(email: $email) {
      message
    }
  }
`;

const initialState = {
  email: "",
};

class RequestReset extends Component {
  state = initialState;

  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { email } = this.state;
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
      >
        {(requestReset, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              const response = await requestReset(); // error throws and returns here
              this.setState(initialState);
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request password reset</h2>
              <ErrorMessage error={error} />
              {!error && !loading && called && <p>Success! Check your email for a reset link!</p>}

              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={email}
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Reset Password</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
