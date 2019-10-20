import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import ErrorMessage from "./ErrorMessage";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const initialState = {
  name: "",
  email: "",
  password: "",
}

class Signup extends Component {
  state = initialState;

  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { name, email, password } = this.state;
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, { error, loading }) => (
          <Form method="post" onSubmit={async e => {
            e.preventDefault()
            const response = await signup(); // error throws and returns here
            this.setState(initialState);
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an Account</h2>
              <ErrorMessage error={error}/>
              <label htmlFor="name">
                Name
                <input
                  type="name"
                  name="name"
                  placeholder="name"
                  value={name}
                  onChange={this.saveToState}
                />
              </label>
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
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Sign up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
