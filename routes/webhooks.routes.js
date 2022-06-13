const express = require("express");
const { WebhookController } = require("../controllers");

const { createWebhook, updateWebhook, removeWebhook, findWebhooks, findWebhook } = WebhookController;

const router = express.Router();

router.route("/webhooks/wb/:city_id").post(createWebhook).get(findWebhooks);
router.route("/webhooks/in/:webhook_id").patch(updateWebhook).delete(removeWebhook).get(findWebhook);

module.exports = router;