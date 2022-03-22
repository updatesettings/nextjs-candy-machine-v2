const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: `${req.method} requests are not allowed` });
  }
  try {
    const { walletAddress, discord } = JSON.parse(req.body);
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
          property: "WalletAddress",
          text: {
            contains: walletAddress,
          },
        },
      });
      if (response.results.length === 0) {
        await notion.pages.create({
          parent: {
            database_id: process.env.NOTION_DATABASE_ID,
          },
          properties: {
            WalletAddress: {
              title: [
                {
                  text: {
                    content: walletAddress,
                  },
                },
              ],
            },
            Discord: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: discord,
                  },
                },
              ],
            },
          },
        });
        res.status(201).json({ msg: "Success" });
      } else {
        res
          .status(409)
          .json({ msg: "Conflict: Item most likely exists already." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "There was an error" });
    }
  } catch (error) {
    res.status(500).json({ msg: "There was an error" });
  }
}
