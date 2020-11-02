import React, {useState} from 'react';
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
                  <th key={permission}>{permission}</th>
                ))}
                <th>👇</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <UserRow user={user} key={user.id}/>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }}
  </Query>
);

const UserRow = ({ user = {} }) => {
  const [permissions, setPermissions] = useState(user.permissions);

  const handlePermissionChange = e => {
    const checkbox = e.target;
    let updatedPermissions = [...permissions];

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value)
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value)
    }

    setPermissions(updatedPermissions)
  }

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      {PERMISSIONS.map((permissionToCheck) => {
        const hasPermission = permissions.includes(permissionToCheck);
        const fieldName = `${user.id}-permission-${permissionToCheck}`
        return (
          <td key={fieldName}>
            <label htmlFor={fieldName}>
              <input
                value={permissionToCheck}
                type="checkbox"
                name={fieldName}
                checked={hasPermission}
                onChange={handlePermissionChange}
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
