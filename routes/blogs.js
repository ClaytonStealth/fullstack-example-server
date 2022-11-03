var express = require("express");
const { uuid } = require("uuidv4");
var router = express.Router();

const { db } = require("../mongo");

const sampleBlogs = [
  {
    createdAt: "2022-06-30T04:03:07.069Z",
    author: "Marion Roberts DDS",
    text: "Vitae quaerat nostrum dolor. Eius non totam autem unde ea consequatur quia. Laborum exercitationem sed.\nQui quam corrupti voluptatem autem. Voluptatum in et voluptas quisquam id doloremque nostrum unde. Consequuntur ea qui.\nSed consequuntur voluptas nemo ea laborum neque distinctio quo iusto. Temporibus aut quisquam. Laboriosam fugit eum sint corporis sequi minus iste molestiae quos. Quae aut earum quasi facilis hic et.",
    title: "sapiente",
    id: "1",
  },
  {
    createdAt: "2022-06-30T04:16:20.950Z",
    author: "Dr. Martha Herman",
    text: "Et consequatur earum et in quam. Tenetur ipsam dolores. Eius aperiam est.\nRerum laborum ut. Accusantium amet qui impedit laudantium. Aut et minus perspiciatis voluptates. Mollitia modi maiores non. Qui animi assumenda distinctio repellendus reiciendis tenetur esse quia magnam. Quo natus minus sed.\nEa quod nulla hic est et libero enim et. Occaecati voluptas ut minus impedit aperiam. Dolore atque cumque ut accusamus enim. Dicta qui minima et doloremque quam veniam voluptatibus. Nihil repellat et. Laboriosam quia voluptatem.",
    title: "nemo",
    id: "2",
  },
  {
    createdAt: "2022-06-30T09:57:45.633Z",
    author: "Francis McDermott",
    text: "Consequatur nostrum adipisci doloribus commodi. Dolore enim minus. Assumenda sint molestiae. Voluptatem repellat ad. Quasi incidunt accusantium ipsum voluptate aut modi.\nSed id labore recusandae commodi. Ullam neque ab. At similique veritatis. Voluptas similique deserunt nihil praesentium qui. Dolore velit ea doloremque quae quo modi.\nOccaecati id nobis architecto ut beatae et. Consequuntur aut eveniet cum optio. Non dolores asperiores optio consequatur sequi.",
    title: "omnis",
    id: "3",
  },
  {
    createdAt: "2022-06-30T01:29:57.446Z",
    author: "Miss Rickey Schmidt",
    text: "In corrupti adipisci. Qui eaque voluptatem at. Libero et omnis ullam. Soluta quas provident iste autem quae saepe et dolor.\nDolores quos voluptate quibusdam qui harum inventore. Quae pariatur reprehenderit dignissimos non qui itaque veniam quod magni. Deserunt veritatis qui natus eligendi. Aut adipisci eum voluptatem libero similique. Aut delectus nam. Ullam dolor nostrum consectetur aut sit illum magni.\nCum nemo harum earum sed. Nobis et in cumque placeat. Odio alias sint ab. Ratione amet fuga vitae aut dolorum.",
    title: "expedita",
    id: "4",
  },
  {
    createdAt: "2022-06-29T19:17:08.325Z",
    author: "Marcella Jacobson",
    text: "Voluptatibus laboriosam culpa ut aut ea ipsum alias itaque. Placeat qui et. Quam ipsa non unde fugiat cupiditate dignissimos.\nUt ut rerum veniam sit deserunt. Molestiae ut quis molestiae quis autem aliquid. Non beatae sequi minus voluptatem enim accusantium quia dolorem.\nDolorum vel aperiam est pariatur id. Sunt et nam. Sit eligendi dolorem ullam dicta quo ipsa omnis. Assumenda accusantium tempora qui temporibus cum rerum error necessitatibus. Nisi consectetur fuga qui nisi eaque maxime quia pariatur.",
    title: "similique",
    id: "5",
  },
];

/* GET blogs listing. */
router.get("/all", async (req, res, next) => {
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);
  const skip = (page - 1) * limit;
  console.log("req query", req.query);
  try {
    const blogs = await db()
      .collection("posts")
      .find({})
      .limit(limit)
      .skip(skip)
      .toArray();

    res.json({
      success: true,
      blogs,
    });
  } catch (err) {
    //In the catch block, we always want to do 2 things: console.log the error and respond with an error object
    console.log(err);
    res.json({
      success: false,
      error: err.toString(),
    });
  }
});

router.get("/get-one/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const blog = await db().collection("posts").findOne({ id: idParam });
    res.json({
      success: true,
      blog,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err.toString(),
    });
  }
});

router.post("/create-one", async (req, res) => {
  try {
    // const newBlog = req.body;
    const newBlog = {
      ...req.body,
      createdAt: new Date(),
      lastModified: new Date(),
      id: uuid(),
    };
    const result = await db().collection("posts").insertOne(newBlog);
    res.json({
      success: true,
      result,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err.toString(),
    });
  }
});

router.put("/update-one/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const newBlog = req.body;
    const result = await db()
      .collection("posts")
      .updateOne({ id: idParam }, { $set: newBlog });
    res.json({
      success: true,
      result,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err.toString(),
    });
  }
});

router.delete("/delete-one/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const result = await db().collection("posts").deleteOne({ id: idParam });
    res.json({
      success: true,
      result,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err.toString(),
    });
  }
});

module.exports = router;
