import { Query } from "react-apollo";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from './styles/SickButton'

const PERMISSIONS = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE",
];

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;

      if (error) return <Error error={error} />;

      return (
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {PERMISSIONS.map((permission) => (
                  <th>{permission}</th>
                ))}
                <th>👇</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <UserRow user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      );
    }}
  </Query>
);

const UserRow = ({ user = {} }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      {PERMISSIONS.map((permissionToCheck) => {
        const hasPermission = user.permissions.find(
          (perm) => perm === permissionToCheck
        );
        const fieldName = `${user.id}-permission-${permissionToCheck}`
        return (
          <td>
            <label htmlFor={fieldName}>
              <input
                type="checkbox"
                name={fieldName}
                id=""
                checked={hasPermission}
              />
            </label>
          </td>
        );
      })}
      <td>
        <SickButton>Update</SickButton>
      </td>
    </tr>
  );
};

export default Permissions;
