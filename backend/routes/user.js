const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

// POST /api/user/sync
// Called right after a Supabase login. Ensures a matching row exists
// in our own User table, using the Supabase auth UUID as the id.
router.post("/sync", async (req, res) => {
  try {
    const { id, email, name } = req.body;
    if (!id || !email) {
      return res.status(400).json({ error: "id and email are required" });
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: { email, name: name || email.split("@")[0] },
      create: { id, email, name: name || email.split("@")[0] },
    });

    return res.json(user);
  } catch (err) {
    console.error("User sync failed:", err);
    return res.status(500).json({ error: "User sync failed" });
  }
});

module.exports = router;