import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Container,
  Grid,
} from "@mui/material";

export default function AccountPage() {
  const [permissions, setPermissions] = React.useState([]);
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));

  React.useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!user) {
      window.location.href = "/login";
      return;
    }

    // Fetch permissions from the API
    fetch(`https://api3.jailbreakchangelogs.xyz/permissions/get?token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        try {
          // Replace single quotes with double quotes and False with false
          const correctedPermissionsJson = data.permissions
            .replace(/'/g, '"')
            .replace(/False/g, "false")
            .replace(/True/g, "true");
          const parsedPermissions = JSON.parse(correctedPermissionsJson);

          // Filter permissions to include only those that are true
          const availablePermissions = Object.keys(parsedPermissions).filter(
            (permission) => parsedPermissions[permission]
          );
          setPermissions(availablePermissions);
        } catch (error) {
          console.error("Error parsing permissions:", error);
        }
      })
      .catch((error) => console.error("Error fetching permissions:", error));
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=4096`;

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
  };

  const refreshPermissions = () => {
    fetch(`https://api3.jailbreakchangelogs.xyz/permissions/get?token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        try {
          const correctedPermissionsJson = data.permissions
            .replace(/'/g, '"')
            .replace(/False/g, "false")
            .replace(/True/g, "true");
          const parsedPermissions = JSON.parse(correctedPermissionsJson);
          const availablePermissions = Object.keys(parsedPermissions).filter(
            (permission) => parsedPermissions[permission]
          );
          sessionStorage.setItem(
            "permissions",
            JSON.stringify(availablePermissions)
          );
          setPermissions(availablePermissions);
        } catch (error) {
          console.error("Error parsing permissions:", error);
        }
      })
      .catch((error) => console.error("Error fetching permissions:", error));
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        mt={4}
      >
        <Avatar
          alt={user.username}
          src={avatar}
          sx={{ width: 200, height: 200, marginBottom: 2 }}
        />
        <Typography variant="h5" gutterBottom>
          {user.username}
        </Typography>
        <Box
          p={2}
          my={2}
          border={1}
          borderColor="grey.500"
          borderRadius={8}
          width="100%"
        >
          <Typography variant="h6" gutterBottom>
            Available Permissions
          </Typography>
          {permissions.length === 1 ? (
            <Box display="flex" justifyContent="center">
              <Typography variant="body1">{permissions[0]}</Typography>
            </Box>
          ) : (
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              {permissions.map((permission, index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="body1" textAlign="center">
                    {permission}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={refreshPermissions}
          >
            Refresh Permissions
          </Button>
          <Button variant="outlined" color="primary" onClick={handleLogout}>
            Log Out
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
