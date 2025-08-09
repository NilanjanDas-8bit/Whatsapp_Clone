const fs = require("fs");
const path = require("path");
const Message = require("../models/Message");

async function processPayloads(payloadFolder = "payloads") {
  const files = fs.readdirSync(payloadFolder);

  for (const file of files) {
    const filePath = path.join(payloadFolder, file);
    const content = fs.readFileSync(filePath, "utf-8");

    let data;
    try {
      data = JSON.parse(content);
    } catch (err) {
      console.warn(`⚠️ Skipping ${file}: invalid JSON`);
      continue;
    }

    if (!data.metaData || !Array.isArray(data.metaData.entry)) {
      console.warn(`⚠️ Skipping ${file}: not an array`);
      continue;
    }

    try {
      const entries = data.metaData.entry;

      for (const entry of entries) {
        const changes = entry?.changes || [];

        for (const change of changes) {
          const value = change?.value;
          const contact = value?.contacts?.[0];
          const message = value?.messages?.[0];

          if (!message || !contact) continue;

          const wa_id = contact.wa_id;
          const name = contact.profile?.name || "User";
          const text = message.text?.body || "";
          const meta_msg_id = message.id;
          const timestamp = new Date(parseInt(message.timestamp) * 1000);

          const newMessage = await Message.create({
            wa_id,
            name,
            message: text,
            timestamp,
            status: "sent",
            meta_msg_id,
          });

          console.log(`✅ Inserted message for ${wa_id} - ${newMessage._id}`);

          // Simulate "delivered" after 1s
          setTimeout(() => {
            Message.findByIdAndUpdate(newMessage._id, { status: "delivered" })
              .then(() => {
                console.log(`📦 Message ${newMessage._id} marked as delivered`);

                // Simulate "read" after another 2s
                setTimeout(() => {
                  Message.findByIdAndUpdate(newMessage._id, { status: "read" })
                    .then(() => {
                      console.log(`📬 Message ${newMessage._id} marked as read`);
                    })
                    .catch((err) =>
                      console.error(`❌ Failed to mark as read: ${err.message}`)
                    );
                }, 2000);
              })
              .catch((err) =>
                console.error(`❌ Failed to mark as delivered: ${err.message}`)
              );
          }, 1000);
        }
      }
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message);
    }
  }

  console.log("✅ All payloads processed.");
}

module.exports = processPayloads;
