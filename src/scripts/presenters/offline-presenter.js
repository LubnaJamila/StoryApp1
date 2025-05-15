import { getAllStories, deleteStory } from "../data/db.js"; // pastikan path benar
import OfflineView from "../views/offline-view.js";

class OfflinePresenter {
  constructor() {
    this.view = new OfflineView();

    this.view.setOnDeleteClickListener(this.handleDeleteStory.bind(this)); // 🆕 Tambahkan ini
  }

  async init() {
    this.view.init();
    this.view.showLoading();

    try {
      const stories = await getAllStories();
      console.log("Cerita offline dari IndexedDB:", stories);
      this.view.showStories(stories);
    } catch (error) {
      this.view.showError("Gagal memuat cerita offline");
      console.error(error);
    }
  }


  // 🆕 Tambahkan fungsi ini untuk hapus
  async handleDeleteStory(storyId) {
    const confirmDelete = confirm(
      "Apakah kamu yakin ingin menghapus cerita ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteStory(storyId);
      alert("Cerita berhasil dihapus.");

      // Muat ulang data
      const stories = await getAllStories();
      this.view.showStories(stories);
    } catch (error) {
      alert("Gagal menghapus cerita: " + error.message);
      console.error(error);
    }
  }
}

export default OfflinePresenter;
