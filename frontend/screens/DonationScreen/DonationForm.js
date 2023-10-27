import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import axiosInstance from "../../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

function DonationForm() {
  const navigation = useNavigation();

  const goback = () => {
    navigation.navigate("DonationGuidelines");
  };

  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [donationItemCategory, setDonationItemCategory] =
    useState("Stationary-Items");
  const [donatingItem, setDonatingItem] = useState("");

  const [userId, setUserId] = useState("null");
  const [userRole, setuserRole] = useState("null");
  const [userName, setuserName] = useState("null");
  const [preferedCategory, setpreferedCategory] = useState("null");
  const [popupOpen, setPopupOpen] = useState(false);

  const getUserPreferences = async () => {
    try {
      await AsyncStorage.getItem("user", async (err, savedUser) => {
        if (!err) {
          const currentUser = JSON.parse(savedUser);
          if (currentUser.role === "user") {
            setUserId(currentUser.id);
            setuserRole(currentUser.role);
            setuserName(currentUser.username);
            setpreferedCategory(currentUser.category);
          }
        } else {
          // Handle AsyncStorage error
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserPreferences();
  }, []);

  const openConfirmation = () => {
    if (donorName === "" || donorName === " ") {
      return Toast.show({
        type: "error",
        text1: "Donor name required!",
        text2: "Donor name can not be an empty field."
      });
    }

    if (donorPhone.length !== 10) {
      return Toast.show({
        type: "error",
        text1: "Phone number required!",
        text2: "Donor phone number should contain 10 digits"
      });
    }

    if (donorAddress === "" || donorAddress === " ") {
      return Toast.show({
        type: "error",
        text1: "Donor address required!",
        text2: "Donor address can not be an empty field."
      });
    }

    if (donatingItem === "" || donatingItem === " ") {
      return Toast.show({
        type: "error",
        text1: "Donating item list required!",
        text2: "Brief description of items required!"
      });
    }
    setPopupOpen(true);
  };

  const handleDonationForm = async () => {
    if (
      (donorName && donorPhone && donorAddress,
      donationItemCategory,
      donatingItem)
    ) {
      try {
        console.log({
          donorId: userId,
          donorName,
          donorPhone,
          donorAddress,
          donationItemCategory,
          donatingItem
        });
        const donationSubmitResponse = await axiosInstance.post(
          "/donations/create-donation",
          {
            donorId: userId,
            donorName,
            donorPhone,
            donorAddress,
            donationItemCategory,
            donatingItem
          }
        );
        if (donationSubmitResponse) {
          console.log(donationSubmitResponse.data);
          setPopupOpen(false);
          Toast.show({
            type: "success",
            text1: "Donation Interest Sent!",
            text2: "Your interest sent notified to the management!"
          });
          navigation.navigate("ThankYouScreen");
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Interest can not be sent!",
          text2: "Something went wrong! Please try again!"
        });
        setPopupOpen(false);
        console.log("Error:", error);
      }
    } else {
      setPopupOpen(false);
      return Alert.alert(
        "Incomplete Fields",
        "You should fill all the fields before click on submit!"
      );
    }
  };

  return (
    <View style={styles.donationFormContainer}>
      {/* screen heading container */}
      <View style={styles.screenHeadingContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={goback}>
          <Image
            source={require("../../assets/icons/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.screenHeading}>Donate Books</Text>
      </View>

      {/* form headline */}
      <Text
        style={{
          width: "100%",
          color: "#FA7A50",
          textAlign: "left",
          fontSize: 22,
          fontWeight: "500",
          paddingLeft: 10,
          margin: 10
        }}
      >
        Donation Interest Form
      </Text>

      {/* getting donors name */}
      <Text style={styles.donationFormLabel}>Donor's Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your full name"
        value={donorName}
        onChangeText={(text) => setDonorName(text)}
      />

      {/* getting donors phone */}
      <Text style={styles.donationFormLabel}>Donor's Phone</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your phone number"
        value={donorPhone}
        onChangeText={(text) => setDonorPhone(text)}
      />

      {/* getting donor's address */}
      <Text style={styles.donationFormLabel}>Donor's Address</Text>
      <TextInput
        style={styles.textArea}
        multiline={true}
        numberOfLines={4} // You can adjust the number of lines as needed
        placeholder="Enter your address"
        value={donorAddress}
        onChangeText={(text) => setDonorAddress(text)}
      />

      {/* getting donation item category */}
      <Text style={styles.donationFormLabel}>Donating Items Category</Text>
      <View style={styles.textInputPicker}>
        <Picker
          style={{ width: "100%", color: "grey" }}
          selectedValue={donationItemCategory}
          onValueChange={(itemValue) => setDonationItemCategory(itemValue)}
        >
          <Picker.Item label="Stationary-Items" value="Stationary-Items" />
          <Picker.Item label="Educational Books" value="Educational-Books" />
        </Picker>
      </View>

      {/* getting donation items */}
      <Text style={styles.donationFormLabel}>Donating Items List</Text>
      <TextInput
        style={styles.textArea}
        multiline={true}
        value={donatingItem}
        onChangeText={(text) => setDonatingItem(text)}
        numberOfLines={4} // You can adjust the number of lines as needed
        placeholder="Enter your items list here"
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => openConfirmation()}
      >
        <Text style={styles.btnText}>Submit Form</Text>
      </TouchableOpacity>

      {popupOpen && (
        <View style={styles.popupContainer}>
          <View style={styles.popupMessageContainer}>
            <Text style={styles.popupTitle}>Confirmation</Text>
            <Text style={styles.popupMessage}>
              You are about to submit the donation interest form. Please review
              your details one last time to ensure accuracy. Are you sure you
              want to proceed?
            </Text>
            <View style={styles.popupBtnContainer}>
              {/* close popup */}
              <TouchableOpacity
                onPress={() => setPopupOpen(false)}
                style={styles.popupCancel}
              >
                <Text style={styles.btnTextv2}>Cancel</Text>
              </TouchableOpacity>
              {/* submit the form */}
              <TouchableOpacity
                onPress={() => handleDonationForm()}
                style={styles.popupSubmit}
              >
                <Text style={styles.btnTextv2}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.6)"
  },

  popupMessageContainer: {
    width: 360,
    height: 200,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "white"
  },

  popupBtnContainer: {
    width: "100%",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  popupTitle: {
    color: "#192A56",
    fontSize: 20,
    fontWeight: "600"
  },

  popupMessage: {
    marginTop: 6,
    width: "97%",
    fontSize: 15,
    textAlign: "justify",
    color: "rgba(0,0,0,0.6)"
  },

  popupCancel: {
    width: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingBottom: 4,
    backgroundColor: "#192A56",
    borderRadius: 5,
    marginRight: 10
  },

  popupSubmit: {
    width: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingBottom: 4,
    backgroundColor: "#FA7A50",
    borderRadius: 5,
    marginLeft: 10
  },

  donationFormContainer: {
    width: "100%",
    height: "100%",
    paddingTop: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white"
  },

  screenHeadingContainer: {
    width: "100%",
    padding: "10",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },

  donationFormLabel: {
    width: "100%",
    textAlign: "left",
    fontSize: 15,
    marginBottom: 7,
    paddingLeft: 10,
    fontSize: 16,
    color: "#192A56"
  },

  textInput: {
    width: "95%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    borderRadius: 8
  },

  textInputPicker: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    borderRadius: 8
  },

  dropDownStyle: {
    width: "95%",
    height: 50,
    borderColor: "gray",
    borderWidth: 4,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    borderRadius: 8
  },

  textArea: {
    width: "95%",
    height: 120,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    borderRadius: 8
  },

  backBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    padding: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  backIcon: {
    width: 32,
    height: 32
  },

  screenHeading: {
    marginLeft: 63,
    fontSize: 24,
    fontWeight: "600",
    color: "#192A56"
  },

  guidePharasePrompt: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: "500",
    width: "100%",
    color: "#192A56"
  },

  guidePhrase: {
    marginTop: 2,
    fontSize: 16,
    width: "100%",
    textAlign: "justify",
    color: "rgba(0,0,0,0.7)"
  },

  submitBtn: {
    marginTop: 10,
    width: 200,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingBottom: 4,
    backgroundColor: "#FA7A50",
    borderRadius: 5
  },

  btnText: {
    fontSize: 20,
    color: "white",
    fontWeight: "500"
  },

  btnTextv2: {
    fontSize: 18,
    color: "white"
  }
});

export default DonationForm;
