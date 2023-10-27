import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function RegistrationSuccess() {
  const navigation = useNavigation();
  const navigateToLogin = () => {
    navigation.navigate("LoginForm");
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.screenHeading}>Registration Successful!</Text>

      <Image
        source={require("../../assets/placeholders/account-created.png")}
        style={styles.placeholderImage}
      />

      <Text style={styles.phrase}>
        Welcome to Book Pals! Thank you for joining our community of book
        enthusiasts. You can now log in using the email and password you
        provided during registration. Start exploring, discovering, and sharing
        the world of books with Book Pals."
      </Text>
      <TouchableOpacity style={styles.navigateBtn} onPress={navigateToLogin}>
        <Text style={styles.navBtnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white"
  },

  navigateBtn: {
    marginTop: 20,
    width: 140,
    height: 45,
    backgroundColor: "#FA7A50",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },

  navBtnText: {
    fontSize: 18,
    color: "white",
    fontWeight: "500"
  },

  screenHeading: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
    color: "#192A56"
  },

  placeholderImage: {
    width: "80%",
    height: 400,
    marginTop: 10
  },

  phrase: {
    width: "90%",
    fontSize: 16,
    color: "rgba(0,0,0,.4)",
    textAlign: "justify"
  }
});

export default RegistrationSuccess;
