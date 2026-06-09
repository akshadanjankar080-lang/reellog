const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStart = `    try {
      const row = {
        title, type:modalData.type, year:modalData.year,
        poster:modalData.poster, tmdb_id:modalData.tmdb_id,
        user_id:session.user.id,
        user_name:session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
        updated_at: new Date().toISOString(),
        ...form,
        status: normalizeStatus(form.status)
      };`;

// Use index search for the whole block just to be sure we match exact
const startIndex = content.indexOf('const title = modalData.manual ? (modalData.manualTitle||"").trim() : modalData.title;');
if (startIndex === -1) throw new Error("Could not find start");

const tryIndex = content.indexOf('try {', startIndex);
const catchIndex = content.indexOf('} catch { showT("Something went wrong."); }', tryIndex);
if (tryIndex === -1 || catchIndex === -1) throw new Error("Could not find try/catch block");

const newBlock = `try {
      const row = {
        title: title || "Unknown Title",
        type: modalData.type || "Movie",
        year: modalData.year || null,
        poster: modalData.poster || null,
        tmdb_id: modalData.tmdb_id || null,
        user_id: session.user.id,
        user_name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
        rating: form.rating || 0,
        notes: form.notes || "",
        status: normalizeStatus(form.status) || "Want to Watch"
      };

      let targetEditId = editId;
      if (targetEditId === null && modalData.tmdb_id) {
        const existing = allEntries.find(e => e.tmdb_id === modalData.tmdb_id);
        if (existing) targetEditId = existing.id;
      }

      if (targetEditId !== null) {
        const { data, error } = await supabase.from("entries").update(row).eq("id", targetEditId).select();
        if (error) { console.error("Supabase Update Error:", error); throw error; }
        if (data && data.length > 0) {
          const updated = data[0];
          setAllEntries(p => p.map(e => e.id === targetEditId ? updated : e));
          setMyEntries(p  => p.map(e => e.id === targetEditId ? updated : e));
          showT("Updated!");
        }
      } else {
        const { data, error } = await supabase.from("entries").insert(row).select();
        if (error) { console.error("Supabase Insert Error:", error); throw error; }
        if (data && data.length > 0) {
          const newRow = data[0];
          setAllEntries(p => [newRow, ...p]);
          setMyEntries(p  => [newRow, ...p]);
          showT("Added to catalog!");
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error("handleSave failed:", err);
      showT("Something went wrong.");
    }`;

content = content.slice(0, tryIndex) + newBlock + content.slice(catchIndex + '} catch { showT("Something went wrong."); }'.length);
fs.writeFileSync('src/App.jsx', content);
console.log('App.jsx fixed successfully.');
