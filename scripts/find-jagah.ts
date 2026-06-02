import ProjectModel from "../src/lib/models/Project";
import { connectToDatabase } from "../src/lib/mongodb";

(async () => {
  await connectToDatabase();
  const projects = await ProjectModel.find({
    title: { $regex: "jagah", $options: "i" },
  });
  console.log(JSON.stringify(projects, null, 2));
  process.exit();
})();
