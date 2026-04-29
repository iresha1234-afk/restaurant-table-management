import { useEffect, useState } from "react";
import { View, Text, FlatList, Button, TextInput, Alert } from "react-native";
import axios from "axios";

// ✅ Define Table type
type Table = {
  _id: string;
  tableNumber: string;
  capacity: number;
  status: string;
};

export default function HomeScreen() {
  const [tables, setTables] = useState<Table[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  // 🔥 CHANGE THIS to your PC IP
  const API_URL = "http://192.168.145.73:5000/api/tables";

  // ✅ Fetch tables from backend
  const getTables = async () => {
    try {
      const res = await axios.get(API_URL);
      setTables(res.data);
    } catch (err) {
      console.log("Error fetching tables:", err);
    }
  };

  // ✅ Run when app loads
  useEffect(() => {
    getTables();
  }, []);

  const addTable = async () => {
    const trimmedTableNumber = tableNumber.trim();
    const parsedCapacity = Number(capacity);

    if (!trimmedTableNumber) {
      Alert.alert("Missing table number", "Please enter a table number.");
      return;
    }

    if (!capacity.trim() || !Number.isInteger(parsedCapacity) || parsedCapacity < 1) {
      Alert.alert("Invalid capacity", "Please enter a capacity of 1 or more.");
      return;
    }

    try {
      await axios.post(API_URL, {
        tableNumber: trimmedTableNumber,
        capacity: parsedCapacity,
        status: "Available",
      });

      setTableNumber("");
      setCapacity("");
      getTables();
    } catch (err) {
      console.log("Error adding table:", err);
      Alert.alert("Add table failed", "The table could not be added.");
    }
  };

  const deleteTable = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      getTables(); // refresh list
    } catch (err) {
      console.log("Error deleting table:", err);
    }
  };

  const updateTable = async (id: string) => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        status: "Occupied", // change status
      });

      getTables(); // refresh
    } catch (err) {
      console.log("Error updating table:", err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Tables
      </Text>

      <Button title="Refresh" onPress={getTables} />

      <TextInput
        placeholder="Table Number"
        value={tableNumber}
        onChangeText={setTableNumber}
        style={{
          borderWidth: 1,
          borderColor: "#666",
          backgroundColor: "#fff",
          color: "#000",
          marginTop: 10,
          padding: 8,
          borderRadius: 5,
        }}
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Capacity"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#666",
          backgroundColor: "#fff",
          color: "#000",
          marginTop: 10,
          padding: 8,
          borderRadius: 5,
        }}
        placeholderTextColor="#666"
      />

      <Button title="Add Table" onPress={addTable} />

      <FlatList
        data={tables}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: "#eee",
              borderRadius: 8,
            }}
          >
            <Text>Table: {item.tableNumber}</Text>
            <Text>Capacity: {item.capacity}</Text>
            <Text>Status: {item.status}</Text>
   
            <Button
                title="Mark Occupied"
                onPress={() => updateTable(item._id)}
            />
            
            <Button
              title="Delete"
              onPress={() => deleteTable(item._id)}
            />
          </View>
        )}
      />
    </View>
  );
}
