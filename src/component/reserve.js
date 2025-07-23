<ScrollView
  style={{
    paddingTop: 50,
    backgroundColor: "#ffffff",
    paddingBottom: 50,
    paddingHorizontal: 10,
    flex: 1,
  }}
>
  <Text style={[styles.title, isDark && { color: "#fff" }]}>
    Prayer Point Generator
  </Text>

  <TextInput
    placeholder="Search topic..."
    placeholderTextColor={isDark ? "#888" : "#666"}
    style={[
      styles.searchBar,
      isDark && { backgroundColor: "#f3f3f3", color: "#f3f3f3" },
    ]}
    value={searchQuery}
    onChangeText={setSearchQuery}
  />
  <View style={styles.categSubHeading}>
    <Text style={styles.categSubHeadingText}>Select Category</Text>
  </View>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.categoryList}
  >
    {categories.map(renderCategoryItem)}
  </ScrollView>
  <Text style={{ paddingLeft: 10, marginBottom: 10, fontWeight: 600 }}>
    Search By Topics
  </Text>
  <FlatList
    data={topics}
    keyExtractor={(item) => item._id}
    renderItem={renderTopicItem}
    contentContainerStyle={styles.topicList}
    numColumns={2} // TWO ITEMS PER ROW
    columnWrapperStyle={{ justifyContent: "space-between" }}
    showsVerticalScrollIndicator={false}
  />

  {/* MODAL for Selected Prayer */}
  <Modal visible={!!selectedTopic} animationType="slide" transparent>
    <View
      style={[styles.modalOverlay, isDark && { backgroundColor: "#000000cc" }]}
    >
      <View
        style={[styles.modalContent, isDark && { backgroundColor: "#222" }]}
      >
        <Text style={[styles.modalTitle, isDark && { color: "#fff" }]}>
          Selected Prayer
        </Text>
        <Text style={[styles.modalTopic, isDark && { color: "#ccc" }]}>
          {selectedTopic?.topic}
        </Text>
        <Text style={[styles.modalText, isDark && { color: "#ddd" }]}>
          Lord, I bring this topic before You. I ask for wisdom, grace, and
          power to walk in this area. Guide me and help me in all things
          concerning "{selectedTopic?.topic}". Amen.
        </Text>
        <TouchableOpacity
          style={[styles.closeButton, isDark && { backgroundColor: "#555" }]}
          onPress={() => setSelectedTopic(null)}
        >
          <Text style={styles.goButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
</ScrollView>;
