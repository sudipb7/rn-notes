import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";

export default function AddNoteModal({
  modalVisible,
  setModalVisible,
  newNote,
  setNewNote,
  addNote,
}) {
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-center items-center">
        <View className="bg-white p-5 rounded-lg w-4/5">
          <Text className="text-xl font-bold mb-2.5 text-center">
            Add a New Note
          </Text>
          <TextInput
            className="border border-[#ccc] rounded-lg p-2.5 text-base mb-4"
            placeholder="Enter note..."
            placeholderTextColor="#aaa"
            value={newNote}
            onChangeText={setNewNote}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-[#ccc] p-2.5 rounded-md flex-1 mr-2.5 items-center"
            >
              <Text className="text-base text-[#333]">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#007bff] p-2.5 rounded-md flex-1 items-center"
              onPress={addNote}
            >
              <Text className="text-base text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
