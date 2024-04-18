import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Text, useToast, Container, Heading } from "@chakra-ui/react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Check local storage for token to maintain session on refresh
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          description: "You've been logged in.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        throw new Error(data.message[0].messages[0].message);
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast({
      title: "Logout Successful",
      description: "You've been logged out.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Container centerContent>
      <VStack spacing={4} marginY={10}>
        <Heading>Welcome to Our App</Heading>
        {!isLoggedIn ? (
          <>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button leftIcon={<FaSignInAlt />} colorScheme="teal" onClick={handleLogin}>
              Login
            </Button>
          </>
        ) : (
          <Box>
            <Text mb={4}>You are logged in!</Text>
            <Button leftIcon={<FaSignOutAlt />} colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
